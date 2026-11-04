"use strict";

const express = require("express");
const fs = require("node:fs");
const path = require("node:path");

const app = express();
const port = Number(process.env.PORT) || 3000;
const frontendDirectory = path.join(__dirname, "..", "frontend");
const dataDirectory = path.join(__dirname, "data");
const dataFile = path.join(dataDirectory, "sessions.json");

app.disable("x-powered-by");
app.use(express.json({ limit: "10kb" }));

function prepareDataFile() {
  fs.mkdirSync(dataDirectory, { recursive: true });
  if (!fs.existsSync(dataFile)) {
    const emptyStats = { totalSessions: 0, dailySessions: {} };
    fs.writeFileSync(dataFile, JSON.stringify(emptyStats, null, 2));
  }
}

function readStats() {
  prepareDataFile();
  return JSON.parse(fs.readFileSync(dataFile, "utf8"));
}

function writeStats(stats) {
  fs.writeFileSync(dataFile, JSON.stringify(stats, null, 2));
}

function isValidDateKey(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const parsedDate = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsedDate.getTime()) && parsedDate.toISOString().slice(0, 10) === value;
}

function getTodayFromRequest(request) {
  const date = request.query.date;
  if (date === undefined) {
    return new Date().toISOString().slice(0, 10);
  }
  return isValidDateKey(date) ? date : null;
}

function getTotalSessions(stats) {
  return Number.isInteger(stats.totalSessions) && stats.totalSessions >= 0
    ? stats.totalSessions
    : 0;
}

function getDailySessions(stats) {
  return stats.dailySessions && typeof stats.dailySessions === "object"
    ? stats.dailySessions
    : {};
}

app.get("/api/health", (request, response) => {
  response.json({ status: "ok" });
});

app.get("/api/stats", (request, response) => {
  const date = getTodayFromRequest(request);
  if (!date) {
    return response.status(400).json({ error: "Date must use YYYY-MM-DD format." });
  }

  try {
    const storedStats = readStats();
    const dailySessions = getDailySessions(storedStats);
    return response.json({
      totalSessions: getTotalSessions(storedStats),
      todaySessions: Number.isInteger(dailySessions[date]) ? dailySessions[date] : 0
    });
  } catch (error) {
    return response.status(500).json({ error: "Could not read session totals." });
  }
});

app.post("/api/sessions", (request, response) => {
  const { date } = request.body || {};
  if (!isValidDateKey(date)) {
    return response.status(400).json({ error: "Date must use YYYY-MM-DD format." });
  }

  try {
    const storedStats = readStats();
    const dailySessions = getDailySessions(storedStats);
    const totalSessions = getTotalSessions(storedStats) + 1;
    dailySessions[date] = (Number.isInteger(dailySessions[date]) ? dailySessions[date] : 0) + 1;

    const updatedStats = { totalSessions, dailySessions };
    writeStats(updatedStats);
    return response.status(201).json({
      totalSessions,
      todaySessions: dailySessions[date]
    });
  } catch (error) {
    return response.status(500).json({ error: "Could not save the completed session." });
  }
});

app.use("/api", (request, response) => {
  response.status(404).json({ error: "API route not found." });
});

app.use(express.static(frontendDirectory));

app.get("/", (request, response) => {
  response.sendFile(path.join(frontendDirectory, "index.html"));
});

app.use((request, response) => {
  response.status(404).send("Page not found.");
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Study Timer is running at http://localhost:${port}`);
});
