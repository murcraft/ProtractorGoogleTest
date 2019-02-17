'use strict'

class GetBuildingInSearch {

  static GetGetBuildingsInSearch () {
    return {
      method: 'get',
      resource: `qa/buildings_in_search`
    }
  }

}

module.exports = GetBuildingInSearch