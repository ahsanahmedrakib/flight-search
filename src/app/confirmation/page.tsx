"use client";

import { useFlight, useFlightStore } from "@/store/flightStore";
import {
  Calendar,
  CheckCircle2,
  Home,
  Loader2,
  Mail,
  Phone,
  Printer,
  Send,
  Share2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

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
  const [hasHydrated, setHasHydrated] = useState(() =>
    useFlightStore.persist.hasHydrated(),
  );
  const [mailStatus, setMailStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");
  const sentRef = useRef(false);

  // Generate PNR once (stable value)
  const [pnr] = useState(() =>
    Math.random().toString(36).substring(2, 8).toUpperCase(),
  );

  const formatTime = (isoString: string) => {
    if (!isoString) return "";
    const [hour, minute] = (isoString.split("T")[1] || "00:00").split(":");
    return `${hour}:${minute}`;
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return "";
    const [year, month, day] = isoString.split("T")[0].split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return `${day} ${MONTHS[month - 1]}, ${WEEKDAYS[date.getDay()]}`;
  };

  // Removed unnecessary `pnr` from dependency array
  const sendEmail = useCallback(
    async (
      flight: NonNullable<typeof selectedFlight>,
      details: NonNullable<typeof bookingDetails>,
      ref: string,
    ) => {
      if (sentRef.current) return;
      sentRef.current = true;
      setMailStatus("sending");

      try {
        const res = await fetch("/api/send-confirmation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: details.email,
            pnr: ref,
            flight: {
              airlineName: flight.airline.name,
              flightNumber: flight.flightNumber,
              aircraft: `${flight.aircraft.manufacturer} ${flight.aircraft.model}`,
              originCity: flight.route.origin.city,
              originCode: flight.route.origin.code,
              originAirport: flight.route.origin.airport,
              destinationCity: flight.route.destination.city,
              destinationCode: flight.route.destination.code,
              destinationAirport: flight.route.destination.airport,
              departureTime: formatTime(flight.departure),
              arrivalTime: formatTime(flight.arrival),
              date: formatDate(flight.departure),
              duration: `${Math.floor(flight.durationMinutes / 60)}h ${flight.durationMinutes % 60}m`,
              stops: flight.stops,
              cabinClass: flight.cabinClass,
              baggageCabin: flight.baggage.cabin,
              baggageChecked: flight.baggage.checked,
            },
            passengers: details.passengers,
            contact: { email: details.email, phone: details.phone },
          }),
        });

        const data = await res.json();
        setMailStatus(data.success ? "sent" : "error");
      } catch {
        setMailStatus("error");
      }
    },
    [], // No dependencies needed (pnr is passed as argument)
  );

  // Wait for store hydration
  useEffect(() => {
    if (!useFlightStore.persist.hasHydrated()) {
      const unsub = useFlightStore.persist.onFinishHydration(() =>
        setHasHydrated(true),
      );
      return () => unsub();
    }
  }, []);

  // After hydration, redirect or send email
  useEffect(() => {
    if (!hasHydrated) return;

    const state = useFlightStore.getState();
    if (!state.selectedFlight || !state.bookingDetails) {
      router.push("/");
      return;
    }

    if (!sentRef.current) {
      sendEmail(state.selectedFlight, state.bookingDetails, pnr);
    }
  }, [hasHydrated, router, sendEmail, pnr]); // pnr is stable, sendEmail is now stable

  if (!hasHydrated || !selectedFlight || !bookingDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
        <div className="text-center space-y-3">
          <div className="animate-pulse text-emerald-600 text-3xl">✓</div>
          <p className="text-gray-500 font-semibold text-sm">
            {!hasHydrated ? "Loading..." : "Redirecting..."}
          </p>
        </div>
      </div>
    );
  }

  const passengers = bookingDetails.passengers ?? [];

  const handleBookAnother = () => {
    resetAll();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans pb-20 antialiased">
      {/* Top Banner */}
      <div className="bg-emerald-600 text-white py-8 text-center px-4 print:hidden">
        <div className="max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full">
            <CheckCircle2 className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">
            Booking Confirmed!
          </h1>
          <div className="flex items-center justify-center gap-2 text-sm font-medium min-h-6">
            {mailStatus === "idle" && (
              <span className="text-white/70 text-xs">E-ticket</span>
            )}
            {mailStatus === "sending" && (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-white/80">
                  Sending e-ticket to {bookingDetails.email}…
                </span>
              </>
            )}
            {mailStatus === "sent" && (
              <>
                <Send className="w-4 h-4" />
                <span className="text-white/90">
                  E-ticket sent to{" "}
                  <span className="font-bold underline">
                    {bookingDetails.email}
                  </span>
                </span>
              </>
            )}
            {mailStatus === "error" && (
              <span className="text-red-200 text-xs">
                Could not send email.{" "}
                <button
                  onClick={() => {
                    const state = useFlightStore.getState();
                    if (!state.selectedFlight || !state.bookingDetails) return;
                    sentRef.current = false;
                    sendEmail(state.selectedFlight, state.bookingDetails, pnr);
                  }}
                  className="underline font-bold hover:text-white"
                >
                  Retry
                </button>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 mt-8 space-y-5 print:mt-0 print:px-0">
        {/* Ticket Card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {/* Ticket Header */}
          <div className="bg-slate-800 px-5 py-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden shrink-0">
                <Image
                  src={selectedFlight.airline.logo}
                  alt={selectedFlight.airline.name}
                  width={30}
                  height={30}
                  className="object-contain"
                />
              </div>
              <div>
                <p className="font-black text-sm uppercase tracking-wide">
                  {selectedFlight.airline.name}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {selectedFlight.flightNumber} ·{" "}
                  {selectedFlight.aircraft.manufacturer}{" "}
                  {selectedFlight.aircraft.model}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                PNR
              </p>
              <p className="text-lg font-black tracking-widest">{pnr}</p>
            </div>
          </div>

          <div className="p-5 space-y-5">
            {/* Route */}
            <div className="grid grid-cols-12 items-center gap-2">
              <div className="col-span-4">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  {selectedFlight.route.origin.city}
                </p>
                <p className="text-3xl font-black text-gray-900">
                  {selectedFlight.route.origin.code}
                </p>
                <p className="text-base font-bold text-gray-800 mt-0.5">
                  {formatTime(selectedFlight.departure)}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">
                  {selectedFlight.route.origin.airport}
                </p>
              </div>
              <div className="col-span-4 flex flex-col items-center">
                <p className="text-[10px] font-bold text-gray-400">
                  {selectedFlight.stops === 0
                    ? "Non-stop"
                    : `${selectedFlight.stops} Stop`}
                </p>
                <div className="w-full flex items-center gap-1 my-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-600" />
                  <div className="flex-1 border-t border-dashed border-gray-300" />
                  <div className="w-2 h-2 rounded-full bg-green-600" />
                </div>
                <p className="text-xs font-bold text-gray-600">
                  {Math.floor(selectedFlight.durationMinutes / 60)}h{" "}
                  {selectedFlight.durationMinutes % 60}m
                </p>
              </div>
              <div className="col-span-4 text-right">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  {selectedFlight.route.destination.city}
                </p>
                <p className="text-3xl font-black text-gray-900">
                  {selectedFlight.route.destination.code}
                </p>
                <p className="text-base font-bold text-gray-800 mt-0.5">
                  {formatTime(selectedFlight.arrival)}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">
                  {selectedFlight.route.destination.airport}
                </p>
              </div>
            </div>

            {/* Date · Class · Status */}
            <div className="grid grid-cols-3 gap-3 border-t border-b border-dashed border-gray-200 py-4 text-xs">
              <div>
                <p className="text-gray-400 font-bold uppercase tracking-wider mb-1">
                  Date
                </p>
                <p className="font-bold text-gray-800 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />{" "}
                  {formatDate(selectedFlight.departure)}
                </p>
              </div>
              <div>
                <p className="text-gray-400 font-bold uppercase tracking-wider mb-1">
                  Class
                </p>
                <p className="font-bold text-gray-800">
                  {selectedFlight.cabinClass}
                </p>
              </div>
              <div>
                <p className="text-gray-400 font-bold uppercase tracking-wider mb-1">
                  Status
                </p>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  <CheckCircle2 className="w-3 h-3" /> Confirmed
                </span>
              </div>
            </div>

            {/* Passengers */}
            <div className="border-b border-dashed border-gray-200 pb-4">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">
                Passengers ({passengers.length})
              </p>
              <div className="space-y-1.5">
                {passengers.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="font-bold text-gray-800">
                      {p.firstName} {p.lastName}{" "}
                      <span className="text-gray-400 text-xs font-medium capitalize">
                        ({p.gender})
                      </span>
                    </span>
                    {p.passportNumber && (
                      <span className="text-xs text-gray-400">
                        PP: {p.passportNumber}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact + Baggage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs border-b border-dashed border-gray-200 pb-4">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">
                  Contact
                </p>
                <p className="flex items-center gap-1.5 text-gray-700 font-medium">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />{" "}
                  {bookingDetails.email}
                </p>
                <p className="flex items-center gap-1.5 text-gray-700 font-medium mt-1">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />{" "}
                  {bookingDetails.phone}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">
                  Baggage
                </p>
                <p className="text-gray-700 font-medium">
                  Cabin:{" "}
                  <span className="font-bold text-gray-900">
                    {selectedFlight.baggage.cabin}
                  </span>
                </p>
                <p className="text-gray-700 font-medium mt-1">
                  Checked:{" "}
                  <span className="font-bold text-gray-900">
                    {selectedFlight.baggage.checked}
                  </span>
                </p>
              </div>
            </div>

            {/* Barcode */}
            <div className="flex flex-col items-center gap-2 select-none">
              <div className="w-full h-10 bg-gray-900 rounded flex items-center justify-center px-4">
                <p className="text-[9px] font-black text-white tracking-widest truncate">
                  | ||| || ||| | || | |||| || | ||| || || | || | ||| || ||| | ||
                  | |||| || | ||| || || | ||
                </p>
              </div>
              <p className="text-[10px] font-bold text-gray-400 tracking-widest">
                {pnr} · BOARDING PASS · MOB-TKT
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 print:hidden">
          <button
            onClick={() => window.print()}
            className="flex items-center cursor-pointer gap-2 border border-gray-300 text-gray-600 hover:bg-gray-50 font-bold text-xs px-5 py-2.5 rounded-xl transition-colors bg-white"
          >
            <Printer className="w-4 h-4" /> Print Pass
          </button>
          <button
            onClick={async () => {
              const text = `Flight booking confirmed! PNR: ${pnr}`;
              if (navigator.share)
                await navigator.share({ title: "Flight Booking", text });
              else await navigator.clipboard.writeText(text);
            }}
            className="flex items-center cursor-pointer gap-2 border border-gray-300 text-gray-600 hover:bg-gray-50 font-bold text-xs px-5 py-2.5 rounded-xl transition-colors bg-white"
          >
            <Share2 className="w-4 h-4" /> Share Booking
          </button>
          <button
            disabled={mailStatus === "sending" || mailStatus === "sent"}
            onClick={() => {
              const state = useFlightStore.getState();
              if (!state.selectedFlight || !state.bookingDetails) return;
              sentRef.current = false;
              sendEmail(state.selectedFlight, state.bookingDetails, pnr);
            }}
            className="flex items-center cursor-pointer gap-2 border border-gray-300 text-gray-600 hover:bg-gray-50 font-bold text-xs px-5 py-2.5 rounded-xl transition-colors bg-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mailStatus === "sending" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {mailStatus === "sent" ? "Email Sent" : "Resend Email"}
          </button>
          <button
            onClick={handleBookAnother}
            className="flex items-center cursor-pointer gap-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-colors"
          >
            <Home className="w-4 h-4" /> Book Another Flight
          </button>
        </div>
      </div>
    </div>
  );
}
