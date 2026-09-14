import { useState } from "react";
import {
  Navigate,
  Outlet,
  useNavigate,
  useOutletContext,
} from "react-router-dom";

import SearchPage from "../components/customer/SearchPage";
import BusListing from "../components/customer/BusListing";
import SeatSelection from "../components/customer/SeatSelection";
import BookingFlow from "../components/customer/BookingFlow";
import MyTrips from "../components/customer/MyTrips";
import LoginModal from "../components/customer/LoginModal";
import { busSearchResults } from "../data/mockData";

type CustomerPortalContext = {
  searchParams: {
    from: string;
    to: string;
    date: string;
  };
  selectedBus: (typeof busSearchResults)[0] | null;
  selectedSeats: string[];
  selectedFareMap: Record<string, number>;
  handleSearch: (from: string, to: string, date: string) => void;
  handleSelectBus: (bus: (typeof busSearchResults)[0]) => void;
  handleBook: (seats: string[], fareMap: Record<string, number>) => void;
  openLogin: () => void;
};

function CustomerPortal() {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useState({
    from: "Mumbai",
    to: "Pune",
    date: "2026-09-10",
  });
  const [selectedBus, setSelectedBus] = useState<
    (typeof busSearchResults)[0] | null
  >(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedFareMap, setSelectedFareMap] = useState<
    Record<string, number>
  >({});
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSearch = (from: string, to: string, date: string) => {
    setSearchParams({ from, to, date });
    navigate("/customer/listing");
  };

  const handleSelectBus = (bus: (typeof busSearchResults)[0]) => {
    setSelectedBus(bus);
    navigate("/customer/seat-selection");
  };

  const handleBook = (seats: string[], fareMap: Record<string, number>) => {
    setSelectedSeats(seats);
    setSelectedFareMap(fareMap);

    if (!isLoggedIn) {
      setShowLogin(true);
    } else {
      navigate("/customer/booking");
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowLogin(false);
    navigate("/customer/booking");
  };

  const context: CustomerPortalContext = {
    searchParams,
    selectedBus,
    selectedSeats,
    selectedFareMap,
    handleSearch,
    handleSelectBus,
    handleBook,
    openLogin: () => setShowLogin(true),
  };

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#F8FAFC" }}>
      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} onLogin={handleLogin} />
      )}

      <Outlet context={context} />
    </div>
  );
}

export function CustomerSearchRoute() {
  const { handleSearch, openLogin } = useOutletContext<CustomerPortalContext>();
  const navigate = useNavigate();

  return (
    <SearchPage
      onSearch={handleSearch}
      onLogin={openLogin}
      onMyTrips={() => navigate("/customer/my-trips")}
    />
  );
}

export function CustomerListingRoute() {
  const { searchParams, handleSelectBus } =
    useOutletContext<CustomerPortalContext>();
  const navigate = useNavigate();

  return (
    <BusListing
      from={searchParams.from}
      to={searchParams.to}
      date={searchParams.date}
      onSelect={handleSelectBus}
      onBack={() => navigate("/customer/search")}
    />
  );
}

export function CustomerSeatSelectionRoute() {
  const { selectedBus, handleBook } = useOutletContext<CustomerPortalContext>();
  const navigate = useNavigate();

  if (!selectedBus) {
    return <Navigate to="/customer/search" replace />;
  }

  return (
    <SeatSelection
      bus={selectedBus}
      onBook={handleBook}
      onBack={() => navigate("/customer/listing")}
    />
  );
}

export function CustomerBookingRoute() {
  const { selectedBus, selectedSeats, selectedFareMap } =
    useOutletContext<CustomerPortalContext>();
  const navigate = useNavigate();

  if (!selectedBus) {
    return <Navigate to="/customer/search" replace />;
  }

  return (
    <BookingFlow
      bus={selectedBus}
      seats={selectedSeats}
      fareMap={selectedFareMap}
      onDone={() => navigate("/customer/search")}
      onBack={() => navigate("/customer/seat-selection")}
    />
  );
}

export function CustomerMyTripsRoute() {
  const navigate = useNavigate();

  return <MyTrips onBack={() => navigate("/customer/search")} />;
}

export default CustomerPortal;
