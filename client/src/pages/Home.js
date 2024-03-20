import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const [value, setValue] = useState("");

  const onClick = () => {
    navigate(`/table/${value}`);
  };

  return (
    <div className="home-container">
      <h2>Enter FPL League ID</h2>
      <input
        type="text"
        className="input-field"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button className="submit-button" onClick={onClick}>
        Submit
      </button>
    </div>
  );
}

export default Home;
