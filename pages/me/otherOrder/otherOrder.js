// pages/me/otherOrder/otherOrder.js
const app = getApp()
var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
var WxParse = require('../../../wxParse/wxParse.js');
import Toast from '../../../vant-weapp/dist/toast/toast';
import Dialog from '../../../vant-weapp/dist/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList:[],
    active: 0,
    status: "N",
    isHidden: true,
    token: null,
    other_id:'',
    logo:'',
    honor_logo:'',
    dispaly_name:'',
    join_time:'--',
    achivement_score:'',
    acc_commission_amt:'',
    draw_amt:'',
    remark_name:'',
    myVisitorsReadList:[],
    listDataVisitorsReadList:[],
    page_index: 1,   //当前页
    page_size: 15,  //每页条数
    maxCount: 1, //总页数
    isMore: true, //是否还有更多数据
    noData: false,   //暂无数据;
    myVisitorsShareList:[],
    listDataVisitorsShareList:[],
    loading: true,
    indexList:0,
    show:false
  },
  onChange(event) {
    console.log(event.detail.title,'title');
    let that=this;
    that.setData({
      checkTitle:event.detail.title,
      page_index:1,
      listDataVisitorsReadList:[],
      listDataVisitorsShareList:[],
    })
    if(event.detail.title=='未领取'){
      this.MyVisitorsOrder('N')
    }else if(event.detail.title=='已领取'){
      this.MyVisitorsOrder('Y')
    }else if(event.detail.title=='阅读'){
      this.QueryMyVisitorsRead()
    }else if(event.detail.title=='分享'){
      this.QueryMyVisitorsShare()
    }
    
  },
  //我的订单
  MyVisitorsOrder: function(e) {
    let that= this;
    util.request(api.MyVisitorsOrderUrl,//查询我的订单
      { openid:app.globalData.openid,user_id:app.globalData.user_id,child_user_id:that.data.other_id,status:e}
      ,'POST').then(function(res){
        if(res.data.success==true){
            console.log(res.data.orderList,'我的订单')
            that.setData({
              orderList:res.data.orderList,
            });

        }else{
          console.log(res.data.msg)
          that.setData({
            msg:res.data.msg,
            orderList:[],
          });
        
        }
    })
    
  },
  //我的获客阅读
  QueryMyVisitorsRead: function(e) {
    let that= this;
    that.setData({
      loading:true
    })
    util.request(api.QueryMyVisitorsReadUrl,//查询我的获客阅读
      { openid:app.globalData.openid,user_id:app.globalData.user_id,child_user_id:that.data.other_id,page_index:that.data.page_index,page_size:that.data.page_size}
      ,'POST').then(function(res){
        console.log(res,'获客')
        if(res.data.success==true){
          that.setData({
            myVisitorsReadList:res.data.myVisitorsReadList,
            page_index: that.data.page_index*1 + 1,
            maxCount:res.data.maxCount
          });
          console.log(that.data.myVisitorsReadList,'获客111')
          let newList = that.data.listDataVisitorsReadList.concat(that.data.myVisitorsReadList)
          that.setData({
            listDataVisitorsReadList: newList,
            loading: false,
            noData: false
          })
          console.log(that.data.listDataVisitorsReadList,'listDataVisitorsReadList')
          if((res.data.maxCount>1)&&(res.data.maxCount<that.data.page_index)){
            that.setData({
              noData: true
            })
          }
        }else{
          that.setData({
            myVisitorsReadList:[],
            listDataVisitorsReadList:[],
            msg:res.data.msg,
            loading: false,
          });
        }
          
    })
  },
  //我的获客分享
  QueryMyVisitorsShare: function(e) {
    let that= this;
    that.setData({
      loading:true
    })
    util.request(api.QueryMyVisitorsShareUrl,//查询我的获客分享
      { openid:app.globalData.openid,user_id:app.globalData.user_id,child_user_id:that.data.other_id,page_index:that.data.page_index,page_size:that.data.page_size}
      ,'POST').then(function(res){
        console.log(res,'分享')
        if(res.data.success==true){
          that.setData({
            myVisitorsShareList:res.data.myVisitorsShareList,
            page_index: that.data.page_index*1 + 1,
            maxCount:res.data.maxCount
          });
          let newList = that.data.listDataVisitorsShareList.concat(res.data.myVisitorsShareList)
          that.setData({
            listDataVisitorsShareList: newList,
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
            myVisitorsShareList:[],
            listDataVisitorsShareList:[],
            msg:res.data.msg,
            loading: false,
          });
        }
          
    })

    
  },
  //领取订单奖励
  onTapdraw:function(e){
    let that= this;
    let pre_order_id=e.currentTarget.dataset.pre_order_id;
    let pre_order_commission_id=e.currentTarget.dataset.pre_order_commission_id;
    util.request(api.PostAchievementReceiveUrl,//领取我的订单奖励
      { openid:app.globalData.openid,user_id:app.globalData.user_id,pre_order_id:pre_order_id,pre_order_commission_id:pre_order_commission_id}
      ,'POST').then(function(res){
        if(res.data.success==true){
            Toast(res.data.msg);
            that.MyVisitorsOrder('N')
        }else{
          Toast(res.data.msg);
        
        }
    })

  },

  onClose() {
    this.setData({ show: false });
  },
  bindTapRemark(){
    this.setData({ show: true });
  },
  //修改备注
  bindSave: function(e) {
    let that = this;
    that.setData({
      remark_name : e.detail.value.remark_name
    })
    let postData={ openid:app.globalData.openid,user_id:app.globalData.user_id,child_user_id:that.data.other_id,remark_name:that.data.remark_name}
    util.request(api.PostRemarkNameUrl,//修改备注
      postData
      ,'POST').then(function(res){
        if(res.data.success==true){
          that.setData({ show: false });
            Toast(res.data.msg);
           
        }else{
          that.setData({ show: false });
          Toast(res.data.msg);
          
        }
    })
  },
  bindTapProductDetail:function(event) {
    let item_id = event.currentTarget.dataset.item_id
    wx.navigateTo({
      url: '../../product/good/good?spread_id='+ item_id

    })
    
  },
  //查询基本信息
  QueryBasicSetupe:function(e){
    let that= this;
   
    util.request(api.QueryBasicSetupe,//查询基本信息
      { openid:app.globalData.openid,user_id:that.data.other_id}
      ,'POST').then(function(res){
        if(res.data.success==true){
          console.log(res,'基本信息')
          that.setData({
              logo:res.data.myBasicSetupList[0].logo,
              honor_logo:res.data.myBasicSetupList[0].honor_logo,
              dispaly_name:res.data.myBasicSetupList[0].dispaly_name,
              join_time:res.data.myBasicSetupList[0].join_time,
              achivement_score:res.data.myBasicSetupList[0].achivement_score,
              acc_commission_amt:res.data.myBasicSetupList[0].acc_commission_amt,
              draw_amt:res.data.myBasicSetupList[0].draw_amt,
              remark_name:res.data.myBasicSetupList[0].remark_name,
             })
        }else{
          that.setData({
              logo:'',
              honor_logo:'',
              dispaly_name:'',
              join_time:'--',
              achivement_score:0,
              acc_commission_amt:0,
              draw_amt:0,
              remark_name:'',
             })
        }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,'options')
    let that= this;
   
      if( util.checkOpenId()){
        that.setData({
          other_id:options.other_id,
          other_active:options.other_active,
          spread_id:options.spread_id,
          action_category:options.action_category,
          isHidden:true
        })
        that.QueryBasicSetupe();
        
        that.MyVisitorsOrder('N')
        
      }else{
        this.setData({
          isHidden:false
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
    let pages = getCurrentPages(); //页面栈
    let beforePage = pages[pages.length - 2];
    if (beforePage.route == 'pages/me/myExtend/myExtend') {
      let options={active:1};
      beforePage.onLoad(options) //这个函数式调用接口的函数
     
    }else if(beforePage.route == 'pages/me/shareVisitors/shareVisitors'){
      console.log(this.data.other_active,'卸载other_active')
      let options={active:this.data.other_active, spread_id:this.data.spread_id,
        action_category:this.data.action_category};
      beforePage.onLoad(options) //这个函数式调用接口的函数
      
    }
  },
 /**
  * 页面相关事件处理函数--监听用户上拉动作
  */
onReachBottom: function () {
  let that =this;
  var indexList=that.data.indexList
  console.log('32332')
  if(!that.data.loading && that.data.maxCount > that.data.page_index-1){
    console.log('11111')
    if(that.data.checkTitle=='阅读'){
      that.QueryMyVisitorsRead()
    }else if(that.data.checkTitle=='分享'){
      that.QueryMyVisitorsShare()
    }
  }
 
},

 
})