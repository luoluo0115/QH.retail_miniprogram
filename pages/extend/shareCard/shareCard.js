// pages/extend/shareCard/shareCard.js
const app = getApp()
var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
import { base64src } from '../../../utils/base64src.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pixelRatio: 2,
    previousMargin: 0,
    nextMargin: 0,
    user_id:wx.getStorageSync('user_id'),
    programCodeSrc:'',
    nameCardInfo:'',
    mobile_phone:'',
    address:'',
    title:'',
    wechat:'',
    email:'',
    honor_logo:'',
    coinpurse:'',
    totalcust:'',
    imgUrls:api.ImgUrl+'/FileDown/GetSharedImage?image_code=D003',
    phrase_content:[],
    iconTag:'../../../images/mini/icon-tag.png',
    iconPhone:'../../../images/mini/icon-phone.png',
    iconWechart:'../../../images/mini/icon-wechart.png',
    iconLocal:'../../../images/mini/icon-local.png',
    iconEmail:'../../../images/mini/icon-email.png',
    phone:'',
    title:'',
    wechart:'',
    email:'',
    adress:'',
    acccommissionamt:'',
    isHidden: true,
  },
  //名片设置显示
  QueryNameCardInfo: function(e) {
    
    let that = this;
    util.request(api.QueryNameCardInfoUrl,//名片设置显示
      { openid:app.globalData.openid,user_id:app.globalData.user_id}
      ,'POST').then(function(res){
        console.log(res,'res')
        if(res.data.success==true){
          that.setData({
            nameCardInfo:res.data.nameCardInfo
          })
          let nameCardInfo=res.data.nameCardInfo;
          for(var i =0;i<nameCardInfo.length;i++){
            if(nameCardInfo[i].displayName=="手机"){
              that.setData({
                phone:nameCardInfo[i].displayValue,
                isDisplayPhone:nameCardInfo[i].isDisplay
              })
            }
            if(nameCardInfo[i].displayName=="身份"){
              that.setData({
                title:nameCardInfo[i].displayValue,
                isDisplayTitle:nameCardInfo[i].isDisplay
              })
            }
            if(nameCardInfo[i].displayName=="微信"){
              that.setData({
                wechart:nameCardInfo[i].displayValue,
                isDisplayWechart:nameCardInfo[i].isDisplay
              })
            }
            if(nameCardInfo[i].displayName=="邮箱"){
              that.setData({
                email:nameCardInfo[i].displayValue,
                isDisplayEmail:nameCardInfo[i].isDisplay
              })
            }
            if(nameCardInfo[i].displayName=="地址"){
              that.setData({
                adress:nameCardInfo[i].displayValue,
                isDisplayAdress:nameCardInfo[i].isDisplay
              })
            }
          }
          
        }else{
          that.setData({
            nameCardInfo:[],
            msg:res.data.msg
          })
        }
    })
  },
  writeCanvas () {
    //console.log(app.globalData.userInfo.avatarUrl,'头想');
    let that = this
    const ctx = wx.createCanvasContext('myCanvas', that)
    let canvasW = that.data.canvasW
    let canvasH = that.data.canvasH
    let bannerPath = that.data.bgImgPath
    let dialogBgPath = that.data.dialogBgPath // 对话框背景
    let nickName = app.globalData.userInfo.nickName.length > 6 ? app.globalData.userInfo.nickName.substr(0, 6) + '...' : app.globalData.userInfo.nickName // 昵称
    let userHeadUrl = that.data.userHeadUrl// 头像
     let programCode = that.data.programCode // 小程序码
     let honor_logo = that.data.honor_logo// 荣誉
     let spreadfalseamt = that.data.spreadfalseamt// 奖金
     let totalcust = that.data.totalcust// 荣誉
     let phrase_content=that.data.phrase_content //短语
     let iconTag=that.data.iconTag//图标
     let iconPhone=that.data.iconPhone //图标手机
     let iconWechart=that.data.iconWechart //图标微信
     let iconLocal=that.data.iconLocal //图标地址
     let phone = that.data.phone //个人数据
     let title=that.data.title //个人数据
     let wechart=that.data.wechart //个人微信号
     let email=that.data.email //个人邮箱
     let adress=that.data.adress //个人地址
   
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
    ctx.arc(that.computedPercent(34), that.computedPercent(31) , that.computedPercent(22), 0, Math.PI * 2, false)
    //ctx.arc(that.computedPercent(24), that.computedPercent(25), that.computedPercent(20), 0, Math.PI * 2, false)
    ctx.setFillStyle('#eee')
    ctx.fill()
    ctx.save()
    // 画小圆
    ctx.beginPath()
    ctx.arc(that.computedPercent(34),that.computedPercent(31) , that.computedPercent(20), 0, Math.PI * 2, false)

    //ctx.arc(that.computedPercent(24), that.computedPercent(25), that.computedPercent(18), 0, Math.PI * 2, false)
    ctx.setFillStyle('#fff')
    ctx.fill()
    // 画好了圆 剪切  原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，
    // 则所有之后的绘图都会被限制在被剪切的区域内 这也是我们要save上下文的原因
    ctx.clip()
    ctx.drawImage(
      userHeadUrl,
      that.computedPercent(12),
      that.computedPercent(8),
      that.computedPercent(44),
      that.computedPercent(44)
    )
    // 恢复画布
    ctx.restore()

    // 画对话框

    // 写昵称 文本居中的起点是指居中的那个点
    ctx.setTextAlign('center')
    ctx.setFontSize(that.computedPercent(12))
    ctx.setFillStyle('#fff')
    ctx.setTextAlign('left');
    ctx.setFontSize(16);
    ctx.fillText(nickName  ,that.computedPercent(65), that.computedPercent(38));
    ctx.save()
    ctx.setTextAlign('center')
    ctx.setFontSize(that.computedPercent(10))
    ctx.setFillStyle('#fff')
    ctx.fillText('累计获客(个)',canvasW-that.computedPercent(42) ,  that.computedPercent(35))
    ctx.fillText('|',canvasW-that.computedPercent(79) ,  that.computedPercent(55))
    ctx.fillText('累计奖金(元)',canvasW-that.computedPercent(112) ,  that.computedPercent(35))
    ctx.fillText(spreadfalseamt,canvasW-that.computedPercent(112) ,  that.computedPercent(55))
    ctx.fillText(totalcust,canvasW-that.computedPercent(42) ,  that.computedPercent(55))
    ctx.save()
    //职位
    if(that.data.isDisplayTitle=='Y'){
      ctx.setTextAlign('left')
      ctx.setFillStyle('#fff')
      ctx.setFontSize(12);
      ctx.fillText(title,that.computedPercent(65) , that.computedPercent(55) )
    }
   
   //荣誉logo
    ctx.drawImage(honor_logo, that.computedPercent(3) , that.computedPercent(45) , that.computedPercent(60), that.computedPercent(18));
    //小程序码
    if(that.data.isDisplayEmail=='Y'){
      ctx.setTextAlign('center')
      ctx.drawImage(programCode, canvasW-that.computedPercent(88) , canvasH-that.computedPercent(78) , that.computedPercent(36), that.computedPercent(36));
      ctx.save()
      ctx.setTextAlign('right')
      ctx.setFontSize(that.computedPercent(10))
      ctx.setFillStyle('#666')
      ctx.fillText(phrase_content,canvasW-that.computedPercent(15) ,  canvasH-that.computedPercent(28) )
      //邮箱
      ctx.fillText(email,canvasW-that.computedPercent(15) ,canvasH-that.computedPercent(15) )
     // ctx.drawImage(iconPhone,that.computedPercent(10) ,canvasH-that.computedPercent(75) , that.computedPercent(16), that.computedPercent(16));
    }else{
      ctx.setTextAlign('center')
      ctx.drawImage(programCode, canvasW-that.computedPercent(92) , canvasH-that.computedPercent(75) , that.computedPercent(38), that.computedPercent(38));
      ctx.save()
      ctx.setTextAlign('right')
      ctx.setFontSize(that.computedPercent(10))
      ctx.setFillStyle('#666')
      ctx.fillText(phrase_content,canvasW-that.computedPercent(15) ,  canvasH-that.computedPercent(23) )
      
    }
    ctx.save()
    //个人信息
    if(that.data.isDisplayWechart=='Y'&&that.data.isDisplayAdress=='Y'){
      ctx.drawImage(iconPhone,that.computedPercent(10) ,canvasH-that.computedPercent(75) , that.computedPercent(16), that.computedPercent(16));
      ctx.drawImage(iconLocal,that.computedPercent(10) ,canvasH-that.computedPercent(29) , that.computedPercent(16), that.computedPercent(16));
      ctx.drawImage(iconWechart,that.computedPercent(10) ,canvasH-that.computedPercent(51) , that.computedPercent(16), that.computedPercent(16));
      ctx.setTextAlign('left')
      ctx.setFontSize(that.computedPercent(12))
      ctx.setFillStyle('#666')
      ctx.fillText(phone,that.computedPercent(28) ,  canvasH-that.computedPercent(64) )
      ctx.fillText(wechart,that.computedPercent(28) ,  canvasH-that.computedPercent(40) )
      ctx.fillText(adress,that.computedPercent(28) ,  canvasH-that.computedPercent(16) )
      ctx.save()
    }else if(that.data.isDisplayWechart=='N'&&that.data.isDisplayAdress=='Y'){
      ctx.drawImage(iconPhone,that.computedPercent(10) ,canvasH-that.computedPercent(72) , that.computedPercent(16), that.computedPercent(16));
      ctx.drawImage(iconLocal,that.computedPercent(10) ,canvasH-that.computedPercent(40) , that.computedPercent(16), that.computedPercent(16));
      ctx.setTextAlign('left')
      ctx.setFontSize(that.computedPercent(14))
      ctx.setFillStyle('#666')
      ctx.fillText(phone,that.computedPercent(28) ,  canvasH-that.computedPercent(58) )
      ctx.fillText(adress,that.computedPercent(28) ,  canvasH-that.computedPercent(26) )
      ctx.save()
    }else if(that.data.isDisplayWechart=='Y'&&that.data.isDisplayAdress=='N'){
      ctx.drawImage(iconPhone,that.computedPercent(10) ,canvasH-that.computedPercent(72) , that.computedPercent(16), that.computedPercent(16));
      ctx.drawImage(iconWechart,that.computedPercent(10) ,canvasH-that.computedPercent(40) , that.computedPercent(16), that.computedPercent(16));
      ctx.setTextAlign('left')
      ctx.setFontSize(that.computedPercent(14))
      ctx.setFillStyle('#666')
      ctx.fillText(phone,that.computedPercent(28) ,  canvasH-that.computedPercent(58) )
      ctx.fillText(wechart,that.computedPercent(28) ,  canvasH-that.computedPercent(26) )
      ctx.save()
    }else if(that.data.isDisplayWechart=='N'&&that.data.isDisplayAdress=='N'){
     
      ctx.drawImage(iconPhone,that.computedPercent(10) ,canvasH-that.computedPercent(63) , that.computedPercent(16), that.computedPercent(16));
      ctx.setTextAlign('left')
      ctx.setFontSize(that.computedPercent(14))
      ctx.setFillStyle('#666')
      ctx.fillText(phone,that.computedPercent(28) ,  canvasH-that.computedPercent(50) )
      ctx.save()
    }
   

    ctx.draw(true, () => {
      that.setData({
        spinning: false
      })
    })
    
  },
  getUserinfo:function(){
    let that= this;
    wx.showLoading({
			title: '生成中...',
    })
    that.QueryNameCardInfo()
     // 获取设备宽度，计算canvas宽高
     wx.getSystemInfo({
       success: function(res) {
         let canvasW = Math.round(res.screenWidth * 0.848)
         let canvasH = canvasW * 0.548
         that.setData({
           pixelRatio: res.pixelRatio, // 图片像素比
           canvasW,
           canvasH
         })
         
       }
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
              scene:"uid="+ app.globalData.user_id +",gid=0,sid=2,cid=4",
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
                        wx.getImageInfo({
                          src: that.data.imgUrls,
                          success: function (res) {
                            that.setData({
                              bgImgPath: res.path//将下载下来的地址给data中的变量变量
                            });
                            wx.getImageInfo({
                              src: that.data.honor_logo,
                              success: function (res) {
                                that.setData({
                                 honor_logo: res.path//将下载下来的地址给data中的变量变量
                                });
                                console.log(res.path,'res.path')
                                wx.hideLoading()
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
      canvasId='myCanvas'
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
              //分享成就
             
              util.request(api.AddAchivementActionUrl,
                { openid:app.globalData.openid,achivement_category:"海报",user_id:app.globalData.user_id,spread_id:that.data.spread_id,spread_ass_id:"0"}
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
   },
   
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that= this;
  
    let nameCardInfo= decodeURIComponent(options.nameCardInfo)
  
    console.log(app.globalData.commonInfo,'app.globalData.commonInfo');
    console.log(nameCardInfo,'nameCardInfo');
    that.setData({
      nameCardInfo:nameCardInfo,
      honor_logo:app.globalData.commonInfo.honor_logo,
      spreadfalseamt:app.globalData.commonInfo.spread_false_amt,
      totalcust:app.globalData.commonInfo.total_cust

    })
       
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
      this.getUserinfo()
      
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

})