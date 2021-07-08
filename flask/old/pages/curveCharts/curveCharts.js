// // pages/experience/tests/tests.js

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
      data:Array//[18, 36, 65, 30, 78, 40, 33]
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


// const handleTestArrowFun = (that) =>{
//   console.log(that.data.bb);
//   // that.setData({
//   //   bb:[7,6,5,4,3,2,2]
//   // })
// }

Page({
  // onShareAppMessage: function (res) {
    // return {
    //   title: 'ECharts 可以在微信小程序中使用啦！',
    //   path: '/pages/index/index',
    //   success: function () { },
    //   fail: function () { }
    // }
    // that = this;
    // console.log("path "+this.series[0]);
    // this.setData({
    //   img:options.imgpath
    // })
  // }
  // ,
  data: {
    ec: {
      onInit: initChart
    },
    // img:""
  },
  // onLoad: function (options) {
    //   将传进来的数组赋值给全局变量bb
    //   app.globalData.bb:options.传过来的数组
    // 
    //app.globalData.bb=[1,2,3,4,7,7,7]//
    //  传过来的图片赋给本地变量img
    // this.setData({
    //   img:options.img
    // })
  // },
  // onReady() {
    // console.log("加载完毕")
    // console.log(initChart)
  // }
});

