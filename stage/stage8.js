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
        [4,2,0,0,0,0,0,2,1,1,1,1,2,0,0,0,0,0,2,4],
        [1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1]
    ];
    setting[3] = [3,7];
    setting[4] = [11,11,'./image/ObjectImage/red.png','./image/ObjectImage/redcannon.png',8,0,9,2,10,2,3]
    setting[5] = [12,7,'./image/ObjectImage/green.png','./image/ObjectImage/greencannon.png',1,0,15,1.0,20,3,2]
    setting[6] = [12,3,'./image/ObjectImage/gray.png','./image/ObjectImage/graycannon.png',2,1,8,1.0,20,1,1];
    setting[7] = [5,3]
    return setting;
}