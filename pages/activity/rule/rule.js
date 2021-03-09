// pages/activity/rule/rule.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:"activity-rule",
    activityShow:false,
    agreeShow:false,
    stateShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,'options');
    let type=options.type;
    console.log(type,'type');
    let that= this;
    if(type=="active-rule"){
      console.log(1);
      wx.setNavigationBarTitle({
        title: '活动规则'
      })
      that.setData({
        activityShow:true
      })
    }else if(type=="agreement"){
      wx.setNavigationBarTitle({
        title: '用户协议'
      })
      that.setData({
        agreeShow:true
      })
    }else if(type=="statement"){
      wx.setNavigationBarTitle({
        title: '隐私声明'
      })
      that.setData({
        stateShow:true
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

})