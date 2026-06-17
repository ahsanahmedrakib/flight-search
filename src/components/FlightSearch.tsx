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
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// Mock Airport Data
const AIRPORTS = [
  { city: "Dhaka", airport: "DAC, Hazrat Shahjalal International Airport" },
  { city: "Cox's Bazar", airport: "CXB, Cox's Bazar Airport" },
  { city: "Chittagong", airport: "CGP, Shah Amanat International" },
  { city: "Sylhet", airport: "ZYL, Osmani International Airport" },
  { city: "Jessore", airport: "JSR, Jessore Airport" },
];

export default function FlightSearch() {
  // State management for tabs & layouts
  const [activeTab, setActiveTab] = useState("flight");
  const [tripType, setTripType] = useState("one-way");

  // Locations
  const [fromLocation, setFromLocation] = useState(AIRPORTS[0]); // Default: Dhaka
  const [toLocation, setToLocation] = useState(AIRPORTS[1]); // Default: Cox's Bazar

  // Dates
  const [departureDate, setDepartureDate] = useState("2026-06-19");
  const [returnDate, setReturnDate] = useState("2026-06-26");

  // Passengers
  const [passengerCount, setPassengerCount] = useState(1);
  const [cabinClass, setCabinClass] = useState("Economy");

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
      } catch (e) {
        departureInputRef.current.focus();
        console.error(e);
      }
    }
  };

  const handleReturnBoxClick = () => {
    if (tripType !== "one-way" && returnInputRef.current) {
      try {
        returnInputRef.current.showPicker();
      } catch (e) {
        returnInputRef.current.focus();
        console.error(e);
      }
    }
  };

  // Location swapping logic
  const handleSwap = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFromLocation(toLocation);
    setToLocation(fromLocation);
  };

  // Helper formatting logic for display values
  const formatDateDisplay = (dateString: string) => {
    if (!dateString) return "Select Date";
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatWeekdayDisplay = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
    });
  };

  const handleSearchFlight = () => {
    console.log("flight searched");
  };

  return (
    <div className="relative min-h-150 w-full bg-slate-900 font-sans antialiased overflow-hidden">
      {/* Hero Background Image */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <Image
          src="/path-to-your-beach-image.jpg"
          alt="Beach holiday background"
          fill
          priority
          className="object-cover object-center brightness-[0.85]"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/10" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-16 pb-24 flex flex-col items-center">
        {/* Hero Typography */}
        <div className="text-center text-white mb-8 space-y-2">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight drop-shadow-md">
            Create A New Story With Every Trip
          </h1>
          <p className="text-sm md:text-lg font-medium opacity-90 tracking-wide drop-shadow-sm">
            Flight, Holiday, Visa & eSIM at your fingertips
          </p>
        </div>

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

          {/* Row 3: Action Execution Execution Button Trigger */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => handleSearchFlight()}
              type="button"
              className="bg-red-600 cursor-pointer hover:bg-red-700 text-white font-semibold px-10 py-3.5 rounded-xl shadow-lg shadow-red-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <span>Search Flights</span>
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
