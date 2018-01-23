export default class Util {
    static errHandler (e, msg = '') {
        console.error(`${msg || ''}\n${e}`)
    }
}
