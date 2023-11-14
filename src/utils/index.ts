import moment from 'moment';

export function removeDiacritics(string: string) {
  const from =
    'àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ';
  const to =
    'aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy';
  for (let i = 0, l = from.length; i < l; i += 1) {
    string = string.replace(RegExp(from[i] || '', 'gi'), to[i] || '');
  }

  string = string
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9- ]/g, '')
    .replace(/\s+/g, '-');

  return string;
}

export const sortWithIdOnTop = (object: Record<string, any>) => {
  const keys = Object.keys(object);
  keys.sort((a, b) => {
    if (a === 'id') {
      return -1;
    }
    if (b === 'id') {
      return 1;
    }
    return a.localeCompare(b);
  });
  const sortedObject: Record<string, any> = {};
  keys.forEach((key) => {
    sortedObject[key] = object[key];
  });
  return sortedObject;
};

export function convertStringToType(
  value: string
): number | string | Date | boolean {
  try {
    if (!value) return '';

    if (moment(value, 'YYYY-MM-DDTHH:mm:ss.SSSZ', true).isValid()) {
      return new Date(value);
    }

    if (moment(value, 'YYYY-MM-DD', true).isValid()) {
      return new Date(value);
    }

    if (!isNaN(parseInt(value, 10))) {
      return parseInt(value, 10);
    }
    if (value === 'true') {
      return true;
    }
    if (value === 'false') {
      return false;
    }
    if (JSON.parse(value)) {
      return JSON.parse(value);
    }
  } catch (err: unknown) {
    //
  }
  return value;
}
