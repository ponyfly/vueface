<template>
  <div id="theme">
    <div class="back-home" @click="backHome">
      <img src="../images/back-home-0.png" alt="">
    </div>
    <ResultPhoto :photoList="photoList"></ResultPhoto>
    <div class="change-photo" @click="goToChoosePhoto">
      <img src="../images/change-photo-self-0.png" alt="">
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  import ResultPhoto from './resultPhoto.vue'

  export default {
    data () {
      return {
        photoList:[]
      }
    },
    created(){
      this.getImgs()
    },
    computed: {},
    methods: {
      getImgs() {
        const {imgList } = this.$route.params
        if(imgList){
          this.photoList = imgList.map((item, index) => {
            return item.imgShare || item
          })
        }
      },
      backHome() {
        this.$router.back()
      },
      goToChoosePhoto() {
        const {API_header, uid, curTheme, postfield} = this.$route.params
        let params = {
          API_header,
          uid,
          curTheme,
          postfield
        }
        console.log(params);
        this.$router.push({name: 'choosePhoto', params})
      }
    },
    components: {
      ResultPhoto
    },
    mounted(){}
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../style/mixin.styl'
  #theme
    tl()
    wh(100%, 100%)
    overflow hidden
    .back-home
      position fixed
      top 50px
      left 30px
      z-index: 101
      wh(80px, 80px)
      img
        width 100%
    .change-photo
      position: fixed
      bottom 40px
      left 50%
      z-index 101
      transform translateX(-50%)
</style>