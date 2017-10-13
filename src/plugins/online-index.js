function albumInit () {this._init.apply(this, arguments)}

var mychoiceis = 'SEO9S4KGF3FMETPOP88BF9MRHUA584'
console.log('isme--'), albumInit.prototype = {
  constructor: albumInit,
  _init: function (V) {
    var w = this
    !!localStorage.getItem('uuid') || localStorage.setItem('uuid', TOOLS._uuid()), w.uuid = localStorage.getItem('uuid'), w.isOffline = location.origin.indexOf('localhost') > -1 || location.origin.indexOf('192.168') > -1, w.API_header = '', w.isOffline && (w.API_header = 'http://gamma.hersgirl.com'), w.gender_type = 'female', w.cearteThemeList(), w._addEvent(), w._wxShare(), w._clearHistory(), TOOLS._send1_1('list-init'), null != TOOLS._GetQueryString('wxgzh') && TOOLS._send1_1('list-init-wxgzh-' + TOOLS._GetQueryString('wxgzh'))
  },
  _addEvent: function () {
    var V = this, w = $('.gender-slt-btn'), x = $('.theme-list'), T = $('.first-start-wrap'), y = $('.pop-lock-wrap')
    w.on('click', 'li', function () {$(this).addClass('act').siblings().removeClass('act'), V.gender_type = $(this).data('gender'), 'male' == V.gender_type && TOOLS._send1_1('list-init-male'), V.cearteThemeList()}), x.on('click', '.theme-item', function (w) {
      $(this).attr('data-templateid')
      var x = $(this).attr('data-themeid'), D = $(this).attr('data-themename')
      encodeURI($(this).attr('data-themetitle'))
      if (V.themeid = x, V.themename = D, TOOLS._send1_1('list-click'), TOOLS._send1_1('list-click', 'album-gamma-first-' + V.themename), $(this).hasClass('lock')) return console.log($(this).data('imgUrl')), y.show(), !1
      'true' == localStorage.getItem('hasPlayed') ? V._UploadPhoto(V.themeid) : (localStorage.setItem('hasPlayed', 'true'), T.show(), TOOLS._send1_1('list-start-open'))
    }), $('.pop-file').on('click', '.btn-up', function () {$('.pop-wrap').hide(), V._UploadPhoto(V.themeid)}), $('.pop-close').on('click', function () {$('.pop-wrap').hide()}), $('.pop-lock-btn').on('click', function () {window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=cn.j.hers&ckey=CK1321547207900'}), $('.iknow').on('click', function () {TOOLS._send1_1('list-start-button')}), $('.face-err-btn').on('click', function () {TOOLS._send1_1('list-facefault-button')}), y.on('click', function (V) {V.target == this && $(this).hide()}), $('#uploadBtn').on('change', function (w) {
      var x = this.files[0]
      V._showLoading(), V._clearHistory(), TOOLS._Compress(x, function (w) {V._postImg(w.substr(23), V.themeid)}), this.value = ''
    })
  },
  _clearHistory: function () {localStorage.removeItem('likeNums'), localStorage.removeItem('saveSourceIds'), localStorage.removeItem('userShareUrl'), localStorage.removeItem('sid')},
  _wxShare: function () {
    window.wx_data = {
      title: '虚拟换装秀',
      desc: '在线换发型、换古装、试婚纱……',
      link: window.location.origin + '/' + (new Date).getTime() + '/index.html',
      imgUrl: CDN_STATIC_URL + CDN_STATIC_TIMESTAMP + '/imgs/list-share.jpg',
      success: function (V) {
        var w = {
          'sendAppMessage:ok': 'friend',
          'shareTimeline:ok': 'circle',
          'shareWeibo:ok': 'qweibo',
          'shareQQ:ok': 'qq',
          'shareQZone:ok': 'qzone'
        }
        console.log('成功分享', w[V.errMsg])
      },
      cancel: function () {console.log('取消分享')}
    }, album_wx && album_wx.bindevent()
  },
  cearteThemeList: function (V) {
    var w = this, x = '', T = [], y = {
      uid: w.uuid,
      themeId: TOOLS._GetQueryString('themeid') || TOOLS._GetQueryString('themeId'),
      gender: w.gender_type
    }
    $('.theme-loading').show()
    var D = setTimeout(function () {
      w._hideLoading()
      var V = {con: '矮油，好像出错了诶<br/>请刷新~'}
      w._errorTip(V, function () {})
    }, 15e3)
    $.ajax({
      method: 'GET',
      data: y,
      url: w.API_header + '/api/fetchThemeList',
      timeout: 15e3
    }).done(function (V) {
      if (V.length) {
        clearTimeout(D)
        for (var w = 0; w < V.length; w++) x = '', V[w].lockStatus && 'female' == V[w].gender && (x = 'lock'), T.push('<li class="theme-item' + x + '" data-templateId="' + V[w].templateId + '" data-imgnum="' + V[w].imgCount + '" data-themeId="' + V[w].id + '" data-themeName="' + V[w].name + '" data-themeTitle="' + V[w].title + '" data-themeType="' + V[w].type + '" data-imgUrl="' + V[w].imgUrl + '">                        <img src="/imgs/blank.png" data-echo="' + V[w].imgUrl + '" alt="">                        <span class="title">' + V[w].title + '</span>                    </li>')
      }
      $('.theme-list').html(T.join('')), $('.theme-loading').hide(), echo.init({offset: 100, throttle: 0})
    }).fail(function (V, x) {
      w._hideLoading()
      var T = {con: '矮油，好像出错了诶<br/>请重试~'}
      w._errorTip(T, function () {}), config.callback && config.callback(), console.log(x)
    })
  },
  _UploadPhoto: function (V) {
    var w = this
    $('#uploadBtn'), window.screen.width, w.themeid
    $('#uploadBtn')[0].value = '', $('#uploadBtn').each(function () {this.click()})
  },
  _postImg: function (V, w, x) {
    var T = this, y = null != localStorage.getItem('uuid') ? localStorage.getItem('uuid') : T.uuid(),
      D = null != localStorage.getItem('scount') ? localStorage.getItem('scount') : 1,
      K = {method: 'POST', url: T.API_header + '/api/doChangeFace', data: {uid: y, themeId: w, postfield: V}}
    T._ajaxGetData(K, function (V) {
      var x = setTimeout(function () {
        T._hideLoading()
        var V = {con: '矮油，好像出错了诶<br/>请重试~'}
        T._errorTip(V, function () {}), TOOLS._send1_1('list-timeout'), TOOLS._send1_1('list-timeout', 'album-gamma-first-' + T.themename)
      }, 1e4)
      if (V) {
        var K = {}
        if (clearTimeout(x), 1 == V.errorCode) return T._hideLoading(), $('.face-error-wrap').show(), TOOLS._send1_1('list-facefault'), void TOOLS._send1_1('list-facefault', 'album-gamma-first-' + T.themename)
        if (2 == V.errorCode) return T._hideLoading(), K = {con: '图片已过期，请重新制作~'}, void T._errorTip(K, function () {})
        if (3 == V.errorCode) return T._hideLoading(), K = {con: '矮油，好像出错了诶<br/>请重试~'}, void T._errorTip(K, function () {})
        if (V.ok) {
          localStorage.setItem('sid', V.sid), localStorage.setItem('userShareUrl', V.imgShare)
          var E = 1
          localStorage.getItem('playTime') && (E = parseInt(localStorage.getItem('playTime')) + 1), localStorage.setItem('playTime', E), (new Image).src = T.isOffline ? V.imgShare : V.imgOurs
          var Q = ''
          Q = T.isOffline ? '/change.html?menuid=' + w + '&themename=' + T.themename + '&uid=' + y + '&sid=' + V.sid + '&ucount=1&scount=' + D + '&sourceid=' + V.sourceId + '&firstshare=1&gender=' + T.gender_type : '/' + (new Date).getTime() + '/change.html?menuid=' + w + '&themename=' + T.themename + '&uid=' + y + '&sid=' + V.sid + '&ucount=1&scount=' + D + '&sourceid=' + V.sourceId + '&firstshare=1&gender=' + T.gender_type, setTimeout(function () {T._hideLoading(), window.location.href = Q}, 1500)
        }
      }
    })
  },
  _showLoading: function () {$('body').append('<div id="loading-css-1">                              <div>                                <div class="rotate-triangle"></div>                                <div class="circles">                                  <div class="c-1"></div>                                  <div class="c-2"></div>                                </div>                              </div>                            </div>')},
  _hideLoading: function () {$('#loading-css-1').length && $('#loading-css-1').remove()},
  _errorTip: function (V, w) {
    var x = '<div class="error-tip-wrap">                            <div class="error-tip">                                <span class="close">x</span>                                <p class="p-con">' + V.con + '</p>                            </div>                        </div>'
    $('.error-tip-wrap').remove(), $('body').append(x), $('.close').length && $('.close').on('click', function (V) {$('.error-tip-wrap').remove()}), $('.error-tip-wrap').show(), setTimeout(function () {$('.error-tip-wrap').fadeOut(500, function (V) {V && V(), $('.error-tip-wrap').remove()})}, 2500)
  },
  _ajaxGetData: function (V, w) {
    var x = this
    $.ajax({
      method: V.method,
      url: V.url,
      data: V.data,
      timeout: 15e3
    }).done(function (V) {w && w(V)}).fail(function (V, w) {
      x._hideLoading()
      var T = {con: '矮油，好像出错了诶<br/>请重试~'}
      x._errorTip(T, function () {}), console.log(w)
    })
  }
}, $(document).ready(function () {new albumInit({callback: function () {}})})