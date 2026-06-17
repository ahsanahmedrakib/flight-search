"use client";

import { useFlight } from "@/store/flightStore";
import {
  Calendar,
  CheckCircle2,
  Home,
  Mail,
  Phone,
  Printer,
  Share2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

export default function ConfirmationPage() {
  const { selectedFlight, bookingDetails, resetAll } = useFlight();
  const router = useRouter();
  const [pnr] = useState(() =>
    selectedFlight
      ? `${selectedFlight.airline.code}-${Math.floor(1000 + Math.random() * 9000)}`
      : ""
  );

  // Parse dates deterministically
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

  useEffect(() => {
    if (!selectedFlight || !bookingDetails) {
      router.push("/");
    }
  }, [selectedFlight, bookingDetails, router]);

  if (!selectedFlight || !bookingDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
        <div className="text-center space-y-4">
          <div className="animate-pulse text-emerald-600 text-3xl font-bold">
            ✓
          </div>
          <p className="text-gray-500 font-semibold text-sm">
            Redirecting to home...
          </p>
        </div>
      </div>
    );
  }

  const handleBookAnother = () => {
    resetAll();
    router.push("/");
  };

  const passengerName = `${bookingDetails.firstName} ${bookingDetails.lastName}`;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 antialiased">
      {/* Top Banner Success Notification */}
      <div className="bg-emerald-600 text-white py-10 text-center px-4">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full">
            <CheckCircle2 className="w-10 h-10 text-emerald-100" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Booking Confirmed!
          </h1>
          <p className="text-sm text-emerald-100 font-semibold max-w-md mx-auto">
            Your ticket booking has been confirmed successfully. We have sent
            the e-ticket PDF to your email{" "}
            <span className="underline">{bookingDetails.email}</span>.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-10 space-y-8">
        {/* Virtual Boarding Pass Ticket Container */}
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-md flex flex-col">
          {/* Ticket Header */}
          <div className="bg-linear-to-r from-red-600 to-red-700 p-5 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 relative bg-white border border-red-500 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                <Image
                  src={selectedFlight.airline.logo}
                  alt={selectedFlight.airline.name}
                  width={30}
                  height={30}
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="font-black text-sm tracking-wide uppercase">
                  {selectedFlight.airline.name.split(" ")[0]} AIRLINES
                </h3>
                <p className="text-[10px] text-red-100 font-bold tracking-wider">
                  {selectedFlight.flightNumber} •{" "}
                  {selectedFlight.aircraft.manufacturer}{" "}
                  {selectedFlight.aircraft.model}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-red-100 font-bold tracking-widest uppercase">
                PNR REF
              </div>
              <div className="text-lg font-black tracking-widest">{pnr}</div>
            </div>
          </div>

          {/* Ticket Body Content */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Passenger Info & Class Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 border-b border-dashed border-gray-100 text-xs">
              <div>
                <span className="block text-gray-400 font-bold uppercase tracking-wider">
                  Passenger Name
                </span>
                <span className="block font-black text-gray-800 text-sm mt-1">
                  {passengerName}
                </span>
              </div>
              <div>
                <span className="block text-gray-400 font-bold uppercase tracking-wider">
                  Cabin Class
                </span>
                <span className="block font-black text-gray-800 text-sm mt-1">
                  {selectedFlight.cabinClass}
                </span>
              </div>
              <div>
                <span className="block text-gray-400 font-bold uppercase tracking-wider">
                  Booking Status
                </span>
                <span className="inline-flex items-center gap-1.5 font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md mt-1">
                  ● CONFIRMED
                </span>
              </div>
            </div>

            {/* Travel Route Timeline Grid */}
            <div className="grid grid-cols-12 gap-3 items-center">
              {/* Origin Block */}
              <div className="col-span-4 text-left">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  {selectedFlight.route.origin.city}
                </p>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-800 mt-1">
                  {selectedFlight.route.origin.code}
                </h2>
                <h3 className="text-sm font-black text-gray-800 mt-1">
                  {formatTime(selectedFlight.departure)}
                </h3>
                <p className="text-[10px] text-gray-400 font-medium mt-1 leading-tight">
                  {selectedFlight.route.origin.airport}
                </p>
              </div>

              {/* Stop & Path Graphics */}
              <div className="col-span-4 flex flex-col items-center justify-center px-1">
                <span className="text-[9px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                  {selectedFlight.stops === 0
                    ? "Non-stop"
                    : `${selectedFlight.stops} Stop`}
                </span>
                <div className="w-full flex items-center gap-1 my-2">
                  <div className="w-2 h-2 rounded-full bg-red-600" />
                  <div className="flex-1 border-t border-dashed border-red-200 relative">
                    <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-red-500 transform rotate-90 font-bold">
                      ✈️
                    </span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-red-600" />
                </div>
                <span className="text-[10px] font-extrabold text-slate-800">
                  {Math.floor(selectedFlight.durationMinutes / 60)}h{" "}
                  {selectedFlight.durationMinutes % 60}m
                </span>
              </div>

              {/* Destination Block */}
              <div className="col-span-4 text-right">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  {selectedFlight.route.destination.city}
                </p>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-800 mt-1">
                  {selectedFlight.route.destination.code}
                </h2>
                <h3 className="text-sm font-black text-gray-800 mt-1">
                  {formatTime(selectedFlight.arrival)}
                </h3>
                <p className="text-[10px] text-gray-400 font-medium mt-1 leading-tight">
                  {selectedFlight.route.destination.airport}
                </p>
              </div>
            </div>

            {/* Travel Date Banner */}
            <div className="bg-slate-50/70 rounded-xl p-3 flex justify-between items-center text-xs font-bold text-gray-600">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-gray-400" /> Travel Date:
              </span>
              <span>{formatDate(selectedFlight.departure)}</span>
            </div>

            {/* Passenger Contacts and baggage lists */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-100 text-xs">
              <div className="space-y-2">
                <h4 className="font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Contact Details
                </h4>
                <p className="flex items-center gap-2 text-gray-500">
                  <Mail className="w-3.5 h-3.5" /> {bookingDetails.email}
                </p>
                <p className="flex items-center gap-2 text-gray-500">
                  <Phone className="w-3.5 h-3.5" /> {bookingDetails.phone}
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Baggage Allowance
                </h4>
                <p className="text-gray-500">
                  Cabin Handbag:{" "}
                  <span className="font-bold text-gray-700">
                    {selectedFlight.baggage.cabin}
                  </span>
                </p>
                <p className="text-gray-500">
                  Checked Baggage:{" "}
                  <span className="font-bold text-gray-700">
                    {selectedFlight.baggage.checked}
                  </span>
                </p>
              </div>
            </div>

            {/* Simulated QR Code / Barcode styling to look complete */}
            <div className="pt-6 border-t border-dashed border-gray-100 flex flex-col items-center space-y-2 select-none">
              <div className="w-full max-w-sm h-12 bg-linear-to-r from-gray-900 via-gray-100 to-gray-900 rounded-sm relative opacity-85 flex items-center justify-between px-6 border-y border-gray-300">
                <div className="w-full flex justify-between text-[10px] font-black text-gray-900 tracking-wider">
                  <span>| ||| || ||| | || | |||| || | ||| || || | ||</span>
                  <span>| ||| || ||| | || | |||| || | ||| || || | ||</span>
                  <span>| ||| || ||| | || | |||| || | ||| || || | ||</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-gray-400 tracking-widest">
                {pnr} BOARDING PASS MOB-TKT
              </span>
            </div>
          </div>
        </div>

        {/* Action Button Row */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 border border-gray-200 text-gray-600 hover:text-gray-800 hover:bg-gray-50 font-bold text-xs px-6 py-3 rounded-xl transition-colors bg-white shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Pass</span>
          </button>

          <button
            onClick={async () => {
              const text = `Flight booking confirmed! PNR: ${pnr}`;
              if (navigator.share) {
                await navigator.share({ title: "Flight Booking", text });
              } else {
                await navigator.clipboard.writeText(text);
              }
            }}
            className="flex items-center justify-center gap-2 border border-gray-200 text-gray-600 hover:text-gray-800 hover:bg-gray-50 font-bold text-xs px-6 py-3 rounded-xl transition-colors bg-white shadow-xs cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Booking</span>
          </button>

          <button
            onClick={handleBookAnother}
            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-8 py-3 rounded-xl shadow-md shadow-red-600/10 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Book Another Flight</span>
          </button>
        </div>
      </div>
    </div>
  );
}

