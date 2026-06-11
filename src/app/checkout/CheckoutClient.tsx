"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EXTRAS, SPA_PACKAGES, getResort } from "@/lib/data";
import { formatDate, formatPrice, nightsBetween } from "@/lib/format";
import type { BookingSelection } from "@/components/PackageBuilder.types";
import type { Confirmation } from "./CheckoutClient.types";
import styles from "./checkout.module.scss";

export default function CheckoutClient() {
  const router = useRouter();
  const [selection, setSelection] = useState<BookingSelection | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    card: "",
  });

  useEffect(() => {
    const raw = sessionStorage.getItem("chilly-booking");
    if (raw) {
      try {
        setSelection(JSON.parse(raw));
      } catch {
        // corrupted state — treat as no booking
      }
    }
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  const resort = selection ? getResort(selection.resortId) : undefined;

  if (!selection || !resort) {
    return (
      <div className={`container ${styles.emptyState}`}>
        <span>🛁</span>
        <h1>Nothing to check out yet</h1>
        <p>Build a trip first — pick a resort and we'll meet you back here.</p>
        <Link href="/search" className="btn btn-primary">
          Browse resorts
        </Link>
      </div>
    );
  }

  const room = resort.rooms.find((r) => r.id === selection.roomId);
  const spa = SPA_PACKAGES.find((p) => p.id === selection.packageId);
  const extras = EXTRAS.filter((e) => selection.extraIds.includes(e.id));
  const nights = nightsBetween(selection.checkIn, selection.checkOut);

  const formValid =
    form.firstName.trim() &&
    form.lastName.trim() &&
    /\S+@\S+\.\S+/.test(form.email) &&
    form.card.replace(/\s/g, "").length >= 12;

  function confirm(e: React.FormEvent) {
    e.preventDefault();
    if (!formValid || !selection) return;
    setSubmitting(true);
    const ref = `CHL-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const confirmation: Confirmation = { ref, selection, name: form.firstName };
    sessionStorage.setItem("chilly-confirmation", JSON.stringify(confirmation));
    sessionStorage.removeItem("chilly-booking");
    // small delay so the mock payment feels real
    setTimeout(() => router.push("/confirmation"), 900);
  }

  function set(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  return (
    <div className={`container ${styles.page}`}>
      <h1>Almost there</h1>
      <p className={styles.sub}>Review your trip and add your details.</p>

      <div className={styles.layout}>
        <form className={styles.form} onSubmit={confirm}>
          <section>
            <h2>Lead guest</h2>
            <div className={styles.row}>
              <label>
                <span>First name</span>
                <input
                  value={form.firstName}
                  onChange={(e) => set("firstName", e.target.value)}
                  placeholder="Noa"
                  required
                />
              </label>
              <label>
                <span>Last name</span>
                <input
                  value={form.lastName}
                  onChange={(e) => set("lastName", e.target.value)}
                  placeholder="Levy"
                  required
                />
              </label>
            </div>
            <label>
              <span>Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>
          </section>

          <section>
            <h2>Payment</h2>
            <label>
              <span>Card number (demo — don't use a real one)</span>
              <input
                inputMode="numeric"
                value={form.card}
                onChange={(e) => set("card", e.target.value)}
                placeholder="4242 4242 4242 4242"
                required
              />
            </label>
          </section>

          <button
            type="submit"
            className={`btn btn-primary ${styles.payBtn}`}
            disabled={!formValid || submitting}
          >
            {submitting
              ? "Confirming…"
              : `Confirm & pay ${formatPrice(selection.total)}`}
          </button>
          <p className={styles.disclaimer}>
            This is a demo. No payment is processed and no booking is made.
          </p>
        </form>

        <aside className={styles.summary}>
          <div
            className={styles.summaryBanner}
            style={{
              background: `linear-gradient(135deg, ${resort.gradient[0]}, ${resort.gradient[1]})`,
            }}
          >
            {resort.emoji}
          </div>
          <div className={styles.summaryBody}>
            <h3>{resort.name}</h3>
            <p className={styles.summaryLoc}>
              {resort.location} · {resort.country}
            </p>
            <div className={styles.line}>
              <span>Dates</span>
              <span>
                {formatDate(selection.checkIn)} → {formatDate(selection.checkOut)}
              </span>
            </div>
            <div className={styles.line}>
              <span>Guests</span>
              <span>{selection.guests}</span>
            </div>
            <hr />
            {room && (
              <div className={styles.line}>
                <span>
                  {room.name} × {nights}n
                </span>
                <span>{formatPrice(room.pricePerNight * nights)}</span>
              </div>
            )}
            {spa && (
              <div className={styles.line}>
                <span>
                  {spa.name} × {selection.guests}
                </span>
                <span>{formatPrice(spa.pricePerPerson * selection.guests)}</span>
              </div>
            )}
            {extras.map((e) => (
              <div key={e.id} className={styles.line}>
                <span>{e.name}</span>
                <span>✓</span>
              </div>
            ))}
            <hr />
            <div className={`${styles.line} ${styles.total}`}>
              <span>Total</span>
              <span>{formatPrice(selection.total)}</span>
            </div>
            <Link href={`/resorts/${resort.id}`} className={styles.editLink}>
              ← Edit trip
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
