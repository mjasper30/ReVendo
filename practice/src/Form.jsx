// Form.js
import React, { useState, useEffect } from "react";

function Form() {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [data, setData] = useState([]);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a new data object
    const newData = { name, date, isEditing: false };

    // Save data to local storage
    const savedData = JSON.parse(localStorage.getItem("savedData")) || [];
    savedData.push(newData);
    localStorage.setItem("savedData", JSON.stringify(savedData));

    // Update the state with the new data
    setData([...data, newData]);

    // Clear form fields
    setName("");
    setDate("");
  };

  const handleEdit = (index) => {
    const updatedData = [...data];
    updatedData[index].isEditing = true;
    setData(updatedData);
  };

  const handleEditNameChange = (index, newName) => {
    const updatedData = [...data];
    updatedData[index].name = newName;
    setData(updatedData);
  };

  const handleEditDateChange = (index, newDate) => {
    const updatedData = [...data];
    updatedData[index].date = newDate;
    setData(updatedData);
  };

  const handleSaveEdit = (index) => {
    const updatedData = [...data];
    updatedData[index].isEditing = false;
    setData(updatedData);

    // Update the data in local storage
    localStorage.setItem("savedData", JSON.stringify(updatedData));
  };

  const handleDelete = (index) => {
    // Create a copy of the data array without the deleted item
    const updatedData = [...data];
    updatedData.splice(index, 1);

    // Update the state and local storage
    setData(updatedData);
    localStorage.setItem("savedData", JSON.stringify(updatedData));
  };

  useEffect(() => {
    // Retrieve data from local storage
    const savedData = JSON.parse(localStorage.getItem("savedData")) || [];
    setData(savedData);
  }, []);

  return (
    <div>
      <h1>Local Storage Form</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={handleNameChange} />
        </div>
        <div>
          <label>Date:</label>
          <input type="date" value={date} onChange={handleDateChange} />
        </div>
        <button type="submit">Save</button>
      </form>

      <h2>Saved Data</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>
                {item.isEditing ? (
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) =>
                      handleEditNameChange(index, e.target.value)
                    }
                  />
                ) : (
                  item.name
                )}
              </td>
              <td>
                {item.isEditing ? (
                  <input
                    type="date"
                    value={item.date}
                    onChange={(e) =>
                      handleEditDateChange(index, e.target.value)
                    }
                  />
                ) : (
                  item.date
                )}
              </td>
              <td>
                {item.isEditing ? (
                  <button onClick={() => handleSaveEdit(index)}>Save</button>
                ) : (
                  <button onClick={() => handleEdit(index)}>Edit</button>
                )}
                <button onClick={() => handleDelete(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Form;
