// Express, mongoose
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// create an instance of express
const app = express()
app.use(express.json())
app.use(cors())

//Define a route

// let DataBase = [];
// connecting mongoose
mongoose.connect("mongodb://localhost:27017/todo-app")
.then(()=>{
    console.log("Db Connected!");
})
.catch((err)=>{
    console.log(err);
})

//create Schema
const todoSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: {
        required: true,
        type: String
    }
})

// Crearing model
const todoModel = mongoose.model("todo",todoSchema);

// create a todo route
app.post("/todo", async (req,res)=>{
    const {title, description} = req.body;
    // const Temp = {
    //     id: DataBase.length + 1,
    //     title,
    //     description
    // };
    // DataBase.push(Temp);
    // console.log(DataBase);

    try {
        const newTodo = new todoModel({title, description});
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch(err) {
        console.log(err);
        res.status(500).json({message: err.message});
    }

    
})

// Get All Items
app.get("/todo", async (req,res)=>{
    try {
        const Todo = await todoModel.find();
        res.json(Todo);
    } catch(err) {
        console.log(err);
        res.status(500).json({message: err.message});
    }
})

// Update a ToDo items
app.put("/todo/:id", async (req,res)=>{
    try {
        const {title, description} = req.body;
        const id = req.params.id;
        const updatedTodo = await todoModel.findByIdAndUpdate(
            id,
            {title, description},
            {new: true}
        )

        if(!updatedTodo){
            return res.status(404).json({message: "Todo not found"})
        }
        res.json(updatedTodo)
    } catch(err) {
        console.log(err)
        res.status(500).json({message: err.message});
    }
})

// Delete a todo item
app.delete("/todo/:id", async (req,res)=>{
    try {
        const id = req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end();
    } catch(err) {
        console.log(err)
        res.status(500).json({message: err.message});
    }
})

//Start the Server
const port = 8000;
app.listen(port, ()=>{
    console.log(`Server is running to port ${port}`);
})