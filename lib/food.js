const $ = require('jquery')
var host = require('./config').host

function Food(food) {
  // this.id = food.id;
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
    <tr class="food">
      <td>${food.name}</td>
      <td>${food.calories}</td>
      <td><img src='images/cancel-button.svg' class='delete-icon'></td>
    </tr>
  `
}

Food.addFood = function() {
  let foodName = $(".name-input").val();
  let foodCalorie = $(".calorie-input").val();
  let data = { food: { name: foodName, calories: foodCalorie } }

  $.post(`${host}/foods`, data)
  .done(function(data) {
    let food = new Food(data);
    $('.foods-list').append(food.toHTML(food));
    $(".name-input").val("");
    $(".calorie-input").val("");
  })
  .fail(function(error) {
    console.error(error);
  })
  event.preventDefault();
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
