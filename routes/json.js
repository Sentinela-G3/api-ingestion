var express = require("express");
var router = express.Router();
var jsonController = require("../controllers/jsonController.js");

router.get("/export", function (req, res) {
    jsonController.exportJSON(req, res)
});




module.exports = router;