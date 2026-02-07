import type { Incident } from '../backend';
import { formatTimestamp, formatDateShort } from './datetime';

export function generateIncidentSummary(incidents: Incident[]): string {
  if (incidents.length === 0) {
    return 'No incidents to summarize.';
  }

  const sorted = [...incidents].sort((a, b) => Number(a.timestamp - b.timestamp));
  
  const firstDate = formatDateShort(sorted[0].timestamp);
  const lastDate = formatDateShort(sorted[sorted.length - 1].timestamp);
  const totalCount = incidents.length;
  const totalEvidence = incidents.reduce((sum, inc) => sum + inc.evidenceIds.length, 0);

  let summary = `INCIDENT SUMMARY REPORT\n`;
  summary += `Generated: ${new Date().toLocaleString('en-US')}\n`;
  summary += `\n`;
  summary += `OVERVIEW\n`;
  summary += `========\n`;
  summary += `Total Incidents: ${totalCount}\n`;
  summary += `Date Range: ${firstDate} to ${lastDate}\n`;
  summary += `Total Evidence Files: ${totalEvidence}\n`;
  summary += `\n`;
  summary += `INCIDENT TIMELINE\n`;
  summary += `=================\n\n`;

  sorted.forEach((incident, index) => {
    const statusValue = incident.status as string;
    summary += `${index + 1}. ${formatTimestamp(incident.timestamp)}\n`;
    summary += `   Report #: ${incident.criminalActivityReportNumber}\n`;
    summary += `   Title: ${incident.title}\n`;
    summary += `   Status: ${statusValue}\n`;
    if (incident.evidenceIds.length > 0) {
      summary += `   Evidence: ${incident.evidenceIds.length} file(s)\n`;
    }
    summary += `   Description: ${incident.description.substring(0, 200)}${incident.description.length > 200 ? '...' : ''}\n`;
    summary += `\n`;
  });

  // Pattern analysis
  const titleWords = incidents.map(i => i.title.toLowerCase());
  const wordCounts: Record<string, number> = {};
  titleWords.forEach(title => {
    title.split(/\s+/).forEach(word => {
      if (word.length > 3) {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      }
    });
  });

  const repeatedWords = Object.entries(wordCounts)
    .filter(([_, count]) => count > 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (repeatedWords.length > 0) {
    summary += `PATTERN ANALYSIS\n`;
    summary += `================\n`;
    summary += `Recurring keywords:\n`;
    repeatedWords.forEach(([word, count]) => {
      summary += `  - "${word}" appears ${count} times\n`;
    });
    summary += `\n`;
  }

  summary += `END OF REPORT\n`;

  return summary;
}
