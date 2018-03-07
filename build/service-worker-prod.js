(function () {
    'use strict';

    window.addEventListener('load', function () {
        if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
            navigator.serviceWorker.register('/service-worker.js')
                .then(function (registration) {
                    // updatefound is fired if service-worker.js changes.
                    registration.onupdatefound = function () {
                        // updatefound is also fired the very first time the SW is installed,
                        // and there's no need to prompt for a reload at that point.
                        // So check here to see if the page is already controlled,
                        // i.e. whether there's an existing service worker.
                        if (navigator.serviceWorker.controller) {
                            // The updatefound event implies that registration.installing is set
                            var installingWorker = registration.installing

                            installingWorker.onstatechange = function () {
                                switch (installingWorker.state) {
                                    case 'installed':
                                        if (navigator.serviceWorker.controller) {
                                            // At this point, the old content will have been purged and the fresh content will
                                            // have been added to the cache.
                                            console.log('New or updated content is available.');
                                            if(confirm('有新版本更新! 現在重新整理?')) location.reload()
                                        } else {
                                            // At this point, everything has been precached.
                                            console.log('Content is now available offline!');
                                        }
                                        break
                                    case 'redundant':
                                    console.error('The installing service worker became redundant.')
                                    default:
                                        // Ignore
                                }
                            }
                        }
                    }
                }).catch(function (e) {
                    console.error('Error during service worker registration:', e)
                })
        }
    })
})()
