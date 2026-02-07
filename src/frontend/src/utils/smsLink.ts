export function createSmsLink(message: string, phoneNumber?: string): string {
  const encodedMessage = encodeURIComponent(message);
  
  // iOS uses different format than Android
  // This format works on both
  const recipient = phoneNumber || '';
  
  // Check message length (SMS has limits)
  if (message.length > 1600) {
    console.warn('Message is very long and may be split into multiple SMS messages');
  }
  
  return `sms:${recipient}${recipient ? '?' : '?'}body=${encodedMessage}`;
}
