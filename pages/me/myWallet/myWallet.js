// pages/me/myWallet/myWallet.js
const app = getApp()
var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
import Toast from '../../../vant-weapp/dist/toast/toast';
import Dialog from '../../../vant-weapp/dist/dialog/dialog';
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
    active: 0,
    myCoinPurseList:[],
    status:"I",
    is_hidden_money:"Y",
    msg:'',
    sendInfo: '', 

  },
  //显示隐藏金额
  hiddenEye:function(e){
    console.log(e,'e');
    let that= this;
    let is_hidden_money=e.currentTarget.dataset.type;
    if(is_hidden_money=="Y"){
      this.setData({
        is_hidden_money:"N"
      })
    }else(
      this.setData({
        is_hidden_money:"Y"
      })
    )
    
    util.request(api.PostHiddenMoneyUrl,//查询我的金额
      { openid:app.globalData.openid,user_id:app.globalData.user_id,is_hidden_money:that.data.is_hidden_money}
      ,'POST').then(function(res){
        if(res.data.success==true){
          that.QueryMyCoinPurse()
        }else{
        }
    })

  },
  QueryMyCoinPurse:function(){
    let that= this;
    util.request(api.QueryMyCoinPurseUrl,//查询我的金额
      { openid:app.globalData.openid,user_id:app.globalData.user_id}
      ,'POST').then(function(res){
        if(res.data.success==true){
            that.setData({
             
              myCoinPurseList:res.data.myCoinPurseList[0]
            });
        }else{
          Toast(res.data.msg);
          that.setData({
            myCoinPurseList:[],
    

          });
        
        }
    })
  },
  //提现
  bindSave: function(e) {
	
    let that = this;
    if (!util.checkOpenId()){
      return that.showAuth()
    }
    that.setData({
      amount : e.detail.value.amount
    })
		let amount = e.detail.value.amount;
    
    wx.requestSubscribeMessage({
      tmplIds: ['gvQqe6g-DzKz4H4enMOQNhtKS0YBndkiTOlwXVRQdWU'],
      success(res) {
        if (res['gvQqe6g-DzKz4H4enMOQNhtKS0YBndkiTOlwXVRQdWU'] === 'accept') {
          console.log('用户同意授权【提现成功通知】订阅消息')

          if (amount == "" || amount * 1 < 100) {
            Toast('请填写正确的提现金额');
            return
          }
          if (amount > that.data.myCoinPurseList.coin_purse) {
            Toast('您的提现金额大于您所有的可用余额');
            return
          }
          util.request(api.QueryIndividualIncomeTaxUrl,//个人所得税
            { openid: app.globalData.openid, user_id: app.globalData.user_id, amount_money: amount }
            , 'POST').then(function (res) {
              if (res.data.success == true) {
                let incomeTax = res.data.incomeTax;
                if (incomeTax > 0) {
                  Dialog.confirm({
                    message: '本月已累计劳务所得个税金额为:' + incomeTax + '元'
                  }).then(() => {
                    that.PostCashWithdrawal(amount)
                  }).catch(() => {
                    // on cancel
                  });
                } else {
                  that.PostCashWithdrawal(amount)
                }
              } else {
                Toast(res.data.msg);
              }
            })

        } else {
          console.log('用户拒绝授权订阅消息')

        }
      }, fail(res) {
        console.log('fail  失败' + JSON.stringify(res))
      },
      complete(res) {
        console.log('complete 调用完成')

        if (amount == "" || amount * 1 < 100) {
          Toast('请填写正确的提现金额');
          return
        }
        if (amount > that.data.myCoinPurseList.coin_purse) {
          Toast('您的提现金额大于您所有的可用余额');
          return
        }
        util.request(api.QueryIndividualIncomeTaxUrl,//个人所得税
          { openid: app.globalData.openid, user_id: app.globalData.user_id, amount_money: amount }
          , 'POST').then(function (res) {
            if (res.data.success == true) {
              let incomeTax = res.data.incomeTax;
              if (incomeTax > 0) {
                Dialog.confirm({
                  message: '本月已累计劳务所得个税金额为:' + incomeTax + '元'
                }).then(() => {
                  that.PostCashWithdrawal(amount)
                }).catch(() => {
                  // on cancel
                });
              } else {
                that.PostCashWithdrawal(amount)
              }
            } else {
              Toast(res.data.msg);
            }
          })

      }
    })
		
  },
  //提现
  PostCashWithdrawal:function(e){
    let that= this;
    util.request(api.PostCashWithdrawalUrl,//提现
      { openid:app.globalData.openid,user_id:app.globalData.user_id,amount_money:e}
      ,'POST').then(function(res){
        if(res.data.success==true){
          Toast(res.data.msg);
          console.log(res.data.msg)
          that.QueryMyCoinPurse()
          that.QueryCoinPurseTrans('I')
        }else{
          if(res.data.code=='E1001'||res.data.code=='E1002'){
            Dialog.confirm({
              confirmButtonText:'去绑定',
              message: res.data.msg
            }).then(() => {
              wx.navigateTo({
                url: '../certificationInfo/certificationInfo'
              })
            }).catch(() => {
              // on cancel
            });
          }else{
            Toast(res.data.msg);
          }
        }
    })
  },
  //零钱包交易记录
  QueryCoinPurseTrans: function(e) {
    let that = this;
    console.log(app.globalData.openid,'app.globalData.openid')
    console.log(app.globalData.user_id,'app.globalData.user_id')
    console.log(e,'e')
    util.request(api.QueryCoinPurseTransUrl,//零钱包交易记录
      { openid:app.globalData.openid,user_id:app.globalData.user_id,status:e}
      ,'POST').then(function(res){
        console.log(res,'res')
        if(res.data.success==true){

          that.setData({
            mCoinPurseTransList:res.data.mCoinPurseTransList
          })
        }else{
          that.setData({
            mCoinPurseTransList:[],
            msg:res.data.msg
          })
        }
    })
		
  },
  //切换零钱包交易记录title
  onChange(event) {
    if(event.detail.title=='奖励明细'){
      this.QueryCoinPurseTrans('I')
    }else if(event.detail.title=='提现审核'){
      this.QueryCoinPurseTrans('S')
    }else if(event.detail.title=='提现完成'){
      this.QueryCoinPurseTrans('C')
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that= this;
    if( util.checkOpenId()){
      that.QueryMyCoinPurse()
      that.QueryCoinPurseTrans(that.data.status)
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
    app.globalData.openid=wx.getStorageSync('openid');
    app.globalData.user_id=wx.getStorageSync('user_id');
		this.setData({
			isHidden:true,
			token:e.detail
		})
    this.QueryMyCoinPurse()
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