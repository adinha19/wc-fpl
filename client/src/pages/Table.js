import React from "react";
import { useParams, Link } from "react-router-dom";
import useSocket from "../hooks/useSocket";
import "./Table.css";

const Table = () => {
  const { id } = useParams();
  const { data } = useSocket("http://localhost:3005", id);

  return !data?.length ? (
    <h1 className="loading-message">Loading...</h1>
  ) : (
    <div className="table-container">
      <Link to="/" className="home-button">
        Home
      </Link>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Player Name</th>
            <th>Gameweek Points</th>
            <th>Total Points</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((result) => (
            <tr key={result.entry}>
              <td>{result.player_name}</td>
              <td>{result.points}</td>
              <td>{result.total_points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
