export interface Flight {
  id: string;
  airline: Airline;
  flightNumber: string;
  aircraft: Aircraft;
  route: Route;
  departure: string;
  arrival: string;
  durationMinutes: number;
  stops: number;
  stopDetails: StopDetail[];
  cabinClass: CabinClass;
  price: Price;
  baggage: Baggage;
  seatAvailability: number;
  refundable: boolean;
  changeAllowed: boolean;
  seatSelectionIncluded: boolean;
  priorityBoarding: boolean;
  loungeAccess: boolean;
  mealsIncluded: boolean;
  wifiAvailable: boolean;
  entertainmentAvailable: boolean;
  mobileTicketAvailable: boolean;
  status: FlightStatus;
  punctuality: number;
  carbonEmissionKg: number;
  rewardPointsEarned: number;
  lastBookedMinutesAgo: number;
  tags: string[];
}

export interface Airline {
  code: string;
  name: string;
  logo: string;
  rating: number;
}

export interface Aircraft {
  manufacturer: string;
  model: string;
}

export interface Route {
  origin: Airport;
  destination: Airport;
}

export interface Airport {
  code: string;
  city: string;
  airport: string;
  terminal: string;
}

export interface StopDetail {
  airport?: string;
  durationMinutes?: number;
}

export interface Price {
  baseFare: number;
  taxes: number;
  serviceFee: number;
  discount: number;
  total: number;
  currency: Currency;
}

export interface Baggage {
  cabin: string;
  checked: string;
}

export type CabinClass = "Economy" | "Business" | "First Class";

export type FlightStatus = "On Time" | "Delayed" | "Cancelled" | "Boarding";

export type Currency = "BDT" | "USD";
