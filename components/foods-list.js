import React, { Component } from "react"
import Diary from '../lib/diary'

class FoodsList extends Component {
  render() {
    return(
      <div>
        <h1 className="foods-heading heading">Foods</h1>
        <table className="diary-table">
          <thead>
            <tr className="headers-row">
              <th className="diary-list-table-heading"></th>
              <th className="diary-list-table-heading diary-data-name">Name</th>
              <th className="diary-list-table-heading diary-data-calorie-heading byID">Calories</th>
            </tr>
          </thead>
          <tbody
              className="diary-list"
              onLoad={ Diary.allEntriesToHTML() }
          >
          </tbody>
        </table>
      </div>
    )
  }
}

export default FoodsList
