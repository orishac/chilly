import { Suspense } from "react";
import SearchClient from "./SearchClient";

export const metadata = { title: "Find a resort — Chilly" };

export default function SearchPage() {
  return (
    <Suspense>
      <SearchClient />
    </Suspense>
  );
}
