
/**
 * 3D地图配置
 * Created by crazygis on 2017/11/27.
 */
;(function ($) {

    var CloudAtlas3DConfigManager = window.CloudAtlas3DConfigManager = {
        // 获取地图中心点坐标
        getMapCenter: function () {
            return [118.68715066553428, 32.1685886269659, 3000];
        },

        // 获取瓦片服务地址
        getTileServiceAddress: function () {
            if(this._isLocalTileService) {
                return this._getLocalTileAddress();
            } else {
                return this._getNetworkTileAddress();
            }
        },

        // 获取本地瓦片服务地址
        _getLocalTileAddress: function () {
            var result = [];
            result.push(this._tiandituStreetMapLocalAddress);
            result.push(this._tiandituImageMapLocalAddress);

            return result;
        },
        // 获取网络瓦片服务地址
        _getNetworkTileAddress: function () {
            var result = [];
            result.push(this._tiandituStreetMapNetworkAddress);
            result.push(this._tiandituStreetNoteNetworkAddress);
            result.push(this._tiandituImageMapNetworkAddress);
            result.push(this._tiandituImageNoteNetworkAddress);

            return result;
        },

        // 是否为本地瓦片服务
        _isLocalTileService: false,

        // 天地图影像地图服务本地地址
        _tiandituImageMapLocalAddress: "http://192.168.1.1:8080/tianditu/image/{z}/{x}/{y}.png",
        // 天地图街道地图服务本地地址
        _tiandituStreetMapLocalAddress: "http://192.168.1.1:8080/tianditu/vector/{z}/{x}/{y}.png",

        // 天地图影像地图服务网络地址
        _tiandituImageMapNetworkAddress: "http://{s}.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=192631ad8c712c0c28bf0399a3d3e5d9",
        // 天地图影像注记服务网络地址
        _tiandituImageNoteNetworkAddress: "http://{s}.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=192631ad8c712c0c28bf0399a3d3e5d9",
        // 天地图街道地图服务网络地址
        _tiandituStreetMapNetworkAddress: "http://{s}.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=192631ad8c712c0c28bf0399a3d3e5d9",
        // 天地图街道注记服务网络地址
        _tiandituStreetNoteNetworkAddress: "http://{s}.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=192631ad8c712c0c28bf0399a3d3e5d9"
    };

})(jQuery);