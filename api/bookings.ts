import { createClient } from '@supabase/supabase-js';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Idempotency-Key');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 新增：读取环境变量并创建 Supabase 客户端
  const env = (globalThis as any)?.process?.env as Record<string, string | undefined>;
  const SUPABASE_URL = env?.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = env?.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({
      error: 'Server misconfigured: missing environment variables',
      missing: {
        SUPABASE_URL: !SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY: !SUPABASE_SERVICE_ROLE_KEY
      }
    });
  }

  const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );

  const {
    checkinDate,
    checkoutDate,
    roomType,
    guestCount,
    guestName,
    guestPhone,
    guestEmail,
    specialRequests,
    priceTotal,
    idempotencyKey: bodyIdempotencyKey
  } = req.body || {};
  const headerIdempotencyKey = req.headers['idempotency-key'] as string | undefined;
  const idempotencyKey = headerIdempotencyKey || bodyIdempotencyKey || null;

  if (!checkinDate || !checkoutDate || !roomType || !guestCount || !guestName || !guestPhone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const checkin = new Date(checkinDate);
  const checkout = new Date(checkoutDate);
  const nights = Math.max(1, Math.ceil((checkout.getTime() - checkin.getTime()) / (1000 * 60 * 60 * 24)));
  const bookingNumber = `BJ${Date.now().toString().slice(-8)}`;

  if (idempotencyKey) {
    const { data: existing } = await supabase
      .from('bookings')
      .select('id, booking_number')
      .eq('idempotency_key', idempotencyKey)
      .limit(1)
      .single();

    if (existing) {
      return res.status(200).json({
        bookingId: existing.id,
        bookingNumber: existing.booking_number,
        status: 'confirmed'
      });
    }
  }

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      booking_number: bookingNumber,
      checkin_date: checkinDate,
      checkout_date: checkoutDate,
      nights,
      room_type: roomType,
      guest_count: guestCount,
      guest_name: guestName,
      guest_phone: guestPhone,
      guest_email: guestEmail || null,
      special_requests: specialRequests || null,
      status: 'confirmed',
      price_total: priceTotal ?? null,
      idempotency_key: idempotencyKey
    })
    .select('id, booking_number')
    .single();

  if (error) {
    return res.status(500).json({ error: 'Insert failed', details: error.message });
  }

  return res.status(201).json({
    bookingId: data.id,
    bookingNumber: data.booking_number,
    status: 'confirmed'
  });
}
