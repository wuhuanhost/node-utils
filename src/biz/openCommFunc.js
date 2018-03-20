exports.getData = function(a, b, c, cb) {
    setTimeout(function() {
        // console.log(a);
        // console.log(b);
        // console.log(cb);
        cb(null, parseInt(a) + parseInt(b) + parseInt(c));
    }, 1000);
}

exports.abx = function(a, b, cb) {
    setTimeout(function() {
        // console.log(a);
        // console.log(b);
        // console.log(cb);
        cb(null, parseInt(a) - parseInt(b));
    }, 1000);
}


var obj={
    a:123,
    b:456
}
exports.abxs = function(a, b, cb) {
    setTimeout(function() {
        // console.log(a);
        // console.log(b);
        // console.log(cb);
        cb(null, obj);
    }, 1000);
}

exports.abxsdasdsad = function(a, b, cb) {
    setTimeout(function() {
        // console.log(a);
        // console.log(b);
        // console.log(cb);
        cb(null, parseInt(a)+parseInt(b)-100);
    }, 1000);
}
