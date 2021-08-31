let userAgent = navigator.userAgent //取得浏览器的userAgent字符串

export function getBrowserName() {
    if (userAgent.indexOf('Opera') > -1) {
        return 'Opera'
    }
    if (userAgent.indexOf('Firefox') > -1) {
        return 'Firefox'
    }
    if (userAgent.indexOf('Chrome') > -1) {
        return 'Chrome'
    }
    if (userAgent.indexOf('Safari') > -1) {
        return 'Safari'
    }
    if (!!window.ActiveXObject || 'ActiveXObject' in window) {
        return 'IE'
    }
}
