import React from "react";
import ReactDOM from "react-dom/client"; // Import from react-dom/client
import { DriverDataProvider } from "./context/DriverDataContext";
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DriverDataProvider>
      <App />
    </DriverDataProvider>
  </React.StrictMode>
);