function LoadStage(){
    var setting = [];
    
    setting[0] = [
        [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
        [7,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,7],
        [7,144,145,145,145,145,145,145,145,145,145,145,145,145,145,145,145,145,146,7],
        [7,160,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,162,7],
        [7,160,161,161,161,7,161,161,161,161,161,161,161,161,161,161,161,161,162,7],
        [7,160,161,161,161,7,161,161,161,161,161,161,7,161,161,161,161,161,162,7],
        [7,160,161,161,161,23,161,161,161,161,161,161,7,161,161,161,161,161,162,7],
        [7,160,161,161,161,145,161,161,161,161,161,161,7,161,161,161,161,161,162,7],
        [7,160,161,161,161,177,161,161,161,161,161,161,7,161,161,161,161,161,162,7],
        [7,160,161,161,161,7,161,161,161,161,161,161,7,161,161,161,161,161,162,7],
        [7,160,161,161,161,7,161,161,161,161,161,161,23,161,161,161,161,161,162,7],
        [7,160,161,161,161,23,161,161,161,161,161,161,145,161,161,161,161,161,162,7],
        [7,160,161,161,161,145,161,161,161,161,161,161,161,161,161,161,161,161,162,7],
        [7,160,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,162,7],
        [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7]
    ];
    setting[1] = [
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,45,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,7,-1,-1,-1,-1,-1,-1,45,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,7,-1,-1,-1,-1,-1,-1,7,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,45,-1,-1,-1,-1,-1,-1,7,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,7,-1,-1,-1,-1,-1,-1,7,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
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
        [4,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
        [4,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,4],
        [4,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,4],
        [4,0,0,0,0,3,0,0,0,0,0,0,1,3,3,3,3,3,3,4],
        [4,0,0,0,0,3,0,0,0,0,0,0,1,3,3,3,3,3,3,4],
        [4,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,4],
        [4,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,4],
        [4,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
        [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
        [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
        [1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1]
    ];
    setting[3] = [2,8];
    setting[4] = [15,4,'./image/ObjectImage/elitegreen.png','./image/ObjectImage/elitegreencannon.png',3,2,14,1.75,10,4,7]
    setting[5] = [15,11,'./image/ObjectImage/elitegreen.png','./image/ObjectImage/elitegreencannon.png',3,2,14,1.75,10,4,7]
 

    return setting;
}