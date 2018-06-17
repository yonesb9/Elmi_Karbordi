var express = require('express');
var router = express.Router();
var user = require('../model/user');



router.get('/', function(req, res) {
    res.send('dashboard');
});

router.get('/login', function(req, res) {
    res.render('login.pug', {
        title: "Login Page"
    });
});

router.post('/login', function(req, res) {
    res.render('chat.pug', {
        title: "chat Page"
    });
});

router.post('/login', function(req, res) {
    var newmessage = new UserMessage({
        message: req.body.message
    });

    newmessage.save(function(err) {
        if (err) throw err;
    })
});

router.post('/register', function(req, res) {
    var newuser = new user({
        name: req.body.name,
        email: req.body.Email,
        password: user.generateHash('password')
    });

    newuser.save(function(err) {
        if (err) throw err;


        res.redirect('/chat/login')
    })
});

router.get('/register', function(req, res) {
    res.render('register.pug', {
        title: 'Register Page'
    });
});

// router.post('/register', function(req, res) {
//     var name = req.body.name;
//     var email = req.body.Email;
//     var password = req.body.password;
//     var password_confirmation = req.body.password_confirmation;
//     req.checkBody('name', 'The Name field is required').notEmpty();
//     req.checkBody('Email', 'The Email field is required').notEmpty();
//     req.checkBody('Email', 'The Email must be valid email adress').isEmail();
//     req.checkBody('password', 'The Password field is required').notEmpty();
//     req.checkBody('password_confirmation', 'The password confirmation field is required').notEmpty();
//     req.checkBody('password_confirmation', 'The password confirmation field is required').equals(password);

//     var errors = ValidationErrors(req);
//     if (errors) {
//         res.render('register.pug', {
//             title: 'register page',
//             errors: 'errors'
//         });
//         return res.status(422).json({ errors: errors.mapped() });
//         res.status(422).json({ errors: errors.mapped() });
//     }
// });

module.exports = router;