var leftList = new Array();//左侧集合
var rightList = new Array();//右侧集合
var leftHight = 0, rightHight = 0, itemWidth = 0, maxHeight = 0;

Component({
  properties: {},
  data: {
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
      });
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