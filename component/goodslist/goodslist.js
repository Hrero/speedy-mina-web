Component({
	properties: {
		text: {
			type: String,
			value: '温馨提示'
        },
        list: {
			type: Array,
			value: []
        }
	},
	data: {
	},
	attached() {
	},
	ready() {
    },
	methods: {
        toDetailPage(e) {
            wx.navigateTo({
                url: '/pages/home/detail/detail?commodityId=' + e.currentTarget.dataset.id
            });
        },
        onCloseBtn() {
            this.triggerEvent('onCloseBtn')
        }
	}
})