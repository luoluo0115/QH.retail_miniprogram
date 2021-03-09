 var api = require('../config/api.js')
 const app = getApp()
import Toast from '../vant-weapp/dist/toast/toast';

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatDayTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('/') + ' ' 
}


const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const numberToFixed= val =>{
  if(val>=0){
      var str = (val*100/100).toFixed(2) + '';
      var intSum = str.substring(0,str.indexOf("."));
       intSum = (intSum || 0).toString();
      var resultIntSum = '';
     
      while (intSum.length > 3) {
          resultIntSum  = ',' + intSum.slice(-3) + resultIntSum ;
          intSum = intSum.slice(0, intSum.length - 3);
      }
      if (intSum) { resultIntSum  = intSum + resultIntSum ; }
      var dot = str.substring(str.length,str.indexOf("."))//取到小数部分搜索
      var ret = resultIntSum + dot;
      return ret ;
  }else{
      var price=Math.abs(val); 
      var str = (price*100/100).toFixed(2) + '';
      var intSum = str.substring(0,str.indexOf("."));
      var intSum = (intSum || 0).toString();
      var resultIntSum = '';
  
      while (intSum.length > 3) {
          resultIntSum  = ',' + intSum.slice(-3) + resultIntSum ;
          intSum = intSum.slice(0, intSum.length - 3);
          
      }
      if (intSum) { resultIntSum  = intSum + resultIntSum ; }
      var dot = str.substring(str.length,str.indexOf("."))//取到小数部分搜索
      var ret = '-'+(resultIntSum+dot);
      
      return ret;
  }
  
}
const numberToFixedNo= val =>{
  if(val>=0){
      var str = (val*100/100).toFixed(2)+ '';
      var intSum = str.substring(0,str.indexOf("."));
       intSum = (intSum || 0).toString();
      var resultIntSum = '';
     
      while (intSum.length > 3) {
          resultIntSum  = ',' + intSum.slice(-3) + resultIntSum ;
          intSum = intSum.slice(0, intSum.length - 3);
      }
      if (intSum) { resultIntSum  = intSum + resultIntSum ; }
      var dot = str.substring(str.length,str.indexOf("."))//取到小数部分搜索
      var ret = resultIntSum ;
      return ret ;
  }else{
      var price=Math.abs(val); 
      var str = (price*100/100).toFixed(2) + '';
      var intSum = str.substring(0,str.indexOf("."));
      var intSum = (intSum || 0).toString();
      var resultIntSum = '';
  
      while (intSum.length > 3) {
          resultIntSum  = ',' + intSum.slice(-3) + resultIntSum ;
          intSum = intSum.slice(0, intSum.length - 3);
          
      }
      if (intSum) { resultIntSum  = intSum + resultIntSum ; }
      var dot = str.substring(str.length,str.indexOf("."))//取到小数部分搜索
      var ret = '-'+(resultIntSum+dot);
      
      return ret;
  }
  

  
}
const addMonth = num => {
  if (typeof num == "string") {
    num = parseInt(num);
  }
  var date = new Date();
  const curYear = date.getFullYear();
  const curMonth = date.getMonth() + 1;
  const curDay = date.getDate();
  let month = (curMonth + num - 1) % 12;
  let year = curYear + (curMonth + num - month) / 12;
  let days = curDay;
  date = new Date(year, month, days);
  year = date.getFullYear();
  month = date.getMonth() + 1;
  const day = date.getDate();

  return [year, month].map(formatNumber).join('-')
}
const formatDateUnderLine = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('_')
}

/**
 * requestPromise用于将wx.request改写成Promise方式
 * @param：{string} myUrl 接口地址
 * @return: Promise实例对象
 */
