let $ = require('jquery');
const Food = require('./food')

$(document).ready(function() {
  // let food = new Food
  Food.allEntriesToHTML();
})
