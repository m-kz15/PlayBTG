function LoadStage(){
    var setting = {};
    setting[0] = [
        [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
        [7,23,23,23,23,23,23,23,23,23,23,23,23,23,7,23,23,23,23,7],
        [7,144,145,145,145,145,145,145,145,145,145,145,145,145,7,145,145,145,146,7],
        [7,160,161,161,161,161,161,161,161,161,161,161,161,161,7,161,161,161,162,7],
        [7,160,161,161,161,161,161,161,161,161,161,161,161,161,23,161,161,161,162,7],
        [7,160,23,23,7,161,161,161,161,161,161,161,161,161,161,161,161,161,162,7],
        [7,160,161,161,23,23,23,23,23,23,23,161,161,161,161,161,161,161,162,7],
        [7,160,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,162,7],
        [7,160,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,162,7],
        [7,160,161,161,7,23,23,23,23,23,23,161,161,161,161,161,161,161,162,7],
        [7,160,23,23,23,161,161,161,161,161,161,161,161,161,161,161,161,161,162,7],
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
        [-1,-1,45,45,45,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,45,45,45,45,45,45,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,45,45,45,45,45,45,45,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,45,45,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
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
        [4,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
        [4,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,4],
        [4,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,4],
        [4,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,4],
        [4,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,4],
        [4,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
        [4,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,4],
        [4,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,4],
        [4,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,4],
        [1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1]
    ];
    setting[3] = [12,3]
    setting[4] = [18,10,'./image/ObjectImage/green.png','./image/ObjectImage/greencannon.png',1,0,15,0,30,3,2]
    setting[5] = [8,8,'./image/ObjectImage/elite.png','./image/ObjectImage/elitecannon.png',3,1,10,1.5,15,4,5]
    setting[6] = [3,12,'./image/ObjectImage/sand.png','./image/ObjectImage/sandcannon.png',2,2,15,2.4,60,6,8]
    setting[7] = [16,2,'./image/ObjectImage/meisai.png','./image/ObjectImage/meisaicannon.png',2,2,14,1.6,12,2,11]
 
    return setting;
}
