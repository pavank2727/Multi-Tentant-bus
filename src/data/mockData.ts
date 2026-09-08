export const operator = {
  name: "Rajdhani Travels Pvt. Ltd.",
  id: "OP-2024-0842",
  gst: "29AABCR1234A1ZX",
  since: "2014",
  branches: ["Mumbai HQ", "Pune", "Nashik", "Aurangabad"],
  totalBuses: 48,
  activeRoutes: 31,
  driversOnRoll: 96,
};

export const buses = [
  { id: "MH-12-AB-4521", type: "Sleeper", subtype: "AC", capacity: 40, status: "running", driver: "Ramesh Patil", route: "Mumbai → Pune", amenities: ["WiFi", "Charging", "Blanket", "Water Bottle"], nextService: "2026-09-15", fitness: "2027-03-10", rating: 4.6 },
  { id: "MH-12-CD-7803", type: "Semi Sleeper", subtype: "AC", capacity: 45, status: "running", driver: "Suresh Desai", route: "Pune → Nashik", amenities: ["Charging", "Water Bottle"], nextService: "2026-10-01", fitness: "2027-01-22", rating: 4.3 },
  { id: "MH-12-EF-1192", type: "Seater", subtype: "Non-AC", capacity: 52, status: "idle", driver: "Mahesh Jadhav", route: "—", amenities: ["Water Bottle"], nextService: "2026-09-20", fitness: "2026-12-05", rating: 4.1 },
  { id: "MH-12-GH-3374", type: "Sleeper", subtype: "AC", capacity: 40, status: "maintenance", driver: "Anand Kulkarni", route: "—", amenities: ["WiFi", "Charging", "Blanket", "Water Bottle"], nextService: "2026-09-08", fitness: "2027-06-14", rating: 4.8 },
  { id: "MH-12-IJ-5566", type: "Semi Sleeper", subtype: "Non-AC", capacity: 45, status: "running", driver: "Vijay Pawar", route: "Mumbai → Aurangabad", amenities: ["Charging"], nextService: "2026-10-12", fitness: "2027-04-30", rating: 4.2 },
  { id: "MH-12-KL-8891", type: "Sleeper", subtype: "AC", capacity: 40, status: "running", driver: "Ganesh More", route: "Nashik → Mumbai", amenities: ["WiFi", "Charging", "Blanket"], nextService: "2026-11-05", fitness: "2027-08-18", rating: 4.7 },
];

export const routes = [
  { id: "RT-001", from: "Mumbai (Dadar)", to: "Pune (Shivajinagar)", distance: 155, duration: "3h 30m", boardingPoints: ["Dadar TT", "Sion", "Vashi"], droppingPoints: ["Wakad", "Pimpri", "Shivajinagar", "Swargate"], viaPoints: ["Khopoli", "Khalapur"], activeSchedules: 12, avgOccupancy: 84 },
  { id: "RT-002", from: "Pune (Swargate)", to: "Nashik (CBS)", distance: 212, duration: "4h 15m", boardingPoints: ["Swargate", "Hadapsar", "Shirur"], droppingPoints: ["Sinnar", "Nashik CBS", "Nashik Road"], viaPoints: ["Sangamner", "Kopargaon"], activeSchedules: 6, avgOccupancy: 71 },
  { id: "RT-003", from: "Mumbai (Borivali)", to: "Aurangabad", distance: 392, duration: "6h 45m", boardingPoints: ["Borivali", "Andheri", "Thane"], droppingPoints: ["Jalna Road", "Aurangabad CBS", "Cidco"], viaPoints: ["Igatpuri", "Manmad", "Aurangabad"], activeSchedules: 4, avgOccupancy: 68 },
  { id: "RT-004", from: "Nashik (CBS)", to: "Mumbai (Dadar)", distance: 185, duration: "4h 00m", boardingPoints: ["Nashik CBS", "Dindori Naka", "Ghoti"], droppingPoints: ["Thane", "Dadar", "Borivali"], viaPoints: ["Igatpuri", "Shahapur"], activeSchedules: 8, avgOccupancy: 91 },
];

export const schedules = [
  { id: "SCH-001", route: "Mumbai → Pune", bus: "MH-12-AB-4521", busType: "AC Sleeper", departure: "22:00", arrival: "01:30+1", driver: "Ramesh Patil", conductor: "Arjun Salve", date: "Daily", bookedSeats: 34, totalSeats: 40, status: "active", fare: 650 },
  { id: "SCH-002", route: "Mumbai → Pune", bus: "MH-12-CD-7803", busType: "AC Semi Sleeper", departure: "06:30", arrival: "10:00", driver: "Suresh Desai", conductor: "Rakesh Tupe", date: "Daily", bookedSeats: 28, totalSeats: 45, status: "active", fare: 420 },
  { id: "SCH-003", route: "Pune → Nashik", bus: "MH-12-EF-1192", busType: "Non-AC Seater", departure: "07:00", arrival: "11:15", driver: "Mahesh Jadhav", conductor: "Sanjay Bhoir", date: "Mon-Sat", bookedSeats: 41, totalSeats: 52, status: "active", fare: 280 },
  { id: "SCH-004", route: "Mumbai → Aurangabad", bus: "MH-12-IJ-5566", busType: "Non-AC Semi Sleeper", departure: "20:30", arrival: "03:15+1", driver: "Vijay Pawar", conductor: "Krishna Naik", date: "Daily", bookedSeats: 22, totalSeats: 45, status: "active", fare: 580 },
  { id: "SCH-005", route: "Nashik → Mumbai", bus: "MH-12-KL-8891", busType: "AC Sleeper", departure: "21:45", arrival: "01:45+1", driver: "Ganesh More", conductor: "Pratap Shinde", date: "Daily", bookedSeats: 38, totalSeats: 40, status: "active", fare: 720 },
];

