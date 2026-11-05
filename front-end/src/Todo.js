import React from 'react'
import { useState, useEffect } from 'react';


function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todo, setTodo] = useState([]);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [editId, setEditId] = useState(-1);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const apiURL = "http://localhost:8000/";

  const handelSubmit = () => {
    setError("");
    //input check
    if(title.trim() !== "" && description.trim() !== ""){
      fetch(apiURL+"todo", {
        method : "POST",
        headers: {
          "Content-Type" : "application/json"
        },
        body: JSON.stringify({title, description})
      }).then((res)=>{
        if(res.ok){
          // add item to list
          setTodo([...todo, {title, description}])
          setTitle("");
          setDescription("");
          setMsg("Item added successfilly")
          setTimeout(()=>{
            setMsg("");
          },3000)
        }else{
          //set error
          setError("Unable to create Todo item")
        }
      }).catch((err)=>{
        setError(err);
      })
      
    }
  }

  useEffect(() => {
      getItems()
  },[]);

  const getItems = () => {
    fetch(apiURL+"todo")
    .then((res)=> res.json())
    .then((res)=> {
      setTodo(res)
    })
  }

  const handleEdit = (item) => {
    setEditId(item._id); 
    setEditTitle(item.title); 
    setEditDescription(item.description);
  }

  const handleUpdate = () => {
    setError("");
    //input check
    if(editTitle.trim() !== "" && editDescription.trim() !== ""){
      fetch(apiURL+"todo/"+editId, {
        method : "PUT",
        headers: {
          "Content-Type" : "application/json"
        },
        body: JSON.stringify({title : editTitle, description : editDescription})
      }).then((res)=>{
        if(res.ok){
          // update item to list
          const updatedTodo = todo.map((item)=>{
            if(item._id == editId){
              item.title = editTitle;
              item.description = editDescription;
            }
            return item
        })

          setTodo(updatedTodo)
          setEditTitle("");
          setEditDescription("");
          setMsg("Item updated successfilly")
          setTimeout(()=>{
            setMsg("");
          },3000)
          setEditId(-1);
        }else{
          //set error
          setError("Unable to create Todo item")
        }
      }).catch((err)=>{
        setError(err);
      })
      
    }
  }

  const handleEditCancel = () => {
    setEditId(-1);
  }

  const handleDelete = (id) => {
    if(window.confirm("Are you sure want to delete?")){
      fetch(apiURL+"todo/"+id, {
        method: "DELETE"
      })
      .then(()=>{
        const updatedTodo = todo.filter((item)=> item._id !== id)
        setTodo(updatedTodo)
      })
    }
  }
  
  return (
    <>
    <div className="row p-3 bg-success text-light">
        <h1>Todo List Project With MERN Stack</h1>
    </div>
    <div className="row">
        <h3>Add Item</h3>
        {msg && <p className="text-success">{msg}</p>}
        <div className="form-group d-flex gap-2">
          <input placeholder="Title" onChange={(e)=>{setTitle(e.target.value)}} value={title} className="form-control" type="text"/>
          <input placeholder="Description" onChange={(e)=>{setDescription(e.target.value)}} value={description} className="form-control" type="text"/>
          <button className="btn btn-dark" onClick={handelSubmit}>Submit</button>
        </div>
        {error && <p className="text-danger">{error}</p>}
    </div>
    <div className="row mt-3 container-fluid p-5" style={{ maxWidth: "1000px", margin: "0" }}>
      <h3>Tasks</h3>
      <div className="col-md-6">
        <ul className="list-group">
          {
            todo.map((item)=> (
              <li className="list-group-item bg-info d-flex justify-content-between align-items-center my-2">
              <div className="d-flex flex-column me-2">
                {
                  editId == -1 || editId !== item._id ? <>
                    <span className="fw-bold">{item.title}</span>
                    <span >{item.description}</span>
                  </> : <>
                    <div className="form-group d-flex gap-2">
                      <input placeholder="Title" onChange={(e)=>{setEditTitle(e.target.value)}} value={editTitle} className="form-control" type="text"/>
                      <input placeholder="Description" onChange={(e)=>{setEditDescription(e.target.value)}} value={editDescription} className="form-control" type="text"/>
                    </div>
                  </>
                }
                
              </div>
              <div className="d-flex gap-2">
                { editId == -1 || editId !== item._id ? <button className="btn btn-warning" onClick={()=>handleEdit(item)}>Edit</button> 
                : <button className="btn btn-warning" onClick={handleUpdate}>Update</button> }
                { editId == -1 || editId !== item._id ? <button className="btn btn-danger" onClick={()=>handleDelete(item._id)}>Delete</button> 
                : <button className="btn btn-danger" onClick={handleEditCancel}>Cancel</button> }
              </div>
            </li>
            ))
          } 
        </ul>
      </div>
    </div>
    </>
    
  )
}

export default Todo