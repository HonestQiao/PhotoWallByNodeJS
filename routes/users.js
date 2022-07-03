var express = require('express');
var router = express.Router();
var usersHandler = require('../logic/usersHandler');
var photosHandler = require('../logic/photosHandler');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

/* GET login page. */
router.route("/login").get(function (req, res) {    // 到达此路径则渲染login文件，并传出title值供 login.html使用
    res.render("login", {title: 'User Login'});
}).post(function (req, res) {                        // 从此路径检测到post方式则进行post数据的处理操作
    var userName = req.body.userName;
    var password = req.body.password;
    // console.log("userName:"+userName);
    usersHandler.loginAUser([userName, password], function (error,loginStatus,user) {
        if (loginStatus === 0) {
            res.sendStatus(500);
            req.session.error = '网络异常错误！';
            console.log(error);
        }
        else if(loginStatus===1){
            req.session.error = '登录成功！';
            req.session.user = user;
            res.sendStatus(200);
        }
        else if(loginStatus===2){
            req.session.error = '用户名不存在！';
            res.sendStatus(404);
        }
        else{
            req.session.error = '密码错误！';
            res.sendStatus(404);
        }
    });

    //get User info
    //这里的User就是从model中获取user对象，通过global.dbHandel全局方法（这个方法在app.js中已经实现)
    // var User = global.dbHandel.getModel('user');
    // var uname = req.body.uname;                //获取post上来的 data数据中 uname的值
    // User.findOne({name: uname}, function (err, doc) {   //通过此model以用户名的条件 查询数据库中的匹配信息
    //     if (err) {                                         //错误就返回给原post处（login.html) 状态码为500的错误
    //         res.send(500);
    //         console.log(err);
    //     } else if (!doc) {                                 //查询不到用户名匹配信息，则用户名不存在
    //         req.session.error = '用户名不存在';
    //         res.send(404);                            //    状态码返回404
    //         //    res.redirect("/login");
    //     } else {
    //         if (req.body.upwd != doc.password) {     //查询到匹配用户名的信息，但相应的password属性不匹配
    //             req.session.error = "密码错误";
    //             res.send(404);
    //             //    res.redirect("/login");
    //         } else {                                     //信息匹配成功，则将此对象（匹配到的user) 赋给session.user  并返回成功
    //             req.session.user = doc;
    //             res.send(200);
    //             //    res.redirect("/home");
    //         }
    //     }
    // });
});

/* GET register page. */
router.route("/register").get(function (req, res) {    // 到达此路径则渲染register文件，并传出title值供 register.html使用
    res.render("register", {title: 'User register'});
}).post(function (req, res) {
    var userName = req.body.userName;
    var password = req.body.password;
    var is_load = false;
    usersHandler.addAUser([userName, password], function (error,addStatus) {
        if(is_load) {
            return;
        }
        is_load = true;
        photosHandler.addIntoAPhotoTable(userName, '', '');
        if (addStatus === 0) {
            res.sendStatus(500);
            req.session.error = '网络异常错误！';
            console.log(error);
        }
        else if(addStatus===1){
            req.session.error = '用户名创建成功！';
            res.sendStatus(200);
        }
        else{
            req.session.error = '用户名已存在！';
            res.sendStatus(500);
        }
    });
    // User.findOne({name: uname}, function (err, doc) {   // 同理 /login 路径的处理方式
    //     if (err) {
    //         res.send(500);
    //         req.session.error = '网络异常错误！';
    //         console.log(err);
    //     } else if (doc) {
    //         req.session.error = '用户名已存在！';
    //         res.send(500);
    //     } else {
    //         User.create({                             // 创建一组user对象置入model
    //             name: uname,
    //             password: upwd
    //         }, function (err, doc) {
    //             if (err) {
    //                 res.send(500);
    //                 console.log(err);
    //             } else {
    //                 req.session.error = '用户名创建成功！';
    //                 res.send(200);
    //             }
    //         });
    //     }
    // });
});

/* GET logout page. */
router.get("/logout", function (req, res) {    // 到达 /logout 路径则登出， session中user,error对象置空，并重定向到根路径
    req.session.user = null;
    req.session.error = null;
    res.redirect("/users/login");
});

module.exports = router;
