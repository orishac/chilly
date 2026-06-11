export type ResortTag =
  | "thermal-pools"
  | "adults-only"
  | "beachfront"
  | "mountain"
  | "overwater"
  | "hot-springs"
  | "yoga"
  | "family-friendly";

export interface Room {
  id: string;
  name: string;
  description: string;
  sleeps: number;
  pricePerNight: number;
}

export interface SpaPackage {
  id: string;
  name: string;
  description: string;
  pricePerPerson: number;
  treatments: string[];
}

export interface Extra {
  id: string;
  name: string;
  description: string;
  price: number;
  per: "person" | "booking";
}

export interface Resort {
  id: string;
  name: string;
  location: string;
  country: string;
  region: string;
  rating: number;
  reviewCount: number;
  pricePerNight: number; // starting price (cheapest room)
  gradient: [string, string];
  emoji: string;
  tagline: string;
  description: string;
  amenities: string[];
  spaHighlights: string[];
  tags: ResortTag[];
  rooms: Room[];
}

export interface BookingSelection {
  resortId: string;
  roomId: string;
  packageId: string | null;
  extraIds: string[];
  checkIn: string;
  checkOut: string;
  guests: number;
  total: number;
}
