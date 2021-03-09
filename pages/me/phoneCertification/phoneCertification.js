const app = getApp()
var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
import Toast from '../../../vant-weapp/dist/toast/toast';
Page({
    
    /**
     * 页面的初始数据
     */
    data: {
        isClick:false,//获取验证码按钮，默认允许点击
      phone:'',//手机号
      code:'',//验证码
      res:0,//获取验证返回信息
      btntext: '获取验证码',
      sh:false,
      content:'',
      isHidden: true,
      spread_activity_user_id:'',
      show:false,
      imgUrls: [
        api.ImgUrl+'/FileDown/GetSharedImage?image_code=D011'
      ],
    },
    onLoad: function (options){
       
        let that= this;
        app.globalData.token= wx.getStorageSync('token')
        let spread_activity_user_id=options.spread_activity_user_id;
        console.log(spread_activity_user_id,'spread_activity_user_id');
      if ((spread_activity_user_id != 'undefined')||(spread_activity_user_id!='')||(spread_activity_user_id!=null)){
              that.setData({
                spread_activity_user_id:spread_activity_user_id
              })
        }else{
            that.setData({
                spread_activity_user_id:0
              })
        }
        
        if( util.checkOpenId()){
            this.setData({
                isHidden:true
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
        app.globalData.openid=wx.getStorageSync('openid');
        app.globalData.user_id=wx.getStorageSync('user_id');
        this.setData({
            isHidden:true,
            token:e.detail
        })
	},
    onClose:function(){
        this.setData({
            sh:false
        })
    },
    getCode:function(){
       let that=this;
        var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}|(19[0-9]{1})))+\d{8})$/;
        //提示
        if(that.data.phone=='' || that.data.phone==null){
            const text = second => `请输入手机号`;
            const toast = Toast({
            message: text(3)
            });
            return;
        }else if(that.data.phone.length<11){
            const text = second => `输入手机号长度有误`;
            const toast = Toast({
            message: text(3)
            });
            return;
        }else if(!myreg.test(that.data.phone)){
            const text = second => `输入手机号有误`;
            const toast = Toast({
            message: text(3)
            });
            return;
        }else{
            //获取验证码
            var _this = this
            var coden = 60    // 定义60秒的倒计时
            _this.setData({    // _this这里的作用域不同了
                btntext: '60后重新发送',
                isClick: true,
                })
            var codeV = setInterval(function () {    
                _this.setData({    // _this这里的作用域不同了
                btntext: '重新获取(' + (--coden) + 's)',
                })
                if (coden == -1) {  // 清除setInterval倒计时，这里可以做很多操作，按钮变回原样等
                clearInterval(codeV)
                _this.setData({
                    btntext: '获取验证码',
                    isClick:  false
                })
                }
            }, 1000)  //  1000是1秒
            //获取验证码
            util.request(api.VerificationCode,{openid:app.globalData.openid,mobile_phone:that.data.phone},'Post').then(function(res){
                console.log(res);
                   //获取验证码成功
                   that.setData({
                    res:res.data.code
                })
            })
        }
        
        
    },
    goTo:function(){
       let that=this;
      console.log(that.data.spread_activity_user_id)
       var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}|(19[0-9]{1})))+\d{8})$/;
       //提示
       if(that.data.phone=='' || that.data.phone==null){
           const text = second => `请输入手机号`;
           const toast = Toast({
           message: text(3)
           });
           return;
       }else if(that.data.phone.length<11){
           const text = second => `输入手机号长度有误`;
           const toast = Toast({
           message: text(3)
           });
           return;
       }else if(!myreg.test(that.data.phone)){
           const text = second => `输入手机号有误`;
           const toast = Toast({
           message: text(3)
           });
           return;
       }else if(this.data.code=='' || this.data.code==null){
            const text = second => `请输入验证码`;
            const toast = Toast({
            message: text(3)
            });
            return;
        }else if(this.data.res==0){
            const text = second => `请先获取验证码`;
            const toast = Toast({
            message: text(3)
            });
            return;
        };
        Toast.loading({
            mask: false,
            duration:0,
            message: '认证中...'
          });
          
          var data={openid:app.globalData.openid,mobile_phone:that.data.phone,code:that.data.code,user_id:app.globalData.user_id,spread_activity_user_id:that.data.spread_activity_user_id};
          console.log(data);
        util.request(api.BindMobilePhone,data,'POST').then(function(res){
            console.log(res,'res');
            if(res.data.success==true){
              if (that.data.spread_activity_user_id == '0' || that.data.spread_activity_user_id == undefined){
                    Toast.success('认证成功');
                    setTimeout(function(e){
                        wx.redirectTo({
                          url: '../certificationInfo/certificationInfo'
                           });
                      },2000)
                }else{
                console.log(that.data.spread_activity_user_id,'that')
                    Toast.clear();
                    that.setData({
                        show:true
                    })
                }
                
            }else{
                Toast.fail(res.data.msg); 
            }
        })
    },
    onActivityClose() {
        this.setData({ show: false });
        wx.reLaunch({
            url: '../../activity/index/index',
            fail: function () {
              wx.redirectTo({
                url: '../../activity/index/index',
              })
            }
        });
      
    },
    phoneInput:function(e){
        //获取输入手机号
        this.setData({
            phone:e.detail
        })
    },
    codeInput:function(e){
        //获取输入验证码
        this.setData({
            code:e.detail
        })
    }
    
  });
