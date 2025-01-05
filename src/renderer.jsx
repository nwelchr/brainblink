import React from "react";
import { createRoot } from "react-dom/client";
import "./globals.css";

const App = () => (
  <div>
    <h1 className="text-gray-300">Welcome to BrainBlink</h1>
    <p>Your journey tos smarter thinking stsarts here.</p>
  </div>
);

const root = createRoot(document.getElementById("root"));
root.render(<App />);
