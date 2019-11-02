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

export function saveUserInfo(token, encryptedData, iv) {
  return request({
    url: "/wx/user/getUserInfo",
    data: {
      encryptedData,
      iv
    },
    header: {
      token
    },
  })
}