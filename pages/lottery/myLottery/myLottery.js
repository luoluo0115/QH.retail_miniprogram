//index.js
//获取应用实例
const app = getApp()
var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
import Toast from '../../../vant-weapp/dist/toast/toast';
//计数器
var interval = null;

//值越大旋转时间越长  即旋转速度
var intime = 50;

Page({
  data: {
    color: [1, 1, 1, 1, 1, 1, 1, 1],
    //9张奖品图片
    images: ['/images/item.png', '/images/item1.png', '/images/item.png', '/images/item1.png', '/images/item.png', '/images/item1.png', '/images/item.png', '/images/item1.png', '/images/item.png'],
    //btnconfirm: '/images/btn-click-now.png',
    clickLuck: 'clickLuck',
    luckPosition: 0,
    lotteryInfo: [],
    imgbg1:api.ImgUrl+'/FileDown/GetSharedImage?image_code=D049',
    imgbg2:api.ImgUrl+'/FileDown/GetSharedImage?image_code=D050',
    imgbg3:api.ImgUrl+'/FileDown/GetSharedImage?image_code=D053',
    imgbg4:api.ImgUrl+'/FileDown/GetSharedImage?image_code=D054',
    imgLottory:api.ImgUrl+'/FileDown/GetSharedImage?image_code=D050',
    btnconfirm:api.ImgUrl+'/FileDown/GetSharedImage?image_code=D051',
    lottery_ready_times:0,
    show:false,
    lotteryRecordInfo: [],
    animation: null,
    timer: null,
    duration: 0,
    textWidth: 0,
    wrapWidth: 0,
    isHidden: true, //是否隐藏登录弹窗
    lottery_info_id:'1',
    item_no:''
  },
  
  //跳转获奖记录
  goRecordList: function () {
    if( util.checkOpenId()){
      wx.navigateTo({
        url: '/pages/lottery/myLotteryRecord/myLotteryRecord'
      })
    }else{
      this.setData({
        isHidden:false
      })
    }
  },
  //获取抽奖信息
  QueryLotteryInfo: function () {
    console.log();
    let that = this;
    util.request(api.QueryLotteryInfoUrl,
      { openid: app.globalData.openid,user_id:app.globalData.user_id}
      , 'POST').then(function (res) {
        console.log(res, 'res.data.lotteryInfo')
        if (res.data.success == true) {
          that.setData({
            lotteryInfo: res.data.lotteryInfo,
            lottery_ready_times:res.data.lottery_ready_times,
            images0: res.data.lotteryInfo[0].item_image,
            images1: res.data.lotteryInfo[1].item_image,
            images2: res.data.lotteryInfo[2].item_image,
            images3: res.data.lotteryInfo[3].item_image,
            images4: res.data.lotteryInfo[4].item_image,
            images5: res.data.lotteryInfo[5].item_image,
            images6: res.data.lotteryInfo[6].item_image,
            images7: res.data.lotteryInfo[7].item_image,
          });
          
          console.log(res.data.lotteryInfo, 'res.data.lotteryInfo')
        } else {
          console.log(res.data.msg)
          that.setData({
            lotteryInfo: []
          });
        }
      })

  },
  //好运播报(中奖记录)
  QueryLotteryRecord: function () {
    console.log();
    let that = this;
    util.request(api.QueryLotteryRecordUrl,
      { openid: app.globalData.openid,user_id:app.globalData.user_id}
      , 'POST').then(function (res) {
        if (res.data.success == true) {
          that.setData({
            lotteryRecordInfo: res.data.lotteryRecordInfo,
          });
        } else {
          console.log(res.data.msg)
          that.setData({
            lotteryRecordInfo: []
          });
        }
      })

  },
  onLoad: function () {
    if(util.checkOpenId()){
      this.QueryLotteryInfo()
      this.QueryLotteryRecord();//好运播报
    }else{
      this.setData({
        isHidden:false
      })
    }
    
    //this.loadAnimation();
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
    app.globalData.token=e.detail;
    app.globalData.openid=wx.getStorageSync('openid');
    app.globalData.user_id=wx.getStorageSync('user_id');
    this.QueryLotteryInfo()
    this.QueryLotteryRecord();//好运播报
    this.onShow();
	},
  input: function (e) {
    var data = e.detail.value;
    console.log(data, 'data')
    this.setData({
      luckPosition: data
    })
  },


  //点击抽奖按钮
  clickLuck: function () {
    console.log(1234)
    let that = this;
    if(that.data.lottery_ready_times==0){
      Toast('暂无抽奖机会');
    }else{
        //设置按钮不可点击
        that.setData({
          btnconfirm: api.ImgUrl+'/FileDown/GetSharedImage?image_code=D052',
          clickLuck: '',
        })
        util.request(api.PostLotteryRunUrl,//抽奖过程
          { openid: app.globalData.openid,user_id:app.globalData.user_id, lottery_info_id: that.data.lottery_info_id}
          , 'POST').then(function (res) {
            if (res.data.success == true) {
              console.log(res,'抽奖按钮')
              that.setData({
                win_item_id: res.data.win_item_id,
                lottery_action_id:res.data.lottery_action_id,
                lottery_ready_times: that.data.lottery_ready_times-1,
                item_no:res.data.item_no
              });
              var lotteryInfo=that.data.lotteryInfo;
              var win_item_id =that.data.win_item_id
              for(let i in lotteryInfo){
                if(win_item_id==lotteryInfo[i].lottery_item_id){
                    console.log(i,'选中');
                    that.setData({
                      luckPosition:i,
                    })
                    console.log(that.data.luckPosition, 'luckPosition')
                    return;
                    
                }

              }
            } else {
              console.log(res.data.msg)
              that.setData({
                luckPosition: []
              });
            }
          })
          console.log(that.data.luckPosition, 'luckPosition1233444')
        //判断中奖位置格式
        if (that.data.luckPosition == null || isNaN(that.data.luckPosition) || that.data.luckPosition > 7) {
          wx.showModal({
            title: '提示',
            content: '请填写正确数值',
            showCancel: false,
          })
          return;
        }


        //清空计时器
        clearInterval(interval);
        var index = 0;
        console.log(that.data.color[0]);
        //循环设置每一项的透明度
        interval = setInterval(function () {
          if (index > 7) {
            index = 0;
            that.data.color[7] = 0.5
          } else if (index != 0) {
            that.data.color[index - 1] = 0.5
          }
          that.data.color[index] = 1
          that.setData({
            color: that.data.color,
          })
          index++;
        }, intime);

        //模拟网络请求时间  设为两秒
        var stoptime = 2000;
        setTimeout(function () {
          that.stop(that.data.luckPosition);
        }, stoptime)


    }
    //var e = this;
   
  },

  //也可以写成点击按钮停止抽奖
  // clickStop:function(){
  //   var stoptime = 2000;
  //   setTimeout(function () {
  //     e.stop(1);
  //   }, stoptime)
  // },

  stop: function (which) {
    var e = this;
    //清空计数器
    clearInterval(interval);
    //初始化当前位置
    var current = -1;
    var color = e.data.color;
    for (var i = 0; i < color.length; i++) {
      if (color[i] == 1) {
        current = i;
      }
    }
    console.log(current, 'current')
    //下标从1开始
    var index = current + 1;

    e.stopLuck(which, index, intime, 10);
  },


  /**
   * which:中奖位置
   * index:当前位置
   * time：时间标记
   * splittime：每次增加的时间 值越大减速越快
   */
  stopLuck: function (which, index, time, splittime) {
    var that = this;
    //值越大出现中奖结果后减速时间越长
    var color = that.data.color;
    setTimeout(function () {
      //重置前一个位置
      if (index > 7) {
        index = 0;
        color[7] = 0.5
      } else if (index != 0) {
        color[index - 1] = 0.5
      }
      //当前位置为选中状态
      color[index] = 1
      that.setData({
        color: color,
      })
      //如果旋转时间过短或者当前位置不等于中奖位置则递归执行
      //直到旋转至中奖位置
      if (time < 400 || index != which) {
        //越来越慢
        splittime++;
        time += splittime;
        //当前位置+1
        index++;
        that.stopLuck(which, index, time, splittime);
      } else {
        //1秒后显示弹窗
        setTimeout(function () {
          that.setData({
            show:true,
            imgUrls:that.data.lotteryInfo[index].celebrate_image,
            lottery_info_id:that.data.lotteryInfo[index].lottery_info_id,
            win_item_id:that.data.lotteryInfo[index].lottery_item_id
          })
          
        }, 1000);
      }
    }, time);
    console.log(time);
  },
  //进入页面时缓慢切换
  loadAnimation: function () {
    var e = this;
    var index = 0;
    // if (interval == null){
    interval = setInterval(function () {
      if (index > 7) {
        index = 0;
        e.data.color[7] = 0.5
      } else if (index != 0) {
        e.data.color[index - 1] = 0.5
      }
      e.data.color[index] = 1
      e.setData({
        color: e.data.color,
      })
      index++;
    }, 1000);
    // }  
  },
  //关闭弹窗
  onLottoryClose: function (){
    let that= this;
    that.setData({ show: false });
     //设置按钮可以点击
     that.setData({
      btnconfirm:api.ImgUrl+'/FileDown/GetSharedImage?image_code=D051',
      clickLuck: 'clickLuck',
      color: [1, 1, 1, 1, 1, 1, 1, 1],
    }) 
  },
  onLottoryGo: function (){
    let that= this;
    that.setData({ show: false });
    util.request(api.PostLotteryWinUrl,
      { openid: app.globalData.openid,user_id:app.globalData.user_id,lottery_action_id:that.data.lottery_action_id,win_item_id:that.data.win_item_id}
      , 'POST').then(function (res) {
        console.log(res,'领取按钮')
        if (res.data.success == true) {
          Toast.success(res.data.msg);
          if(that.data.item_no=='D08'){
            that.setData({
              lottery_ready_times: that.data.lottery_ready_times+1,
            })
            
          }  
          
          //that.loadAnimation();
        } else {
          Toast.fail(res.data.msg);
          //that.loadAnimation(); 
        }
        that.QueryLotteryRecord();//好运播报
        //设置按钮可以点击
        that.setData({
          btnconfirm:api.ImgUrl+'/FileDown/GetSharedImage?image_code=D051',
          clickLuck: 'clickLuck',
          color: [1, 1, 1, 1, 1, 1, 1, 1],
        }) 
        
      })
  }
})
