// pages/me/myCard/myCard.js
const app = getApp()
var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
import Toast from '../../../vant-weapp/dist/toast/toast';
import { base64src } from '../../../utils/base64src.js';
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
    myNamecardList:[],
    result: ['a', 'b','c','d','e','f','g','h','i'],
    show:false,
    pixelRatio: 2,
    mobile_phone:'',
    address:'',
    title:'',
    wechat:'',
    email:'',
    commonInfo:[],
  },
   //查询我的成就
  QueryCommonInfo: function(e) {
    let that= this;
    util.request(api.QueryCommonInfoUrl,//查询签到
      { openid:app.globalData.openid,user_id:app.globalData.user_id}
      ,'POST').then(function(res){
        if(res.data.success==true){
          console.log(res.data.commonInfo,'commonInfo');
          that.setData({
            commonInfo:res.data.commonInfo[0]
          });
          
        }else{
          console.log(res.data.msg)
          commonInfo:[]
          
        }
    })
  },
  onChange(event) {
    this.setData({
      result: event.detail
    });
  },
  
  QueryMyNamecard:function(){
    let that= this;
    util.request(api.QueryMyNamecardUrl,//查询我的名片
      { openid:app.globalData.openid,user_id:app.globalData.user_id}
      ,'POST').then(function(res){
        if(res.data.success==true){
            that.setData({
              myNamecardList:res.data.myNamecardList[0],
             
            });
            that.QueryCommonInfo()
        }else{
          console.log(res.data.msg)
          that.setData({
            myNamecardList:[],
            
          });
        
        }
    })
  },
  bindSave: function(e) {
    console.log(e,'save')
		const that = this;
    let dispaly_name = e.detail.value.dispaly_name;
   let mobile_phone=that.data.myNamecardList.mobile_phone;
    let telephone='';
    //let telephone = e.detail.value.telephone;
    let title = e.detail.value.title;
    let spread_title = e.detail.value.spread_title;
		let email = e.detail.value.email;
		let wechat = e.detail.value.wechat;
		let address = e.detail.value.address;

		if (dispaly_name == "") {
			wx.showModal({
				title: '提示',
				content: '请填写您的名字',
				showCancel: false
			})
			return
		}
		if (mobile_phone == "") {
			wx.showModal({
				title: '提示',
				content: '请填写您的手机号码',
				showCancel: false
			})
			return
		}
		if (title=="") {
			wx.showModal({
				title: '提示',
				content: '请填写您的职位',
				showCancel: false
			})
			return
    }
    if (spread_title == "") {
			wx.showModal({
				title: '提示',
				content: '请填写您的公司',
				showCancel: false
			})
			return
    }
    if (wechat == "") {
			wx.showModal({
				title: '提示',
				content: '请填写您的微信号',
				showCancel: false
			})
			return
		}

		if (address == "") {
			wx.showModal({
				title: '提示',
				content: '请填写您的地址',
				showCancel: false
			})
			return
		}
		if (email == "") {
			wx.showModal({
				title: '提示',
				content: '请填写您的邮箱',
				showCancel: false
			})
			return
    }
    let postData = {
			openid: app.globalData.openid,
      user_id:app.globalData.user_id,
      dispaly_name:dispaly_name,
       mobile_phone:mobile_phone,
      title:title,
       spread_title:spread_title,
      email:email,
      wechat:wechat,
      address:address,
      telephone:telephone
    };
    util.request(api.PostNamecardUrl,//更新名片设置
      postData
      ,'POST').then(function(res){
        if(res.data.success==true){
          that.QueryMyNamecard()
          Toast.success(res.data.msg);
        }else{
          Toast.fail(res.data.msg);
        
        }
    })
		
  },
  //获取小程序二维码
  getprogramCode: function() {
    let that = this;
    let postData = {
      openid:app.globalData.openid,
      user_id:app.globalData.user_id,
      page: 'pages/index/index', //默认跳转到主页:pages/index/index，可指定
      width: 280,
      scene:"uid="+ app.globalData.user_id +",gid=0,cid=6,sid=2",
      is_hyaline:"1"
    };
    console.log(postData,'postData');
    util.request(api.CreateWxCodeUrl,//查询我的名片
      postData
      ,'POST').then(function(res){
        console.log(res,'res------');
        if(res.data.success==true){
            that.setData({
              programCode:res.data.fileUrl
            });
        }else{
          console.log(res.data.msg)
        }
    })
  
  },
  goMyCardSetting:function(){
    wx.navigateTo({
      url: '../myCardSetting/myCardSetting'
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
    let that= this;
    if (app.globalData.iphone == true) {
      console.log(app.globalData.iphone ,'iphone')
      that.setData({
        iphone: 'iphone'
      })
    }
    if( util.checkOpenId()){
      that.QueryMyNamecard()
      that.getprogramCode();
      
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
    this.getUserInfoDetail();
    this.QueryPreProductList()
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
      this.getUserInfoDetail()
      this.QueryNameCardInfo()
		}
  },
  getUserInfoDetail: function(e) {
    console.log(app.globalData.userInfo,'userInfo')
		this.setData({
		  userInfo: app.globalData.userInfo,
		  hasUserInfo: true
		})
  },
  /*分享名片*/
  onTapShareShow() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
   
  onTapShareMe(){
    
    let that = this;
    let nameCardInfo =encodeURIComponent(JSON.stringify(that.data.nameCardInfo));
    console.log(nameCardInfo,'nameCardInfo');
   
    wx.navigateTo({
      url: '../../extend/shareCard/shareCard?nameCardInfo='+nameCardInfo
    })
    this.setData({ show: false });
  },
  /*去绑定手机号*/
  toPhone:function(){
    wx.navigateTo({
      url: '../phoneCertification/phoneCertification'
      });
  },
   /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    this.AddAchivementAction()
    let user_id=app.globalData.user_id;
    this.setData({show: false})
    return {
      title: '名片分享',
      path: '/pages/index/index?user_id=' + user_id + '&spread_category=4&spread_source=1&spread_id=0'//分享的页面所需要的id
    
    }
  },
  //分享
  AddAchivementAction:function(e) {
    console.log(e);
   let that = this;
   util.request(api.AddAchivementActionUrl,
     { openid:app.globalData.openid,achivement_category:'名片',user_id:app.globalData.user_id,spread_id:"0",spread_ass_id:"0"}
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