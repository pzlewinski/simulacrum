export function issueRefreshToken(scope: string): boolean {
  return scope.includes('offline_access');
}
