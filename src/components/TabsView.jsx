import React, { useState, useEffect } from "react";
import { Tabs, Tab, Box, Button } from "@mui/material";
import axios from "axios";
import MonthlyView from "./MonthlyView";
import WeeklyView from "./WeeklyView";
import DailyView from "./DailyView";

const TabsView = ({ token }) => {
  const [value, setValue] = useState(0);
  const [date, setDate] = useState(new Date());
  const [currentEntry, setCurrentEntry] = useState(null);

  useEffect(() => {
    const fetchCurrentEntry = async () => {
      try {
        const res = await axios.get("http://localhost:5000/times/current", {
          headers: { Authorization: token },
        });
        setCurrentEntry(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCurrentEntry();
  }, [token]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handlePrev = () => {
    const newDate = new Date(date);
    if (value === 0) newDate.setMonth(date.getMonth() - 1);
    if (value === 1) newDate.setDate(date.getDate() - 7);
    if (value === 2) newDate.setDate(date.getDate() - 1);
    setDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(date);
    if (value === 0) newDate.setMonth(date.getMonth() + 1);
    if (value === 1) newDate.setDate(date.getDate() + 7);
    if (value === 2) newDate.setDate(date.getDate() + 1);
    setDate(newDate);
  };

  const handleStart = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/times/start",
        {},
        {
          headers: { Authorization: token },
        }
      );
      setCurrentEntry(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStop = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/times/stop",
        { id: currentEntry.id },
        {
          headers: { Authorization: token },
        }
      );
      setCurrentEntry(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box>
      <Tabs value={value} onChange={handleChange} centered>
        <Tab label="Monthly" />
        <Tab label="Weekly" />
        <Tab label="Daily" />
      </Tabs>
      <Box display="flex" justifyContent="space-between" m={2}>
        <Button variant="contained" onClick={handlePrev}>
          Prev
        </Button>
        <Button variant="contained" onClick={handleNext}>
          Next
        </Button>
      </Box>
      <Box display="flex" justifyContent="center" m={2}>
        {currentEntry ? (
          <Button variant="contained" color="secondary" onClick={handleStop}>
            Stop
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleStart}>
            Start
          </Button>
        )}
      </Box>
      {value === 0 && <MonthlyView date={date} token={token} />}
      {value === 1 && <WeeklyView date={date} token={token} />}
      {value === 2 && <DailyView date={date} token={token} />}
    </Box>
  );
};

export default TabsView;
