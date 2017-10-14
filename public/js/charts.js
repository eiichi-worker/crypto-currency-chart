var mainChart

/**
 * convert Hex to RGBA
 */
function convertHex (hex, opacity) {
  hex = hex.replace('#', '')
  var r = parseInt(hex.substring(0, 2), 16)
  var g = parseInt(hex.substring(2, 4), 16)
  var b = parseInt(hex.substring(4, 6), 16)

  var result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')'
  return result
}

$(function () {
  console.log('document.ready')

  $.ajax({
    url: 'data/history-btc.json',
    dataType: 'json'
  }).done(function (response) {
    console.log('success')

    var labels = [], tmpData = [],data1 = []

    // 読み込み
    $(response.history).each(function () {
      var date = new Date(this.timestamp)
      tmpData.push([
        moment(date).format('YYYY-MM-DD'),
        this.value
      ])
    })
    // ソート
    tmpData.sort([{column: 0}])

    // 入れ直し
    $(tmpData).each(function (index, value) {
      console.log(value)
      labels.push(value[0])
      data1.push(value[1])
    })

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

    var ctx = document.getElementById('chart-btc').getContext('2d')

    var mainChart = new RangeSliderChart(
      {
        chartData: data,
        chartOpts: options,
        chartType: 'line',
        chartCTX: ctx,

        class: 'slider',

        initial: [
          labels.length - 90,
          labels.length
        ]
      }
    )
    
  }).fail(function () {
    console.log('error')
  })
})
