var Model = require('./model');

var person = function(data){
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

    Object.defineProperty(this, "schema", {
        enumerable: false,
        value: schema
    });

    Model.call(this, schema, data);
}

// person.prototype = new Model();
person.prototype.get = function(prop){
    if (typeof prop === 'undefined')
        return this;
    if (typeof this.schema[prop] === 'undefined'){
        throw new Error("Invalid Property");
    }
    return this[prop];
}

person.prototype.get_schema = function(){
    return this.schema;
}

module.exports = person;