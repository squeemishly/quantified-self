const $ = require('jquery')

class HTMLHelper {
  static toHTML(food) {
    return `
      <div class="food-row">
        <div class="grid-item food-data-id">${food.id}</div>
        <div class="grid-item food-data-name food" contenteditable="true">${food.name}</div>
        <div class="grid-item food-data-calorie" contenteditable="true">${food.calories}</div>
        <div class="grid-item food-data-delete"><img src='images/cancel-button.svg' class='food-delete delete-icon'></div>
      </div>
    `
  }

  static toDiary(food) {
    return `
    <tr class="diary-row">
    <td class="diary-data-id">${food.id}</td>
    <td><input type="checkbox" class="checkbox"></td>
    <td class="diary-data-name">${food.name}</td>
    <td class="diary-data-calorie">${food.calories}</td>
    </tr>
    `
  }

  // <div class="diary-row">
  //   <div class="grid-item diary-data-id">${food.id}</div>
  //   <input type="checkbox" class="checkbox">
  //   <div class="grid-item diary-data-name diary">${food.name}</div>
  //   <div class="grid-item diary-data-calorie">${food.calories}</div>
  // </div>

  static toMeal(food) {
    return `
      <tr class="meal-row">
        <td class="food-data-id">${food.id}</td>
        <td class="meal-data-name meal">${food.name}</td>
        <td class="meal-data-calorie">${food.calories}</td>
        <td class="meal-data-delete"><img src='images/cancel-button.svg' class='food-delete delete-icon'></td>
      </tr>
    `
  }

  static emptyFieldError(type, message) {
    $(`.form-food-${type}`).append(`<div class='${type}-error-message'>Please enter a ${message}</div>`)
  }

  static foodListReset(type) {
    $(`.${type}-row`).remove();
  }

  static resetForm() {
    $(".name-input").val("");
    $(".calorie-input").val("");
  }

  static cleanMessages() {
    $('.name-error-message').remove();
    $('.calorie-error-message').remove();
  }

  static returnMealCalories(mealName, totalMealCalories){
    const mealNums = {
      "Breakfast": 400,
      "Snack": 200,
      "Lunch": 600,
      "Dinner": 800
    }
    const remainingCal = mealNums[mealName]-totalMealCalories

    $(`.${mealName}-total-calories`).text(`Total Calories: ${totalMealCalories}`)
    $(`.${mealName}-remaining-calories`).text(`Remaining Calories: ${remainingCal}`)
    HTMLHelper.styleCalories(remainingCal, `${mealName}-remaining-calories`)
  }

  static uncheckBoxes() {
    $(".checkbox").prop("checked", false)
  }

  static removeFromTable(row) {
    row.remove()
  }

  static goalTableVals(totalCalories) {
    const remainingCal = 2000 - totalCalories

    $('.consumed-cal-value').text(totalCalories)
    $('.remaining-cal-value').text(remainingCal)
    HTMLHelper.styleCalories(remainingCal, "remaining-cal")
  }

  static styleCalories(totalCal, className) {
    if(totalCal <= 0) {
      $(`.${className}`).addClass("red")
    } else {
      $(`.${className}`).removeClass("red")
    }
  }

  static assignState(previousState, state) {
    $('.diary-data-calorie').removeClass(`${previousState}`).addClass(`${state}`)
  }
}

module.exports = HTMLHelper;
