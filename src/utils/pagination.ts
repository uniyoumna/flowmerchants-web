/**
 * Builds a windowed page list (`1 … 4 5 6 … 20`) so a pager stays a fixed
 * width no matter how many pages the backend reports.
 */
export type PageItem = number | "ellipsis";

export function buildPageItems(
  currentPage: number,
  totalPages: number,
  siblings = 1,
): PageItem[] {
  const totalNumbers = siblings * 2 + 5; // first, last, current, 2 ellipses

  if (totalPages <= totalNumbers) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const start = Math.max(2, currentPage - siblings);
  const end = Math.min(totalPages - 1, currentPage + siblings);

  const items: PageItem[] = [1];

  if (start > 2) items.push("ellipsis");

  for (let page = start; page <= end; page += 1) items.push(page);

  if (end < totalPages - 1) items.push("ellipsis");

  items.push(totalPages);

  return items;
}
