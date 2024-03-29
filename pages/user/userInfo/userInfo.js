const app = getApp();
import utils from '../../../utils/utils';

Page({
    data: {
        userInfo: {},
        userToken: null,
        isPointOut: true,
        pointOutText: "温馨提示：请点击编辑信息授权获取您的个人信息",
        tabIndex: 1,
        txt: '',
        goodList: [],
        collectionList: [],
        userId: '',
        userHead: '' || 'https://static2.zugeliang01.com/lease/img/de7c2f80-90e2-11e9-a258-4ba5c91f867b.png'
    },
    onLoad() {
        app.httpsRequest('/api/user/getUserDetail', {}, true).then( res => {
            if (res.code) {
                this.setData({
                    userInfo: res.data,
                    isPointOut: res.data.school? false: true
                })
            }
        });
        this.getUserCommodityList()
        this.getCollectList()
    },
    getUserCommodityList() {
        app.httpsRequest('/api/user/getUserCommodityList', {}).then(res => {
            let data = utils.isObjNull(res.data)?[]: res.data;
            this.setData({
                goodList: data
            });
            if (data.length > 0) {
                this.fillData(true, data, 'userWaterView')
            }
        })
    },
    getCollectList() {
        app.httpsRequest('/api/user/getCollectionList', {}).then(res => {
            const data = utils.isObjNull(res.data)?[]: res.data;
            this.setData({
                collectionList: data
            });
            if (data.length > 0) {
                this.fillData(true, data, 'collectWaterView')
            }
        })
    },
    choseFansType(e){
        this.setData({
            tabIndex: e.target.dataset.index
        });
        if (e.target.dataset.index === 1) {
            this.getUserCommodityList()
        } else {
            this.getCollectList()
        }
    },
    onCloseBtn() {
        this.setData({
            isPointOut: false
        })
    },
    fillData(isFull, goods, id) {
        let view = this.selectComponent('#' + id);
        view.fillData(isFull, goods);
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
    getFans(e) {
        let isFans = isFans = 'userInfo.isFans';
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
