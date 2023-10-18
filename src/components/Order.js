import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Order.css";
import { Droppable } from "react-drag-and-drop";
import { useDriverData } from "../context/DriverDataContext";

const Order = () => {
  const [travelOrders, setTravelOrders] = useState([]);
  const { driverData } = useDriverData();
  const { vehicleData } = useDriverData();
  const [driverDropped, setDriverDropped] = useState({});
  const [vehicleDropped, setVehicleDropped] = useState({});
  const [droppedDrivers, setDroppedDrivers] = useState({});
  const [droppedVehicles, setDroppedVehicles] = useState({});
  const [individualOrderCosts, setIndividualOrderCosts] = useState({});
  const [combinedTotalCost, setCombinedTotalCost] = useState(0);
  

  useEffect(() => {
    fetchTravelOrders();
  }, []);

  const fetchTravelOrders = async () => {
    try {
      const response = await axios.get(
        "http://ztraining.zeronetraining.local/api.publish/api/travelorder"
      );
      setTravelOrders(response.data);
    } catch (error) {
      console.error("Error fetching travel orders:", error);
    }
  };

  const calculateOrderCost = (orderId) => {
    const order = travelOrders.find((o) => o.id === orderId);
    if (order) {
      let cost = order.approxDistance * 0.5; // Base cost based on distance
  
      if (driverDropped[orderId]) {
        const driver = droppedDrivers[orderId];
        
        // Check if the driver can drive a heavy vehicle and if the order requires it
        if (order.vehicleType === "H" && driver.posessHeavyVehicleLicense !== true) {
          alert("This driver cannot drive a heavy vehicle.");
          return; // Stop cost calculation
        }
  
        // Calculate the cost based on the rate per kilometer and add overtime emolument
        const driverCost = (order.approxDistance * order.timeNeeded) + driver.overtimeRate;
  
        cost += driverCost;
      }
  
      if (vehicleDropped[orderId]) {
        const vehicle = droppedVehicles[orderId];
  
        // Check if the vehicle is suitable for the order
        if (order.vehicleType === "H" && vehicle.vehicleType !== "heavy") {
          alert("This vehicle is not suitable for a heavy order.");
          return; // Stop cost calculation
        }
  
        // Calculate the cost based on the rate per kilometer and add the vehicle charge
        const vehicleCost = (order.approxDistance * vehicle.perKMCost) ;
  
        cost += vehicleCost;
      }
  
      setIndividualOrderCosts({ ...individualOrderCosts, [orderId]: cost });
  
      // Calculate and update the combinedTotalCost
      const totalCost = Object.values(individualOrderCosts).reduce(
        (total, cost) => total + cost,
        0
      );
      setCombinedTotalCost(totalCost);
    }
  };


  const handleDrop = (e, type, id) => {
    if (driverData) {
      if (type === "driver") {
        if (driverDropped[id]) {
          alert(
            "A driver is already present in this area. Remove the existing driver first."
          );
          
        }
        
        else {
          
          setDriverDropped({ ...driverDropped, [id]: true });
          setDroppedDrivers({ ...droppedDrivers, [id]: driverData });

          // Calculate the cost for the order
          calculateOrderCost(id);
        }
      }
    } else {
      alert("Only drivers can be dropped here");
    }
  };

  const handleVehicleDrop = (e, type, id) => {
    if (vehicleData) {
      if (type === "vehicle") {
        if (vehicleDropped[id]) {
          alert(
            "A vehicle is already present in this area. Remove the existing vehicle first."
          );
        } else {
          setVehicleDropped({ ...vehicleDropped, [id]: true });
          setDroppedVehicles({ ...droppedVehicles, [id]: vehicleData });

          // Calculate the cost for the order
          calculateOrderCost(id);
        }
      }
    } else {
      alert("Only vehicles can be dropped here");
    }
  };

  const removeDriver = (id) => {
    const updatedDroppedDrivers = { ...droppedDrivers };
    delete updatedDroppedDrivers[id];
    setDroppedDrivers(updatedDroppedDrivers);
    setDriverDropped({ ...driverDropped, [id]: false });

    // Update the cost when the driver is removed
    calculateOrderCost(id);
  };

  const removeVehicle = (id) => {
    const updatedDroppedVehicles = { ...droppedVehicles };
    delete updatedDroppedVehicles[id];
    setDroppedVehicles(updatedDroppedVehicles);
    setVehicleDropped({ ...vehicleDropped, [id]: false });

    // Update the cost when the vehicle is removed
    calculateOrderCost(id);
  };

  return (
    <div className="order-container">
      <h2>Orders</h2>

      <div className="travel-orders">
        <h3>Travel Orders</h3>
        <ul>
          {travelOrders.map((order) => (
            <li className="order-item" key={order.id}>
              <Droppable
                type="driver"
                onDrop={(e) => handleDrop(e, "driver", order.id)}
                className="drop-box"
              >
                {driverDropped[order.id] ? (
                  <div>
                    <p>{droppedDrivers[order.id].name}</p>
                    <button onClick={() => removeDriver(order.id)}>
                      Remove
                    </button>
                  </div>
                ) : (
                  <p>Drop Driver Here</p>
                )}
              </Droppable>
              <Droppable
                type="vehicle"
                onDrop={(e) => handleVehicleDrop(e, "vehicle", order.id)}
                className="drop-box"
              >
                {vehicleDropped[order.id] ? (
                  <div>
                    <p>{droppedVehicles[order.id].name}</p>
                    <button onClick={() => removeVehicle(order.id)}>
                      Remove
                    </button>
                  </div>
                ) : (
                  <p>Drop Vehicle Here</p>
                )}
              </Droppable>
              <div className="driver-info">
                <p>From Location: {order.fromLocation}</p>
                <p>Destination: {order.toLocation}</p>
                <p>Approx. Distance: {order.approxDistance}</p>
                {driverDropped[order.id] && vehicleDropped[order.id] ? (
                  <p>Order Cost: {individualOrderCosts[order.id]} RS</p>
                ) : null}
                
              </div>
            </li>
          ))}
        </ul>
      </div>
     
    </div>
  );
};

export default Order;
