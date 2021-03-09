// component/authorize.js
const app = getApp();
//api
// import requestApi from '../../utils/promiseRequestApi.js'
var api = require('../../config/api.js');
var util = require('../../utils/util.js');
Component({
 
  properties: {},
 
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      });
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          console.log(app.globalData.userInfo.avatarUrl,'头像')
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  methods: {
    getUserInfo: function(e) {
      console.log(e)
      app.globalData.userInfo = e.detail.userInfo;
      console.log( app.globalData.userInfo,'授权登陆组件');
      app.globalData.hasUserInfo = true;
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
    
  }
})
