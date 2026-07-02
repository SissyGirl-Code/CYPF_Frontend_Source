const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://ktylraqkniqgbzkgldrk.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_a6-r0xtvc1XeBwywLDck4g_evOxhiT4";
const ADMIN_EMAIL = "melissabateman1981@gmail.com";
const SESSION_KEY = "cypf_supabase_session";

const PRODUCT_FIELDS = new Set([
  "name", "brand", "animal_type", "life_stage", "health_focus", "food_type", "quality_tier",
  "description", "image_url", "protein_pct", "fat_pct", "fiber_pct", "calories_per_cup",
  "is_grain_free", "has_artificial_preservatives", "is_single_protein", "top_ingredients",
  "allergens", "rating", "price_range", "affiliate_links", "featured"
]);

const REPORT_FIELDS = new Set([
  "aafco_statement", "full_ingredient_list", "full_guaranteed_analysis", "life_stage_claim",
  "manufacturer", "formulated_by", "feeding_trial_status", "digestibility_data",
  "sourcing_transparency", "manufacturing_transparency", "recall_history", "official_product_url",
  "evidence_source_urls", "known_facts", "missing_information", "cypf_summary",
  "nutritional_adequacy_status", "digestibility_confidence", "research_support_level",
  "transparency_score", "marketing_integrity_score", "overall_evidence_confidence",
  "report_status", "last_researched_at", "research_notes"
]);

function getStoredSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

