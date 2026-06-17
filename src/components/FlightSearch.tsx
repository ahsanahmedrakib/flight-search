"use client";

import {
  ArrowLeftRight,
  Calendar,
  ChevronDown,
  MapPin,
  Minus,
  Plane,
  Plus,
  Search,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useFlight } from "@/store/flightStore";

// Mock Airport Data
const AIRPORTS = [
  { city: "Dhaka", airport: "DAC, Hazrat Shahjalal International Airport" },
  { city: "Cox's Bazar", airport: "CXB, Cox's Bazar Airport" },
  { city: "Chittagong", airport: "CGP, Shah Amanat International" },
  { city: "Sylhet", airport: "ZYL, Osmani International Airport" },
  { city: "Jessore", airport: "JSR, Jessore Airport" },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function FlightSearch() {
  const { searchCriteria, triggerSearch } = useFlight();
  const router = useRouter();
  const pathname = usePathname();
  const isResultsPage = pathname === "/flights";

  // State management for tabs & layouts
  const [activeTab, setActiveTab] = useState("flight");
  const [tripType, setTripType] = useState("one-way");

  // Locations
  const [fromLocation, setFromLocation] = useState(() => {
    const found = AIRPORTS.find(
      (a) => a.city.toLowerCase() === searchCriteria.from.toLowerCase()
    );
    return found || AIRPORTS[0];
  });
  const [toLocation, setToLocation] = useState(() => {
    const found = AIRPORTS.find(
      (a) => a.city.toLowerCase() === searchCriteria.to.toLowerCase()
    );
    return found || AIRPORTS[1];
  });

  // Dates
  const [departureDate, setDepartureDate] = useState(searchCriteria.departureDate);
  const [returnDate, setReturnDate] = useState(searchCriteria.returnDate);

  // Passengers
  const [passengerCount, setPassengerCount] = useState(searchCriteria.passengers);
  const [cabinClass, setCabinClass] = useState(searchCriteria.cabinClass);

  // Dropdown visibility states
  const [isOpenFrom, setIsOpenFrom] = useState(false);
  const [isOpenTo, setIsOpenTo] = useState(false);
  const [isOpenPassengers, setIsOpenPassengers] = useState(false);

  // References for outside click dismissal and Calendar triggers
  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);
  const passengerRef = useRef<HTMLDivElement>(null);

  const departureInputRef = useRef<HTMLInputElement>(null);
  const returnInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (fromRef.current && !fromRef.current.contains(target))
        setIsOpenFrom(false);
      if (toRef.current && !toRef.current.contains(target)) setIsOpenTo(false);
      if (passengerRef.current && !passengerRef.current.contains(target))
        setIsOpenPassengers(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Programmatically trigger native date pickers
  const handleDepartureBoxClick = () => {
    if (departureInputRef.current) {
      try {
        departureInputRef.current.showPicker();
      } catch {
        departureInputRef.current.focus();
      }
    }
  };

  const handleReturnBoxClick = () => {
    if (tripType !== "one-way" && returnInputRef.current) {
      try {
        returnInputRef.current.showPicker();
      } catch {
        returnInputRef.current.focus();
      }
    }
  };

  // Location swapping logic
  const handleSwap = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFromLocation(toLocation);
    setToLocation(fromLocation);
  };

  // Helper formatting logic for display values (deterministic parsing)
  const formatDateDisplay = (dateString: string) => {
    if (!dateString) return "Select Date";
    const parts = dateString.split("-");
    if (parts.length !== 3) return "Select Date";
    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const day = Number(parts[2]);
    return `${day} ${MONTHS[month - 1]} ${year}`;
  };

  const formatWeekdayDisplay = (dateString: string) => {
    if (!dateString) return "";
    const parts = dateString.split("-");
    if (parts.length !== 3) return "";
    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const day = Number(parts[2]);
    const date = new Date(year, month - 1, day);
    return WEEKDAYS[date.getDay()];
  };

  const handleSearchFlight = () => {
    triggerSearch({
      from: fromLocation.city,
      to: toLocation.city,
      departureDate,
      returnDate,
      passengers: passengerCount,
      cabinClass,
    });
    router.push("/flights");
  };

  return (
    <div className={`relative w-full bg-slate-900 font-sans antialiased overflow-hidden ${isResultsPage ? "min-h-0" : "min-h-150"}`}>
      {/* Hero Background Gradient */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none bg-gradient-to-br from-slate-900 via-red-950/40 to-slate-800">
        <div className="absolute inset-0 opacity-20" style={{backgroundImage: "radial-gradient(circle at 20% 50%, rgba(220,38,38,0.4) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(239,68,68,0.3) 0%, transparent 50%)"}} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-10 pb-16 flex flex-col items-center">
        {/* Hero Typography — hidden on results page */}
        {!isResultsPage && (
          <div className="text-center text-white mb-8 space-y-2">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight drop-shadow-md">
              Create A New Story With Every Trip
            </h1>
            <p className="text-sm md:text-lg font-medium opacity-90 tracking-wide drop-shadow-sm">
              Flight, Holiday, Visa &amp; eSIM at your fingertips
            </p>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl md:rounded-full shadow-xl flex flex-wrap md:flex-nowrap p-1.5 justify-center gap-1 -mb-6 z-20 border border-gray-100 max-w-full">
          <button
            onClick={() => setActiveTab("flight")}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-xl md:rounded-full text-sm font-semibold transition-all duration-200 ${
              activeTab === "flight"
                ? "bg-red-50 text-red-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Plane className="w-5 h-5" />
            <span>Flight</span>
          </button>
        </div>

        {/* Main Search Panel */}
        <div className="w-full bg-white rounded-3xl p-6 md:p-8 pt-12 shadow-2xl border border-gray-100">
          {/* Row 1: Trip Type Selection */}
          <div className="flex flex-wrap items-center gap-6 mb-5 text-sm font-medium text-gray-700">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="tripType"
                checked={tripType === "one-way"}
                onChange={() => setTripType("one-way")}
                className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500 accent-red-600"
              />
              <span
                className={`transition-colors ${tripType === "one-way" ? "text-red-600 font-bold" : "group-hover:text-gray-900"}`}
              >
                One Way
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-not-allowed">
              <input
                disabled
                type="radio"
                name="tripType"
                checked={tripType === "round-trip"}
                onChange={() => setTripType("round-trip")}
                className="w-4 h-4 text-gray-400 border-gray-200 accent-gray-400 cursor-not-allowed"
              />
              <span className="text-gray-400 font-medium">Round Trip</span>
            </label>
            <label className="flex items-center gap-2 cursor-not-allowed">
              <input
                disabled
                type="radio"
                name="tripType"
                checked={tripType === "round-trip"}
                onChange={() => setTripType("round-trip")}
                className="w-4 h-4 text-gray-400 border-gray-200 accent-gray-400 cursor-not-allowed"
              />
              <span className="text-gray-400 font-medium">Multy City</span>
            </label>
          </div>

          {/* Row 2: Search Form Matrix Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-2 items-stretch">
            {/* Origin Box (From) */}
            <div
              ref={fromRef}
              onClick={() => setIsOpenFrom(!isOpenFrom)}
              className={`lg:col-span-3 border rounded-xl p-3 px-4 transition-all cursor-pointer relative bg-white ${isOpenFrom ? "border-red-500 ring-2 ring-red-500/10" : "border-gray-200 hover:border-gray-400"}`}
            >
              <span className="block text-xs text-gray-400 font-medium uppercase tracking-wider">
                From
              </span>
              <div className="text-lg font-bold text-gray-800 mt-0.5">
                {fromLocation.city}
              </div>
              <div className="text-xs text-gray-500 truncate mt-0.5">
                {fromLocation.airport}
              </div>

              <button
                onClick={handleSwap}
                type="button"
                className="absolute -right-3.5 top-1/2 -translate-y-1/2 z-30 bg-red-600 text-white rounded-full p-1.5 shadow-md hover:bg-red-700 active:scale-95 transition-all max-lg:hidden border-2 border-white"
                title="Swap Locations"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
              </button>

              {isOpenFrom && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto p-1 py-2">
                  <div className="px-3 pb-1 mb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-50">
                    Select Departure
                  </div>
                  {AIRPORTS.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => setFromLocation(item)}
                      className={`flex items-start gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${fromLocation.city === item.city ? "bg-red-50 text-red-600 font-medium" : "text-gray-700 hover:bg-gray-50"}`}
                    >
                      <MapPin className="w-4 h-4 mt-0.5 shrink-0 opacity-70" />
                      <div>
                        <div className="font-semibold">{item.city}</div>
                        <div className="text-xs text-gray-400 truncate max-w-50">
                          {item.airport}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Destination Box (To) */}
            <div
              ref={toRef}
              onClick={() => setIsOpenTo(!isOpenTo)}
              className={`lg:col-span-3 border rounded-xl p-3 px-4 lg:pl-6 transition-all cursor-pointer relative bg-white ${isOpenTo ? "border-red-500 ring-2 ring-red-500/10" : "border-gray-200 hover:border-gray-400"}`}
            >
              <span className="block text-xs text-gray-400 font-medium uppercase tracking-wider">
                To
              </span>
              <div className="text-lg font-bold text-gray-800 mt-0.5">
                {toLocation.city}
              </div>
              <div className="text-xs text-gray-500 truncate mt-0.5">
                {toLocation.airport}
              </div>

              {isOpenTo && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto p-1 py-2">
                  <div className="px-3 pb-1 mb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-50">
                    Select Arrival
                  </div>
                  {AIRPORTS.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => setToLocation(item)}
                      className={`flex items-start gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${toLocation.city === item.city ? "bg-red-50 text-red-600 font-medium" : "text-gray-700 hover:bg-gray-50"}`}
                    >
                      <MapPin className="w-4 h-4 mt-0.5 shrink-0 opacity-70" />
                      <div>
                        <div className="font-semibold">{item.city}</div>
                        <div className="text-xs text-gray-400 truncate max-w-50">
                          {item.airport}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Departure & Return Split Dynamic Columns */}
            <div className="lg:col-span-4 grid grid-cols-2 border border-gray-200 rounded-xl overflow-hidden divide-x divide-gray-200 hover:border-gray-400 transition-all bg-white">
              {/* Departure Date Click Block */}
              <div
                onClick={handleDepartureBoxClick}
                className="p-3 px-4 flex justify-between items-start cursor-pointer hover:bg-gray-50/50 relative"
              >
                <div className="w-full">
                  <span className="block text-xs text-gray-400 font-medium uppercase tracking-wider">
                    Departure
                  </span>
                  <input
                    ref={departureInputRef}
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="absolute inset-0 pointer-events-none opacity-0 w-full h-full -z-10"
                  />
                  <div className="text-md font-bold text-gray-800 mt-1">
                    {formatDateDisplay(departureDate)}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {formatWeekdayDisplay(departureDate)}
                  </div>
                </div>
                <Calendar className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
              </div>

              {/* Return Date Click Block */}
              <div
                onClick={handleReturnBoxClick}
                className={`p-3 px-4 flex justify-between items-start relative transition-all ${tripType === "one-way" ? "bg-gray-50 cursor-default" : "cursor-pointer hover:bg-gray-50/50"}`}
              >
                <div className="w-full">
                  <span className="block text-xs text-gray-400 font-medium uppercase tracking-wider">
                    Return
                  </span>
                  {tripType === "one-way" ? (
                    <div className="text-xs text-gray-500 font-medium mt-2 leading-tight pr-2">
                      Bigger savings on return flight
                    </div>
                  ) : (
                    <>
                      <input
                        ref={returnInputRef}
                        type="date"
                        value={returnDate}
                        min={departureDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="absolute inset-0 pointer-events-none opacity-0 w-full h-full -z-10"
                      />
                      <div className="text-md font-bold text-gray-800 mt-1">
                        {formatDateDisplay(returnDate)}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {formatWeekdayDisplay(returnDate)}
                      </div>
                    </>
                  )}
                </div>
                {tripType !== "one-way" && (
                  <Calendar className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
                )}
              </div>
            </div>

            {/* Passenger Panel featuring Live Counter (+ / -) Buttons */}
            <div
              ref={passengerRef}
              onClick={() => setIsOpenPassengers(!isOpenPassengers)}
              className={`lg:col-span-2 border rounded-xl p-3 px-4 flex justify-between items-center transition-all cursor-pointer relative bg-white ${isOpenPassengers ? "border-red-500 ring-2 ring-red-500/10" : "border-gray-200 hover:border-gray-400"}`}
            >
              <div>
                <span className="block text-xs text-gray-400 font-medium uppercase tracking-wider">
                  Traveller, Class
                </span>
                <div className="text-md font-bold text-gray-800 mt-0.5">
                  {passengerCount}{" "}
                  {passengerCount === 1 ? "Traveller" : "Travellers"}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{cabinClass}</div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />

              {isOpenPassengers && (
                <div
                  className="absolute right-0 lg:left-0 top-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-50 p-4 w-64"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>Passengers</span>
                    </div>
                    <span className="text-xs text-gray-400">(Max 12)</span>
                  </div>

                  <div className="space-y-4">
                    {/* Passenger Increment / Decrement Row */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500">
                        Number of Seats
                      </span>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setPassengerCount((prev) => Math.max(1, prev - 1))
                          }
                          disabled={passengerCount <= 1}
                          className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center font-bold text-gray-800 text-sm">
                          {passengerCount}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setPassengerCount((prev) => Math.min(12, prev + 1))
                          }
                          disabled={passengerCount >= 12}
                          className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Cabin Class Selection */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-semibold text-gray-500">
                        Cabin Class
                      </span>
                      <select
                        value={cabinClass}
                        onChange={(e) => setCabinClass(e.target.value)}
                        className="text-xs font-semibold border border-gray-200 rounded-md p-1.5 bg-gray-50 text-gray-800 focus:outline-none focus:border-red-500"
                      >
                        <option value="Economy">Economy</option>
                        <option value="Premium Economy">Premium Eco</option>
                        <option value="Business">Business</option>
                        <option value="First Class">First Class</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Row 3: Action Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => handleSearchFlight()}
              type="button"
              className="bg-red-600 cursor-pointer hover:bg-red-700 text-white font-semibold px-10 py-3.5 rounded-xl shadow-lg shadow-red-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <span>{isResultsPage ? "Modify Search" : "Search Flights"}</span>
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
