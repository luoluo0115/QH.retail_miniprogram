// pages/extend/article/article.js
const app = getApp()
var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
var WxParse = require('../../../wxParse/wxParse.js');
import Toast from '../../../vant-weapp/dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    showbill:false,
    name: 'scene',
    type: 'String',
    required: true,
    default: '无',
    desc: '路径参数',
    articleCategoryByID:'',
    spread_article_id:'',
    article_title:'',
    summary:'',
    isHidden: true, //是否隐藏登录弹窗
    article_source:'',
    shared_user_id:'',
    imgofficialGoUrl:api.ImgUrl+'/FileDown/GetSharedImage?image_code=D044',
    like_times:0,
    praiseFlag:0
  },
  
  onTapHome(){
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  onTapShare() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },
   
  onTapBill(){
    this.setData({show: false, showbill: true });
  },
  onTapArticle(event){
    this.setData({show: false, showbill: true , article_title:app.globalData.article_title,summary:this.data.article});
  },
   //父组件接收子组件传值
  compontpass:function(e){
    this.setData({ showbill: e.detail.showbill });
  },
  
  onCloseBill() {
    this.setData({ showbill: false });
  },
   //根据文章类别获取文章详情
   QueryArticleCategoryByID:function(e) {
    let spread_article_id=e;
    let that = this;
   util.request(api.QueryArticleCategoryByIDUrl,
     { openid:app.globalData.openid,spread_article_id:spread_article_id,user_id: app.globalData.user_id}
     ,'POST').then(function(res){
      console.log(res,'详情');
       if(res.data.success==true){
        var article = res.data.articleCategoryByID[0].content;

        var summary =res.data.articleCategoryByID[0].summary;
        app.globalData.article_title=res.data.articleCategoryByID[0].article_title;
        app.globalData.summary=res.data.articleCategoryByID[0].summary;
        console.log(summary,'summary详情')
        that.setData({
          article:res.data.articleCategoryByID[0].content,
          article_source:res.data.articleCategoryByID[0].article_source,
         

        })
        console.log(res.data,'res.data.articleCategoryByID[0]')
        /**
        * WxParse.wxParse(bindName , type, data, target,imagePadding)
        * 1.bindName绑定的数据名(必填)
        * 2.type可以为html或者md(必填)
        * 3.data为传入的具体数据(必填)
        * 4.target为Page对象,一般为this(必填)
        * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
        */
        
        WxParse.wxParse('article', 'html', article, that, 5);
        //WxParse.wxParse('summary', 'html', summary, that, 5);
         that.setData({
          articleCategoryByID:res.data.articleCategoryByID[0],
          like_times:res.data.articleCategoryByID[0].like_times,
          praiseFlag:res.data.articleCategoryByID[0].praiseFlag
         });
       }else{
         console.log(res.data.msg)
         that.setData({
          articleCategoryByID:[],
          like_times:0,
          praiseFlag:0
         });
       }
   })
   
  },
  //增加推广动作点赞
  AddSpreadAction(){
    let that = this;
    util.request(api.AddSpreadActionUrl,
      { openid:app.globalData.openid,user_id:app.globalData.user_id,action_type:"L",action_category:"文章",action_source:"程序",action_id:that.data.spread_article_id,shared_user_id:that.data.shared_user_id}
      ,'POST').then(function(res){
        console.log(res,'点赞')
        //var customerList=JSON.stringify(res.data.customerList);
        if(res.data.success==true){
          that.setData({
            like_times:that.data.like_times+1,
            praiseFlag:1
          })
        
        }else{
          Toast(res.data.msg);
        }
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.user_id=wx.getStorageSync('user_id');
    wx.showShareMenu({
        withShareTicket: true
    })
    // console.log(options,'分享')
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
      if(parent_user_id!=''||parent_user_id!=undefined){
        this.setData({
          shared_user_id:parent_user_id
        })
      }
      if(options.scene != undefined){
        this.setData({
          spread_article_id: spread_id,
        })
      }else{
        this.setData({
          spread_article_id: options.spread_id,
          user_id:app.globalData.user_id
        })
      }
      this.QueryArticleCategoryByID(this.data.spread_article_id);
      app.globalData.spread_article_id=options.spread_id
      if (app.globalData.iphone == true) {
        this.setData({
          iphone: 'iphone'
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
          console.log(res.data.commonInfo,'commonInfo');
          that.setData({
            commonInfo:res.data.commonInfo[0]
          });
        }else{
          console.log(res.data.msg)
          that.setData({
            commonInfo:[]
          });
        }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  // onReady: function () {
  //   //  页面初次渲染完成后，使用选择器选择组件实例节点，返回匹配到组件实例对象  
  //   this.myComponent = this.selectComponent('#myArticle')
  // },
  // showComponent: function () {
  //     console.log('刷新二维码')
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
      this.QueryCommonInfo()
     
    }else{
      this.setData({
        isHidden:false,
        show: false,
        showbill: false 
      })
    }

  },
  onPageScroll:function(res){
    if(util.checkOpenId()){     
    }else{
      this.setData({
        isHidden:false,
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let pages = getCurrentPages(); //页面栈
    let beforePage = pages[pages.length - 2];
    if (beforePage.route == 'pages/extend/articleAdd/articleAdd') {
      let options={active:1};
      beforePage.onLoad(options) //这个函数式调用接口的函数
     
    }
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
  onShareAppMessage: function () {
    this.AddAchivementAction();
    let spread_article_id=app.globalData.spread_article_id;
    let user_id=app.globalData.user_id;
    this.setData({show: false})
    return {
      title: this.data.articleCategoryByID.article_title,
      path: '/pages/extend/articleDetail/articleDetail?spread_id=' + spread_article_id + '&user_id=' + user_id + '&spread_category=3&spread_source=1'//分享的页面所需要的id
    
    }
  },
  //分享
  AddAchivementAction:function(e) {
    console.log(e);
   let that = this;
   util.request(api.AddAchivementActionUrl,
     { openid:app.globalData.openid,achivement_category:'文章',user_id:app.globalData.user_id,spread_id:that.data.spread_article_id,spread_ass_id:"0"}
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