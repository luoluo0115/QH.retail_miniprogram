const app = getApp();
const api = require('../../config/api.js')
//JS
Component({
  properties: {
 
    //这里是遮罩层----默认显示
    modalHidden: {
      type: Boolean,
      value: true
    },
    modalD: {
      type: String,
      value: ""
    },
    // pract_id默认为0
    pract_id: {
      type: Number,
      value: 0
    },
    // 文本内容
    modalMsg: {
      type: String,
      value: " "
    },
    modalAuthshow:{
      type: Boolean,
      value: ''
    }
  },
  data: {
    // 朕已阅img
    read_img: api.ImgUrl+'/FileDown/GetSharedImage?image_code=D021',
  },
 
  // 组件初始化
  attached: function() {
    // 出现立即体验--文案
   if (this.data.modalD == 0) {
      var cardid = wx.getStorageSync("cardid");
      console.log("获取cardid", cardid);
      this.setData({
        pract_id: 0,
      })
    } 
    console.log("this.data.modalD", this.data.modalD);
 
  },
 
  // 这里是所有方法
  methods: {
    // 展示授权
    showAuth:function(){
        this.triggerEvent('compontpass', { isHidden:false});
    },

    // 全局跳过指导
    btn_next: function() {
      wx.setStorageSync("pract_none", true);
      var pract_none = wx.getStorageSync("pract_none");
      this.setData({
        modalHidden: pract_none
      })
      app.globalData.isPacart = false;
      wx.reLaunch({
        url: '/pages/index/index',
      })
      console.log("pract_none", pract_none);
    },
    // 选择授权结束
    btnmodule2: function() {
      this.setData({
        pract_id: 1,
        read_img:api.ImgUrl+'/FileDown/GetSharedImage?image_code=D020',
      })
      var val = this.data.pract_id; //通过这个传递数据
      var myEventDetail = {
        val: val
      } // detail对象，提供给事件监听函数
      this.triggerEvent('compontpass', myEventDetail) //myevent自定义名称事件，父组件中使用
      console.log("子组件", this.data.pract_id);
    },
    // 选择授权结束
    btnmodule3: function() {
      this.setData({
        pract_id: 2,
        read_img:api.ImgUrl+'/FileDown/GetSharedImage?image_code=D017',
      })
      var val = this.data.pract_id; //通过这个传递数据
      var myEventDetail = {
        val: val
      } // detail对象，提供给事件监听函数
      this.triggerEvent('compontpass', myEventDetail) //myevent自定义名称事件，父组件中使用
      console.log("子组件", this.data.pract_id);
    },
     // 选择热推结出现
    btnmodule4: function() {
 
      this.setData({
        read_img: api.ImgUrl+'/FileDown/GetSharedImage?image_code=D018',
        pract_id: 5,
      })
      var val = this.data.pract_id; //通过这个传递数据
      var myEventDetail = {
        val: val
      } // detail对象，提供给事件监听函数
      this.triggerEvent('compontpass', myEventDetail) //myevent自定义名称事件，父组件中使用
      console.log("子组件", this.data.pract_id);
 
    },
    // 点击出现产品
    btnmodule5: function() {
      this.setData({
        read_img:api.ImgUrl+'/FileDown/GetSharedImage?image_code=D019',
        pract_id: 6,
      })
      var val = this.data.pract_id; //通过这个传递数据
      var myEventDetail = {
        val: val
      } // detail对象，提供给事件监听函数
      this.triggerEvent('compontpass', myEventDetail) //myevent自定义名称事件，父组件中使用
      console.log("子组件",6);
 
    
 
    },
    // 点击出现成就
    btnmodule6: function() {
      this.setData({
        read_img: api.ImgUrl+'/FileDown/GetSharedImage?image_code=D015',
        pract_id: 7,
      })
      var val = this.data.pract_id; //通过这个传递数据
   
      var myEventDetail = {
        val: val
      } // detail对象，提供给事件监听函数
      this.triggerEvent('compontpass', myEventDetail) //myevent自定义名称事件，父组件中使用
      console.log("子组件", this.data.pract_id);
      // wx.navigateTo({
      //   url: '/pages/endlessMode/cards/cards',
      // })
    },
    // 点击出现
    btnmodule7: function() {
      this.setData({
        pract_id: 8,
        read_img: api.ImgUrl+'/FileDown/GetSharedImage?image_code=D016',
      })
     
      var val = this.data.pract_id; //通过这个传递数据
      var myEventDetail = {
        val: val
      } // detail对象，提供给事件监听函数
      this.triggerEvent('compontpass', myEventDetail) //myevent自定义名称事件，父组件中使用
    },
    // 点击出现
    btnmodule8: function() {
 
      wx.navigateTo({
        url: '/pages/index/index',
      })
      this.setData({
        pract_id: 9,
      })
      var val = this.data.pract_id; //通过这个传递数据
      var myEventDetail = {
        val: val
      } // detail对象，提供给事件监听函数
      this.triggerEvent('compontpass', myEventDetail) //myevent自定义名称事件，父组件中使用
      console.log("子组件", this.data.pract_id);
    },
 
 
  },
 
 
 
})
