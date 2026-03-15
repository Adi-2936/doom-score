const BOOKMARKS_KEY = 'doomscore_bookmarks'
const READ_KEY = 'doomscore_read'

export const getBookmarks = () => {
    const data = localStorage.getItem(BOOKMARKS_KEY)
    return data ? JSON.parse(data) : []
}

export const toggleBookmark = (postId) => {
    const bookmarks = getBookmarks()
    const exists = bookmarks.includes(postId)
    const updated = exists
        ? bookmarks.filter(id => id !== postId)
        : [...bookmarks, postId]
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated))
    return !exists
}

export const isBookmarked = (postId) => {
    return getBookmarks().includes(postId)
}

export const getReadPosts = () => {
    const data = localStorage.getItem(READ_KEY)
    return data ? JSON.parse(data) : []
}

export const markAsRead = (postId) => {
    const read = getReadPosts()
    if (!read.includes(postId)) {
        const updated = [...read, postId]
        localStorage.setItem(READ_KEY, JSON.stringify(updated))
    }
}

export const isRead = (postId) => {
    return getReadPosts().includes(postId)
}