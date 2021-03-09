// pages/me/myOrder/myOrder.js
const app = getApp()
var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
var WxParse = require('../../../wxParse/wxParse.js');
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

  },
  onChange(event) {
    console.log(event.detail.title,'title');
    if(event.detail.title=='未支付'){
      this.QueryMyOrder('S')
    }else if(event.detail.title=='已付款'){
      this.QueryMyOrder('R')
    }else{
      this.QueryMyOrder('C')
    }
    
  },
  //签到按钮
  scoresign: function (e) {
    this.QuerySignData();
    this.setData({ showscore: true });
    
  },
  //我的订单
  QueryMyOrder: function(e) {
   
    let that= this;
    if(e=='R'){
      that.setData({
        active: 1
      })
    }
    util.request(api.QueryMyOrderUrl,//查询我的订单
      { openid:app.globalData.openid,user_id:app.globalData.user_id,status:e}
      ,'POST').then(function(res){
        if(res.data.success==true){
            that.setData({
              orderList:res.data.orderList,
            });
            console.log(res.data.orderList,'orderList')

        }else{
          that.setData({
            msg:res.data.msg,
            orderList:[],
          });
        
        }
    })
    
  },
   bindTapProductDetail:function(event) {
    let item_id = event.currentTarget.dataset.item_id
    wx.navigateTo({
      url: '../../product/good/good?spread_id='+ item_id

    })
     
  },
  onCancel:function(event){
    let pre_order_id = event.currentTarget.dataset.pre_order_id;
    let that= this;
    util.request(api.DeletePreOrderUrl,//删除未付款查询订单
      { openid:app.globalData.openid,user_id:app.globalData.user_id,pre_order_id:pre_order_id}
      ,'POST').then(function(res){
        if(res.data.success==true){
          Toast.success(res.data.msg);
          that.QueryMyOrder('S')

        }else{
          Toast.fail(res.data.msg);
          
          
        }
    })
  },
  //订单支付
  OrderPay: function (event) {
    let dataInfo = event.currentTarget.dataset.item;
    let pre_order_id = dataInfo.pre_order_id;
    let product_name = dataInfo.product_name;
    let need_pay_amount = dataInfo.need_pay_amount;
    let pay_app_id = dataInfo.pay_app_id;
    let appid = app.globalData.WeixinAppId;
    let that = this;
    wx.showLoading({
      title: "正在支付",
      mask: true,
    });
    let openid = app.globalData.openid;
    if (!openid || openid == undefined) {
      wx.showToast({
        title: "未授权登录.请授权登录后支付!",
      });
      return;
    }
    let status = dataInfo.status;
    if (!status || status !="A") {
      wx.hideLoading();
      Toast('订单不能支付,请联系管理员调整价格后支付!');
      return;
    }
    var data = {
      openid: openid,
      money: need_pay_amount,
      name: product_name,
      id: pre_order_id,
      orderType: 'AB',
      pay_app_id: pay_app_id,
      appid: appid
    }
    console.log(data)
    //预交款
    util.request(api.WxPayOrderPrepaidUrl, data, "POST").then(function (res) {
      console.log(res);
      wx.hideLoading();
      //发起缴款
      wx.requestPayment({
        timeStamp: res.data.timeStamp,
        nonceStr: res.data.noneStr,
        package: "prepay_id=" + res.data.packge,
        signType: 'MD5',
        paySign: res.data.paySign,
        success(res) {
          console.log(res);
          that.QueryMyOrder('S')
          // wx.navigateTo({
          //   url: '../../pages/product/paySuccess',//付款成功
          // })
        },
        fail(res) {
          console.log(res);
          // wx.navigateTo({
          //   url: '../../pages/product/payFailure',//付款失败
          // })
        },
        complete: function (res) {
          //支付失败转到待支付订单列表
          if (res.errMsg == "requestPayment:fail" || res.errMsg == "requestPayment:fail cancel") {
            wx.showModal({
              title: "提示",
              content: "订单尚未支付",
              showCancel: false,
              confirmText: "确认",
              success: function (res) {
                if (res.confirm) {
                  wx.redirectTo({
                    url: "/pages/me/myOrder/myOrder?status=S",
                  });
                }
              }
            });
            return;
          }
          // wx.navigateTo({
          //   url: '../../pages/product/payFailure',//付款失败
          // })
        }
      })
    })

  },
  //领取订单奖励
  onTapdraw:function(e){
    let that= this;
    let pre_order_id=e.currentTarget.dataset.pre_order_id;
    let pre_order_commission_id=e.currentTarget.dataset.pre_order_commission_id;
    let type = e.currentTarget.dataset.type;
    util.request(api.PostAchievementReceiveUrl,//领取我的订单奖励
      { openid:app.globalData.openid,user_id:app.globalData.user_id,pre_order_id:pre_order_id,pre_order_commission_id:pre_order_commission_id}
      ,'POST').then(function(res){
        if(res.data.success==true){
            Toast(res.data.msg);
          that.QueryMyOrder(type)
        }else{
          Toast(res.data.msg);
        
        }
    })
    

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     
      let that= this;
      if( util.checkOpenId()){
        if(options.status!=undefined){
          that.QueryMyOrder(options.status)
          
        }else{
          console.log(that.data.status,'that.data.status')
          that.QueryMyOrder(that.data.status)
        }
        
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
    if(util.checkOpenId()){
      this.setData({
        isHidden:true
      })
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