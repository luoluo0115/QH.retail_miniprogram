// pages/shareSwiper/shareSwiper.js
const app = getApp()
var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
import { base64src } from '../../../utils/base64src.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    circular: false,
    interval: 2000,
    duration: 500,
    pixelRatio: 2,
    previousMargin: 0,
    nextMargin: 0,
    user_id:wx.getStorageSync('user_id'),
    programCodeSrc:'',
    imgUrls: [
      api.ImgUrl+'/FileDown/GetSharedImage?image_code=D002',
      api.ImgUrl+'/FileDown/GetSharedImage?image_code=D001'
    ],
    current:0,
    coinpurse:0,
    daytime:'',
    housetime:'',
    isHidden: true,
  }, 
  swiperChange(e) {

    var that = this;
    var i = e.detail.current;
    console.log(e.detail.current,'e.detail.current');
    that.setData({
      current:i
    })

   },
   writeCanvas () {
    //console.log(app.globalData.userInfo.avatarUrl,'头想');
    let that = this
    const ctx = wx.createCanvasContext('mycanvas_188', that)
    const ctx_money = wx.createCanvasContext('mycanvas_money', that)
    
    let canvasW = that.data.canvasW
    let canvasH = that.data.canvasH
    let bannerPath = that.data.bgImgPath
    let bannerPathMoney = that.data.bgImgPathMoney
    let dialogBgPath = that.data.dialogBgPath // 对话框背景
    let nickName = that.data.nickName.length > 6 ? that.data.nickName.substr(0, 6) + '...' : that.data.nickName // 昵称
    let userHeadUrl = that.data.userHeadUrl// 头像
     let programCode = that.data.programCode // 小程序码
   
    // 画大背景 单位是 px 不是 rpx
    ctx.drawImage(bannerPath, 0, 0, canvasW, canvasH)
   
    // 画中间的白色区域
    ctx.setFillStyle('#fff')
    let rect = {
      x: that.computedPercent(0),
      y: canvasH,
      width: canvasW,
      height: that.computedPercent(80)
    }
    that.drawRoundedRect(rect, 3, ctx)
    // 保存上下文
    ctx.save()

    //画圆   前两个参数确定了圆心 （x,y） 坐标  第三个参数是圆的半径  四参数是绘图方向  默认是false，即顺时针
    ctx.beginPath()
    // 先画个大圆，为了能有圆环
    ctx.arc(that.computedPercent(144), that.computedPercent(41) , that.computedPercent(24), 0, Math.PI * 2, false)
    //ctx.arc(that.computedPercent(24), that.computedPercent(25), that.computedPercent(20), 0, Math.PI * 2, false)
    ctx.setFillStyle('#eee')
    ctx.fill()
    ctx.save()
    // 画小圆
    ctx.beginPath()
    ctx.arc(that.computedPercent(144),that.computedPercent(41) , that.computedPercent(22), 0, Math.PI * 2, false)

    //ctx.arc(that.computedPercent(24), that.computedPercent(25), that.computedPercent(18), 0, Math.PI * 2, false)
    ctx.setFillStyle('#fff')
    ctx.fill()
    // 画好了圆 剪切  原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，
    // 则所有之后的绘图都会被限制在被剪切的区域内 这也是我们要save上下文的原因
    ctx.clip()
    ctx.drawImage(
      userHeadUrl,
      that.computedPercent(122),
      that.computedPercent(18),
      that.computedPercent(46),
      that.computedPercent(46)
    )
    // 恢复画布
    ctx.restore()

    // 画对话框

    // 写昵称 文本居中的起点是指居中的那个点
    ctx.setTextAlign('center')
    ctx.setFontSize(that.computedPercent(12))
    ctx.setFillStyle('#BE1028')
    ctx.setTextAlign('center');
    ctx.setFontSize(14);
    ctx.fillText(nickName  ,(canvasW )* 0.5, that.computedPercent(78));

   
    
    ctx.drawImage(programCode, 42 , canvasH-112 , that.computedPercent(64), that.computedPercent(64));
    //Money 海报

    //海报背景
    ctx_money.drawImage(bannerPathMoney, 0, 0, canvasW, canvasH)
    // 说明文字
    ctx_money.setTextAlign('center')
    ctx_money.setFontSize(that.computedPercent(20))
    ctx_money.setFillStyle('#fff')
    ctx_money.fillText('截止'+ that.data.daytime,(canvasW )* 0.5,  that.computedPercent(45))
    ctx_money.setFontSize(that.computedPercent(14))
    ctx_money.fillText(that.data.housetime,(canvasW )* 0.5,  that.computedPercent(71))
    ctx_money.setFontSize(that.computedPercent(18))
    ctx_money.fillText('我已在“好享得利”赚到了',(canvasW )* 0.5,  that.computedPercent(97))
    ctx_money.setFontSize(that.computedPercent(24))
    ctx_money.setFillStyle('#FEF242')
    ctx_money.fillText(util.numberToFixed(that.data.coinpurse)+'元',(canvasW )* 0.5,  that.computedPercent(128))
    ctx_money.setFillStyle('#FEF242')
    ctx_money.save()
    ctx_money.beginPath()
    ctx_money.arc(canvasW * 0.5,canvasH-that.computedPercent(62) , that.computedPercent(34), 0, Math.PI * 2, false)
    ctx_money.setFillStyle('#fff')
    ctx_money.fill()
    ctx_money.save()
    
    // 画Money小程序码
    ctx_money.drawImage(programCode, (canvasW -that.computedPercent(64))* 0.5 , canvasH-that.computedPercent(94) , that.computedPercent(64), that.computedPercent(64));
    ctx_money.setFontSize(that.computedPercent(12))
    ctx_money.fillText('· 扫码领钱 ·',(canvasW )* 0.5, canvasH-that.computedPercent(12))

    ctx.draw(true, () => {
      that.setData({
        spinning: false
      })
    })
    ctx_money.draw(true, () => {
      that.setData({
        spinning: false
      })
    })
    
  },
 getUserinfo:function(){
   let that= this;
    // 获取设备宽度，计算canvas宽高
    wx.getSystemInfo({
      success: function(res) {
        let canvasW = Math.round(res.screenWidth * 0.848)
        let canvasH = canvasW * 1.577
        that.setData({
          pixelRatio: res.pixelRatio, // 图片像素比
          canvasW,
          canvasH
        })
        
      }
    })
    wx.getUserInfo({
      success: res => {
        wx.getImageInfo({
          src: app.globalData.userInfo.avatarUrl,
          success: function (res) {

            that.setData({
              userHeadUrl: res.path//将下载下来的地址给data中的变量变量
            });
            let postData = {
              openid:app.globalData.openid,
              user_id:app.globalData.user_id,
              page: 'pages/index/index', //默认跳转到主页:pages/index/index，可指定
              width: 280,
              scene:"uid="+ app.globalData.user_id +",gid=0,cid=6,sid=2",
              is_hyaline:"1"
            };
            util.request(api.CreateWxCodeUrl,//查询我的名片
              postData
              ,'POST').then(function(res){
                console.log(res,'res------');
                if(res.data.success==true){
                    that.setData({
                      programCode1:res.data.fileUrl,
                      programCodeSrc:res.data.fileUrl
                    });
                    wx.getImageInfo({
                      src: that.data.programCode1,
                      success: function (res) {
                        that.setData({
                          programCode: res.path//将下载下来的地址给data中的变量变量
                        });
                        wx.getImageInfo({
                          src: that.data.imgUrls[0],
                          success: function (res) {
                            that.setData({
                              bgImgPath: res.path//将下载下来的地址给data中的变量变量
                            });
                            wx.getImageInfo({
                              src: that.data.imgUrls[1],
                              success: function (res) {
                                that.setData({
                                  bgImgPathMoney: res.path//将下载下来的地址给data中的变量变量
                                });
                                console.log(res.path,'res.path')
                                that.writeCanvas() // 暂时在此执行
                              
                              }
                            })
                          }
                        })
                      
                      }
                    })
                   
                   
                }else{
                  console.log(res.data.msg)
                }
            })
            
          

          }
        })
      }
    })
  },
  
  // 初始化数据
  initData (){
    let that = this
    that.setData({
      spinning: true,
      nickName: '',
      
    })
     // 获取设备宽度，计算canvas宽高
    //  wx.getSystemInfo({
    //   success: function(res) {
    //     let canvasW = Math.round(res.screenWidth * 0.768)
    //     let canvasH = canvasW * 1.521
    //     that.setData({
    //       pixelRatio: res.pixelRatio, // 图片像素比
    //       canvasW,
    //       canvasH
    //     })
        
    //   }
    //})
  },
   // 绘制圆角矩形
   drawRoundedRect (rect, r, ctx) {
    let that = this
    let ptA = that.point(rect.x + r, rect.y)
    let ptB = that.point(rect.x + rect.width, rect.y)
    let ptC = that.point(rect.x + rect.width, rect.y + rect.height)
    let ptD = that.point(rect.x, rect.y + rect.height)
    let ptE = that.point(rect.x, rect.y)
    
    ctx.beginPath()
    
    ctx.moveTo(ptA.x, ptA.y)
    ctx.arcTo(ptB.x, ptB.y, ptC.x, ptC.y, r)
    ctx.arcTo(ptC.x, ptC.y, ptD.x, ptD.y, r)
    ctx.arcTo(ptD.x, ptD.y, ptE.x, ptE.y, r)
    ctx.arcTo(ptE.x, ptE.y, ptA.x, ptA.y, r)
  
    ctx.strokeStyle = "#fff"
    ctx.stroke()
    ctx.setFillStyle('#fff')
    ctx.fill()
  },
  point (x, y) {
    return {x, y}
  },
  // 下载文件
  downFile (url) {
    let timeStamp = new Date().getTime()
    return new Promise((resolve, reject) => {
      wx.downloadFile({
        url: url + '?t=' + timeStamp,
        success(res) {
          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          if (res.statusCode === 200) {
            resolve(res)
          }
        },
        fail(res) {
          reject(res)
        }
      })
    })
  },
  // 保存图片
  save () {
    let that = this
    let canvasId=''
    if(that.data.current=='0'){
      canvasId='mycanvas_188'
    }else if(that.data.current=='1'){
      canvasId='mycanvas_money'
    }
    wx.canvasToTempFilePath({
      x: 0, // 起点横坐标
      y: 0, // 起点纵坐标
      width: that.data.canvasW, // canvas 当前的宽
      height: that.data.canvasH, // canvas 当前的高
      destWidth: that.data.canvasW * that.data.pixelRatio, // canvas 当前的宽 * 设备像素比
      destHeight: that.data.canvasH * that.data.pixelRatio, // canvas 当前的高 * 设备像素比
      canvasId: canvasId,
      success: function (res) {
        //调取小程序当中获取图片
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showToast({
              title: '图片保存成功！',
              icon: 'none'
            })
            
          },
          fail: function (res) {
            console.log(res)
            if (res.errMsg === "saveImageToPhotosAlbum:fail auth deny" || res.errMsg === "saveImageToPhotosAlbum:fail:auth denied") {
              console.log("打开设置窗口");
              that.doAuth()
            }
          }
        })
      },
      fail: function (res) {
        console.log(res)
      }
    }, this)
  },
  // 获取授权
  doAuth () {
    wx.showModal({
      title: '获取授权',
      content: '您是否同意重新授权保存图片',
      cancelText: '不同意',
      confirmText: '好',
      confirmColor: '#21c0ae',
      success: function(res) {
        if (res.confirm) { // 点击确认
          wx.openSetting({
            success(settingdata) {
              console.log(settingdata)
              if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                console.log("获取权限成功，再次点击图片保存到相册")
              } else {
                console.log("获取权限失败")
              }
            },
            fail: function (res) {
              console.log(res)
            }
          })
        }
      }
    })
  },
  /**
   * 计算比例
   * @param {String} value 像素（二倍图量出来的要除2）
   */
  computedPercent (value) {
    let currentWidth = this.data.canvasW
    let oldWidth = 288
    return Math.floor(value * currentWidth / oldWidth)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var myDate = new Date();
    let daytime=(myDate.getMonth() + 1)+'月'+myDate.getDate()+'日';
    let housetime=myDate.getHours()+'时'+myDate.getMinutes()+'分'+myDate.getSeconds()+'秒'

    this.setData({
      nickName:app.globalData.userInfo.nickName,
      avatarUrl:app.globalData.userInfo.avatarUrl,
      coinpurse:options.coinpurse,
      daytime:daytime,
      housetime:housetime
    })
    //分享父user_id
    var parent_user_id = 0;
    //分享类别
    var spread_category = '';
    var spread_source = '';
    var spread_id = 0;
    var user_id = options.user_id;
    var category = options.spread_category;
    var source = options.spread_source;
    var id = options.spread_id;
    console.log("options=>" + JSON.stringify(options));
    var scene = decodeURIComponent(options.scene);
    if (user_id != undefined && category != undefined && source != undefined) {
    
      parent_user_id = user_id;
      spread_category = category;
      spread_source = source;
      spread_id = id;
    } else if (options.scene != undefined) {
      console.log("scene string=>" + scene);
      var scene_obj = util.scene_decode(scene);
      console.log("scene obj=>" + JSON.stringify(scene_obj));
      if (scene_obj.uid && scene_obj.gid && scene_obj.cid && scene_obj.sid) {
        parent_user_id = scene_obj.uid;
        spread_category = scene_obj.cid;
        spread_source = scene_obj.sid;
        spread_id = scene_obj.gid;
      } else {
        parent_user_id = scene;
      }
    }
    wx.setStorageSync('parent_user_id', parent_user_id);
    wx.setStorageSync('spread_category', spread_category);
    wx.setStorageSync('spread_source', spread_source);
    wx.setStorageSync('spread_id', spread_id);
    console.log(parent_user_id, 'parent_user_id')
    console.log(spread_category, 'spread_category')
    console.log(spread_source, 'spread_source')
    console.log(spread_id, 'spread_id')
     
    this.getUserinfo()
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let user_id=app.globalData.user_id;
   
    return {
      title: '分享',
      path: '/pages/index/index?user_id=' + user_id+ '&spread_category=6&spread_source=1&spread_id=0'
    }
  }
})