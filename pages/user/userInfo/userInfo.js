const app = getApp();
import utils from '../../../utils/utils';
Page({
    data: {
        userInfo: {},
        userToken: null,
        tabIndex: 1,
        goodList: [],
        txt: '已关注',
        collectionList: [],
        userId: '',
        userHead: '' || 'https://static2.zugeliang01.com/lease/img/de7c2f80-90e2-11e9-a258-4ba5c91f867b.png'
    },
    onLoad(query) {
        if (query.userId) {
            this.setData({
                userId: query.userId
            })
        }
        app.httpsRequest('/api/user/getUserCommodityList', {
            userId: this.data.userId
        }).then(res => {
            const data = res.data;
            this.setData({
                goodList: utils.isObjNull(data)?[]: data
            });
        })
        app.httpsRequest('/api/user/getCollectionList', {
            userId: this.data.userId
        }).then(res => {
            const data = res.data;
            this.setData({
                collectionList: utils.isObjNull(data)?[]: data
            });
        })
    },
    onShow(){
        app.httpsRequest('/api/user/getUserDetail', {
            userId: this.data.userId
        }).then( res => {
            if (res.code) {
                this.setData({
                    userInfo: res.data
                })
            }
        });
    },
    getFans() {
        app.httpsRequest('/api/user/addAttention', {
            attentionId: this.data.userId
        }).then(res => {
            if (res.code) {
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 1000
                })
                this.setData({
                    txt: '已关注'
                })
            } else {
                this.setData({
                    txt: '未关注'
                })
            }
        })
    },
    choseFansType(e){
        this.setData({
            tabIndex: e.target.dataset.index
        });
    },
    onGotUserInfo(e) {
        if(!e.detail.encryptedData) return;
        this.setData({
            userInfo: e.detail.userInfo
        });
        app.speedyForWechatUid(e.detail).then(() => {
            if(app.userToken) {
                // this.getUserDetail();
                // this.ifBecamePartner();
            }
        }); 
    },
    onGotUserInfo(e) {
        if(!e.detail.encryptedData) return;
        app.speedyForWechatUid(e.detail).then(() => {
            if(app.userToken) {

            } else {

            }
        });
    },
    tofansPage(e) {
        wx.navigateTo({
            url: './fansPage/fansPage'
        });
    },
    toDetailPage(e) {
        wx.navigateTo({
            url: '../home/detail/detail?commodityId=' + e.currentTarget.dataset.id
        });
    },
    toAddUserCompage() {
        wx.navigateTo({
            url: './formalRegular/formalRegular'
        });
    },
    toEditPersonInfo() {
        wx.navigateTo({
            url: './editPersonInfo/editPersonInfo'
        });
    }
})
