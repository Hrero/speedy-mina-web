const app = getApp();

Page({
    data:{
        userInfo: {},
        goodList:[],
        searchText: '',
        activeC: 0,
        pageSize: 20,
        pageNum: 1,
        loading: false,
        isShowTopLoad: false,
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
        app.httpsRequest('/api/user/getUserDetail', {}, true).then( res => {
            if (res.code) {
                this.setData({
                    userInfo: res.data,
                    isPointOut: res.data.nickName? false: true
                })
            }
        });
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
    },
    onShow() {
        this.getIndexData({
            type: 0,
            pageSize: this.data.pageSize,
            pageNum: 1
        }).then( res => {
            const data = res.data.data;
            this.fillData(true , data);
        });
    },
    onCloseBtn() {
        this.setData({
            isPointOut: false
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
                    pageNum: 1,
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
