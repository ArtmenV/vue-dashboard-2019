import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/user/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export async function getInfo(token) {

  await void(0)

  return {
    data: {
      name: 'sample name',
      roles: ['admin', 'editor']
    }
  }
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
