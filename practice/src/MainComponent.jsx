import { Button, Header } from "./ManyComponents";

export default function MainComponent() {
  const avatar = "https://i.imgur.com/7vQD0fPs.jffpg";
  const description = "Gregorio Y. Zara";
  return (
    <>
      <img src={avatar} alt={description} />
      <h1>To Do List for {formatDate(today)}</h1>
      <Button />;
      <Header />;
    </>
  );
}

const today = new Date();

function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date);
}
