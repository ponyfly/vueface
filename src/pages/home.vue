<template>
  <div id="home">
    <div class="header clearfix">
      <div class="header-title" @click="changeGender('female')" :class="{active: gender === 'female'}">女生版</div>
      <div class="header-title" @click="changeGender('male')" :class="{active: gender === 'male'}">男生版</div>
    </div>
    <div class="theme-wrap" @click="goToTheme($event)" ref="themeWrap">
      <label for="avator-img">
        <transition name="slide" @after-enter="afterEnter">
          <div class="theme-list" :class="{z_index10:gender==='female'}" v-show="gender==='female'" ref="femaleWrap">
            <section class="" v-for="theme in femaleThemes">
              <img src="" v-lazy="theme.imgUrl" class="theme-img">
              <div class="lock-panel"></div>
            </section>
          </div>
        </transition>
        <transition name="slide" @after-enter="afterEnter">
          <div class="theme-list" :class="{z_index10:gender==='male'}" v-show="gender==='male'" ref="maleWrap">
            <section class="" v-for="theme in maleThemes">
              <img src="" v-lazy="theme.imgUrl" class="theme-img">
              <div class="lock-panel"></div>
            </section>
          </div>
        </transition>
      </label>
    </div>
    <div class="avator">
      <input type="file" id="avator-img" accept="image/jpg, image/png, image/jpeg, image/gif" :disabled="isFirstUse" @change="uploadAvatar($event)">
    </div>
    <div class="first-use" v-show="isFirstUse">
      <div class="first-use-inner">
        <img src="../images/please-0.png" alt="first-use">
        <i class="close" @click="closeFirstUse"></i>
        <label for="avator-img">
          <img class="iknow" src="../images/i-know-0.png" alt="iknow" @click="closeIknow">
        </label>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import axios from 'axios'
  import VueLazyload from 'vue-lazyload'
  import Exif from 'exif-js'
  import Storage from '../plugins/localstorage'

  import loadingGif from '../images/loading.gif'
  import errorJpg from '../images/404.jpg'

  Vue.use(VueLazyload, {
    preload: 1,
    loading: loadingGif,
    error: errorJpg,
    attempt: 1,
  })

  export default {
    data () {
      return {
        gender: 'female',
        femaleThemes: [],
        maleThemes: [],
        isFirstUse: false,
        avatorValue: ''
      }
    },
    created(){
      this.getThemes('female')
      window.onscroll = this.setThemeWrapHeight
    },
    mounted() {
      this.setThemeWrapHeight()
    },
    computed: {},
    methods: {
      changeGender (gender) {
        if(this.gender === gender) return false
        this.gender = gender
        this.getThemes(gender)
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        this.$refs[`${gender}Wrap`].style.top = `${scrollTop}px`
      },
      afterEnter() {
        window.scrollTo(0, 0)
        this.$refs[`${this.gender}Wrap`].style.top = '0'
        const hideGender = 'male' === this.gender ? 'female' : 'male'
        const imgs = this.$refs[`${hideGender}Wrap`].querySelectorAll('.theme-img')
        for(let i = 0,len = imgs.length;i<len;i++){
          imgs[i].src = ""
        }
      },
      getThemes(gender) {
        const url = `http://beta.hersgirl.com/api/fetchThemeList?uid=6f7ad4e4fc9a4d86afb4717733464211&gender=${gender}`
        axios.get(url)
          .then((res)=>{
            this[`${gender}Themes`] = res.data
          })
          .catch((err)=>{
            console.log('网络错误，稍后重试');
          })
      },
      goToTheme(ev) {
        if(Storage.getLocalStorage('isfirst') === null) {
          this.isFirstUse = true
          Storage.setLocalStorage('isfirst', '1')
        } else {
          this.isFirstUse = false
        }
      },
      setThemeWrapHeight() {
        let zIndex10Height = this.$refs[`${this.gender}Wrap`].offsetHeight
        this.$refs.themeWrap.style.height = zIndex10Height + 'px'
      },
      uploadAvatar(e) {
        //压缩图片，上传到服务器
        let files = e.target.files || e.srcElement.files
        this.avatorValue = files[0]
        this.imgPreview(this.avatorValue)
      },
      imgPreview(img) {
        //获取图片信息，解决旋转问题
        let self = this
        let orientation;
        Exif.getData(img, function() {
          orientation = Exif.getTag(this, 'Orientation')
          console.log(orientation);
        })
      },
      closeFirstUse() {
        this.isFirstUse = false
      },
      closeIknow() {
        this.isFirstUse = false
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../style/mixin.styl"
  #home
    width 100%
    .header
      position fixed
      top 0
      left 0
      z-index 11
      background-color #fff
      wh(100%, 100px)
      fj()
      font(32px, 100px)
      color #a5a5a5
      .header-title
        position relative
        margin 0 48px
        &.active
          color #333
          &:after
            content ''
            position absolute
            wh(50px, 5px)
            left 50%
            bottom 20px
            margin-left -25px
            background #d6b585

    .theme-wrap
      position relative
      margin-top 100px
      .theme-list
        position absolute
        top 0px
        left 0px
        width 100%
        &.z_index10
          z-index 10
        &.slide-enter-active
          transition transform 618ms
        &.slide-enter
          transform translateX(750px)
        &.slide-leave,&.slide-leave-to
          transform translateX(0)
        &.slide-leave-active
          transition transform 618ms
        section
          width 100%
          .theme-img[src='']
            opacity 0
          .theme-img[lazy='loading']
            display block
            margin 150px auto
    .avator
      position fixed
      top 50%
      input[type=file]
        opacity 0
    .first-use
      position fixed
      top 0
      left 0
      z-index 12
      width 100%
      height 100%
      background-color rgba(0, 0, 0, .4)
      .first-use-inner
        position absolute
        top 0
        right 0
        bottom 0
        left 0
        margin auto
        width 640px
        height 813px
        .iknow
          position absolute
          bottom 70px
          left 50%
          margin-left -171px
        .close
          position absolute
          top 0
          right 0
          width 80px
          height 80px

</style>