"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { addDays, todayISO } from "@/lib/format";
import { openDatePicker } from "@/lib/datePicker";
import type { SearchBarProps } from "./SearchBar.types";
import styles from "./SearchBar.module.scss";

export default function SearchBar({
  initialQuery = "",
  initialCheckIn,
  initialCheckOut,
  initialGuests = 2,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [checkIn, setCheckIn] = useState(initialCheckIn ?? addDays(todayISO(), 14));
  const [checkOut, setCheckOut] = useState(initialCheckOut ?? addDays(todayISO(), 19));
  const [guests, setGuests] = useState(initialGuests);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    params.set("checkIn", checkIn);
    params.set("checkOut", checkOut);
    params.set("guests", String(guests));
    router.push(`/search?${params.toString()}`);
  }

  return (
    <form className={styles.bar} onSubmit={submit}>
      <label className={styles.field}>
        <span>Where to?</span>
        <input
          type="text"
          placeholder="Destination, country or resort"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      <label className={styles.field}>
        <span>Check-in</span>
        <input
          type="date"
          value={checkIn}
          min={todayISO()}
          onClick={openDatePicker}
          onChange={(e) => {
            setCheckIn(e.target.value);
            if (e.target.value >= checkOut) setCheckOut(addDays(e.target.value, 3));
          }}
        />
      </label>
      <label className={styles.field}>
        <span>Check-out</span>
        <input
          type="date"
          value={checkOut}
          min={addDays(checkIn, 1)}
          onClick={openDatePicker}
          onChange={(e) => setCheckOut(e.target.value)}
        />
      </label>
      <label className={styles.field}>
        <span>Guests</span>
        <select value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? "guest" : "guests"}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" className={`btn btn-primary ${styles.submit}`}>
        Search
      </button>
    </form>
  );
}
