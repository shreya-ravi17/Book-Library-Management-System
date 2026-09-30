// Picks one of 4 theme-matched cover colours from the category name,
// so the same category always gets the same colour on every page.
export default function coverTone(category = "") {
  let hash = 0;
  for (const ch of category.toLowerCase()) hash = (hash * 31 + ch.charCodeAt(0)) % 4;
  return hash;
}
