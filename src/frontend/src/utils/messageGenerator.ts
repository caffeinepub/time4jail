import type { Incident } from '../backend';

export type MessageTone = 'calm' | 'firm' | 'severe' | 'very harsh';

export function generateMessage(tone: MessageTone, incidentReference?: string): string {
  const templates: Record<MessageTone, string> = {
    calm: `I am writing to formally request that you cease all contact with me immediately.

Your continued attempts to contact me are unwanted and unwelcome. I have documented all incidents and am prepared to take legal action if this behavior continues.

${incidentReference ? `Reference: ${incidentReference}\n\n` : ''}Please respect my request for no further contact.`,

    firm: `This is a formal cease and desist notice.

You are hereby directed to immediately stop all contact, communication, and surveillance of me. Your behavior constitutes harassment and stalking under the law.

${incidentReference ? `I have documented this pattern of behavior, including: ${incidentReference}\n\n` : ''}Every incident has been recorded with dates, times, and evidence. I am prepared to file for a restraining order and press criminal charges. Law enforcement will be notified of any further violations.

This is your only warning. Do not contact me again.`,

    severe: `CEASE AND DESIST - FINAL WARNING

Your stalking and harassment ends immediately.

${incidentReference ? `Your actions documented in ${incidentReference} and other incidents constitute criminal behavior under stalking and harassment statutes.\n\n` : ''}I have compiled extensive evidence of your stalking behavior and am working with law enforcement. You have violated my boundaries repeatedly and your actions are illegal.

If you make any further attempt to contact, follow, or surveil me, I will immediately:

1. File for an emergency restraining order
2. Press criminal charges for stalking and harassment
3. Provide all evidence to prosecutors
4. Pursue maximum penalties available under law

Your behavior is unacceptable and criminal. This is your final warning. Any further contact will result in immediate legal action and criminal prosecution.`,

    'very harsh': `FINAL NOTICE - CRIMINAL CHARGES PENDING

Your stalking ends NOW. There will be consequences.

${incidentReference ? `${incidentReference} is one of many documented incidents of your criminal stalking behavior.\n\n` : ''}I have maintained detailed records of every single incident you have perpetrated - dates, times, locations, witnesses, and physical evidence. Law enforcement has been notified and is reviewing your pattern of criminal behavior.

You have repeatedly violated my boundaries and my rights. Your actions are criminal stalking and harassment. I will not tolerate one more second of your behavior.

If you contact me, approach me, follow me, or surveil me in any way after receiving this message, I will:

• Immediately file criminal charges with the district attorney
• Obtain an emergency protective order
• Provide prosecutors with all evidence for maximum charges
• Testify in court to ensure you face the full legal consequences
• Pursue every available civil remedy for damages

I am documenting this warning. You are on notice that your criminal behavior has been reported and any further violation will result in your arrest and prosecution.

You will be held accountable. Stay away from me permanently, or you will face jail time.

This is not a request. This is a legal warning that you are committing crimes and will be prosecuted.`,
  };

  return templates[tone];
}
