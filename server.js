const express = require('express');
const app = express(); 
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router();
const PORT = 4000;

// import exported schema from todo.model.js 
let Todo = require('./todo.model');

app.use(cors()); 
app.use(bodyParser.json()); 

// Connect to local database named todos 
mongoose.connect('mongodb://127.0.0.1:27017/todos', { useNewUrlParser: true });
const connection = mongoose.connection; 

// Once connected to database and opens database it will run the function announcing successful connection
connection.once('open', function(){
    console.log("MongoDB database connection established successfully!");
});

// localhost/todos/ 
todoRoutes.route('/').get(function(req, res){
    Todo.find(function(err, todos){
        if(err){
            console.log(err);
        } else{
            res.json(todos);
        }
    });
});

todoRoutes.route('/:id').get(function(req,res){
    let id = req.params.id;
    Todo.findById(id, function(err, todo ) {
        res.json(todo);
    }); 
});

// Post request when adding new todo items
todoRoutes.route('/add').post(function(req,res) {
    // let todo equal new instance of Todo schema. Info retrieved from req 
    let todo = new Todo(req.body);
    todo.save()
        .then(todo => {
            res.status(200).json({'todo': 'todo added successfully'});
        })
        .catch(err => {
            res.status(400).send('Adding new todo failed');
        });
});

// Post request to update todo items. why use post request instead of put?
todoRoutes.route('/update/:id').post(function(req, res) {
    Todo.findById(req.params.id, function(err, todo){
        if(!todo){
            res.status(404).send('data is not found');
        } else {
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_priority = req.body.todo_priority;
            todo.todo_completed = req.body.todo_completed;

            todo.save().then(todo => {
                res.json('Todo updated');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
        }
    });
});

app.use('/todos', todoRoutes);

// Start server at PORT 
app.listen(PORT, function(){
    console.log('Server is running on port: ' + PORT);
});