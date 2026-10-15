const { required, publicUrl, put, get, remove, sessionId, json, FIVE_YEARS, indexPlayer, unindexPlayer } = require("./_lib/auth");

// "Verify me": needs both accounts connected in the session. Adds the member to the server, gives the role and nickname, saves the profile.
module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method not allowed");
  try {
    const origin = req.headers.origin;
    if (origin && origin !== new URL(publicUrl("/")).origin) return json(res, 403, { error: "forbidden" });
    const sid = sessionId(req);
    const session = sid ? await get("tcl:session:" + sid) : null;
    if (!session || !session.discord || !session.roblox) return json(res, 400, { error: "not_connected" });

    const discordId = session.discord.id, robloxId = session.roblox.id;
    const linkedRoblox = await get("tcl:roblox:" + robloxId);
    const linkedDiscord = await get("tcl:discord:" + discordId);
    if ((linkedRoblox && linkedRoblox.discordId !== discordId) || (linkedDiscord && linkedDiscord.robloxId !== robloxId)) {
      return json(res, 409, { error: "already-linked" });
    }

    const api = "https://discord.com/api/v10/guilds/" + encodeURIComponent(required("DISCORD_GUILD_ID")) + "/members/" + encodeURIComponent(discordId);
    const roleId = required("DISCORD_VERIFIED_ROLE_ID");
    const auth = "Bot " + required("DISCORD_BOT_TOKEN");
    const headers = { authorization: auth, "content-type": "application/json" };

    let memberResponse = await fetch(api, { headers: { authorization: auth } });
    if (memberResponse.status === 404) {
      if (!session.discord.accessToken) return json(res, 400, { error: "reconnect" });
      const joinResponse = await fetch(api, { method: "PUT", headers, body: JSON.stringify({ access_token: session.discord.accessToken }) });
      if (!joinResponse.ok && joinResponse.status !== 204) {
        console.error("Discord guild join failed with status", joinResponse.status);
        return json(res, joinResponse.status === 401 || joinResponse.status === 403 ? 400 : 502, { error: joinResponse.status === 401 ? "reconnect" : "bot" });
      }
      memberResponse = await fetch(api, { headers: { authorization: auth } });
    }
    if (!memberResponse.ok) { console.error("Discord member lookup failed with status", memberResponse.status); return json(res, 502, { error: "bot" }); }
    const member = await memberResponse.json();
    const roles = [...new Set([...(member.roles || []), roleId])];
    const roleResponse = await fetch(api, { method: "PATCH", headers, body: JSON.stringify({ roles }) });
    if (!roleResponse.ok) { console.error("Discord role assignment failed with status", roleResponse.status); return json(res, 502, { error: "bot" }); }
    const nick = String(session.roblox.username).slice(0, 32);
    const nickResponse = await fetch(api, { method: "PATCH", headers, body: JSON.stringify({ nick }) });
    if (!nickResponse.ok) console.error("Discord nickname update failed with status", nickResponse.status);

    const profile = {
      discord: { id: discordId, username: session.discord.username, handle: session.discord.handle, avatar: session.discord.avatar },
      roblox: session.roblox,
      verifiedAt: new Date().toISOString()
    };
    const previous = await get("tcl:profile:" + discordId);
    if (previous && previous.roblox && previous.roblox.username && previous.roblox.username.toLowerCase() !== profile.roblox.username.toLowerCase()) {
      await unindexPlayer(previous.roblox.username);
    }
    await put("tcl:discord:" + discordId, { robloxId }, FIVE_YEARS);
    await put("tcl:roblox:" + robloxId, { discordId }, FIVE_YEARS);
    await put("tcl:profile:" + discordId, profile, FIVE_YEARS);
    await indexPlayer(profile);
    await put("tcl:session:" + sid, { discord: profile.discord, roblox: profile.roblox, verified: true }, 60 * 60 * 24 * 30);
    return json(res, 200, { ok: true });
  } catch (error) {
    console.error("Verify failed:", error.message);
    return json(res, 503, { error: "setup" });
  }
};
