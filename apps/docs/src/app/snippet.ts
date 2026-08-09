/** Wraps source in a fenced markdown block for `<analog-markdown>` + Shiki. */
export function codeBlock(code: string, lang = 'ts'): string {
  return '```' + lang + '\n' + code + '\n```';
}
