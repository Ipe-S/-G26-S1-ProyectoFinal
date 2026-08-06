"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ContenedorWizardHuerto from "@/components/planifica-huerto/ContenedorWizardHuerto";

export default function IniciaMiHuertoClient() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login");
        return;
      }

      setAuthenticated(true);
      setChecking(false);
    }

    checkAuth();
  }, [router]);

  if (checking) {
    return (
      <div className="flex flex-1 items-center justify-center py-30">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-primary" />
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Verificando acceso...
          </p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return <ContenedorWizardHuerto />;
}