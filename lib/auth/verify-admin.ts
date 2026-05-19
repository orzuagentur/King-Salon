import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function verifyAdminSession() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return null;
  }

  const { data: admin, error } = await supabase
    .from("admins")
    .select("id, email, role")
    .eq("email", user.email)
    .maybeSingle();

  if (error || !admin) {
    return null;
  }

  return { admin, user };
}
