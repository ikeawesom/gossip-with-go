import type { JSX } from "react/jsx-dev-runtime";
import type { QueryPeek } from "../types/query";
import { DEFAULT_TOPICS } from "./constants";

export type HTMLProps<T extends keyof JSX.IntrinsicElements> =
  React.ComponentPropsWithoutRef<T>;

export function formatDate(timestamp: number, includeTime?: boolean): { date: boolean; time: string } {
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

  if (includeTime) {
    const tempDate = new Date();
    tempDate.setHours(tempDate.getHours() + 8); // adjust to SGT
    const now = tempDate.getTime();
    const diffMs = now - timestamp;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);

    if (diffSecs < 60) {
      return { date: false, time: `${diffSecs} SEC${diffSecs !== 1 ? 'S' : ''} AGO` };
    } else if (diffMins < 60) {
      return { date: false, time: `${diffMins} MIN${diffMins !== 1 ? 'S' : ''} AGO` };
    } else if (diffHours < 24) {
      return { date: false, time: `${diffHours} HOUR${diffHours !== 1 ? 'S' : ''} AGO` };
    }
  }

  return { date: true, time: `${day} ${month} ${year}` };
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

export function getTopicColor(topic_id: string) {
  return DEFAULT_TOPICS[topic_id]?.color || "";
}

export function truncateContent(s: string) {
  if (s.length > 330) {
    return s.substring(0, 228) + "..."
  }
  return s;
}