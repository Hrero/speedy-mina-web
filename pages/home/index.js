const app = getApp();

Page({
    data:{
        userInfo: {},
        goodList:[],
        searchText: '',
        innerHeight: '',
        activeC: 0,
        pageSize: 5,
        pageNum: 1,
        loading: false,
        isShowTopLoad: false,
        type: 0,
        tabs: [],
        goodTab: [],
        pointOutText: '当前物品为全部学校，如需查看自己学校可到金掌柜设置',
        isPointOut: true,
		showSkeleton: true // 骨架屏显示隐藏
    },
    onLoad(query){
		setTimeout(() => {     // 2S后隐藏骨架屏
			this.setData({
				showSkeleton: false
			})
        }, 2000)
        this.getHeight().then(res => {
            this.setData({
                innerHeight: res + 'px'
            })
        })
        this.getUserSchool().then(res => {
            if (res) {
                app.httpsRequest('/api/user/getEverybodySearching', {}, true).then( res => {
                    if (res.code) {
                        this.setData({
                            searchText: res.data.searchArrayList[0].text
                        })
                    }
                });
                app.httpsRequest('/api/getCommodityTypeList', {}, true).then(res => {
                    if (res.code) {
                        this.setData({
                            tabs: res.data
                        })
                    }
                })
                this.getIndexData({
                    type: 0,
                    pageSize: this.data.pageSize,
                    pageNum: 1
                }).then( res => {
                    const data = res.data.data;
                    this.fillData(true , data);
                });
            }
        })
    },
    getUserSchool() {
        return new Promise((r, j) => {
            app.httpsRequest('/api/user/getUserDetail', {}, true).then( res => {
                if (res.code) {
                    this.setData({
                        userInfo: res.data,
                        isPointOut: res.data.nickName? false: true
                    })
                    r(app.getSchoolName(encodeURI(res.data.school)))
                }
            });
        })
    },
    getHeight() {
        let headScroll = 0;
        return new Promise((r, j) => {
            wx.getSystemInfo({
                success: (data) => {
                    var scrollwrap = wx.createSelectorQuery();
                    scrollwrap.select('.scrollwrap').boundingClientRect((rect) => {
                        headScroll = rect.height;
                        var headWrap = wx.createSelectorQuery();
                        headWrap.select('.headWrap').boundingClientRect((res) => {
                            headScroll = headScroll + res.height
                            headScroll = data.windowHeight - headScroll
                            r(headScroll)
                        }).exec();
                    }).exec();
                }
            });
        })
    },
    onCloseBtn() {
        this.setData({
            isPointOut: false
        })
    },
    downList() {
        console.log(9)
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
            type: this.data.type
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
    bindscrollInfo(e) {
        if (e.detail.scrollTop < -110) {
            if (wx.vibrateShort) {
                wx.vibrateShort()
            }
            this.setData({
                isShowTopLoad: true
            })
            setTimeout(res => {
                this.setData({
                    isShowTopLoad: false
                })
                wx.hideNavigationBarLoading();
                wx.stopPullDownRefresh();
                this.setData({
                    pageSize: this.data.pageSize,
                    pageNum: this.data.pageNum + 1,
                    goodList: []
                }, res => {
                    this.getIndexData({
                        pageSize: this.data.pageSize,
                        pageNum: this.data.pageNum,
                        type: this.data.type
                    }).then( res => {
                        const data = res.data.data;
                        this.fillData(true , data);
                    });
                })
            }, 2000)
        }
    },
    tabsGetList(e) {
        this.setData({
            pageSize: this.data.pageSize,
            pageNum: 1,
            goodList: [],
            type: e.currentTarget.dataset.index,
            activeC: e.currentTarget.dataset.index
        }, res => {
            this.getIndexData({
                pageSize: this.data.pageSize,
                pageNum: this.data.pageNum,
                type: e.currentTarget.dataset.index
            }).then( res => {
                const data = res.data.data;
                this.fillData(true , data);
            });
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
    fillData(isFull, goods) {
        let view = this.selectComponent('#waterFallView');
        view.fillData(isFull, goods);
    },
    toDetailPage(e) {
        wx.navigateTo({
            url: './detail/detail?commodityId=' + e.currentTarget.dataset.id
        });
    },
    toSearchPage() {
        wx.navigateTo({
            url: './search/search'
        });
    }
});
