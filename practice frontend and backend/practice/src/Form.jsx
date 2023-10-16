("use client");
import React, { useState, useEffect } from "react";

import { Button, Modal } from "flowbite-react";
import { Datepicker } from "flowbite-react";

function Form() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [date, setDate] = useState("");
  const [data, setData] = useState([]);

  const [openModal, setOpenModal] = useState(false);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleAgeChange = (e) => {
    setAge(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a new data object
    const newData = { name, age, date, isEditing: false };

    // Save data to local storage
    const savedData = JSON.parse(localStorage.getItem("savedData")) || [];
    savedData.push(newData);
    localStorage.setItem("savedData", JSON.stringify(savedData));

    // Update the state with the new data
    setData([...data, newData]);

    // Clear form fields
    setName("");
    setAge("");
    setDate("");

    // Close the modal
    setOpenModal(false);
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

  const handleEditAgeChange = (index, newAge) => {
    const updatedData = [...data];
    updatedData[index].name = newAge;
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
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Local Storage Form</h1>

      <Button pill onClick={() => setOpenModal(true)}>
        Add New
      </Button>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Add New Item</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-600 mb-2">
                Name:
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={handleNameChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="age" className="block text-gray-600 mb-2">
                Age:
              </label>
              <input
                type="number"
                id="age"
                value={age}
                onChange={handleAgeChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="date" className="block text-gray-600 mb-2">
                Date:
              </label>
              {/* <Datepicker onChange={handleDateChange} /> */}
              <input
                type="date"
                id="date"
                value={date}
                onChange={handleDateChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <Modal.Footer className="justify-end">
              <button
                type="button"
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-full mr-2"
                onClick={() => setOpenModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full"
              >
                Save
              </button>
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>

      <h2 className="text-2xl text-center font-semibold mt-6">Saved Data</h2>

      <table className="w-full border-collapse border border-gray-300 mt-2">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Age</th>
            <th className="border border-gray-300 p-2">Date</th>
            <th className="border border-gray-300 p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border border-gray-300">
              <td className="border border-gray-300 p-2">
                {item.isEditing ? (
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) =>
                      handleEditNameChange(index, e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg px-2 py-1 focus:outline-none"
                  />
                ) : (
                  item.name
                )}
              </td>
              <td className="border border-gray-300 p-2">
                {item.isEditing ? (
                  <input
                    type="number"
                    value={item.age}
                    onChange={(e) =>
                      handleEditNameChange(index, e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg px-2 py-1 focus:outline-none"
                  />
                ) : (
                  item.age
                )}
              </td>
              <td className="border border-gray-300 p-2">
                {item.isEditing ? (
                  <input
                    type="date"
                    value={item.date}
                    onChange={(e) =>
                      handleEditDateChange(index, e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg px-2 py-1 focus:outline-none"
                  />
                ) : (
                  formatDate(item.date)
                )}
              </td>
              <td className="border border-gray-300 p-2 ">
                <div className="flex justify-center items-center mt-2">
                  {item.isEditing ? (
                    <>
                      <Button
                        className="mr-2"
                        color="success"
                        pill
                        onClick={() => handleSaveEdit(index)}
                      >
                        <span className="material-icons">save</span>
                      </Button>
                      <Button
                        color="failure"
                        pill
                        onClick={() => handleDelete(index)}
                      >
                        <span className="material-icons">delete</span>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        className="mr-2"
                        color="warning"
                        pill
                        onClick={() => handleEdit(index)}
                      >
                        <span className="material-icons">edit</span>
                      </Button>
                      <Button
                        color="failure"
                        pill
                        onClick={() => handleDelete(index)}
                      >
                        <span className="material-icons">delete</span>
                      </Button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

export default Form;
