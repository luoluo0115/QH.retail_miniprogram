// pages/me/mySetting/mySetting.js
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
    isHidden: true,
    token: null,
    myBasicSetupList:[],
    checked:false,
  },
   //选择
   onChange({ detail }) {
     console.log({ detail },'{ detail }')
    
     let that= this;
    //  let setChecked=event.detail
    this.setData({ checked: detail });
     if(detail==true){
        that.PostBasicSetupe('D');
     }else if(detail==false){
        that.PostBasicSetupe('F');
     }
     
  },
  PostBasicSetupe:function(e){
    let that= this;
    console.log(e,'e设置')
    util.request(api.PostBasicSetupeUrl,//更新我的基本设置
      { openid:app.globalData.openid,user_id:app.globalData.user_id,homepage_style:e}
      ,'POST').then(function(res){
        if(res.data.success==true){
          Toast.success(res.data.msg);
          that.QueryBasicSetupe()
        }else{
          console.log(res.data.msg)
          Toast.fail(res.data.msg);
        
        }
    })
  },
  QueryBasicSetupe:function(){
    let that= this;
    util.request(api.QueryBasicSetupe,//查询我的基本设置
      { openid:app.globalData.openid,user_id:app.globalData.user_id}
      ,'POST').then(function(res){
        if(res.data.success==true){
            that.setData({
              myBasicSetupList:res.data.myBasicSetupList[0],
            });
            console.log(res.data.myBasicSetupList[0].homepage_style,'res.data.myBasicSetupList[0].homepage_style');
            if(res.data.myBasicSetupList[0].homepage_style=='F'){
              that.setData({
                checked:false,
              });
            }else{
              that.setData({
                checked:true,
              });
            }
        }else{
          console.log(res.data.msg)
          that.setData({
            myBasicSetupList:[],
          });
        
        }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that= this;
    if( util.checkOpenId()){
      that.QueryBasicSetupe()
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
    this.QueryBasicSetupe()
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