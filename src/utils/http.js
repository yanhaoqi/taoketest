import axios from 'axios';

export default {
  get: (url, options) => {
    let abort = null
    const abortPromise = new Promise((resolve, reject) => {
      abort = () => {
        reject('http abort')
      }
    })
    const httpPromise = axios.get(url, {headers: {token: localStorage.getItem('token')}})
    const promise = Promise.race([abortPromise, httpPromise])
    promise.abort = abort
    promise.catch((d) => {
      if (d.response.status === 403) {
        window.$router.push('/login')
      }
    })
    return promise
  },
  post: (url, options) => {
    var params = new URLSearchParams();
    // params.append('param', JSON.stringify(options))
    // axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
    let arr = []
    for (let key in options) {
      arr.push(key + '=' + options[key])
    }
    let paramStr = arr.join('&')
    if(localStorage.getItem('token')) {
      return axios.post(url, paramStr, {headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8', 'token': localStorage.getItem('token')}})
    } else {
      return axios.post(url, paramStr, {headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'}})
    }
  }
}
