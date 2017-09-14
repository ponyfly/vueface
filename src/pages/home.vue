<template>
  <div id="home">
    <h1>我是home</h1>
    <div class="clearfix">
      <router-link to="/page1">page1</router-link>
      <router-link to="/page2">page2</router-link>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {}
    },
    computed: {},
    methods: {}
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../style/mixin.styl"
  #home
    sc(60px, #333)
    text-align center
  a
    float left
    wh(100px, 50px)
    sc(30px, #333)
    background-color #6fa
    overflow hidden
    margin 0 20px
</style>