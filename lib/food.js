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

  static allEntriesToHTML() {
    this.getAllFood()
    .then(Food.returnFoods)
    // .then(function(foods) {
    //   return foods.reverse().map(function(food) {
    //     return new Food(food);
    //   })
    // })
    .then(Food.addFoodstoList)
    // .then(function(foods) {
      // foods.map(function(food) {
      //   $('.foods-list').append(food.toHTML(food));
      // })
    // })
  }

  static getAllFood() {
    return $.getJSON(`${host}/foods`)
  }

  static returnFoods(foods) {
    return foods.reverse().map(function(food) {
      return new Food(food);
    })
  }

  static addFoodstoList(foods) {
    foods.map(function(food) {
      $('.foods-list').append(food.toHTML(food));
    })
  }

  static addNewFood() {
    let foodName = $(".name-input").val();
    let foodCalorie = $(".calorie-input").val();
    let data = { food: { name: foodName, calories: foodCalorie } }

    $.post(`${host}/foods`, data)
    .then(Food.resetForm())
    .then(Food.allEntriesToHTML())
    .fail(function(error) {
      console.error(error);
    })
    event.preventDefault();
  }

  static resetForm() {
    $(".name-input").val("");
    $(".calorie-input").val("");
    $('.food').remove()
  }
}



module.exports = Food;
