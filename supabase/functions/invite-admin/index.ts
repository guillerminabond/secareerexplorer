// supabase/functions/invite-admin/index.ts
// Edge Function: create new admin users & list existing ones.
// Deploy with:  supabase functions deploy invite-admin --no-verify-jwt
// (JWT is verified manually so we can return 401 with a message.)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

/** Verify the caller's JWT and return the user, or throw. */
async function authenticateCaller(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Missing or invalid Authorization header");
  }
  const token = authHeader.replace("Bearer ", "");
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const anonClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data: { user }, error } = await anonClient.auth.getUser();
  if (error || !user) throw new Error("Invalid or expired token");
  return user;
}

/** Get an admin client (uses service_role key). */
function getAdminClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}

// ── POST: invite a new admin user (email-only, no password) ─────────
async function handleInvite(req: Request) {
  const caller = await authenticateCaller(req);
  const { email } = await req.json();

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return json({ error: "A valid email is required." }, 400);
  }

  const admin = getAdminClient();

  // Send an invite email — the new user sets their own password via the link
  const { data, error } = await admin.auth.admin.inviteUserByEmail(email.trim());

  if (error) {
    const status = error.message?.includes("already been registered") ? 409 : 400;
    return json({ error: error.message }, status);
  }

  // Log the action to the audit table (best-effort)
  await admin.from("admin_audit_log").insert({
    action: "invite_admin",
    actor_id: caller.id,
    actor_email: caller.email,
    target_email: email.trim(),
    target_id: data.user?.id ?? null,
  }).then(() => {}, () => {}); // swallow errors — audit is non-critical

  return json({
    ok: true,
    message: `Invite sent to ${email.trim()}. They'll receive an email to set their password and activate their account.`,
    user_id: data.user?.id,
  });
}

// ── GET: list all auth users (for the admin table) ──────────────────
async function handleList(req: Request) {
  await authenticateCaller(req);
  const admin = getAdminClient();

  const { data, error } = await admin.auth.admin.listUsers({ perPage: 200 });
  if (error) {
    return json({ error: error.message }, 500);
  }

  // Return only the fields the admin panel needs
  const users = (data?.users ?? []).map((u) => ({
    id: u.id,
    email: u.email,
    created_at: u.created_at,
    confirmed_at: u.email_confirmed_at ?? u.confirmed_at ?? null,
    last_sign_in_at: u.last_sign_in_at ?? null,
  }));

  return json({ users });
}

// ── Router ──────────────────────────────────────────────────────────
Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method === "POST") return await handleInvite(req);
    if (req.method === "GET")  return await handleList(req);
    return json({ error: "Method not allowed" }, 405);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    const status = message.includes("token") || message.includes("Authorization") ? 401 : 500;
    return json({ error: message }, status);
  }
});

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
