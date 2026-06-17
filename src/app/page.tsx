"use client";

import FlightFilterSidebar from "@/components/Filters";
import FlightCard from "@/components/FlightCard";
import FlightSearch from "@/components/FlightSearch";
import FlightSortBar from "@/components/FlightSortBar";
import { useFlight } from "@/store/flightStore";

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

  const handleResetFilters = () => {
    setSelectedAirline(null);
    setFilters({
      selectedTime: null,
      baggage20kg: false,
      partiallyRefundable: false,
      layoverTime: 15,
      selectedAircraft: [],
    });
  };

  return (
    <div className="w-full bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs flex flex-col items-center justify-center space-y-4">
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-600 text-3xl">
        ✈️
      </div>
      <h3 className="text-xl font-bold text-gray-800">No Flights Found</h3>
      <p className="text-sm text-gray-500 max-w-md">
        {
          " We couldn't find any flights matching your search criteria. Try modifying your search locations, date, or resetting your sidebar filters."
        }
      </p>
      <button
        onClick={handleResetFilters}
        className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md"
      >
        Clear Filters
      </button>
    </div>
  );
}

export default function Home() {
  const { hasSearched, loading, filteredFlights } = useFlight();

  return (
    <main className="flex-1 flex flex-col pb-16">
      {/* Flight Search Banner */}
      <FlightSearch />

      {/* Results Section */}
      {hasSearched && (
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
              {/* Sidebar Filters */}
              <div className="lg:col-span-1 w-full lg:sticky lg:top-4 z-10">
                <FlightFilterSidebar />
              </div>

              {/* Main Flight Cards list */}
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
      )}
    </main>
  );
}

