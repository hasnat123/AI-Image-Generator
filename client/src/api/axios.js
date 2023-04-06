import axios from 'axios'

export const getPosts = async (pageParam = 1, baseUrl, searchText, options = {}) =>
{
    const encodedSearchText = encodeURIComponent(searchText)
    const res = await axios.get(`api/v1/post/${baseUrl}?page=${pageParam}&search=${encodedSearchText}`, { withCredentials: true })
    return res.data.data
}