export type SalonAddress = {
  city: string;
  country: string;
  street: string;
};

export type SalonContact = {
  address: SalonAddress;
  email: string | null;
  facebook: string;
  googleMapsEmbedUrl: string;
  googleMapsUrl: string;
  instagram: string;
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
};
