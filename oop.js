// Javascript oop

// properties

Object.prototype.properties = function() {
  var result = [];
  for (var property in this) {
    if (Object.prototype.hasOwnProperty.call(this, property)) {
      result.push(property);
    }
  }
  return result;
}

// Dictionary class

function Dictionary(initialValues) {
  this.values = initialValues || {};
}
Dictionary.prototype.set = function(key, value) {
  this.values[key] = value;
}
Dictionary.prototype.get = function(key) {
  return this.values[key];
}
Dictionary.prototype.contains = function(key) {
  return Object.prototype.propertyIsEnumerable.call(this.values, key);
}
Dictionary.prototype.each = function(action) {
  var props = this.values.properties();
  for (var i = 0; i < props.length; i++) {
    action(props[i], this.values[props[i]]);
  }
}

var numbers = new Dictionary({one: 1, three: 3, seven: 7});
numbers.contains('three');
numbers.contains('four');
numbers.set('four', 4);
numbers.contains('four');
numbers.each(function(key, value) { console.log(key + ' => ' + value) });
