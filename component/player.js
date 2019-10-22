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
    vkey: '',
    songmid: '',
    collectionList: '',
    songMsg: '',
    falg: 0,
    play:'bofang',
    src:'',
    icon:false
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取当前播放歌曲的id
    const song = wx.getStorageSync("playList");
    this.data.songmid = song[0].id;
    console.log(this.data.songmid)

    this.getSongMsg();
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
    const vlaue = wx.getStorageSync('songList') || "";
    if (vlaue === "") {
      wx.setStorageSync('songList', "")
    } else {
      this.setData({
        collectionList:vlaue
      })
    }
  },

  // 获取歌曲信息
  getSongMsg: function () {
    const songMsg = wx.getStorageSync('playList') || "";
    if (songMsg === "") {
      wx.setStorageSync('playList', "")
    }else{
      this.setData({
        songMsg: songMsg
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


  // 获取歌曲链接
  getSongVkey: function() {
    const that = this;
    wx.request({
      url: 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg',
      data: {
        loginUin: 3051522991,
        format: 'json',
        platform: 'yqq',
        needNewCode: 0,
        cid: 205361747,
        uin: 3051522991,
        guid: 5931742855,
        songmid: '001VfvsJ21xFqb',
        filename: 'M500' + '001VfvsJ21xFqb' + '.m4a'
      },
      method: 'GET',
      header: {
        'content-Type': 'application/json'
      },
      success: (res) => {
        console.log(res.data)
        that.setData({
          vkey: res.data.data.items[0].vkey,
          songmid: res.data.data.items[0].songmid
        })
      }
    })
  },


  // 歌曲播放
  play: function(e) {
    const falg = e.currentTarget.dataset.falg;
    if(falg == 0){
      this.setData({
        falg: 1,
        play : 'zanting'
      })
    }else if(falg == 1){
      this.setData({
        falg: 0,
        play: 'bofang'
      })
    }

    this.getSongLyric() 

    //this.getSongVkey()

    // wx.playBackgroundAudio({
    //   dataUrl: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46',
    //   title: '此时此刻',
    //   coverImgUrl: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000'
    //  })
  },

  // 音乐播放并把歌曲添加到播放列表
  addSong: function (e) {
    const songArr = {
      id: e.currentTarget.dataset.id,
      song: e.currentTarget.dataset.song,
      name: e.currentTarget.dataset.name,
      singerImg: e.currentTarget.dataset.img,
    }
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
    this.collection();
    this.getSongMsg();
  }

})