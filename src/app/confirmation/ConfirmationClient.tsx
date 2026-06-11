"use client";

import Link from "next/link";
import { useMemo } from "react";
import { getResort } from "@/lib/data";
import { formatDate, formatGuests, formatPrice } from "@/lib/format";
import { useSessionStorageItem } from "@/lib/useSessionStorageItem";
import type { Confirmation } from "../checkout/CheckoutClient.types";
import styles from "./confirmation.module.scss";

export default function ConfirmationClient() {
  const raw = useSessionStorageItem("chilly-confirmation:v2");
  const confirmation = useMemo<Confirmation | null>(() => {
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      // corrupted state — show empty state
      return null;
    }
  }, [raw]);

  // undefined = server render / hydration, before sessionStorage is readable
  if (raw === undefined) return null;

  const resort = confirmation
    ? getResort(confirmation.selection.resortId)
    : undefined;

  if (!confirmation || !resort) {
    return (
      <div className={`container ${styles.empty}`}>
        <h1>No booking found</h1>
        <p>Start by picking a resort — the spa is waiting.</p>
        <Link href="/search" className="btn btn-primary">
          Browse resorts
        </Link>
      </div>
    );
  }

  const { selection, ref, name } = confirmation;

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.card}>
        <span className={styles.check}>✓</span>
        <h1>You're booked, {name}.</h1>
        <p className={styles.sub}>
          Time to start practicing doing absolutely nothing.
        </p>

        <div className={styles.ref}>
          Booking reference <strong>{ref}</strong>
        </div>

        <div className={styles.details}>
          <div
            className={styles.banner}
            style={{
              background: `linear-gradient(135deg, ${resort.gradient[0]}, ${resort.gradient[1]})`,
            }}
          >
            {resort.emoji}
          </div>
          <div className={styles.detailBody}>
            <h2>{resort.name}</h2>
            <p>
              {resort.location} · {resort.country}
            </p>
            <p>
              {formatDate(selection.checkIn)} → {formatDate(selection.checkOut)} ·{" "}
              {formatGuests(selection.adults, selection.children)}
            </p>
            <p className={styles.total}>Paid {formatPrice(selection.total)}</p>
          </div>
        </div>

        <p className={styles.note}>
          This is a demo project — no real booking was made (sadly).
        </p>

        <Link href="/" className="btn btn-ghost">
          Back to home
        </Link>
      </div>
    </div>
  );
}
