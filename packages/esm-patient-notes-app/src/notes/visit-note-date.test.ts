import { describe, expect, it } from 'vitest';
import { shouldOmitEncounterDatetime } from './visit-note-date';

describe('shouldOmitEncounterDatetime', () => {
  const now = new Date('2026-10-24T18:00:00.000Z');

  it.each([
    ['two hours earlier', '2026-10-24T16:00:00.000Z'],
    ['a previous day', '2026-10-23T18:00:00.000Z'],
    ['a historical encounter', '2024-03-20T10:00:00.000Z'],
    ['more than 30 minutes earlier', '2026-10-24T17:29:59.999Z'],
    ['more than 30 minutes later', '2026-10-24T18:30:00.001Z'],
  ])('preserves %s for a new retrospective note', (_description, date) => {
    expect(shouldOmitEncounterDatetime(new Date(date), now, false, true)).toBe(false);
  });

  it.each([
    ['the present time', '2026-10-24T18:00:00.000Z'],
    ['a date just inside the past boundary', '2026-10-24T17:30:00.001Z'],
    ['exactly 30 minutes earlier', '2026-10-24T17:30:00.000Z'],
    ['exactly 30 minutes later', '2026-10-24T18:30:00.000Z'],
  ])('lets the server supply the timestamp for %s', (_description, date) => {
    expect(shouldOmitEncounterDatetime(new Date(date), now, false, true)).toBe(true);
  });

  it('leaves the stored timestamp untouched when editing an older encounter', () => {
    expect(shouldOmitEncounterDatetime(new Date('2024-03-20T10:00:00.000Z'), now, true, true)).toBe(true);
  });

  it('keeps the existing server-timestamp behavior when RDE is disabled', () => {
    expect(shouldOmitEncounterDatetime(new Date('2024-03-20T10:00:00.000Z'), now, false, false)).toBe(true);
  });
});
