"use client";

import { useFlight } from "@/store/flightStore";
import type { Flight } from "@/types/flight";
import { AlertCircle, ChevronDown, Plane, ThumbsUp } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

interface FlightCardProps {
  flight: Flight;
}

export default function FlightCard({ flight }: FlightCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const router = useRouter();
  const { setSelectedFlight, searchCriteria } = useFlight();
  const passengers = searchCriteria.passengers;

  // Formatting date helpers for display targets (e.g. "15 Jul, Wednesday" or "06:00") (Deterministic)
  const formatTime = (isoString: string) => {
    if (!isoString) return "";
    const timePart = isoString.split("T")[1] || "00:00:00";
    const [hour, minute] = timePart.split(":");
    return `${hour}:${minute}`;
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return "";
    const datePart = isoString.split("T")[0];
    const [year, month, day] = datePart.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return `${day} ${MONTHS[month - 1]}, ${WEEKDAYS[date.getDay()]}`;
  };

  // Convert flat minutes into human hours/minutes e.g., 70 -> "1h 10m"
  const formatDuration = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden font-sans">
      {/* Upper Information Area */}
      <div className="flex flex-col md:flex-row md:items-stretch">
        {/* Left Interactive Details Section (Takes up most of card space) */}
        <div className="flex-1 p-5 pb-4 flex flex-col justify-between">
          {/* Top Status Badges Row */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {/* Refundability Flag */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                flight.refundable
                  ? "bg-green-50 text-green-600"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              {flight.refundable ? "Partially Refundable" : "Non-Refundable"}
            </span>

            {/* Seat Counter Warning */}
            {flight.seatAvailability <= 5 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-green-200 text-green-600 bg-green-50/50 text-xs font-bold">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {flight.seatAvailability} seat(s) left
              </span>
            )}

            {/* Custom tags passed down dynamic map */}
            {flight.tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-gray-100 text-gray-700 font-medium px-2.5 py-1 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Main Route Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center mb-4">
            {/* Airline Identity block */}
            <div className="sm:col-span-3 flex items-center gap-3">
              <div className="w-12 h-12 relative bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                <Image
                  src={flight.airline.logo}
                  alt={flight.airline.name}
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-sm md:text-base leading-tight">
                  {flight.airline.name.split(" ")[0]} Airlines
                </h4>
                <p className="text-xs text-gray-400 mt-0.5">
                  {flight.flightNumber}
                </p>
              </div>
            </div>

            {/* Departure Info Block */}
            <div className="sm:col-span-3 text-left sm:text-right">
              <p className="text-xs font-medium text-gray-400">
                {formatDate(flight.departure)}
              </p>
              <h3 className="text-2xl font-black text-gray-800 mt-0.5">
                {formatTime(flight.departure)}
              </h3>
              <p className="text-sm font-bold text-gray-500 tracking-wide mt-0.5">
                {flight.route.origin.code}
              </p>
            </div>

            {/* Dynamic Timeline Stop-Bar Component */}
            <div className="sm:col-span-3 flex flex-col items-center justify-center px-2">
              <span className="text-xs font-bold text-gray-800">
                {formatDuration(flight.durationMinutes)}
              </span>

              <div className="w-full flex items-center gap-1.5 my-1.5">
                <div className="w-2 h-2 rounded-full border-2 border-blue-500 bg-white" />
                <div className="flex-1 border-t border-dashed border-gray-300 relative flex justify-center">
                  <Plane className="w-4 h-4 text-blue-500 absolute -top-2 bg-white px-0.5 rotate-45" />
                </div>
                <div className="w-2 h-2 rounded-full border-2 border-blue-500 bg-white" />
              </div>

              <span className="text-xs font-medium text-gray-400">
                {flight.stops === 0 ? "Non-stop" : `${flight.stops} Stop`}
              </span>
            </div>

            {/* Arrival Info Block */}
            <div className="sm:col-span-3 text-left">
              <p className="text-xs font-medium text-gray-400">
                {formatDate(flight.arrival)}
              </p>
              <h3 className="text-2xl font-black text-gray-800 mt-0.5">
                {formatTime(flight.arrival)}
              </h3>
              <p className="text-sm font-bold text-gray-500 tracking-wide mt-0.5">
                {flight.route.destination.code}
              </p>
            </div>
          </div>

          {/* Quick Info Footnotes */}
          <div className="flex items-center gap-3 pt-2">
            <span className="inline-flex items-center gap-1.5 bg-blue-50/50 text-blue-600 px-3 py-1 rounded-md text-xs font-semibold">
              <ThumbsUp className="w-3.5 h-3.5" />
              Recommended
            </span>

            <button
              onClick={() => setDetailsOpen(!detailsOpen)}
              className="inline-flex items-center gap-1 text-xs font-bold text-green-600 hover:text-green-700 transition-colors ml-auto"
            >
              <span>View Details</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${detailsOpen ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Separator Border Interface matching the screen mock layout */}
        <div className="hidden md:flex flex-col justify-between py-4 select-none">
          <div className="w-3 h-3 bg-slate-50 border-r border-b border-gray-100 rounded-full -ml-1.5" />
          <div className="h-full border-l border-dashed border-gray-200 mx-auto my-1" />
          <div className="w-3 h-3 bg-slate-50 border-r border-t border-gray-100 rounded-full -ml-1.5" />
        </div>

        {/* Right Financial Price Point CTA Matrix */}
        <div className="w-full md:w-64 bg-gray-50/40 p-5 flex flex-col justify-center items-stretch md:items-end border-t border-gray-100 md:border-t-0">
          {/* Promo code badge lookup conditional context */}
          <span className="inline-block bg-orange-50 text-orange-600 text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md border border-orange-100 self-start md:self-auto mb-2 shadow-xs">
            🎟️ DOM26
          </span>

          {/* Dynamic Price Render */}
          <div className="text-left md:text-right mb-4">
            <span className="text-xs font-bold text-green-600 mr-1">
              {flight.price.currency}
            </span>
            <span className="text-3xl font-black text-green-600 tracking-tight">
              {(flight.price.total * passengers).toLocaleString()}
            </span>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">
              ৳ {flight.price.total.toLocaleString()} × {passengers}{" "}
              {passengers === 1 ? "traveller" : "travellers"}
            </p>
            {/* Strikeout Base Price display if markdown metrics available */}
            <p className="text-xs text-gray-400 font-medium line-through mt-0.5">
              {flight.price.currency}{" "}
              {((flight.price.total + 1511) * passengers).toLocaleString()}
            </p>
          </div>

          {/* Call To Actions */}
          <div className="grid grid-cols-2 md:flex md:flex-col gap-2 w-full">
            <button
              disabled={isSelecting}
              onClick={() => {
                setIsSelecting(true);
                setSelectedFlight(flight);
                router.push(`/booking?flightId=${flight.id}`);
              }}
              className="bg-green-600 hover:bg-green-700 cursor-pointer text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-green-600/10 active:scale-[0.99] transition-all order-1 md:order-2 flex items-center justify-center gap-2 disabled:opacity-80"
            >
              {isSelecting ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Redirecting...</span>
                </>
              ) : (
                "Select"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Flight Specs Tab Menu Container */}
      {detailsOpen && (
        <div className="border-t border-gray-100 bg-slate-50/50 p-5 text-gray-600 text-xs animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <h5 className="font-bold text-gray-700 uppercase tracking-wider mb-2">
                Flight Logistics
              </h5>
              <p className="mb-1">
                <span className="text-gray-400">Aircraft:</span>{" "}
                {flight.aircraft.manufacturer} {flight.aircraft.model}
              </p>
              <p className="mb-1">
                <span className="text-gray-400">Cabin Class:</span>{" "}
                {flight.cabinClass}
              </p>
              <p>
                <span className="text-gray-400">Punctuality Score:</span>{" "}
                {flight.punctuality}%
              </p>
            </div>
            <div>
              <h5 className="font-bold text-gray-700 uppercase tracking-wider mb-2">
                Baggage Allowance
              </h5>
              <p className="mb-1">
                <span className="text-gray-400">Cabin Handbag:</span>{" "}
                {flight.baggage.cabin}
              </p>
              <p>
                <span className="text-gray-400">Checked Baggage:</span>{" "}
                {flight.baggage.checked}
              </p>
            </div>
            <div>
              <h5 className="font-bold text-gray-700 uppercase tracking-wider mb-2">
                Amenities & Perks
              </h5>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {flight.mealsIncluded && (
                  <span className="bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-500">
                    🍱 Meals Included
                  </span>
                )}
                {flight.entertainmentAvailable && (
                  <span className="bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-500">
                    🎬 Entertainment
                  </span>
                )}
                {flight.mobileTicketAvailable && (
                  <span className="bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-500">
                    📱 Mobile Ticket
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
