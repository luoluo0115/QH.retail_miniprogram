// pages/me/myExtend/myExtend.js
const app = getApp()
var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
import Toast from '../../../vant-weapp/dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto: '欢迎来到企汇财税秘书',
    userInfo: {},
    show: true,
    userInfo: null,
		isHidden: true, //是否隐藏登录弹窗
    token:null,
    mySpreadList:[],
    myVisitorsList:[],
    active:0,
    checkTitle:'我的经验',
    myShareList:[],
    page_index: 1,   //当前页
    page_size: 15,  //每页条数
    maxCount: 1, //总页数
    isMore: true, //是否还有更多数据
    noData: false,   //暂无数据;
    listData: [],
    listDataVisitors: [],
    listDataShare:[],
    loading: true,
    indexList:0,
    activeScore:'',
    activeAmt:'',
    desc:'desc',
    descAmt:'desc',
    type:'join_time',
  },
  //排序
  bindActiveType:function(event){
    console.log(event,'event')
    let that= this;
    let type=event.currentTarget.dataset.type
    that.setData({
      type:event.currentTarget.dataset.type,
      page_index:1,
      listDataShare:[],
      listDataVisitors:[],
      myVisitorsList:[],
    })
    if(type=='achivement_score'){
      that.setData({
        activeScore:'active',
        activeAmt:''
      })
    }else if(type=='acc_commission_amt'){
      that.setData({
        activeAmt:'active',
        activeScore:'',
      })
    }
    if(that.data.desc=='desc'){
      that.setData({
        desc:'asc'
      })
    }else if(that.data.desc=='asc'){
      that.setData({
        desc:'desc'
      })
    }
    console.log(that.data.desc,'that.data.desc')
    that.QueryMyVisitors()
    
  },
  //去我的获客订单
  goOtherOrder:function(event){
    console.log(event,'event')
    let other_id = event.currentTarget.dataset.other_id;
    let other_active = event.currentTarget.dataset.other_active;
    
    wx.navigateTo({
      url: '../otherOrder/otherOrder?other_id='+ other_id + '&active=1'
    })
  },
  //去我的分享获客
  goShareVisitors:function(event){
    let spread_id = event.currentTarget.dataset.spread_id;
    let action_category=event.currentTarget.dataset.spread_category;
    console.log(action_category,'action_category')
    wx.navigateTo({
      url: '/pages/me/shareVisitors/shareVisitors?spread_id='+ spread_id +'&action_category='+action_category+ '&active=1'

    })
  },
  onChange(event) {
    let that=this;
    that.setData({
      checkTitle:event.detail.title,
      page_index:1,
      desc:'desc',
      descAmt:'desc',
      listData:[],
      listDataShare:[],
      listDataVisitors:[],
      activeScore:'',
      activeAmt:''
    })
    if(that.data.checkTitle=='我的经验'){
      that.QueryMySpread()
    }else if(that.data.checkTitle=='我的获客'){
      that.QueryMyVisitors()
    }else if(that.data.checkTitle=='我的分享'){
      that.QueryMyShare()
    }
  },
  QueryMySpread:function(){
  
    let that= this;
    that.setData({
      loading:true
    })
    util.request(api.QueryMySpreadUrl,//查询我的成长
      { openid:app.globalData.openid,user_id:app.globalData.user_id,page_index:that.data.page_index,page_size:that.data.page_size}
      ,'POST').then(function(res){
        if(res.data.success==true){
          if(that.data.checkTitle=='我的经验'){
            that.setData({
              mySpreadList:res.data.mySpreadList,
              myVisitorsList:'',
              page_index: that.data.page_index*1 + 1,
              maxCount:res.data.maxCount
            });
            let newList = that.data.listData.concat(res.data.mySpreadList)
            that.setData({
              listData: newList,
              loading: false,
              noData: false
            })
            if((res.data.maxCount>1)&&(res.data.maxCount<=that.data.page_index)){
              that.setData({
                noData: true
              })
            }
          }else if(that.data.checkTitle=='我的获客'){
            that.setData({
              mySpreadList:'',
              myVisitorsList:res.data.myVisitorsList,
              maxCount:res.data.maxCount
            });
            let newList = that.data.listData.concat(res.data.myVisitorsList)
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
          }
        }else{
          that.setData({
            myVisitorsList:'',
            mySpreadList:'',
            listData:[],
            msg:res.data.msg,
            loading: false,
          });
        }
    })
  },
   //查询我的获客
   QueryMyVisitors:function(){
    let that= this;
    that.setData({
      loading:true,
      myVisitorsList:[]
    })
    let postData= { 
      openid:app.globalData.openid,
      user_id:app.globalData.user_id,
      page_index:that.data.page_index,
      page_size:that.data.page_size,
      order:that.data.type,
      desc:that.data.desc
    }
    util.request(api.QueryMyVisitorsUrl,//查询我的获客
        postData
      ,'POST').then(function(res){
        if(res.data.success==true){
          that.setData({
            myVisitorsList:res.data.myVisitorsList,
            maxCount:res.data.maxCount
          });
          let newList = that.data.listDataVisitors.concat(res.data.myVisitorsList)
          that.setData({
            listDataVisitors: newList,
            loading: false,
            noData: false
          })
          if((res.data.maxCount>1)&&(res.data.maxCount<=that.data.page_index)){
            that.setData({
              noData: true
            })
          }
        }else{
          that.setData({
            myVisitorsList:[],
            listDataVisitors:[],
            msg:res.data.msg,
            loading: false,
          });
        }
          
    })
  },
  //查询我的分享
  QueryMyShare:function(){
    let that= this;
    that.setData({
      loading:true
    })
   
    util.request(api.QueryMyShareUrl,//查询我的分享
      { openid:app.globalData.openid,user_id:app.globalData.user_id,page_index:that.data.page_index,page_size:that.data.page_size}
      ,'POST').then(function(res){
        if(res.data.success==true){
          console.log(res,'分享')
          that.setData({
            myShareList:res.data.myShareList,
            maxCount:res.data.maxCount
          });
          let newList = that.data.listDataShare.concat(that.data.myShareList)
         
          that.setData({
            listDataShare: newList,
            loading: false,
            noData: false
          })
          console.log(that.data.listDataShare,'分享列表')
          if((res.data.maxCount>1)&&(res.data.maxCount<=that.data.page_index)){
            that.setData({
              noData: true
            })
          }
        }else{
          that.setData({
            myShareList:'',
            listDataShare:[],
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
   
    let that =this;
    console.log(options,'options123')
    if(options.active!=''&& options.active!=undefined){
      if(options.active==2){
        that.setData({
          checkTitle:'我的分享',
          active:2,
          listDataShare: [],
          page_index:1,
          desc:'desc',
          
        })
      }else if(options.active==1){
        that.setData({
          checkTitle:'我的获客',
          active:1,
          page_index:1,
          desc:'desc',
          listDataVisitors:[],
          activeScore:'',
          activeAmt:''
        })
      }else{
        that.setData({
          checkTitle:'我的经验',
          active:0,
          page_index:1,
          desc:'desc',
          listData:[],
          listDataVisitors:[],
          activeScore:'',
          activeAmt:''  

        })

      }
      
    }else if(options.active==undefined){
      that.setData({
        checkTitle:'我的经验',
        active:0,
        page_index:1,
        listData:[],
        desc:'desc',
        listDataVisitors:[]
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
    this.getUserInfoDetail();
    if(that.data.checkTitle=='我的分享'){
      that.QueryMyShare()
    }else if(that.data.checkTitle=='我的获客'){
      that.QueryMyVisitors()
    }else{
      that.QueryMySpread()
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
    let that= this;
    if( util.checkOpenId()){
      if(that.data.checkTitle=='我的分享'){
        that.QueryMyShare()
      }else if(that.data.checkTitle=='我的获客'){
        that.QueryMyVisitors()
        console.log('onshow')
      }else if(that.data.checkTitle=='我的经验'){
        that.QueryMySpread()
      }
    }else{
      this.setData({
        isHidden:false
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let that= this;
    if( util.checkOpenId()){
      if(that.data.checkTitle=='我的经验'){
        that.setData({
          listData:[],
          page_index:1,
          desc:'desc',
        });
      }else if(that.data.checkTitle=='我的获客'){
        that.setData({
          page_index:1,
          desc:'desc',
          listDataVisitors:[],
          activeScore:'',
          activeAmt:''  
        });
      }else if(that.data.checkTitle=='我的分享'){
        that.setData({
          page_index:1,
          desc:'desc',
          listDataShare: [],
          activeScore:'',
          activeAmt:''  
        });
      }
    }else{
      this.setData({
        isHidden:false
      })
    }
    
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
    let that=this;
    that.data.page_index = 1
    if (!that.data.loading) {
      if(that.data.checkTitle=='我的分享'){
        that.setData({
          listData: [],
          listDataVisitors:[],
          listDataShare: [],
        })
        that.QueryMyShare()
      }else if(that.data.checkTitle=='我的获客'){
        that.setData({
          listData: [],
          listDataVisitors:[],
          listDataShare: [],
        })
        that.QueryMyVisitors()
      }else{
        that.setData({
          listData: [],
          listDataVisitors:[],
          listDataShare: [],
        })
        that.QueryMySpread()
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
    that.setData({
      page_index: that.data.page_index*1 + 1,
    })
    console.log(that.data.page_index,'that.data.page_index')
    var indexList=that.data.indexList

    if(!that.data.loading && that.data.maxCount > that.data.page_index-1){
      if(that.data.checkTitle=='我的分享'){
        that.QueryMyShare()
      }else if(that.data.checkTitle=='我的获客'){
        that.QueryMyVisitors()
      }else{
        that.QueryMySpread()
      }
    }
   
  },

  
})