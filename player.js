const { get, json } = require("./_lib/auth");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end("Method not allowed");
  const name = String(req.query.u || "").trim().replace(/^@/, "").toLowerCase();
  if (!/^[a-z0-9_]{3,20}$/.test(name)) return json(res, 400, { error: "bad_name" });
  try {
    const link = await get("tcl:user:" + name);
    const profile = link ? await get("tcl:profile:" + link.discordId) : null;
    if (!profile) return json(res, 404, { error: "not_verified" });
    return json(res, 200, {
      roblox: { username: profile.roblox.username, displayName: profile.roblox.displayName, profile: profile.roblox.profile, avatar: profile.roblox.avatar },
      discord: { username: profile.discord.username, avatar: profile.discord.avatar },
      verifiedAt: profile.verifiedAt
    });
  } catch (error) {
    console.error("Player lookup failed:", error.message);
    return json(res, 503, { error: "player_unavailable" });
  }
};
