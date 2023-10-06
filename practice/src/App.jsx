import { useState } from "react";

export default function App() {
  const [name, setName] = useState("Jasper");
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  function handleName() {
    setName("Ira");
  }

  function MyButton({ count, onClick }) {
    return <button onClick={onClick}>Clicked {count} times</button>;
  }

  const user = {
    name: "Jasper",
    age: 21,
    isTall: true,
    imgSource: "https://i.imgur.com/yXOvdOSs.jpg",
  };

  const products = [
    { title: "Cabbage", isFruit: false, id: 1 },
    { title: "Garlic", isFruit: false, id: 2 },
    { title: "Apple", isFruit: true, id: 3 },
  ];

  const listItems = products.map((product) => (
    <li
      key={product.id}
      style={{
        color: product.isFruit ? "red" : "blue",
        backgroundColor: product.isFruit ? "black" : "green",
      }}
    >
      {product.title}
    </li>
  ));

  const Alert = () => {
    alert("ALERT ALERT ALERT");
  };

  return (
    <>
      <h1 className="btn">Hello World</h1>
      <p style={{ color: "blue" }}>{user.name}</p>
      <img src={user.imgSource} />
      {console.log("Hello World")}
      <MyComponent />
      <div>{user.isTall ? "TRUE" : "FALSE"}</div>
      <div>{user.isTall && "TRUE NOTHING ELSE"}</div>
      <ul>{listItems}</ul>
      <button onClick={Alert}>Alert me</button>
      <button onClick={handleName}>{name}</button>
      <MyButton count={count} onClick={handleClick} />
    </>
  );
}

function MyComponent() {
  return (
    <>
      <button>Click Me</button>
    </>
  );
}
