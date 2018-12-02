var express = require("express");
var http = require("http");

var indexRouter = requier("./routes/index");

var port = process.argv[2];

var app = express();

app.get("/play", indexRouter);

app.use(express.static(__dirname + "/public"));
http.createServer(app).listen(port);

app.get('/', function(req, res, next) {
  res.sendFile("splash.html", {root: "./public"});
});


