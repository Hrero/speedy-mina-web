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
        toLikeclick(e) {
            let item = {};
            let list = '';
            let idx = '';
            let status = 0;
            let id = e.currentTarget.dataset.id;
            this.data.list.forEach((element, index) => {
                if (element._id === id) {
                    item = element
                    status = element.isLike? 0: 1;
                    list = 'right';
                    idx = index;
                }
            });
            app.httpsRequest('/api/user/addLike', {
                commodityId: item._id,
                status: status
            }).then(res => {
                let like = 'list['+ idx + '].like';
                let isLike = 'list[' + idx + '].isLike';
                if (res.code) {
                    this.setData({
                        [like]: this.data.list[idx].like + 1,
                        [isLike]: status
                    })
                } else {
                    this.setData({
                        [like]: this.data.list[idx].like - 1,
                        [isLike]: status
                    })
                }
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 1000
                })
            })
        },
        onCloseBtn() {
            this.triggerEvent('onCloseBtn')
        }
	}
})