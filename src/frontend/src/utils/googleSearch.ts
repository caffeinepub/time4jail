export function openGoogleSearch(city: string, state: string, query: string): void {
  const searchTerms = [city, state, query].filter(Boolean).join(' ');
  const encodedQuery = encodeURIComponent(searchTerms);
  const googleUrl = `https://www.google.com/search?q=${encodedQuery}`;
  
  window.open(googleUrl, '_blank', 'noopener,noreferrer');
}
