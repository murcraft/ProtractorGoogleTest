'use strict'

class PostBuildingsTypeahead {

  static GetPostBuildingsTypeahead (request) {
    return {
      method: 'post',
      resource: `buildings/building_typeahead`,
      data: {
        'query': request
      }
    }
  }

}

module.exports = PostBuildingsTypeahead