//index.js
//获取应用实例
// const app = getApp()
////////////////////////////////////////

import * as echarts from '../../ec-canvas/echarts';
const app = getApp();

function initChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);
  

  var option = {
    title: {
      text: '测试画表',
      left: 'center'
    },
    legend: {
      data: ['A', 'B', 'C'],
      top: 50,
      left: 'center',
      backgroundColor: 'yellow',
      z: 100
    },
    grid: {
      containLabel: true
    },
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    xAxis: {
      //横坐标
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      // show: false //不显示横坐标数据
    },
    yAxis: {
      //纵坐标
      x: 'center',
      type: 'value',
      splitLine: {
        //以虚线分割纵坐标
        lineStyle: {
          type: 'dashed'
        }
      }
      // show: false
    },
    series: [{
      name: 'A',
      type: 'line',
      //折线或者曲线
      smooth: true,
      data:[18, 36, 65, 30, 78, 40, 33]
    }, {
      name: 'B',
      type: 'line',
      smooth: true,
      data: [12, 50, 51, 35, 70, 30, 20]
    }, {
      name: 'C',
      type: 'line',
      smooth: true,
      data: [10, 30, 31, 50, 40, 20, 10]
    }]
  };
    //通过全局变量将值给赋过去取var option
    // option.series[0].data = app.globalData.bb;
    // console.log("输出全局变量 "+app.globalData.bb)


  chart.setOption(option);
  return chart;
}
////////////////////////////////////////

Page({
  data: {
    ec: {
      onInit: initChart
    },
    flag: false,
    motto: '检测结果：',
    value: '0',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userImage: "/images/test_animal.jpg",
    choImg:"",
    resImg:"",
    img_arr: [],
    
  },
  //事件处理函数
  bindViewTap: function() {
    var that = this //！！！！！！！！！“搭桥”
 
    //利用API从本地读取一张图片
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        //将读取的图片替换之前的图片
        that.setData(
          { userImage: tempFilePaths[0],
            img_arr: that.data.img_arr.concat(tempFilePaths[0]),
          }
          )//通过that访问
          console.log(that.data.userImage)
      }
    })
  },
  changeName: function (e) {
    this.setData({
      value: "xiao",
    })
 
  },
  //发送请求
  upload: function () {
    var that = this
   wx.uploadFile({//将本地资源上传到服务器。客户端发起一个 HTTPS POST 请求，其中 content-type 为 multipart/form-data
    // url	string	 	必填	开发者服务器地址	 
    // filePath	string	 	必填	要上传文件资源的路径 (本地路径)	 
    // name	string	 	必填	文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容
        url: 'http://127.0.0.1:8989/postdata',
        // filePath: that.data.img_arr[0],
        filePath: that.data.userImage,
        name: 'content',//用于服务器取数据的标识
        // formData: adds,
        success: function (res) {
          console.log("打印出来的是什么数据  "+res.data);
          //res.data：==>：{"value": 100, "resurl": "http://127.0.0.1:8989/static/resImg/aeb3a158-df01-11eb-8746-d481d78da2ad.jpg"}//
          that.setData({
            //从服务器返回的json数据中取值
            // data	string	开发者服务器返回的json数据
            value: JSON.parse(res.data)['value'],
            userImage: JSON.parse(res.data)['resurl'],
            choImg: JSON.parse(res.data)['resurl1'],
            resImg: JSON.parse(res.data)['resurl2'],
            flag: true
          })
          if (res) {
            wx.showToast({
              title: '检测完成！',
              duration: 3000
            });
          }
        }
      })
    this.setData({
      formdata: ''
    })
  }, 
  takePhoto() {
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        that.setData(
          {
            userImage: res.tempFilePaths[0],
 
          })
        console.log("res.tempImagePath" + tempFilePaths[0])
      }
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})