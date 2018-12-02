var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/play", function(req, res){
  res.sendFile("game.html", {root: "./plubic"})
})

module.exports = router;
