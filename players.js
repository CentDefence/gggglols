const { redis } = require("./_lib/auth");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end("Method not allowed");
  try {
    const flat = (await redis(["HGETALL", "tcl:vmembers"])) || [];
    const list = [];
    for (let i = 0; i < flat.length; i += 2) {
      try { const m = JSON.parse(flat[i + 1]); list.push({ u: m.u, d: m.d, a: m.a }); } catch { /* skip bad row */ }
    }
    res.statusCode = 200;
    res.setHeader("content-type", "application/json; charset=utf-8");
    res.setHeader("cache-control", "public, s-maxage=60, stale-while-revalidate=300");
    res.end(JSON.stringify(list));
  } catch (error) {
    console.error("Players list failed:", error.message);
    res.statusCode = 503;
    res.setHeader("content-type", "application/json; charset=utf-8");
    res.end("[]");
  }
};
