// Kebijakan atribut URL untuk helper DOM. Modul ini murni (tanpa DOM/Leaflet)
// agar bisa diuji langsung di Vitest lingkungan node tanpa dependency baru.

const SAFE_URL_PREFIXES = ['#', '/', './', 'https://', 'blob:'];

/**
 * Mengembalikan false untuk atribut URL dengan skema yang tidak dipakai aplikasi.
 * Atribut non-URL (title, aria-*, dll.) dibiarkan: nilainya adalah teks, bukan HTML.
 */
export function isSafeAttribute(key, value) {
  if (key !== 'href' && key !== 'src' && key !== 'xlink:href') return true;

  const raw = String(value ?? '').trim().toLowerCase();
  if (raw === '') return false;
  // URL relatif-protokol ("//host") sengaja ditolak.
  if (raw.startsWith('//')) return false;

  return SAFE_URL_PREFIXES.some((prefix) => raw.startsWith(prefix));
}
