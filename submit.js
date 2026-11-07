const redis = require("./_db");
const KEYS = {
  full: "BCAABBCDABCADBCADBCADBCADBACDA",
  A: "CABDABDCACBDBCADBCADBCADB",
  B: "BDACBDACBADCADBCABDCADCBA",
};
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  const b = req.body || {};
  const test = String(b.test || "full");
  const key = KEYS[test];
  const answers = String(b.answers || "");
  const name = String(b.name || "").trim().slice(0, 60);
  const cls = String(b.cls || "").trim().slice(0, 20);
  if (!key || answers.length !== key.length || !/^[ABCD-]+$/.test(answers) || !name || !cls)
    return res.status(400).json({ error: "bad request" });
  let score = 0;
  for (let i = 0; i < key.length; i++) if (answers[i] === key[i]) score++;
  const rec = {
    test, name, cls, score, total: key.length,
    pct: Math.round((score / key.length) * 100),
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
