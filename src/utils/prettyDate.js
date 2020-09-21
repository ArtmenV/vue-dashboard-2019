export default function prettyDate (dateISO, format) {
  if (!dateISO) {
    return ''
  } else {
    const date = new Date(dateISO)
  
    const day = (date.getDate() < 10 ? '0' : '' ) + date.getDate()
    const month = (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1)
    const year = date.getFullYear()
  
    const hours = (date.getHours() < 10 ? '0' : '' ) + date.getHours()
  
    const minutes = (date.getMinutes() < 10 ? '0' : '' ) + date.getMinutes()
  
    const seconds = (date.getSeconds() < 10 ? '0' : '' ) + date.getSeconds()
  
    let pretty = day + '.' + month + '.' + year + ' ' + hours + ':' + minutes
  
    if (format === 's') {
      pretty += ':' + seconds
    }
  
    return pretty
  }
}