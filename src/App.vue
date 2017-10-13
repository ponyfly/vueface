<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import './style/reset.styl'
  @import './style/mixin.styl'
  #app
    wh(750px, 100%)
    min-height 100%
    margin 0 auto
    position relative
</style>
