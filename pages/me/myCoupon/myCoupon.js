// pages/me/myCoupon/myCoupon.js
const app = getApp()
var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
var WxParse = require('../../../wxParse/wxParse.js');
import Toast from '../../../vant-weapp/dist/toast/toast';
import Dialog from '../../../vant-weapp/dist/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myCouponList:[],
    status:"N",
    isHidden: true,
    showpost:false,
    close:true,
    cell_phone:'',
    sendInfo: '', 

  },
 //我的优惠券
 QueryMyCoupon: function(e) {
    let that= this;
    util.request(api.QueryMyCouponUrl,//查询我的订单
      { openid:app.globalData.openid,user_id:app.globalData.user_id,status:e}
      ,'POST').then(function(res){
        if(res.data.success==true){
            //console.log(res.data.myCouponList,'我的订单')
            that.setData({
              myCouponList:res.data.myCouponList,
            });
        }else{
          //console.log(res.data.msg)
          that.setData({
            myCouponList:[],
            msg:res.data.msg
          });
        
        }
    })
    
  },
  //弹出赠送弹窗
  showPost:function(event){
    this.setData({
      showpost:true,
      promotion_coupon_id:event.currentTarget.dataset.promotion_coupon_id,
      promotion_coupon_user_id:event.currentTarget.dataset.promotion_coupon_user_id
    })
    
  },
  //赠与优惠券
 
  bindSave: function(event){
    //console.log(event,'event');
    let that = this;
    if (!util.checkOpenId()){
      return that.showAuth()
    }
    that.setData({
      cell_phone : event.detail.value.cell_phone
    })
    let cell_phone = event.detail.value.cell_phone;
    //console.log( cell_phone,'cell_phone')
		if (cell_phone == ""){
      Toast('手机号不能为空');
			return
    }
    if(!(/^1[345789]\d{9}$/.test(cell_phone)) ){
      Toast('请填写正确的手机号');
      return
    }
    let postData={
      openid:app.globalData.openid,user_id:app.globalData.user_id,promotion_coupon_id:that.data.promotion_coupon_id,promotion_coupon_user_id:that.data.promotion_coupon_user_id,cell_phone:cell_phone
    }
    console.log(postData,'postData')
    util.request(api.PostTransferCouponUrl,//查询我的订单
      postData
      ,'POST').then(function(res){
       console.log(res,'res')
        if(res.data.success==true){
          Toast(res.data.msg);
          that.setData({
            showpost: false,
            msg:res.data.msg,
            cell_phone:''
          });
          that.QueryMyCoupon(that.data.status)
        }else{
          Toast(res.data.msg);
          console.log(res.data.msg)
          
        }
    })
    
    
  },
  onClose() {
    this.setData({ showpost: false,cell_phone:'' });
  },
  cleanInput: function () {
    var setMessage = { cell_phone:''}
    this.setData(setMessage)
  },
  //切换我的优惠券title
  onChange(event) {
    if(event.detail.title=='待使用'){
      this.QueryMyCoupon('N')
    }else if(event.detail.title=='已使用'){
      this.QueryMyCoupon('Y')
    }else if(event.detail.title=='已过期'){
      this.QueryMyCoupon('X')
    }
    
  },
  goProduct:function(e){
    let item_id = e.currentTarget.dataset.item_id
    if(item_id!=null){
      wx.navigateTo({
        url: '../../product/good/good?spread_id='+ item_id
      })
    }else{
      wx.navigateTo({
        url: '../pages/product/product/product'
      })
    }
   
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that= this;
   
    if( util.checkOpenId()){
      that.QueryMyCoupon(that.data.status)
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