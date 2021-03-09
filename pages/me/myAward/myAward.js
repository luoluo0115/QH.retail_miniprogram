// pages/me/myAward/myAward.js
const app = getApp()
var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
import Toast from '../../../vant-weapp/dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img:api.ImgUrl+'/FileDown/GetSharedImage?image_code=D031',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var item = options.item;
    let that=this;
    console.log(item,'item')
    if(item=='H'){
      var honor = options.honor;
      console.log(honor,'honor')
      if(honor=='合伙人'){
        that.setData({
          img:api.ImgUrl+'/FileDown/GetSharedImage?image_code=D041',
        })
      }else if(honor=='帮主'){
        that.setData({
          img:api.ImgUrl+'/FileDown/GetSharedImage?image_code=D040',
        })
      }else if(honor=='长老'){
        that.setData({
          img:api.ImgUrl+'/FileDown/GetSharedImage?image_code=D039',
        })
      }else if(honor=='护法'){
        that.setData({
          img:api.ImgUrl+'/FileDown/GetSharedImage?image_code=D038',
        })
      }else if(honor=='堂主'){
        that.setData({
          img:api.ImgUrl+'/FileDown/GetSharedImage?image_code=D037',
        })
      }else if(honor=='精英'){
        that.setData({
          img:api.ImgUrl+'/FileDown/GetSharedImage?image_code=D036',
        })
      }else if(honor=='执事'){
        that.setData({
          img:api.ImgUrl+'/FileDown/GetSharedImage?image_code=D035',
        })
      }else{
        that.setData({
          img:api.ImgUrl+'/FileDown/GetSharedImage?image_code=D033',
        })
      }
    }else if(item=='A'){
      that.setData({
        img:api.ImgUrl+'/FileDown/GetSharedImage?image_code=D031',
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