import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import App from "./App";
import LandingPage from "./pages/LandingPage";
import OperatorPortal from "./pages/OperatorPortal";
import CustomerPortal, {
  CustomerBookingRoute,
  CustomerListingRoute,
  CustomerMyTripsRoute,
  CustomerSearchRoute,
  CustomerSeatSelectionRoute,
} from "./pages/CustomerPortal";

import Dashboard from "./components/operator/Dashboard";
import BusManagement from "./components/operator/BusManagement";
import SeatLayoutDesigner from "./components/operator/SeatLayoutDesigner";
import RouteManagement from "./components/operator/RouteManagement";
import ScheduleManagement from "./components/operator/ScheduleManagement";
import FareManagement from "./components/operator/FareManagement";
import DriverManagement from "./components/operator/DriverManagement";
import Reports from "./components/operator/Reports";
import Branding from "./components/operator/Branding";
import Settings from "./components/operator/Settings";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "operator",
        element: <OperatorPortal />,
        children: [
          {
            index: true,
            element: <Navigate to="dashboard" replace />,
          },
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "buses",
            element: <BusManagement />,
          },
          {
            path: "seats",
            element: <SeatLayoutDesigner />,
          },
          {
            path: "routes",
            element: <RouteManagement />,
          },
          {
            path: "schedules",
            element: <ScheduleManagement />,
          },
          {
            path: "fares",
            element: <FareManagement />,
          },
          {
            path: "drivers",
            element: <DriverManagement />,
          },
          {
            path: "reports",
            element: <Reports />,
          },
          {
            path: "branding",
            element: <Branding />,
          },
          {
            path: "settings",
            element: <Settings />,
          },
        ],
      },
      {
        path: "customer",
        element: <CustomerPortal />,
        children: [
          {
            index: true,
            element: <Navigate to="search" replace />,
          },
          {
            path: "search",
            element: <CustomerSearchRoute />,
          },
          {
            path: "listing",
            element: <CustomerListingRoute />,
          },
          {
            path: "seat-selection",
            element: <CustomerSeatSelectionRoute />,
          },
          {
            path: "booking",
            element: <CustomerBookingRoute />,
          },
          {
            path: "my-trips",
            element: <CustomerMyTripsRoute />,
          },
        ],
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
