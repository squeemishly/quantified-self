const $ = require('jquery')
const HTMLHelper = require('./htmlHelper')
const host = require('./config').host
const Helper = require('./helper')

class Food {
  constructor(food) {
    this.id = food.id;
    this.name = food.name;
    this.calories = food.calories;
  }

  static allEntriesToHTML() {
    this.getAllFood()
    .then(Food.returnFoods)
    .then(Food.addFoodstoList)
    .fail(Helper.errorHandler)
  }

  static getAllFood() {
    return $.getJSON(`${host}/foods`)
  }

  static returnFoods(foods) {
    return foods.reverse().map(function(food) {
      return Food.returnFoodObject(food);
    })
  }

  static addFoodstoList(foods) {
    foods.forEach(function(food) {
      $('.foods-list').append(HTMLHelper.toHTML(food));
    })
  }

  static addNewFood() {
    let foodName = $(".name-input").val();
    let foodCalorie = $(".calorie-input").val();

    HTMLHelper.cleanMessages()
    Food.makeNewFood(foodName, foodCalorie)

    event.preventDefault();
  }

  static makeNewFood(foodName, foodCalorie) {
    if(foodName === "") {
      HTMLHelper.emptyFieldError("name", "food name")
    }
    if(foodCalorie === "") {
      HTMLHelper.emptyFieldError("calorie", "calorie amount")
    }
    if(foodName !== "" && foodCalorie !== "") {
      Food.postNewFood(foodName, foodCalorie)
    }
  }

  static postNewFood(foodName, foodCalorie) {
    let data = { food: { name: foodName, calories: foodCalorie } }

    $.post(`${host}/foods`, data)
    .then(Food.returnFoodObject)
    .then(Food.prependFoodToList)
    .then(Food.resetForm())
    .fail(Helper.errorHandler)
  }

  static returnFoodObject(food) {
    return new Food(food)
  }

  static prependFoodToList(foodObject) {
    $('.foods-list').prepend(HTMLHelper.toHTML(foodObject))
  }

  static resetForm() {
    $(".name-input").val("");
    $(".calorie-input").val("");
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
    .fail(Helper.errorHandler)
  }

  static editFoodName() {
    const foodId = this.previousElementSibling.textContent;
    const foodCalories = this.nextElementSibling.textContent;

    Food.updateFood(foodId, $(this).text(), foodCalories)
  }

  static editFoodCalorie() {
    const foodName = this.previousElementSibling.textContent;
    const foodId = this.previousElementSibling.previousElementSibling.textContent;

    Food.updateFood(foodId, foodName, $(this).text())
  }

  static updateFood(foodId, foodName, foodCalories){
      $.ajax({
        method: "PUT",
        url: `${host}/foods/${foodId}`,
        data: { food: { name: foodName, calories: foodCalories } }
    })
  }

  static filterFoodList() {
    let word = $('.filter-foods-input').val().toLowerCase()

    Food.getAllFood()
    .then(function(data) {
      return Food.filterFoodsApi(data, word)
    })
    .then(Food.returnFoods)
    .then(HTMLHelper.foodListReset("food"))
    .then(Food.addFoodstoList)
    .fail(Helper.errorHandler)
  }

  static filterFoodsApi(foods, word) {
    return foods.filter(function(food) {
      return food.name.toLowerCase().includes(word)
    })
  }
}

module.exports = Food;
