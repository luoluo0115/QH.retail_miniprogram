// pages/extend/billDetail/billDetail.js
const app = getApp()
var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    varData: [{
      name: 'scene',
      type: 'String',
      required: true,
      default: '无',
      desc: '路径参数',
      avatarUrl: '',
      show: false,
      showbill:false,
      isHidden: true, //是否隐藏登录弹窗
    }],
    spread_id:'',
    imgBgUrl:'',
    poster_category:'',
    mySpreadPhraseList:[],
    setTime:''
  },
  showPopup() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },
  onTapShare() {
    this.setData({ show: true });
  },

  onTapArticle(event){
    this.setData({show: false, showbill: true,achivement_category:this.data.poster_category, user_id:app.globalData.user_id,spread_id:this.data.spread_id,spread_ass_id:"0"});
  },
  onTapBill(){
    this.setData({show: false, showbill: true });
  },
  onCloseBill() {
    this.setData({ showbill: false });
  },
  //父组件接收子组件传值
  compontpass:function(e){
    this.setData({ showbill: e.detail.showbill });
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,'options')
    var that = this;
    
    app.globalData.imgBgUrl= decodeURIComponent(options.imgBgUrl);
    app.globalData.spread_id=decodeURIComponent(options.spread_id);
    app.globalData.poster_category=decodeURIComponent(options.poster_category);
    console.log(decodeURIComponent(options.spread_id),'spread_id')
    console.log(decodeURIComponent(options.user_id), 'user_id')

    that.setData({
      userInfo: app.globalData.userInfo,
      avatarUrl:app.globalData.userInfo.avatarUrl,
      spread_id:decodeURIComponent(options.spread_id),
      imgBgUrl: decodeURIComponent(options.imgBgUrl),
      poster_category:decodeURIComponent(options.poster_category),
      setTime:options.setTime,
    })
    
    //分享父user_id
    var parent_user_id = 0;
    //分享类别
    var spread_category = '';
    var spread_source = '';
    var spread_id = 0;
    var user_id = options.user_id;
    var category = options.spread_category;
    var source = options.spread_source;
    var id = options.spread_id;
    console.log("options=>" + JSON.stringify(options));
    var scene = decodeURIComponent(options.scene);
    if (user_id != undefined && category != undefined && source != undefined) {
    
      parent_user_id = user_id;
      spread_category = category;
      spread_source = source;
      spread_id = id;
    } else if (options.scene != undefined) {
      console.log("scene string=>" + scene);
      var scene_obj = util.scene_decode(scene);
      console.log("scene obj=>" + JSON.stringify(scene_obj));
      if (scene_obj.uid && scene_obj.gid && scene_obj.cid && scene_obj.sid) {
        parent_user_id = scene_obj.uid;
        spread_category = scene_obj.cid;
        spread_source = scene_obj.sid;
        spread_id = scene_obj.gid;
      } else {
        parent_user_id = scene;
      }
    }
    wx.setStorageSync('parent_user_id', parent_user_id);
    wx.setStorageSync('spread_category', spread_category);
    wx.setStorageSync('spread_source', spread_source);
    wx.setStorageSync('spread_id', spread_id);
    console.log(parent_user_id, 'parent_user_id')
    console.log(spread_category, 'spread_category')
    console.log(spread_source, 'spread_source')
    console.log(spread_id, 'spread_id')
    if(that.data.setTime=='A'){
      setTimeout(function() {
        console.log('doSomething')
        wx.reLaunch({
          url: '/pages/index/index',
        })
      }, 3000);
    }
     
  },
  
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  // onReady: function () {
  //   //  页面初次渲染完成后，使用选择器选择组件实例节点，返回匹配到组件实例对象  
  //   this.myComponent = this.selectComponent('#myBill')
  // },
  // showComponent: function () {
  //   console.log(12344);
  //     let myComponent = this.myComponent
  //     myComponent.getFile()  // 调用自定义组件中的方法
  // },

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
        isHidden:false,
        show: false,
        showbill: false 
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
		this.setData({
			isHidden:true,
    })
    this.getUserInfoDetail();
    this.setData({
      userInfo: app.globalData.userInfo,
      avatarUrl:app.globalData.userInfo.avatarUrl,
      spread_id:app.globalData.spread_id,
      imgBgUrl: app.globalData.imgBgUrl,
      poster_category:app.globalData.poster_category,
    })
    app.globalData.openid=wx.getStorageSync('openid');
    app.globalData.user_id=wx.getStorageSync('user_id');
    this.onShow();

	},
	getUserInfoDetail: function(e) {
		this.setData({
		  userInfo: app.globalData.userInfo,
		  hasUserInfo: true
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    this.AddAchivementAction();
    let spread_id=this.data.spread_id;
    let user_id=app.globalData.user_id;
    let imgBgUrl=encodeURIComponent(this.data.imgBgUrl);
    let poster_category=encodeURIComponent(this.data.poster_category)
    return {
      title: '海报分享',
      path: '/pages/extend/billDetail/billDetail?spread_id=' + spread_id + '&user_id=' + user_id + '&imgBgUrl=' + imgBgUrl + '&poster_category=' + poster_category +'&setTime=A'+ '&spread_category=1&spread_source=1'
    }
  },
   //分享记录
   AddAchivementAction:function(e) {
    console.log(e);
    let that = this;
     console.log(that.data.spread_id,'that.data.spread_id')
    util.request(api.AddAchivementActionUrl,
      { openid:app.globalData.openid,achivement_category:'海报',user_id:app.globalData.user_id,spread_id:that.data.spread_id,spread_ass_id:"0"}
      ,'POST').then(function(res){
        console.log(res,'fenxiang ')
        //var customerList=JSON.stringify(res.data.customerList);
        if(res.data.success==true){
          console.log(res.data.msg)
        }else{
          console.log(res.data.msg)
          
        }
    })
    
  },
})