function requestV2(url,data={},method="POST"){
  return new Promise(function(resolve,reject){
    //app.globalData.sessKey="123123123";
    
    wx.request({
      url:url,
      data:data,
      method:method,
      header:{
        'content-type': 'application/json' ,// 默认值,
        //'Authorization':wx.getStorageSync('token') //设置验证
      },
      success:function(res){
       console.log(res.statusCode);
        if(res.statusCode==200){
          resolve(res);
          console.log(res,'查询')
        }
        if(res.statusCode==401){
          //判断是否登录
          checkSession().then(function(res){
            console.log(res)
            if(res==true){
              console.log(1);
              var data1={client_id:app.globalData.client_id,client_secret:app.globalData.client_secret,grant_type:"client_credentials"};
              wx.request({
                url:api.TokenUrl,
                data:data1,
                header: {
                  'content-type': 'application/x-www-form-urlencoded' // 默认值
                },
                method:'POST',
                success:function(res){
                  if(res.statusCode==200){
                    wx.setStorageSync('token','Bearer '+res.data.access_token);
                    request(url,data,'POST').then(function(res){
                      resolve(res);
                    })
                  }
                  if(res.statusCode==500){
                  }
                }
              })
            }else{
              let code = null;
              login().then((res)=>{
                code = res.code;
                return getUserInfo();
              }).then((userInfo)=>{
                wx.getUserInfo({
                  success:function(res){
                    var encryptedData=res.encryptedData
                    var iv = res.iv;
                    var data2 = { code: code, encryptedData: encryptedData, iv: iv }
        
                    var data1={client_id:app.globalData.client_id,client_secret:app.globalData.client_secret,grant_type:"client_credentials"};
                    console.log(data1);
                    wx.request({
                      url:api.TokenUrl,
                      data:data1,
                      header: {
                        'content-type': 'application/x-www-form-urlencoded' // 默认值
                      },
                      method:"post",
                      success:function(res){
                        wx.setStorageSync('token','Bearer '+res.data.access_token);
                        request(api.UserUrl,data2,'POST').then(function(res){
                              
                          console.log(res,'data2UserUrl');
                          app.globalData.openid=res.data.openid;
                          app.globalData.sessKey=res.data.session_key;
                          //可以把openid存到本地，方便以后调用
                          wx.setStorageSync('openid', res.data.openid);
                          wx.setStorageSync('session_key', res.data.session_key);
                          wx.setStorageSync('user_id', res.data.user_id);
                      })
                      }
                    })
                  }
                })
              })
              console.log(1);
              var data1={client_id:app.globalData.client_id,client_secret:app.globalData.client_secret,grant_type:"client_credentials"};
              wx.request({
                url:api.TokenUrl,
                data:data1,
                header: {
                  'content-type': 'application/x-www-form-urlencoded' // 默认值
                },
                method:'POST',
                success:function(res){
                  if(res.statusCode==200){
                    wx.setStorageSync('token','Bearer '+res.data.access_token);
                    request(url,data,'POST').then(function(res){
                      resolve(res);
                    })
                  }
                  if(res.statusCode==500){
                  }
                }
              })
            }
          })

        }
      },fail:function(err){
        
        console.log(err);
        Toast('网络异常');
      }
    })
  })
}

function request(url, data = {}, method = "POST") {
  return new Promise(function (resolve, reject) {
    var that = this;
    
    var qh_access_token = "";    

    //需要验证Bearer token
    wx.request({
      url: api.TokenUrl + getApp().md5Key,
      
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "get",
      dataType: "json",
      success: function (res) {
        qh_access_token = res.data.token;
        console.log("当前token:" + qh_access_token);
        wx.setStorageSync('qh_access_token', qh_access_token);
        getApp().globalData.Token = res.data.access_token;

        wx.request({
          url: url,
          data: data,
          method: method,
          header: {
            'content-type': 'application/json', // 默认值,
            'Authorization': 'Bearer ' + qh_access_token //设置验证
          },
          dataType: "json",
          success: function (res) {
            //is_VerifyLogin
            //checkOpenId();
            if (res.data.code == -1) {
              //getApp().login();
            } else {
              resolve(res);
            }
          },
          fail: function (res) {
            console.warn('--- request fail >>>');
            console.warn(res);
            console.warn('<<< request fail ---');
            var app = getApp();
            if (app.is_on_launch) {
              app.is_on_launch = false;
              wx.showModal({
                title: "网络请求出错",
                content: res.errMsg,
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    reject(res);
                  }
                }
              });
            } else {
              wx.showToast({
                title: res.errMsg,
                image: "/images/icon-warning.png",
              });
              reject(res);
            }
          },
          complete: function (res) {
            if (res.statusCode != 200) {
              console.log('--- request http error >>>');
              console.log(res.statusCode);
              console.log(res.data);
              console.log('<<< request http error ---');
            }
            reject(res);
          }
        });

      },
      fail: function (res) {
        console.log(res);
      }
    });

  })
}

