// pages/product/pay-order/pay-order.js
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
    goodPrice:[],
    goodsList: [],
		allGoodsPrice: 0,
		yunPrice: 0,
		allGoodsAndYunPrice: 0,
		goodsJsonStr: "",
		hasNoCoupons: true,
		coupons: [],
		youhuijine: 0, //优惠券金额
		curCoupon: null, // 当前选择使用的优惠券
		isHidden: true,
    token: null,
    showCoupon:false,
    radio: '',
    couponUseList:'',
    coupon_amount:0,
    couponLength:0,
    last_amount:0,
    promotion_coupon_user_id:0,
    promotion_coupon_id:0,
    couponUseList1:[],
    list: ['a', 'b', 'c'],
    result: ''
   
  },
  // onChange1(event) {
  //   console.log(event,'event.detail')
  //   if(event.detail==''){
  //     this.setData({
  //       result: event.detail,
  //       couponUseList:'',
  //       check: event.detail
  //     });
  //     console.log(this.data.result,'')
  //   }else{
  //     this.setData({
  //       result: event.detail
  //     });
  //   }
   
  // },
  onChange(event) {
    console.log();
    this.setData({
      radio: event.detail
    });
  },
  // toggle(event) {
  //   const { index } = event.currentTarget.dataset;
  //   const checkbox = this.selectComponent(`.checkboxes-${index}`);
  //   checkbox.toggle();
  // },

  // noop() {},
  /*不使用优惠券*/
  noCoupon:function(){
    let that= this;
    let price= that.data.goodPrice
    let last_amount=price;
      this.setData({
        showCoupon:false,
        coupon_amount:0,
        last_amount:last_amount,
        radio:'',
        couponUseList:'',
        promotion_coupon_user_id:0,
        promotion_coupon_id:0,
      })

  },
  /*使用优惠券*/
  userCoupon:function(e){
    let that= this;
    let radio=that.data.radio;
    let result=that.data.result;
    let price= that.data.goodPrice
    if(radio!=''){
      let couponUseList=that.data.couponUseList1[radio]
      let coupon_amount=that.data.couponUseList1[radio].coupon_amount
      let last_amount=price-coupon_amount
      this.setData({
        showCoupon:false,
        coupon_amount:coupon_amount,
        last_amount:last_amount,
        couponUseList:couponUseList,
        promotion_coupon_user_id:couponUseList.promotion_coupon_user_id,
        promotion_coupon_id:couponUseList.promotion_coupon_id,
      })
    
    }else{
      let last_amount=price;
      this.setData({
        showCoupon:false,
        coupon_amount:0,
        last_amount:last_amount,
        couponUseList:'',
        promotion_coupon_user_id:0,
        promotion_coupon_id:0,
      })
    }
    
   
   
  },
  /*获取优惠券*/
  goCoupon:function(){
    this.setData(
      {
        showCoupon:true
      }
    )
    // this.QueryMyCoupon(this.data.goodsList[0])
  
  },
  //查询优惠券
  QueryMyCoupon: function(e) {
    console.log(e,'e111')
    let that= this;
    util.request(api.QueryPromotionCouponUseUrl,//查询优惠券
      { openid:app.globalData.openid,user_id:app.globalData.user_id,pre_product_id:e.goodsId,order_amount:e.price}
      ,'POST').then(function(res){
        console.log(res,'res.data.couponUseList');
        if(res.data.success==true){
            //console.log(res.data.orderList,'我的订单')
            that.setData({
              couponUseList1:res.data.couponUseList,
              couponLength:res.data.couponUseList.length
            });
        }else{
          //console.log(res.data.msg)
          that.setData({
            couponUseList1:[],
            msg:res.data.msg,
            couponLength:0
          });
        
        }
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.token= wx.getStorageSync('token'),
    app.globalData.openid = wx.getStorageSync('openid');
    if (app.globalData.iphone == true) {
      this.setData({
        iphone: 'iphone'
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  
 
  onClose() {
    this.setData({ showCoupon: false });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
		let that = this;
		let shopList = [];
    if( util.checkOpenId()){
     
      //立即下单
      var buyNowInfoMem = wx.getStorageSync('buyNowInfo');
      if (buyNowInfoMem && buyNowInfoMem.shopList) {
        shopList = buyNowInfoMem.shopList
      }
      that.setData({
        goodsList: shopList,
        goodPrice:shopList[0].price
      });
      that.QueryMyCoupon(that.data.goodsList[0])
    }else{
      that.setData({
        isHidden:false
      })
    }
		
    
  },
 
  //立即下单
  createOrder: function(e) {
    //wx.showLoading();
    const that = this;
		let remark = ""; // 备注信息
		if (e) {
			remark = e.detail.value.remark; // 备注信息
    }
    that.setData({
      last_amount:that.data.goodsList[0].price-that.data.coupon_amount,
    })
		let postData = {
			openid: app.globalData.openid,
      pre_product_id: that.data.goodsList[0].goodsId,
      order_amount:Number(that.data.last_amount),
      user_id:wx.getStorageSync('user_id'),
      pre_product_price_id:that.data.goodsList[0].pre_product_price_id,
      param_data:that.data.goodsList[0].label,
      promotion_coupon_user_id:that.data.promotion_coupon_user_id,
      promotion_coupon_id:that.data.promotion_coupon_id,
      coupon_amount:that.data.coupon_amount,
      remark:remark

    };
    console.log(postData,'postData');
    util.request(api.GeneratePreOrderUrl,//生成前置订单
      postData
      ,'POST').then(function(res){
        console.log(res,'下单');
        if(res.data.success==true){
          var orderInfo = res.data.preOrderInfo[0];
          var status = orderInfo.status;
          if (status=="A")
          {
            that.OrderPay(res.data.preOrderInfo[0]);  
          }else
          {
            Toast('订单未支付成功!');
            wx.showModal({
              title: "提示",
              content: "该订单价格需要提供企业信息评估后才能付款，请在咨询界面与专属服务人员沟通确认调整价格后支付，谢谢配合！",
              showCancel: false,
              confirmText: "确认",
              success: function (res) {
                if (res.confirm) {
                  wx.redirectTo({
                    url: "../../me/myOrder/myOrder?status=S",
                  });
                }
              }
            });
          }            
        }else{
          Toast('提交订单失败!');
        }
    })
		
			
	},

  //订单支付
  OrderPay: function (event) {
    let pre_order_id = event.pre_order_id;
    let product_name = event.product_name;
    let need_pay_amount = event.need_pay_amount;
    let pay_app_id = event.pay_app_id;
    let appid = app.globalData.WeixinAppId;
    console.log("订单信息" + JSON.stringify(event));
    let that = this;
    wx.showLoading({
      title: "正在支付",
      mask: true,
    });
    let openid = app.globalData.openid;
    console.log(openid)
    if (!openid || openid == undefined) {
      wx.showToast({
        title: "未授权登录.请授权登录后支付!",
      });
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
    //预交款
    console.log('data' + JSON.stringify(data))
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
          Toast('支付成功!');
         
        },
        fail(res) {
          console.log(res);
          Toast('支付失败!');
          wx.navigateTo({
            //url: '../../pages/product/payFailure',//付款失败
          })
        },
        complete: function (res) {
          //付款完成
          console.log('complete--' + res);
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
                    url: "../../me/myOrder/myOrder?status=S",
                  });
                }
              }
            });
            return;
          }
          if (res.errMsg == "requestPayment:ok") {
            wx.redirectTo({
              url: "../../me/myOrder/myOrder?status=R",
            });
            return;
          }
          wx.navigateBack({
            delta: 2,
            });
        }
      })
    })

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
		this.setData({
			isHidden:true
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