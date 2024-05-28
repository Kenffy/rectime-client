import React, { useEffect, useState } from "react";
import axios from "axios";
import { Paper, Typography } from "@mui/material";

const ReportView = ({ date, token, view }) => {
  const [report, setReport] = useState({
    totalHours: 0,
    regularHours: 0,
    overTime: 0,
    flexTime: 0,
  });

  useEffect(() => {
    const fetchReport = async () => {
      try {
        let startDate, endDate;
        if (view === "monthly") {
          startDate = new Date(
            date.getFullYear(),
            date.getMonth(),
            1
          ).toISOString();
          endDate = new Date(
            date.getFullYear(),
            date.getMonth() + 1,
            0
          ).toISOString();
        } else if (view === "weekly") {
          const startOfWeek = new Date(date);
          const day = startOfWeek.getDay();
          const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
          startDate = new Date(startOfWeek.setDate(diff)).toISOString();
          endDate = new Date(
            startDate.getTime() + 6 * 24 * 60 * 60 * 1000
          ).toISOString();
        } else {
          startDate = new Date(date).toISOString();
          endDate = new Date(
            date.getTime() + 24 * 60 * 60 * 1000
          ).toISOString();
        }
        const res = await axios.get(
          `http://localhost:5000/times/report?start=${startDate}&end=${endDate}`,
          {
            headers: { Authorization: token },
          }
        );
        setReport(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchReport();
  }, [date, token, view]);

  return (
    <Paper style={{ padding: "16px", marginTop: "16px" }}>
      <Typography variant="h6">Report ({view})</Typography>
      <Typography>Total Hours: {report.totalHours}</Typography>
      <Typography>Regular Hours: {report.regularHours}</Typography>
      <Typography>Overtime: {report.overTime}</Typography>
      <Typography>Flex Time: {report.flexTime}</Typography>
    </Paper>
  );
};

export default ReportView;
