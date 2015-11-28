//除了view和models,每个js文件都需要require
var express = require('express');

var path = require('path');
var favicon = require('serve-favicon');

//中间件,在控制台中显示request请求信息
var logger = require('morgan');

//cookie中间件
var cookieParser = require('cookie-parser');

//http parser中间件
var bodyParser = require('body-parser');

//session中间件
var session = require('express-session');

//!important,此处赋值变量不是index,这是个router实例
var index = require('./routes/index');
var reg = require('./routes/reg');
var login = require('./routes/login');
var logout = require('./routes/logout');


//express(),生成app实例
var app = express();

// view engine setup
//指定views目录
app.set('views', path.join(__dirname, 'views'));
//制定view默认模板引擎,此处为ejs
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//开启logger dev模式
app.use(logger('dev'));
//?
app.use(bodyParser.json());
//?
app.use(bodyParser.urlencoded({
    extended: false
}));
//引入
app.use(cookieParser());
//指定静态文件目录为public(静态目录中的文件和普通目录中的文件执行方式不同)
app.use(express.static(path.join(__dirname, 'public')));

//传入密钥,用于加密sessionid
app.use(cookieParser('Wilson'));

//?为毛大小写区分开,会不会死人啊
app.use(session({
    secret: 'wilson'
}));

//设置对应的url请求,所指定到的router
app.use('/', index);
app.use('/reg', reg);
app.use('/login', login);
app.use('/logout', logout);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    //Error应该是express内置的类
    var err = new Error('Not Found');
    err.status = 404;
    //next ?
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
//产品模式(一般指非development,例如已经上线模式下)
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//监听8000端口
app.listen(8000);

//输出对象
module.exports = app;
