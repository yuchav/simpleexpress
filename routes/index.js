//目的只是为了取得express Router
var express = require('express'),
    router = express.Router();
    TITLE_INDEX = '首页';

//收到客户端get方法请求该目录时
router.get('/', function(req, res) {
    //如果客户端发送的cookie标记是 islogin = [username] (表明该用户成功登录时勾选了'记住我');
    if (req.cookies.islogin) {

        console.log('cookies:' + req.cookies.islogin);
        //哪怕没有sid证明该用户,也可以表明该用户的登录状态,遂将cookie中islogin对应username,取出,并保存在服务端本地的session里(晚会保安拿出小本,把免检名字记录下来)
        req.session.username = req.cookies.islogin;
    }

    //在服务器本地找到session.username,被记住的用户名或者登录后未过期的session(晚会名单上有username)
    if (req.session.username) {
        console.log('session:' + req.session.username);
        //locals到底是全局变量,还是只针对res的render和redirect导入的变量,我怀疑是后者,待验证.后备注:locals就是render传入的对象{},实际传入时locals的参数可以被覆盖
        res.locals.username = req.session.username;
    } else {
        //如果没有登录或者登录过期,重定向至/login页
        res.redirect('/login');
        //返回执行
        return;
    }

    //如果已登录或者被记住
    //渲染view:index,并且注入全局对象
    res.render('index', {
        title: TITLE_INDEX
    });
});

//导出router对象
module.exports = router;
