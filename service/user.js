import request from './network.js'


export function saveUser(userNiceName, userPhone, cityCode, headSculpture) {
  return request({
    url: "/wx/user/saveUser",
    data: {
      userNiceName,
      userPhone,
      cityCode,
      headSculpture
    }
  })
}

export function getMyShare(currPage) {
  return request({
    url: "/wx/user/getMyShare",
    data: {
      currPage
    },
  })
}

export function getBrowseCountAndLikeCount() {
  return request({
    url: "/wx/user/getBrowseCountAndLikeCount"
  })
}