const app = getApp()
var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
var WxParse = require('../../../wxParse/wxParse.js');

function getRandomColor () {
  let rgb = []
  for (let i = 0 ; i < 3; ++i){
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}

Page({
  data:({
    VideoUrl: '',
    ImageUrl:'',
    Title:'',
    VideoId:'',
    isHidden: true, //是否隐藏登录弹窗
    Summary:'',
    vedio_title:[],
    full_vedioV2:[],
    vedio_abbr_image:[],
    article_source:[],
    spread_vedio_id:''
    
  }),
 //根据视频ID获取视频详情
 QueryVedioCategoryByID:function() {
  let that = this;
  let spread_vedio_id=that.data.spread_vedio_id;
console.log(app.globalData.user_id,'user_id: app.globalData.user_id')
  util.request(api.QueryVedioCategoryByIDUrl,
    { openid:app.globalData.openid,spread_vedio_id:spread_vedio_id,user_id: app.globalData.user_id}
    ,'POST').then(function(res){
      console.log(res,'详情');
      if(res.data.success==true){
        var summary =res.data.vedioCategoryByID[0].summary;
        
        that.setData({
          vedio_title:res.data.vedioCategoryByID[0].vedio_title,
          full_vedio:res.data.vedioCategoryByID[0].full_vedio,
          vedio_abbr_image:res.data.vedioCategoryByID[0].vedio_abbr_image,
          spread_vedio_id:res.data.vedioCategoryByID[0].spread_vedio_id
        })
        /**
        * WxParse.wxParse(bindName , type, data, target,imagePadding)
        * 1.bindName绑定的数据名(必填)
        * 2.type可以为html或者md(必填)
        * 3.data为传入的具体数据(必填)
        * 4.target为Page对象,一般为this(必填)
        * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
        */
        
        //WxParse.wxParse('article', 'html', article, that, 5);
        WxParse.wxParse('summary', 'html', summary, that, 5);
        
      }else{
        console.log(res.data.msg)
        that.setData({
          vedio_title:[],
          full_vedioV2:[],
          vedio_abbr_image:[],
          article_source:[]
        });
      }
  })
 
  },
  onLoad(options) {
    let that=this;
    console.log(options.spread_id,'spread_id')
    app.globalData.user_id=wx.getStorageSync('user_id');
      that.setData({
        spread_vedio_id:options.spread_id,
        user_id:app.globalData.user_id
      }),
      wx.showShareMenu({
          withShareTicket: true
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
   
  },

  onReady: function (res) {
   
  },

  inputValue: '',
    data: {
        src: '',
    danmuList: [
      {
        text: '第 1s 出现的弹幕',
        color: '#ff0000',
        time: 1
      },
      {
        text: '第 3s 出现的弹幕',
        color: '#ff00ff',
        time: 3
      }
    ]
    },
  bindInputBlur: function(e) {
    this.inputValue = e.detail.value
  },
    bindButtonTap: function() {  //视频下载
        var that = this
        wx.chooseVideo({
            sourceType: ['album', 'camera'],
            maxDuration: 60,
            camera: ['front','back'],
            success: function(res) {
                that.setData({
                    src: res.tempFilePath
                })
            }
        })
    },
  bindSendDanmu: function () {
    this.videoContext.sendDanmu({
      text: this.inputValue,
      color: getRandomColor()
    })
  },
    videoErrorCallback: function(e) {
      console.log('视频错误信息:');
      console.log(e.detail.errMsg);
    },
    onShareAppMessage: function (id) {
      this.AddAchivementAction();
      let spread_vedio_id=that.data.spread_vedio_id
      
      return {
        title: '视频分享',
        path: '/pages/extend/videoDetail/videoDetail?spread_id='+spread_vedio_id+ '&user_id=' + user_id + '&cid=2&sid=1',  //分享的页面所需要的id
      
      }
    },
     //分享
    AddAchivementAction:function(e) {
        console.log(e);
      let that = this;
      util.request(api.AddAchivementActionUrl,
        { openid:app.globalData.openid,achivement_category:'视频',user_id:app.globalData.user_id,spread_id:that.data.spread_vedio_id,spread_ass_id:"0"}
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
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      if(util.checkOpenId()){
        this.setData({
          isHidden:true
        })
        this.QueryVedioCategoryByID()
        this.videoContext = wx.createVideoContext('myVideo')
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
      this.setData({
        isHidden:true,
        token:e.detail
      })
      this.onShow();
    },
})