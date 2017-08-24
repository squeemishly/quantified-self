var assert    = require('chai').assert;
var expect    = require('chai').expect;
var webdriver = require('selenium-webdriver');
var until     = webdriver.until;
var test      = require('selenium-webdriver/testing');
var frontEndLocation = "http://localhost:8080/foods.html"
const Food = require('./food')

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
    driver.sleep(5000)
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
  it("can get the foods list", function() {
    const foods = Food.getAllFood()
  })
})
