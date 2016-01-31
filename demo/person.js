var Model = require('./model');
var schema = {
    name : String,
    stuff: {
        electronics: [{
            type: String
        }],
        computing_dev: [{
            type: String
        }]
    },
    age:{
        biological: Number
    },
    fruits: [
        {
            name: String,
            fav: Boolean,
            about: [{
                type: String
            }]
        }
    ]
};

var person = function(data){
    Model.call(this, schema, data);
}

person.prototype = Object.create(Model.prototype);

module.exports = person;