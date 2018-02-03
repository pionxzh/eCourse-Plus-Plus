// install
self.addEventListener('install', event => {
    console.log('installing…')
})

// activate
self.addEventListener('activate', event => {
    console.log('now ready to handle fetches!')
})

// fetch
self.addEventListener('fetch', event => {
    console.log('now fetch!')
})
