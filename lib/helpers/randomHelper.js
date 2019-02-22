'use strict'

class RandomHelper {

  static GetRandomString(string) {
    let d = new Date()
    let dateStr = d.getFullYear().toString() + (parseInt(d.getMonth()) + 1) + d.getDate() + d.getHours() + d.getMinutes() + d.getSeconds()
    return string + dateStr + Math.floor((Math.random() * 100) + 1)
  }

  // gets hh:mm (AM|PM)
  // returns hh:mm:ss.000-05:00
  static GetDateTimeString () {
    let curDate = new Date()
    let nowYear = curDate.getFullYear()
    let nowDate = curDate.getDate()
    let nowMonth = curDate.getMonth() + 1
    let nowHours = curDate.getHours()
    let nowMinutes = curDate.getMinutes()
    let nowSeconds = curDate.getSeconds()
    let nowMilliseconds = curDate.getMilliseconds()
    if (nowDate.length === 1) {
      nowDate = '0' + nowDate
    }
    if (nowMonth.length === 1) {
      nowMonth = '0' + nowMonth
    }
    if (nowHours.length === 1) {
      nowHours = '0' + nowHours
    }
    if (nowMinutes.length === 1) {
      nowMinutes = '0' + nowMinutes
    }
    if (nowSeconds.length === 1) {
      nowSeconds = '0' + nowSeconds
    }
    if (nowMilliseconds.length === 1) {
      nowMilliseconds = '00' + nowMilliseconds
    }
    if (nowMilliseconds.length === 2) {
      nowMilliseconds = '0' + nowMilliseconds
    }
    return nowYear + '-' + nowMonth + '-' + nowDate + 'T'+ nowHours + ':' + nowMinutes + ':' + nowSeconds + '.' + nowMilliseconds
  }

}

module.exports = RandomHelper