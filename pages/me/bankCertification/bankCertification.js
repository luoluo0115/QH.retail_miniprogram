const app = getApp()
var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
import Toast from '../../../vant-weapp/dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
      src:"",
      is_up:false,
      fileList: [],
      isHidden: true,

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
 
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
 cut:function(){
 
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

  onChang(){
      let that=this;
    wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success (res) {
          // tempFilePath可以作为img标签的src属性显示图片
          that.setData({
              src:res.tempFilePaths,
              is_up:true
          })
        }
      })
  },
  
  upload:function(){
      let that=this;
      if(that.data.src==''){
        Toast('请上传银行卡');
        return;
      }
    Toast.loading({
        mask: false,
        duration:0,
        message: '认证中...'
      });
      wx.uploadFile({
        url:   api.BankCardIdentify, //api.Check,
        filePath: that.data.src[0],
        name: 'file',
        header: {
          "Content-Type": "multipart/form-data",//记得设置
           'Authorization': 'Bearer '+wx.getStorageSync('qh_access_token') //设置验证
        },
        formData: {
          'openid':app.globalData.openid,
          'user_id':app.globalData.user_id
        },
        success: function(res) {
          console.log(res);
          var result=JSON.parse(res.data);
          console.log(result);
           if(result.success=="success"){   
            Toast.success('认证成功');
            setTimeout(function(e){
              wx.redirectTo({
                url: '../certificationInfo/certificationInfo'
                 });
            },2000)
           
           }else if(result.success=="false"){
            Toast.fail(result.code); 
           }
          
        },
        fail: function(res) {
          console.log(res);
        },
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