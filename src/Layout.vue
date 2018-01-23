<template lang="pug">
    div#app
        transition(name=page mode="out-in")
            router-view
</template>

<style lang="stylus">
    @import './stylus/main'
</style>
