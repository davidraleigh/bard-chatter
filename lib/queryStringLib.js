var qs = require('qs');
//var parse = re

function qsCleanValue(val) {
    if (typeof val == 'undefined' || val === null || val === '') {
        return null;
    } else if (val === 'false' || val === 'true') {
        return val === 'true';
    } else if (typeof val === 'string' && /^[-+]?(\d+|\d+\.\d*|\d*\.\d+)$/.test(val)) {
        return Number(val);
    } else if (Array.isArray(val)) {
        return qsCleanArray(val);
    } else if (typeof val === 'string') {
        return val;
    } else if (typeof val === 'object') {
        return qsCleanObject(val);
    } else {
        console.log('WHAT HAPPPPPPPPENED!!!!!')
        return val;
    }
}

function qsCleanObject(obj) {
    for (var key in obj) {
        console.log(key);
        obj[key] = qsCleanValue(obj[key]);
    }
    return obj;
}

function qsCleanArray(arr) {
    for (var i = 0; i < arr.length; i++) {
        arr[i] = qsCleanValue(arr[i]);
    }
    return arr;
}

var qs_parse = function(query_obj) {
    return qsCleanObject(qs.parse(query_obj));
};

module.exports.stringify = qs.stringify;
module.exports.parse = qs_parse;

