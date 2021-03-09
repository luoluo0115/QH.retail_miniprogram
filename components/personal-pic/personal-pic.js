// components/generate-pic/generate-pic.js
// import wxApi from '../../service/wxApi'
const app = getApp()
var api = require('../../config/api.js');
var util = require('../../utils/util.js');
import { base64src } from '../../utils/base64src.js';
import Toast from '../../vant-weapp/dist/toast/toast';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    logo:{
      type: String,
    }, 
    name:{
      type: String
    }, 
    phone:{
      type: String
    }, 
    address:{
      type: String
    }, 
    title:{
      type: String
    },
     email:{
      type: String
     },
     user_id:{
      type: String
     },
     openid:{
      type: String
     }
  },

  /**
   * 组件的初始数据 
   */
  data: {
    bgImgPath: '/images/components/share-bg.png',
    dialogBgPath: '/images/components/share-dialog.png',
    bannerPath:'/images/mini/banner.jpg',
    pixelRatio: 2,
    programCode: '',
    userHeadUrl: '',
    count: 0,
    spinning: false,
    loadingFlag: false, // 是否重新加载图片
    openid:wx.getStorageSync('openid'),
    user_id:wx.getStorageSync('user_id'),
    
  },
  // 在组件完全初始化完毕、进入页面节点树后

  attached () {
    console.log(this.data.scene)
    wx.nextTick(() => {
        this.getFile() // 获取小程序码和头像的临时文件
    })
    
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
   
    getFile () {
      // 请求接口 获取头像和小程序码的临时文件
      if (!this.data.loadingFlag) {
        this.initData()
       
      }
    },
    writeCanvas () {
      
      let that = this

      const ctx = wx.createCanvasContext('myCanvas', that)
      let logo = that.data.logo
      let name = that.data.name
      let phone= that.data.phone
      let address= that.data.address
      let title= that.data.title
      let email= that.data.email
      let canvasW = that.data.canvasW
      let canvasH = that.data.canvasH
      let bgImgPath = that.data.bgImgPath
      let bannerPath = that.data.bannerPath
      let dialogBgPath = that.data.dialogBgPath // 对话框背景
      let nickName = that.data.nickName.length > 6 ? that.data.nickName.substr(0, 6) + '...' : that.data.nickName // 昵称
      //let userHeadUrl = '' // 头像
      //let programCode = '' // 小程序码
        //let userHeadUrl = '/images/mini/132.jpeg' // 头像
        let userHeadUrl = that.data.userHeadUrl// 头像
     
       // let programCode = '/images/mini/wxacord.jpg' // 小程序码
      // let userHeadUrl = that.data.userHeadUrl // 头像
       let programCode = that.data.programCode // 小程序码

      
        // 画中间的白色区域
      ctx.setFillStyle('#333')
      let rect = {
        x: 0,
        y: 0,
        width: canvasW,
        height: canvasH
      }
      that.drawRoundedRect(rect, 3, ctx)
      // 画大背景 单位是 px 不是 rpx
      //ctx.drawImage(bgImgPath, 0, 0, canvasW, canvasH)
       // 画banner图 单位是 px 不是 rpx
       //ctx.drawImage(bannerPath, 0, 0, canvasW, 145)

     
      // 保存上下文
      ctx.save()

      //画圆   前两个参数确定了圆心 （x,y） 坐标  第三个参数是圆的半径  四参数是绘图方向  默认是false，即顺时针
      ctx.beginPath()
      // 先画个大圆，为了能有圆环
      ctx.arc(that.computedPercent(24), canvasH-40 , that.computedPercent(20), 0, Math.PI * 2, false)
      // ctx.arc(that.computedPercent(147), that.computedPercent(93), that.computedPercent(37), 0, Math.PI * 2, false)
      ctx.setFillStyle('#eee')
      ctx.fill()
      ctx.save()
      // 画小圆
      ctx.beginPath()
      ctx.arc(that.computedPercent(24),canvasH-40 , that.computedPercent(18), 0, Math.PI * 2, false)
      //ctx.arc(that.computedPercent(147), that.computedPercent(93), that.computedPercent(35), 0, Math.PI * 2, false)
      ctx.setFillStyle('#fff')
      ctx.fill()
      // 画好了圆 剪切  原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，
      // 则所有之后的绘图都会被限制在被剪切的区域内 这也是我们要save上下文的原因
      ctx.clip()
      ctx.drawImage(
        userHeadUrl,
        that.computedPercent(6),
         canvasH-58,
        that.computedPercent(38),
        that.computedPercent(38)
      )
      // 恢复画布
      ctx.restore()

      // 画对话框
      // ctx.drawImage(dialogBgPath, that.computedPercent(175), that.computedPercent(37), that.computedPercent(95), that.computedPercent(33))

      // 写对话框里的文字
      //换行
      
      //console.log(article,'articleds积分换花费');
     

      // 写昵称 文本居中的起点是指居中的那个点
      ctx.setTextAlign('center')
      ctx.setFontSize(that.computedPercent(12))
      ctx.setFillStyle('#666')
      ctx.fillText(name   , 74, canvasH-44);

      // 画小程序码
      ctx.drawImage(programCode, canvasW-72 , canvasH-72 , that.computedPercent(64), that.computedPercent(64));

      // 说明文字
     
      ctx.setTextAlign('left')
      ctx.setFontSize(that.computedPercent(12))
      ctx.setFillStyle('#666')
      ctx.fillText(name, that.computedPercent(14), that.computedPercent(57))
      ctx.fillText(phone, that.computedPercent(14), that.computedPercent(87))
      ctx.fillText(title, that.computedPercent(14), that.computedPercent(107))
      ctx.fillText(address, that.computedPercent(14), that.computedPercent(127))
      ctx.fillText(email, that.computedPercent(14), that.computedPercent(147))
      ctx.fillText('长按图片识别二维码', 56, canvasH-26)
      

      // slogan
      // ctx.setTextAlign('center')
      // ctx.setFontSize(that.computedPercent(14))
      // ctx.setFillStyle('#333')
      // ctx.fillText('感谢有你-让分享创造价值', that.computedPercent(144), that.computedPercent(370))

      ctx.draw(true, () => {
        that.setData({
          spinning: false
        })
      })
    },
    // 初始化数据
    initData () {
      let that = this
      that.setData({
        spinning: true,
        nickName: '',
        
       
        // nickName: app.globalData.userInfo.nickName
      })
     
      // 获取设备宽度，计算canvas宽高
      wx.getSystemInfo({
        success: function(res) {
          let canvasW = Math.round(res.screenWidth * 0.768)
          let canvasH = canvasW * 1.361
          that.setData({
            pixelRatio: res.pixelRatio, // 图片像素比
            canvasW,
            canvasH
          })
          //that.writeCanvas() // 暂时在此执行
         
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
              //获取小程序
              let postData = {
                openid:app.globalData.openid,
                user_id:app.globalData.user_id,
                page: 'pages/index/index', //默认跳转到主页:pages/index/index，可指定
                width: 280,
                scene:"uid="+ app.globalData.user_id +",gid=0,cid=4,sid=2",
                is_hyaline:"1"
              };
              console.log(postData,'postData');
              util.request(api.CreateWxCodeUrl,//查询我的名片
                postData
                ,'POST').then(function(res){
                  console.log(res,'res------');
                  if(res.data.success==true){
                      that.setData({
                        programCode:res.data.fileUrl
                      });
                      wx.getImageInfo({
                        src: that.data.programCode,
                        success: function (res) {
                          that.setData({
                            programCode: res.path//将下载下来的地址给data中的变量变量
                          });
                          that.writeCanvas() // 暂时在此执行
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
            console.log(res)
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
      wx.canvasToTempFilePath({
        x: 0, // 起点横坐标
        y: 0, // 起点纵坐标
        width: that.data.canvasW, // canvas 当前的宽
        height: that.data.canvasH, // canvas 当前的高
        destWidth: that.data.canvasW * that.data.pixelRatio, // canvas 当前的宽 * 设备像素比
        destHeight: that.data.canvasH * that.data.pixelRatio, // canvas 当前的高 * 设备像素比
        canvasId: 'myCanvas',
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
    }
  }
})
