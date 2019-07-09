const app = getApp();
var leftList = new Array();//左侧集合
var rightList = new Array();//右侧集合
var leftHight = 0, rightHight = 0, itemWidth = 0, maxHeight = 0;

Component({
  properties: {},
  data: {
    listData: [],
    leftList: [],//左侧集合
    rightList: [],//右侧集合
  },

  attached: function () {
    wx.getSystemInfo({
      success: (res) => {
        let percentage = 750 / res.windowWidth;
        let margin = 30 / percentage;
        itemWidth = (res.windowWidth - margin) / 2;
        maxHeight = itemWidth / 0.8
      }
    });
  },
  methods: {
    fillData: function (isPull, listData) {
      if (isPull) { //是否下拉刷新，是的话清除之前的数据
        leftList.length = 0;
        rightList.length = 0;
        leftHight = 0;
        rightHight = 0;
      }
      for (let i = 0, len = listData.length; i < len; i++) {
        let tmp = listData[i];
        tmp.width = parseInt(tmp.firstImgWidth);
        tmp.height = parseInt(tmp.firstImgHeight);
        tmp.itemWidth = itemWidth
        let per = tmp.width / tmp.itemWidth;
        tmp.itemHeight = tmp.height / per;
        if (tmp.itemHeight > maxHeight) {
          tmp.itemHeight = maxHeight;
        }
        if (leftHight == rightHight) {
          leftList.push(tmp);
          leftHight = leftHight + tmp.itemHeight;
        } else if (leftHight < rightHight) {
          leftList.push(tmp);
          leftHight = leftHight + tmp.itemHeight;
        } else {
          rightList.push(tmp);
          rightHight = rightHight + tmp.itemHeight;
        }
      }
      this.setData({
        leftList: leftList,
        rightList: rightList,
        listData: listData
      });
    },
    toLikeclick(e) {
        let item = {};
        let list = '';
        let idx = '';
        let status = 0;
        let id = e.currentTarget.dataset.id;
        this.data.leftList.forEach((element, index) => {
            if (element._id === id) {
                item = element
                status = element.isLike? 0: 1;
                list = 'left';
                idx = index;
            }
        });
        this.data.rightList.forEach((element, index) => {
            if (element._id === id) {
                item = element
                status = element.isLike? 0: 1;
                list = 'right';
                idx = index;
            }
        });
        app.httpsRequest('/api/user/addLike', {
            commodityId: item._id,
            status: status
        }).then(res => {
            if (list === 'right') {
                let like = 'rightList['+ idx + '].like';
                let isLike = 'rightList[' + idx + '].isLike';
                if (res.code) {
                    this.setData({
                        [like]: this.data.rightList[idx].like + 1,
                        [isLike]: status
                    })
                } else {
                    this.setData({
                        [like]: this.data.rightList[idx].like - 1,
                        [isLike]: status
                    })
                }
            } else {
                let like = 'leftList['+ idx + '].like';
                let isLike = 'leftList[' + idx + '].isLike';
                if (res.code) {
                    this.setData({
                        [like]: this.data.leftList[idx].like + 1,
                        [isLike]: this.data.leftList[idx].isLike = status
                    })
                } else {
                    this.setData({
                        [like]: this.data.leftList[idx].like - 1,
                        [isLike]: this.data.leftList[idx].isLike = status
                    })
                }
            }
            wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 1000
            })
        })
    },
    toDetailPage(e) {
        wx.navigateTo({
            url: '/pages/home/detail/detail?commodityId=' + e.currentTarget.dataset.id
        });
    },
    onCloseBtn() {
        this.triggerEvent('onCloseBtn')
    }
  }
})