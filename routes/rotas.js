var express = require("express");
var router = express.Router();
var capturaController = require("../controllers/");

router.get("/", function (req, res) {
    res.render("index");
});

router.get("/obterDados", function (req, res) {
    capturaController.obterCaptura(req, res)
})


module.exports = router;