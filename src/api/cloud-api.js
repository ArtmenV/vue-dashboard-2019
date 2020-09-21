import axios from 'axios'
import store from '@/store/index.js'
import createAuthRefreshInterceptor from 'axios-auth-refresh'
import baseUrl from './config.js'

// function for refreshing token
const refreshAuthLogic = err => axios.post(baseUrl + '/auth/v1/token/refresh',
    JSON.stringify({
      "refresh_token": store.state.user.refreshToken
    }),
    {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  .then(res => {
    store.dispatch('UpdateToken', res.data.token)
    err.response.config.headers['Authorization'] = 'bearer ' + res.data.token;
    return Promise.resolve();
  })
  .catch(error => {
    console.log('Error with refreshing token.')
    
    store.dispatch('LogOut')
    store.dispatch('FedLogOut')
    
    location.reload()
    throw error
  });

// refreshes token when gets 401 error
createAuthRefreshInterceptor(axios, refreshAuthLogic)

const SPPCloudApi = {
  /**
   * Returns a list of all servers matched the filter
   * @param {object} filter Filters
   * @param {int} pageNumber Number of page
   */
  async getServerList (filter, pageNumber) {
    let url = baseUrl + '/api/frontend/v1/server?' 
    
    if (filter.status && filter.status !== 'ALL') {
      if (filter.status === 'SYNC ON') {
        url += '&status=ONLINE'
      } else {
        url += '&status=OFFLINE'
      }
    }

    url += '&page=' + pageNumber

    if (filter.search) {
      url += '&search=' + encodeURIComponent(filter.search)
    }

    if (filter.group) {
      url += '&group=' + filter.group
    }
    
    let result = null

    const config = {
      headers: {'Authorization': "bearer " + store.getters.token}
    }

    await axios
      .get(url, config)
      .then(r => {
        result = r.data.result})
      .catch(error => {
        throw error
      })

    const list = {
      list: result.items,
      total: result.total_results,
      totalPages: result.total_pages,
      page: result.page,
    }

    return list
  },

  freshdeskAuth () {
    let url = baseUrl + '/freshdesk/auth'

    const config = {
      headers: {'Authorization': "bearer " + store.getters.token}
    }

    return axios
      .get(url, config)
  },

  /**
   * Returns full information about the server
   * @param {int} id Server's id
   */
  async getServerInfo (id) {
    let url = baseUrl + `/api/frontend/v1/server/${id}`

    let responce = null

    const config = {
      headers: {'Authorization': "bearer " + store.getters.token}
    }

    url = encodeURI(url)

    await axios
      .get(url, config)
      .then(r => responce = r.data.result)
      .catch(error => {
        throw error
      })

    let result = {
      id: responce.server_id,
      name: responce.name,
      hostName: responce.host_name,
      ip: responce.host_ip,
      status: responce.host_status,
      group: responce.host_groups,
      is_logging: responce.is_logging,
      logForwardingData: {
        log_forwarding: responce.log_forwarding.log_forwarding,
        log_forwarding_port: responce.log_forwarding.log_forwarding_port,
        log_forwarding_server: responce.log_forwarding.log_forwarding_server
      },
      actionFiles: {
        used: responce.action_files_used,
        available: responce.action_files_available
      },
      url_length_filter: responce.url_length_filter,
      whitelist: responce.whitelist,
      whitelist_canvas_blocker: responce.whitelist_canvas_blocker,
      whitelist_url_length_filter: responce.whitelist_url_length_filter,
      origin: responce,
    }

    if (result.is_logging) {
      // result.topFiveBlocks = responce.statistic.top_five_blocks.sort((a, b) => {return (a.blocks > b.blocks) ? -1 : 1})
      // result.totalThreatBlocked = responce.statistic.threats_blocked
      // result.loadAveragePlot = responce.statistic.server_usage_plot
      // result.loadAverage = responce.statistic.load_average
      // result.uptime = responce.statistic.uptime
      // result.lastSync = responce.statistic.last_sync
      // result.graph = responce.statistic.graph
      // result.os_info = responce.os_info ? responce.os_info : {}
    }
    return result
  },

  async getGraphicStatistic (id, hours) {
    let url = baseUrl + `/api/frontend/v1/server/${id}/statistic/${hours}`

    let responce = null

    const config = {
      headers: {'Authorization': "bearer " + store.getters.token}
    }

    url = encodeURI(url)

    await axios
      .get(url, config)
      .then(r => responce = r.data.result)
      .catch(error => {
        throw error
      })

      let result = {
        graph: responce.graph,
        last_sync: responce.last_sync,
        threats_blocked: responce.threats_blocked,
        isLogging: responce.is_logging
      }
    return result
  }, 

  /**
   * Returns a list of server with minimal information about
   * each server. Used for showing servers in dropdown lists.
   */
  async getShortServerList () {
    let url = baseUrl + '/api/frontend/v1/server/?short=true'

    let result = null

    const config = {
      headers: {'Authorization': "bearer " + store.getters.token}
    }
    
    url = encodeURI(url)

    await axios
      .get(url, config)
      .then(r => result = r.data.result)
      .catch(error => {
        throw error
      })
    
    return result.items
  },

  /**
   * Returns a list of all groups matched the filter
   * @param {object} filter Filters
   * @param {int} pageNumber Page number
   */
  async getGroupList (filter, pageNumber) {
    let url = baseUrl + '/api/frontend/v1/server-group?itemsPerPage=10&page=' + pageNumber

    if (filter.search) {
      url += '&search=' + encodeURIComponent(filter.search)
    }

    let result = null

    const config = {
      headers: {'Authorization': "bearer " + store.getters.token}
    }

    await axios
      .get(url, config)
      .then(r => result = r.data.result)
      .catch(error => {
        throw error
      })
    
    return result
  },

  /**
   * Returns full information about the group
   * @param {int} id Server group id
   */
  async getGroupInfo (id) {
    let url = baseUrl + '/api/frontend/v1/server-group/' + id
    let result = null

    const config = {
      headers: {'Authorization': "bearer " + store.getters.token}
    }

    url = encodeURI(url)

    await axios
      .get(url, config)
      .then(r => result = r.data.result)
      .catch(error => {
        throw error
      })
    
    return result
  },

  /**
   * Returns a list of action files
   * @param {object} filter Filters
   * @param {int} pageNumber Page number
   */
  async getActionFilesList (filter, pageNumber) {
    let url = baseUrl + `/api/frontend/v1/block-list?page=${pageNumber}&search=${filter.search}` 
    
    let result = null

    const config = {
      headers: {'Authorization': "bearer " + store.getters.token},
      withCredentials: true
    }

    await axios
      .get(url, config)
      .then(r => result = r.data.result)
      .catch(error => {
        throw error
      })

    return result
  },

  /**
   * Returns full information about the file with given id.
   * @param {int} id Action file's id
   */
  async getActionFileInfo (id) {
    let url = baseUrl + '/api/frontend/v1/action-file/' + id
    
    let result = null

    const config = {
      headers: {'Authorization': "bearer " + store.getters.token}
    }

    url = encodeURI(url)

    await axios
      .get(url, config)
      .then(r => result = r.data.result)
      .catch(error => {
        throw error
      })
    
    return result
  },

  /**
   * Returns list of all groups with minimal information
   * about each group. Used for showing groups in dropdown
   */
  async getShortGroupList () {
    let url = baseUrl + '/api/frontend/v1/server-group/?short=true'

    let result = null

    const config = {
      headers: {'Authorization': "bearer " + store.getters.token}
    }
    
    url = encodeURI(url)

    await axios
      .get(url, config)
      .then(r => result = r.data.result)
      .catch(error => {
        throw error
      })
    
    return result.items
  },

  /**
   * Sends settings specified in `payload` to backend.
   * @param {ind} serverId Server's id
   * @param {object} payload Chagned settings
   */
  async setServerSyncSettings (serverId, payload) {

    let url = baseUrl + `/api/frontend/v1/server/${serverId}/settings`

    let result = null

    const config = {
      headers: 
        {
          'Authorization': "bearer " + store.getters.token,
          'Content-Type': 'application/json'
        }
    }

    url = encodeURI(url)

    await axios
      .put(url, JSON.stringify(payload), config)
      .then(response => {
        result = response
      })
      .catch(error => {
        throw error
      })
    
    return result
  },

  async setServerSettings (serverId, payload) {
    let url = baseUrl + '/api/frontend/v1/server/' + serverId

    let result = null

    const config = {
      headers: 
        {
          'Authorization': "bearer " + store.getters.token,
          'Content-Type': 'application/json'
        }
    }

    url = encodeURI(url)

    await axios
      .patch(url, JSON.stringify(payload), config)
      .then(response => {
        result = response
      })
      .catch(error => {
        throw error
      })
    
    return result
  },

  ///new endpoints for actions
  async setServerActionFiles (serverId, payload) {
    let url = baseUrl + `/api/frontend/v1/server/${serverId}/action-files`

    let result = null

    const config = {
      headers: 
        {
          'Authorization': "bearer " + store.getters.token,
          'Content-Type': 'application/json'
        }
    }

    url = encodeURI(url)

    await axios
      .patch(url, JSON.stringify(payload), config)
      .then(response => {
        result = response
      })
      .catch(error => {
        throw error
      })
    
    return result
  },

  async setServerSynchronization (serverId, payload) {
    let url = baseUrl + `/api/frontend/v1/server/${serverId}/synchronization`

    let result = null

    const config = {
      headers: 
        {
          'Authorization': "bearer " + store.getters.token,
          'Content-Type': 'application/json'
        }
    }

    url = encodeURI(url)

    await axios
      .patch(url, JSON.stringify(payload), config)
      .then(response => {
        result = response
      })
      .catch(error => {
        throw error
      })
    
    return result
  },

  /**
   * Sends action file's settings specified in `payload` to
   * backend.
   * @param {int} fileId Action file's id
   * @param {object} payload Changed settings
   */
  async setActionFileSettings (fileId, payload) {
    let url = baseUrl + '/api/frontend/v1/action-file/' + fileId

    let result = null

    const config = {
      headers: 
        {
          'Authorization': "bearer " + store.getters.token,
          'Content-Type': 'application/json'
        }
    }

    url = encodeURI(url)

    await axios
      .patch(url, JSON.stringify(payload), config)
      .then(response => {
        result = response
        console.log(response)
      })
      .catch(error => {
        throw error
      })
    
    return result
  },

  /**
   * Sends whitelist's settings specified in `payload` to
   * backend.
   * @param {int} fileId Whitelist's id
   * @param {object} payload Changed settings
   */
  async setWhitelist (fileId, payload) {
    let url = baseUrl + '/api/frontend/v1/action-file/' + fileId

    let result = null

    const config = {
      headers: 
        {
          'Authorization': "bearer " + store.getters.token,
          'Content-Type': 'application/json'
        }
    }

    url = encodeURI(url)

    await axios
      .patch(url, JSON.stringify({data: payload}), config)
      .then(response => {
        result = response
        console.log(response)
      })
      .catch(error => {
        throw error
      })
    
    return result
  },

  /**
   * Sends server group's settings specified in `payload`
   * to backend.
   * @param {int} groupId Server group's id
   * @param {object} payload Changed settings
   */
  async setServerGroupSettings (groupId, payload) {
    let url = baseUrl + '/api/frontend/v1/server-group/' + groupId

    let result = null

    const config = {
      headers: 
        {
          'Authorization': "bearer " + store.getters.token,
          'Content-Type': 'application/json'
        }
    }

    url = encodeURI(url)

    await axios
      .patch(url, JSON.stringify(payload), config)
      .then(response => {
        result = response
      })
      .catch(error => {
        throw error
      })
    
    return result
  },

  /**
   * Sends to backend that user changed action file's version.
   * @param {int} fileId Action file's id
   * @param {int} version Selected version
   */
  async selectActionFileVersion (fileId, version) {
    // https://demo-sppapi.zimalab.com/api/frontend/v1/action-file/{id}/select-version/{versionNo}

    let url = baseUrl + '/api/frontend/v1/action-file/' + fileId + '/select-version/' + version
    let result
    const config = {
      headers: 
        {
          'Authorization': "bearer " + store.getters.token,
          'Content-Type': 'application/json'
        }
    }

    url = encodeURI(url)

    await axios
      .patch(url, JSON.stringify({}), config)
      .then(response => {
        result = response
        // console.log(response)
      })
      .catch(error => {
        throw error
      })
    
    return result
  },

  /**
   * Sends to backend an information about new server group.
   * 
   * Returns full information about new server group including
   * the id.
   * @param {object} payload New server group's name and
   * description (optional)
   */
  async createServerGroup (payload) {
    let url = baseUrl + '/api/frontend/v1/server-group'

    let result = null

    const config = {
      headers: 
        {
          'Authorization': "bearer " + store.getters.token,
          'Content-Type': 'application/json'
        }
    }

    url = encodeURI(url)

    await axios
      .post(url, JSON.stringify(payload), config)
      .then(response => {
        result = response
      })
      .catch(error => {
        throw error
      })
    
    return result
  },

  /**
   * Sends to backend an information about new action file.
   * 
   * Returns full information about new action file including
   * the id.
   * @param {object} payload New action file's name and
   * description (optional)
   */
  async createActionFile (payload) {
    let url = baseUrl + '/api/frontend/v1/block-list'

    let result = null

    const config = {
      headers: 
        {
          'Authorization': "bearer " + store.getters.token,
          'Content-Type': 'application/json'
        }
    }

    url = encodeURI(url)

    await axios
      .post(url, JSON.stringify(payload), config)
      .then(response => {
        result = response
      })
      .catch(error => {
        throw error
      })
    
    return result
  },

  async deleteActionFile (id) {
    let url = baseUrl + '/api/frontend/v1/action-file/' + id
    
    let result = null

    const config = {
      headers: {'Authorization': "bearer " + store.getters.token}
    }

    url = encodeURI(url)

    await axios
      .delete(url, config)
      .then(r => result = r.data.result)
      .catch(error => {
        throw error
      })
    
    return result
  },

  async deleteServerGroup (id) {
    let url = baseUrl + '/api/frontend/v1/server-group/' + id
    
    let result = null

    const config = {
      headers: {'Authorization': "bearer " + store.getters.token}
    }

    url = encodeURI(url)

    await axios
      .delete(url, config)
      .then(r => result = r.data.result)
      .catch(error => {
        throw error
      })
    
    return result
  },

  async validateServer (key) {
    let url = baseUrl + '/api/frontend/v1/server/validate/' + key

    let result = null

    const config = {
      headers: 
        {
          'Authorization': "bearer " + store.getters.token,
        }
    }

    url = encodeURI(url)

    await axios
      .post(url, '', config)
      .then(response => {
        result = response
      })
      .catch(error => {
        throw error
      })
    
    return result
  },

  async getTicketList (filter, pageNumber) {
    let url = baseUrl + '/api/frontend/v1/ticket?page=' + pageNumber

    if (filter.search) {
      url += '&search=' + encodeURIComponent(filter.search)
    }

    let result = null

    const config = {
      headers: {'Authorization': "bearer " + store.getters.token}
    }

    await axios
      .get(url, config)
      .then(r => result = r.data.result)
      .catch(error => {
        throw error
      })
    
    return result
  },

  async getTicketInfo (id) {
    let url = baseUrl + '/api/frontend/v1/ticket/' + id

    let result = null

    const config = {
      headers: {
        'Authorization': "bearer " + store.getters.token,
      }
    }

    url = encodeURI(url)

    await axios
      .get(url, JSON.stringify({}), config)
      .then(response => {
        result = response
      })
    
    return result
  },

  async createTicket (payload) {
    let url = baseUrl + '/api/frontend/v1/ticket'

    let result = null

    const config = {
      headers: {
        'Authorization': "bearer " + store.getters.token,
        'Content-Type': 'application/json'
      }
    }

    url = encodeURI(url)

    await axios
      .post(url, JSON.stringify(payload), config)
      .then(response => {
        result = response
      })
      .catch(error => {
        throw error
      })
    
    return result
  },

  async getPlans () {
    let url = baseUrl + '/api/frontend/v1/plan'
    
    let result = null

    await axios
      .get(url)
      .then(r => result = r)
      .catch(error => {
        throw error
      })

    return result
  },

  async signup (payload) {
    let url = baseUrl + '/api/frontend/v1/subscribe'
    
    let result = null

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    await axios
      .post(url, JSON.stringify(payload), config)
      .then(response => {
        result = response
      })
      .catch(error => {
        throw error
      })
    
    return result
  },

  async getCompany () {
    let url = baseUrl + '/api/frontend/v1/client'
    
    let result = null

    const config = {
      headers: 
        {
          'Authorization': "bearer " + store.getters.token
        }
    }

    await axios
      .get(url, config)
      .then(r => result = r)
      .catch(error => {
        throw error
      })

    return result
  },

  async getUser () {
    let url = baseUrl + '/api/frontend/v1/user/me'
    
    let result = null

    const config = {
      headers: 
        {
          'Authorization': "bearer " + store.getters.token
        }
    }

    await axios
      .get(url, config)
      .then(r => result = r)
      .catch(error => {
        throw error
      })

    return result
  },

  async deleteServer (id) {
    let url = baseUrl + '/api/frontend/v1/server/' + id
    
    let result = null

    const config = {
      headers: {'Authorization': "bearer " + store.getters.token}
    }

    url = encodeURI(url)

    await axios
      .delete(url, config)
      .then(r => result = r.data.result)
      .catch(error => {
        throw error
      })
    
    return result
  },

  async unsubscribe () {
    let url = baseUrl + '/api/frontend/v1/unsubscribe'
    
    let result = null

    const config = {
      headers: {'Authorization': "bearer " + store.getters.token}
    }

    url = encodeURI(url)

    await axios
      .delete(url, config)
      .then(r => result = r.data.result)
      .catch(error => {
        throw error
      })
    
    return result
  },

  async updateSubscription (payload) {
    let url = baseUrl + '/api/frontend/v1/subscription'

    let result = null

    const config = {
      headers: 
        {
          'Authorization': "bearer " + store.getters.token,
          'Content-Type': 'application/json'
        }
    }

    url = encodeURI(url)

    await axios
      .patch(url, JSON.stringify(payload), config)
      .then(response => {
        result = response
      })
      .catch(error => {
        throw error
      })
    
    return result
  },

  async resubscribe (payload) {
    let url = baseUrl + '/api/frontend/v1/subscription?resubscribe=true'

    let result = null

    const config = {
      headers: 
        {
          'Authorization': "bearer " + store.getters.token,
          'Content-Type': 'application/json'
        }
    }

    url = encodeURI(url)

    await axios
      .patch(url, JSON.stringify(payload), config)
      .then(response => {
        result = response
      })
      .catch(error => {
        throw error
      })
    
    return result
  },

  async updateUserInfo (data, endurl) {
    let url = baseUrl + '/api/frontend/v1/' + endurl

    let result = null

    const config = {
      headers: {
        'Authorization': "bearer " + store.getters.token,
        'Content-Type': 'application/json'
      },
      mode: 'no-cors'
    }

    url = encodeURI(url)

    await axios
      .patch(url, data, config)
      .then(response => {
        result = response
      })
      .catch(error => {
        throw error
      })
    
    return result
  },

  async getSubscriptions () {
    let url = baseUrl + '/api/frontend/v1/plan?onlyUp=true'
    
    let result = null

    const config = {
      headers: 
        {
          'Authorization': "bearer " + store.getters.token
        }
    }

    await axios
      .get(url, config)
      .then(r => result = r)
      .catch(error => {
        throw error
      })

    return result
  },

  async updateCompany (payload) {
    let url = baseUrl + '/api/frontend/v1/client'

    let result = null

    const config = {
      headers: 
        {
          'Authorization': "bearer " + store.getters.token,
          'Content-Type': 'application/json'
        }
    }

    url = encodeURI(url)

    await axios
      .patch(url, JSON.stringify(payload), config)
      .then(response => {
        result = response
      })
      .catch(error => {
        throw error
      })
    
    return result
  },

  async updateMaxUrlLength(serverId, payload) {
    let url = baseUrl + `/api/frontend/v1/server/${serverId}/length-filter`

    let result = null

    const config = {
      headers: 
        {
          'Authorization': "bearer " + store.getters.token,
          'Content-Type': 'application/json'
        }
    }

    url = encodeURI(url)

    await axios
      .patch(url, JSON.stringify(payload), config)
      .then(response => {
        result = response
      })
      .catch(error => {
        throw error
      })
    
    return result
  },

  async getCloudFiles () {
    let url = baseUrl + '/api/frontend/v1/block-list/?cloudOnly=true'
    
    let result = null

    const config = {
      headers: {'Authorization': "bearer " + store.getters.token}
    }

    await axios
      .get(url, config)
      .then(r => result = r.data.result)
      .catch(error => {
        throw error
      })

    return result
  },

  async downloadActionFile (id, filename) {
    let url = baseUrl + '/api/frontend/v1/action-file/download/' + id

    const config = {
      headers: {
        'Authorization': "bearer " + store.getters.token
      }
    }

    await axios
      .get(url, config)
      .then(response => {
        const element = document.createElement('a')
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(response.data))
        element.setAttribute('download', filename + '.action')

        element.style.display = 'none'
        document.body.appendChild(element)

        element.click()

        document.body.removeChild(element)

        console.log(response.headers['content-destination'])
      })
      .catch(error => {
        throw error
      })
  },

  async forgotPasswordSendEmail (email) {
    let url = baseUrl + '/api/frontend/v1/user/forgot-pw-mail'

    let result = null

    const config = {
      headers: 
        {
          'Content-Type': 'application/json'
        }
    }

    url = encodeURI(url)

    const payload = {
      email: email
    }

    await axios
      .post(url, JSON.stringify(payload), config)
      .then(response => {
        result = response
      })
      .catch(error => {
        throw error
      })
    
    return result
  },

  async forgotPasswordSetPassword (newPass, secretKey) {
    let url = baseUrl + '/api/frontend/v1/user/forgot-pw-patch'

    let result = null

    const config = {
      headers: 
        {
          'Content-Type': 'application/json'
        }
    }

    url = encodeURI(url)

    const payload = {
      forgotPasswordUid: secretKey,
      password: newPass
    }

    await axios
      .patch(url, JSON.stringify(payload), config)
      .then(response => {
        result = response
      })
      .catch(error => {
        throw error
      })
    
    return result
  },

  async getTemplatesList (filter, pageNumber) {
    let url = baseUrl + '/api/frontend/v1/template?page=' + pageNumber

    if (filter.search) {
      url += '&search=' + encodeURIComponent(filter.search)
    }

    let result = null

    const config = {
      headers: {'Authorization': "bearer " + store.getters.token}
    }

    await axios
      .get(url, config)
      .then(r => result = r.data.result)
      .catch(error => {
        throw error
      })
    
    return result
  },

  async createTemplate (payload) {
    let url = baseUrl + '/api/frontend/v1/template'

    let result = null

    const config = {
      headers: 
        {
          'Authorization': "bearer " + store.getters.token,
          'Content-Type': 'application/json'
        }
    }

    url = encodeURI(url)

    await axios
      .post(url, JSON.stringify(payload), config)
      .then(response => {
        result = response
      })
      .catch(error => {
        throw error
      })
    
    return result
  },

  async deleteTemplate (id) {
    let url = baseUrl + '/api/frontend/v1/template/' + id
    
    let result = null

    const config = {
      headers: {'Authorization': "bearer " + store.getters.token}
    }

    url = encodeURI(url)

    await axios
      .delete(url, config)
      .then(r => result = r.data.result)
      .catch(error => {
        throw error
      })
    
    return result
  },

  async getTemplate (id) {
    let url = baseUrl + '/api/frontend/v1/template/' + id

    let result = null

    const config = {
      headers: {
        'Authorization': 'bearer ' + store.getters.token
      }
    }

    url = encodeURI(url)

    await axios
      .get(url, config)
      .then(response => {
        result = response
      })
    
    return result
  },

  async updateTemplate (serverId, payload) {
    let url = baseUrl + '/api/frontend/v1/template/' + serverId

    let result = null

    const config = {
      headers: {
        'Authorization': "bearer " + store.getters.token,
        'Content-Type': 'application/json'
      }
    }

    url = encodeURI(url)

    await axios
      .patch(url, JSON.stringify(payload), config)
      .then(response => {
        result = response
      })
      .catch(error => {
        throw error
      })
    
    return result
  },
}

export default SPPCloudApi