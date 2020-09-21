import store from '@/store/index.js'
import axios from 'axios'

const serverApi = {
  async getServerList (filters, pageNumber) {
    console.log('raz')

    let url = 'http://5.130.20.24:980/api/v1/server?itemsPerPage=10' 
    
    url += '&status=' + filters.status

    if (filters.search) {
      url += '&search=' + filters.search
    }

    if (pageNumber) {
      url += '&page=' + pageNumber
    }

    url = encodeURI(url)

    let responce = null

    const config = {
      headers: {'Authorization': "bearer " + store.getters.token}
    }
    await axios
      .get(url, config)
      .then(r => responce = r.data.result)
      .catch(error => { console.log(error) })

    const result = {
      list: responce.items,
      total: responce.total_results,
      totalPages: responce.total_pages,
      page: responce.page,
    }

    return result
  },

  async getServerInfo (id) {
    let url = 'http://5.130.20.24:980/api/v1/server/' + id

    let responce = null

    const config = {
      headers: {'Authorization': "bearer " + store.getters.token}
    }

    await axios
      .get(url, config)
      .then(r => responce = r.data.result)
      .catch(error => console.log(error))

    let result = {
      id: responce.server_id,
      name: responce.name,
      ip: responce.host_ip,
      status: responce.host_status,
      group: responce.host_groups,
      loadAverage: responce.load_average,
      uptime: responce.uptime,
      lastSync: responce.last_sync,
      totalThreatBlocked: responce.threats_blocked,
      loadAveragePlot: responce.server_usage_plot,
      actionFiles: {
        used: responce.action_files_used,
        available: responce.action_files_available
      },
      whitelist: responce.whitelist,
      topFiveBlocks: responce.top_five_blocks.sort((a, b) => {return (a.blocks > b.blocks) ? -1 : 1})
    }

    console.log(result)

    return result
  }
}

export default serverApi