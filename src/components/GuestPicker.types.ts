export interface GuestCounts {
  adults: number;
  children: number;
}

export interface GuestPickerProps {
  value: GuestCounts;
  onChange: (value: GuestCounts) => void;
  /** Hide the children row, e.g. on adults-only resorts. Defaults to true. */
  allowChildren?: boolean;
}
