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
    let newMinutes = curDate.getMinutes()
    let newSeconds = curDate.getSeconds()
    if (nowDate.length === 1) {
      nowDate = '0' + nowDate
    }
    if (nowMonth.length === 1) {
      nowMonth = '0' + nowMonth
    }
    if (nowHours.length === 1) {
      nowHours = '0' + nowHours
    }
    if (newMinutes.length === 1) {
      newMinutes = '0' + newMinutes
    }
    if (newSeconds.length === 1) {
      newSeconds = '0' + newSeconds
    }
    return nowYear + '-' + nowMonth + '-' + nowDate + 'T'+ nowHours + ':' + newMinutes + ':' + newSeconds + '.' + curDate.getMilliseconds()
  }

}

module.exports = RandomHelper