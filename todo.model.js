const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;

let Todo = new Schema({
    todo_description: {
        type: String
    },
    todo_responsible: {
        type: String
    },
    todo_priority: {
        type: String
    },
    todo_completed: {
        type: Boolean
    }
});

// Turn it into a model and export it so it can be used in server.js 
module.exports = mongoose.model('Todo', Todo);