const app = getApp();
const api = require('../../config/api.js')
Component({
	properties: {
		isHidden: {
			type: Boolean,
			value: true,
		},
		showscore: {
			type: Boolean,
			value: true,
		},
		min:{
			type:Number,
			value:1
		},
		actionTimes:{
			type: Number
		},
		 achivementScore:{
			type: String
		}, 
		accDays:{
			type: String
		},
		second:{
			type: Number
		}

	},
	
	methods: {
		onClose() {
			this.setData({ showscore: false });
			},
	
	}
})
