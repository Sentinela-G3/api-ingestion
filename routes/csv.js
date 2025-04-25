var express = require("express");
var router = express.Router();
var csvController = require("../controllers/csvController");

router.get("/export", function (req, res) {
    csvController.exportCsv(req, res)
});




module.exports = router;