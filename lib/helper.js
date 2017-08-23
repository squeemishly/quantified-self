const $ = require('jquery')

class Helper {
  static errorHandler(error) {
    console.log(error);
  }

  static filterFoodsApi(foods, word) {
    return foods.filter(function(food) {
      return food.name.toLowerCase().includes(word)
    })
  }
}

module.exports = Helper;
