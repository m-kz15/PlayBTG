function LoadStage(){
    var setting = {};
    setting[0] = [
        [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
        [7,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,7],
        [7,144,145,145,145,145,145,145,145,145,145,145,145,145,145,145,145,145,146,7],
        [7,160,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,162,7],
        [7,160,161,161,161,161,161,161,161,7,161,23,23,23,23,23,161,161,162,7],
        [7,160,161,161,161,161,161,161,161,7,161,145,145,145,145,145,161,161,162,7],
        [7,160,161,161,161,23,23,23,23,23,161,161,161,161,161,161,161,161,162,7],
        [7,160,161,161,161,145,145,145,145,161,161,161,161,161,161,161,161,161,162,7],
        [7,160,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,162,7],
        [7,160,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,162,7],
        [7,160,161,23,23,23,23,23,161,23,23,23,23,161,161,161,23,23,23,7],
        [7,160,161,145,145,145,145,145,161,145,145,145,145,161,161,161,145,145,146,7],
        [7,160,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,162,7],
        [7,160,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,162,7],
        [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7]
    ];
    setting[1] = [
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,45,-1,45,45,45,45,45,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,7,-1,39,39,39,39,39,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,45,45,45,45,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,39,39,39,39,39,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,45,45,45,45,45,-1,45,45,45,45,-1,-1,-1,45,45,45,-1],
        [-1,-1,-1,39,39,39,39,39,-1,39,39,39,39,-1,-1,-1,39,39,39,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
    ];
    setting[2] = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1],
        [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
        [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
        [4,0,0,0,0,0,0,0,0,1,0,1,1,1,1,1,0,0,0,4],
        [4,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,4],
        [4,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,4],
        [4,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,4],
        [4,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,4],
        [4,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,4],
        [4,0,0,1,1,1,1,1,0,1,1,1,1,0,0,0,1,1,1,4],
        [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
        [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
        [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
        [1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1],
    ];
    setting[3] = [15,8];
    setting[4] = [18,13,'./image/ObjectImage/pink.png','./image/ObjectImage/pinkcannon.png',4,0,10,0,6,5,9]
    setting[5] = [8,13,'./image/ObjectImage/green.png','./image/ObjectImage/greencannon.png',1,0,12,0.0,20,3,2]
    setting[6] = [5,2,'./image/ObjectImage/gray.png','./image/ObjectImage/graycannon.png',2,1,8,1.0,20,1,1]
    setting[7] = [2,6,'./image/ObjectImage/green.png','./image/ObjectImage/greencannon.png',1,0,12,1.0,20,2,2]
    setting[8] = [2,10,'./image/ObjectImage/sand.png','./image/ObjectImage/sandcannon.png',2,2,15,2.4,60,6,8]


    return setting;
}