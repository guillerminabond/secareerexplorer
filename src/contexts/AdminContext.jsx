import React, { createContext, useContext, useState } from "react";

const AdminContext = createContext({ adminMode: false, setAdminMode: () => {} });

export function AdminProvider({ children }) {
  const [adminMode, setAdminMode] = useState(false);
  return (
    <AdminContext.Provider value={{ adminMode, setAdminMode }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
