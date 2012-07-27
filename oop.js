// Javascript oop

// properties

Object.prototype.properties = function() {
  var result = [];
  for (var property in this) {
    if (Object.prototype.hasOwnProperty.call(this, property) && Object.prototype.propertyIsEnumerable.call(this, property)) {
      result.push(property);
    }
  }
  return result;
}

// clone prototype

function clone(object) {
  function OneShotConstructor(){}
  OneShotConstructor.prototype = object;
  return new OneShotConstructor();
}

function Foo() {};
Foo.prototype.bar = function() { return "Foo bar indeed!" }
Foo.prototype.foo = function() { return "Foo foo? Really?" }
var foo = new Foo();
print(foo.bar());
print(foo.foo());

function ExtendedFoo() {};
ExtendedFoo.prototype = clone(Foo.prototype);
ExtendedFoo.prototype.foo = function() { return "Yeah, foo foo is ok now." }
var extendedFoo = new ExtendedFoo();
print(extendedFoo.bar());
print(extendedFoo.foo());

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
Dictionary.prototype.count = function() {
  var count = 0;
  this.each(function(key, value) {
    count++;
  });
  return count;
}
Dictionary.prototype.keys = function() {
  var keys = [];
  this.each(function(key, value) {
    keys.push(key);
  });
  return keys;
};

var numbers = new Dictionary({one: 1, three: 3, seven: 7});
numbers.contains('three');
numbers.contains('four');
numbers.set('four', 4);
numbers.contains('four');
numbers.each(function(key, value) { console.log(key + ' => ' + value) });
