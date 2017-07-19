var mongoose = require('./../lib/mongoose'),
    Schema = mongoose.Schema;

var schema = mongoose.Schema({
    userID:{
        type: String,
        requred: true,
    },
    text:{
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
        userID: this.userID,
        text: this.text,
        id: this.id
    };
};

exports.Message = mongoose.model('Message', schema);