const app = getApp();

Page({
    data:{
        imgUrls: [
            'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
            'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
            'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640',
            'https://static2.zugeliang01.com/lease/img/30331b20-9252-11e9-a3ac-0f06167c54ec.png'
        ],
        message: [
            {
                title: '小哥哥',
                msg: '是的啊啊即使我是的啊即使我'
            },
            {
                title: '小哥哥',
                msg: '是的啊啊即使我是的啊即使我'
            },
            {
                title: '小哥哥',
                msg: '是的啊啊即使我是的啊即使'
            },
            {
                title: '小哥哥',
                msg: '是的啊啊即使我是的啊'
            }
        ],
        number: 0,
        width: app.windowWidth,
        goodsRecommendList: [],
        commodityId: '',
        detail: {},
        imgUrl: [100, 200, 400, 400],
        height: ''
    },
    onLoad(query){
        if (query.commodityId) {
            this.setData({
                commodityId: query.commodityId
            })
        }
        app.httpsRequest('/api/getCommodityDetail', {
            commodityId: this.data.commodityId
        }).then(res => {
            const data = res.data;
            if (res.code) {
                this.setData({
                    detail: data,
                    number: data.collect
                }, () => {
                    app.httpsRequest('/api/recommendToCommodity', {
                        type: this.data.detail.type
                    }).then(res => {
                        if (res.code) {
                            const data = res.data;
                            this.setData({
                                goodsRecommendList: data
                            })
                        }
                    })
                })
            }
        })
    },
    toDetailPage() {
        wx.navigateTo({
            url: '/pages/home/detail/detail?commodityId=' + e.currentTarget.dataset.id
        });
    },
    toLikeclick() {
        app.httpsRequest('/api/user/addLike', {
            commodityId: this.data.commodityId
        }).then(res => {
            let like = 'detail.like'
            if (res.code) {
                this.setData({
                    [like]: this.data.detail.like + 1
                })
            } else {
                this.setData({
                    [like]: this.data.detail.like - 1
                })

            }
            wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 1000
            })
        })
    },
    toCollectionclick() {
        app.httpsRequest('/api/user/addCollection', {
            commodityId: this.data.commodityId
        }).then(res => {
            if (res.code) {
                this.setData({
                    number: this.data.number + 1
                })
            } else {
                this.setData({
                    number: this.data.number - 1
                })
            }
            wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 1000
            })
        })
    },
    getAddAttention(e) {
        app.httpsRequest('/api/user/addAttention', {
            attentionId: this.data.detail.dep._id
        }).then(res => {
            if (res.code) {
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 1000
                })
            }  
        })
    },
    onShareAppMessage() {
        return {
            title: '转发',
            path: '/pages/home/detail?commodityId=' + this.data.commodityId,
            success: (res) => {
                app.httpsRequest('/api/user/addTransmit', {
                    commodityId: this.data.commodityId
                }).then(res => {
                    wx.showToast({
                        title: res.msg,
                        icon: 'none',
                        duration: 1000
                    })
                })
            }
        }
    }
});
