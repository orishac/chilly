// Native date inputs only open their calendar when the tiny icon is
// clicked; this opens it from a click anywhere in the field.
export function openDatePicker(e: React.MouseEvent<HTMLInputElement>) {
  try {
    e.currentTarget.showPicker();
  } catch {
    // older browsers without showPicker keep the default icon-only behavior
  }
}
