import { useFlight } from "@/store/flightStore";

const FlightEmptyState = () => {
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
};

export default FlightEmptyState;
