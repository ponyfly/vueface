<template>
  <div id="home">
    <div class="header clearfix">
      <div class="header-title" @click="changeGender('female')" :class="{active: gender === 'female'}">女生版</div>
      <div class="header-title" @click="changeGender('male')" :class="{active: gender === 'male'}">男生版</div>
    </div>
    <div class="theme-wrap" @click="judgeFirstUse" ref="themeWrap">
      <label for="avator-img">
        <transition name="slide" @after-enter="afterEnter">
          <div class="theme-list" :class="{z_index10:gender==='female'}" v-show="gender==='female'" ref="femaleWrap">
            <section class="" v-for="theme in femaleThemes" :key="theme.id">
              <img src="" class="theme-img" v-lazy="theme.imgUrl" :key="theme.id" :themeId="theme.id" :themeName="theme.name">
              <div class="lock-panel"></div>
            </section>
          </div>
        </transition>
        <transition name="slide" @after-enter="afterEnter">
          <div class="theme-list" :class="{z_index10:gender==='male'}" v-show="gender==='male'" ref="maleWrap">
            <section class="" v-for="theme in maleThemes">
              <img src="" class="theme-img" v-lazy="theme.imgUrl" :key="theme.id" :themeId="theme.id" :themeName="theme.name">
              <div class="lock-panel"></div>
            </section>
          </div>
        </transition>
      </label>
    </div>
    <div class="avator">
      <input type="file" id="avator-img" accept="image/*" :disabled="isFirstUse" @change="upload">
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
    <div class="face-error" v-show="isFaceError">
      <div class="face-error-inner">
        <img src="../images/not-match-0.png" alt="faceError">
        <i class="close" @click="closeFaceError"></i>
        <label for="avator-img">
          <img class="btn-upload" src="../images/btn-choose-face-0.png" alt="btnUpload" @click="closeFaceError">
        </label>
      </div>
    </div>
    <div class="loading" v-if="isLoading">
      <div class="loading-bgc"></div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import axios from 'axios'
  import VueLazyload from 'vue-lazyload'
  import Exif from 'exif-js'
  import Tools from '../plugins/tools'
  import qs from 'querystring'

  import loadingGif from '../images/loading.gif'
  import loadingPng from '../images/loading.png'
  import errorJpg from '../images/404.jpg'

  const oTools = new Tools()

  Vue.use(VueLazyload, {
    preload: 1,
    loading: loadingGif,
    error: errorJpg,
    attempt: 3,
  })

  export default {
    data () {
      return {
        isOffline: location.origin.indexOf('localhost') > -1 || location.origin.indexOf('192.168') >-1 ,
        gender: 'female',
        femaleThemes: [],
        maleThemes: [],
        curTheme:{
          id: '',
          name: ''
        },
        errorTip: {
          text: ''
        },
        postfield: '',
        isFirstUse: false,
        isFaceError: false,
        isLoading: false
      }
    },
    created(){
      this.getThemes()
    },
    computed: {
      API_header() {
        return this.isOffline ? "http://beta.hersgirl.com" : ""
      }
    },
    mounted(){
      const oImg = new Image()
      oImg.src = loadingPng
      window.onscroll = this.setThemeWrapHeight
    },
    methods: {
      changeGender (gender) {
        if(this.gender === gender) return false
        this.gender = gender
        this.getThemes()
        const scrollTop = document.getElementById('home').scrollTop
        this.$refs[`${gender}Wrap`].style.top = `${scrollTop}px`
      },
      afterEnter() {
        window.scrollTo(0, 0)
      },
      getThemes() {
        const gender = this.gender
        const url = `http://beta.hersgirl.com/api/fetchThemeList?uid=6f7ad4e4fc9a4d86afb4717733464211&gender=${gender}`
        axios.get(url)
          .then((res)=>{
            this[`${gender}Themes`] = res.data
          })
          .catch((err)=>{
            console.log('网络错误，稍后重试');
          })
      },
      judgeFirstUse(e) {
        //获取当前的主题id
        this.curTheme = {
          id: e.target.getAttribute('themeId'),
          name: e.target.getAttribute('themeName')
        }
        //判断是否是第一次进入
        if(localStorage.getItem('isfirst') === null) {
          this.isFirstUse = true
          localStorage.setItem('isfirst', '1')
        } else {
          this.isFirstUse = false
        }
      },
      setThemeWrapHeight() {
        /*if(this.$refs[`${this.gender}Wrap`]){
          let zIndex10Height = this.$refs[`${this.gender}Wrap`].offsetHeight
          this.$refs.themeWrap.style.height = zIndex10Height + 'px'
        }*/
      },
      closeFirstUse() {
        this.isFirstUse = false
      },
      closeIknow() {
        this.isFirstUse = false
      },
      closeFaceError() {
        this.isFaceError = false
      },
      upload(e) {
        let files = e.target.files || e.srcElement.files
        let avatorValue = files[0]
        //开始上传
        console.log('start');
        this.imgPreview(avatorValue)
        this.isLoading = true
        e.target.value = ''
      },
      imgPreview(img) {
        let self = this
        let orientation;
        Exif.getData(img, function(){
          orientation = Exif.getTag(this, 'Orientation');
        });
        if(!img || !window.FileReader) return
        if(/^image/.test(img.type)){
          let reader = new FileReader()
          reader.readAsDataURL(img)
          reader.onloadend = function () {
            let result = this.result
            let oImg = new Image()
            oImg.src = result
            oImg.onload = function () {
              let base64 = self.compress(oImg, orientation)
              self.postfield = base64.substr(23)
              self.postImg(self.postfield,self.curTheme.id)
            }
          }
        }
      },
      /**
       * 上传base64图片编码
       * @return {[type]} [description]
       */
      postImg(photobase64, themeId) {
        //发送图片到服务器
        let uid = localStorage.getItem('uuid') != null ? localStorage.getItem('uuid') : oTools._uuid()
        let config = {
          data: {
            uid,
            themeId,
            times: 3,
            postfield: photobase64
          }
        }
        axios.post(`${this.API_header}/api/doChangeFaceWithTimes`, qs.stringify(config.data))
          .then( res => {
            //结束上传
            console.log('end');
            this.isLoading = false
            if(res.data){
              const {errorCode } = res.data
              switch (errorCode) {
                case 0:
                  if(res.data.ok){
                    let params = {
                      API_header: this.API_header,
                      curTheme: this.curTheme,
                      uid,
                      imgList: res.data.responseList,
                      gender: this.gender,
                      postfield: this.postfield
                    }
                    if(this.isOffline){
                      this.$router.push({name: 'theme', params})
                    }
                  }
                  break;
                case 1:
                  //无法识别脸部
                  this.isFaceError = true
                  oTools._send1_1('list-facefault');
                  oTools._send1_1('list-facefault',"album-gamma-first-" + this.curTheme.name);
                  break;
                case 2:
                  //数据过期失效,此处应该有弹窗，怎么就过期了呢，未实现
                  this.errorTip.text = '图片已过期，请重新制作~'
                  break;
                case 3:
                  //数据过期失效,此处也应该有弹窗
                  this.errorTip.text = '矮油，好像出错了诶<br/>请重试~'
                  break;
              }
            }
          })
          .catch( err => {
            console.log(err);
          })
      },
      /**
       * 图片旋转
       * @param oImg 图片对象
       * @param direction 方向
       * @param canvas canvas对象
       */
      rotateImg(oImg, direction, canvas){

        //最小与最大旋转方向，图片旋转4次后回到原方向
        const min_step = 0;
        const max_step = 3;
        if (oImg == null)return;
        //img的高度和宽度不能在img元素隐藏后获取，否则会出错
        let height = oImg.height;
        let width = oImg.width;
        let step = 2;
        if (step == null) {
          step = min_step;
        }
        if (direction == 'right') {
          step++;
          //旋转到原位置，即超过最大值
          step > max_step && (step = min_step);
        } else {
          step--;
          step < min_step && (step = max_step);
        }
        //旋转角度以弧度值为参数
        let degree = step * 90 * Math.PI / 180;
        let ctx = canvas.getContext('2d');
        switch (step) {
          case 0:
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(oImg, 0, 0);
            break;
          case 1:
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(degree);
            ctx.drawImage(oImg, 0, -height);
            break;
          case 2:
            canvas.width = width;
            canvas.height = height;
            ctx.rotate(degree);
            ctx.drawImage(oImg, -width, -height);
            break;
          case 3:
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(degree);
            ctx.drawImage(oImg, -width, 0);
            break;
        }
      },
      /**
       * 图片压缩
       * @param oImg
       * @param orientation
       * @returns {*}
       */
      compress(oImg, orientation) {
        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d')
        let width = oImg.width
        let height = oImg.height
        canvas.width = width
        canvas.height = height
        ctx.drawImage(oImg, 0, 0, width, height)
        let base64 = null
        if(orientation != "" || orientation != 1) {
          switch (orientation) {
            case 6:
              this.rotateImg(oImg, "left", canvas)
              break
            case 8:
              this.rotateImg(oImg, "right", canvas)
              break
            case 3:
              this.rotateImg(oImg, "right", canvas)
              this.rotateImg(oImg, "right", canvas)
              break
          }
        }
        base64 = canvas.toDataURL('image/jpeg', 0.6)
        return base64
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../style/mixin.styl"
  @keyframes loading
    from
      background-position: 0 0
    to
      background-position: -9984px 0
  #home
    width 100%
    height 100%
    position relative
    overflow-y scroll
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
          .theme-img[lazy=loaded]
            width 100%
          .theme-img[src='']
            opacity 0
          .theme-img[lazy=loading]
            width auto
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

    .face-error
      position fixed
      top 0
      left 0
      z-index 12
      width 100%
      height 100%
      background-color rgba(0, 0, 0, .4)
      .face-error-inner
        position absolute
        top 0
        right 0
        bottom 0
        left 0
        margin auto
        width 640px
        height 923px
        .btn-upload
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

    .loading
      position fixed
      top 0
      left 0
      z-index 12
      wh(100%, 100%)
      background-color: rgba(0,0,0, .4);
      .loading-bgc
        ctl()
        wh(256px, 256px)
        background url("../images/loading.png") no-repeat
        animation loading 618ms steps(39) infinite
</style>