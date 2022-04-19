var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var bodyParser = require("body-parser");

var index = require("./routes/index");
var users = require("./routes/users");
var qiniu = require("./routes/qiniu");
var myupload = require("./routes/upload");

var app = express();
var fs = require("fs");
var mutipart = require("connect-multiparty");
var mutipartMiddeware = mutipart();
app.use(mutipart({ uploadDir: "./public/uploads" }));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "test",
    cookie: {
      maxAge: 1000 * 60 * 30,
    },
  })
);

app.use(express.static(path.join(__dirname, "public")));

app.use("/", index);
app.use("/users", users);
app.use("/qiniu", qiniu);
app.use("/myupload", myupload);

//这里就是接受form表单请求的接口路径，请求方式为post。
app.post("/upload", mutipartMiddeware, function (req, res) {
  //这里打印可以看到接收到文件的信息。
  console.log(req.files);
  /*//do something
   * 成功接受到浏览器传来的文件。我们可以在这里写对文件的一系列操作。例如重命名，修改文件储存路径 。等等。
   *
   *
   * */
  //给浏览器返回一个成功提示。
  res.send("upload success!");
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
