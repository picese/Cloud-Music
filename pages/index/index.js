// pages/index/index.js
import player from '../../component/player.js'
Page({
  /**
   * 页面的初始数据
   **/
  data: {
    selected: true,
    unselected: false,
    songLists: '',
    slider: '',
    rankingList: ''
  },
  /**
   * 生命周期函数--监听页面加载
   **/
  onLoad: function(options) {
    this.player = this.selectComponent("#player");
    wx.showLoading({
      title: '加载中',
    });

    this.getSlider();
    this.getSongLists();
    this.getRankingList();
    this.player.collection();
    this.player.getSongMsg();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  // 获取轮播图
  getSlider: function() {
    const that = this;
    wx.request({
      url: 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&uin=0&needNewCode=1',
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        that.setData({
          slider: res.data.data.slider
        })
        wx.hideLoading();
      }
    })
  },

  // 获取热门歌单
  getSongLists: function() {
    const that = this;
    wx.request({
      url: 'http://ustbhuangyi.com/music/api/getDiscList?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&platform=yqq&hostUin=0&sin=0&ein=29&sortId=5&needNewCode=0&categoryId=10000000',
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        that.setData({
          songLists: res.data.data.list
        });
        wx.hideLoading();
      }
    })
  },

  // 获取排行榜
  getRankingList: function() {
    wx.request({
      url: 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&uin=0&needNewCode=1&platform=h5',
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        this.setData({
          rankingList: res.data.data.topList
        })
      }
    })
  },

  // tab栏切换
  selected: function(e) {
    this.setData({
      unselected: false,
      selected: true
    })
  },
  unselected: function(e) {
    this.setData({
      selected: false,
      unselected: true
    })
  },

  // 跳转搜索页
  search: function() {
    wx.navigateTo({
      url: "../search/search"
    })
  },

})