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
                    detail: data
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
    toLikeclick(e) {
        let status = e.currentTarget.dataset.isLike? 0: 1;
        app.httpsRequest('/api/user/addLike', {
            commodityId: this.data.commodityId,
            status: status
        }).then(res => {
            let like = 'detail.like';
            let isLike = 'detail.isLike';
            if (res.code) {
                this.setData({
                    [like]: this.data.detail.like + 1,
                    [isLike]: status
                })
            } else {
                this.setData({
                    [like]: this.data.detail.like - 1,
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
    toCollectionclick(e) {
        let status = e.currentTarget.dataset.iscollect? 0: 1;
        app.httpsRequest('/api/user/addCollection', {
            commodityId: this.data.commodityId,
            status: status
        }).then(res => {
            let collect = 'detail.collect';
            let isCollect = 'detail.isCollect';
            if (res.code) {
                this.setData({
                    [collect]: this.data.detail.collect + 1,
                    [isCollect]: status
                })
            } else {
                this.setData({
                    [collect]: this.data.detail.collect - 1,
                    [isCollect]: status
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
        let status = e.currentTarget.dataset.isfans? 0: 1;
        app.httpsRequest('/api/user/addAttention', {
            attentionId: this.data.detail.dep._id,
            status: status
        }).then(res => {
            let isFans = 'detail.dep.isFans';
            if (res.code) {
                this.setData({
                    [isFans]: status
                })
            } else {
                this.setData({
                    [isFans]: status
                })
            }
            wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 1000
            })
        })
    },
    toTransmitclick() {
        app.httpsRequest('/api/user/addTransmit', {
            commodityId: this.data.commodityId
        }).then(res => {
            wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 1000
            })
        })
    },
    onShareAppMessage() {
        return {
            title: '杂货助手，大学生的二手物品的交换中心',
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
