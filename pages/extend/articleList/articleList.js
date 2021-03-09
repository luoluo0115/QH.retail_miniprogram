// pages/extend/articleList/articleList.js
const app = getApp()
var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    articleCategory:'',
    articleCategoryByList:'',
    article_category:'',
    isHidden: true, //是否隐藏登录弹窗
    page_index: 1,   //当前页
    page_size: 10,  //每页条数
    maxCount: 1, //总页数
    isMore: true, //是否还有更多数据
    noData: false,   //暂无数据;
    listData: [],
    loading: true,
    indexList:0,
    articleAddBtn:false
  },
  bindTapAddArticle(event) {
    if( util.checkOpenId()){
      wx.navigateTo({
        url: '/pages/extend/articleAdd/articleAdd'
      })
    }else{
      this.setData({
        isHidden:false
      })
    }
  },
  onChange(event) {
    console.log(event.detail.index,'标签');
    this.setData({
      indexList: event.detail.index,
      page_index:1,
      listData:[],
    })
    this.QueryArticleCategoryByList(event.detail.index);
  },
   //获取推广文章类别
   QueryArticleCategory:function() {
     console.log(app.globalData.openid,'openid')
    let that = this;
    util.request(api.QueryArticleCategoryUrl,
      { openid:'12'}
      ,'POST').then(function(res){
        console.log(res,'文章类别')
        //var customerList=JSON.stringify(res.data.customerList);
        if(res.data.success==true){
          that.setData({
            articleCategory:res.data.articleCategory,
          });
          app.globalData.articleCategory=res.data.articleCategory
          that.QueryArticleCategoryByList(0);
          
        }else{
          that.setData({
            articleCategory:[]
          });
        }
    })
    
  },
   //根据文章类别获取文章
   QueryArticleCategoryByList:function(e) {
    let that = this;
    that.setData({
      loading:true
    })
    util.request(api.QueryArticleCategoryByListUrl,
      { openid:'12',user_id:app.globalData.user_id,article_category:that.data.articleCategory[e].article_category,page_index:that.data.page_index,page_size:that.data.page_size}
      ,'POST').then(function(res){
        console.log(res,'文章')
        if(res.data.success==true){
          that.setData({
            articleCategoryByList:res.data.articleCategoryByList,
            page_index: that.data.page_index*1 + 1,
            maxCount:res.data.maxCount
          });
          let newList = that.data.listData.concat(res.data.articleCategoryByList)
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
          that.setData({
            articleCategoryByList:[],
            listData:[],
            msg:res.data.msg,
            loading: false,
          });
        }
    })
   
 },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if( app.globalData.function_ctrl=='N'){
      this.setData({
        articleAddBtn:false
      })
    }else if(app.globalData.function_ctrl=='Y'){
      this.setData({
        articleAddBtn:true
      })
    }
    if(util.checkOpenId()){
    //获取推广文章分类
    this.QueryArticleCategory();
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
   /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
   onPullDownRefresh: function () {
    this.data.page_index = 1
    var indexList=this.data.indexList
    console.log(indexList,'indexList')
    if (!this.data.loading) {
      this.setData({
        listData: [],
      })
      this.QueryArticleCategoryByList(indexList)
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
      this.QueryArticleCategoryByList(indexList)
    }
   
  },
  
})