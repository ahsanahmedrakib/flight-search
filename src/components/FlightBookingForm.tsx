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
} from "lucide-react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

// 1. Define the Validation Schema
const bookingSchema = yup
  .object({
    gender: yup.string().required("Gender selection is required"),
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
    email: yup
      .string()
      .required("Email address is required")
      .email("Please enter a valid email address"),
    phone: yup
      .string()
      .required("Mobile number is required")
      .matches(/^[0-9+\s-]{7,15}$/, "Please enter a valid mobile phone number"),
    passportNumber: yup.string().optional().default(""),
    agreeToTerms: yup
      .boolean()
      .required("You must accept the conditions to proceed")
      .oneOf([true], "You must accept the conditions to proceed"),
  })
  .required();

// Infer the TypeScript type from the schema (best practice)
type BookingFormData = yup.InferType<typeof bookingSchema>;

export default function FlightBookingForm() {
  const router = useRouter();
  const { bookingDetails, setBookingDetails } = useFlight();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormData>({
    resolver: yupResolver(bookingSchema),
    defaultValues: {
      gender: bookingDetails?.gender || "male",
      firstName: bookingDetails?.firstName || "",
      lastName: bookingDetails?.lastName || "",
      email: bookingDetails?.email || "",
      phone: bookingDetails?.phone || "",
      passportNumber: bookingDetails?.passportNumber || "",
      agreeToTerms: bookingDetails?.agreeToTerms || false,
    },
  });

  // 3. Handle Form Submission
  const onSubmit: SubmitHandler<BookingFormData> = (data) => {
    setBookingDetails(data);
    router.push("/confirmation");
  };

  return (
    <div className="w-full max-w-3xl bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden font-sans antialiased text-gray-800">
      {/* Form Header */}
      <div className="bg-linear-to-r from-red-50 to-white p-5 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-gray-900 tracking-tight">
            Passenger Details
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Please enter information exactly as it appears on your passport or
            ID card.
          </p>
        </div>
        <span className="hidden sm:inline-block bg-red-600 text-white text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-md">
          Step 2 of 3
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {/* 1. Primary Passenger Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-1 border-b border-gray-50">
            <User className="w-4 h-4 text-red-600" />
            <h3 className="text-sm font-bold text-gray-700">
              Passenger 1 (Adult)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Gender Field */}
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1.5">
                Gender
              </label>
              <select
                {...register("gender")}
                className={`w-full bg-gray-50/50 border rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none transition-colors ${
                  errors.gender
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 focus:border-red-500"
                }`}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <p className="flex items-center gap-1 text-[11px] font-medium text-red-500 mt-1">
                  <AlertCircle className="w-3 h-3" /> {errors.gender.message}
                </p>
              )}
            </div>

            {/* First Name Field */}
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1.5">
                First / Given Name
              </label>
              <input
                type="text"
                placeholder="John"
                {...register("firstName")}
                className={`w-full bg-gray-50/50 border rounded-xl px-3 py-2.5 text-xs font-semibold placeholder:text-gray-300 focus:outline-none transition-colors ${
                  errors.firstName
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 focus:border-red-500"
                }`}
              />
              {errors.firstName && (
                <p className="flex items-center gap-1 text-[11px] font-medium text-red-500 mt-1">
                  <AlertCircle className="w-3 h-3" /> {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Last Name Field */}
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1.5">
                Last / Surname
              </label>
              <input
                type="text"
                placeholder="Doe"
                {...register("lastName")}
                className={`w-full bg-gray-50/50 border rounded-xl px-3 py-2.5 text-xs font-semibold placeholder:text-gray-300 focus:outline-none transition-colors ${
                  errors.lastName
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 focus:border-red-500"
                }`}
              />
              {errors.lastName && (
                <p className="flex items-center gap-1 text-[11px] font-medium text-red-500 mt-1">
                  <AlertCircle className="w-3 h-3" /> {errors.lastName.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 2. Contact Information Section */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 pb-1 border-b border-gray-50">
            <Mail className="w-4 h-4 text-red-600" />
            <h3 className="text-sm font-bold text-gray-700">Contact Details</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1.5">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-gray-300 absolute left-3 pointer-events-none" />
                <input
                  type="email"
                  placeholder="johndoe@example.com"
                  {...register("email")}
                  className={`w-full bg-gray-50/50 border rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold placeholder:text-gray-300 focus:outline-none transition-colors ${
                    errors.email
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-200 focus:border-red-500"
                  }`}
                />
              </div>
              {errors.email ? (
                <p className="flex items-center gap-1 text-[11px] font-medium text-red-500 mt-1">
                  <AlertCircle className="w-3 h-3" /> {errors.email.message}
                </p>
              ) : (
                <p className="text-[10px] text-gray-400 mt-1">
                  Your e-ticket and flight status alerts will be routed here.
                </p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1.5">
                Mobile Number
              </label>
              <div className="relative flex items-center">
                <Phone className="w-4 h-4 text-gray-300 absolute left-3 pointer-events-none" />
                <input
                  type="tel"
                  placeholder="+880 1XXXX-XXXXXX"
                  {...register("phone")}
                  className={`w-full bg-gray-50/50 border rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold placeholder:text-gray-300 focus:outline-none transition-colors ${
                    errors.phone
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-200 focus:border-red-500"
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="flex items-center gap-1 text-[11px] font-medium text-red-500 mt-1">
                  <AlertCircle className="w-3 h-3" /> {errors.phone.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 3. Optional Travel Details */}
        <div className="grid grid-cols-1 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5">
              Passport Number (Optional for Domestic)
            </label>
            <input
              type="text"
              placeholder="AXXXXXXXX"
              {...register("passportNumber")}
              className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold placeholder:text-gray-300 focus:border-red-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* 4. Terms Validation Box */}
        <div className="bg-gray-50/60 border border-gray-100 rounded-xl p-4 space-y-3">
          <label className="flex items-start gap-3 cursor-pointer group select-none">
            <input
              type="checkbox"
              {...register("agreeToTerms")}
              className="w-4 h-4 rounded text-red-600 border-gray-300 focus:ring-red-500 accent-red-600 cursor-pointer mt-0.5"
            />
            <span className="text-xs font-medium text-gray-500 leading-tight group-hover:text-gray-700 transition-colors">
              {
                "By checking this box, I declare that I accept the airline's standard conditions of carriage, dynamic fare rules, and verify all name configurations provided match identity documents."
              }
            </span>
          </label>
          {errors.agreeToTerms && (
            <p className="flex items-center gap-1 text-[11px] font-medium text-red-500 mt-0.5 pl-7">
              <AlertCircle className="w-3 h-3" /> {errors.agreeToTerms.message}
            </p>
          )}

          <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 border-t border-gray-200/60 pt-2.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Secure 256-Bit SSL encrypted booking checkout pipeline</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:justify-end pt-2">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="w-full sm:w-auto border border-gray-200 text-gray-500 font-bold text-xs px-5 py-3 rounded-xl hover:bg-gray-50 transition-colors order-2 sm:order-1"
          >
            Back to Flights
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md shadow-red-600/10 flex items-center justify-center gap-2 transition-all order-1 sm:order-2"
          >
            <span>
              {isSubmitting ? "Processing..." : "Continue to Payment"}
            </span>
            {!isSubmitting && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </form>
    </div>
  );
}
