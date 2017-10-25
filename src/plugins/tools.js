class Tools {
  constructor () {
    this.channel = 'album-gamma-first'
  }

  /**
   * 获取连接参数
   * @return {[type]} [description]
   */
  _GetQueryString (name) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    let r = window.location.search.substr(1).match(reg)
    if (r != null) return unescape(r[2])
    return null
  }

  /**
   * 1x1统计
   * @param  {[type]}   name     [description]
   * @param  {[type]}   val      [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  _send1_1 (val, _channel, callback) {

    let that = this,
      channel = ''
    //获取本地uuid
    let get_uuid = localStorage.getItem('uuid') || that._getCookie('uuid')
    let set_uuid = that._uuid()

    if (_channel == undefined) {
      channel = that.channel
    } else {
      channel = _channel
    }

    //设置统计参数
    let jcnappid = that._GetQueryString('jcnappid') == null ? getUuid() : that._GetQueryString('jcnappid'),
      jcnuserid = that._GetQueryString('jcnuserid') == null ? getUuid() : that._GetQueryString('jcnuserid')

    let img1x1 = new Image()

    if (val && typeof val == 'string') {
      img1x1.src = '/js/1x1.gif?ucs=UTF-8&un=statistic_channel.' + channel + '_logname.' + val + '_login.0&timestamp=' + (new Date() - 0) + '&jcnappid=' + jcnappid + '&jcnuserid=' + jcnuserid
    }
    console.log('loading-1*1')

    img1x1.onload = function () {
      console.log('1*1 loaded')
      callback && callback()
    }

    function getUuid () {
      if (get_uuid == null) {
        if (window.localStorage) {
          //写入localStorage
          localStorage.setItem('uuid', set_uuid)
        } else {
          //写入cookie
          that._setCookie('uuid', set_uuid)
        }
        return set_uuid
      } else {
        return get_uuid
      }
    }
  }

  /**
   * 生成用户uuid
   * @return {[type]} [description]
   */
  _uuid () {
    // Private array of chars to use
    var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')

    Math.uuid = function (len, radix) {
      var chars = CHARS,
        uuid = [],
        i
      radix = radix || chars.length

      if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
      } else {
        // rfc4122, version 4 form
        var r

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
        uuid[14] = '4'

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
          if (!uuid[i]) {
            r = 0 | Math.random() * 16
            uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r]
          }
        }
      }

      return uuid.join('')
    }

    // A more performant, but slightly bulkier, RFC4122v4 solution.  We boost performance
    // by minimizing calls to random()
    Math.uuidFast = function () {
      var chars = CHARS,
        uuid = new Array(36),
        rnd = 0,
        r
      for (var i = 0; i < 36; i++) {
        if (i == 8 || i == 13 || i == 18 || i == 23) {
          uuid[i] = '-'
        } else if (i == 14) {
          uuid[i] = '4'
        } else {
          if (rnd <= 0x02) rnd = 0x2000000 + (Math.random() * 0x1000000) | 0
          r = rnd & 0xf
          rnd = rnd >> 4
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r]
        }
      }
      return uuid.join('')
    }

    // A more compact, but less performant, RFC4122v4 solution:
    Math.uuidCompact = function () {
      return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
    }
    return Math.uuidCompact()
  }

  //写cookies
  _setCookie (name, value) {
    var Days = 30
    var exp = new Date()
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000)
    document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString()
  }

  //读取cookies
  _getCookie (name) {
    var arr, reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
    if (arr = document.cookie.match(reg))
      return unescape(arr[2])
    else
      return null
  }

  //删除cookies
  _delCookie (name) {
    var exp = new Date()
    exp.setTime(exp.getTime() - 1)
    var cval = getCookie(name)
    if (cval != null)
      document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
  }

  _runningEnvironment () {
    var ua = navigator.userAgent.toLowerCase(),
      isWeixin = ua.indexOf('micromessenger') > -1,
      isQQ = ua.indexOf('qq') > -1,
      isWeibo = ua.indexOf('weibo') > -1,
      isIphone = ua.indexOf('iphone') > -1,
      isAndroid = ua.indexOf('android') > -1,
      isUc = ua.indexOf('ucbrowser') > -1,
      isBaidu = ua.indexOf('baidu') > -1,
      isPc = isUc ? window.screen.width / 2 > 768 : window.screen.width > 768,
      isMomo = ua.indexOf('momowebview') > -1,
      runningEnvironment = {}
    //判断环境
    runningEnvironment = {
      'weixin': isWeixin,
      'qq': isQQ,
      'weibo': isWeibo,
      'iphone': isIphone,
      'android': isAndroid,
      'baidu': isBaidu,
      'pc': isPc,
      'momo': isMomo
    }
    // console.log(runningEnvironment);
    return runningEnvironment
  }

  //测试是否为有效的url格式
  _testUrl (_url) {
    var match = /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/
    return match.test(_url)
  }
}

export default Tools
