function LoadStage(){
    var setting = {};
    setting[0] = [
        [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
        [7,23,23,23,23,23,23,23,7,7,7,7,23,23,23,23,23,23,23,7],
        [7,144,145,145,145,145,145,145,23,23,23,23,145,145,145,145,145,145,146,7],
        [7,160,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,162,7],
        [7,160,161,7,23,161,161,161,161,161,161,161,161,161,161,23,7,161,162,7],
        [7,160,161,23,161,161,161,161,161,161,161,161,161,161,161,161,23,161,162,7],
        [7,160,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,162,7],
        [7,160,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,162,7],
        [7,160,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,162,7],
        [7,160,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,162,7],
        [7,160,161,7,161,161,161,161,161,161,161,161,161,161,161,161,7,161,162,7],
        [7,160,161,23,23,161,161,161,161,161,161,161,161,161,161,23,23,161,162,7],
        [7,160,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,162,7],
        [7,160,161,161,161,161,161,161,7,7,7,7,161,161,161,161,161,161,162,7],
        [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7]
    ];
    setting[1] = [
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,45,45,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,45,45,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,45,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,45,-1,-1,-1],
        [-1,-1,-1,-1,45,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,45,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,45,45,45,45,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
    ];
    setting[2] = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1],
        [4,2,0,0,0,0,0,2,1,1,1,1,2,0,0,0,0,0,2,4],
        [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
        [4,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,4],
        [4,0,0,1,2,0,0,0,0,0,0,0,0,0,0,2,1,0,0,4],
        [4,0,0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,4],
        [4,0,0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,4],
        [4,0,0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,4],
        [4,0,0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,4],
        [4,0,0,1,2,0,0,0,0,0,0,0,0,0,0,2,1,0,0,4],
        [4,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,4],
        [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
        [4,2,0,0,0,0,0,2,1,1,1,1,0,0,0,0,0,0,2,4],
        [1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1]
    ];
    setting[3] = [3,7];
    setting[4] = [11,11,'./image/ObjectImage/red.png','./image/ObjectImage/redcannon.png',8,0,9,2,10,2,3]
    setting[5] = [17,4,'./image/ObjectImage/elite.png','./image/ObjectImage/elitecannon.png',3,1,10,1.5,15,4,5]
    setting[6] = [12,2,'./image/ObjectImage/pink.png','./image/ObjectImage/pinkcannon.png',4,0,10,0,6,5,9]
    setting[7] = [5,13,'./image/ObjectImage/pink.png','./image/ObjectImage/pinkcannon.png',4,0,10,0,6,5,9]
 
    return setting;
}
