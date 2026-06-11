"use client";

import { useMemo, useReducer } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EXTRAS, SPA_PACKAGES } from "@/lib/data";
import { addDays, formatPrice, nightsBetween, todayISO } from "@/lib/format";
import { openDatePicker } from "@/lib/datePicker";
import GuestPicker from "./GuestPicker";
import type {
  BookingSelection,
  BuilderAction,
  BuilderState,
  PackageBuilderProps,
} from "./PackageBuilder.types";
import styles from "./PackageBuilder.module.scss";

function builderReducer(state: BuilderState, action: BuilderAction): BuilderState {
  switch (action.type) {
    case "setCheckIn":
      return {
        ...state,
        checkIn: action.value,
        // keep check-out after check-in
        checkOut:
          action.value >= state.checkOut
            ? addDays(action.value, 3)
            : state.checkOut,
      };
    case "setCheckOut":
      return { ...state, checkOut: action.value };
    case "setGuests":
      return { ...state, guests: action.value };
    case "setRoom":
      return { ...state, roomId: action.value };
    case "setPackage":
      return { ...state, packageId: action.value };
    case "toggleExtra":
      return {
        ...state,
        extraIds: state.extraIds.includes(action.id)
          ? state.extraIds.filter((e) => e !== action.id)
          : [...state.extraIds, action.id],
      };
  }
}

