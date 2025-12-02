# 通过vercel关联的Github更新
git add .
git commit -m "changes"
git push

# 直接vercel更新到生产（macOS 终端执行）
cd /Users/shl-macmini/Downloads/OKComputer_极简民宿预订
npm i -g vercel
vercel login
vercel link    # 选择 hailiangs-projects/booking
vercel env ls  # 确认 SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 已配置
vercel deploy --prod

# 生产页面与接口验证（同源）
curl -I https://www.live2life.top/booking.html
curl -i -X OPTIONS https://www.live2life.top/api/bookings \
  -H "Origin: https://www.live2life.top" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type, Idempotency-Key"
curl -i -X POST https://www.live2life.top/api/bookings \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: test-123" \
  --data '{"checkinDate":"2025-12-10","checkoutDate":"2025-12-12","roomType":"standard","guestCount":2,"guestName":"张三","guestPhone":"13800000000"}'

# DNS 生效与证书检查（可选）
dig +short NS live2life.top
dig @ns1.vercel-dns.com live2life.top A +short
dig @ns2.vercel-dns.com live2life.top A +short
dig @1.1.1.1 live2life.top A +short
dig @8.8.8.8 live2life.top A +short
openssl s_client -connect live2life.top:443 -servername live2life.top -showcerts

# 本地同源开发（可选）
vercel dev
open http://localhost:3000/booking.html