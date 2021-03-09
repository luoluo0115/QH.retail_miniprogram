// pages/customer/customerService/customerService.js
var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
import Dialog from '../../../vant-weapp/dist/dialog/dialog';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    customer_in_charge_number: [],
    customer_in_charge_ext: [],
    customerList: [],
    commonInfo: [],
    isHidden: true,


    messages: [

      {
        msgText: "您好",
        myself: 1,
        msgTime: "2019-12-17 19:00:00",
        avatarUrl: "../../../images/mini/chat.png",
        msgType: "text"
      },
      {
        msgText: "您好",
        myself: 0,
        msgTime: "2019-12-17 19:00:01",
        avatarUrl: "../../../images/mini/chat.png",
        msgType: "text"
      },
      {
        msgText: "可以注册公司吗？",
        myself: 1,
        msgTime: "2019-12-17 19:00:01",
        avatarUrl: "../../../images/mini/chat.png",
        msgType: "text"
      },
      {
        msgText: "可以注册公司吗？",
        myself: 1,
        msgTime: "2019-12-17 19:00:01",
        avatarUrl: "../../../images/mini/chat.png",
        msgType: "text"
      },
      {
        msgText: "可以注册公司吗？",
        myself: 0,
        msgTime: "2019-12-17 19:00:01",
        avatarUrl: "../../../images/mini/chat.png",
        msgType: "text"
      },
      {
        msgText: "可以注册公司吗？",
        myself: 1,
        msgTime: "2019-12-17 19:00:01",
        avatarUrl: "../../../images/mini/chat.png",
        msgType: "text"
      },
      {
        msgText: "可以注册公司吗？",
        myself: 0,
        msgTime: "2019-12-17 19:00:01",
        avatarUrl: "../../../images/mini/chat.png",
        msgType: "text"
      }
    ],

    friendId: '',
    friendName: '',
    friendAvatarUrl: '',
    ownerAvatarUrl: '',
    friendOpenId: '',
    complete: 0, // 是否还有历史消息可以拉取，1 - 表示没有，0 - 表示有
    content: '', // 输入框的文本值
    lock: false, // 发送消息锁 true - 加锁状态 false - 解锁状态
    scroll_height: wx.getSystemInfoSync().windowHeight - 55,
    openid: "",
    increase: false, //图片添加区域隐藏
    aniStyle: true, //动画效果
    previewImgList: [],
    currPageIndex: 1,
    maxPageIndex: 1,
    imgUrls:[],
    showactive:false,
    imgWoman:api.ImgUrl+'/FileDown/GetSharedImage?image_code=D022',
    imgMan:api.ImgUrl+'/FileDown/GetSharedImage?image_code=D023'
  
  },
  //关闭弹窗,跳转
  onActivityGo() {
    this.setData({ showactive: false });
    this.onActivityClose();
    wx.reLaunch({
        url: '../activity/index/index',
        fail: function () {
          wx.redirectTo({
            url: '../activity/index/index',
          })
        }
    });
  
  },
  //关闭弹窗
  onActivityClose() {
    
    let that= this;
    that.setData({ showactive: false });
    util.request(api.PostCloseActivityBoxUrl,//关闭推广活动弹框
      { openid:app.globalData.openid,user_id:app.globalData.user_id,spread_activity_user_step_id:that.data.spread_activity_user_step_id}
      ,'POST').then(function(res){
        if(res.data.success==true){
          console.log(res.data,'res');
        }else{
          console.log(res.data.msg)
        }
    })
  
  },
  //当前推广活动完步骤
  QueryCheckActivity: function(e) {
    let that= this;
    util.request(api.QueryCheckActivityUrl,//当前推广活动完步骤
      { openid:app.globalData.openid,user_id:app.globalData.user_id}
      ,'POST').then(function(res){
        if(res.data.success==true){
          console.log(res.data,'res');
          let achivement_name=res.data.activityInfo[0].achivement_name
          let is_pop_confirm=res.data.activityInfo[0].is_pop_confirm
          console.log(achivement_name)
          console.log(is_pop_confirm)
          if(achivement_name=='我要认证'){
            if(is_pop_confirm!='Y'){
              that.setData({ showactive: true,imgUrls:api.ImgUrl+'/FileDown/GetSharedImage?image_code=D011',spread_activity_user_step_id:res.data.activityInfo[0].spread_activity_user_step_id  });
            }
          }else if(achivement_name=='分享给TA'){
          
            if(is_pop_confirm!='Y'){
              console.log(is_pop_confirm)
              that.setData({ showactive: true,imgUrls:api.ImgUrl+'/FileDown/GetSharedImage?image_code=D012',spread_activity_user_step_id:res.data.activityInfo[0].spread_activity_user_step_id  });
            }
          }else if(achivement_name=='呼唤朋友'){
            if(is_pop_confirm!='Y'){
              that.setData({ showactive: true,imgUrls:api.ImgUrl+'/FileDown/GetSharedImage?image_code=D013',spread_activity_user_step_id:res.data.activityInfo[0].spread_activity_user_step_id  });
            }
          }else if(achivement_name=='开张大吉'){
            if(is_pop_confirm!='Y'){
              that.setData({ showactive: true,imgUrls:api.ImgUrl+'/FileDown/GetSharedImage?image_code=D014',spread_activity_user_step_id:res.data.activityInfo[0].spread_activity_user_step_id  });
            }
          }
          
        }else{
          console.log(res.data.msg)
          
        }
    })
  },
  //查询我的客服
  QueryCustService: function(e) {
    let that = this;
    util.request(api.QueryCustServiceUrl, //查询客服
      {
        openid: app.globalData.openid,
        user_id: app.globalData.user_id
      }, 'POST').then(function(res) {
      if (res.data.success == true) {
        that.setData({
          commonInfo: res.data.commonInfo[0]
        });
      } else {
        commonInfo: []
      }
    })
  },
  onClickConfirm() {
    const message = '电话:' + this.data.commonInfo.service_mp;
    wx.makePhoneCall({
      phoneNumber: this.data.commonInfo.service_mp,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    if (util.checkOpenId()) {
      that.QueryCustService();
    } else {
      this.setData({
        isHidden: false
      })
    }
    that.setData({
      messages: [],
      maxPageIndex: 1
    });
    that.getHistoryList(app.globalData.openid);


  },



  scrollEvent: function(data) {

    var that = this;
    var currPageIndex = that.data.currPageIndex;
    var maxPageIndex = that.data.maxPageIndex;
    if (currPageIndex < maxPageIndex) {

      that.setData({
        currPageIndex: currPageIndex + 1
      });
      that.getHistoryList(app.globalData.openid);
    }



  },
  getHistoryList: function(openid) {

    var that = this;
    if (util.checkOpenId()) {
      util.commonRequest({
        url: api.QueryCustServiceMessage,
        method: "post",
        data: {
          openid: openid,
          page_index: that.data.currPageIndex,
          page_size: 10
        },
        success: function(rdata) {
          wx.hideLoading();
          var res = rdata.data;
          console.log(res);
          console.log(res.success);
          if (res.success == true) {
 

            console.log("测试"); 
            that.setData({
              messages: res.msgList,
              maxPageIndex: res.maxCount
            });

          } else {
            wx.showToast({
              title: res.message
            });
          }
        }
      });
    }
  },

  showAuth() {
    this.setData({
      isHidden: false
    })
  },
  /*
   *授权登录成功后回调
   */
  afterAuth(e) {
    app.globalData.openid = wx.getStorageSync('openid');
    app.globalData.user_id = wx.getStorageSync('user_id');
    this.setData({
      isHidden: true,
      token: e.detail
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that= this;
    if( util.checkOpenId()){
      that.setData({
        isHidden:true
      })
      that.QueryCustService();
      that.getHistoryList(app.globalData.openid);
      that.QueryCheckActivity(); //我的活动推广状态
      
    }else{
      that.setData({
        isHidden:false
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  onSwitchTab:function(e){
    var ulrl = e.currentTarget.dataset.url; 
    console.log(ulrl);

    wx.navigateTo({
      url: "/"+ulrl,
    });
  },  

  previewImg: function(e) {

    var that = this;

    var list = that.data.previewImgList //页面的图片集合数组
    that.data.previewImgList = [];
    var res = e.target.dataset.src;
    if (list.indexOf(res) == -1) {

      that.data.previewImgList.push(res)

    }



    wx.previewImage({

      current: res, // 当前显示图片的http链接

      urls: that.data.previewImgList // 需要预览的图片http链接列表

    })


  },
})