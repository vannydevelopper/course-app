import { useEffect, useState } from "react"
import fetchApi from "../helpers/fetchApi"

/**
 * le hook pour récuperer les données lorsque le component monte
 * @param {string} url l'url à appeler (GET)
 * @returns {Array} un tableau contenant [les donnes, le loading, le setDonnes]
 */
export default function useFetch(url) {
          const [state, setState] = useState({
                    loading: true,
                    items: []
          })
          useEffect(() => {
                    (async () => {
                              try {
                                        const data = await fetchApi(url)
                                        setState({
                                                  loading: false,
                                                  items: data
                                        })
                              } catch (error) {
                                        console.log(error)
                                        setState({
                                                  loading: false,
                                                  items: []
                                        })
                              }
                    })()
          }, [url])
          return [state.loading, state.items, setState]
}