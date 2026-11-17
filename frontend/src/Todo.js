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
  const apiURL = process.env.REACT_APP_API_URL;

  const handelSubmit = () => {
    setError("");
    //input check
    if(title.trim() !== "" && description.trim() !== ""){
      fetch(apiURL, { // +"todo"
        method : "POST",
        headers: {
          "Content-Type" : "application/json"
        },
        body: JSON.stringify({title, description})
      }).then((res)=>{
        if(res.ok){
          // add item to list
          // setTodo([...todo, {title, description}])
          return res.json().then((newTodo) => {
            setTodo((currentTodo) => [...currentTodo, newTodo]);
            setTitle("");
            setDescription("");
            setMsg("Item added successfilly")
            setTimeout(()=>{
              setMsg("");
            },3000);
          });
        }else{
          //set error
          setError("Unable to create Todo item")
        }
      }).catch((err)=>{
        setError(err.message);
      })
      
    }
  }

  useEffect(() => {
    const getItems = () => {
      fetch(apiURL) // +"todo"
        .then(async (res)=> {
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.message || "Request failed");
          }
          if (!Array.isArray(data)) {
            throw new Error("The server returned an invalid todo list");
          }
          setTodo(data);
        })
        .catch(err=>setError(`Unable to load todo items: ${err.message}`))
    };
    getItems();
  }, [apiURL]);

  const handleEdit = (item) => {
    setEditId(item._id); 
    setEditTitle(item.title); 
    setEditDescription(item.description);
  }

  const handleUpdate = () => {
    setError("");
    //input check
    if(editTitle.trim() !== "" && editDescription.trim() !== ""){
      fetch(apiURL+"/"+editId, { // +"todo/"+
        method : "PUT",
        headers: {
          "Content-Type" : "application/json"
        },
        body: JSON.stringify({title : editTitle, description : editDescription})
      }).then((res)=>{
        if(res.ok){
          // update item to list
          const updatedTodo = todo.map((item)=>{
            if(item._id === editId){
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
      fetch(apiURL+"/"+id, { // +"todo/"+
        method: "DELETE"
      })
      .then(()=>{
        const updatedTodo = todo.filter((item)=> item._id !== id)
        setTodo(updatedTodo)
      })
      .catch(err=>console.log(err.message))
    }
  }
  
  return (
    <main className="todo-page">
      <header className="todo-header">
        <div>
          <p className="todo-header__eyebrow">Productivity dashboard</p>
          <h1>Todo List Project</h1>
        </div>
        <span className="todo-header__badge">{todo.length} tasks</span>
      </header>

      <section className="todo-card">
        <div className="section-heading">
          <h3>Add Item</h3>
        </div>

        {msg && <p className="todo-message todo-message--success">{msg}</p>}

        <div className="todo-form">
          <div className="todo-form__inputs">
            <input
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              className="todo-input"
              type="text"
            />
            <input
              placeholder="Description"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              className="todo-input"
              type="text"
            />
          </div>
          <button className="todo-button todo-button--primary" onClick={handelSubmit}>
            Add Task
          </button>
        </div>

        {error && <p className="todo-message todo-message--error">{error}</p>}
      </section>

      <section className="todo-list-section">
        <div className="section-heading">
          <h3>Tasks</h3>
        </div>

        <ul className="todo-list">
          {todo.map((item) => (
            <li
              key={item._id || item.title}
              className={`todo-item ${editId === item._id ? 'todo-item--editing' : ''}`}
            >
              <div className="todo-content">
                {editId === item._id ? (
                  <div className="edit-form">
                    <input
                      placeholder="Title"
                      onChange={(e) => setEditTitle(e.target.value)}
                      value={editTitle}
                      className="todo-input"
                      type="text"
                    />
                    <input
                      placeholder="Description"
                      onChange={(e) => setEditDescription(e.target.value)}
                      value={editDescription}
                      className="todo-input"
                      type="text"
                    />
                  </div>
                ) : (
                  <>
                    <span className="todo-item__title">{item.title}</span>
                    <span className="todo-item__description">{item.description}</span>
                  </>
                )}
              </div>

              <div className="todo-actions">
                {editId === item._id ? (
                  <>
                    <button className="todo-button todo-button--secondary" onClick={handleUpdate}>
                      Update
                    </button>
                    <button className="todo-button todo-button--ghost" onClick={handleEditCancel}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button className="todo-button todo-button--secondary" onClick={() => handleEdit(item)}>
                      Edit
                    </button>
                    <button className="todo-button todo-button--danger" onClick={() => handleDelete(item._id)}>
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default Todo