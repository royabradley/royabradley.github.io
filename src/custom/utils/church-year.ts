// rab: The season of the church year on a given day, for the footer line
// ("From a small study in East Texas, in Advent.").
//
// Western reckoning, with Anglican names:
//   Advent          first Sunday of Advent (the Sunday from 27 Nov to 3 Dec) to 24 Dec
//   Christmastide   25 Dec to 5 Jan
//   Epiphanytide    6 Jan to the day before Ash Wednesday
//   Lent            Ash Wednesday to the day before Palm Sunday
//   Holy Week       Palm Sunday to Holy Saturday
//   Eastertide      Easter Day to the day before Pentecost
//   Pentecost       the Day of Pentecost
//   Trinitytide     the day after Pentecost to the day before Advent
// To use other names ("Ordinary Time", "the Season after Pentecost"), change PHRASES.
//
// The site is static, so the footer shows the season on the day the site was built. A daily
// scheduled build in .github/workflows/deploy.yml keeps it current.

export type Season =
  | 'advent'
  | 'christmastide'
  | 'epiphanytide'
  | 'lent'
  | 'holy-week'
  | 'eastertide'
  | 'pentecost'
  | 'trinitytide';

export const PHRASES: Record<Season, string> = {
  advent: 'in Advent',
  christmastide: 'in Christmastide',
  epiphanytide: 'in Epiphanytide',
  lent: 'in Lent',
  'holy-week': 'in Holy Week',
  eastertide: 'in Eastertide',
  pentecost: 'on the Day of Pentecost',
  trinitytide: 'in Trinitytide',
};

const DAY = 86_400_000;
const utc = (y: number, m: number, d: number) => Date.UTC(y, m - 1, d);

/** Easter Day in the Gregorian calendar (the anonymous Meeus/Jones/Butcher algorithm). */
export function easter(year: number): number {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return utc(year, month, day);
}

/** The first Sunday of Advent: the Sunday from 27 November to 3 December. */
export function adventSunday(year: number): number {
  const nov27 = utc(year, 11, 27);
  return nov27 + ((7 - new Date(nov27).getUTCDay()) % 7) * DAY;
}

/** Today's date where the site is written, as midnight UTC on that calendar day. */
export function today(timeZone = 'America/Chicago'): number {
  const [y, m, d] = new Date().toLocaleDateString('en-CA', { timeZone }).split('-').map(Number);
  return utc(y, m, d);
}

/** The season on a calendar day (midnight UTC, as from today()). */
export function season(date: number = today()): Season {
  const year = new Date(date).getUTCFullYear();
  const easterDay = easter(year);
  const pentecost = easterDay + 49 * DAY;
  if (date >= adventSunday(year) && date < utc(year, 12, 25)) return 'advent';
  if (date >= utc(year, 12, 25) || date < utc(year, 1, 6)) return 'christmastide';
  if (date < easterDay - 46 * DAY) return 'epiphanytide';
  if (date < easterDay - 7 * DAY) return 'lent';
  if (date < easterDay) return 'holy-week';
  if (date < pentecost) return 'eastertide';
  if (date === pentecost) return 'pentecost';
  return 'trinitytide';
}
