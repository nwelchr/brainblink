import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./globals.css";

const App = () => (
  <div className="p-4 bg-gray-800 min-h-screen text-gray-300">
    <h1 className="text-3xl font-bold">Welcome to BrainBlink</h1>
    <p>Have a lovely working session.</p>
  </div>
);

const Results = () => {
  const [sessionData, setSessionData] = React.useState({
    duration: 0,
    distractions: 0,
  });

  React.useEffect(() => {
    const { ipcRenderer } = window.require("electron");
    ipcRenderer.on("session-data", (event, data) => {
      setSessionData(data);
    });

    return () => {
      ipcRenderer.removeAllListeners("session-data");
    };
  }, []);

  const formatTime = (seconds) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <div className="p-4 bg-gray-800 min-h-screen text-gray-300">
      <h2 className="text-2xl font-bold">Session Results</h2>
      <p>Duration: {formatTime(sessionData.duration)}</p>
      <p>Distractions: {sessionData.distractions}</p>
      {/* TODO: Add graph visualization here */}
      {/* TODO: Add notes section here */}
    </div>
  );
};

const Root = () => (
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/results" element={<Results />} />
    </Routes>
  </Router>
);

const root = createRoot(document.getElementById("root"));
root.render(<Root />);
