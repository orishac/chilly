import type { Resort } from "@/lib/data.types";

export interface PackageBuilderProps {
  resort: Resort;
}

export interface BuilderState {
  checkIn: string;
  checkOut: string;
  guests: number;
  roomId: string;
  packageId: string | null;
  extraIds: string[];
}

export type BuilderAction =
  | { type: "setCheckIn"; value: string }
  | { type: "setCheckOut"; value: string }
  | { type: "setGuests"; value: number }
  | { type: "setRoom"; value: string }
  | { type: "setPackage"; value: string | null }
  | { type: "toggleExtra"; id: string };

// Written to sessionStorage by PackageBuilder, read back at checkout.
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
