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
        let isFans = ''
        if (e.currentTarget.dataset.type === 'attention') {
            isFans = 'attentionList['+ e.currentTarget.dataset.index +'].isFans';
        } else {
            isFans = 'fanslist['+ e.currentTarget.dataset.index +'].isFans';
        }
        let status = e.currentTarget.dataset.isfans? 0: 1;
        app.httpsRequest('/api/user/addAttention', {
            attentionId: e.currentTarget.dataset.id,
            status: status
        }).then(res => {
            if (res.code) {
                this.setData({
                    [isFans]: status,
                    txt: '已关注'
                })
            } else {
                this.setData({
                    [isFans]: status,
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
