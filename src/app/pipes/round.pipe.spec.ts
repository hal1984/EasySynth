import { RoundPipe } from './round.pipe';

describe('RoundPipe', () => {
  it('create an instance', () => {
    const pipe = new RoundPipe();
    expect(pipe).toBeTruthy();
  });
  it('round 1.1111 to 1', () => {
    const pipe = new RoundPipe();
    expect(pipe.transform(1.1111)).toEqual(1);
  });
});
