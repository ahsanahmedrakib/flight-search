"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Moon, Sun } from "lucide-react";
import { useFlight } from "@/store/flightStore";

export default function FlightFilterSidebar() {
  const { filters, setFilters } = useFlight();

  // Accordion open/close states
  const [sections, setSections] = useState({
    baggage: true,
    refundability: true,
    layover: true,
    aircraft: true,
  });

  // Toggle accordion helper
  const toggleSection = (section: keyof typeof sections) => {
    setSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Toggle aircraft selection helper
  const handleAircraftChange = (code: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedAircraft: prev.selectedAircraft.includes(code)
        ? prev.selectedAircraft.filter((item) => item !== code)
        : [...prev.selectedAircraft, code],
    }));
  };

  return (
    <div className="w-full max-w-xs bg-white rounded-2xl shadow-sm border border-gray-100 p-5 font-sans antialiased text-gray-800">
      {/* 1. Time of Day Filters */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        <button
          onClick={() =>
            setFilters((prev) => ({
              ...prev,
              selectedTime: prev.selectedTime === "afternoon" ? null : "afternoon",
            }))
          }
          className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
            filters.selectedTime === "afternoon"
              ? "border-red-500 bg-red-50/30 ring-1 ring-red-500"
              : "border-gray-100 bg-gray-50/40 hover:border-gray-200"
          }`}
        >
          <Sun
            className={`w-5 h-5 ${filters.selectedTime === "afternoon" ? "text-red-500" : "text-gray-400"}`}
          />
          <div>
            <div className="text-xs font-bold text-gray-700">Afternoon</div>
            <div className="text-[10px] text-gray-400 mt-0.5">12:00-17:59</div>
          </div>
        </button>

        <button
          onClick={() =>
            setFilters((prev) => ({
              ...prev,
              selectedTime: prev.selectedTime === "evening" ? null : "evening",
            }))
          }
          className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
            filters.selectedTime === "evening"
              ? "border-red-500 bg-red-50/30 ring-1 ring-red-500"
              : "border-gray-100 bg-gray-50/40 hover:border-gray-200"
          }`}
        >
          <Moon
            className={`w-5 h-5 ${filters.selectedTime === "evening" ? "text-red-500" : "text-gray-400"}`}
          />
          <div>
            <div className="text-xs font-bold text-gray-700">Evening</div>
            <div className="text-[10px] text-gray-400 mt-0.5">18:00-23:59</div>
          </div>
        </button>
      </div>

      <div className="space-y-5 divide-y divide-gray-100">
        {/* 2. Baggage Policy Accordion */}
        <div className="pt-4 first:pt-0">
          <button
            onClick={() => toggleSection("baggage")}
            className="w-full flex items-center justify-between text-sm font-bold text-gray-700 hover:text-gray-900 transition-colors"
          >
            <span>Baggage Policy</span>
            {sections.baggage ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>

          {sections.baggage && (
            <div className="mt-3 animate-fadeIn">
              <label className="flex items-center gap-3 p-3 bg-red-50/40 rounded-xl cursor-pointer border border-transparent hover:border-red-100 transition-all">
                <input
                  type="checkbox"
                  checked={filters.baggage20kg}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      baggage20kg: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 rounded text-red-600 border-gray-300 focus:ring-red-500 accent-red-600 cursor-pointer"
                />
                <span className="text-xs font-bold text-gray-600">20 Kg</span>
              </label>
            </div>
          )}
        </div>

        {/* 3. Refundability Accordion */}
        <div className="pt-4">
          <button
            onClick={() => toggleSection("refundability")}
            className="w-full flex items-center justify-between text-sm font-bold text-gray-700 hover:text-gray-900 transition-colors"
          >
            <span>Refundability</span>
            {sections.refundability ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>

          {sections.refundability && (
            <div className="mt-3 space-y-2 animate-fadeIn">
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
                  className="w-4 h-4 rounded text-red-600 border-gray-300 focus:ring-red-500 accent-red-600 cursor-pointer"
                />
                <span className="text-xs font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">
                  Partially Refundable
                </span>
              </label>
            </div>
          )}
        </div>

        {/* 4. Layover Time Slider Accordion */}
        <div className="pt-4">
          <button
            onClick={() => toggleSection("layover")}
            className="w-full flex items-center justify-between text-sm font-bold text-gray-700 hover:text-gray-900 transition-colors"
          >
            <span>Layover Time</span>
            {sections.layover ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>

          {sections.layover && (
            <div className="mt-4 px-1 animate-fadeIn">
              <div className="relative w-full flex items-center">
                <input
                  type="range"
                  min="0"
                  max="15"
                  value={filters.layoverTime}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      layoverTime: Number(e.target.value),
                    }))
                  }
                  className="w-full h-1 bg-red-600 rounded-lg appearance-none cursor-pointer accent-red-600 range-sm"
                />
              </div>
              <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 mt-2">
                <span>0 hrs</span>
                <span className="text-red-600 bg-red-50 px-1.5 py-0.5 rounded text-[10px]">
                  {filters.layoverTime === 15 ? "15+ hrs" : `${filters.layoverTime} hrs`}
                </span>
                <span>15+ hrs</span>
              </div>
            </div>
          )}
        </div>

        {/* 5. Aircraft Model Checkboxes Accordion */}
        <div className="pt-4">
          <button
            onClick={() => toggleSection("aircraft")}
            className="w-full flex items-center justify-between text-sm font-bold text-gray-700 hover:text-gray-900 transition-colors"
          >
            <span>Aircraft</span>
            {sections.aircraft ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>

          {sections.aircraft && (
            <div className="mt-3 space-y-2.5 pl-0.5 animate-fadeIn">
              {[
                { label: "ATR 72", code: "ATR72" },
                { label: "ATR 72 - 600", code: "ATR72600" },
                { label: "ATR725", code: "ATR725" },
                { label: "DH8", code: "DH8" },
              ].map((plane) => (
                <label
                  key={plane.code}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={filters.selectedAircraft.includes(plane.code)}
                    onChange={() => handleAircraftChange(plane.code)}
                    className="w-4 h-4 rounded text-red-600 border-gray-300 focus:ring-red-500 accent-red-600 cursor-pointer"
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
}
