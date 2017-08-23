const $ = require('jquery')
const host = require('./config').host
const Food = require('./food')
const HTMLHelper = require('./htmlHelper')
const Helper = require('./helper')

class Diary {
  static allEntriesToHTML() {
    Food.getAllFood()
    .then(Food.returnFoods)
    .then(Diary.addFoodstoList)
    .fail(Helper.errorHandler)
  }

  static addFoodstoList(foods) {
    foods.forEach(function(food) {
      $('.diary-list').append(HTMLHelper.toDiary(food));
    })
  }

  static filterFoodList() {
    let word = $('.filter-diary-input').val().toLowerCase()

    Food.getAllFood()
    .then(function(data) {
      return Helper.filterFoodsApi(data, word)
    })
    .then(Food.returnFoods)
    .then(HTMLHelper.foodListReset("diary"))
    .then(Diary.addFoodstoList)
    .fail(Helper.errorHandler)
  }

  static allMealsToHTML() {
    $.ajax({
      method: "GET",
      url: `${host}/meals`
    })
    .then(function(meals) {
      meals.map(function(meal) {
        const mealFoods = meal["foods"].map(function(food) {
          return Food.returnFoodObject(food)
        })
        mealFoods.forEach(function(food){
          $(`.${meal.name}-table`).append(HTMLHelper.toMeal(food))
        })
        Diary.calculateCalories(mealFoods, meal)
      })
    })
  }

  static calculateCalories(mealFoods, meal) {
    const totalMealCalories = mealFoods.reduce(function(sum, value) {
      return sum + value.calories
    }, 0)
    HTMLHelper.returnMealCalories(meal.name, totalMealCalories)
  }

  static addToMeal() {
    const mealName = event.target.textContent
    const mealId = event.target.value
    const $checkedFoods = $( "input:checked" ).toArray()

    const foodObjects = Diary.buildFoodObjectList($checkedFoods)

    Diary.addFoodtoMeals(foodObjects, mealId, mealName)

    HTMLHelper.uncheckBoxes()
  }

  static buildFoodObjectList(foods) {
    return foods.map(function(input) {
      return Diary.buildFoodObject(input)
    })
  }

  static addFoodtoMeals(foodObjects, mealId, mealName) {
    foodObjects.forEach(function(foodObject) {
      Diary.postFoodtoMealApi(mealId, foodObject.id)
      $(`.${mealName}-table`).append(HTMLHelper.toMeal(foodObject))
      Diary.updateCalories(mealName, foodObject.calories)
    })
  }

  static updateCalories(mealName, calories) {
    const previousCals = parseInt($(`.${mealName}-total-calories`).text().split(": ")[1])
    const newCals = previousCals + parseInt(calories)
    HTMLHelper.returnMealCalories(mealName, newCals)
  }

  static postFoodtoMealApi(mealId, foodId) {
    $.ajax({
      method: "POST",
      url: `${host}/meals/${mealId}/foods/${foodId}`
    })
  }

  static buildFoodObject(input) {
    const data = {"id": input.parentElement.children[0].textContent,
                  "name": input.parentElement.children[2].textContent,
                  "calories": input.parentElement.children[3].textContent}

    return Food.returnFoodObject(data)
  }

  static deleteFromMeal() {
    const foodRow = this.parentElement
    const foodId = foodRow.children[0].textContent
    const foodCalories = foodRow.children[2].textContent
    const mealName = foodRow.parentElement.className.split("-")[0]
    const mealId = foodRow.parentElement.id

    Diary.deleteFoodMealApi(mealId, foodId);
    HTMLHelper.removeFromTable(foodRow);
    Diary.updateCalories(mealName, foodCalories)
  }

  static deleteFoodMealApi(mealId, foodId) {
    $.ajax({
      method: "DELETE",
      url: `${host}/meals/${mealId}/foods/${foodId}`
    })
  }

  // static populateGoalTable() {
  //
  // }
}

module.exports = Diary;
