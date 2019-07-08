const app = getApp();
import allUnivList from '../../../utils/universities';
Page({
    data: {
        userInfo: {},
        array: ['女', '男'],
        index: 0,
        nickName: '',
        studentNumber: '',
        phoneNumber: '',
        name: '',
        signature: '',
        sex: 0,
        school: '',
        birthday: '2016-09-01',
        multiIndex: [0, 0],
        multiArray: []
    },
    onLoad() {
        this.setData({
            multiArray: [[...allUnivList], [...allUnivList[0].univs]]
        })
        this.getUserDetail()
    },
    getUserDetail() {
        app.httpsRequest('/api/user/getUserDetail', {}).then( res => {
            if (res.code) {
                this.setData({
                    userInfo: res.data,
                    nickName: res.data.nickName || '',
                    school: res.data.school || this.data.multiArray[1][this.data.multiIndex[1]].name,
                    studentNumber: res.data.studentNumber || '',
                    phoneNumber: res.data.phoneNumber || '',
                    sex: res.data.sex || 0,
                    name: res.data.name || '',
                    birthday: res.data.birthday || '2016-09-01',
                    signature: res.data.signature || ''
                })
            }
        });
    },
    setDateFnFather({ key, value }) {
        console.log(key, value, 111)
        if (!key || !value) {
            return
        }
        this.setData({
            [key]: value
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
    bindPickerChange(e) { // 性别
        app.httpsRequest('/api/user/userUpdate', {
            sex: Number(e.detail.value)
        }).then( res => {
            this.getUserDetail()
        });
    },
    bindDateChange(e) {
        this.setData({
            birthday: e.detail.value
        })
        app.httpsRequest('/api/user/userUpdate', {
            birthday: e.detail.value
        }).then( res => {
            this.getUserDetail()
        });
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
    toEditUserInfo(e) {
        wx.navigateTo({
            url: '../toEditUserInfo/toEditUserInfo?index=' + e.currentTarget.dataset.index
        });
    }
})
