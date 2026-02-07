import type { Incident } from '../backend';
import { formatTimestamp } from './datetime';

export function formatIncidentReference(incident: Incident): string {
  return `Incident Report ${incident.criminalActivityReportNumber} - ${incident.title} (${formatTimestamp(incident.timestamp)})`;
}
