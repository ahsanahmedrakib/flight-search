import { Suspense } from "react";
import FlightsContent from "./FlightsContent";
import LoadingSkeleton from "./LoadingSkeleton";

const FlightsPage = () => {
  return (
    <Suspense
      fallback={
        <main className="flex-1 flex flex-col pb-16 bg-slate-900 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 w-full mt-10">
            <LoadingSkeleton />
          </div>
        </main>
      }
    >
      <FlightsContent />
    </Suspense>
  );
};

export default FlightsPage;
