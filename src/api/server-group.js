import baseUrl from './config.js'
import store from '@/store/index.js'
import axios from 'axios'

const serverGroupApi = {
  /**
   * Returns server group collection with basic info about each
   * server group.
   * 
   * @async
   * @param {string} searchStr Search query
   * @param {int} pageNumber Page number
   */
  async getGroupList (searchStr, pageNumber) {
    let url = 'http://5.130.20.24:980/api/v1/server-group?page=' + pageNumber
    let responce = null

    if (searchStr) {
      url += '&search=' + searchStr
    }

    const config = {
      headers: {'Authorization': "bearer " + store.getters.token}
    }

    await axios
      .get(url, config)
      .then(r => responce = r.data.result)
      .catch(error => console.log(error))

    const hardcodedData = [
      {
        id: 0,
        name: 'Sample group',
        description: 'Just sample group for testing'
      },
      {
        id: 1,
        name: 'Zimalab',
        description: ':)'
      },
      {
        id: 2,
        name: 'Best company',
        description: 'For different networks in one good company'
      },
      {
        id: 3,
        name: 'Not the best company',
        description: ''
      },
      {
        id: 4,
        name: 'College',
        description: 'Love it but it has to have censored internet connection'
      }        
    ]
    console.log(responce)
    return responce
  },

  /**
   * Returns full information about server group with given id
   * 
   * @async
   * @param {int} id 
   */
  async getGroupInfo (id) {
    const url = 'http://5.130.20.24:980/api/v1/server-group/' + id
    let responce = null

    const config = {
      headers: {'Authorization': "bearer " + store.getters.token}
    }

    await axios
      .get(url, config)
      .then(r => responce = r.data.result)
      .catch(error => console.log(error))

    const hardcodedData = {
      servers: [
        {
          id: 1,
          name: 'Zimalab'
        },
        {
          id: 2,
          name: 'Sample server'
        },
        {
          id: 3,
          name: 'Test server'
        }
      ],
      actionFileUsed: [
        {
          id: 1,
          name: 'yoyo.action'
        },
        {
          id: 2,
          name: 'default.action'
        }
      ],
      actionFileAvailable: [
        {
          id: 3,
          name: 'google.action'
        },
        {
          id: 4,
          name: 'ads.action'
        },
        {
          id: 5,
          name: 'porn.action'
        },
        {
          id: 6,
          name: 'social-networks.action'
        },
        {
          id: 7,
          name: 'youtube.action'
        }
      ],
      whitelist: [
        'yandex.ru',
        'facebook.com',
        'php.net',
        'example.com',
        'website.site',
        'stackoverflow.com',
        'blow.website'
      ]
    }

    return responce
  },

  async sendGroupSettings (group) {
    const url = baseUrl + '/todos/1'
    await fetch(url).then(responce => {
    })
  },

  async getAvailableGroups () {
    const url = baseUrl + '/todos/1'
    await fetch(url).then(responce => {
    })
  }
}

export default serverGroupApi