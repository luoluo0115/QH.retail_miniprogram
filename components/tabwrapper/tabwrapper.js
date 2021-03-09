// component/authorize.js
const app = getApp();
//api
// import requestApi from '../../utils/promiseRequestApi.js'
var api = require('../../config/api.js');
var util = require('../../utils/util.js');
Component({
 
  properties: {
		acc_commission_amt: {
			type: Number,
			value: true,
		},
    totalcust:{
			type: Number
		}, 
		achivementscore:{
			type: Number
    },
    reccount:{
			type: Number
    },
    recorderqty:{
      type: Number
    }
	

	},
 
  data: {
    isAuthor:false,//是否已授权
  },
 
  lifetimes: {
    attached() {
      this.setData({
        isAuthor: app.globalData.isAuthor
      })
    }
  },
 
  methods: {
    
  }
})
