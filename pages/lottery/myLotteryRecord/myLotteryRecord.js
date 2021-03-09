//获取应用实例
const app = getApp()
var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
import Toast from '../../../vant-weapp/dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myLotteryRecordList: []
  },
 //好运播报(中奖记录)
 QueryMyLotteryRecord: function () {
  console.log();
  let that = this;
  util.request(api.QueryMyLotteryRecordUrl,
    { openid: app.globalData.openid,user_id:app.globalData.user_id}
    , 'POST').then(function (res) {
      console.log(res, 'res.data.lotteryInfo')
      if (res.data.success == true) {
        that.setData({
          myLotteryRecordList: res.data.myLotteryRecordList,
        });
        
        console.log(res.data.myLotteryRecordList, 'res.data.myLotteryRecordList')
      } else {
        console.log(res.data.msg)
        that.setData({
          myLotteryRecordList: []
        });
      }
    })

  },
  onLottoryGo: function (event){
    let that= this;
    let lottery_action_id=event.currentTarget.dataset.lottery_action_id
    let win_item_id= event.currentTarget.dataset.lottery_item_id
    that.setData({ show: false });
    let postData={ 
      openid: app.globalData.openid,
      user_id:app.globalData.user_id,
      lottery_action_id:lottery_action_id,
      win_item_id:win_item_id
    }
    util.request(api.PostLotteryWinUrl,
      postData
      , 'POST').then(function (res) {
        if (res.data.success == true) {
          Toast.success(res.data.msg); 
        } else {
          Toast.fail(res.data.msg);
        }
        that.QueryMyLotteryRecord()
        
      })
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.QueryMyLotteryRecord()
  },
 
})