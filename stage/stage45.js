function LoadStage(){
    var setting = [];
    
    setting[0] = [
        [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
        [7,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,7],
        [7,144,145,145,145,145,145,145,145,145,145,145,145,145,145,145,145,145,146,7],
        [7,160,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,162,7],
        [7,160,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,162,7],
        [7,160,23,23,23,161,161,161,23,161,161,23,161,161,161,23,23,23,162,7],
        [7,160,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,162,7],
        [7,160,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,162,7],
        [7,160,161,23,7,23,23,161,161,161,161,161,161,23,23,7,23,161,162,7],
        [7,160,161,161,7,161,161,161,23,23,23,23,161,161,161,7,161,161,162,7],
        [7,160,161,161,7,161,161,161,161,161,161,161,161,161,161,7,161,161,162,7],
        [7,160,161,161,23,161,161,161,161,161,161,161,161,161,161,23,161,161,162,7],
        [7,160,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,162,7],
        [7,160,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,162,7],
        [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7]
    ];
    setting[1] = [
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,45,45,45,-1,-1,-1,45,-1,-1,45,-1,-1,-1,45,45,45,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,45,45,45,45,-1,-1,-1,-1,-1,-1,45,45,45,45,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,45,45,45,45,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
    ];
    setting[2] = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1],
        [4,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,4],
        [4,0,0,0,0,0,3,0,0,0,0,0,0,0,3,0,0,0,0,4],
        [4,0,0,0,0,0,3,0,0,0,0,0,0,3,0,0,0,0,0,4],
        [4,0,1,1,1,0,3,0,1,0,0,1,3,0,0,1,1,1,0,4],
        [4,0,0,0,0,0,3,0,0,0,0,0,3,0,0,0,0,0,0,4],
        [4,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,4],
        [4,0,0,1,1,1,1,0,0,0,0,0,3,1,1,1,1,0,0,4],
        [4,0,0,0,1,0,0,0,1,1,1,1,3,0,0,1,0,0,0,4],
        [4,0,0,0,1,0,0,0,3,3,3,3,3,0,0,1,0,0,0,4],
        [4,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,4],
        [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
        [4,0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,0,0,0,4],
        [1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1]
    ];
    setting[3] = [10,8];
    setting[4] = [17,4,'./image/ObjectImage/red.png','./image/ObjectImage/redcannon.png',8,0,9,2,10,2,3]
    setting[5] = [3,12,'./image/ObjectImage/snow.png','./image/ObjectImage/snowcannon.png',2,1,12,0.5,30,7,6]
    setting[6] = [5,3,'./image/ObjectImage/brown.png','./image/ObjectImage/browncannon.png',1,1,8,0,30,0,0]
    setting[7] = [17,12,'./image/ObjectImage/red.png','./image/ObjectImage/redcannon.png',8,0,9,2,10,12,3]
    setting[8] = [3,4,'./image/ObjectImage/red.png','./image/ObjectImage/redcannon.png',8,0,9,2,10,12,3]
    setting[9] = [17,12]
    return setting;
}