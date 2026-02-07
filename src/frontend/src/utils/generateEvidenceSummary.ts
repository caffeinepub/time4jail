import type { EvidenceFile } from '../backend';
import { formatTimestamp, formatDateShort } from './datetime';

export type EvidenceSummaryTone = 'plain' | 'formal' | 'urgent' | 'urgent-feminine';

function getEvidenceTypeLabel(type: EvidenceFile['evidenceType']): string {
  const kind = type.__kind__;
  switch (kind) {
    case 'photo':
      return 'Photo';
    case 'video':
      return 'Video';
    case 'audio':
      return 'Audio Recording';
    case 'screenshot':
      return 'Screenshot';
    case 'document':
      return 'Document';
    case 'other':
      return type.other || 'Other';
    default:
      return 'Unknown';
  }
}

function getHeaderByTone(tone: EvidenceSummaryTone): string {
  switch (tone) {
    case 'formal':
      return 'FORMAL EVIDENCE DOCUMENTATION REPORT';
    case 'urgent':
      return 'URGENT EVIDENCE SUMMARY REPORT';
    case 'urgent-feminine':
      return 'URGENT EVIDENCE SUMMARY REPORT';
    default:
      return 'EVIDENCE SUMMARY REPORT';
  }
}

function getOverviewByTone(
  tone: EvidenceSummaryTone,
  totalCount: number,
  firstDate: string,
  lastDate: string
): string {
  switch (tone) {
    case 'formal':
      return `This formal documentation comprises ${totalCount} evidence item${totalCount !== 1 ? 's' : ''} collected between ${firstDate} and ${lastDate}. Each entry has been catalogued with timestamp, classification, and descriptive metadata for official review.`;
    
    case 'urgent':
      return `This report documents ${totalCount} critical evidence item${totalCount !== 1 ? 's' : ''} spanning ${firstDate} to ${lastDate}. This evidence demonstrates a pattern of stalking and harassment behavior that requires immediate law enforcement intervention to ensure victim safety.`;
    
    case 'urgent-feminine':
      return `This report documents ${totalCount} critical evidence item${totalCount !== 1 ? 's' : ''} collected between ${firstDate} and ${lastDate}. The documented pattern of stalking and harassment behavior is deeply alarming and requires immediate attention from authorities to protect the victim from further harm and hold the perpetrator accountable.`;
    
    default:
      return `This summary includes ${totalCount} evidence item${totalCount !== 1 ? 's' : ''} collected between ${firstDate} and ${lastDate}.`;
  }
}

function getTimelineHeaderByTone(tone: EvidenceSummaryTone): string {
  switch (tone) {
    case 'formal':
      return 'CHRONOLOGICAL EVIDENCE LOG';
    case 'urgent':
    case 'urgent-feminine':
      return 'DOCUMENTED EVIDENCE TIMELINE';
    default:
      return 'EVIDENCE TIMELINE';
  }
}

function getClosingByTone(tone: EvidenceSummaryTone): string {
  switch (tone) {
    case 'formal':
      return 'This concludes the formal evidence documentation. All entries are available for official review and legal proceedings.';
    
    case 'urgent':
      return 'This evidence log demonstrates a documented pattern of stalking and harassment requiring immediate law enforcement intervention. Authorities should review this documentation promptly to assess risk, ensure victim safety, and pursue appropriate criminal charges against the perpetrator.';
    
    case 'urgent-feminine':
      return 'The evidence documented here shows a persistent pattern of stalking and harassment behavior that has caused ongoing fear and violation of her safety and well-being. This situation demands immediate attention from law enforcement to ensure her protection and hold the perpetrator accountable under the law. Every entry represents a documented incident that she has courageously recorded. Please act swiftly to investigate and prosecute.';
    
    default:
      return '';
  }
}

export function generateEvidenceSummary(
  evidence: EvidenceFile[],
  tone: EvidenceSummaryTone = 'plain'
): string {
  if (evidence.length === 0) {
    return 'No evidence to summarize.';
  }

  const sorted = [...evidence].sort((a, b) => Number(a.timestamp - b.timestamp));
  
  const firstDate = formatDateShort(sorted[0].timestamp);
  const lastDate = formatDateShort(sorted[sorted.length - 1].timestamp);
  const totalCount = evidence.length;

  let summary = `${getHeaderByTone(tone)}\n`;
  summary += `Generated: ${new Date().toLocaleString('en-US')}\n`;
  summary += `\n`;
  summary += `OVERVIEW\n`;
  summary += `========\n`;
  summary += `Total Evidence Items: ${totalCount}\n`;
  summary += `Date Range: ${firstDate} to ${lastDate}\n`;
  summary += `\n`;
  summary += `${getOverviewByTone(tone, totalCount, firstDate, lastDate)}\n`;
  summary += `\n`;
  summary += `${getTimelineHeaderByTone(tone)}\n`;
  summary += `${'='.repeat(getTimelineHeaderByTone(tone).length)}\n\n`;

  sorted.forEach((item, index) => {
    summary += `${index + 1}. ${formatTimestamp(item.timestamp)}\n`;
    summary += `   Type: ${getEvidenceTypeLabel(item.evidenceType)}\n`;
    summary += `   Title: ${item.title}\n`;
    
    if (item.description && item.description.trim()) {
      const desc = item.description.substring(0, 300);
      summary += `   Description: ${desc}${item.description.length > 300 ? '...' : ''}\n`;
    } else {
      summary += `   Description: (No description provided)\n`;
    }
    
    summary += `\n`;
  });

  const closingText = getClosingByTone(tone);
  if (closingText) {
    summary += `SUMMARY\n`;
    summary += `=======\n`;
    summary += `${closingText}\n`;
    summary += `\n`;
  }

  summary += `END OF REPORT\n`;

  return summary;
}
