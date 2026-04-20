import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "pgsync_pro_data";

export const getData = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    return seedData();
  }
  return JSON.parse(data);
};

export const saveData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const seedData = () => {
  const rooms = [];
  const blocks = ["A", "B"];
  const floors = [1, 2, 3];
  
  // Create 10 rooms with capacity 2-3
  let roomIndex = 1;
  for (const b of blocks) {
    for (const f of floors) {
      if (roomIndex > 10) break;
      const roomNumber = `${f}0${roomIndex % 4 || 4}`;
      rooms.push({
        id: uuidv4(),
        number: roomNumber,
        block: b,
        floor: f,
        capacity: 2,
        occupied: 0
      });
      roomIndex++;
    }
  }

  const residents = [
    {
      id: uuidv4(),
      name: "Aryan Sharma",
      phone: "9876543210",
      roomId: rooms[0].id,
      bedId: "B1",
      rent: 5000,
      deposit: 10000,
      joinDate: "2024-03-15",
      paid: true,
      addons: { wifi: true, mess: true }
    },
    {
      id: uuidv4(),
      name: "Sneha Reddy",
      phone: "9123456789",
      roomId: rooms[0].id,
      bedId: "B2",
      rent: 5000,
      deposit: 10000,
      joinDate: "2024-03-20",
      paid: false,
      addons: { wifi: true, mess: false }
    },
    {
      id: uuidv4(),
      name: "Vikram Singh",
      phone: "8887776665",
      roomId: rooms[1].id,
      bedId: "B1",
      rent: 5000,
      deposit: 10000,
      joinDate: "2023-12-01",
      paid: true,
      addons: { wifi: false, mess: true }
    }
  ];

  // Update room occupancy for seeded residents
  residents.forEach(res => {
    const room = rooms.find(r => r.id === res.roomId);
    if (room) room.occupied++;
  });

  const complaints = [
    {
      id: uuidv4(),
      text: "AC remote not working in A-104",
      status: "open",
      priority: "high",
      assignedTo: "Staff-Rahul",
      createdAt: new Date().toISOString()
    }
  ];

  const activityLogs = [
    { id: uuidv4(), action: "System Initialized", timestamp: new Date().toISOString() },
    { id: uuidv4(), action: "Seed data populated for 10 rooms", timestamp: new Date().toISOString() }
  ];

  const initialData = {
    blocks: ["A", "B"],
    rooms,
    residents,
    complaints,
    activityLogs
  };

  saveData(initialData);
  return initialData;
};

export const addLog = (action) => {
  const data = getData();
  const newLog = { id: uuidv4(), action, timestamp: new Date().toISOString() };
  data.activityLogs.unshift(newLog);
  if (data.activityLogs.length > 20) data.activityLogs.pop(); // Keep last 20
  saveData(data);
};
