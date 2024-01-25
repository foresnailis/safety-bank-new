self.addEventListener('message', function(e) {
    // 假设convexHull函数已经定义在这个文件里或者通过其他方式引入
    var result = grahamScan(e.data.points);
    self.postMessage(result);
    self.close();
  });

//   // 计算点p1到p2的极角（相对于基准点origin）
// function angle(p1, p2,origin) {
//     console.log(p1)
//     const dx1 = p1.lng - origin.lng;
//     const dy1 = p1.lat - origin.lat;
//     const dx2 = p2.lng - origin.lng;
//     const dy2 = p2.lat - origin.lat;
//     return Math.atan2(dy1, dx1) - Math.atan2(dy2, dx2);
// }

// // 找到最左下角的点作为基准点
// function findLowestLeftmostPoint(points) {
//     let lowest = points[0];
//     for (let i = 1; i < points.length; i++) {
//         if (points[i].lat < lowest.lat || (points[i].lat === lowest.lat && points[i].lng < lowest.lng)) {
//             lowest = points[i];
//         }
//     }
//     return lowest;
// }


// // 使用Graham扫描算法计算最小凸包
// function convexHull(points) {
//     if (points.length < 3) {
//         return points;
//     }

//     // 找到最左下角的点作为基准点
//     const origin = findLowestLeftmostPoint(points);
    
//     // 根据极角排序所有点
//     var sortedPoints = points.slice(); // 复制一份，避免改变原始数组
//     // console.log(sortedPoints)
//     sortedPoints.sort( (a,b)=>angle(a,b,origin));
//     console.log(sortedPoints)
//     // sortedPoints = quickSort(sortedPoints, angle);
//     // 初始化凸包
//     const hull = [sortedPoints[0], sortedPoints[1]];
    
//     for (let i = 2; i < sortedPoints.length; i++) {
//         var top = hull.pop();
//         console.log(top)
//         while (angle(hull[hull.length - 1], sortedPoints[i], top) < 0) {
//             top = hull.pop();
//             console.log(hull.length)
//         }
//         hull.push(top);
//         hull.push(sortedPoints[i]);
//     }

//     return hull;
// }


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

