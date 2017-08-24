var assert    = require('chai').assert;
var expect    = require('chai').expect;
var webdriver = require('selenium-webdriver');
var until     = webdriver.until;
var test      = require('selenium-webdriver/testing');
var frontEndLocation = "http://localhost:8080"
const Diary = require('../lib/diary')
const Food = require('../lib/food')
const pry = require('pryjs')

describe("Diary functions", function() {
  it("#convertFoodsofMeals", function() {
    const foods = [{"id": "1", "name": "apple", "calories": "12"},
                  {"id": "2", "name": "pineapple", "calories": "40"}]
    const foodList = Diary.convertFoodsofMeals(foods)

    assert.instanceOf(foodList[0], Food)
    assert.typeOf(foodList, 'array')
    assert.property(foodList[0], 'id')
    assert.property(foodList[0], 'name')
    assert.property(foodList[0], 'calories')
    assert.equal(foodList[0].id, "1")
    assert.equal(foodList[0].name, "apple")
    assert.equal(foodList[0].calories, "12")
  })

  it("#calculateCalories", function() {
    const foods = [{"id": "1", "name": "apple", "calories": 12},
    {"id": "2", "name": "pineapple", "calories": 40}]
    const cals = Diary.calculateCalories(foods)

    assert.equal(cals, 52)
  })

  it("#addCalories", function() {
    const cals = Diary.addCalories(3, 7)

    assert.equal(cals, 10)
  })

  it("#subtractCalories", function() {
    const cals = Diary.subtractCalories(17, 7)

    assert.equal(cals, 10)
  })

  it("#returnNewCals", function() {
    const addCals = Diary.returnNewCals(3, 7, "add")
    const subtractCals = Diary.returnNewCals(17, 7, "subtract")

    assert.equal(addCals, 10)
    assert.equal(subtractCals, 10)
  })
})