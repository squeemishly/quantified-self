const $ = require('jquery')
var host = require('./config').host

class Food {
  constructor(food) {
    this.name = food.name;
    this.calories = food.calories;
  }

  toHTML(food) {
    return `
      <tr class="food">
        <td class="food-data-name">${food.name}</td>
        <td class="food-data-calorie">${food.calories}</td>
        <td class="food-data-delete"><img src='images/cancel-button.svg' class='delete-icon'></td>
      </tr>
    `
  }
}

Food.allEntriesToHTML = function() {
  return this.getAllFood()
  .then(function(foods) {
    return foods.reverse().map(function(food) {
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

Food.addFood = function() {
  let foodName = $(".name-input").val();
  let foodCalorie = $(".calorie-input").val();
  let data = { food: { name: foodName, calories: foodCalorie } }

  $.post(`${host}/foods`, data)
  .then(function() {
    $(".name-input").val("");
    $(".calorie-input").val("");
    $('.food').remove()
    Food.allEntriesToHTML()
  })
  .fail(function(error) {
    console.error(error);
  })
  event.preventDefault();
}

module.exports = Food;
