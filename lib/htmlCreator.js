class HTMLCreator {
  static toHTML(food) {
    return `
      <div class="food-row">
        <div class="grid-item food-data-id">${food.id}</div>
        <div class="grid-item food-data-name food" contenteditable="true">${food.name}</div>
        <div class="grid-item food-data-calorie" contenteditable="true">${food.calories}</div>
        <div class="grid-item food-data-delete"><img src='images/cancel-button.svg' class='food-delete delete-icon'></div>
      </div>
    `
  }

  static toDiary(food) {
    return `
      <div class="diary-row">
        <div class="grid-item diary-data-id">${food.id}</div>
        <input type="checkbox" class="checkbox">
        <div class="grid-item diary-data-name diary">${food.name}</div>
        <div class="grid-item diary-data-calorie">${food.calories}</div>
      </div>
    `
  }

  static toMeal(food) {
    return `
      <tr class="meal-row">
        <td class="food-data-id">${food.id}</td>
        <td class="meal-data-name meal">${food.name}</td>
        <td class="meal-data-calorie">${food.calories}</td>
        <td class="meal-data-delete"><img src='images/cancel-button.svg' class='food-delete delete-icon'></td>
      </tr>
    `
  }
}

module.exports = HTMLCreator;
