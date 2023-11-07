"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertStringToType = exports.sortWithIdOnTop = exports.removeDiacritics = void 0;
var moment_1 = __importDefault(require("moment"));
function removeDiacritics(string) {
    var from = 'àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ';
    var to = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy';
    for (var i = 0, l = from.length; i < l; i += 1) {
        string = string.replace(RegExp(from[i] || '', 'gi'), to[i] || '');
    }
    string = string
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-');
    return string;
}
exports.removeDiacritics = removeDiacritics;
var sortWithIdOnTop = function (object) {
    var keys = Object.keys(object);
    keys.sort(function (a, b) {
        if (a === 'id') {
            return -1;
        }
        if (b === 'id') {
            return 1;
        }
        return a.localeCompare(b);
    });
    var sortedObject = {};
    keys.forEach(function (key) {
        sortedObject[key] = object[key];
    });
    return sortedObject;
};
exports.sortWithIdOnTop = sortWithIdOnTop;
function convertStringToType(value) {
    if (!value)
        return '';
    if ((0, moment_1.default)(value, 'YYYY-MM-DD', true).isValid()) {
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
    return value;
}
exports.convertStringToType = convertStringToType;
//# sourceMappingURL=index.js.map