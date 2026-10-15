const { get, sessionId, json, indexPlayer } = require("./_lib/auth");

// Own profile. Works as soon as both accounts are connected ("logged in"); `verified` says whether "Verify me" was completed.
module.exports = async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end("Method not allowed");
  try {
    const sid = sessionId(req);
    const session = sid ? await get("tcl:session:" + sid) : null;
    if (!session || !session.discord) return json(res, 401, { error: "not_authenticated" });
    const stored = await get("tcl:profile:" + session.discord.id);
    if (stored && (!session.roblox || stored.roblox.id === session.roblox.id)) {
      try { await indexPlayer(stored); } catch (e) { console.error("Player index failed:", e.message); }
      return json(res, 200, { ...stored, verified: true });
    }
    if (session.roblox) {
      const d = session.discord;
      return json(res, 200, {
        discord: { id: d.id, username: d.username, handle: d.handle, avatar: d.avatar },
        roblox: session.roblox, verified: false, verifiedAt: null
      });
    }
    return json(res, 401, { error: "not_connected" });
  } catch (error) {
    console.error("Profile lookup failed:", error.message);
    return json(res, 503, { error: "profile_unavailable" });
  }
};
