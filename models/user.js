var mongoose = require('./../lib/mongoose'),
    Schema = mongoose.Schema;

var schema = mongoose.Schema({
    name:{
        type: String,
        requred: true,
    },
    nickname:{
        type: String,
        requred: true,
    },
    dateCreated:{
        type: Date,
        default: Date.now
    }
});

schema.methods.getPublicFields = function() {
    return {
        nickname: this.nickname,
        dateCreated: this.dateCreated,
        id: this.id
    };
};

exports.User = mongoose.model('User', schema);