"use client";

import { useQuery } from "convex/react";
import { api } from "@haricot/convex-client";

export function CurrentUser() {
  const user = useQuery(api.users.getCurrentUser);

  if (user === undefined) {
    return <p>Loading…</p>;
  }

  if (user === null) {
    return <p>No user signed in.</p>;
  }

  return (
    <div>
      <p>Signed in as: {user.email ?? user.name ?? "Unknown"}</p>
    </div>
  );
}
