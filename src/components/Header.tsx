import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.scss";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/chilly-mark.png"
            alt=""
            width={52}
            height={52}
            priority
          />
          Chilly
        </Link>
        <nav className={styles.nav}>
          <Link href="/search">Resorts</Link>
          <Link href="/search?tag=hot-springs">Hot springs</Link>
          <Link href="/search?tag=adults-only">Adults only</Link>
        </nav>
        <Link href="/search" className="btn btn-primary">
          Plan a trip
        </Link>
      </div>
    </header>
  );
}
