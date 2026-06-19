"use client";

import { useFlight } from "@/store/flightStore";
import { Flight } from "@/types/flight";
import {
  ChevronDown,
  ChevronUp,
  Moon,
  Sun,
  Sunrise,
  Sunset,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

const FlightFilterSidebar = () => {
  const { filters, setFilters, flights, searchCriteria, setSelectedAirline } =
    useFlight();
  const passengers = searchCriteria.passengers;

  const handleResetFilters = () => {
    setSelectedAirline(null);
    setFilters({
      selectedTime: null,
      partiallyRefundable: false,
      layoverTime: 15,
      selectedAircraft: [],
      selectedAirlines: [],
      maxPrice: 0,
      stopsFilter: "all",
      mealsIncluded: false,
      seatSelectionIncluded: false,
      changeAllowed: false,
      minPunctuality: 0,
    });
  };

  const airlineOptions = useMemo(() => {
    const seen = new Map<
      string,
      { name: string; logo: string; minPrice: number }
    >();
    flights.forEach((f) => {
      const existing = seen.get(f.airline.code);
      if (!existing) {
        seen.set(f.airline.code, {
          name: f.airline.name,
          logo: f.airline.logo,
          minPrice: f.price.total,
        });
      } else if (f.price.total < existing.minPrice) {
        existing.minPrice = f.price.total;
      }
    });
    return Array.from(seen.entries()).map(([code, data]) => ({
      code,
      ...data,
    }));
  }, [flights]);

  const aircraftOptions = useMemo(() => {
    const seen = new Map<string, string>();
    flights.forEach((f) => {
      const code = f.aircraft.model.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
      if (!seen.has(code))
        seen.set(code, `${f.aircraft.manufacturer} ${f.aircraft.model}`);
    });
    return Array.from(seen.entries()).map(([code, label]) => ({ code, label }));
  }, [flights]);

  const maxLayoverHours = useMemo(() => {
    let max = 0;
    flights.forEach((f) => {
      if (f.stops > 0) {
        const total = f.stopDetails.reduce(
          (acc, s) => acc + (Number(s.durationMinutes) || 0),
          0,
        );
        const hours = Math.ceil(total / 60);
        if (hours > max) max = hours;
      }
    });
    return max > 0 ? max : 15;
  }, [flights]);

  const { minPrice, maxPriceLimit } = useMemo(() => {
    if (flights.length === 0) return { minPrice: 0, maxPriceLimit: 0 };
    const prices = flights.map((f) => f.price.total * passengers);
    return {
      minPrice: Math.min(...prices),
      maxPriceLimit: Math.max(...prices),
    };
  }, [flights, passengers]);

  const [sections, setSections] = useState({
    price: true,
    stops: true,
    airlines: true,
    refundability: true,
    amenities: true,
    layover: true,
    aircraft: true,
    punctuality: true,
  });

  const availableAmenities = useMemo(() => {
    const config = {
      mealsIncluded: "Meals Included",
      seatSelectionIncluded: "Seat Selection Included",
      changeAllowed: "Date Change Allowed",
      refundable: "Refundable",
      priorityBoarding: "Priority Boarding",
      loungeAccess: "Lounge Access",
      wifiAvailable: "Wi-Fi Available",
      entertainmentAvailable: "Entertainment",
      mobileTicketAvailable: "Mobile Ticketing",
    } as const;

    const activeAmenities = new Set<string>();

    flights.forEach((flight: Flight) => {
      (Object.keys(config) as Array<keyof typeof config>).forEach((key) => {
        if (flight[key] === true) {
          activeAmenities.add(key);
        }
      });
    });

    return Array.from(activeAmenities).map((key) => ({
      key,
      label: config[key as keyof typeof config],
    }));
  }, [flights]);

  const toggleSection = (section: keyof typeof sections) =>
    setSections((prev) => ({ ...prev, [section]: !prev[section] }));

  const handleAirlineChange = (code: string) =>
    setFilters((prev) => ({
      ...prev,
      selectedAirlines: prev.selectedAirlines.includes(code)
        ? prev.selectedAirlines.filter((c) => c !== code)
        : [...prev.selectedAirlines, code],
    }));

  const handleAircraftChange = (code: string) =>
    setFilters((prev) => ({
      ...prev,
      selectedAircraft: prev.selectedAircraft.includes(code)
        ? prev.selectedAircraft.filter((c) => c !== code)
        : [...prev.selectedAircraft, code],
    }));

  const sliderStyle = (value: number, min: number, max: number) => ({
    background: `linear-gradient(to right, #00A63E 0%, #00A63E ${((value - min) / (max - min)) * 100}%, #e5e7eb ${((value - min) / (max - min)) * 100}%, #e5e7eb 100%)`,
  });

  const chevron = (open: boolean) =>
    open ? (
      <ChevronUp className="w-4 h-4 text-gray-400" />
    ) : (
      <ChevronDown className="w-4 h-4 text-gray-400" />
    );

  // ==================== DYNAMIC TIME OF DAY ====================
  const timeSlots = useMemo(() => {
    const baseSlots = [
      {
        key: "morning",
        Icon: Sunrise,
        label: "Morning",
        time: "05-11",
        count: 0,
      },
      {
        key: "afternoon",
        Icon: Sun,
        label: "Afternoon",
        time: "12-17",
        count: 0,
      },
      {
        key: "evening",
        Icon: Sunset,
        label: "Evening",
        time: "18-23",
        count: 0,
      },
      { key: "night", Icon: Moon, label: "Night", time: "00-04", count: 0 },
    ];

    const getSlotKey = (departure: string): string => {
      if (!departure) return "night";
      const hour = new Date(departure).getHours();
      if (hour >= 5 && hour <= 11) return "morning";
      if (hour >= 12 && hour <= 17) return "afternoon";
      if (hour >= 18 && hour <= 23) return "evening";
      return "night";
    };

    flights.forEach((flight: Flight) => {
      const key = getSlotKey(flight.departure);
      const slot = baseSlots.find((s) => s.key === key);
      if (slot) slot.count++;
    });

    return baseSlots;
  }, [flights]);

  return (
    <div className="w-full bg-white rounded-2xl lg:shadow-sm lg:border lg:border-gray-100 p-4 lg:p-5 font-sans antialiased text-gray-800 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto scrollbar-thin lg:[&::-webkit-scrollbar]:w-px lg:[&::-webkit-scrollbar-thumb]:bg-green-600 lg:[&::-webkit-scrollbar-thumb]:rounded-full lg:[&::-webkit-scrollbar-track]:bg-transparent">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-gray-900">Filters</h3>
        <button
          onClick={handleResetFilters}
          className="text-xs font-bold text-green-600 hover:text-green-700 transition-colors"
        >
          Reset All
        </button>
      </div>
      <div className="grid grid-cols-4 gap-1.5 mb-6">
        {timeSlots.map(({ key, Icon, label, time, count }) => (
          <button
            key={key}
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                selectedTime: prev.selectedTime === key ? null : key,
              }))
            }
            disabled={count === 0} // ← Disabled when no flights
            className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
              filters.selectedTime === key
                ? "border-green-500 bg-green-50/30 ring-1 ring-green-500"
                : count === 0
                  ? "border-gray-100 bg-gray-50/20 opacity-50 cursor-not-allowed"
                  : "border-gray-100 bg-gray-50/40 hover:border-gray-200"
            }`}
          >
            <Icon
              className={`w-4 h-4 transition-colors ${
                filters.selectedTime === key
                  ? "text-green-500"
                  : count === 0
                    ? "text-gray-300"
                    : "text-gray-400"
              }`}
            />
            <div className="text-[10px] font-bold text-gray-700">{label}</div>
            <div className="text-[9px] text-gray-400">{time}</div>

            {count > 0 ? (
              <div className="text-[9px] font-medium text-green-600 mt-0.5">
                {count}
              </div>
            ) : (
              <div className="text-[9px] text-gray-300 mt-0.5">—</div>
            )}
          </button>
        ))}
      </div>
      <div className="space-y-5 divide-y divide-gray-100">
        {/* 2. Stops */}
        <div className="pt-4 first:pt-0">
          <button
            onClick={() => toggleSection("stops")}
            className="w-full flex items-center justify-between text-sm font-bold text-gray-700 hover:text-gray-900 transition-colors"
          >
            <span>Stops</span>
            {chevron(sections.stops)}
          </button>
          {sections.stops && (
            <div className="mt-3 grid grid-cols-3 gap-1.5 animate-fadeIn">
              {(["all", "nonstop", "1stop"] as const).map((val) => (
                <button
                  key={val}
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, stopsFilter: val }))
                  }
                  className={`py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                    filters.stopsFilter === val
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {val === "all"
                    ? "All"
                    : val === "nonstop"
                      ? "Non-stop"
                      : "1 Stop"}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 3. Price Range */}
        <div className="pt-4">
          <button
            onClick={() => toggleSection("price")}
            className="w-full flex items-center justify-between text-sm font-bold text-gray-700 hover:text-gray-900 transition-colors"
          >
            <span>Price Range</span>
            {chevron(sections.price)}
          </button>
          {sections.price && maxPriceLimit > 0 && (
            <div className="mt-4 px-1 animate-fadeIn">
              <input
                type="range"
                min={minPrice}
                max={maxPriceLimit}
                value={
                  filters.maxPrice === 0 ? maxPriceLimit : filters.maxPrice
                }
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    maxPrice:
                      Number(e.target.value) >= maxPriceLimit
                        ? 0
                        : Number(e.target.value),
                  }))
                }
                style={sliderStyle(
                  filters.maxPrice === 0 ? maxPriceLimit : filters.maxPrice,
                  minPrice,
                  maxPriceLimit,
                )}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
              <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 mt-2">
                <span>৳ {minPrice.toLocaleString()}</span>
                <span className="text-green-600 bg-green-50 px-1.5 py-0.5 rounded text-[10px]">
                  ৳{" "}
                  {(filters.maxPrice === 0
                    ? maxPriceLimit
                    : filters.maxPrice
                  ).toLocaleString()}
                </span>
                <span>৳ {maxPriceLimit.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>

        {/* 3. Airlines */}
        <div className="pt-4">
          <button
            onClick={() => toggleSection("airlines")}
            className="w-full flex items-center justify-between text-sm font-bold text-gray-700 hover:text-gray-900 transition-colors"
          >
            <span>Airlines</span>
            {chevron(sections.airlines)}
          </button>
          {sections.airlines && (
            <div className="mt-3 space-y-2.5 pl-0.5 animate-fadeIn">
              {airlineOptions.map((airline) => (
                <label
                  key={airline.code}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={filters.selectedAirlines.includes(airline.code)}
                    onChange={() => handleAirlineChange(airline.code)}
                    className="w-4 h-4 rounded text-green-600 border-gray-300 focus:ring-green-500 accent-green-600 cursor-pointer"
                  />
                  <div className="w-5 h-5 relative rounded-full border border-gray-100 overflow-hidden shrink-0">
                    <Image
                      src={airline.logo}
                      alt={airline.name}
                      width={20}
                      height={20}
                      className="object-contain"
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-600 group-hover:text-gray-900 transition-colors flex-1">
                    {airline.name}
                  </span>
                  <span className="text-[10px] font-bold text-green-600 ml-auto">
                    ৳ {(airline.minPrice * passengers).toLocaleString()}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* 5. Refundability */}
        <div className="pt-4">
          <button
            onClick={() => toggleSection("refundability")}
            className="w-full flex items-center justify-between text-sm font-bold text-gray-700 hover:text-gray-900 transition-colors"
          >
            <span>Refundability</span>
            {chevron(sections.refundability)}
          </button>
          {sections.refundability && (
            <div className="mt-3 animate-fadeIn">
              <label className="flex items-center gap-3 px-1 py-1.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.partiallyRefundable}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      partiallyRefundable: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 rounded text-green-600 border-gray-300 focus:ring-green-500 accent-green-600 cursor-pointer"
                />
                <span className="text-xs font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">
                  Partially Refundable
                </span>
              </label>
            </div>
          )}
        </div>

        {/* 6. Amenities */}
        <div className="pt-4">
          <button
            onClick={() => toggleSection("amenities")}
            className="w-full flex items-center justify-between text-sm font-bold text-gray-700 hover:text-gray-900 transition-colors"
          >
            <span>Amenities</span>
            {chevron(sections.amenities)}
          </button>
          {sections.amenities && (
            <div className="mt-3 space-y-2 pl-0.5 animate-fadeIn">
              {availableAmenities.map(({ key, label }) => (
                <label
                  key={key}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={Boolean(filters[key as keyof typeof filters])}
                    onChange={(e) =>
                      setFilters(
                        (prev) =>
                          ({
                            ...prev,
                            [key]: e.target.checked,
                          }) as typeof prev,
                      )
                    }
                    className="w-4 h-4 rounded text-green-600 border-gray-300 accent-green-600 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">
                    {label}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* 7. Layover Time */}
        <div className="pt-4">
          <button
            onClick={() => toggleSection("layover")}
            className="w-full flex items-center justify-between text-sm font-bold text-gray-700 hover:text-gray-900 transition-colors"
          >
            <span>Layover Time</span>
            {chevron(sections.layover)}
          </button>
          {sections.layover && (
            <div className="mt-4 px-1 animate-fadeIn">
              <input
                type="range"
                min="0"
                max={maxLayoverHours}
                value={filters.layoverTime}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    layoverTime: Number(e.target.value),
                  }))
                }
                style={sliderStyle(filters.layoverTime, 0, maxLayoverHours)}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
              <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 mt-2">
                <span>0 hrs</span>
                <span className="text-green-600 bg-green-50 px-1.5 py-0.5 rounded text-[10px]">
                  {filters.layoverTime >= maxLayoverHours
                    ? `${maxLayoverHours}+ hrs`
                    : `${filters.layoverTime} hrs`}
                </span>
                <span>{maxLayoverHours}+ hrs</span>
              </div>
            </div>
          )}
        </div>

        {/* 8. Aircraft */}
        <div className="pt-4">
          <button
            onClick={() => toggleSection("aircraft")}
            className="w-full flex items-center justify-between text-sm font-bold text-gray-700 hover:text-gray-900 transition-colors"
          >
            <span>Aircraft</span>
            {chevron(sections.aircraft)}
          </button>
          {sections.aircraft && (
            <div className="mt-3 space-y-2.5 pl-0.5 animate-fadeIn">
              {aircraftOptions.map((plane) => (
                <label
                  key={plane.code}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={filters.selectedAircraft.includes(plane.code)}
                    onChange={() => handleAircraftChange(plane.code)}
                    className="w-4 h-4 rounded text-green-600 border-gray-300 focus:ring-green-500 accent-green-600 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">
                    {plane.label}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightFilterSidebar;
