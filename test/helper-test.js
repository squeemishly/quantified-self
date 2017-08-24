var assert    = require('chai').assert;
const Helper = require('../lib/helper')
const pry = require('pryjs')


describe("Helper functions", function() {
  it("#filterFoodsApi", function() {
    const foods = [{"id": "1", "name": "apple", "calories": "12"},
                  {"id": "2", "name": "pineapple", "calories": "40"},
                  {"id": "3", "name": "cheese", "calories": "100"}]
    const word = "app"
    const foodList = Helper.filterFoodsApi(foods, word)

    assert.typeOf(foodList, 'array')
    assert.equal(foodList.length, 2)
    assert.include(foodList, {"id": "1", "name": "apple", "calories": "12"})
    assert.include(foodList, {"id": "2", "name": "pineapple", "calories": "40"})
    assert.notInclude(foodList, {"id": "3", "name": "cheese", "calories": "100"})
  })
})