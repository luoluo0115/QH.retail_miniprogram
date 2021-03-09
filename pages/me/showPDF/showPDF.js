// pages/me/showPDF/showPDF.js
const app = getApp()
var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
import Toast from '../../../vant-weapp/dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //需要显示的PDF链接
    url:"",
    //当前机型
    ios:true
  },
  
  checkPhone(){
    let _this = this;
    var url= api.ImgUrl+'/FileDown/GetSharedImage?image_code=D029'
    wx.getSystemInfo({
      success: function(res) {
        //判断当前机型
        if (res.system.indexOf('iOS')!=-1){
          _this.setData({
            url: url
          })
        }else{
          _this.setData({
            ios:false
          })
          wx.downloadFile({
            url: url,
            success(res){
              let path = res.tempFilePath;
              wx.openDocument({
                filePath:path,
                fileType:"pdf",
                success(){
                  wx.navigateBack({
                    delta:1
                  })
                }
              })
            }
          })
        }
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.checkPhone()
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