function commonRequest(object) {
  var that = this;
  if (!object.data) {
    object.data = {};
  }
  var qh_access_token = "";
   
  //需要验证Bearer token
  wx.request({
    url: api.TokenUrl + getApp().md5Key,
    header: {
      'content-type': 'application/x-www-form-urlencoded' // 默认值
    },
    method: "get",
    dataType: "json",
    success: function (res) {
      qh_access_token = res.data.token;
      
      wx.setStorageSync('qh_access_token', qh_access_token);
      var qh_access_token_time = formatTime(new Date());
      wx.setStorageSync('qh_access_token_time', qh_access_token_time);

      postRequest(object, qh_access_token);


    },
    fail: function (res) {
      console.log(res.error);
    }
  });
}
function postRequest (object, qh_access_token) {
  wx.showLoading({
    title: "正在加载",
    mask: true,
  });

  wx.request({
    url: object.url,
    header: object.header || {
      'content-type': 'application/json', // 默认值,
      'Authorization': 'Bearer ' + qh_access_token //设置验证
    },
    data: object.data || {},
    method: object.method || "GET",
    dataType: object.dataType || "json",
    success: function (res) {
      //is_VerifyLogin
      //getApp().checkOpenId();
      if (res.data.code == -1) {
        //getApp().login();
      } else {
        if (object.success)
          object.success(res);
      }
    },
    fail: function (res) {
      console.warn('--- request fail >>>');
      console.warn(res);
      console.warn('<<< request fail ---');
      var app = getApp();
      if (app.is_on_launch) {
        app.is_on_launch = false;
        wx.showModal({
          title: "网络请求出错",
          content: res.errMsg,
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              if (object.fail)
                object.fail(res);
            }
          }
        });
      } else {
        wx.showToast({
          title: res.errMsg,
          image: "/images/icon-warning.png",
        });
        if (object.fail)
          object.fail(res);
      }
    },
    complete: function (res) {
      wx.hideLoading();
      if (res.statusCode != 200) {
        console.log('--- request http error >>>');
        console.log(res.statusCode);
        console.log(res.data);
        console.log('<<< request http error ---');
      }
      if (object.complete)
        object.complete(res);
    }
  });

}
/**
 * 判断是否登录
 */
function checkOpenId() {
  var openid = wx.getStorageSync("openid");
  var user_id = wx.getStorageSync("user_id");
  if (user_id != "" && user_id != null && user_id != undefined) {
    return true;
  } else {
    return false;
  }
}

/**
 * 解析字符串
 */
function scene_decode (scene) {
  var _str = scene + "";
  var _str_list = _str.split(",");
  var res = {};
  for (var i in _str_list) {
    var _tmp_str = _str_list[i];
    var _tmp_str_list = _tmp_str.split("=");
    if (_tmp_str_list.length > 0 && _tmp_str_list[0]) {
      res[_tmp_str_list[0]] = _tmp_str_list[1] || null;
    }
  }
  return res;
}
/**
  * 获取AppSecret
  */
