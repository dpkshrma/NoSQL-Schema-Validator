var Person = require('./person');

var person = new Person({
    name : "Deepak",
    stuff: {
        electronics: ['activa', 'car', 'raspberrypi'],
        computing_dev: ['laptop', 'mobile']
    },
    age: {
        biological: 20
    }
//    fruits: [{name: 'Apple', fav: false, about:['fresh']}, {name: 'Mango', fav: true, about:['ripe']}, {name: 'Banana', fav: true, about:['energy']}]
});

console.log("\nInserting person into nedb...")

var Datastore = require('nedb');
var db        = new Datastore({ filename: './person.db', autoload: true });

db.insert(person, function(err, newDoc){
    if (err){
        console.log("\nOops.. Please report back to me with the error");
        console.log(err);
    }
    else{
        console.log("\nDoc successfully inserted!");
        console.log("Doc id: "+newDoc._id);
    }
});

db.find({}, function(err, docs){
    console.log("\nInserted docs: ");
    console.log(docs);
})

console.log("\nSchema of the object: ");
console.log(person.get_schema());
