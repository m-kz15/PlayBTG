function LoadStage(){
    var setting = [];
    
    setting[0] = [
        [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
    [7,23,23,23,23,7,23,23,23,23,23,7,23,23,23,23,23,23,23,7],
    [7,144,145,145,145,7,145,145,145,145,145,7,145,145,145,145,145,145,146,7],
    [7,160,161,161,161,7,161,161,161,161,161,7,161,161,161,161,161,161,162,7],
    [7,160,161,161,161,23,161,161,161,161,161,23,161,161,7,23,23,161,162,7],
    [7,160,161,161,161,161,161,161,161,161,161,161,161,161,7,161,161,161,162,7],
    [7,160,161,161,161,161,161,161,161,161,161,161,161,161,23,161,161,161,162,7],
    [7,23,23,23,23,23,161,161,161,161,161,161,161,161,161,161,161,161,162,7],
    [7,160,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,162,7],
    [7,160,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,162,7],
    [7,160,161,161,161,161,161,161,161,161,161,161,161,161,23,161,161,161,162,7],
    [7,23,23,23,23,23,23,161,161,23,161,161,161,23,161,161,23,23,23,7],
    [7,160,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,162,7],
    [7,160,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,162,7],
    [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7]
    ];
    setting[1] = [
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,45,45,45,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,45,45,45,45,45,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,45,-1,-1,-1,-1,-1],
    [-1,45,45,45,45,45,45,-1,-1,45,-1,-1,-1,45,-1,-1,45,45,45,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
    ];
    setting[2] = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1],
        [4,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,4],
        [4,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,4],
        [4,0,0,0,0,1,0,0,0,0,0,1,3,3,1,1,1,0,0,4],
        [4,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,4],
        [4,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,4],
        [4,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
        [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
        [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
        [4,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,4],
        [4,1,1,1,1,1,1,0,0,1,3,3,3,1,3,0,1,1,1,4],
        [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
        [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
        [1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1]
    ];
    setting[3] = [7,3];
    setting[4] = [5,9,'./image/ObjectImage/brown.png','./image/ObjectImage/browncannon.png',1,1,8,0,20,0,0]
    setting[5] = [14,2,'./image/ObjectImage/green.png','./image/ObjectImage/greencannon.png',1,0,12,0.0,20,1,2]
    setting[6] = [3,5,'./image/ObjectImage/pink.png','./image/ObjectImage/pinkcannon.png',4,0,10,0,6,5,9]
    setting[7] = [15,10,'./image/ObjectImage/elite.png','./image/ObjectImage/elitecannon.png',3,1,10,1.5,15,3,5]
    setting[8] = [12,13,'./image/ObjectImage/brown.png','./image/ObjectImage/browncannon.png',1,1,8,0,20,0,0]
    setting[9] = [17,2,'./image/ObjectImage/gray.png','./image/ObjectImage/graycannon.png',2,1,8,1.0,20,1,1]
    setting[10] = [4,3]
    return setting;
}