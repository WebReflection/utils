import custom from '../src/class.js';

class Strong extends custom(String) {
  constructor(value) {
    super(new String(value));
  }
}

const strong = new Strong('hello');
console.assert(strong instanceof String);
console.assert(strong instanceof Strong);
console.assert(String(strong) === 'hello');
