function LoadStage(){
    var setting = [];
    
    setting[0] = [
        [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
        [7,23,23,23,7,23,23,23,23,23,23,23,23,23,23,7,23,23,23,7],
        [7,144,145,145,23,145,145,145,145,145,145,145,145,145,145,23,145,145,146,7],
        [7,160,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,162,7],
        [7,160,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,162,7],
        [7,23,23,161,161,161,161,161,161,161,161,161,161,161,161,161,161,23,23,7],
        [7,160,161,161,161,161,161,23,23,161,161,23,23,161,161,161,161,161,162,7],
        [7,160,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,162,7],
        [7,160,161,23,161,161,23,161,161,161,161,161,161,23,161,161,23,161,162,7],
        [7,160,161,161,161,161,161,23,161,161,161,161,23,161,161,161,161,161,162,7],
        [7,160,161,161,23,161,161,161,161,23,23,161,161,161,161,23,161,161,162,7],
        [7,160,161,161,161,161,161,161,23,161,161,23,161,161,161,161,161,161,162,7],
        [7,160,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,162,7],
        [7,160,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,162,7],
        [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7]
    ];
    setting[1] = [
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,45,45,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,45,45,-1],
        [-1,-1,-1,-1,-1,-1,-1,45,45,-1,-1,45,45,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,45,-1,-1,45,-1,-1,-1,-1,-1,-1,45,-1,-1,45,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,45,-1,-1,-1,-1,45,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,45,-1,-1,-1,-1,45,45,-1,-1,-1,-1,45,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,45,-1,-1,45,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
    ];
    setting[2] = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1],
        [4,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,4],
        [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
        [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
        [4,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,4],
        [4,0,0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0,0,4],
        [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
        [4,0,0,1,0,0,1,0,0,0,0,0,0,1,0,0,1,0,0,4],
        [4,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,4],
        [4,0,0,0,1,0,0,0,0,1,1,0,0,0,0,1,0,0,0,4],
        [4,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,4],
        [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
        [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
        [1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1]
    ];
    setting[3] = [9,8];
    setting[4] = [9,3,'./image/ObjectImage/gray.png','./image/ObjectImage/graycannon.png',2,1,8,1.0,20,1,1]
    setting[5] = [2,3,'./image/ObjectImage/green.png','./image/ObjectImage/greencannon.png',1,0,13.5,1.0,20,2,2]
    setting[6] = [17,3,'./image/ObjectImage/green.png','./image/ObjectImage/greencannon.png',1,0,13.5,1.0,20,2,2]
    setting[7] = [2,11,'./image/ObjectImage/elite.png','./image/ObjectImage/elitecannon.png',3,1,10,1.5,15,4,5]
    setting[8] = [17,11,'./image/ObjectImage/elite.png','./image/ObjectImage/elitecannon.png',3,1,10,1.5,15,4,5]

    return setting;
}