//index.js
//获取应用实例
const app = getApp()
var api = require('../../config/api.js');
var util = require('../../utils/util.js');
import Toast from '../../vant-weapp/dist/toast/toast';
var WxParse = require('../../wxParse/wxParse.js');
Page({
  
  data: {
    motto: '欢迎来到企汇财税秘书',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    indicationDots:false,
    autoplay:true,
    interval:5000,
    duration:1000,
    circular:true,
    openid:'',
    session_key: '',
    parent_user_id:'',
    show: true,
    userInfo: null,
		isHidden: true, //是否隐藏登录弹窗
    token:null,
    showscore: false,
    //签到模块
    signNum: 0,  //签到数
    signState: false, //签到状态
    min: 1,  //默认值日期第一天1
    max: 7 , //默认值日期最后一天7
    signData:[],
    uid:[],
    second:1,
    commonInfo:[],
    homepage_style:'F',
    spreadImg1:[],
    spreadImg2:[],
    spreadImg3:[],
    spreadImg:[],
    imageIndex:0,
    imgUrls: [
    ],
    showactive:false,
    showofficial:false,
    show_none:false,
    modal:0,
    spreadPosterImg:'',
    spreadArticleImg:'',
    spreadBackgroundImg:'',
    spreadFocusImg:'',
    spreadVedioImg:'',
    summaryVedio:'',
    imgofficialGoUrl:api.ImgUrl+'/FileDown/GetSharedImage?image_code=D044',
    img47:api.ImgUrl+'/FileDown/GetSharedImage?image_code=D047',
    img46:api.ImgUrl+'/FileDown/GetSharedImage?image_code=D046',
    img48:api.ImgUrl+'/FileDown/GetSharedImage?image_code=D048',
    img59:api.ImgUrl+'/FileDown/GetSharedImage?image_code=D059',//签到七天图
    carouselMgs:[],
    action_acc_days:0,
    showaccdaysPop:false
  },
  //父组件接收子组件传值
  compontpass:function(e){
    var modal=e.detail.val;
    console.log(e,'子传值')
    if(modal== '9'){
      this.setData({
        show_none:true
        })
    }
    var isHidden=e.detail.isHidden;
    console.log(isHidden,'子传值modalAuth')
    if(isHidden==false){
      this.setData({
        isHidden:false
      })
    }
    wx.setStorageSync('modal', modal)
  },
  compontpasscount:function(e){
    var count=e.detail.val;
    if(count>0){
      wx.navigateTo({
        url: '/pages/me/myOrder/myOrder?status=R'
      })
    }else{
      wx.navigateTo({
        url: '/pages/me/myExtend/myExtend?coinpurse='+ spread_false_amt 
      })
    }


  },
  showPopup() {
    this.setData({ showscore: true });
  },
  showPopup() {
    this.setData({ showscore: true });
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
          console.log(res.data.commonInfo,'commonInfo');
          that.setData({
            commonInfo:res.data.commonInfo[0]
          });
          app.globalData.commonInfo=res.data.commonInfo[0]
          let function_ctrl=res.data.commonInfo[0].function_ctrl
          //let function_ctrl="1:Y"
          if(function_ctrl!=null){
            if(function_ctrl.indexOf("1:Y")>=0){
              app.globalData.function_ctrl='Y'
            }
          }else{
            app.globalData.function_ctrl='N'
          }
         
          // var action_acc_days = wx.getStorageSync("action_acc_days");
          // console.log(action_acc_days,'app.globalData.action_acc_days111')
          // if(action_acc_days==2){
          //   that.setData({
          //     showaccdaysPop:true
          //   })
          // }
          if(that.data.commonInfo.is_follow_official_account=='N'){
            that.setData({ showofficial: true,imgUrlsofficial:api.ImgUrl+'/FileDown/GetSharedImage?image_code=D043'});
          }
        }else{
          console.log(res.data.msg)
          that.setData({
            commonInfo:[]
          });
        }
    })
  },
  //关闭
  onOfficialClose() {
    console.log(123)
    this.setData({ showofficial: false });
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
          console.log(res,'res签到')
          if(res.data.success==true){
            if(res.data.signState==true){
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
            console.log(res,'查询签到')
            if(res.data.signState==true){
            that.setData({
              signState:res.data.signState,
              signData:res.data.signData[0],
              max:res.data.signData[0].full_action_times,
              action_acc_days:res.data.signData[0].action_acc_days
            });
            wx.setStorageSync('action_acc_days', res.data.signData[0].action_acc_days);
            app.globalData.action_acc_days=
            console.log(app.globalData.action_acc_days,'app.globalData.action_acc_days')
            
            
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
          that.QueryCommonInfo()
          
        }else{
          console.log(res.data.msg)
          that.setData({
          signData:[]
          });
        }
    })
  },
  //获取推广网站首页图
  QueryMMSpreadImg:function(e) {
    let that= this;
    if(e==1){
      util.request(api.QueryMMSpreadImgUrl,//获取基本设置接口
        { openid:'123',img_type:e}
        ,'POST').then(function(res){
          if(res.data.success==true){
            that.setData({
              spreadImg1:res.data.spreadImg,
            });
          }else{
            console.log(res.data.msg)
            that.setData({
              spreadImg1:[]
            });
          }
      })

    }else if(e==2){
      util.request(api.QueryMMSpreadImgUrl,//获取基本设置接口
        { openid:'123',img_type:e}
        ,'POST').then(function(res){
          if(res.data.success==true){
            that.setData({
              spreadImg2:res.data.spreadImg,
            });
          }else{
            that.setData({
              spreadImg2:[]
            });
          }
      })

    }else if(e==3){
      util.request(api.QueryMMSpreadImgUrl,//获取基本设置接口
        { openid:'123',img_type:e}
        ,'POST').then(function(res){
          if(res.data.success==true){
            that.setData({
              spreadImg3:res.data.spreadImg,
            });
          }else{
            console.log(res.data.msg)
            that.setData({
              spreadImg3:[]
            });
          }
      })

    }else  if(e==4){
      util.request(api.QueryMMSpreadImgUrl,//获取基本设置接口
        { openid:'123',img_type:e}
        ,'POST').then(function(res){
          if(res.data.success==true){
            that.setData({
              spreadImg:res.data.spreadImg,
            });
          }else{
            console.log(res.data.msg)
            that.setData({
              spreadImg:[]
            });
          }
      })
    }
    
    
    
       
  },
  QuerySpreadIndex:function(e) {
    let that= this;
    util.request(api.QuerySpreadIndexUrl,//获取推广海报首页
      { openid:'123'}
      ,'POST').then(function(res){
        if(res.data.success==true){
          console.log(res,'获取推广海报首页')
         
          that.setData({
            spreadPosterImg:res.data.spreadPosterImg,
            spreadArticleImg:res.data.spreadArticleImg,
            spreadBackgroundImg:res.data.spreadBackgroundImg,
            spreadFocusImg:res.data.spreadFocusImg,
            spreadVedioImg:res.data.spreadVedioImg
          });
            /**
            * WxParse.wxParse(bindName , type, data, target,imagePadding)
            * 1.bindName绑定的数据名(必填)
            * 2.type可以为html或者md(必填)
            * 3.data为传入的具体数据(必填)
            * 4.target为Page对象,一般为this(必填)
            * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
            */
           if(res.data.spreadVedioImg!=''){
            var summaryVedio =res.data.spreadVedioImg[0].summary;
            WxParse.wxParse('summaryVedio', 'html', summaryVedio, that, 5);
           }
          
        
        }else{
          console.log(res.data.msg)
          that.setData({
            spreadPosterImg:'',
            spreadArticleImg:'',
            spreadBackgroundImg:'',
            spreadFocusImg:'',
            spreadVedioImg:''
          });
        }
    })
  },
  //获取基本设置
  QueryBasicSetupe:function() {
    let that= this;
    util.request(api.QueryBasicSetupe,//获取推广网站首页图接口地址
      { openid:app.globalData.openid,user_id:app.globalData.user_id}
      ,'POST').then(function(res){
        if(res.data.success==true){
          that.setData({
            homepage_style:res.data.myBasicSetupList[0].homepage_style,
          });
          if(res.data.myBasicSetupList[0].homepage_style=='D'){
             //获取推广海报首页
             that.QuerySpreadIndex();
          }
        }else{
          that.setData({
            homepage_style:'F'
          });
        }
    })
  },
  onLoad: function (options) {
    
    //分享二维码绑定
    var user_id = options.user_id;
    var parent_user_id = wx.getStorageSync("parent_user_id");
    //分享类别
    var spread_category = options.spread_category;
    var spread_source = options.spread_source;
    var spread_id = options.spread_id; 
    if (parent_user_id == "undefined" || parent_user_id == undefined || parent_user_id == 0)
    {
      console.log("options=>" + JSON.stringify(options));
      var scene = decodeURIComponent(options.scene);
      if (user_id != undefined) {
        parent_user_id = user_id;

        spread_category = spread_category;
        spread_source = spread_source;
        spread_id = spread_id;
      } else if (options.scene != undefined) {
        console.log("scene string=>" + scene);
        var scene_obj = util.scene_decode(scene);
        console.log("scene obj=>" + JSON.stringify(scene_obj));
        if (scene_obj.uid && scene_obj.gid) {
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
      console.log(parent_user_id, '_parent_user_id');
      console.log(spread_category, '_spread_category');
      console.log(spread_source, '_spread_source');
      console.log(spread_id, '_spread_id');
      //绑定推荐关系
      //**登录授权时绑定推荐人**//
      //util.bindParent();
    }

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else { 
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    //新手引导
    this.setData({
      modal: wx.getStorageSync('modal'),
    })
    console.log(modal,'onshowmodal')
    var modal=wx.getStorageSync('modal')
    if(modal=='9'){
      this.setData({
        modal:modal,
        show_none:true
      })
    }
    //获取推广海报首页
    //this.QueryMMSpreadImg(4);
    this.QuerySpreadIndex()
    this.QueryCarouselMgs();
  },
  
  onReady:function(){
     
  },
  onShow() {
    if(util.checkOpenId()){
      this.QuerySignState();
      this.getUserInfoDetail();
      this.QueryCommonInfo()
      this.QueryBasicSetupe();
      this.QueryCheckActivity(); //我的活动推广状态
      
    }
    //app.loginBindParent({ parent_id: parent_id });
   
   
  },
  //事件处理函数
  //分享按钮轮播

  shareBtnSwiper:function(){
    let that=this
    let spread_false_amt=that.data.commonInfo.spread_false_amt
    if( util.checkOpenId()){
      wx.navigateTo({
        url: '../extend/shareSwiper/shareSwiper?coinpurse='+ spread_false_amt 
      })
    }else{
      this.setData({
        isHidden:false
      })
    }
  },
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  bindgoHonor: function() {
    wx.navigateTo({
      url: '/pages/me/myAward/myAward?item=H&honor='+this.data.commonInfo.honor_name
    })
  },
  bindTapBillList: function(){
    if( util.checkOpenId()){
      wx.navigateTo({
        url: '../extend/billList/billList'
      })
    }else{
      this.setData({
        isHidden:false
      })
    }
   
  },
  bindTapVideoList: function(){

    if( util.checkOpenId()){
      wx.navigateTo({
        url: '../extend/videoList/videoList'
      })
    }else{
      this.setData({
        isHidden:false
      })
    }
    
  },
  bindTapArticleList:function(){

    if( util.checkOpenId()){
      wx.navigateTo({
        url: '../extend/articleList/articleList'
      })
    }else{
      this.setData({
        isHidden:false
      })
    }
    
  },
  shareBtn:function(){
    if(util.checkOpenId()){
      wx.navigateTo({
        url: '../me/sharePersonal/sharePersonal'
      })
    }else{
      this.setData({
        isHidden:false
      })
    }
  },
   //跳转bindTapLottery
   bindTapLottery:function(){
    wx.navigateTo({
      url: '/pages/lottery/myLottery/myLottery'
    })
  },

  //跳转图片详情
  bindTapBillDetail:function(event){
    let imgBgUrl = event.currentTarget.dataset.item_img
    let spread_poster_id =event.currentTarget.dataset.spread_poster_id
    let poster_category =event.currentTarget.dataset.poster_category
    console.log(event,'event')
    wx.navigateTo({
      url: '/pages/extend/billDetail/billDetail?imgBgUrl='+ encodeURIComponent(imgBgUrl) + '&spread_poster_id=' + encodeURIComponent(spread_poster_id)+ '&poster_category=' + encodeURIComponent(poster_category)
    })
  },
  //跳财税小秘书
  goMinipro:function(){
    wx.navigateToMiniProgram({
      appId: 'wxbc5a0dcb45d92aa8',
      path: 'pages/index/index',
      extraData: {
        foo: 'bar'
      },
      envVersion: 'release',
      success(res) {
        // 打开成功
      }
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
			isHidden:true,
      token:e.detail
    })
    app.globalData.token=e.detail;
    app.globalData.openid=wx.getStorageSync('openid');
    app.globalData.user_id=wx.getStorageSync('user_id');
    this.onShow();
    this.getUserInfoDetail();

	},
	getUserInfoDetail: function(e) {
		this.setData({
		  userInfo: app.globalData.userInfo,
		  hasUserInfo: true
		})
  },
  getPromotionCoupon(e){
    let focus_category=e.currentTarget.dataset.focus_category;
    let jump_url=e.currentTarget.dataset.jump_url
    wx.navigateTo({
      url: jump_url
    })
   
  },
  goTo(event) {
    wx.reLaunch({
      url: '../progress/receive/index'
    });
    
  },
  //首页消息轮播图
  QueryCarouselMgs: function(e) {
    let that= this;
    console.log(111111)
    util.request(api.QueryCarouselMgsUrl,//首页消息轮播图
      { openid:0,user_id:app.globalData.user_id}
      ,'POST').then(function(res){
        console.log(res,'xiaoxi')
        if(res.data.success==true){
          that.setData({
            carouselMgs:res.data.carouselMgs,
          
          });
          
        }else{
          that.setData({
            carouselMgs:[]
          });
        }
    })
  },
  
  
})
