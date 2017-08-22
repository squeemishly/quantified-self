const $ = require('jquery')
var host = require('./config').host
var Food = require('./food')

class Diary {
  static allEntriesToHTML() {
    this.getAllFood()
    .then(Diary.returnFoods)
    .then(Diary.addFoodstoList)
    // .fail(Diary.errorHandler)
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
      $('.diary-list').append(food.toDiary(food));
    })
  }
}

module.exports = Diary;

