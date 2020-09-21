import axios from 'axios'

export default async function refreshToken (token) {
  const url = 'http://5.130.20.24:980/auth/v1/token/refresh'
  let responce = null

  await axios
    .post(url, JSON.stringify({
        "refresh_token": token
      }),
      {
        headers: {
          'Content-Type': 'application/json'
        }
      })
    .then(r => responce = r)
    .catch(error => console.log(error))

  console.log(responce ? responce.data.token : 'something wrong')
  // state.commit
  return responce.data.token
}