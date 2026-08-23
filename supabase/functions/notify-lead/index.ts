// Edge function: notifica email a domenico@spicco.ai per ogni nuova richiesta.
// Il salvataggio a DB avviene lato client ed è la fonte di verità: se questa
// notifica fallisce, il lead è comunque al sicuro nella tabella leads.
//
// Variabili d'ambiente richieste:
//   RESEND_API_KEY  chiave API Resend (mittente verificato su spicco.ai)

const NOTIFY_TO = "domenico@spicco.ai";
const NOTIFY_FROM = "Spicco <notifiche@spicco.ai>";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT_MAX;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return new Response(JSON.stringify({ error: "rate_limited" }), {
      status: 429,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let payload: {
    nome?: string;
    email?: string;
    azienda_ruolo?: string;
    assunzioni_anno?: string | null;
  };
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid_json" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { nome, email, azienda_ruolo, assunzioni_anno } = payload;
  if (!nome || !email || !azienda_ruolo) {
    return new Response(JSON.stringify({ error: "missing_fields" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!resendKey) {
    return new Response(JSON.stringify({ error: "email_not_configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const text = [
    `Nome e cognome: ${nome}`,
    `Email aziendale: ${email}`,
    `Azienda e ruolo: ${azienda_ruolo}`,
    `Assunzioni in un anno: ${assunzioni_anno || "non indicato"}`,
  ].join("\n");

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: NOTIFY_FROM,
      to: [NOTIFY_TO],
      reply_to: email,
      subject: `Nuova richiesta dal sito — ${nome} (${azienda_ruolo})`,
      text,
    }),
  });

  if (!resendResponse.ok) {
    return new Response(JSON.stringify({ error: "email_failed" }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
