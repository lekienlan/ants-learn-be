"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortWithIdOnTop = exports.removeDiacritics = void 0;
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
//# sourceMappingURL=index.js.map