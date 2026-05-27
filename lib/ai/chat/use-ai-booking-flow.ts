"use client";

import { useCallback, useState } from "react";

import {
  findMasterIdByName,
  parseEmailInput,
  parseGermanDateInput,
  parseNameInput,
  parsePhoneInput,
  parseTimeInput,
} from "@/lib/ai/booking/parse-input";
import type { AiBookingDraft, AiBookingStep, AiBookingValidateResult } from "@/lib/ai/booking/types";
import type { DateAvailability } from "@/lib/booking/types";
import { formatBookingSummary } from "@/lib/ai/booking/validate-draft";

type UseAiBookingFlowOptions = {
  onBooked?: (message: string) => void;
  onStepMessage?: (message: string) => void;
};

function isBookingIntent(text: string) {
  return /(termin|buchen|buchung|reservier|appointment|freier termin|uhrzeit.*frei)/i.test(text);
}

function isConfirmIntent(text: string) {
  return /^(ja|jep|ok|okay|bestätigen|bestaetigen|passt|stimmt|genau)\b/i.test(text.trim());
}

function isCancelIntent(text: string) {
  return /(abbrechen|stop|stopp|kein termin|später|spaeter)/i.test(text);
}

async function validateStep(step: AiBookingStep, draft: AiBookingDraft) {
  const response = await fetch("/api/ai/booking/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ step, draft }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("validation failed");
  }

  return (await response.json()) as AiBookingValidateResult;
}

