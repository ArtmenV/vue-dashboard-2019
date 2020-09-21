function handleError (_this, error) {
  let message = ''
  if (typeof error === 'string') {
    return _this.$message({
      type: 'error',
      message: error,
      showClose: true,
      duration: 0,
      offset: 100,
      iconClass: ''
    })
  }

  if (error.response === undefined) {
    return _this.$message({
      type: 'error',
      message: error.message,
      showClose: true,
      duration: 0,
      iconClass: ''
    })
  }

  const errorData = error.response.data
  const errorCode = errorData.status_code
  const url = error.response.config.url
  console.log(JSON.parse(JSON.stringify(error)))

  function getResource () {
    if (url.indexOf('/server/') !== -1) {
      return 'server'
    } else if (url.indexOf('/server-group/') !== -1) {
      return 'server group'
    } else if (url.indexOf('/action-file/') !== -1) {
      return 'action file'
    } else {
      return 'resource'
    }
  }

  switch (errorCode) {
    case 404:
      message = 'Requested ' + getResource() + ' not found or you don\'t have access to it.'
      break
    
    case 403:
      const resource = getResource()
      if (resource === 'resource') {
        message = 'Access denied. '

        if (errorData.messages) {
          if (errorData.messages[0].context) {
            message += errorData.messages[0].context.reason
          }
        }
      } else {
        if (errorData.messages) {
          if (errorData.messages[0].context) {
            message += errorData.messages[0].context.reason
          }
        } else {
          message = `You can't create ${resource} with your plan. To create ${resource} please upgrade your plan in account settings.`
        }
      }
      break

    case 400:
      try {
        message = error.response.data.messages[0].context.reason
      } catch (e) {
        message = 'Bad request'
      }
      break

    case 500:
      message = 'Internal server error'
      break

    default:
      message = 'Something went wrong'
  }

  return _this.$message({
    type: 'error',
    message: message,
    showClose: true,
    duration: 0,
    iconClass: ''
  })
}

export default handleError