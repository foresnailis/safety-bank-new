<template>
    <div id="baidumap"></div> 
</template>
<script setup>
 /* eslint-disable */ 
import { onMounted ,ref} from 'vue';
import BaiduMap from 'BaiduMap'



var map=null;
var currentPoint=null;
var pointOffset=[
    [0.01,0],
    [0.005,0],
    [-0.005,0],
    [0,0.005],
    [0,-0.005],
    [+0.007,-0.003],
    [-0.002,0],
    [-0.002,0.002],
    [0.001,0.002]
]
var mkList=[]
var calcList=[]
var markedPoint=[]

function qqMapTransBMap(lng, lat) {
      let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
      let x = lng;
      let y = lat;
      let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
      let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
      let lngs = z * Math.cos(theta) + 0.0065;
      let lats = z * Math.sin(theta) + 0.006;
     
      return {
          lng: lngs,
          lat: lats 
      } 
}
function afterLocation(lat,lng){
    map = new BaiduMap.Map("baidumap");
    let point = new BaiduMap.Point(lng, lat); // 百度BD09坐标
    map.centerAndZoom(point, 15); // 地图实例化
    map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
    map.addControl(new BaiduMap.ScaleControl());// 添加比例尺控件
    map.addControl(new BaiduMap.ZoomControl());// 添加缩放控件
    map.addControl(new BaiduMap.LocationControl());// 添加定位控件
    var mk = new BaiduMap.Marker(point);
    map.addOverlay(mk);
    map.panTo(point);
    currentPoint  = point; // 百度BD09坐标

       
    var promises = [];

    pointOffset.forEach(function(element, index, arr) {
        var point=new BaiduMap.Point(currentPoint.lng+element[0], currentPoint.lat+element[1]); 
        var mk = new BaiduMap.Marker(point);
        mkList.push(mk);
        map.addOverlay(mk);
                
        //var ridingInfo=ridingRoute(currentPoint,point,false);
        var promise = new Promise((resolve, reject) => {
            walkingRoute(currentPoint,point,false, (distance, duration) => {
                //console.log('Distance:', distance, 'Duration:', duration);
                calcList.push([distance,duration])
                if (!distance.includes("公里")){ markedPoint.push(point);}
                var opts = {
                    width : 200,     // 信息窗口宽度
                    height: 100,     // 信息窗口高度
                    title : "测试店" , // 信息窗口标题
                    message:"测试店面"
                }
                var infoWindow = new BaiduMap.InfoWindow('步行距离'+distance+'，步行时间'+duration, opts);  // 创建信息窗口对象 
                    mk.addEventListener("click", function(){          
                    map.openInfoWindow(infoWindow, point); //开启信息窗口
                }); 
                // 其他处理逻辑
                // 解决Promise
                resolve(); 
            });
        });
        promises.push(promise);
        });
        Promise.all(promises)
        .then(() => {
            // 在这里执行绘制多边形的逻辑，使用markedPoint数组中的点
            // 可以调用一个函数来处理这部分逻辑
            markedPoint.push(currentPoint)
            // console.log(markedPoint)
            drawPolygon(markedPoint);
        })
        .catch(error => {
            console.error('Error:', error);
        });


}

onMounted(()=>{
    // if (navigator.geolocation) {
    //    // alert('支持定位');
    //     var n = navigator.geolocation.getCurrentPosition(function(res){
    //         alert('纬度'+res.coords.latitude+'经度'+res.coords.longitude+'精度'+res.coords.accuracy); // 需要的坐标地址就在res中

    //     },
    //     function(error){
    //         switch (error.code) {
    //             case error.PERMISSION_DENIED:
    //                 alert('用户拒绝对获取地理位置的请求。')
    //                 break;
    //             case error.POSITION_UNAVAILABLE:
    //                 alert('位置信息是不可用的。')
    //                 break;
    //             case error.TIMEOUT:
    //                 alert('请求用户地理位置超时。')
    //                 break;
    //             case error.UNKNOWN_ERROR:
    //                 alert('未知错误。')
    //                 break;
    //         }
    //     },
    //     {
    //         enableHighAccuracy:true,
    //         timeout:5000,
    //         maximumAge:0
    //     }
    //     );
    // } else {
    //     alert('该浏览器不支持定位');
    // }

    var geolocation = new qq.maps.Geolocation("7WQBZ-GJ2K5-V2PID-IBVSK-6FHK7-4IFXU", "mapqq");
    geolocation.getLocation(
        function(position){
            // alert(position.lat+' '+position.lng)
            console.log(position)
            var {lng,lat}=qqMapTransBMap(position.lng,position.lat);
            // alert(lat+' '+lng)
            afterLocation(lat,lng)

        },
        function(){
            alert('定位失败')
        },
        {
            timeout:5000
        }
    )

})

