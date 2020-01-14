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
export function readMsg(msgId) {
  console.log(msgId,'msgId')
  return request({
    url: "/pushMsg/readMsg",
    method: 'POST',
    data:{
      msgId
    }
  })
}
export function queryCoverImg() {
  return request({
    url: "/sys/queryCoverImg",
    data: {
      version: '1.0'
    }
  })
}
export function saveFeedback(params) {
  return request({
    url: "/feedback/save",
    method: 'POST',
    data: params
  })
}