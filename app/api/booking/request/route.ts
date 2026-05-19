import { NextResponse } from "next/server";

import { submitBookingFormData } from "@/lib/booking/submit-request";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const result = await submitBookingFormData(formData);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Booking API failed", error);

    return NextResponse.json(
      {
        error:
          "Die Buchung konnte nicht verarbeitet werden. Bitte versuchen Sie es erneut oder buchen Sie per WhatsApp.",
        success: false,
      },
      { status: 200 },
    );
  }
}
