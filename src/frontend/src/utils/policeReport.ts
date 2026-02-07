import type { Incident, EvidenceFile, PoliceDepartment } from '../backend';
import { generateIncidentSummary } from './incidentSummary';
import { generateEvidenceSummary, EvidenceSummaryTone } from './generateEvidenceSummary';

export function generatePoliceReport(
  incidents: Incident[],
  evidence: EvidenceFile[],
  evidenceTone: EvidenceSummaryTone,
  selectedDepartment?: PoliceDepartment
): string {
  let report = '';

  // Header with department info if selected
  if (selectedDepartment) {
    report += `POLICE REPORT SUBMISSION\n`;
    report += `========================\n\n`;
    report += `TO: ${selectedDepartment.name}\n`;
    
    if (selectedDepartment.address) {
      report += `Address: ${selectedDepartment.address}\n`;
    }
    if (selectedDepartment.phone) {
      report += `Phone: ${selectedDepartment.phone}\n`;
    }
    if (selectedDepartment.website) {
      report += `Website: ${selectedDepartment.website}\n`;
    }
    
    report += `\n`;
    report += `Report Generated: ${new Date().toLocaleString('en-US')}\n`;
    report += `\n`;
    report += `${'='.repeat(60)}\n\n`;
  }

  // Incident Summary Section
  report += generateIncidentSummary(incidents);
  report += `\n${'='.repeat(60)}\n\n`;

  // Evidence Summary Section
  report += generateEvidenceSummary(evidence, evidenceTone);

  return report;
}
