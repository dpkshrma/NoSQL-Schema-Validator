
var sprintf = require('sprintf');

// Errors
var prop_err    = "Invalid Property : %s\n";
var dt_err      = "Invalid datatype for property: %s\n Required: %s\n Found: %s\n";
var obj_err     = "Invalid Object for property: %s\n";
var obj_len_err = "Invalid object length";

/**
 * Model Class
 * @param  {object} schema describes the nosql doc format
 * @param  {object} data   nosql doc
 * @return {none}          none
 */
function Model(schema, data){
    // read only schema property
    Object.defineProperty(this, "schema", {
        enumerable: false,
        value: schema
    });
    var model_obj = this;
    validate_object(schema, data, function(prop){
        model_obj[prop] = data[prop];
    });
}

/**
 * Validates Data Object against given Schema
 * @param  {object}   schema   describes the nosql "doc/doc item" format
 * @param  {object}   data     nosql "doc/doc item"
 * @param  {Function} callback If no exception occurs, add to Model object
 * @return {none}              none
 */
function validate_object(schema, data, callback){
    for(var prop in data){
        if (prop in schema)
            var schema_item_type = typeof schema[prop];
        else{
            var err = sprintf(prop_err, prop)
            throw new Error(err);
        }

        if (schema_item_type === 'object'){
            check_object(data[prop], schema[prop], prop);
        }
        else if(data[prop].constructor.name !== schema[prop].name){
            var err = sprintf(dt_err, prop, schema[prop].name, data[prop].constructor.name);
            throw new Error(err);
        }
        if (typeof callback !== 'undefined'){
            callback(prop);
        }
    }

}

/**
 * Checks whether the data_item's ctor is Object or Array,
 * validates with ctor of schema_item, and calls validate_object
 * on each child objects.
 * @param  {object} data_item   data property value
 * @param  {object} schema_item schema property value
 * @return {none}               none
 */
function check_object(data_item, schema_item, prop){
    var data_ctor = data_item.constructor.name,
        sch_ctor = schema_item.constructor.name;

    if (data_ctor === sch_ctor){
        if (sch_ctor === Object){
            validate_object(schema_item, data_item);
        }
        else if (sch_ctor === Array){
            // Schema item must always contain one object
            // describing its data values
            schema_item = schema_item[0];

            // Array containing single values, will have single
            // key(type) object containing value ctor
            var arr_child_is_object = true;
            if ("type" in schema_item)
                arr_child_is_object = false;

            // Iterate over data item values
            for (var i = 0; i < data_item.length; i++) {
                if (arr_child_is_object) {
                    validate_object(schema_item, data_item[i]);
                }
                else{
                    if(Object.keys(schema_item).length >1)
                        throw new Error(obj_len_err);
                    if(schema_item['type'].name !== data_item[i].constructor.name){
                        var err = sprintf(dt_err, prop, schema_item[prop].name, data_item[prop].constructor.name);
                        throw new Error(err);
                    }
                }
            }
        }
    }
    else{
        // schema item ctor != data item ctor
        var err = sprintf(obj_err, prop);
        throw new Error(err);
    }
}

Model.prototype.get = function(prop){
    if (typeof prop === 'undefined')
        return this;
    if (typeof this.schema[prop] === 'undefined'){
        var err = sprintf(prop_err, prop);
        throw new Error(err);
    }
    return this[prop];
}

Model.prototype.get_schema = function(){
    return this.schema;
}

module.exports = Model;
