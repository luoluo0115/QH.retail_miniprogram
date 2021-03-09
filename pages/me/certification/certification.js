const app = getApp()
var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
import Toast from '../../../vant-weapp/dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:0,
    iscerame:false,
    username:"",
    IDCard:"",
    list:[],
    steps: [
      {
        text: '步骤一',
        desc: '实名认证'
      },
      {
        text: '步骤二',
        desc: '人脸识别'
      },
      {
        text: '步骤三',
        desc: '确认信息'
      }
    ],
    isID:true,
    isHidden: true,

  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    that.setData({
      username:options.username,
      IDCard:options.IDCard
    }) 
    
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  OnChange:function(){
    if(this.data.username==''){
      Toast('请输入姓名');
      return;
    }
    if(this.data.IDCard==''){
      Toast('请输入身份证号');
      return;
    }
    this.setData({
      active:1,
      iscerame:true,
      isID:false
    });
   console.log(this.data.username);
   console.log(this.data.IDCard);
   this.cut();
 },
 cut:function(){
  var ctx=wx.createCameraContext();
   var that=this;
   
   setTimeout(function(e){
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        Toast.loading({
          mask: false,
          duration:0,
          message: '认证中...'
        });
        wx.uploadFile({
          url:api.Check, //api.Check,
          filePath: res.tempImagePath,
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data",//记得设置
            'Authorization': 'Bearer '+wx.getStorageSync('qh_access_token') //设置验证
          },
          formData: {
            'Number': e.IDCard,
            'name':e.username,
            'openid':app.globalData.openid,
            'user_id':app.globalData.user_id
          },
          success: function(res) {
            console.log(res)
            console.log(res.data,'res.data')
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
              setTimeout(function(e){
                wx.redirectTo({
                  url: '../certification/certification?username='+that.data.username+'&IDCard='+that.data.IDCard
                   });
              },4000)
             }
            
          },
          fail: function(res) {
            console.log(res);
          },
        })
        
      }
    })
   },3000,that.data)
 },
 nameInput:function(e) {
    this.setData({
      username:e.detail
    })
 },
 NumberInput:function(e){
   this.setData({
     IDCard:e.detail
   })
 },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let that= this;
    if( util.checkOpenId()){
      let that=this;
      that.setData({
        isHidden:true,
       
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