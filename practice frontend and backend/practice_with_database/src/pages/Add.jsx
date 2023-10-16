import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Add = () => {
  const [books, setBooks] = useState({
    title: "",
    desc: "",
    cover: null,
    price: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setBooks((books) => ({ ...books, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3000/books", books);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  console.log(books);
  return (
    <div className="form">
      <h1>Add New Book</h1>
      <input
        type="text"
        placeholder="title"
        onChange={handleChange}
        name="title"
      />
      <input
        type="text"
        placeholder="description"
        onChange={handleChange}
        name="desc"
      />
      <input
        type="number"
        placeholder="price"
        onChange={handleChange}
        name="price"
      />
      <input
        type="text"
        placeholder="cover"
        onChange={handleChange}
        name="cover"
      />
      <button className="formButton" onClick={handleClick}>
        Add
      </button>
    </div>
  );
};

export default Add;