export const trips = [
  { pnr: "RDT8X42K", route: "Mumbai → Pune", date: "2026-09-10", departure: "22:00", bus: "MH-12-AB-4521", seats: ["L3", "L4"], passengers: ["Priya Sharma", "Rohit Sharma"], fare: 1300, status: "upcoming", boardingPoint: "Dadar TT", droppingPoint: "Shivajinagar" },
  { pnr: "RDT2M91P", route: "Nashik → Mumbai", date: "2026-08-28", departure: "21:45", bus: "MH-12-KL-8891", seats: ["U7"], passengers: ["Priya Sharma"], fare: 720, status: "completed", boardingPoint: "Nashik CBS", droppingPoint: "Dadar" },
  { pnr: "RDT5C33Q", route: "Mumbai → Aurangabad", date: "2026-08-14", departure: "20:30", bus: "MH-12-IJ-5566", seats: ["A12", "A13"], passengers: ["Priya Sharma", "Anita Sharma"], fare: 1160, status: "cancelled", boardingPoint: "Andheri", droppingPoint: "Aurangabad CBS" },
];

export const revenueData = [
  { month: "Mar", revenue: 1820000, trips: 284, occupancy: 78 },
  { month: "Apr", revenue: 2140000, trips: 321, occupancy: 81 },
  { month: "May", revenue: 2380000, trips: 356, occupancy: 84 },
  { month: "Jun", revenue: 1960000, trips: 298, occupancy: 72 },
  { month: "Jul", revenue: 2210000, trips: 334, occupancy: 79 },
  { month: "Aug", revenue: 2640000, trips: 389, occupancy: 88 },
  { month: "Sep", revenue: 1840000, trips: 271, occupancy: 82 },
];

export const drivers = [
  { id: "DRV-001", name: "Ramesh Patil", license: "MH12 20180042561", licenseExpiry: "2028-06-15", experience: "12 yrs", trips: 1842, rating: 4.8, status: "on-duty", contact: "+91 98765 43210", currentBus: "MH-12-AB-4521" },
  { id: "DRV-002", name: "Suresh Desai", license: "MH12 20160038124", licenseExpiry: "2027-03-22", experience: "10 yrs", trips: 1521, rating: 4.6, status: "on-duty", contact: "+91 98234 56789", currentBus: "MH-12-CD-7803" },
  { id: "DRV-003", name: "Mahesh Jadhav", license: "MH12 20190051234", licenseExpiry: "2029-09-10", experience: "7 yrs", trips: 892, rating: 4.4, status: "on-duty", contact: "+91 97654 32109", currentBus: "MH-12-EF-1192" },
  { id: "DRV-004", name: "Anand Kulkarni", license: "MH12 20150029876", licenseExpiry: "2025-11-30", experience: "15 yrs", trips: 2341, rating: 4.9, status: "off-duty", contact: "+91 96543 21098", currentBus: "MH-12-GH-3374" },
  { id: "DRV-005", name: "Vijay Pawar", license: "MH12 20200067891", licenseExpiry: "2030-04-18", experience: "6 yrs", trips: 743, rating: 4.3, status: "on-duty", contact: "+91 95432 10987", currentBus: "MH-12-IJ-5566" },
];

export const fares = [
  { routeId: "RT-001", route: "Mumbai → Pune", seatType: "Sleeper Lower", baseFare: 650, festivalFare: 850, lastMinuteFare: 550, discount: 10 },
  { routeId: "RT-001", route: "Mumbai → Pune", seatType: "Sleeper Upper", baseFare: 600, festivalFare: 780, lastMinuteFare: 500, discount: 10 },
  { routeId: "RT-001", route: "Mumbai → Pune", seatType: "Semi Sleeper", baseFare: 420, festivalFare: 560, lastMinuteFare: 380, discount: 5 },
  { routeId: "RT-002", route: "Pune → Nashik", seatType: "Seater", baseFare: 280, festivalFare: 350, lastMinuteFare: 240, discount: 0 },
  { routeId: "RT-003", route: "Mumbai → Aurangabad", seatType: "Sleeper Lower", baseFare: 850, festivalFare: 1100, lastMinuteFare: 720, discount: 15 },
  { routeId: "RT-004", route: "Nashik → Mumbai", seatType: "Sleeper Upper", baseFare: 720, festivalFare: 950, lastMinuteFare: 620, discount: 5 },
];

