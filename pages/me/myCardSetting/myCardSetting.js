// pages/me/myCardSetting/myCardSetting.js
const app = getApp()
var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
import Toast from '../../../vant-weapp/dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isHidden: true,
    checkedMobile:true,
    checkedTitle:'',
    checkedWechart:'',
    checkedEmail:'',
    checkedAdress:'',
    checked:true,
  },
 //选择
onChangeSwitch(event) {
  let that = this;
  let item=event.currentTarget.dataset.item;//是否id
  let nameCardInfo=that.data.nameCardInfo
  for(var i=0;i<nameCardInfo.length;i++){
    if(item==nameCardInfo[i].id){
      if(event.detail==true){
        nameCardInfo[i].isDisplay='Y'
      }else{
        nameCardInfo[i].isDisplay='N'
      }
    }
  }
  that.setData({
    nameCardInfo:nameCardInfo
  })
  
},

formSubmit: function (e) {
  let that = this;
  let display_ctrl=""
  let nameCardInfo=that.data.nameCardInfo
  for(var i=0;i<nameCardInfo.length;i++){
    display_ctrl=display_ctrl + nameCardInfo[i].isDisplay
  }
  let postData = {
    openid: app.globalData.openid,
    user_id:app.globalData.user_id,
    display_ctrl:display_ctrl
  };
  util.request(api.PostNamecardSetupUrl,//更新名片设置
    postData
    ,'POST').then(function(res){
      if(res.data.success==true){
        that.QueryNameCardInfo()
        Toast.success(res.data.msg);
      }else{
        Toast.fail(res.data.msg);
      
      }
  })
   
 
},
//名片设置显示
QueryNameCardInfo: function(e) {
  
  let that = this;
  util.request(api.QueryNameCardInfoUrl,//名片设置显示
    { openid:app.globalData.openid,user_id:app.globalData.user_id}
    ,'POST').then(function(res){
      if(res.data.success==true){
        that.setData({
          nameCardInfo:res.data.nameCardInfo
        })
        
      }else{
        that.setData({
          nameCardInfo:[],
          msg:res.data.msg
        })
      }
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
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
    let that= this;
    if( util.checkOpenId()){
      that.QueryNameCardInfo()
    }else{
      this.setData({
        isHidden:false
      })
    }
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