export function useAiBookingFlow({ onBooked, onStepMessage }: UseAiBookingFlowOptions = {}) {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState<AiBookingStep>("date");
  const [draft, setDraft] = useState<AiBookingDraft>({});
  const [availability, setAvailability] = useState<DateAvailability | null>(null);
  const [fieldError, setFieldError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const reset = useCallback(() => {
    setActive(false);
    setStep("date");
    setDraft({});
    setAvailability(null);
    setFieldError("");
    setIsProcessing(false);
  }, []);

  const start = useCallback(() => {
    setActive(true);
    setStep("date");
    setDraft({});
    setAvailability(null);
    setFieldError("");
    onStepMessage?.(
      "Gerne helfe ich bei der Terminanfrage. An welchem Tag möchten Sie kommen? (z. B. morgen oder 15.06.2026)",
    );
  }, [onStepMessage]);

  const applyValidation = useCallback(
    async (currentStep: AiBookingStep, nextDraft: AiBookingDraft) => {
      const result = await validateStep(currentStep, nextDraft);

      if (result.availability) {
        setAvailability(result.availability);
      }

      if (!result.ok) {
        setFieldError(result.error ?? "Eingabe ungültig.");
        return false;
      }

      setFieldError("");
      const nextStep = result.nextStep ?? currentStep;

      if (nextStep !== currentStep) {
        setStep(nextStep);
      }

      setDraft(nextDraft);
      return true;
    },
    [],
  );

  const submitBooking = useCallback(
    async (finalDraft: AiBookingDraft) => {
      const response = await fetch("/api/ai/booking/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalDraft),
        cache: "no-store",
      });

      const result = (await response.json()) as {
        success: boolean;
        error?: string;
        suggestedMasterId?: string;
      };

      if (!result.success) {
        setFieldError(result.error ?? "Buchung fehlgeschlagen.");

        if (result.suggestedMasterId) {
          setDraft((current) => ({ ...current, master_id: result.suggestedMasterId }));
          setStep("master");
        }

        return false;
      }

      const masterName =
        availability?.masters.find((master) => master.id === finalDraft.master_id)?.name ??
        "Ihr Meister";

      onBooked?.(
        `Ihre Terminanfrage wurde gesendet.\n\n${formatBookingSummary(finalDraft, masterName)}\n\nWir melden uns in Kürze zur Bestätigung.`,
      );
      reset();
      return true;
    },
    [availability?.masters, onBooked, reset],
  );

  const processUserInput = useCallback(
    async (text: string) => {
      if (!active || isProcessing) {
        if (isBookingIntent(text)) {
          start();
          return true;
        }

        return false;
      }

      setIsProcessing(true);

      try {
        if (isCancelIntent(text)) {
          reset();
          onStepMessage?.("Terminbuchung abgebrochen. Wie kann ich Ihnen sonst helfen?");
          return true;
        }

        const nextDraft = { ...draft };

        if (step === "confirm" && isConfirmIntent(text)) {
          const confirmResult = await validateStep("confirm", nextDraft);

          if (!confirmResult.ok) {
            setFieldError(confirmResult.error ?? "Bestätigung nicht möglich.");
            if (confirmResult.nextStep) {
              setStep(confirmResult.nextStep);
            }
            return true;
          }

          await submitBooking(nextDraft);
          return true;
        }

        if (step === "date") {
          const parsed = parseGermanDateInput(text);

          if (!parsed) {
            setFieldError("Bitte Datum nennen, z. B. „morgen“ oder „15.06.2026“.");
            return true;
          }

          nextDraft.appointment_date = parsed;
          const ok = await applyValidation("date", nextDraft);

          if (ok) {
            const refreshed = await validateStep("date", nextDraft);
            const slots = refreshed.slots?.join(", ") ?? "";

            onStepMessage?.(
              `Perfekt, ${parsed}. Welche Uhrzeit passt Ihnen? Freie Zeiten: ${slots}`,
            );
          }

          return true;
        }

        if (step === "time") {
          const parsed = parseTimeInput(text);

          if (!parsed) {
            setFieldError("Bitte Uhrzeit im Format HH:MM nennen, z. B. 14:30.");
            return true;
          }

          nextDraft.appointment_time = parsed;
          const ok = await applyValidation("time", nextDraft);

          if (ok) {
            const refreshed = await validateStep("time", nextDraft);
            const masters = refreshed.masters ?? [];

            if (masters.length === 1) {
              nextDraft.master_id = masters[0].id;
              setDraft(nextDraft);
              setStep("name");
              onStepMessage?.(
                `Uhrzeit ${parsed} ist frei. ${masters[0].name} ist verfügbar. Wie ist Ihr Name?`,
              );
            } else {
              onStepMessage?.(
                `Uhrzeit ${parsed} ist frei. Welchen Meister wünschen Sie? Verfügbar: ${masters.map((m) => m.name).join(", ")}`,
              );
            }
          }

          return true;
        }

        if (step === "master") {
          const masters = availability?.masters ?? [];
          const parsedId = findMasterIdByName(text, masters);

          if (!parsedId) {
            setFieldError(
              `Bitte einen verfügbaren Meister wählen: ${masters.map((m) => m.name).join(", ")}`,
            );
            return true;
          }

          nextDraft.master_id = parsedId;
          const ok = await applyValidation("master", nextDraft);

          if (ok) {
            const master = masters.find((item) => item.id === parsedId);
            onStepMessage?.(`Danke. ${master?.name ?? "Meister"} notiert. Wie ist Ihr vollständiger Name?`);
          }

          return true;
        }

        if (step === "name") {
          const parsed = parseNameInput(text);

          if (!parsed) {
            setFieldError("Bitte Ihren Namen eingeben.");
            return true;
          }

          nextDraft.customer_name = parsed;
          const ok = await applyValidation("name", nextDraft);

          if (ok) {
            onStepMessage?.("Danke. Unter welcher Telefonnummer können wir Sie erreichen?");
          }

          return true;
        }

        if (step === "phone") {
          const parsed = parsePhoneInput(text);

          if (!parsed) {
            setFieldError("Bitte eine gültige Telefonnummer eingeben.");
            return true;
          }

          nextDraft.customer_phone = parsed;
          const ok = await applyValidation("phone", nextDraft);

          if (ok) {
            onStepMessage?.("Und Ihre E-Mail-Adresse für die Bestätigung?");
          }

          return true;
        }

        if (step === "email") {
          const parsed = parseEmailInput(text);

          if (!parsed) {
            setFieldError("Bitte eine gültige E-Mail eingeben.");
            return true;
          }

          nextDraft.customer_email = parsed;
          const ok = await applyValidation("email", nextDraft);

          if (ok) {
            const masterName =
              availability?.masters.find((master) => master.id === nextDraft.master_id)?.name ??
              "Meister";

            onStepMessage?.(
              `Bitte bestätigen Sie Ihre Terminanfrage:\n\n${formatBookingSummary(nextDraft, masterName)}\n\nAntworten Sie mit „Ja“ zum Senden.`,
            );
            setStep("confirm");
            setDraft(nextDraft);
          }

          return true;
        }

        return false;
      } catch {
        setFieldError("Verbindungsfehler. Bitte erneut versuchen.");
        return true;
      } finally {
        setIsProcessing(false);
      }
    },
    [
      active,
      applyValidation,
      availability?.masters,
      draft,
      isProcessing,
      onStepMessage,
      reset,
      start,
      step,
      submitBooking,
    ],
  );

  const selectDate = useCallback(
    async (dateIso: string) => {
      const nextDraft = { ...draft, appointment_date: dateIso };
      const ok = await applyValidation("date", nextDraft);

      if (ok) {
        const refreshed = await validateStep("date", nextDraft);
        onStepMessage?.(
          `Datum ${dateIso} gewählt. Freie Uhrzeiten: ${refreshed.slots?.join(", ") ?? "—"}. Welche Uhrzeit passt?`,
        );
        setStep("time");
        setDraft(nextDraft);
      }
    },
    [applyValidation, draft, onStepMessage],
  );

  const selectTime = useCallback(
    async (time: string) => {
      const nextDraft = { ...draft, appointment_time: time };
      const ok = await applyValidation("time", nextDraft);

      if (ok) {
        const refreshed = await validateStep("time", nextDraft);
        const masters = refreshed.masters ?? [];

        if (masters.length === 1) {
          nextDraft.master_id = masters[0].id;
          setDraft(nextDraft);
          setStep("name");
          onStepMessage?.(`${time} Uhr mit ${masters[0].name}. Wie ist Ihr Name?`);
        } else {
          setStep("master");
          onStepMessage?.(
            `${time} Uhr ist frei. Meister wählen: ${masters.map((m) => m.name).join(", ")}`,
          );
        }
      }
    },
    [applyValidation, draft, onStepMessage],
  );

  const selectMaster = useCallback(
    async (masterId: string) => {
      const nextDraft = { ...draft, master_id: masterId };
      const ok = await applyValidation("master", nextDraft);

      if (ok) {
        setStep("name");
        setDraft(nextDraft);
        onStepMessage?.("Meister gewählt. Wie ist Ihr vollständiger Name?");
      }
    },
    [applyValidation, draft, onStepMessage],
  );

  return {
    active,
    availability,
    draft,
    fieldError,
    isProcessing,
    processUserInput,
    reset,
    selectDate,
    selectMaster,
    selectTime,
    start,
    step,
  };
}

export { isBookingIntent };
