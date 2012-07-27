// Point

function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.add = function(otherPoint) {
  return new Point(this.x + otherPoint.x, this.y + otherPoint.y);
}

Point.prototype.isEqualTo = function(otherPoint) {
  return (this.x == otherPoint.x && this.y == otherPoint.y);
}

Point.prototype.toString = function() {
  return "(" + this.x + "," + this.y + ")";
}

// Grid

function Grid(width, height) {
  this.width = width;
  this.height = height;
  this.cells = new Array(this.width * this.height);
}

Grid.prototype.valueAt = function(point) {
  if (this.isInside(point)) {
    return this.cells[point.x + (point.y * this.width)];
  }
}

Grid.prototype.setValueAt = function(point, value) {
  if (this.isInside(point)) {
    this.cells[point.x + (point.y * this.width)] = value;
  }
}

Grid.prototype.isInside = function(point) {
  return (point.x >= 0 && point.x < this.width && point.y >= 0 && point.y < this.height);
}

Grid.prototype.moveValue = function(fromPoint, toPoint) {
  this.setValueAt(toPoint, this.valueAt(fromPoint));
  this.setValueAt(fromPoint, undefined);
}

Grid.prototype.each = function(action) {
  for (var y = 0; y < this.height; y++) {
    for (var x = 0; x < this.width; x ++) {
      var point = new Point(x, y);
      action(point, this.valueAt(point));
    }
  }
}

// Directions

var directions = new Dictionary(
  {"n":  new Point( 0, -1),
   "ne": new Point( 1, -1),
   "e":  new Point( 1,  0),
   "se": new Point( 1,  1),
   "s":  new Point( 0,  1),
   "sw": new Point(-1,  1),
   "w":  new Point(-1,  0),
   "nw": new Point(-1, -1)});

// Creatures

var creatureTypes = new Dictionary();

creatureTypes.register = function(constructor) {
  this.set(constructor.prototype.character, constructor);
};

// Stupid bug - always moves south

function StupidBug() {};

StupidBug.prototype.act = function(surroundings) {
  return {type: "move", direction: "s"};
};

StupidBug.prototype.character = 'o';

creatureTypes.register(StupidBug)

// Bouncing bug - bounce ne to sw whenever it hits a wall

function BouncingBug() {
  this.direction = "ne";
};

BouncingBug.prototype.act = function(surroundings) {
  if (surroundings[this.direction] != ' ') {
    this.direction = (this.direction == 'ne' ? 'sw' : 'ne')
  }
  return {type: "move", direction: this.direction};
};

BouncingBug.prototype.character = '%';

creatureTypes.register(BouncingBug)

// Drunk bug - tries to move in a random direction every turn, never mind whether there is a wall there

function DrunkBug() {};

DrunkBug.prototype.act = function(surroundings) {
  var index = Math.floor(Math.random() * directions.keys().length);
  return {type: "move", direction: directions.keys()[index]};
}

DrunkBug.prototype.character = '~'

creatureTypes.register(DrunkBug)

// Terrarium

var wall = {};
wall.character = '#'
var space = {};
space.character = ' '

function Terrarium(plan) {
  var grid = new Grid(plan[0].length, plan.length);
  for (var y = 0; y < grid.height; y++) {
    for (var x = 0; x < grid.width; x++) {
      grid.setValueAt(new Point(x, y), elementFromCharacter(plan[y].charAt(x)));
    }
  }
  this.grid = grid;
}

Terrarium.prototype.toString = function() {
  var characters = [];
  var eol = this.grid.width - 1;
  this.grid.each(function(point, value) {
    characters.push(characterFromElement(value));
    if (point.x == eol) characters.push("\n");
  });
  return characters.join('');
}

function elementFromCharacter(character) {
  if (character == wall.character)
    return wall;
  else if (character == space.character)
    return undefined;
  else if (creatureTypes.contains(character))
    return new (creatureTypes.get(character))();
  else
    throw new Error("Unknown character: " + character);
}

function characterFromElement(element) {
  if (element == undefined)
    return ' ';
  else
    return element.character;
}

Terrarium.prototype.listActingCreatures = function() {
  var found = [];
  this.grid.each(function(point, value) {
    if (value != undefined && value.act)
      found.push({object: value, point: point});
  });
  return found;
};

Terrarium.prototype.listSurroundings = function(center) {
  var result = {};
  var grid = this.grid;
  directions.each(function(name, direction) {
    var place = center.add(direction);
    if (grid.isInside(place)) {
      result[name] = characterFromElement(grid.valueAt(place));
    } else {
      result[name] = wall.character;
    }
  });
  return result;
};

Terrarium.prototype.processCreature = function(creature) {
  var surroundings = this.listSurroundings(creature.point);
  var action = creature.object.act(surroundings);
  if (action.type == "move" && directions.contains(action.direction)) {
    var to = creature.point.add(directions.get(action.direction));
    if (this.grid.isInside(to) && this.grid.valueAt(to) == undefined) {
      this.grid.moveValue(creature.point, to);
    }
  } else {
    throw new Error("Unsupported action: " + action.type);
  }
};

Terrarium.prototype.step = function() {
  forEach(this.listActingCreatures(), bind(this.processCreature, this));
  if (this.onStep) {
    this.onStep();
  }
};

Terrarium.prototype.start = function() {
  if (!this.running) {
    this.running = setInterval(bind(this.step, this), 500);
  }
};

Terrarium.prototype.stop = function() {
  if (this.running) {
    clearInterval(this.running);
    this.running = null;
  }
};

// Test 1

var thePlan =
  ["############################",
   "#      #    #      o      ##",
   "#                          #",
   "#          #####           #",
   "##         #   #    ##     #",
   "###           ##     #     #",
   "#           ###      #     #",
   "#   ####                   #",
   "#   ##       o             #",
   "# o  #         o       ### #",
   "#    #                     #",
   "############################"];

terrarium = new Terrarium(thePlan);
print(terrarium.toString());

print(terrarium);
terrarium.step();
print(terrarium);

// Test 2

var newPlan =
  ["############################",
   "#                      #####",
   "#    ##                 ####",
   "#   ####     ~ ~          ##",
   "#    ##       ~            #",
   "#                          #",
   "#                ###       #",
   "#               #####      #",
   "#                ###       #",
   "# %        ###        %    #",
   "#        #######           #",
   "############################"];

var terrarium = new Terrarium(newPlan);
terrarium.onStep = partial(inPlacePrinter(), terrarium);
terrarium.start();

// note inPlacePrinter does not work on Chrome :/