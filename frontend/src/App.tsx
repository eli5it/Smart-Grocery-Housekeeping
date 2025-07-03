import { useState, useEffect } from "react";

import "./App.css";

function App() {
  useEffect(() => {
    fetch("/api/items")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setItems(data);
      });
  }, []);

  const [items, setItems] = useState([]);
  console.log(items);
  return (
    <>
      <ul>
        {items.map((item) => (
          <li>{item}</li>
        ))}
      </ul>
    </>
  );
}

export default App;
