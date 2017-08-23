const $ = require('jquery')
var HTMLCreator = require('./htmlCreator')
var host = require('./config').host

class Food {
  constructor(food) {
    this.id = food.id;
    this.name = food.name;
    this.calories = food.calories;
  }

  // toHTML(food) {
  //   return `
  //     <div class="food-row">
  //       <div class="grid-item food-data-id">${food.id}</div>
  //       <div class="grid-item food-data-name food" contenteditable="true">${food.name}</div>
  //       <div class="grid-item food-data-calorie" contenteditable="true">${food.calories}</div>
  //       <div class="grid-item food-data-delete"><img src='images/cancel-button.svg' class='food-delete delete-icon'></div>
  //     </div>
  //   `
  // }
  //
  // toDiary(food) {
  //   return `
  //     <div class="diary-row">
  //       <div class="grid-item diary-data-id">${food.id}</div>
  //       <input type="checkbox" class="checkbox">
  //       <div class="grid-item diary-data-name diary">${food.name}</div>
  //       <div class="grid-item diary-data-calorie">${food.calories}</div>
  //     </div>
  //   `
  // }
  //
  // toMeal(food) {
  //   return `
  //     <tr class="meal-row">
  //       <td class="food-data-id">${food.id}</td>
  //       <td class="meal-data-name meal">${food.name}</td>
  //       <td class="meal-data-calorie">${food.calories}</td>
  //       <td class="meal-data-delete"><img src='images/cancel-button.svg' class='food-delete delete-icon'></td>
  //     </tr>
  //   `
  // }

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
      return Food.returnFoodObject(food);
    })
  }

  static addFoodstoList(foods) {
    foods.forEach(function(food) {
      $('.foods-list').append(HTMLCreator.toHTML(food));
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
    .then(Food.returnFoodObject)
    .then(Food.prependFoodToList)
    .then(Food.resetForm())
    .fail(Food.errorHandler)
  }

  static returnFoodObject(food) {
    return new Food(food)
  }

  static prependFoodToList(foodObject) {
    $('.foods-list').prepend(foodObject.toHTML(foodObject))
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
    .then(Food.foodListReset())
    .then(Food.addFoodstoList)
    .fail(Food.errorHandler)
  }

  static filterFoodsApi(foods, word) {
    let matches = foods.filter(function(food) {
      return food.name.toLowerCase().includes(word)
    })
    return matches
  }
}

module.exports = Food;
