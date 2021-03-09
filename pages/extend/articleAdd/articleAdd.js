// pages/extend/articleAdd/articleAdd.js
const app = getApp()
var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
import Toast from '../../../vant-weapp/dist/toast/toast';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isHidden: true, //是否隐藏登录弹窗
    myArticleByList:[],
    listData:[],
    page_index: 1,   //当前页
    page_size: 10,  //每页条数
    maxCount: 1, //总页数
    isMore: true, //是否还有更多数据
    noData: false,   //暂无数据;
    indexList:0
  },
  onChange(event) {
    let that=this;
    that.setData({
      checkTitle:event.detail.title,
      page_index:1,
      desc:'desc',
      listData:[]
    })
   if(that.data.checkTitle=='我的文章'){
      that.QueryMyArticlByList()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      listData:[]
    })
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
      if(util.checkOpenId()){
        if(that.data.checkTitle=='上传文章'){
        }else if(that.data.checkTitle=='我的文章'){
          that.QueryMyArticlByList()
        }
      }else{
        that.setData({
          isHidden:false
        })
      }
  },
  onHide() {
    let that= this;
    if(that.data.checkTitle=='我的文章'){
     that.setData({
      active:1,
      listData: [],
      page_index:1
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
  //获取我的文章
  QueryMyArticlByList:function(e) {
      let that = this;
      that.setData({
        loading:true
      })
      let postData={
        openid:app.globalData.openid,
        user_id:app.globalData.user_id,
        page_index:that.data.page_index,
        page_size:that.data.page_size
      }
      util.request(api.QueryMyArticlByListUrl,
          postData
          ,'POST').then(function(res){
          console.log(res,'文章')
          if(res.data.success==true){
            that.setData({
              myArticleByList:res.data.myArticleByList,
              maxCount:res.data.maxCount
            });
            console.log(res.data.myArticleByList,'myArticleByList')
            let newList = that.data.listData.concat(res.data.myArticleByList)
            console.log(newList,'newList')
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
              myArticleByList:[],
              listData:[],
              msg:res.data.msg,
              loading: false,
            });
          }
      })
    
  },
  //上传文章
  bindSaveUrl:function(e) {
      let that = this;
      that.setData({
        uploadUrl : e.detail.value.uploadUrl,
      })
      Toast.loading({
        message: '上传中...'
      });
      let postData={
        openid:app.globalData.openid,
        user_id:app.globalData.user_id,
        WxUrl:that.data.uploadUrl
      }
      util.request(api.CrawlerWxHtmlUrl,
          postData
          ,'POST').then(function(res){
          console.log(res,'上传文章')
          if(res.data.success==true){
            that.setData({
              msg:res.data.msg,
              loading: false,
            });
            Toast.success(res.data.msg);
            that.setData({
              uploadUrl : '',
            })
          }else{
            that.setData({
              msg:res.data.msg,
              loading: false,
            });
            Toast.fail(res.data.msg);
          }
         
      })
    
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
        page_index: 1,
      })
      this.QueryMyArticlByList(indexList)
      // 处理完成后，终止下拉刷新
      wx.stopPullDownRefresh()
    }

  },
   /**
    * 页面相关事件处理函数--监听用户上拉动作
    */
  onReachBottom: function () {
    var indexList=this.data.indexList
    this.setData({
      page_index:this.data.page_index*1+1,
    })
    if(!this.data.loading && this.data.maxCount > this.data.page_index-1){
      this.QueryMyArticlByList(indexList)
    }
   
  },
})