const $ = require('jquery')
var host = require('./config').host
var Food = require('./food')
var HTMLCreator = require('./htmlCreator')

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
      $('.diary-list').append(HTMLCreator.toDiary(food));
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
  static allMealsToHTML() {
    $.ajax({
      method: "GET",
      url: `${host}/meals`
    })
    .then(function(meals) {
      meals.map(function(meal) {
        const mealFoods = meal["foods"].map(function(food) {
          return new Food(food)
        })
        mealFoods.forEach(function(food){
          $(`.${meal.name}-table`).append(HTMLCreator.toMeal(food))
        })
        Diary.calculateCalories(mealFoods, meal)
      })
    })
  }

  static calculateCalories(mealFoods, meal) {
    const totalMealCalories = mealFoods.reduce(function(sum, value) {
      return sum + value.calories
    }, 0)
    Diary.returnMealCalories(meal.name, totalMealCalories)
    // $(`.${meal.name}-total-calories`).text(`Total Calories: ${totalMealCalories}`)
    // $(`.${meal.name}-remaining-calories`).text(`Remaining Calories: ${mealNums[meal.name]-totalMealCalories}`)
  }

  static returnMealCalories(mealName, totalMealCalories){
    const mealNums = {
      "Breakfast": 400,
      "Snack": 200,
      "Lunch": 600,
      "Dinner": 800
    }

    $(`.${mealName}-total-calories`).text(`Total Calories: ${totalMealCalories}`)
    $(`.${mealName}-remaining-calories`).text(`Remaining Calories: ${mealNums[mealName]-totalMealCalories}`)
  }

  static addToMeal() {
    const mealName = event.target.textContent
    const mealNums = {
      "Breakfast": 1,
      "Snack": 2,
      "Lunch": 3,
      "Dinner": 4
    }
    const $checkedFoods = $( "input:checked" ).toArray()

    const foodObjects = $checkedFoods.map(function(input) {
      const food = {"id": input.parentElement.children[0].textContent,
                    "name": input.parentElement.children[2].textContent,
                    "calories": input.parentElement.children[3].textContent}

      return new Food(food)
    })

    foodObjects.forEach(function(foodObject) {
      $.ajax({
        method: "POST",
        url: `${host}/meals/${mealNums[mealName]}/foods/${foodObject.id}`
      })
      $(`.${mealName}-table`).append(HTMLCreator.toMeal(foodObject))
      const previousCals = parseInt($(`.${mealName}-total-calories`).text().split(": ")[1])
      const newCals = previousCals + parseInt(foodObject.calories)
      Diary.returnMealCalories(mealName, newCals)
    })

    $(".checkbox").prop("checked", false)
  }

  static deleteFromMeal() {
    const foodRow = this.parentElement
    const foodId = foodRow.children[0].textContent
    const foodCalories = foodRow.children[2].textContent
    const mealName = foodRow.parentElement.className.split("-")[0]
    const mealNums = {
      "Breakfast": 1,
      "Snack": 2,
      "Lunch": 3,
      "Dinner": 4
    }

    Diary.deleteFoodMealApi(mealNums[mealName], foodId)
    Diary.removeFromTable(foodRow)
    const previousCals = parseInt($(`.${mealName}-total-calories`).text().split(": ")[1])
    const newCals = previousCals - parseInt(foodCalories)
    Diary.returnMealCalories(mealName, newCals)
  }

  static deleteFoodMealApi(mealId, foodId) {
    $.ajax({
      method: "DELETE",
      url: `${host}/meals/${mealId}/foods/${foodId}`
    })
  }

  static removeFromTable(row) {
    row.remove()
  }
  //
  // static populateGoalTable() {
  //
  // }
}

module.exports = Diary;
