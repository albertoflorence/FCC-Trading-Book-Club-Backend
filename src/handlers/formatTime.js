const arr = [1000, 60, 60, 24, 7, 4, 12]
const names = ['millisecond', 'second', 'minute', 'hour', 'day', 'week', 'mounth', 'year'] 
const formatTime = (time, i=0) => {
  if (isNaN(i)) i = names.indexOf(i)
  const cur = arr[i]
  if ( time >= cur && cur !== undefined) {
    return formatTime(time / cur, i+1)
  } else {
    let plural = ''
    time = parseInt(time)
    if (time > 1) plural = 's'
    return time + ' ' + names[i] + plural
  }
}
module.exports = formatTime