const drawPolygon=(points)=>{
    // points.forEach((element)=>{
    //                 console.log(element.lng,element.lat)
    //             })
        // 创建面
       
    var polygon = new BMapGL.Polygon( grahamScan(points), {
        zIndex: 10,
        fillOpacity: 0.3,
        fillColor:'blue',
        strokeStyle: 'dashed',
        strokeColor: 'red',
        strokeWeight: 8,
        strokeOpacity: 0.3,
    });
    map.addOverlay(polygon);
    // var polygon = new BMapGL.Polygon( points, {
    //     zIndex: 10,
    //     fillOpacity: 0.3,
    //     strokeStyle: 'dashed',
    //     strokeColor: 'blue',
    //     strokeWeight: 8,
    //     strokeOpacity: 0.3,
    // });
//     console.log(points)
//     if (window.Worker) {
//     // 创建一个新的Worker
//     const worker = new Worker(new URL('./convexHullWorker.js', import.meta.url));
//     // const worker = new Worker('./convexHullWorker.js');

//     // 发送数据到Worker
//     worker.postMessage({ points: points });

//     // 接收来自Worker的消息
//     worker.onmessage = function(e) {
//         const pointss = e.data;
//         console.log(pointss);
//         // 使用得到的点创建多边形
//         var polygon = new BMapGL.Polygon(pointss, {
//             zIndex: 10,
//             fillOpacity: 0.3,
//             strokeStyle: 'dashed',
//             strokeColor: 'blue',
//             strokeWeight: 8,
//             strokeOpacity: 0.3,
//         });
//         // 这里可以对多边形进行后续操作，比如添加到地图上
//         map.addOverlay(polygon);
//     };

//     // 监听错误事件
//     worker.onerror = function(error) {
//         console.error("Worker error: " + error.message + "\n");
//         throw error;
//     };
// } else {
//     console.log('Your browser doesn\'t support web workers.');
// }
    // const pointss= convexHull(points)
    // console.log(pointss)

     // 增加多边形
}


const ridingRoute=(start,end,flag=false, callback)=>{
    var distance=null;
    var duration=null;
    if(flag==false){
        var riding = new BaiduMap.RidingRoute(map, { 
            renderOptions: { 
                map: null, 
                autoViewport: false 
            },
            onSearchComplete: function (results){
                if (riding.getStatus() != BMAP_STATUS_SUCCESS){console.log('测距失败');return;}
                var plan = results.getPlan(0);
                distance=plan.getDistance(true);
                duration=plan.getDuration(true);
                //console.log('骑行距离'+plan.getDistance(true)+'骑行时间'+plan.getDuration(true)); 
                if (callback && typeof callback === 'function') {
                    callback(distance, duration);
                }
            },
            onPolylinesSet: function(){setTimeout(function(){},"1000");		
            }});
        riding.search(start, end);
    }
}

const walkingRoute=(start,end,flag=false, callback)=>{
    var distance=null;
    var duration=null;
    if(flag==false){
        var walking = new BaiduMap.WalkingRoute(map, { 
            renderOptions: { 
                map: null, 
                autoViewport: false 
            },
            onSearchComplete: function (results){
                if (walking.getStatus() != BMAP_STATUS_SUCCESS){console.log('测距失败');return;}
                var plan = results.getPlan(0);
                distance=plan.getDistance(true);
                duration=plan.getDuration(true);
                //console.log('步行距离'+plan.getDistance(true)+'步行时间'+plan.getDuration(true)); 
                 // 调用回调函数，传递distance和duration
                if (callback && typeof callback === 'function') {
                    callback(distance, duration);
                }
            },
            onPolylinesSet: function(){setTimeout(function(){},"1000");		
        }});
        walking.search(start, end);
    }
}




function crossProduct(p1, p2, p3) {
    return (p2.lat - p1.lat) * (p3.lng - p2.lng) - (p2.lng - p1.lng) * (p3.lat - p2.lat);
}

function distance(p1, p2) {
    return (p1.lng - p2.lng) ** 2 + (p1.lat - p2.lat) ** 2;
}

function nextToTop(stack) {
    return stack[stack.length - 2];
}

function compare(p1, p2, p0) {
    let order = crossProduct(p0, p1, p2);
    if (order === 0) {
        return distance(p0, p2) >= distance(p0, p1) ? -1 : 1;
    }
    return order > 0 ? -1 : 1;
}

function grahamScan(points) {
    let n = points.length;
    if (n < 3) return;

    let l = 0;
    for (let i = 1; i < n; i++) {
        if (points[i].lng < points[l].lng) {
            l = i;
        }
    }

    [points[0], points[l]] = [points[l], points[0]];

    let p0 = points[0];
    points.sort((p1, p2) => compare(p1, p2, p0));

    let stack = [];
    stack.push(points[0], points[1], points[2]);

    for (let i = 3; i < n; i++) {
        while (stack.length > 1 && crossProduct(nextToTop(stack), stack[stack.length - 1], points[i]) <= 0) {
            stack.pop();
        }
        stack.push(points[i]);
    }

    return stack;
}

    
</script>
<style scoped>

    #baidumap{
        height:500px
    }    
</style>