/*获取本地存储*/
function getLocalStorage (name) {
  if (!window.localStorage) {
    alert('您的浏览器不支持localstorage')
  } else {
    const val = window.localStorage.getItem(name)
    return val
  }
}
/*设置本地存储*/
function setLocalStorage (name, value) {
  if (!window.localStorage) {
    alert('您的浏览器不支持localstorage')
  } else {
    window.localStorage.setItem(name, value)
  }
}
/*删除单个数据*/
function removeLocalStorage (name) {
  if (!window.localStorage) {
    alert('您的浏览器不支持localstorage')
  } else {
    window.localStorage.removeItem(name)
  }
}
/*删除所有数据*/
function clearLocalStorage () {
  if (!window.localStorage) {
    alert('您的浏览器不支持localstorage')
  } else {
    window.localStorage.clear()
  }
}

export default {
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage,
  clearLocalStorage
}