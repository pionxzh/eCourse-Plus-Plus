export default class Util {
    static errHandler (e, msg = '') {
        console.error(`${msg || ''}\n${e}`)
    }

    static getSize (bytes) {
        if (bytes === 0) return '0 Byte'
        let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
        let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
        return `${Math.round(bytes / Math.pow(1024, i), 2)} ${sizes[i]}`
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
}
