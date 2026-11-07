const crypto = require("crypto");
const redis = require("./_db");
const h = (s) => crypto.createHash("sha256").update(String(s)).digest();
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  const { login, password } = req.body || {};
  const ok =
    crypto.timingSafeEqual(h(login), h(process.env.ADMIN_LOGIN || "")) &&
    crypto.timingSafeEqual(h(password), h(process.env.ADMIN_PASSWORD || "")) &&
    !!process.env.ADMIN_PASSWORD;
  if (!ok) {
    await new Promise((r) => setTimeout(r, 800));
    return res.status(401).json({ error: "unauthorized" });
  }
  try {
    const list = await redis(["LRANGE", "results", 0, -1]);
    res.json({ rows: (list || []).map((x) => JSON.parse(x)) });
  } catch (e) {
    res.status(500).json({ error: "db" });
  }
};
