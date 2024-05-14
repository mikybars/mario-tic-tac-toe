export const storage = {
  getObject(key) {
    const value = window.localStorage.getItem(key)
    if (value != null) {
      return JSON.parse(value)
    }
  },

  putObject(key, o) {
    return window.localStorage.setItem(key, JSON.stringify(o))
  }
}

export function shuffled(array) {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function noop() {}
