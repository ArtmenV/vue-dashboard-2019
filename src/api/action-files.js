import base_url from './config.js'
import store from '@/store/index.js'
import axios from 'axios'

const actionFileApi = {
  getDescription () {
    return 'kyky'
  },

  async getList (filter, pageNumber) {
    let url = 'http://5.130.20.24:980/api/v1/block-list/?page=' + pageNumber


    if (filter.search) {
      url += '&search=' + searchStr
    }

    const config = {
      headers: {'Authorization': "bearer " + store.getters.token}
    }

    let responce
    await axios
      .get(url, config)
      .then(r => responce = r.data.result)
      .catch(error => console.log(error))

    const hardcoded = {
      total: 10,
      total_pages: 1,
      items: [
        {
          block_list_id: 0,
          name: 'some',
          description: 'descr',
          latest_version: '123123123',
          latest_version_date: '213143314',
          selected_version: '123123124',
          selected_version_date: '123123123'
        }
      ]
    }

    return responce
  },

  async getActionFile (id) {
    let url = 'http://5.130.20.24:980/api/v1/action-file/' + id

    const config = {
      headers: {'Authorization': "bearer " + store.getters.token}
    }

    let responce
    await axios
      .get(url, config)
      .then(r => responce = r.data.result)
      .catch(error => console.log(error))
    
    return responce
  }
}

export default actionFileApi