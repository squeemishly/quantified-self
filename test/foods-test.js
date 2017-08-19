var assert    = require('chai').assert;
var webdriver = require('selenium-webdriver');
var until     = webdriver.until;
var test      = require('selenium-webdriver/testing');
var frontEndLocation = "http://localhost:8080/foods.html"

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
      assert.lengthOf(foods, 24)
    })
  })

  test.it("can add a food", function() {
    driver.get(`${frontEndLocation}`);
    driver.wait(until.elementLocated({css: ".add-food-btn"}));
    driver.findElement({css: '.name-input'}).sendKeys('Natalia')
    driver.findElement({css: '.calorie-input'}).sendKeys('200')
    driver.findElement({css: '.add-food-btn'}).click()
    driver.sleep(1000)
    driver.findElements({css: ".foods-list .food"})
    .then(function(foods) {
      assert.lengthOf(foods, 25)
    })
  })

})
