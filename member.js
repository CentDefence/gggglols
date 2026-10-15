const { get, json, botAuthorized } = require("../_lib/auth");

// Bot-only: look up one verified member by Discord ID (?discordId=) or Roblox username (?roblox=).
module.exports = async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end("Method not allowed");
  if (!botAuthorized(req)) return json(res, 401, { error: "unauthorized" });
  try {
    let discordId = String(req.query.discordId || "").trim();
    const roblox = String(req.query.roblox || "").trim().replace(/^@/, "").toLowerCase();
    if (!discordId && /^[a-z0-9_]{3,20}$/.test(roblox)) {
      const link = await get("tcl:user:" + roblox);
      discordId = link ? link.discordId : "";
    }
    if (!/^\d{5,25}$/.test(discordId)) return json(res, 404, { error: "not_verified" });
    const profile = await get("tcl:profile:" + discordId);
    if (!profile) return json(res, 404, { error: "not_verified" });
    return json(res, 200, {
      discordId, roblox: profile.roblox.username, displayName: profile.roblox.displayName,
      avatar: profile.roblox.avatar, verifiedAt: profile.verifiedAt
    });
  } catch (error) {
    console.error("Bot member failed:", error.message);
    return json(res, 503, { error: "unavailable" });
  }
};
