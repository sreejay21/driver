import React, { useEffect, useState } from "react";
import axios from "axios";
import './Driver.css'
import { Draggable } from 'react-drag-and-drop';
import { useDriverData } from "../context/DriverDataContext"; // Import the context hook

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const { setDriverData } = useDriverData(); // Access the context function

  useEffect(() => {
    // Fetch the list of drivers when the component mounts
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const response = await axios.get(
        "http://ztraining.zeronetraining.local/api.publish/api/driver"
      );
      setDrivers(response.data);
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  };

  const handleDragStart = (e, driver) => {
    // Set the driver data in the context
    setDriverData(driver);
    
  };

  return (
    <div className="drivers-container">
      <h2>Drivers List</h2>
      <div className="driver-list">
        <ul>
          {drivers.map((driver) => (
            <Draggable type="driver" data={driver.id} key={driver.id}>
              <li className="driver-item" 
                  onDragStart={(e) => handleDragStart(e, driver)} draggable="true">
                <div className="driver-info">
                  <p>Driver Name: {driver.name}</p>
                  <p>License: {driver.posessHeavyVehicleLicence ? "Heavy" : "Regular"}</p>
                  <p>Per Day Rate: {driver.perDayRate}/-</p>
                  <p>Over Time Rate: {driver.overtimeRate}/-</p>
                  <p>Mobile Number: {driver.mobileNumber}</p>
                </div>
              </li>
            </Draggable>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Drivers;
