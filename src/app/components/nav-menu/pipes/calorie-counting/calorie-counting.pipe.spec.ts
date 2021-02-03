import { CalorieCountingPipe } from './calorie-counting.pipe';

describe('CalorieCountingPipe', () => {
  it('create an instance', () => {
    const pipe = new CalorieCountingPipe();
    expect(pipe).toBeTruthy();
  });
});
