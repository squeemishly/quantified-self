const $ = require('jquery')
var host = require('./config').host
var Food = require('./food')

class Diary {
  static allEntriesToHTML() {
    this.getAllFood()
    .then(Diary.returnFoods)
    .then(Diary.addFoodstoList)
    .fail(Diary.errorHandler)
  }

  static getAllFood() {
    return $.getJSON(`${host}/foods`)
  }

  static returnFoods(foods) {
    let foodList = foods.reverse().map(function(food) {
      return new Food(food);
    })
    return foodList
  }

  static addFoodstoList(foods) {
    foods.forEach(function(food) {
      $('.diary-list').append(food.toDiary(food));
    })
  }

  static filterFoodList() {
    let word = $('.filter-diary-input').val().toLowerCase()

    Diary.getAllFood()
    .then(function(data) {
      return Diary.filterFoodsApi(data, word)
    })
    .then(Diary.returnFoods)
    .then(Diary.foodListReset())
    .then(Diary.addFoodstoList)
    .fail(Diary.errorHandler)
  }

  static filterFoodsApi(foods, word) {
    let matches = foods.filter(function(food) {
      return food.name.toLowerCase().includes(word)
    })
    return matches
  }

  static foodListReset() {
    $('.diary-row').remove();
  }

  static errorHandler(error) {
    console.log(error);
  }

  /////////////////  PREVIOUS CODE NEEDS TO BE REFACTORED SO NOT TO DUPLICATE FOOD
  static addToMeal() {
    const mealName = event.target.textContent
    const mealNums = {
      "Breakfast": 1,
      "Snack": 2,
      "Lunch": 3,
      "Dinner": 4
    }
    const $checkedFoods = $( "input:checked" ).toArray()

    const foodIds = $checkedFoods.map(function(input) {
      return input.parentElement.children[0].textContent
    })

    foodIds.forEach(function(foodId) {
      $.ajax({
        method: "POST",
        url: `${host}/meals/${mealNums[mealName]}/foods/${foodId}`
      })
    })

    $(".checkbox").prop("checked", false);
  }
}

module.exports = Diary;
