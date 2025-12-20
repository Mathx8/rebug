"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Ranking from "@/components/Ranking";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      if (window.location.hash.includes("access_token")) {
        router.replace("/adm/setup-password" + window.location.hash);
      }
    }
  }, [router]);

  return <Ranking />;
}