export type SeatStatus = "available" | "booked" | "female" | "selected" | "empty";

export interface Seat {
  id: string;
  label: string;
  status: SeatStatus;
  type: "lower" | "upper" | "seater";
  gender?: "any" | "female-only";
}

export const generateSleeperLayout = (): (Seat | null)[][] => {
  const rows = 10;
  const layout: (Seat | null)[][] = [];
  const statuses: SeatStatus[] = ["available", "booked", "female", "available", "available", "booked", "available", "available", "female", "booked"];

  for (let r = 0; r < rows; r++) {
    const status = statuses[r];
    layout.push([
      { id: `L${r + 1}`, label: `L${r + 1}`, status: r < 5 ? status : "available", type: "lower" },
      { id: `U${r + 1}`, label: `U${r + 1}`, status: r >= 5 ? status : "available", type: "upper" },
    ]);
  }
  return layout;
};

export const generate2x2Layout = (): (Seat | null)[][] => {
  const layout: (Seat | null)[][] = [];
  const labels = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
  const statuses: SeatStatus[] = ["booked", "available", "available", "female", "available", "booked", "available", "available", "booked", "available", "available", "available", "available"];

  for (let r = 0; r < 13; r++) {
    layout.push([
      { id: `${labels[r]}1`, label: `${labels[r]}1`, status: statuses[r], type: "seater" },
      { id: `${labels[r]}2`, label: `${labels[r]}2`, status: statuses[Math.floor(r * 1.3) % 13], type: "seater" },
      null,
      { id: `${labels[r]}3`, label: `${labels[r]}3`, status: statuses[(r + 3) % 13], type: "seater" },
      { id: `${labels[r]}4`, label: `${labels[r]}4`, status: statuses[(r + 5) % 13], type: "seater" },
    ]);
  }
  return layout;
};

export const busSearchResults = [
  {
    id: "BUS-001",
    operator: "Rajdhani Travels",
    busName: "Rajdhani Premium",
    busType: "AC Sleeper",
    departure: "22:00",
    arrival: "01:30+1",
    duration: "3h 30m",
    from: "Mumbai",
    to: "Pune",
    boardingPoint: "Dadar TT",
    droppingPoint: "Shivajinagar",
    totalSeats: 40,
    availableSeats: 6,
    fare: 650,
    rating: 4.6,
    reviews: 1284,
    amenities: ["WiFi", "Charging", "Blanket", "Water Bottle"],
    busNumber: "MH-12-AB-4521",
  },
  {
    id: "BUS-002",
    operator: "VRL Travels",
    busName: "VRL Volvo AC",
    busType: "AC Sleeper",
    departure: "21:30",
    arrival: "01:00+1",
    duration: "3h 30m",
    from: "Mumbai",
    to: "Pune",
    boardingPoint: "Borivali",
    droppingPoint: "Swargate",
    totalSeats: 44,
    availableSeats: 12,
    fare: 720,
    rating: 4.4,
    reviews: 892,
    amenities: ["Charging", "Blanket", "Water Bottle"],
    busNumber: "KA-02-F-4892",
  },
  {
    id: "BUS-003",
    operator: "Neeta Tours",
    busName: "Neeta Express",
    busType: "Non-AC Semi Sleeper",
    departure: "06:30",
    arrival: "10:15",
    duration: "3h 45m",
    from: "Mumbai",
    to: "Pune",
    boardingPoint: "Dadar",
    droppingPoint: "Shivajinagar",
    totalSeats: 45,
    availableSeats: 23,
    fare: 320,
    rating: 4.1,
    reviews: 2341,
    amenities: ["Water Bottle"],
    busNumber: "MH-09-BC-7124",
  },
  {
    id: "BUS-004",
    operator: "Konduskar Travels",
    busName: "Konduskar Luxury",
    busType: "AC Seater",
    departure: "07:15",
    arrival: "11:00",
    duration: "3h 45m",
    from: "Mumbai",
    to: "Pune",
    boardingPoint: "Thane",
    droppingPoint: "Wakad",
    totalSeats: 52,
    availableSeats: 34,
    fare: 380,
    rating: 4.3,
    reviews: 654,
    amenities: ["WiFi", "Charging"],
    busNumber: "MH-06-AB-1832",
  },
  {
    id: "BUS-005",
    operator: "Rajdhani Travels",
    busName: "Rajdhani Night Rider",
    busType: "AC Sleeper",
    departure: "23:15",
    arrival: "02:45+1",
    duration: "3h 30m",
    from: "Mumbai",
    to: "Pune",
    boardingPoint: "Andheri",
    droppingPoint: "Kothrud",
    totalSeats: 40,
    availableSeats: 2,
    fare: 680,
    rating: 4.8,
    reviews: 988,
    amenities: ["WiFi", "Charging", "Blanket", "Water Bottle"],
    busNumber: "MH-12-KL-8891",
  },
];
