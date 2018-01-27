export default class Util {
    static errHandler (e, msg = '') {
        console.error(`${msg || ''}\n${e}`)
    }

    static getSize (bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes'
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
        let i = Math.floor(Math.log(bytes) / Math.log(1024))
        return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(decimals))} ${sizes[i]}`
    }

    static dayDiff (time) {
        let old = new Date(time)
        let now = Date().now
        let timeDiff = Math.abs(now - old)
        return timeDiff < 1000 * 3600 * 24 * 200
    }

    static copyToClipboard (content) {
        let container = document.createElement('div')
        document.body.appendChild(container)
        container.innerHTML = content
        window.getSelection().removeAllRanges()
        let range = document.createRange()
        range.selectNode(container)
        window.getSelection().addRange(range)
        let successful = document.execCommand('copy', false)
        container.remove()
        return successful
    }

    static openLink (url, download) {
        let link = document.createElement('a')
        if (download) link.download = true
        link.target = '_blank'
        link.href = url
        link.click()
        link.remove()
    }

    static getCookie (name) {
        let match = document.cookie.split(';').find(x => x.startsWith(`${name}=`))
        if (match) return match.split('=')[1]
    }
}
