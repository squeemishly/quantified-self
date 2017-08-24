var assert    = require('chai').assert;
var expect    = require('chai').expect;
var webdriver = require('selenium-webdriver');
var until     = webdriver.until;
var test      = require('selenium-webdriver/testing');
var frontEndLocation = "http://localhost:8080/foods.html"
const Food = require('../lib/food')
const pry = require('pryjs')

describe("foods.html", function() {
  var driver;
  this.timeout(10000);

  test.beforeEach(function() {
    driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();
  });

  test.afterEach(function() {
    driver.quit();
  });

  test.it("displays a list of foods", function() {
    driver.get(`${frontEndLocation}`);
    driver.wait(until.elementLocated({css: ".foods-list .food"}));
    driver.findElements({css: ".foods-list .food"})
    .then(function(foods) {
      assert.lengthOf(foods, 12)
    })
  })

  test.it("can add a food", function() {
    driver.get(`${frontEndLocation}`)
    driver.wait(until.elementLocated({css: ".add-food-btn"}))
    driver.findElement({css: '.name-input'}).sendKeys('Natalia')
    driver.findElement({css: '.calorie-input'}).sendKeys('200')
    driver.findElement({css: '.add-food-btn'}).click()
    driver.sleep(1000)
    driver.findElements({css: ".foods-list .food"})
    .then(function(foods) {
      assert.lengthOf(foods, 13)
    })
  })

  test.it("gives an error message when there's no info in the food field", function() {
    driver.get(`${frontEndLocation}`)
    driver.wait(until.elementLocated({css: ".add-food-btn"}))
    driver.findElement({css: '.name-input'}).sendKeys('')
    driver.findElement({css: '.calorie-input'}).sendKeys('200')
    driver.findElement({css: '.add-food-btn'}).click()
    driver.wait(until.elementLocated({css: '.name-error-message'}))
  })

  test.it("can delete a food", function() {
    driver.get(`${frontEndLocation}`)
    driver.wait(until.elementLocated({css: ".food-delete"}))
    driver.findElement({css: '.food-delete'}).click()
    driver.sleep(1000)
    driver.findElements({css: ".foods-list .food"})
    .then(function(foods) {
      assert.lengthOf(foods, 12)
    })
  })
})

describe("Food", function() {
  it("#returnFoods", function() {
    const foods = [{"id": "1", "name": "apple", "calories": "12"},
                  {"id": "2", "name": "pineapple", "calories": "40"}]
    const foodList = Food.returnFoods(foods)

    assert.instanceOf(foodList[0], Food)
    assert.typeOf(foodList, 'array')
    assert.property(foodList[0], 'id')
    assert.property(foodList[0], 'name')
    assert.property(foodList[0], 'calories')
    assert.equal(foodList[0].id, "2") // returns in reverse order
    assert.equal(foodList[0].name, "pineapple")
    assert.equal(foodList[0].calories, "40")
  })

  it("#returnFoodObject", function() {
    const food = {"id": "1", "name": "apple", "calories": "12"}
    const newFood = Food.returnFoodObject(food)

    assert.instanceOf(newFood, Food)
    assert.property(newFood, 'id')
    assert.property(newFood, 'name')
    assert.property(newFood, 'calories')
    assert.equal(newFood.id, "1")
    assert.equal(newFood.name, "apple")
    assert.equal(newFood.calories, "12")
  })
})
