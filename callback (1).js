const { required, publicUrl, put, get, remove, sessionId, redirect, errorRedirect } = require("../../_lib/auth");

// Roblox sign-in only CONNECTS the account to the session. Roles are given later, when the user presses "Verify me".
module.exports = async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end("Method not allowed");
  const code = req.query.code;
  const state = req.query.state;
  if (!code || !state) return errorRedirect(res, "roblox");
  try {
    const sid = sessionId(req);
    const pending = await get("tcl:oauth:roblox:" + state);
    await remove("tcl:oauth:roblox:" + state);
    if (!sid || !pending || pending.sid !== sid) return errorRedirect(res, "state");
    const body = new URLSearchParams({
      client_id: required("ROBLOX_CLIENT_ID"),
      client_secret: required("ROBLOX_CLIENT_SECRET"),
      grant_type: "authorization_code",
      code: String(code),
      redirect_uri: publicUrl("/api/auth/roblox/callback"),
      code_verifier: pending.verifier
    });
    const tokenResponse = await fetch("https://apis.roblox.com/oauth/v1/token", {
      method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body
    });
    if (!tokenResponse.ok) return errorRedirect(res, "roblox");
    const token = await tokenResponse.json();
    const userResponse = await fetch("https://apis.roblox.com/oauth/v1/userinfo", {
      headers: { authorization: "Bearer " + token.access_token }
    });
    if (!userResponse.ok) return errorRedirect(res, "roblox");
    const user = await userResponse.json();
    if (!user.sub) return errorRedirect(res, "roblox");
    const session = await get("tcl:session:" + sid);
    if (!session || !session.discord) return errorRedirect(res, "state");
    const robloxId = String(user.sub);
    session.roblox = {
      id: robloxId,
      username: user.preferred_username || user.name || user.nickname || "Roblox user",
      displayName: user.name || user.nickname || user.preferred_username || "Roblox user",
      profile: user.profile || "https://www.roblox.com/users/" + encodeURIComponent(robloxId) + "/profile",
      avatar: user.picture || ""
    };
    await put("tcl:session:" + sid, session, 60 * 60 * 24 * 30);
    redirect(res, publicUrl("/verify.html"));
  } catch (error) {
    console.error("Roblox OAuth callback failed:", error.message);
    errorRedirect(res, "setup");
  }
};
