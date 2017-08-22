let $ = require('jquery')
const Diary = require('./diary')

$(document).ready(function() {
  Diary.allEntriesToHTML();
  $(".filter-diary-input").on('keyup', Diary.filterFoodList)
  $(".meal-submit").on("click", Diary.addToMeal)
})
