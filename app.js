//app.js
var util = require('./utils/util.js');
var utilMd5 = require('./utils/md5.js'); 
App({
  md5Key: "",
  onLaunch: function () {
    var client_id="qhmarketapi";
    var client_secret="rrFNcBHd5x1PevbKgKbzsnxWydZmQm";
    var WeixinAppId='wxa9b6b75004727415'   
    var that = this;
    that.globalData.client_id=client_id;
    that.globalData.client_secret=client_secret;
    that.globalData.WeixinAppId = WeixinAppId;
    that.globalData.WeixinAppSecret='';
    that.globalData.userInfo = wx.getStorageSync('userInfo');
    that.globalData.token = wx.getStorageSync('token');
    that.globalData.openid = wx.getStorageSync('openid');
    that.globalData.user_id = wx.getStorageSync('user_id');

    var yymmdd = util.formatDateUnderLine(new Date());
    var md5key = utilMd5.hexMD5('HXDL_' + yymmdd).toUpperCase();
    that.md5Key = md5key;

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // app.js
    wx.getSystemInfo({
      success: e => {
        // 设计稿一般是 750 rpx, 但是 canvas 是 px;
        // 1rpx 转换成 px 的时候
        this.globalData.rpx2px = 1 / 750 * e.windowWidth;
      }
    });
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
   // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
             


              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
        //console.log(res.hasUpdate)
    })
    // 下载新版本
    updateManager.onUpdateReady(function () {
        wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success(res) {
                if (res.confirm) {
                    // 重启应用
                    updateManager.applyUpdate()
                }
            }
        })
    })
    // 新版本下载失败
    updateManager.onUpdateFailed(function (res) {
        console.log(res)
    })
    /**
		 * 获取机型信息
		 */
    wx.getSystemInfo({
      success: function (res) {
        if (res.model.search("iPhone X") != -1) {
          that.globalData.iphone = true;
        }
        if (res.model.search("iPhone 11") != -1) {
          that.globalData.iphone = true;
        }
        if (res.model.search("iPhone XR") != -1) {
          that.globalData.iphone = true;
        }
        if (res.model.search("iPhone XS Max") != -1) {
          that.globalData.iphone = true;
        }
        if (res.model.search("MI 8") != -1) {
          that.globalData.iphone = true;
        }
        console.log(res.model.search("iPhone X"),'iphonevvvv');
      }
    });
  },
  
  globalData: {
    userInfo: null,
    nickname: '点击登录',
    isConnected: true,
    iphone: false,
    //如果用户没有授权，无法在加载小程序的时候获取头像，就使用默认头像
    avatarUrlTempPath: "./images/defaultHeader.jpg",
    avatar: '',
    openid:'',
    user_id:'',
    commonInfo:[]
  }
})