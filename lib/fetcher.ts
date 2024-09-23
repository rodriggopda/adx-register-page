export const api = {
  post: <T = void>(uri: string, body: T) => fetcher<T>(uri, 'POST', body)
}

type HttpMethods = 'GET' | 'POST'

const HttpStatus = {
  BAD_REQUEST: 400,
  CREATED: 200
}

export async function fetcher<T>(uri: string, method: HttpMethods = 'GET', body?: T) {
  return fetch(uri, {
    method: method,
    body: body !== undefined ? JSON.stringify(body) : null,
    headers: {
      'Content-Type': 'Application/json'
    }
  })
    .then((response) => {
      if (response.status == HttpStatus.BAD_REQUEST || response.status !== HttpStatus.CREATED) {
        throw response.json()
      }
      return Promise.resolve(response.json())
    })
    .catch(async (err) => {
      return Promise.reject(await err)
    })
}
