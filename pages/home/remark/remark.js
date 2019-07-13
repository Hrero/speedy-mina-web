
const app = getApp();
Page({
    data: {
        commodityId: '',
        detail: {},
        remarksList: [],
        placeTxt: '添加评论...',
        wakeUp: false,
        remarkValue: '',
        toUid: '',
        targetId: '',
        itemFather: null,
        targetFirstId: '',
        message: [
            {
                nickName: '小哥哥',
                content: '是的啊啊即使我是的啊即使我'
            },
            {
                nickName: '小哥哥',
                content: '是的啊啊即使我是的啊即使我'
            },
            {
                nickName: '小哥哥',
                content: '是的啊啊即使我是的啊即使我'
            },
            {
                nickName: '小哥哥',
                content: '是的啊啊即使我是的啊即使我'
            }
        ]
    },
    onLoad(query) {
        if (query.commodityId) {
            this.setData({
                commodityId: query.commodityId
            })
        }
        if (query.item) {
            this.setData({
                itemFather: JSON.parse(query.item)
            },() => {
                console.log(this.data.itemFather)
            })
        }
        app.httpsRequest('/api/getCommodityDetail', {
            commodityId: this.data.commodityId
        }).then(res => {
            const data = res.data;
            if (res.code) {
                this.setData({
                    detail: data.res,
                    message: data.lookUp,
                    total: data.total
                })
            }
        })
        app.httpsRequest('/api/user/getRemarksList', {
            commodityId: query.commodityId
        }).then(res => {
            if (res.code) {
                this.setData({
                    remarksList: res.data.data
                })
            }
        })
    },
    remarkOthers(e) {
        let item = e.currentTarget.dataset.info;
        this.setData({
            wakeUp: true,
            placeTxt: '回复@' + item.nickName,
            toUid: item.fromUid,
            targetId: item._id,
            targetFirstId: item._id
        })
    },
    remarkChildsOthers(e) {
        let item = e.currentTarget.dataset.info;
        let firstid = e.currentTarget.dataset.firstid;
        this.setData({
            wakeUp: true,
            placeTxt: '回复@' + item.nickName,
            toUid: item.fromUid,
            targetId: item._id,
            targetFirstId: firstid
        })
    },
    remarkAdmin(e) {
        this.setData({
            wakeUp: true,
            placeTxt: '回复@' + this.data.detail.dep.nickName,
            toUid: this.data.detail.dep._id,
            targetId: this.data.commodityId,
            targetFirstId: this.data.commodityId
        })
    },
    remarkSubmit(e) {
        let data = {};
        data.commodityId = this.data.commodityId;
        data.depComm = this.data.commodityId;
        data.toUid = this.data.toUid;
        data.targetId = this.data.targetId;
        data.content = e.detail.value;
        data.targetFirstId = this.data.targetFirstId;
        app.httpsRequest('/api/user/addRemarks', data).then(res => {
            if (res.code) {
                this.setData({
                    placeTxt: '添加评论...',
                    remarkValue: ''
                })
                app.httpsRequest('/api/user/getRemarksList', {
                    commodityId: this.data.commodityId
                }, true).then(res => {
                    if (res.code) {
                        this.setData({
                            remarksList: res.data.data
                        })
                    }
                })
                wx.showToast({
                    title: '评论成功',
                    icon: 'none',
                    duration: 1000
                })
            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 1000
                })
            }

        })
    },
    toUserInfo(e) {
        console.log(e)
        wx.navigateTo({
            url: '../../user/userInfo/userInfo?userId=' + e.currentTarget.dataset.id
        });
    },
    bindinput(e) {
        this.setData({
            remarkValue: e.detail.value
        })
    }
})
