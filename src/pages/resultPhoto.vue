<template>
  <div class="page page-index">
    <div id="img-area"></div>
    <div class="other">
      <div class="leaf"></div>
      <div class="mail_front"></div>
      <div class="mail_botton"></div>
      <div class="leftline"></div>
      <div class="light"></div>
      <div class="leaf01"></div>
      <div class="leaf02"></div>
      <div class="leaf03"></div>
      <div class="leaf04"></div>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'

  export default {
    props: {
      photoList: {
        type: Array
      }
    },
    data () {
      return {}
    },
    computed: {},
    methods: {},
    mounted() {
      var imgs;
      if (this.photoList.length) {
        imgs = this.photoList
      } else {
        imgs = [require("../images/test01.jpg"), require("../images/test02.jpg"), require("../images/test03.jpg")]
      }
      var $imgArea = $("#img-area"),
        $mail = $(".mail_front"),
        imgsTop = $mail.position().top - Math.floor(Math.random() * 40) + "px";

      function imgInit() {
        var imgStr = '';
        for (var i = 0; i < imgs.length; i++) {
          var pos = picPosition();
          imgStr += "<img src='" + imgs[i] + "' style='" + pos + "' /> "
        }
        $imgArea.html(imgStr)
      }

      imgInit()

      function picPosition() {
        var left = Math.floor(Math.random() * 180) + 50 + "px";
        var rotate = Math.floor(Math.random() * 40) + "deg";
        return "left:" + left + ";transform:rotate(" + rotate + "); width:180px; top:" + imgsTop;
      }

      var oldindex = 0,
        newindex = 0;
      var $imgs = $("#img-area img");

      setTimeout(function(){
        $imgs.eq(0).css({
          "z-index": 97,
          width: "575px",
          top: "120px",
          left: "100px",
          transform: "rotate(0)"
        })
      },900)



      setInterval(function() {
        oldindex = newindex;
        var $old = $imgs.eq(oldindex);


        $old.css({
          "z-index": 96
        })
        $old.css({
          width: "180px",
          top: imgsTop,
          left: Math.floor(Math.random() * 180) + 50 + "px",
          transform: "rotate(" + Math.floor(Math.random() * 40) + "deg)"
        })

        if (oldindex < imgs.length - 1) {
          newindex = oldindex + 1
        } else {
          newindex = 0
        }
        var $new  = $imgs.eq(newindex);

        setTimeout(function(){
          $new.css({
            "z-index": 97
          })
          $new.css({
            width: "575px",
            top: "120px",
            left: "100px",
            transform: "rotate(0)"
          })
        },1000)


      }, 5000)

    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../style/mixin.styl'
  .page-index{
    wh(100%, 100%)
    background: url(../images/bg.jpg) no-repeat wheat; background-size: cover;
  }

  .leaf{
    position: absolute; left: 0; top: 0; z-index: 95;
    width:539px; height: 283px;
    background: url(../images/shuye.png)  no-repeat;
  }

  .mail_front{
    position: absolute;  z-index: 98;
    left:0px; bottom: 0;
    width:444px; height: 297px;
    background: url(../images/mail.png)  no-repeat;
    background-size:100%;

  }
  .mail_botton{
    position: absolute;  z-index: 6;
    left:0px; bottom: 0;
    width:453px; height: 325px;
    background: url(../images/mailbg.png)  no-repeat;
    background-size:100%;

  }

  .leftline{
    position: absolute;  z-index: 99;
    left: -40px; top:0px;
    width: 127px; height: 1736px;
    background: url(../images/silid01.png)  no-repeat;
  }

  #img-area{
    position: absolute;
    width: 100%;height: 100%;
    overflow: hidden;
  }

  #img-area img{
    transform: translateZ(0);
    padding:10px; background: #fff; position: absolute; z-index: 96;
    transition:all .9s;
    -webkit-transition:all .9s;
  }
  .light{
    position: absolute;top: -40px; left: -40px; z-index: 100;
    width: 598px; height: 741px; transform:scale(1.5,1.5);
    background: url(../images/light.png) no-repeat;
    animation: lightmove 10s ease-in infinite;
    transform-origin:0 0;
  }

  @keyframes lightmove{
    0%{ transform:rotate(0) }
    50%{transform:rotate(20deg) }
    100%{ transform:rotate(0) }
  }

  .leaf01{
    position: absolute; z-index: 9;
    width: 43px; height: 76px;
    background: url(../images/leaf01.png) no-repeat;
    bottom: 120px; right: 40px;
  }
  .leaf02{
    position: absolute; z-index: 9;
    width: 65px; height: 65px;
    background: url(../images/leaf02.png) no-repeat;
    bottom: 160px; right: 140px;
  }

  .leaf03{
    position: absolute; z-index: 9;
    width: 100px; height: 100px;
    background: url(../images/leaf02.png) no-repeat; background-size: 100%;
    bottom: 340px; left: 10px;
  }

  .leaf04{
    position: absolute; z-index: 9;
    width: 111px; height: 125px;
    background: url(../images/leaf03.png) no-repeat; background-size: 100%;
    bottom: 280px; right: 20px;
  }
</style>