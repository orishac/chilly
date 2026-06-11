import type { Resort } from "@/lib/data.types";
import type { GuestCounts } from "./GuestPicker.types";

export interface PackageBuilderProps {
  resort: Resort;
}

export interface BuilderState {
  checkIn: string;
  checkOut: string;
  guests: GuestCounts;
  roomId: string;
  packageId: string | null;
  extraIds: string[];
}

export type BuilderAction =
  | { type: "setCheckIn"; value: string }
  | { type: "setCheckOut"; value: string }
  | { type: "setGuests"; value: GuestCounts }
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
  adults: number;
  children: number;
  total: number;
}
