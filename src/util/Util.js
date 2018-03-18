export default class Util {
    static errHandler (e, msg = '') {
        console.error(`${msg || ''}\n${e}`)
        let event = new CustomEvent('err', {detail: {title: msg, message: e.message}})
        window.dispatchEvent(event)
    }

    static getSize (bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes'
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
        let i = Math.floor(Math.log(bytes) / Math.log(1024))
        return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(decimals))} ${sizes[i]}`
    }

    static getToday () {
        let now = new Date()
        let year = now.getFullYear().toString()
        let month = (now.getMonth() + 101).toString().substring(1)
        let day = (now.getDate() + 100).toString().substring(1)
        return `${year}-${month}-${day}`
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
        if (download) link.download = download
        link.target = '_blank'
        link.href = url
        // link.click()
        link.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window}))
        link.remove()
    }

    static hslToRgb (h, s, l) {
        if (isNaN(h)) return 'transparent'
        let r, g, b

        if (s === 0) r = g = b = l
        else {
            let hue2rgb = function hue2rgb (p, q, t) {
                if (t < 0) t += 1
                if (t > 1) t -= 1
                if (t < 1 / 6) return p + (q - p) * 6 * t
                if (t < 1 / 2) return q
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
                return p
            }
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s
            var p = 2 * l - q
            r = hue2rgb(p, q, h + 1 / 3)
            g = hue2rgb(p, q, h)
            b = hue2rgb(p, q, h - 1 / 3)
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
    }

    static getFormatTime (start, end) {
        return [start, end, `${Math.floor(start / 60)}:${(100 + start % 60).toString().substring(1)} - ${Math.floor(end / 60)}:${(100 + end % 60).toString().substring(1)}`]
    }
}
