const app = getApp();
import utils from '../../../utils/utils';

Page({
    data:{
        searchText: '',
        isList: false,
        loading: false,
        innerHeight: '',
        tabIndex: 1,
        goodList: [],
        pageSize: 5,
        activeSeach: true,
        pageNum: 1,
        txt: '',
        userSearchList: [],
        searchArrayList: []
    },
    onLoad(query){
        app.httpsRequest('/api/user/getEverybodySearching').then( res => {
            if (res.code) {
                this.setData({
                    searchText: res.data.searchArrayList[0].text,
                    searchArrayList: res.data.searchArrayList,
                    userHistorySearch: res.data.userHistorySearch
                })
            }
        });
        this.getHeight().then(res => {
            this.setData({
                innerHeight: res + 'px'
            })
        })
    },
    getHeight() {
        let headScroll = 0;
        return new Promise((r, j) => {
            wx.getSystemInfo({
                success: (data) => {
                    var scrollwrap = wx.createSelectorQuery();
                    scrollwrap.select('.home-bottom-tab-clone').boundingClientRect((rect) => {
                        console.log(rect)
                        headScroll = rect.height;
                        var headWrap = wx.createSelectorQuery();
                        headWrap.select('.headWrap').boundingClientRect((res) => {
                            headScroll = headScroll + res.height
                            headScroll = data.windowHeight - headScroll
                            console.log(data.windowHeight, rect, res)
                            r(headScroll)
                        }).exec();
                    }).exec();
                }
            });
        })
    },
    downList() {
        if (this.data.loading) {
            return false
        }
        this.setData({
            loading: true,
            pageNum: this.data.pageNum + 1
        })
        this.getIndexData({
            pageSize: this.data.pageSize,
            pageNum: this.data.pageNum,
            keyword: this.data.searchText
        }).then(res => {
            const data = res.data.data;
            setTimeout(res => {
                this.setData({
                    loading: false
                });
                this.fillData(false , data);
            }, 1000)
        })
    },
    getIndexData(params) {
        return new Promise((r, j) => {
            app.httpsRequest('/api/user/getCommodityList', params, true).then( res => {
                if (res.code) {
                    r(res)
                }
            });
        })
    },
    changeSearch(e) {
        if (e.detail.value) {
            this.setData({
                activeSeach: true,
                searchText: e.detail.value
            })
        } else {
            this.setData({
                activeSeach: false,
                searchText: e.detail.value
            })
        }
    },
    handleSearch(e) {
        if (!this.data.searchText) {
            return
        }
        if (e.currentTarget.dataset.text) {
            this.setData({
                searchText: e.currentTarget.dataset.text
            })
        }
        this.getIndexData({
            pageSize: this.data.pageSize,
            pageNum: this.data.pageNum,
            keyword: this.data.searchText
        }).then( res => {
            if (wx.vibrateShort) {
                wx.vibrateShort()
            }
            const data = res.data.data;
            this.data.userHistorySearch.push({search: this.data.searchText})
            this.setData({
                userHistorySearch: this.data.userHistorySearch,
                goodList: utils.isObjNull(data)?[]: data,
                isList: true
            })
            this.fillData(true , data);
        });
        app.httpsRequest('/api/user/getUserList', {
            keyword: this.data.searchText
        }).then(res => {
            let data = res.data.data
            if (res.code) {
                this.setData({
                    userSearchList: utils.isObjNull(data)?[]: data,
                })
            }
        })
    },
    fillData(isFull, goods) {
        let view = this.selectComponent('#waterFallView');
        view.fillData(isFull, goods);
    },
    choseFansType(e){
        this.setData({
            tabIndex: e.target.dataset.index
        });
    },
    goBackSearch() {
        this.setData({
            isList: false
        })
    },
    getFans(e) {
        let isFans = 'userSearchList['+ e.currentTarget.dataset.index +'].isFans';
        let status = e.currentTarget.dataset.isfans? 0: 1;
        console.log(isFans)
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
    toUserInfo(e) {
        wx.navigateTo({
            url: '../../user/userInfo/userInfo?userId=' + e.currentTarget.dataset.id
        });
    },
    onDeleteThis() {
        app.httpsRequest('/api/user/deleteUserSearch').then(res => {
            if (res.code) {
                wx.showToast({
                    title: '清除成功',
                    icon: 'none',
                    duration: 1000
                })
                this.setData({
                    userHistorySearch: []
                })
            }
        })
    }
});
