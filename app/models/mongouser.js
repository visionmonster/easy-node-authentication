// load the things we need
var mongoose = require('mongoose');
const configUrl = require('../../config/database').url;
var bcrypt   = require('bcrypt-nodejs');
// configuration ===============================================================
mongoose.connect(configUrl); // connect to our database



// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String,
        displayName  : String,
    },
    facebook         : {
        id           : String,
        token        : String,
        displayName  : String,
        email        : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        displayName  : String
    }

});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('user', userSchema);
