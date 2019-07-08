const app = getApp();
Page({
    data: {
        type: 'text',
        queryIndex: 0,
        value: '',
        params: {
            nickName: '',
            studentNumber: '',
            phoneNumber: '',
            name: '',
            signature: ''
        }
    },
    onLoad(query) {
        switch (Number(query.index)) {
            case 1:
                this.setData({
                    type: 'text',
                    params: {
                        nickName: this.data.value
                    }
                })
                break;
                case 2:
                    this.setData({
                        type: 'text',
                        params: {
                            signature: this.data.value
                        }
                    })
                    break;
                    case 3:
                        this.setData({
                            type: 'number',
                            params: {
                                studentNumber: this.data.value
                            }
                        })
                        break;
                        case 4:
                            this.setData({
                                type: 'number',
                                params: {
                                    phoneNumber: this.data.value
                                }
                            })
                            break;
                            case 5:
                                this.setData({
                                    type: 'text',
                                    params: {
                                        name: this.data.value
                                    }
                                })
                                break;
        }
        this.setData({
            queryIndex: Number(query.index)
        })
    },
    changeInput(e) {
        this.setData({
            value: e.detail.value
        })
        switch (this.data.queryIndex) {
            case 1:
                this.setData({
                    params: {
                        nickName: this.data.value
                    }
                })
                break;
                case 2:
                    this.setData({
                        params: {
                            signature: this.data.value
                        }
                    })
                    break;
                    case 3:
                        this.setData({
                            params: {
                                studentNumber: this.data.value
                            }
                        })
                        break;
                        case 4:
                            this.setData({
                                params: {
                                    phoneNumber: this.data.value
                                }
                            })
                            break;
                            case 5:
                                this.setData({
                                    params: {
                                        name: this.data.value
                                    }
                                })
                                break;
        }
    },
    getInfoValue() {
        let key = '';
        switch (this.data.queryIndex) {
            case 1:
                key = 'nickName'
            break;
                case 2:
                key = 'signature'
            break;
                case 3:
                key = 'studentNumber'
            break;
                case 4:
                key = 'phoneNumber'
            break;
                case 5:
                key = 'name'
            break;
        }
        let valueObj = {
            key: key,
            value: this.data.value
        }
        return valueObj
    },
    toEditUserUpdate(e) {
        app.httpsRequest('/api/user/userUpdate', this.data.params).then( res => {
            var pages = getCurrentPages();
            if(pages.length > 1){
                var prePage = pages[pages.length - 2];
                prePage.setDateFnFather(this.getInfoValue());
                wx.navigateBack({
                    delta: 1
                })
            }
        });
    }
})
