export type MasterOption = {
  id: string;
  name: string;
  title: string | null;
};

export type DateAvailability = {
  closed: boolean;
  closedMessage: string;
  date: string;
  masters: MasterOption[];
  slots: string[];
  /** masterId -> available time slots */
  availabilityByMaster: Record<string, string[]>;
};

export type BookingPayload = {
  customer_email: string;
  customer_name: string;
  customer_phone: string;
  appointment_date: string;
  appointment_time: string;
  master_id: string;
  message: string;
};
