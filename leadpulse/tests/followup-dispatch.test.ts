import { describe, expect, it } from 'vitest';
import { shouldSkipFollowup } from '../lib/followup-dispatch';

describe('shouldSkipFollowup', () => {
  it('skips terminal lead statuses', () => {
    expect(shouldSkipFollowup('won')).toBe(true);
    expect(shouldSkipFollowup('lost')).toBe(true);
  });

  it('does not skip active lead statuses', () => {
    expect(shouldSkipFollowup('new')).toBe(false);
    expect(shouldSkipFollowup('contacted')).toBe(false);
  });
});
