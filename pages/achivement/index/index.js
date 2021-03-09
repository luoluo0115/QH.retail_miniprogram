// pages/achivement/index/index.js
const app = getApp()
var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
import Toast from '../../../vant-weapp/dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    show: true,
    userInfo: null,
		isHidden: true, //是否隐藏登录弹窗
    token:null,
    active: 1,
    rankingList:[],
    achievementTablet:[],
    weeklyTasksList:[],
    achivement_money:"",
    achivement_score:"",
    acc_commission_amt:"",
    imgUrls: [
     ],
     showactive:false,
     checkTitle:'每周任务'

  },
  //关闭弹窗,跳转
  onActivityGo() {
    this.setData({ showactive: false });
    this.onActivityClose();
    wx.reLaunch({
        url: '../activity/index/index',
        fail: function () {
          wx.redirectTo({
            url: '../activity/index/index',
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
          
        }else{
          commonInfo:[]
          
        }
    })
  },
  onChange(event) {
    let that=this;
    that.setData({
      checkTitle:event.detail.title
    })
    console.log(that.data.checkTitle);
    if(that.data.checkTitle=='每周任务'){
      this.QueryWeeklyTasks();
    }else if(that.data.checkTitle=='成就碑'){
      this.QueryAchievementTablet();
    }else{
      this.QueryRankingList();
    }
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
  //获取成就排行
  QueryRankingList:function(){
    let that=this;
    util.request(api.QueryRankingList,{openid:app.globalData.openid,user_id:app.globalData.user_id},'POST').then(function(res){
      that.setData({
        rankingList:res.data.rankingList,
        achievementTablet:'',
        weeklyTasksList:''
      })
      console.log(res.data.rankingList,'res.data.rankingList')
    })
  },
  //获取成就碑
  QueryAchievementTablet:function(){
    let that=this;
    util.request(api.QueryAchievementTablet,{openid:app.globalData.openid,user_id:app.globalData.user_id},'POST').then(function(res){
      that.setData({
        achievementTablet:res.data.achievementTablet,
        rankingList:'',
        weeklyTasksList:''
      })
    })
  },
  //获取每周任务
  QueryWeeklyTasks:function(){
    let that=this;
    util.request(api.QueryWeeklyTasks,{openid:app.globalData.openid,user_id:app.globalData.user_id},'POST').then(function(res){
      that.setData({
        weeklyTasksList:res.data.weeklyTasksList,
        rankingList:'',
        achievementTablet:''
      })
    
    })
  },
  

//我的成就
QueryMyAchivement:function(){
  let that=this;
  util.request(api.QueryMyAchivement,{openid:app.globalData.openid,user_id:app.globalData.user_id},'POST').then(function(res){
    if(res.data.success==true){
      that.setData({
        achivement_score:res.data.myAchievement[0].achivement_score,
        achivement_money:res.data.myAchievement[0].achivement_money,
        acc_commission_amt:res.data.myAchievement[0].acc_commission_amt
      })
    }else{
      that.setData({
        achivement_score:0,
        achivement_money:0,
        acc_commission_amt:0
      })
    }
  
  
  })
},

  //领取成就

  PostAchievementReceive:function(event){
    let that=this;
     var data={openid:app.globalData.openid,user_id:app.globalData.user_id,achivement_user_id:event.currentTarget.dataset.id1,achivement_def_id:event.currentTarget.dataset.id2};
     util.request(api.PostAchievementReceive,data,'POST').then(function(res){
       if(res.data.success==true){
         if(that.data.checkTitle=='每周任务'){
            that.QueryWeeklyTasks();
         }else if(that.data.checkTitle=='成就碑'){
            that.QueryAchievementTablet();
         }
        //  that.QueryRankingList();
        //   that.QueryAchievementTablet();
        //   that.QueryWeeklyTasks();
          that.QueryMyAchivement();
          Toast.success(res.data.msg);  
       }else{
         Toast.fail(res.data.msg);
       }
     })
   },
 
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that= this;
    
    if( util.checkOpenId()){
      that.setData({
        isHidden:true
      })
      that.getUserInfoDetail();
      that.QueryCommonInfo();
      if(that.data.checkTitle=='每周任务'){
        that.QueryWeeklyTasks();//获取每周任务
      }else if(that.data.checkTitle=='成就碑'){
        that.QueryAchievementTablet();//获取成就碑
      }else{
        that.QueryRankingList();//获取成就排行
      }
      that.QueryMyAchivement();//我的成就
      that.QueryCheckActivity(); //我的活动推广状态
        
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
		this.setData({
			isHidden:true,
			token:e.detail
		})
    this.getUserInfoDetail();
    if(that.data.checkTitle=='每周任务'){
      that.QueryWeeklyTasks();//获取每周任务
    }else if(that.data.checkTitle=='成就碑'){
      that.QueryAchievementTablet();//获取成就碑
    }else{
      that.QueryRankingList();//获取成就排行
    }
    this.QueryMyAchivement();//我的成就
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
    let that =this;
    if(that.data.checkTitle=='每周任务'){
      that.QueryWeeklyTasks();//获取每周任务
    }else if(that.data.checkTitle=='成就碑'){
      that.QueryAchievementTablet();//获取成就碑
    }else{
      that.QueryRankingList();//获取成就排行
    }
    that.QueryMyAchivement();//我的成就
    that.QueryCheckActivity(); //我的活动推广状态
  },
  //荣誉跳转
  bindgoHonor: function() {
    wx.navigateTo({
      url: '/pages/me/myAward/myAward?item=H&honor='+this.data.commonInfo.honor_name
    })
  },
  //myWallet跳转
  gomyWallet:function() {
    wx.navigateTo({
      url: '/pages/me/myWallet/myWallet'
    })
  },
   //myOrder跳转
   gomyOrder:function() {
    wx.navigateTo({
      url: '/pages/me/myOrder/myOrder?status=R'
    })
  },
  //myWallet跳转
  gomyExtend:function(event) {
     console.log(event)
     let active=event.currentTarget.dataset.active
      wx.navigateTo({
        url: '/pages/me/myExtend/myExtend?active='+active
      })
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