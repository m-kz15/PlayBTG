window.focus();
enchant();

const size = 4;             //サイズ倍率(勝手に触らない方が良い)
const base = 16;              //基準サイズ
const pixelSize = base*size;

var cheat = false;

var cur;                //カーソルの位置情報を保持する配列

var j_data;
var stageData;

var floors = [];        //ステージの障害物を保持する配列
var walls = [];         //ステージの壁を保持する配列
var holes = [];         //ステージの穴を保持する配列
var avoids = [];
var test = []           //障害物まとめ

var tankEntity = [];    //敵味方の戦車情報を保持する配列
var bulOb = [[]];       //戦車の弾情報を保持する配列
var colOb = [[]];       //弾の物理判定を保持する配列
var bomOb = [[]];       //爆弾の情報を保持する配列
var bullets = [];       //各戦車の弾数の制御用の配列
var boms = [];          //各戦車の爆弾設置制御用の配列
var fireFlgs = [];      //敵の砲撃制御
var deadFlgs = [];      //戦車の生存確認
var entNum = 0;             //戦車の連番設定用変数
var addBullet = 0;          //難易度ごとの弾追加数
var addSpeed = 0;

var tankColorCounts = [0,0,0,0,0,0,0,0,0,0,0,0];

var allyEntity = [];
var allyDeadFlg = false; 
var allyFlg = false;

var worldFlg = false;   //ゲームのon/off制御ボタン
var victory = false;    //勝利判定
var defeat = false;     //敗北判定
var complete = false;   //攻略完了判定
var pauseFlg = false;

var stageNum = 1;           //ステージ番号
var BGMs = [
    './sound/FIRST.mp3',
    './sound/SECOND.mp3',
    './sound/THIRD.mp3',
    './sound/FOURTH.mp3',
    './sound/THIRD.mp3',
    './sound/SEVENTH.mp3',
    './sound/SIXTH.mp3',
    './sound/THIRD.mp3',
    './sound/NINTH.mp3',
    './sound/EIGHTH.mp3',
    './sound/TENTH.mp3',
    './sound/TENTH.mp3'
];
var BNum = 0;

var colors = [0,0,0,0,0,0,0,0,0,0,0,0];        //戦車の色を数える配列
var colorsName = [
    "Brown",
    "Gray",
    "Green",
    "Red",
    "LightGreen",
    "EliteGray ",
    "Snow",
    "EliteGreen",
    "Sand",
    "Pink",
    "Random",
    "Dazzle"
]
let fontColor = [
    'saddlebrown',
    'lightslategray',
    'lime',
    'red',
    'aquamarine',
    'darkslategray',
    'lightcyan',
    'green',
    'coral',
    'pink',
    'black',
    'maroon'
]

var zanki = 5;              //プレイヤーの残機
var score = 0;              //総撃破数
var destruction = 0;        //ステージごとの撃破数

var rankings = [0,0,0,0,0,0,0,0,0,0]
var tops = ["_____","_____","_____","_____","_____","_____","_____","_____","_____","_____"]
var userName = "Player";
var times = [0,0,0,0,0,0,0,0,0,0]
var selectLevel = [false,false,false,false,false,false,false,false,false,false]
var sl = false;

var dt = new Date();
var y = dt.getFullYear();
var m = ("00" + (dt.getMonth()+1)).slice(-2);
var d = ("00" + (dt.getDate())).slice(-2);
var Hour = dt.getHours();
var Min = dt.getMinutes();
var Sec = dt.getSeconds();
var nowDay = y + m + d + Hour + Min + Sec;

var postData = {
    "name": "Player",
    "text": 0,
    "time": nowDay,
    "level": sl
};

/* ステージ情報格納 */
const stagePath = [
    '',
    './stage/stage0.js',
    './stage/stage1.js',
    './stage/stage2.js',
    './stage/stage3.js',
    './stage/stage4.js',
    './stage/stage5.js',
    './stage/stage6.js',
    './stage/stage7.js',
    './stage/stage8.js',
    './stage/stage9.js',
    './stage/stage10.js',
    './stage/stage11.js',
    './stage/stage12.js',
    './stage/stage13.js',
    './stage/stage14.js',
    './stage/stage15.js',
    './stage/stage16.js',
    './stage/stage17.js',
    './stage/stage18.js',
    './stage/stage19.js',
    './stage/stage20.js',
    './stage/stage21.js',
    './stage/stage22.js',
    './stage/stage23.js',
    './stage/stage24.js',
    './stage/stage25.js',
    './stage/stage26.js',
    './stage/stage27.js',
    './stage/stage28.js',
    './stage/stage29.js',
    './stage/stage30.js',
    './stage/stage31.js',
    './stage/stage32.js',
    './stage/stage33.js',
    './stage/stage34.js',
    './stage/stage35.js',
    './stage/stage36.js',
    './stage/stage37.js',
    './stage/stage38.js',
    './stage/stage39.js',
    './stage/stage40.js',
    './stage/stage41.js',
    './stage/stage42.js',
    './stage/stage43.js',
    './stage/stage44.js',
    './stage/stage45.js',
    './stage/stage46.js',
    './stage/stage47.js',
    './stage/stage48.js',
    './stage/stage49.js',
    './stage/stage50.js',
    './stage/stage51.js',
    './stage/stage52.js',
    './stage/stage53.js',
    './stage/stage54.js',
    './stage/stage55.js',
    './stage/stage56.js',
    './stage/stage57.js',
    './stage/stage58.js',
    './stage/stage59.js',
    './stage/stage60.js',
    './stage/stage61.js',
    './stage/stage62.js',
    './stage/stage63.js',
    './stage/stage64.js',
    './stage/stage65.js',
    './stage/stage66.js',
    './stage/stage67.js',
    './stage/stage68.js',
    './stage/stage69.js',
    './stage/stage70.js',
    './stage/stage71.js',
    './stage/stage72.js',
    './stage/stage73.js',
    './stage/stage74.js',
    './stage/stage75.js',
    './stage/stage76.js',
    './stage/stage77.js',
    './stage/stage78.js',
    './stage/stage79.js',
    './stage/stage80.js',
    './stage/stage81.js',
    './stage/stage82.js',
    './stage/stage83.js',
    './stage/stage84.js',
    './stage/stage85.js',
    './stage/stage86.js',
    './stage/stage87.js',
    './stage/stage88.js',
    './stage/stage89.js',
    './stage/stage90.js',
    './stage/stage91.js',
    './stage/stage92.js',
    './stage/stage93.js',
    './stage/stage94.js',
    './stage/stage95.js',
    './stage/stage96.js',
    './stage/stage97.js',
    './stage/stage98.js',
    './stage/stage99.js'
];

/* ステージファイル呼び出し処理用 */
var script = document.createElement("script");
    script.src = stagePath[stageNum];
var head = document.getElementsByTagName("head");
    head[0].appendChild(script);

/* フィルター用マップ配列 */
var fmap = [
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
];
var fcol = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
]

