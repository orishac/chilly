import type { BookingSelection } from "@/components/PackageBuilder.types";

// Written to sessionStorage at checkout, read back on the confirmation page.
export interface Confirmation {
  ref: string;
  name: string;
  selection: BookingSelection;
}
