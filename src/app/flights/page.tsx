"use client";

import FlightCard from "@/components/FlightCard";
import FlightFilterSidebar from "@/components/FlightFiltersSidebar";
import FlightSearch from "@/components/FlightSearch";
import FlightSortBar from "@/components/FlightSortBar";
import { useFlight } from "@/store/flightStore";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

function LoadingSkeleton() {
  return (
    <div className="w-full space-y-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="w-full bg-white rounded-2xl border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <div className="flex-1 space-y-4 w-full">
            <div className="flex gap-2">
              <div className="h-5 bg-gray-200 rounded-full w-24" />
              <div className="h-5 bg-gray-200 rounded-full w-16" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
              <div className="h-8 bg-gray-200 rounded-xl" />
              <div className="h-8 bg-gray-200 rounded-xl" />
              <div className="h-4 bg-gray-200 rounded-xl" />
              <div className="h-8 bg-gray-200 rounded-xl" />
            </div>
          </div>
          <div className="w-full md:w-48 h-24 bg-gray-200 rounded-xl" />
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  const { setFilters, setSelectedAirline } = useFlight();

  return (
    <div className="w-full bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs flex flex-col items-center justify-center space-y-4">
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-3xl">
        ✈️
      </div>
      <h3 className="text-xl font-bold text-gray-800">No Flights Found</h3>
      <p className="text-sm text-gray-500 max-w-md">
        We couldn&apos;t find any flights matching your criteria. Try modifying
        your search or resetting filters.
      </p>
      <button
        onClick={() => {
          setSelectedAirline(null);
          setFilters({
            selectedTime: null,
            partiallyRefundable: false,
            layoverTime: 15,
            selectedAircraft: [],
            selectedAirlines: [],
            maxPrice: 0,
          });
        }}
        className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md"
      >
        Clear Filters
      </button>
    </div>
  );
}

function FlightsContent() {
  const { hasSearched, loading, filteredFlights, triggerSearch } = useFlight();
  const searchParams = useSearchParams();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = searchRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      document.documentElement.style.setProperty(
        "--search-h",
        `${el.offsetHeight}px`,
      );
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const date = searchParams.get("date");
    if (from && to && date && !hasSearched) {
      triggerSearch({
        from,
        to,
        departureDate: date,
        returnDate: searchParams.get("returnDate") ?? "",
        passengers: Number(searchParams.get("passengers") ?? 1),
        cabinClass: searchParams.get("class") ?? "Economy",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!hasSearched && !searchParams.get("from")) return null;

  return (
    <main className="flex-1 flex flex-col pb-16">
      <div ref={searchRef}>
        <FlightSearch />
      </div>

      <div className="max-w-7xl mx-auto px-4 w-full mt-10">
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 hidden lg:block">
              <div className="w-full h-96 bg-white rounded-2xl border border-gray-100 animate-pulse" />
            </div>
            <div className="lg:col-span-3">
              <LoadingSkeleton />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            <div className="lg:col-span-1 w-full sticky top-2">
              <FlightFilterSidebar />
            </div>
            <div className="lg:col-span-3 space-y-6 w-full">
              <FlightSortBar />
              {filteredFlights.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="space-y-4">
                  {filteredFlights.map((flight) => (
                    <FlightCard key={flight.id} flight={flight} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function FlightsPage() {
  return (
    <Suspense>
      <FlightsContent />
    </Suspense>
  );
}

