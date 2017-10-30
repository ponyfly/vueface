<template>
  <div id="chooseList">
    <div class="imglist" ref="ImgList" @click="checkPhoto">
      <ul>
        <li class="imgitem" v-for="(photoItem, index) in photoList" :class="{checked: index<=2}">
          <img v-lazy="photoItem" alt="">
        </li>
      </ul>
    </div>
    <div class="bottom">
      <img src="../images/choose-btn-0.png" alt="" @click="getCheckedPhotos">
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
  import $ from 'jquery'

  Vue.use(VueLazyload, {
    preload: 1,
    loading: require('../images/loading.gif'),
    error: require('../images/404.jpg'),
    attempt: 3
  })

  export default {
    data () {
      return {
        photoList: [],
        scrollY: 0,
        checkedPhotos:[]
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
              this.$nextTick(() => {
                if(!this.wrapScroll){
                  this.wrapScroll = new BScroll(this.$refs.ImgList, {
                    startX: 0,
                    startY: 0,
                    click: true,
                    pullUpLoad: {
                      threshold: 100
                    }
                  })
                  this.wrapScroll.on('pullingUp', () => {
                      if(this.photoList.length >= 16) return
                      this.getAjaxData()
                  })
                }else{
                  this.wrapScroll.finishPullUp()
                  this.wrapScroll.refresh()
                }
              })
            }
          })
          .catch( err => {
            console.log('网络错误');
          })
      },
      checkPhoto(event){
        if(!event._constructed) return
        $(event.path[1]).toggleClass('checked')
        if($(event.path[1]).hasClass('checked')){
          this.checkedPhotos.push($(event.target).attr('src'))
        }
      },
      getCheckedPhotos(){
        let vm = this
        vm.checkedPhotos = []
        $('li.checked').each(function () {
          vm.checkedPhotos.push($(this).find('img').attr('src'))
        })
        this.goToTheme()
      },
      goToTheme(){
        this.$router.push({name: 'theme', params: {
          imgList: this.checkedPhotos
        }})
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
    display flex
    flex-direction column
    .imglist
      flex 1 1 auto
      background-color #fff
      margin 10px
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
          position relative
          &:nth-of-type(odd)
            margin-right 10px
          &:after
            content ''
            position absolute
            top 15px
            right 15px
            wh(70px, 70px)
            border-radius 50%
            background url("../images/btn-checked.png") no-repeat
          img[lazy=loading]
            wh(60px, 60px)
          img[lazy=error]
            wh(100%, 100%)
          img[lazy=loaded]
            width 100%
            border none

        li.checked
          &:after
            background-color rgba(0,255,0,.8)
    .bottom
      flex 0 0 114px
      background-color #fff
      text-align center
      font-size 0
      display flex
      justify-content center
      align-items center
      position relative
      img
        height 94px
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