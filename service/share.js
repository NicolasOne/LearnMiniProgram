import request from './network.js'

export function share() {
  return request({
    url: "/tag/getTagInfo",
    data: {}
  })
}
