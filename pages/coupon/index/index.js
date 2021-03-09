// pages/coupon/index/index.js
const app = getApp()
var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
import Toast from '../../../vant-weapp/dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coupons: '',
		busid: 0,
    token: null,
    couponList:[],
    isHidden: true, //是否隐藏登录弹窗,
  },
  //获取促销优惠券
  QueryPromotionCoupon:function() {
    let that = this;
    util.showLoading("数据请求中...");
    util.request(api.QueryPromotionCouponUrl,//获取促销优惠券
      {  openid:app.globalData.openid,user_id:app.globalData.user_id}
      ,'POST').then(function(res){
        if(res.data.success==true){
          console.log(res.data.couponList,'res.data.couponList')
          that.setData({
            couponList:res.data.couponList,
          });
          
        }else{
          console.log(res.data.msg)
          that.setData({
            couponList:[]
          });
        }
        util.hideLoading();
    })
      
  },
  onGetCoupon:function(event){
    console.log(event.currentTarget.dataset.promotion_coupon_id,'event.currentTarget.dataset.promotion_coupon_id');
    let that = this;
    let promotion_coupon_id = event.currentTarget.dataset.promotion_coupon_id
    util.showLoading("数据请求中...");
    util.request(api.AddReceiveCouponUrl,//获取促销优惠券
      {  openid:app.globalData.openid,user_id:app.globalData.user_id,promotion_coupon_id:promotion_coupon_id}
      ,'POST').then(function(res){
        if(res.data.success==true){
          Toast.success(res.data.msg);
          that.QueryPromotionCoupon()
          
        }else{
          Toast.fail(res.data.msg);
          
        }
        util.hideLoading();
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that= this;
    if( util.checkOpenId()){
      that.QueryPromotionCoupon()
    }else{
      this.setData({
        isHidden:false
      })
    }
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
    let that= this;
    if( util.checkOpenId()){
      that.setData({
        isHidden:true
      })
    }else{
      that.setData({
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