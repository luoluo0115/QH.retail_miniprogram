// pages/product/good/good.js
const app = getApp()
var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
var WxParse = require('../../../wxParse/wxParse.js');
import Toast from '../../../vant-weapp/dist/toast/toast';
import Dialog from '../../../vant-weapp/dist/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    vedioCategoryByList:[],
    productParamsList:[],
    show: false,
    isHidden: true,
    token: null,
    hasMoreSelect: false,
		selectSize: "选择规格：",
		selectSizePrice: 0,
		shopNum: 0,
		hideShopPopup: true,
		buyNumber: 0,
		buyNumMin: 1,
		buyNumMax: 0,
		favicon: 0,
		selectptPrice: 0,
		propertyChildIds: "",
		propertyChildNames: "",
    canSubmit: false, //  选中规格尺寸时候是否允许加入购物车,
    productPrice:'',
    pre_product_price_id:[],
    propertyChildIds: [],
    propertyChildNames: [],
    showbill:false,
    pre_product_id:'',
    message:'',
    isHidden: true, //是否隐藏登录弹窗
  },
  onTapShare() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    let that= this;
    app.globalData.user_id=wx.getStorageSync('user_id');
    wx.showShareMenu({
      withShareTicket: true
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
  
    if(options.scene != undefined){
      this.setData({
        pre_product_id: spread_id,
      })
    }else{
      that.setData({
        pre_product_id:options.spread_id,
        user_id:app.globalData.user_id
      })
    }
   
    that.QueryPreProductList(that.data.pre_product_id);
    that.QueryPreProductParams(that.data.pre_product_id)
    if (app.globalData.iphone == true) {
      that.setData({
        iphone: 'iphone'
      })
    }
  },
  onTapGood(){
    this.setData({show: false, showbill: true });
  },
  onTapArticle(event){
    
    this.setData({show: false, showbill: true , article_title:app.globalData.article_title,summary:app.globalData.summary});
    
  },
   //父组件接收子组件传值
   compontpass:function(e){
    this.setData({ showbill: e.detail.showbill });
  },
  
  onCloseBill() {
    this.setData({ showbill: false });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(util.checkOpenId()){
      this.setData({
        isHidden:true,
      })
      
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
		this.setData({
			isHidden:true,
    })
    this.onShow();
	},
  //获取前置产品列表
  QueryPreProductList:function(event) {
    let that = this;
    let pre_product_id=event;
    console.log(app.globalData.user_id, 'app.globalData.user_id')
    util.showLoading("数据请求中...");
   
    util.request(api.QueryPreProductListUrl,//获取前置产品列表
      {  openid:app.globalData.openid,pre_product_id:pre_product_id,user_id: app.globalData.user_id}
      ,'POST').then(function(res){
        if(res.data.success==true){
          let product_desc=res.data.vedioCategoryByList[0].product_desc
          WxParse.wxParse('product_desc', 'html', product_desc, that, 5);
         
          that.setData({
            vedioCategoryByList:res.data.vedioCategoryByList[0],
            is_param:res.data.vedioCategoryByList[0].is_param
          });
          console.log(that.data.vedioCategoryByList.product_price,'that.data.vedioCategoryByList.is_param')
          if(that.data.is_param=='N'){
            that.setData({
              productPrice:that.data.vedioCategoryByList.product_price,
              pre_product_price_id:that.data.pre_product_id,
              propertyChildIds: '',
              propertyChildNames: that.data.product_name
            })
          }
          console.log(that.data.productPrice,'productPrice1111');
          
        }else{
          console.log(res.data.msg)
          that.setData({
            vedioCategoryByList:[]
          });
        }
        util.hideLoading();
    })
      
  },
  //获取前置产品参数
  QueryPreProductParams:function(event) {
    let that = this;
    let pre_product_id=event;
    util.showLoading("数据请求中...");
    util.request(api.QueryPreProductParamsUrl,//获取前置产品参数
      {  openid:app.globalData.openid,pre_product_id:pre_product_id,}
      ,'POST').then(function(res){
          if(res.data.success==true){
            console.log(res.data.productParamsList,'res.data.productParamsList')
            that.setData({
              productParamsList:res.data.productParamsList,
            });
          }else{
            that.setData({
              productParamsList:[]
            });
          }
          util.hideLoading();
    })
      
  },
  tobuy: function() {
    let that = this;
    wx.requestSubscribeMessage({
      tmplIds: ['ggCI1LDl1uuYoyx2k_SyMx8KGF9A0pi-YvFwtxnyoGw'],
      success(res) {
        if (res['ggCI1LDl1uuYoyx2k_SyMx8KGF9A0pi-YvFwtxnyoGw'] === 'accept') {
          console.log('用户同意授权【订单支付成功通知】订阅消息')

          util.request(api.CheckCellPhoneUrl,//检查手机号是否注册
            { openid: app.globalData.openid, user_id: app.globalData.user_id }
            , 'POST').then(function (res) {
              if (res.data.success == true) {
                that.bindGuiGeTap();
                console.log(res.data.success, 'res');
              } else {
                console.log(res.data.msg)
                Dialog.confirm({
                  message: '请先认证一下手机号，方便下单后与您沟通,谢谢'
                }).then(() => {
                  wx.redirectTo({
                    url: "../../me/phoneCertification/phoneCertification"
                  })
                }).catch(() => {
                  // on cancel
                });

              }
            })

        } else {
          console.log('用户拒绝授权【订单支付成功通知】订阅消息')

          util.request(api.CheckCellPhoneUrl,//检查手机号是否注册
            { openid: app.globalData.openid, user_id: app.globalData.user_id }
            , 'POST').then(function (res) {
              if (res.data.success == true) {
                that.bindGuiGeTap();
                console.log(res.data.success, 'res');
              } else {
                console.log(res.data.msg)
                Dialog.confirm({
                  message: '请先认证一下手机号，方便下单后与您沟通,谢谢'
                }).then(() => {
                  wx.redirectTo({
                    url: "../../me/phoneCertification/phoneCertification"
                  })
                }).catch(() => {
                  // on cancel
                });

              }
            })
        }
      }, fail(res) {
        console.log('fail  失败' + JSON.stringify(res))
      },
      complete(res) {
        console.log('complete 调用完成')
      }
    })
	
	},
	/**
	 * 规格选择弹出框
	 */
	bindGuiGeTap: function() {
		this.setData({
			hideShopPopup: false
		})
	},
	/**
	 * 规格选择弹出框隐藏
	 */
	closePopupTap: function() {
		this.setData({
			hideShopPopup: true
		})
  },
  /**
	 * 选择商品规格
	 * @param {Object} e
	 */
	labelItemTap: function(e) {
    
		var that = this;
		// 取消该分类下的子栏目所有的选中状态
    var childs = that.data.productParamsList[e.currentTarget.dataset.propertyindex].paramDataList;
   
		for (var i = 0; i < childs.length; i++) {
			that.data.productParamsList[e.currentTarget.dataset.propertyindex].paramDataList[i].active = false;
		}
		// 设置当前选中状态
		that.data.productParamsList[e.currentTarget.dataset.propertyindex].paramDataList[e.currentTarget.dataset.propertychildindex].active = true;
      console.log(that.data.productParamsList[e.currentTarget.dataset.propertyindex].paramDataList[e.currentTarget.dataset.propertychildindex],'childs')
    
      // 获取所有的选中规格尺寸数据
    var needSelect = that.data.productParamsList;
    var needSelectNum = 0;
    for (var j = 0; j < needSelect.length; j++) {
      if(needSelect[j].is_price_impact=='Y'){
        needSelectNum++;
      }
    
    }
   
		var curSelectNum = 0;
		var propertyChildIds = "";
    var propertyChildNames = "";
    //var paramnametext = that.data.productParamsList[that.data.productParamsList.length].param_name;
		for (var i = 0; i < that.data.productParamsList.length; i++) {
      if(that.data.productParamsList[i].is_price_impact=='Y'){
        console.log(that.data.productParamsList,'that.data.productParamsList')
        var pre_product_id= that.data.productParamsList[i].pre_product_id
        childs = that.data.productParamsList[i].paramDataList;
        console.log( childs,' childs')
        for (var j = 0; j < childs.length; j++) {
            if (childs[j].active) {
              curSelectNum++;
              propertyChildIds = propertyChildIds + that.data.productParamsList[i].pre_product_params_id + ":" + childs[j].id + ",";
              propertyChildNames = propertyChildNames + that.data.productParamsList[i].param_name + ":" + childs[j].paramData +
                "|";
                
            }
        }
      }
		}
		var canSubmit = false;
		if (needSelectNum == curSelectNum) {
			canSubmit = true;
    }
    // 计算当前价格
		if (canSubmit) {
      let that = this;
      console.log(encodeURIComponent(propertyChildNames),'181propertyChildNames')
      let postData={
        openid:app.globalData.openid,pre_product_id:pre_product_id,param_data:encodeURIComponent(propertyChildNames)
      }
      console.log(postData,'获取前置产品列表')
      util.request(api.QueryPreProductPriceUrl,//获取前置产品价格
        { openid:app.globalData.openid,pre_product_id:pre_product_id,param_data:encodeURIComponent(propertyChildNames)}
        ,'POST').then(function(res){
         // console.log(res,'QueryPreProductParams');
          if(res.data.success==true){
            console.log(res.data.productPrice,'productPrice')
            that.setData({
              productPrice:res.data.productPrice,
              pre_product_price_id:res.data.pre_product_price_id,
              propertyChildIds: propertyChildIds,
              propertyChildNames: propertyChildNames
            });
            
          }else{
            console.log(res.data.msg)
            that.setData({
              productPrice:0,
              pre_product_price_id:0,
              propertyChildIds: propertyChildIds,
              propertyChildNames: propertyChildNames
            });
          }
      })
		}
    
    that.setData({
      productParamsList: that.data.productParamsList,
      canSubmit: canSubmit,
     
		})


  },
  /**
	 * 组建下单信息
	 */
	buliduBuyNowInfo: function(e) {
    var shopCarMap = {};
    let that= this;
    let label=that.data.propertyChildNames+that.data.propertyChildNames2;
   
    if(label!=''){
      if( that.data.is_param=="N"){
        label = label.substring(0, label.lastIndexOf('|'));
      }else{
        label = label.substring(0, label.lastIndexOf('|'));
      }
     
    }
		shopCarMap.goodsId = that.data.vedioCategoryByList.pre_product_id;
		shopCarMap.pic = that.data.vedioCategoryByList.product_image;
		shopCarMap.name = that.data.vedioCategoryByList.product_name;
    shopCarMap.propertyChildIds = that.data.propertyChildIds;
    shopCarMap.label = label;
    shopCarMap.price = that.data.productPrice;
    shopCarMap.pre_product_price_id = that.data.pre_product_price_id;
		shopCarMap.left = "";
    shopCarMap.active = true;
   
   
		var buyNowInfo = {};
		
		if (!buyNowInfo.shopList) {
			buyNowInfo.shopList = [];
		}
    buyNowInfo.shopList.push(shopCarMap);
    console.log(buyNowInfo,'buyNowInfo');
    return buyNowInfo;
   
	},
  /**
	 * 提交订单
	 */
  /*input打印*/
  getFillInInf:function(e){
    let index = e.currentTarget.dataset.index; // 获取索引
    let value = e.detail.value// 获取value
    let arr = this.data.productParamsList;
     arr[index].param_data = value;
  },
	buyNow: function(e) {
    let that = this;
    let paramname = e.currentTarget.dataset.id;
  
	 if(that.data.is_param=='N'){
      that.setData({
        productPrice:that.data.productPrice,
        pre_product_price_id:'0',
        propertyChildIds: '0',
        propertyChildNames: ''
      });

    }else{
      console.log(that.data.productParamsList,'that.data.productParamsList')
      if (that.data.productParamsList) {
        if(that.data.productParamsList.length==1&&that.data.productParamsList[0].param_type=='E'){
          if(that.data.productParamsList[0].param_data==''){
            Toast(`请填写${that.data.productParamsList[0].param_name}`);
            return;
          }
        }else{
          if(!that.data.canSubmit){
            wx.hideLoading();
            if (!that.data.canSubmit) {
              Toast('请选中所有!');
            }
            return;
          }
        }
        
       
      }
    }
    var propertyChildNames2 = "";
    for (var i = 0; i < that.data.productParamsList.length; i++) {
      if(that.data.productParamsList[i].param_type=='E'){
            propertyChildNames2 = propertyChildNames2 + that.data.productParamsList[i].param_name + ":" + that.data.productParamsList[i].param_data +
            "|";
            that.setData({
              propertyChildNames2:propertyChildNames2
            })
            console.log(propertyChildNames2,'propertyChildNames2')
          if(that.data.productParamsList[i].param_data==''){
            Toast(`请填写${that.data.productParamsList[i].param_name}`);
            return;
          }
      }
    }
    
		setTimeout(function() {
			wx.hideLoading();
			//组建立即购买信息
      var buyNowInfo = that.buliduBuyNowInfo(paramname);
			// 写入本地存储
			wx.setStorage({
				key: "buyNowInfo",
				data: buyNowInfo
      })
      let postData = {
        openid: app.globalData.openid,
        user_id:app.globalData.user_id,
        pre_product_id: that.data.pre_product_id,
        check_params:buyNowInfo.shopList[0].label
      };
      console.log(postData,'postData');
			util.request(api.CheckProductInServiceUrl,//提交订单检查
        postData
        ,'POST').then(function(res){
            if(res.data.success==true){
              wx.navigateTo({
                url: "../pay-order/pay-order"
              })
            }else{
              Toast(res.data.msg);
            }
      })

      that.closePopupTap();
		}, 300);

    wx.showLoading({
      title: '订单提交中...',
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
  onShareAppMessage: function (id) {
    this.AddAchivementAction();
    let pre_product_id=this.data.pre_product_id;
    let user_id=app.globalData.user_id
    this.setData({show: false})
    return {
      title: '产品分享',
      //path: '/pages/extend/articleDetail/articleDetail?id='+app.globalData.spread_article_id ,    //分享的页面所需要的id
      path: '/pages/product/good/good?spread_id=' + pre_product_id + '&user_id=' + user_id + '&spread_category=5&spread_source=1',  //分享的页面所需要的id
      success: function(res) {
        // 转发成功
        
      },
      fail: function(res) {
        // 转发失败
      }
    
    }
  },
  //分享
  AddAchivementAction:function(e) {
    console.log(e);
   let that = this;
   util.request(api.AddAchivementActionUrl,
     { openid:app.globalData.openid,achivement_category:'产品',user_id:app.globalData.user_id,spread_id:that.data.pre_product_id,spread_ass_id:"0"}
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
  
})