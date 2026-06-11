"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import ResortCard from "@/components/ResortCard";
import { RESORTS, TAG_LABELS } from "@/lib/data";
import type { ResortTag } from "@/lib/data.types";
import type { SortKey } from "./SearchClient.types";
import styles from "./search.module.scss";

const ALL_TAGS = Object.keys(TAG_LABELS) as ResortTag[];

export default function SearchClient() {
  const params = useSearchParams();
  const query = params.get("q") ?? "";
  const checkIn = params.get("checkIn") ?? undefined;
  const checkOut = params.get("checkOut") ?? undefined;
  const [activeTags, setActiveTags] = useState<ResortTag[]>(() => {
    const t = params.get("tag");
    return t && t in TAG_LABELS ? [t as ResortTag] : [];
  });

  // `guests` is the legacy param name from before the adults/children split
  const adults = Number(params.get("adults") ?? params.get("guests") ?? 2);
  // children make no sense while browsing adults-only resorts
  const adultsOnlyActive = activeTags.includes("adults-only");
  const children = adultsOnlyActive
    ? 0
    : Number(params.get("children") ?? 0);
  const totalGuests = adults + children;
  const [maxPrice, setMaxPrice] = useState(1700);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState<SortKey>("recommended");

  const results = useMemo(() => {
    const q = query.toLowerCase();
    const list = RESORTS.filter((r) => {
      const matchesQuery =
        !q ||
        [r.name, r.location, r.country, r.region]
          .join(" ")
          .toLowerCase()
          .includes(q);
      const matchesTags = activeTags.every((t) => r.tags.includes(t));
      const fitsGuests = r.rooms.some((room) => room.sleeps >= totalGuests);
      const suitsChildren = children === 0 || !r.tags.includes("adults-only");
      return (
        matchesQuery &&
        matchesTags &&
        fitsGuests &&
        suitsChildren &&
        r.pricePerNight <= maxPrice &&
        r.rating >= minRating
      );
    });

    switch (sort) {
      case "price-asc":
        return list.sort((a, b) => a.pricePerNight - b.pricePerNight);
      case "price-desc":
        return list.sort((a, b) => b.pricePerNight - a.pricePerNight);
      case "rating":
        return list.sort((a, b) => b.rating - a.rating);
      default:
        return list.sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount);
    }
  }, [query, activeTags, maxPrice, minRating, sort, totalGuests, children]);

  function toggleTag(tag: ResortTag) {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  const tripParams = new URLSearchParams();
  if (checkIn) tripParams.set("checkIn", checkIn);
  if (checkOut) tripParams.set("checkOut", checkOut);
  tripParams.set("adults", String(adults));
  tripParams.set("children", String(children));
  const tripSearch = `?${tripParams.toString()}`;

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.searchWrap}>
        <SearchBar
          initialQuery={query}
          initialCheckIn={checkIn}
          initialCheckOut={checkOut}
          initialAdults={adults}
          initialChildren={children}
          allowChildren={!adultsOnlyActive}
        />
      </div>

      <div className={styles.layout}>
        <aside className={styles.filters}>
          <h3>Filters</h3>

          <div className={styles.filterGroup}>
            <h4>Vibe</h4>
            {ALL_TAGS.map((tag) => (
              <label key={tag} className={styles.check}>
                <input
                  type="checkbox"
                  checked={activeTags.includes(tag)}
                  onChange={() => toggleTag(tag)}
                />
                {TAG_LABELS[tag]}
              </label>
            ))}
          </div>

          <div className={styles.filterGroup}>
            <h4 id="max-price-label">Max price / night</h4>
            <input
              type="range"
              aria-labelledby="max-price-label"
              min={250}
              max={1700}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
            <p className={styles.rangeValue}>up to ${maxPrice}</p>
          </div>

          <div className={styles.filterGroup}>
            <h4>Minimum rating</h4>
            {[0, 4.5, 4.7, 4.8].map((r) => (
              <label key={r} className={styles.check}>
                <input
                  type="radio"
                  name="rating"
                  checked={minRating === r}
                  onChange={() => setMinRating(r)}
                />
                {r === 0 ? "Any" : `★ ${r}+`}
              </label>
            ))}
          </div>
        </aside>

        <section className={styles.results}>
          <div className={styles.resultsHead}>
            <p>
              <strong>{results.length}</strong>{" "}
              {results.length === 1 ? "resort" : "resorts"}
              {query && (
                <>
                  {" "}for <strong>“{query}”</strong>
                </>
              )}
              {children > 0 && (
                <span className={styles.kidNote}>
                  {" "}· adults-only resorts hidden
                </span>
              )}
            </p>
            <label className={styles.sort}>
              Sort by{" "}
              <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
                <option value="recommended">Recommended</option>
                <option value="rating">Highest rated</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
              </select>
            </label>
          </div>

          {results.length === 0 ? (
            <div className={styles.empty}>
              <span>🫧</span>
              <h3>No resorts match those filters</h3>
              <p>Try widening the price range or clearing a vibe or two.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {results.map((r) => (
                <ResortCard key={r.id} resort={r} search={tripSearch} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
