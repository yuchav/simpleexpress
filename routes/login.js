var express = require('express'),
    router = express.Router(),
    //载入user(与数据库连接)
    User = require('../models/user.js'),
    crypto = require('crypto'),
    TITLE_LOGIN = '登录';

//进入到router.login
router.get('/', function(req, res) {
    //请求本目录时,如果登录时cookie是已登录(记住我)
    if (req.cookies.islogin) {
        console.log('cookies:' + req.cookies.islogin);
        //哪怕没有sid,session可以存username
        req.session.username = req.cookies.islogin;
    }

    //如果在服务器本地找到session.username,(晚会名单上有username)
    if (req.session.username) {
        console.log('session:' + req.session.username);
        res.locals.username = req.session.username;
    } else {
        //用户未登录,此处要注掉,否则无线循环
        //res.redirect('/login');
        //return;
    }

    res.render('login', {
        title: TITLE_LOGIN
    });
});

router.post('/', function(req, res) {

    var userName = req.body['txtUserName'],
        userPwd = req.body['txtUserPwd'],
        isRem = req.body['chbRem'],
        md5 = crypto.createHash('md5');

    //查询数据库的表
    User.getUserByUserName(userName, function(err, results) {
        //如果没有此用户
        if (results == '') {
            //注入全局变量
            res.locals.error = '用户不存在';
            //渲染
            res.render('login', {
                title: TITLE_LOGIN
            });
            //停止继续执行并返回
            return;
        }

        //如果有此用户
        //把获取密码摘要
        userPwd = md5.update(userPwd).digest('hex');

        //用户名密码不匹配
        if (results[0].UserName != userName || results[0].UserPass != userPwd) {
            //注入全局变量
            res.locals.error = '用户名或密码有误';
            //驱动登录
            res.render('login', {
                title: TITLE_LOGIN
            });
            return;
        } else {
            //有用户名且用户名和密码匹配
            if (isRem) {
                //如果勾选记住,responsive设置cookie : islogin = userName
                res.cookie('islogin', userName, {
                    maxAge: 60000
                });
            }
            //注入username
            res.locals.username = userName;
            //把用户名写入服务器本地session.username中(将客户端cookie和本地session做好绑定,以后每次带这个cookie过来的客户端都会被认为具有登录凭证) connect.sid=s%3AHZoPRBv9OHU1hNpIHx0PJPfwAW78niQP.520NS%2BNOgA1sZfDsxonVZ%2BVLRFYpBI%2FbHv01IgHUJ8A
            req.session.username = res.locals.username;
            console.log(req.session.username);
            //导至首页
            res.redirect('/');
            return;
        }
    });
});

module.exports = router;
