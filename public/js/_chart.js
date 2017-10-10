google.charts.load('current', { packages: ['corechart', 'controls', 'table'] })
google.charts.setOnLoadCallback(controlsAndDashboards)

// 初期表示範囲を設定
var startDate = new Date()
startDate.setDate(startDate.getDate() - 30)
var endtDate = new Date()

function controlsAndDashboards () {
  var dashboard = new google.visualization
    .Dashboard(document.getElementById('dashboard_div'))

  var chartRangeFilter = new google.visualization.ControlWrapper({
    controlType: 'ChartRangeFilter',
    containerId: 'filter',
    options: {
      filterColumnIndex: 0,
      ui: {
        chartType: 'ComboChart',
        chartOptions: {
          colors: ['rgb(255, 159, 64)'],
          height: 70
        }
      }
    },
    'state': {'range': {'start': startDate, 'end': endtDate}}
  })

  var lineChart = new google.visualization.ChartWrapper({
    chartType: 'LineChart',
    containerId: 'chart1',
    options: {
      height: 400,
      // hAxis: {
      //   textPosition: 'none'
      // },
      colors: ['rgb(255, 99, 132)']
    },
    'view': {
      'columns': [
        {
          'calc': function (dataTable, rowIndex) {
            return moment(dataTable.getFormattedValue(rowIndex, 0)).format('YYYY-MM-DD');
          },
          'type': 'string'
        }, 1]
    }
  })

  // -------------------

  var historyData = new google.visualization.DataTable()
  historyData.addColumn('date', 'timestamp')
  historyData.addColumn('number', 'USD')

  $.ajax({
    url: 'data/history-btc.json',
    dataType: 'json'
  }).done(function (data) {
    console.log('success')
    $(data.history).each(function () {
      var date = new Date(this.timestamp)
      console.log(date + ':' + this.value)
      historyData.addRow([date, this.value])
    })
    console.log(historyData)

    historyData.sort([{column: 0}]);

    dashboard.bind(chartRangeFilter, [lineChart])

    dashboard.draw(historyData)
  }).fail(function () {
    console.log('error')
  })
}
