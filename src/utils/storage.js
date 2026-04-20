import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "pgsync_pro_v1"; // New versioned key to ignore dirty legacy data
const LEGACY_KEY = "pgsync_data";

// One-time cleanup of contaminated legacy records
if (localStorage.getItem(LEGACY_KEY)) {
  localStorage.removeItem(LEGACY_KEY);
}

const INITIAL_STATE = {
  rooms: [],
  residents: [],
  complaints: [],
  rents: [],
  activityLogs: []
};

/**
 * getData: Core retrieval logic for persistent property data.
 * Returns INITIAL_STATE if no existing data is found.
 */
export const getData = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    return INITIAL_STATE;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error("Storage Retrieval Error:", e);
    return INITIAL_STATE;
  }
};

/**
 * saveData: Core persistence logic.
 */
export const saveData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

/**
 * addLog: Appends a system activity record to the audit trail.
 */
export const addLog = (action) => {
  const data = getData();
  const newLog = { 
    id: uuidv4(), 
    action, 
    timestamp: new Date().toISOString() 
  };
  data.activityLogs.unshift(newLog);
  if (data.activityLogs.length > 50) data.activityLogs.pop(); 
  saveData(data);
};

/**
 * resetData: Explicit environment wipe.
 */
export const resetData = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STATE));
  return INITIAL_STATE;
};

// Simplified Authentication Service (Simulated)
export const getCurrentUser = () => {
  const user = localStorage.getItem("pgsync_user");
  return user ? JSON.parse(user) : null;
};

export const login = (email, password) => {
  const username = email.split('@')[0];
  const user = { email, username, loginTime: new Date().toISOString() };
  localStorage.setItem("pgsync_user", JSON.stringify(user));
  addLog(`User ${username} authorized`);
  return user;
};

export const logout = () => {
  localStorage.removeItem("pgsync_user");
};
