"use client";

import { useFlight } from "@/store/flightStore";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  AlertCircle,
  ArrowRight,
  Mail,
  Phone,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import * as yup from "yup";

const passengerSchema = yup.object({
  gender: yup.string().required("Gender is required"),
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters")
    .matches(/^[A-Za-z\s]+$/, "First name can only contain letters"),
  lastName: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .matches(/^[A-Za-z\s]+$/, "Last name can only contain letters"),
  passportNumber: yup.string().optional().default(""),
});

const bookingSchema = yup
  .object({
    passengers: yup.array().of(passengerSchema).min(1).required(),
    email: yup
      .string()
      .required("Email address is required")
      .email("Please enter a valid email address"),
    phone: yup
      .string()
      .required("Mobile number is required")
      .matches(/^[0-9+\s-]{7,15}$/, "Please enter a valid mobile phone number"),
    agreeToTerms: yup
      .boolean()
      .required("You must accept the conditions to proceed")
      .oneOf([true], "You must accept the conditions to proceed"),
  })
  .required();

type BookingFormData = yup.InferType<typeof bookingSchema>;

const FlightBookingForm = () => {
  const router = useRouter();
  const { bookingDetails, setBookingDetails, searchCriteria } = useFlight();
  const passengerCount = searchCriteria.passengers;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormData>({
    resolver: yupResolver(bookingSchema),
    defaultValues: {
      passengers:
        bookingDetails?.passengers?.length === passengerCount
          ? bookingDetails.passengers
          : Array.from({ length: passengerCount }, () => ({
              gender: "male",
              firstName: "",
              lastName: "",
              passportNumber: "",
            })),
      email: bookingDetails?.email || "",
      phone: bookingDetails?.phone || "",
      agreeToTerms: bookingDetails?.agreeToTerms || false,
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "passengers",
  });

  const onSubmit: SubmitHandler<BookingFormData> = (data) => {
    setBookingDetails(data);
    router.push("/confirmation");
  };

  return (
    <div className="w-full max-w-3xl rounded-3xl shadow-xl border-2 border-green-400 overflow-hidden font-sans antialiased text-gray-800 backdrop-blur-sm">
      <div className="p-6 border-b-4 border-green-700/20 flex items-center justify-between shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        <div className="relative z-10">
          <h2 className="text-xl font-black text-green-500 tracking-tight drop-shadow-md flex items-center gap-2">
            <Users /> Passenger Details
          </h2>
          <p className="text-xs text-green-500 mt-1 font-medium">
            Please enter information exactly as it appears on your passport or
            ID card.
          </p>
        </div>
        <span className="hidden sm:inline-flex bg-white/20 backdrop-blur-md text-green-500 text-[10px] font-black tracking-wider uppercase px-3 py-1.5 rounded-full border border-white/30 shadow-lg relative z-10">
          Step 2 of 3
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="space-y-4 bg-linear-to-br from-green-50/30 via-white to-emerald-50/20 p-5 rounded-2xl border-2 border-green-100 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center gap-2 pb-2 border-b-2 border-green-200">
              <div className="bg-green-600 text-white rounded-full p-1.5 shadow-md">
                <User className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-black text-gray-800 tracking-tight">
                Passenger {index + 1} (Adult)
                {index === 0 && " - Lead Passenger"}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-black text-gray-900 mb-1.5">
                  Gender
                </label>
                <select
                  {...register(`passengers.${index}.gender`)}
                  className={`w-full bg-white border-2 rounded-xl px-3 py-3 text-xs font-bold focus:outline-none transition-all duration-200 shadow-sm hover:shadow-md focus:ring-4 focus:ring-green-100 ${
                    errors.passengers?.[index]?.gender
                      ? "border-red-400 focus:border-red-500"
                      : "border-green-200 focus:border-green-500"
                  }`}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.passengers?.[index]?.gender && (
                  <p className="flex items-center gap-1 text-[11px] font-bold text-red-600 mt-1 animate-pulse">
                    <AlertCircle className="w-3 h-3" />{" "}
                    {errors.passengers[index]?.gender?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-black text-gray-900 mb-1.5">
                  First / Given Name
                </label>
                <input
                  type="text"
                  placeholder="John"
                  {...register(`passengers.${index}.firstName`)}
                  className={`w-full bg-white border-2 rounded-xl px-3 py-3 text-xs font-semibold placeholder:text-gray-400 focus:outline-none transition-all duration-200 shadow-sm hover:shadow-md focus:ring-4 focus:ring-green-100 ${
                    errors.passengers?.[index]?.firstName
                      ? "border-red-400 focus:border-red-500"
                      : "border-green-200 focus:border-green-500"
                  }`}
                />
                {errors.passengers?.[index]?.firstName && (
                  <p className="flex items-center gap-1 text-[11px] font-bold text-red-600 mt-1 animate-pulse">
                    <AlertCircle className="w-3 h-3" />{" "}
                    {errors.passengers[index]?.firstName?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-black text-gray-900 mb-1.5">
                  Last / Surname
                </label>
                <input
                  type="text"
                  placeholder="Doe"
                  {...register(`passengers.${index}.lastName`)}
                  className={`w-full bg-white border-2 rounded-xl px-3 py-3 text-xs font-semibold placeholder:text-gray-400 focus:outline-none transition-all duration-200 shadow-sm hover:shadow-md focus:ring-4 focus:ring-green-100 ${
                    errors.passengers?.[index]?.lastName
                      ? "border-red-400 focus:border-red-500"
                      : "border-green-200 focus:border-green-500"
                  }`}
                />
                {errors.passengers?.[index]?.lastName && (
                  <p className="flex items-center gap-1 text-[11px] font-bold text-red-600 mt-1 animate-pulse">
                    <AlertCircle className="w-3 h-3" />{" "}
                    {errors.passengers[index]?.lastName?.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-900 mb-1.5">
                Passport Number (Optional for Domestic)
              </label>
              <input
                type="text"
                placeholder="AXXXXXXXX"
                {...register(`passengers.${index}.passportNumber`)}
                className="w-full bg-white border-2 border-green-200 rounded-xl px-3 py-3 text-xs font-semibold placeholder:text-gray-400 focus:border-green-500 focus:outline-none transition-all duration-200 shadow-sm hover:shadow-md focus:ring-4 focus:ring-green-100"
              />
            </div>
          </div>
        ))}

        <div className="space-y-4 pt-2 bg-linear-to-br from-blue-50/30 via-white to-cyan-50/20 p-5 rounded-2xl border-2 border-blue-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-2 pb-2 border-b-2 border-blue-200">
            <div className="bg-blue-600 text-white rounded-full p-1.5 shadow-md">
              <Mail className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black text-gray-800 tracking-tight">
              Contact Details (Lead Passenger)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-900 mb-1.5">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-gray-300 absolute left-3 pointer-events-none" />
                <input
                  type="email"
                  placeholder="johndoe@example.com"
                  {...register("email")}
                  className={`w-full bg-white border-2 rounded-xl pl-9 pr-3 py-3 text-xs font-semibold placeholder:text-gray-400 focus:outline-none transition-all duration-200 shadow-sm hover:shadow-md focus:ring-4 focus:ring-blue-100 ${
                    errors.email
                      ? "border-red-400 focus:border-red-500"
                      : "border-blue-200 focus:border-blue-500"
                  }`}
                />
              </div>
              {errors.email ? (
                <p className="flex items-center gap-1 text-[11px] font-bold text-red-600 mt-1 animate-pulse">
                  <AlertCircle className="w-3 h-3" /> {errors.email.message}
                </p>
              ) : (
                <p className="text-[10px] text-gray-400 mt-1">
                  Your e-ticket and flight status alerts will be routed here.
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-black text-gray-900 mb-1.5">
                Mobile Number
              </label>
              <div className="relative flex items-center">
                <Phone className="w-4 h-4 text-gray-300 absolute left-3 pointer-events-none" />
                <input
                  type="tel"
                  placeholder="+880 1XXXX-XXXXXX"
                  {...register("phone")}
                  className={`w-full bg-white border-2 rounded-xl pl-9 pr-3 py-3 text-xs font-semibold placeholder:text-gray-400 focus:outline-none transition-all duration-200 shadow-sm hover:shadow-md focus:ring-4 focus:ring-blue-100 ${
                    errors.phone
                      ? "border-red-400 focus:border-red-500"
                      : "border-blue-200 focus:border-blue-500"
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="flex items-center gap-1 text-[11px] font-bold text-red-600 mt-1 animate-pulse">
                  <AlertCircle className="w-3 h-3" /> {errors.phone.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-linear-to-br from-amber-50 via-yellow-50/50 to-orange-50/30 border-2 border-amber-200 rounded-2xl p-5 space-y-3 shadow-md">
          <label className="flex items-start gap-3 cursor-pointer group select-none">
            <input
              type="checkbox"
              {...register("agreeToTerms")}
              className="w-5 h-5 rounded-md text-green-600 border-2 border-green-400 focus:ring-green-500 accent-green-600 cursor-pointer mt-0.5 shadow-sm"
            />
            <span className="text-xs font-semibold text-gray-700 leading-tight group-hover:text-gray-900 transition-colors">
              {
                "By checking this box, I declare that I accept the airline's standard conditions of carriage, dynamic fare rules, and verify all name configurations provided match identity documents."
              }
            </span>
          </label>
          {errors.agreeToTerms && (
            <p className="flex items-center gap-1 text-[11px] font-bold text-red-600 mt-0.5 pl-7 animate-pulse">
              <AlertCircle className="w-3 h-3" /> {errors.agreeToTerms.message}
            </p>
          )}

          <div className="flex items-center gap-2 text-[10px] font-extrabold text-emerald-700 border-t-2 border-amber-200 pt-3 bg-white/40 px-2 py-1.5 rounded-lg">
            <ShieldCheck className="w-4 h-4 animate-pulse" />
            <span>
              🔒 Secure 256-Bit SSL encrypted booking checkout pipeline
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 sm:justify-end pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-full sm:w-auto cursor-pointer border-2 border-gray-300 text-gray-600 font-bold text-sm px-6 py-3.5 rounded-xl hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 order-2 sm:order-1 shadow-sm hover:shadow-md"
          >
            Back to Flights
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto cursor-pointer bg-linear-to-r from-green-600 via-green-500 to-emerald-600 hover:from-green-700 hover:via-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-black text-sm px-8 py-3.5 rounded-xl shadow-xl shadow-green-600/30 hover:shadow-2xl hover:shadow-green-600/40 flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 disabled:scale-100 order-1 sm:order-2 border-2 border-green-700/20"
          >
            <span>
              {isSubmitting ? "Processing..." : "Continue to Booking"}
            </span>
            {!isSubmitting && <ArrowRight className="w-5 h-5" />}
          </button>
        </div>
      </form>
    </div>
  );
};
export default FlightBookingForm;
