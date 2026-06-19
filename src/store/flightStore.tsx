import rawFlights from "@/data/flights.json";
import { getFormattedDate } from "@/lib/utils";
import { BookingFormData } from "@/types/booking";
import { Flight } from "@/types/flight";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface SearchCriteria {
  from: string;
  to: string;
  departureDate: string;
  returnDate: string;
  passengers: number;
  cabinClass: string;
}

export interface FiltersState {
  selectedTime: string | null;
  partiallyRefundable: boolean;
  layoverTime: number;
  selectedAircraft: string[];
  selectedAirlines: string[];
  maxPrice: number;
  stopsFilter: "all" | "nonstop" | "1stop";
  mealsIncluded: boolean;
  seatSelectionIncluded: boolean;
  changeAllowed: boolean;
  minPunctuality: number;
}

interface FlightStore {
  searchCriteria: SearchCriteria;
  hasSearched: boolean;
  loading: boolean;
  flights: Flight[];
  selectedAirline: string | null;
  sortBy: string;
  filters: FiltersState;
  selectedFlight: Flight | null;
  bookingDetails: BookingFormData | null;
  lastAction: string | null;

  // Error Handling
  error: string | null;

  // Computed
  filteredFlights: () => Flight[];

  // Actions
  setSearchCriteria: (criteria: SearchCriteria) => void;
  triggerSearch: (criteria: SearchCriteria) => void;
  setFilters: (
    filters: FiltersState | ((prev: FiltersState) => FiltersState),
  ) => void;
  setSortBy: (sort: string) => void;
  setSelectedAirline: (airline: string | null) => void;
  setSelectedFlight: (flight: Flight | null) => void;
  setBookingDetails: (details: BookingFormData | null) => void;
  clearError: () => void; // New
  resetAll: () => void;
}

export const allRawFlights = rawFlights as unknown as Flight[];

const departureDate = getFormattedDate(0);
const returnDate = getFormattedDate(1);

const defaultCriteria: SearchCriteria = {
  from: "Dhaka",
  to: "Cox's Bazar",
  departureDate: departureDate,
  returnDate: returnDate,
  passengers: 1,
  cabinClass: "Economy",
};

const defaultFilters: FiltersState = {
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
};

