import type { Incident } from '../backend';

export type MessageTone = 'calm' | 'firm' | 'severe' | 'very harsh';

export function generateMessage(tone: MessageTone, incidentReference?: string): string {
  const templates: Record<MessageTone, string> = {
    calm: `I am writing to formally request that you cease all contact with me immediately.

Your continued attempts to contact me are unwanted and unwelcome. I have documented all incidents and am prepared to take legal action if this behavior continues.

${incidentReference ? `Reference: ${incidentReference}\n\n` : ''}Please respect my request for no further contact.`,

    firm: `This is a formal cease and desist notice.

You are hereby directed to immediately stop all contact, communication, and surveillance of me. Your behavior constitutes harassment and stalking.

${incidentReference ? `I have documented this pattern of behavior, including: ${incidentReference}\n\n` : ''}I have documented all incidents and will pursue legal remedies including restraining orders and criminal charges if you do not comply immediately.

Do not contact me again.`,

    severe: `CEASE AND DESIST - FINAL WARNING

Your stalking and harassment must stop NOW.

${incidentReference ? `Your actions documented in ${incidentReference} and other incidents constitute criminal behavior.\n\n` : ''}I have compiled extensive evidence of your stalking behavior and have consulted with law enforcement. If you make any further attempt to contact, follow, or surveil me, I will immediately:

1. File for a restraining order
2. Press criminal charges for stalking and harassment
3. Pursue all available legal remedies

This is your final warning. Any further contact will result in immediate legal action.`,

    'very harsh': `FINAL NOTICE - LEGAL ACTION PENDING

Your stalking ends NOW.

${incidentReference ? `${incidentReference} is one of many documented incidents of your criminal behavior.\n\n` : ''}I have maintained detailed records of every incident, including dates, times, locations, and evidence. Law enforcement has been notified.

You have crossed every line. Your behavior is criminal, and I will not tolerate it any longer.

If you contact me, approach me, follow me, or surveil me in any way after receiving this message, I will:

• Immediately file criminal charges
• Obtain an emergency restraining order
• Provide all evidence to prosecutors
• Pursue maximum penalties under the law

I am done being your victim. Stay away from me permanently, or face the full consequences of your actions.

This is not a negotiation. This is a legal warning.`,
  };

  return templates[tone];
}