export default function PackageBuilder({ resort }: PackageBuilderProps) {
  const router = useRouter();
  const params = useSearchParams();
  const adultsOnly = resort.tags.includes("adults-only");

  const [state, dispatch] = useReducer(
    builderReducer,
    null,
    (): BuilderState => ({
      checkIn: params.get("checkIn") ?? addDays(todayISO(), 14),
      checkOut: params.get("checkOut") ?? addDays(todayISO(), 19),
      guests: {
        // `guests` is the legacy param name from before the adults/children split
        adults: Number(params.get("adults") ?? params.get("guests") ?? 2),
        children: adultsOnly ? 0 : Number(params.get("children") ?? 0),
      },
      roomId: resort.rooms[0].id,
      packageId: null,
      extraIds: [],
    })
  );
  const { checkIn, checkOut, guests, roomId, packageId, extraIds } = state;
  const totalGuests = guests.adults + guests.children;

  const nights = nightsBetween(checkIn, checkOut);
  const room = resort.rooms.find((r) => r.id === roomId) ?? resort.rooms[0];
  const spa = SPA_PACKAGES.find((p) => p.id === packageId) ?? null;

  const totals = useMemo(() => {
    const roomTotal = room.pricePerNight * nights;
    // spa treatments are adults-only, so children don't count here
    const spaTotal = spa ? spa.pricePerPerson * guests.adults : 0;
    const extrasTotal = extraIds.reduce((sum, id) => {
      const extra = EXTRAS.find((e) => e.id === id);
      if (!extra) return sum;
      const units = extra.per === "person" ? guests.adults + guests.children : 1;
      // breakfast is priced per person per night
      const nightsMult = extra.id === "breakfast" ? nights : 1;
      return sum + extra.price * units * nightsMult;
    }, 0);
    return { roomTotal, spaTotal, extrasTotal, total: roomTotal + spaTotal + extrasTotal };
  }, [room, nights, spa, guests, extraIds]);

  function continueToCheckout() {
    const selection: BookingSelection = {
      resortId: resort.id,
      roomId: room.id,
      packageId,
      extraIds,
      checkIn,
      checkOut,
      adults: guests.adults,
      children: guests.children,
      total: totals.total,
    };
    sessionStorage.setItem("chilly-booking:v2", JSON.stringify(selection));
    router.push("/checkout");
  }

  const roomFitsGuests = room.sleeps >= totalGuests;
  const canContinue = nights > 0 && roomFitsGuests;

  return (
    <div className={styles.builder}>
      <h2>Build your trip</h2>

      <div className={styles.dates}>
        <label>
          <span>Check-in</span>
          <input
            type="date"
            value={checkIn}
            min={todayISO()}
            onClick={openDatePicker}
            onChange={(e) =>
              dispatch({ type: "setCheckIn", value: e.target.value })
            }
          />
        </label>
        <label>
          <span>Check-out</span>
          <input
            type="date"
            value={checkOut}
            min={addDays(checkIn, 1)}
            onClick={openDatePicker}
            onChange={(e) =>
              dispatch({ type: "setCheckOut", value: e.target.value })
            }
          />
        </label>
        <div className={styles.guestsField}>
          <span>Guests</span>
          <GuestPicker
            value={guests}
            onChange={(value) => dispatch({ type: "setGuests", value })}
            allowChildren={!adultsOnly}
          />
        </div>
      </div>

      <section className={styles.step}>
        <h3>1 · Choose your room</h3>
        {resort.rooms.map((r) => (
          <label
            key={r.id}
            className={`${styles.option} ${roomId === r.id ? styles.selected : ""}`}
          >
            <input
              type="radio"
              name="room"
              checked={roomId === r.id}
              onChange={() => dispatch({ type: "setRoom", value: r.id })}
            />
            <div>
              <strong>{r.name}</strong>
              <p>{r.description}</p>
              <p className={styles.optionMeta}>
                Sleeps {r.sleeps} · {formatPrice(r.pricePerNight)}/night
              </p>
            </div>
          </label>
        ))}
        {!roomFitsGuests && (
          <p className={styles.warn}>
            This room sleeps {room.sleeps} and you&apos;re {totalGuests} — pick
            a bigger room or fewer guests.
          </p>
        )}
      </section>

      <section className={styles.step}>
        <h3>2 · Add a spa package</h3>
        <label
          className={`${styles.option} ${packageId === null ? styles.selected : ""}`}
        >
          <input
            type="radio"
            name="spa"
            checked={packageId === null}
            onChange={() => dispatch({ type: "setPackage", value: null })}
          />
          <div>
            <strong>No package</strong>
            <p>Just the stay — book treatments at the resort.</p>
          </div>
        </label>
        {SPA_PACKAGES.map((p) => (
          <label
            key={p.id}
            className={`${styles.option} ${packageId === p.id ? styles.selected : ""}`}
          >
            <input
              type="radio"
              name="spa"
              checked={packageId === p.id}
              onChange={() => dispatch({ type: "setPackage", value: p.id })}
            />
            <div>
              <strong>{p.name}</strong>
              <p>{p.description}</p>
              <p className={styles.optionMeta}>
                {formatPrice(p.pricePerPerson)}/adult
              </p>
            </div>
          </label>
        ))}
      </section>

      <section className={styles.step}>
        <h3>3 · Extras</h3>
        {EXTRAS.map((e) => (
          <label
            key={e.id}
            className={`${styles.option} ${extraIds.includes(e.id) ? styles.selected : ""}`}
          >
            <input
              type="checkbox"
              checked={extraIds.includes(e.id)}
              onChange={() => dispatch({ type: "toggleExtra", id: e.id })}
            />
            <div>
              <strong>{e.name}</strong>
              <p>{e.description}</p>
              <p className={styles.optionMeta}>
                {formatPrice(e.price)}
                {e.per === "person" ? "/person" : ""}
                {e.id === "breakfast" ? "/night" : ""}
              </p>
            </div>
          </label>
        ))}
      </section>

      <div className={styles.summary}>
        <div className={styles.line}>
          <span>
            {room.name} × {nights} {nights === 1 ? "night" : "nights"}
          </span>
          <span>{formatPrice(totals.roomTotal)}</span>
        </div>
        {spa && (
          <div className={styles.line}>
            <span>
              {spa.name} × {guests.adults}{" "}
              {guests.adults === 1 ? "adult" : "adults"}
            </span>
            <span>{formatPrice(totals.spaTotal)}</span>
          </div>
        )}
        {totals.extrasTotal > 0 && (
          <div className={styles.line}>
            <span>Extras</span>
            <span>{formatPrice(totals.extrasTotal)}</span>
          </div>
        )}
        <div className={`${styles.line} ${styles.total}`}>
          <span>Total</span>
          <span>{formatPrice(totals.total)}</span>
        </div>
        <button
          type="button"
          className={`btn btn-primary ${styles.cta}`}
          disabled={!canContinue}
          onClick={continueToCheckout}
        >
          Continue to checkout
        </button>
      </div>
    </div>
  );
}
