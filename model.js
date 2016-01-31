
var sprintf = require('sprintf');

// errors
var prop_err = "Invalid Property : %s\n";
var dt_err   = "Invalid datatype for property: %s\n Required: %s\n Found: %s\n";
var obj_err  = "Invalid Object for property: %s\n";


function model(schema, data){
    if (Object.keys(schema).length !== Object.keys(data).length)
        throw new Error("Invalid object length");

    for(prop in data){

        if (prop in schema)
            var schema_item_type = typeof schema[prop];
        else{
            var err = sprintf(prop_err, prop)
            throw new Error(err);
        }

        if (schema_item_type === 'object'){
            check_object(data[prop], schema[prop], prop);
        }
        else if(data[prop].constructor !== schema[prop]){
            var err = sprintf(dt_err, prop, schema[prop].name, data[prop].constructor.name);
            throw new Error(err);
        }

        this[prop] = data[prop];
    }
}

function check_object(data_item, schema_item, prop){
    var data_ctor = data_item.constructor,
        sch_ctor = schema_item.constructor;

    if (data_ctor === sch_ctor){
        if (sch_ctor === Object){
            if (Object.keys(schema_item).length !== Object.keys(data_item).length)
                throw new Error("Invalid object length");

            for(prop in data_item){
                if (prop in schema_item)
                    var schema_item_type = typeof schema_item[prop];
                else{
                    var err = sprintf(prop_err, prop)
                    throw new Error(err);
                }

                if (schema_item_type === 'object'){
                    check_object(data_item[prop], schema_item[prop], prop);
                }
                else if(data_item[prop].constructor !== schema_item[prop]){
                    var err = sprintf(dt_err, prop, schema_item[prop].name, data_item[prop].constructor.name);
                    throw new Error(err);
                }
            }
        }
        else if (sch_ctor === Array){
            schema_item = schema_item[0];

            var arr_child_is_object = true;
            if ("type" in schema_item)
                arr_child_is_object = false;

            for (var i = 0; i < data_item.length; i++) {
                if (arr_child_is_object) {
                    if(Object.keys(data_item[i]).length !== Object.keys(schema_item).length)
                        throw new Error("Invalid object length");
                    for(prop in data_item[i]){
                        if (prop in schema_item)
                            var schema_item_type = typeof schema_item[prop];
                        else{
                            var err = sprintf(prop_err, prop)
                            throw new Error(err);
                        }

                        if (schema_item_type === 'object'){
                            check_object(data_item[i][prop], schema_item[prop], prop);
                        }
                        else if(data_item[i][prop].constructor !== schema_item[prop]){
                            console.log(schema_item_type);
                            var err = sprintf(dt_err, prop, schema_item[prop].name, data_item[i][prop].constructor.name);
                            throw new Error(err);
                        }
                    }
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

module.exports = model;