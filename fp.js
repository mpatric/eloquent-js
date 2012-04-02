// Javascript fp

// each

function each(array, action) {
  for (var i = 0; i < array.length; i++) {
    action(array[i]);
  }
}

each(['one', 'two', 3, 4.0, 'five'], function(s) { console.log(s); });

// map

function map(array, action) {
  var result = []
  each(array, function(n) {
    result.push(action(n));
  });
  return result
}

map([1, 3, 5, 7, 9], function(n) { return n + 1; });

// reduce

function reduce(array, initial, action) {
  each(array, function(n) {
    initial = action(initial, n);
  });
  return initial;
}

reduce([2, 3, 4, 5, 6], 10, function(tot, n) { return tot + n; });

// range

function range(start, end) {
  var result = [];
  for (var i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
}

map(range(1, 10), function(n) { return n * n; });

// select

function select(array, test) {
  var result = [];
  each(array, function(n) {
    if (test(n)) {
      result.push(n);
    }
  });
  return result;
}

select(range(1, 10), function(n) { return n % 2 == 0; });

// reject

function reject(array, test) {
  var result = [];
  each(array, function(n) {
    if (!test(n)) {
      result.push(n);
    }
  });
  return result;
}

reject(range(1, 10), function(n) { return n % 2 == 0; });

// count

function count(array, test) {
  var total = 0;
  each(array, function(n) {
    if (test(n)) {
      total++;
    }
  });
  return total;
}

count([1, 0, 3, 5, 0, 1, 8, 0, 2, 0, 0], function(n) { return n == 0; });

// partials

function partial(func) {
  var knownArgs = arguments;
  return function() {
    var realArgs = [];
    for (var i = 1; i < knownArgs.length; i++) {
      realArgs.push(knownArgs[i]);
    }
    for (var i = 0; i < arguments.length; i++) {
      realArgs.push(arguments[i]);
    }
    return func.apply(null, realArgs);
  }
}

function multiply(a, b) {
  return a * b;
}

var double_number = partial(multiply, 2)

map([1, 3, 5, 7, 9], double_number)
