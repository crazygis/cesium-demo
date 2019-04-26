/**
 * index.html对应的js文件
 * Created by crazygis on 2019/04/26.
 */
;(function($) {

    var pageLogic = window.pageLogic = {
        // init下面的方法会按照顺序在页面的加载时执行，且只会执行一次
        init: {
            // 创建需要初始化布局的页面元素
            create: function() {
                // 创建地图
                pageLogic.map = createMap();
                // 初始化实时图层解析规则
                initRealTimeLayerDataParseRule();
                // 创建地图控制面板
                pageLogic.map.layers = createLayers(pageLogic.map);
                // 创建地图轨迹
                pageLogic.map.track = createMapTrack(pageLogic.map);
                // 创建地图工具菜单
                pageLogic.map.toolMenuList = createToolMenuList(pageLogic.map);
                // 创建地图要素框选菜单
                pageLogic.map.chooserMenuList = createChooserMenuList(pageLogic.map);
                // 创建底图亮度调节器
                pageLogic.map.lightAdjuster = createMapLightAdjust(pageLogic.map);
                // 创建地图图例
                pageLogic.map.legend = createLegend(pageLogic.map);
                // 创建选项卡对话框
                pageLogic.map.tabDialog = createTabDialog(pageLogic.map);
                // 创建图表对话框
                pageLogic.map.chartDialog = createChartDialog(pageLogic.map);
                // 窗视频对话框
                pageLogic.map.videoDialog = createVideoDialog(pageLogic.map);

                initMapElements();
                flyLocation();
            },
            // 数据加载
            load: function() {
                var layerId = "layer0-1";
                pageLogic.map.addAlarm(xmap.AlarmLevel.BLUE, layerId, ["杨咀村取水口"]);
                pageLogic.map.addAlarm(xmap.AlarmLevel.YELLOW, layerId, ["童兑屋站"]);
                pageLogic.map.addAlarm(xmap.AlarmLevel.ORANGE, layerId, ["胡咀抗旱站"]);
                pageLogic.map.addAlarm(xmap.AlarmLevel.RED, layerId, ["芦山抗旱站"]);

                // GPS监控图层数据加载
                var gpsPointData = {
                    geometryType: xmap.GeometryType.POINT,
                    list: [
                        {
                            lng: 114.44286346435547,
                            lat: 30.71004867553711,
                            properties: {
                                name: "1号车",
                                code: "vehicle-1"
                            }
                        },
                        {
                            lng: 114.48680877685547,
                            lat: 30.715198516845703,
                            properties: {
                                name: "2号车",
                                code: "vehicle-2"
                            }
                        },
                        {
                            lng: 114.53556060791016,
                            lat: 30.710735321044922,
                            properties: {
                                name: "3号车",
                                code: "vehicle-3"
                            }
                        },
                        {
                            lng: 114.58808898925781,
                            lat: 30.707645416259766,
                            properties: {
                                name: "4号车",
                                code: "vehicle-4"
                            }
                        },
                        {
                            lng: 114.774169921875,
                            lat: 30.713825225830078,
                            properties: {
                                name: "5号车",
                                code: "vehicle-5"
                            }
                        }
                    ]
                };
                pageLogic.map.setLayerData("layer2-0", gpsPointData);
            }
        },
        infoWindowDetail: function(code) {
            ui.messageShow(code);
        }
    };

})(jQuery);