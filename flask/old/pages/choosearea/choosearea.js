// 获取全局应用程序实例对象
// const app = getApp();

// 创建页面实例对象
Page({
  // 页面的初始数据
  data: {
    isShowCamera: true,
    isShowImage: false,
    image: '',
    windowWidth: '',
    windowHeight: '',
    position: "back",
  },
  onLoad() {
    this.ctx = wx.createCameraContext()
    let {windowWidth, windowHeight} = wx.getSystemInfoSync()
    this.setData({windowWidth, windowHeight})
  },
  onShow: function () {
    var that = this
    wx.authorize({
      scope: 'scope.camera',
      success: function (res) {
        that.setData({
          isShowCamera: true,
        })
      },
      fail: function (res) {
        console.log("" + res);
        wx.showModal({
          title: '请求授权您的摄像头',
          content: '如需正常使用此小程序功能，请您按确定并在设置页面授权用户信息',
          confirmText: '确定',
          success: res => {
            if (res.confirm) {
              wx.openSetting({
                success: function (res) {
                  console.log('成功');
                  console.log(res);
                  if (res.authSetting['scope.camera']) { //设置允许获取摄像头
                    console.log('设置允许获取摄像头')
                    wx.showToast({
                      title: '授权成功',
                      icon: 'success',
                      duration: 1000
                    })
                    that.setData({
                      isShowCamera: true,
                    })

                  } else { //不允许
                    wx.showToast({
                      title: '授权失败',
                      icon: 'none',
                      duration: 1000
                    })
                    wx.navigateBack({delta: 1})
                  }
                }
              })
            } else { //取消
              wx.showToast({
                title: '授权失败',
                icon: 'none',
                duration: 1000
              })
              wx.navigateBack({delta: 1})

            }
          }
        })

      }
    })
  },
    // 前置后置摄像头
    reverse() {
      this.setData({
          position: this.data.position === "back" ? "front" : "back"
      });
  },
//从本地选择照片
choosePhoto() {
    var that = this;
    wx.chooseImage({
        count: 1,
        sizeType: ['original'],
        sourceType: ['album'],
        success(res)  {
            // console.log(res);
            console.log("本地");
            console.log(res.tempFilePaths[0]);
            if (res.errMsg === "chooseImage:ok" &&
                res.tempFilePaths.length > 0) {
                that.setData({
                    src: res.tempFilePaths[0]
                }, () => {
                    // that.handlePic();
                    wx.navigateTo({
                      url: '../mobilenet/mobilenet?img=' +  that.data.src
                    })
                })
            }
        }
    })
},
  /**
   * 拍照
   */
  takePhotoAction: function () {
    var that = this
    // const ctx = wx.createCameraContext()
    that.ctx.takePhoto({
    // ctx.takePhoto({

      quality: 'high', //高质量
      success: (res) => {
        that.loadTempImagePath(res.tempImagePath);
      },
      fail(error) {
        console.log(error)
      }
    })
  },
  loadTempImagePath: function (options) {
    var that = this
    
    wx.getSystemInfo({
      success: function (res) {
        // px与rpx之间转换的公式：px = rpx / 750 * wx.getSystemInfoSync().windowWidth;
        // 矩形的位置
        // var image_x = 0;
        // var image_y = 0;
        // var image_width = that.data.windowWidth;
        // var image_height = that.data.windowHeight
        // var image_x = 36 / 750 * wx.getSystemInfoSync().windowWidth;
        // var image_y = 400 / 750 * wx.getSystemInfoSync().windowWidth;
        // var image_width = 680 / 750 * wx.getSystemInfoSync().windowWidth;
        // var image_height = 280 / 750 * wx.getSystemInfoSync().windowWidth;
        //显示打印后的方框
        var image_x = 10 / 750 * wx.getSystemInfoSync().windowWidth;
        var image_y = 10 / 750 * wx.getSystemInfoSync().windowWidth;
        var image_width = 730 / 750 * wx.getSystemInfoSync().windowWidth;
        var image_height = 730 / 750 * wx.getSystemInfoSync().windowWidth;
        console.log(image_x, image_y, image_width, image_height)/// 5 5 365 365
        wx.getImageInfo({
          src: options,
          success: function (res) {//zheli
            
            that.setData({
              isShowImage: true,
            })
            that.canvas = wx.createCanvasContext("image-canvas", that)
            //过渡页面中，图片的路径坐标和大小
            that.canvas.drawImage(options, 0, 0, that.data.windowWidth, that.data.windowHeight)
            wx.showLoading({
              title: '数据处理中...',
              icon: 'loading',
              duration: 10000
            })
            // 这里有一些很神奇的操作,总结就是MD拍出来的照片规格居然不是统一的过渡页面中，对裁剪框的设定
            that.canvas.setStrokeStyle('red')
            that.canvas.strokeRect(image_x, image_y, image_width, image_height)
            that.canvas.draw()
            setTimeout(function () {
              wx.canvasToTempFilePath({ //裁剪对参数
                canvasId: "image-canvas",
                x: image_x, //画布x轴起点
                y: image_y, //画布y轴起点
                width: image_width, //画布宽度
                height: image_height, //画布高度
                destWidth: image_width, //输出图片宽度
                destHeight: image_height, //输出图片高度
                success: function (res) {
                  that.setData({
                    image: res.tempFilePath,
                  })
                  
                  //清除画布上在该矩形区域内的内容。
                  // that.canvas.clearRect(0, 0, that.data.width, that.data.height)
                  // that.canvas.drawImage(res.tempFilePath, image_x, image_y, image_width, image_height)
                  // that.canvas.draw()
                  wx.hideLoading()
                  console.log("截取出来的 :"+res.tempFilePath);
                  wx.navigateTo({
                    // url: '../mobilenet/mobilenet?img=' +res.tempFilePath
                    url: '../mobilenet/mobilenet?img=' +that.data.image
                  })
                  wx.getFileSystemManager().readFile({
                    filePath: res.tempFilePath,  //图片路径
                    encoding: 'base64', //编码格式
                    success: result => { //成功的回调
                      console.log('data:image/png;base64,' + result.data)
                  //在此可进行网络请求
                },
                fail: function (e) {
                  wx.hideLoading()
                  wx.showToast({
                    title: '出错啦...',
                    icon: 'loading'
                  })
                }
              });
            },
          })
         }, 1000);
        }///zheli
        })
      }
    })
  },
});