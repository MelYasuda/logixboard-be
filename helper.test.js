const helper = require('./helper')

test('detect added and removed elemens in two arrays', () =>{
  expect(helper.diffData(["SEA", "BOG", "FMT"], ["SEA", "NAM"])
  ).toStrictEqual({added: ["NAM"], deleted: ["BOG", "FMT"]})
})

test('convert ounces to grams', () => {
  expect(helper.convertToGrams(1, 'OUNCES')).toBe(28.35)
})

test('convert pounds to grams', () => {
  expect(helper.convertToGrams(1, 'POUNDS')).toBe(453.592)
})

test('convert kilograms to grams', () => {
  expect(helper.convertToGrams(1, 'KILOGRAMS')).toBe(1000)
})

test('convert grams to kilograms', () => {
  expect(helper.convertGramsToDesiredUnit(1, 'kilograms')).toBe(0.001)
})

test('convert grams to ounces', () => {
  expect(helper.convertGramsToDesiredUnit(1, 'ounces')).toBe(0.035)
})

test('convert grams to pounds', () => {
  expect(helper.convertGramsToDesiredUnit(1, 'pounds')).toBe(0.002)
})