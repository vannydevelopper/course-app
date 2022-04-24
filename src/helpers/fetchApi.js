// import AsyncStorage from "@react-native-async-storage/async-storage";
// import wait from "./wait";
const API_URL = 'http://prod.mediabox.bi:8202'
// const API_URL = 'http://app.mediabox.bi:6910'
// const API_URL = 'http://192.168.43.235:8080'
/**
 * consomer une api avec les options par défaut
 * @param {string} url - le lien à appeler
 * @param {object} options - autres options comme les headers et le body
 * @returns {Promise}
 */
 export default async function fetchApi (url, options = {}) {
          // const user = JSON.parse(localStorage.getItem('user'))
          /* const userF =  await AsyncStorage.getItem('user')
          const user = JSON.parse(userF) */
          // if (user) options = { ...options, headers: { ...options.headers } }
          const response = await fetch(API_URL+url, {
                    ...options
          })
          if (response.ok) {
                    return response.json()
          } else {
                    throw await response.json()
          }
}