// pages/me/sharePersonal/sharePersonal.js
const app = getApp()
var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
import Toast from '../../../vant-weapp/dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList:[],
    active: 0,
    status: "S",
    isHidden: true,
    token: null,
    myNamecardList:[],
    show: false,
    showbill:false,
  },
  onShareAppMessage: function (id) {
    return {
      title: '名片分享',
      path: '/pages/me/sharePersonal/sharePersonal?user_id=${app.globalData.user_id}',  //分享的页面所需要的id
      success: function(res) {
        var shareTickets = res.shareTickets;
        if (shareTickets.length == 0) {
            return false;
        }
        wx.getShareInfo({
            shareTicket: shareTickets[0],
            success: function(res){
                var encryptedData = res.encryptedData;
                var iv = res.iv;
            }
        })
      },
      fail: function(res) {
        // 转发失败
        Toast.fail(res.data.msg);

      }
    
    }
  },
  onTapShare() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },
  onTapBill(){
    this.setData({show: false, showbill: true });
  },
  onTapArticle(event){
    this.setData({show: false, showbill: true });
  },
   
  
  onCloseBill() {
    this.setData({ showbill: false });
  },
  QueryMyNamecard:function(){
    let that= this;
    util.request(api.QueryMyNamecardUrl,//查询我的名片
      { openid:app.globalData.openid,user_id:app.globalData.user_id}
      ,'POST').then(function(res){
        if(res.data.success==true){
            that.setData({
              myNamecardList:res.data.myNamecardList[0],
            });
        }else{
          console.log(res.data.msg)
          that.setData({
            myNamecardList:[],
          });
        
        }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that= this;
    app.globalData.token= wx.getStorageSync('token')
    if( app.globalData.token){
      that.QueryMyNamecard()
    }else{
      this.setData({
        isHidden:false
      })
    }
  },
  showAuth(){
		this.setData({
			isHidden:false
		})
	},
	/*
	*授权登录成功后回调
	*/
	afterAuth(e){
    app.globalData.openid=wx.getStorageSync('openid');
    app.globalData.user_id=wx.getStorageSync('user_id');
		this.setData({
			isHidden:true,
			token:e.detail
		})
    this.getUserInfoDetail();
	},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(app.globalData.token){
      this.getUserInfoDetail()
		}
  },
  getUserInfoDetail: function(e) {
    console.log(app.globalData.userInfo,'userInfo')
		this.setData({
		  userInfo: app.globalData.userInfo,
		  hasUserInfo: true
		})
	},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  
})