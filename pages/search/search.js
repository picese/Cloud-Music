// pages/search/search.js
import player from '../../component/player.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyword: '',
    hotKey: '',
    songList: [],
    searchData: '',
    none: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    });
    this.player = this.selectComponent("#player");
    this.player.collection();
    this.player.getSongMsg();
    this.getHotSearchData();
    this.getSearchData();
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
  onHide: function() {

  },

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
    this.setData({
      n: 30
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  // 获取搜索框，热搜值
  keyword: function(e) {
    this.setData({
      keyword: e.detail.value || e.currentTarget.dataset.key || e.currentTarget.dataset.name
    });
    this.getData();
    this.preservation();
    this.none();
  },

  // 获取搜索数据
  getData: function() {
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: 'http://ustbhuangyi.com/music/api/search?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&w=' + this.data.keyword + '&catZhida=1&zhidaqu=1&n=30&t=0&flag=1&ie=utf-8&sem=1&aggr=0&remoteplace=txt.mqq.all&uin=0&needNewCode=1&platform=h5',
      data: {},
      success: (res) => {
        this.setData({
          songList: res.data.data.song.list
        });
        wx.hideLoading();
      }
    })
  },

  // 热搜
  getHotSearchData: function() {
    const that = this;
    wx.request({
      url: 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&uin=0&needNewCode=1&platform=h5',
      success: (res) => {
        this.setData({
          hotKey: res.data.data.hotkey.slice(0, 10)
        })
        wx.hideLoading();
      }
    })
  },

  // 保存搜索记录
  preservation: function() {
    const keyword = this.data.keyword;
    const id = Math.floor(Math.random() * (1 - 99)) + 99;
    // 把歌曲添加到播放列表
    const keyArr = {
      id: id,
      name: keyword
    }
    wx.getStorage({
      key: 'searchData',
      success(res) {
        var data = [];
        //判断有没有存储
        if (res.data.length > 0) {
          data = res.data
        }
        //添加收藏的数据
        data.unshift(keyArr);
        //加入收藏
        wx.setStorage({
          key: 'searchData',
          data: data,
        })
      }
    });
  },

  // 获取本地储存搜索记录
  getSearchData: function() {
    const that = this;
    const old = wx.getStorageSync('searchData') || "";
    if (old === "") {
      wx.setStorageSync('searchData', "")
      that.setData({
        none: false
      })
    } else {
      wx.getStorage({
        key: 'searchData',
        success: (res) => {
          that.setData({
            searchData: res.data
          })
        }
      })
    }
  },

  // 清空搜索记录
  empty: function() {
    wx.clearStorageSync('searchData');
    const list = wx.getStorageSync('searchData');
    this.setData({
      searchData: list
    });
    wx.setStorageSync('searchData');
    this.getSearchData();
  },

  // 删除一条搜索记录
  delete: function(e) {
    const itemId = e.currentTarget.dataset.id;
    const list = wx.getStorageSync('searchData');
    list.forEach(function(item, index) {
      if (itemId == item.id) {
        list.splice(index, 1);
      }
      wx.setStorageSync('searchData', list);
    })
    this.getSearchData();
  },

  //有搜索内容时搜索记录框隐藏
  none: function() {
    const list = wx.getStorageSync('searchData')
    if (this.data.keyword != '') {
      this.setData({
        none: false
      })
    }
  },

  // 音乐播放并把歌曲添加到播放列表
  addSong: function(e) {
    // 把歌曲添加到播放列表
    const songArr = {
      id: e.currentTarget.dataset.id,
      song: e.currentTarget.dataset.song,
      name: e.currentTarget.dataset.name,
      singerImg: e.currentTarget.dataset.img,
    }
    this.setData({
      songmid: songArr.id
    })
    wx.getStorage({
      key: 'songList',
      success(res) {
        var data = [];
        //判断有没有存储
        if (res.data.length > 0) {
          data = res.data
        }
        //添加收藏的数据
        data.unshift(songArr);
        //加入收藏
        wx.setStorage({
          key: 'songList',
          data: data,
        })
      }
    });

    wx.getStorage({
      key: 'playList',
      success(res) {
        var data = [];
        //添加收藏的数据
        data.push(songArr);
        //加入收藏
        wx.setStorage({
          key: 'playList',
          data: data,
        })
      }
    })
    this.player.collection();
    this.player.getSongMsg();
  },
})