"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Ranking from "@/components/Ranking";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash;
      if (hash.includes("access_token")) {
        router.replace("/adm" + hash);
      }
    }
  }, [router]);

  return (
    <Ranking />
  );
}
