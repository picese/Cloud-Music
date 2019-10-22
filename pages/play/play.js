// pages/play/play.js
const utils = require('../../utils/utils.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: '',
    num: 0,
    loop: 1, // 播放格式
    playIcon: 'suiji',
    playName: '随机播放',
    songmid: '',
    songname: '',
    singer: '',
    collectionList: '',
    lyric: '',
    falg: 0,
    play: 'zanting',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      songid: options.cat,
      songname: options.song,
      singer: options.name
    })
    this.getSongLyric()
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  // 获取本地数据
  collection: function() {
    const old = wx.getStorageSync('songList') || '';
    if (old === '') {
      wx.setStorageSync('songList', '')
    } else {
      wx.getStorage({
        key: 'songList',
        success: (res) => {
          this.setData({
            collectionList: res.data
          })
        }
      })
    }
  },

  // 清空播放列表
  reset: function() {
    wx.removeStorageSync('songList');
    const list = wx.getStorageSync('songList');
    this.setData({
      collectionList: list
    });
    wx.setStorageSync('songList');
    wx.showToast({
      title: '清空播放列表',
      duration: 3000
    });
  },

  // 删除歌曲
  del: function(e) {
    const itemId = e.currentTarget.dataset.id;
    const list = wx.getStorageSync('songList');
    list.forEach(function(item, index) {
      if (itemId == item.id) {
        list.splice(index, 1);
      }
      wx.setStorageSync('songList', list);
    })
    this.collection();
  },


  //播放列表显示/隐藏
  toggel: function(e) {
    const that = this;
    const index = e.currentTarget.dataset.index
    if (index === 0) {
      this.setData({
        isShow: true,
        num: 1,
      })
    } else if (index === 1) {
      this.setData({
        isShow: false,
        num: 0,
      })
    }
    that.collection();
  },

  // 播放格式切换
  switch: function(e) {
    const format = e.currentTarget.dataset.format;
    if (format == 1) {
      this.setData({
        loop: 2,
        playIcon: 'danqu',
        playName: '单曲循环'
      })
    } else if (format == 2) {
      this.setData({
        loop: 3,
        playIcon: 'shunxu',
        playName: '顺序播放'
      })
    } else {
      this.setData({
        loop: 1,
        playIcon: 'suiji',
        playName: '随机播放'
      })
    }
  },

  // 歌曲播放
  play: function(e) {
    const falg = e.currentTarget.dataset.falg;
    if (falg == 0) {
      this.setData({
        falg: 1,
        play: 'bofang'
      })
    } else if (falg == 1) {
      this.setData({
        falg: 0,
        play: 'zanting'
      })
    }
  },


  // 获取歌词
  getSongLyric: function() {
    wx.request({
      url: 'http://ustbhuangyi.com/music/api/lyric?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&songmid=' + this.data.songid + '&platform=yqq&hostUin=0&needNewCode=0&categoryId=10000000&pcachetime=1571637472303',
      method: 'GET',
      header: {
        'content-Type': 'application/json'
      },
      success: (res) => {
        const lyricBase64 = res.data.lyric
        const lyric = utils.Base64.decode(lyricBase64);
        const parseLyric = this.parseLyric(lyric);
        const data = [];
        for (var k in parseLyric) {
          var txt = parseLyric[k];
          //if (!txt) txt = "&nbsp;";
          if (txt == "&nbsp;") continue;
          const lrc = {
            text: txt
          }
          data.push(lrc)
          console.log(data)
        }
        this.setData({
          lyric: data
        })
      }
    })
  },

  // 歌词解析
  parseLyric: function(lrc) {
    var lyrics = lrc.split("\n");
    var lrcObj = {}
    for (var i = 0; i < lyrics.length; i++) {
      var lyric = decodeURIComponent(lyrics[i]);
      var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
      var timeRegExpArr = lyric.match(timeReg);
      if (!timeRegExpArr) continue;
      var clause = lyric.replace(timeReg, '');
      for (var k = 0, h = timeRegExpArr.length; k < h; k++) {
        var t = timeRegExpArr[k];
        var min = Number(String(t.match(/\[\d*/i)).slice(1)),
          sec = Number(String(t.match(/\:\d*/i)).slice(1));
        var time = min * 60 + sec;
        lrcObj[time] = clause;
      }
    }
    return lrcObj;
  }
})