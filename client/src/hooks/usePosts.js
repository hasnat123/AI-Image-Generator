import { useEffect, useState } from "react"
import { getPosts } from "../api/axios"

const usePosts = (pageNum = 1, baseUrl, searchText) => {
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState({})
  const [hasNextPage, setHasNextPage] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    setIsError(false)
    setError({})
    let timeoutId
    const controller = new AbortController()
    const { signal } = controller

    const delayedGetPosts = () => {
      timeoutId = setTimeout(() => {
        getPosts(pageNum, baseUrl, searchText, { signal })
          .then(data => {
            setIsLoading(false)
            setResults(prev => [...prev, ...data])
            setHasNextPage(Boolean(data.length))
          })
          .catch(err => {
            setIsLoading(false)
            if (signal.aborted) return
            setIsError(true)
            setError({ message: err.message })
          })
      }, 1000)
    }

    delayedGetPosts()

    return () => {
      clearTimeout(timeoutId)
      controller.abort()
    }
  }, [pageNum, baseUrl, searchText])

  useEffect(() => {
    setResults([])
  }, [baseUrl, searchText])

  return { isLoading, isError, error, results, hasNextPage }
}

export default usePosts