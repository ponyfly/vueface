<template>
  <div id="home">
    <div class="header clearfix">
      <div class="header-title" @click="changeGender('female')" :class="{active: gender === 'female'}">女生版</div>
      <div class="header-title" @click="changeGender('male')" :class="{active: gender === 'male'}">男生版</div>
    </div>
    <div class="theme-wrap">
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
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import axios from 'axios'
  import VueLazyload from 'vue-lazyload'

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
      }
    },
    created(){
      this.getThemes('female')
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
      afterEnter () {
        window.scrollTo(0, 0)
        this.$refs[`${this.gender}Wrap`].style.top = '0'
        const hideGender = 'male' === this.gender ? 'female' : 'male'
        const imgs = this.$refs[`${hideGender}Wrap`].querySelectorAll('.theme-img')
        for(let i = 0,len = imgs.length;i<len;i++){
          imgs[i].src = ""
        }
      },
      getThemes (gender) {
        const url = `http://beta.hersgirl.com/api/fetchThemeList?uid=6f7ad4e4fc9a4d86afb4717733464211&gender=${gender}`
        axios.get(url)
          .then((res)=>{
            this[`${gender}Themes`] = res.data
          })
          .catch((err)=>{
            console.log('网络错误，稍后重试');
          })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../style/mixin.styl"
  #home
    .header
      position fixed
      top 0
      left 0
      z-index 999
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
</style>