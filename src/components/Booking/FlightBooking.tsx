import { Suspense } from "react";
import FlightBookingContent from "./FlightBookingContent";

const FlightBookingPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center space-y-4">
            <div className="animate-bounce text-green-600 text-3xl font-bold">
              ✈️
            </div>
            <p className="text-gray-500 font-semibold text-sm">Loading...</p>
          </div>
        </div>
      }
    >
      <FlightBookingContent />
    </Suspense>
  );
};
export default FlightBookingPage;