export const useFlightStore = create<FlightStore>()(
  persist(
    (set, get) => ({
      searchCriteria: defaultCriteria,
      hasSearched: false,
      loading: false,
      flights: [],
      selectedAirline: null,
      sortBy: "cheapest",
      filters: defaultFilters,
      selectedFlight: null,
      bookingDetails: null,
      lastAction: null,
      error: null,

      filteredFlights: () => {
        const { flights, selectedAirline, filters, sortBy } = get();
        let result = [...flights];

        if (selectedAirline) {
          result = result.filter((f) => f.airline.code === selectedAirline);
        }

        if (filters.selectedTime) {
          result = result.filter((f) => {
            const depHour = parseInt(f.departure.split("T")[1] || "0");
            if (filters.selectedTime === "morning")
              return depHour >= 5 && depHour < 12;
            if (filters.selectedTime === "afternoon")
              return depHour >= 12 && depHour < 18;
            if (filters.selectedTime === "evening")
              return depHour >= 18 && depHour <= 23;
            if (filters.selectedTime === "night")
              return depHour >= 0 && depHour < 5;
            return true;
          });
        }

        if (filters.stopsFilter === "nonstop") {
          result = result.filter((f) => f.stops === 0);
        } else if (filters.stopsFilter === "1stop") {
          result = result.filter((f) => f.stops === 1);
        }

        if (filters.mealsIncluded)
          result = result.filter((f) => f.mealsIncluded);
        if (filters.seatSelectionIncluded)
          result = result.filter((f) => f.seatSelectionIncluded);
        if (filters.changeAllowed)
          result = result.filter((f) => f.changeAllowed);
        if (filters.minPunctuality > 0)
          result = result.filter(
            (f) => f.punctuality >= filters.minPunctuality,
          );

        if (filters.partiallyRefundable) {
          result = result.filter((f) => f.refundable === true);
        }

        if (filters.selectedAirlines.length > 0) {
          result = result.filter((f) =>
            filters.selectedAirlines.includes(f.airline.code),
          );
        }

        if (filters.layoverTime < 15) {
          result = result.filter((f) => {
            if (f.stops === 0) return true;
            const totalLayoverMins = (
              f.stopDetails as { durationMinutes?: number }[]
            ).reduce(
              (acc, stop) => acc + (Number(stop.durationMinutes) || 0),
              0,
            );
            return totalLayoverMins <= filters.layoverTime * 60;
          });
        }

        if (filters.selectedAircraft.length > 0) {
          result = result.filter((f) => {
            const code = f.aircraft.model
              .replace(/[^a-zA-Z0-9]/g, "")
              .toUpperCase();
            return filters.selectedAircraft.includes(code);
          });
        }

        if (filters.maxPrice > 0) {
          const pax = get().searchCriteria.passengers;
          result = result.filter(
            (f) => f.price.total * pax <= filters.maxPrice,
          );
        }

        result.sort((a, b) => {
          if (sortBy === "cheapest") return a.price.total - b.price.total;
          if (sortBy === "fastest")
            return a.durationMinutes - b.durationMinutes;
          if (sortBy === "earliest" || sortBy === "more_early_dep")
            return (
              new Date(a.departure).getTime() - new Date(b.departure).getTime()
            );
          if (sortBy === "more_late_dep")
            return (
              new Date(b.departure).getTime() - new Date(a.departure).getTime()
            );
          if (sortBy === "more_early_arr")
            return (
              new Date(a.arrival).getTime() - new Date(b.arrival).getTime()
            );
          if (sortBy === "more_late_arr")
            return (
              new Date(b.arrival).getTime() - new Date(a.arrival).getTime()
            );
          return 0;
        });

        return result;
      },

      setSearchCriteria: (criteria) => set({ searchCriteria: criteria }),

      triggerSearch: (criteria) => {
        set(() => ({
          searchCriteria: criteria,
          loading: true,
          hasSearched: true,
          selectedAirline: null,
          sortBy: "cheapest",
          filters: defaultFilters,
          error: null, // Clear previous error
          lastAction: "search",
        }));

        setTimeout(() => {
          try {
            const matches = allRawFlights.filter((flight) => {
              const fromMatch =
                flight.route.origin.city.toLowerCase() ===
                  criteria.from.toLowerCase() ||
                flight.route.origin.code.toLowerCase() ===
                  criteria.from.toLowerCase();
              const toMatch =
                flight.route.destination.city.toLowerCase() ===
                  criteria.to.toLowerCase() ||
                flight.route.destination.code.toLowerCase() ===
                  criteria.to.toLowerCase();
              return fromMatch && toMatch;
            });

            if (matches.length === 0) {
              throw new Error(
                `No flights found from ${criteria.from} to ${criteria.to}`,
              );
            }

            const adjusted = matches.map((flight) => ({
              ...flight,
              departure: `${criteria.departureDate}T${flight.departure.split("T")[1] || "12:00:00"}`,
              arrival: `${criteria.departureDate}T${flight.arrival.split("T")[1] || "13:00:00"}`,
            }));

            set({
              flights: adjusted,
              loading: false,
              error: null,
            });
          } catch (err) {
            set({
              flights: [],
              loading: false,
              error:
                err instanceof Error
                  ? err.message
                  : "Failed to fetch flights. Please try again.",
            });
          }
        }, 800);
      },

      clearError: () => set({ error: null }),

      setFilters: (filters) =>
        set((state) => {
          const nextFilters =
            typeof filters === "function" ? filters(state.filters) : filters;
          return {
            filters: nextFilters,
            lastAction: "filter",
          };
        }),

      setSortBy: (sort) =>
        set(() => ({
          sortBy: sort,
          lastAction: "sort",
        })),

      setSelectedAirline: (airline) =>
        set(() => ({
          selectedAirline: airline,
          lastAction: "filter",
        })),

      setSelectedFlight: (flight) =>
        set(() => ({
          selectedFlight: flight,
          lastAction: "selection",
        })),

      setBookingDetails: (details) => set({ bookingDetails: details }),

      resetAll: () =>
        set({
          searchCriteria: defaultCriteria,
          hasSearched: false,
          loading: false,
          selectedAirline: null,
          sortBy: "cheapest",
          filters: defaultFilters,
          selectedFlight: null,
          bookingDetails: null,
          flights: [],
          lastAction: null,
          error: null, // ← Clear error on reset
        }),
    }),
    {
      name: "flight-store",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        searchCriteria: state.searchCriteria,
        hasSearched: state.hasSearched,
        flights: state.flights,
        selectedFlight: state.selectedFlight,
        bookingDetails: state.bookingDetails,
        sortBy: state.sortBy,
        filters: state.filters,
        selectedAirline: state.selectedAirline,
        lastAction: state.lastAction,
        error: state.error, // ← Persist error
      }),
    },
  ),
);

// Backwards-compatible hook — keeps all consumer components unchanged
export function useFlight() {
  const store = useFlightStore();
  return {
    ...store,
    filteredFlights: store.filteredFlights(),
  };
}

