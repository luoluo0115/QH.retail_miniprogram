// pages/activity/index/index.js
const app = getApp()
var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      api.ImgUrl+'/FileDown/GetSharedImage?image_code=D004',
      api.ImgUrl+'/FileDown/GetSharedImage?image_code=D005',
      api.ImgUrl+'/FileDown/GetSharedImage?image_code=D006',
      api.ImgUrl+'/FileDown/GetSharedImage?image_code=D007',
      api.ImgUrl+'/FileDown/GetSharedImage?image_code=D008',
      api.ImgUrl+'/FileDown/GetSharedImage?image_code=D009',
      api.ImgUrl+'/FileDown/GetSharedImage?image_code=D010'
    ],
    isHidden: true, //是否隐藏登录弹窗,
    activityInfo:'',
    time:'0',
    spread_activity_user_id:''
  },
  goRule:function(e){
    if(util.checkOpenId()){
      let type=e.currentTarget.dataset.type;
      if(type=="active-rule"){
        wx.navigateTo({
          url: "../rule/rule?type="+type
        })
      }else if(type=="active-share"){
        wx.navigateTo({
          url: "../../extend/billList/billList"
        })
      }else if(type=="active-card"){
        wx.navigateTo({
          url: "../../me/myCard/myCard"
        })
      }else if(type=="active-cert"){
        wx.navigateTo({
          url: "../../me/phoneCertification/phoneCertification?spread_activity_user_id="+this.data.spread_activity_user_id
        })
      }
      
      this.setData({
        isHidden:true
      })
		}else{
      this.setData({
        isHidden:false
      })
    }
   
  },
  goMyWallet:function(){
    if(util.checkOpenId()){
      wx.navigateTo({
        url: "../../me/myWallet/myWallet"
      })
      this.setData({
        isHidden:true
      })
		}else{
      this.setData({
        isHidden:false
      })
    }
   
  },
   //生成推广活动
   PostGenerateActivity:function(event) {
    let that = this;
    let pre_product_id=event;
    util.showLoading("数据请求中...");
    util.request(api.PostGenerateActivityUrl,//获取生成推广活动
      {  openid:app.globalData.openid,user_id:app.globalData.user_id}
      ,'POST').then(function(res){
          if(res.data.success==true){
           
            console.log(res.data.msg)
          }else{
            console.log(res.data.msg)
          }
          that.QueryMyActivity();
          util.hideLoading();
    })
      
  },
  //我的推广活动
  QueryMyActivity:function(event) {
    let that = this;
    let pre_product_id=event;
    util.showLoading("数据请求中...");
    util.request(api.QueryMyActivityUrl,//获取生成推广活动
      {  openid:app.globalData.openid,user_id:app.globalData.user_id}
      ,'POST').then(function(res){
          if(res.data.success==true){
            console.log(res.data.msg)
            that.setData({
              activityInfo:res.data.activityInfo,
              time:res.data.activityInfo[0].countdown
            })
            let activityInfo=res.data.activityInfo
            for(var i=0;i<activityInfo.length;i++){
              if(activityInfo[i].achivement_name=="我要认证"){
                that.setData({
                  status1:activityInfo[i].status,
                  spread_activity_user_id:activityInfo[i].spread_activity_user_id
                })
              }else if(activityInfo[i].achivement_name=="分享给TA"){
                that.setData({
                  status2:activityInfo[i].status
                })
              }else if(activityInfo[i].achivement_name=="呼唤朋友"){
                that.setData({
                  status3:activityInfo[i].status
                })
              }else if(activityInfo[i].achivement_name=="开张大吉"){
                console.log(activityInfo[i].status,'activityInfo[i].status')
                that.setData({
                  status4:activityInfo[i].status
                })
              }

            }
            
          }else{
            console.log(res.data.msg)
            
          }
          util.hideLoading();
    })
      
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let spread_activity_id=options.spread_activity_id
    
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
    let that =this
    if(util.checkOpenId()){
     
      that.PostGenerateActivity()//生成活动
      that.setData({
        isHidden:true
      })
		}else{
      console.log(5555);
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
    //this.QueryMyActivity()
    this.PostGenerateActivity();
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