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
    setting[3] = [9,3];
    setting[4] = [9,8,'./image/ObjectImage/brown.png','./image/ObjectImage/browncannon.png',1,1,8,0,20,0,0]
    setting[5] = [2,3,'./image/ObjectImage/gray.png','./image/ObjectImage/graycannon.png',2,1,8,1.0,20,3,1]
    setting[6] = [17,3,'./image/ObjectImage/gray.png','./image/ObjectImage/graycannon.png',2,1,8,1.0,20,3,1]
    setting[7] = [2,11,'./image/ObjectImage/meisai.png','./image/ObjectImage/meisaicannon.png',2,3,13,2.2,12,10,11];
    setting[8] = [17,11,'./image/ObjectImage/meisai.png','./image/ObjectImage/meisaicannon.png',2,3,13,2.2,12,10,11];
    setting[9] = [10,12]
    return setting;
}