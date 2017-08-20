const $ = require('jquery')
var host = require('./config').host

class Food {
  constructor(food) {
    this.id = food.id;
    this.name = food.name;
    this.calories = food.calories;
  }

  toHTML(food) {
    return `
      <div>
        <div class="grid-item food-data-id">${food.id}</div>
        <div class="grid-item food-data-name food">${food.name}</div>
        <div class="grid-item food-data-calorie">${food.calories}</div>
        <div class="grid-item food-data-delete"><button class="food-delete">Delete</button></div>
      </div>
    `
    // <td class="food-data-delete"><img src='images/cancel-button.svg' class='delete-icon'></td>
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
      .then(Food.foodListReset())
      .then(Food.allEntriesToHTML())
      .fail(Food.errorHandler)
    }
    event.preventDefault();
  }

  static resetForm() {
    $(".name-input").val("");
    $(".calorie-input").val("");
  }

  static foodListReset() {
    $('.food-data-id').remove();
    $('.food-data-name').remove();
    $('.food-data-calorie').remove();
    $('.food-data-delete').remove();
  }

  static errorHandler(error) {
    console.log(error);
  }

  static deleteFood() {
    const foodId = this.parentElement.parentElement.firstElementChild.textContent;
    $.ajax({
      method: 'DELETE',
      url: `${host}/foods/${foodId}`,
    })
    .then(Food.foodListReset())
    .then(Food.allEntriesToHTML())
    .fail(Food.errorHandler)
  }
}



module.exports = Food;
