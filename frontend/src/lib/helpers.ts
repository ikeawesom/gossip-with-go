import type { JSX } from "react/jsx-dev-runtime";
import type { QueryPeek } from "../types/query";

export type HTMLProps<T extends keyof JSX.IntrinsicElements> =
  React.ComponentPropsWithoutRef<T>;

export function formatDate(timestamp: number): string {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const date = new Date(timestamp);
  const day = date.getDate().toString().padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

export function searchQueryPeeks(
  peeks: QueryPeek[],
  searchTerm: string
): QueryPeek[] {
  if (!searchTerm.trim()) {
    return peeks;
  }

  const term = searchTerm.toLowerCase().trim();
  const words = term.split(/\s+/);

  // score each result based on relevance
  const scored = peeks.map((peek) => {
    let score = 0;
    const titleLower = peek.title.toLowerCase();
    const descLower = peek.desc.toLowerCase();

    // exact phrase match (highest priority)
    if (titleLower.includes(term)) score += 100;
    if (descLower.includes(term)) score += 50;

    // individual word matches
    words.forEach((word) => {
      // title matches are more important
      if (titleLower.includes(word)) score += 20;
      if (descLower.includes(word)) score += 10;

      // bonus for word at start of title
      if (titleLower.startsWith(word)) score += 15;
    });

    return { peek, score };
  });

  // filter and sort by score (desc), then by likes (desc)
  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.peek.likes - a.peek.likes;
    })
    .map((item) => item.peek);
}

export function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@');

  if (!localPart || !domain) {
    return email;
  }

  const firstChar = localPart[0];
  const lastChar = localPart[localPart.length - 1];
  const middleLength = localPart.length - 2;
  const maskedLocal = middleLength > 0
    ? `${firstChar}${'*'.repeat(middleLength)}${lastChar}`
    : localPart;

  const domainParts = domain.split('.');
  const maskedDomainParts = domainParts.map(part => '*'.repeat(part.length));
  const maskedDomain = maskedDomainParts.join('.');

  return `${maskedLocal}@${maskedDomain}`;
}