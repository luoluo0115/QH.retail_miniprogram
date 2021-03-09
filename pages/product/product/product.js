// pages/product/product/product.js
const app = getApp()
var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
import Toast from '../../../vant-weapp/dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto: '欢迎来到企汇财税秘书',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    show: true,
    userInfo: null,
		isHidden: true, //是否隐藏登录弹窗
    token:null,
    vedioCategoryByList:[],
    product_summary:'',
    showscore: false,
    //签到模块
    signNum: 0,  //签到数
    signState: false, //签到状态
    min: 1,  //默认值日期第一天1
    max: 7 , //默认值日期最后一天7
    signData:[],
    uid:[],
    second:2,
    imgUrls: [
     ],
     showactive:false,
  
  
  },
  
  //事件处理函数
  //关闭弹窗,跳转
  onActivityGo() {
    this.setData({ showactive: false });
    this.onActivityClose();
    wx.reLaunch({
        url: '../../activity/index/index',
        fail: function () {
          wx.redirectTo({
            url: '../../activity/index/index',
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
          if(achivement_name=='我要认证'){
            if(is_pop_confirm!='Y'){
              that.setData({ showactive: true,imgUrls:api.ImgUrl+'/FileDown/GetSharedImage?image_code=D011',spread_activity_user_step_id:res.data.activityInfo[0].spread_activity_user_step_id  });
            }
          }else if(achivement_name=='分享给TA'){
          
            if(is_pop_confirm!='Y'){
          
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

 //分享按钮轮播

 shareBtnSwiper:function(){
  let that=this
  let spread_false_amt=that.data.commonInfo.spread_false_amt
  if( util.checkOpenId()){
    wx.navigateTo({
      url: '../../extend/shareSwiper/shareSwiper?coinpurse='+ spread_false_amt 
    })
  }else{
    that.setData({
      isHidden:false
    })
  }
},
  //查询我的成就
  QueryCommonInfo: function(e) {
    let that= this;
    util.request(api.QueryCommonInfoUrl,//查询签到
      { openid:app.globalData.openid,user_id:app.globalData.user_id}
      ,'POST').then(function(res){
        if(res.data.success==true){
          that.setData({
            commonInfo:res.data.commonInfo[0]
          });
          app.globalData.commonInfo=res.data.commonInfo[0]
        }else{
          console.log(res.data.msg)
          commonInfo:[]
          
        }
    })
  },
  shareBtn:function(){
    if( app.globalData.token){
      wx.navigateTo({
        url: '../../me/sharePersonal/sharePersonal'
      })
    }else{
      this.setData({
        isHidden:false
      })
    }
  },
  showPopup() {
    this.setData({ showscore: true });
  },


  //签到按钮
    scoresign: function (e) {
      this.QuerySignData();
      this.setData({ showscore: true });
      
    },
     //查询签到状态
     QuerySignState: function(e) {
      let that= this;
      util.request(api.QuerySignStateUrl,//查询签到状态
        { openid:app.globalData.openid,user_id:app.globalData.user_id}
        ,'POST').then(function(res){
          if(res.data.success==true){
            if(res.data.signState==true){
              console.log(res.data.signState,'签到状态')
              that.setData({
                signState:res.data.signState,
              });
            }
            
          }else{
            console.log(res.data.msg)
           
          }
      })
      
    },
   
    //查询签到
    QuerySignData: function(e) {
      let that= this;
      util.request(api.QuerySignDataUrl,//查询签到
        { openid:app.globalData.openid,user_id:app.globalData.user_id}
        ,'POST').then(function(res){
          if(res.data.success==true){
        
            if(res.data.signState==true){
            that.setData({
              signState:res.data.signState,
              signData:res.data.signData[0],
              max:res.data.signData[0].full_action_times
            });
            }else{
            that.AddCreateSign();
            }
            
          }else{
            console.log(res.data.msg)
            that.AddCreateSign();
          }
      })
    },
    //签到
    AddCreateSign: function(e) {
    let that= this;
    util.request(api.AddCreateSignUrl,//签到
      { openid:app.globalData.openid,user_id:app.globalData.user_id}
      ,'POST').then(function(res){
        if(res.data.success==true){
          that.setData({
          signState:res.data.signState,
          signData:res.data.signData[0],
          max:res.data.signData[0].full_action_times
          });
          
        }else{
          console.log(res.data.msg)
          that.setData({
          signData:[]
          });
        }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryPreProductList();
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let that= this;
    if( util.checkOpenId()){
      
      that.setData({
        isHidden:true
      })
      this.QueryPreProductList();
      that.QueryCheckActivity(); //我的活动推广状态
      that.getUserInfoDetail();
      that.QuerySignState();
      that.QueryCommonInfo()
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
    this.getUserInfoDetail();
    this.QueryPreProductList()
	},
	getUserInfoDetail: function(e) {
		this.setData({
		  userInfo: app.globalData.userInfo,
		  hasUserInfo: true
		})
	},
  //获取前置产品列表
  QueryPreProductList:function() {
    let that = this;
    util.request(api.QueryPreProductListUrl,//获取前置产品列表
      {  openid:app.globalData.openid,pre_product_id:"0"}
      ,'POST').then(function(res){
        if(res.data.success==true){
          that.setData({
            vedioCategoryByList:res.data.vedioCategoryByList,
          });
          
        }else{
          console.log(res.data.msg)
          that.setData({
            vedioCategoryByList:[]
          });
        }
    })
       
      
  },
  bindTapProductDetail:function(event) {
    let item_id = event.currentTarget.dataset.item_id
    wx.navigateTo({
      // url: '../../draw2img/index',
      url: '../good/good?spread_id='+ item_id

    })
     
  },
  //荣誉跳转
  bindgoHonor: function() {
    wx.navigateTo({
      url: '/pages/me/myAward/myAward?item=H&honor='+this.data.commonInfo.honor_name
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