var express=require('express');
var fs=require('fs');
var app=express();
var bodyParser=require('body-parser');
var mongo = require('mongodb').MongoClient;
var todosAPI = require('./todosAPI').todosAPI;
var assert=require('assert');
var url='mongodb://localhost:27017/todos';
var ObjectId = require('mongodb').ObjectID;

var collection = null; // NOT connection IT IS coLLection
mongo.connect('mongodb://localhost:27017/todos', function(err, db) {
    if (!err) {
      // Set the collection we will use here once
        collection = db.collection('todosdata');
        console.log('Database is connected ...');
    } else {
        console.warn('Error connecting database ...')
    }
});

console.log('Collection: ', collection);
// Use JSON body parser middleware.
app.use(bodyParser.json());


app.get('/todos',function(request,response){
	 var id = request.params.id;
    var rows = todosAPI.getTodos(collection, id, function(err, documents) {
        if (!err) {
            console.log('Documents received by get: ', documents);
            response.json(documents);
            response.end();
        } else {
            console.warn('Error in GET');
        }
    });

})

app.post('/todos',function(request,response){
	        
	        
	var obj=[ {"id":0,"task":"wakeup early","done":1},
	          {"id":1,"task":"wash face","done":1},
	          {"id":2,"task":"eat breakfast","done":0},
	          {"id":3,"task":"go to work","done":0},
	          {"id":4,"task":"eat lunch","done":0},
	          {"id":5,"task":"comeback from work","done":0},
	          {"id":6,"task":"Eat dinner","done":0},
	          {"id":7,"task":"Sleep","done":0}
	        ]
	         
	mongo.connect(url,function(error,db){
		assert.equal(null,error);
		//todosdata is a collection in the todos database of mongodb
		db.collection('todosdata').insert(obj,function(error,result){
			assert.equal(null,error);
			console.log("item inserted");
			response.json(result);
		})
	})
})

app.put('/todos',function(request,response){
	var updateItem={"task":"wash face"};
	var updatItemWith={"task":"wash face after wakeup"}
	mongo.connect(url,function(error,db){
		assert.equal(null,error);
		db.collection('todosdata').update(updateItem,updatItemWith,function(error,result){
			assert.equal(null,error);
			console.log("succesfully updated");
			response.send("succesfully updated")
		})
	})
})

app.delete('/todos',function(request,response){
	var deleteItem=request.params._id;
		 mongo.connect(url,function(error,db){
		assert.equal(null,error);
		
		db.collection('todosdata').remove(deleteItem,function(error,result){
			assert.equal(null,error);
			console.log("succesfully removed");
			response.send("deleted succesfully");
		})
	})
})
app.listen(8000);
console.log("server is started");