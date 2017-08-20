var assert    = require('chai').assert;
var expect    = require('chai').expect;
var webdriver = require('selenium-webdriver');
var until     = webdriver.until;
var test      = require('selenium-webdriver/testing');
var frontEndLocation = "http://localhost:8080/foods.html"
// var chai = require('chai')
// chai.use(require('chai-dom'))

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
      assert.lengthOf(foods, 45)
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
      assert.lengthOf(foods, 46)
    })
  })

  // test.it("gives an error message when there's no info in the food field", function() {
  //   driver.get(`${frontEndLocation}`)
  //   driver.wait(until.elementLocated({css: ".add-food-btn"}))
  //   driver.findElement({css: '.name-input'}).sendKeys('')
  //   driver.findElement({css: '.calorie-input'}).sendKeys('200')
  //   driver.findElement({css: '.add-food-btn'}).click()
  //   driver.wait(until.elementLocated({css: '.name-error-message'}),
  //   expect(document.querySelector('.food-data-name')).to.have.text('Please enter a food name')
  // })
})
