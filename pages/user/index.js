const app = getApp();
import utils from '../../utils/utils';
import Socket from '../../utils/socket';
const SocketApi = new Socket();
Page({
    data: {
        userInfo: {},
        userToken: null,
        message: 0,
        isPointOut: true,
        pointOutText: "温馨提示：请点击编辑信息授权获取您的个人信息",
        tabIndex: 1,
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
        SocketApi.onConnect(data => {
            wx.onSocketMessage(res => {
                let message = 'userInfo.message'
                console.log(res)
                // this.setData({
                //     [message]: JSON.parse(res.data).data.length
                // })
            })
        })
    },
    onShow() {
        app.httpsRequest('/api/user/getUserDetail', {}, true).then( res => {
            if (res.code) {
                this.setData({
                    userInfo: res.data,
                    isPointOut: res.data.school? false: true
                })
            }
        });
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
            let arr = [];
            data.forEach(item => {
                arr.push(item.dep)
            })
            this.setData({
                collectionList: arr
            });
            if (data.length > 0) {
                this.fillData(true, arr, 'collectWaterView')
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
    toMessagePage() {
        wx.navigateTo({
            url: './message/message'
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
