import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [editingItemId, setEditingItemId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/items');
      const data = await response.json();
      setItems(data);
    } catch (error) {
      setMessage('Failed to load items.');
    }
  };

  const addItem = async () => {
    if (!name.trim()) {
      setMessage('Item name is required.');
      return;
    }

    const item = { name };

    try {
      let response;
      if (editingItemId) {
        response = await fetch(`http://localhost:8080/api/items/${editingItemId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(item),
        });

        setMessage(response.ok ? 'Item updated successfully!' : 'Failed to update item.');
        setEditingItemId(null);
      } else {
        response = await fetch('http://localhost:8080/api/items', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(item),
        });

        setMessage(response.ok ? 'Item added successfully!' : 'Failed to add item.');
      }

      setName('');
      fetchItems();
    } catch (error) {
      setMessage('An error occurred while saving the item.');
    }
  };

  const deleteItem = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/items/${id}`, {
        method: 'DELETE',
      });

      setMessage(response.ok ? 'Item deleted successfully!' : 'Failed to delete item.');
      fetchItems();
    } catch (error) {
      setMessage('An error occurred while deleting the item.');
    }
  };

  const startEditing = (item) => {
    setName(item.name);
    setEditingItemId(item.id);
  };

  return (
    <div className="layout-container">
      <div className="left-panel">
        <h2>About This App</h2>
        <p>- This is a full-stack CRUD app built using React and Spring Boot. <br/>
           - You can add, update, and delete items from the list.<br/> 
           - The data is stored on the backend and synced live with the UI.
        </p>
        <h2>Tech Stack</h2>
        <p>Frontend: React, JSX, CSS
          Backend: Spring Boot, Java 
          API Communication: REST APIs with JSON
        </p>
        <h2>Connect With me!</h2>
        <ul>
          <li><a href="https://github.com/your-username/your-repo" target="_blank" rel="noopener noreferrer">🌐 GitHub Repository</a></li>
          <li><a href="https://www.linkedin.com/in/akshit-singh-shekhawat/" target="_blank" rel="noopener noreferrer">🌐 Linkedin</a></li>
          <li><a href="mailto:akw17439@gmail.com" target="_blank" rel="noopener noreferrer">🌐 akw17439@gmail.com</a></li>
        </ul>
      </div>
    <div className="App">
      
      <h1>Item List</h1>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter item name"
      />
      <button className="add-button" onClick={addItem}>
        {editingItemId ? 'Update Item' : 'Add Item'}
      </button>

      {message && <p>{message}</p>}

      <div className="list-container">
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <span className="item-name">{item.name}</span>
              <div>
                <button className="edit-button" onClick={() => startEditing(item)}>
                  Edit
                </button>
                <button className="delete-button" onClick={() => deleteItem(item.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
    </div>
  );
}

export default App;
