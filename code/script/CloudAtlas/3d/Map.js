/**
 * Created by crazygis on 2019/4/26.
 */
(function ($, CMap, Cesium, ui) {
    CMap.Map3D = {};

    // cesium viewer对象
    var _cesiumViewer = null;

    // 个性化参数
    var _option = null;

    /**
     * 构造函数
     * @constructor CMap.Map3D
     * @classdesc 云图框架3D地图对象
     * @memberof CMap
     * @type {CMap.Map3D}
     * @param {Object} option - 初始化参数.
     *
     * option 参数可能包含如下属性
     *      mapContainer: 地图容器div
     *      centerLng: 地图中心点经度
     *      centerLat: 地图中心点纬度
     *      centerHeight: 地图中心点视角高度
     *      showNavigation: 是否显示导航控件
     */
    CMap.Map3D = function (option) {
        if (!option || !option.mapContainer) {
            throw new Error("地图初始化参数mapContainer不能为空");
        }

        if(!option.centerLng || !option.centerLat) {
            // 默认位置：南京玄武湖
            option.centerLng = 118.79;
            option.centerLat = 32.07;
        }

        if(!option.centerHeight) {
            option.centerHeight = 3000;  // 默认3000米
        }

        _option = $.extend(_getDefaultOption(), option);

        _cesiumViewer = new Cesium.Viewer(option.mapContainer, option);

        _cesiumViewer._cesiumWidget._creditContainer.style.display = "none";
        _cesiumViewer.scene.globe.depthTestAgainstTerrain = true;

        _cesiumViewer.scene.screenSpaceCameraController.enableLook = false;
        //_cesiumViewer.scene.screenSpaceCameraController.minimumZoomDistance = 50;
        //_cesiumViewer.scene.screenSpaceCameraController.maximumZoomDistance = 10000;

        if(option.showNavigation) {
            Cesium.viewerCesiumNavigationMixin(_cesiumViewer,{});
        }

        // 添加底图
        var baseLayers = viewer.scene.imageryLayers;
        baseLayers.removeAll(false);

        baseLayers.add(_getTiandituStreetLayer());
        baseLayers.add(_getTiandituStreetNoteLayer());
        baseLayers.add(_getTiandituImageLayer());
        baseLayers.add(_getTiandituImageNoteLayer());

        // 设置镜头位置与方向
        var camera = _cesiumViewer.scene.camera;
        // 中心点位置
        var center = [_option.centerLng, _option.centerLat, _option.centerHeight];

        camera.setView({
            //镜头的经纬度、高度。镜头默认情况下，在指定经纬高度俯视（pitch=-90）地球
            position: Cesium.Cartesian3.fromDegrees(0, 0, 25000000),
            //下面的几个方向正好反映默认值
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-90),
            roll: Cesium.Math.toRadians(0)
        });

        // 让镜头飞行（动画）到某个地点和方向
        setTimeout(function () {
            camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(center[0], center[1], 25000000),
                orientation: {
                    heading: Cesium.Math.toRadians(0),
                    pitch: Cesium.Math.toRadians(-90),
                    roll: Cesium.Math.toRadians(0)
                },
                duration: 3, // 动画持续时间
                complete: function () {
                    camera.flyTo({
                        destination: Cesium.Cartesian3.fromDegrees(center[0], center[1], center[2]),
                        orientation: {
                            heading: Cesium.Math.toRadians(0),
                            pitch: Cesium.Math.toRadians(-90),
                            roll: Cesium.Math.toRadians(0)
                        },
                        duration: 7, // 动画持续时间
                        complete: function () {
                            // 地图加载完成事件
                        }
                    });
                }
            });
        }, 3000);

        // 更改Home默认位置
        Cesium.Camera.DEFAULT_VIEW_FACTOR = 0;
        Cesium.Camera.DEFAULT_VIEW_RECTANGLE =
            Cesium.Rectangle.fromDegrees(
                center[0] - 0.007,
                center[1] - 0.007,
                center[0] + 0.007,
                center[1] + 0.007);

        // 取消鼠标左键双击事件
        viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

        // 绑定事件
        var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

        // 鼠标左键单击事件
        handler.setInputAction(function (evt) {

        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        // 鼠标移动事件
        handler.setInputAction(function (evt) {

        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        // 鼠标左键松开事件
        handler.setInputAction(function (evt) {
            if(isOverflow(viewer)) {
                flyHome(viewer);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_UP);

        // 鼠标中键松开事件
        handler.setInputAction(function (evt) {
            if(isOverflow(viewer)) {
                flyHome(viewer);
            }
        }, Cesium.ScreenSpaceEventType.MIDDLE_UP);

        // 鼠标右键松开事件
        handler.setInputAction(function (evt) {
            if(isOverflow(viewer)) {
                flyHome(viewer);
            }
        }, Cesium.ScreenSpaceEventType.RIGHT_UP);

        // 鼠标滚轮事件
        handler.setInputAction(function (evt) {
            if(isOverflow(viewer)) {
                flyHome(viewer);
            }
        }, Cesium.ScreenSpaceEventType.WHEEL);

        // 两根手指捏屏幕
        handler.setInputAction(function (evt) {
            if(isOverflow(viewer)) {
                flyHome(viewer);
            }
        }, Cesium.ScreenSpaceEventType.PINCH_END);

        // 两根手指移动屏幕
        handler.setInputAction(function (evt) {
            if(isOverflow(viewer)) {
                flyHome(viewer);
            }
        }, Cesium.ScreenSpaceEventType.PINCH_MOVE);
    };

    /**
     * 一键还原
     * @function home
     * @memberOf  CMap.Map3D
     * @instance
     */
    CMap.Map3D.prototype.home = function () {
        if(!_cesiumViewer || !_cesiumViewer.camera) {
            return;
        }
        _cesiumViewer.scene.camera.flyHome(3);
    };

    /**
     * 底图切换
     * @function switch
     * @memberOf  CMap.Map3D
     * @instance
     */
    CMap.Map3D.prototype.switch = function () {

    };

    CMap.Map3D.prototype.setOpacity = function (opacity) {

    };

    // 获取默认参数
    function _getDefaultOption() {
        return {
            scene3DOnly: false,                     // 是否只显示3D
            animation: false,                       // 是否显示动画控件
            fullscreenButton: false,                // 是否显示全屏控件
            baseLayerPicker: false,                 // 是否显示图层选择控件
            homeButton: false,                      // 是否显示默认位置控件
            geocoder: false,                        // 是否显示地名查找控件
            sceneModePicker: false,                 // 是否显示投影方式控件
            timeline: false,                        // 是否显示时间线控件
            clock: null,                            // 时间控件(null表示不显示, new Clock()表示默认)
            navigationHelpButton: false,            // 是否显示帮助信息控件
            infoBox: false,                         // 是否显示点击要素之后显示的信息
            imageryProviderViewModels: null,
            terrainProviderViewModels: null,
            terrainProvider: null,
            imageryProvider: null,
            pellucidity: 30,
            mapLoadedCallback: null,
            entityClickCallback: null,
            showNavigation: false
        };
    }

    // 天地图影像底图
    function _getTiandituImageLayer(option) {
        var imageryProvider = new Cesium.UrlTemplateImageryProvider({
            url: "http://{s}.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=192631ad8c712c0c28bf0399a3d3e5d9",
            credit: new Cesium.Credit("天地图全球影像地图服务"),
            subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
            tilingScheme : new Cesium.WebMercatorTilingScheme(),
            maximumLevel: 18
        });

        var layer = new Cesium.ImageryLayer(imageryProvider, Cesium.defaultValue(option, {}));
        return layer;
    }
    // 天地图影像标注底图
    function _getTiandituImageNoteLayer(option) {
        var imageryProvider = new Cesium.UrlTemplateImageryProvider({
            url: "http://{s}.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=192631ad8c712c0c28bf0399a3d3e5d9",
            credit: new Cesium.Credit("天地图全球影像注记服务"),
            subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
            tilingScheme : new Cesium.WebMercatorTilingScheme(),
            maximumLevel: 18
        });

        var layer = new Cesium.ImageryLayer(imageryProvider, Cesium.defaultValue(option, {}));
        return layer;
    }

    // 天地图街道底图
    function _getTiandituStreetLayer(option) {
        var imageryProvider = new Cesium.UrlTemplateImageryProvider({
            url: "http://{s}.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=192631ad8c712c0c28bf0399a3d3e5d9",
            credit: new Cesium.Credit("天地图全球街道地图服务"),
            subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
            tilingScheme : new Cesium.WebMercatorTilingScheme(),
            maximumLevel: 18
        });

        var layer = new Cesium.ImageryLayer(imageryProvider, Cesium.defaultValue(option, {}));
        return layer;
    }
    // 天地图街道标注底图
    function _getTiandituStreetNoteLayer(option) {
        var imageryProvider = new Cesium.UrlTemplateImageryProvider({
            url: "http://{s}.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=192631ad8c712c0c28bf0399a3d3e5d9",
            credit: new Cesium.Credit("天地图全球街道注记服务"),
            subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
            tilingScheme : new Cesium.WebMercatorTilingScheme(),
            maximumLevel: 18
        });

        var layer = new Cesium.ImageryLayer(imageryProvider, Cesium.defaultValue(option, {}));
        return layer;
    }

})(jQuery, CMap, Cesium, ui);