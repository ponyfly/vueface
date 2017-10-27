<template>
  <div id="chooseList">
    <div class="imglist">
      <ul>
        <li class="imgitem" v-for="photoItem in photoList">
          <img v-lazy="photoItem" alt="">
        </li>
      </ul>
    </div>
    <div class="bottom">
      <img src="../images/choose-btn-0.png" alt="">
      <i class="close"></i>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import axios from 'axios'
  import qs from 'querystring'
  import VueLazyload from 'vue-lazyload'
  import BScroll from 'better-scroll'

  Vue.use(VueLazyload, {
    preload: 1,
    loading: require('../images/loading.gif'),
    error: require('../images/404.jpg'),
    attempt: 3
  })

  export default {
    data () {
      return {
        photoList: []
      }
    },
    computed: {},
    methods: {
      getAjaxData(times = 4){
        const {API_header, uid, curTheme, postfield} = this.$route.params
        const config = {
          uid,
          themeId: curTheme.id,
          times,
          postfield
        }
        axios.post(`${API_header}/api/doChangeFaceWithTimes`, qs.stringify(config))
          .then( res => {
            if(res.data.errorCode === 0){
              let addPhotoList = res.data.responseList.map((item, index) => item.imgShare + '?imageView2/2/w/400/h/400')
              this.photoList = [...this.photoList, ...addPhotoList]
            }
          })
          .catch( err => {
            console.log('网络错误');
          })
      }
    },
    created() {
      this.getAjaxData(8)
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../style/mixin.styl"
  #chooseList
    height 100%
    .imglist
      height 100%
      background-color #fff
      margin 10px
      margin-bottom 125px
      overflow-y scroll
      &::-webkit-scrollbar {
        display none
      }
      ul
        width 100%
        display flex
        flex-wrap wrap
        align-content flex-start
        li.imgitem
          wh(360px, 360px)
          margin-bottom 10px
          overflow hidden
          text-align center
          line-height 360px
          &:nth-of-type(odd)
            margin-right 10px
          img[lazy=loading]
            wh(60px, 60px)
          img[lazy=error]
            wh(100%, 100%)
          img[lazy=loaded]
            width 100%
            border none
    .bottom
      position fixed
      bottom 0
      width 100%
      padding 20px 0
      background-color #fff
      text-align center
      font-size 0
      .close
        position absolute
        top 50%
        right 80px
        &:before, &:after
          position absolute
          content ''
          display inline-block
          wh(50px, 1px)
          background-color: #000;
          transform-origin 50% 50%
        &:before
          transform rotateZ(-45deg)
        &:after
          transform rotateZ(45deg)

</style>