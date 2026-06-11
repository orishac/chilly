import Image from "next/image";
import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div>
          <div className={styles.brand}>
            <Image src="/chilly-mark.png" alt="" width={32} height={32} />
            Chilly
          </div>
          <p>Resort & spa vacations, bundled into one easy booking.</p>
        </div>
        <p className={styles.note}>
          Personal demo project — no real bookings are made.
        </p>
      </div>
    </footer>
  );
}
