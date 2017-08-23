let $ = require('jquery');
const Food = require('./food')

$(document).ready(function() {
  // let food = new Food
  Food.allEntriesToHTML();
  $(".add-food-btn").on('click', Food.addNewFood);
  $(".foods-list").on('click', ".food-delete", Food.deleteFood);
  $(".foods-list").on('focusout', ".food-data-name", Food.editFoodName);
  $(".foods-list").on('focusout', ".food-data-calorie", Food.editFoodCalorie);
  $(".filter-foods-input").on('keyup', Food.filterFoodList)
})
