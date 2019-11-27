function formatTime(time) {
  if (typeof time !== 'number' || time < 0) {
    return time
  }

  const hour = parseInt(time / 3600, 10)
  time %= 3600
  const minute = parseInt(time / 60, 10)
  time = parseInt(time % 60, 10)
  const second = time

  return ([hour, minute, second]).map(function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }).join(':')
}

function formatLocation(longitude, latitude) {
  if (typeof longitude === 'string' && typeof latitude === 'string') {
    longitude = parseFloat(longitude)
    latitude = parseFloat(latitude)
  }

  longitude = longitude.toFixed(2)
  latitude = latitude.toFixed(2)

  return {
    longitude: longitude.toString().split('.'),
    latitude: latitude.toString().split('.')
  }
}

function fib(n) {
  if (n < 1) return 0
  if (n <= 2) return 1
  return fib(n - 1) + fib(n - 2)
}

function formatLeadingZeroNumber(n, digitNum = 2) {
  n = n.toString()
  const needNum = Math.max(digitNum - n.length, 0)
  return new Array(needNum).fill(0).join('') + n
}

function formatDateTime(date, withMs = false) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  const ms = date.getMilliseconds()

  console.log(year)
  let ret = [year, month, day].map(value => formatLeadingZeroNumber(value, 2)).join('-') +
    ' ' + [hour, minute, second].map(value => formatLeadingZeroNumber(value, 2)).join(':')
  if (withMs) {
    ret += '.' + formatLeadingZeroNumber(ms, 3)
  }
  return ret
}
// 给时间个位数前加0
function changeTime(date){
  if(date>10){
    return date
  }else {
    return '0'+date
  }
}
function formatDateTimes(date, withMs = false) {
  const year = new Date(date).getFullYear()
  const month = new Date(date).getMonth() + 1
  const day = new Date(date).getDate()
  const hour = new Date(date).getHours()
  const minute = new Date(date).getMinutes()
  const second = new Date(date).getSeconds()
  const now = new Date();
  const nowYear = now.getFullYear()
  const nowMonth = now.getMonth() + 1
  const nowDay = now.getDate()
  const nowHour = now.getHours()
  const nowMinute = now.getMinutes()
  const nowSecond = now.getSeconds()
  if (year == nowYear) {
    if(month==nowMonth) {
      //当月的同一天
      if(day==nowDay) {
        if(hour==nowHour) {
          if(minute==nowMinute){
            return "刚刚"
          }else {
            return (nowMinute-minute)+"分钟前"
          }
        }else {
          return (nowHour - hour) + "小时前"
        } 
      } else {
        if((nowDay - day) > 3){
          return year + "年" + month + "月" + day + "日 " + changeTime(hour) + ':' + changeTime(minute) + ':' +changeTime(second)
        }else{
          return (nowDay - day) + "天前"
        }
      }
    }else {
      return year + "年" + month + "月" + day + "日 " + changeTime(hour) + ':' + changeTime(minute) + ':' +changeTime(second)
    }
  } else {
    return year + "年" + month + "月" + day + "日 " + changeTime(hour) + ':' + changeTime(minute) + ':' +changeTime(second)
  }
}

function compareVersion(v1, v2) {
  v1 = v1.split('.')
  v2 = v2.split('.')
  const len = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i], 10)
    const num2 = parseInt(v2[i], 10)

    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }

  return 0
}

module.exports = {
  formatTime,
  formatLocation,
  fib,
  formatDateTime,
  compareVersion,
  formatDateTimes
}