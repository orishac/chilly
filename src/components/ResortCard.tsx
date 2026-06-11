import Link from "next/link";
import { Resort } from "@/lib/types";
import { TAG_LABELS } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import styles from "./ResortCard.module.scss";

export default function ResortCard({
  resort,
  search = "",
}: {
  resort: Resort;
  search?: string;
}) {
  return (
    <Link
      href={`/resorts/${resort.id}${search}`}
      className={styles.card}
    >
      <div
        className={styles.visual}
        style={{
          background: `linear-gradient(135deg, ${resort.gradient[0]}, ${resort.gradient[1]})`,
        }}
      >
        <span className={styles.emoji}>{resort.emoji}</span>
        <span className={styles.rating}>★ {resort.rating.toFixed(1)}</span>
      </div>
      <div className={styles.body}>
        <p className={styles.location}>
          {resort.location} · {resort.country}
        </p>
        <h3>{resort.name}</h3>
        <p className={styles.tagline}>{resort.tagline}</p>
        <div className={styles.tags}>
          {resort.tags.slice(0, 3).map((t) => (
            <span key={t} className="tag">
              {TAG_LABELS[t]}
            </span>
          ))}
        </div>
        <p className={styles.price}>
          from <strong>{formatPrice(resort.pricePerNight)}</strong> / night
        </p>
      </div>
    </Link>
  );
}
