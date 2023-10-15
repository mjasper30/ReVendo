import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../index.css";

const Books = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("http://localhost:3000/books");
        setBooks(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBooks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/books/${id}`);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <h1>Book Shop</h1>
      <div className="books">
        {books.map((book) => (
          <div className="book" key={book.id}>
            {book.cover && <img src="" alt="" />}
            <h3>{book.title}</h3>
            <p>{book.desc}</p>
            <p>{book.price}</p>
            <button className="delete" onClick={() => handleDelete(book.id)}>
              Delete
            </button>
            <button className="edit">
              <Link to={`/update/${book.id}`}>Edit</Link>
            </button>
          </div>
        ))}
      </div>
      <button>
        <Link to={"/add"}>Add New Book</Link>
      </button>
    </div>
  );
};

export default Books;
