'use strict'

class PostSignIn {

  static GetPostSignInRequest (user) {
    return {
      method: 'post',
      resource: 'accounts/sign_in?search_token=OTVjOWI0YTQtNmU2My00YjY5LThjYTMtODM4MTk5MzQ2ZTgw&major_version=100',
      data: {
        'user': {
          'email': user.email,
          'password': user.pass
        }
      }
    }
  }

}

module.exports = PostSignIn