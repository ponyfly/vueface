<template>
  <div id="home">
    <div class="header clearfix">
      <div class="header-title" @click="changeGender('female')" :class="{active: gender === 'female'}">女生版</div>
      <div class="header-title" @click="changeGender('male')" :class="{active: gender === 'male'}">男生版</div>
    </div>
    <transition name="slide">
      <div class="theme-list" v-show="gender==='female'">
        <section class="" v-for="theme in femaleThemes">
          <img :src="theme.imgUrl" class="theme-img"  alt="">
          <div class="lock-panel"></div>
        </section>
      </div>
    </transition>
    <transition name="slide">
      <div class="theme-list" v-show="gender==='male'">
        <section class="" v-for="theme in maleThemes">
          <img :src="theme.imgUrl" class="theme-img"  alt="">
          <div class="lock-panel"></div>
        </section>
      </div>
    </transition>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    data () {
      return {
        gender: 'female',
        femaleThemes:[],
        maleThemes:[]
      }
    },
    created(){
      this.getThemes('female')
    },
    computed: {},
    methods: {
      changeGender (gender) {
        this.gender = gender
        this.getThemes(gender)
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

    .theme-list
      margin-top 100px
    /*.slide-enter-active
      transition transform .8s
    .slide-enter
      transform translateX(750px)*/
    .slide-leave-active
      transition transform 0.8s
    .slide-leave-to
      transform translateX(750px)
</style>