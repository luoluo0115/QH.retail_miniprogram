const app = getApp();
const api = require('../../config/api.js')
var util = require('../../utils/util.js');
Component({
  properties: {
    isHidden: {
      type: Boolean,
      value: true,
    },
    url:{
      type: String,
    }
  },
 /**
   * 组件的初始数据 
   */
  data: {
    bgImgPath: api.ImgUrl+'/FileDown/GetSharedImage?image_code=D055',
    
  },
  methods: {
    gorule(e){
      console.log( e)
      let url=this.data.url
      wx.navigateTo({
        url: url+"?type="+e.currentTarget.dataset.type
      })
     
    },
    close() {
      this.setData({
        isHidden: true,
      })
    },
    bindGetUserInfo(e) {
      if (!e.detail.userInfo) {
        return;
      }
      if (app.globalData.isConnected) {
        wx.setStorageSync('userInfo', e.detail.userInfo)
        app.globalData.userInfo = e.detail.userInfo;
        console.log(e.detail.userInfo, 'userInfobind');
        this.login();
      } else {
        wx.showToast({
          title: '当前无网络',
          icon: 'none',
        })
      }
    },
    loginV2() {
      let that = this;
      const token = wx.getStorageSync('token');

      wx.login({
        success(res) {
          if (res.code) {
            var code = res.code
            //判断用户是否授权
            wx.getSetting({
              success: res => {

                if (res.authSetting['scope.userInfo']) {
                  //已经授权，获取用户信息
                  wx.getUserInfo({
                    success: function(res) {
                      console.log(res, '已经授权，获取用户信息');
                      var encryptedData = res.encryptedData
                      var iv = res.iv;
                      var data2 = {
                        code: code,
                        encryptedData: encryptedData,
                        iv: iv
                      }

                      var data1 = {
                        client_id: app.globalData.client_id,
                        client_secret: app.globalData.client_secret,
                        grant_type: "client_credentials"
                      };

                      console.log(api.TokenUrl)
                      wx.request({
                        url: api.TokenUrl,
                        data: data1,
                        header: {
                          'content-type': 'application/x-www-form-urlencoded' // 默认值
                        },
                        method: "post",
                        success: function(res) {
                          wx.setStorageSync('token', 'Bearer ' + res.data.access_token);
                          app.globalData.Token = res.data.access_token;
                          console.log(res.data.access_token, 'token');
                          //验证
                          wx.request({
                            url: api.UserUrl,
                            data: data2,
                            header: {
                              'content-type': 'application/json', // 默认值,
                              'Authorization': 'Bearer ' + res.data.access_token //设置验证
                            },
                            method: "post",
                            success: function(res) {
                              //let that =this;
                              console.log(res.data.openid, 'openid授权');
                              console.log(res, 'res授权');
                              //可以把openid存到本地，方便以后调用
                              wx.setStorageSync('openid', res.data.openid);
                              wx.setStorageSync('session_key', res.data.session_key);
                              wx.setStorageSync('user_id', res.data.user_id);
                              app.globalData.openid=res.data.openid;
                              app.globalData.user_id=res.data.user_id;
                              //that.triggerEvent('afterAuth', app.globalData.Token)

                              wx.setStorageSync('WeixinAppId', res.data.appId);
                              wx.setStorageSync('WeixinAppSecret', res.data.appSecret);
                              app.globalData.WeixinAppSecret = res.data.appSecret;

                              console.log(wx.getStorageSync('token'), 'getStorageSync token my ')
                              that.triggerEvent('afterAuth', app.globalData.Token)
                              //绑定推荐关系
                              //update by 2020-03-22绑定用户时绑定用户推荐关系
                              //that.bindParent();
                            },
                            fail: function(err) {
                              console.log(err);
                            }
                          })


                        }


                      })


                    },

                  })
                } else {
                  //用户未授权



                }
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }

        }
      })
    },

    login() {
      const that = this;
      const token = wx.getStorageSync('token');
      
      wx.login({
        success(res) {
          if (res.code) {
            var code = res.code
            //判断用户是否授权
            wx.getSetting({
              success: res => {

                if (res.authSetting['scope.userInfo']) {
                  //已经授权，获取用户信息
                  wx.getUserInfo({
                    success: function (res) {
                      console.log(res, '已经授权，获取用户信息');
                      var encryptedData = res.encryptedData
                      var iv = res.iv;
                      var parent_user_id = wx.getStorageSync("parent_user_id");
                      if (parent_user_id == "undefined" || parent_user_id == 0 || parent_user_id == "" || parent_user_id == null && parent_user_id == undefined)
                      {
                        parent_user_id=0;
                      }
                      var spread_category = wx.getStorageSync("spread_category");
                      var spread_source = wx.getStorageSync("spread_source");
                      var spread_id = wx.getStorageSync("spread_id");
                      var data = {
                        code: code,
                        encryptedData: encryptedData,
                        iv: iv,
                        parent_user_id: parent_user_id,
                        spread_category: spread_category,
                        spread_source: spread_source,
                        spread_id: spread_id
                      }
                      /*
                      //验证
                      util.request(api.UserUrl, data, 'POST').then(function (res) {
                          
                          if (res.data.success == true) {

                            //let that =this;
                          console.log(res.data.openid, 'openid授权');
                          console.log(res, 'res授权');
                          //可以把openid存到本地，方便以后调用
                          wx.setStorageSync('openid', res.data.openid);
                          wx.setStorageSync('session_key', res.data.session_key);
                          wx.setStorageSync('user_id', res.data.user_id);
                          app.globalData.openid = res.data.openid;
                          app.globalData.user_id = res.data.user_id;
                          //that.triggerEvent('afterAuth', app.globalData.Token)

                          wx.setStorageSync('WeixinAppId', res.data.appId);
                          wx.setStorageSync('WeixinAppSecret', res.data.appSecret);
                          app.globalData.WeixinAppSecret = res.data.appSecret;

                          console.log(wx.getStorageSync('token'), 'getStorageSync token my ')
                          that.triggerEvent('afterAuth', app.globalData.Token)
                          //绑定推荐关系
                          //update by 2020-03-22绑定用户时绑定用户推荐关系
                          //that.bindParent();

                          } else {
                            console.log(res)
                          }
                        });
                      */
                      
                      util.commonRequest({
                        url: api.UserUrl,
                        data: data,
                        method: "post",
                        success: function (res) {
                          //let that =this;
                          console.log(res.data.openid, 'openid授权');
                          console.log(res, 'res授权');
                          //可以把openid存到本地，方便以后调用
                          wx.setStorageSync('openid', res.data.openid);
                          wx.setStorageSync('session_key', res.data.session_key);
                          wx.setStorageSync('user_id', res.data.user_id);
                          app.globalData.openid = res.data.openid;
                          app.globalData.user_id = res.data.user_id;
                          //that.triggerEvent('afterAuth', app.globalData.Token)

                          wx.setStorageSync('WeixinAppId', res.data.appId);
                          wx.setStorageSync('WeixinAppSecret', res.data.appSecret);
                          app.globalData.WeixinAppSecret = res.data.appSecret;

                          console.log(wx.getStorageSync('token'), 'getStorageSync token my ')
                          that.triggerEvent('afterAuth', app.globalData.Token)
                          //绑定推荐关系
                          //update by 2020-03-22绑定用户时绑定用户推荐关系
                          //that.bindParent();

                        },
                        fail: function (err) {
                          console.log(err);
                        },
                        complete: function () {
                          wx.hideLoading();
                        }
                      });
                    },

                  })
                } else {
                  //用户未授权
                }
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }

        }
      })
    },
    
    // 绑定推荐关系
    bindParent : function  () {
      var parent_user_id = wx.getStorageSync("parent_user_id");
      if (parent_user_id == "undefined" || parent_user_id == 0)
        return;
      console.log("Try To Bind Parent With User Id:" + parent_user_id);
      var user_id = wx.getStorageSync("user_id");
      if (parent_user_id != 0 && user_id !=0) {
        util.request(api.AddSpreadRelationUrl,
          { openid: app.globalData.openid, 
            user_id: app.globalData.user_id, 
            parent_user_id: parent_user_id
          }
          , 'POST').then(function (res) {
            console.log(res, '层级 ')
            if (res.data.success == true) {
              console.log(res.data.msg)
            } else {
              console.log(res.data.msg)

            }
          })
      }
    },
    //登录成功后不刷新的页面
    loginNoRefreshPage: [
      'pages/index/index',
    ],

  }
})