window.onload = function() {
    /* ステージ幅：20ブロック　高さ：15ブロック */
    const game = new Core((base*20)*size,(base*15)*size);
    game.fps = 60;      //画面の更新頻度
    game.preload(       //画像や音源を準備
        './image/ObjectImage/tank2.png',
        './image/ObjectImage/cannon.png',
        './image/ObjectImage/brown.png',
        './image/ObjectImage/browncannon.png',
        './image/ObjectImage/gray.png',
        './image/ObjectImage/graycannon.png',
        './image/ObjectImage/green.png',
        './image/ObjectImage/greencannon.png',
        './image/ObjectImage/lightgreen.png',
        './image/ObjectImage/lightgreencannon.png',
        './image/ObjectImage/red.png',
        './image/ObjectImage/redcannon.png',
        './image/ObjectImage/elite.png',
        './image/ObjectImage/elitecannon.png',
        './image/ObjectImage/elitegreen.png',
        './image/ObjectImage/elitegreencannon.png',
        './image/ObjectImage/snow.png',
        './image/ObjectImage/snowcannon.png',
        './image/ObjectImage/sand.png',
        './image/ObjectImage/sandcannon.png',
        './image/ObjectImage/pink.png',
        './image/ObjectImage/pinkcannon.png',
        './image/ObjectImage/abnormal.png',
        './image/ObjectImage/abnormalcannon.png',
        './image/ObjectImage/meisai.png',
        './image/ObjectImage/meisaicannon.png',
        './image/ObjectImage/Abyssal.png',
        './image/ObjectImage/AbyssalCannon.png',
        './image/MapImage/map0.png',
        './image/ObjectImage/R2.png',
        './image/ObjectImage/mark.png',
        './image/ObjectImage/Circle.png',
        './image/ObjectImage/gameover.png',
        './sound/mini_bomb1.mp3',
        './sound/mini_bomb2.mp3',
        './sound/putting_a_book2.mp3',
        './sound/putting_a_large_bag2.mp3',
        './sound/car_door_C1.mp3',
        './sound/s_car_door_O2.mp3',
        './sound/s_car_trunk_O.mp3',
        './sound/start.wav',
        './sound/base.wav',
        './sound/fire.mp3',
        './sound/FIRST.mp3',
        './sound/SECOND.mp3',
        './sound/THIRD.mp3',
        './sound/FOURTH.mp3',
        './sound/SIXTH.mp3',
        './sound/SEVENTH.mp3',
        './sound/EIGHTH.mp3',
        './sound/NINTH.mp3',
        './sound/TENTH.mp3'
        );
        /* 入力キー一覧 */
    game.keybind(65, "a");
    game.keybind(87, "w");
    game.keybind(83, "s");
    game.keybind(68, "d");
    game.keybind(32, "e");
    game.keybind(81, "q");
    game.keybind(27, "Pause");
    game.time = 0;

    /* ステージ端の壁クラス */
    var Wall = Class.create(PhyBoxSprite, {
        initialize: function(width,height,x,y,scene) {
            PhyBoxSprite.call(this, width*pixelSize, height*pixelSize, enchant.box2d.STATIC_SPRITE, 10, 0.0, 1.0, true);
            //this.backgroundColor = "#ddd4";
            this.x = x*pixelSize;
            this.y = y*pixelSize-base;
            scene.addChild(this);
        }
    });
    /* 1ブロック分の壁クラス */
    var Floor = Class.create(PhyBoxSprite, {
        initialize: function(x,y,scene) {
            PhyBoxSprite.call(this, pixelSize, pixelSize, enchant.box2d.STATIC_SPRITE, 10, 0.0, 1.0, true);
            //this.backgroundColor = "#ddd4";
            this.x = x*pixelSize;
            this.y = y*pixelSize-base;
            scene.addChild(this);
        }
    });
    
    /* 穴クラス */
    var Hole = Class.create(Sprite, {
        initialize: function(x,y,scene) {
            Sprite.call(this, (pixelSize), (pixelSize));
            //obstacle.push(this)
            this.backgroundColor = "#0004";
            this.x = x*pixelSize;
            this.y = y*pixelSize-16;
            new HoleImage(2,this.x,this.y,scene)
            new HoleImage(1,this.x,this.y,scene)
            scene.addChild(this);
        }
    });
    /* 穴の描画クラス */
    var HoleImage = Class.create(Sprite, {
        initialize: function(val,x,y,scene) {
            Sprite.call(this, (base*(size-val)), (base*(size-val)));
            this.backgroundColor = "#0008";
            this.x = x+(8*val);
            this.y = y+(8*val);
            scene.addChild(this);
        }
    });
    var Avoid = Class.create(Sprite, {
        initialize: function(x,y,scene) {
            Sprite.call(this, pixelSize/2, pixelSize/2);
            //this.backgroundColor = "#fdda";
            this.x = x*pixelSize+(4*4);
            this.y = y*pixelSize-(3*2);
            
            scene.addChild(this);
        }
    });
    /* 障害物クラス */
    var WallIntercept = Class.create(Sprite,{
        initialize: function(x,y,scene) {
            Sprite.call(this, pixelSize+6, pixelSize+6);
            //this.backgroundColor = "#ddd4";
            this.moveTo(x*pixelSize-3,y*pixelSize-(base+3))
            scene.addChild(this);
        }
    })
    /* カーソル描画クラス */
    var Cursor = Class.create(Sprite,{
        initialize: function(scene){
            Sprite.call(this,base,base);
            this.backgroundColor = "#6af8"
            this.moveTo(0,0)
            scene.addChild(this);
        }
    })
    /* 戦車の車体クラス */
    var Tank = Class.create(Sprite, {
        initialize: function(area,path,num,scene,filterMap) {
            Sprite.call(this, base*(size+0.3), base*(size-0.55));
            //this.backgroundColor = "#fff";
            this.image = game.assets[path]
            this.x = area.x+0.5;
            this.y = area.y+1;
            this.scaleX = 0.87
            this.scaleY = 0.95
            this.onenterframe = function(){
                this.x = area.x-4;
                this.y = area.y+2;
                
            }
            if(deadFlgs[num]) scene.removeChild(this);
            scene.insertBefore(this,filterMap);
            //scene.addChild(this);
        }
    });
    /* 戦車の砲塔クラス */
    var Cannon = Class.create(Sprite, {
        initialize: function(area,path,num,scene,filterMap) {
            Sprite.call(this, (base*(size+0.5)*2), base*(size+0.5));
            this.image = game.assets[path]
            this.x = area.x-37;
            this.y = area.y-8;
            this.scaleX = 0.675
            this.scaleY = 0.675
            this.onenterframe = function(){
                this.x = area.x-41.5;
                this.y = area.y-6.5;
                
            }
            if(deadFlgs[num]) scene.removeChild(this);
            //this.opacity = 0.5
            //scene.addChild(this);
            scene.insertBefore(this,filterMap);
        }
    });
    /* 弱点クラス */
    var Weak = Class.create(Sprite, {
        initialize: function(area,num,scene,filterMap) {
            Sprite.call(this,base*(size/1.5),base*(size/1.5));
            //this.backgroundColor = "#f00a";
            this.onenterframe = function(){
                this.x = area.x+9.25;
                this.y = area.y+8.5;
                this.intersect(BombExplosion).forEach(function(pair){
                    if(victory == false && defeat == false && complete == false) deadFlgs[num] = true                
                })
                
            }
            if(deadFlgs[num]) scene.removeChild(this);
            //scene.addChild(this);
            scene.insertBefore(this,filterMap);
        }
    });
    /* 撃破後の描画クラス */
    var Mark = Class.create(Sprite, {
        initialize: function(tank,area,num,scene,filterMap) {
            Sprite.call(this,base*(size/1.3),base*(size/1.3));
            this.image = game.assets['./image/ObjectImage/mark.png']
            this.opacity = 0.0;
            this.x = area.x+9.25;
            this.y = area.y+8.5;
            this.scaleY = 0.8;
            //scene.addChild(this);
            scene.insertBefore(this,filterMap);
        }
    });
    /* 照準クラス */
    var Aim = Class.create(Sprite,{
        initialize: function(target,cannon,shotSpeed,num,scene){
            Sprite.call(this,base/2,base/2);
            if(num == 0) 
            this.backgroundColor = "#aff4"
            this.moveTo(cannon.x+70,cannon.y+32)
            const vector = {
                x: target.x - cannon.x-66,
                y: target.y - cannon.y-28
            };
            this.rad = Math.atan2(vector.y, vector.x);
            this.moveTo(this.x+(base*3)*Math.cos(this.rad), this.y+(base*3)*Math.sin(this.rad));
            cannon.rotation = (270+(Math.atan2(Math.cos(this.rad), Math.sin(this.rad)) * 180) / Math.PI)*-1;
            this.onenterframe = function(){
                this.x += Math.cos(this.rad) * shotSpeed;
                this.y += Math.sin(this.rad) * shotSpeed;
                this.rotation+= 15
            }
            scene.addChild(this);
        }
    })
    
    /* 照準クラス */
    var BulAim = Class.create(Sprite,{
        initialize: function(target,shotSpeed,scene){
            Sprite.call(this,base/2,base/2);
            //this.backgroundColor = "#aff8"
            this.moveTo(target.x,target.y)
            this.time = 0;
            var rad = (target.rotation-90) * (Math.PI / 180.0);
            var dx = Math.cos(rad) * shotSpeed;
            var dy = Math.sin(rad) * shotSpeed;

            this.onenterframe = function(){
                this.x += dx
                this.y += dy
            }
            scene.addChild(this);
        }
    })
    var PlayerBulAim = Class.create(Sprite,{
        initialize: function(target,shotSpeed,scene){
            Sprite.call(this,base/2,base/2);
            //this.backgroundColor = "#aff8"
            this.moveTo(target.x,target.y)
            this.time = 0;
            var rad = (target.rotation-90) * (Math.PI / 180.0);
            var dx = Math.cos(rad) * (shotSpeed*1.5);
            var dy = Math.sin(rad) * (shotSpeed*1.5);

            this.onenterframe = function(){
                this.x += dx
                this.y += dy
            }
            scene.addChild(this);
        }
    })
    /* 弾丸の物理判定クラス */
    var BulletCol = Class.create(PhyCircleSprite,{
        initialize: function(target,cannon,shotSpeed,grade,num,scene){
            PhyCircleSprite.call(this, 2.5, enchant.box2d.DYNAMIC_SPRITE, 0.0, 0.0, 1.0, true)
            //this.backgroundColor = "blue"
            this.moveTo(cannon.x+pixelSize,cannon.y+(pixelSize/2));
            this.time = 0;
            let random0 = 0;
            let random1 = 0;
            const vector = {
                x: target.x+6.5 - this.x,
                y: target.y+3 - this.y
            };
            if(grade == 10){
                random0 = Math.floor( Math.random() * 15)-7.5;
                random1 = Math.floor( Math.random() * 15)-7.5;
            }else if(grade == 11){
                random0 = Math.floor( Math.random() * 40)-20;
                random1 = Math.floor( Math.random() * 40)-20;
            }else if(grade == 5 || grade == 6){
                random0 = Math.floor( Math.random() * 60)-30;
                random1 = Math.floor( Math.random() * 60)-30;
            }
            else if(grade >= 2){
                random0 = Math.floor( Math.random() * 30)-15;
                random1 = Math.floor( Math.random() * 30)-15;
            }
            this.rad = Math.atan2(vector.y+random0, vector.x+random1);
            this.moveTo(cannon.x+70+Math.cos(this.rad) * pixelSize, cannon.y+(pixelSize/2)+Math.sin(this.rad) * pixelSize);
            this.applyImpulse(new b2Vec2(Math.cos(this.rad)*shotSpeed, Math.sin(this.rad)*shotSpeed));
            
            this.onenterframe = function(){
                this.time++
                if(this.time % 10 == 0) new Smoke(this,scene)
                if(this.intersect(Bullet)==false){
                    if(bullets[num]>0) bullets[num]--;
                    this.moveTo(-100,-100)
                    this.destroy()
                    scene.removeChild(this);;
                }
            }
        }
    })
    /* 弾丸クラス */
    var Bullet = Class.create(Sprite,{
        initialize: function(target,cannon,ref,num,max,shotSpeed,scene){
            Sprite.call(this,12,18);
            this.image = game.assets['./image/ObjectImage/R2.png'];
            
            this.time = 0;
            this.opacity = 0

            var rcnt = 0;
            var rcnt2 = 0;
            var rflg = false;
            if(shotSpeed>=12){
                this.scaleY = 1.5;
            }
           
            this.moveTo(target.x,target.y)
            this.onenterframe = function(){
                if(num != 0){
                    new BulAim(this,32,scene)
                }else{
                    new PlayerBulAim(this,32,scene)
                }
                

                
                this.time++;
                if(shotSpeed>=12 && this.time % 2 == 0){
                    new Fire(this,scene)
                    
                }
                var vector = {
                    x: target.centerX-(this.width/2) - this.x,
                    y: target.centerY-(target.height/2 + this.height/3) - this.y
                };
                this.rad = Math.atan2(vector.y, vector.x);
                this.moveTo(target.centerX-(this.width/2),target.centerY-(target.height/2 + this.height/3))
                this.rotation = (180+(Math.atan2(Math.cos(this.rad), Math.sin(this.rad)) * 180) / Math.PI)*-1;
                this.opacity = 1.0

                /*WallIntercept.intersect(this).forEach(function(){
                    if(rflg == false){
                        rcnt++;
                        rflg = true;
                        this.time = 0
                    }
                })*/
                Floor.intersect(this).forEach(function(){
                    if(rflg == false){
                        rcnt++;
                        rflg = true;
                        this.time = 0
                    }
                })
                Wall.intersect(this).forEach(function(){
                    if(rflg == false){
                        rcnt++;
                        rflg = true;
                        this.time = 0
                    }
                })
                if(rflg == true && this.time % 30 == 0){
                    let judge = [false,false]
                    floors.forEach(elem=>{
                        if(this.intersect(elem)==true) judge[0] = true
                    })
                    walls.forEach(elem=>{
                        if(this.intersect(elem)==true) judge[1] = true
                    })
                    if(judge[0] == false && judge[1] == false) rflg = false;
                    if((judge[0]==true || judge[1]==true)&& this.time >= 120) rflg = false;
                }
                if(rcnt > ref){
                    new TouchFire(this,scene);
                    target.moveTo(-100,-100)
                    target.destroy()
                    game.assets['./sound/s_car_door_O2.mp3'].clone().play();
                    scene.removeChild(target);
                    
                }
                if(this.intersect(target)==false){
                    scene.removeChild(this);
                    bullets[num]--;
                    game.assets['./sound/s_car_door_O2.mp3'].clone().play();
                    this.moveTo(-100,-100)
                }
                for(var i = 0;  i < max;  i++){
                    for(var j = 0; j < max; j++){
                        if (bulOb[num][i].intersect(bulOb[num][j])==true&&i != j) {
                            scene.removeChild(bulOb[num][i]);
                            scene.removeChild(bulOb[num][j]);
                            bulOb[num][i]=new Bullet(target,cannon,1,num,max,scene);
                            bulOb[num][j]=new Bullet(target,cannon,1,num,max,scene);
                        }
                    }
                    for(var j = 0; j < bulOb.length; j++){
                        for(var k = 0; k < bulOb[j].length; k++){
                            if(j != num){
                                if (bulOb[num][i].intersect(bulOb[j][k])==true) {
                                    scene.removeChild(bulOb[num][i]);
                                    scene.removeChild(bulOb[j][k]);
                                    bulOb[num][i]=new Bullet(target,cannon,1,num,max,scene);
                                    bulOb[j][k]=new Bullet(target,cannon,1,num,max,scene);
                                }
                            }
                            
                        }
                    }
                }
                if(rcnt != rcnt2){
                    game.assets['./sound/s_car_trunk_O.mp3'].clone().play();
                    rcnt2 = rcnt;
                }
            }
        }
    })
    /* 爆弾クラス */
    var Bom = Class.create(Sprite,{
        initialize: function(area,num,scene){
            Sprite.call(this,base*2,base*2);
            this.backgroundColor = "yellow";
            this.moveTo(area.x-base+33.5,area.y-base+32);
            this.time = 0;
            let bombFlg = false;
            let bomb = this;
            this.onenterframe = function(){
                this.time++
                this.intersect(BombExplosion).forEach(function(){
                    if(victory == false && defeat == false){
                        new BombExplosion(bomb,num,scene)
                        scene.removeChild(bomb);
                    }
                })
                tankEntity.forEach(elem=>{
                    if(this.time > 180){
                        if((this.intersect(elem) || this.time > 555) && bombFlg == false){
                            bombFlg = true;
                            this.time = 0;
                        } 
                    }
                    if(bombFlg == true && victory == false && defeat == false){
                        if(this.time % 2 == 0){
                            this.backgroundColor = "red"
                        }else{
                            this.backgroundColor = "yellow"
                        }
                        if(this.time > 45){
                            new BombExplosion(this,num,scene)
                            scene.removeChild(this);
                        }
                    }
                    
                })
                for(let i = 0; i < bulOb.length; i++){
                    for(let j = 0; j < bulOb[i].length; j++){
                        if(this.intersect(bulOb[i][j])==true && victory == false && defeat == false){
                            bullets[i] -= 1;
                            scene.removeChild(bulOb[i][j])
                            colOb[i][j].destroy()
                            scene.removeChild(colOb[i][j])
                            colOb[i][j] = new BulletCol(cur,floors[0],0,0,0,scene);
                            bulOb[i][j] = new Bullet(colOb[i][j],floors[0],0,0,0,0,scene);
                            new BombExplosion(this,num,scene)
                            scene.removeChild(this);
                        }
                    }
                }
                /*bulOb.forEach(elem=>{
                    elem.forEach(elem2=>{
                        if(this.intersect(elem2)==true && victory == false && defeat == false){
                            scene.removeChild(elem2)
                            new BombExplosion(this,num,scene)
                            scene.removeChild(this);
                        }
                    })
                })
                */
                
            }
            
        }
    })
    /* 弾の煙描画クラス */
    var Smoke = Class.create(Sprite,{
        initialize: function(area,scene){
            Sprite.call(this,12,12);
            this.backgroundColor = "#aaa";
            this.time = 0;
            this.moveTo(area.x-3.5,area.y-1);
            let value = 0.5;
            this.opacity = value;
            
            this.onenterframe = function(){
                this.time++
                if(this.time % 4 == 0){
                    value -= 0.05;
                    this.opacity = value;
                    this.rotation = area.rotation
                    if(value < 0) scene.removeChild(this);
                }
                
            }
            scene.insertBefore(this,area);
        }
    })
    /* ミサイルの炎描画クラス */
    var Fire = Class.create(Sprite,{
        initialize: function(area,scene){
            Sprite.call(this,12,12);
            this.opacity = 0;
            this.backgroundColor = "#f20";
            this.time = 0;
            
            this.moveTo(area.x-3,area.y-3);
            const vector = {
                x: area.x - this.x,
                y: area.y - this.y
            };
            this.rad = Math.atan2(vector.y, vector.x);
            this.moveTo(this.x+6*Math.cos(this.rad), this.y+9*Math.sin(this.rad));
            let value = 0.8;
            this.opacity = value;
            
            this.onenterframe = function(){
                this.time++
                this.rotation = area.rotation
                value -= 0.1;
                this.opacity = value;
                this.rotation = area.rotation
                if(value < 0) scene.removeChild(this);
                
            }
            scene.insertBefore(this,scene);
        }
    })
    /* 着弾描画クラス */
    var TouchFire = Class.create(Sprite,{
        initialize: function(area,scene){
            Sprite.call(this,24,24);
            this.opacity = 0;
            this.backgroundColor = "#f40";
            this.time = 0;
            
            this.moveTo(area.x-3,area.y-3);
            const vector = {
                x: area.x-6 - this.x,
                y: area.y-6 - this.y
            };
            this.rad = Math.atan2(vector.y, vector.x);
            this.moveTo(this.x+6*Math.cos(this.rad), this.y+9*Math.sin(this.rad));
            let value = 0.8;
            this.opacity = value;
            
            this.onenterframe = function(){
                this.time++
                this.rotation = area.rotation
                value -= 0.1;
                this.opacity = value;
                this.rotation = area.rotation
                if(value < 0) scene.removeChild(this);
                
            }
            scene.insertBefore(this,area);
        }
    })
    /* 発射描画クラス */
    var OpenFire = Class.create(Sprite,{
        initialize: function(area,target,scene,filterMap){
            Sprite.call(this,24,24);
            this.backgroundColor = "#f40";
            this.time = 0;
            
            this.moveTo(area.x+64,area.y+24);

            const vector = {
                x: this.x+6.5 - target.x,
                y: this.y+3 - target.y
            };
            this.rad = Math.atan2(vector.y, vector.x);
            this.moveTo(area.x+64+Math.cos(this.rad) * -40, area.y+24+Math.sin(this.rad) * -40);
            let value = 1.0;
            this.opacity = value;
            
            this.onenterframe = function(){
                this.time++
                value -= 0.1;
                this.x += Math.cos(this.rad) * -3;
                this.y += Math.sin(this.rad) * -3;
                this.opacity = value;
                this.rotation = (180+(Math.atan2(Math.cos(this.rad), Math.sin(this.rad)) * 180) / Math.PI)*-1;
                if(value < 0) scene.removeChild(this);
                
            }
            scene.insertBefore(this,filterMap);
        }
    })
    /* 敵判断範囲クラス一覧 */
    //1
    var Intercept420 = Class.create(Sprite,{
        initialize: function(area,scene){
            Sprite.call(this,420,420);
            //this.backgroundColor = "#0ff2";
            this.onenterframe = function(){
                this.moveTo(area.x-210+33.5,area.y-210+32);
                
            }
            scene.addChild(this);
        }
    })
    //2
    var Intercept280 = Class.create(Sprite,{
        initialize: function(area,scene){
            Sprite.call(this,280,280);
            this.rotation = (45)
            //this.backgroundColor = "#0ff2";
            this.onenterframe = function(){
                this.moveTo(area.x-140+33.5,area.y-140+33.5);
                this.rotation += 45
            }
            scene.addChild(this);
        }
    })
    //3
    var Intercept192 = Class.create(Sprite,{
        initialize: function(area,scene){
            Sprite.call(this,192,192);
            //this.backgroundColor = "#0ff2";
            this.onenterframe = function(){
                this.moveTo(area.x-96+33.5,area.y-96+33.5);
                this.rotation = area.rotation
            }
            scene.addChild(this);
        }
    })
    //4
    var Intercept600 = Class.create(Sprite,{
        initialize: function(area,scene){
            Sprite.call(this,600,600);
            //this.backgroundColor = "#0ff2";
            this.rotation = 45
            this.onenterframe = function(){
                this.moveTo(area.x-300+33.5,area.y-300+33.5);
            }
            scene.addChild(this);
        }
    })
    var InterceptA = Class.create(Sprite, {
        initialize: function(cannon,scene) {
            Sprite.call(this, 240, 240);
            //this.backgroundColor = "#0f04";
            this.onenterframe = function(){
                var rad = cannon.rotation * (Math.PI / 180.0);
                var dx = Math.cos(rad)*(cannon.width-32);
                var dy = Math.sin(rad)*(cannon.width-32);
                this.moveTo(cannon.x-(this.width/4)+dx+12, cannon.y-(this.height/4+cannon.height/4)+dy-6);
                this.rotation = cannon.rotation+45;
            }
            scene.addChild(this);
        }
    });
    var InterceptB = Class.create(Sprite, {
        initialize: function(cannon,scene) {
            Sprite.call(this, 240, 240);
            //this.backgroundColor = "#0f04";
            this.onenterframe = function(){
                var rad = cannon.rotation * (Math.PI / 180.0);
                var dx = Math.cos(rad)*(cannon.width-32);
                var dy = Math.sin(rad)*(cannon.width-32);
                this.moveTo(cannon.x-(this.width/4)+dx+12, cannon.y-(this.height/4+cannon.height/4)+dy-6);
                this.rotation = cannon.rotation;
            }
            scene.addChild(this);
        }
    });
    var InterceptC = Class.create(Sprite, {
        initialize: function(cannon,scene) {
            Sprite.call(this, cannon.width, 8);
            //this.backgroundColor = "#0f04";
            this.onenterframe = function(){
                var rad = cannon.rotation * (Math.PI / 180.0);
                var dx = Math.cos(rad)*(cannon.width/2);
                var dy = Math.sin(rad)*(cannon.width/2);
                this.moveTo(cannon.x-(cannon.width/4)+dx+cannon.width/4, cannon.y-(this.height/2)+dy+cannon.width/4);
                this.rotation = cannon.rotation;
            }
            scene.addChild(this);
        }
    });
    var InterceptF = Class.create(Sprite, {
        initialize: function(cannon,scene) {
            Sprite.call(this, cannon.width*4, 8);
            //this.backgroundColor = "#0f04";
            this.onenterframe = function(){
                var rad = cannon.rotation * (Math.PI / 180.0);
                var dx = Math.cos(rad)*(cannon.width*2);
                var dy = Math.sin(rad)*(cannon.width*2);
                this.moveTo(cannon.x-(cannon.width*2.5)+dx+cannon.width, cannon.y-(this.height/2)+dy+cannon.width/4);
                this.rotation = cannon.rotation;
            }
            scene.addChild(this);
        }
    });
    /* 撃破時の爆破描画クラス */
    var Explosion = Class.create(Sprite,{
        initialize: function(point,scene){
            Sprite.call(this,100,100,point);
            this.backgroundColor = "red";
            this.time = 0;
            var value = 1.0;
            this.opacity = value;
            this.moveTo(point.x-12,point.y-12)
            this.onenterframe = function(){
                this.time++;
                this.rotation+= 45;
                if(this.time % 2 == 0){
                    value -= 0.05;
                    this.opacity = value;
                    if(value < 0) scene.removeChild(this);
                }
            }
            scene.addChild(this);
        }
    })
    /* 爆破の描画クラス */
    var BombExplosion = Class.create(Sprite,{
        initialize: function(point,num,scene){
            Sprite.call(this,200,200,point);
            game.assets['./sound/mini_bomb2.mp3'].clone().play();
            boms[num]-=1;
            this.backgroundColor = "red";
            this.time = 0;
            var value = 1.0;
            this.opacity = value;
            this.moveTo(point.x-78,point.y-78)
            this.onenterframe = function(){
                this.time++;
                this.rotation+= 45;
                if(this.time % 2 == 0){
                    value -= 0.1;
                    this.opacity = value;
                }
                if(value < 0) scene.removeChild(this);
                if(this.time > 20) scene.removeChild(this);
            }
            scene.addChild(this);
        }
    })
    
    /* 敵が狙う対象を追いかけるクラス */
    var Target = Class.create(Sprite,{
        initialize: function(cannon,num,scene,weak,player){
            Sprite.call(this,20,20);
            //this.backgroundColor = "#0f0a"
            let speed = 24;
            this.rotation = (45)
            let target;
            this.onenterframe = function(){
                
                if(deadFlgs[num] == true){
                    scene.removeChild(this);
                }
                target = enemyTarget[num]
                if(this.intersect(cannon)==false){
                    if(this.intersect(Weak)==false){
                        var vector = {
                            x: target.x - this.x,
                            y: target.y - this.y
                        };
                        if(this.intersect(target)==true){
                            this.moveTo(target.x-4,target.y-4)
                        }else{
                            this.rad = Math.atan2(vector.y, vector.x);
                            this.moveTo(this.x + Math.cos(this.rad)*speed,this.y + Math.sin(this.rad)*speed)
                        }
                    }else{
                        
                        var vector = {
                            x: target.x - this.x+20,
                            y: target.y - this.y+20
                        };
                        if(this.intersect(target)==true){
                            this.moveTo(target.x+20,target.y+20)
                        }else{
                            this.rad = Math.atan2(vector.y, vector.x);
                            this.moveTo(this.x + Math.cos(this.rad)*speed,this.y + Math.sin(this.rad)*speed)
                        }
                        
                    }
                }else{
                    enemyTarget[num] = player
                    var vector = {
                        x: enemyTarget[num].x - this.x+30,
                        y: enemyTarget[num].y - this.y+20
                    };
                    if(this.intersect(enemyTarget[num])==true){
                        this.moveTo(enemyTarget[num].x+30,enemyTarget[num].y+20)
                    }else{
                        this.rad = Math.atan2(vector.y, vector.x);
                        this.moveTo(this.x + Math.cos(this.rad)*speed,this.y + Math.sin(this.rad)*speed)
                    }
                }
                
            }
            scene.addChild(this);
        }
    })
    /* 経路探索アルゴリズム */
    var findShortestPath = function(startCoordinates, grid,scene) {
        var distanceFromTop = startCoordinates[0];
        var distanceFromLeft = startCoordinates[1];

    
        // 各"location"はその座標と、到達に必要な最短経路を保持する
        var location = {
            distanceFromTop: distanceFromTop,
            distanceFromLeft: distanceFromLeft,
            path: [],
            status: 'Start'
        };
    
        // 内部にすでにスタート位置を持っているlocationでqueueを初期化
        var queue = [location];

        // グリッドを繰り返し処理して目的地を探索する
        while (queue.length > 0) {
            // キューから最初の位置を取る
            var currentLocation = queue.shift();
    
            // 北を調べる
            var newLocation = exploreInDirection(currentLocation, 'North', grid,scene);
            if (newLocation.status === 'Goal') {
                return newLocation.path;
            }
            else if (newLocation.status === 'Valid') {
                queue.push(newLocation);
            }
            
            // 東を調べる
            var newLocation = exploreInDirection(currentLocation, 'East', grid,scene);
            if (newLocation.status === 'Goal') {
                return newLocation.path;
            }
            else if (newLocation.status === 'Valid') {
                queue.push(newLocation);
            }
    
            // 南を調べる
            var newLocation = exploreInDirection(currentLocation, 'South', grid,scene);
            if (newLocation.status === 'Goal') {
                return newLocation.path;
            }
            else if (newLocation.status === 'Valid') {
                queue.push(newLocation);
            }
            
    
            // 西を調べる
            var newLocation = exploreInDirection(currentLocation, 'West', grid,scene);
            if (newLocation.status === 'Goal') {
                return newLocation.path;
            }
            else if (newLocation.status === 'Valid') {
                queue.push(newLocation);
            }
            /*
            var newLocation1 = exploreInDirection(currentLocation, 'Northeast', grid,scene);
            var newLocation2 = exploreInDirection(currentLocation, 'North', grid,scene);
            var newLocation3 = exploreInDirection(currentLocation, 'East', grid,scene);
            if (newLocation1.status === 'Goal' && newLocation2.status === 'Valid' && newLocation3.status === 'Valid') {
                return newLocation1.path;
            }
            else if (newLocation1.status === 'Valid' && newLocation2.status === 'Valid' && newLocation3.status === 'Valid') {
                queue.push(newLocation1);
            }
            var newLocation1 = exploreInDirection(currentLocation, 'Northwest', grid,scene);
            var newLocation2 = exploreInDirection(currentLocation, 'North', grid,scene);
            var newLocation3 = exploreInDirection(currentLocation, 'West', grid,scene);
            if (newLocation1.status === 'Goal' && newLocation2.status === 'Valid' && newLocation3.status === 'Valid') {
                return newLocation.path;
            }
            else if (newLocation1.status === 'Valid' && newLocation2.status === 'Valid' && newLocation3.status === 'Valid') {
                queue.push(newLocation);
            }
            var newLocation1 = exploreInDirection(currentLocation, 'Southeast', grid,scene);
            var newLocation2 = exploreInDirection(currentLocation, 'South', grid,scene);
            var newLocation3 = exploreInDirection(currentLocation, 'East', grid,scene);
            if (newLocation1.status === 'Goal' && newLocation2.status === 'Valid' && newLocation3.status === 'Valid') {
                return newLocation1.path;
            }
            else if (newLocation1.status === 'Valid' && newLocation2.status === 'Valid' && newLocation3.status === 'Valid') {
                queue.push(newLocation1);
            }
            var newLocation1 = exploreInDirection(currentLocation, 'Southwest', grid,scene);
            var newLocation2 = exploreInDirection(currentLocation, 'South', grid,scene);
            var newLocation3 = exploreInDirection(currentLocation, 'West', grid,scene);
            if (newLocation1.status === 'Goal' && newLocation2.status === 'Valid' && newLocation3.status === 'Valid') {
                return newLocation1.path;
            }
            else if (newLocation1.status === 'Valid' && newLocation2.status === 'Valid' && newLocation3.status === 'Valid') {
                queue.push(newLocation1);
            }*/
    
        }
    
        // 有効な経路は見つからなかった
        return false;
    
    };
    
    // locationのstatusを調べる関数
    // (グリッド上にあり、'Obstacle'でなく、アルゴリズムが未チェックなら"valid")
    // "Valid"か "Invalid"、"Blocked"または'Goal'を返す
    var locationStatus = function(location, grid,scene) {
        var gridSizeT = grid.length;
        var gridSizeL = grid[0].length;
        var dft = location.distanceFromTop;
        var dfl = location.distanceFromLeft;
    
        if (location.distanceFromLeft < 0 ||
            location.distanceFromLeft >= gridSizeL ||
            location.distanceFromTop < 0 ||
            location.distanceFromTop >= gridSizeT) {
    
            // locationはグリッド上にないので'Invalid'を返す
            return 'Invalid';
        }
        else if (grid[dft][dfl] === 'Goal') {
            return 'Goal';
        }
        else if (grid[dft][dfl] === 'Empty') {
            // locationは障害物か既にチェックしたかのどちらか
            return 'Valid';
        }
        else {
            return 'Blocked';
            
        }
    };
    
    
    // 指定された位置から指定された方向にグリッドを調べる
    var exploreInDirection = function(currentLocation, direction, grid, scene) {
        var newPath = currentLocation.path.slice();
        newPath.push(direction);
    
        var dft = currentLocation.distanceFromTop;
        var dfl = currentLocation.distanceFromLeft;
    
        if (direction === 'North') {
            dft -= 1;
            //let ai = new Search(dfl*16,dft*16,scene)
            //ai.backgroundColor = "#00f1"
        }
        else if (direction === 'East') {
            dfl += 1;
            //let ai = new Search(dfl*16,dft*16,scene)
            //ai.backgroundColor = "#00f1"
        }
        else if (direction === 'South') {
            dft += 1;
            //let ai = new Search(dfl*16,dft*16,scene)
            //ai.backgroundColor = "#00f1"
        }
        else if (direction === 'West') {
            dfl -= 1;
            //let ai = new Search(dfl*16,dft*16,scene)
            //ai.backgroundColor = "#00f1"
        }/*else if(direction === 'Northeast'){
            dft -= 1;
            dfl += 1;
        }else if(direction === 'Northwest'){
            dft -= 1;
            dfl -= 1;
        }else if(direction === 'Southeast'){
            dft += 1;
            dfl += 1;
        }else if(direction === 'Southwest'){
            dft += 1;
            dfl -= 1;
        }*/
    
        var newLocation = {
            distanceFromTop: dft,
            distanceFromLeft: dfl,
            path: newPath,
            status: 'Unknown'
        };
        newLocation.status = locationStatus(newLocation, grid,scene);
    
        // この新しい位置が有効なら、'Visited'の印をつける
        if (newLocation.status === 'Valid') {
            grid[newLocation.distanceFromTop][newLocation.distanceFromLeft] = 'Visited';
            //let ai = new Search(dfl*16,dft*16,scene)
            //ai.backgroundColor = "#00f1"
        }
    
        return newLocation;
    };
    /* プレイヤークラス */
    var Player = Class.create(Sprite,{
        initialize: function(x,y,path1,path2,max,ref,shotSpeed,moveSpeed,scene,filterMap){
            Sprite.call(this,pixelSize-4, pixelSize-4)

            this.x = x*pixelSize;
            this.y = y*pixelSize-16;

            var pmax = max;
            const Num = entVal;
            entVal++;
            bullets[Num] = 0;
            boms[Num] = 0;
            deadFlgs.push(false);
            
            const tank = new Tank(this,path1,Num,scene,filterMap)
            const weak = new Weak(this,Num,scene,filterMap)
            const cannon = new Cannon(this,path2,Num,scene,filterMap)
            const mark = new Mark(tank,this,Num,scene,filterMap)
           
            var value = 0;
            var speed = moveSpeed;
            var rot = 0;
            var bflg = 0;
            var late = 0;
            var stopFlg = false;

            var PlBulCount = 0;
            
            for(var i = 0; i < pmax; i++){
                colOb[Num][i] = new BulletCol(cur,floors[0],shotSpeed,0,Num,scene);
                bulOb[Num][i] = new Bullet(colOb[Num][i],floors[0],ref,Num,pmax,shotSpeed,scene);
            }
            for(var i = 0; i < 2; i++){
                bomOb[Num][i] = new Bom(this,Num,scene);
            }
            
            scene.addEventListener('touchstart', function(){
                if(worldFlg == true){
                    if(bullets[Num] < pmax && deadFlgs[Num] == false){
                        game.assets['./sound/s_car_door_O2.mp3'].clone().play();
                        colOb[Num][PlBulCount] = new BulletCol(cur,cannon,shotSpeed,0,Num,scene);
                        bulOb[Num][PlBulCount] = new Bullet(colOb[Num][PlBulCount],cannon,ref,Num,pmax,shotSpeed,scene)
                        scene.insertBefore(colOb[Num][PlBulCount],filterMap);
                        scene.insertBefore(bulOb[Num][PlBulCount],filterMap);
                        PlBulCount = (PlBulCount+1) % pmax;
                        bullets[Num]++;
                        new OpenFire(cannon,cur,scene,filterMap)
                    }
                }
            })
            
            this.onenterframe = function(){
                stopFlg = false;
                if(worldFlg == true){
                    if(late >= 1){
                        late++
                    }
                    if(late == 10){
                        late = 0;
                    }
                    if(game.input.e && late == 0){
                        late = 1;
                        if(bullets[Num] < pmax && deadFlgs[Num] == false){
                            game.assets['./sound/s_car_door_O2.mp3'].clone().play();
                            colOb[Num][PlBulCount] = new BulletCol(cur,cannon,shotSpeed,0,Num,scene);
                            bulOb[Num][PlBulCount] = new Bullet(colOb[Num][PlBulCount],cannon,ref,Num,pmax,shotSpeed,scene)
                            scene.insertBefore(colOb[Num][PlBulCount],filterMap);
                            scene.insertBefore(bulOb[Num][PlBulCount],filterMap);
                            PlBulCount = (PlBulCount+1) % pmax;
                            bullets[Num]++;
                            new OpenFire(cannon,cur,scene,filterMap) 
                        }
                    }
                    if(cheat == false){
                        for(var j = 0; j < bulOb.length; j++){
                            for(var k = 0; k < bulOb[j].length; k++){
                                if(this.within(bulOb[j][k],25)==true && defeat == false && victory == false && complete == false){
                                    game.assets['./sound/mini_bomb2.mp3'].clone().play();
                                    deadFlgs[Num] = true
                                    colOb[j][k].destroy()
                                    colOb[j][k].moveTo(-200,-200)
                                    bulOb[j][k].moveTo(-200,-200)
                                    moveSpeed = 0;
                                }
                            }
                        }
        
                        if(deadFlgs[Num] == true){
                            mark.opacity = 1.0
                            mark.moveTo(this.x+9,this.y+16)
                            
                            new Explosion(this,scene);
                            this.moveTo(-100,-100)
                            zanki--;
                            scene.removeChild(this);
                        }
                    }
                    
                    
                    if(game.input.q && bflg == false && boms[Num]<2){
                        bomOb[Num][boms[Num]] = new Bom(this,Num,scene)
                        scene.insertBefore(bomOb[Num][boms[Num]],tank);
                        this.time = 0;
                        bflg = true;
                        boms[Num]++;
                    }
    
                    if(bflg == true){
                        this.time++
                        if(this.time > 60){
                            bflg = false;
                        }
                    }
    
                    if(deadFlgs[Num] == false) new Aim(cur,cannon,base*3,Num,scene)
    
                    test.forEach(elem=>{
                        if(tank.within(elem,pixelSize)==true){
                            stopFlg = true;
                        }
                    })
                    if(Floor.intersect(this) == false && Wall.intersect(this) == false && this.intersect(Hole)==false){
                        if(game.input.w && game.input.a){
                            value = 4;
                            rot = 45
                            this.x -= speed/1.5;
                            this.y -= speed/1.5;
                        }else if(game.input.w && game.input.d){
                            value = 5;
                            rot = 135
                            this.x += speed/1.5;
                            this.y -= speed/1.5;
                        }else if(game.input.s && game.input.a){
                            value = 6;
                            rot = 315
                            this.x -= speed/1.5;
                            this.y += speed/1.5;
                        }else if(game.input.s && game.input.d){
                            value = 7;
                            rot = 225
                            this.x += speed/1.5;
                            this.y += speed/1.5;
                        }else if(game.input.a){
                            value = 0;
                            rot = 0;
                            this.x -= speed;
                        }else if(game.input.d){
                            value = 1;
                            rot = 180;
                            this.x += speed;
                        }else if(game.input.w){
                            value = 2;
                            rot = 90;
                            this.y -= speed;
                        }else if(game.input.s){
                            value = 3;
                            rot = 270;
                            this.y += speed;
                        }
                    }else{
                        if(value == 0){
                            this.x += speed;
                        }else if(value == 1){
                            this.x -= speed;
                        }else if(value == 2){
                            this.y += speed;
                        }else if(value == 3){
                            this.y -= speed;
                        }else if(value == 4){
                            this.x += speed/1.5;
                            this.y += speed/1.5;
                        }else if(value == 5){
                            this.x -= speed/1.5;
                            this.y += speed/1.5;
                        }else if(value == 6){
                            this.x += speed/1.5;
                            this.y -= speed/1.5;
                        }else if(value == 7){
                            this.x -= speed/1.5;
                            this.y -= speed/1.5;
                        }
                    }
                    /* 戦車本体の角度 */
                    this.rotation = rot;
                    tank.rotation = rot;
                    weak.rotation = rot;
                }
            }
            scene.insertBefore(this,tank)
        }
    })
    /* 敵(弱)クラス */
    var newAI = Class.create(Sprite,{
        initialize: function(x,y,tankPath,cannonPath,target,max,ref,shotSpeed,moveSpeed,fireLate,grade,category,scene,map,g,filterMap){
            Sprite.call(this,pixelSize-4,pixelSize-4);
            this.x = x*pixelSize;
            this.y = y*pixelSize-16;
            this.time = 0;

            const Num = entVal;
            entVal++;
            bullets[Num] = 0;
            boms[Num] = 0;
            deadFlgs.push(false)

            const tank = new Tank(this,tankPath,Num,scene,filterMap)
            const cannon = new Cannon(this,cannonPath,Num,scene,filterMap)
            const weak = new Weak(this,Num,scene,filterMap)
            const mark = new Mark(tank,this,Num,scene,target)
            const intercept1 = new Intercept420(this,scene)
            const intercept3 = new Intercept192(this,scene)
            const intercept4 = new Intercept600(this,scene)
            const intercept8 = new InterceptF(cannon,scene)
            var moveCnt = 0
            var grid = g;
            var root;

            enemyTarget[Num] = target;
            var alignment = new Target(cannon,Num,scene,weak,target)

            if(stageNum > 20){
                shotSpeed = shotSpeed + (0.4*(stageNum / 20));
            }

            var PlBulCount = 0;
            for(var i = 0; i < max; i++){
                colOb[Num][i] = new BulletCol(alignment,floors[i],shotSpeed,grade,Num,scene);
                bulOb[Num][i] = new Bullet(colOb[Num][i],floors[i],ref,Num,max,shotSpeed,scene);
            }
            bomOb[Num][0] = new Bom(this,Num,scene);
            var EnemyAim = Class.create(Aim,{
                initialize: function(alignment,cannon,ssp,Num){
                    Aim.call(this,alignment,cannon,ssp,Num,scene);
                }
            })

            if(addBullet != 0 && fireLate > 19) fireLate = fireLate - ((fireLate/5)*2); 
            
            this.onenterframe = function(){
                var myPath = [parseInt((this.y+41)/pixelSize),parseInt((this.x+34.5)/pixelSize)]
                var targetPath = [parseInt((target.y+41)/pixelSize),parseInt((target.x+34.5)/pixelSize)]
                for(var i = 0; i < grid.length; i++){
                    for(var j = 0; j < grid[i].length; j++){
                        if(i == myPath[0] && j == myPath[1]){
                            grid[i][j] = 'Start';
                        }else if(i == targetPath[0] && j == targetPath[1]){
                            grid[i][j] = 'Goal';
                        }else{
                            if(map.collisionData[i][j] == 0){
                                grid[i][j] = 'Empty';
                            }else{
                                grid[i][j] = 'Obstacle';
                            }
                        }
                    }
                }
                
                if(scene.time == 180){
                    root = findShortestPath([myPath[0],myPath[1]], grid,scene)
                    if(root[0] == "East"){
                        this.rotation = 0
                    }else if(root[0] == "West"){
                        this.rotation = 180;
                    }else if(root[0] == "North"){
                        this.rotation = 270;
                    }else if(root[0] == "South"){
                        this.rotation = 90;
                    }/*else if(root[0] == "Northeast"){
                        this.rotation = 315;
                    }else if(root[0] == "Northwest"){
                        this.rotation = 225;
                    }else if(root[0] == "Southeast"){
                        this.rotation = 45;
                    }else if(root[0] == "Southwest"){
                        this.rotation = 135;
                    }*/
                }
                if(worldFlg == true){
                    this.time++;
                    fireFlgs[Num] = false;
                    for(var j = 0; j < bulOb.length; j++){
                        for(var k = 0; k < bulOb[j].length; k++){
                            if(this.within(bulOb[j][k],28)==true || weak.intersect(bulOb[j][k])==true){
                                game.assets['./sound/mini_bomb2.mp3'].clone().play();
                                deadFlgs[Num] = true
                                colOb[j][k].destroy()
                                colOb[j][k].moveTo(-200,-200)
                                bulOb[j][k].moveTo(-200,-200)
                                moveSpeed = 0;
                            }
                        }
                    }
                    
                    if(deadFlgs[Num] == true){
                        tankColorCounts[category]--;
                        //alert(tankColorCounts)
                        mark.opacity = 1.0
                        mark.moveTo(this.x,this.y+16)
                        new Explosion(this,scene);
                        this.moveTo(-100,-100)
                        destruction++
                        scene.removeChild(this);
                    }
                    var eAim = new EnemyAim(alignment,cannon,32,Num,scene);
                    if(enemyTarget[Num] == eAim){
                        enemyTarget[Num] = target
                    }
                    alignment.intersect(EnemyAim).forEach(function(){
                        fireFlgs[Num] = true;
                    })
                    for(let i = 1; i < tankEntity.length; i++){
                        bulOb[0].forEach(elem=>{
                            if(tank.within(elem,400)==false){
                                if(intercept8.intersect(tankEntity[i])==true && i != Num && deadFlgs[i]==false){
                                    fireFlgs[Num] = false;
                                }
                            }
                        })
                    }
                    if(this.time % fireLate == 0 && fireFlgs[Num]==true){
                        if(Math.floor(Math.random() * max*2)>bullets[Num]){
                            if(bullets[Num] < max && deadFlgs[Num] == false){
                                game.assets['./sound/putting_a_book2.mp3'].clone().play();
                                colOb[Num][PlBulCount] = new BulletCol(alignment,cannon,shotSpeed,grade,Num,scene);
                                bulOb[Num][PlBulCount] = new Bullet(colOb[Num][PlBulCount],cannon,ref,Num,max,shotSpeed,scene)
                                scene.insertBefore(colOb[Num][PlBulCount],filterMap);
                                scene.insertBefore(bulOb[Num][PlBulCount],filterMap);
                                new OpenFire(cannon,alignment,scene,filterMap)
                                PlBulCount = (PlBulCount+1) % max;
                                bullets[Num]++;
                            } 
                        }
                    }
                    if(this.time % 2 == 0) enemyTarget[Num] = target;
                    if(tank.within(tankEntity[0],320)==true){
                        enemyTarget[Num] = tankEntity[0]
                    }
                    bulOb[0].forEach(elem=>{
                        if(intercept4.intersect(elem)==true){
                            
                            let dist1 = Math.sqrt(Math.pow(weak.x - enemyTarget[Num].x, 2) + Math.pow(weak.y - enemyTarget[Num].y, 2));
                            let dist2 = Math.sqrt(Math.pow(weak.x - elem.x, 2) + Math.pow(weak.y - elem.y, 2));
                            if(dist1 > dist2){
                                tank.intersect(PlayerBulAim).forEach(function(){
                                    enemyTarget[Num] = elem;
                                })
                                
                            }
                        }
                    })
                    
                    if(allyEntity[0] != null){
                        if(allyDeadFlg == false){
                            if(tank.within(allyEntity[0],320)==true){
                                let dist1 = Math.sqrt(Math.pow(weak.x - enemyTarget[Num].x, 2) + Math.pow(weak.y - enemyTarget[Num].y, 2));
                                let dist2 = Math.sqrt(Math.pow(weak.x - allyEntity[0].x, 2) + Math.pow(weak.y - allyEntity[0].y, 2));
                                if(dist1 > dist2){
                                    enemyTarget[Num] = allyEntity[0];
                                }
                            }
                        }
                    }
                    
                    if(root != false && intercept3.intersect(target)==false){
                        tank.rotation = this.rotation
                        var rad = this.rotation * (Math.PI / 180.0);
                        var dx = Math.cos(rad) * moveSpeed;
                        var dy = Math.sin(rad) * moveSpeed;
                        if(this.intersect(Floor)==false){
                            this.x += dx;
                            this.y += dy;
                        }else{
                            this.x -= dx;
                            this.y -= dy;
                        }
                        moveCnt += moveSpeed;
                    }
                    if(moveCnt == pixelSize){
                        root = findShortestPath([myPath[0],myPath[1]], grid,scene)
                        if(root[0] == "East"){
                            this.rotation = 0
                        }else if(root[0] == "West"){
                            this.rotation = 180;
                        }else if(root[0] == "North"){
                            this.rotation = 270;
                        }else if(root[0] == "South"){
                            this.rotation = 90;
                        }/*else if(root[0] == "Northeast"){
                            this.rotation = 315;
                        }else if(root[0] == "Northwest"){
                            this.rotation = 225;
                        }else if(root[0] == "Southeast"){
                            this.rotation = 45;
                        }else if(root[0] == "Southwest"){
                            this.rotation = 135;
                        }*/
                        moveCnt = 0
                    }
                }
                weak.rotation = this.rotation;
            }
            scene.insertBefore(this,tank)
        }
    })
    /* 味方クラス */
    var Ally = Class.create(Sprite,{
        initialize: function(x,y,tankPath,cannonPath,target,max,ref,shotSpeed,moveSpeed,fireLate,grade,scene,map,g,filterMap){
            Sprite.call(this,pixelSize-4,pixelSize-4);
            this.x = x*pixelSize;
            this.y = y*pixelSize-16;
            this.time = 0;

            const Num = entVal;
            entVal++;
            bullets[Num] = 0;
            deadFlgs.push(false)
            
            const tank = new Tank(this,tankPath,Num,scene,filterMap)
            const cannon = new Cannon(this,cannonPath,Num,scene,filterMap)
            const weak = new Weak(this,Num,scene,filterMap)
            const mark = new Mark(tank,this,Num,scene,tankEntity[0])
            const intercept1 = new Intercept420(this,scene)
            const intercept3 = new Intercept192(this,scene)
            const intercept4 = new Intercept600(this,scene)
            var moveCnt = 0
            var grid = g;
            var root;

            enemyTarget[Num] = target;
            var alignment = new Target(cannon,Num,scene,weak,enemyTarget[Num])

            var PlBulCount = 0;
            for(var i = 0; i < max; i++){
                colOb[Num][i] = new BulletCol(alignment,floors[i],shotSpeed,grade,Num,scene);
                bulOb[Num][i] = new Bullet(colOb[Num][i],floors[i],ref,Num,max,shotSpeed,scene);
            }
            var EnemyAim = Class.create(Aim,{
                initialize: function(alignment,cannon,ssp,Num){
                    Aim.call(this,alignment,cannon,ssp,Num,scene);
                }
            })
            
            this.onenterframe = function(){

                for(let i = 1; i < tankEntity.length; i++){
                    let dist1 = Math.sqrt(Math.pow(weak.x - enemyTarget[Num].x, 2) + Math.pow(weak.y - enemyTarget[Num].y, 2));
                    let dist2 = Math.sqrt(Math.pow(weak.x - tankEntity[i].x, 2) + Math.pow(weak.y - tankEntity[i].y, 2));
                    if(enemyTarget[Num] == tankEntity[i] && deadFlgs[i] == true){
                        for(let j = 1; j < tankEntity.length; j++){
                            if(j != i){
                                dist1 = Math.sqrt(Math.pow(weak.x - enemyTarget[Num].x, 2) + Math.pow(weak.y - enemyTarget[Num].y, 2));
                                dist2 = Math.sqrt(Math.pow(weak.x - tankEntity[j].x, 2) + Math.pow(weak.y - tankEntity[j].y, 2));
                                if(dist1 > dist2){
                                    enemyTarget[Num] = tankEntity[j];
                                    scene.removeChild(alignment)
                                    alignment = new Target(cannon,Num,scene,weak,enemyTarget[Num])
                                }
                            }
                        }
                    }else if(dist1 > dist2){
                        enemyTarget[Num] = tankEntity[i];
                    }       
                }

                var myPath = [parseInt((this.y+41)/pixelSize),parseInt((this.x+34.5)/pixelSize)]
                var targetPath = [parseInt((enemyTarget[Num].y+41)/pixelSize),parseInt((enemyTarget[Num].x+34.5)/pixelSize)]

                for(var i = 0; i < grid.length; i++){
                    for(var j = 0; j < grid[i].length; j++){
                        if(i == myPath[0] && j == myPath[1]){
                            grid[i][j] = 'Start';
                        }else if(i == targetPath[0] && j == targetPath[1]){
                            grid[i][j] = 'Goal';
                        }else{
                            if(map.collisionData[i][j] == 0){
                                grid[i][j] = 'Empty';
                            }else{
                                grid[i][j] = 'Obstacle';
                            }
                        }
                    }
                }
                if(scene.time == 180){
                    root = findShortestPath([myPath[0],myPath[1]], grid,scene)
                    if(root[0] == "East"){
                        this.rotation = 0
                    }else if(root[0] == "West"){
                        this.rotation = 180;
                    }else if(root[0] == "North"){
                        this.rotation = 270;
                    }else if(root[0] == "South"){
                        this.rotation = 90;
                    }/*else if(root[0] == "Northeast"){
                        this.rotation = 315;
                    }else if(root[0] == "Northwest"){
                        this.rotation = 225;
                    }else if(root[0] == "Southeast"){
                        this.rotation = 45;
                    }else if(root[0] == "Southwest"){
                        this.rotation = 135;
                    }*/
                }
                if(worldFlg == true){
                    this.time++;
                    fireFlgs[Num] = false;
                    for(var j = 0; j < bulOb.length; j++){
                        for(var k = 0; k < bulOb[j].length; k++){
                            if(this.within(bulOb[j][k],28)==true && victory == false && defeat == false && complete == false){
                                game.assets['./sound/mini_bomb2.mp3'].clone().play();
                                colOb[j][k].destroy()
                                colOb[j][k].moveTo(-200,-200)
                                bulOb[j][k].moveTo(-200,-200)
                                moveSpeed = 0;
                                allyDeadFlg = true;
                                allyEntity[Num] = 0;
                                mark.moveTo(this.x,this.y+16)
                            }
                        }
                    }
                    
                    if(allyDeadFlg == true){
                        mark.opacity = 1.0
                        new Explosion(this,scene);
                        this.moveTo(-100,-100)
                        scene.removeChild(this);
                    }
                    new EnemyAim(alignment,cannon,32,Num,scene);

                    alignment.intersect(EnemyAim).forEach(function(){
                        fireFlgs[Num] = true;
                    })

                    tank.intersect(BulAim).forEach(function(){
                        bulOb.forEach(elem1=>{
                            elem1.forEach(elem2=>{
                                if(intercept4.intersect(elem2)){
                                    let dist1 = Math.sqrt(Math.pow(weak.x - enemyTarget[Num].x, 2) + Math.pow(weak.y - enemyTarget[Num].y, 2));
                                    let dist2 = Math.sqrt(Math.pow(weak.x - elem2.x, 2) + Math.pow(weak.y - elem2.y, 2));
                                    if(dist1 > dist2){
                                        enemyTarget[Num] = elem2;
                                    }
                                }
                            })
                        })
                    })
                    
                    if(this.time % fireLate == 0 && fireFlgs[Num]==true){
                        if(Math.floor(Math.random() * max*2)>bullets[Num]){
                            if(bullets[Num] < max && deadFlgs[Num] == false){
                                game.assets['./sound/putting_a_book2.mp3'].clone().play();
                                colOb[Num][PlBulCount] = new BulletCol(alignment,cannon,shotSpeed,grade,Num,scene);
                                bulOb[Num][PlBulCount] = new Bullet(colOb[Num][PlBulCount],cannon,ref,Num,max,shotSpeed,scene)
                                scene.insertBefore(colOb[Num][PlBulCount],filterMap);
                                scene.insertBefore(bulOb[Num][PlBulCount],filterMap);
                                new OpenFire(cannon,alignment,scene,filterMap)
                                PlBulCount = (PlBulCount+1) % max;
                                bullets[Num]++;
                            }  
                        }
                    }
                    
                    if(root == false && victory == false && defeat == false && complete == false) {
                        scene.removeChild(alignment)
                        alignment = new Target(cannon,Num,scene,weak,enemyTarget[Num])
                    }
                    if(root != false && (tank.within(enemyTarget[Num],32)==false)){
                        tank.rotation = this.rotation
                        var rad = this.rotation * (Math.PI / 180.0);
                        var dx = Math.cos(rad) * moveSpeed;
                        var dy = Math.sin(rad) * moveSpeed;
                        if(this.intersect(Floor)==false){
                            this.x += dx;
                            this.y += dy;
                        }else{
                            this.x -= dx;
                            this.y -= dy;
                        }
                        moveCnt += moveSpeed;
                    }
                    if(moveCnt == pixelSize){
                        root = findShortestPath([myPath[0],myPath[1]], grid,scene)
                        if(root[0] == "East"){
                            this.rotation = 0
                        }else if(root[0] == "West"){
                            this.rotation = 180;
                        }else if(root[0] == "North"){
                            this.rotation = 270;
                        }else if(root[0] == "South"){
                            this.rotation = 90;
                        }/*else if(root[0] == "Northeast"){
                            this.rotation = 315;
                        }else if(root[0] == "Northwest"){
                            this.rotation = 225;
                        }else if(root[0] == "Southeast"){
                            this.rotation = 45;
                        }else if(root[0] == "Southwest"){
                            this.rotation = 135;
                        }*/
                        moveCnt = 0
                    }
                }
                weak.rotation = this.rotation;
            }
            scene.insertBefore(this,tank)
        }
    })
    /* 敵(強)クラス */
    var Elite = Class.create(Sprite,{
        initialize: function(x,y,path1,path2,target,max,ref,shotSpeed,moveSpeed,fireLate,grade,category,scene,filterMap){
            Sprite.call(this, pixelSize-4, pixelSize-4)
            this.x = x*pixelSize;
            this.y = y*pixelSize-16;
            this.time = 0;

            var emax = max;
            const Num = entVal;
            entVal++;
            bullets[Num] = 0;
            boms[Num] = 0;
            deadFlgs.push(false)
            
            const tank = new Tank(this,path1,Num,scene,filterMap)
            const weak = new Weak(this,Num,scene,filterMap)
            const cannon = new Cannon(this,path2,Num,scene,filterMap)
            const mark = new Mark(tank,this,Num,scene,target)
            const intercept = new Intercept420(this,scene)
            const intercept2 = new Intercept280(this,scene)
            const intercept3 = new Intercept192(this,scene)
            const intercept4 = new Intercept600(this,scene)
            const intercept8 = new InterceptF(cannon,scene)
            var value = Math.floor(Math.random() * 4);;
            var speed = moveSpeed;
            var bomFlg = false;
            var rot = 0;
            var option = [0,2,3]
            var stopFlg = false;
            var opaFlg = false;
        
            if(moveSpeed != 0){
                speed = moveSpeed + addSpeed;
                if(stageNum >= 20){
                    speed = speed + (0.2*(stageNum / 20));
                }
            }

            enemyTarget[Num] = target;
            var alignment = new Target(cannon,Num,scene,weak,target)

            var PlBulCount = 0;
            for(var i = 0; i < emax; i++){
                colOb[Num][i] = new BulletCol(alignment,floors[i],shotSpeed,grade,Num,scene);
                bulOb[Num][i] = new Bullet(colOb[Num][i],floors[i],ref,Num,emax,shotSpeed,scene);
            }
            bomOb[Num][0] = new Bom(this,Num,scene);
            var EnemyAim = Class.create(Aim,{
                initialize: function(alignment,cannon,ssp,Num){
                    Aim.call(this,alignment,cannon,ssp,Num,scene);
                }
            })
            var ChangeOp = function(val){
                if(val == 0) option = [0,2,3]
                else if(val == 1) option = [1,2,3]
                else if(val == 2) option = [2,0,1]
                else if(val == 3) option = [3,0,1]
            }
            var ChangeVal = function(val){
                let nvalue = val;
                while(nvalue == option[0] || nvalue == option[1] || nvalue == option[2]) nvalue = Math.floor(Math.random() * 4);
                return nvalue;
            }

            if(addBullet != 0 && fireLate > 19) fireLate = fireLate - ((fireLate/5)*2); 
            
            this.onenterframe = function(){
                stopFlg = false;
                
                if(worldFlg == true){
                    this.time++;
                    if(grade == 6 && tank.within(tankEntity[0],220)==true && bomFlg == false && boms[Num] == 0){
                        bomOb[Num][boms[Num]] = new Bom(this,Num,scene);
                        scene.insertBefore(bomOb[Num][0],tank);
                        this.time = 0;
                        bomFlg = true;
                        boms[Num]++;
                    }
                    
                    if(grade == 6 && bomFlg == true && boms[Num] <= 0){
                        bomFlg = false;
                        bomOb[Num][0] = new Bom(this,Num,scene);
                        if(boms[Num]!=0) boms[Num] = 0
                    }
                    
                    if(grade == 7 && tank.opacity > 0 && opaFlg == false && tank.within(tankEntity[0],300)==false){
                        tank.opacity-=0.02
                        cannon.opacity-=0.02
                        if(tank.opacity <= 0){
                            tank.opacity = 0
                            cannon.opacity = 0;
                            opaFlg = true;
                        }
                    }
                    
                    if(grade == 7 && (((addBullet == 0 && opaFlg == true && this.time > 300)) || tank.within(tankEntity[0],300)==true)){
                        if(this.time % 2 == 0){
                            tank.opacity += 0.1;
                            cannon.opacity += 0.1;
                        }
                        if(tank.opacity > 1.0){
                            tank.opacity = 1.0;
                            cannon.opacity = 1.0;
                            this.time = 0;
                            opaFlg = false;
                        }
                    }
    
                    if(deadFlgs[0] == false){
                        
                        for(var j = 0; j < bulOb.length; j++){
                            for(var k = 0; k < bulOb[j].length; k++){
                                if(this.within(bulOb[j][k],28)==true || weak.intersect(bulOb[j][k])==true){
                                    game.assets['./sound/mini_bomb2.mp3'].clone().play();
                                    deadFlgs[Num] = true
                                    colOb[j][k].destroy()
                                    colOb[j][k].moveTo(-200,-200)
                                    bulOb[j][k].moveTo(-200,-200)
                                    moveSpeed = 0;
                                }
                            }
                        }
                        
                        new EnemyAim(alignment,cannon,32,Num,scene);
                        
                        if(deadFlgs[Num] == true){
                            tankColorCounts[category]--;
                            //alert(tankColorCounts)
                            mark.opacity = 1.0
                            mark.moveTo(this.x,this.y+16)
                            new Explosion(this,scene);
                            this.moveTo(-100,-100)
                            destruction++
                            scene.removeChild(this);
                        }
                        
                        alignment.intersect(EnemyAim).forEach(function(){
                            fireFlgs[Num] = true;
                        })
                        for(let i = 1; i < tankEntity.length; i++){
                            bulOb[0].forEach(elem=>{
                                if(tank.within(elem,400)==false){
                                    if(intercept8.intersect(tankEntity[i])==true && i != Num && deadFlgs[i]==false){
                                        fireFlgs[Num] = false;
                                    }
                                }
                            })
                        }
                        
                        if(game.time % fireLate == 0 && fireFlgs[Num]==true){
                            if(Math.floor(Math.random() * emax*2)>bullets[Num]){
                                if(grade == 6){
                                    if(bullets[Num] < emax && deadFlgs[Num] == false && boms[Num] > 0){
                                        if(Math.floor(Math.random() * 3) == 0 && ref > 0){
                                            let r1 = 0;
                                            let r2 = 0;
                                            if(Math.floor(Math.random() * 2) == 1){
                                                r1 = -1;
                                            }else{
                                                r1 = 1;
                                            }
                                            if(Math.floor(Math.random() * 2) == 1){
                                                r2 = -1;
                                            }else{
                                                r2 = 1;
                                            }
                                            alignment.moveTo(alignment.x+(30*r1),alignment.y+(30*r2));
                                        }
                                        game.assets['./sound/putting_a_book2.mp3'].clone().play();
                                        colOb[Num][PlBulCount] = new BulletCol(alignment,cannon,shotSpeed,grade,Num,scene);
                                        bulOb[Num][PlBulCount] = new Bullet(colOb[Num][PlBulCount],cannon,ref,Num,emax,shotSpeed,scene)
                                        scene.insertBefore(colOb[Num][PlBulCount],filterMap);
                                        scene.insertBefore(bulOb[Num][PlBulCount],filterMap);
                                        new OpenFire(cannon,alignment,scene,filterMap)
                                        PlBulCount = (PlBulCount+1) % emax;
                                        bullets[Num]++;  
                                    }
                                }else{
                                    if(bullets[Num] < emax && deadFlgs[Num] == false){
                                        if(Math.floor(Math.random() * 3) == 0 && ref > 0){
                                            let r1 = 0;
                                            let r2 = 0;
                                            if(Math.floor(Math.random() * 2) == 1){
                                                r1 = -1;
                                            }else{
                                                r1 = 1;
                                            }
                                            if(Math.floor(Math.random() * 2) == 1){
                                                r2 = -1;
                                            }else{
                                                r2 = 1;
                                            }
                                            alignment.moveTo(alignment.x+(30*r1),alignment.y+(30*r2));
                                        }
                                        game.assets['./sound/putting_a_book2.mp3'].clone().play();
                                        colOb[Num][PlBulCount] = new BulletCol(alignment,cannon,shotSpeed,grade,Num,scene);
                                        bulOb[Num][PlBulCount] = new Bullet(colOb[Num][PlBulCount],cannon,ref,Num,emax,shotSpeed,scene)
                                        scene.insertBefore(colOb[Num][PlBulCount],filterMap);
                                        scene.insertBefore(bulOb[Num][PlBulCount],filterMap);
                                        new OpenFire(cannon,alignment,scene,filterMap)
                                        PlBulCount = (PlBulCount+1) % emax;
                                        bullets[Num]++; 
                                    }
                                }
                            }
                        }
                        
                        if(game.time % 2 == 0){
                            fireFlgs[Num] = false;
                            enemyTarget[Num] = target;
                        }

                        test.forEach(elem=>{
                            if(tank.within(elem,60)==true){
                                stopFlg = true;
                            }
                        })
                        if(stopFlg == false){
                            bulOb[0].forEach(elem2=>{
                                if(intercept3.intersect(elem2) && tank.intersect(Floor)==false){
                                    let dist1 = Math.sqrt(Math.pow(weak.x - enemyTarget[Num].x, 2) + Math.pow(weak.y - enemyTarget[Num].y, 2));
                                    let dist2 = Math.sqrt(Math.pow(weak.x - elem2.x, 2) + Math.pow(weak.y - elem2.y, 2));
                                    if(dist1 > dist2){
                                        enemyTarget[Num] = elem2;
                                            if(this.time % 5 == 0){
                                                if(weak.x-2.75 > elem2.x){
                                                    if(weak.y-2.75 > elem2.y){
                                                        while(value == 0 || value == 2) value = Math.floor(Math.random() * 4);
                                                    }
                                                    else{
                                                        while(value == 0 || value == 3) value = Math.floor(Math.random() * 4);
                                                    }
                                                }else{
                                                    if(weak.y-2.75 > elem2.y){
                                                        while(value == 1 || value == 2) value = Math.floor(Math.random() * 4);
                                                    }
                                                    else{
                                                        while(value == 1 || value == 3) value = Math.floor(Math.random() * 4);
                                                    }
                                                } 
                                            }
                                    }
                                }
                                if(intercept4.intersect(elem2) && tank.intersect(Floor)==false){
                                    let dist1 = Math.sqrt(Math.pow(weak.x - enemyTarget[Num].x, 2) + Math.pow(weak.y - enemyTarget[Num].y, 2));
                                    let dist2 = Math.sqrt(Math.pow(weak.x - elem2.x, 2) + Math.pow(weak.y - elem2.y, 2));
                                    if(dist1 > dist2){
                                        tank.intersect(PlayerBulAim).forEach(function(){
                                            enemyTarget[Num] = elem2;
                                            if(this.time % 5 == 0){
                                                if(weak.x-2.75 > elem2.x){
                                                    if(weak.y-2.75 > elem2.y){
                                                        while(value == 0 || value == 2) value = Math.floor(Math.random() * 4);
                                                    }
                                                    else{
                                                        while(value == 0 || value == 3) value = Math.floor(Math.random() * 4);
                                                    }
                                                }else{
                                                    if(weak.y-2.75 > elem2.y){
                                                        while(value == 1 || value == 2) value = Math.floor(Math.random() * 4);
                                                    }
                                                    else{
                                                        while(value == 1 || value == 3) value = Math.floor(Math.random() * 4);
                                                    }
                                                } 
                                            }
                                        }) 
                                    }
                                }
                            })
                            
                            if(grade == 6 && tank.within(bomOb[Num][0],400)==true && tank.intersect(Floor)==false){
                                let dist = Math.sqrt(Math.pow(weak.x - bomOb[Num][0].x, 2) + Math.pow(weak.y - bomOb[Num][0].y, 2));
                                if(dist < 400){
                                    fireFlgs[Num] = false;
                                    if(this.time % 5 == 0){
                                        if(weak.x-2.75 > bomOb[Num][0].x){
                                            if(weak.y-2.75 > bomOb[Num][0].y){
                                                while(value == 1 || value == 3) value = Math.floor(Math.random() * 4);
                                            }
                                            else{
                                                while(value == 1 || value == 2) value = Math.floor(Math.random() * 4);
                                            }
                                                        
                                        }else{
                                            if(weak.y-2.75 > bomOb[Num][0].y){
                                                while(value == 0 || value == 3) value = Math.floor(Math.random() * 4);
                                            }
                                            else{
                                                while(value == 0 || value == 2) value = Math.floor(Math.random() * 4);
                                            }
                                        }
                                    }
                                }
                            }
                            
                            if(grade > 3){
                                bomOb.forEach(elem=>{
                                    elem.forEach(elem2=>{
                                        if(tank.within(elem2,260)==true && tank.intersect(Floor)==false){
                                            let dist1 = Math.sqrt(Math.pow(weak.x - enemyTarget[Num].x, 2) + Math.pow(weak.y - enemyTarget[Num].y, 2));
                                            let dist2 = Math.sqrt(Math.pow(weak.x - elem2.x, 2) + Math.pow(weak.y - elem2.y, 2));
                                            if(dist1 > dist2){
                                                if(this.time % 5 == 0){
                                                    if(weak.x-2.75 > elem2.x){
                                                        if(weak.y-2.75 > elem2.y){
                                                            while(value == 0 || value == 2) value = Math.floor(Math.random() * 4);
                                                        }
                                                        else{
                                                            while(value == 0 || value == 3) value = Math.floor(Math.random() * 4);
                                                        }
                                                    }else{
                                                        if(weak.y-2.75 > elem2.y){
                                                            while(value == 1 || value == 2) value = Math.floor(Math.random() * 4);
                                                        }
                                                        else{
                                                            while(value == 1 || value == 3) value = Math.floor(Math.random() * 4);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    })
                                })
                                bulOb[Num].forEach(elem=>{
                                    if(intercept4.intersect(elem) && tank.intersect(Floor)==false){
                                        let dist1 = Math.sqrt(Math.pow(weak.x - enemyTarget[Num].x, 2) + Math.pow(weak.y - enemyTarget[Num].y, 2));
                                        let dist2 = Math.sqrt(Math.pow(weak.x - elem.x, 2) + Math.pow(weak.y - elem.y, 2));
                                        if(dist1 > dist2 && intercept3.intersect(elem)==false){
                                            tank.intersect(EnemyAim).forEach(function(){
                                                enemyTarget[Num] = elem;
                                            })
                                            if(this.time % 5 == 0){
                                                if(weak.x-2.75 > elem.x){
                                                    if(weak.y-2.75 > elem.y){
                                                        while(value == 0 || value == 2) value = Math.floor(Math.random() * 4);
                                                    }
                                                    else{
                                                        while(value == 0 || value == 3) value = Math.floor(Math.random() * 4);
                                                    }
                                                }else{
                                                    if(weak.y-2.75 > elem.y){
                                                        while(value == 1 || value == 2) value = Math.floor(Math.random() * 4);
                                                    }
                                                    else{
                                                        while(value == 1 || value == 3) value = Math.floor(Math.random() * 4);
                                                    }
                                                }
                                            }
                                            
                                        }
                                    }
                                    if(intercept2.intersect(elem) && tank.intersect(Floor)==false){
                                        let dist1 = Math.sqrt(Math.pow(weak.x - enemyTarget[Num].x, 2) + Math.pow(weak.y - enemyTarget[Num].y, 2));
                                        let dist2 = Math.sqrt(Math.pow(weak.x - elem.x, 2) + Math.pow(weak.y - elem.y, 2));
                                        if(dist1 > dist2 && intercept3.intersect(elem)==false){
                                            if(this.time % 5 == 0){
                                                if(weak.x-2.75 > elem.x){
                                                    if(weak.y-2.75 > elem.y){
                                                        while(value == 0 || value == 2) value = Math.floor(Math.random() * 4);
                                                    }
                                                    else{
                                                        while(value == 0 || value == 3) value = Math.floor(Math.random() * 4);
                                                    }
                                                }else{
                                                    if(weak.y-2.75 > elem.y){
                                                        while(value == 1 || value == 2) value = Math.floor(Math.random() * 4);
                                                    }
                                                    else{
                                                        while(value == 1 || value == 3) value = Math.floor(Math.random() * 4);
                                                    }
                                                }
                                            }
                                            
                                        }
                                    }
                                })
                            }
                            
                            bulOb[0].forEach(elem=>{
                                if(intercept3.intersect(elem)==true){
                                    escapeFlg = true;
                                }
                            })
                            
                            if(game.time % 5 == 0){
                                
                                for(var i = 0; i < tankEntity.length; i++){
                                    if(i != Num && deadFlgs[i] == false){
                                        if(intercept3.intersect(tankEntity[i])==true){
                                            if(this.time % 5 == 0){
                                                if(weak.x-2.75 > tankEntity[i].x){
                                                
                                                    if(weak.y-2.75 > tankEntity[i].y){
                                                        while(value == 0 || value == 2) value = Math.floor(Math.random() * 4);
                                                    }
                                                    else{
                                                        while(value == 0 || value == 3) value = Math.floor(Math.random() * 4);
                                                    }
                                                }else{
                                                    if(weak.y-2.75 > tankEntity[i].y){
                                                        while(value == 1 || value == 2) value = Math.floor(Math.random() * 4);
                                                    }
                                                    else{
                                                        while(value == 1 || value == 3) value = Math.floor(Math.random() * 4);
                                                    }
                                                }
                                            }
                                            
                                        }else{
                                            let dist = Math.sqrt(Math.pow(weak.x - enemyTarget[Num].x, 2) + Math.pow(weak.y - enemyTarget[Num].y, 2));
                                            if(grade == 7 && dist > 240){
                                                
                                                if(weak.x-2.75 > enemyTarget[Num].x){
                                                    if(weak.y-2.75 > enemyTarget[Num].y){
                                                        while(value == 1 || value == 3) value = Math.floor(Math.random() * 4);
                                                    }
                                                    else{
                                                        while(value == 1 || value == 2) value = Math.floor(Math.random() * 4);
                                                    }
                                                        
                                                }else{
                                                    if(weak.y-2.75 > enemyTarget[Num].y){
                                                        while(value == 0 || value == 3) value = Math.floor(Math.random() * 4);
                                                    }
                                                    else{
                                                        while(value == 0 || value == 2) value = Math.floor(Math.random() * 4);
                                                    }
                                                }
                                            }
                                            if(grade == 6 && dist > 400){
                                                if(this.time % 5 == 0){
                                                    if(weak.x-2.75 > enemyTarget[Num].x){
                                                        if(weak.y-2.75 > enemyTarget[Num].y){
                                                            while(value == 1 || value == 3) value = Math.floor(Math.random() * 4);
                                                        }
                                                        else{
                                                            while(value == 1 || value == 2) value = Math.floor(Math.random() * 4);
                                                        }
                                                            
                                                    }else{
                                                        if(weak.y-2.75 > enemyTarget[Num].y){
                                                            while(value == 0 || value == 3) value = Math.floor(Math.random() * 4);
                                                        }
                                                        else{
                                                            while(value == 0 || value == 2) value = Math.floor(Math.random() * 4);
                                                        }
                                                    }
                                                }
                                                
                                            }else if(dist > 160){
                                                if(this.time % 5 == 0){
                                                    if(weak.x-2.75 > enemyTarget[Num].x){
                                                        if(weak.y-2.75 > enemyTarget[Num].y){
                                                            while(value == 1 || value == 3) value = Math.floor(Math.random() * 4);
                                                        }
                                                        else{
                                                            while(value == 1 || value == 2) value = Math.floor(Math.random() * 4);
                                                        }
                                                            
                                                    }else{
                                                        if(weak.y-2.75 > enemyTarget[Num].y){
                                                            while(value == 0 || value == 3) value = Math.floor(Math.random() * 4);
                                                        }
                                                        else{
                                                            while(value == 0 || value == 2) value = Math.floor(Math.random() * 4);
                                                        }
                                                    }
                                                }    
                                                
                                            }else{
                                                if(this.time % 5 == 0){
                                                    if(weak.x-2.75 > enemyTarget[Num].x){
                                                        if(weak.y-2.75 > enemyTarget[Num].y){
                                                            while(value == 0 || value == 2) value = Math.floor(Math.random() * 4);
                                                        }
                                                        else{
                                                            while(value == 0 || value == 3) value = Math.floor(Math.random() * 4);
                                                        }
                                                    }else{
                                                        if(weak.y-2.75 > enemyTarget[Num].y){
                                                            while(value == 1 || value == 2) value = Math.floor(Math.random() * 4);
                                                        }
                                                        else{
                                                            while(value == 1 || value == 3) value = Math.floor(Math.random() * 4);
                                                        }
                                                    }
                                                } 
                                                
                                            }
                                            if(allyFlg == true){
                                                if(allyDeadFlg == false){
                                                    if(tank.within(allyEntity[0],480)==true){
                                                        let dist1 = Math.sqrt(Math.pow(weak.x - enemyTarget[Num].x, 2) + Math.pow(weak.y - enemyTarget[Num].y, 2));
                                                        let dist2 = Math.sqrt(Math.pow(weak.x - allyEntity[0].x, 2) + Math.pow(weak.y - allyEntity[0].y, 2));
                                                        if(dist1 > dist2){
                                                            enemyTarget[Num] = allyEntity[0];
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            if(value == 0){
                                rot = 0;
                                this.x -= speed;
                            }else if(value == 1){
                                rot = 180;
                                this.x += speed;
                            }else if(value == 2){
                                rot = 90;
                                this.y -= speed;
                            }else if(value == 3){
                                rot = 270;
                                this.y += speed;
                            }
                        }else{
                            if(value == 0){
                                this.x += (speed);
                            }else if(value == 1){
                                this.x -= (speed);
                            }else if(value == 2){
                                this.y += (speed);
                            }else if(value == 3){
                                this.y -= (speed);
                            }
                            let chg = false;
                            test.forEach(elem=>{
                                if(tank.within(elem,60-speed)==true){
                                    chg = true;
                                }
                            })
                            if(chg==false){
                                ChangeOp(value)
                                value = ChangeVal(value)
                            } 
                        }
                        if(allyEntity[0] != null){
                            if(allyDeadFlg == false){
                                if(tank.within(allyEntity[0],480)==true){
                                    let dist1 = Math.sqrt(Math.pow(weak.x - enemyTarget[Num].x, 2) + Math.pow(weak.y - enemyTarget[Num].y, 2));
                                    let dist2 = Math.sqrt(Math.pow(weak.x - allyEntity[0].x, 2) + Math.pow(weak.y - allyEntity[0].y, 2));
                                    if(dist1 > dist2){
                                        enemyTarget[Num] = allyEntity[0];
                                    }
                                }
                            }
                        }
                        if(allyEntity[0] != null){
                            bulOb[bulOb.length-1].forEach(elem=>{
                                if(intercept.intersect(elem)==true){
                                    let dist1 = Math.sqrt(Math.pow(weak.x - enemyTarget[Num].x, 2) + Math.pow(weak.y - enemyTarget[Num].y, 2));
                                    let dist2 = Math.sqrt(Math.pow(weak.x - elem.x, 2) + Math.pow(weak.y - elem.y, 2));
                                    if(dist1 > dist2){
                                        enemyTarget[Num] = elem;
                                    }
                                }
                            })
                        }
                        bulOb[0].forEach(elem2=>{
                            if(intercept.intersect(elem2) && tank.intersect(Floor)==false){
                                let dist1 = Math.sqrt(Math.pow(weak.x - enemyTarget[Num].x, 2) + Math.pow(weak.y - enemyTarget[Num].y, 2));
                                let dist2 = Math.sqrt(Math.pow(weak.x - elem2.x, 2) + Math.pow(weak.y - elem2.y, 2));
                                if(dist1 > dist2){
                                    tank.intersect(PlayerBulAim).forEach(function(){
                                        enemyTarget[Num] = elem2;
                                    }) 
                                }
                            }
                        })
                        
                        /* 戦車本体の角度 */
                        if(moveSpeed > 0){
                            this.rotation = rot;
                            tank.rotation = rot;
                            weak.rotation = rot;
                        }
                    }
                }
            }
            scene.insertBefore(this,tank)
        }
    })
    /* 【テスト】強敵クラス */
    var Boss = Class.create(Sprite,{
        initialize: function(x,y,tankPath,cannonPath,target,max,ref,shotSpeed,moveSpeed,fireLate,grade,category,scene,filterMap){
            Sprite.call(this, pixelSize-4, pixelSize-4)
            this.x = x*pixelSize;
            this.y = y*pixelSize-16;
            this.time = 0;
            
            const Num = entVal;
            entVal++;
            bullets[Num] = 0;
            boms[Num] = 0;
            deadFlgs.push(false)
            
            const tank = new Tank(this,tankPath,Num,scene,filterMap)
            const weak = new Weak(this,Num,scene,filterMap)
            const cannon = new Cannon(this,cannonPath,Num,scene,filterMap)
            const mark = new Mark(tank,this,Num,scene,target)
            const intercept = new Intercept420(this,scene)
            const intercept2 = new Intercept280(this,scene)
            const intercept3 = new Intercept192(this,scene)
            const intercept4 = new Intercept600(this,scene)
            const intercept5 = new InterceptA(cannon,scene)
            const intercept6 = new InterceptB(cannon,scene)
            const intercept7 = new InterceptC(cannon,scene)
            var value = 0;
            var rot = 0;
            var emax = max
            var speed = moveSpeed;
            var option = [0,4,6,2,3]
            var stopFlg = false;
            var dflg = false;
            var defenseMax = parseInt(max/2)-1;
            var escapeFlg = false;
            var opaFlg = false;

            if(moveSpeed != 0){
                speed = moveSpeed + addSpeed;
                if(stageNum >= 20 && grade < 10){
                    speed = speed + (0.2*(stageNum / 20));
                }
            }
            enemyTarget[Num] = target;
            var alignment = new Target(cannon,Num,scene,weak,target)

            var PlBulCount = 0;
            for(var i = 0; i < max+defenseMax; i++){
                colOb[Num][i] = new BulletCol(alignment,floors[i],shotSpeed,grade,Num,scene);
                bulOb[Num][i] = new Bullet(colOb[Num][i],floors[i],ref,Num,max,shotSpeed,scene);
            }
            bomOb[Num][0] = new Bom(this,Num,scene);

            var EnemyAim = Class.create(Aim,{
                initialize: function(target,shotSpeed,num,scene){
                    Aim.call(this,target,cannon,shotSpeed,num,scene);
                }
            })
            var ChangeOp = function(val){
                if(val == 0) option = [0,4,6,2,3]
                else if(val == 1) option = [1,5,7,2,3]
                else if(val == 2) option = [2,4,5,0,1]
                else if(val == 3) option = [3,6,7,0,1]
                else if(val == 4) option = [4,0,2,5,6]
                else if(val == 5) option = [5,2,1,4,7]
                else if(val == 6) option = [6,0,3,4,7]
                else if(val == 7) option = [7,1,3,5,6]
            }
            var ChangeVal = function(val){
                let nvalue = val;
                while(nvalue == option[0] || nvalue == option[1] || nvalue == option[2] || nvalue == option[3] || nvalue == option[4]) nvalue = Math.floor(Math.random() * 8);
                return nvalue;
            }

            if(addBullet != 0){
                if(shotSpeed < 14) shotSpeed += 1; 
                if(fireLate > 19) fireLate = fireLate - ((fireLate/5)*2);
            }
            

            this.onenterframe = function(){
                stopFlg = false;

                if(game.time % 2 == 0)
                dflg = false;
                
                if(dflg == false && escapeFlg == false){
                    if(moveSpeed != 0){
                        speed = moveSpeed + addSpeed;
                        if(stageNum >= 20 && grade < 10){
                            speed = speed + (0.2*(stageNum / 20));
                        }
                    }
                }else{
                    if(moveSpeed != 0){
                        speed = moveSpeed + addSpeed;
                        if(grade == 13){
                            speed = speed + (0.2*(stageNum / 20))+1.6;
                        }else if(stageNum >= 20 && grade < 10){
                            speed = speed + (0.2*(stageNum / 20));
                        }else if(grade >= 10){
                            speed = speed + 0.8;
                        }
                    }
                }
                
                if(worldFlg == true){
                    this.time++;
                    if(deadFlgs[0] == false){
                        if(grade == 9 && tank.opacity > 0 && opaFlg == false && tank.within(tankEntity[0],300)==false){
                            tank.opacity-=0.02
                            cannon.opacity-=0.02
                            if(tank.opacity <= 0){
                                tank.opacity = 0
                                cannon.opacity = 0;
                            }
                        }
                        
                        if(grade == 9 && (((addBullet == 0 && opaFlg == true && this.time > 300)) || tank.within(tankEntity[0],300)==true)){
                            if(this.time % 2 == 0){
                                tank.opacity += 0.1;
                                cannon.opacity += 0.1;
                            }
                            if(tank.opacity > 1.0){
                                tank.opacity = 1.0;
                                cannon.opacity = 1.0;
                                this.time = 0;
                                opaFlg = false;
                            }
                        }
                        if(grade == 11 && tank.opacity > 0 && opaFlg == false && tank.within(tankEntity[0],400)==false){
                            tank.opacity-=0.02
                            cannon.opacity-=0.02
                            if(tank.opacity <= 0){
                                tank.opacity = 0
                                cannon.opacity = 0;
                            }
                        }
                        if(grade == 11 && (opaFlg == true || tank.within(tankEntity[0],360)==true)){
                            if(this.time % 2 == 0){
                                tank.opacity += 0.5;
                                cannon.opacity += 0.5;
                            }
                            if(tank.opacity > 1.0){
                                tank.opacity = 1.0;
                                cannon.opacity = 1.0;
                                opaFlg = false;
                            }
                        }
                        if(grade == 13 && tank.opacity > 0 && opaFlg == false && tank.within(tankEntity[0],360)==false){
                            tank.opacity-=0.05
                            cannon.opacity-=0.05
                            if(tank.opacity <= 0){
                                tank.opacity = 0
                                cannon.opacity = 0;
                            }
                        }
                        if(grade == 13 && (opaFlg == true || tank.within(tankEntity[0],360)==true)){
                            tank.opacity += 0.25;
                            cannon.opacity += 0.25;
                            if(tank.opacity > 1.0){
                                tank.opacity = 1.0;
                                cannon.opacity = 1.0;
                                opaFlg = false;
                            }
                        }

                        for(var j = 0; j < bulOb.length; j++){
                            for(var k = 0; k < bulOb[j].length; k++){
                                if(this.within(bulOb[j][k],28)==true || weak.intersect(bulOb[j][k])==true){
                                    game.assets['./sound/mini_bomb2.mp3'].clone().play();
                                    deadFlgs[Num] = true
                                    colOb[j][k].destroy()
                                    colOb[j][k].moveTo(-200,-200)
                                    bulOb[j][k].moveTo(-200,-200)
                                    moveSpeed = 0;
                                }
                            }
                        }

                        new EnemyAim(alignment,32,Num,scene);
  
                        if(deadFlgs[Num] == true){
                            tankColorCounts[category]--;
                            //alert(tankColorCounts)
                            mark.opacity = 1.0
                            mark.moveTo(this.x,this.y+16)
                            new Explosion(this,scene);
                            this.moveTo(-100,-100)
                            destruction++
                            scene.removeChild(this);
                        }
                        
                        
                        
                        if(game.time % 2 == 0){
                            fireFlgs[Num] = false;
                        }
                        /*intercept3.intersect(BulAim).forEach(function(){
                            dflg = true;
                        })*/
                        
                        if(this.time % 2 == 0){
                            escapeFlg = false;
                        }
                        if(this.time % 2 == 0) enemyTarget[Num] = tankEntity[0];

                        test.forEach(elem=>{
                            if(tank.within(elem,64)==true){
                                stopFlg = true;
                            }
                        })
                        
                        if(stopFlg == false){
                            
                            bulOb[0].forEach(elem=>{
                                if(intercept3.intersect(elem)==true){
                                    escapeFlg = true;
                                }
                            })
                            
                            if(game.time % 5 == 0){
                                
                                for(var i = 0; i < tankEntity.length; i++){
                                    if(i != Num){
                                        if(intercept.intersect(tankEntity[i])==true){
                                            if(weak.x-2.75 > tankEntity[i].x){
                                                if(weak.y-2.75 > tankEntity[i].y){
                                                    while(value == 0 || value == 2 || value == 4) value = Math.floor(Math.random() * 8);
                                                }
                                                else{
                                                    while(value == 0 || value == 3 || value == 6) value = Math.floor(Math.random() * 8);
                                                }
                                            }else{
                                                if(weak.y-2.75 > tankEntity[i].y){
                                                    while(value == 1 || value == 2 || value == 5) value = Math.floor(Math.random() * 8);
                                                }
                                                else{
                                                    while(value == 1 || value == 3 || value == 7) value = Math.floor(Math.random() * 8);
                                                }
                                            }
                                        }else{
                                            let dist = Math.sqrt(Math.pow(weak.x - enemyTarget[Num].x, 2) + Math.pow(weak.y - enemyTarget[Num].y, 2));
                                            if(dist > 400 && grade >= 10){
                                                    
                                                if(weak.x-2.75 > enemyTarget[Num].x){
                                                    if(weak.y-2.75 > enemyTarget[Num].y){
                                                        while(value == 1 || value == 3 || value == 7) value = Math.floor(Math.random() * 8);
                                                    }
                                                    else{
                                                        while(value == 1 || value == 2 || value == 5) value = Math.floor(Math.random() * 8);
                                                    }
                                                        
                                                }else{
                                                    if(weak.y-2.75 > enemyTarget[Num].y){
                                                        while(value == 0 || value == 3 || value == 6) value = Math.floor(Math.random() * 8);
                                                    }
                                                    else{
                                                        while(value == 0 || value == 2 || value == 4) value = Math.floor(Math.random() * 8);
                                                    }
                                                }
                                            }else if(dist > 200){
                                                    
                                                if(weak.x-2.75 > enemyTarget[Num].x){
                                                    if(weak.y-2.75 > enemyTarget[Num].y){
                                                        while(value == 1 || value == 3 || value == 7) value = Math.floor(Math.random() * 8);
                                                    }
                                                    else{
                                                        while(value == 1 || value == 2 || value == 5) value = Math.floor(Math.random() * 8);
                                                    }
                                                        
                                                }else{
                                                    if(weak.y-2.75 > enemyTarget[Num].y){
                                                        while(value == 0 || value == 3 || value == 6) value = Math.floor(Math.random() * 8);
                                                    }
                                                    else{
                                                        while(value == 0 || value == 2 || value == 4) value = Math.floor(Math.random() * 8);
                                                    }
                                                }
                                            }else{
                                                if(weak.x-2.75 > enemyTarget[Num].x){
                                                    if(weak.y-2.75 > enemyTarget[Num].y){
                                                        while(value == 4) value = Math.floor(Math.random() * 8);
                                                    }
                                                    else{
                                                        while(value == 6) value = Math.floor(Math.random() * 8);
                                                    }
                                                }else{
                                                    if(weak.y-2.75 > enemyTarget[Num].y){
                                                        while(value == 5) value = Math.floor(Math.random() * 8);
                                                    }
                                                    else{
                                                        while(value == 7) value = Math.floor(Math.random() * 8);
                                                    }
                                                }
                                                /*if(weak.x-2.75 > enemyTarget[Num].x){
                                                    if(weak.y-2.75 > enemyTarget[Num].y){
                                                        while(value == 0 || value == 2 || value == 4) value = Math.floor(Math.random() * 8);
                                                    }
                                                    else{
                                                        while(value == 0 || value == 3 || value == 6) value = Math.floor(Math.random() * 8);
                                                    }
                                                }else{
                                                    if(weak.y-2.75 > enemyTarget[Num].y){
                                                        while(value == 1 || value == 2 || value == 5) value = Math.floor(Math.random() * 8);
                                                    }
                                                    else{
                                                        while(value == 1 || value == 3 || value == 7) value = Math.floor(Math.random() * 8);
                                                    }
                                                }*/
                                            }
                                            if(allyFlg == true){
                                                if(allyDeadFlg == false){
                                                    if(tank.within(allyEntity[0],480)==true){
                                                        let dist1 = Math.sqrt(Math.pow(weak.x - enemyTarget[Num].x, 2) + Math.pow(weak.y - enemyTarget[Num].y, 2));
                                                        let dist2 = Math.sqrt(Math.pow(weak.x - allyEntity[0].x, 2) + Math.pow(weak.y - allyEntity[0].y, 2));
                                                        if(dist1 > dist2){
                                                            enemyTarget[Num] = allyEntity[0];
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            if(value == 4){
                                //左上
                                rot = 45
                                this.x -= speed/1.5;
                                this.y -= speed/1.5;
                            }else if(value == 5){
                                //右上
                                rot = 135
                                this.x += speed/1.5;
                                this.y -= speed/1.5;
                            }else if(value == 6){
                                //左下
                                rot = 315
                                this.x -= speed/1.5;
                                this.y += speed/1.5;
                            }else if(value == 7){
                                //右下
                                rot = 225
                                this.x += speed/1.5;
                                this.y += speed/1.5;
                            }else if(value == 0){
                                rot = 0;
                                this.x -= speed;
                            }else if(value == 1){
                                rot = 180;
                                this.x += speed;
                            }else if(value == 2){
                                rot = 90;
                                this.y -= speed;
                            }else if(value == 3){
                                rot = 270;
                                this.y += speed;
                            }
                            
                        }else{
                            if(value == 0){
                                this.x += (speed*2);
                            }else if(value == 1){
                                this.x -= (speed*2);
                            }else if(value == 2){
                                this.y += (speed*2);
                            }else if(value == 3){
                                this.y -= (speed*2);
                            }else if(value == 4){
                                this.x += (speed*2)/1.5;
                                this.y += (speed*2)/1.5;
                            }else if(value == 5){
                                this.x -= (speed*2)/1.5;
                                this.y += (speed*2)/1.5;
                            }else if(value == 6){
                                this.x += (speed*2)/1.5;
                                this.y -= (speed*2)/1.5;
                            }else if(value == 7){
                                this.x -= (speed*2)/1.5;
                                this.y -= (speed*2)/1.5;
                            }
                            let chg = false;
                            test.forEach(elem=>{
                                if(tank.within(elem,58)==true){
                                    chg = true;
                                }
                            })
                            if(chg==false){
                                ChangeOp(value)
                                value = ChangeVal(value)
                            }
                        }
                        tank.intersect(PlayerBulAim).forEach(function(){
                            dflg = true;
                        })
                        tank.intersect(EnemyAim).forEach(function(){
                            dflg = true;
                        })
                        if(stopFlg == false){
                            
                            for(let i = 1; i < bulOb.length; i++){
                                if(i != Num){
                                    bulOb[i].forEach(elem2=>{
                                        let dist1 = Math.sqrt(Math.pow(weak.x - enemyTarget[Num].x, 2) + Math.pow(weak.y - enemyTarget[Num].y, 2));
                                        let dist2 = Math.sqrt(Math.pow(weak.x - elem2.x, 2) + Math.pow(weak.y - elem2.y, 2));
                                        if(dist1 > dist2){
                                            
                                            if(intercept2.intersect(elem2)){
                                                enemyTarget[Num] = elem2
                                                
                                                if(this.time % 5 == 0){
                                                    if(weak.x-2.75 > elem2.x){
                                                        if(weak.y-2.75 > elem2.y){
                                                            while(value == 0 || value == 2 || value == 4) value = Math.floor(Math.random() * 8);
                                                        }
                                                        else{
                                                            while(value == 0 || value == 3 || value == 6) value = Math.floor(Math.random() * 8);
                                                        }
                                                    }else{
                                                        if(weak.y-2.75 > elem2.y){
                                                            while(value == 1 || value == 2 || value == 5) value = Math.floor(Math.random() * 8);
                                                        }
                                                        else{
                                                            while(value == 1 || value == 3 || value == 7) value = Math.floor(Math.random() * 8);
                                                        }
                                                    }
                                                }
                                            }
                                            if((intercept5.intersect(elem2)==true || intercept6.intersect(elem2)==true || intercept3.intersect(elem2)==true)&&grade >= 10){
                                                enemyTarget[Num] = elem2
                                                if(grade >= 10){
                                                    alignment.moveTo(elem2.x,elem2.y)
                                                    new EnemyAim(alignment,32,Num,scene);
                                                }
                                                
                                                if(this.time % 5 == 0){
                                                    if(weak.x-2.75 > enemyTarget[Num].x){
                                                        if(weak.y-2.75 > enemyTarget[Num].y){
                                                            while(value == 0 || value == 2 || value == 4) value = Math.floor(Math.random() * 8);
                                                        }
                                                        else{
                                                            while(value == 0 || value == 3 || value == 6) value = Math.floor(Math.random() * 8);
                                                        }
                                                    }else{
                                                        if(weak.y-2.75 > enemyTarget[Num].y){
                                                            while(value == 1 || value == 2 || value == 5) value = Math.floor(Math.random() * 8);
                                                        }
                                                        else{
                                                            while(value == 1 || value == 3 || value == 7) value = Math.floor(Math.random() * 8);
                                                        }
                                                    }
                                                }  
                                            }
                                        }
                                        
                                    })
                                    
                                }
                            }
                            
                            bulOb[Num].forEach(elem=>{
                                if(intercept4.intersect(elem) && tank.intersect(Floor)==false){
                                    let dist1 = Math.sqrt(Math.pow(weak.x - enemyTarget[Num].x, 2) + Math.pow(weak.y - enemyTarget[Num].y, 2));
                                    let dist2 = Math.sqrt(Math.pow(weak.x - elem.x, 2) + Math.pow(weak.y - elem.y, 2));
                                    if(dist1 > dist2 && intercept3.intersect(elem)==false){
                                        tank.intersect(EnemyAim).forEach(function(){
                                            enemyTarget[Num] = elem;
                                            alignment.moveTo(elem.x,elem.y)
                                            new EnemyAim(alignment,32,Num,scene);
                                        })
                                        if(this.time % 5 == 0){
                                            if(weak.x-2.75 > elem.x){
                                                if(weak.y-2.75 > elem.y){
                                                    while(value == 0 || value == 2 || value == 4) value = Math.floor(Math.random() * 8);
                                                }
                                                else{
                                                    while(value == 0 || value == 3 || value == 6) value = Math.floor(Math.random() * 8);
                                                }
                                            }else{
                                                if(weak.y-2.75 > elem.y){
                                                    while(value == 1 || value == 2 || value == 5) value = Math.floor(Math.random() * 8);
                                                }
                                                else{
                                                    while(value == 1 || value == 3 || value == 7) value = Math.floor(Math.random() * 8);
                                                }
                                            }
                                        }
                                    }
                                }
                                if(intercept2.intersect(elem) && tank.intersect(Floor)==false){
                                    let dist1 = Math.sqrt(Math.pow(weak.x - enemyTarget[Num].x, 2) + Math.pow(weak.y - enemyTarget[Num].y, 2));
                                    let dist2 = Math.sqrt(Math.pow(weak.x - elem.x, 2) + Math.pow(weak.y - elem.y, 2));
                                    if(dist1 > dist2 && intercept3.intersect(elem)==false){
                                        tank.intersect(EnemyAim).forEach(function(){
                                            enemyTarget[Num] = elem;
                                            alignment.moveTo(elem.x,elem.y)
                                            new EnemyAim(alignment,32,Num,scene);
                                            if(this.time % 5 == 0){
                                                if(weak.x-2.75 > elem.x){
                                                    if(weak.y-2.75 > elem.y){
                                                        while(value == 0 || value == 2 || value == 4) value = Math.floor(Math.random() * 8);
                                                    }
                                                    else{
                                                        while(value == 0 || value == 3 || value == 6) value = Math.floor(Math.random() * 8);
                                                    }
                                                }else{
                                                    if(weak.y-2.75 > elem.y){
                                                        while(value == 1 || value == 2 || value == 5) value = Math.floor(Math.random() * 8);
                                                    }
                                                    else{
                                                        while(value == 1 || value == 3 || value == 7) value = Math.floor(Math.random() * 8);
                                                    }
                                                }
                                            }
                                        })
                                        
                                    }
                                }
                                if(tank.within(elem,120)==true && bullets[Num]>0 && bullets[Num] < max/2 && tank.intersect(Floor)==false){
                                    let dist1 = Math.sqrt(Math.pow(weak.x - enemyTarget[Num].x, 2) + Math.pow(weak.y - enemyTarget[Num].y, 2));
                                    let dist2 = Math.sqrt(Math.pow(weak.x - elem.x, 2) + Math.pow(weak.y - elem.y, 2));
                                    if(dist1 > dist2 && intercept3.intersect(elem)==false){
                                        enemyTarget[Num] = elem;
                                        alignment.moveTo(elem.x,elem.y)
                                        new EnemyAim(alignment,32,Num,scene);
                                        fireFlgs[Num] = true;
                                    }
                                }
                            })
                            
                            bulOb[0].forEach(elem=>{
                                if(intercept5.intersect(elem)==true || intercept6.intersect(elem)==true || intercept3.intersect(elem)==true){
                                    let dist1 = Math.sqrt(Math.pow(weak.x - enemyTarget[Num].x, 2) + Math.pow(weak.y - enemyTarget[Num].y, 2));
                                    let dist2 = Math.sqrt(Math.pow(weak.x - elem.x, 2) + Math.pow(weak.y - elem.y, 2));
                                    if(dist1 > dist2){
                                        enemyTarget[Num] = elem
                                        alignment.moveTo(elem.x,elem.y)
                                        new EnemyAim(alignment,32,Num,scene);
                                        if(this.time % 3 == 0 && grade == 13){
                                            if(weak.x-2.75 > enemyTarget[Num].x){
                                                if(weak.y-2.75 > enemyTarget[Num].y){
                                                    while(value == 0 || value == 2 || value == 4) value = Math.floor(Math.random() * 8);
                                                }
                                                else{
                                                    while(value == 0 || value == 3 || value == 6) value = Math.floor(Math.random() * 8);
                                                }
                                            }else{
                                                if(weak.y-2.75 > enemyTarget[Num].y){
                                                    while(value == 1 || value == 2 || value == 5) value = Math.floor(Math.random() * 8);
                                                }
                                                else{
                                                    while(value == 1 || value == 3 || value == 7) value = Math.floor(Math.random() * 8);
                                                }
                                            }
                                        }else if(this.time % 5 == 0){
                                            if(weak.x-2.75 > enemyTarget[Num].x){
                                                if(weak.y-2.75 > enemyTarget[Num].y){
                                                    while(value == 0 || value == 2 || value == 4) value = Math.floor(Math.random() * 8);
                                                }
                                                else{
                                                    while(value == 0 || value == 3 || value == 6) value = Math.floor(Math.random() * 8);
                                                }
                                            }else{
                                                if(weak.y-2.75 > enemyTarget[Num].y){
                                                    while(value == 1 || value == 2 || value == 5) value = Math.floor(Math.random() * 8);
                                                }
                                                else{
                                                    while(value == 1 || value == 3 || value == 7) value = Math.floor(Math.random() * 8);
                                                }
                                            }
                                        }
                                    }   
                                }else if(intercept4.intersect(elem) && tank.intersect(Floor)==false){
                                    
                                    let dist1 = Math.sqrt(Math.pow(weak.x - enemyTarget[Num].x, 2) + Math.pow(weak.y - enemyTarget[Num].y, 2));
                                    let dist2 = Math.sqrt(Math.pow(weak.x - elem.x, 2) + Math.pow(weak.y - elem.y, 2));
                                    if(dist1 > dist2){
                                        tank.intersect(PlayerBulAim).forEach(function(){
                                            if(this.time % 5 == 0){
                                                if(weak.x-2.75 > enemyTarget[Num].x){
                                                    if(weak.y-2.75 > enemyTarget[Num].y){
                                                        while(value == 0 || value == 2 || value == 4) value = Math.floor(Math.random() * 8);
                                                    }
                                                    else{
                                                        while(value == 0 || value == 3 || value == 6) value = Math.floor(Math.random() * 8);
                                                    }
                                                }else{
                                                    if(weak.y-2.75 > enemyTarget[Num].y){
                                                        while(value == 1 || value == 2 || value == 5) value = Math.floor(Math.random() * 8);
                                                    }
                                                    else{
                                                        while(value == 1 || value == 3 || value == 7) value = Math.floor(Math.random() * 8);
                                                    }
                                                }
                                            }
                                        })
                                    }
                                }
                                
                            })
                        }
                        if(grade == 13){
                            bulOb[Num].forEach(elem=>{
                                if(tank.within(elem,300)==true){
                                    tank.intersect(EnemyAim).forEach(function(){
                                        enemyTarget[Num] = elem;
                                        alignment.moveTo(enemyTarget[Num].x,enemyTarget[Num].y)
                                        new EnemyAim(alignment,32,Num,scene);
                                    })
                                }
                            })
                            bulOb[0].forEach(elem=>{
                                if(tank.within(elem,240)==true && (intercept5.intersect(elem)==true || intercept6.intersect(elem)==true || intercept3.intersect(elem)==true)){
                                    
                                    let dist1 = Math.sqrt(Math.pow(weak.x - enemyTarget[Num].x, 2) + Math.pow(weak.y - enemyTarget[Num].y, 2));
                                    let dist2 = Math.sqrt(Math.pow(weak.x - elem.x, 2) + Math.pow(weak.y - elem.y, 2));
                                    if(dist1 > dist2){
                                        
                                        enemyTarget[Num] = elem;
                                        alignment.moveTo(enemyTarget[Num].x,enemyTarget[Num].y)
                                        new EnemyAim(alignment,32,Num,scene);
                                        
                                        if(this.time % 3 == 0 && grade == 13){
                                            if(weak.x-2.75 > enemyTarget[Num].x){
                                                if(weak.y-2.75 > enemyTarget[Num].y){
                                                    while(value == 0 || value == 2 || value == 4) value = Math.floor(Math.random() * 8);
                                                }
                                                else{
                                                    while(value == 0 || value == 3 || value == 6) value = Math.floor(Math.random() * 8);
                                                }
                                            }else{
                                                if(weak.y-2.75 > enemyTarget[Num].y){
                                                    while(value == 1 || value == 2 || value == 5) value = Math.floor(Math.random() * 8);
                                                }
                                                else{
                                                    while(value == 1 || value == 3 || value == 7) value = Math.floor(Math.random() * 8);
                                                }
                                            }
                                        }
                                    }
                                    
                                }
                            })
                            
                            if(tank.within(enemyTarget[Num],300)==true){
                                dflg = true;
                                alignment.moveTo(enemyTarget[Num].x,enemyTarget[Num].y)
                                new EnemyAim(alignment,32,Num,scene);
                                if(this.time % 3 == 0 && grade == 13){
                                    if(weak.x-2.75 > enemyTarget[Num].x){
                                        if(weak.y-2.75 > enemyTarget[Num].y){
                                            while(value == 0 || value == 2 || value == 4) value = Math.floor(Math.random() * 8);
                                        }
                                        else{
                                            while(value == 0 || value == 3 || value == 6) value = Math.floor(Math.random() * 8);
                                        }
                                    }else{
                                        if(weak.y-2.75 > enemyTarget[Num].y){
                                            while(value == 1 || value == 2 || value == 5) value = Math.floor(Math.random() * 8);
                                        }
                                        else{
                                            while(value == 1 || value == 3 || value == 7) value = Math.floor(Math.random() * 8);
                                        }
                                    }
                                }
                            }
                        }
                        alignment.intersect(EnemyAim).forEach(function(){
                            fireFlgs[Num] = true;
                        })
                        if(fireFlgs[Num]==true && intercept7.intersect(Floor)==false){
                            if(grade >= 10){
                                if(dflg == true && grade != 13){
                                    if(bullets[Num] < emax+defenseMax && deadFlgs[Num] == false && game.time % 10 == 0){
                                        game.assets['./sound/putting_a_book2.mp3'].clone().play();
                                        colOb[Num][PlBulCount] = new BulletCol(alignment,cannon,shotSpeed,10,Num,scene);
                                        bulOb[Num][PlBulCount] = new Bullet(colOb[Num][PlBulCount],cannon,0,Num,emax+defenseMax,shotSpeed,scene)
                                        scene.insertBefore(colOb[Num][PlBulCount],filterMap);
                                        scene.insertBefore(bulOb[Num][PlBulCount],filterMap);
                                        new OpenFire(cannon,alignment,scene,filterMap)
                                        PlBulCount = (PlBulCount+1) % emax;
                                        bullets[Num]++;
                                        if(grade == 11) opaFlg = true;
                                    } 
                                }else if(dflg == true && grade == 13){
                                    if(bullets[Num] < emax+defenseMax && deadFlgs[Num] == false && (this.time % 6 == 0 || game.time % 6 == 0)){
                                        game.assets['./sound/putting_a_book2.mp3'].clone().play();
                                        colOb[Num][PlBulCount] = new BulletCol(alignment,cannon,15.5,10,Num,scene);
                                        bulOb[Num][PlBulCount] = new Bullet(colOb[Num][PlBulCount],cannon,0,Num,emax+defenseMax,15,scene)
                                        scene.insertBefore(colOb[Num][PlBulCount],filterMap);
                                        scene.insertBefore(bulOb[Num][PlBulCount],filterMap);
                                        new OpenFire(cannon,alignment,scene,filterMap)
                                        PlBulCount = (PlBulCount+1) % emax;
                                        bullets[Num]++;
                                        opaFlg = true;
                                    } 
                                }else if(grade == 11){
                                    if(Math.floor(Math.random() * emax*2)>bullets[Num] && game.time % fireLate == 0){
                                        if(bullets[Num] < emax && deadFlgs[Num] == false){
                                            game.assets['./sound/putting_a_book2.mp3'].clone().play();
                                            colOb[Num][PlBulCount] = new BulletCol(alignment,cannon,shotSpeed,grade,Num,scene);
                                            bulOb[Num][PlBulCount] = new Bullet(colOb[Num][PlBulCount],cannon,Math.floor(Math.random() * (ref)),Num,emax,shotSpeed,scene)
                                            scene.insertBefore(colOb[Num][PlBulCount],filterMap);
                                            scene.insertBefore(bulOb[Num][PlBulCount],filterMap);
                                            new OpenFire(cannon,alignment,scene,filterMap)
                                            PlBulCount = (PlBulCount+1) % emax;
                                            bullets[Num]++;
                                            opaFlg = true;
                                        }
                                    } 
                                }else if(grade == 13 && dflg == false){
                                    if(Math.floor(Math.random() * emax*2)>bullets[Num] && game.time % fireLate == 0){
                                        if(bullets[Num] < emax && deadFlgs[Num] == false){
                                            game.assets['./sound/putting_a_book2.mp3'].clone().play();
                                            colOb[Num][PlBulCount] = new BulletCol(alignment,cannon,shotSpeed,grade,Num,scene);
                                            bulOb[Num][PlBulCount] = new Bullet(colOb[Num][PlBulCount],cannon,Math.floor(Math.random() * (ref)),Num,emax,shotSpeed,scene)
                                            scene.insertBefore(colOb[Num][PlBulCount],filterMap);
                                            scene.insertBefore(bulOb[Num][PlBulCount],filterMap);
                                            new OpenFire(cannon,alignment,scene,filterMap)
                                            PlBulCount = (PlBulCount+1) % emax;
                                            bullets[Num]++;
                                            opaFlg = true;
                                        }
                                    } 
                                }else{
                                    if(Math.floor(Math.random() * emax*2)>bullets[Num] && game.time % fireLate == 0){
                                        if(bullets[Num] < emax && deadFlgs[Num] == false){
                                            game.assets['./sound/putting_a_book2.mp3'].clone().play();
                                            colOb[Num][PlBulCount] = new BulletCol(alignment,cannon,shotSpeed,grade-1,Num,scene);
                                            bulOb[Num][PlBulCount] = new Bullet(colOb[Num][PlBulCount],cannon,Math.floor(Math.random() * (ref)),Num,emax,shotSpeed,scene)
                                            scene.insertBefore(colOb[Num][PlBulCount],filterMap);
                                            scene.insertBefore(bulOb[Num][PlBulCount],filterMap);
                                            new OpenFire(cannon,alignment,scene,filterMap)
                                            PlBulCount = (PlBulCount+1) % emax;
                                            bullets[Num]++;
                                            if(grade == 11) opaFlg = true;
                                        } 
                                    }
                                }
                            }
                            else{
                                if(Math.floor(Math.random() * emax*2)>bullets[Num] && game.time % fireLate == 0){
                                    if(bullets[Num] < emax && deadFlgs[Num] == false){
                                        game.assets['./sound/putting_a_book2.mp3'].clone().play();
                                        colOb[Num][PlBulCount] = new BulletCol(alignment,cannon,shotSpeed,grade-1,Num,scene);
                                        bulOb[Num][PlBulCount] = new Bullet(colOb[Num][PlBulCount],cannon,ref,Num,emax,shotSpeed,scene)
                                        scene.insertBefore(colOb[Num][PlBulCount],filterMap);
                                        scene.insertBefore(bulOb[Num][PlBulCount],filterMap);
                                        new OpenFire(cannon,alignment,scene,filterMap)
                                        PlBulCount = (PlBulCount+1) % emax;
                                        bullets[Num]++;
                                        if(grade == 11) opaFlg = true;
                                    } 
                                }
                            }
                            
                        }

                        /* 戦車本体の角度 */
                        if(moveSpeed > 0){
                            this.rotation = rot;
                            tank.rotation = rot;
                            weak.rotation = rot;
                        }
                    }
                }
            }
            scene.insertBefore(this,filterMap)
        }
    })
    /* プレイヤー位置表示クラス */
    var PlayerLabel = Class.create(Label,{
        initialize: function(player,scene){
            Label.call(this,1,1)
            this.x = player.x-((player.width*2))
            this.y = player.y-pixelSize
            this.time = 0
            this.text = userName+"<br><br>↓"
            this.textAlign = 'center';
            this.font = '32px sans-serif';
            this.color = 'aliceblue'
            var flg = false;
            this.onenterframe = function(){
                if(scene.time >= 170){
                    this.time++
                    if(this.time % 2 == 0){
                        this.opacity -= 0.1
                        if(this.opacity <= 0){
                            scene.removeChild(this)
                        }
                    }
                }else{
                    if(scene.time % 20){
                        if(flg == true){
                            flg = false;
                        }
                        else if(flg == false){
                            flg = true
                        }
                    }else{
                        if(flg == true){
                            this.scaleX+=0.1
                            this.scaleY+=0.1
                        }else{
                            this.scaleX-=0.1
                            this.scaleY-=0.1
                        }
                    }
                }
            }
            scene.addChild(this)
        }
    })
    /* 味方位置表示クラス */
    var AllyLabel = Class.create(Label,{
        initialize: function(player,scene){
            Label.call(this,1,1)
            this.x = player.x
            this.y = player.y+16
            this.width = 30*2
            this.time = 0
            this.text = "味方"
            this.textAlign = 'center';
            this.font = 'bold 24px sans-serif';
            this.color = 'lightyellow'
            this.onenterframe = function(){
                this.moveTo(player.x,player.y+16)
            }
            scene.addChild(this)
        }
    })
    /* スコア表示クラス */
    var DispScore = Class.create(Sprite,{
        initialize: function(scene){
            Sprite.call(this,320,240)
            this.x = 480
            this.y = 480
            this.time = 0
            this.opacity = 0
            this.backgroundColor = "#000c";
            var title = new Label('トータル撃破数')
                title.moveTo(this.x+10,this.y+60)
                title.textAlign = 'center'
                title.color = 'white'
                title.font = '32px sans-serif'
                title.opacity = this.opacity
            var value = new Label(score+destruction)
                value.moveTo(this.x+20,this.y+120)
                value.textAlign = 'center'
                value.color = 'lightblue'
                value.font = 'bold 48px sans-serif'
                value.opacity = this.opacity
            
            var flg = false;
            this.onenterframe = function(){
                this.time++
                title.opacity = this.opacity
                value.opacity = this.opacity
                if(this.time > 30 && this.time < 45 && this.time % 3 == 0){
                    this.opacity += 0.2;
                }
                if(this.time > 180 && this.time % 3==0){
                    this.opacity -= 0.2;
                }
                if(this.opacity <= 0 && this.time > 45){
                    this.opacity = 0;
                    scene.removeChild(this)
                    scene.removeChild(title)
                    scene.removeChild(value)
                }
            }
            scene.addChild(this)
            scene.addChild(title)
            scene.addChild(value)
        }
    })
    /* ラベル表示クラス */
    var DispText = Class.create(Label,{
        initialize: function(x,y,width,height,text,font,color,align,scene){
            Label.call(this)
            this.width = width;
            this.height = height;
            this.moveTo(x,y);
            this.text = text;
            this.font = font;
            this.color = color;
            this.textAlign = align;

            scene.addChild(this)
        }
    })
    var DispLine = Class.create(Sprite,{
        initialize: function(x,y,width,height,color,scene){
            Sprite.call(this,width,height)
            this.moveTo(x,y)
            this.backgroundColor = color;
            scene.addChild(this)
        }
    })
    var DispHead = function(x,y,width,height,color,scene){
        new DispLine(x,y,width,height,color,scene)
        new DispLine(x,y+30,width,5,"yellow",scene)
        new DispLine(x,y+height-30,width,5,"yellow",scene)
    }
    var DispBody = function(x,y,width,height,scene){
        new DispLine(x,y,width,height,"#eea",scene)
        //new DispLine(x,y+height,width,120,"#a00d",scene)
    }
    /* 警告演出クラス */
    var Warning = Class.create(Sprite,{
        initialize: function(scene){
            Sprite.call(this,scene.width,scene.height)
            this.backgroundColor = "#dd0008"
            this.opacity = 0.0;
            this.time = 0;
            this.moveTo(0,0);
            let flg = false;
            let cnt = 0;
            this.onenterframe = function(){
                this.time++;
                
                if(cnt % 2 == 0 && flg == false){
                    if(this.time % 2 == 0){
                        this.opacity += 0.05
                    }
                    if(this.opacity >= 0.60){
                        cnt++ 
                        flg = true;
                    }
                }else{
                    if(this.time % 2 == 0){
                        this.opacity -= 0.05
                    }
                    if(this.opacity <= 0){
                        this.opacity = 0
                        cnt++ 
                        flg = false
                    } 
                }
                
                if(cnt > 5) scene.removeChild(this)
            }
            scene.addChild(this)
        }
    })
    /* フェードインクラス */
    var FadeIn = Class.create(Sprite,{
        initialize: function(scene){
            Sprite.call(this,scene.width,scene.height)
            this.backgroundColor = "#222"
            this.opacity = 1.0;
            this.time = 0;
            this.moveTo(0,0);
            this.onenterframe = function(){
                this.time++;
                if(this.time > 15){
                    this.opacity -= 0.25
                }
                if(this.opacity <= 0){
                    scene.removeChild(this)
                }
            }
            scene.addChild(this)
        }
    })
    /* フェードアウトクラス */
    var FadeOut = Class.create(Sprite,{
        initialize: function(scene){
            Sprite.call(this,scene.width,scene.height)
            this.backgroundColor = "#222"
            this.opacity = 0.0;
            this.time = 0;
            this.moveTo(0,0);
            this.onenterframe = function(){
                this.time++;
                if(this.time > 15){
                    this.opacity += 0.25
                    if(this.time == 30){
                        scene.removeChild(this)
                    }
                }
            }
            scene.addChild(this)
        }
    })
    function getJson() {
        //var xmlhttp = createXMLHttpRequest(); //旧バージョンのIEなどに対応する場合
        var xmlhttp = new XMLHttpRequest();
   
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if(xmlhttp.status == 200) j_data = JSON.parse(xmlhttp.responseText);
            }
        }
        xmlhttp.open("GET", "UserData.json");
        xmlhttp.send();
    }
    
    function setJson() {
        if(postData.name != "Player" && allyFlg == false){
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "./setData.php", true);
        
            // ヘッダーを設定
            // application/x-www-form-urlencoded
            // キーと値は、その間に '=' がある形でキーと値の組になり '&' で区切られてエンコードされます。
            // キーや値の英数字以外の文字は、パーセントエンコーディングされます。
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        
            xhr.onreadystatechange = function() {
                if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                // 送信に成功した時の処理
                console.log(this.statusText);
                }
            }
        
            var sendParam = "";
            
            for (var name in postData) { 
                if (sendParam === "") {
                    sendParam = name + "=" + postData[name];
                } else {
                    sendParam += "&" + name + "=" + postData[name];
                }
            }
            xhr.send(sendParam); 
        }
    }
    new getJson()

    game.onload = function() { // ゲームの準備が整ったらメインの処理を実行します
        var world = new PhysicsWorld(0, 0);
        /* タイトルシーン */
        var createTitleScene = function(){

            var scene = new Scene();
            scene.time = 0;
            var flg = false;

            scene.backgroundColor = '#cacaca';                      // シーンの背景色を設定
            // スタート画像設定
            new DispHead(100,200,360*3,240*2.25,"#a00d",scene)
            
            // タイトルラベル設定
            new DispText(100,280,260*size,96,'Battle Tank Game','96px sans-serif','#ebe799','center',scene)
            
            // サブタイトルラベル設定
            var toPlay = new DispText(game.width/2-180,440,320,40,'➡　S t a r t !','40px sans-serif','#ebe799','left',scene)
            
            var toRank = new DispText(game.width/2-180,520,600,40,'➡　ランキング画面','40px sans-serif','#ebe799','left',scene)

            var level = new DispText(game.width/2-180,600,40*9,40,'➡　難易度選択：','40px sans-serif','#ebe799','left',scene)

            var nomal = new DispText(level.x+level.width-16,600,40,40,'普','40px sans-serif','#ebe799','left',scene)
            var hard = new DispText(level.x+level.width+nomal.width+16,600,40,40,'難','40px sans-serif','#888','left',scene)

            let lvFlg = false;
            if(addBullet == 0){
                nomal.color = '#ebe799';
                hard.color = '#888';
                lvFlg = false;
            }else{
                nomal.color = '#888';
                hard.color = 'red';
                lvFlg = true;
            }

            nomal.addEventListener(Event.TOUCH_START, function() {
                if(lvFlg == true){
                    nomal.color = '#ebe799';
                    hard.color = '#888';
                    lvFlg = false;
                    addBullet = 0;
                    addSpeed = 0;
                    sl = false;
                }
            })
            hard.addEventListener(Event.TOUCH_START, function() {
                if(lvFlg == false){
                    nomal.color = '#888';
                    hard.color = 'red';
                    lvFlg = true;
                    addBullet = 1;
                    addSpeed = 0.5;
                    sl = true;
                }
            })
            level.addEventListener(Event.TOUCH_START, function() {
                if(lvFlg == true){
                    nomal.color = '#ebe799';
                    hard.color = '#888';
                    lvFlg = false;
                    addBullet = 0;
                    addSpeed = 0;
                    sl = false;
                }else{
                    nomal.color = '#888';
                    hard.color = 'red';
                    lvFlg = true;
                    addBullet = 1;
                    addSpeed = 0.5;
                    sl = true;
                }
            })

            var orflg = 0;
            
            // 移動先をプレイ画面に設定
            toPlay.addEventListener(Event.TOUCH_START, function() {
                let returnFlg = true;
                while(returnFlg){
                    userName = prompt("\r\nユーザ名を入力してください\r\n\r\n", "ここにユーザ名を入力");
                    if(userName == "" || userName == null || userName == "ここにユーザ名を入力"){
                        if(confirm("\r\nユーザ名を設定していません。\r\nよろしいですか？")) {
                            returnFlg = false;
                            userName = "Player"
                        }
                    }else{
                        alert("ユーザ名を「" + userName + "」に設定しました。");
                        returnFlg = false;
                    }
                }

                if(confirm("味方を追加しますか？\r( OK：追加する　キャンセル：追加しない )\r\n\r\n")) {
                    allyFlg = true;
                } else {
                    allyFlg = false;
                }
                flg = true
                orflg = 1;
                new FadeOut(scene)
            });
            
            // 移動先をランキング画面に設定
            toRank.addEventListener(Event.TOUCH_START, function() {
                flg = true
                orflg = 2;
                new FadeOut(scene)
            });
            //画面遷移の処理
            scene.onenterframe = function(){
                
                if(flg == true){
                    scene.time++
                    if(scene.time == 30){
                        if(orflg == 1){
                            game.replaceScene(createStartScene());    // 現在表示しているシーンをゲームシーンに置き換える
                        }else if(orflg == 2){
                            game.replaceScene(createRankingScene());    // 現在表示しているシーンをゲームシーンに置き換える
                        }
                        
                    }
                }
                
            }
            new FadeIn(scene)
            // タイトルシーンを返します。
            return scene;
        }
        var createRankingScene = function(){
            var scene = new Scene();
            var flg = false;
            scene.time = 0;
            scene.backgroundColor = '#cacaca';                      // シーンの背景色を設定
    
            new DispHead(100,80,360*3,240*3,"#a00d",scene)
            new DispBody(100,280,360*3,240*1.75,scene)
            
            tops = ["_____","_____","_____","_____","_____","_____","_____","_____","_____","_____"]
            rankings = [0,0,0,0,0,0,0,0,0,0]
            times = [0,0,0,0,0,0,0,0,0,0]
            
            let jlen = j_data.rank.length;
            for(let i = 0; i < jlen; i++){
                rankings.push(j_data.rank[i].score);
                tops.push(j_data.rank[i].name);
                selectLevel.push(j_data.rank[i].level);
            }
            for(let j = 0; j < (rankings.length)+jlen; j++){
                for(let i = j+1; i < (rankings.length)+jlen; i++){
                    if(rankings[j]<rankings[i]){
                        let w = rankings[j]
                        rankings[j] = rankings[i]
                        rankings[i] = w;
                        let s = tops[j]
                        tops[j]=tops[i]
                        tops[i]=s
                        let t = selectLevel[j]
                        selectLevel[j] = selectLevel[i]
                        selectLevel[i] = t
                    }
                }
            }
            new DispText(120,140,260*4,64,'ハイスコア一覧','64px sans-serif','#ebe799','center',scene)
            new DispText(320*0.68,300,260*2,32,'順位：名前：スコア','32px sans-serif','#000000','left',scene)
            
            for(let i = 0; i < 5; i++){
                if(selectLevel[i] == "true"){
                    new DispText(320*0.75,300+(64*(i+1)),260*2,32,(i+1)+'  ： '+tops[i]+' ： '+rankings[i],'32px sans-serif','#ff0000','left',scene)
                }else{
                    new DispText(320*0.75,300+(64*(i+1)),260*2,32,(i+1)+'  ： '+tops[i]+' ： '+rankings[i],'32px sans-serif','#000000','left',scene)
                }
                
                if(rankings[i] >= 137){
                    new DispText(320*0.55,300+(64*(i+1)),48,32,"★",'32px sans-serif','goldenrod','center',scene)
                    
                }else if(rankings[i] >= 53){
                    new DispText(320*0.55,300+(64*(i+1)),48,32,"★",'32px sans-serif','aliceblue','center',scene)
                }
            }
            for(let i = 5; i < 10; i++){
                if(selectLevel[i]=="true"){
                    new DispText(320*2.25,300+(64*(i-4)),260*2,32,(i+1)+'  ： '+tops[i]+' ： '+rankings[i],'32px sans-serif','red','left',scene)
                }else{
                    new DispText(320*2.25,300+(64*(i-4)),260*2,32,(i+1)+'  ： '+tops[i]+' ： '+rankings[i],'32px sans-serif','#000000','left',scene)
                }
                
                if(rankings[i] >= 137){
                    new DispText(320*2.05,300+(64*(i-4)),48,32,"★",'32px sans-serif','goldenrod','center',scene)
                    
                }else if(rankings[i] >= 53){
                    new DispText(320*2.05,300+(64*(i-4)),48,32,"★",'32px sans-serif','aliceblue','center',scene)
                }
            }
            var toTitle = new DispText(480,720,320,32,'➡タイトル画面へ','32px sans-serif','#ebe799','center',scene)
            new DispText(0,240,320*size,24,'※Github版ではランキングが機能していません。','24px sans-serif','#ebe799','center',scene)
            
            // スタート画像にタッチイベントを設定
            toTitle.addEventListener(Event.TOUCH_START, function(e) {
                flg = true
                new FadeOut(scene)
            });
            scene.onenterframe = function(){
                if(flg == true){
                    scene.time++
                    if(scene.time == 30){
                        game.replaceScene(createTitleScene());    // 現在表示しているシーンをゲームシーンに置き換える
                    }
                } 
            }
            new FadeIn(scene)
            return scene;
        }
        /* スタートシーン */
        var createStartScene = function() {
            test = []
            bullets = [];       //各戦車の弾数の制御用の配列
            boms = [];
            bulOb = [[]];       //戦車の弾情報を保持する配列
            colOb = [[]];
            bomOb = [[]];
            enemyTarget = [];   //敵戦車が狙うターゲット
            entVal = 0;         //戦車の連番設定用変数
            tankEntity = [];    //敵味方の戦車情報を保持する配列
            allyEntity = [];
            deadFlgs = [];      //戦車の生存確認 
            allyDeadFlg = false;   
            fireFlgs = [];      //敵の砲撃制御
            floors = [];
            avoids = [];
            walls = [];
            holes = [];
            tankColorCounts = [0,0,0,0,0,0,0,0,0,0,0,0];
            destruction = 0;
            victory = false;
            defeat = false;
    
            var nextData = LoadStage();    //ステージ情報引き出し
    
            let count = 0;
            for(var i = 4; i < Object.keys(nextData).length-1; i++){
                count++;
            }
    
            script = document.createElement("script");
            script.src = stagePath[stageNum];
            head[0].appendChild(script);
            stageData = LoadStage();    //ステージ情報引き出し
    
            var scene = new Scene();                              // 新しいシーンを作る
            scene.time = 0;
            scene.backgroundColor = '#ebf899';                      // シーンの背景色を設定
            // スタート画像設定
            new DispHead(100,240,360*3,240*2,"#a00d",scene)
            
            // タイトルラベル設定
            new DispText(100,320,260*size,96,'Stage : '+stageNum,'96px sans-serif','#ebe799','center',scene)
            
            // サブタイトルラベル設定
            new DispText(0,480,320*size,32,'敵戦車数：'+count,'32px sans-serif','#ebe799','center',scene)
    
            new DispText(0,550,320*size,32,'残機数：'+zanki,'32px sans-serif','aliceblue','center',scene)
            
            new FadeIn(scene)
    
            scene.onenterframe = function(){
                scene.time++
                if((stageNum % 20 == 0) && scene.time == 15) new Warning(scene)
                if(scene.time == 150){
                    new FadeOut(scene)
                }
                if(scene.time == 180){
                    game.replaceScene(createGameScene());    // 現在表示しているシーンをゲームシーンに置き換える
                }
            }
    
            return scene;
        };
        var createBonusScene = function() {
    
            var scene = new Scene();                              // 新しいシーンを作る
            scene.time = 0;
            scene.backgroundColor = '#ebf899';                      // シーンの背景色を設定
    
            zanki++;
    
            // スタート画像設定
            new DispHead(100,240,360*3,240*2,"#a00d",scene)
            
            // タイトルラベル設定
            new DispText(100,360,260*size,72,'クリアボーナス！','72px sans-serif','#ebe799','center',scene)
            
            var zankiLabel = new Label();
                zankiLabel.width = 64;
                zankiLabel.height = 64;
                zankiLabel.x = 320*2+64;
                zankiLabel.y = 495;
                zankiLabel.text = zanki-1;
                zankiLabel.font = '64px "Arial"';
                zankiLabel.color = 'aliceblue';
                zankiLabel.textAlign = 'center';
                scene.addChild(zankiLabel)
    
            new DispText(0,500,310*size,48,'残機数：','48px sans-serif','aliceblue','center',scene)
            
            new FadeIn(scene)
    
            scene.onenterframe = function(){
                scene.time++
                if(scene.time >= 85 && scene.time < 90){
                    zankiLabel.opacity -= 0.2;
                    if(zankiLabel.opacity <= 0){
                        scene.removeChild(zankiLabel)
                    }
                }
                if(scene.time == 90){
                    zankiLabel = new Label();
                    zankiLabel.width = 64;
                    zankiLabel.height = 72;
                    zankiLabel.x = 320*2+64;
                    zankiLabel.y = 490;
                    zankiLabel.opacity = 1.0;
                    zankiLabel.text = zanki;
                    zankiLabel.font = 'bold 72px "Arial"';
                    zankiLabel.color = '#ebf899';
                    zankiLabel.textAlign = 'center';
                    scene.addChild(zankiLabel)
                }
                if(scene.time == 150){
                    new FadeOut(scene)
                }
                if(scene.time == 180){
                    game.replaceScene(createStartScene());    // 現在表示しているシーンをゲームシーンに置き換える
                }
            }
            return scene;
        };
        /* ゲームシーン */
        var createGameScene = function() {
    
            game.time = 0;
            worldFlg = false;
    
            stageData = LoadStage();    //ステージ情報引き出し
    
            var scene = new Scene();                            // 新しいシーンを作る
                scene.time = 0;
    
            let backgroundMap = new Map(pixelSize, pixelSize);
                backgroundMap.image = game.assets['./image/MapImage/map0.png'];
                backgroundMap.loadData(stageData[0],stageData[1])
                backgroundMap.collisionData = stageData[2];
                scene.addChild(backgroundMap);
    
            walls[0] = new Wall(18,1,1,1,scene)
            walls[1] = new Wall(18,1,1,14,scene)
            walls[2] = new Wall(1,13,0,1,scene)
            walls[3] = new Wall(1,13,19,1,scene)
            walls[4] = new Wall(24,1,0,15,scene)
    
            var i = 0;
            var j = 0;
    
            var grid = [];
    
            /* 壁の当たり判定設置 */
            backgroundMap.collisionData.forEach(colI => {
                grid[i] = []
                colI.forEach(colJ => {
                    if(colJ == 0){
                        grid[i][j] = 'Empty';
                    }else{
                        test.push(new WallIntercept(j,i,scene))
                        if(colJ == 2){
                            avoids.push(new Avoid(j,i,scene));
                            grid[i][j] = 'Obstacle';
                        }else if(colJ == 3){
                            holes.push(new Hole(j,i,scene))
                                grid[i][j] = 'Obstacle';
                        }else{
                            
                            if(colJ == 1){
                                floors.push(new Floor(j,i,scene));
                                grid[i][j] = 'Obstacle';
                            }else{
                                grid[i][j] = 'Obstacle';
                            } 
                        }
                        
                    }
                    j++;
                });
                i++;
                j = 0;
            });
            
            /* カーソルの設置＆位置取得処理 */
            cur = new Cursor(scene);
            document.addEventListener('mousemove', function(e) {
                cur.x = e.x-8;
                cur.y = e.y-8;
            })
    
            let filterMap = new Map(pixelSize,pixelSize);
            filterMap.image = game.assets['./image/MapImage/map0.png'];
            var filImg = stageData[1];
            for(let i = 0; i < stageData[0].length; i++){
                for(let j = 0; j < stageData[0][i].length; j++){
                    if(stageData[0][i][j] == 7){
                        filImg[i][j] = 7
                    }else if(stageData[0][i][j] == 23){
                        filImg[i][j] = 39
                    }
                }
            }
            filterMap.loadData(fmap,filImg);
            filterMap.collisionData = fcol;
            scene.insertBefore(filterMap,null);
            /* 戦車の追加処理 */
            bulOb.push([])
            colOb.push([])
            bomOb.push([])
            if(cheat == true){
                tankEntity.push(new Player(stageData[3][0],stageData[3][1],'./image/ObjectImage/tank2.png','./image/ObjectImage/cannon.png',5,1,15,4,scene,filterMap))
            }else{
                tankEntity.push(new Player(stageData[3][0],stageData[3][1],'./image/ObjectImage/tank2.png','./image/ObjectImage/cannon.png',5,1,9,2,scene,filterMap))
            }
            
            
            var abn = Math.floor(Math.random() * 10)
    
            for(var i = 4; i < Object.keys(stageData).length-1; i++){
                bulOb.push([])
                colOb.push([])
                bomOb.push([])
                if((abn == 0 && stageNum > 5 && i == 4 && stageNum % 5 != 0) || stageData[i][9] == 12){
                    tankEntity.push(new Elite(stageData[i][0],stageData[i][1],'./image/ObjectImage/abnormal.png','./image/ObjectImage/abnormalcannon.png',tankEntity[0],Math.floor(Math.random() * 4)+1+addBullet,Math.floor(Math.random() * 4)+1,Math.floor(Math.random() * 9)+6,Math.floor(Math.random() * 3),Math.floor(Math.random() * 35)+5,Math.floor(Math.random() * 4)+3,10,scene,filterMap))
                    stageData[i][10] = 10;
                }else if(stageData[i][9] >= 8){
                    tankEntity.push(new Boss(stageData[i][0],stageData[i][1],stageData[i][2],stageData[i][3],tankEntity[0],stageData[i][4]+addBullet,stageData[i][5],stageData[i][6],stageData[i][7],stageData[i][8],stageData[i][9],stageData[i][10],scene,filterMap))
                }else if(stageData[i][9]>2){
                    tankEntity.push(new Elite(stageData[i][0],stageData[i][1],stageData[i][2],stageData[i][3],tankEntity[0],stageData[i][4]+addBullet,stageData[i][5],stageData[i][6],stageData[i][7],stageData[i][8],stageData[i][9],stageData[i][10],scene,filterMap));
                }else{
                    tankEntity.push(new newAI(stageData[i][0],stageData[i][1],stageData[i][2],stageData[i][3],tankEntity[0],stageData[i][4]+addBullet,stageData[i][5],stageData[i][6],stageData[i][7],stageData[i][8],stageData[i][9],stageData[i][10],scene,backgroundMap,grid,filterMap))
                }
                tankColorCounts[stageData[i][10]]++;
            }
            //alert(tankColorCounts)
            if(allyFlg == true){
                allyEntity.push(new Ally(stageData[Object.keys(stageData).length-1][0],stageData[Object.keys(stageData).length-1][1],'./image/ObjectImage/brown.png','./image/ObjectImage/browncannon.png',tankEntity[1],3,1,8,1.0,15,11,scene,backgroundMap,grid,filterMap))
                new AllyLabel(allyEntity[0],scene)
            }
            new PlayerLabel(tankEntity[0],scene)
            new FadeIn(scene)
            var dcnt = 0;
    
            var startLabel = new Label();
                startLabel.width = 288;
                startLabel.height = 72;
                startLabel.x = 480;
                startLabel.y = 300;
                startLabel.text = 'スタート';
                startLabel.font = '72px "Arial"';
                startLabel.color = 'yellow';
                startLabel.textAlign = 'left';
    
            var BGM1 = game.assets['./sound/start.wav'];
                BGM1.play();
                BGM1.volume = 0.2
            var pauseButtton = new Label();
                pauseButtton.width = game.width;
                pauseButtton.height = 96;
                pauseButtton.x = 0;
                pauseButtton.y = game.height/2-96;
                pauseButtton.text = '';
                pauseButtton.font = 'bold 96px "sans-serif"';
                pauseButtton.color = 'aliceblue';
                pauseButtton.textAlign = 'center';
           
            
            var blackImg = new DispLine(0,0,game.width,game.height,"#00000000",scene)
            var retire = new DispText(0,0,1,1,'','48px sans-serif','red','center',scene)
            retire.addEventListener(Event.TOUCH_START, function() {
                if(confirm("\r\n本当にリタイアしますか？")) {
                    blackImg.backgroundColor = "#00000000"
                    worldFlg = true
                    pauseButtton.text ='';
                    zanki = 1;
                    deadFlgs[0] = true;
                    
                }
            });
            scene.onenterframe = function() {
                let CngBgmNum = BNum;
                //[0,0,0,0,0,0,0,0,0,0,0,0];0～11
                if(tankColorCounts[11]>0)       BNum = 11
                else if(tankColorCounts[7]>0)   BNum = 10
                else if(tankColorCounts[8]>0)   BNum = 9
                else if(tankColorCounts[9]>0)   BNum = 8
                else if(tankColorCounts[10]>0)  BNum = 7
                else if(tankColorCounts[6]>0)   BNum = 6
                else if(tankColorCounts[5]>0)   BNum = 5
                else if(tankColorCounts[4]>0)   BNum = 4
                else if(tankColorCounts[3]>0)   BNum = 3
                else if(tankColorCounts[2]>0)   BNum = 2
                else if(tankColorCounts[1]>0)   BNum = 1
                else                            BNum = 0
                
                /*if(game.input.Pause){
                    if (worldFlg == false){
                        scene.backgroundColor = "#00000000"
                        worldFlg = true
                        pauseButtton.text ='ポーズ';
                    }else{
                        scene.backgroundColor = "#00000044"
                        pauseButtton.text ='再開'; 
                        worldFlg = false
                        pauseFlg = true;
                    }
                }*/
                document.onkeyup = function(e){
                    if(e.code == 'Escape' && scene.time > 250 && defeat == false && victory == false && complete == false){
                        if (worldFlg == false){
                            blackImg.backgroundColor = "#00000000"
                            worldFlg = true
                            pauseButtton.text ='';
                            BGM1.volume = 1.0
                            retire.x = 0
                            retire.y = 0
                            retire.width = 1;
                            retire.height = 1;
                            retire.text = ""
                        }else{
                            blackImg.backgroundColor = "#00000044"
                            pauseButtton.text ='一時停止'; 
                            worldFlg = false
                            BGM1.volume = 0.5
                            retire.x = game.width/2-96
                            retire.y = game.height/2+96
                            retire.width = 48*4;
                            retire.height = 48;
                            retire.text = "リタイア"
                        }
                    }
                }
                
                
                if(BGM1.currentTime == BGM1.duration && victory == false && defeat == false && complete == false){
    
                    //BGM1 = game.assets['./sound/FIRST.mp3'];
                    BGM1 = game.assets[BGMs[BNum]];
                    BGM1.currentTime = 0;
                    BGM1.play()
                }
                
                scene.time++;
       
                if(scene.time == 210 && complete == false && victory == false){
                    worldFlg = true;
                    scene.addChild(startLabel) 
                    scene.addChild(pauseButtton)  
                }
                
                if(worldFlg == true){
                    /*if(CngBgmNum != BNum && victory == false && complete == false && defeat == false){
                        let curTime = BGM1.currentTime;
                        BGM1.stop()
                        BGM1 = game.assets[BGMs[BNum]];
                        BGM1.play()
                        BGM1.currentTime = curTime;
                        CngBgmNum = BNum
                        alert(BNum)
                    }*/
                    if(game.input.up)cur.y -= 8;
                    else if(game.input.down)cur.y += 8;
                    if(game.input.right) cur.x += 8;
                    else if(game.input.left) cur.x -= 8;
                    if(scene.time == 240) scene.removeChild(startLabel)
                    world.step(game.fps);
                    game.time++;
                    Floor.intersect(Aim).forEach(function(pair){
                        scene.removeChild(pair[1])
                    })
                    Wall.intersect(Aim).forEach(function(pair){
                        scene.removeChild(pair[1])
                    })
                    Floor.intersect(BulAim).forEach(function(pair){
                        scene.removeChild(pair[1])
                    })
                    Wall.intersect(BulAim).forEach(function(pair){
                        scene.removeChild(pair[1])
                    })
                    Floor.intersect(PlayerBulAim).forEach(function(pair){
                        scene.removeChild(pair[1])
                    })
                    Wall.intersect(PlayerBulAim).forEach(function(pair){
                        scene.removeChild(pair[1])
                    })
                    
                    if(destruction == tankEntity.length-1 && deadFlgs[0]==false && victory == false && complete == false){
                        scene.removeChild(pauseButtton)
                        scene.removeChild(blackImg)
                        scene.removeChild(retire)
                        BGM1.stop();
                        test.forEach(elem=>{
                            scene.removeChild(elem)
                        })
                        
                        for(var i = 4; i < Object.keys(stageData).length-1; i++){
                            colors[stageData[i][10]] += 1;
                        }
                        let script = document.createElement("script");
                        script.src = stagePath[stageNum+1];
                        let head = document.getElementsByTagName("head");
                        head[0].appendChild(script);
                        //if(stageNum == stagePath.length-1 || stageNum == 20){
                        if(stageNum % 20 == 0){
    
                            scene.time = 0;
                            new DispHead(100,60,360*3,180,"#a00",scene)
                            new DispText(252,124,720,64,'ミッションコンプリート！','bold 64px "Arial"','yellow','center',scene)
    
                            score += destruction
                            complete = true;
                            let v = score+zanki;
                            postData = {
                                "name": userName,
                                "text": v,
                                "time": nowDay,
                                "level": sl
                            };
                            new setJson()
                            new getJson()
                            
                        }else{
                            new DispText(360,300,720,64,'ミッションクリア！','bold 64px "Arial"','red','left',scene)
                            new DispScore(scene)
                            victory = true;
                            game.time = 0;
                        }
                        
                    }
                    if(complete == true && scene.time == 120){
                        new DispBody(100,240,360*3,240*3,scene)
                    }
                    
                    if(complete == true && scene.time >= 120 && scene.time % 15 == 0 && dcnt < colors.length){
                        new DispText(180,200+(56*(dcnt+1)),720,48,colorsName[dcnt],'48px "Arial"',fontColor[dcnt],'left',scene)
                        new DispText(460,200+(56*(dcnt+1)),320*2,48,'：'+colors[dcnt],'48px "Arial"','#400','left',scene)
                        dcnt++;
                    }
                    if(complete == true && scene.time == 315){
                        new DispText(650,420,320*2,64,'撃破数+残機：'+(score+zanki),'bold 64px "Arial"','#622','left',scene)
                    }
                    
                    if(complete == true && scene.time >= 345){
                        var toTitle = new Label('➡タイトル画面へ');
                            toTitle.moveTo(640,640);
                            toTitle.width = 320*1.5;
                            toTitle.height = 36;
                            toTitle.font = '36px "Arial"';
                            toTitle.color = '#400';
                            toTitle.textAlign = 'center';
                        var toProceed = new Label('➡さらなるステージへ...');
                            toProceed.moveTo(640,720);
                            toProceed.width = 320*1.5;
                            toProceed.height = 36;
                            toProceed.font = 'bold 36px "Arial"';
                            toProceed.color = 'red';
                            toProceed.textAlign = 'center';
                        if(scene.time == 345){
                            scene.addChild(toTitle)
                            if(stageNum != 100){
                                scene.addChild(toProceed)
                            }
                        }
                        toTitle.addEventListener(Event.TOUCH_START, function() {
                            
                            game.stop()
                            //location.href = "http://localhost/BattleTankGame/gameTest.html";
                            location.href = "https://m-kz15.github.io/PlayBTG/gameTest.html";
                        });
                        toProceed.addEventListener(Event.TOUCH_START, function() {
                            complete = false;
                            new FadeOut(scene)
                            stageNum++;
                            bulOb.forEach(elem=>{
                                elem.forEach(elem2=>{
                                    scene.removeChild(elem2)
                                })
                            })
                            colOb.forEach(elem=>{
                                elem.forEach(elem2=>{
                                    elem2.destroy()
                                    scene.removeChild(elem2)
                                })
                            })
                            floors.forEach(elem=>{
                                elem.destroy()
                                scene.removeChild(elem)
                            })
                            walls.forEach(elem=>{
                                elem.destroy()
                                scene.removeChild(elem)
                            })
                            avoids.forEach(elem=>{
                                scene.removeChild(elem)
                            })
                            holes.forEach(elem=>{
                                scene.removeChild(elem)
                            })
                            
                            game.replaceScene(createStartScene())
                        });
                    }
                    if(deadFlgs[0]==true && defeat == false){
                        game.time = 0;
                        defeat = true;
                        BGM1.stop();
                        scene.removeChild(pauseButtton)
                        scene.removeChild(blackImg)
                        scene.removeChild(retire)
                    }
                    if((defeat == true || victory == true) && game.time == 150){
                        new FadeOut(scene)
                    }
                    if(defeat==true && game.time == 180){
                        
                        test.forEach(elem=>{
                            scene.removeChild(elem)
                        })
                        floors.forEach(elem=>{
                            elem.destroy()
                            scene.removeChild(elem)
                        })
                        walls.forEach(elem=>{
                            elem.destroy()
                            scene.removeChild(elem)
                        })
                        holes.forEach(elem=>{
                            scene.removeChild(elem)
                        })
                        avoids.forEach(elem=>{
                            scene.removeChild(elem)
                        })
                        bulOb.forEach(elem=>{
                            elem.forEach(elem2=>{
                                scene.removeChild(elem2)
                            })
                        })
                        colOb.forEach(elem=>{
                            elem.forEach(elem2=>{
                                elem2.destroy()
                                scene.removeChild(elem2)
                            })
                        })
                        
                        if(zanki == 0){
                            score += destruction; 
                            postData = {
                                "name": userName,
                                "text": score,
                                "time": nowDay,
                                "level": sl
                            };
                            game.replaceScene(createGameoverScene())
                        }else{
                            game.replaceScene(createStartScene())
                        }
                    }
                    if(victory == true && game.time == 180 && complete==false){
                        score += destruction
                        stageNum++;
                        test.forEach(elem=>{
                            scene.removeChild(elem)
                        })
                        floors.forEach(elem=>{
                            elem.destroy()
                            scene.removeChild(elem)
                        })
                        walls.forEach(elem=>{
                            elem.destroy()
                            scene.removeChild(elem)
                        })
                        avoids.forEach(elem=>{
                            scene.removeChild(elem)
                        })
                        bulOb.forEach(elem=>{
                            elem.forEach(elem2=>{
                                scene.removeChild(elem2)
                            })
                        })
                        colOb.forEach(elem=>{
                            elem.forEach(elem2=>{
                                elem2.destroy()
                                scene.removeChild(elem2)
                            })
                        })
                        holes.forEach(elem=>{
                            scene.removeChild(elem)
                        })
                        
                        if(stageNum % 6 == 0){
                            game.replaceScene(createBonusScene())
                        }else{
                            game.replaceScene(createStartScene())
                        }
                    }
                }
            }
            return scene;
        };
        /* ゲームオーバーシーン */
        var createGameoverScene = function() {
    
            let script = document.createElement("script");
            script.src = stagePath[1];
            let head = document.getElementsByTagName("head");
            head[0].appendChild(script);
            
            stageData = LoadStage();    //ステージ情報引き出し      
      
            var scene = new Scene();                                   // 新しいシーンを作る
            scene.time = 0;
            scene.backgroundColor = '#303030';                         // シーンの背景色を設定
    
            new setJson()
    
            // ゲームオーバー画像設定
            var gameoverImage = new Sprite(256, 192);                   // スプライトを作る
                gameoverImage.image = game.assets['./image/ObjectImage/gameover.png'];  // ゲームオーバー画像を設定
                gameoverImage.x = 320*0.9;                                      // 横位置調整
                gameoverImage.y = 240*1.0;                                     // 縦位置調整
                gameoverImage.scaleX = 2.0;
                gameoverImage.scaleY = 2.0;
                scene.addChild(gameoverImage);                             // シーンに追加
            // スコアラベル設定
            new DispText(0,60,320*2.7,64,score+'両撃破した。','64px sans-serif','#fff','center',scene)
            new DispHead(320*2.3,60,240*2.3,240*3.3,"#ddd4",scene)
            
            // リトライラベル(ボタン)設定
            var retryLabel = new Label('➡もう一度遊ぶ');
                retryLabel.moveTo(240*2,240*2.5);
                retryLabel.width = 320*2;
                retryLabel.height = 32;
                retryLabel.font = '32px sans-serif';
                retryLabel.color = '#fff';
                retryLabel.textAlign = 'left';
    
            var homeLabel = new Label('➡タイトル画面へ');
                homeLabel.moveTo(120,240*2.5);
                homeLabel.width = 320*2;
                homeLabel.height = 32;
                homeLabel.font = '32px sans-serif';
                homeLabel.color = '#fff';
                homeLabel.textAlign = 'left';

            test = []
            bulOb = [[]];       //戦車の弾情報を保持する配列
            colOb = [[]];       //弾の物理判定を保持する配列
            bomOb = [[]];       //爆弾の情報を保持する配列
            bullets = [];       //各戦車の弾数の制御用の配列
            boms = [];          //各戦車の爆弾設置制御用の配列
            tankEntity = [];    //敵味方の戦車情報を保持する配列
            allyEntity = [];
            entNum = 0;         //戦車の連番設定用変数
            floors = [];        //ステージの障害物を保持する配列
            walls = [];         //ステージの壁を保持する配列
            holes = [];         //ステージの穴を保持する配列
            deadFlgs = [];      //戦車の生存確認   
            tankColorCounts = [0,0,0,0,0,0,0,0,0,0,0,0];
            allyDeadFlg = false; 
            fireFlgs = [];      //敵の砲撃制御
            stageNum = 1;       //ステージ番号
            zanki = 5;          //プレイヤーの残機
            score = 0;          //総撃破数
            destruction = 0;    //ステージごとの撃破数
            worldFlg = false;   //ゲームのon/off制御ボタン
            victory = false;    //勝利判定
            defeat = false;     //敗北判定
            complete = false;   //攻略完了判定
    
            // リトライラベルにタッチイベントを設定
            retryLabel.addEventListener(Event.TOUCH_START, function(e) {
                zanki = 5;
                stageNum = 1;
                dt = new Date();
                y = dt.getFullYear();
                m = ("00" + (dt.getMonth()+1)).slice(-2);
                d = ("00" + (dt.getDate())).slice(-2);
                Hour = dt.getHours();
                Min = dt.getMinutes();
                Sec = dt.getSeconds();
                nowDay = y + m + d + Hour + Min + Sec;
                game.replaceScene(createStartScene());    // 現在表示しているシーンをタイトルシーンに置き換える
            });
            homeLabel.addEventListener(Event.TOUCH_START, function(e) {
                zanki = 5;
                stageNum = 1;
                game.stop()
                
                //location.href = "http://localhost/BattleTankGame/gameTest.html";
                location.href = "https://m-kz15.github.io/PlayBTG/gameTest.html";
                game.replaceScene(createTitleScene());    // 現在表示しているシーンをタイトルシーンに置き換える
            });
            scene.onenterframe=function(){
                scene.time++
                if(scene.time == 150){
                    new getJson()
                    let jlen = j_data.rank.length
                    rankings = [0,0,0,0,0,0,0,0,0,0]
                    tops = ["_____","_____","_____","_____","_____","_____","_____","_____","_____","_____"]
                    times = [0,0,0,0,0,0,0,0,0,0]
                    for(let i = 0; i < jlen; i++){
                        rankings.push(j_data.rank[i].score);
                        tops.push(j_data.rank[i].name);
                        times.push(j_data.rank[i].time);
                    }
    
                    tops.push(postData.name)
                    rankings.push(postData.text)
                    times.push(postData.time)
    
                    for(let j = 0; j < (rankings.length)+jlen; j++){
                        for(let i = j+1; i < (rankings.length)+jlen; i++){
                            if(rankings[j]<rankings[i]){
                                let w = rankings[j]
                                rankings[j] = rankings[i]
                                rankings[i] = w;
                                let s = tops[j]
                                tops[j]=tops[i]
                                tops[i]=s
                                let d = times[j]
                                times[j]=times[i]
                                times[i]=d
                            }
                        }
                    }
                    for(let i = 0; i < 10; i++){
                        if(i == 9){
                            new DispText(320*2.7375,80+(64*(i+1)),260*2,32,(i+1)+'  ： '+tops[i]+' ： '+rankings[i],'32px sans-serif','#fff','left',scene)
                        }else{
                            new DispText(320*2.8,80+(64*(i+1)),260*2,32,(i+1)+'  ： '+tops[i]+' ： '+rankings[i],'32px sans-serif','#fff','left',scene)
                        }
                        if(postData.name == tops[i] && postData.text == rankings[i] && postData.time == times[i] && postData.text > 0){
                            new DispText(320*2.3,80+(64*(i+1)),32*4,32,"You ➡",'bold 32px sans-serif','#fff','right',scene)
                        }
                    }
                    scene.addChild(retryLabel);                                // シーンに追加
                    scene.addChild(homeLabel);                                // シーンに追加
                }
            }
            return scene;
        };
        game.replaceScene(createTitleScene());  // ゲームの_rootSceneをスタートシーンに置き換える
    }
    /* 画面外をクリックしても操作できるようにする処理 */
    game.onenterframe = function(){
        if(game.time % 5 == 0){
            window.focus();
        }
        
    }
    game.start(); // ゲームをスタートさせます
}
