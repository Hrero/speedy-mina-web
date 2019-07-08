const app = getApp();
import utils from '../../utils/utils';

Page({
    data: {
        userInfo: {},
        userToken: null,
        isPointOut: true,
        pointOutText: "温馨提示：请点击编辑信息授权获取您的个人信息",
        tabIndex: 1,
        goodList: [],
        collectionList: [],
        userId: '',
        userHead: '' || 'https://static2.zugeliang01.com/lease/img/de7c2f80-90e2-11e9-a258-4ba5c91f867b.png'
    },
    onLoad() {
        app.httpsRequest('/api/user/getUserCommodityList', {}).then(res => {
            const data = res.data;
            this.setData({
                goodList: utils.isObjNull(data)?[]: data
            });
        })
        app.httpsRequest('/api/user/getCollectionList', {}).then(res => {
            const data = res.data;
            this.setData({
                collectionList: utils.isObjNull(data)?[]: data
            });
        })
        app.httpsRequest('/api/user/getUserDetail', {}, true).then( res => {
            if (res.code) {
                this.setData({
                    userInfo: res.data,
                    isPointOut: res.data.school? false: true
                })
            }
        });
    },
    choseFansType(e){
        this.setData({
            tabIndex: e.target.dataset.index
        });
    },
    onCloseBtn() {
        this.setData({
            isPointOut: false
        })
    },
    onGotUserInfo(e) {
        if(!e.detail.encryptedData) return;
        this.setData({
            userInfo: e.detail.userInfo
        });
        app.speedyForWechatUid(e.detail).then(() => {
            app.httpsRequest('/api/user/getUserDetail', {}, true).then( res => {
                if (res.code) {
                    this.setData({
                        userInfo: res.data
                    })
                }
            });
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
            url: './fansPage/fansPage?fansId=' + e.currentTarget.dataset.id
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
