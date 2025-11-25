export default function handler(req: any, res: any) {
  const env = (globalThis as any)?.process?.env || {};
  const url: string = env.SUPABASE_URL || '';
  const key: string = env.SUPABASE_SERVICE_ROLE_KEY || '';

  const hasUrl = url.length > 0 && url.startsWith('https://') && url.includes('.supabase.co');
  const hasKey = key.length > 0;

  if (res?.setHeader) {
    res.setHeader('Content-Type', 'application/json');
  }
  const body = {
    ok: hasUrl && hasKey,
    SUPABASE_URL_present: url.length > 0,
    SUPABASE_URL_format_ok: hasUrl,
    SUPABASE_SERVICE_ROLE_KEY_present: hasKey
  };
  if (res?.status && res?.json) {
    return res.status(200).json(body);
  }
  // Fallback for environments without res.json
  if (res?.end) {
    return res.end(JSON.stringify(body));
  }
  return body;
}
