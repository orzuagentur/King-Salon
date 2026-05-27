import type { DateAvailability } from "@/lib/booking/types";

export type AiBookingStep =
  | "date"
  | "time"
  | "master"
  | "name"
  | "phone"
  | "email"
  | "confirm"
  | "done";

export type AiBookingDraft = {
  appointment_date?: string;
  appointment_time?: string;
  master_id?: string;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  message?: string;
};

export type AiBookingModePayload = {
  active: boolean;
  draft: AiBookingDraft;
  step: AiBookingStep;
};

export type AiBookingValidateResult = {
  availability?: DateAvailability;
  error?: string;
  masters?: { id: string; name: string; title: string | null }[];
  nextStep?: AiBookingStep;
  ok: boolean;
  slots?: string[];
};
