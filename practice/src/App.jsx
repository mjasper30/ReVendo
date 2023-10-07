import React from "react";
import { useState } from "react";
import Counting from "./Counting";
import Test from "./Test";
import "./index.css";

export default function App() {
  const [count, setCount] = useState(0);
  const student = {
    name: "Jasper Macaraeg",
    course: "BSCS",
  };

  const products = [
    { title: "Cabbage", isFruit: false, id: 1 },
    { title: "Garlic", isFruit: false, id: 2 },
    { title: "Apple", isFruit: true, id: 3 },
  ];

  const students = [
    { name: "Jasper", age: 21, course: "BSCS", id: 1 },
    { name: "Ira", age: 21, course: "BSEMC", id: 2 },
    { name: "Jiro", age: 21, course: "BSIT", id: 3 },
  ];

  const listItems = products.map((product) => (
    <li key={product.id} style={{ color: product.isFruit ? "blue" : "red" }}>
      {product.title}
    </li>
  ));

  const studentList = students.map((student) => (
    <tr key={student.id}>
      <td>{student.name}</td>
      <td>{student.age}</td>
      <td>{student.course}</td>
    </tr>
  ));

  function handleCount() {
    setCount(count + 1);
  }

  return (
    <>
      <Test />
      <Counting count={count} Counting={handleCount} />
      <p>Your name is {student.name}</p>
      <p>Your course is {student.course}</p>
      <ul>{listItems}</ul>
      <table>
        <tr>
          <td>Name</td>
          <td>Age</td>
          <td>Course</td>
        </tr>
        {studentList}
      </table>
      <MyButton />
    </>
  );
}

function MyButton() {
  return <button className="btn">Click Me</button>;
}
