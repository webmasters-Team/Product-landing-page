/**
 * ---------------------------------------
 * This demo was created using amCharts 5.
 *
 * For more information visit:
 * https://www.amcharts.com/
 *
 * Documentation is available at:
 * https://www.amcharts.com/docs/v5/
 * ---------------------------------------
 */

// Create root element
// https://www.amcharts.com/docs/v5/getting-started/#Root_element
var root = am5.Root.new("chartdiv");

// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
root.setThemes([
  am5themes_Animated.new(root), am5themes_Dark.new(root)
]);

var container = root.container.children.push(am5.Container.new(root, { width: am5.p100, height: am5.p100 }));

// Generate random data
var value = 100;

function generateChartData() {
  var chartData = [];
  var firstDate = new Date();
  firstDate.setDate(firstDate.getDate() - 1000);
  firstDate.setHours(0, 0, 0, 0);

  for (var i = 0; i < 16; i++) {
    var newDate = new Date(firstDate);
    newDate.setDate(newDate.getDate() + i);

    value += (Math.random() < 0.5 ? 1 : -1) * Math.random() * 10;

    chartData.push({
      date: newDate.getTime(),
      value: value
    });
  }
  return chartData;
}

var data = generateChartData();


// Create chart
// https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
// start and end angle must be set both for chart and series
var pieChart = container.children.push(am5percent.PieChart.new(root, {
  innerRadius: am5.percent(50),
  radius:am5.p100,
  x: am5.percent(70),
  y: am5.percent(50),
  centerX: am5.percent(50),
  centerY: am5.percent(50),
  width: 250,
  height: 250  
}));

// Create series
// https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
// start and end angle must be set both for chart and series
var pieSeries = pieChart.series.push(am5percent.PieSeries.new(root, {
  valueField: "value",
  categoryField: "category",
  alignLabels: false,
  endAngle: 270
}));

pieSeries.labels.template.setAll({textType:"circular", fontSize:10, opacity:0.8})
pieSeries.slices.template.setAll({templateField:"settings", strokeOpacity:0});

pieSeries.states.create("hidden", {
  endAngle: -90
});

pieSeries.ticks.template.setAll({
  forceHidden: true
});

// Set data
// https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
pieSeries.data.setAll([
  { value: 10, category: "Yes", settings:{ fillOpacity:0.6, fill:am5.color(0x0975da)} },
  { value: 5, category: "No", settings:{fillOpacity:0, fill:am5.color(0xffffff), strokeOpacity:1, stroke:am5.color(0x40a3ff), strokeDasharray:[2,2]} }
]);


// Create chart
// https://www.amcharts.com/docs/v5/charts/xy-chart/
var chart = container.children.push(am5xy.XYChart.new(root, {
  focusable: true,
  panX: true,
  panY: true,
  wheelX: "none",
  wheelY: "none",
  paddingTop: 0,
  paddingRight: 0,
  paddingBottom: 0,
  paddingLeft: 0
}));

chart.zoomOutButton.set("forceHidden", true);

var easing = am5.ease.out(am5.ease.cubic);

var xRenderer = am5xy.AxisRendererX.new(root, {
  minGridDistance: 50,
  inside: true
})

xRenderer.labels.template.setAll({ fontSize: 9, opacity: 0.5 })
xRenderer.grid.template.setAll({stroke:am5.color(0xffffff), strokeOpacity:0.05})
// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
var xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
  maxDeviation: 0.5,
  groupData: false,
  extraMax: 0.1,
  extraMin: -0.05,
  baseInterval: {
    timeUnit: "day",
    count: 1
  },
  renderer: xRenderer,
  tooltip: am5.Tooltip.new(root, {})
}));

var yRenderer = am5xy.AxisRendererY.new(root, {
  minGridDistance: 50,
  inside: true
})

yRenderer.labels.template.setAll({ fontSize: 9, opacity: 0.5, minPosition: 0.02, maxPosition: 0.98 })
yRenderer.grid.template.setAll({stroke:am5.color(0xffffff), strokeOpacity:0.05})

var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  maxPrecision: 0,
  renderer: yRenderer
}));


// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
var series = chart.series.push(am5xy.LineSeries.new(root, {
  minBulletDistance: 10,
  name: "Series 1",
  xAxis: xAxis,
  yAxis: yAxis,
  stroke:am5.color(0x40a3ff),
  fill:am5.color(0x40a3ff),
  "valueYField": "value",
  "valueXField": "date"
}));

series.strokes.template.setAll({ strokeDasharray: [2, 2] })

series.data.setAll(data);

var tooltip = am5.Tooltip.new(root, {
  pointerOrientation: "horizontal"
});
tooltip.label.set("text", "{valueY}");
series.set("tooltip", tooltip);

series.bullets.push(function() {
  return am5.Bullet.new(root, {
    locationX: undefined,
    sprite: am5.Circle.new(root, {
      radius: 4,
      fill: am5.color(0xffba00),
      stroke: am5.color(0x000000)
    })
  })
});

// Update data every second
setInterval(function() {
  addData();
}, 2000)


function addData() {
  if (!document.hidden) {

    var lastDataItem = series.dataItems[series.dataItems.length - 1];
    var lastValue = lastDataItem.get("valueY");
    var newValue = value + (Math.random() < 0.5 ? 1 : -1) * Math.random() * 5;
    var lastDate = new Date(lastDataItem.get("valueX"));
    var time = am5.time.add(new Date(lastDate), "day", 1).getTime();
    series.data.removeIndex(0);
    series.data.push({
      date: time,
      value: newValue
    })

    var newDataItem = series.dataItems[series.dataItems.length - 1];
    newDataItem.animate({
      key: "valueYWorking",
      to: newValue,
      from: lastValue,
      duration: 1000,
      easing: easing
    });

    var animation = newDataItem.animate({
      key: "locationX",
      to: 0.5,
      from: -0.5,
      duration: 1000,
      easing:easing
    });
    if (animation) {
      var tooltip = xAxis.get("tooltip");
      if (tooltip && !tooltip.isHidden()) {
        animation.events.on("stopped", function() {
          xAxis.updateTooltip();
        })
      }
    }
  }

  pieSeries.dataItems[0].animate({key:"valueWorking", to:Math.random() * 10, duration:1000, easing:easing})
  pieSeries.dataItems[1].animate({key:"valueWorking", to:Math.random() * 10, duration:1000, easing:easing})
}


// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
chart.appear(1000, 100);

series.appear(1000, 100);
pieSeries.appear(1000, 100);