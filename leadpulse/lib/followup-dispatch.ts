export function shouldSkipFollowup(status: string) {
  return status === 'won' || status === 'lost';
}
