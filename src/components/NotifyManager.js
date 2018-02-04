export default class NotifyManager {
    static subscribePush () {
        if (!('PushManager' in window)) return false
        // Get `push notification` subscription
        navigator.serviceWorker.ready.then(function (registration) {
            registration.pushManager.getSubscription()
                .then((subscription) => {
                    console.log('sub', subscription)
                    if (subscription) return true
                    registration.pushManager.subscribe({
                        // Always show notification when received
                        userVisibleOnly: true
                    })
                        .then(function (subscription) {
                            console.info('Push notification subscribed.', subscription)
                            return true
                        })
                        .catch(function (e) {
                            console.error('Push notification subscription error: ', e)
                            return false
                        })
                })
                .catch((e) => {
                    console.error('Error occurred while getSubscription()', e)
                    return false
                })
        })
    }
}
