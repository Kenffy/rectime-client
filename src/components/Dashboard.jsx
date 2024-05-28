import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = ({ token }) => {
  const [times, setTimes] = useState([]);

  useEffect(() => {
    const fetchTimes = async () => {
      try {
        const res = await axios.get("http://localhost:5000/times", {
          headers: {
            Authorization: token,
          },
        });
        setTimes(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTimes();
  }, [token]);

  return (
    <div>
      <h1>Dashboard</h1>
      <ul>
        {times.map((time) => (
          <li key={time.id}>
            {time.date} - {time.startTime} to {time.endTime} (Pause:{" "}
            {time.pause} mins)
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
