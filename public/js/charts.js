// Main Chart
// var elements = 27
// var data1 = []
// var data2 = []
// var data3 = []

// for (var i = 0; i <= elements; i++) {
//   data1.push(random(50, 200))
//   data2.push(random(80, 100))
//   data3.push(65)
// }

// convert Hex to RGBA
function convertHex (hex, opacity) {
  hex = hex.replace('#', '')
  var r = parseInt(hex.substring(0, 2), 16)
  var g = parseInt(hex.substring(2, 4), 16)
  var b = parseInt(hex.substring(4, 6), 16)

  var result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')'
  return result
}

function createSlider () {
  
  // $('#slider').dateRangeSlider()
  $('#slider').dateRangeSlider(
    'option',
    {
      bounds: {
        min: moment().add(-30, 'days').toDate(),
        max: moment().toDate()
      },
      // step: {
      //   months: 1
      // },
      range: {
        min: {months: 11},
        max: {months: 11}
      },
      formatter: function (val) {
        return moment(val).format('YYYY-MM-DD')
      }
    }
  ).bind('userValuesChanged', function (e, data) {
    // スライダーを動かした場合
    createCompareGraph(data.values.min, data.values.max)
  })
  reset()
  oneTimeFlg = false
}

function reset () {
  // スライダーの初期位置
  $('#slider').dateRangeSlider('values', moment().add(-1, 'years').startOf('month').toDate(), moment().startOf('month').toDate())
  // スライダーの位置を微調整
  $('#slider').css('margin-bottom', '20px')
}

$.ajax({
  url: 'data/history-btc.json',
  dataType: 'json'
}).done(function (response) {
  console.log('success')

  var labels = [], data1 = []
  $(response.history).each(function () {
    var date = new Date(this.timestamp)
    // console.log(date + ':' + this.value)
    // historyData.addRow([date, this.value])

    labels.push(moment(date).format('YYYY-MM-DD'))
    data1.push(this.value)
  })
  console.log(labels)
  console.log(data1)

  var data = {
    labels: labels,
    datasets: [
      {
        label: 'BTC',
        backgroundColor: convertHex($.brandInfo, 10),
        borderColor: $.brandInfo,
        pointHoverBackgroundColor: '#fff',
        borderWidth: 2,
        data: data1
      }
    ]
  }

  var options = {
    maintainAspectRatio: false,
    legend: {
      display: false
    },
    scales: {
      xAxes: [{
        gridLines: {
          drawOnChartArea: false
        }
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true,
          maxTicksLimit: 5,
        // stepSize: Math.ceil(250 / 5)
        // max: 250
        }
      }]
    },
    elements: {
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3
      }
    }
  }
  var ctx = $('#chart-btc')
  var mainChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: options
  })

  // historyData.sort([{column: 0}])

  // dashboard.bind(chartRangeFilter, [lineChart])

  // dashboard.draw(historyData)
  createSlider()
}).fail(function () {
  console.log('error')
})
