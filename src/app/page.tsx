import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import ResortCard from "@/components/ResortCard";
import { RESORTS } from "@/lib/data";
import styles from "./page.module.scss";

const COLLECTIONS = [
  { tag: "hot-springs", emoji: "♨️", title: "Hot springs", blurb: "Volcano-fed pools and ancient bathing towns." },
  { tag: "overwater", emoji: "🌊", title: "Overwater", blurb: "Villas on stilts, reefs under your floor." },
  { tag: "adults-only", emoji: "🥂", title: "Adults only", blurb: "Quiet pools, late breakfasts, zero kids' clubs." },
  { tag: "yoga", emoji: "🧘", title: "Yoga & wellness", blurb: "Retreats built around movement and rest." },
];

export default function Home() {
  const featured = [...RESORTS].sort((a, b) => b.rating - a.rating).slice(0, 3);

  return (
    <>
      <section className={styles.hero}>
        <div className="container">
          <h1>
            Chill out.
            <br />
            We handle the hot stuff.
          </h1>
          <p className={styles.sub}>
            Handpicked spa resorts, treatments, flights and transfers —
            bundled into one easy booking, so the only thing left to plan is
            doing nothing.
          </p>
          <SearchBar />
          <div className={styles.heroStats}>
            <span><strong>{RESORTS.length}</strong> handpicked resorts</span>
            <span><strong>4</strong> spa packages</span>
            <span><strong>1</strong> checkout</span>
          </div>
        </div>
      </section>

      <section className={`container ${styles.section}`}>
        <div className={styles.sectionHead}>
          <h2>Top-rated escapes</h2>
          <Link href="/search" className={styles.viewAll}>
            View all resorts →
          </Link>
        </div>
        <div className={styles.grid}>
          {featured.map((r) => (
            <ResortCard key={r.id} resort={r} />
          ))}
        </div>
      </section>

      <section className={`container ${styles.section}`}>
        <div className={styles.sectionHead}>
          <h2>Browse by mood</h2>
        </div>
        <div className={styles.collections}>
          {COLLECTIONS.map((c) => (
            <Link
              key={c.tag}
              href={`/search?tag=${c.tag}`}
              className={styles.collection}
            >
              <span className={styles.collectionEmoji}>{c.emoji}</span>
              <h3>{c.title}</h3>
              <p>{c.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className={`container ${styles.section}`}>
        <div className={styles.how}>
          <h2>How Chilly works</h2>
          <div className={styles.steps}>
            <div>
              <span className={styles.stepNum}>1</span>
              <h3>Pick your resort</h3>
              <p>Search by destination, dates and the kind of calm you're after.</p>
            </div>
            <div>
              <span className={styles.stepNum}>2</span>
              <h3>Build your package</h3>
              <p>Choose a room, add a spa package, bolt on flights and transfers.</p>
            </div>
            <div>
              <span className={styles.stepNum}>3</span>
              <h3>Check out once</h3>
              <p>One price, one confirmation. Pack a robe — actually, don't, they have those.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
