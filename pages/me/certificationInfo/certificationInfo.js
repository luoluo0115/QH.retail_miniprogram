// pages/me/certificationInfo/certificationInfo.js
const app = getApp()
var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:"",
    ID:"",
    bank_name:"",
    bank_account:"",
    bank_type:"",
    bank_valid_date:"",
    is_bank_card_provide:"",
    phone:"",
    Operator:"",
    is_real_check:"",
    spread_activity_user_step_id:'',
    isHidden: true,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryBasicSetupe();
  },
  //基本设置
  QueryBasicSetupe:function(e){
    let that=this;
    util.request(api.QueryBasicSetupe,{openid:app.globalData.openid,user_id:app.globalData.user_id},'POST').then(function(res){
      console.log(res); 
      if(res.data.success==true){
      
        if(res.data.myBasicSetupList[0].mobile_phone!=null &&res.data.myBasicSetupList[0].mobile_phone.length>3){
          that.shu(res.data.myBasicSetupList[0].mobile_phone.substr(0,3))
        }
        // if(str!=null){
        //  str=  str.substr(0,3)+'***************'+str.substr(15,18)
        // }
        that.setData({
          name:res.data.myBasicSetupList[0].real_nameV2,
          ID:res.data.myBasicSetupList[0].id_noV2,
          bank_name:res.data.myBasicSetupList[0].bank_name,
          bank_account:res.data.myBasicSetupList[0].bank_accountV2,
          bank_type:res.data.myBasicSetupList[0].bank_type,
          bank_valid_date:res.data.myBasicSetupList[0].bank_valid_date,
          is_bank_card_provide:res.data.myBasicSetupList[0].is_bank_card_provide,
          phone:res.data.myBasicSetupList[0].mobile_phoneV2,
          is_real_check:res.data.myBasicSetupList[0].is_real_check
        })
      }
    })
  },
  shu:function(e){
    let that=this;
    var str1=[134 ,135 ,136 ,137 ,138 ,139 ,147 ,148 ,150 ,151 ,152 ,157 ,158 ,159 ,165 ,172 ,178 ,182 ,183 ,184 ,187, 188, 198]
    var str2=[130 ,131 ,132 ,145 ,146 ,155 ,156 ,166 ,171 ,175 ,176 ,185 ,186]
    var str3=[133 ,149 ,153, 173 ,174 ,177 ,180 ,181, 189, 191 ,199]
    if(str1.toString().indexOf(e)>-1){
       that.setData({
        Operator:"中国移动"
       })
    }else if(str2.toString().indexOf(e)>-1){
      that.setData({
        Operator:"中国联通"
       })
    }else if(str3.toString().indexOf(e)>-1){
      that.setData({
        Operator:"中国电信"
       })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  toFace:function(){
    console.log('123toFace')
    wx.navigateTo({
      url: '../certification/certification'
      });
  },
  toBank:function(){
    wx.navigateTo({
      url: '../bankCertification/bankCertification'
      });
  },
  toPhone:function(){
    wx.navigateTo({
      url: '../phoneCertification/phoneCertification'
      });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that= this;
    that.QueryBasicSetupe();
    if( util.checkOpenId()){
      that.setData({
        isHidden:true
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
    wx.navigateBack({
      delta: 1,
      });
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