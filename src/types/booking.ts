export interface PassengerData {
  gender: string;
  firstName: string;
  lastName: string;
  passportNumber?: string;
}

export interface BookingFormData {
  passengers: PassengerData[];
  email: string;
  phone: string;
  agreeToTerms: boolean;
}
