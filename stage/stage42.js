function LoadStage(){
    var setting = {};
    setting[0] = [
        [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
        [7,23,23,23,23,23,23,23,23,23,23,23,23,23,7,23,23,23,23,7],
        [7,144,145,145,145,145,145,145,145,145,145,145,145,145,7,145,145,145,146,7],
        [7,160,161,161,161,161,161,161,161,161,161,161,161,161,7,161,161,161,162,7],
        [7,160,161,161,161,161,161,161,161,161,161,161,161,161,23,161,161,161,162,7],
        [7,160,161,23,7,161,161,161,161,161,161,161,161,161,161,161,161,161,162,7],
        [7,160,161,161,23,7,161,161,161,161,23,161,161,161,161,161,161,161,162,7],
        [7,160,161,161,161,7,161,161,161,161,161,161,161,161,161,161,161,161,162,7],
        [7,160,161,161,161,7,161,161,161,161,161,161,161,161,161,161,161,161,162,7],
        [7,160,161,161,7,23,161,161,161,161,23,161,161,161,161,161,161,161,162,7],
        [7,160,161,23,23,161,161,161,161,161,161,161,161,161,161,161,161,161,162,7],
        [7,160,161,161,161,161,161,161,161,161,161,161,161,161,7,161,161,161,162,7],
        [7,160,161,161,161,161,161,161,161,161,161,161,161,161,7,161,161,161,162,7],
        [7,160,161,161,161,161,161,161,161,161,161,161,161,161,7,161,161,161,162,7],
        [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7]
    ];
    setting[1] = [
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,45,45,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,45,-1,-1,-1,-1,45,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,45,-1,-1,-1,-1,-1,45,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,45,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,45,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
    ];
    setting[2] = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1],
        [4,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,4],
        [4,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,4],
        [4,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,4],
        [4,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
        [4,0,0,0,1,1,0,0,0,0,1,0,0,0,0,0,0,0,0,4],
        [4,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
        [4,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
        [4,0,0,0,1,1,0,0,0,0,1,0,0,0,0,0,0,0,0,4],
        [4,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
        [4,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,4],
        [4,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,4],
        [4,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,4],
        [1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1]
    ];
    setting[3] = [4,8];
    setting[4] = [14,8,'./image/ObjectImage/snow.png','./image/ObjectImage/snowcannon.png',2,1,12,0.5,30,7,6]
    setting[5] = [11,12,'./image/ObjectImage/lightgreen.png','./image/ObjectImage/lightgreencannon.png',4,2,10,1,20,4,4];
    setting[6] = [11,4,'./image/ObjectImage/elite.png','./image/ObjectImage/elitecannon.png',3,1,10,1.5,15,3,5]
    setting[7] = [17,4,'./image/ObjectImage/elite.png','./image/ObjectImage/elitecannon.png',3,1,10,1.5,15,12,5]
    setting[8] = [17,12,'./image/ObjectImage/elite.png','./image/ObjectImage/elitecannon.png',3,1,10,1.5,15,12,5]

    return setting;
}