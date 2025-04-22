function login() {
    fetch("/rotas/obterDados", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(function (resposta) {

      if (resposta.ok) {
        console.log(resposta);

        resposta.json().then(json => {
          const dados = json.resultadoAutenticar[0];
          gerarCsv(dados)
        });
      } else if (resposta.status == 403) {
        alert("Login ou senha inválidos, tente novamente.");
        resposta.text().then(texto => {
          console.error(texto);
        });
      } else {
        alert("Erro ao realizar o login.")
        resposta.text().then(texto => {
          console.error(texto);
        });
      }

    }).catch(function (erro) {
      console.log(erro);
    })
  }

function gerarCsv(data) {
    const headers = Object.keys(data[0]);
    const rows = data.map(row => headers.map(header => row[header]).join(';'));
    
    // Adicionando o cabeçalho
    return [headers.join(';'), ...rows].join('\n');
  }
  
  // Gerar o CSV
  const csv = gerarCsv(data);
  
  // Baixar o CSV
  function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  downloadCSV(csv, 'dados.csv');