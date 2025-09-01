export function cn(...vals: Array<string | false | null | undefined>) {
  return vals.filter(Boolean).join(" ");
}