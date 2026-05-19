import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getSupabaseConfig } from "@/lib/supabase/config";
import type { Database } from "@/types/database";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const { anonKey, url } = getSupabaseConfig();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(
        cookiesToSet: {
          name: string;
          options: CookieOptions;
          value: string;
        }[],
      ) {
        try {
          cookiesToSet.forEach(({ name, options, value }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components koennen keine Cookies setzen; Auth-Routen und Actions koennen es.
        }
      },
    },
  });
}
