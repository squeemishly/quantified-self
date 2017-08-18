const $ = require('jquery')
var host = require('./config').host

function Food(food) {
  this.id = food.id;
  this.name = food.name;
  this.calories = food.calories;
}

Food.allEntriesToHTML = function() {
  return this.getAllFood()
  .then(function(foods) {
    return foods.map(function(food) {
      return new Food(food);
    })
  })
  .then(function(foods) {
    return foods.map(function(food) {
      $('.foods-list').append(food.toHTML(food));
    })
  })
}

Food.getAllFood = function(){
  return $.getJSON(`${host}/foods`)
}

Food.prototype.toHTML = function(food) {
  return `
    <tr>
      <td>${food.name}</td>
      <td>${food.calories}</td>
      <td><img src='images/cancel-button.svg' class='delete-icon'></td>
    </tr>
  `
}

// class Food {
//   constructor(food) {
//     this.id = food.id;
//     this.name = food.name;
//     this.calories = food.calories;
//   }
//
//   allEntriesToHTML() {
//     debugger;
//     let foods = getAllFood()
//   }
//
//   getAllFood() {
//     return $.getJSON(`${host}/foods`)
//   }
// }

module.exports = Food;
