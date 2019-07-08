const app = getApp();
Page({
    data: {
        attentionList: [],
        fanslist: [],
        txt: '已关注'
    },
    onLoad(query) {
        if (query.fansId) {
            this.setData({
                fansId: Number(query.fansId),
                txt: Number(query.fansId) === 1? '已关注': '关注'
            })
        }
        app.httpsRequest('/api/user/userAttentionList', {}).then( res => {
            if (res.code) {
                this.setData({
                    attentionList: res.data.attentionList,
                    fanslist: res.data.fanslist
                })
            }
        });
    },
    getFans(e) {
        app.httpsRequest('/api/user/addAttention', {
            attentionId: e.currentTarget.dataset.id
        }).then(res => {
            if (res.code) {
                this.setData({
                    txt: '已关注'
                })
            } else {
                this.setData({
                    txt: '关注'
                })
            }
            wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 1000
            })
        })
    },
    toUserInfo(e) {
        wx.navigateTo({
            url: '../userInfo/userInfo?userId=' + e.currentTarget.dataset.id
        });
    }
})
