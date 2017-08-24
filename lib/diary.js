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
    Diary.getMeals()
    .then(Diary.createMealsTables)
    .then(Diary.populateGoalTable)
  }

  static createMealsTables(meals) {
    meals.map(function(meal) {
      const mealFoods = Diary.convertFoodsofMeals(meal.foods)
      Diary.addFoodstoTable(mealFoods, meal.name)
      const totalMealCalories = Diary.calculateCalories(mealFoods)
      HTMLHelper.returnMealCalories(meal.name, totalMealCalories)
    })
  }

  static convertFoodsofMeals(foodsList) {
    return foodsList.map(function(food) {
      return Food.returnFoodObject(food)
    })
  }

  static addFoodstoTable(mealFoods, mealName) {
    mealFoods.forEach(function(food){
      $(`.${mealName}-table`).append(HTMLHelper.toMeal(food))
    })
  }

  static getMeals() {
    return $.ajax({
      method: "GET",
      url: `${host}/meals`
    })
  }

  static calculateCalories(mealFoods) {
    return mealFoods.reduce(function(sum, value) {
      return sum + value.calories
    }, 0)
  }

  static addToMeal() {
    const mealName = event.target.textContent
    const mealId = event.target.value
    const $checkedFoods = $( "input:checked" ).toArray()

    const foodObjects = Diary.buildFoodObjectList($checkedFoods)

    Diary.addFoodtoMeals(foodObjects, mealId, mealName)
    Diary.populateGoalTable()
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
      Diary.updateCalories(mealName, foodObject.calories, "add")
    })
  }

  static updateCalories(mealName, calories, operation) {
    const previousCals = parseInt($(`.${mealName}-total-calories`).text().split(": ")[1])
    const newCals = Diary.returnNewCals(previousCals, calories, operation)
    HTMLHelper.returnMealCalories(mealName, newCals)
  }

  static returnNewCals(previousCals, calories, operation) {
    if(operation === "add") {
      return Diary.addCalories(previousCals, calories)
    } else {
      return Diary.subtractCalories(previousCals, calories)
    }
  }

  static addCalories(previousCals, calories) {
    return previousCals + parseInt(calories)
  }

  static subtractCalories(previousCals, calories) {
    return previousCals - parseInt(calories)
  }

  static postFoodtoMealApi(mealId, foodId) {
    $.ajax({
      method: "POST",
      url: `${host}/meals/${mealId}/foods/${foodId}`
    })
  }

  static buildFoodObject(input) {
    const data = {"id": input.parentElement.parentElement.children[0].textContent,
                  "name": input.parentElement.parentElement.children[2].textContent,
                  "calories": input.parentElement.parentElement.children[3].textContent}

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
    Diary.updateCalories(mealName, foodCalories, "subtract")
    Diary.populateGoalTable()
  }

  static deleteFoodMealApi(mealId, foodId) {
    $.ajax({
      method: "DELETE",
      url: `${host}/meals/${mealId}/foods/${foodId}`
    })
  }

  static populateGoalTable() {
    const totalCalories = Diary.caloriesConsumed()
    HTMLHelper.goalTableVals(totalCalories)
  }

  static caloriesConsumed() {
    const breakfastCal = parseInt($('.Breakfast-total-calories')[0].textContent.split(": ")[1])
    const lunchCal = parseInt($('.Lunch-total-calories')[0].textContent.split(": ")[1])
    const dinnerCal = parseInt($('.Dinner-total-calories')[0].textContent.split(": ")[1])
    const snackCal = parseInt($('.Snack-total-calories')[0].textContent.split(": ")[1])
    return breakfastCal + lunchCal + dinnerCal + snackCal
  }

  static sortByCalories() {
    const tableRows = Array.prototype.slice.call($('.diary-list').children());
    let sortedArray = Diary.sortCalorieCase(tableRows)
    HTMLHelper.foodListReset("diary")
    $('.diary-table').append(sortedArray)
  }

  static sortCalorieCase(tableRows) {
    if ($(".diary-data-calorie-heading")[0].className.includes("byID")) {
        HTMLHelper.assignState("byID", "asc")
        return tableRows.sort(function(a,b) {
          return Diary.getCalorieValue(a) - Diary.getCalorieValue(b)
        })
      } else if ($(".diary-data-calorie-heading")[0].className.includes("asc")) {
        HTMLHelper.assignState("asc", "desc")
        return tableRows.sort(function(a,b) {
          return Diary.getCalorieValue(b) - Diary.getCalorieValue(a)
        })
      } else {
        HTMLHelper.assignState("desc", "byID")
        return tableRows.sort(function(a,b) {
          return Diary.getIDValue(b) - Diary.getIDValue(a)
        })
      }
  }

  static getCalorieValue(letter) {
    return parseInt(Array.from(letter.children).find(td => td.className === "diary-data-calorie").textContent)
  }

  static getIDValue(letter) {
    return parseInt(Array.from(letter.children).find(td => td.className === "diary-data-id").textContent)
  }
}

module.exports = Diary;
