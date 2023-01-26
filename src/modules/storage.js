export const setStorage = (key, value) => localStorage.setItem(key, JSON.stringify(value))

export const removeStorage = key => localStorage.removeItem(key)

export const getStorage = (key, fallbackValue) => {
    let value = localStorage.getItem(key)
    try {
        value = JSON.parse(value)
    } catch {
        if (fallbackValue) {
            value = fallbackValue
            setStorage(key, value)
        } else {
            value = null
            removeStorage(key)
        }
    }
    return value
}

export const resetStorage = () => {
    removeStorage('name')
    removeStorage('notes')
    removeStorage('csrf')
}