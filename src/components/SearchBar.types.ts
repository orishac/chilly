export interface SearchBarProps {
  initialQuery?: string;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialAdults?: number;
  initialChildren?: number;
  /** Hide the children option, e.g. while filtering adults-only resorts. */
  allowChildren?: boolean;
}
