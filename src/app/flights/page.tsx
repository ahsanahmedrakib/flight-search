"use client";

import FlightCard from "@/components/FlightCard";
import FlightFilterSidebar from "@/components/FlightFiltersSidebar";
import FlightSearch from "@/components/FlightSearch";
import FlightSortBar from "@/components/FlightSortBar";
import { useFlight } from "@/store/flightStore";
import { Filter, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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
  const { setFilters, setSelectedAirline, lastAction } = useFlight();

  return (
    <div className="w-full bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs flex flex-col items-center justify-center space-y-4">
      <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-3xl">
        ✈️
      </div>
      <h3 className="text-xl font-bold text-gray-800">No Flights Found</h3>
      <p className="text-sm text-gray-500 max-w-md">
        We couldn&apos;t find any flights matching your criteria. Try modifying
        your search or resetting filters.
      </p>
      {lastAction !== "search" && (
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
              stopsFilter: "all",
              mealsIncluded: false,
              seatSelectionIncluded: false,
              changeAllowed: false,
              minPunctuality: 0,
            });
          }}
          className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}

export default function FlightsContent() {
  const { hasSearched, loading, filteredFlights, triggerSearch, lastAction } =
    useFlight();
  const searchParams = useSearchParams();
  const searchRef = useRef<HTMLDivElement>(null);

  const [showMobileFilters, setShowMobileFilters] = useState(false);

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

  const hasUrlParams =
    searchParams.get("from") &&
    searchParams.get("to") &&
    searchParams.get("date");

  const shouldHideSidebar =
    lastAction === "search" && filteredFlights.length === 0;

  if (!hasSearched && !hasUrlParams) return null;

  if (!hasSearched && hasUrlParams) {
    return (
      <main className="flex-1 flex flex-col pb-16">
        <div ref={searchRef}>
          <FlightSearch isSearching={true} />
        </div>
        <div className="max-w-7xl mx-auto px-4 w-full mt-10">
          <LoadingSkeleton />
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col pb-16">
      <div ref={searchRef}>
        <FlightSearch isSearching={loading} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-8 lg:mt-10">
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {/* Mobile Filter & Results Count Row */}
            {!shouldHideSidebar && (
              <div className="lg:hidden flex items-center justify-between mb-6 mt-4">
                <div className="text-sm font-bold text-gray-600">
                  {filteredFlights.length} Flights Found
                </div>
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="flex items-center text-green-600 gap-2 bg-white border border-gray-200 hover:border-green-500 px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm active:scale-95 transition-all"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Desktop Sidebar */}
              {!shouldHideSidebar && (
                <div className="hidden lg:block lg:col-span-3 xl:col-span-3 lg:sticky lg:top-6">
                  <div className="lg:sticky lg:top-6">
                    <FlightFilterSidebar />
                  </div>
                </div>
              )}

              {/* Main Content */}
              <div
                className={`${
                  shouldHideSidebar
                    ? "lg:col-span-12"
                    : "lg:col-span-9 xl:col-span-9"
                } space-y-6 w-full`}
              >
                <div className="w-full">
                  <FlightSortBar />
                </div>

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
          </>
        )}
      </div>

      {/* Mobile Filter Drawer */}
      {!shouldHideSidebar && (
        <div
          className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
            showMobileFilters
              ? "opacity-100 visible"
              : "opacity-0 invisible pointer-events-none"
          }`}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowMobileFilters(false)}
          />

          {/* Drawer */}
          <div
            className={`absolute right-0 top-0 bottom-0 w-[85%] max-w-[320px] bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${
              showMobileFilters ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold text-green-400">Filters</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden">
              <FlightFilterSidebar />
            </div>

            <div className="p-4 border-t bg-gray-50">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-lg active:scale-95 transition-all text-sm flex items-center justify-center gap-1.5"
              >
                <span>Show Results</span>
                <span className="bg-white/20 px-2 py-0.5 rounded-md text-xs font-black">
                  {filteredFlights.length}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
