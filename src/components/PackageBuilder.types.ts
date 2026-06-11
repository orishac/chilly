import type { Resort } from "@/lib/data.types";

export interface PackageBuilderProps {
  resort: Resort;
}

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
