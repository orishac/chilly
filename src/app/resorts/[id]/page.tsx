import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getResort, RESORTS, TAG_LABELS } from "@/lib/data";
import PackageBuilder from "@/components/PackageBuilder";
import styles from "./resort.module.scss";

export function generateStaticParams() {
  return RESORTS.map((r) => ({ id: r.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resort = getResort((await params).id);
  return { title: resort ? `${resort.name} — Chilly` : "Resort — Chilly" };
}

export default async function ResortPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resort = getResort(id);
  if (!resort) notFound();

  return (
    <div className={styles.page}>
      <div
        className={styles.banner}
        style={{
          background: `linear-gradient(135deg, ${resort.gradient[0]}, ${resort.gradient[1]})`,
        }}
      >
        <span>{resort.emoji}</span>
      </div>

      <div className={`container ${styles.layout}`}>
        <div className={styles.info}>
          <p className={styles.location}>
            {resort.location} · {resort.country}
          </p>
          <h1>{resort.name}</h1>
          <p className={styles.meta}>
            ★ {resort.rating.toFixed(1)} · {resort.reviewCount.toLocaleString()}{" "}
            reviews
          </p>
          <div className={styles.tags}>
            {resort.tags.map((t) => (
              <span key={t} className="tag">
                {TAG_LABELS[t]}
              </span>
            ))}
          </div>

          <p className={styles.description}>{resort.description}</p>

          <section className={styles.block}>
            <h2>Spa highlights</h2>
            <ul className={styles.spaList}>
              {resort.spaHighlights.map((s) => (
                <li key={s}>
                  <span>✦</span> {s}
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.block}>
            <h2>Amenities</h2>
            <ul className={styles.amenities}>
              {resort.amenities.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </section>
        </div>

        <div className={styles.builderCol}>
          <Suspense>
            <PackageBuilder resort={resort} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
