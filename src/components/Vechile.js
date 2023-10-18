
import React, { useEffect, useState } from "react";
import axios from "axios";
import './Vechile.css'
import { Draggable } from 'react-drag-and-drop';
import { useDriverData } from "../context/DriverDataContext";

const Vechile = () => {
    const [vechiles, setVechile] = useState([]);
    const { setVehicleData } = useDriverData();
    useEffect(() => {
        // Fetch the list of drivers when the component mounts
        fetchVechile();
      }, []);
  
      const fetchVechile = async () => {
        try {
          const response = await axios.get(
            "http://ztraining.zeronetraining.local/api.publish/api/vehicle"
          );
          setVechile(response.data);
        } catch (error) {
          console.error("Error fetching drivers:", error);
        }
      };

      const handleDragStart = (e, vechile) => {
        setVehicleData(vechile);
        
      };
    
    
    return  (
        <div className="vechile-container">
          <h2>Vechile List</h2>
          <div className="vechile-list">
            <ul>
              {vechiles.map((vechile) => (
                <Draggable type="vechile" data={vechile} key={vechile.id}>
                  <li className="vechile-item" 
                      onDragStart={(e) => handleDragStart(e, vechile)} draggable="true">
                    <div className="vechile-info">
                      <p>Vechile Name: {vechile.name}</p>
                      <p>Model: {vechile.makeModel}</p>
                      <p>Registration Number: {vechile.registrationNumber}/-</p>
                      <p>Per Km Rate: {vechile.perKMCost}/-</p>
                      <p>Vechile Type: {vechile.vehicleType }</p>
                    </div>
                  </li>
                </Draggable>
              ))}
            </ul>
          </div>
        </div>
      );
}

export default Vechile
