const $ = require('jquery')
var host = require('./config').host

class Food {
  constructor() {
    this.id = food.id;
    this.name = food.name;
    this.calories = food.calories;
  }

  allEntriesToHTML(){
    let foods = getAllFood()
    debugger;
  }

  getAllFood() {
    return $.getJSON(`${host}/foods`)
  }
}

module.exports = Food;
