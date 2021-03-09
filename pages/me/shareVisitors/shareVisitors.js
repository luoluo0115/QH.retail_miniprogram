// pages/me/shareVisitors/shareVisitors.js
const app = getApp()
var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
import Toast from '../../../vant-weapp/dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:1,
    isHidden: true, //是否隐藏登录弹窗
    myShareList:'',
    page_index: 1,   //当前页
    page_size: 20,  //每页条数
    maxCount: 1, //总页数
    isMore: true, //是否还有更多数据
    noData: false,   //暂无数据;
    myShareVisitorsList :[],
    listDataShare:[],
    loading: true,
    indexList:0,
    action_category:'',
    MyShareReadList:'',
    listDataRead:[],
  },
  onChange(event) {
    let that=this;
    that.setData({
      checkTitle:event.detail.title,
      page_index:1,
      listDataRead:[],
      listDataShare:[],
    })
    if(that.data.checkTitle=='获客'){
      console.log(8888)
      that.QueryShareVisitors()
    }else if(that.data.checkTitle=='阅读'){
      console.log(8888)
      that.QueryShareRead()
    }
  },
  //查询我的分享获客
  QueryShareVisitors:function(){
    let that= this;
    that.setData({
      loading:true
    })
   
    util.request(api.QueryShareVisitorsUrl,//查询我的分享
      { openid:app.globalData.openid,user_id:app.globalData.user_id,page_index:that.data.page_index,spread_id:that.data.spread_id,page_size:that.data.page_size}
      ,'POST').then(function(res){
        console.log(res,'QueryShareVisitors')
        if(res.data.success==true){
          that.setData({
            myShareVisitorsList :res.data.myShareVisitorsList ,
            page_index: that.data.page_index*1 + 1,
            maxCount:res.data.maxCount
          });
          let newList = that.data.listDataShare.concat(res.data.myShareVisitorsList )
          that.setData({
            listDataShare: newList,
            loading: false,
            noData: false
          })
          if((res.data.maxCount>1)&&(res.data.maxCount<that.data.page_index)){
            that.setData({
              noData: true
            })
          }
        }else{
          that.setData({
            MyShareVisitorsList :[],
            listDataShare:[],
            msg:res.data.msg,
            loading: false,
          });
        }
          
    })
  },
   //查询我的分享阅读
   QueryShareRead:function(){
    let that= this;
    that.setData({
      loading:true
    })
   let postData={
      openid:app.globalData.openid,
      user_id:app.globalData.user_id,
      page_index:that.data.page_index,
      action_category:that.data.action_category,
      spread_id:that.data.spread_id,
      page_size:that.data.page_size
   }
   console.log(postData,'postData')
    util.request(api.QueryShareReadUrl,//查询我的分享
      postData
      ,'POST').then(function(res){
        console.log(res,'QueryRead')
        if(res.data.success==true){
          that.setData({
            myShareReadList:res.data.myShareReadList,
            page_index: that.data.page_index*1 + 1,
            maxCount:res.data.maxCount
          });
          let newList = that.data.listDataRead.concat(res.data.myShareReadList)
          that.setData({
            listDataRead: newList,
            loading: false,
            noData: false
          })
          if((res.data.maxCount>1)&&(res.data.maxCount<that.data.page_index)){
            that.setData({
              noData: true
            })
          }
        }else{
          that.setData({
            MyShareReadList:'',
            listDataRead:[],
            msg:res.data.msg,
            loading: false,
          });
        }
          
    })
  },
    //去我的获客订单
    goOtherOrder:function(event){
      console.log(event,'event')
      let other_id = event.currentTarget.dataset.other_id;
      let other_active = event.currentTarget.dataset.other_active;
      wx.navigateTo({
        url: '../otherOrder/otherOrder?other_id='+ other_id + '&other_active='+other_active + '&spread_id='+this.data.spread_id+ '&action_category='+this.data.action_category
      })
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that =this;
    that.setData({
      spread_id:options.spread_id,
      action_category:options.action_category

    })
    console.log(options,'options.active')
    if(options.active!=''&& options.active!=undefined){
      if(options.active==0){
        that.setData({
          checkTitle:'获客',
          active:0,
          listDataShare: [],
          page_index:1
        })
        
      }else if(options.active==1){
        that.setData({
          checkTitle:'阅读',
          active:1,
          listDataRead:[],
          page_index: 1, 
        })
      }
      
    }
    console.log(that.data.action_category,'action_category')
    
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
      if(that.data.checkTitle=='获客'){
        console.log(12345)
        that.QueryShareVisitors()
      }else if(that.data.checkTitle=='阅读'){
        console.log(125555)
        that.QueryShareRead()
      }
      that.setData({
        isHidden:false
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
    this.QueryShareVisitors();
    
	},
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let that= this;
    if(that.data.checkTitle=='获客'){
     that.setData({
      active:0,
      listDataShare: [],
      page_index:1
     })
    }else if(that.data.checkTitle=='阅读'){
      that.setData({
        active:1,
        listDataRead:[],
        page_index: 1, 
       })
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
    let pages = getCurrentPages(); //页面栈
    let beforePage = pages[pages.length - 2];
    if (beforePage.route == 'pages/me/myExtend/myExtend') {
      let options={active:2};
      beforePage.onLoad(options) //这个函数式调用接口的函数
     
    }
  },

  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh: function () {
    console.log(123)
    let that=this;
    that.data.page_index = 1
    console.log(that.data.page_index,'that.data.page_index')
    if (!that.data.loading) {
      if(that.data.checkTitle=='获客'){
        that.setData({
          listDataShare: [],
          listDataRead: [],
        })
        that.QueryShareVisitors()
      }else if(that.data.checkTitle=='阅读'){
        that.setData({
          listDataRead: [],
          listDataShare: [],
        })
        that.QueryShareRead()
      }
      // 处理完成后，终止下拉刷新
      wx.stopPullDownRefresh()
    }

  },
   /**
    * 页面相关事件处理函数--监听用户上拉动作
    */
  onReachBottom: function () {
    let that =this;
    var indexList=that.data.indexList;
    if(!that.data.loading && that.data.maxCount > that.data.page_index-1){
      if(that.data.checkTitle=='获客'){
        that.QueryShareVisitors()
      }else if(that.data.checkTitle=='阅读'){
        that.QueryShareRead()
      }
    }
   
  }
  
})