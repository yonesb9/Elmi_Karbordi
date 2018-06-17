var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs')

var UserSchema = mongoose.Schema({
    name: String,
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    created_at: Date,
    update_at: Date
});

UserSchema.pre('save', function(next) {
    var currentDate = new Date();

    this.update_at = currentDate;

    if (!this.created_at)
        this.created_at = currentDate;
    next();

});



var User = mongoose.model('User', UserSchema);

var UserMessage = mongoose.Schema({
    message: String,
    created_at: Date,
    update_at: Date
});

UserMessage.pre('save', function(next) {
    var currentDate = new Date();

    this.update_at = currentDate;

    if (!this.created_at)
        this.created_at = currentDate;
    next();
});

// var UserMessage = mongoose.model('UserMessage', UserMessage);

// User.findOne({ email: 'Email' }, function(err, user) {
//     if (err) throw err;

//     if (!user) {
//         req.redirect('/dashboard/login');
//         return;
//     };

//     if (user.validPassword('password', user.password)) {
//         req.redirect('/dashboard');
//         return;
//     };

//     res.redirect('/dashboard/login');
// });


module.exports = User;

module.exports.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8, null));
}

module.exports.validPassword = function(password, hash) {
    return bcrypt.compareSync(password, hash);
}