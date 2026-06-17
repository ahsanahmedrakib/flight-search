"use client";

import {
    ChevronDown,
    ChevronLeft,
    ChevronUp,
    Clock,
    DollarSign,
    Zap,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// Mock Data for the Airline Slider Track
const AIRLINE_FILTERS = [
  {
    id: "BS",
    name: "US-Bangla",
    code: "BS",
    count: 8,
    minPrice: 10187,
    logo: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=32&h=32&fit=crop&q=80",
  },
  {
    id: "2A",
    name: "Astra Airways",
    code: "2A",
    count: 3,
    minPrice: 10523,
    logo: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=32&h=32&fit=crop&q=80",
  },
  {
    id: "VQ",
    name: "Novoair",
    code: "VQ",
    count: 2,
    minPrice: 12238,
    logo: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=32&h=32&fit=crop&q=80",
  },
  {
    id: "BG",
    name: "Biman Bangladesh",
    code: "BG",
    count: 1,
    minPrice: 15642,
    logo: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=32&h=32&fit=crop&q=80",
  },
];

export default function FlightSortBar() {
  // Main Top-level Quick Sort state
  const [activeSort, setActiveSort] = useState("cheapest");

  // Selected Airline filter from track slider
  const [selectedAirline, setSelectedAirline] = useState<string | null>(null);

  // Custom Dropdown Open/Close and current value state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownSortLabel, setDropdownSortLabel] = useState("More Sorts");

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown menu when clicking anywhere else on page
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDropdownSelect = (sortKey: string, label: string) => {
    setActiveSort(sortKey);
    setDropdownSortLabel(label);
    setIsDropdownOpen(false);
  };

  return (
    <div className="w-full max-w-5xl space-y-4 font-sans antialiased bg-slate-50 p-4 rounded-2xl">
      {/* Summary Matrix Indicator text */}
      <div className="text-sm font-bold text-slate-700 tracking-wide px-1">
        Showing 14 Flights & 4 Airlines
      </div>

      {/* Row 1: Core Priority Quick Sort Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-stretch">
        {/* Cheapest Metric Box */}
        <button
          onClick={() => {
            setActiveSort("cheapest");
            setDropdownSortLabel("More Sorts");
          }}
          className={`flex items-center gap-3 p-3 px-4 rounded-xl border text-left transition-all ${
            activeSort === "cheapest"
              ? "bg-red-50/60 border-red-500 ring-1 ring-red-500/20"
              : "bg-white border-gray-100 hover:border-gray-300"
          }`}
        >
          <div
            className={`p-2.5 rounded-lg flex items-center justify-center ${activeSort === "cheapest" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-500"}`}
          >
            <DollarSign className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div
              className={`text-sm font-black ${activeSort === "cheapest" ? "text-red-600" : "text-gray-700"}`}
            >
              Cheapest
            </div>
            <div className="text-xs font-bold text-gray-500 mt-0.5">
              ৳ 10,187
            </div>
          </div>
        </button>

        {/* Fastest Metric Box */}
        <button
          onClick={() => {
            setActiveSort("fastest");
            setDropdownSortLabel("More Sorts");
          }}
          className={`flex items-center gap-3 p-3 px-4 rounded-xl border text-left transition-all ${
            activeSort === "fastest"
              ? "bg-red-50/60 border-red-500 ring-1 ring-red-500/20"
              : "bg-white border-gray-100 hover:border-gray-300"
          }`}
        >
          <div
            className={`p-2.5 rounded-lg flex items-center justify-center ${activeSort === "fastest" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-500"}`}
          >
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div
              className={`text-sm font-black ${activeSort === "fastest" ? "text-red-600" : "text-gray-700"}`}
            >
              Fastest
            </div>
            <div className="text-xs font-bold text-gray-500 mt-0.5">1h 5m</div>
          </div>
        </button>

        {/* Earliest Metric Box */}
        <button
          onClick={() => {
            setActiveSort("earliest");
            setDropdownSortLabel("More Sorts");
          }}
          className={`flex items-center gap-3 p-3 px-4 rounded-xl border text-left transition-all ${
            activeSort === "earliest"
              ? "bg-red-50/60 border-red-500 ring-1 ring-red-500/20"
              : "bg-white border-gray-100 hover:border-gray-300"
          }`}
        >
          <div
            className={`p-2.5 rounded-lg flex items-center justify-center ${activeSort === "earliest" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-500"}`}
          >
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div
              className={`text-sm font-black ${activeSort === "earliest" ? "text-red-600" : "text-gray-700"}`}
            >
              Earliest
            </div>
            <div className="text-xs font-bold text-gray-500 mt-0.5">07:30</div>
          </div>
        </button>

        {/* Custom Nested Selection Menu: "More Sorts" */}
        <div ref={dropdownRef} className="relative w-full">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`w-full h-full flex items-center justify-between p-4 bg-white border rounded-xl transition-all font-bold text-sm ${
              isDropdownOpen || activeSort.startsWith("more_")
                ? "border-gray-400 text-blue-900"
                : "border-gray-100 text-gray-700 hover:border-gray-300"
            }`}
          >
            <span>{dropdownSortLabel}</span>
            {isDropdownOpen ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full right-0 left-0 sm:left-auto sm:w-60 mt-1 bg-white border border-gray-100 shadow-xl rounded-xl z-50 overflow-hidden p-1.5 py-2 animate-fadeIn">
              {[
                { label: "Early Departure", key: "more_early_dep" },
                { label: "Late Departure", key: "more_late_dep" },
                { label: "Early Arrival", key: "more_early_arr" },
                { label: "Late Arrival", key: "more_late_arr" },
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => handleDropdownSelect(opt.key, opt.label)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold transition-colors ${
                    activeSort === opt.key
                      ? "bg-gray-50 text-red-600"
                      : "text-gray-600 hover:bg-slate-50 hover:text-gray-900"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Row 2: Horizontal Carousel Track for Quick Airline Pricing Filter */}
      <div className="relative flex items-center w-full bg-white border border-gray-100 rounded-xl p-2 px-3 overflow-hidden">
        {/* Left Indicator Slider chevron spacer matching the visual asset */}
        <div className="flex items-center justify-center pr-2 text-gray-400 border-r border-gray-100 cursor-pointer hover:text-gray-600">
          <ChevronLeft className="w-4 h-4" />
        </div>

        {/* Dynamic Track containing individual Carrier options */}
        <div className="flex flex-1 items-center gap-2 overflow-x-auto no-scrollbar px-3 py-1">
          {AIRLINE_FILTERS.map((item) => {
            const isChosen = selectedAirline === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedAirline(isChosen ? null : item.id)}
                className={`flex items-center gap-2.5 px-4 py-1.5 rounded-xl border cursor-pointer select-none transition-all whitespace-nowrap ${
                  isChosen
                    ? "border-red-500 bg-red-50/20 ring-1 ring-red-500/10"
                    : "border-gray-50 hover:border-gray-200 bg-white"
                }`}
              >
                <div className="w-6 h-6 relative rounded-full border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                  <Image
                    src={item.logo}
                    alt={item.name}
                    width={18}
                    height={18}
                    className="object-contain"
                  />
                </div>
                <div className="text-xs font-semibold text-gray-500">
                  <span className="font-bold text-gray-700">{item.code}</span> (
                  {item.count})
                  <div className="font-black text-gray-800 mt-0.5">
                    ৳ {item.minPrice.toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
