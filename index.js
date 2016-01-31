var Person = require('./person');

var person = new Person({
    name : "Deepak",
    stuff: {
        electronics: ['activa', 'car', 'raspberrypi'],
        computing_dev: ['laptop', 'mobile']
    },
    age: {
        biological: 100
    },
    fruits: [{name: 'Apple', fav: false, about:['fresh', 'buggy']}, {name: 'Mango', fav: true, about:['ripe']}, {name: 'Banana', fav: true, about:['energy']}]
});


var doc = person.get()

var Datastore = require('nedb');
var db        = new Datastore({ filename: './person.db', autoload: true });

db.insert(doc, function(err, newDoc){
    if (err) console.log(err);
    else console.log(newDoc);
});

/*db.find({}, function(err, docs){
    console.log(docs);
})
*/
/*console.log("Calling Sub class method: ");
console.log(person.get())
console.log(person.get('fruits'))
console.log(
    JSON.stringify(person.get()) + "\n" +
    person.get('name') + "\n" +
    person.get('age') + "\n" +
    "\nObject Props: "+ "\n" +
    Object.getOwnPropertyNames(person)
);
console.log("\nSchema of the object: ");
console.log(person.get_schema());*/
