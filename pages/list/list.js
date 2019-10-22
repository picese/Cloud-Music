// pages/list/list.js
import player from '../../component/player.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotLogo: '', // 热门歌单列表图片
    songList: '', // 热门歌单列表歌曲
    rankingLogo: '', //排行榜列表图片
    rankingList: '', //排行榜列表歌曲
    itemId: '', // index传递过来的歌单ID
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.player = this.selectComponent("#player");
    this.player.collection();
    this.player.getSongMsg();

    //设置页面的标题
    if (options.title) {
      wx.setNavigationBarTitle({
        title: options.title,
      });
    }

    // 数据加载
    wx.showLoading({
      title: '加载中',
    });

    // 获取当前页面传递过来的ID
    this.setData({
      itemId: options.cat,
    });

    if (options.cat.length === 10 || options.cat.length === 11) {
      this.getSongListData();
    } else if (options.cat.length === 1 || options.cat.length === 2) {
      this.getRankingListData();
    }
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

  // 获取热门歌单数据
  getSongListData: function() {
    wx.request({
      url: 'http://ustbhuangyi.com/music/api/getCdInfo?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&disstid=' + this.data.itemId + '&type=1&json=1&utf8=1&onlysong=0&platform=yqq&hostUin=0&needNewCode=0',
      data: {
        _limit: this.data.limit,
        _page: ++this.data.page
      },
      success: (res) => {
        this.setData({
          songList: res.data.cdlist[0].songlist,
          hotLogo: res.data.cdlist[0].logo
        });
        wx.hideLoading();
      }
    })
  },

  // 获取排行榜数据
  getRankingListData: function() {
    wx.request({
      url: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&topid=' + this.data.itemId + '&needNewCode=1&uin=0&tpl=3&page=detail&type=top&platform=h5',
      data: {
        _limit: this.data.limit,
        _page: ++this.data.page
      },
      success: (res) => {
        this.setData({
          rankingLogo: res.data.songlist[0].data.albummid,
          rankingList: res.data.songlist
        });
        wx.hideLoading();
      }
    })
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
    // const songMsg = wx.getStorageSync('playList') || "";
    // if (songMsg === "") {
    //   wx.setStorageSync('playList', "")
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
  }

})