function getAppSecret () {
  let appID = app.globalData.WeixinAppId;
    request(api.GetWXAppSecretUrl,
    { App_ID: appID }
    , 'POST').then(function (res) {
      console.log(res, 'AppSecret ')
      if (res.data.success == true) {
        wx.setStorageSync("WeixinAppSecret", res.data.appSecret);
        app.globalData.WeixinAppSecret = res.data.appSecret;
      }
    })
}

/**
 * 检查微信会话是否过期
 */
function checkSession() {
  return new Promise(function (resolve, reject) {
    wx.checkSession({
      success: function () {
        resolve(true);
      },
      fail: function () {
        reject(false);
      }
    })
  });
}
function get(url, data = {}) {
  return request(url, data, 'GET')
}

function post(url, data = {}) {
  return request(url, data, 'POST')
}

/**
 * 调用微信登录
 */
function login() {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function (res) {
        if (res.code) {
          resolve(res.code);
        } else {
          reject(res);
        }
      },
      fail: function (err) {
        reject(err);
      }
    });
  });
}
function getUserInfo() {
  return new Promise(function (resolve, reject) {
    wx.getUserInfo({
      withCredentials: true,
      success: function (res) {
        console.log(res)
        if (res.encryptedData == 'getUserInfo:ok') {
          resolve(res);
        } else {
          reject(res)
        }
      },
      fail: function (err) {
        reject(err);
      }
    })
  }).catch((e)=>{});
}

const priceSwitch = function(val){
  //金额转换  并每隔3位用逗号分开 1,234.56
    var str = (val*100/100).toFixed(2) + '';
    var intSum = str.substring(0,str.indexOf(".")).replace( /\B(?=(?:\d{3})+$)/g, ',' );//取到整数部分
    var dot = str.substring(str.length,str.indexOf("."))//取到小数部分搜索
    var ret = intSum + dot;
    return ret;
}

/**
 * 绑定推荐关系
 */
function bindParent  () {
  var parent_user_id = wx.getStorageSync("parent_user_id");
  if (parent_user_id == "undefined" || parent_user_id == 0)
    return;
  console.log("Try To Bind Parent With User Id:" + parent_user_id);
  var user_id = wx.getStorageSync("user_id");
  if (parent_user_id != 0 && user_id != 0) {
    request(api.AddSpreadRelationUrl,
      {
        openid: app.globalData.openid,
        user_id: app.globalData.user_id,
        parent_user_id: parent_user_id
      }
      , 'POST').then(function (res) {
        console.log(res, '层级 ')
        if (res.data.success == true) {
          console.log(res.data.msg)
        } else {
          console.log(res.data.msg)

        }
      })
  }
}
 /**
   * 用户来源分类
   */
function getSpreadSource(options) {
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
}
/**
 * 执行请求，禁止多次点击或者重复点击
 */
function showLoading(message) {
  if (wx.showLoading) {
      // 基础库 1.1.0 微信6.5.6版本开始支持，低版本需做兼容处理
      wx.showLoading({
          title: message,
          mask: true
      });
  } else {
      // 低版本采用Toast兼容处理并将时间设为20秒以免自动消失
      wx.showToast({
          title: message,
          icon: 'loading',
          mask: true,
          duration: 20000
      });
  }
}

function hideLoading() {
  if (wx.hideLoading) {
      // 基础库 1.1.0 微信6.5.6版本开始支持，低版本需做兼容处理
      wx.hideLoading();
  } else {
      wx.hideToast();
  }
}

module.exports = {
  formatTime: formatTime,
  formatDayTime:formatDayTime,
  request:request,
  checkOpenId:checkOpenId,
  commonRequest: commonRequest,
  addMonth: addMonth,
  scene_decode: scene_decode,
  numberToFixedNo:numberToFixedNo,
  priceSwitch:priceSwitch,
  numberToFixed:numberToFixed,
  bindParent: bindParent,
  getSpreadSource: getSpreadSource,
  formatDateUnderLine: formatDateUnderLine,
  showLoading:showLoading,
  hideLoading:hideLoading
}
