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
      <div class="food-row">
        <div class="grid-item food-data-id">${food.id}</div>
        <div class="grid-item food-data-name food">${food.name}</div>
        <div class="grid-item food-data-calorie">${food.calories}</div>
        <div class="grid-item food-data-delete"><img src='images/cancel-button.svg' class='food-delete delete-icon'></div>
      </div>
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

    Food.cleanMessages()
    Food.makeNewFood(foodName, foodCalorie)
    event.preventDefault();
  }

  static makeNewFood(foodName, foodCalorie) {
    if(foodName === "") {
      $('.form-food-name').append("<div class='name-error-message'>Please enter a food name</div>")
    }
    if(foodCalorie === "") {
      $('.form-food-calorie').append("<div class='calorie-error-message'>Please enter a calorie amount</div>")
    }
    if(foodName !== "" && foodCalorie !== "") {
      Food.postNewFood(foodName, foodCalorie)
    }
  }

  static postNewFood(foodName, foodCalorie) {
    let data = { food: { name: foodName, calories: foodCalorie } }

    $.post(`${host}/foods`, data)
    .then(Food.resetForm())
    .then(Food.foodListReset())
    .then(Food.allEntriesToHTML())
    .fail(Food.errorHandler)
  }

  static resetForm() {
    $(".name-input").val("");
    $(".calorie-input").val("");
  }

  static foodListReset() {
    $('.food-row').remove();
  }

  static cleanMessages() {
    $('.name-error-message').remove();
    $('.calorie-error-message').remove();
  }

  static errorHandler(error) {
    console.log(error);
  }

  static deleteFood() {
    const foodId = this.parentElement.parentElement.firstElementChild.textContent;
    Food.dbDelete(foodId)
    this.parentElement.parentElement.remove()
  }

  static dbDelete(foodId) {
    $.ajax({
      method: 'DELETE',
      url: `${host}/foods/${foodId}`,
    })
    .fail(Food.errorHandler)
  }

  static editFoodName() {
    const foodId = this.previousElementSibling.textContent;
    const foodCalories = this.nextElementSibling.textContent;

    const $el = $(this);

    const $input = $('<input class="field-edit"/>').val( $el.text() );
    $el.replaceWith( $input );

    const save = function(){
      const $div = $('<div class="grid-item food-data-name food">').text( $input.val() );
      $input.replaceWith( $div );
    };

    $input.one('blur', save).focus();

    $(window).on('click', function() {
      Food.updateFood(foodId, $input.val(), foodCalories)
    })
  }

  static editFoodCalorie() {
    const foodName = this.previousElementSibling.textContent;
    const foodId = this.previousElementSibling.previousElementSibling.textContent;

    const $el = $(this);

    const $input = $('<input class="field-edit"/>').val( $el.text() );
    $el.replaceWith( $input );

    const save = function(){
      const $div = $('<div class="grid-item food-data-calorie">').text( $input.val() );
      $input.replaceWith( $div );
    };

    $input.one('blur', save).focus();


    $(window).on('click', function() {
      Food.updateFood(foodId, foodName, $input.val())
    })
  }

  static updateFood(foodId, foodName, foodCalories){
      $.ajax({
        method: "PUT",
        url: `${host}/foods/${foodId}`,
        data: { food: { name: foodName, calories: foodCalories } }
    })
  }
}



module.exports = Food;