function setStoredSession(session) {
  if (!session) localStorage.removeItem(SESSION_KEY);
  else localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function authHeader() {
  const session = getStoredSession();
  return session?.access_token ? `Bearer ${session.access_token}` : `Bearer ${SUPABASE_ANON_KEY}`;
}

async function supabaseFetch(path, options = {}) {
  const response = await fetch(`${SUPABASE_URL}${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: authHeader(),
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    let details = "";
    try { details = JSON.stringify(await response.json()); }
    catch { details = await response.text(); }
    throw new Error(`Supabase request failed (${response.status}): ${details}`);
  }

  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

function parseMaybeJson(value, fallback) {
  if (Array.isArray(value) || (value && typeof value === "object")) return value;
  if (!value || typeof value !== "string") return fallback;
  try { return JSON.parse(value); }
  catch { return fallback; }
}

function parseTopIngredients(value) {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "string") return [];
  const json = parseMaybeJson(value, null);
  if (Array.isArray(json)) return json;
  return value
    .split(/;\s*/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const match = part.match(/^(.+?)\s*\((.*)\)\.?$/);
      return match ? { name: match[1].trim(), benefit: match[2].trim() } : { name: part, benefit: "" };
    });
}

function serializeTopIngredients(value) {
  if (!Array.isArray(value)) return value || null;
  return value
    .filter((i) => i?.name?.trim())
    .map((i) => i.benefit?.trim() ? `${i.name.trim()} (${i.benefit.trim()})` : i.name.trim())
    .join("; ");
}

function parseList(value) {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "string") return [];
  const json = parseMaybeJson(value, null);
  if (Array.isArray(json)) return json;
  return value.split(/[;,]/).map((v) => v.trim()).filter(Boolean);
}

function serializeList(value) {
  if (!Array.isArray(value)) return value || null;
  return value.filter(Boolean).join("; ");
}

function parseAffiliateLinks(value) {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "string") return [];
  const json = parseMaybeJson(value, null);
  return Array.isArray(json) ? json : [];
}

function serializeAffiliateLinks(value) {
  if (!Array.isArray(value)) return value || null;
  const clean = value.filter((link) => link?.retailer || link?.url || link?.price);
  return clean.length ? JSON.stringify(clean) : null;
}

function normalizeProduct(row = {}) {
  return {
    ...row,
    created_date: row.created_date || row.created_at,
    updated_date: row.updated_date || row.updated_at,
    top_ingredients: parseTopIngredients(row.top_ingredients),
    allergens: parseList(row.allergens),
    affiliate_links: parseAffiliateLinks(row.affiliate_links),
  };
}

function productPayload(data) {
  const payload = {};
  for (const [key, value] of Object.entries(data)) {
    if (!PRODUCT_FIELDS.has(key)) continue;
    if (key === "top_ingredients") payload[key] = serializeTopIngredients(value);
    else if (key === "allergens") payload[key] = serializeList(value);
    else if (key === "affiliate_links") payload[key] = serializeAffiliateLinks(value);
    else payload[key] = value === "" ? null : value;
  }
  return payload;
}

function reportPayload(data) {
  const payload = {};
  for (const [key, value] of Object.entries(data)) {
    if (!REPORT_FIELDS.has(key)) continue;
    payload[key] = value === "" ? null : value;
  }
  return payload;
}

function mapOrder(order) {
  if (!order) return "created_at.desc";
  const desc = order.startsWith("-");
  const key = order.replace(/^-/, "");
  const column = key === "created_date" ? "created_at" : key;
  return `${column}.${desc ? "desc" : "asc"}`;
}

function filterParams(filter = {}) {
  const params = new URLSearchParams();
  Object.entries(filter).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    params.append(key, `eq.${value}`);
  });
  return params;
}

async function mergePublicCardData(products) {
  const ids = products.map((p) => p.id).filter(Boolean);
  if (!ids.length) return products;
  const params = new URLSearchParams();
  params.set("select", "*");
  params.set("product_id", `in.(${ids.join(",")})`);
  const cards = await supabaseFetch(`/rest/v1/product_transparency_public_cards?${params.toString()}`);
  const byId = new Map((cards || []).map((card) => [card.product_id, card]));
  return products.map((product) => normalizeProduct({ ...product, ...(byId.get(product.id) || {}) }));
}

async function listProducts(order = "-created_date", limit = 1000) {
  const params = new URLSearchParams();
  params.set("select", "*");
  params.set("order", mapOrder(order));
  if (limit) params.set("limit", String(limit));
  const rows = await supabaseFetch(`/rest/v1/products_with_transparency_reports?${params.toString()}`);
  return mergePublicCardData((rows || []).map(normalizeProduct));
}

async function filterProducts(filter = {}, order = "-created_date", limit = 1000) {
  const params = filterParams(filter);
  params.set("select", "*");
  params.set("order", mapOrder(order));
  if (limit) params.set("limit", String(limit));
  const rows = await supabaseFetch(`/rest/v1/products_with_transparency_reports?${params.toString()}`);
  return mergePublicCardData((rows || []).map(normalizeProduct));
}

async function listArticles(order = "-created_date", limit = 500) {
  const params = new URLSearchParams();
  params.set("select", "*");
  params.set("order", mapOrder(order));
  if (limit) params.set("limit", String(limit));
  const rows = await supabaseFetch(`/rest/v1/articles?${params.toString()}`);
  return (rows || []).map((row) => ({ ...row, created_date: row.created_at }));
}

async function filterArticles(filter = {}, order = "-created_date", limit = 500) {
  const params = filterParams(filter);
  params.set("select", "*");
  params.set("order", mapOrder(order));
  if (limit) params.set("limit", String(limit));
  const rows = await supabaseFetch(`/rest/v1/articles?${params.toString()}`);
  return (rows || []).map((row) => ({ ...row, created_date: row.created_at }));
}

async function ensureReport(productId) {
  const rows = await supabaseFetch(`/rest/v1/product_transparency_reports?select=*&product_id=eq.${productId}&limit=1`);
  if (rows?.[0]) return rows[0];
  const created = await supabaseFetch(`/rest/v1/product_transparency_reports?select=*`, {
    method: "POST",
    body: JSON.stringify({ product_id: productId }),
  });
  return created?.[0];
}

async function createProduct(data) {
  const productData = productPayload(data);
  const reportData = reportPayload(data);
  const created = await supabaseFetch(`/rest/v1/products?select=*`, {
    method: "POST",
    body: JSON.stringify(productData),
  });
  const product = created?.[0];
  if (product && Object.keys(reportData).length) {
    const report = await ensureReport(product.id);
    if (report) {
      await supabaseFetch(`/rest/v1/product_transparency_reports?id=eq.${report.id}&select=*`, {
        method: "PATCH",
        body: JSON.stringify(reportData),
      });
    }
  }
  return normalizeProduct(product);
}

async function updateProduct(id, data) {
  const productData = productPayload(data);
  const reportData = reportPayload(data);
  let product = null;
  if (Object.keys(productData).length) {
    const updated = await supabaseFetch(`/rest/v1/products?id=eq.${id}&select=*`, {
      method: "PATCH",
      body: JSON.stringify(productData),
    });
    product = updated?.[0];
  }
  if (Object.keys(reportData).length) {
    const report = await ensureReport(id);
    if (report) {
      await supabaseFetch(`/rest/v1/product_transparency_reports?id=eq.${report.id}&select=*`, {
        method: "PATCH",
        body: JSON.stringify(reportData),
      });
    }
  }
  return normalizeProduct(product || data);
}

async function deleteProduct(id) {
  return supabaseFetch(`/rest/v1/products?id=eq.${id}`, { method: "DELETE" });
}

async function createArticle(data) {
  const created = await supabaseFetch(`/rest/v1/articles?select=*`, { method: "POST", body: JSON.stringify(data) });
  return created?.[0];
}

async function updateArticle(id, data) {
  const updated = await supabaseFetch(`/rest/v1/articles?id=eq.${id}&select=*`, { method: "PATCH", body: JSON.stringify(data) });
  return updated?.[0];
}

async function deleteArticle(id) {
  return supabaseFetch(`/rest/v1/articles?id=eq.${id}`, { method: "DELETE" });
}

async function signInWithPassword(email, password) {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: SUPABASE_ANON_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error("Login failed. Check your email and password.");
  const session = await response.json();
  setStoredSession(session);
  return { ...session.user, role: session.user?.email === ADMIN_EMAIL ? "admin" : "user" };
}

async function currentUser() {
  const session = getStoredSession();
  if (!session?.access_token) throw new Error("No active session");
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${session.access_token}` },
  });
  if (!response.ok) {
    setStoredSession(null);
    throw new Error("Session expired");
  }
  const user = await response.json();
  return { ...user, role: user?.email === ADMIN_EMAIL ? "admin" : "user" };
}

function logout() {
  setStoredSession(null);
}

export const supabaseConfig = { url: SUPABASE_URL, anonKey: SUPABASE_ANON_KEY, adminEmail: ADMIN_EMAIL };

export const base44 = {
  entities: {
    Product: { list: listProducts, filter: filterProducts, create: createProduct, update: updateProduct, delete: deleteProduct },
    Article: { list: listArticles, filter: filterArticles, create: createArticle, update: updateArticle, delete: deleteArticle },
  },
  auth: {
    me: currentUser,
    signInWithPassword,
    logout,
    redirectToLogin: () => {},
  },
};