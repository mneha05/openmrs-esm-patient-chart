/**
 * Omit the encounter timestamp only when the server should supply it.
 *
 * Edits retain their existing encounter date, and a note created without
 * retrospective data entry uses the server's current time. When RDE is
 * enabled, preserve dates more than 30 minutes away from now in either
 * direction rather than treating every past date as "recent".
 */
export function shouldOmitEncounterDatetime(
  noteDate: Date,
  now: Date,
  isEditing: boolean,
  isRetrospectiveDataEntryEnabled: boolean,
): boolean {
  if (isEditing || !isRetrospectiveDataEntryEnabled) {
    return true;
  }

  const thirtyMinutesInMilliseconds = 30 * 60 * 1000;
  return Math.abs(noteDate.getTime() - now.getTime()) <= thirtyMinutesInMilliseconds;
}
