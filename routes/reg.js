var express = require('express'),
    router = express.Router(),

    //注册用户需要连接数据库
    User = require('../models/user.js'),
    //md5加密库
    crypto = require('crypto'),

    TITLE_REG = '注册';

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
        //res.redirect('/login');
        //return;
    }

    //request请求此目录,传入title
    res.render('reg', {
        title: TITLE_REG
    });
});

router.post('/', function(req, res) {
    var userName = req.body['txtUserName'],
        userPwd = req.body['txtUserPwd'],
        userRePwd = req.body['txtUserRePwd'],

        md5 = crypto.createHash('md5');
    //将密码加密获取摘要
    userPwd = md5.update(userPwd).digest('hex');

    //创建User实例,传入用户名和密码,注意,这个实例初始化并不会直接操作数据库,只是简单初始化了而已
    var newUser = new User({
        username: userName,
        userpass: userPwd
    });

    //连结数据库后,利用实例来执行一些数据库操作
    User.getUserNumByName(newUser.username, function(err, results) {

        //检查用户名是否已经存在
        if (results != null && results[0]['num'] > 0) {
            err = '用户名已存在';
        }

        //获取过程出错
        if (err) {
            res.locals.error = err;
            //驱动view,导入error
            res.render('reg', {
                title: TITLE_REG
            });
            return;
        }

        //没错开始数据库操作,记得随时return
        newUser.save(function(err, result) {
            //报错,返回
            if (err) {
                res.locals.error = err;
                res.render('reg', {
                    title: TITLE_REG
                });
                return;
            }

            if (result.insertId > 0) {
                //注意success的执行,是<%- 而不是 <%=
                res.locals.success = '注册成功,点这里 <a href="/login"> 登录 </a>';
            } else {
                res.locals.error = err;
            }

            res.render('reg', {
                title: TITLE_REG
            });
        });
    });

});

module.exports = router;
