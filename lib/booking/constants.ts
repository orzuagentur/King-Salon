export const BOOKING_SLOT_DURATION_MINUTES = 60;

export const BOOKING_ACTIVE_STATUSES = ["pending", "confirmed"] as const;

export const DAY_NAME_TO_INDEX: Record<string, number> = {
  Sonntag: 0,
  Montag: 1,
  Dienstag: 2,
  Mittwoch: 3,
  Donnerstag: 4,
  Freitag: 5,
  Samstag: 6,
};
