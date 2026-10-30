VERCEL'GA YUKLASH
1) Papkani GitHub'ga yuklang (yoki terminalda: npm i -g vercel, so'ng papka ichida: vercel --prod).
2) Vercel -> Add New Project -> shu repozitoriyani tanlang -> Deploy.
3) Vercel loyihasi -> Storage -> Create/Connect -> Upstash Redis (Marketplace) -> loyihaga ulang (bepul tarif).
   Env o'zgaruvchilar (KV_REST_API_URL, KV_REST_API_TOKEN) avtomatik qo'shiladi.
4) Settings -> Environment Variables: ADMIN_LOGIN va ADMIN_PASSWORD qo'shing (uzun parol qo'ying).
5) Deployments -> oxirgi deploy -> Redeploy.
Admin: saytdagi "Admin" tugmasi -> login/parol. Parol serverda tekshiriladi, kodda yo'q.
