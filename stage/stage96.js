function LoadStage(){
    var setting = {};
    setting[0] = [
        [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
        [7,23,23,23,23,23,23,23,7,7,7,7,23,23,23,23,23,23,23,7],
        [7,144,145,145,145,145,145,145,23,23,23,23,145,145,145,145,145,145,146,7],
        [7,160,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,162,7],
        [7,160,161,161,161,161,7,23,161,161,161,161,161,161,161,23,7,161,162,7],
        [7,160,161,161,161,161,7,161,161,161,161,161,161,161,161,161,23,161,162,7],
        [7,160,161,161,161,161,23,161,161,161,161,161,161,161,161,161,161,161,162,7],
        [7,160,161,161,161,161,161,7,161,161,161,161,161,161,161,161,161,161,162,7],
        [7,160,161,161,161,161,161,23,161,161,161,161,161,161,161,161,161,161,162,7],
        [7,160,161,7,161,161,161,161,161,161,23,161,161,161,161,161,161,161,162,7],
        [7,160,161,7,161,161,161,161,161,161,161,161,161,7,161,161,161,161,162,7],
        [7,160,161,23,23,161,161,161,161,161,161,161,23,23,161,161,161,161,162,7],
        [7,160,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,162,7],
        [7,160,161,161,161,161,161,161,7,7,7,7,161,161,161,161,161,161,162,7],
        [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7]
    ];
    setting[1] = [
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,45,45,-1,-1,-1,-1,-1,-1,-1,45,45,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,45,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,45,-1,-1,-1,-1,-1,-1,45,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,45,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,45,-1,-1,-1,-1,-1,-1,-1,45,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,45,45,45,45,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
    ];
    setting[2] = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1],
        [4,2,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,2,4],
        [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
        [4,0,0,0,0,0,1,1,3,0,0,0,0,0,3,1,1,0,0,4],
        [4,0,0,0,0,0,1,3,3,0,0,0,0,0,3,0,1,0,0,4],
        [4,0,0,0,0,0,1,3,3,0,0,0,0,0,3,3,3,0,0,4],
        [4,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,4],
        [4,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,4],
        [4,0,0,1,3,0,0,0,0,0,1,3,3,3,0,0,0,0,0,4],
        [4,0,0,1,3,0,0,0,0,0,0,3,0,1,0,0,0,0,0,4],
        [4,0,0,1,1,3,0,0,0,0,0,3,1,1,0,0,0,0,0,4],
        [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
        [4,2,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,2,4],
        [1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1]
    ];
    setting[3] = [2,7];
    setting[4] = [15,5,'./image/ObjectImage/elitegreen.png','./image/ObjectImage/elitegreencannon.png',3,3,15.5,1.75,10,5,7]
    setting[5] = [12,10,'./image/ObjectImage/snow.png','./image/ObjectImage/snowcannon.png',2,1,12,0.5,30,7,6]
    setting[6] = [15,8,'./image/ObjectImage/green.png','./image/ObjectImage/greencannon.png',1,0,15,1.0,20,8,2]
    setting[7] = [16,13,'./image/ObjectImage/elite.png','./image/ObjectImage/elitecannon.png',3,1,10,1.5,15,8,5]
    setting[8] = [17,3,'./image/ObjectImage/red.png','./image/ObjectImage/redcannon.png',8,0,9,2,10,2,3]
    setting[9] = [15,12,'./image/ObjectImage/red.png','./image/ObjectImage/redcannon.png',8,0,9,2,10,2,3]
    setting[10] = [18,3,'./image/ObjectImage/gray.png','./image/ObjectImage/graycannon.png',2,1,8,1.0,20,1,1]

    return setting;
}