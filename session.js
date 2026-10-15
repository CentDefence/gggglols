const { get, sessionId, json } = require("./_lib/auth");

// What is connected in this browser session. Never returns tokens or IDs.
module.exports = async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end("Method not allowed");
  try {
    const sid = sessionId(req);
    const s = sid ? await get("tcl:session:" + sid) : null;
    if (!s || !s.discord) return json(res, 200, { discord: null, roblox: null, verified: false });
    const stored = await get("tcl:profile:" + s.discord.id);
    const verified = !!(stored && (!s.roblox || stored.roblox.id === s.roblox.id));
    const roblox = s.roblox || (verified ? stored.roblox : null);
    return json(res, 200, {
      discord: { username: s.discord.username, avatar: s.discord.avatar },
      roblox: roblox ? { username: roblox.username, displayName: roblox.displayName, avatar: roblox.avatar } : null,
      verified
    });
  } catch (error) {
    console.error("Session lookup failed:", error.message);
    return json(res, 503, { error: "unavailable" });
  }
};
