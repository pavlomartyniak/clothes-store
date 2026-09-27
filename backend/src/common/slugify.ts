const TRANSLIT_MAP: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'h',
  ґ: 'g',
  д: 'd',
  е: 'e',
  є: 'ie',
  ж: 'zh',
  з: 'z',
  и: 'y',
  і: 'i',
  ї: 'i',
  й: 'i',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'kh',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'shch',
  ь: '',
  ю: 'iu',
  я: 'ia',
  "'": '',
  '’': '',
  ʼ: '',
};

/**
 * Transliterates Ukrainian Cyrillic to Latin and normalizes into a
 * URL-safe slug (lowercase, dash-separated, no leading/trailing dashes).
 */
export function slugify(input: string): string {
  const transliterated = input
    .toLowerCase()
    .split('')
    .map((char) => (char in TRANSLIT_MAP ? TRANSLIT_MAP[char] : char))
    .join('');

  return transliterated.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
