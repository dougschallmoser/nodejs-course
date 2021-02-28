const { calculateTip, fahrenheitToCelsius, celsiusToFahrenheit, add } = require('../src/math');

test('Should calculate total with tip', () => {
  const total = calculateTip(10, 0.3);
  expect(total).toBe(13);
})

test('Should calculate total with default tip', () => {
  const total = calculateTip(10);
  expect(total).toBe(12);
})

test('Should convert 32 F to 0 C', () => {
  const result = fahrenheitToCelsius(32);
  expect(result).toBe(0);
})

test('Should convert 0 C to 32 F', () => {
  const result = celsiusToFahrenheit(0);
  expect(result).toBe(32);
})

// async testing
test('Should add two numbers async/await', async () => {
  const sum = await add(10, 11)
  expect(sum).toBe(21)
})