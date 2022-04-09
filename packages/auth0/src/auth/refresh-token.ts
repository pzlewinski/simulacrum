import { epochTime } from './date';
import type { RefreshToken } from '../types';

export function issueRefreshToken(scope: string): boolean {
  return scope.includes('offline_access');
}

export function createRefreshToken({ exp, rotations = 0, scope }: Omit<RefreshToken['payload'], 'iat'>): RefreshToken['payload'] {
  return {
    exp,
    iat: epochTime(),
    rotations,
    scope,
  };
}
