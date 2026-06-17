"use client";

import FlightBookingForm from "@/components/FlightBookingForm";
import { useFlight } from "@/store/flightStore";
import {
  ArrowRight,
  Briefcase,
  Plane,
  RefreshCw,
  ShieldCheck,
  Ticket,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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

export default function BookingPage() {
  const { selectedFlight, searchCriteria } = useFlight();
  const router = useRouter();
  const passengers = searchCriteria.passengers;

  // Parse departure/arrival times deterministically
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

  const formatDuration = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `${hours}h ${mins}m`;
  };

  useEffect(() => {
    if (!selectedFlight) {
      router.push("/");
    }
  }, [selectedFlight, router]);

  if (!selectedFlight) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
        <div className="text-center space-y-4">
          <div className="animate-bounce text-red-600 text-3xl font-bold">
            ✈️
          </div>
          <p className="text-gray-500 font-semibold text-sm">
            Redirecting to flight search...
          </p>
        </div>
      </div>
    );
  }

  const basePrice = selectedFlight.price.baseFare * passengers;
  const taxes = selectedFlight.price.taxes * passengers;
  const fee = selectedFlight.price.serviceFee * passengers;
  const discount = selectedFlight.price.discount * passengers;
  const total = selectedFlight.price.total * passengers;
  const currency = selectedFlight.price.currency;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16 antialiased">
      {/* Sleek Breadcrumb Header */}
      <div className="bg-white border-b border-gray-100 py-4 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
            <span
              className="cursor-pointer hover:text-red-600"
              onClick={() => router.push("/")}
            >
              1. Flight Search
            </span>
            <ArrowRight className="w-3 h-3" />
            <span className="text-red-600 font-extrabold">
              2. Passenger Details
            </span>
            <ArrowRight className="w-3 h-3" />
            <span>3. Confirmation</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg px-2.5 py-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Seat held for 15:00 minutes</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Side: Booking Form */}
          <div className="lg:col-span-8 space-y-6">
            <FlightBookingForm />
          </div>

          {/* Right Side: Selected Flight Summary */}
          <div className="lg:col-span-4 space-y-6">
            {/* Flight Summary Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-slate-900 p-4 text-white flex items-center gap-2">
                <Ticket className="w-4 h-4 text-red-500" />
                <h3 className="text-sm font-bold tracking-tight">
                  Flight Details
                </h3>
              </div>

              <div className="p-5 space-y-5">
                {/* Airline Identity */}
                <div className="flex items-center gap-3 pb-3 border-b border-gray-50">
                  <div className="w-10 h-10 relative bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                    <Image
                      src={selectedFlight.airline.logo}
                      alt={selectedFlight.airline.name}
                      width={30}
                      height={30}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm leading-tight">
                      {selectedFlight.airline.name}
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {selectedFlight.flightNumber} •{" "}
                      {selectedFlight.aircraft.manufacturer}{" "}
                      {selectedFlight.aircraft.model}
                    </p>
                  </div>
                </div>

                {/* Itinerary Timeline */}
                <div className="grid grid-cols-12 gap-2 items-center text-xs">
                  {/* Origin */}
                  <div className="col-span-4 text-left">
                    <div className="font-black text-gray-800 text-sm">
                      {formatTime(selectedFlight.departure)}
                    </div>
                    <div className="font-bold text-gray-500 mt-0.5">
                      {selectedFlight.route.origin.code}
                    </div>
                    <div className="text-gray-400 mt-0.5 truncate">
                      {selectedFlight.route.origin.city}
                    </div>
                  </div>

                  {/* Route stop details */}
                  <div className="col-span-4 flex flex-col items-center justify-center px-1">
                    <span className="text-[10px] font-bold text-gray-400">
                      {formatDuration(selectedFlight.durationMinutes)}
                    </span>
                    <div className="w-full flex items-center gap-1 my-1">
                      <div className="w-1.5 h-1.5 rounded-full border border-red-500 bg-white" />
                      <div className="flex-1 border-t border-dashed border-gray-200 relative">
                        <Plane className="w-3 h-3 text-red-500 absolute -top-1.5 left-1/2 -translate-x-1/2 rotate-90" />
                      </div>
                      <div className="w-1.5 h-1.5 rounded-full border border-red-500 bg-white" />
                    </div>
                    <span className="text-[9px] font-bold text-red-500">
                      {selectedFlight.stops === 0
                        ? "Non-stop"
                        : `${selectedFlight.stops} Stop`}
                    </span>
                  </div>

                  {/* Destination */}
                  <div className="col-span-4 text-right">
                    <div className="font-black text-gray-800 text-sm">
                      {formatTime(selectedFlight.arrival)}
                    </div>
                    <div className="font-bold text-gray-500 mt-0.5">
                      {selectedFlight.route.destination.code}
                    </div>
                    <div className="text-gray-400 mt-0.5 truncate">
                      {selectedFlight.route.destination.city}
                    </div>
                  </div>
                </div>

                {/* Date Footnote */}
                <div className="bg-slate-50 rounded-xl p-3 text-center text-xs font-semibold text-gray-600">
                  🗓️ Departure: {formatDate(selectedFlight.departure)}
                </div>

                {/* Perks list */}
                <div className="space-y-2.5 pt-2 border-t border-gray-50 text-xs">
                  <div className="flex justify-between text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-gray-400" />{" "}
                      Baggage:
                    </span>
                    <span className="font-bold text-gray-700">
                      Cabin {selectedFlight.baggage.cabin} • Checked{" "}
                      {selectedFlight.baggage.checked}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 text-gray-400" />{" "}
                      Refund:
                    </span>
                    <span
                      className={`font-bold ${selectedFlight.refundable ? "text-emerald-600" : "text-gray-500"}`}
                    >
                      {selectedFlight.refundable
                        ? "Refundable"
                        : "Non-Refundable"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Breakdown Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-slate-900 p-4 text-white flex items-center justify-between">
                <h3 className="text-sm font-bold tracking-tight">
                  Fare Summary
                </h3>
                <div className="flex items-center gap-2">
                  {passengers > 1 && (
                    <span className="text-xs text-gray-300 font-semibold">{passengers} travellers</span>
                  )}
                  <span className="text-xs bg-red-600 text-white font-extrabold px-2 py-0.5 rounded">
                    {currency}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-3 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>Base Fare:</span>
                  <span className="font-bold text-gray-700">
                    ৳ {basePrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Taxes & Carrier Fees:</span>
                  <span className="font-bold text-gray-700">
                    ৳ {taxes.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Service charge:</span>
                  <span className="font-bold text-gray-700">
                    ৳ {fee.toLocaleString()}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount:</span>
                    <span>- ৳ {discount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-black text-gray-900 pt-3 border-t border-gray-100">
                  <span>Total Payable:</span>
                  <span className="text-red-600 text-base">
                    ৳ {total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

