console.log("Testando 321")

async function fetchTickets() {
    try {
      const response = await fetch('http://localhost:3333/jira/tickets');
      
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.statusText}`);
      }
  
      const data = await response.json();
      
      // Verifique o formato dos dados retornados
      console.log('Resposta da API:', data.values[0]);
  
      // A resposta contém os tickets dentro de data.values
      if (data.values) {
        
        data.values.forEach(ticket => {
            if( ticket.requestTypeId == "68"){
                console.log(ticket)


                fetch("/jira/registrosAlertas", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                    .then(function (resposta) {
                        if (resposta.ok) {
                        console.log(resposta);
                
                        resposta.json().then(json => {
                            const dados = json.resultadoAutenticar[0];
                            console.log(dados);
                            



                        });
                    
                        } else if (resposta.status == 403) {
                        resposta.text().then(texto => {
                            console.error(texto);
                        });
                    
                    } else {
                        resposta.text().then(texto => {
                        console.error(texto);
                        });
                    }
                    })
                    .catch(function (erro) {
                        console.log(erro);
                    });
            }
            // const date = new Date(ticket.createdDate.jira);
    
            // const year = date.getFullYear();
            // const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses começam em 0
            // const day = String(date.getDate()).padStart(2, '0');
            // const hours = String(date.getHours()).padStart(2, '0');
            // const minutes = String(date.getMinutes()).padStart(2, '0');
            // const seconds = String(date.getSeconds()).padStart(2, '0');
    
            // const textHoraAbertura = `${day}/${month}/${year} às ${hours}:${minutes}`
    
            // const descricao = ticket.requestFieldValues?.find(f => f.fieldId === "description")?.value;
            // const maquina = ticket.summary.split(" ");
            // const descricaoSeparada = descricao.split('*');
    
            // const descricaoTratada = descricaoSeparada[3].charAt(0).toUpperCase() + descricaoSeparada[3].slice(1);
    
    
            
          });
      } else {
        console.error('A resposta não contém tickets ou não é um array');
      }
    } catch (error) {
      console.error('Erro ao buscar tickets:', error);
    }
  }


  

