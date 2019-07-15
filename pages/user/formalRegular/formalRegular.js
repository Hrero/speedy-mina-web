const app = getApp();
import allUnivList from '../../../utils/universities';
Page({
    data: {
        value: '',
        type: null,
        userInfo: {},
        imgList: [],
        imgInfoList: [],
        imgMaxHeight: 0,
        width: app.windowWidth,
        multiIndex: [0, 0],
        activeT: null,
        multiArray: [],
        productDes: '',
        commodityTypeList: [],
        school: '',
        height: ''
    },
    onLoad() {
        this.setData({
            multiArray: [[...allUnivList], [...allUnivList[0].univs]]
        })
        app.httpsRequest('/api/getCommodityTypeList').then(res => {
            let data = res.data;
            data.shift();
            if (res.code) {
                this.setData({
                    commodityTypeList: data
                })
            }
        })
    },
    handleType(e) {
        if (e.currentTarget.dataset.index === this.data.activeT) {
            this.setData({
                activeT: null,
                type: null
            })
        } else {
            this.setData({
                activeT: e.currentTarget.dataset.index,
                type: e.currentTarget.dataset.type
            })
        }
    },
    onShow() {
        this.getUserDetail()
    },
    getUserDetail() {
        app.httpsRequest('/api/user/getUserDetail', {}).then( res => {
            if (res.code) {
                this.setData({
                    userInfo: res.data,
                    school: res.data.school || this.data.multiArray[1][this.data.multiIndex[1]].name
                })
            }
        });
    },
    setUserPhoto() {
        wx.chooseImage({
            count: 3,
            success: (res) => {
                this.uploadImg(res.tempFilePaths);
            }
        });
    },
    getImgList(imgList) {
        const imgHeight = (imgList) => {
            let arr = [];
            return new Promise((r, j) => {
                for (let i=0;i<imgList.length;i++) {
                    imgProxy(imgList[i]).then(res => { // { width: xxx, height: xxx }
                        arr.push({ height: res.height, width: res.width, path: res.imgH})
                        if (arr.length == imgList.length) {
                            this.setData({
                                imgInfoList: arr
                            }, () => {
                                r(arr)
                            })
                        }
                    }) 
                }
            })
        }
        const imgProxy = (imgH) => {
            return new Promise((r, j) => {
                wx.getImageInfo({
                    src: imgH,
                    success: (avatar) => {
                        r({...avatar, imgH})
                    },
                    fail: (errMsg) => {
                        wx.showToast({
                            title: '获取图片失败:' + JSON.stringify(errMsg),
                            icon: 'none',
                            duration: 10000
                        })
                    }
                });
            })
        }
        const picMaxHeight = (list) => {
            return new Promise((rev, rej) => {
                let max = 0;
                for (let i=0; i< list.length;i++) {
                    setTimeout(res => {
                        if (max < list[i].height) {
                            max = list[i].height
                        }
                        if (i == list.length - 1) {
                            let revObj = {
                                width: list[i].width,
                                height: list[i].height,
                                size: list[i].width/list[i].height
                            }
                            this.setData({
                                imgMaxHeight: revObj
                            }, () => {
                                rev({ imgMaxHeight: revObj })
                            })
                        }
                    }, 50)
                }
            })
        }
        imgHeight(imgList).then(res => {
            picMaxHeight(res).then(revObj => { // {imgMaxHeight: { height:200, size: 1, width: 200 }}
                this.setData({
                    height: this.data.width / revObj.imgMaxHeight.size
                }, () => {
                    console.log(this.data.height)
                })
            })
        })
    },
    uploadImg(img){
        wx.showLoading({
            content: '上传中',
        });
        forProxy(img).then(res => {
            let picList = [];
            for (let i=0;i< res.length; i++) {
                picList.push(res[i].cdnPath + '/' + res[i].rows)
            }
            this.getImgList(picList) // ['http://www.img.png']
        })
        function forProxy(img) {
            let arr = [];
            return new Promise((r, j) => {
                for (let i=0; i< img.length; i++) {
                    proxy(img[i]).then(res => {
                        arr.push(res)
                        if (arr.length == img.length) {
                            wx.hideLoading();
                            r(arr)
                        }
                    })
                }
            })
        }
        function proxy(item) {
            return new Promise((r, j) => {
                wx.uploadFile({
                    url: 'https://crm.zugeliang01.com/api/image/upload',
                    name: 'files',
                    filePath: item,
                    success: (res) => {
                        wx.hideLoading();
                        const response = JSON.parse(res.data);
                        if (response && response.data.cdnPath && response.data.rows && response.data.rows.length) {
                            r(response.data)
                        } else {
                            wx.showModal({
                                content: '上传失败'
                            });
                        }
                    },
                });
            })
        }
    },
    changeInput(e) {
        this.setData({
            value: e.detail.value
        })
    },
    bindTextAreaBlur(e) {
        this.setData({
            productDes: e.detail.value
        })
    },
    bindMultiPickerChange(e) {
        this.setData({
            multiIndex: e.detail.value
        })
        app.httpsRequest('/api/user/userUpdate', {
            school: this.data.multiArray[1][this.data.multiIndex[1]].name
        }).then( res => {
            this.getUserDetail()
        });
    },
    bindMultiPickerColumnChange(e) {
        let data = {
            multiArray: this.data.multiArray,
            multiIndex: this.data.multiIndex
        };
        data.multiIndex[e.detail.column] = e.detail.value;
        switch (e.detail.column) {
            case 0:
                data.multiArray[1] = allUnivList[e.detail.value].univs;
                break;
        }
        this.setData({
            multiArray: this.data.multiArray,
            multiIndex: this.data.multiIndex,
            school: this.data.multiArray[1][this.data.multiIndex[1]].name
        })
    },
    toAddCommodity(e) {
        let data = {};
        data.imageUrl = JSON.stringify(this.data.imgInfoList);
        data.productDes = this.data.productDes;
        data.phoneNumber = this.data.userInfo.phoneNumber;
        data.school = this.data.school;
        data.type = this.data.type || 10;
        data.firstImgHeight = this.data.imgInfoList[0].height;
        data.firstImgWidth = this.data.imgInfoList[0].width;
        data.imgMaxHeight = JSON.stringify(this.data.imgMaxHeight);
        for (const key in data) {
            if (data[key] === undefined || data[key] === "") {
                wx.showToast({
                    title: '信息不全',
                    icon: 'none',
                    duration: 1000
                })
                return;
            }
        }
        app.httpsRequest('/api/user/saveCommodity', data).then(res => {
            if (res.code) {
                wx.switchTab({
                    url: '../index'
                })
                wx.showToast({
                    title: '已提交审核，请耐心等待！',
                    icon: 'none',
                    duration: 1000
                })
            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 1000
                })
            }
        });
    }
})
