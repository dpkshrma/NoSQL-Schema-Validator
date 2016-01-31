
var sprintf = require('sprintf');

// errors
var prop_err = "Invalid Property : %s\n";
var dt_err   = "Invalid datatype for property: %s\n Required: %s\n Found: %s\n";
var obj_err  = "Invalid Object for property: %s\n";

function model(schema, data){
    Object.defineProperty(this, "schema", {
        enumerable: false,
        value: schema
    });
    var model_obj = this;
    validate_object(schema, data, function(prop){
        model_obj[prop] = data[prop];
    });
}

function validate_object(schema, data, callback){
    if (Object.keys(schema).length !== Object.keys(data).length)
        throw new Error("Invalid object length");

    for(var prop in data){
        if (prop in schema)
            var schema_item_type = typeof schema[prop];
        else{
            var err = sprintf(prop_err, prop)
            throw new Error(err);
        }

        if (schema_item_type === 'object'){
            check_object(data[prop], schema[prop]);
        }
        else if(data[prop].constructor !== schema[prop]){
            var err = sprintf(dt_err, prop, schema[prop].name, data[prop].constructor.name);
            throw new Error(err);
        }
        if (typeof callback !== 'undefined'){
            callback(prop);
        }
    }

}

function check_object(data_item, schema_item){
    var data_ctor = data_item.constructor,
        sch_ctor = schema_item.constructor;

    if (data_ctor === sch_ctor){
        if (sch_ctor === Object){
            validate_object(schema_item, data_item);
        }
        else if (sch_ctor === Array){
            schema_item = schema_item[0];

            var arr_child_is_object = true;
            if ("type" in schema_item)
                arr_child_is_object = false;

            for (var i = 0; i < data_item.length; i++) {
                if (arr_child_is_object) {
                    validate_object(schema_item, data_item[i]);
                }
                else{
                    if(Object.keys(schema_item).length >1)
                        throw new Error("Invalid object length");
                    if(schema_item['type'] !== data_item[i].constructor){
                        var err = sprintf(dt_err, prop, schema_item[prop].name, data_item[prop].constructor.name);
                        throw new Error(err);
                    }
                }
            }
        }
    }
    else{
        var err = sprintf(obj_err, prop);
        throw new Error(err);
    }
}

model.prototype.get = function(prop){
    if (typeof prop === 'undefined')
        return this;
    if (typeof this.schema[prop] === 'undefined'){
        throw new Error("Invalid Property");
    }
    return this[prop];
}

model.prototype.get_schema = function(){
    return this.schema;
}

module.exports = model;