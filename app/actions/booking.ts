"use server";

import {
  initialBookingState,
  submitBookingFormData,
  type BookingActionState,
} from "@/lib/booking/submit-request";

export { initialBookingState, type BookingActionState };

export async function submitBookingRequest(
  _prevState: BookingActionState,
  formData: FormData,
): Promise<BookingActionState> {
  return submitBookingFormData(formData);
}
