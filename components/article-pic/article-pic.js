// components/generate-pic/generate-pic.js
// import wxApi from '../../service/wxApi'
//文章保存图片
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
    scene: {
      type: String,
      value: ''
    },
    summary:{
      type: String
    },
    article:{
      type: String
    },
    articleimage:{
      type: String
    },
    spread_id:{
      type: Number,
    },
    pictype:{
      type: String
    },
    read_times:{
      type: String
    },
  },

  /**
   * 组件的初始数据 
   */
  data: {
    bgImgPath: api.ImgUrl+'/FileDown/GetSharedImage?image_code=D034',
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
    phrase_content:''
    
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
      let summary = that.data.summary
      let article = that.data.article
      let articleimage= that.data.articleimage
      let canvasW = that.data.canvasW
      let canvasH = that.data.canvasH
      let bgImgPath = that.data.bgImgPath
      let bannerPath = that.data.bannerPath
      let dialogBgPath = that.data.dialogBgPath // 对话框背景
      let nickName = that.data.nickName.length > 6 ? that.data.nickName.substr(0, 6) + '...' : that.data.nickName // 昵称
      let userHeadUrl = that.data.userHeadUrl// 头像
      let programCode = that.data.programCode // 小程序码
      let phrase_content=that.data.phrase_content
      let read_times=that.data.read_times
        // 画背景颜色的蓝色区域
        ctx.setFillStyle('#687dfd')
      // 画大背景 单位是 px 不是 rpx
      ctx.drawImage(bgImgPath, 0, 0, canvasW, canvasH)
       // 画中间的白色区域
      ctx.setFillStyle('#fff')
      let rect = {
        x: that.computedPercent(15),
        y: that.computedPercent(65),
        width: canvasW-that.computedPercent(30),
        height: canvasH-that.computedPercent(80)
      }
      that.drawRoundedRect(rect, 3, ctx)
      
      //画头像
      //画圆   前两个参数确定了圆心 （x,y） 坐标  第三个参数是圆的半径  四参数是绘图方向  默认是false，即顺时针
      ctx.beginPath()
      // 画小圆,为了能有圆环
      // ctx.beginPath()
      ctx.arc(that.computedPercent(43), that.computedPercent(149), that.computedPercent(12), 0, Math.PI * 2, false)
      ctx.setFillStyle('#fff')
      ctx.fill()
      ctx.save()
      // // 画好了圆 剪切  原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，
      // // 则所有之后的绘图都会被限制在被剪切的区域内 这也是我们要save上下文的原因
      ctx.clip()
      ctx.drawImage(
        userHeadUrl,
        that.computedPercent(31),
        that.computedPercent(136),
        that.computedPercent(26),
        that.computedPercent(26)
      )
       // 恢复画布
      ctx.restore()
      // 写昵称 文本居中的起点是指居中的那个点
      ctx.setTextAlign('left')
      ctx.setFontSize(that.computedPercent(12))
      ctx.setFillStyle('#666')
      var NickName=app.globalData.userInfo.nickName 
      var chrNick = NickName.split("");//这个方法是将一个字符串分割成字符串数组
      var tempNick = "";
      var rowNick = [];
      for (var a = 0; a < chrNick.length; a++) {
        if (ctx.measureText(tempNick).width < that.computedPercent(20)) {
          tempNick += chrNick[a];
        }
        else {
          tempNick= tempNick+ "..."//这里只显示两行，超出的用...表示
          break;
        }
      }
      ctx.fillText(tempNick+'正在阅读' , that.computedPercent(63), that.computedPercent(154));
     
      //ctx.fillText(nickName + app.globalData.userInfo.nickName, that.computedPercent(75), that.computedPercent(158));
       
      //画浏览量
      ctx.setTextAlign('right')
      ctx.setFontSize(that.computedPercent(10))
      ctx.setFillStyle('#999')
      ctx.fillText(read_times+'浏览量', that.data.canvasW-that.computedPercent(30), that.computedPercent(154));
      // 画banner图 单位是 px 不是 rpx
      ctx.drawImage(bannerPath,that.computedPercent(30),that.computedPercent(174), canvasW-that.computedPercent(60), that.computedPercent(125))
      // 保存上下文
      ctx.save()
      
      // 画摘要
      ctx.setFontSize(that.computedPercent(14))
      //画浏览量
      ctx.setTextAlign('left')
      var chrsum = summary.split("");//这个方法是将一个字符串分割成字符串数组
      var tempsum = "";
      var rowsum = [];
      for (var a = 0; a < chrsum.length; a++) {
        if (ctx.measureText(tempsum).width < canvasW-that.computedPercent(65)) {
          tempsum += chrsum[a];
        }
        else {
          a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
          rowsum.push(tempsum);
          tempsum = "";
        }
      }
      rowsum.push(tempsum);
      if (rowsum.length > 4) {
        var rowCutsum = rowsum.slice(0, 4);
        var rowPartsum  = rowCutsum[3];
        var testsum = "";
        var emptysum = [];
        for (var a = 0; a < rowPartsum .length; a++) {
          if (ctx.measureText(testsum).width < canvasW-that.computedPercent(70)) {
            testsum += rowPartsum [a];
          }
          else {
            break;
          }
        }
        emptysum.push(testsum);
        console.log(emptysum,'emptysum')
        var groupsum = emptysum[0] + "..."//这里只显示两行，超出的用...表示
        console.log(groupsum,'groupsum')
        rowCutsum.splice(3, 3, groupsum);
        console.log(rowCutsum,'rowCutsum')
        rowsum = rowCutsum;
      }
      ctx.setFontSize(that.computedPercent(14))
      for (var b = 0; b < rowsum.length; b++) {
        ctx.setFontSize(that.computedPercent(14))
        ctx.setFillStyle('#666')
        console.log(rowsum[b], 'rowsum[b]')
        ctx.fillText(rowsum[b], that.computedPercent(30), that.computedPercent(329) + b * that.computedPercent(22), that.data.canvasW - that.computedPercent(60))
      }
      
      // 保存上下文
      ctx.save()

      //画装饰小圆   前两个参数确定了圆心 （x,y） 坐标  第三个参数是圆的半径  四参数是绘图方向  默认是false，即顺时针
      ctx.beginPath()
      // 装饰小圆
      ctx.arc(that.computedPercent(14), that.computedPercent(417), that.computedPercent(8), 0, Math.PI * 2, false)
      ctx.arc(that.data.canvasW-that.computedPercent(14), that.computedPercent(417), that.computedPercent(8), 0, Math.PI * 2, false)
      ctx.setFillStyle('#687dfd')
      ctx.fill()
      ctx.save()
      // 画虚线
      ctx.beginPath()
      ctx.setStrokeStyle("#a0a0a0")//设置线条的颜色
      ctx.setLineDash([2, 4], 2);
      ctx.moveTo(that.computedPercent(30), that.computedPercent(417))
      ctx.lineTo(that.data.canvasW-that.computedPercent(30), that.computedPercent(417))
      ctx.stroke()
       // 恢复画布
       ctx.restore()
      // 画小程序码
      ctx.drawImage(programCode, that.computedPercent(30), that.computedPercent(428), that.computedPercent(62), that.computedPercent(62));

      //底部说明文字
      ctx.setTextAlign('left')
      ctx.setFontSize(that.computedPercent(12))
      ctx.setFillStyle('#666')
      ctx.fillText('长按二维码', that.computedPercent(96), that.computedPercent(452))
      ctx.fillText('进入好享得利阅读全文', that.computedPercent(96), that.computedPercent(475))
      console.log(phrase_content, 'heightrowsum[b]')
      // // 写主标题文字
      ctx.setTextAlign('left')
      ctx.setFontSize(that.computedPercent(17))
      ctx.setFillStyle('#333')
      var chr = article.split("");//这个方法是将一个字符串分割成字符串数组
      var temp = "";
      var row = [];
      for (var a = 0; a < chr.length; a++) {
        if (ctx.measureText(temp).width < canvasW-that.computedPercent(60)) {
          temp += chr[a];
        }
        else {
          a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
          row.push(temp);
          temp = "";
        }
      }
      ctx.setFontSize(that.computedPercent(17))
      row.push(temp);
      if (row.length > 2) {
        var rowCut = row.slice(0, 2);
        var rowPart = rowCut[1];
        var test = "";
        var empty = [];
        for (var a = 0; a < rowPart.length; a++) {
          if (ctx.measureText(test).width < canvasW-that.computedPercent(72)) {
            test += rowPart[a];
          }
          else {
            break;
          }
        }
        empty.push(test);
        var group = empty[0] + "..."//这里只显示两行，超出的用...表示
        rowCut.splice(1, 1, group);
        row = rowCut;
      }

      for (var b = 0; b < row.length; b++) {
        ctx.font = 'normal bold 16px sans-serif';
        ctx.setFontSize(that.computedPercent(17))
        ctx.fillText(row[b],that.computedPercent(30), that.computedPercent(95) + b * that.computedPercent(25), canvasW - that.computedPercent(60))
      }
     
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
        
      })
      //获取推广短语
      util.request(api.QueryMySpreadPhraseUrl,
        { openid:app.globalData.openid,user_id:app.globalData.user_id}
        ,'POST').then(function(res){
          //var customerList=JSON.stringify(res.data.customerList);
          if(res.data.success==true){
            that.setData({
              phrase_content:res.data.mySpreadPhraseList[0].phrase_content,
            });
            // app.globalData.phrase_content=res.data.mySpreadPhraseList[0].phrase_content
            
          }else{
            that.setData({
              phrase_content:[]
            });
          }
      })
     
      // 获取设备宽度，计算canvas宽高
      wx.getSystemInfo({
        success: function(res) {
          let canvasW = Math.round(res.screenWidth * 0.668)
          let canvasH = canvasW * 1.7790132
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
             // that.writeCanvas() // 暂时在此执行
              console.log(that.properties.articleimage, 'tupian')
              wx.getImageInfo({
                src: that.properties.articleimage,
                success: function (res) {
                  that.setData({
                    bannerPath: res.path//将下载下来的地址给data中的变量变量
                  });
                  //获取小程序
                 // console.log(that.data.pictype,'that.data.pictype');
                 
                  let postData = {
                    openid:app.globalData.openid,
                    user_id:app.globalData.user_id,
                    page: 'pages/extend/articleDetail/articleDetail', //默认跳转到主页:pages/index/index，可指定
                    width: 80,
                    scene:"uid="+ app.globalData.user_id +",sid=2,cid=3,gid="+that.data.spread_id,
                    is_hyaline:"1",
                  };
                  console.log(postData,'postData');
                 // that.writeCanvas() // 暂时在此执行
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
                              wx.getImageInfo({
                                src: that.data.bgImgPath,
                                success: function (res) {
                                  that.setData({
                                    bgImgPath: res.path//将下载下来的地址给data中的变量变量
                                  });
                                  that.writeCanvas() // 暂时在此执行
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
              //子组件传值给父组件
              var myEventDetail = {
                showbill: false 
              } // detail对象，提供给事件监听函数
              that.triggerEvent('compontpass', myEventDetail) //myevent自定义名称事件，父组件中使用
               //分享成就
               util.request(api.AddAchivementActionUrl,
                { openid:app.globalData.openid,achivement_category:"文章",user_id:app.globalData.user_id,spread_id:that.data.spread_id,spread_ass_id:"0"}
                ,'POST').then(function(res){
                 console.log(res,'fenxiang ')
                  //var customerList=JSON.stringify(res.data.customerList);
                  if(res.data.success==true){
                   console.log(res.data.msg)
                  }else{
                    console.log(res.data.msg)
                    
                  }
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
