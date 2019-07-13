const app = getApp();
import utils from '../../../utils/utils';
Page({
    data: {
        attentionList: [],
        fanslist: [],
        messageList: [],
        txt: '已关注'
    },
    onLoad(query) {
        app.httpsRequest('/api/user/getMessageList', {}).then( res => {
            if (res.code) {
                let data = res.data;
                data.forEach(element => {
                    element.creatTime = utils.getTimeDay(element.creatTime)
                });
                this.setData({
                    messageList: data
                })
            }
        });
        app.httpsRequest('/api/user/clearMessage', {})
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
    toMessageInfo(e) {
        wx.navigateTo({
            url: '../../home/remark/remark?item=' + JSON.stringify(e.currentTarget.dataset.item) + '&commodityId=' + e.currentTarget.dataset.commodityid
        });
    },
    toUserInfo(e) {
        wx.navigateTo({
            url: '../userInfo/userInfo?userId=' + e.currentTarget.dataset.id
        });
    }
})
