import React, { createContext, useContext, useState } from "react";

const DriverDataContext = createContext();

export const useDriverData = () => {
  return useContext(DriverDataContext);
};

export const DriverDataProvider = ({ children }) => {
  const [driverData, setDriverData] = useState([]);
  const [vehicleData, setVehicleData] = useState([]);

  return (
    <DriverDataContext.Provider value={{ driverData, setDriverData, vehicleData, setVehicleData }}>
      {children}
    </DriverDataContext.Provider>
  );
};
