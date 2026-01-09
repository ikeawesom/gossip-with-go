import type { JSX } from "react/jsx-dev-runtime";

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
      return { date: false, time: `${diffSecs} sec${diffSecs !== 1 ? 's' : ''} ago` };
    } else if (diffMins < 60) {
      return { date: false, time: `${diffMins} min${diffMins !== 1 ? 's' : ''} ago` };
    } else if (diffHours < 24) {
      return { date: false, time: `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago` };
    }
  }

  return { date: true, time: `${day} ${month} ${year}` };
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

export function trimString(s: string, n: number) {
  if (s.length > n) {
    return s.substring(0, n - 3) + "...";
  }
  return s;
}