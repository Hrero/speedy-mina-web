const amapFile = require('./amap-wx.js');
const app = getApp();
export default {
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
    getSchoolName(school) {
        return new Promise((r, j) => {
            this.school = school;
            r(true)
        })
    },
    getWechatLocationInfo() {
        return new Promise((success, j) => {
            wx.getLocation({
                type: 'gcj02',
                success: (res) => {
                    let latitude = res.latitude
                    let longitude = res.longitude
                    console.log(res)
                    let myAmapFun = new amapFile.AMapWX({ key: this.mapkey });
                    let getRegeo = new Promise((r, j) => {
                        myAmapFun.getRegeo({
                            location: '' + longitude + ',' + latitude + '',
                            success: (data) => {
                                r(data);
                            },
                            fail: (info) => {
                                console.log(info)
                            }
                        });
                    })
                    let getWeather = new Promise((r, j) => {
                        myAmapFun.getWeather({
                            success: (data) => {
                                r(data)
                            },
                            fail: (info) => {
                                console.log(info)
                            }
                        })
                    })
                    Promise.all([getWeather, getRegeo]).then((values) => {
                        // {
                        //     info: values[0],
                        //     address: values[1][0].regeocodeData.formatted_address
                        // }
                        // success(values[1][0].regeocodeData.addressComponent.township + values[1][0].regeocodeData.addressComponent.neighborhood.name)
                        success(values[1][0].regeocodeData)
                    });
                }
            })
        })
    },
    getWechatRun() {
        return new Promise(r => {
            wx.getWeRunData({
                success: (res) => {
                    this.getWechatUnionId({
                        appId: this.appid,
                        sessionKey: this.sessionKey,
                        encryptedData: res.encryptedData,
                        iv: res.iv
                    }, false).then(res => {
                        let step = res.stepInfoList[res.stepInfoList.length - 1].step;
                        r(step);
                    })
                },
                fail: (res) => {
                    wx.showModal({
                        title: '提示',
                        content: '开发者未开通微信运动，请关注“微信运动”公众号后重试',
                        showCancel: false,
                        confirmText: '知道了'
                    })
                }
            })
        })
    },
    getWechatCopy(copyData) {
        return new Promise(r => {
            wx.setClipboardData({
                data: copyData
            })
        })
    },
    getInnerHeight(list) {
        let arr = [...list];
        let heightArr = [];
        let max = 0;
        return new Promise((r, j) => {
            wx.getSystemInfo({
                success: (height) => {
                    for (let i=0; i < arr.length; i++) {
                        let headWrap = wx.createSelectorQuery();
                        headWrap.select('.'+ arr[i]).boundingClientRect((res) => {
                            heightArr.push(res.height)
                            max += res.height
                            if (i == arr.length - 1) {
                                r(height.windowHeight - max)
                            }
                        }).exec()
                    }
                }
            })
        })
    },
    getContentHeight(list) {
        let arr = [...list];
        let heightArr = [];
        let max = 0;
        return new Promise((r, j) => {
            wx.getSystemInfo({
                success: (height) => {
                    for (let i=0; i < arr.length; i++) {
                        let headWrap = wx.createSelectorQuery();
                        headWrap.select('.'+ arr[i]).boundingClientRect((res) => {
                            heightArr.push(res.height)
                            max += res.height
                            if (i == arr.length - 1) {
                                r(max)
                            }
                        }).exec()
                    }
                }
            })
        })
    },
    navigateTo(path) {
        const length = getCurrentPages().length;
        const currentRoute = getCurrentPages()[length - 1].route;
        const pathIndex = currentRoute.split('/').length;
        let url = "";
        for (let i = 0; i < pathIndex - 1; i++) {
            url += '../'
        }
        path = url + path;
        wx.navigateTo({
            url: path
        })
    }
}