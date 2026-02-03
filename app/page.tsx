import { Suspense } from "react";
import { CurrentUser } from "./current-user";

export default function Home() {
  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>Haricot Web</h1>
      <p>Convex client integration test.</p>
      <Suspense fallback={<p>Loading user…</p>}>
        <CurrentUser />
      </Suspense>
    </main>
  );
}
