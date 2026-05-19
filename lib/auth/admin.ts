import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/admin/anmelden");
  }

  const { data: admin, error } = await supabase
    .from("admins")
    .select("id, email, role")
    .eq("email", user.email)
    .maybeSingle();

  if (error || !admin) {
    redirect("/admin/anmelden?fehler=Kein%20Admin-Zugriff");
  }

  return {
    admin,
    user,
  };
}
