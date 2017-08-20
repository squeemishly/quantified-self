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
    .then(Food.addFoodstoList)
    .fail(Food.errorHandler)
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

    $('.name-error-message').remove();
    $('.calorie-error-message').remove();
    if(foodName === "") {
      $('.form-food-name').append("<div class='name-error-message'>Please enter a food name</div>")
    }
    if(foodCalorie === "") {
      $('.form-food-calorie').append("<div class='calorie-error-message'>Please enter a calorie amount</div>")
    }
    if(foodName !== "" && foodCalorie !== "") {
      $.post(`${host}/foods`, data)
      .then(Food.resetForm())
      .then(Food.allEntriesToHTML())
      .fail(Food.errorHandler)
    }
    event.preventDefault();
  }

  static resetForm() {
    $(".name-input").val("");
    $(".calorie-input").val("");
    $('.food').remove()
  }

  static errorHandler(error) {
    console.log(error);
  }
}



module.exports = Food;
