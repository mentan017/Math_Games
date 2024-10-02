const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    Username:{
        type: String
    },
    Email:{
        type: String
    },
    Password:{
        type: String
    },
    Activated:{
        type: Boolean
    },
    CreatedDate:{
        type: Date,
        default: Date.now()
    },
    expireAt:{
        type: Date,
        expires: 24*60*60,
        default: Date.now()
    }
});

module.exports = mongoose.model('User', UserSchema);