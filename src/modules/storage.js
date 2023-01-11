export const setStorage = (key, value) => localStorage.setItem(key, JSON.stringify(value))

export const getStorage = (key, fallbackValue) => {
    let value = localStorage.getItem(key)
    if (value) value = JSON.parse(value)
    else if (fallbackValue) {
        value = fallbackValue
        setStorage(key, value)
    }
    return value;
}

const removeStorage = key => localStorage.removeItem(key)

export const resetStorage = () => {
    removeStorage('name')
    removeStorage('notes')
    removeStorage('csrf')
}