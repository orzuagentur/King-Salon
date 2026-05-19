import { NextResponse } from "next/server";

import { fetchDateAvailability } from "@/app/actions/booking-availability";

export async function GET(request: Request) {
  const date = new URL(request.url).searchParams.get("date");

  if (!date) {
    return NextResponse.json({ error: "date required" }, { status: 400 });
  }

  try {
    const availability = await fetchDateAvailability(date);

    return NextResponse.json(availability);
  } catch {
    return NextResponse.json(
      {
        availabilityByMaster: {},
        closed: true,
        closedMessage:
          "Verfügbarkeit konnte nicht geladen werden. Bitte später erneut versuchen oder per WhatsApp buchen.",
        date,
        masters: [],
        slots: [],
      },
      { status: 200 },
    );
  }
}
