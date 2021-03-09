// pages/extend/videoList/videoList.js
const app = getApp()
var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    vedioCategory:'',
    indexList:0,
    userInfo: [],
    posterCategory:[],
    vedioCategoryByList:[],
    vedioHomeImg:[],
    imgBgUrl:'',
    menuHeight: "", //菜单高度
    currentTab: 0, //预设当前项的值
    scrollTop: 0, //tab标题的滚动条位置
    isHidden: true, //是否隐藏登录弹窗
    VideoId:'',
    Summary:'',
    page_index: 1,   //当前页
    page_size: 14,  //每页条数
    maxCount: 1, //总页数
    isMore: true, //是否还有更多数据
    noData: false,   //暂无数据;
    listData: [],
    loading: true,

  },
  bindTapBillDetail:function(event){
    console.log(event,'eventevent')
    let spread_vedio_id = event.currentTarget.dataset.spread_vedio_id;
    wx.navigateTo({
      url: '../videoDetail/videoDetail?spread_id='+ spread_vedio_id
    })
  },
//获取推广视频类别
QueryVedioCategory:function() {
  let that = this;
  util.request(api.QueryVedioCategoryUrl,
    { openid:app.globalData.openid}
    ,'POST').then(function(res){
      if(res.data.success==true){
        that.setData({
          vedioCategory:res.data.vedioCategory,
        });
        app.globalData.vedioCategory=res.data.vedioCategory
        that.QueryVedioCategoryByList(0);
      }else{
        console.log(res.data.msg)
        that.setData({
          vedioCategory:[]
        });
      }
  })
  
},
 //根据视频类别获取视频列表
 QueryVedioCategoryByList:function(e) {
   console.log(e);
  let that = this;
  that.setData({
    loading:true
  })
  console.log(that.data.maxCount);
  util.request(api.QueryVedioCategoryByListUrl,
    { openid:app.globalData.openid,user_id:app.globalData.user_id,vedio_category:that.data.vedioCategory[e].vedio_category,page_index:that.data.page_index,page_size:that.data.page_size}
    ,'POST').then(function(res){
      if(res.data.success==true){
        that.setData({
          vedioCategoryByList:res.data.vedioCategoryByList,
          vedioHomeImg:res.data.vedioHomeImg,
          page_index: that.data.page_index*1 + 1,
          maxCount:res.data.maxCount
        });
        let newList = that.data.listData.concat(res.data.vedioCategoryByList)
        that.setData({
          listData: newList,
          loading: false,
          noData: false
        })
        if((res.data.maxCount>1)&&(res.data.maxCount<that.data.page_index)){
          that.setData({
            noData: true
          })
        }
        
      }else{
        console.log(res.data.msg)
        that.setData({
          vedioCategoryByList:[],
          vedioHomeImg:[],
          msg:res.data.msg,
          listData:[],
          loading: false,
        });
      }
  })

  
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(util.checkOpenId()){
      //获取视频
      this.QueryVedioCategory();
      }else{
        this.setData({
          isHidden:false
        })
      }
   
    
  },
  /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
   onPullDownRefresh: function () {
    this.data.page_index = 1
    var indexList=this.data.indexList;
    if (!this.data.loading) {
      this.setData({
        listData: [],
      })
      this.QueryVedioCategoryByList(indexList)
      // 处理完成后，终止下拉刷新
      wx.stopPullDownRefresh()
    }
  },
   /**
    * 页面相关事件处理函数--监听用户上拉动作
    */
  onReachBottom: function () {
    var indexList=this.data.indexList
    if(!this.data.loading && this.data.maxCount > this.data.page_index-1){
      this.QueryVedioCategoryByList(indexList)
    }
    
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    let cur = e.currentTarget.dataset.current;
    console.log(cur,'选中');
    this.setData({
      indexList: cur,
      page_index:1,
      listData:[],
    })
    //this.QueryPosterCategoryById(cur);
    this.QueryVedioCategoryByList(cur);
    if (this.data.currentTab == cur) {
      return false;
    } else {
      wx.pageScrollTo({
        scrollTop: 0
      })
      this.setData({
        currentTab: cur,
        page_index:1,
        listData:[],
      })
      this.checkCor();
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    let that = this;
    //这里计算按照实际情况进行修改，动态数据要进行动态分析
    //思路：窗体高度/单个分类高度 200rpx 转px计算 =>得到一屏幕所显示的个数，结合后台传回分类总数进行计算
    //数据很多可以多次if判断然后进行滚动距离计算即可
    if (that.data.currentTab > 7) {
      that.setData({
        scrollTop: 500
      })
    } else {
      that.setData({
        scrollTop: 0
      })
    }
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