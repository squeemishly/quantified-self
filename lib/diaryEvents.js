let $ = require('jquery')
const Diary = require('./diary')

$(document).ready(function() {
  Diary.allEntriesToHTML();
  $(".filter-diary-input").on('keyup', Diary.filterFoodList)
})
