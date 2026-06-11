"use client";

import { useEffect, useRef, useState } from "react";
import { formatGuests } from "@/lib/format";
import type { GuestCounts, GuestPickerProps } from "./GuestPicker.types";
import styles from "./GuestPicker.module.scss";

// largest room in the catalog sleeps 6
export const MAX_GUESTS = 6;

function StepperRow({
  label,
  sub,
  count,
  min,
  canAdd,
  onCountChange,
}: {
  label: string;
  sub: string;
  count: number;
  min: number;
  canAdd: boolean;
  onCountChange: (count: number) => void;
}) {
  return (
    <div className={styles.row}>
      <div className={styles.rowLabel}>
        <strong>{label}</strong>
        <small>{sub}</small>
      </div>
      <div className={styles.stepper}>
        <button
          type="button"
          aria-label={`Fewer ${label.toLowerCase()}`}
          disabled={count <= min}
          onClick={() => onCountChange(count - 1)}
        >
          −
        </button>
        <span aria-live="polite">{count}</span>
        <button
          type="button"
          aria-label={`More ${label.toLowerCase()}`}
          disabled={!canAdd}
          onClick={() => onCountChange(count + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function GuestPicker({
  value,
  onChange,
  allowChildren = true,
}: GuestPickerProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const total = value.adults + value.children;
  const canAdd = total < MAX_GUESTS;

  function update(patch: Partial<GuestCounts>) {
    onChange({ ...value, ...patch });
  }

  return (
    <div className={styles.picker} ref={rootRef}>
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {formatGuests(value.adults, value.children)}
      </button>
      {open && (
        <div className={styles.popover} role="dialog" aria-label="Choose guests">
          <StepperRow
            label="Adults"
            sub="Ages 13+"
            count={value.adults}
            min={1}
            canAdd={canAdd}
            onCountChange={(n) => update({ adults: n })}
          />
          {allowChildren && (
            <StepperRow
              label="Children"
              sub="Ages 2–12"
              count={value.children}
              min={0}
              canAdd={canAdd}
              onCountChange={(n) => update({ children: n })}
            />
          )}
          <p className={styles.hint}>
            {!allowChildren
              ? "These stays are adults-only."
              : canAdd
                ? `Up to ${MAX_GUESTS} guests per booking.`
                : `That's our biggest room — ${MAX_GUESTS} guests max.`}
          </p>
        </div>
      )}
    </div>
  );
}
