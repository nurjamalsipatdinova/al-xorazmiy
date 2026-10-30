const redis = require("./_db");
const ANS = "BCAABBCDABCADBCADBCADBCADBACDA";
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  const b = req.body || {};
  const answers = String(b.answers || "");
  const name = String(b.name || "").trim().slice(0, 60);
  const cls = String(b.cls || "").trim().slice(0, 20);
  if (!/^[ABCD-]{30}$/.test(answers) || !name || !cls)
    return res.status(400).json({ error: "bad request" });
  let score = 0;
  for (let i = 0; i < 30; i++) if (answers[i] === ANS[i]) score++;
  const rec = {
    name, cls, score, total: 30, pct: Math.round((score / 30) * 100),
    spent: Math.max(0, Math.min(1200, parseInt(b.spent) || 0)),
    lang: ["uz", "ru", "kk"].includes(b.lang) ? b.lang : "uz",
    ts: Date.now(), answers,
  };
  try {
    await redis(["RPUSH", "results", JSON.stringify(rec)]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "db" });
  }
};
