import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  MenuItem,
  Select,
} from "@mui/material";
import ReportView from "./ReportView";

const MonthlyView = ({ date, token }) => {
  const [times, setTimes] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  useEffect(() => {
    const fetchTimes = async () => {
      try {
        const startDate = new Date(
          date.getFullYear(),
          date.getMonth(),
          1
        ).toISOString();
        const endDate = new Date(
          date.getFullYear(),
          date.getMonth() + 1,
          0
        ).toISOString();
        const res = await axios.get(
          `http://localhost:5000/times?start=${startDate}&end=${endDate}${
            selectedUser ? `&userId=${selectedUser}` : ""
          }`,
          {
            headers: { Authorization: token },
          }
        );
        setTimes(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTimes();
  }, [date, token, selectedUser]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/users", {
          headers: { Authorization: token },
        });
        setUsers(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, [token]);

  const handleEdit = (id) => {
    setEditMode(id);
  };

  const handleSave = async (id) => {
    const timeEntry = times.find((time) => time.id === id);
    try {
      await axios.put(`http://localhost:5000/times/${id}`, timeEntry, {
        headers: { Authorization: token },
      });
      setEditMode(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/times/${id}`, {
        headers: { Authorization: token },
      });
      setTimes(times.filter((time) => time.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (id, field, value) => {
    setTimes(
      times.map((time) => (time.id === id ? { ...time, [field]: value } : time))
    );
  };

  return (
    <div>
      <h2>
        {date.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
      </h2>
      <Select
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
        displayEmpty
      >
        <MenuItem value="">All Users</MenuItem>
        {users.map((user) => (
          <MenuItem key={user.id} value={user.id}>
            {user.username}
          </MenuItem>
        ))}
      </Select>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tag</TableCell>
              <TableCell>Start</TableCell>
              <TableCell>End</TableCell>
              <TableCell>Pause (min)</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {times.map((time) => (
              <TableRow key={time.id}>
                <TableCell>
                  {new Date(time.date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {editMode === time.id ? (
                    <TextField
                      type="time"
                      value={time.startTime}
                      onChange={(e) =>
                        handleChange(time.id, "startTime", e.target.value)
                      }
                    />
                  ) : (
                    time.startTime
                  )}
                </TableCell>
                <TableCell>
                  {editMode === time.id ? (
                    <TextField
                      type="time"
                      value={time.endTime}
                      onChange={(e) =>
                        handleChange(time.id, "endTime", e.target.value)
                      }
                    />
                  ) : (
                    time.endTime
                  )}
                </TableCell>
                <TableCell>
                  {editMode === time.id ? (
                    <TextField
                      type="number"
                      value={time.pause}
                      onChange={(e) =>
                        handleChange(time.id, "pause", e.target.value)
                      }
                    />
                  ) : (
                    time.pause
                  )}
                </TableCell>
                <TableCell>
                  {editMode === time.id ? (
                    <>
                      <Button onClick={() => handleSave(time.id)}>Save</Button>
                      <Button onClick={() => setEditMode(null)}>Cancel</Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={() => handleEdit(time.id)}>Edit</Button>
                      <Button onClick={() => handleDelete(time.id)}>
                        Delete
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ReportView date={date} token={token} view="monthly" />
    </div>
  );
};

export default MonthlyView;
