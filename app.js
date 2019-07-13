import { navigateTo } from "./navigateTo";
import publicInfo from "./public";
const utils = require('./utils/md5.js');

App({
    ...publicInfo,
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
    /**
     * yucang 整理于 2018年11月19日
     */
    appId: 'wx5aaaec189466b376',
    secret: '5f25cab72ad17562a5cd14cdaa18aa47',
    // httpUrl: 'https://jd.zugeliang01.com', //线上请求地址
    // httpUrl: '192.168.0.113:8000', //请求地址
    // httpUrl: 'http://127.0.0.1:8000', //请求地址
    httpUrl: 'http://192.168.1.70:8000', //请求地址
    // httpUrl: 'http://192.168.0.120:8000', //请求地址
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
    speedyForWeChatUser(){
        wx.login({ // 获取openId
            success: (login) => {
                this.httpsRequest('/api/xcx/weChat/getWeChatId', {
                    appid: this.appId,
                    secret: this.secret,
                    js_code: login.code,
                    grant_type: 'authorization_code'
                }, true).then( loginInfo => {
                    this.openId = loginInfo.openid;
                    this.sessionKey = loginInfo.session_key;
                    this.httpsRequest('/api/xcx/weChat/thirdLoginIn', {
                        openId: loginInfo.openid
                    }, true).then(res => {
                        if (res.data.token) {
                            this.userId = res.data.userId;
                            this.userToken = res.data.token;
                            wx.setStorage({
                                key: "token",
                                data: res.data.token
                            });
                        }
                    })
                    wx.getSetting({ // 获取授权信息
                        success: (settingInfo) => {
                            if (settingInfo.authSetting['scope.userInfo']) {
                                wx.getUserInfo({
                                    success: (weChatInfo) => { // 已授权用户获取Uid直接登陆
                                        this.userInfo = weChatInfo.userInfo;
                                        this.speedyForWechatUid(weChatInfo);
                                    }
                                })
                            }
                        }
                    });
                });
            }
        });
    },

    speedyForWechatUid({encryptedData, iv, userInfo}){
        this.userInfo = userInfo;
        return new Promise((resolve) => {
            this.httpsRequest('/api/xcx/weChat/getUnionId', {
                appId: this.appId,
                sessionKey: this.sessionKey,
                encryptedData: encryptedData,
                iv: iv
            }, true).then(res => {
                this.speedyForWeChatLogin(res).then( zglInfo => resolve(zglInfo));
            });
        });
    },
    speedyForWeChatLogin({openId, avatarUrl, nickName}){
        const params = {
            platform: 'weChat'
        };
        if(nickName) {
            params['openId'] = openId;
            params['nickName'] = nickName;
            params['avatarUrl'] = avatarUrl;
        }
        return new Promise( resolve => {
            this.httpsRequest('/api/pcmall/user/authInfo', params, true).then(res => {
                if(res.code) {
                    resolve({});
                } else {
                    resolve({});
                }
            })
        })
    },
    speedyForWechattoken(e) {
        return new Promise((resolve) => {
            this.httpsRequest('/api/xcx/weChat/getUnionId', {
                appId: this.appId,
                sessionKey: this.sessionKey,
                encryptedData: e.encryptedData,
                iv: e.iv
            }, true).then(res => {
                resolve(res.phoneNumber)
            });
        });
    },
    getwxlogin(e){
        return new Promise((resolve, reject) => {
            this.speedyForWechattoken(e.detail).then(iphone => {
                const last = iphone.substr(iphone.length-1,1)
                let mdiphone = utils.hexMD5(iphone + last);
                this.httpsRequest('/api/pcmall/user/auth_phone_login', {
                    phone: iphone,
                    sign: mdiphone,
                    share_code: this.shareCode,
                    platform: 'weChat'
                }, true).then(res => {
                    if (res.code === 0) {
                        this.userId = res.data.userId;
                        this.userToken = res.data.token;
                        resolve({code: 0})
                    } else {
                        wx.showModal({
                            content: res.msg,
                            showCancel: false,
                            confirmText:'我知道了',
                            success: () => {
                                reject({});
                            },
                        });
                    }
                });
            })
        })
    },
    getSchoolName(school) {
        return new Promise((r, j) => {
            this.school = school;
            r(true)
        })
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
