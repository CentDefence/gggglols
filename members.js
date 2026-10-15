const { redis, get, json, botAuthorized } = require("../_lib/auth");

// Bot-only: every verified member with their Discord ID (used for role + nickname sync).
module.exports = async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end("Method not allowed");
  if (!botAuthorized(req)) return json(res, 401, { error: "unauthorized" });
  try {
    const flat = (await redis(["HGETALL", "tcl:vmembers"])) || [];
    const list = [];
    for (let i = 0; i < flat.length; i += 2) {
      let m;
      try { m = JSON.parse(flat[i + 1]); } catch { continue; }
      if (!m.i) { // older entries: resolve the Discord ID from the username index
        const link = await get("tcl:user:" + flat[i]);
        if (link && link.discordId) m.i = link.discordId;
      }
      if (m.i) list.push({ discordId: m.i, roblox: m.u, displayName: m.d });
    }
    return json(res, 200, list);
  } catch (error) {
    console.error("Bot members failed:", error.message);
    return json(res, 503, { error: "unavailable" });
  }
};
