import wechats from './utils/wechat'
const utils = require('./utils/md5.js');

App({
    ...wechats,
    isIphoneX: false,
    userCredit: null,
    shareCode: null,
    authCode: null,
    isAgree: false,
    isEditMail: false,
    toReLoad: false,
    school: '',
    user: null,
    sessionKey: null,
    name: null,
    iphone: null,
    passed: null,
    thirdQuery: null,
    windowWidth: 750,
    appId: 'wx5aaaec189466b376',
    secret: '5f25cab72ad17562a5cd14cdaa18aa47',
    // httpUrl: 'https://lmyear.com', // 线上请求地址
    // httpUrl: '192.168.0.113:8000', // 请求地址
    // httpUrl: 'http://127.0.0.1:8000', // 请求地址
    httpUrl: 'http://192.168.0.178:8000', // 请求地址
    socketUrl: 'ws://192.168.0.178:8000',
    sourceName: 'weChat_app_speedy',
    userToken: null,
    userInfo: null,
    userId: null,
    openid: null,
    pickCouponOff: false,
    onLaunch(options) {
        this.speedyForWeChatUser();
        wx.getStorage({
            key: 'token',
            success: (token) => {
                this.userToken = token.data || ''
            }
        });
        wx.getSystemInfo({
            success: (res) => {
                this.windowWidth = res.windowWidth || 750;
            }
        });
    },
    httpsRequest(URL, PARAMS, SHOWLOAD) {
        const self = this;
        return new Promise((resolve, reject) => {
            if(!SHOWLOAD) {
                wx.showLoading();
            }
            wx.request({
                url: this.httpUrl + URL,
                method: 'POST',
                dataType: 'json',
                data: PARAMS,
                header: {
                    'Content-Type': 'application/json',
                    'X-Request-Source': self.sourceName,
                    'authorization': self.userToken || '',
                    'cookie': 'school=' + self.school,
                    'X-Request-Version':'v2'
                },
                success: (res) => {
                    resolve(res.data);
                },
                fail: (res) => {
                    wx.showModal({
                        content: '网络出了点小问题，请重试！',
                        showCancel:false,
                        confirmText:'我知道了',
                        success: (res) => {
                            reject({});
                        },
                    });
                },
                complete: (res) => {
                    wx.hideLoading();
                }
            });
        })
    }
});
