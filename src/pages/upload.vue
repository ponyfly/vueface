<template>
  <div>
    <div style="padding:20px;">
      <div class="show">
        <div class="picture" :style="'backgroundImage:url('+headerImage+')'"></div>
      </div>
      <div style="margin-top:20px;">
        <input type="file" id="upload" accept="image/jpg, image/png, image/jpeg, image/gif" @change="upload">
        <label for="upload"></label>
      </div>
    </div>
  </div>
</template>

<script>
  import Exif from 'exif-js'
  import Storage from '../plugins/localstorage'
  import localstorage from '../plugins/localstorage'
  export default {
    data () {
      return {
        headerImage: '',
        picValue: ''
      }
    },
    computed: {},
    methods: {
      upload(e) {
        let files = e.target.files || e.srcElement.files
        this.picValue = files[0]
        this.imgPreview(this.picValue)
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
            if(result.length <= 10 * 1024) {
              this.headerImage = result
              self.postImg()
            } else {
              oImg.onload = function () {
                let data = self.compress(oImg, orientation)
                self.headerImage = data
                self.postImg()
              }
            }
          }
        }
      },
      /**
       * 上传base64图片编码
       * @return {[type]} [description]
       */
      postImg(themeId) {
        //发送图片到服务器
        uid = localStorage.getItem('uuid') != null ? localStorage.getItem('uuid') : that.uuid()
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
  .show {
    width: 100px;
    height: 100px;
    overflow: hidden;
    position: relative;
    border-radius: 50%;
    border: 1px solid #d5d5d5;
  }
  .picture {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
  }
</style>