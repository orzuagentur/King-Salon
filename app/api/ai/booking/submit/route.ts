import { NextResponse } from "next/server";

import { submitBookingFormData } from "@/lib/booking/submit-request";
import type { AiBookingDraft } from "@/lib/ai/booking/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const draft = (await request.json()) as AiBookingDraft;

    const formData = new FormData();
    formData.set("name", draft.customer_name ?? "");
    formData.set("phone", draft.customer_phone ?? "");
    formData.set("email", draft.customer_email ?? "");
    formData.set("message", draft.message ?? "");
    formData.set("appointment_date", draft.appointment_date ?? "");
    formData.set("appointment_time", draft.appointment_time ?? "");
    formData.set("master_id", draft.master_id ?? "");

    const result = await submitBookingFormData(formData);

    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("AI booking submit failed", error);

    return NextResponse.json(
      {
        success: false,
        error: "Die Buchung konnte nicht gesendet werden.",
      },
      { status: 500 },
    );
  }
}
