let $ = require('jquery')
const Diary = require('./diary')

$(document).ready(function() {
  // Diary.allEntriesToHTML()
  Diary.allMealsToHTML()
  $(".filter-diary-input").on('keyup', Diary.filterFoodList);
  $(".meal-submit").on("click", Diary.addToMeal);
  $(".meal-table").on('click', ".meal-data-delete", Diary.deleteFromMeal);
  $(".diary-data-calorie-heading").on("click", Diary.sortByCalories)
})
