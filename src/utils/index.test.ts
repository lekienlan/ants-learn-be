import moment from 'moment';
import {
  convertStringToType,
  isToday,
  removeDiacritics,
  sortWithIdOnTop
} from 'utils';

describe('removeDiacritics', () => {
  it('should remove diacritics from a string', () => {
    const inputString1 = 'Thérè àrè sômè diacritics hére.';
    const inputString2 = 'an toàn giao thông';
    const inputString3 = 'lê@@$$kiến#@$@%lân';
    const expectedOutput1 = 'there-are-some-diacritics-here';
    const expectedOutput2 = 'an-toan-giao-thong';
    const expectedOutput3 = 'lekienlan';

    expect(removeDiacritics(inputString1)).toEqual(expectedOutput1);
    expect(removeDiacritics(inputString2)).toEqual(expectedOutput2);
    expect(removeDiacritics(inputString3)).toEqual(expectedOutput3);
  });
});

describe('convertStringToType', () => {
  it('should return empty string for falsy values', () => {
    expect(convertStringToType('')).toEqual('');
  });
  it('should convert valid date strings to Date objects', () => {
    const dateString = '2023-11-14';
    const dateObject = new Date(dateString);

    expect(convertStringToType(dateString)).toEqual(dateObject);
  });

  it('should convert numeric strings to numbers', () => {
    const numericString = '123';

    expect(convertStringToType(numericString)).toBe(123);
  });

  it('should convert "true" string to boolean true', () => {
    const trueString = 'true';

    expect(convertStringToType(trueString)).toBe(true);
  });

  it('should convert "false" string to boolean false', () => {
    const falseString = 'false';

    expect(convertStringToType(falseString)).toBe(false);
  });

  it('should parse valid JSON strings to objects', () => {
    const jsonString = '{"key": "value"}';
    const jsonObject = { key: 'value' };

    expect(convertStringToType(jsonString)).toEqual(jsonObject);
  });

  it('should return the input string for unsupported types', () => {
    const unsupportedString = 'unsupported';

    expect(convertStringToType(unsupportedString)).toBe(unsupportedString);
  });
});

describe('sortWithIdOnTop', () => {
  it('should sort object keys with "id" on top', () => {
    const inputObject = {
      name: 'John',
      age: 30,
      id: 'abc123',
      city: 'New York'
    };

    const sortedObject = sortWithIdOnTop(inputObject);

    // Ensure "id" is on top
    expect(Object.keys(sortedObject)[0]).toBe('id');

    // Ensure other keys are sorted alphabetically
    const expectedKeys = ['id', 'age', 'city', 'name'];
    expect(Object.keys(sortedObject)).toEqual(expectedKeys);

    // Ensure values remain the same
    expect(sortedObject).toEqual(inputObject);
  });

  it('should handle an object with only "id"', () => {
    const inputObject = { id: 'abc123' };

    const sortedObject = sortWithIdOnTop(inputObject);

    // Ensure "id" is the only key
    expect(Object.keys(sortedObject)).toEqual(['id']);

    // Ensure values remain the same
    expect(sortedObject).toEqual(inputObject);
  });

  it('should handle an empty object', () => {
    const inputObject = {};

    const sortedObject = sortWithIdOnTop(inputObject);

    // Ensure the result is an empty object
    expect(sortedObject).toEqual({});
  });
});

describe('isToday function', () => {
  it("should return true for today's date", () => {
    const todayString = moment().format('YYYY-MM-DD');
    expect(isToday(todayString)).toBeTruthy();
  });

  it("should return false for yesterday's date", () => {
    const yesterdayString = moment().subtract(1, 'days').format('YYYY-MM-DD');
    expect(isToday(yesterdayString)).toBeFalsy();
  });

  it("should return false for tomorrow's date", () => {
    const tomorrowString = moment().add(1, 'days').format('YYYY-MM-DD');
    expect(isToday(tomorrowString)).toBeFalsy();
  });
});
