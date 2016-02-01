# NoSQL Schema Validator [NSV]

A simple JSON schema validator that can be used for NoSQL DBs on NodeJS.

## Defining your Schema

```javascript
// JSON Schema Document (person.js)

var Model = require('./model');
var schema = {
  name     : String,
  favFruits: [
    {
      type: String
    }
  ]
};

var person = function(data){
  Model.call(this, schema, data);
}

person.prototype = Object.create(Model.prototype);

module.exports = person;
```

Now, person schema object is available for creating new documents and storing in NoSQL dbs.

```javascript
var Person = require('./person')
var person = new Person({
  name     : 'Deepak',
  favFruits: ['Mango', 'Orange', 'Banana']
})
```

The input person document is validated against its corresponding schema on Instance creation.

**Permitted Schema types:**
- String
- Number
- Date
- Boolean
- Array
- Object

To specify an object containing key-value pair in schema use following syntax:

```javascript
var schema = {
  name: {
    first: String,
    last : String
  }
}

```
Here, input document is expected to have value for key `name` as an `Object`.

To specify an Array containing values as some `datatype` , use following syntax:

```javascript
var schema = {
  movies: [
    {
      type: String
    }
  ]
}
```
Here, movies is supposed to be an array of string in the input document. Remember, there can be no other keys when type of object in array is specified.


If the array contains many objects, it can be specified as follows in the schema:

```javascript
var schema = {
  movies: [
    {
      name: String,
      year: Number
    }
  ]
}
```

Note that all objects mentioned in the schema are expected to have `Object` constructor.

## Demo

Small demo to showcase the usecase of NoSQL Schema Validator with [NeDB](https://github.com/louischatriot/nedb)

To run the Demo, please follow these steps:
- Clone the repo
- cd into demo dir
- run `npm install && node index.js`

## Contributing

I'd be hugely delighted if you plan to improve this small package.
