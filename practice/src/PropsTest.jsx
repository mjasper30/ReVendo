import { useState } from "react";

export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update together</h1>
      <MyButton anything={count} onClick={handleClick} />
      <MyButton anything={count} onClick={handleClick} />
    </div>
  );
}

function MyButton({ anything, onClick }) {
  return <button onClick={onClick}>Clicked {anything} times</button>;
}
