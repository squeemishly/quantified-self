let $ = require('jquery');
const Food = require('./food')

$(document).ready(function() {
  // let food = new Food
  Food.allEntriesToHTML();
  $(".add-food-btn").on('click', Food.addNewFood);
})
