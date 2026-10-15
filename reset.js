const { remove, sessionId, clearSessionCookie, publicUrl, redirect } = require("../_lib/auth");

// "Use another account": forget the connected accounts in this browser.
module.exports = async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") return res.status(405).end("Method not allowed");
  try {
    const sid = sessionId(req);
    if (sid) await remove("tcl:session:" + sid);
  } catch (error) {
    console.error("Reset cleanup failed:", error.message);
  }
  clearSessionCookie(res);
  redirect(res, publicUrl("/verify.html?fresh=1"));
};
