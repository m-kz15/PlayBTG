function LoadStage(){
    var setting = [];
    
    setting[0] = [
        [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
    [7,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,7],
    [7,144,145,145,145,145,145,145,145,145,145,145,145,145,145,145,145,145,146,7],
    [7,160,23,161,161,23,161,161,23,23,161,23,23,161,23,161,161,23,162,7],
    [7,160,145,161,161,145,161,161,145,145,23,145,145,161,145,161,161,145,162,7],
    [7,160,161,161,161,161,161,161,161,161,145,161,161,161,161,161,161,161,162,7],
    [7,160,161,161,23,161,161,161,161,161,161,161,161,161,161,161,23,161,162,7],
    [7,160,161,161,145,161,161,161,161,161,161,161,161,161,161,161,145,161,162,7],
    [7,160,161,161,161,161,161,161,161,161,161,161,23,161,161,161,161,161,162,7],
    [7,160,161,161,161,161,161,23,161,161,161,161,145,161,161,161,161,161,162,7],
    [7,160,161,23,161,161,161,145,161,161,161,161,161,161,161,23,161,161,162,7],
    [7,160,161,145,161,161,161,161,161,161,161,161,161,161,161,145,161,161,162,7],
    [7,160,23,161,161,161,23,161,161,23,23,161,161,23,161,161,161,23,162,7],
    [7,160,145,161,161,161,145,161,161,145,145,161,161,145,161,161,161,145,162,7],
    [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7]
    ];
    setting[1] = [
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,45,-1,-1,45,-1,-1,45,45,-1,45,45,-1,45,-1,-1,45,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,45,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,45,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,45,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,45,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,45,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,45,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,45,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,45,-1,-1,-1,45,-1,-1,45,45,-1,-1,45,-1,-1,-1,45,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
    ];
    setting[2] = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1],
        [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
        [4,0,1,2,2,1,2,2,1,1,2,1,1,2,1,2,2,1,2,4],
        [4,0,2,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,4],
        [4,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,4],
        [4,0,2,0,1,0,0,0,0,0,0,0,0,0,0,0,1,2,0,4],
        [4,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,4],
        [4,0,2,0,0,0,0,0,0,0,0,0,1,0,0,0,0,2,0,4],
        [4,0,2,0,0,0,0,1,0,0,0,0,0,0,0,0,0,2,0,4],
        [4,0,2,1,0,0,0,0,0,0,0,0,0,0,0,1,0,2,0,4],
        [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,4],
        [4,2,1,2,2,2,1,2,2,1,1,2,2,1,2,2,2,1,0,4],
        [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
        [1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1]
    ];
    setting[3] = [4,8];
    setting[4] = [16,8,'./image/ObjectImage/meisai.png','./image/ObjectImage/meisaicannon.png',5,2,10,2.2,12,10,11];
    setting[5] = [18,2,'./image/ObjectImage/green.png','./image/ObjectImage/greencannon.png',1,0,14,1.0,10,2,2]
    setting[6] = [1,13,'./image/ObjectImage/green.png','./image/ObjectImage/greencannon.png',1,0,14,1.0,10,2,2]

    return setting;
}