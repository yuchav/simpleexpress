var express = require('express'),
    router = express.Router();

router.get('/', function(req, res) {
    //服务端本地删除session凭证
    req.session.destroy();
    //无需render view
    res.redirect('/login');
});

module.exports = router;
