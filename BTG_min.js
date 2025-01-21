window.focus();
enchant();

const size = 4; //サイズ倍率(勝手に触らない方が良い)
const base = 16; //基準サイズ
const pixelSize = base * size; //1セルごとのサイズ

const stage_w = 20;
const stage_h = 15;

var game;
var now_scene;

let debugFlg = false;
var stageNum = 1; //ステージ番号
var playerType = 0;

let scl = 1;

var ScreenMargin = 120;

var cheat = false; //チート用

var cur; //カーソルの位置情報を保持する配列

var stageData; //ステージ情報を管理する変数

var floors = []; //ステージの障害物を保持する配列
var walls = []; //ステージの壁を保持する配列
var holes = []; //ステージの穴を保持する配列
var avoids = []; //（敵のみ適応）見えない壁を保持する配列
var obsdir = []
var obsChk = []
var obsNum = 0;
var refdir = []
var refChk = []
var refNum = 0;

var tankEntity = []; //敵味方の戦車情報を保持する配列
var tankDir = []
//var markEntity = [];
var bulOb = [
	[]
]; //戦車の弾情報を保持する配列
var colOb = [
	[]
]; //弾の物理判定を保持する配列
var bomOb = [
	[]
]; //爆弾の情報を保持する配列
var bullets = []; //各戦車の弾数の制御用の配列
var boms = []; //各戦車の爆弾設置制御用の配列
var bulStack = []; //弾の状態を判定する配列
var fireFlgs = []; //敵の砲撃制御
var deadFlgs = []; //戦車の生存確認
var entVal = 0; //戦車の連番設定用変数
var addBullet = 0; //難易度ごとの弾追加数
var addSpeed = 0; //難易度ごとの移動速度
var deleteFlg = false;
var retireFlg = false;
var enemyTarget = []; //敵戦車が狙うターゲット

var userName = "Player";
var key = "BTG_PlayData";

/*var PlayData = {
    Name: userName,
    StageNum: 0,
    Zanki: 0,
    Scores: [],
    Level: 0
};*/

var playerStatus = [5, 1, 10, 2.4];

const cateImages = [
    {tank: './image/ObjectImage/tank2.png', cannon: './image/ObjectImage/cannon.png'},                  //player
    {tank: './image/ObjectImage/brown.png', cannon: './image/ObjectImage/browncannon.png'},             //brown
    {tank: './image/ObjectImage/gray.png', cannon: './image/ObjectImage/graycannon.png'},               //gray
    {tank: './image/ObjectImage/green.png', cannon: './image/ObjectImage/greencannon.png'},             //green
    {tank: './image/ObjectImage/red.png', cannon: './image/ObjectImage/redcannon.png'},                 //red
    {tank: './image/ObjectImage/lightgreen.png', cannon: './image/ObjectImage/lightgreencannon.png'},   //lightgreen
    {tank: './image/ObjectImage/elite.png', cannon: './image/ObjectImage/elitecannon.png'},             //elitegray
    {tank: './image/ObjectImage/snow.png', cannon: './image/ObjectImage/snowcannon.png'},               //snow
    {tank: './image/ObjectImage/elitegreen.png', cannon: './image/ObjectImage/elitegreencannon.png'},   //elitegreen
    {tank: './image/ObjectImage/sand.png', cannon: './image/ObjectImage/sandcannon.png'},               //sand
    {tank: './image/ObjectImage/pink.png', cannon: './image/ObjectImage/pinkcannon.png'},               //pink
    {tank: './image/ObjectImage/abnormal.png', cannon: './image/ObjectImage/abnormalcannon.png'},       //black
    {tank: './image/ObjectImage/meisai.png', cannon: './image/ObjectImage/meisaicannon.png'},           //dazzle
    {tank: './image/ObjectImage/Abyssal.png', cannon: './image/ObjectImage/AbyssalCannon.png'}          //abysal
];

/* 各戦車の迎撃判定
    プレイヤー,自身,他戦車 */
var cateFlgs = [
	[false, false, false], //brown
	[true, false, false], //gray
	[true, true, true], //green
	[true, false, false], //red
	[true, true, true], //lightgreen
	[true, true, true], //elitegray
	[true, true, true], //snow
	[false, false, false], //elitegreen
	[true, false, false], //sand
	[false, false, false], //pink
	[true, false, false], //random
	[true, true, true] //dazzle
];
/* 各戦車の守備範囲
    プレイヤー,自身,他戦車 */
var cateRanges = [
	[0, 0, 0], //brown
	[200, 0, 0], //gray
	[400, 200, 150], //green
	[200, 0, 0], //red
	[300, 200, 200], //lightgreen
	[300, 250, 200], //elitegray
	[300, 200, 200], //snow
	[0, 0, 0], //elitegreen
	[300, 0, 0], //sand
	[500, 0, 0], //pink
	[300, 0, 0], //random
	[300, 300, 300] //dazzle
];
var cateEscapes = [
	[false, 0, 0, 0], //brown
	[true, 300, 0, 0], //gray
	[true, 300, 180, 120], //green
	[false, 0, 0, 0], //red
	[true, 200, 0, 0], //lightgreen
	[true, 280, 230, 180], //elitegray
	[true, 200, 200, 180], //snow
	[false, 0, 0, 0], //elitegreen
	[true, 240, 0, 0], //sand
	[false, 0, 0, 0], //pink
	[true, 280, 0, 0], //random
	[true, 240, 200, 160] //dazzle
];
var cateDistances = [
	0, //brown
	0, //gray
	300, //green
	0, //red
	150, //lightgreen
	200, //elitegray
	300, //snow
	300, //elitegreen
	150, //sand
	0, //pink
	320, //random
	250 //dazzle
];
var cateReloadTimes = [
	12, //brown
	120, //gray
	120, //green
	240, //red
	300, //lightgreen
	180, //elitegray
	600, //snow
	90, //elitegreen
	90, //sand
	360, //pink
	90, //random
	180 //dazzle
];
var cateMaxBullets = [
	1, //brown
	2, //gray
	1, //green
	5, //red
	3, //lightgreen
	4, //elitegray
	2, //snow
	3, //elitegreen
	2, //sand
	6, //pink
	1, //random
	5 //dazzle
];
/*var cateMaxBullets = [
	0, //brown
	0, //gray
	0, //green
	0, //red
	0, //lightgreen
	0, //elitegray
	0, //snow
	0, //elitegreen
	0, //sand
	0, //pink
	0, //random
	0 //dazzle
];*/

var cateFireLate = [
	30, //brown
	40, //gray
	25, //green
	20, //red
	30, //lightgreen
	24, //elitegray
	30, //snow
	10, //elitegreen
	23, //sand
	9, //pink
	10, //random
	24 //dazzle
];
var cateShotSpeeds = [
	8, //brown
	9, //gray
	15, //green
	9, //red
	11, //lightgreen
	10, //elitegray
	14, //snow
	18, //elitegreen
	12, //sand
	11, //pink
	23, //random
	13 //dazzle
];
var cateMaxRefs = [
	1, //brown
	1, //gray
	0, //green
	0, //red
	2, //lightgreen
	1, //elitegray
	1, //snow
	2, //elitegreen
	0, //sand
	0, //pink
	0, //random
	1 //dazzle
];
var cateMoveSpeeds = [
	0.0, //brown
	1.0, //gray
	1.0, //green
	2.0, //red
	1.2, //lightgreen
	1.6, //elitegray
	1.2, //snow
	0.0, //elitegreen
	2.6, //sand
	0.0, //pink
	1.0, //random
	2.0 //dazzle
];

var tankColorCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; //配色ごとの敵戦車残数格納配列

var worldFlg = false; //ゲームのon/off制御ボタン
var victory = false; //勝利判定
var defeat = false; //敗北判定
var complete = false; //攻略完了判定
var pauseFlg = false; //一時停止判定
var titleFlg = false;
var resultFlg = false;
var retryFlg = false;

var BGMs = [ //bgm指定用配列
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
	'./sound/ELEVENTH.mp3'
];
var BNum = 0; //現在のbgmの番号変数

var colors = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; //戦車の色を数える配列
var colorsName = [ //各戦車の表示名格納配列
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
	"Black",
	"Dazzle"
]
let fontColor = [ //各戦車の表示色格納配列
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

var zanki = 5; //プレイヤーの残機
var score = 0; //総撃破数
var destruction = 0; //ステージごとの撃破数
var deadTank = [false];

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
script.id = 'stage_' + stageNum;
var head = document.getElementsByTagName("head");
head[0].appendChild(script);

/* フィルター用マップ配列 */
var fmap = [
	[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
	[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
	[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
	[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
	[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
	[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
	[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
	[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
	[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
	[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
	[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
	[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
	[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
	[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
	[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
];
var fcol = [
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]

let inputManager;

var delStageFile = function() {
	if (stageNum > 0) {
		for (let elem of head[0].childNodes) {
			if (elem.id == 'stage_' + (stageNum - 1)) {

				elem.remove();
			};
		};
	};
};

var Rot_to_Vec = function(rot, add) {
	let rad = (rot + add) * (Math.PI / 180.0);
	let vector = {
		x: Math.cos(rad) * 1,
		y: Math.sin(rad) * 1
	};
	return vector;
};

var Vec_to_Rot = function(vector) {
	let rad = Math.atan2(vector.y, vector.x);
	let rot = ((Math.atan2(Math.cos(rad), Math.sin(rad)) * 180) / Math.PI) * -1;
	return rot;
};

var Pos_to_Vec = function(from, to) {
	let vector = {
		x: from.x - to.x,
		y: from.y - to.y
	};
	return vector;
};

var Vec_Distance = function(from, to) {
	//Math.sqrt(Math.pow(weak.x - target.x, 2) + Math.pow(weak.y - target.y, 2))
	let vector = {
		x: Math.pow(from.x - to.x, 2),
		y: Math.pow(from.y - to.y, 2)
	};

	return Math.sqrt(vector.x + vector.y);
}

var Escape_Rot = function(from, to) {
	let v = Rot_to_Vec(to.rotation, 270);
	v.x = v.x * 96 + to.x;
	v.y = v.y * 96 + to.y;
	/*let point = new Sprite(10,10);
	    point.moveTo(v.x,v.y);
	    point.backgroundColor = '#f008';
	now_scene.addChild(point);*/
	let p = Pos_to_Vec({ x: from.x + (from.width / 2), y: from.y + (from.height / 2) }, v);
	//let r = Vec_to_Rot(p);
	let rad = Math.atan2(p.y, p.x);
	let r = ((Math.atan2(Math.cos(rad), Math.sin(rad)) * 180) / Math.PI) * -1;
	if(r < 0) r *= -1;
	let value = Math.floor(Math.random() * 4);
	if (r > 338 || r <= 23) {
		while (value == 2) value = Math.floor(Math.random() * 4);
	} else if (r > 23 && r <= 68) {
		if (r > 46) {
			while (value == 1) value = Math.floor(Math.random() * 4);
		} else {
			while (value == 2) value = Math.floor(Math.random() * 4);
		}
		//while(value == 2 || value == 1) value = Math.floor(Math.random() * 4);
	} else if (r > 68 && r <= 113) {
		while (value == 1) value = Math.floor(Math.random() * 4);
	} else if (r > 113 && r <= 158) {
		if (r > 136) {
			while (value == 3) value = Math.floor(Math.random() * 4);
		} else {
			while (value == 1) value = Math.floor(Math.random() * 4);
		}
		//while(value == 3 || value == 1) value = Math.floor(Math.random() * 4);
	} else if (r > 158 && r <= 203) {
		while (value == 3) value = Math.floor(Math.random() * 4);
	} else if (r > 203 && r <= 248) {
		if (r > 226) {
			while (value == 0) value = Math.floor(Math.random() * 4);
		} else {
			while (value == 3) value = Math.floor(Math.random() * 4);
		}
		//while(value == 3 || value == 0) value = Math.floor(Math.random() * 4);
	} else if (r > 248 && r <= 293) {
		while (value == 0) value = Math.floor(Math.random() * 4);
	} else if (r > 293 && r <= 338) {
		if (r > 316) {
			while (value == 2) value = Math.floor(Math.random() * 4);
		} else {
			while (value == 0) value = Math.floor(Math.random() * 4);
		}

	};

	return value;
};

var Hit_Rot = function(from, to) {
	let v = Rot_to_Vec(to.rotation, 270);
	v.x = v.x + (to.x + to.width / 2);
	v.y = v.y + (to.y + to.height / 2);
	let p = Pos_to_Vec({ x: from.x + (from.width / 2), y: from.y + (from.height / 2) }, v);
	let r = Vec_to_Rot(p);
	let value = 0;
	if (r > 315 || r <= 45) {
		value = 2;
	} else if (r > 45 && r <= 135) {
		value = 1;
	} else if (r > 135 && r <= 225) {
		value = 3;
	} else if (r > 225 && r <= 315) {
		value = 0;
	};

	return value;
}


/*function collision(L, R, T, B, x, y, radius){ 
	if(L - radius > x || R + radius < x || T - radius > y || B + radius < y){
		//矩形に円の半径分を足した範囲 
		return false; 
	} 
	if(L > x && T > y && !((L - x) * (L - x) + (T - y) * (T - y) < radius * radius)){
		//左上の当たり判定 
		return false; 
	} 
	if(R < x && T > y && !((R - x) * (R - x) + (T - y) * (T - y) < radius * radius)){
		//右上の当たり判定 
		return false; 
	} 
	if(L > x && B < y && !((L - x) * (L - x) + (B - y) * (B - y) < radius * radius)){
		//左下の当たり判定 
		return false; 
	} 
	if(R < x && B < y && !((R - x) * (R - x) + (B - y) * (B - y) < radius * radius)){
		//右下の当たり判定 
		return false; 
	} 
	return true;//すべての条件が外れたときに当たっている 
}*/


//設定用
const Config = {
	//画面の解像度
	Screen: {
		Width: pixelSize * stage_w, //幅
		Height: pixelSize * stage_h, //高さ
		BackGroundColor: 0x444444, //背景色
	},
	Keys: { //キーボード入力
		Up: "w",
		Right: "d",
		Down: "s",
		Left: "a",
		A: "Space",
		B: "e",
		Start: "Escape"
	},
}
class InputManager {
	constructor() {
		//方向入力チェック用定数
		this.keyDirections = {
			UP: 1,
			UP_RIGHT: 3,
			RIGHT: 2,
			DOWN_RIGHT: 6,
			DOWN: 4,
			DOWN_LEFT: 12,
			LEFT: 8,
			UP_LEFT: 9,
		};
		//キーの状態管理定数
		this.keyStatus = {
			HOLD: 2,
			DOWN: 1,
			UNDOWN: 0,
			RELEASE: -1,
		};
		//キーの状態管理用変数
		this.input = {
			//入力されたキーのチェック用
			keys: {
				Up: false,
				Right: false,
				Down: false,
				Left: false,
				A: false,
				B: false,
				Start: false
			},
			//一つ前のキーの状態管理用
			keysPrev: {
				Up: false,
				Right: false,
				Down: false,
				Left: false,
				A: false,
				B: false,
				Start: false
			},
		};

		//スマホ・タブレットの時だけv-pad表示
		if (navigator.userAgent.match(/iPhone|iPad|Android/)) {
			this.vpad = new Vpad(this.input);
		}

		//キーを押した時
		document.addEventListener('keydown', (e) => {
			switch (e.key) {
				case Config.Keys.Up:
					this.input.keys.Up = true;
					break;
				case Config.Keys.Down:
					this.input.keys.Down = true;
					break;
				case Config.Keys.Right:
					this.input.keys.Right = true;
					break;
				case Config.Keys.Left:
					this.input.keys.Left = true;
					break;
				case Config.Keys.A:
					this.input.keys.A = true;
					break;
				case Config.Keys.B:
					this.input.keys.B = true;
					break;
				case Config.Keys.Start:
					this.input.keys.Start = true;
					break;
			}
		});

		//キーを離したとき
		document.addEventListener('keyup', (e) => {
			switch (e.key) {
				case Config.Keys.Up:
					this.input.keys.Up = false;
					break;
				case Config.Keys.Down:
					this.input.keys.Down = false;
					break;
				case Config.Keys.Right:
					this.input.keys.Right = false;
					break;
				case Config.Keys.Left:
					this.input.keys.Left = false;
					break;
				case Config.Keys.A:
					this.input.keys.A = false;
					break;
				case Config.Keys.B:
					this.input.keys.B = false;
					break;
				case Config.Keys.Start:
					this.input.keys.Start = false;
					break;
			}
		});
	}

	//方向キー入力チェック
	checkDirection() {
		let direction = 0; //初期化
		if (this.input.keys.Up) {
			direction += this.keyDirections.UP;
		}
		if (this.input.keys.Right) {
			direction += this.keyDirections.RIGHT;
		}
		if (this.input.keys.Down) {
			direction += this.keyDirections.DOWN;
		}
		if (this.input.keys.Left) {
			direction += this.keyDirections.LEFT;
		}
		return direction;
	}

	//ボタンの入力状態をチェックして返す
	checkButton(key) {
		if (this.input.keys[key]) {
			if (this.input.keysPrev[key] == false) {
				this.input.keysPrev[key] = true;
				return this.keyStatus.DOWN; //押されたとき
			}
			return this.keyStatus.HOLD; //押しっぱなし
		} else {
			if (this.input.keysPrev[key] == true) {
				this.input.keysPrev[key] = false;
				return this.keyStatus.RELEASE; //ボタンを離した時
			}
			return this.keyStatus.UNDOWN; //押されていない
		}
	}
}

/******************************************************
 * バーチャルパッド
 ******************************************************/
class Vpad {
	constructor(input) {
		this.input = input; //InputManagerのinput
		this.resizePad();
		// リサイズイベントの登録
		window.addEventListener('resize', () => { this.resizePad(); });
	}
	//画面サイズが変わるたびにvpadも作り変える
	resizePad() {
		let styleDisplay = "block"; //ゲームパッド対策
		//すでにあれば一度削除する
		if (this.pad != undefined) {
			styleDisplay = this.pad.style.display; //ゲームパッド対策
			while (this.pad.firstChild) {
				this.pad.removeChild(this.pad.firstChild);
			}
			this.pad.parentNode.removeChild(this.pad);
		}

		//HTMLのdivでvpad作成
		const pad = document.createElement('div');
		document.body.appendChild(pad);
		this.pad = pad;
		pad.id = "pad";
		pad.style.width = pixelSize * stage_w / 2;
		pad.style.display = styleDisplay;

		//タッチで拡大とか起こるのを防ぐ
		pad.addEventListener("touchstart", (e) => {
			e.preventDefault();
		});
		pad.addEventListener("touchmove", (e) => {
			e.preventDefault();
		});

		//横長の場合位置変更
		if (window.innerWidth > window.innerHeight) {
			pad.style.width = `${window.innerWidth}px`;
			pad.style.position = "absolute"; //画面の上にかぶせるため
			pad.style.backgroundColor = "transparent"; //透明
			pad.style.bottom = "0px"; //下に固定
		}
			
		const height = Number(pixelSize * stage_h / 2.65) * 0.5; //ゲーム画面の半分の高さをゲームパッドの高さに
		pad.style.height = `${height}px`;

		//方向キー作成
		new DirKey(this.pad, this.input, height);

		//Aボタン作成
		let style = {
			width: `${height * 0.5}px`,
			height: `${height * 0.5}px`,
			right: `${height * 0.5}px`,
			top: `${height * 0.4}px`,
			borderRadius: "50%",
			borderColor: '#88f',
			color: '#fff'
		}
		new ActBtn(this.pad, this.input, "A", "B", style);

		//Bボタン作成
		style = {
			width: `${height * 0.5}px`,
			height: `${height * 0.5}px`,
			right: `${height * 0.05}px`,
			top: `${height * 0.1}px`,
			borderRadius: "50%",
			borderColor: '#f44',
			color: '#fff'
		}
		new ActBtn(this.pad, this.input, "B", "A", style);

		//STARTボタン作成
		style = {
			width: `${height * 0.3}px`,
			height: `${height * 0.15}px`,
			right: `${height * 0.45}px`,
			top: `${height * -0.05}px`,
			borderRadius: `${height * 0.15 * 0.5}px`,
			borderColor: '#aaa',
			color: '#fff'
		}
		new ActBtn(this.pad, this.input, "Start", "PAUSE", style);
	}
}

//方向キークラス
class DirKey {
	constructor(parent, input, padHeight) {
		this.isTouching = false;
		this.originX = 0;
		this.originY = 0;

		//HTMLのdivでキーのエリアを作成
		const div = document.createElement('div');
		parent.appendChild(div);
		div.className = "dir-key";
		div.style.width = div.style.height = `${padHeight * 0.8}px`;
		div.style.left = `${padHeight * 0.05}px`;
		div.style.top = `${padHeight * 0.05}px`;
		this.maxRadius = padHeight * 0.15; //中心移動させる半径
		this.emptySpace = padHeight * 0.05; //あそび

		//十字キーのボタン(張りぼて。タッチイベントはない)
		const up = document.createElement('div');
		up.className = "dir up";
		div.appendChild(up);
		const left = document.createElement('div');
		left.className = "dir left";
		div.appendChild(left);
		const right = document.createElement('div');
		right.className = "dir right";
		div.appendChild(right);
		const down = document.createElement('div');
		down.className = "dir down";
		div.appendChild(down);
		const mid = document.createElement('div');
		mid.className = "dir mid";
		div.appendChild(mid);
		const circle = document.createElement('div');
		circle.className = "circle";
		mid.appendChild(circle);

		//タッチイベント
		div.addEventListener("touchstart", (e) => {
			e.preventDefault();
			this.isTouching = true;
			//タッチした位置を原点にする
			this.originX = e.targetTouches[0].clientX;
			this.originY = e.targetTouches[0].clientY;
		});

		div.addEventListener("touchmove", (e) => {
			e.preventDefault();
			if (!this.isTouching) return;
			dirReset(); //からなず一度リセット

			//タッチ位置を取得
			const posX = e.targetTouches[0].clientX;
			const posY = e.targetTouches[0].clientY;

			//原点からの移動量を計算
			let vecY = posY - this.originY;
			let vecX = posX - this.originX;
			let vec = Math.sqrt(vecX * vecX + vecY * vecY);
			if (vec < this.emptySpace) return; //移動が少ない時は反応しない(遊び)

			const rad = Math.atan2(posY - this.originY, posX - this.originX);
			const y = Math.sin(rad);
			const x = Math.cos(rad);

			//移動幅が大きいときは中心を移動させる
			if (vec > this.maxRadius) {
				this.originX = posX - x * this.maxRadius;
				this.originY = posY - y * this.maxRadius;
			}

			const abs_x = Math.abs(x);
			const abs_y = Math.abs(y);
			if (abs_x > abs_y) { //xの方が大きい場合左右移動となる
				if (x < 0) { //マイナスであれば左
					input.keys.Left = true;
				} else {
					input.keys.Right = true;
				}
				if (abs_x <= abs_y * 2) { //2yがxより大きい場合斜め入力と判断
					if (y < 0) { //マイナスであれば上
						input.keys.Up = true;
					} else {
						input.keys.Down = true;
					}
				}
			} else { //yの方が大きい場合上下移動となる
				if (y < 0) { //マイナスであれば上
					input.keys.Up = true;
				} else {
					input.keys.Down = true;
				}
				if (abs_y <= abs_x * 2) { //2xがyより大きい場合斜め入力と判断
					if (x < 0) { //マイナスであれば左
						input.keys.Left = true;
					} else {
						input.keys.Right = true;
					}
				}
			}
		});

		div.addEventListener("touchend", (e) => {
			dirReset();
		});

		const dirReset = () => {
			input.keys.Right = input.keys.Left = input.keys.Up = input.keys.Down = false;
		}
	}
}
//アクションボタンクラス
class ActBtn {
	constructor(parent, input, key, name, style) {
		//HTMLのdivでボタンを作成
		const div = document.createElement('div');
		div.className = "button";
		parent.appendChild(div);
		div.style.width = style.width;
		div.style.height = style.height;
		div.style.right = style.right;
		div.style.top = style.top;
		div.style.borderRadius = style.borderRadius;
		div.style.borderColor = style.borderColor;


		//ボタン名を表示
		const p = document.createElement('p');
		p.innerHTML = name;
		p.style.color = style.color;
		div.appendChild(p);

		//タッチスタート
		div.addEventListener("touchstart", (e) => {
			e.preventDefault();
			input.keys[key] = true;
		});

		//タッチエンド
		div.addEventListener("touchend", (e) => {
			input.keys[key] = false;
		});
	}
}

window.onload = function() {
	/* ステージ幅：20ブロック　高さ：15ブロック */
	game = new Core(pixelSize * stage_w, pixelSize * stage_h);
	game.fps = 60; //画面の更新頻度
	game.time = 0;
	game.preload( //画像や音源を準備
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
		'./sound/s_car_door_O2.wav',
		'./sound/s_car_trunk_O.wav',
		'./sound/Sample_0000.wav',
		'./sound/Sample_0003.wav',
		'./sound/Sample_0004.wav',
		'./sound/Sample_0009.wav',
		'./sound/Sample_0010.wav',
		'./sound/start.mp3',
		'./sound/end.mp3',
		'./sound/success.mp3',
		'./sound/failed.mp3',
		'./sound/result.mp3',
		'./sound/RoundStart.mp3',
		'./sound/ExtraTank.mp3',
		'./sound/base.mp3',
		'./sound/fire.mp3',
		'./sound/TITLE.mp3',
		'./sound/FIRST.mp3',
		'./sound/SECOND.mp3',
		'./sound/THIRD.mp3',
		'./sound/FOURTH.mp3',
		'./sound/SIXTH.mp3',
		'./sound/SEVENTH.mp3',
		'./sound/EIGHTH.mp3',
		'./sound/NINTH.mp3',
		'./sound/TENTH.mp3',
		'./sound/ELEVENTH.mp3'
	);
	/* 入力キー一覧 */
	/*game.keybind(65, "a");
	game.keybind(87, "w");
	game.keybind(83, "s");
	game.keybind(68, "d");
	game.keybind(32, "e");
	game.keybind(81, "q");
	game.keybind(27, "Pause");*/
	inputManager = new InputManager();

	let viewGame = document.getElementById('enchant-stage');
		viewGame.style.display = "block";
	if (navigator.userAgent.match(/iPhone|iPad|Android/)) {
		if(window.innerWidth > viewGame.clientWidth){
			//scl = window.innerWidth / viewGame.clientWidth;
			//alert(scl)
			ScreenMargin = ((window.innerWidth-viewGame.clientWidth)/2);
			viewGame.style.position = "absolute";
			viewGame.style.left = ScreenMargin + "px";
			game._pageX = ScreenMargin;
			//viewGame.style.margin = "0px " + ScreenMargin + "px";
		}else{
			ScreenMargin = 120;
			viewGame.style.position = "absolute";
			viewGame.style.left = ScreenMargin + "px";
			game._pageX = ScreenMargin;
		}
	}else{
		ScreenMargin = 120;
		viewGame.style.position = "absolute";
		viewGame.style.left = ScreenMargin + "px";
		game._pageX = ScreenMargin;
	}
	

	/* ステージ端の壁クラス */
	var Wall = Class.create(PhyBoxSprite, {
		initialize: function(width, height, x, y, scene) {
			PhyBoxSprite.call(this, width * pixelSize, height * pixelSize, enchant.box2d.STATIC_SPRITE, 10, 0.0, 1.0, true);
			//this.backgroundColor = "#ddd4";
			this.x = x * pixelSize;
			this.y = y * pixelSize - base;
			scene.addChild(this);
		}
	});
	/* 1ブロック分の壁クラス */
	var Floor = Class.create(PhyBoxSprite, {
		initialize: function(x, y, scene) {
			PhyBoxSprite.call(this, pixelSize, pixelSize, enchant.box2d.STATIC_SPRITE, 10, 0.0, 1.0, true);
			//this.backgroundColor = "#ddd4";
			this.x = x * pixelSize;
			this.y = y * pixelSize - base;
			scene.addChild(this);
		}
	});

	/* 穴クラス */
	var Hole = Class.create(Sprite, {
		initialize: function(x, y, scene) {
			Sprite.call(this, (pixelSize), (pixelSize));
			//obstacle.push(this)
			this.backgroundColor = "#0004";
			this.x = x * pixelSize;
			this.y = y * pixelSize - base;
			new HoleImage(2, this.x, this.y, scene);
			new HoleImage(1, this.x, this.y, scene);
			
			scene.addChild(this);
		}
	});
	/* 穴の描画クラス */
	var HoleImage = Class.create(Sprite, {
		initialize: function(val, x, y, scene) {
			Sprite.call(this, (base * (size - val)), (base * (size - val)));
			this.backgroundColor = "#0008";
			this.x = x + ((base / 2) * val);
			this.y = y + ((base / 2) * val);
			this.onenterframe = function(){
				if(deleteFlg){
					scene.removeChild(this);
				}
			}
			scene.addChild(this);
		}
	});
	/* 不可視の壁（敵専用） */
	var Avoid = Class.create(Sprite, {
		initialize: function(x, y, scene) {
			Sprite.call(this, pixelSize / 2, pixelSize / 2);
			//this.backgroundColor = "#fdda";
			this.x = x * pixelSize + (4 * 4);
			this.y = y * pixelSize - (3 * 2);

			scene.addChild(this);
		}
	});
	/* 障害物の当たり判定クラス群 */
	var ObsWidthTop = Class.create(Sprite, {
		initialize: function(scene){
			Sprite.call(this,60,4);
			//this.backgroundColor = '#fff8';
			this.onenterframe = function(){
				if(deleteFlg) scene.removeChild(this);
			}
			scene.addChild(this);
		}
	});
	var ObsWidthBottom = Class.create(Sprite, {
		initialize: function(scene){
			Sprite.call(this,60,4);
			//this.backgroundColor = '#00f8';
			this.onenterframe = function(){
				if(deleteFlg) scene.removeChild(this);
			}
			scene.addChild(this);
		}
	});
	var ObsHeightLeft = Class.create(Sprite, {
		initialize: function(scene){
			Sprite.call(this,4,60);
			//this.backgroundColor = '#f008';
			this.onenterframe = function(){
				if(deleteFlg) scene.removeChild(this);
			}
			scene.addChild(this);
		}
	});
	var ObsHeightRight = Class.create(Sprite, {
		initialize: function(scene){
			Sprite.call(this,4,60);
			//this.backgroundColor = '#0f08';
			this.onenterframe = function(){
				if(deleteFlg) scene.removeChild(this);
			}
			scene.addChild(this);
		}
	});
	function SetObs(scene,grid) {
		let g1 = grid;
		let g2 = grid[0].map((_, c) => grid.map(r => r[c]));
		let wsp1 = null;
		let wsp2 = null;
		let hsp1 = null;
		let hsp2 = null;
		let wcnt1 = 0;
		let wcnt2 = 0;
		let hcnt1 = 0;
		let hcnt2 = 0;
		//console.log(g1[0]);
		
		for(let i = 0; i < g1.length; i++){
			for(let j = 0; j < g1[i].length; j++){
				if(g1[i][j] == 1 || g1[i][j] == 3 || g1[i][j] == 4){
					if(wsp1 == null){
						if(i > 0 && !(g1[i-1][j] == 1 || g1[i-1][j] == 3 || g1[i-1][j] == 4)){
							wsp1 = new ObsWidthTop(scene);
							wsp1.moveTo(pixelSize * j + 2, pixelSize * i - 20);
							wcnt1++;
						}
						
					}else{
						if(i > 0 && !(g1[i-1][j] == 1 || g1[i-1][j] == 3 || g1[i-1][j] == 4)){
							wsp1.width = pixelSize * (wcnt1+1) - 4;
							wcnt1++;
						}else{
							wsp1 = null;
							wcnt1 = 0;
						}
						
					}
					if(wsp2 == null){
						if(i < g1.length-1 && !(g1[i+1][j] == 1 || g1[i+1][j] == 3 || g1[i+1][j] == 4)){
							wsp2 = new ObsWidthBottom(scene);
							wsp2.moveTo(pixelSize * j + 2, pixelSize * i + 44);
							wcnt2++;
						}
						
					}else{
						if(i < g1.length-1 && !(g1[i+1][j] == 1 || g1[i+1][j] == 3 || g1[i+1][j] == 4)){
							wsp2.width = pixelSize * (wcnt2+1) - 4;
							wcnt2++;
						}else{
							wsp2 = null;
							wcnt2 = 0;
						}
						
					}
				}else{
					wcnt1 = 0;
					wcnt2 = 0;
					wsp1 = null;
					wsp2 = null;
				}
			}
			wcnt1 = 0;
			wcnt2 = 0;
			wsp1 = null;
			wsp2 = null;
		};
		for(let i = 0; i < g2.length; i++){
			//console.log(g2[i]);
			for(let j = 0; j < g2[i].length; j++){
				if(g2[i][j] == 1 || g2[i][j] == 3 || g2[i][j] == 4){
					if(hsp1 == null){
						if(i > 0 && !(g2[i-1][j] == 1 || g2[i-1][j] == 3 || g2[i-1][j] == 4)){
							hsp1 = new ObsHeightLeft(scene);
							hsp1.moveTo(pixelSize * i - 2, pixelSize * j - 16);
							hcnt1++;
						}
						
					}else{
						if(i > 0 && !(g2[i-1][j] == 1 || g2[i-1][j] == 3 || g2[i-1][j] == 4)){
							hsp1.height = pixelSize * (hcnt1+1) - 4;
							hcnt1++;
						}else{
							hsp1 = null;
							hcnt1 = 0;
						}
						
					}
					if(hsp2 == null){
						if(i < g2.length-1 && !(g2[i+1][j] == 1 || g2[i+1][j] == 3 || g2[i+1][j] == 4)){
							hsp2 = new ObsHeightRight(scene);
							hsp2.moveTo(pixelSize * i + 62, pixelSize * j - 16);
							hcnt2++;
						}
						
					}else{
						
						if(i < g2.length-1 && !(g2[i+1][j] == 1 || g2[i+1][j] == 3 || g2[i+1][j] == 4)){
							hsp2.height = pixelSize * (hcnt2+1) - 4;
							hcnt2++;
						}else{
							hsp2 = null;
							hcnt2 = 0;
						}
					}
				}else{
					hcnt1 = 0;
					hcnt2 = 0;
					hsp1 = null;
					hsp2 = null;
				}
			}
			hcnt1 = 0;
			hcnt2 = 0;
			hsp1 = null;
			hsp2 = null;
		}
	}
	/* 障害物の当たり判定クラス群 */
	/*var ObsTop = Class.create(Sprite, {
		initialize: function(target, num, scene) {
			Sprite.call(this, target.width - 4, 2);
			//this.backgroundColor = "white";
			this.x = target.x + 2;
			this.y = target.y - 1;
			obsChk[num][0] = true
			this.onenterframe = function() {
				for (let i = 0; i < obsdir.length; i++) {
					if (i != num) {
						if (this.intersect(obsdir[i][1]) == true) {
							obsChk[num][0] = false;
							obsChk[i][1] = false;
							scene.removeChild(this);
							scene.removeChild(obsdir[i][1])
						}
					}
				}
			}
			scene.addChild(this);
		}
	});
	var ObsBottom = Class.create(Sprite, {
		initialize: function(target, num, scene) {
			Sprite.call(this, target.width - 4, 2);
			//this.backgroundColor = "blue";
			this.x = target.x + 2;
			this.y = target.y + target.height - 1;
			obsChk[num][1] = true
			scene.addChild(this);
		}
	});
	var ObsLeft = Class.create(Sprite, {
		initialize: function(target, num, scene) {
			Sprite.call(this, 2, target.height - 4);
			//this.backgroundColor = "green";
			this.x = target.x - 1;
			this.y = target.y + 2;
			obsChk[num][2] = true
			this.onenterframe = function() {
				for (let i = 0; i < obsdir.length; i++) {
					if (i != num) {
						if (this.intersect(obsdir[i][3]) == true) {
							obsChk[num][2] = false;
							obsChk[i][3] = false;
							scene.removeChild(this);
							scene.removeChild(obsdir[i][3])
						}
					}
				}
			}
			scene.addChild(this);
		}
	});
	var ObsRight = Class.create(Sprite, {
		initialize: function(target, num, scene) {
			Sprite.call(this, 2, target.height - 4);
			//this.backgroundColor = "red";
			this.x = target.x + target.width - 1;
			this.y = target.y + 2;
			obsChk[num][3] = true
			scene.addChild(this);
		}
	});*/
	/* 当たり判定生成処理 */
	/*function Obstracle(target, scene) {
		obsdir[obsNum] = []
		obsChk[obsNum] = [false, false, false, false]
		obsdir[obsNum][0] = new ObsTop(target, obsNum, scene)
		obsdir[obsNum][1] = new ObsBottom(target, obsNum, scene)
		obsdir[obsNum][2] = new ObsLeft(target, obsNum, scene)
		obsdir[obsNum][3] = new ObsRight(target, obsNum, scene)
		obsNum++;
	}*/
	/* 照準反射クラス群 */
	var RefWidthTop = Class.create(Sprite, {
		initialize: function(scene){
			Sprite.call(this,56,8);
			//this.backgroundColor = 'white';
			this.onenterframe = function(){
				if(deleteFlg) scene.removeChild(this);
			}
			scene.addChild(this);
		}
	});
	var RefWidthBottom = Class.create(Sprite, {
		initialize: function(scene){
			Sprite.call(this,56,8);
			//this.backgroundColor = 'blue';
			this.onenterframe = function(){
				if(deleteFlg) scene.removeChild(this);
			}
			scene.addChild(this);
		}
	});
	var RefHeightLeft = Class.create(Sprite, {
		initialize: function(scene){
			Sprite.call(this,8,56);
			//this.backgroundColor = 'red';
			this.onenterframe = function(){
				if(deleteFlg) scene.removeChild(this);
			}
			scene.addChild(this);
		}
	});
	var RefHeightRight = Class.create(Sprite, {
		initialize: function(scene){
			Sprite.call(this,8,56);
			//this.backgroundColor = 'green';
			this.onenterframe = function(){
				if(deleteFlg) scene.removeChild(this);
			}
			scene.addChild(this);
		}
	});

	function SetRefs(scene,grid) {
		let g1 = grid;
		let g2 = grid[0].map((_, c) => grid.map(r => r[c]));
		let wsp1 = null;
		let wsp2 = null;
		let hsp1 = null;
		let hsp2 = null;
		let wcnt1 = 0;
		let wcnt2 = 0;
		let hcnt1 = 0;
		let hcnt2 = 0;
		//console.log(g1[0]);
		
		for(let i = 0; i < g1.length; i++){
			for(let j = 0; j < g1[i].length; j++){
				if(g1[i][j] == 1 || g1[i][j] == 4){
					if(wsp1 == null){
						if(i > 0 && !(g1[i-1][j] == 1 || g1[i-1][j] == 4)){
							wsp1 = new RefWidthTop(scene);
							wsp1.moveTo(pixelSize * j + 4, pixelSize * i - 16);
							wcnt1++;
						}
						
					}else{
						if(i > 0 && !(g1[i-1][j] == 1 || g1[i-1][j] == 4)){
							wsp1.width = pixelSize * (wcnt1+1) - 8;
							wcnt1++;
						}else{
							wsp1 = null;
							wcnt1 = 0;
						}
						
					}
					if(wsp2 == null){
						if(i < g1.length-1 && !(g1[i+1][j] == 1 || g1[i+1][j] == 4)){
							wsp2 = new RefWidthBottom(scene);
							wsp2.moveTo(pixelSize * j + 4, pixelSize * i + 40);
							wcnt2++;
						}
						
					}else{
						if(i < g1.length-1 && !(g1[i+1][j] == 1 || g1[i+1][j] == 4)){
							wsp2.width = pixelSize * (wcnt2+1) - 8;
							wcnt2++;
						}else{
							wsp2 = null;
							wcnt2 = 0;
						}
						
					}
					/*if(wsp1 == null && wsp2 == null){
						if(i > 0 && !(g1[i-1][j] == 1 || g1[i-1][j] == 4)){
							wsp1 = new RefWidthTop(scene);
							wsp1.moveTo(pixelSize * j + 4, pixelSize * i - 16);
						}
						if(i < g1.length-1 && !(g1[i+1][j] == 1 || g1[i+1][j] == 4)){
							wsp2 = new RefWidthBottom(scene);
							wsp2.moveTo(pixelSize * j + 4, pixelSize * i + 40);
						}
						wcnt++;
					}else{
						if(wsp1 != null)wsp1.width = pixelSize * (wcnt+1) - 8;
						if(wsp2 != null)wsp2.width = pixelSize * (wcnt+1) - 8;
						wcnt++;
					}*/
				}else{
					wcnt1 = 0;
					wcnt2 = 0;
					wsp1 = null;
					wsp2 = null;
				}
			}
			wcnt1 = 0;
			wcnt2 = 0;
			wsp1 = null;
			wsp2 = null;
		};
		for(let i = 0; i < g2.length; i++){
			//console.log(g2[i]);
			for(let j = 0; j < g2[i].length; j++){
				if(g2[i][j] == 1 || g2[i][j] == 4){
					if(hsp1 == null){
						if(i > 0 && !(g2[i-1][j] == 1 || g2[i-1][j] == 4)){
							hsp1 = new RefHeightLeft(scene);
							hsp1.moveTo(pixelSize * i, pixelSize * j - 12);
							hcnt1++;
						}
						
					}else{
						if(i > 0 && !(g2[i-1][j] == 1 || g2[i-1][j] == 4)){
							hsp1.height = pixelSize * (hcnt1+1) - 8;
							hcnt1++;
						}else{
							hsp1 = null;
							hcnt1 = 0;
						}
						
					}
					if(hsp2 == null){
						if(i < g2.length-1 && !(g2[i+1][j] == 1 || g2[i+1][j] == 4)){
							hsp2 = new RefHeightRight(scene);
							hsp2.moveTo(pixelSize * i + 56, pixelSize * j - 12);
							hcnt2++;
						}
						
					}else{
						
						if(i < g2.length-1 && !(g2[i+1][j] == 1 || g2[i+1][j] == 4)){
							hsp2.height = pixelSize * (hcnt2+1) - 8;
							hcnt2++;
						}else{
							hsp2 = null;
							hcnt2 = 0;
						}
						//hcnt2++;
					}
					/*if(hsp1 == null && hsp2 == null){
						if(i > 0 && !(g2[i-1][j] == 1 || g2[i-1][j] == 4)){
							hsp1 = new RefHeightLeft(scene);
							hsp1.moveTo(pixelSize * i, pixelSize * j - 12);
						}
						if(i < g2.length-1 && !(g2[i+1][j] == 1 || g2[i+1][j] == 4)){
							hsp2 = new RefHeightRight(scene);
							hsp2.moveTo(pixelSize * i + 56, pixelSize * j - 12);
						}
						hcnt++;
					}else{
						if(hsp1 != null)hsp1.height = pixelSize * (hcnt+1) - 8;
						if(hsp2 != null)hsp2.height = pixelSize * (hcnt+1) - 8;
						hcnt++;
					}*/
				}else{
					hcnt1 = 0;
					hcnt2 = 0;
					hsp1 = null;
					hsp2 = null;
				}
			}
			hcnt1 = 0;
			hcnt2 = 0;
			hsp1 = null;
			hsp2 = null;
		}
	}
	/* 照準反射クラス群 */
	/*var RefTop = Class.create(Sprite, {
		initialize: function(target, num, scene) {
			Sprite.call(this, target.width - 4, 8);
			//if(debugFlg)this.backgroundColor = "white";
			this.x = target.x + (2);
			this.y = target.y - 1;
			refChk[num][0] = true
			this.onenterframe = function() {
				if (scene.time == 10) {
					for (let i = 0; i < refdir.length; i++) {
						if (i != num) {
							if (this.intersect(refdir[i][1]) == true) {
								refChk[num][0] = false;
								refChk[i][1] = false;
								scene.removeChild(this);
								scene.removeChild(refdir[i][1])
							}
						}
					}
				}

			}
			scene.addChild(this);
		}
	});
	var RefBottom = Class.create(Sprite, {
		initialize: function(target, num, scene) {
			Sprite.call(this, target.width - 4, 8);
			//if(debugFlg)this.backgroundColor = "blue";
			this.x = target.x + (2);
			this.y = target.y + target.height - (this.height - 1);
			refChk[num][1] = true
			scene.addChild(this);
		}
	});
	var RefLeft = Class.create(Sprite, {
		initialize: function(target, num, scene) {
			Sprite.call(this, 8, target.height);
			//if(debugFlg)this.backgroundColor = "green";
			this.x = target.x - 1;
			this.y = target.y;
			refChk[num][2] = true
			this.onenterframe = function() {
				if (scene.time == 10) {
					for (let i = 0; i < refdir.length; i++) {
						if (i != num) {
							if (this.intersect(refdir[i][3]) == true) {
								refChk[num][2] = false;
								refChk[i][3] = false;
								scene.removeChild(this);
								scene.removeChild(refdir[i][3])
							}
						}
					}
				}

			}
			scene.addChild(this);
		}
	});
	var RefRight = Class.create(Sprite, {
		initialize: function(target, num, scene) {
			Sprite.call(this, 8, target.height);
			//if(debugFlg)this.backgroundColor = "red";
			this.x = target.x + target.width - (this.width - 1);
			this.y = target.y;
			refChk[num][3] = true
			scene.addChild(this);
		}
	});*/
	/* 当たり判定生成処理 */
	/*function RefObstracle(target, scene) {
		refdir[refNum] = []
		refChk[refNum] = [false, false, false, false]
		refdir[refNum][0] = new RefTop(target, refNum, scene)
		refdir[refNum][1] = new RefBottom(target, refNum, scene)
		refdir[refNum][2] = new RefLeft(target, refNum, scene)
		refdir[refNum][3] = new RefRight(target, refNum, scene)
		refNum++;
	}*/
	/* 戦車同士の当たり判定クラス群 */
	var TankTop = Class.create(Sprite, {
		initialize: function(target, num, scene) {
			Sprite.call(this, pixelSize - 12, 2);
			//this.backgroundColor = "white";
			this.x = target.x + 4;
			this.y = target.y - 1;
			this.onenterframe = function() {
				if(worldFlg){
					if (deadFlgs[num] == true) {
						scene.removeChild(this);
					}
					//this.x = target.x + 4;
					//this.y = target.y - 1;
					if(tankEntity[num].tank.rotation == 270){
						this.x = target.x + 4;
						this.y = target.y - 1;
						if(this.scaleY != 2) this.scaleY = 2;
						//if(this.backgroundColor != "yellow") this.backgroundColor = "yellow";
					}else{
						this.x = target.x + 4;
						this.y = target.y;
						if(this.scaleY != 1) this.scaleY = 1;
						//if(this.backgroundColor != "white") this.backgroundColor = "white";
					}
					
				}
				
			}
			scene.addChild(this);
		}
	});
	var TankBottom = Class.create(Sprite, {
		initialize: function(target, num, scene) {
			Sprite.call(this, pixelSize - 12, 2);
			//this.backgroundColor = "blue";
			this.x = target.x + 4;
			this.y = target.y + 60 - 2;
			this.onenterframe = function() {
				if(worldFlg){
					if (deadFlgs[num] == true) {
						scene.removeChild(this);
					}
					//this.x = target.x + 4;
					//this.y = target.y + 60 - 2;
					if(tankEntity[num].tank.rotation == 90){
						this.x = target.x + 4;
						this.y = target.y + 60 - 1;
						if(this.scaleY != 2) this.scaleY = 2;
						//if(this.backgroundColor != "yellow") this.backgroundColor = "yellow";
					}else{
						this.x = target.x + 4;
						this.y = target.y + 60 - 2;
						if(this.scaleY != 1) this.scaleY = 1;
						//if(this.backgroundColor != "blue") this.backgroundColor = "blue";
					}
				}
				
			}
			scene.addChild(this);
		}
	});
	var TankLeft = Class.create(Sprite, {
		initialize: function(target, num, scene) {
			Sprite.call(this, 2, pixelSize - 12);
			//this.backgroundColor = "green";
			this.x = target.x;
			this.y = target.y + 4;
			this.onenterframe = function() {
				if(worldFlg){
					if (deadFlgs[num] == true) {
						scene.removeChild(this);
					}
					//this.x = target.x;
					//this.y = target.y + 4;
					if(tankEntity[num].tank.rotation == 180){
						this.x = target.x-2;
						this.y = target.y + 4;
						if(this.scaleX != 2) this.scaleX = 2;
						//if(this.backgroundColor != "yellow") this.backgroundColor = "yellow";
					}else{
						this.x = target.x-1;
						this.y = target.y + 4;
						if(this.scaleX != 1) this.scaleX = 1;
						//if(this.backgroundColor != "green") this.backgroundColor = "green";
					}
				}
				
			}
			scene.addChild(this);
		}
	});
	var TankRight = Class.create(Sprite, {
		initialize: function(target, num, scene) {
			Sprite.call(this, 2, pixelSize - 12);
			//this.backgroundColor = "red";
			this.x = target.x + 60 - 1;
			this.y = target.y + 4;
			this.onenterframe = function() {
				if(worldFlg){
					if (deadFlgs[num] == true) {
						scene.removeChild(this);
					}
					//this.x = target.x + 60 - 1;
					//this.y = target.y + 4;
					if(tankEntity[num].tank.rotation == 0){
						this.x = target.x + 60;
						this.y = target.y + 4;
						if(this.scaleX != 2) this.scaleX = 2;
						//if(this.backgroundColor != "yellow") this.backgroundColor = "yellow";
					}else{
						this.x = target.x + 60 - 1;
						this.y = target.y + 4;
						if(this.scaleX != 1) this.scaleX = 1;
						//if(this.backgroundColor != "red") this.backgroundColor = "red";
					}
					
				}
				
			}
			scene.addChild(this);
		}
	});
	/* 戦車の当たり判定生成処理 */
	function TankFrame(target, num, scene) {
		tankDir[num] = []
		tankDir[num][0] = new TankTop(target, num, scene)
		tankDir[num][1] = new TankBottom(target, num, scene)
		tankDir[num][2] = new TankLeft(target, num, scene)
		tankDir[num][3] = new TankRight(target, num, scene)
	}

	/* カーソル描画クラス */
	var Cursor = Class.create(Sprite, {
		initialize: function(scene) {
			Sprite.call(this, base, base);
			this.backgroundColor = "#6afc"
			this.moveTo(0, 0);

			/*this.onenterframe = function(){
			    for(let i = 1; i < tankEntity.length; i++){
			        if(deadFlgs[i] == false){
			            if(this.within(tankEntity[i], 64)){
			                let vector = {
			                    x: (tankEntity[i].x + tankEntity[i].width/2) - (this.x + this.width/2),
			                    y: (tankEntity[i].y + tankEntity[i].height/2) - (this.y + this.height/2)
			                };
			                let rad = Math.atan2(vector.y, vector.x);
			                this.moveTo(this.x + Math.cos(rad)*10,this.y + Math.sin(rad)*10)
			            }
			            for(let j = 0; j < bulOb[i].length; j++){
			                if(bulStack[i][j] == true){
			                    if(this.within(bulOb[i][j], 128)){
			                        let vector = {
			                            x: (bulOb[i][j].x + bulOb[i][j].width/2) - (this.x + this.width/2),
			                            y: (bulOb[i][j].y + bulOb[i][j].height/2) - (this.y + this.height/2)
			                        };
			                        let rad = Math.atan2(vector.y, vector.x);
			                        let vector2 = Pos_to_Vec({x: (tankEntity[0].x+tankEntity[0].width/2), y: (tankEntity[0].y+tankEntity[0].height/2)},
			                        {x: (bulOb[i][j].x+bulOb[i][j].width/2), y: (bulOb[i][j].y+bulOb[i][j].height/2)});
			                        let rad2 = Math.atan2(vector2.y, vector2.x);
			                        
			                        this.moveTo(this.x + Math.cos(rad)*10 + Math.cos(colOb[i][j].rad) * (colOb[i][j].shotSpeed),this.y + Math.sin(rad)*10 + Math.sin(colOb[i][j].rad) * (colOb[i][j].shotSpeed))
			                    }
			                }
			                
			            }
			        }

			    };
			    
			}*/
			scene.addChild(this);
		}
	})
	/*var CursorArea = Class.create(Sprite,{
		initialize: function(){
			Sprite.call(this,128,128);
			var area = new Surface(128, 128);
				area.context.beginPath();
				area.context.fillStyle = 'rgba(102, 170, 255, 0.2)';
				area.context.arc(64, 64, 64, 0, Math.PI * 2, true);
				area.context.fill();
			this.image = area;
			this.onenterframe = function(){
				
				if(worldFlg){
					this.moveTo((cur.x + cur.width/2) - 64,(cur.y + cur.height/2) - 64);
				}
				if(deleteFlg) now_scene.CursorGroup.removeChild(this);
			}
			now_scene.CursorGroup.addChild(this);
		}
	})*/
	/* 戦車の車体クラス */
	var Tank = Class.create(Sprite, {
		initialize: function(area, path, num, scene, filterMap) {
			Sprite.call(this, 70, 56);
			//this.backgroundColor = "#fff";
			this.image = game.assets[path]
			this.x = area.x + 0.5;
			this.y = area.y + 1;
			this.scaleX = 0.87
			this.scaleY = 0.95
			this.onenterframe = function() {
				if(worldFlg){
					this.x = area.x - 4;
					this.y = area.y + 2;
				}
			}
			scene.TankGroup.addChild(this);
		}
	});
	/* 戦車の砲塔クラス */
	var Cannon = Class.create(Sprite, {
		initialize: function(area, path, num, scene) {
			Sprite.call(this, 144, 72);
			this.image = game.assets[path]
			this.x = area.x - 37;
			this.y = area.y - 8;
			this.scaleX = 0.675
			this.scaleY = 0.675
			this.onenterframe = function() {
				if(worldFlg){
					this.x = area.x - 41.5;
					this.y = area.y - 6.5;
				}
			}
			scene.CannonGroup.addChild(this);
		}
	});
	/* 弱点クラス */
	var Weak = Class.create(Sprite, {
		initialize: function(area, num, scene) {
			Sprite.call(this, base * (size / 1.5), base * (size / 1.5));
			//Sprite.call(this,Math.floor(base*(size/1.8)),Math.floor(base*(size/1.8)));
			//this.backgroundColor = "#f00a";
			this.onenterframe = function() {
				if(worldFlg){
					this.x = area.x + 9.25;
					this.y = area.y + 8.5;
					BombExplosion.intersect(this).forEach(elem => {
						if (victory == false && defeat == false && complete == false) deadFlgs[num] = true;
					});
				}
				
			}
			scene.addChild(this);
		},

	});
	/* 撃破後の描画クラス */
	var Mark = Class.create(Sprite, {
		initialize: function(target, scene) {
			//Sprite.call(this,base*(size/1.3),base*(size/1.3));
			Sprite.call(this, 48, 48);
			this.image = game.assets['./image/ObjectImage/mark.png'];
			//this.x = target.x+9.25;
			//this.y = target.y+12.5;
			this.x = (target.x + target.width / 2) - this.width / 2;
			this.y = ((target.y + target.height / 2) - this.height / 2) + 6;
			this.scaleY = 0.8;
			this.onenterframe = function(){
				if (deleteFlg == true) scene.MarkGroup.removeChild(this);
			}
			scene.MarkGroup.addChild(this);
		}
	});

	/* 照準クラス */
	var Aim = Class.create(Sprite, {
		initialize: function(target, cannon, shotSpeed, num, scene) {
			Sprite.call(this, base / 2, base / 2);
			if (num == 0) {
				let n_color = new Surface(base / 2, base / 2);
					n_color.context.beginPath();
					n_color.context.fillStyle = 'rgba(170, 255, 255, 0.3)';
					n_color.context.arc(size, size, size, 0, Math.PI * 2, true);
					n_color.context.fill();
				//this.backgroundColor = "#aff4"
				this.image = n_color;
			}
			/*else if(debugFlg){
			                this.backgroundColor = "#f008"
			            }*/


			let vec = Pos_to_Vec({ x: (target.x + target.width / 2), y: (target.y + target.height / 2) }, { x: (cannon.x + cannon.width / 2), y: (cannon.y + cannon.height / 2) });
			let rad = Math.atan2(vec.y, vec.x);
			this.moveTo((cannon.x + (cannon.width / 2) - 3.45) + Math.cos(rad) * (56), (cannon.y + (cannon.height / 2) - 4.5) + Math.sin(rad) * (56));
			/*this.moveTo(cannon.x+(cannon.width/2)-3.45,cannon.y+(cannon.height/2)-4.5)
			const vector = {
			    x: (target.x+target.width/2) - (cannon.x+cannon.width/2),
			    y: (target.y+target.height/2) - (cannon.y+cannon.height/2)
			};
			var rad = Math.atan2(vector.y, vector.x);*/
			var dx = Math.cos(rad) * shotSpeed;
			var dy = Math.sin(rad) * shotSpeed;
			//this.moveTo(this.x+(base*4)*Math.cos(rad), this.y+(base*4)*Math.sin(rad));
			cannon.rotation = (270 + (Math.atan2(Math.cos(rad), Math.sin(rad)) * 180) / Math.PI) * -1;
			this.rotation = (315 + (Math.atan2(dx, dy) * 180) / Math.PI) * -1;
			this.onenterframe = function() {
				if (deleteFlg == true) scene.removeChild(this);
				if(worldFlg){
					
					//this.rotation = (315 + (Math.atan2(dx, dy) * 180) / Math.PI) * -1;
					this.x += dx
					this.y += dy
				}
				
			}
			scene.addChild(this);
		}
	})
	var AnotherAim = Class.create(Sprite, {
		initialize: function(target, cannon, ref, num, scene) {
			Sprite.call(this, 8, 8);
			//if(debugFlg)this.backgroundColor = "#88f";
			//this.moveTo(cannon.x+(cannon.width/2)-5.2,cannon.y+(cannon.height/2)-5.2)
			this.time = 0;
			this.hitTime = 0;
			this.originX = 4;
			this.originY = 4;

			var rad = (cannon.rotation) * (Math.PI / 180.0);
			var dx = Math.cos(rad) * 20;
			var dy = Math.sin(rad) * 20;
			this.moveTo((cannon.x + (cannon.width / 2)) + (36 * Math.cos(rad)) - (this.width / 2), (cannon.y + (cannon.height / 2)) + (36 * Math.sin(rad)) - (this.height / 2));

			//this.moveTo((cannon.x+(cannon.width/2))+(56*Math.cos(rad))-(this.width/2+1), (cannon.y+(cannon.height/2))+(56*Math.sin(rad))-(this.height/2+1));
			//this.moveTo(this.x+(base*3)*Math.cos(rad), this.y+(base*3)*Math.sin(rad));
			let refcnt = 0;
			this.agl = cannon.rotation;
			this.tgt = [cannon.x + (cannon.width / 2) + (dx * 3), cannon.y + (cannon.height / 2) + (dy * 3)];
			//this.rotation = this.Vec_to_Rot({x: dx, y: dy});
			this.rotation = (315 + (Math.atan2(dx, dy) * 180) / Math.PI) * -1;
			this.v;
			this.f;
			this.onenterframe = function() {
				if(deleteFlg) scene.removeChild(this);
				if(worldFlg){
					this.time++;

					this.x += dx;
					this.y += dy;

					/*RefTop.intersectStrict(this).forEach(elem => {
						this.v = Rot_to_Vec(this.rotation, 315);
						this.f = Math.atan2(this.v.x, this.v.y);
						if (refcnt == 0) {
							//this.tgt[0] = (this.x + (this.width)) - (Math.cos(this.f) * (this.width / 2));
							this.tgt[0] = (this.x + (this.width/2)) - (Math.cos(this.f) * (this.y - elem.y));
							this.tgt[1] = elem.y - 2.5;
						}
						//this.x = (this.x + (this.width / 2)) - (Math.cos(this.f) * (this.width / 2));
						this.x = (this.x) - (Math.cos(this.f) * (this.y - elem.y));
						this.y = elem.y - (this.height+1);
						dy = dy * -1;
						refcnt++;
						this.rotation = (315 + (Math.atan2(dx, dy) * 180) / Math.PI) * -1;
						return;
					})
					RefBottom.intersectStrict(this).forEach(elem => {
						this.v = Rot_to_Vec(this.rotation, 315);
						this.f = Math.atan2(this.v.x, this.v.y);
						if (refcnt == 0) {
							//this.tgt[0] = (this.x + (this.width)) - (Math.cos(this.f) * (this.width / 2));
							//this.tgt[1] = elem.y + elem.height + 2.5;
							this.tgt[0] = (this.x + (this.width/2)) - (Math.cos(this.f) * (this.y - (elem.y + elem.height)));
							this.tgt[1] = elem.y + elem.height + 2.5;
						}
						//this.x = (this.x + (this.width / 2)) - (Math.cos(this.f) * (this.width / 2));
						//this.y = elem.y + elem.height + (this.height / 2);
						this.x = (this.x) - (Math.cos(this.f) * (this.y - (elem.y + elem.height)));
						this.y = elem.y + elem.height;
						dy = dy * -1;
						refcnt++;
						this.rotation = (315 + (Math.atan2(dx, dy) * 180) / Math.PI) * -1;
						return;
					})
					RefLeft.intersectStrict(this).forEach(elem => {
						this.v = Rot_to_Vec(this.rotation, 315);
						this.f = Math.atan2(this.v.x, this.v.y);
						if (refcnt == 0) {
							//this.tgt[0] = elem.x - 2.5;
							//this.tgt[1] = (this.y + (this.height)) - (Math.sin(this.f) * (this.height / 2));
							this.tgt[0] = elem.x - 2.5;
							this.tgt[1] = (this.y + (this.height/2)) - (Math.sin(this.f) * (this.x - (elem.x)));
						};
						this.x = elem.x - (this.width+1);
						this.y = (this.y) - (Math.sin(this.f) * (this.x - (elem.x)));
						//this.y = (this.y + (this.height / 2)) - (Math.sin(this.f) * (this.height / 2));
						dx = dx * -1;
						refcnt++;
						this.rotation = (315 + (Math.atan2(dx, dy) * 180) / Math.PI) * -1;
						return;
					})
					RefRight.intersectStrict(this).forEach(elem => {
						this.v = Rot_to_Vec(this.rotation, 315);
						this.f = Math.atan2(this.v.x, this.v.y);
						if (refcnt == 0) {
							this.tgt[0] = elem.x + elem.width + 2.5;
							//this.tgt[1] = (this.y + (this.height)) - (Math.sin(this.f) * (this.height / 2));
							this.tgt[1] = (this.y + (this.height/2)) - (Math.sin(this.f) * (this.x - (elem.x + elem.width)));
						};
						this.x = elem.x + elem.width + 1;
						this.y = (this.y) - (Math.sin(this.f) * (this.x - (elem.x + elem.width)));
						//this.y = (this.y + (this.height / 2)) - (Math.sin(this.f) * (this.height / 2));
						dx = dx * -1;
						refcnt++;
						this.rotation = (315 + (Math.atan2(dx, dy) * 180) / Math.PI) * -1;
						return;
					})

					if (this.intersectStrict(walls[0]) == true) {
						this.v = Rot_to_Vec(this.rotation, 315);
						this.f = Math.atan2(this.v.x, this.v.y);
						if (refcnt == 0) {

							//target.moveTo(this.x-(dx/3),walls[0].y+walls[0].height+(this.height/2));
							//tgt[0] = this.x-(this.width);
							//tgt[1] = walls[0].y+walls[0].height+(this.height/2);
							//tgt[0] = this.x-(dx/3);
							//this.tgt[0] = (this.x + (this.width)) - (Math.cos(this.f) * (this.width / 2));
							this.tgt[0] = (this.x + (this.width/2)) - (Math.cos(this.f) * (this.y - (walls[0].y + walls[0].height)));
							this.tgt[1] = walls[0].y + walls[0].height;
						}
						//this.x = this.x-(dx/3)-(this.width/2);
						//this.x = (this.x + (this.width / 2)) - (Math.cos(this.f) * (this.width / 2));
						this.x = (this.x) - (Math.cos(this.f) * (this.y - (walls[0].y + walls[0].height)));
						this.y = walls[0].y + walls[0].height;
						//this.y = walls[0].y + walls[0].height + this.height;
						//this.moveTo(this.x-(this.width),walls[0].y+walls[0].height+4)
						//this.moveTo(this.x-(dx/3)-(this.width/2),walls[0].y+walls[0].height+(this.height/2))
						dy = dy * -1;
						refcnt++;
						this.rotation = (315 + (Math.atan2(dx, dy) * 180) / Math.PI) * -1;
					}
					if (this.intersectStrict(walls[1]) == true) {
						this.v = Rot_to_Vec(this.rotation, 315);
						this.f = Math.atan2(this.v.x, this.v.y);
						if (refcnt == 0) {
							//target.moveTo(this.x-(dx/3),walls[1].y-(this.height/2));
							//tgt[0] = this.x-(this.width);
							//tgt[1] = walls[1].y-(this.height/2);
							//tgt[0] = this.x-(dx/3);
							//this.tgt[0] = (this.x + (this.width)) - (Math.cos(this.f) * (this.width / 2));
							//this.tgt[1] = walls[1].y - 2.5;
							this.tgt[0] = (this.x + (this.width/2)) - (Math.cos(this.f) * (this.y - (walls[1].y)));
							this.tgt[1] = walls[1].y;
						};
						//this.x = this.x-(dx/3)-(this.width/2);
						//this.x = (this.x + (this.width / 2)) - (Math.cos(this.f) * (this.width / 2));
						this.x = (this.x) - (Math.cos(this.f) * (this.y - (walls[1].y)));
						this.y = walls[1].y - (this.height+1);
						//this.moveTo(this.x-(this.width),walls[1].y-8)
						//this.moveTo(this.x-(dx/3)-(this.width/2),walls[1].y-(this.height))
						dy = dy * -1;
						refcnt++;
						this.rotation = (315 + (Math.atan2(dx, dy) * 180) / Math.PI) * -1;
					}

					if (this.intersectStrict(walls[2]) == true) {
						this.v = Rot_to_Vec(this.rotation, 315);
						this.f = Math.atan2(this.v.x, this.v.y);
						if (refcnt == 0) {
							//target.moveTo(walls[2].x+walls[2].width+(this.width/2),this.y-(dy/3));
							//tgt[0] = walls[2].x+walls[2].width+(this.width/2);
							//tgt[1] = this.y-(this.height);
							//this.tgt[0] = walls[2].x + walls[2].width + 2.5;
							this.tgt[0] = walls[2].x + walls[2].width;
							//tgt[1] = this.y-(dy/3)+(Math.sin(f)*(this.height/2));
							//this.tgt[1] = (this.y + (this.height)) - (Math.sin(this.f) * (this.height / 2));
							this.tgt[1] = (this.y + (this.height/2)) - (Math.sin(this.f) * (this.x - (walls[2].x + walls[2].width)));
						}

						this.x = walls[2].x + walls[2].width + 1;
						this.y = (this.y) - (Math.sin(this.f) * (this.x - (walls[2].x + walls[2].width)));
						//this.y = (this.y + (this.height / 2)) - (Math.sin(this.f) * (this.height / 2));
						//this.y = this.y-(dy/3)-(this.height/2)+(Math.sin(f)*(this.height/2));
						//this.moveTo(walls[2].x+walls[2].width+(this.width),this.y-(dy/3)-(this.height/2))
						dx = dx * -1;
						refcnt++;
						this.rotation = (315 + (Math.atan2(dx, dy) * 180) / Math.PI) * -1;
					}
					if (this.intersectStrict(walls[3]) == true) {
						this.v = Rot_to_Vec(this.rotation, 315);
						this.f = Math.atan2(this.v.x, this.v.y);
						if (refcnt == 0) {
							//target.moveTo(walls[3].x-(this.width/2),this.y-(dy/3));
							//this.tgt[0] = walls[3].x - 2.5;
							this.tgt[0] = walls[3].x;
							//tgt[1] = this.y-(dy/3);
							//this.tgt[1] = (this.y + (this.height)) - (Math.sin(this.f) * (this.height / 2));
							this.tgt[1] = (this.y + (this.height/2)) - (Math.sin(this.f) * (this.x - walls[3].x));
						}
						this.x = walls[3].x - (this.width);
						//this.y = (this.y + (this.height / 2)) - (Math.sin(this.f) * (this.height / 2));
						this.y = (this.y) - (Math.sin(this.f) * (this.x - walls[3].x));
						//this.y = this.y-(dy/3)-(this.height/2);
						//this.moveTo(walls[3].x-(this.width),this.y-(dy/3)-(this.height/2))
						dx = dx * -1;
						refcnt++;
						this.rotation = (315 + (Math.atan2(dx, dy) * 180) / Math.PI) * -1;
					}*/

					RefWidthTop.intersectStrict(this).forEach(elem => {
						this.v = Rot_to_Vec(this.rotation, 315);
						this.f = Math.atan2(this.v.x, this.v.y);
						if (refcnt == 0) {
							//this.tgt[0] = (this.x + (this.width)) - (Math.cos(this.f) * (this.width / 2));
							this.tgt[0] = (this.x + (this.width/2)) - (Math.cos(this.f) * ((elem.y) - (this.y)));
							//this.tgt[0] = (this.x + (this.width/2)) - (Math.cos(this.f) * ((this.y - (this.height)) - (elem.y)));
							this.tgt[1] = elem.y - 2.5;
						}
						this.x = (this.x) - (Math.cos(this.f) * ((elem.y) - (this.y)));
						//this.x = (this.x) - (Math.cos(this.f) * ((this.y - (this.height)) - (elem.y)));
						//this.x = (this.x) - (Math.cos(this.f) * (this.y - elem.y));
						this.y = elem.y - (this.height);
						//this.y = elem.y - (this.height+1);
						dy = dy * -1;
						//df[1] *= -1;
						refcnt++;
						this.rotation = (315 + (Math.atan2(dx, dy) * 180) / Math.PI) * -1;
						return;
					})
					RefWidthBottom.intersectStrict(this).forEach(elem => {
						this.v = Rot_to_Vec(this.rotation, 315);
						this.f = Math.atan2(this.v.x, this.v.y);
						if (refcnt == 0) {
							this.tgt[0] = (this.x + (this.width/2)) - (Math.cos(this.f) * (this.y - (elem.y + elem.height)));
							this.tgt[1] = elem.y + elem.height + 2.5;
						}
						this.x = (this.x) - (Math.cos(this.f) * (this.y - (elem.y + elem.height)));
						this.y = elem.y + elem.height;
						dy = dy * -1;
						//df[1] *= -1;
						refcnt++;
						this.rotation = (315 + (Math.atan2(dx, dy) * 180) / Math.PI) * -1;
						return;
					})
					RefHeightLeft.intersectStrict(this).forEach(elem => {
						this.v = Rot_to_Vec(this.rotation, 315);
						this.f = Math.atan2(this.v.x, this.v.y);
						if (refcnt == 0) {
							this.tgt[0] = elem.x - 2.5;
							this.tgt[1] = (this.y + (this.height/2)) - (Math.sin(this.f) * ((elem.x) - (this.x)));
							//this.tgt[1] = (this.y + (this.height/2)) - (Math.sin(this.f) * ((this.x + this.width) - (elem.x)));
						};
						this.x = elem.x - (this.width);
						//this.x = elem.x - (this.width+1);
						this.y = (this.y) - (Math.sin(this.f) * ((elem.x) - (this.x)));
						//this.y = (this.y) - (Math.sin(this.f) * ((this.x + this.width) - (elem.x)));
						//this.y = (this.y) - (Math.sin(this.f) * (this.x - (elem.x)));
						dx = dx * -1;
						//df[0] *= -1;
						refcnt++;
						this.rotation = (315 + (Math.atan2(dx, dy) * 180) / Math.PI) * -1;
						return;
					})
					RefHeightRight.intersectStrict(this).forEach(elem => {
						this.v = Rot_to_Vec(this.rotation, 315);
						this.f = Math.atan2(this.v.x, this.v.y);
						if (refcnt == 0) {
							this.tgt[0] = elem.x + elem.width + 2.5;
							this.tgt[1] = (this.y + (this.height/2)) - (Math.sin(this.f) * (this.x - (elem.x + elem.width)));
						};
						this.x = elem.x + elem.width + 1;
						this.y = (this.y) - (Math.sin(this.f) * (this.x - (elem.x + elem.width)));
						dx = dx * -1;
						//df[0] *= -1;
						refcnt++;
						this.rotation = (315 + (Math.atan2(dx, dy) * 180) / Math.PI) * -1;
						return;
					})

					if (tankEntity[num].intersectStrict(this)) {
						scene.removeChild(this);
					};
					if (this.time > 150) scene.removeChild(this);
					if (refcnt > ref) scene.removeChild(this)
				}
				

			}
			scene.addChild(this);
		}
	})

	var AnotherPAim = Class.create(Sprite, {
		initialize: function(target, cannon, ref, num, scene) {
			Sprite.call(this, 8, 8);
			//if(debugFlg)this.backgroundColor = "#88f";
			//this.moveTo(cannon.x+(cannon.width/2)-5.2,cannon.y+(cannon.height/2)-5.2)

			let n_color = new Surface(8, 8);
				n_color.context.beginPath();
				n_color.context.fillStyle = 'rgba(170, 255, 255, 0.5)';
				n_color.context.arc(4, 4, 4, 0, Math.PI * 2, true);
				n_color.context.fill();
			this.image = n_color;

			this.time = 0;
			this.hitTime = 0;
			this.originX = 4;
			this.originY = 4;

			var df = [1, 1];

			let vec = Pos_to_Vec({ x: (target.x + target.width / 2), y: (target.y + target.height / 2) }, { x: (cannon.x + cannon.width / 2), y: (cannon.y + cannon.height / 2) });
			let rad = Math.atan2(vec.y, vec.x);
			var dx = Math.cos(rad) * 20;
			var dy = Math.sin(rad) * 20;
			this.moveTo((cannon.x + (cannon.width / 2)) + (36 * Math.cos(rad)) - (this.width / 2), (cannon.y + (cannon.height / 2)) + (36 * Math.sin(rad)) - (this.height / 2));

			/*var rad = (cannon.rotation) * (Math.PI / 180.0);
			var dx = Math.cos(rad) * 20;
			var dy = Math.sin(rad) * 20;
			this.moveTo((cannon.x + (cannon.width / 2)) + (36 * Math.cos(rad)) - (this.width / 2), (cannon.y + (cannon.height / 2)) + (36 * Math.sin(rad)) - (this.height / 2));*/

			let refcnt = 0;
			this.rotation = (315 + (Math.atan2(dx, dy) * 180) / Math.PI) * -1;
			cannon.rotation = (270 + (Math.atan2(Math.cos(rad), Math.sin(rad)) * 180) / Math.PI) * -1;
			this.v;
			this.f;
			this.onenterframe = function() {
				if(deleteFlg) scene.removeChild(this);
				if(worldFlg){
					this.time++;
					
					rad = cannon.rotation * (Math.PI / 180.0);
					dx = Math.cos(rad) * 20;
					dy = Math.sin(rad) * 20;

					this.x += (dx * df[0])
					this.y += (dy * df[1])

					/*RefTop.intersectStrict(this).forEach(elem => {
						this.v = Rot_to_Vec(this.rotation, 315);
						this.f = Math.atan2(this.v.x, this.v.y);
						this.x = (this.x) - (Math.cos(this.f) * (this.y - elem.y));
						this.y = elem.y - (this.height+1);
						//dy = dy * -1;
						df[1] *= -1;
						refcnt++;
						this.rotation = (315 + (Math.atan2(dx, dy) * 180) / Math.PI) * -1;
						return;
					})
					RefBottom.intersectStrict(this).forEach(elem => {
						this.v = Rot_to_Vec(this.rotation, 315);
						this.f = Math.atan2(this.v.x, this.v.y);
						this.x = (this.x) - (Math.cos(this.f) * (this.y - (elem.y + elem.height)));
						this.y = elem.y + elem.height;
						//dy = dy * -1;
						df[1] *= -1;
						refcnt++;
						this.rotation = (315 + (Math.atan2(dx, dy) * 180) / Math.PI) * -1;
						return;
					})
					RefLeft.intersectStrict(this).forEach(elem => {
						this.v = Rot_to_Vec(this.rotation, 315);
						this.f = Math.atan2(this.v.x, this.v.y);
						this.x = elem.x - (this.width+1);
						this.y = (this.y) - (Math.sin(this.f) * (this.x - (elem.x)));
						//dx = dx * -1;
						df[0] *= -1;
						refcnt++;
						this.rotation = (315 + (Math.atan2(dx, dy) * 180) / Math.PI) * -1;
						return;
					})
					RefRight.intersectStrict(this).forEach(elem => {
						this.v = Rot_to_Vec(this.rotation, 315);
						this.f = Math.atan2(this.v.x, this.v.y);
						this.x = elem.x + elem.width + 1;
						this.y = (this.y) - (Math.sin(this.f) * (this.x - (elem.x + elem.width)));
						//dx = dx * -1;
						df[0] *= -1;
						refcnt++;
						this.rotation = (315 + (Math.atan2(dx, dy) * 180) / Math.PI) * -1;
						return;
					})*/

					/*if (this.intersectStrict(walls[0]) == true) {
						this.v = Rot_to_Vec(this.rotation, 315);
						this.f = Math.atan2(this.v.x, this.v.y);
						this.x = (this.x) - (Math.cos(this.f) * (this.y - (walls[0].y + walls[0].height)));
						this.y = walls[0].y + walls[0].height;
						//dy = dy * -1;
						df[1] *= -1;
						refcnt++;
						this.rotation = (315 + (Math.atan2(dx, dy) * 180) / Math.PI) * -1;
					}
					if (this.intersectStrict(walls[1]) == true) {
						this.v = Rot_to_Vec(this.rotation, 315);
						this.f = Math.atan2(this.v.x, this.v.y);
						this.x = (this.x) - (Math.cos(this.f) * (this.y - (walls[1].y)));
						this.y = walls[1].y - (this.height+1);
						//dy = dy * -1;
						df[1] *= -1;
						refcnt++;
						this.rotation = (315 + (Math.atan2(dx, dy) * 180) / Math.PI) * -1;
					}

					if (this.intersectStrict(walls[2]) == true) {
						this.v = Rot_to_Vec(this.rotation, 315);
						this.f = Math.atan2(this.v.x, this.v.y);
						this.x = walls[2].x + walls[2].width + 1;
						this.y = (this.y) - (Math.sin(this.f) * (this.x - (walls[2].x + walls[2].width)));
						//dx = dx * -1;
						df[0] *= -1;
						refcnt++;
						this.rotation = (315 + (Math.atan2(dx, dy) * 180) / Math.PI) * -1;
					}
					if (this.intersectStrict(walls[3]) == true) {
						this.v = Rot_to_Vec(this.rotation, 315);
						this.f = Math.atan2(this.v.x, this.v.y);
						this.x = walls[3].x - (this.width);
						this.y = (this.y) - (Math.sin(this.f) * (this.x - walls[3].x));
						//dx = dx * -1;
						df[0] *= -1;
						refcnt++;
						this.rotation = (315 + (Math.atan2(dx, dy) * 180) / Math.PI) * -1;
					}*/

					RefWidthTop.intersectStrict(this).forEach(elem => {
						this.v = Rot_to_Vec(this.rotation, 315);
						this.f = Math.atan2(this.v.x, this.v.y);
						this.x = (this.x) - (Math.cos(this.f) * ((elem.y) - (this.y)));
						//this.x = (this.x) - (Math.cos(this.f) * (this.y - elem.y));
						this.y = elem.y - (this.height);
						//this.y = elem.y - (this.height+1);
						//dy = dy * -1;
						df[1] *= -1;
						refcnt++;
						this.rotation = (315 + (Math.atan2((dx * df[0]), (dy * df[1])) * 180) / Math.PI) * -1;
						return;
					})
					RefWidthBottom.intersectStrict(this).forEach(elem => {
						this.v = Rot_to_Vec(this.rotation, 315);
						this.f = Math.atan2(this.v.x, this.v.y);
						this.x = (this.x) - (Math.cos(this.f) * (this.y - (elem.y + elem.height)));
						this.y = elem.y + elem.height+1;
						//dy = dy * -1;
						df[1] *= -1;
						refcnt++;
						this.rotation = (315 + (Math.atan2((dx * df[0]), (dy * df[1])) * 180) / Math.PI) * -1;
						return;
					})
					RefHeightLeft.intersectStrict(this).forEach(elem => {
						this.v = Rot_to_Vec(this.rotation, 315);
						this.f = Math.atan2(this.v.x, this.v.y);
						this.x = elem.x - (this.width);
						//this.x = elem.x - (this.width+1);
						this.y = (this.y) - (Math.sin(this.f) * ((elem.x) - (this.x)));
						//this.y = (this.y) - (Math.sin(this.f) * ((this.x + this.width) - (elem.x)));
						//this.y = (this.y) - (Math.sin(this.f) * (this.x - (elem.x)));
						//dx = dx * -1;
						df[0] *= -1;
						refcnt++;
						this.rotation = (315 + (Math.atan2((dx * df[0]), (dy * df[1])) * 180) / Math.PI) * -1;
						return;
					})
					RefHeightRight.intersectStrict(this).forEach(elem => {
						this.v = Rot_to_Vec(this.rotation, 315);
						this.f = Math.atan2(this.v.x, this.v.y);
						this.x = elem.x + elem.width+1;
						this.y = (this.y) - (Math.sin(this.f) * (this.x - (elem.x + elem.width)));
						//dx = dx * -1;
						df[0] *= -1;
						refcnt++;
						this.rotation = (315 + (Math.atan2((dx * df[0]), (dy * df[1])) * 180) / Math.PI) * -1;
						return;
					})

					if (this.time > 150) scene.removeChild(this);
					if (refcnt > ref) scene.removeChild(this)
				}
				

			}
			scene.addChild(this);
		}
	})

	/* 照準クラス */
	var AnotherPoint = Class.create(Sprite, {
		initialize: function(target, num, scene) {
			Sprite.call(this, 4, 4);
			//if(debugFlg)this.backgroundColor = "white";
			//this.rotation = 45;
			this.moveTo(target.x + (target.width / 2), target.y + (target.height / 2))
			this.time = 0;
			scene.addChild(this);
		}
	})
	/* 弾の弾道クラス */
	var BulAim = Class.create(Sprite, {
		initialize: function(target, shotSpeed, num, value, scene) {
			Sprite.call(this, base / 2, base / 2);
			//this.backgroundColor = "#aff8"
			this.moveTo(target.x, target.y)
			this.time = 0;
			var rad = (target.rotation - 90) * (Math.PI / 180.0);
			var dx = Math.cos(rad) * shotSpeed;
			var dy = Math.sin(rad) * shotSpeed;
			this.target = target;

			this.onenterframe = function() {
				if (deleteFlg == true) scene.removeChild(this);
				if(worldFlg){
					
					this.x += dx;
					this.y += dy;
					if (bulStack[num][value] == false) scene.removeChild(this);
				}
				
			}
			scene.addChild(this);
		}
	})
	/* プレイヤーの弾の弾道クラス */
	var PlayerBulAim = Class.create(Sprite, {
		initialize: function(target, shotSpeed, num, value, scene) {
			Sprite.call(this, base / 2, base / 2);
			//this.backgroundColor = "#aff8"
			//this.debugColor = "white"
			this.moveTo((target.x + target.width/2) - (this.width/2), (target.y + target.height/2) - this.height/2);
			this.time = 0;
			var rad = (target.rotation - 90) * (Math.PI / 180.0);
			var dx = Math.cos(rad) * (shotSpeed * 1.5);
			var dy = Math.sin(rad) * (shotSpeed * 1.5);
			this.target = target;

			this.onenterframe = function() {
				if (deleteFlg == true) scene.removeChild(this);
				if(worldFlg){
					
					this.x += dx
					this.y += dy
					if (bulStack[num][value] == false) scene.removeChild(this)
				}
				
			}
			scene.addChild(this);
		}
	})
	/* 弾丸の物理判定クラス */
	var BulletCol = Class.create(PhyCircleSprite, {
		initialize: function(target, cannon, shotSpeed, grade, scene) {
			PhyCircleSprite.call(this, 2.5, enchant.box2d.DYNAMIC_SPRITE, 0.0, 0.0, 1.0, true)
			//this.backgroundColor = "white"
			this.time = 0;
			this.shotSpeed = shotSpeed;
			this.cannon = cannon;
			this.target = target;
			this.scene = scene;
			let random0 = 0;
			let random1 = 0;
			if (grade == 10 || grade == 3) {
				random0 = (Math.floor(Math.random() * 15) - 7.5) / 2;
				random1 = (Math.floor(Math.random() * 15) - 7.5) / 2;
			} else if (grade == 11) {
				random0 = (Math.floor(Math.random() * 40) - 20) / 2;
				random1 = (Math.floor(Math.random() * 40) - 20) / 2;
			} else if (grade == 6 || grade == 5) {
				random0 = (Math.floor(Math.random() * 30) - 15) / 2;
				random1 = (Math.floor(Math.random() * 30) - 15) / 2;
			} else if (grade >= 2) {
				random0 = (Math.floor(Math.random() * 20) - 10) / 2;
				random1 = (Math.floor(Math.random() * 20) - 10) / 2;
			}
			let vec = Rot_to_Vec(cannon.rotation + (random0 + random1), 0);
			let rad = Math.atan2(vec.y, vec.x);
			this.vec = vec;
			this.rad = rad;
			this.moveTo((cannon.x + (cannon.width / 2)) + Math.cos(rad) * (60) - 2.25, (cannon.y + (cannon.height / 2)) + Math.sin(rad) * (60) - 3);
			/*this.moveTo(cannon.x+(cannon.width/2)-2.25,cannon.y+(cannon.height/2)-3)
			var rad = (cannon.rotation+(random0+random1)) * (Math.PI / 180.0);
			this.moveTo(this.x+(base*3.8)*Math.cos(rad), this.y+(base*3.8)*Math.sin(rad));*/
			//this.applyImpulse(new b2Vec2(Math.cos(rad) * (shotSpeed*2), Math.sin(rad) * (shotSpeed*2)));
			this.applyImpulse(new b2Vec2(Math.cos(rad) * (shotSpeed), Math.sin(rad) * (shotSpeed)));

			this.onenterframe = function() {
				if(worldFlg){
					this.vec = { x: this.vx, y: this.vy };
					this.rad = Math.atan2(this.vec.y, this.vec.x);
					this.time++
					if (this.time % 10 == 0) new Smoke(this, scene)
				}
				
			}
		}
	})
	/* 弾丸クラス */
	var Bullet = Class.create(Sprite, {
		initialize: function(target, cannon, ref, num, shotSpeed, scene, value) {
			Sprite.call(this, 12, 18);
			this.image = game.assets['./image/ObjectImage/R2.png'];

			this.time = 0;

			this.cannon = cannon;
			this.target = target;
			this.scene = scene;
			this.shotSpeed = shotSpeed;
			this.num = num;
			this.value = value;

			var rcnt = 0; //反射回数計測
			var rcnt2 = 0; //反射時の効果音制御変数
			var rflg = false; //反射フラグ
			let timeCnt = 0;
			let judge = false;
			this.force = { x: 0, y: 0 };
			if (shotSpeed >= 14) {
				this.force = { x: target.vx / (target.shotSpeed * ((target.shotSpeed / 3) * 2)), y: target.vy / (target.shotSpeed * ((target.shotSpeed / 3) * 2)) };
				/*if(shotSpeed > 24){
				    this.scaleY = 1.5;
				}*/
			}

			//alert(this.force.x + "  " + this.force.y)
			let cnt = 0;
			this.rotation = ((Math.atan2(Math.cos(target.rad), Math.sin(target.rad)) * 180) / Math.PI) * -1 + 90;
			this.moveTo(target.centerX - (this.width / 2) - (this.force.x), target.centerY - (target.height / 2 + this.height / 3) - (this.force.y))
			this.onenterframe = function() {
				if (deleteFlg == true) scene.BulGroup.removeChild(this);
				if(worldFlg){
					if (this.time % 2) {
						cnt = 0;
						if (num != 0) {
							new BulAim(this, 24, num, value, scene)
						} else {
							new PlayerBulAim(this, 24, num, value, scene)
						}
					}
					

					this.time++;
					judge = false;
					if (shotSpeed >= 14) {
						if (this.time % 2 == 0) new Fire(this, scene);
						this.force = { x: target.vx / (target.shotSpeed * ((target.shotSpeed / 3) * 2)), y: target.vy / (target.shotSpeed * ((target.shotSpeed / 3) * 2)) };

					}
					/*var vector = {
						x: target.centerX-(this.width/2) - this.x,
						y: target.centerY-(target.height/2 + this.height/3) - this.y
					};
					this.rad = Math.atan2(vector.y, vector.x);
					this.rotation = (180+(Math.atan2(Math.cos(this.rad), Math.sin(this.rad)) * 180) / Math.PI)*-1;
					this.moveTo(target.centerX-(this.width/2),target.centerY-(target.height/2 + this.height/3))*/

					this.rotation = Vec_to_Rot(target.vec) + 180;
					this.moveTo(target.centerX - (this.width / 2) - (this.force.x), target.centerY - (target.height / 2 + this.height / 3) - (this.force.y))


					Floor.intersectStrict(this).forEach(elem => {
						if (rflg == false && cnt == 0) {
							cnt++;
							rcnt++;
							rflg = true;
							this.time = 0
						}
						judge = true;
						return;
					})
					Wall.intersectStrict(this).forEach(elem => {
						if (rflg == false && cnt == 0) {
							cnt++;
							rcnt++;
							rflg = true;
							this.time = 0
						}
						judge = true;
						return;
					})
					/*for (let elem of floors) {
						if (this.intersectStrict(elem)) {
							if (rflg == false && cnt == 0) {
								cnt++;
								rcnt++;
								rflg = true;
								this.time = 0
							}
							break;
						}
					};
					for (let elem of walls) {
						if (this.intersectStrict(elem)) {
							if (rflg == false && cnt == 0) {
								cnt++;
								rcnt++;
								rflg = true;
								this.time = 0
							}
							break;
						}
					};*/
					/*Floor.intersectStrict(this).forEach(function(){
						if(rflg == false){
							rcnt++;
							rflg = true;
							this.time = 0
						}
					})
					Wall.intersectStrict(this).forEach(function(){
						if(rflg == false){
							rcnt++;
							rflg = true;
							this.time = 0
						}
					})*/
					if (rflg == true) {
						timeCnt++;
						
						/*for (let elem of floors) {
							if (this.intersectStrict(elem) == true) {
								judge = true;
								break;
							};
						};
						for (let elem of walls) {
							if (this.intersectStrict(elem) == true) {
								judge = true;
								break;
							};
						};*/
						/*floors.forEach(elem=>{
							if(this.intersectStrict(elem)==true) judge = true;
						})*/
						/*walls.forEach(elem=>{
							if(this.intersectStrict(elem)==true) judge = true;
						})*/
						if (timeCnt >= 45) {
							rflg = false;
							timeCnt = 0;
						} else if (judge == false) {
							rflg = false;
							timeCnt = 0;
						}

					}

					if (rcnt > ref) {
						new TouchFire(this, scene);
						Get_NewBullet(num, value);
						/*target.moveTo(-100,-100)
						scene.BulGroup.removeChild(target);
						target.destroy()
						game.assets['./sound/Sample_0000.wav'].clone().play();*/
						//game.assets['./sound/Sample_0004.wav'].clone().play();

						//scene.removeChild(target);
					}
					if (this.intersectStrict(target) == false) {
						new TouchFire(this, scene);
						/*bullets[num]--;
						game.assets['./sound/Sample_0000.wav'].clone().play();
						//game.assets['./sound/Sample_0004.wav'].clone().play();
						this.moveTo(-100,-100)
						bulStack[num][value] = false;
						scene.BulGroup.removeChild(this);
						//scene.removeChild(this);*/
						Get_NewBullet(num, value);
					}
					/*for(var i = 0;  i < max;  i++){
						for(var j = 0; j < max; j++){
							if (bulOb[num][i].intersectStrict(bulOb[num][j])==true&&i != j) {
								if(bulStack[num][i] == true && bulStack[num][j]==true){
									game.assets['./sound/Sample_0000.wav'].clone().play();
									new TouchFire(bulOb[num][i],scene);
									new TouchFire(bulOb[num][j],scene);
									Get_NewBullet(num,i);
									Get_NewBullet(num,j);
								}
								
							}
						}
						for(var j = 0; j < bulOb.length; j++){
							for(var k = 0; k < bulOb[j].length; k++){
								if(j != num){
									if (bulOb[num][i].intersectStrict(bulOb[j][k])==true) {
										if(bulStack[num][i] == true && bulStack[j][k]==true){
											game.assets['./sound/Sample_0000.wav'].clone().play();
											new TouchFire(bulOb[num][i],scene);
											new TouchFire(bulOb[j][k],scene);
											Get_NewBullet(num,i);
											Get_NewBullet(j,k);
										}
										
									}
								}
								
							}
						}
					}*/
					Bullet.intersectStrict(this).forEach(elem => {
						if (!(this.num == elem.num && this.value == elem.value)) {
							if (bulStack[this.num][this.value] == true && bulStack[elem.num][elem.value] == true) {
								game.assets['./sound/Sample_0000.wav'].clone().play();
								new TouchFire(bulOb[this.num][this.value], scene);
								new TouchFire(bulOb[elem.num][elem.value], scene);
								Get_NewBullet(this.num, this.value);
								Get_NewBullet(elem.num, elem.value);
							}
						}

					})

					if (rcnt != rcnt2 && rcnt <= ref) {
						game.assets['./sound/s_car_trunk_O.wav'].clone().play();
						rcnt2 = rcnt;
					}
				}
				
			}
		}
	});
	var Get_NewBullet = function(num, val) {
		/*let cannon = new Sprite({
		    width: 1,
		    height: 1,
		    x: -100,
		    y: -100
		});
		let target = new PhyCircleSprite(2.5, enchant.box2d.DYNAMIC_SPRITE, 0.0, 0.0, 1.0, true)*/

		bullets[num]--;
		if(bullets[num] < 0) bullets[num] = 0;
		game.assets['./sound/Sample_0000.wav'].clone().play();
		bulStack[num][val] = false;

		/*colOb[num][val].moveTo(-100,-100);
		bulOb[num][val].moveTo(-200,-200);*/

		colOb[num][val].destroy();
		now_scene.BulGroup.removeChild(colOb[num][val]);
		now_scene.BulGroup.removeChild(bulOb[num][val]);

		bulOb[num][val] = new Sprite({
			width: 1,
			height: 1,
			x: -100,
			y: -100
		});

		/*colOb[num][val] = new BulletCol(target,cannon,1,0,num,now_scene,val);
		bulOb[num][val] = new Bullet(colOb[num][val],cannon,0,num,0,1,now_scene,val);
		colOb[num][val].moveTo(-100,-100);
		bulOb[num][val].moveTo(-200,-200);*/
	};

	/* 爆弾クラス */
	var Bom = Class.create(Sprite, {
		initialize: function(area, num, scene) {
			Sprite.call(this, base * 2, base * 2);
			//this.backgroundColor = "yellow";
			this.moveTo(area.x - base + 33.5, area.y - base + 32);
			this.time = 0;
			let bombFlg = false;
			let bomb = this;
			var n_color = new Surface(base * 2, base * 2);
			n_color.context.beginPath();
			n_color.context.fillStyle = 'rgba(255, 255, 0, 1)';
			n_color.context.arc(base, base, base, 0, Math.PI * 2, true);
			n_color.context.fill();

			var a_color = new Surface(base * 2, base * 2);
			a_color.context.beginPath();
			a_color.context.fillStyle = 'rgba(255, 0, 0, 1)';
			a_color.context.arc(base, base, base, 0, Math.PI * 2, true);
			a_color.context.fill();

			this.image = n_color;
			this.scaleY = 0.9

			this.onenterframe = function() {
				if (deleteFlg == true) scene.BomGroup.removeChild(this);
				if(worldFlg){
					this.time++
					this.intersectStrict(BombExplosion).forEach(function() {
						if (victory == false && defeat == false) {
							new BombExplosion(bomb, num, scene)
							bomb.moveTo(-900, -900);
							scene.BomGroup.removeChild(bomb);
						}
					})
					if(this.time > 180 && !bombFlg){
						tankEntity.forEach(elem => {
							if (this.within(elem,120) || this.time > 555) {
								bombFlg = true;
								this.time = 0;
							}
						})
					}
					/*tankEntity.forEach(elem => {
						if (this.time > 180) {
							if ((this.intersect(elem) || this.time > 555) && bombFlg == false) {
								bombFlg = true;
								this.time = 0;
							}
						}
					})*/
					if (bombFlg == true && victory == false && defeat == false) {
						if (this.time % 4 == 0) {
							this.image = a_color;
							//this.backgroundColor = "red"
						} else if (this.time % 2 == 0) {
							this.image = n_color;
							//this.backgroundColor = "yellow"
						}
						if (this.time % 6 == 0) {
							game.assets['./sound/Sample_0010.wav'].clone().play();
						}
						if (this.time == 45) {
							new BombExplosion(this, num, scene);
							this.moveTo(-900, -900);
							scene.BomGroup.removeChild(this);
						}
					}
					Bullet.intersectStrict(this).forEach(elem => {
						if (bulStack[elem.num][elem.value] == true && victory == false && defeat == false) {
							Get_NewBullet(elem.num, elem.value);
							new BombExplosion(this, num, scene)
							scene.BomGroup.removeChild(this);
						}
					})
				}
			}
		}
	})
	/* 弾の煙描画クラス */
	var Smoke = Class.create(Sprite, {
		initialize: function(area, scene) {
			Sprite.call(this, 12, 12);
			this.backgroundColor = "#aaa";
			this.time = 0;
			this.moveTo(area.x - 3.5, area.y - 1);
			let value = 0.5;
			this.opacity = value;

			this.onenterframe = function() {
				if (deleteFlg == true) scene.SmokeGroup.removeChild(this);
				if(worldFlg){
					this.time++
					if (this.time % 4 == 0) {
						if (value < 0.1) scene.SmokeGroup.removeChild(this);
						value -= 0.05;
						this.opacity = value;
						this.rotation = area.rotation
						
						//if(value < 0) scene.removeChild(this);
					}
				}
				
			}
			scene.SmokeGroup.addChild(this);
		}
	})
	/* ミサイルの炎描画クラス */
	var Fire = Class.create(Sprite, {
		initialize: function(area, scene) {
			Sprite.call(this, 12, 12);
			this.opacity = 0;
			this.originX = 6;
			this.originY = 6;
			this.backgroundColor = "#f20";
			this.time = 0;

			let value = 0.8;
			if (area.shotSpeed > 19) {
				this.backgroundColor = "#8cf";
				value = 1.0;
			}
			this.opacity = value;

			let vector = Rot_to_Vec(area.rotation, 90);
			let rad = Math.atan2(vector.y, vector.x);

			let dx = Math.cos(rad) * (6);
			let dy = Math.sin(rad) * (6);
			//this.rotation = ((Math.atan2(dx, dy) * 180) / Math.PI)*-1;
			this.rotation = area.rotation;
			this.moveTo((area.x + area.width / 2 - this.width / 2) + dx, (area.y + area.height / 2 - this.height / 2) + dy);
			//this.moveTo(target.centerX-(this.width/2)-(this.force.x),target.centerY-(target.height/2 + this.height/3)-(this.force.y))
			/*this.moveTo(area.x-3,area.y-3);
			const vector = {
			    x: area.x - this.x,
			    y: area.y - this.y
			};

			this.rad = Math.atan2(vector.y, vector.x);
			this.moveTo(this.x+6*Math.cos(this.rad), this.y+9*Math.sin(this.rad));*/


			this.onenterframe = function() {
				if(worldFlg){
					this.time++
					this.rotation = area.rotation;
					value -= 0.1;
					this.opacity = value;
					if (value < 0.1) scene.FireGroup.removeChild(this);
				}
				if(deleteFlg == true) scene.FireGroup.removeChild(this);
				
			}
			scene.FireGroup.addChild(this);
		}
	})
	/* 着弾描画クラス */
	var TouchFire = Class.create(Sprite, {
		initialize: function(area, scene) {
			Sprite.call(this, 24, 24);
			this.opacity = 0;
			this.originX = 12;
			this.originY = 12;
			this.backgroundColor = "#f30";
			if (area.shotSpeed > 19) this.backgroundColor = "#44f";
			this.time = 0;

			let vector = Rot_to_Vec(area.rotation, 270);
			let rad = Math.atan2(vector.y, vector.x);

			let dx = Math.cos(rad) * (6);
			let dy = Math.sin(rad) * (6);
			//this.rotation = ((Math.atan2(dx, dy) * 180) / Math.PI)*-1;
			this.rotation = area.rotation;
			//this.moveTo((area.x + area.width/2) + dx + this.width/2, (area.y + area.height/2) + dy + this.height/2);
			this.moveTo((area.x + area.width / 2 - this.width / 2) + dx, (area.y + area.height / 2 - this.height / 2) + dy);
			/*this.moveTo(area.x,area.y);

			const vector = {
			    x: area.x-6 - this.x,
			    y: area.y-4 - this.y
			};

			this.rad = Math.atan2(vector.y, vector.x);
			this.moveTo(this.x+6*Math.cos(this.rad), this.y+9*Math.sin(this.rad));*/
			let value = 0.8;
			this.opacity = value;

			this.onenterframe = function() {
				if(deleteFlg == true) scene.FireGroup.removeChild(this);
				if(worldFlg){
					this.time++
					value -= 0.1;
					this.opacity = value;
					this.rotation = area.rotation + this.time
					if (value < 0) scene.FireGroup.removeChild(this);
				}
				
			}
			scene.FireGroup.addChild(this);
		}
	})
	/* 発砲描画クラス */
	var OpenFire = Class.create(Sprite, {
		initialize: function(area, target, scene) {
			Sprite.call(this, 24, 24);
			this.backgroundColor = "#f40";
			this.time = 0;
			this.moveTo(area.x + 62, area.y + 24);

			const vector = {
				x: this.x + 6.5 - target.x,
				y: this.y + 3 - target.y
			};

			this.rad = Math.atan2(vector.y, vector.x);
			this.moveTo(area.x + 62 + Math.cos(this.rad) * -40, area.y + 24 + Math.sin(this.rad) * -40);
			let value = 1.0;
			this.opacity = value;

			this.onenterframe = function() {
				if(deleteFlg == true) scene.FireGroup.removeChild(this);
				if(worldFlg){
					this.time++
					this.scaleX = 1 - (value / 2);
					this.scaleY = 1 - (value / 2);
					value -= 0.1;
					this.x += Math.cos(this.rad) * -3;
					this.y += Math.sin(this.rad) * -3;
					this.opacity = value;
					this.rotation = (180 + (Math.atan2(Math.cos(this.rad), Math.sin(this.rad)) * 180) / Math.PI) * -1;
					if (value < 0) scene.FireGroup.removeChild(this);
				}
				
			}
			scene.FireGroup.addChild(this);
		}
	})

	var Flash = Class.create(Sprite,{
		initialize: function(target){
			Sprite.call(this,60,60);
			this.time = 0;
			var shadow = new Surface(60, 60);
				shadow.context.beginPath();
				shadow.context.fillStyle = 'rgba(180, 180, 255, 1)';
				shadow.context.arc(30, 30, 30, 0, Math.PI * 2, true);
				shadow.context.fill();
			this.image = shadow;
			this.originX = 30;
			this.originY = 30;
			this.scaleY = 0.8;
			this.opacity = 1.0;
			this.moveTo(target.x,target.y);
			this.onenterframe = function(){
				if(worldFlg){
					this.time++;
					if(this.time % 2 == 0 && this.opacity > 0){
						this.opacity -= 0.1;
						this.scaleX += 0.1;
						this.scaleY += 0.08;
					}
					if(this.opacity <= 0){
						now_scene.removeChild(this);
					}
				}
				
			}
			now_scene.addChild(this);
		}
	})
	/* 敵判断範囲クラス一覧 */
	//  用途：主に弾の感知
	//1
	var Intercept420 = Class.create(Sprite, {
		initialize: function(area, scene) {
			Sprite.call(this, 420, 420);
			//this.backgroundColor = "#0ff2";
			this.onenterframe = function() {
				//if(deleteFlg == true) scene.removeChild(this);
				this.moveTo(area.x - 210 + 33.5, area.y - 210 + 32);
			}
			scene.addChild(this);
		}
	})
	//2
	var Intercept280 = Class.create(Sprite, {
		initialize: function(area, scene) {
			Sprite.call(this, 280, 280);
			this.rotation = (45)
			//this.backgroundColor = "#0ff2";
			this.onenterframe = function() {
				//if(deleteFlg == true) scene.removeChild(this);
				this.moveTo(area.x - 140 + 33.5, area.y - 140 + 33.5);
				this.rotation += 45
			}
			scene.addChild(this);
		}
	})
	//3
	var Intercept192 = Class.create(Sprite, {
		initialize: function(area, scene) {
			Sprite.call(this, 192, 192);
			//this.backgroundColor = "#0ff2";
			this.onenterframe = function() {
				//if(deleteFlg == true) scene.removeChild(this);
				this.moveTo(area.x - 96 + 33.5, area.y - 96 + 33.5);
				this.rotation = area.rotation
			}
			scene.addChild(this);
		}
	})
	//4
	var Intercept600 = Class.create(Sprite, {
		initialize: function(area, scene) {
			Sprite.call(this, 600, 600);
			//this.backgroundColor = "#0ff2";
			this.rotation = 45
			this.onenterframe = function() {
				//if(deleteFlg == true) scene.removeChild(this);
				this.moveTo(area.x - 300 + 33.5, area.y - 300 + 33.5);
			}
			scene.addChild(this);
		}
	})
	var Intercept96 = Class.create(Sprite, {
		initialize: function(area, scene) {
			Sprite.call(this, 96, 96);
			//this.backgroundColor = "#0ff2";
			this.originX = 48;
			this.originY = 48;
			this.rotation = 45;
			this.onenterframe = function() {
				//if(deleteFlg == true) scene.removeChild(this);
				this.moveTo(area.x - 48 + 32, area.y - 48 + 30);
			}
			scene.addChild(this);
		}
	})
	var InterceptA = Class.create(Sprite, {
		initialize: function(cannon, scene) {
			Sprite.call(this, 240, 240);
			//this.backgroundColor = "#0f04";
			this.onenterframe = function() {
				//if(deleteFlg == true) scene.removeChild(this);
				var rad = cannon.rotation * (Math.PI / 180.0);
				var dx = Math.cos(rad) * (cannon.width - 32);
				var dy = Math.sin(rad) * (cannon.width - 32);
				this.moveTo(cannon.x - (this.width / 4) + dx + 12, cannon.y - (this.height / 4 + cannon.height / 4) + dy - 6);
				this.rotation = cannon.rotation + 45;
			}
			scene.addChild(this);
		}
	});
	var InterceptB = Class.create(Sprite, {
		initialize: function(cannon, scene) {
			Sprite.call(this, 240, 240);
			//this.backgroundColor = "#0f04";
			this.onenterframe = function() {
				//if(deleteFlg == true) scene.removeChild(this);
				var rad = cannon.rotation * (Math.PI / 180.0);
				var dx = Math.cos(rad) * (cannon.width - 32);
				var dy = Math.sin(rad) * (cannon.width - 32);
				this.moveTo(cannon.x - (this.width / 4) + dx + 12, cannon.y - (this.height / 4 + cannon.height / 4) + dy - 6);
				this.rotation = cannon.rotation;
			}
			scene.addChild(this);
		}
	});
	var InterceptC = Class.create(Sprite, {
		initialize: function(cannon, scene) {
			Sprite.call(this, cannon.width / 2, 8);
			//this.backgroundColor = "#0f04";
			this.originX = 0;
			let vec;
			let rad;
			this.onenterframe = function() {
				vec = Rot_to_Vec(cannon.rotation, 0);
				rad = Math.atan2(vec.y, vec.x);
				this.moveTo((cannon.x + (cannon.width / 2) - 3) + Math.cos(rad) * (32), (cannon.y + (cannon.height / 2) - 3) + Math.sin(rad) * (32));
				//if(deleteFlg == true) scene.removeChild(this);
				//var rad = cannon.rotation * (Math.PI / 180.0);
				//var dx = Math.cos(rad)*(cannon.width/2);
				//var dy = Math.sin(rad)*(cannon.width/2);
				//this.moveTo(cannon.x-(cannon.width/4)+dx+cannon.width/4, cannon.y-(this.height/2)+dy+cannon.width/4);
				this.rotation = cannon.rotation;
			}
			scene.addChild(this);
		}
	});
	var InterceptF = Class.create(Sprite, {
		initialize: function(cannon, scene) {
			Sprite.call(this, cannon.width * 4, 8);
			//this.backgroundColor = "#0f04";
			this.onenterframe = function() {
				//if(deleteFlg == true) scene.removeChild(this);
				var rad = cannon.rotation * (Math.PI / 180.0);
				var dx = Math.cos(rad) * (cannon.width * 2);
				var dy = Math.sin(rad) * (cannon.width * 2);
				this.moveTo(cannon.x - (cannon.width * 2.5) + dx + cannon.width, cannon.y - (this.height / 2) + dy + cannon.width / 4);
				this.rotation = cannon.rotation;
			}
			scene.addChild(this);
		}
	});
	/* 撃破時の爆破描画クラス */
	var Explosion = Class.create(Sprite, {
		initialize: function(point, scene) {
			Sprite.call(this, 100, 100, point);
			this.backgroundColor = "red";
			this.time = 0;
			var value = 1.0;
			this.opacity = value;
			this.moveTo((point.x + point.width / 2) - this.width / 2, (point.y + point.height / 2) - this.height / 2);
			//this.moveTo(point.x-12,point.y-12)
			this.onenterframe = function() {
				//if(deleteFlg == true) scene.removeChild(this);
				if(worldFlg){
					this.time++;
					this.rotation += 45;
					if (this.time % 2 == 0) {
						value -= 0.05;
						this.opacity = value;
					}
					if (value < 0.1) scene.removeChild(this);
				}
				
			}
			scene.addChild(this);
		}
	})
	/* 爆破の描画クラス */
	var BombExplosion = Class.create(Sprite, {
		initialize: function(point, num, scene) {
			Sprite.call(this, 200, 200, point);
			boms[num] -= 1;
			this.backgroundColor = "red";
			this.time = 0;
			var value = 1.0;
			this.opacity = value;
			this.moveTo(point.x - 78, point.y - 78)
			this.onenterframe = function() {
				if (deleteFlg == true) scene.removeChild(this);
				if(worldFlg){
					this.time++;
					this.rotation += 45;
					if (this.time % 2 == 0) {
						value -= 0.1;
						this.opacity = value;
					}
					if (value < 0) {
						this.moveTo(-1000, -1000)
						if (this.time > 20) {
							scene.removeChild(this);
						}
					}
				}
				

			}
			scene.addChild(this);
			game.assets['./sound/mini_bomb2.mp3'].play();
		}
	})

	/* 敵が狙う対象を追いかけるクラス */
	var Target = Class.create(Sprite, {
		initialize: function(num, scene) {
			Sprite.call(this, 40, 40);
			//this.backgroundColor = "#0f0a"
			this.debugColor = "yellow"
			let speed = 32;
			this.rotation = 90;
			this.originX = 20;
			this.originY = 20;
			let target, rad, dx, dy;
			let prediction = [0, 0];
			this.moveTo(tankEntity[0].x, tankEntity[0].y)
			/*let p = new Sprite(8,8);
			p.moveTo(0,0);
			p.backgroundColor = 'bule';
			scene.addChild(p);*/
			this.onenterframe = function() {
				if(worldFlg){
					if(!deadFlgs[num]){
						if(target != enemyTarget[num])target = enemyTarget[num];

						if (enemyTarget[num] == tankEntity[0]) {
							rad = (target.rotation) * (Math.PI / 180.0);
							dx = Math.cos(rad) * (target.width / 4);
							dy = Math.sin(rad) * (target.height / 4);
							this.rotation = (135 + (Math.atan2(dx, dy) * 180) / Math.PI) * -1;
						} else {
							rad = (target.rotation + 270) * (Math.PI / 180.0);
							dx = Math.cos(rad) * (target.width);
							dy = Math.sin(rad) * (target.height);
							this.rotation = (45 + (Math.atan2(dx, dy) * 180) / Math.PI) * -1;
						}
						//p.moveTo(this.x,this.y);
						//this.rotation = (315+(Math.atan2(dx, dy) * 180) / Math.PI)*-1;
						switch(this.intersect(target)){
							case false:
								var vector = {
									x: (target.x + target.width/2) - (this.x + this.width/2),
									y: (target.y + target.height/2) - (this.y + this.height/2)
								};
								this.rad = Math.atan2(vector.y, vector.x);
								this.moveTo(this.x + Math.cos(this.rad) * speed, this.y + Math.sin(this.rad) * speed)
								break;
							case true:
								prediction = [(target.x + target.width / 2) + (dx - (this.width / 2)), (target.y + target.height / 2) + (dy - (this.height / 2))];
								this.moveTo(prediction[0], prediction[1]);
								break;
						}
					}
					
				}
				
			}
			scene.addChild(this);
		}
	})
	/* 経路探索アルゴリズム */
	var findShortestPath = function(startCoordinates, grid, scene) {
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
			var newLocation = exploreInDirection(currentLocation, 'North', grid, scene);
			if (newLocation.status === 'Goal') {
				return newLocation.path;
			} else if (newLocation.status === 'Valid') {
				queue.push(newLocation);
			}

			// 東を調べる
			var newLocation = exploreInDirection(currentLocation, 'East', grid, scene);
			if (newLocation.status === 'Goal') {
				return newLocation.path;
			} else if (newLocation.status === 'Valid') {
				queue.push(newLocation);
			}

			// 南を調べる
			var newLocation = exploreInDirection(currentLocation, 'South', grid, scene);
			if (newLocation.status === 'Goal') {
				return newLocation.path;
			} else if (newLocation.status === 'Valid') {
				queue.push(newLocation);
			}


			// 西を調べる
			var newLocation = exploreInDirection(currentLocation, 'West', grid, scene);
			if (newLocation.status === 'Goal') {
				return newLocation.path;
			} else if (newLocation.status === 'Valid') {
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
	var locationStatus = function(location, grid, scene) {
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
		} else if (grid[dft][dfl] === 'Goal') {
			return 'Goal';
		} else if (grid[dft][dfl] === 'Empty') {
			// locationは障害物か既にチェックしたかのどちらか
			return 'Valid';
		} else {
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
		} else if (direction === 'East') {
			dfl += 1;
			//let ai = new Search(dfl*16,dft*16,scene)
			//ai.backgroundColor = "#00f1"
		} else if (direction === 'South') {
			dft += 1;
			//let ai = new Search(dfl*16,dft*16,scene)
			//ai.backgroundColor = "#00f1"
		} else if (direction === 'West') {
			dfl -= 1;
			//let ai = new Search(dfl*16,dft*16,scene)
			//ai.backgroundColor = "#00f1"
		}
		/*else if(direction === 'Northeast'){
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
		newLocation.status = locationStatus(newLocation, grid, scene);

		// この新しい位置が有効なら、'Visited'の印をつける
		if (newLocation.status === 'Valid') {
			grid[newLocation.distanceFromTop][newLocation.distanceFromLeft] = 'Visited';
			//let ai = new Search(dfl*16,dft*16,scene)
			//ai.backgroundColor = "#00f1"
		}

		return newLocation;
	};

	/* プレイヤークラス */
	var Player = Class.create(Sprite, {
		initialize: function(x, y, path1, path2, max, ref, shotSpeed, moveSpeed, scene, filterMap) {
			Sprite.call(this, pixelSize - 4, pixelSize - 4)
			//this.backgroundColor = "#f008"
			//  プレイヤーの初期位置設定
			this.x = x * pixelSize + 2;
			this.y = y * pixelSize - 14;

			var pmax = max; //  最大弾数
			const Num = entVal; //  戦車の番号を取得(tankEntityで使う)
			entVal++; //  現在の戦車番号更新
			bullets[Num] = 0; //  発射済み弾数カウントリセット
			boms[Num] = 0; //  設置済み爆弾カウントリセット
			deadFlgs.push(false); //  生存判定をセット

			//  戦車の各パーツ呼び出し
			const weak = new Weak(this, Num, scene); //  弱点
				weak.scale(0.8, 0.8);
			const cannon = new Cannon(this, path2, Num, scene); //  砲塔
			const tank = new Tank(this, path1, Num, scene, cannon); //  車体
			this.weak = weak;
			this.cannon = cannon;
			this.tank = tank;
			TankFrame(this, Num, scene);

			//console.log(tank.width + "   " + tank.height);
			//console.log(cannon.width + "   " + cannon.height);
			//markEntity[Num] = null;

			var speed = moveSpeed; //移動速度
			var rot = 0; //車体の角度
			var bflg = false; //爆弾設置フラグ
			var late = 0; //発射頻度調整用
			var shotStopTime = 0;
			var shotStopFlg = false;
			var life = 1;

			/*const anoPoint = new AnotherPoint(cur, Num, scene)
			let EnemyAim = Class.create(AnotherAim, {
				initialize: function() {
					AnotherAim.call(this, anoPoint, cannon, ref, Num, scene);
				}
			})*/

			//  弾の初期状態を設定
			for (var i = 0; i < pmax; i++) {
				colOb[Num][i] = new BulletCol(cur, cannon, shotSpeed, 0, scene);
				bulOb[Num][i] = new Bullet(colOb[Num][i], cannon, ref, Num, shotSpeed, scene, i);
				bulStack[Num][i] = false; //  弾の状態をoff
				//colOb[Num][i].moveTo(-210, -210);
				//bulOb[Num][i].moveTo(-100, -100);
				colOb[Num][i].destroy();
				scene.BulGroup.removeChild(colOb[Num][i]);
				scene.BulGroup.removeChild(bulOb[Num][i]);
			}
			//  爆弾の初期状態を設定
			for (var i = 0; i < 2; i++) {
				bomOb[Num][i] = new Bom(this, Num, scene);
				scene.BomGroup.removeChild(bomOb[Num][i]);
			}

			
			let EnemyAim = Class.create(AnotherPAim, {
				initialize: function() {
					AnotherPAim.call(this, cur, cannon, ref, Num, scene);
				}
			})
			

			if (navigator.userAgent.match(/iPhone|iPad|Android/)) {
				//new CursorArea();
				scene.addEventListener('touchstart', function(e) {
					cur.x = (e.x);
					cur.y = (e.y);
				})
				scene.addEventListener('touchmove', function(e) {
					cur.x = (e.x);
					cur.y = (e.y);
				})
			} else {
				document.addEventListener('mousemove', function(e) {
					cur.x = (e.x - 36) * 2.7 - (ScreenMargin * 2);
					cur.y = (e.y) * 2.65;
				})
				//  画面クリック時の砲撃処理
				scene.addEventListener('touchstart', function() {
					if (worldFlg == true && scene.time > 210) { //  処理しても良い状態か
						if (bullets[Num] < pmax && deadFlgs[Num] == false) { //  発射最大数に到達していないか＆死んでいないか
							for (let i = 0; i < pmax; i++) {
								if (bulStack[Num][i] == false) { //  弾の状態がoffならば
									game.assets['./sound/s_car_door_O2.wav'].clone().play(); //  発射音再生
									colOb[Num][i] = new BulletCol(cur, cannon, shotSpeed, 0, scene); //  弾の物理制御をセット
									bulOb[Num][i] = new Bullet(colOb[Num][i], cannon, ref, Num, shotSpeed, scene, i) //  弾の制御をセット                                      //  フィールドに弾を生成
									scene.BulGroup.addChild(colOb[Num][i]);
									scene.BulGroup.addChild(bulOb[Num][i]);
									bullets[Num]++; //  弾の発射済み個数を増やす
									bulStack[Num][i] = true; //  弾の状態をonにする
									new OpenFire(cannon, cur, scene) //  発砲エフェクト生成
									shotStopFlg = true;
									break;
								}
							}

						}
					}
				})
			}
			//  常に稼働する処理
			this.onenterframe = function() {
				if (deleteFlg == true) {
					this.moveTo(-100, -100) //  戦車を移動
					//  各パーツと本体の消去
					scene.TankGroup.removeChild(tank)
					scene.CannonGroup.removeChild(cannon)
					scene.removeChild(cur);
					scene.removeChild(weak)
					scene.removeChild(this)
				}
				if (life > 0) {

					//  稼働しても良いなら
					if (worldFlg == true) {
						if (shotStopFlg == true) {
							shotStopTime++;
							if (shotStopTime > 5) {
								shotStopFlg = false;
								shotStopTime = 0;
							}
						}
						Bullet.intersectStrict(weak).forEach(elem => {
							if (bulStack[elem.num][elem.value] == true && defeat == false && victory == false && complete == false) {
								game.assets['./sound/mini_bomb2.mp3'].clone().play();
								deadFlgs[Num] = true;
								moveSpeed = 0;
								Get_NewBullet(elem.num, elem.value);
							}
							return;
						})
						
						/*for(var j = 0; j < bulOb.length; j++){
						    for(var k = 0; k < bulOb[j].length; k++){
						        if(weak.intersectStrict(bulOb[j][k])==true && bulStack[j][k] == true &&
						            defeat == false && victory == false && complete == false){

						            game.assets['./sound/mini_bomb2.mp3'].clone().play();
						            deadFlgs[Num] = true
						            Get_NewBullet(j,k);
						            moveSpeed = 0;
						        }
						    }
						}*/
						//  死亡判定時の処理
						if (deadFlgs[Num] == true) {

							new Mark(this, scene);
							new Explosion(this, scene); //  車体の爆破エフェクト生成
							this.moveTo(-100, -100) //  戦車を移動
							zanki--; //  残機を減らす
							life--;
						}
						if (scene.time > 210) {
							if (shotStopFlg == false && speed > 0) {
								switch (inputManager.checkDirection()) {
									case inputManager.keyDirections.UP:
										rot = 270;
										this.y -= speed;
										break;
									case inputManager.keyDirections.UP_RIGHT:
										rot = 315
										this.x += speed / 1.5;
										this.y -= speed / 1.5;
										break;
									case inputManager.keyDirections.RIGHT:
										rot = 0;
										this.x += speed;
										break;
									case inputManager.keyDirections.DOWN_RIGHT:
										rot = 45
										this.x += speed / 1.5;
										this.y += speed / 1.5;
										break;
									case inputManager.keyDirections.DOWN:
										rot = 90;
										this.y += speed;
										break;
									case inputManager.keyDirections.DOWN_LEFT:
										rot = 135
										this.x -= speed / 1.5;
										this.y += speed / 1.5;
										break;
									case inputManager.keyDirections.LEFT:
										rot = 180;
										this.x -= speed;
										break;
									case inputManager.keyDirections.UP_LEFT:
										rot = 225
										this.x -= speed / 1.5;
										this.y -= speed / 1.5;
										break;
									default:
										break;
								}
							}


							if ((inputManager.checkButton("A") == inputManager.keyStatus.DOWN) && late == 0) {
								if (bullets[Num] < pmax && deadFlgs[Num] == false) { //  発射最大数に到達していないか＆死んでいないか
									for (let i = 0; i < pmax; i++) {
										if (bulStack[Num][i] == false) { //  弾の状態がoffならば
											game.assets['./sound/s_car_door_O2.wav'].clone().play(); //  発射音再生
											colOb[Num][i] = new BulletCol(cur, cannon, shotSpeed, 0, scene); //  弾の物理制御をセット
											bulOb[Num][i] = new Bullet(colOb[Num][i], cannon, ref, Num, shotSpeed, scene, i) //  弾の制御をセット
											scene.BulGroup.addChild(colOb[Num][i]);
											scene.BulGroup.addChild(bulOb[Num][i]);
											bullets[Num]++; //  弾の発射済み個数を増やす
											bulStack[Num][i] = true; //  弾の状態をonにする
											new OpenFire(cannon, cur, scene) //  発砲エフェクト生成
											shotStopFlg = true;
											break;
										}
									}

								}
							}
							if ((inputManager.checkButton("B") == inputManager.keyStatus.DOWN || game.input.q) && bflg == false && boms[Num] < 2) {
								game.assets['./sound/Sample_0009.wav'].clone().play();
								bomOb[Num][boms[Num]] = new Bom(this, Num, scene)
								scene.BomGroup.addChild(bomOb[Num][boms[Num]]);
								this.time = 0;
								bflg = true;
								boms[Num]++;
							}

							//  制限が掛かったら
							if (late >= 1) {
								late++
							}
							//  一定の時間が経過したら
							if (late == 10) {
								late = 0; //  制限解除
							}

							//  爆弾が設置された場合の処理
							if (bflg == true) {
								this.time++
								if (this.time > 60) { //  1秒後再設置可能にする
									bflg = false;
								}
							}

							//  死んでいなければ弾道予測の描画をする
							if (deadFlgs[Num] == false){
								if(playerType == 8){
									if(game.time % 2 == 0) new EnemyAim();
								}else{
									new Aim(cur, cannon, 48, Num, scene);
								}
							}
								//new EnemyAim();

							/* 戦車本体の角度設定 */
							if(this.rot != rot){
								this.rotation = rot;
								tank.rotation = rot;
								weak.rotation = rot;
							}

							for (let i = 1; i < tankDir.length; i++) {
								if (deadFlgs[i] == false) {
									if (this.intersect(tankDir[i][0]) == true) {
										this.moveTo(this.x, tankDir[i][0].y - 60)
									}
									if (this.intersect(tankDir[i][1]) == true) {
										this.moveTo(this.x, tankDir[i][1].y + (tankDir[i][1].height))
									}
									if (this.intersect(tankDir[i][2]) == true) {
										this.moveTo(tankDir[i][2].x - 60, this.y)
									}
									if (this.intersect(tankDir[i][3]) == true) {
										this.moveTo(tankDir[i][3].x + (tankDir[i][3].width), this.y)
									}
								}
							}
							ObsWidthTop.intersect(this).forEach(elem => {
								this.moveTo(this.x, elem.y - 60);
							})
							ObsWidthBottom.intersect(this).forEach(elem => {
								this.moveTo(this.x, elem.y + (elem.height))
							})
							ObsHeightLeft.intersect(this).forEach(elem => {
								this.moveTo(elem.x - 60, this.y)
							})
							ObsHeightRight.intersect(this).forEach(elem => {
								this.moveTo(elem.x + (elem.width), this.y)
							})
							
							/*for (let i = 0; i < obsdir.length; i++) {
								if (this.intersect(obsdir[i][0]) == true && obsChk[i][0] == true) {
									this.moveTo(this.x, obsdir[i][0].y - 60)
								}
								if (this.intersect(obsdir[i][1]) == true && obsChk[i][1] == true) {
									this.moveTo(this.x, obsdir[i][1].y + (obsdir[i][1].height))
								}
								if (this.intersect(obsdir[i][2]) == true && obsChk[i][2] == true) {
									this.moveTo(obsdir[i][2].x - 60, this.y)
								}
								if (this.intersect(obsdir[i][3]) == true && obsChk[i][3] == true) {
									this.moveTo(obsdir[i][3].x + (obsdir[i][3].width), this.y)
								}
							}
							//  フィールドの壁に衝突した場合の処理
							if (this.intersect(walls[0]) == true) {
								this.moveTo(this.x, walls[0].y + walls[0].height)
							}
							if (this.intersect(walls[1]) == true) {
								this.moveTo(this.x, walls[1].y - walls[1].height + 2)
							}
							if (this.intersect(walls[2]) == true) {
								this.moveTo(walls[2].x + walls[2].width, this.y)
							}
							if (this.intersect(walls[3]) == true) {
								this.moveTo(walls[3].x - walls[3].width + 2, this.y)
							}*/
						}

					}
				}

			}
			scene.addChild(this);
		}
	});
	/* 敵(弱)クラス */
	var newAI = Class.create(Sprite, {
		initialize: function(x, y, tankPath, cannonPath, target, max, ref, shotSpeed, moveSpeed, fireLate, grade, category, scene, map, g, filterMap) {
			Sprite.call(this, pixelSize - 4, pixelSize - 4);
			//  敵の初期位置設定
			this.x = x * pixelSize + 2;
			this.y = y * pixelSize - 14;

			this.time = 0;

			const Num = entVal; //  戦車の番号設定
			entVal++; //  現在の戦車番号更新
			bullets[Num] = 0; //  弾の発射数リセット
			boms[Num] = 0; //  爆弾設置数リセット
			deadFlgs.push(false) //  生存判定をセット

			//  戦車の各パーツ生成
			const weak = new Weak(this, Num, scene); //  弱点生成
			const cannon = new Cannon(this, cannonPath, Num, scene); //  砲塔生成
			const tank = new Tank(this, tankPath, Num, scene, cannon); //  車体生成
			this.weak = weak;
			this.cannon = cannon;
			this.tank = tank;
			TankFrame(this, Num, scene)

			//markEntity[Num] = null;

			//  警戒範囲の生成
			const intercept = new Intercept96(this, scene);

			var moveCnt = 0 //  移動距離
			var grid = g; //  マップの障害物配置情報
			var root; //  移動ルート

			var myPath = [0, 0]
			var targetPath = [0, 0]

			let shotNGflg = false;
			let reloadFlg = false;
			let reloadTime = 0;

			let shotStopFlg = false;
			let shotStopTime = 0;

			let tankStopFlg = false;

			let brflg = false;

			let life = 1; //  命

			enemyTarget[Num] = target; //  この戦車の標的設定
			var alignment = new Target(Num, scene) //  ターゲットを追跡オブジェクト設定

			//  ステージ20以降のステータス強化処理
			if (stageNum > 20) {
				shotSpeed = shotSpeed + (0.4 * (stageNum / 20));
			}

			if (category == 2 && addBullet != 0) {
				ref = ref + addBullet;
			}

			//  弾の初期設定
			for (var i = 0; i < max; i++) {
				colOb[Num][i] = new BulletCol(alignment, cannon, shotSpeed, grade, scene);
				bulOb[Num][i] = new Bullet(colOb[Num][i], cannon, ref, Num, shotSpeed, scene, i);
				bulStack[Num][i] = false;
				//colOb[Num][i].moveTo(-220, -220)
				//bulOb[Num][i].moveTo(-100, -100)
				colOb[Num][i].destroy();
				scene.BulGroup.removeChild(colOb[Num][i]);
				scene.BulGroup.removeChild(bulOb[Num][i]);
			}

			//  爆弾の初期設定
			bomOb[Num][0] = new Bom(this, Num, scene);

			//  独自の敵の照準処理
			var EnemyAim = Class.create(Aim, { //  Aimクラスを継承
				initialize: function() {
					Aim.call(this, alignment, cannon, 20, Num, scene);
				}
			})

			function ShotBullet(i) {
				game.assets['./sound/s_car_door_O2.wav'].clone().play();
				if (shotSpeed >= 14) {
					game.assets['./sound/Sample_0003.wav'].clone().play();
				}
				scene.BulGroup.addChild(colOb[Num][i]);
				scene.BulGroup.addChild(bulOb[Num][i]);
				bullets[Num]++;
				bulStack[Num][i] = true;
				shotStopFlg = true;
				new OpenFire(cannon, alignment, scene);
			}

			function Instrumentation(target1, target2) {
				/* let dist1 = Math.sqrt(Math.pow((weak.x + weak.width/2) - (target1.x + target1.width/2), 2) + Math.pow((weak.y + weak.height/2) - (target1.y + target1.height/2), 2));
				let dist2 = Math.sqrt(Math.pow((weak.x + weak.width/2) - (target2.x + target2.width/2), 2) + Math.pow((weak.y + weak.height/2) - (target2.y + target2.height/2), 2)); */
				let dist1 = Math.sqrt(Math.pow(weak.x - target1.x, 2) + Math.pow(weak.y - target1.y, 2));
				let dist2 = Math.sqrt(Math.pow(weak.x - target2.x, 2) + Math.pow(weak.y - target2.y, 2));
				if (dist1 > dist2) {
					return dist2;
				} else {
					return null;
				}

			}

			//  難易度設定によるステータス強化処理
			if (addBullet != 0 && fireLate > 19) fireLate = fireLate - 5;
			if (addBullet != 0 && category == 2) fireLate = 25;

			//  常に処理する
			this.onenterframe = function() {
				if (deleteFlg == true) {
					this.moveTo(-100, -100);
					scene.removeChild(intercept)
					scene.removeChild(alignment);
					scene.TankGroup.removeChild(tank);
					scene.CannonGroup.removeChild(cannon);
					scene.removeChild(weak);
					scene.removeChild(this);
				}
				//  死んでいなければ処理
				if (life > 0) {
                    //  死亡判定がtrueなら
					if (deadFlgs[Num] == true) {
                        new Mark(this, scene);
                        tankColorCounts[category]--;
                        //alert(tankColorCwwsaounts)
                        new Explosion(this, scene);
						destruction++;
                        this.moveTo((-64 * destruction), -100);
                        life = 0;
                        deadTank[Num - 1] = true;
                    }	
					if (deadFlgs[0] == false) {
						
						
						/*for(var j = 0; j < bulOb.length; j++){
						    for(var k = 0; k < bulOb[j].length; k++){
						        if(defeat == false && weak.intersectStrict(bulOb[j][k])==true && bulStack[j][k] == true){
						            game.assets['./sound/mini_bomb2.mp3'].clone().play();
						            deadFlgs[Num] = true
						            Get_NewBullet(j,k);
						            moveSpeed = 0;
						        }
						    }
						}*/
						
						
						//  実行可能なら
						if (worldFlg == true) {
							//  死亡判定処理
							Bullet.intersectStrict(weak).forEach(elem => {
								if (bulStack[elem.num][elem.value] == true && defeat == false && victory == false && complete == false) {
									game.assets['./sound/mini_bomb2.mp3'].clone().play();
									deadFlgs[Num] = true;
									moveSpeed = 0;
									Get_NewBullet(elem.num, elem.value);
								}
								return;
							})
							if(this.time % 2 == 0){
								fireFlgs[Num] = false; //  発射状態をリセット
								shotNGflg = false;
								if (moveSpeed > 0 && tankStopFlg == false) {
									//  自身の位置とターゲットの位置をざっくり算出
									myPath = [parseInt((this.y + 41) / pixelSize), parseInt((this.x + 34.5) / pixelSize)]
									targetPath = [parseInt((target.y + 41) / pixelSize), parseInt((target.x + 34.5) / pixelSize)]
									//  マップの障害物情報に自身とターゲットの位置設定
									for (var i = 0; i < grid.length; i++) {
										for (var j = 0; j < grid[i].length; j++) {
											if (i == myPath[0] && j == myPath[1]) {
												grid[i][j] = 'Start';
											} else if (i == targetPath[0] && j == targetPath[1]) {
												grid[i][j] = 'Goal';
											} else {
												//  StartやGoalの位置が更新されている場合の処理
												if (map.collisionData[i][j] == 0) {
													grid[i][j] = 'Empty';
												} else {
													grid[i][j] = 'Obstacle';
												}
											}
										}
									}
									if (this.time == 0) {
										root = findShortestPath([myPath[0], myPath[1]], grid, scene);
										if (root[0] == "East") {
											this.rotation = 0
										} else if (root[0] == "West") {
											this.rotation = 180;
										} else if (root[0] == "North") {
											this.rotation = 270;
										} else if (root[0] == "South") {
											this.rotation = 90;
										}
									}
									
								}
								if (tankStopFlg == true) tankStopFlg = false;
							}
							this.time++;

							for (let i = 0; i < tankEntity.length; i++) {
								if (i != Num && deadFlgs[i] == false) {
									if (tankDir[Num][0].intersect(tankEntity[i]) == true) {
										shotNGflg = true;
										if (this.rotation == 270) {
											tankStopFlg = true;
											if (shotStopFlg == false) {
												this.y += moveSpeed;
												moveCnt -= moveSpeed;
											}
										}
									} else if (tankDir[Num][1].intersect(tankEntity[i]) == true) {
										shotNGflg = true;
										if (this.rotation == 90) {
											tankStopFlg = true;
											if (shotStopFlg == false) {
												this.y -= moveSpeed;
												moveCnt -= moveSpeed;
											}

										}
									} else if (tankDir[Num][2].intersect(tankEntity[i]) == true) {
										shotNGflg = true;
										if (this.rotation == 0) {
											tankStopFlg = true;
											if (shotStopFlg == false) {
												this.x += moveSpeed;
												moveCnt -= moveSpeed;
											}

										}
									} else if (tankDir[Num][3].intersect(tankEntity[i]) == true) {
										shotNGflg = true;
										if (this.rotation == 180) {
											tankStopFlg = true;
											if (shotStopFlg == false) {
												this.x -= moveSpeed;
												moveCnt -= moveSpeed;
											}
										}
									}
								}
							}
							
							if (shotStopFlg == true) {
								shotStopTime++;
								if (shotStopTime > 10) {
									shotStopFlg = false;
									shotStopTime = 0;
								}
							}

							//  敵の照準生成
							new EnemyAim();
							//  照準がバグった場合の処理
							/*if(enemyTarget[Num] == eAim){
							    enemyTarget[Num] = target
							}*/
							if (this.time % 5 == 0) {
								if (enemyTarget[Num] != target) enemyTarget[Num] = target;
							}

							//  一定範囲内にターゲットがいた場合
							/*if (tank.within(target, 320) == true) {
								enemyTarget[Num] = target
							}*/
							//  照準がターゲット追跡オブジェと重なったら
							alignment.intersect(EnemyAim).forEach(function() {
								if(!fireFlgs[Num])fireFlgs[Num] = true; //  発射可能状態にする
								return;
							})

							/* 迎撃処理群
							    優先順位：自身の弾＞プレイヤーの弾＞他戦車の弾
							*/
							//  他戦車の弾迎撃処理
							if (cateFlgs[category][2] == true && tankEntity.length > 2) {
								brflg = false;
								for (let i = 1; i < bulOb.length; i++) {
									if(i == Num) continue;
									for (let j = 0; j < bulOb[i].length; j++) {
										if (bulStack[i][j] == true) {
											let dist = Instrumentation(enemyTarget[Num], bulOb[i][j]);
											intercept.intersect(BulAim).forEach(function() {
												if (dist != null && dist < cateRanges[category][2]) {
													enemyTarget[Num] = bulOb[i][j]; //  迎撃のためにターゲット変更
													brflg = true;
													return;
												}
											})

										}
									}
									if(brflg) break;
								}
							}
							//  プレイヤーの弾迎撃処理
							if (cateFlgs[category][0] == true) {
								for (let i = 0; i < bulOb[0].length; i++) {
									if (bulStack[0][i] == true) {
										let dist = Instrumentation(enemyTarget[Num], bulOb[0][i]);
										if (dist != null && dist < cateRanges[category][0]) {
											this.intersect(PlayerBulAim).forEach(function() {
												enemyTarget[Num] = bulOb[0][i]; //  迎撃のためにターゲット変更
												return;
											})
										}

									}
								}
							}
							//  自身の弾迎撃処理
							if (cateFlgs[category][1] == true) {
								for (let i = 0; i < bulOb[Num].length; i++) {
									if (bulStack[Num][i] == true) {
										let dist = Instrumentation(enemyTarget[Num], bulOb[Num][i]);
										if (dist != null && dist < cateRanges[category][1]) {
											enemyTarget[Num] = bulOb[Num][i]; //  迎撃のためにターゲット変更
											break;
										}
									}
								}
							}

							if (reloadFlg == false) {
								if (bullets[Num] == max) reloadFlg = true;
							} else {
								if (reloadTime < cateReloadTimes[category]) {
									reloadTime++;
									if (shotNGflg == false) shotNGflg = true;
								} else {
									shotNGflg = false;
									reloadFlg = false;
									reloadTime = 0;
								}

							}

							//  砲撃処理
							if (shotNGflg == false) {
								if (this.time % fireLate == 0 && fireFlgs[Num] == true) {
									if (Math.floor(Math.random() * max * 2) > bullets[Num] && bullets[Num] < max) {
										for (let i = 0; i < max; i++) {
											if (bulStack[Num][i] == false) {
												if(category == 2){
													colOb[Num][i] = new BulletCol(alignment, cannon, shotSpeed, 0, scene);
												}else{
													colOb[Num][i] = new BulletCol(alignment, cannon, shotSpeed, grade, scene);
												}
												bulOb[Num][i] = new Bullet(colOb[Num][i], cannon, ref, Num, shotSpeed, scene, i)
												ShotBullet(i)
												break;
											}

										}
									}
								}
							}
							
							
							/*if (shotNGflg == false) {
								if (this.time % fireLate == 0 && fireFlgs[Num] == true) {
									if (Math.floor(Math.random() * max * 2) > bullets[Num]) {
										if (bullets[Num] < max && deadFlgs[Num] == false) {
											for (let i = 0; i < max; i++) {
												if (bulStack[Num][i] == false) {
													colOb[Num][i] = new BulletCol(alignment, cannon, shotSpeed, grade, scene);
													bulOb[Num][i] = new Bullet(colOb[Num][i], cannon, ref, Num, shotSpeed, scene, i)
													ShotBullet(i)
													break;
												}

											}

										}
									}
								}
							}*/

							if(moveSpeed > 0){
								if (shotStopFlg == false && tankStopFlg == false) {
									//  移動処理
									if (root != false && intercept.intersect(target) == false) {
										tank.rotation = this.rotation
										var rad = this.rotation * (Math.PI / 180.0);
										var dx = Math.cos(rad) * moveSpeed;
										var dy = Math.sin(rad) * moveSpeed;
										this.x += dx;
										this.y += dy;
										/*if (this.intersectStrict(Floor) == false) {
											this.x += dx;
											this.y += dy;
										} else {
											this.x -= dx;
											this.y -= dy;
										}*/
										moveCnt += moveSpeed;
									}
									if (moveCnt == pixelSize) {
										root = findShortestPath([myPath[0], myPath[1]], grid, scene)
										if (root[0] == "East") {
											this.rotation = 0
										} else if (root[0] == "West") {
											this.rotation = 180;
										} else if (root[0] == "North") {
											this.rotation = 270;
										} else if (root[0] == "South") {
											this.rotation = 90;
										}
										moveCnt = 0
									}
	
									//weak.rotation = this.rotation;
								}
								if (root == false) {
									root = findShortestPath([myPath[0], myPath[1]], grid, scene)
									if (root[0] == "East") {
										this.rotation = 0
									} else if (root[0] == "West") {
										this.rotation = 180;
									} else if (root[0] == "North") {
										this.rotation = 270;
									} else if (root[0] == "South") {
										this.rotation = 90;
									}
									moveCnt = 0
								}
							}

							ObsWidthTop.intersect(this).forEach(elem => {
								this.moveTo(this.x, elem.y - 61);
							})
							ObsWidthBottom.intersect(this).forEach(elem => {
								this.moveTo(this.x, elem.y + (elem.height))
							})
							ObsHeightLeft.intersect(this).forEach(elem => {
								this.moveTo(elem.x - 62, this.y)
							})
							ObsHeightRight.intersect(this).forEach(elem => {
								this.moveTo(elem.x + (elem.width), this.y)
							})

							/*for (let i = 0; i < obsdir.length; i++) {
								if (this.intersect(obsdir[i][0]) == true && obsChk[i][0] == true) {
									this.y = obsdir[i][0].y - 61;
									//this.moveTo(this.x, obsdir[i][0].y - 61)
								}
								if (this.intersect(obsdir[i][1]) == true && obsChk[i][1] == true) {
									this.y = obsdir[i][1].y + obsdir[i][1].height + 3;
									//this.moveTo(this.x, obsdir[i][1].y + obsdir[i][1].height + 3)
								}
								if (this.intersect(obsdir[i][2]) == true && obsChk[i][2] == true) {
									this.x = obsdir[i][2].x - 62;
									//this.moveTo(obsdir[i][2].x - 62, this.y)
								}
								if (this.intersect(obsdir[i][3]) == true && obsChk[i][3] == true) {
									this.x = obsdir[i][3].x + obsdir[i][3].width + 3;
									//this.moveTo(obsdir[i][3].x + obsdir[i][3].width + 3, this.y)
								}
							}
							if (this.intersect(walls[0]) == true) {
								this.y = (64 * 2) - 15;
								//this.moveTo(this.x, (64 * 2) - 15)
							}
							if (this.intersect(walls[1]) == true) {
								this.y = (64 * 13) - 13;
								//this.moveTo(this.x, (64 * 13) - 13)
							}
							if (this.intersect(walls[2]) == true) {
								this.x = (64 * 1) + 3;
								//this.moveTo((64 * 1) + 3, this.y)
							}
							if (this.intersect(walls[3]) == true) {
								this.x = (64 * 18) + 3;
								//this.moveTo((64 * 18) + 3, this.y)
							}*/
						}
					}


				}
			}
			scene.addChild(this);
		}
	});
	/* 敵(強)クラス */
	var Elite = Class.create(Sprite, {
		initialize: function(x, y, path1, path2, target, max, ref, shotSpeed, moveSpeed, fireLate, grade, category, scene, filterMap) {
			Sprite.call(this, pixelSize - 4, pixelSize - 4)
			this.x = x * pixelSize + 2;
			this.y = y * pixelSize - 14;
			this.time = 0;

			var emax = max;
			const Num = entVal;
			entVal++;
			bullets[Num] = 0;
			boms[Num] = 0;
			deadFlgs.push(false)

			const cannon = new Cannon(this, path2, Num, scene);
			const tank = new Tank(this, path1, Num, scene, cannon);
			const weak = new Weak(this, Num, scene);
			this.weak = weak;
			this.cannon = cannon;
			this.tank = tank;
			TankFrame(this, Num, scene)

			//markEntity[Num] = null;

			tank.opacity = 1.0;
			cannon.opacity = 1.0;

			const intercept = new Intercept96(this, scene);
			const intercept7 = new InterceptC(cannon, scene);
			var value = Math.floor(Math.random() * 4);
			var speed = moveSpeed;
			var bomFlg = false;
			var rot = 0;
			var escapeFlg = false;
			var escapeTarget;
			var shotNGflg = false;
			let hittingTime = 0;
			let reloadTime = 0;
			let reloadFlg = false;
			let shotStopFlg = false;
			let shotStopTime = 0;

			let life = 1;

			let brflg = false;

			if (moveSpeed != 0) {
				if (stageNum >= 20) {
					speed = speed + (0.1 * (stageNum / 20));
				}
			}

			if (addBullet != 0 && fireLate > 19) fireLate = fireLate - 5;

			if (category == 2 && addBullet != 0) {
				ref = ref + addBullet;
				fireLate = 25;
			}

			enemyTarget[Num] = target;
			var alignment = new Target(Num, scene)
			//alignment.backgroundColor = 'blue'

			for (var i = 0; i < emax; i++) {
				colOb[Num][i] = new BulletCol(alignment, cannon, shotSpeed, grade, scene);
				bulOb[Num][i] = new Bullet(colOb[Num][i], cannon, ref, Num, shotSpeed, scene, i);
				bulStack[Num][i] = false;
				//colOb[Num][i].moveTo(-230, -230)
				//bulOb[Num][i].moveTo(-100, -100)
				colOb[Num][i].destroy();
				scene.BulGroup.removeChild(colOb[Num][i]);
				scene.BulGroup.removeChild(bulOb[Num][i]);
			}

			bomOb[Num][0] = new Bom(this, Num, scene);

			var EnemyAim = Class.create(Aim, {
				initialize: function() {
					Aim.call(this, alignment, cannon, 24, Num, scene);
					if(ref == 0){
						this.scale(2,2);
					}
				}
			})

			//  移動方向決め処理
			function SelDirection(target1, target2, or) {
				if (or == 0) {
					if ((target1.x + target1.width / 2) > (target2.x + target2.width / 2)) {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							while (value == 0 || value == 2) value = Math.floor(Math.random() * 4);
						} else {
							while (value == 0 || value == 3) value = Math.floor(Math.random() * 4);
						}
					} else {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							while (value == 1 || value == 2) value = Math.floor(Math.random() * 4);
						} else {
							while (value == 1 || value == 3) value = Math.floor(Math.random() * 4);
						}
					}

				} else if (or == 1) {
					if ((target1.x + target1.width / 2) > (target2.x + target2.width / 2)) {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							while (value == 1 || value == 3) value = Math.floor(Math.random() * 4);
						} else {
							while (value == 1 || value == 2) value = Math.floor(Math.random() * 4);
						}

					} else {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							while (value == 0 || value == 3) value = Math.floor(Math.random() * 4);
						} else {
							while (value == 0 || value == 2) value = Math.floor(Math.random() * 4);
						}
					}

				}
			}

			function ShotBullet(i) {
				game.assets['./sound/s_car_door_O2.wav'].clone().play();
				if (shotSpeed >= 14) {
					game.assets['./sound/Sample_0003.wav'].clone().play();
				}
				scene.BulGroup.addChild(colOb[Num][i]);
				scene.BulGroup.addChild(bulOb[Num][i]);
				new OpenFire(cannon, alignment, scene)
				bullets[Num]++;
				bulStack[Num][i] = true;
				shotStopFlg = true;
			}

			function Instrumentation(target1, target2) {
				let dist1 = Math.sqrt(Math.pow(weak.x - target1.x, 2) + Math.pow(weak.y - target1.y, 2));
				let dist2 = Math.sqrt(Math.pow(weak.x - target2.x, 2) + Math.pow(weak.y - target2.y, 2));
				if (dist1 > dist2) {
					return dist2;
				} else {
					return null;
				}

			}

			this.onenterframe = function() {
				if (deleteFlg == true) {
					this.moveTo(-100, -100);
					scene.removeChild(alignment);
					scene.removeChild(intercept);
					scene.removeChild(intercept7);
					scene.TankGroup.removeChild(tank)
					scene.CannonGroup.removeChild(cannon)
					scene.removeChild(weak)
					scene.removeChild(this)
				}
				if (life > 0) {
                    if (deadFlgs[Num] == true) {
                        new Mark(this, scene);
                        tankColorCounts[category]--;
                        new Explosion(this, scene);
                        destruction++
						this.moveTo((-64 * destruction), -100);
                        life--;
                        deadTank[Num - 1] = true;
                    }
					if (deadFlgs[0] == false) {
						

						if (worldFlg == true) {
							//  死亡判定処理
							Bullet.intersectStrict(weak).forEach(elem => {
								if (bulStack[elem.num][elem.value] == true && defeat == false && victory == false && complete == false) {
									game.assets['./sound/mini_bomb2.mp3'].clone().play();
									deadFlgs[Num] = true
									moveSpeed = 0;
									Get_NewBullet(elem.num, elem.value);
								}
								return;
							})
							
							/*for(var j = 0; j < bulOb.length; j++){
								for(var k = 0; k < bulOb[j].length; k++){
									if(defeat == false && weak.intersectStrict(bulOb[j][k])==true && bulStack[j][k] == true){
										game.assets['./sound/mini_bomb2.mp3'].clone().play();
										deadFlgs[Num] = true
										Get_NewBullet(j,k);
										moveSpeed = 0;
									}
								}
							}*/
							if (shotStopFlg == true) {
								shotStopTime++;
								if (shotStopTime > 10) {
									shotStopFlg = false;
									shotStopTime = 0;
								}
							}

							if (hittingTime > 20) {
								if(value < 2){
									while (value == 0 || value == 1) value = Math.floor(Math.random() * 4);
								}else{
									while (value == 2 || value == 3) value = Math.floor(Math.random() * 4);
								}
								
								hittingTime = 0;
							}
							this.time++;
							if (this.time % 2 == 0) {
								stopFlg = false;
								escapeFlg = false;
								shotNGflg = false;
								fireFlgs[Num] = false;
                                
							}

							new EnemyAim();

							/*for (let elem of floors) {
								if (this.intersect(elem) == true) {
									shotNGflg = true;
									break;
								}
							};
							for (let elem of walls) {
								if (this.intersect(elem) == true) {
									shotNGflg = true;
									break;
								}
							};*/
							Floor.intersectStrict(intercept7).forEach(function(){
							    shotNGflg = true;
								return;
							})
							Wall.intersectStrict(intercept7).forEach(function(){
							    shotNGflg = true;
								return;
							})

							EnemyAim.intersect(alignment).forEach(elem => {
								if(!fireFlgs[Num])fireFlgs[Num] = true;
								return;
							})



							/*avoids.forEach(elem=>{
							    if(tank.within(elem,60)==true){
							        stopFlg = true;
							    }
							})*/
							if (this.time % 10 == 0) {
								if (enemyTarget[Num] != target && escapeFlg == false) enemyTarget[Num] = target;
							}


							/* 迎撃処理群
							    優先順位：自身の弾＞プレイヤーの弾＞他戦車の弾
							*/
							//  他戦車の弾迎撃処理
							if (cateFlgs[category][2] == true && tankEntity.length > 2) {
								brflg = false;
								for (let i = 1; i < bulOb.length; i++) {
									if(i == Num) continue;
									for (let j = 0; j < bulOb[i].length; j++) {
										if (bulStack[i][j] == true) {
											let dist = Instrumentation(enemyTarget[Num], bulOb[i][j]);
											if (dist != null && dist < cateRanges[category][2]) {
												
												if (cateEscapes[category][0] == true && cateEscapes[category][3] != 0) {
													if (dist < cateEscapes[category][3]) {
														if (dist < 120) enemyTarget[Num] = bulOb[i][j];
														escapeTarget = bulOb[i][j];
														escapeFlg = true;
														brflg = true;
														break;
													}
												}
											}
										}
									}
									if(brflg) break;
								}
							}
							//  プレイヤーの弾迎撃処理
							if (cateFlgs[category][0] == true) {
								for (let i = 0; i < bulOb[0].length; i++) {
									if (bulStack[0][i] == true) {
										let dist = Instrumentation(enemyTarget[Num], bulOb[0][i]);
										if (dist != null && dist < cateRanges[category][0]) {
											
											PlayerBulAim.intersectStrict(intercept).forEach(elem => {
												if (cateEscapes[category][1] != 0){
													enemyTarget[Num] = bulOb[0][i];
													return;
												} 
												
											})
											if (cateEscapes[category][0] == true && cateEscapes[category][1] != 0) {
												if (dist < cateEscapes[category][1]) {
													escapeTarget = bulOb[0][i];
													escapeFlg = true;
													break;
												}
											}
										}
									}
								}
							}
							//  自身の弾迎撃処理
							if (cateFlgs[category][1] == true) {
								for (let i = 0; i < bulOb[Num].length; i++) {
									if (bulStack[Num][i] == true) {
										let dist = Instrumentation(enemyTarget[Num], bulOb[Num][i]);
										if (dist != null && dist < cateRanges[category][1]) {
											BulAim.intersect(this).forEach(elem => {
												if (cateEscapes[category][2] != 0) {
													enemyTarget[Num] = bulOb[Num][i];
													escapeTarget = bulOb[Num][i];
													if (cateEscapes[category][0] == true) {
														if (dist < cateEscapes[category][2] && dist > 100) {
															escapeFlg = true;
														}
													}
													return;
												}
											})
										}
									}
								}
							}

							if (reloadFlg == false) {
								if (bullets[Num] == emax) reloadFlg = true;
							} else {
								if (reloadTime < cateReloadTimes[category]) {
									reloadTime++;
									if (shotNGflg == false) shotNGflg = true;
								} else {
									shotNGflg = false;
									reloadFlg = false;
									reloadTime = 0;
								}

							}

							if (shotNGflg == false) {
								if (this.time % fireLate == 0 && fireFlgs[Num] == true) {
									if (Math.floor(Math.random() * emax * 2) > bullets[Num] && bullets[Num] < emax) {
										for (let i = 0; i < emax; i++) {
											if (bulStack[Num][i] == false) {
												if(category == 2){
													colOb[Num][i] = new BulletCol(alignment, cannon, shotSpeed, 0, scene);
												}else{
													colOb[Num][i] = new BulletCol(alignment, cannon, shotSpeed, grade, scene);
												}
												bulOb[Num][i] = new Bullet(colOb[Num][i], cannon, ref, Num, shotSpeed, scene, i)
												ShotBullet(i)
												break;
											}

										}
									}
								}
							}

							/*if (this.time % fireLate == 0 && shotNGflg == false) {
								if (Math.floor(Math.random() * emax * 2) > bullets[Num]) {
									for (let i = 0; i < emax; i++) {
										if (bulStack[Num][i] == false) {
											if (bullets[Num] < emax && deadFlgs[Num] == false && fireFlgs[Num] == true) {
												if (category == 2) {
													colOb[Num][i] = new BulletCol(alignment, cannon, shotSpeed, 0, scene);
												}else{
													colOb[Num][i] = new BulletCol(alignment, cannon, shotSpeed, grade, scene);
												}
												bulOb[Num][i] = new Bullet(colOb[Num][i], cannon, ref, Num, shotSpeed, scene, i)
												ShotBullet(i);
												break;
											}
										}
									}
								}
							}*/
							
							if (moveSpeed > 0) {
								if (this.time % 5 == 0) {
									if (escapeFlg == false) {
										if (Math.sqrt(Math.pow(weak.x - target.x, 2) + Math.pow(weak.y - target.y, 2)) < cateDistances[category]) {
											SelDirection(weak, target, 0);
										} else {
											if (game.time % 10 == 0) {
												SelDirection(weak, target, 1);
											}
										}
									} else {
										SelDirection(weak, escapeTarget, 0);
									}
									if(tankEntity.length > 2){
										for (var i = 0; i < tankEntity.length; i++) {
											if (i != Num && deadFlgs[i] == false) {
												if (this.intersect(tankEntity[i]) == true) {
													SelDirection(weak, tankEntity[i], 0);
													break;
												}
											}
										}
									}
									
									if (grade > 3 && boms[0] > 0) {
										for (let elem of bomOb) {
											if (Math.sqrt(Math.pow(weak.x - elem.x, 2) + Math.pow(weak.y - elem.y, 2)) < 250) {
												SelDirection(weak, elem, 0);
												break;
											}
										};
									}
										
								}
								/* 戦車本体の角度 */
								if (shotStopFlg == false) {
									if (value == 0) {
										rot = 0;
										this.x -= speed;
									} else if (value == 1) {
										rot = 180;
										this.x += speed;
									} else if (value == 2) {
										rot = 90;
										this.y -= speed;
									} else if (value == 3) {
										rot = 270;
										this.y += speed;
									}
								}
								this.rotation = rot;
								tank.rotation = rot;
								//weak.rotation = rot;
							}
							for (let i = 0; i < tankDir.length; i++) {
								if (deadFlgs[i] == false && i != Num) {
									if (this.intersect(tankDir[i][0]) == true) {
										this.moveTo(this.x, tankDir[i][0].y - 60)
									}
									if (this.intersect(tankDir[i][1]) == true) {
										this.moveTo(this.x, tankDir[i][1].y + (tankDir[i][1].height))
									}
									if (this.intersect(tankDir[i][2]) == true) {
										this.moveTo(tankDir[i][2].x - 60, this.y)
									}
									if (this.intersect(tankDir[i][3]) == true) {
										this.moveTo(tankDir[i][3].x + (tankDir[i][3].width), this.y)
									}
								}
							}

							ObsWidthTop.intersect(this).forEach(elem => {
								this.moveTo(this.x, elem.y - 60);
								hittingTime++;
							})
							ObsWidthBottom.intersect(this).forEach(elem => {
								this.moveTo(this.x, elem.y + (elem.height))
								hittingTime++;
							})
							ObsHeightLeft.intersect(this).forEach(elem => {
								this.moveTo(elem.x - 60, this.y)
								hittingTime++;
							})
							ObsHeightRight.intersect(this).forEach(elem => {
								this.moveTo(elem.x + (elem.width), this.y)
								hittingTime++;
							})
							/*for (let i = 0; i < obsdir.length; i++) {
								if (this.intersect(obsdir[i][0]) == true && obsChk[i][0] == true) {
									this.moveTo(this.x, obsdir[i][0].y - 60)
									hittingTime++;
								}
								if (this.intersect(obsdir[i][1]) == true && obsChk[i][1] == true) {
									this.moveTo(this.x, obsdir[i][1].y + (obsdir[i][1].height))
									hittingTime++;
								}
								if (this.intersect(obsdir[i][2]) == true && obsChk[i][2] == true) {
									this.moveTo(obsdir[i][2].x - 60, this.y)
									hittingTime++;
								}
								if (this.intersect(obsdir[i][3]) == true && obsChk[i][3] == true) {
									this.moveTo(obsdir[i][3].x + (obsdir[i][3].width), this.y)
									hittingTime++;
								}
							}
							if (this.intersect(walls[0]) == true) {
								this.moveTo(this.x, walls[0].y + walls[0].height)
								hittingTime++;
							}
							if (this.intersect(walls[1]) == true) {
								this.moveTo(this.x, walls[1].y - walls[1].height + 2)
								hittingTime++;
							}
							if (this.intersect(walls[2]) == true) {
								this.moveTo(walls[2].x + walls[2].width, this.y)
								hittingTime++;
							}
							if (this.intersect(walls[3]) == true) {
								this.moveTo(walls[3].x - walls[3].width + 2, this.y)
								hittingTime++;
							}*/
						}
					}
				}
			}
			scene.addChild(this);
		}
	});
	var Stealth = Class.create(Sprite, {
		initialize: function(x, y, path1, path2, target, max, ref, shotSpeed, moveSpeed, fireLate, grade, category, scene, filterMap) {
			Sprite.call(this, pixelSize - 4, pixelSize - 4)
			this.x = x * pixelSize + 2;
			this.y = y * pixelSize - 14;
			this.time = 0;

			var emax = max;
			const Num = entVal;
			entVal++;
			bullets[Num] = 0;
			boms[Num] = 0;
			deadFlgs.push(false)

			const cannon = new Cannon(this, path2, Num, scene);
			const tank = new Tank(this, path1, Num, scene, cannon);
			const weak = new Weak(this, Num, scene);
			this.weak = weak;
			this.cannon = cannon;
			this.tank = tank;
			TankFrame(this, Num, scene)

			//markEntity[Num] = null;

			tank.opacity = 1.0;
			cannon.opacity = 1.0;

			const intercept = new Intercept96(this, scene)
			const intercept7 = new InterceptC(cannon, scene)
			var value = Math.floor(Math.random() * 4);;
			var speed = moveSpeed;
			var rot = 0;
			var escapeFlg = false;
			var escapeTarget;
			var shotNGflg = false;
			let hittingTime = 0;
			let reloadTime = 0;
			let reloadFlg = false;
			let shotStopFlg = false;
			let shotStopTime = 0;

			var shadow = new Surface(this.width, this.height);
				shadow.context.beginPath();
				shadow.context.fillStyle = 'rgba(0, 0, 0, 0.1)';
				shadow.context.arc(30, 30, 24, 0, Math.PI * 2, true);
				shadow.context.fill();

			let life = 1;

			let brflg = false;

			if (moveSpeed != 0) {
				if (stageNum >= 20) {
					speed = speed + (0.1 * (stageNum / 20));
				}
			}

			enemyTarget[Num] = target;
			var alignment = new Target(Num, scene)
			//alignment.backgroundColor = 'blue'

			for (var i = 0; i < emax; i++) {
				colOb[Num][i] = new BulletCol(alignment, cannon, shotSpeed, grade, scene);
				bulOb[Num][i] = new Bullet(colOb[Num][i], cannon, ref, Num, shotSpeed, scene, i);
				bulStack[Num][i] = false;
				//colOb[Num][i].moveTo(-230, -230);
				//bulOb[Num][i].moveTo(-100, -100);
				colOb[Num][i].destroy();
				scene.BulGroup.removeChild(colOb[Num][i]);
				scene.BulGroup.removeChild(bulOb[Num][i]);
			}

			bomOb[Num][0] = new Bom(this, Num, scene);

			var EnemyAim = Class.create(Aim, {
				initialize: function() {
					Aim.call(this, alignment, cannon, 24, Num, scene);
				}
			})

			//  移動方向決め処理
			function SelDirection(target1, target2, or) {
				if (or == 0) {
					if ((target1.x + target1.width / 2) > (target2.x + target2.width / 2)) {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							while (value == 0 || value == 2) value = Math.floor(Math.random() * 4);
						} else {
							while (value == 0 || value == 3) value = Math.floor(Math.random() * 4);
						}
					} else {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							while (value == 1 || value == 2) value = Math.floor(Math.random() * 4);
						} else {
							while (value == 1 || value == 3) value = Math.floor(Math.random() * 4);
						}
					}

				} else if (or == 1) {
					if ((target1.x + target1.width / 2) > (target2.x + target2.width / 2)) {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							while (value == 1 || value == 3) value = Math.floor(Math.random() * 4);
						} else {
							while (value == 1 || value == 2) value = Math.floor(Math.random() * 4);
						}

					} else {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							while (value == 0 || value == 3) value = Math.floor(Math.random() * 4);
						} else {
							while (value == 0 || value == 2) value = Math.floor(Math.random() * 4);
						}
					}

				}
			}

			function ShotBullet(i) {
				game.assets['./sound/s_car_door_O2.wav'].clone().play();
				game.assets['./sound/Sample_0003.wav'].clone().play();
				scene.BulGroup.addChild(colOb[Num][i]);
				scene.BulGroup.addChild(bulOb[Num][i]);
				new OpenFire(cannon, alignment, scene)
				bullets[Num]++;
				bulStack[Num][i] = true;
				shotStopFlg = true;
			}

			function Instrumentation(target1, target2) {
				let dist1 = Math.sqrt(Math.pow(weak.x - target1.x, 2) + Math.pow(weak.y - target1.y, 2));
				let dist2 = Math.sqrt(Math.pow(weak.x - target2.x, 2) + Math.pow(weak.y - target2.y, 2));
				if (dist1 > dist2) {
					return dist2;
				} else {
					return null;
				}

			}

			if (addBullet != 0) fireLate = fireLate - 5;

			this.onenterframe = function() {
				if (deleteFlg == true) {
					this.moveTo(-100, -100);
					scene.removeChild(alignment);
					scene.removeChild(intercept);
					scene.removeChild(intercept7);
					scene.TankGroup.removeChild(tank)
					scene.CannonGroup.removeChild(cannon)
					scene.removeChild(weak)
					scene.removeChild(this)
				}
				if (life > 0) {
                    if (deadFlgs[Num] == true) {
                        new Mark(this, scene);
                        tankColorCounts[category]--;
                        new Explosion(this, scene);
                        destruction++;
						this.moveTo((-64 * destruction), -100);
                        life--;
                        deadTank[Num - 1] = true;
                    }
					if (deadFlgs[0] == false) {
						

						if (worldFlg == true) {
							//  死亡判定処理
							Bullet.intersectStrict(weak).forEach(elem => {
								if (bulStack[elem.num][elem.value] == true && defeat == false && victory == false && complete == false) {
									game.assets['./sound/mini_bomb2.mp3'].clone().play();
									deadFlgs[Num] = true;
									moveSpeed = 0;
									Get_NewBullet(elem.num, elem.value);
								}
								return;
							})
							
							if (shotStopFlg) {
								shotStopTime++;
								if (shotStopTime > 10) {
									shotStopFlg = false;
									shotStopTime = 0;
								}
							}

							if (hittingTime > 20) {
								if(value < 2){
									while (value == 0 || value == 1) value = Math.floor(Math.random() * 4);
								}else{
									while (value == 2 || value == 3) value = Math.floor(Math.random() * 4);
								}
								
								hittingTime = 0;
							}
							if(this.time == 0){
								new Flash(this);
								tank.opacity = 0;
								cannon.opacity = 0;
								this.image = shadow;
							}
							this.time++;
							if (this.time % 2 == 0) {
								//if(opaFlg) opaFlg = false;
								stopFlg = false;
								escapeFlg = false;
								if(fireFlgs[Num])fireFlgs[Num] = false;
							}

							new EnemyAim();

							Floor.intersect(this).forEach(elem => {
								shotNGflg = true;
								return;
							})
							Wall.intersect(this).forEach(elem => {
								shotNGflg = true;
								return;
							})
							/*for (let elem of floors) {
								if (intercept7.intersect(elem) == true) {
									shotNGflg = true;
									break;
								}
							};
							for (let elem of walls) {
								if (intercept7.intersect(elem) == true) {
									shotNGflg = true;
									break;
								}
							};*/

							if(this.time % 5 == 0){
								if (enemyTarget[Num] != target && escapeFlg == false) enemyTarget[Num] = target;
							}

							EnemyAim.intersect(alignment).forEach(elem => {
								if(!fireFlgs[Num])fireFlgs[Num] = true;
								return;
							})

							//	迎撃処理群
							//	優先順位：自身の弾＞プレイヤーの弾＞他戦車の弾
							//  他戦車の弾迎撃処理
							if (cateFlgs[category][2] == true && bulOb.length > 2) {
								brflg = false;
								for (let i = 1; i < bulOb.length; i++) {
									if(i == Num) continue;
									for (let j = 0; j < bulOb[i].length; j++) {
										if (bulStack[i][j] == true) {
											let dist = Instrumentation(enemyTarget[Num], bulOb[i][j]);
											if (dist != null && dist < cateRanges[category][2]) {
												
												if (cateEscapes[category][0] == true && cateEscapes[category][3] != 0) {
													if (dist < cateEscapes[category][3]) {
														enemyTarget[Num] = bulOb[i][j];
														escapeTarget = bulOb[i][j];
														escapeFlg = true;
														brflg = true;
														break;
													}
												}
											}
										}
									}
									if(brflg) break;
								}
							}
							//  プレイヤーの弾迎撃処理
							if (cateFlgs[category][0] == true) {
								for (let i = 0; i < bulOb[0].length; i++) {
									if (bulStack[0][i] == true) {
										let dist = Instrumentation(enemyTarget[Num], bulOb[0][i]);
										if (dist != null && dist < cateRanges[category][0]) {
											
											intercept.intersect(PlayerBulAim).forEach(function() {
												if (cateEscapes[category][1] != 0){
													enemyTarget[Num] = bulOb[0][i];
													return;
												} 
											})
											if (cateEscapes[category][0] == true && cateEscapes[category][1] != 0) {
												if (dist < cateEscapes[category][1]) {
													escapeTarget = bulOb[0][i];
													escapeFlg = true;
													break;
												}
											}
										}
									}
								}
							}
							//  自身の弾迎撃処理
							if (cateFlgs[category][1] == true) {
								for (let i = 0; i < bulOb[Num].length; i++) {
									if (bulStack[Num][i] == true) {
										let dist = Instrumentation(enemyTarget[Num], bulOb[Num][i]);
										if (dist != null && dist < cateRanges[category][1]) {
											this.intersect(BulAim).forEach(function() {
												if (cateEscapes[category][2] != 0) {
													enemyTarget[Num] = bulOb[Num][i];
													escapeTarget = bulOb[Num][i];
													if (cateEscapes[category][0] == true) {
														if (dist < cateEscapes[category][2] && dist > 100) {
															escapeFlg = true
															
														}
													}
													return;
												}
											})
										}
									}
								}
							}
							if (shotNGflg == false) {
								if (this.time % fireLate == 0 && fireFlgs[Num] == true) {
									if (Math.floor(Math.random() * emax * 2) > bullets[Num] && bullets[Num] < emax) {
										for (let i = 0; i < emax; i++) {
											if (bulStack[Num][i] == false) {
												colOb[Num][i] = new BulletCol(alignment, cannon, shotSpeed, grade, scene);
												bulOb[Num][i] = new Bullet(colOb[Num][i], cannon, ref, Num, shotSpeed, scene, i)
												ShotBullet(i)
												break;
											}

										}
									}
								}
							}

							if (reloadFlg == false) {
								if(shotNGflg) shotNGflg = false;
								if (bullets[Num] == emax) reloadFlg = true;
							} else {
								if (reloadTime < cateReloadTimes[category]) {
									reloadTime++;
									if (shotNGflg == false) shotNGflg = true;
								} else {
									shotNGflg = false;
									reloadFlg = false;
									reloadTime = 0;
								}

							}
							/*if (game.time % fireLate == 0 && shotNGflg == false) {
								if (Math.floor(Math.random() * emax * 2) > bullets[Num]) {
									for (let i = 0; i < emax; i++) {
										if (bulStack[Num][i] == false) {
											if (bullets[Num] < emax && deadFlgs[Num] == false && fireFlgs[Num] == true) {
												colOb[Num][i] = new BulletCol(alignment, cannon, shotSpeed, grade, scene);
												bulOb[Num][i] = new Bullet(colOb[Num][i], cannon, ref, Num, shotSpeed, scene, i)
												ShotBullet(i);
												break;
											}
										}
									}
								}
							}*/

							//	戦車本体の角度
							if (moveSpeed > 0) {
								if (game.time % 5 == 0) {
									if (escapeFlg == false) {
										if (Math.sqrt(Math.pow(weak.x - target.x, 2) + Math.pow(weak.y - target.y, 2)) < cateDistances[category]) {
											SelDirection(weak, target, 0)
										} else {
											if (game.time % 10 == 0) {
												SelDirection(weak, target, 1)
											}
										}
									} else {
										SelDirection(weak, escapeTarget, 0);
									}
									if(tankEntity.length > 2){
										for (var i = 0; i < tankEntity.length; i++) {
											if (i != Num && deadFlgs[i] == false) {
												if (this.intersect(tankEntity[i]) == true) {
													SelDirection(weak, tankEntity[i], 0);
													break;
												}
											}
										}
									}
									
								}
								if (shotStopFlg == false) {
									if (value == 0) {
										rot = 180;
										this.x -= speed;
									} else if (value == 1) {
										rot = 0;
										this.x += speed;
									} else if (value == 2) {
										rot = 270;
										this.y -= speed;
									} else if (value == 3) {
										rot = 90;
										this.y += speed;
									}
								}
								tank.rotation = rot;
							}
							for (let i = 0; i < tankDir.length; i++) {
								if (deadFlgs[i] == false && i != Num) {
									if (this.intersect(tankDir[i][0]) == true) {
										this.moveTo(this.x, tankDir[i][0].y - 60)
										break;
									}
									if (this.intersect(tankDir[i][1]) == true) {
										this.moveTo(this.x, tankDir[i][1].y + (tankDir[i][1].height))
										break;
									}
									if (this.intersect(tankDir[i][2]) == true) {
										this.moveTo(tankDir[i][2].x - 60, this.y)
										break;
									}
									if (this.intersect(tankDir[i][3]) == true) {
										this.moveTo(tankDir[i][3].x + (tankDir[i][3].width), this.y)
										break;
									}
								}
							}
							ObsWidthTop.intersect(this).forEach(elem => {
								this.moveTo(this.x, elem.y - 60);
								hittingTime++;
							})
							ObsWidthBottom.intersect(this).forEach(elem => {
								this.moveTo(this.x, elem.y + (elem.height))
								hittingTime++;
							})
							ObsHeightLeft.intersect(this).forEach(elem => {
								this.moveTo(elem.x - 60, this.y)
								hittingTime++;
							})
							ObsHeightRight.intersect(this).forEach(elem => {
								this.moveTo(elem.x + (elem.width), this.y)
								hittingTime++;
							})
							/*for (let i = 0; i < obsdir.length; i++) {
								if (this.intersect(obsdir[i][0]) == true && obsChk[i][0] == true) {
									this.moveTo(this.x, obsdir[i][0].y - 60)
									hittingTime++;
									break;
								}
								if (this.intersect(obsdir[i][1]) == true && obsChk[i][1] == true) {
									this.moveTo(this.x, obsdir[i][1].y + (obsdir[i][1].height))
									hittingTime++;
									break;
								}
								if (this.intersect(obsdir[i][2]) == true && obsChk[i][2] == true) {
									this.moveTo(obsdir[i][2].x - 60, this.y)
									hittingTime++;
									break;
								}
								if (this.intersect(obsdir[i][3]) == true && obsChk[i][3] == true) {
									this.moveTo(obsdir[i][3].x + (obsdir[i][3].width), this.y)
									hittingTime++;
									break;
								}
							}
							if (this.intersect(walls[0]) == true) {
								this.moveTo(this.x, walls[0].y + walls[0].height)
								hittingTime++;
							}
							if (this.intersect(walls[1]) == true) {
								this.moveTo(this.x, walls[1].y - walls[1].height + 2)
								hittingTime++;
							}
							if (this.intersect(walls[2]) == true) {
								this.moveTo(walls[2].x + walls[2].width, this.y)
								hittingTime++;
							}
							if (this.intersect(walls[3]) == true) {
								this.moveTo(walls[3].x - walls[3].width + 2, this.y)
								hittingTime++;
							}*/
						}
					}
				}
			}
			scene.addChild(this);
		}
	});
	/*var Stealth = Class.create(Sprite, {
		initialize: function(x, y, path1, path2, target, max, ref, shotSpeed, moveSpeed, fireLate, grade, category, scene, filterMap) {
			Sprite.call(this, pixelSize - 4, pixelSize - 4)
			this.x = x * pixelSize;
			this.y = y * pixelSize - 16;
			this.time = 0;

			var emax = max;
			const Num = entVal;
			entVal++;
			bullets[Num] = 0;
			boms[Num] = 0;
			deadFlgs.push(false)

			const cannon = new Cannon(this, path2, Num, scene);
			const tank = new Tank(this, path1, Num, scene, cannon);
			const weak = new Weak(this, Num, scene);
			this.weak = weak;
			this.cannon = cannon;
			this.tank = tank;
			TankFrame(this, Num, scene)

			//markEntity[Num] = null;

			tank.opacity = 1.0;
			cannon.opacity = 1.0;

			const intercept = new Intercept96(this, scene)
			const intercept7 = new InterceptC(cannon, scene)
			var value = Math.floor(Math.random() * 4);;
			var speed = moveSpeed;
			var rot = 0;
			var escapeFlg = false;
			var escapeTarget;
			var opaFlg = false;
			var opaVal = 1.0;
			var shotNGflg = false;
			let hittingTime = 0;
			let reloadTime = 0;
			let reloadFlg = false;
			let shotStopFlg = false;
			let shotStopTime = 0;

			let life = 1;

			if (moveSpeed != 0) {
				if (stageNum >= 20) {
					speed = speed + (0.1 * (stageNum / 20));
				}
			}

			enemyTarget[Num] = target;
			var alignment = new Target(Num, scene)
			//alignment.backgroundColor = 'blue'

			for (var i = 0; i < emax; i++) {
				colOb[Num][i] = new BulletCol(alignment, cannon, shotSpeed, grade, scene);
				bulOb[Num][i] = new Bullet(colOb[Num][i], cannon, ref, Num, shotSpeed, scene, i);
				bulStack[Num][i] = false;
				colOb[Num][i].moveTo(-230, -230)
				bulOb[Num][i].moveTo(-100, -100)
			}

			bomOb[Num][0] = new Bom(this, Num, scene);

			var EnemyAim = Class.create(Aim, {
				initialize: function() {
					if (pauseFlg == false) {
						Aim.call(this, alignment, cannon, 24, Num, scene);
					}

				}
			})

			//  移動方向決め処理
			function SelDirection(target1, target2, or) {
				if (or == 0) {
					if ((target1.x + target1.width / 2) > (target2.x + target2.width / 2)) {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							while (value == 0 || value == 2) value = Math.floor(Math.random() * 4);
						} else {
							while (value == 0 || value == 3) value = Math.floor(Math.random() * 4);
						}
					} else {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							while (value == 1 || value == 2) value = Math.floor(Math.random() * 4);
						} else {
							while (value == 1 || value == 3) value = Math.floor(Math.random() * 4);
						}
					}

				} else if (or == 1) {
					if ((target1.x + target1.width / 2) > (target2.x + target2.width / 2)) {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							while (value == 1 || value == 3) value = Math.floor(Math.random() * 4);
						} else {
							while (value == 1 || value == 2) value = Math.floor(Math.random() * 4);
						}

					} else {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							while (value == 0 || value == 3) value = Math.floor(Math.random() * 4);
						} else {
							while (value == 0 || value == 2) value = Math.floor(Math.random() * 4);
						}
					}

				}
			}

			function ShotBullet(i) {
				game.assets['./sound/s_car_door_O2.wav'].clone().play();
				if (shotSpeed >= 14) {
					game.assets['./sound/Sample_0003.wav'].clone().play();
				}
				scene.BulGroup.addChild(colOb[Num][i]);
				scene.BulGroup.addChild(bulOb[Num][i]);
				new OpenFire(cannon, alignment, scene)
				bullets[Num]++;
				bulStack[Num][i] = true;
				shotStopFlg = true;
				if(opaVal < 0.5) opaVal = 0.5;
				opaFlg = true;
			}

			function Instrumentation(target1, target2) {
				let dist1 = Math.sqrt(Math.pow(weak.x - target1.x, 2) + Math.pow(weak.y - target1.y, 2));
				let dist2 = Math.sqrt(Math.pow(weak.x - target2.x, 2) + Math.pow(weak.y - target2.y, 2));
				if (dist1 > dist2) {
					return dist2;
				} else {
					return null;
				}

			}

			if (addBullet != 0 && fireLate > 19) fireLate = fireLate - 5;

			this.onenterframe = function() {
				if (deleteFlg == true) {
					this.moveTo(-100, -100);
					scene.removeChild(alignment);
					scene.removeChild(intercept);
					scene.removeChild(intercept7);
					scene.TankGroup.removeChild(tank)
					scene.CannonGroup.removeChild(cannon)
					scene.removeChild(weak)
					scene.removeChild(this)
				}
				if (life > 0) {
                    if (deadFlgs[Num] == true) {
                        new Mark(this, scene);
                        tankColorCounts[category]--;
                        //alert(tankColorCounts)

                        new Explosion(this, scene);
                        this.moveTo(-100, -100)
                        destruction++
                        life--;
                        deadTank[Num - 1] = true;
                    }
					if (deadFlgs[0] == false) {
						//  死亡判定処理
						Bullet.intersectStrict(weak).forEach(elem => {
							if (bulStack[elem.num][elem.value] == true && defeat == false && victory == false && complete == false) {
								game.assets['./sound/mini_bomb2.mp3'].clone().play();
								deadFlgs[Num] = true
								Get_NewBullet(elem.num, elem.value);
								moveSpeed = 0;
							}
						})
						
						if (shotStopFlg) {
							shotStopTime++;
							if (shotStopTime > 10) {
								shotStopFlg = false;
								shotStopTime = 0;
							}
						}

						if (hittingTime > 30) {
							let val = value;
							while (value == val) value = Math.floor(Math.random() * 4);
							hittingTime = 0;
						}

						if (worldFlg == true) {
							this.time++;
							if (this.time % 2 == 0) {
								//if(opaFlg) opaFlg = false;
								stopFlg = false;
								escapeFlg = false;
								shotNGflg = false;
								fireFlgs[Num] = false;
                                tank.opacity = opaVal;
								cannon.opacity = opaVal;
								
                                switch(opaFlg){
									case true:
										switch(opaVal < 1){
											case true:
												opaVal += 0.1;
												break;
											case false:
												opaVal = 1.0;
												opaFlg = false;
												break;
										}
										
										break;
									case false:
										
										switch(opaVal > 0.05){
											case true:
												opaVal -= 0.05;
												break;
											case false:
												opaVal = 0;
												break;
											default:
												break;
										}
										
										break;
								}        	    
								if (this.within(target, 400)) {
									if (!opaFlg) opaFlg = true;
								}
							}

							new EnemyAim();

							for (let elem of floors) {
								if (intercept7.intersect(elem) == true) {
									shotNGflg = true;
									break;
								}
							};
							for (let elem of walls) {
								if (intercept7.intersect(elem) == true) {
									shotNGflg = true;
									break;
								}
							};

							if(this.time % 5 == 0){
								if (enemyTarget[Num] != target && escapeFlg == false) enemyTarget[Num] = target;
							}

							EnemyAim.intersect(alignment).forEach(elem => {
								if(!fireFlgs[Num])fireFlgs[Num] = true;
							})

							if (reloadFlg == false) {
								if (bullets[Num] == emax) reloadFlg = true;
							} else {
								if (reloadTime < cateReloadTimes[category]) {
									reloadTime++;
									if (shotNGflg == false) shotNGflg = true;
								} else {
									shotNGflg = false;
									reloadFlg = false;
									reloadTime = 0;
								}

							}

							//	迎撃処理群
							//	優先順位：自身の弾＞プレイヤーの弾＞他戦車の弾
							//  他戦車の弾迎撃処理
							if (cateFlgs[category][2] == true && bulOb.length > 2) {
								for (let i = 1; i < bulOb.length; i++) {
									if (i != Num) {
										for (let j = 0; j < bulOb[i].length; j++) {
											if (bulStack[i][j] == true) {
												let dist = Instrumentation(enemyTarget[Num], bulOb[i][j]);
												if (dist != null && dist < cateRanges[category][2]) {
													if (cateEscapes[category][0] == true && cateEscapes[category][3] != 0) {
														if (dist < cateEscapes[category][3]) {
															if (dist < 120) enemyTarget[Num] = bulOb[i][j];
															escapeTarget = bulOb[i][j];
															escapeFlg = true;
														}
													}
													intercept.intersect(BulAim).forEach(function() {
														if (cateEscapes[category][3] != 0) enemyTarget[Num] = bulOb[i][j]; //  迎撃のためにターゲット変更
													})
												}
											}
										}
									}
								}
							}
							//  プレイヤーの弾迎撃処理
							if (cateFlgs[category][0] == true) {
								for (let i = 0; i < bulOb[0].length; i++) {
									if (bulStack[0][i] == true) {
										let dist = Instrumentation(enemyTarget[Num], bulOb[0][i]);
										if (dist != null && dist < cateRanges[category][0]) {
											if (cateEscapes[category][0] == true && cateEscapes[category][1] != 0) {
												if (dist < cateEscapes[category][1]) {
													escapeTarget = bulOb[0][i];
													escapeFlg = true;
												}
											}
											intercept.intersect(PlayerBulAim).forEach(function() {
												if (cateEscapes[category][1] != 0) enemyTarget[Num] = bulOb[0][i];
											})
										}
									}
								}
							}
							//  自身の弾迎撃処理
							if (cateFlgs[category][1] == true) {
								for (let i = 0; i < bulOb[Num].length; i++) {
									if (bulStack[Num][i] == true) {
										let dist = Instrumentation(enemyTarget[Num], bulOb[Num][i]);
										if (dist != null && dist < cateRanges[category][1]) {
											this.intersect(BulAim).forEach(function() {
												if (cateEscapes[category][2] != 0) {
													enemyTarget[Num] = bulOb[Num][i];
													escapeTarget = bulOb[Num][i];
													if (cateEscapes[category][0] == true) {
														if (dist < cateEscapes[category][2] && dist > 100) {
															escapeFlg = true
														}
													}
												}
											})
										}
									}
								}
							}

							if (game.time % fireLate == 0 && shotNGflg == false) {
								if (Math.floor(Math.random() * emax * 2) > bullets[Num]) {
									for (let i = 0; i < emax; i++) {
										if (bulStack[Num][i] == false) {
											if (bullets[Num] < emax && deadFlgs[Num] == false && fireFlgs[Num] == true) {
												colOb[Num][i] = new BulletCol(alignment, cannon, shotSpeed, grade, scene);
												bulOb[Num][i] = new Bullet(colOb[Num][i], cannon, ref, Num, shotSpeed, scene, i)
												ShotBullet(i);
												break;
											}
										}
									}
								}
							}

							//	戦車本体の角度
							if (moveSpeed > 0) {
								if (this.time % 5 == 0) {
									if (escapeFlg == false) {
										if (Math.sqrt(Math.pow(weak.x - target.x, 2) + Math.pow(weak.y - target.y, 2)) < cateDistances[category]) {
											SelDirection(weak, target, 0)
										} else {
											if (game.time % 10 == 0) {
												SelDirection(weak, target, 1)
											}
										}
									} else {
										SelDirection(weak, escapeTarget, 0);
									}
									for (var i = 0; i < tankEntity.length; i++) {
										if (i != Num && deadFlgs[i] == false) {
											if (this.intersect(tankEntity[i]) == true) {
												SelDirection(weak, tankEntity[i], 0);
												break;
											}
										}
									}
								}
								if (shotStopFlg == false) {
									if (value == 0) {
										rot = 0;
										this.x -= speed;
									} else if (value == 1) {
										rot = 180;
										this.x += speed;
									} else if (value == 2) {
										rot = 90;
										this.y -= speed;
									} else if (value == 3) {
										rot = 270;
										this.y += speed;
									}
								}
								this.rotation = rot;
								tank.rotation = rot;
							}
							for (let i = 0; i < tankDir.length; i++) {
								if (deadFlgs[i] == false && i != Num) {
									if (this.intersect(tankDir[i][0]) == true) {
										this.moveTo(this.x, tankDir[i][0].y - 60)
									}
									if (this.intersect(tankDir[i][1]) == true) {
										this.moveTo(this.x, tankDir[i][1].y + (tankDir[i][1].height))
									}
									if (this.intersect(tankDir[i][2]) == true) {
										this.moveTo(tankDir[i][2].x - 60, this.y)
									}
									if (this.intersect(tankDir[i][3]) == true) {
										this.moveTo(tankDir[i][3].x + (tankDir[i][3].width), this.y)
									}
								}
							}
							for (let i = 0; i < obsdir.length; i++) {
								if (this.intersect(obsdir[i][0]) == true && obsChk[i][0] == true) {
									this.moveTo(this.x, obsdir[i][0].y - 60)
									hittingTime++;
								}
								if (this.intersect(obsdir[i][1]) == true && obsChk[i][1] == true) {
									this.moveTo(this.x, obsdir[i][1].y + (obsdir[i][1].height))
									hittingTime++;
								}
								if (this.intersect(obsdir[i][2]) == true && obsChk[i][2] == true) {
									this.moveTo(obsdir[i][2].x - 60, this.y)
									hittingTime++;
								}
								if (this.intersect(obsdir[i][3]) == true && obsChk[i][3] == true) {
									this.moveTo(obsdir[i][3].x + (obsdir[i][3].width), this.y)
									hittingTime++;
								}
							}
							if (this.intersect(walls[0]) == true) {
								this.moveTo(this.x, walls[0].y + walls[0].height)
								hittingTime++;
							}
							if (this.intersect(walls[1]) == true) {
								this.moveTo(this.x, walls[1].y - walls[1].height + 2)
								hittingTime++;
							}
							if (this.intersect(walls[2]) == true) {
								this.moveTo(walls[2].x + walls[2].width, this.y)
								hittingTime++;
							}
							if (this.intersect(walls[3]) == true) {
								this.moveTo(walls[3].x - walls[3].width + 2, this.y)
								hittingTime++;
							}
						}
					}
				}
			}
			scene.addChild(this);
		}
	});*/
	/* 敵(強)クラス */
	var Bomber = Class.create(Sprite, {
		initialize: function(x, y, path1, path2, target, max, ref, shotSpeed, moveSpeed, fireLate, grade, category, scene, filterMap) {
			Sprite.call(this, pixelSize - 4, pixelSize - 4)
			this.x = x * pixelSize + 2;
			this.y = y * pixelSize - 14;
			this.time = 0;

			var emax = max;
			const Num = entVal;
			entVal++;
			bullets[Num] = 0;
			boms[Num] = 0;
			deadFlgs.push(false)

			const cannon = new Cannon(this, path2, Num, scene);
			const tank = new Tank(this, path1, Num, scene, cannon);
			const weak = new Weak(this, Num, scene);
			this.weak = weak;
			this.cannon = cannon;
			this.tank = tank;
			TankFrame(this, Num, scene);

			//markEntity[Num] = null;

			tank.opacity = 1.0;
			cannon.opacity = 1.0;

			const intercept = new Intercept96(this, scene)
			const intercept7 = new InterceptC(cannon, scene)
			var value = Math.floor(Math.random() * 4);;
			var speed = moveSpeed;
			var bomFlg = false;
			var rot = 0;
			var escapeFlg = false;
			var escapeTarget;
			var shotNGflg = false;
			let hittingTime = 0;
			let reloadTime = 0;
			let reloadFlg = false;
			let shotStopFlg = false;
			let shotStopTime = 0;

			let life = 1;

			if (moveSpeed != 0) {
				if (stageNum >= 20) {
					speed = speed + (0.1 * (stageNum / 20));
				}
			}

			if (category == 2 && addBullet != 0) {
				ref = ref + addBullet;
			}

			enemyTarget[Num] = target;
			var alignment = new Target(Num, scene)
			//alignment.backgroundColor = 'blue'

			for (var i = 0; i < emax; i++) {
				colOb[Num][i] = new BulletCol(alignment, cannon, shotSpeed, grade, scene);
				bulOb[Num][i] = new Bullet(colOb[Num][i], cannon, ref, Num, shotSpeed, scene, i);
				bulStack[Num][i] = false;
				//colOb[Num][i].moveTo(-230, -230)
				//bulOb[Num][i].moveTo(-100, -100)
				colOb[Num][i].destroy();
				scene.BulGroup.removeChild(colOb[Num][i]);
				scene.BulGroup.removeChild(bulOb[Num][i]);
			}

			bomOb[Num][0] = new Bom(this, Num, scene);
			scene.BomGroup.removeChild(bomOb[Num][0]);

			var EnemyAim = Class.create(Aim, {
				initialize: function() {
					Aim.call(this, alignment, cannon, 28, Num, scene);
					this.scale(2,2);
				}
			})

			//  移動方向決め処理
			/*function SelDirection(target1, target2, or) {
				if (or == 0) {
					if ((target1.x + target1.width / 2) > (target2.x + target2.width / 2)) {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							while (value == 0 || value == 2) value = Math.floor(Math.random() * 4);
						} else {
							while (value == 0 || value == 3) value = Math.floor(Math.random() * 4);
						}
					} else {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							while (value == 1 || value == 2) value = Math.floor(Math.random() * 4);
						} else {
							while (value == 1 || value == 3) value = Math.floor(Math.random() * 4);
						}
					}

				} else if (or == 1) {
					if ((target1.x + target1.width / 2) > (target2.x + target2.width / 2)) {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							while (value == 1 || value == 3) value = Math.floor(Math.random() * 4);
						} else {
							while (value == 1 || value == 2) value = Math.floor(Math.random() * 4);
						}

					} else {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							while (value == 0 || value == 3) value = Math.floor(Math.random() * 4);
						} else {
							while (value == 0 || value == 2) value = Math.floor(Math.random() * 4);
						}
					}

				}
			}*/
			function SelDirection(target1, target2, or) {
				if (or == 0) {
					if (Math.floor(Math.random() * 2) == 0) {
						if ((target1.x + target1.width / 2) > (target2.x + target2.width / 2)) {
							if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
								while (value == 0 || value == 2 || value == 4) value = Math.floor(Math.random() * 8);
							} else {
								while (value == 0 || value == 3 || value == 6) value = Math.floor(Math.random() * 8);
							}
						} else {
							if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
								while (value == 1 || value == 2 || value == 5) value = Math.floor(Math.random() * 8);
							} else {
								while (value == 1 || value == 3 || value == 7) value = Math.floor(Math.random() * 8);
							}
						}
					} else {
						if ((target1.x + target1.width / 2) > (target2.x + target2.width / 2)) {
							if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
								while (value == 0 || value == 2) value = Math.floor(Math.random() * 8);
							} else {
								while (value == 0 || value == 3) value = Math.floor(Math.random() * 8);
							}
						} else {
							if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
								while (value == 1 || value == 2) value = Math.floor(Math.random() * 8);
							} else {
								while (value == 1 || value == 3) value = Math.floor(Math.random() * 8);
							}
						}
					}
					
				} else if (or == 1) {
					if (Math.floor(Math.random() * 2) == 0) {
						if ((target1.x + target1.width / 2) > (target2.x + target2.width / 2)) {
							if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
								while (value == 1 || value == 3 || value == 7) value = Math.floor(Math.random() * 8);
							} else {
								while (value == 1 || value == 2 || value == 5) value = Math.floor(Math.random() * 8);
							}

						} else {
							if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
								while (value == 0 || value == 3 || value == 6) value = Math.floor(Math.random() * 8);
							} else {
								while (value == 0 || value == 2 || value == 4) value = Math.floor(Math.random() * 8);
							}
						}
					} else {
						if ((target1.x + target1.width / 2) > (target2.x + target2.width / 2)) {
							if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
								while (value == 1 || value == 3) value = Math.floor(Math.random() * 8);
							} else {
								while (value == 1 || value == 2) value = Math.floor(Math.random() * 8);
							}

						} else {
							if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
								while (value == 0 || value == 3) value = Math.floor(Math.random() * 8);
							} else {
								while (value == 0 || value == 2) value = Math.floor(Math.random() * 8);
							}
						}
					}

				}
			}

			function ShotBullet(i) {
				game.assets['./sound/s_car_door_O2.wav'].clone().play();
				scene.BulGroup.addChild(colOb[Num][i]);
				scene.BulGroup.addChild(bulOb[Num][i]);
				new OpenFire(cannon, alignment, scene)
				bullets[Num]++;
				bulStack[Num][i] = true;
				shotStopFlg = true;
			}

			function Instrumentation(target1, target2) {
				let dist1 = Math.sqrt(Math.pow(weak.x - target1.x, 2) + Math.pow(weak.y - target1.y, 2));
				let dist2 = Math.sqrt(Math.pow(weak.x - target2.x, 2) + Math.pow(weak.y - target2.y, 2));
				if (dist1 > dist2) {
					return dist2;
				} else {
					return null;
				}

			}

			function ResetAim(from) {
				if(enemyTarget[Num] == tankEntity[0]){
					let v = Rot_to_Vec(enemyTarget[Num].rotation, 0);
					let val = 16 * (Math.floor(Math.random() * 3)+1) + 24;
					v.x = v.x * val + enemyTarget[Num].x;
					v.y = v.y * val + enemyTarget[Num].y;
					//console.log(v);
					let p = Pos_to_Vec({ x: from.x + (from.width / 2), y: from.y + (from.height / 2) }, v);
					//console.log({ x: from.x + (from.width / 2), y: from.y + (from.height / 2) });
					//console.log(p);
					let rad = Math.atan2(p.y, p.x);
					cannon.rotation = (90 + (Math.atan2(Math.cos(rad), Math.sin(rad)) * 180) / Math.PI) * -1;
				}
			}

			if (addBullet != 0) fireLate = fireLate - 3;

			this.onenterframe = function() {
				if (deleteFlg == true) {
					this.moveTo(-100, -100);
					scene.removeChild(alignment);
					scene.removeChild(intercept);
					scene.removeChild(intercept7);
					scene.TankGroup.removeChild(tank)
					scene.CannonGroup.removeChild(cannon)
					scene.removeChild(weak)
					scene.removeChild(this)
				}
				if (life > 0) {
                    if (deadFlgs[Num] == true) {
                        new Mark(this, scene);
                        tankColorCounts[category]--;
                        new Explosion(this, scene);
                        destruction++;
						this.moveTo((-64 * destruction), -100);
                        life--;
                        deadTank[Num - 1] = true;
                    }
					if (deadFlgs[0] == false) {
						
						
						/*for(var j = 0; j < bulOb.length; j++){
						    for(var k = 0; k < bulOb[j].length; k++){
						        if(defeat == false && weak.intersectStrict(bulOb[j][k])==true && bulStack[j][k] == true){
						            game.assets['./sound/mini_bomb2.mp3'].clone().play();
						            deadFlgs[Num] = true
						            Get_NewBullet(j,k);
						            moveSpeed = 0;
						        }
						    }
						}*/
						

						if (worldFlg == true) {
							//  死亡判定処理
							Bullet.intersectStrict(weak).forEach(elem => {
								if (bulStack[elem.num][elem.value] == true && defeat == false && victory == false && complete == false) {
									game.assets['./sound/mini_bomb2.mp3'].clone().play();
									deadFlgs[Num] = true;
									moveSpeed = 0;
									Get_NewBullet(elem.num, elem.value);
								}
								return;
							})
							if (shotStopFlg == true) {
								shotStopTime++;
								if (shotStopTime > 10) {
									shotStopFlg = false;
									shotStopTime = 0;
								}
							}
	
							if (hittingTime > 10) {
								/*if(value < 2){
									while (value == 0 || value == 1) value = Math.floor(Math.random() * 4);
								}else{
									while (value == 2 || value == 3) value = Math.floor(Math.random() * 4);
								}*/
								if (value == 4) {
									//左上
									while (value == 4 || value == 0 || value == 1) value = Math.floor(Math.random() * 8);
								} else if (value == 5) {
									//右上
									while (value == 5 || value == 1 || value == 2) value = Math.floor(Math.random() * 8);
								} else if (value == 6) {
									//左下
									while (value == 6 || value == 2 || value == 3) value = Math.floor(Math.random() * 8);
								} else if (value == 7) {
									//右下
									while (value == 7 || value == 0 || value == 3) value = Math.floor(Math.random() * 8);
								} else if (value == 0) {
									while (value == 0 || value == 1) value = Math.floor(Math.random() * 4);
								} else if (value == 1) {
									while (value == 0 || value == 1) value = Math.floor(Math.random() * 4);
								} else if (value == 2) {
									while (value == 2 || value == 3) value = Math.floor(Math.random() * 4);
								} else if (value == 3) {
									while (value == 2 || value == 3) value = Math.floor(Math.random() * 4);
								}
								
								hittingTime = 0;
							}
							this.time++;
							if (this.time % 2 == 0) {
								stopFlg = false;
								escapeFlg = false;
								shotNGflg = false;
								fireFlgs[Num] = false;
                                
							}

							new EnemyAim();

							/*for (let elem of floors) {
								if (this.intersect(elem) == true) {
									shotNGflg = true;
									break;
								}
							};
							for (let elem of walls) {
								if (this.intersect(elem) == true) {
									shotNGflg = true;
									break;
								}
							};*/
							/*intercept7.intersectStrict(Floor).forEach(function(){
							    shotNGflg = true;
							})
							intercept7.intersectStrict(Wall).forEach(function(){
							    shotNGflg = true;
							})*/

							EnemyAim.intersect(alignment).forEach(elem => {
								fireFlgs[Num] = true;
							})

							if(this.time % 5 == 0){
								if (enemyTarget[Num] != target && escapeFlg == false) enemyTarget[Num] = target;
							}



							/*avoids.forEach(elem=>{
							    if(tank.within(elem,60)==true){
							        stopFlg = true;
							    }
							})*/

							/* 迎撃処理群
							    優先順位：自身の弾＞プレイヤーの弾＞他戦車の弾
							*/
							//  他戦車の弾迎撃処理
							/*if (cateFlgs[category][2] == true && bulOb.length > 2) {
								let brflg = false;
								for (let i = 1; i < bulOb.length; i++) {
									if(i == Num) continue;
									for (let j = 0; j < bulOb[i].length; j++) {
										if (bulStack[i][j] == true) {
											let dist = Instrumentation(enemyTarget[Num], bulOb[i][j]);
											if (dist != null && dist < cateRanges[category][2]) {
												
												if (cateEscapes[category][0] == true && cateEscapes[category][3] != 0) {
													if (dist < cateEscapes[category][3]) {
														if (dist < 120) enemyTarget[Num] = bulOb[i][j];
														escapeTarget = bulOb[i][j];
														escapeFlg = true;
														brflg = true;
														break;
													}
												}
											}
										}
									}
									if(brflg) break;
								}
								
							}*/
							//  プレイヤーの弾迎撃処理
							if (cateFlgs[category][0] == true) {
								for (let i = 0; i < bulOb[0].length; i++) {
									if (bulStack[0][i] == true) {
										let dist = Instrumentation(enemyTarget[Num], bulOb[0][i]);
										if (dist != null && dist < cateRanges[category][0]) {
											
											intercept.intersect(PlayerBulAim).forEach(function() {
												if (cateEscapes[category][1] != 0){
													enemyTarget[Num] = bulOb[0][i];
													return;
												} 
											})
											if (cateEscapes[category][0] == true && cateEscapes[category][1] != 0) {
												if (dist < cateEscapes[category][1]) {
													escapeTarget = bulOb[0][i];
													escapeFlg = true;
													break;
												}
											}
										}
									}
								}
							}
							//  自身の弾迎撃処理
							/*if (cateFlgs[category][1] == true) {
								for (let i = 0; i < bulOb[Num].length; i++) {
									if (bulStack[Num][i] == true) {
										let dist = Instrumentation(enemyTarget[Num], bulOb[Num][i]);
										if (dist != null && dist < cateRanges[category][1]) {
											this.intersect(BulAim).forEach(function() {
												if (cateEscapes[category][2] != 0) {
													enemyTarget[Num] = bulOb[Num][i];
													escapeTarget = bulOb[Num][i];
													if (cateEscapes[category][0] == true) {
														if (dist < cateEscapes[category][2] && dist > 100) {
															escapeFlg = true
														}
													}
													return;
												}
											})
										}
									}
								}
							}*/
							
							if (reloadFlg == false) {
								if (bullets[Num] == emax) reloadFlg = true;
							} else {
								if (reloadTime < cateReloadTimes[category]) {
									reloadTime++;
									if (shotNGflg == false) shotNGflg = true;
								} else {
									shotNGflg = false;
									reloadFlg = false;
									reloadTime = 0;
								}

							}

							if (shotNGflg == false) {
								if (this.time % fireLate == 0 && fireFlgs[Num] == true) {
									if (Math.floor(Math.random() * emax * 2) > bullets[Num] && bullets[Num] < emax) {
										for (let i = 0; i < emax; i++) {
											if (bulStack[Num][i] == false) {
												ResetAim(this);
												colOb[Num][i] = new BulletCol(alignment, cannon, shotSpeed, 0, scene);
												bulOb[Num][i] = new Bullet(colOb[Num][i], cannon, ref, Num, shotSpeed, scene, i)
												ShotBullet(i)
												break;
											}

										}
									}
								}
							}
							/*if (game.time % fireLate == 0 && shotNGflg == false) {
								if (Math.floor(Math.random() * emax * 2) > bullets[Num]) {
									for (let i = 0; i < emax; i++) {
										if (bulStack[Num][i] == false) {
											if (bullets[Num] < emax && deadFlgs[Num] == false && fireFlgs[Num] == true) {
												colOb[Num][i] = new BulletCol(alignment, cannon, shotSpeed, grade, scene);
												bulOb[Num][i] = new Bullet(colOb[Num][i], cannon, ref, Num, shotSpeed, scene, i)
												ShotBullet(i);
												break;
											}
										}
									}
								}
							}*/
							
							if (this.time % 5 == 0) {

								if (tank.within(target, 200) == true && bomFlg == false && boms[Num] == 0) {
									game.assets['./sound/Sample_0009.wav'].clone().play();
									bomOb[Num][0] = new Bom(this, Num, scene);
									scene.BomGroup.addChild(bomOb[Num][0]);
									this.time = 0;
									bomFlg = true;
									boms[Num]++;
								} else if (bomFlg == true && boms[Num] <= 0) {
									bomFlg = false;
									bomOb[Num][0] = new Bom(this, Num, scene);
									scene.BomGroup.removeChild(bomOb[Num][0]);
									boms[Num] = 0
								}

								if(moveSpeed > 0){
									
									if(tankEntity.length > 2){
										if(game.time % 30 == 0){
											for (var i = 0; i < tankEntity.length; i++) {
												if (i != Num && deadFlgs[i] == false) {
													if (intercept.intersectStrict(tankEntity[i]) == true) {
														//SelDirection(weak, tankEntity[i], 0)
														//value = Escape_Rot(this, tankEntity[i]);
														hittingTime+=5;
														break;
													}
												}
											}
										}
										
									}
									if(boms[Num] > 0){
												
										if(bomOb[Num][0].within(weak,200)==true){
											SelDirection(weak,bomOb[Num][0],0)
											if (shotNGflg == false) shotNGflg = true;
										}else{
											if(escapeFlg){
												//SelDirection(weak, escapeTarget, 0);
												value = Escape_Rot(weak, escapeTarget);
											}else{
												SelDirection(weak, target, 1);
											}
											//SelDirection(weak, target, 1);
										}
										/*if (Math.sqrt(Math.pow(weak.x - bomOb[Num][0].x, 2) + Math.pow(weak.y - bomOb[Num][0].y, 2)) < 400) {
											
											//value = Escape_Rot(this, bomOb[Num][0]);
										}*/
									}else if (escapeFlg == false) {
										if (Math.sqrt(Math.pow(weak.x - target.x, 2) + Math.pow(weak.y - target.y, 2)) < cateDistances[category]) {
											SelDirection(weak, target, 0)
										} else {
											if (game.time % 10 == 0) {
												SelDirection(weak, target, 1)
											}
										}
									} else {
										value = Escape_Rot(weak, escapeTarget);
										//SelDirection(weak, escapeTarget, 0);
									}
								}
								
							}
							
							if (shotStopFlg == false && moveSpeed > 0) {
								if (value == 4) {
									//左上
									rot = 225
									this.x -= speed / 1.5;
									this.y -= speed / 1.5;
								} else if (value == 5) {
									//右上
									rot = 315
									this.x += speed / 1.5;
									this.y -= speed / 1.5;
								} else if (value == 6) {
									//左下
									rot = 135
									this.x -= speed / 1.5;
									this.y += speed / 1.5;
								} else if (value == 7) {
									//右下
									rot = 45
									this.x += speed / 1.5;
									this.y += speed / 1.5;
								} else if (value == 0) {
									rot = 180;
									this.x -= speed;
								} else if (value == 1) {
									rot = 0;
									this.x += speed;
								} else if (value == 2) {
									rot = 270;
									this.y -= speed;
								} else if (value == 3) {
									rot = 90;
									this.y += speed;
								}
								/*if (value == 0) {
									rot = 180;
									this.x -= speed;
								} else if (value == 1) {
									rot = 0;
									this.x += speed;
								} else if (value == 2) {
									rot = 270;
									this.y -= speed;
								} else if (value == 3) {
									rot = 90;
									this.y += speed;
								}*/
								/* 戦車本体の角度 */
								this.rotation = rot;
								tank.rotation = rot;
							}


							
							for (let i = 0; i < tankDir.length; i++) {
								if (deadFlgs[i] == false && i != Num) {
									if (this.intersect(tankDir[i][0]) == true) {
										this.moveTo(this.x, tankDir[i][0].y - 60)
									}
									if (this.intersect(tankDir[i][1]) == true) {
										this.moveTo(this.x, tankDir[i][1].y + (tankDir[i][1].height))
									}
									if (this.intersect(tankDir[i][2]) == true) {
										this.moveTo(tankDir[i][2].x - 60, this.y)
									}
									if (this.intersect(tankDir[i][3]) == true) {
										this.moveTo(tankDir[i][3].x + (tankDir[i][3].width), this.y)
									}
								}
							}
							ObsWidthTop.intersect(this).forEach(elem => {
								this.moveTo(this.x, elem.y - 60);
								hittingTime++;
							})
							ObsWidthBottom.intersect(this).forEach(elem => {
								this.moveTo(this.x, elem.y + (elem.height))
								hittingTime++;
							})
							ObsHeightLeft.intersect(this).forEach(elem => {
								this.moveTo(elem.x - 60, this.y)
								hittingTime++;
							})
							ObsHeightRight.intersect(this).forEach(elem => {
								this.moveTo(elem.x + (elem.width), this.y)
								hittingTime++;
							})
							/*for (let i = 0; i < obsdir.length; i++) {
								if (this.intersect(obsdir[i][0]) == true && obsChk[i][0] == true) {
									this.moveTo(this.x, obsdir[i][0].y - 60)
									hittingTime++;
								}
								if (this.intersect(obsdir[i][1]) == true && obsChk[i][1] == true) {
									this.moveTo(this.x, obsdir[i][1].y + (obsdir[i][1].height))
									hittingTime++;
								}
								if (this.intersect(obsdir[i][2]) == true && obsChk[i][2] == true) {
									this.moveTo(obsdir[i][2].x - 60, this.y)
									hittingTime++;
								}
								if (this.intersect(obsdir[i][3]) == true && obsChk[i][3] == true) {
									this.moveTo(obsdir[i][3].x + (obsdir[i][3].width), this.y)
									hittingTime++;
								}
							}
							if (this.intersect(walls[0]) == true) {
								this.moveTo(this.x, walls[0].y + walls[0].height)
								hittingTime++;
							}
							if (this.intersect(walls[1]) == true) {
								this.moveTo(this.x, walls[1].y - walls[1].height + 2)
								hittingTime++;
							}
							if (this.intersect(walls[2]) == true) {
								this.moveTo(walls[2].x + walls[2].width, this.y)
								hittingTime++;
							}
							if (this.intersect(walls[3]) == true) {
								this.moveTo(walls[3].x - walls[3].width + 2, this.y)
								hittingTime++;
							}*/
						}
					}
				}
			}
			scene.addChild(this);
		}
	});
	var AIElite = Class.create(Sprite, {
		initialize: function(x, y, path1, path2, target, max, ref, shotSpeed, moveSpeed, fireLate, grade, category, scene, filterMap, map, g) {
			Sprite.call(this, pixelSize - 4, pixelSize - 4)
			this.x = x * pixelSize + 2;
			this.y = y * pixelSize - 14;
			this.time = 0;

			var emax = max;
			const Num = entVal;
			entVal++;
			bullets[Num] = 0;
			boms[Num] = 0;
			deadFlgs.push(false)

			const cannon = new Cannon(this, path2, Num, scene);
			const tank = new Tank(this, path1, Num, scene, cannon);
			const weak = new Weak(this, Num, scene);
			this.weak = weak;
			this.cannon = cannon;
			this.tank = tank;
			TankFrame(this, Num, scene);

			//markEntity[Num] = null;

			tank.opacity = 1.0;
			cannon.opacity = 1.0;

			const intercept = new Intercept96(this, scene)
			const intercept7 = new InterceptC(cannon, scene)
			var value = Math.floor(Math.random() * 4);
			var speed = moveSpeed;
			var rot = 0;
			var escapeFlg = false;
			var escapeTarget = target;
			var shotNGflg = false;
			let hittingTime = 0;
			let reloadTime = 0;
			let reloadFlg = false;
			let shotStopFlg = false;
			let shotStopTime = 0;
			let reload = cateReloadTimes[category];
			var tankStopFlg = false;

			var grid = g; //  マップの障害物配置情報
			var root; //  移動ルート
			var rootFlg = false;

			var myPath = [parseInt((this.y + 41) / pixelSize), parseInt((this.x + 34.5) / pixelSize)]
			var targetPath = [parseInt((target.y + 41) / pixelSize), parseInt((target.x + 34.5) / pixelSize)]

			let life = 1;

			let brflg = false;

			if (moveSpeed != 0) {
				if (stageNum >= 20) {
					speed = speed + (0.1 * (stageNum / 20));
				}
			}

			enemyTarget[Num] = target;
			var alignment = new Target(Num, scene);
			//alignment.backgroundColor = 'blue'

			for (var i = 0; i < emax; i++) {
				colOb[Num][i] = new BulletCol(alignment, cannon, shotSpeed, grade, scene);
				bulOb[Num][i] = new Bullet(colOb[Num][i], cannon, ref, Num, shotSpeed, scene, i);
				bulStack[Num][i] = false;
				//colOb[Num][i].moveTo(-240, -240)
				//bulOb[Num][i].moveTo(-100, -100)
				colOb[Num][i].destroy();
				scene.BulGroup.removeChild(colOb[Num][i]);
				scene.BulGroup.removeChild(bulOb[Num][i]);
			}

			bomOb[Num][0] = new Bom(this, Num, scene);

			var EnemyAim = Class.create(Aim, {
				initialize: function() {
					Aim.call(this, alignment, cannon, 24, Num, scene);
					if(ref == 0)this.scale(2,2);
				}
			})

			//  移動方向決め処理
			function SelDirection(target1, target2, or) {
				if (or == 0) {
					if ((target1.x + target1.width / 2) > (target2.x + target2.width / 2)) {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							while (value == 0 || value == 2) value = Math.floor(Math.random() * 4);
						} else {
							while (value == 0 || value == 3) value = Math.floor(Math.random() * 4);
						}
					} else {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							while (value == 1 || value == 2) value = Math.floor(Math.random() * 4);
						} else {
							while (value == 1 || value == 3) value = Math.floor(Math.random() * 4);
						}
					}
				} else if (or == 1) {
					if ((target1.x + target1.width / 2) > (target2.x + target2.width / 2)) {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							while (value == 1 || value == 3) value = Math.floor(Math.random() * 4);
						} else {
							while (value == 1 || value == 2) value = Math.floor(Math.random() * 4);
						}

					} else {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							while (value == 0 || value == 3) value = Math.floor(Math.random() * 4);
						} else {
							while (value == 0 || value == 2) value = Math.floor(Math.random() * 4);
						}
					}
				}
			}

			function ShotBullet(i) {
				game.assets['./sound/s_car_door_O2.wav'].clone().play();
				if (shotSpeed >= 14) {
					game.assets['./sound/Sample_0003.wav'].clone().play();
				}
				scene.BulGroup.addChild(colOb[Num][i]);
				scene.BulGroup.addChild(bulOb[Num][i]);
				new OpenFire(cannon, alignment, scene);
				bullets[Num]++;
				bulStack[Num][i] = true;
				shotStopFlg = true;
				if(addBullet == 1 && category == 10){
					fireLate = Math.floor(Math.random() * 90) + 30;
				}
			}

			function Instrumentation(target1, target2) {
				let dist1 = Math.sqrt(Math.pow(weak.x - target1.x, 2) + Math.pow(weak.y - target1.y, 2));
				let dist2 = Math.sqrt(Math.pow(weak.x - target2.x, 2) + Math.pow(weak.y - target2.y, 2));
				if (dist1 > dist2) {
					return dist2;
				} else {
					return null;
				}

			}

			if (addBullet != 0 && category == 5){
				fireLate = 20;
				moveSpeed -= 0.2;
			} 
			if(addBullet != 0 && category == 10){
				reload = 120;
				moveSpeed -= 0.3;
				fireLate = Math.floor(Math.random() * 30) + 30;
			} 

			this.onenterframe = function() {
				if (deleteFlg == true) {
					this.moveTo(-100, -100);
					scene.removeChild(alignment);
					scene.removeChild(intercept);
					scene.removeChild(intercept7);
					scene.TankGroup.removeChild(tank);
					scene.CannonGroup.removeChild(cannon);
					scene.removeChild(weak);
					scene.removeChild(this);
				}
				if (life > 0) {
                    if (deadFlgs[Num] == true) {
                        new Mark(this, scene);
                        tankColorCounts[category]--;
                        new Explosion(this, scene);
                        destruction++;
						this.moveTo((-64 * destruction), -100);
                        life--;
                        deadTank[Num - 1] = true;
                    }
					if (deadFlgs[0] == false) {
						//  死亡判定処理
						Bullet.intersectStrict(weak).forEach(elem => {
							if (bulStack[elem.num][elem.value] == true && defeat == false && victory == false && complete == false) {
								game.assets['./sound/mini_bomb2.mp3'].clone().play();
								deadFlgs[Num] = true;
								moveSpeed = 0;
								Get_NewBullet(elem.num, elem.value);
							}
							return;
						})
						
						/*for(var j = 0; j < bulOb.length; j++){
						    for(var k = 0; k < bulOb[j].length; k++){
						        if(defeat == false && weak.intersectStrict(bulOb[j][k])==true && bulStack[j][k] == true){
						            game.assets['./sound/mini_bomb2.mp3'].clone().play();
						            deadFlgs[Num] = true
						            Get_NewBullet(j,k);
						            moveSpeed = 0;
						        }
						    }
						}*/
						

						if (worldFlg == true) {
							this.time++;
							if (this.time % 2 == 0) {
								if (escapeFlg == false) rootFlg = false;
								if (enemyTarget[Num] != target) rootFlg = true;
								if (tankStopFlg) tankStopFlg = false;
								escapeFlg = false;
								shotNGflg = false;
								fireFlgs[Num] = false;
								if(moveSpeed != 0 && rootFlg == false){
									if (escapeFlg == false && tankStopFlg == false) {
										//  自身の位置とターゲットの位置をざっくり算出
										myPath = [parseInt((this.y + (this.height / 2) - 1) / pixelSize), parseInt((this.x + (this.width / 2) - 1) / pixelSize)]
										targetPath = [parseInt((target.y + 41) / pixelSize), parseInt((target.x + 34.5) / pixelSize)]
										//  マップの障害物情報に自身とターゲットの位置設定
										for (var i = 0; i < grid.length; i++) {
											for (var j = 0; j < grid[i].length; j++) {
												if (i == myPath[0] && j == myPath[1]) {
													grid[i][j] = 'Start';
												} else if (i == targetPath[0] && j == targetPath[1]) {
													grid[i][j] = 'Goal';
												} else {
													//  StartやGoalの位置が更新されている場合の処理
													if (map.collisionData[i][j] == 0) {
														grid[i][j] = 'Empty';
													} else {
														grid[i][j] = 'Obstacle';
													}
												}
											}
										}
										if (this.time % 20 == 0 || this.time == 1) {
											root = findShortestPath([myPath[0], myPath[1]], grid, scene);
											if (root[0] == "East") {
												value = 1;
											} else if (root[0] == "West") {
												value = 0;
											} else if (root[0] == "North") {
												value = 2;
											} else if (root[0] == "South") {
												value = 3;
											} else {
												rootFlg = true;
											}
										}
	
									}
								}
								
							}
							if (shotStopFlg == true) {
								shotStopTime++;
								if (shotStopTime > 10) {
									shotStopFlg = false;
									shotStopTime = 0;
								}
							}

							if (hittingTime >= 20) {
								if(value < 2){
									while (value == 0 || value == 1) value = Math.floor(Math.random() * 4);
								}else{
									while (value == 2 || value == 3) value = Math.floor(Math.random() * 4);
								}
								hittingTime = 0;
							}

							/*for(var j = 0; j < bulOb.length; j++){
							    for(var k = 0; k < bulOb[j].length; k++){
							        if(tank.within(bulOb[j][k],28)==true || weak.intersectStrict(bulOb[j][k])==true){
							            game.assets['./sound/mini_bomb2.mp3'].clone().play();
							            deadFlgs[Num] = true
							            colOb[j][k].destroy()
							            colOb[j][k].moveTo(-200,-200)
							            bulOb[j][k].moveTo(-200,-200)
							            bulStack[j][k] = false;
							            moveSpeed = 0;
							        }
							    }
							}*/

							new EnemyAim();



							/*for (let elem of floors) {
								if (intercept7.intersect(elem)) {
									shotNGflg = true;
									break;
								}
							};
							for (let elem of walls) {
								if (intercept7.intersect(elem)) {
									shotNGflg = true;
									break;
								}
							};*/
							if(ref > 0){
								intercept7.intersect(Floor).forEach(function(){
									shotNGflg = true;
									return;
								})
								intercept7.intersect(Wall).forEach(function(){
									shotNGflg = true;
									return;
								})
							}
							

							EnemyAim.intersectStrict(alignment).forEach(elem => {
								if(fireFlgs[Num] == false)fireFlgs[Num] = true;
								if(rootFlg == false)rootFlg = true;
								return;
							});

							if (this.time % 5 == 0) {
								
								if (enemyTarget[Num] != target && escapeFlg == false) enemyTarget[Num] = target;
							}

							/* 迎撃処理群
							    優先順位：自身の弾＞プレイヤーの弾＞他戦車の弾
							*/
							//  他戦車の弾迎撃処理
							if (cateFlgs[category][2] == true && bulOb.length > 2) {
								brflg = false;
								for (let i = 1; i < bulOb.length; i++) {
									if(i == Num) continue;
									for (let j = 0; j < bulOb[i].length; j++) {
										if (bulStack[i][j] == true) {
											let dist = Instrumentation(enemyTarget[Num], bulOb[i][j]);
											if (dist != null && dist < cateRanges[category][2]) {
												if (cateEscapes[category][0] == true && cateEscapes[category][3] != 0) {
													if (dist < cateEscapes[category][3]) {
														escapeTarget = bulOb[i][j];
														escapeFlg = true;
														enemyTarget[Num] = bulOb[i][j];
														brflg = true;
														break;
													}
												}
												/*BulAim.intersect(intercept).forEach(function() {
													if (cateEscapes[category][3] != 0) enemyTarget[Num] = bulOb[i][j]; //  迎撃のためにターゲット変更
													if (this.time % 5 == 0) {
														SelDirection(weak, bulOb[i][j], 0)
													}
												})*/
											}
										}
									}
									if(brflg) break;
								}
							}
							//  プレイヤーの弾迎撃処理
							if (cateFlgs[category][0] == true) {
								for (let i = 0; i < bulOb[0].length; i++) {
									if (bulStack[0][i] == true) {
										let dist = Instrumentation(enemyTarget[Num], bulOb[0][i]);
										if (dist != null && dist < cateRanges[category][0]) {
											if (cateEscapes[category][0] == true && cateEscapes[category][1] != 0) {
												if (dist < cateEscapes[category][1]) {
													escapeTarget = bulOb[0][i]
													escapeFlg = true;
												}
												if (dist < 128) {
													if (this.time % 10 == 0) {
														value = Escape_Rot(this, bulOb[0][i]);
														//SelDirection(weak,bulOb[0][i],0)
													}
												}
											}
											PlayerBulAim.intersectStrict(intercept).forEach(elem => {
												if (cateEscapes[category][1] != 0) enemyTarget[Num] = bulOb[0][i];
												if (this.time % 10 == 0) {
													value = Escape_Rot(this, bulOb[0][i]);
													//SelDirection(weak,bulOb[0][i],0)
												}
											})
											/*PlayerBulAim.intersectStrict(intercept).forEach(function(){
											    if(cateEscapes[category][1] != 0) enemyTarget[Num] = bulOb[0][i];
											    if(this.time % 5 == 0){
											        value = Escape_Rot(this,bulOb[0][i]);
											        //SelDirection(weak,bulOb[0][i],0)
											    }
											})*/
										}
									}
								}
							}
							//  自身の弾迎撃処理
							if (cateFlgs[category][1] == true) {
								for (let i = 0; i < bulOb[Num].length; i++) {
									if (bulStack[Num][i] == true) {
										let dist = Instrumentation(enemyTarget[Num], bulOb[Num][i]);
										if (dist != null && dist < cateRanges[category][1]) {
											if (intercept.intersectStrict(bulOb[Num][i])) {
												if (this.time % 10 == 0) {
													value = Escape_Rot(this, bulOb[Num][i]);
												}
											}
											BulAim.intersectStrict(intercept).forEach(elem => {
												if (elem.target == bulOb[Num][i]) {
													if (this.time % 5 == 0) {
														value = Escape_Rot(this, bulOb[Num][i]);
														//SelDirection(weak,bulOb[0][i],0)
													}
													if (cateEscapes[category][2] != 0) {
														enemyTarget[Num] = bulOb[Num][i];
														if (cateEscapes[category][0] == true) {
															if (dist < cateEscapes[category][2] && dist > 100) {
																escapeTarget = bulOb[Num][i]
																escapeFlg = true;
															}
														}
													}
												}

											})
											/*this.intersect(BulAim).forEach(function(){     
											    if(cateEscapes[category][2] != 0){
											        enemyTarget[Num] = bulOb[Num][i];
											        if(cateEscapes[category][0]==true){
											            if(dist < cateEscapes[category][2] && dist > 100){
											                escapeTarget = bulOb[Num][i]
											                escapeFlg = true
											            }
											        }
											    }
											    if(this.time % 5 == 0){
											        value = Escape_Rot(this,bulOb[Num][i]);
											        //SelDirection(weak,bulOb[0][i],0)
											    }
											})*/
										}
									}
								}
							}

							if (reloadFlg == false) {
								if (bullets[Num] == emax) reloadFlg = true;
							} else {
								if (reloadTime < reload) {
									shotNGflg = true;
									reloadTime++;
								} else {
									//alert(reload)
									shotNGflg = false;
									reloadFlg = false;
									reloadTime = 0;
								}

							}

							if (shotNGflg == false) {
								if (this.time % fireLate == 0 && fireFlgs[Num] == true) {
									if (Math.floor(Math.random() * emax * 2) > bullets[Num] && bullets[Num] < emax) {
										for (let i = 0; i < emax; i++) {
											if (bulStack[Num][i] == false) {
												
												if (category == 5 || category == 10) {
													colOb[Num][i] = new BulletCol(alignment, cannon, shotSpeed, 0, scene);
												}else{
													colOb[Num][i] = new BulletCol(alignment, cannon, shotSpeed, grade, scene);
												}
												//colOb[Num][i] = new BulletCol(alignment, cannon, shotSpeed, grade, scene);
												bulOb[Num][i] = new Bullet(colOb[Num][i], cannon, ref, Num, shotSpeed, scene, i)
												ShotBullet(i);
												break;
											}

										}
									}
								}
							}

							/*if (this.time % fireLate == 0 && shotNGflg == false) {
								if (Math.floor(Math.random() * (emax * 2)) > bullets[Num]) {
									for (let i = 0; i < emax; i++) {
										if (bulStack[Num][i] == false) {
											if (bullets[Num] < emax && deadFlgs[Num] == false && fireFlgs[Num] == true) {
												if (category == 5 || category == 10) {
													colOb[Num][i] = new BulletCol(alignment, cannon, shotSpeed, 0, scene);
												}else{
													colOb[Num][i] = new BulletCol(alignment, cannon, shotSpeed, grade, scene);
												}
												bulOb[Num][i] = new Bullet(colOb[Num][i], cannon, ref, Num, shotSpeed, scene, i)
												ShotBullet(i);
												break;
											}
										}
									}
								}
							}*/

							
							if (moveSpeed > 0) {
								if (this.time % 5 == 0) {
									
									if (escapeFlg == false) {
										if(tankEntity.length > 2){
											for (let i = 1; i < tankEntity.length; i++) {
												if (tankEntity[i].intersectStrict(intercept) && i != Num && deadFlgs[i] == false) {
													//fireFlgs[Num] = false;
													//tankStopFlg = true;
													value = Escape_Rot(this, tankEntity[i]);
													break;
												}
											}
										}
										
										if (Math.sqrt(Math.pow(weak.x - target.x, 2) + Math.pow(weak.y - target.y, 2)) < cateDistances[category]) {
											SelDirection(weak, target, 0)
										} else {
											if (this.time % 10 == 0 && rootFlg == true) {
												SelDirection(weak, target, 1)
											}
										}
										
									} else {
										SelDirection(weak, escapeTarget, 0);
									}
								}
								/* 戦車本体の角度 */
								if (shotStopFlg == false) {
									if (value == 0) {
										rot = 180;
										this.x -= speed;
									} else if (value == 1) {
										rot = 0;
										this.x += speed;
									} else if (value == 2) {
										rot = 270;
										this.y -= speed;
									} else if (value == 3) {
										rot = 90;
										this.y += speed;
									}
								}

								this.rotation = rot;
								tank.rotation = rot;
							}
							for (let i = 0; i < tankDir.length; i++) {
								if (deadFlgs[i] == false && i != Num) {
									if (this.intersect(tankDir[i][0]) == true) {
										this.moveTo(this.x, tankDir[i][0].y - 60)
									}
									if (this.intersect(tankDir[i][1]) == true) {
										this.moveTo(this.x, tankDir[i][1].y + (tankDir[i][1].height))
									}
									if (this.intersect(tankDir[i][2]) == true) {
										this.moveTo(tankDir[i][2].x - 60, this.y)
									}
									if (this.intersect(tankDir[i][3]) == true) {
										this.moveTo(tankDir[i][3].x + (tankDir[i][3].width), this.y)
									}
								}
							}
							ObsWidthTop.intersect(this).forEach(elem => {
								this.moveTo(this.x, elem.y - 60);
								hittingTime++;
							})
							ObsWidthBottom.intersect(this).forEach(elem => {
								this.moveTo(this.x, elem.y + (elem.height))
								hittingTime++;
							})
							ObsHeightLeft.intersect(this).forEach(elem => {
								this.moveTo(elem.x - 60, this.y)
								hittingTime++;
							})
							ObsHeightRight.intersect(this).forEach(elem => {
								this.moveTo(elem.x + (elem.width), this.y)
								hittingTime++;
							})
							/*for (let i = 0; i < obsdir.length; i++) {
								if (this.intersect(obsdir[i][0]) == true && obsChk[i][0] == true) {
									this.y = obsdir[i][0].y - 60;
									//this.moveTo(this.x, obsdir[i][0].y - 60)
									hittingTime++;
								}
								if (this.intersect(obsdir[i][1]) == true && obsChk[i][1] == true) {
									this.y = obsdir[i][1].y + (obsdir[i][1].height);
									//this.moveTo(this.x, obsdir[i][1].y + (obsdir[i][1].height))
									hittingTime++;
								}
								if (this.intersect(obsdir[i][2]) == true && obsChk[i][2] == true) {
									this.x = obsdir[i][2].x - 60;
									//this.moveTo(obsdir[i][2].x - 60, this.y)
									hittingTime++;
								}
								if (this.intersect(obsdir[i][3]) == true && obsChk[i][3] == true) {
									this.x = obsdir[i][3].x + (obsdir[i][3].width);
									//this.moveTo(obsdir[i][3].x + (obsdir[i][3].width), this.y)
									hittingTime++;
								}
							}
							if (this.intersect(walls[0]) == true) {
								this.y = (64 * 2) - 16;
								//this.moveTo(this.x, (64 * 2) - 16)
								hittingTime++;
							}
							if (this.intersect(walls[1]) == true) {
								this.y = (64 * 13) - 12;
								//this.moveTo(this.x, (64 * 13) - 12)
								hittingTime++;
							}
							if (this.intersect(walls[2]) == true) {
								this.x = (64 * 1);
								//this.moveTo((64 * 1), this.y)
								hittingTime++;
							}
							if (this.intersect(walls[3]) == true) {
								this.x = (64 * 18) + 3;
								//this.moveTo((64 * 18) + 3, this.y)
								hittingTime++;
							}*/
						}
					}

				}
			}
			scene.addChild(this);
		}
	});
	var AnotherElite = Class.create(Sprite, {
		initialize: function(x, y, path1, path2, target, max, ref, shotSpeed, moveSpeed, fireLate, grade, category, scene, filterMap) {
			Sprite.call(this, pixelSize - 4, pixelSize - 4)
			this.x = x * pixelSize + 2;
			if(category == 0){
				this.y = y * pixelSize - 14;
			}else{
				this.y = y * pixelSize - 46;
			}
			
			this.time = 0;

			var emax = max;
			const Num = entVal;
			entVal++;
			bullets[Num] = 0;
			boms[Num] = 0;
			deadFlgs.push(false)

			const cannon = new Cannon(this, path2, Num, scene);
			const tank = new Tank(this, path1, Num, scene, cannon);
			const weak = new Weak(this, Num, scene);
			this.weak = weak;
			this.cannon = cannon;
			this.tank = tank;
			TankFrame(this, Num, scene);

			cannon.rotation = 0;
			//markEntity[Num] = null;

			const anoPoint = new AnotherPoint(target, Num, scene)
			var shotNGflg = false;
			let reloadTime = 0;
			let reloadFlg = false;
			this.aimingTime = 0;
			this.aimCmpTime = 20;
			let aimRot = 1.2;
			if (category == 0) {
				aimRot = 1.5;
			}
			if (Math.floor(Math.random() * 2)) {
				aimRot *= -1;
			}
			
			let life = 1;

			enemyTarget[Num] = target;

			for (var i = 0; i < emax; i++) {
				colOb[Num][i] = new BulletCol(anoPoint, cannon, shotSpeed, grade, scene);
				bulOb[Num][i] = new Bullet(colOb[Num][i], cannon, ref, Num, shotSpeed, scene, i);
				bulStack[Num][i] = false;
				//colOb[Num][i].moveTo(-230, -230)
				//bulOb[Num][i].moveTo(-100, -100)
				colOb[Num][i].destroy();
				scene.BulGroup.removeChild(colOb[Num][i]);
				scene.BulGroup.removeChild(bulOb[Num][i]);
			}

			bomOb[Num][0] = new Bom(this, Num, scene);

			let EnemyAim = Class.create(AnotherAim, {
				initialize: function() {
					AnotherAim.call(this, anoPoint, cannon, ref, Num, scene);
				}
			})

			function ShotBullet(i) {
				game.assets['./sound/s_car_door_O2.wav'].clone().play();
				if (shotSpeed >= 14) {
					game.assets['./sound/Sample_0003.wav'].clone().play();
				}
				scene.BulGroup.addChild(colOb[Num][i]);
				scene.BulGroup.addChild(bulOb[Num][i]);
				new OpenFire(cannon, anoPoint, scene);
				bullets[Num]++;
				bulStack[Num][i] = true;
				shotStopFlg = true;
			}

			if(addBullet != 0 && category == 0){
				shotSpeed = 10;
			} 

			this.onenterframe = function() {
				if (deleteFlg == true) {
					this.moveTo(-100, -100)
					scene.TankGroup.removeChild(tank)
					scene.CannonGroup.removeChild(cannon)
					scene.removeChild(weak)
					scene.removeChild(this)
				}
				if (life > 0) {
                    if (deadFlgs[Num] == true) {
                        new Mark(this, scene);
                        tankColorCounts[category]--;
                        new Explosion(this, scene);
                        destruction++;
						this.moveTo((-64 * destruction), -100);
                        life--;
                        deadTank[Num - 1] = true;
                    }
					if (deadFlgs[0] == false) {
						
						
						/*for(var j = 0; j < bulOb.length; j++){
						    for(var k = 0; k < bulOb[j].length; k++){
						        if(defeat == false && weak.intersectStrict(bulOb[j][k])==true && bulStack[j][k] == true){
						            game.assets['./sound/mini_bomb2.mp3'].clone().play();
						            deadFlgs[Num] = true
						            Get_NewBullet(j,k);
						            moveSpeed = 0;
						        }
						    }
						}*/


						if (worldFlg == true) {
							//  死亡判定処理
							Bullet.intersectStrict(weak).forEach(elem => {
								if (bulStack[elem.num][elem.value] == true && defeat == false && victory == false && complete == false) {
									game.assets['./sound/mini_bomb2.mp3'].clone().play();
									deadFlgs[Num] = true;
									moveSpeed = 0;
								}
								Get_NewBullet(elem.num, elem.value);
								return;
							})
							this.time++;
							if (this.time % 2 == 0) {
								shotNGflg = false;
								fireFlgs[Num] = false;


								//if(this.time % 2 == 0)
								new EnemyAim();


								/*EnemyAim.intersect(target).forEach(function(){
								    fireFlgs[Num] = true;
								    if(aimingTime < aimCmpTime+10)aimingTime++;
								})*/

								/*if(fireFlgs[Num]){
								    if(this.aimingTime % 5 == 0 && this.aimingTime > 0){
								        aimRot *= -1;
								    }
								}else{
								    if(this.aimingTime < this.aimCmpTime){
								        cannon.rotation += aimRot;
								    }
								}*/

								/*if(aimingTime % 5 == 0 && aimingTime > 0 && fireFlgs[Num] == true){
								    aimRot *= -1;
								}
								if(fireFlgs[Num] == false && aimingTime < aimCmpTime + 5){
								    cannon.rotation += aimRot;
								}*/


							}
							EnemyAim.intersectStrict(target).forEach(elem => {
								if (anoPoint.x != elem.tgt[0] || anoPoint.y != elem.tgt[1]) {
									anoPoint.x = elem.tgt[0];
									anoPoint.y = elem.tgt[1];
								}
								if (elem.hitTime == 0 && cannon.rotation != elem.agl) cannon.rotation = elem.agl;
								if (elem.hitTime < 4 && !fireFlgs[Num]) fireFlgs[Num] = true;
								if (this.aimingTime < (this.aimCmpTime + 15)) this.aimingTime += 3;
                                elem.hitTime++;
								return;
							})
							if (this.aimingTime > 0) {
								if (fireFlgs[Num] && this.aimingTime % 10 == 0) {
									aimRot *= -1;
								}
							}
							if (this.aimingTime < this.aimCmpTime) {
								if (!fireFlgs[Num]) {
									cannon.rotation += aimRot;
								}
							}

							if (this.time % 5 == 0) {
								if (this.aimingTime > 0 && fireFlgs[Num] == false) this.aimingTime--;
								//if(this.aimingTime > 0) this.aimingTime--;
								if (reloadFlg == false) {
									if (bullets[Num] == emax) reloadFlg = true;
								} else {
									if (reloadTime < cateReloadTimes[category]) {
										reloadTime++;
										if (shotNGflg == false) shotNGflg = true;
									} else {
										shotNGflg = false;
										reloadFlg = false;
										reloadTime = 0;
									}

								}
								if (shotNGflg == false) {
									if (this.time % fireLate == 0 && fireFlgs[Num] == true && this.aimingTime > this.aimCmpTime) {
										if (Math.floor(Math.random() * emax * 2) > bullets[Num] && bullets[Num] < emax) {
											for (let i = 0; i < emax; i++) {
												if (bulStack[Num][i] == false) {
													colOb[Num][i] = new BulletCol(anoPoint, cannon, shotSpeed, 0, scene);
													bulOb[Num][i] = new Bullet(colOb[Num][i], cannon, ref, Num, shotSpeed, scene, i)
													ShotBullet(i)
													this.aimingTime = 0;
													if (category != 0) {
														this.aimCmpTime = Math.floor(Math.random() * 60) + 20;
													} else {
														this.aimCmpTime = Math.floor(Math.random() * 30) + 10;
													}
													break;
												}
	
											}
										}
									}
								}
							}
							
							for (let i = 0; i < tankDir.length; i++) {
								if (deadFlgs[i] == false && i != Num) {
									if (this.intersect(tankDir[i][0]) == true) {
										this.moveTo(this.x, tankDir[i][0].y - 60)
									}
									if (this.intersect(tankDir[i][1]) == true) {
										this.moveTo(this.x, tankDir[i][1].y + (tankDir[i][1].height))
									}
									if (this.intersect(tankDir[i][2]) == true) {
										this.moveTo(tankDir[i][2].x - 60, this.y)
									}
									if (this.intersect(tankDir[i][3]) == true) {
										this.moveTo(tankDir[i][3].x + (tankDir[i][3].width), this.y)
									}
								}
							}
							ObsWidthTop.intersect(this).forEach(elem => {
								this.moveTo(this.x, elem.y - 60);
							})
							ObsWidthBottom.intersect(this).forEach(elem => {
								this.moveTo(this.x, elem.y + (elem.height))
							})
							ObsHeightLeft.intersect(this).forEach(elem => {
								this.moveTo(elem.x - 60, this.y)
							})
							ObsHeightRight.intersect(this).forEach(elem => {
								this.moveTo(elem.x + (elem.width), this.y)
							})
							/*for (let i = 0; i < obsdir.length; i++) {
								if (this.intersect(obsdir[i][0]) == true && obsChk[i][0] == true) {
									this.moveTo(this.x, obsdir[i][0].y - 60)
								}
								if (this.intersect(obsdir[i][1]) == true && obsChk[i][1] == true) {
									this.moveTo(this.x, obsdir[i][1].y + (obsdir[i][1].height))
								}
								if (this.intersect(obsdir[i][2]) == true && obsChk[i][2] == true) {
									this.moveTo(obsdir[i][2].x - 60, this.y)
								}
								if (this.intersect(obsdir[i][3]) == true && obsChk[i][3] == true) {
									this.moveTo(obsdir[i][3].x + (obsdir[i][3].width), this.y)
								}
							}	
							if (this.intersect(walls[0]) == true) {
								this.moveTo(this.x, walls[0].y + walls[0].height)
							}
							if (this.intersect(walls[1]) == true) {
								this.moveTo(this.x, walls[1].y - walls[1].height + 2)
							}
							if (this.intersect(walls[2]) == true) {
								this.moveTo(walls[2].x + walls[2].width, this.y)
							}
							if (this.intersect(walls[3]) == true) {
								this.moveTo(walls[3].x - walls[3].width + 2, this.y)
							}*/
						}
					}
				}
			}
			scene.addChild(this);
		}
	});
	/* 敵(強)クラス */
	var FullFire = Class.create(Sprite, {
		initialize: function(x, y, path1, path2, target, max, ref, shotSpeed, moveSpeed, fireLate, grade, category, scene, filterMap) {
			Sprite.call(this, pixelSize - 4, pixelSize - 4)
			this.x = x * pixelSize + 2;
			this.y = y * pixelSize - 14;
			this.time = 0;

			var emax = max;
			const Num = entVal;
			entVal++;
			bullets[Num] = 0;
			boms[Num] = 0;
			deadFlgs.push(false)

			const cannon = new Cannon(this, path2, Num, scene);
			const tank = new Tank(this, path1, Num, scene, cannon);
			const weak = new Weak(this, Num, scene);
			this.weak = weak;
			this.cannon = cannon;
			this.tank = tank;
			TankFrame(this, Num, scene)

			var shotNGflg = false;
			let reloadTime = 0;
			let reloadFlg = false;
			let fullFireFlg = false;
			let firecnt = 0;
			let reload = cateReloadTimes[category];

			let life = 1;

			if (addBullet != 0){
				fireLate = 6;
				reload -= 120;
			}

			enemyTarget[Num] = target;
			var alignment = new Target(Num, scene)
			//alignment.backgroundColor = 'blue'

			for (var i = 0; i < emax; i++) {
				colOb[Num][i] = new BulletCol(alignment, cannon, shotSpeed, grade, scene);
				bulOb[Num][i] = new Bullet(colOb[Num][i], cannon, ref, Num, shotSpeed, scene, i);
				bulStack[Num][i] = false;
				//colOb[Num][i].moveTo(-230, -230)
				//bulOb[Num][i].moveTo(-100, -100)
				colOb[Num][i].destroy();
				scene.BulGroup.removeChild(colOb[Num][i]);
				scene.BulGroup.removeChild(bulOb[Num][i]);
			}

			bomOb[Num][0] = new Bom(this, Num, scene);

			var EnemyAim = Class.create(Aim, {
				initialize: function() {
					Aim.call(this, alignment, cannon, 24, Num, scene);
				}
			})

			function ShotBullet(i) {
				game.assets['./sound/s_car_door_O2.wav'].clone().play();
				scene.BulGroup.addChild(colOb[Num][i]);
				scene.BulGroup.addChild(bulOb[Num][i]);
				new OpenFire(cannon, alignment, scene)
				bullets[Num]++;
				bulStack[Num][i] = true;
				shotStopFlg = true;
			}

			this.onenterframe = function() {
				if (deleteFlg == true) {
					this.moveTo(-100, -100);
					scene.removeChild(alignment);
					scene.TankGroup.removeChild(tank)
					scene.CannonGroup.removeChild(cannon)
					scene.removeChild(weak)
					scene.removeChild(this)
				}
				if (life > 0) {
                    if (deadFlgs[Num] == true) {
                        new Mark(this, scene);
                        tankColorCounts[category]--;
                        new Explosion(this, scene);
                        destruction++;
						this.moveTo((-64 * destruction), -100);
                        life--;
                        deadTank[Num - 1] = true;
                    }
					if (deadFlgs[0] == false) {
						

						if (worldFlg == true) {
							//  死亡判定処理
							Bullet.intersectStrict(weak).forEach(elem => {
								if (bulStack[elem.num][elem.value] == true && defeat == false && victory == false && complete == false) {
									game.assets['./sound/mini_bomb2.mp3'].clone().play();
									deadFlgs[Num] = true;
									moveSpeed = 0;
									Get_NewBullet(elem.num, elem.value);
								}
								return;
							})

							this.time++;
							if (this.time % 2 == 0) {
								shotNGflg = false;
								if(!fullFireFlg && bullets[Num] == emax) fireFlgs[Num] = false;
                                
							}

							new EnemyAim();

							/*for (let elem of floors) {
								if (this.intersect(elem) == true) {
									shotNGflg = true;
									break;
								}
							};
							for (let elem of walls) {
								if (this.intersect(elem) == true) {
									shotNGflg = true;
									break;
								}
							};*/

							EnemyAim.intersect(alignment).forEach(elem => {
								if(!fireFlgs[Num])fireFlgs[Num] = true;
								return;
							})



							/*avoids.forEach(elem=>{
							    if(tank.within(elem,60)==true){
							        stopFlg = true;
							    }
							})*/
							if (this.time % 10 == 0) {
								enemyTarget[Num] = target;
							}

							if (reloadFlg == false) {
								if (bullets[Num] == emax || firecnt == emax){
									reloadFlg = true;
									fullFireFlg = false;
									firecnt = 0;
									fireFlgs[Num] = false;
								}
							} else {
								if (reloadTime < reload) {
									reloadTime++;
									if (shotNGflg == false) shotNGflg = true;
								} else {
									shotNGflg = false;
									reloadFlg = false;
									reloadTime = 0;
								}

							}

							if (shotNGflg == false) {
								if (this.time % fireLate == 0 && (fireFlgs[Num] == true || fullFireFlg)) {
									if ((Math.floor(Math.random() * emax * 2) > bullets[Num] || fullFireFlg) && bullets[Num] < emax) {
										for (let i = 0; i < emax; i++) {
											if (bulStack[Num][i] == false) {
												fullFireFlg = true;
												colOb[Num][i] = new BulletCol(alignment, cannon, shotSpeed, 5, scene);
												bulOb[Num][i] = new Bullet(colOb[Num][i], cannon, ref, Num, shotSpeed, scene, i)
												ShotBullet(i)
												firecnt++;
												break;
											}

										}
									}
								}
							}

							/*if (this.time % fireLate == 0 && shotNGflg == false) {
								if (Math.floor(Math.random() * emax * 2) > bullets[Num]) {
									for (let i = 0; i < emax; i++) {
										if (bulStack[Num][i] == false) {
											if (bullets[Num] < emax && deadFlgs[Num] == false && fireFlgs[Num] == true) {
												if (category == 2) {
													colOb[Num][i] = new BulletCol(alignment, cannon, shotSpeed, 0, scene);
												}else{
													colOb[Num][i] = new BulletCol(alignment, cannon, shotSpeed, grade, scene);
												}
												bulOb[Num][i] = new Bullet(colOb[Num][i], cannon, ref, Num, shotSpeed, scene, i)
												ShotBullet(i);
												break;
											}
										}
									}
								}
							}*/
							
							/*for (let i = 0; i < tankDir.length; i++) {
								if (deadFlgs[i] == false && i != Num) {
									if (this.intersect(tankDir[i][0]) == true) {
										this.moveTo(this.x, tankDir[i][0].y - 60)
									}
									if (this.intersect(tankDir[i][1]) == true) {
										this.moveTo(this.x, tankDir[i][1].y + (tankDir[i][1].height))
									}
									if (this.intersect(tankDir[i][2]) == true) {
										this.moveTo(tankDir[i][2].x - 60, this.y)
									}
									if (this.intersect(tankDir[i][3]) == true) {
										this.moveTo(tankDir[i][3].x + (tankDir[i][3].width), this.y)
									}
								}
							}*/
							ObsWidthTop.intersect(this).forEach(elem => {
								this.moveTo(this.x, elem.y - 60);
							})
							ObsWidthBottom.intersect(this).forEach(elem => {
								this.moveTo(this.x, elem.y + (elem.height))
							})
							ObsHeightLeft.intersect(this).forEach(elem => {
								this.moveTo(elem.x - 60, this.y)
							})
							ObsHeightRight.intersect(this).forEach(elem => {
								this.moveTo(elem.x + (elem.width), this.y)
							})
							/*for (let i = 0; i < obsdir.length; i++) {
								if (this.intersect(obsdir[i][0]) == true && obsChk[i][0] == true) {
									this.moveTo(this.x, obsdir[i][0].y - 60)
								}
								if (this.intersect(obsdir[i][1]) == true && obsChk[i][1] == true) {
									this.moveTo(this.x, obsdir[i][1].y + (obsdir[i][1].height))
								}
								if (this.intersect(obsdir[i][2]) == true && obsChk[i][2] == true) {
									this.moveTo(obsdir[i][2].x - 60, this.y)
								}
								if (this.intersect(obsdir[i][3]) == true && obsChk[i][3] == true) {
									this.moveTo(obsdir[i][3].x + (obsdir[i][3].width), this.y)
								}
							}
							if (this.intersect(walls[0]) == true) {
								this.moveTo(this.x, walls[0].y + walls[0].height)
							}
							if (this.intersect(walls[1]) == true) {
								this.moveTo(this.x, walls[1].y - walls[1].height + 2)
							}
							if (this.intersect(walls[2]) == true) {
								this.moveTo(walls[2].x + walls[2].width, this.y)
							}
							if (this.intersect(walls[3]) == true) {
								this.moveTo(walls[3].x - walls[3].width + 2, this.y)
							}*/
						}
					}
				}
			}
			scene.addChild(this);
		}
	});
	/* 強敵クラス */
	/*var Boss = Class.create(Sprite, {
		initialize: function(x, y, tankPath, cannonPath, target, max, ref, shotSpeed, moveSpeed, fireLate, grade, category, scene, filterMap) {
			Sprite.call(this, pixelSize - 4, pixelSize - 4)
			this.x = x * pixelSize;
			this.y = y * pixelSize - 16;
			this.time = 0;

			const Num = entVal;
			entVal++;
			bullets[Num] = 0;
			boms[Num] = 0;
			deadFlgs.push(false)

			const cannon = new Cannon(this, cannonPath, Num, scene);
			const tank = new Tank(this, tankPath, Num, scene, cannon);
			const weak = new Weak(this, Num, scene);
			this.weak = weak;
			this.cannon = cannon;
			this.tank = tank;
			TankFrame(this, Num, scene);

			tank.opacity = 1.0;
			cannon.opacity = 1.0;

			const intercept3 = new Intercept192(this, scene)
			const intercept4 = new Intercept600(this, scene)
			const intercept5 = new InterceptA(cannon, scene)
			const intercept6 = new InterceptB(cannon, scene)
			const intercept7 = new InterceptC(cannon, scene)
			const intercept8 = new Intercept96(this, scene)
			var value = 0;
			var rot = 0;
			var emax = max
			var speed = moveSpeed;
			var stopFlg = false;
			var dflg = false;
			var defenseMax = parseInt(max / 2) - 1;
			var escapeFlg = false;
			var opaFlg = false;
			var opaVal = 1.0;
			let life = 1;
			let hittingTime = 0;
			let reloadFlg = false;
			let reloadTime = 0;
			let shotNGflg = false;
			let shotStopFlg = false;
			let shotStopTime = 0;

			if (moveSpeed != 0) {
				if (stageNum >= 20) {
					speed = speed + (0.1 * (stageNum / 20));
				}
			}

			enemyTarget[Num] = target;
			var alignment = new Target(Num, scene)

			for (var i = 0; i < max + defenseMax; i++) {
				colOb[Num][i] = new BulletCol(alignment, cannon, shotSpeed, grade, scene);
				bulOb[Num][i] = new Bullet(colOb[Num][i], cannon, ref, Num, shotSpeed, scene, i);
				bulStack[Num][i] = false;
				colOb[Num][i].moveTo(-250, -250)
				bulOb[Num][i].moveTo(-100, -100)
			}

			bomOb[Num][0] = new Bom(this, Num, scene);

			var EnemyAim = Class.create(Aim, {
				initialize: function(target, shotSpeed, num, scene) {
					Aim.call(this, target, cannon, 15, num, scene);
				}
			})
			if (addBullet != 0) {
				if (shotSpeed < 14) shotSpeed += 1;
			}

			function SelDirection(target1, target2, or) {
				if (or == 0) {
					if (Math.floor(Math.random() * 2) == 0) {
						if ((target1.x + target1.width / 2) > (target2.x + target2.width / 2)) {
							if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
								while (value == 0 || value == 2 || value == 4) value = Math.floor(Math.random() * 8);
							} else {
								while (value == 0 || value == 3 || value == 6) value = Math.floor(Math.random() * 8);
							}
						} else {
							if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
								while (value == 1 || value == 2 || value == 5) value = Math.floor(Math.random() * 8);
							} else {
								while (value == 1 || value == 3 || value == 7) value = Math.floor(Math.random() * 8);
							}
						}
					} else {
						if ((target1.x + target1.width / 2) > (target2.x + target2.width / 2)) {
							if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
								while (value == 0 || value == 2) value = Math.floor(Math.random() * 8);
							} else {
								while (value == 0 || value == 3) value = Math.floor(Math.random() * 8);
							}
						} else {
							if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
								while (value == 1 || value == 2) value = Math.floor(Math.random() * 8);
							} else {
								while (value == 1 || value == 3) value = Math.floor(Math.random() * 8);
							}
						}
					}
					
				} else if (or == 1) {
					if (Math.floor(Math.random() * 2) == 0) {
						if ((target1.x + target1.width / 2) > (target2.x + target2.width / 2)) {
							if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
								while (value == 1 || value == 3 || value == 7) value = Math.floor(Math.random() * 8);
							} else {
								while (value == 1 || value == 2 || value == 5) value = Math.floor(Math.random() * 8);
							}

						} else {
							if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
								while (value == 0 || value == 3 || value == 6) value = Math.floor(Math.random() * 8);
							} else {
								while (value == 0 || value == 2 || value == 4) value = Math.floor(Math.random() * 8);
							}
						}
					} else {
						if ((target1.x + target1.width / 2) > (target2.x + target2.width / 2)) {
							if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
								while (value == 1 || value == 3) value = Math.floor(Math.random() * 8);
							} else {
								while (value == 1 || value == 2) value = Math.floor(Math.random() * 8);
							}

						} else {
							if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
								while (value == 0 || value == 3) value = Math.floor(Math.random() * 8);
							} else {
								while (value == 0 || value == 2) value = Math.floor(Math.random() * 8);
							}
						}
					}

				}
			}

			function ShotBullet(i) {
				game.assets['./sound/s_car_door_O2.wav'].clone().play();
				if (shotSpeed >= 14) {
					game.assets['./sound/Sample_0003.wav'].clone().play();
				}
				scene.BulGroup.addChild(colOb[Num][i]);
				scene.BulGroup.addChild(bulOb[Num][i]);
				new OpenFire(cannon, alignment, scene)
				bullets[Num]++;
				bulStack[Num][i] = true;
				shotStopFlg = true;
			}

			function Instrumentation(target1, target2) {
				let dist1 = Math.sqrt(Math.pow(weak.x - target1.x, 2) + Math.pow(weak.y - target1.y, 2));
				let dist2 = Math.sqrt(Math.pow(weak.x - target2.x, 2) + Math.pow(weak.y - target2.y, 2));
				if (dist1 > dist2) {
					return dist2;
				} else {
					return null;
				}

			}
			this.onenterframe = function() {

				if (deleteFlg == true) {
					this.moveTo(-100, -100)
					scene.removeChild(intercept3);
					scene.removeChild(intercept4);
					scene.removeChild(intercept5);
					scene.removeChild(intercept6);
					scene.removeChild(intercept7);
					scene.removeChild(intercept8);
					scene.removeChild(alignment);
					scene.TankGroup.removeChild(tank)
					scene.CannonGroup.removeChild(cannon)
					scene.removeChild(weak)
					scene.removeChild(this)
				}
				if (life > 0) {
                    if (deadFlgs[Num] == true) {
                        new Mark(this, scene);
                        tankColorCounts[category]--;

                        new Explosion(this, scene);
                        this.moveTo(-100, -100)
                        destruction++
                        life--;
                        deadTank[Num - 1] = true;
                    }
					if (deadFlgs[0] == false) {
						//  死亡判定処理
						Bullet.intersectStrict(weak).forEach(elem => {
							if (bulStack[elem.num][elem.value] == true && defeat == false && victory == false && complete == false) {
								game.assets['./sound/mini_bomb2.mp3'].clone().play();
								deadFlgs[Num] = true
								Get_NewBullet(elem.num, elem.value);
								moveSpeed = 0;
							}
						})
						
						if (shotStopFlg == true) {
							shotStopTime++;
							if (shotStopTime > 10) {
								shotStopFlg = false;
								shotStopTime = 0;
							}
						}




						if (worldFlg == true) {
							this.time++;
							if (intercept8.rotation != this.rotation + 45) intercept8.rotation = this.rotation + 45;

							if (hittingTime > 15 && escapeFlg == false) {
								let val = value;
								if (grade > 9) {
									while (value == val) value = Math.floor(Math.random() * 8);
								} else {
									while (value == val) value = Math.floor(Math.random() * 4);
								}
								hittingTime = 0;
							}

							if (dflg == false && escapeFlg == false) {
								if (moveSpeed != 0) {
									speed = moveSpeed + addSpeed;
									if (stageNum >= 20 && grade < 10) {
										speed = speed + (0.2 * (stageNum / 20));
									}
								}
							} else {
								if (moveSpeed != 0) {
									speed = moveSpeed + addSpeed;
									if (stageNum >= 20 && grade < 10) {
										speed = speed + (0.2 * (stageNum / 20));
									}
									if (stopFlg == false) {
										if (grade == 13) {
											speed = speed + 0.4;
										}
									}
								}
							}

							if (this.time % 2 == 0) {
								dflg = false;
								stopFlg = false;
								escapeFlg = false;
								fireFlgs[Num] = false;
								enemyTarget[Num] = target;
								if (category == 6) {
									tank.opacity = opaVal;
									cannon.opacity = opaVal;
									if (this.within(target, 400)) {
										opaFlg = true;
									} else {
										opaFlg = false;
									}
									if (opaFlg) {
										if (opaVal < 1) {
											opaVal += 0.1;
											if (opaVal >= 1.0) {
												opaVal = 1.0;
												opaFlg = false;
											}
										}
									} else {
										if (this.time % 600 && addBullet == 0) {
											opaFlg = true;
										}
										if (opaVal > 0) {
											opaVal -= 0.05
											if (opaVal <= 0) {
												opaVal = 0
											}
										}
									}

								} else if (grade == 11) {
									tank.opacity = opaVal;
									cannon.opacity = opaVal;
									if (this.within(target, 400)) {
										opaFlg = true;
									} else {
										opaFlg = false;
									}
									if (opaFlg) {
										if (opaVal < 1) {
											opaVal += 0.25;
											if (opaVal >= 1.0) {
												opaVal = 1.0;
												opaFlg = false;
											}
										}
									} else {
										if (this.time % 600 && addBullet == 0) {
											opaFlg = true;
										}
										if (opaVal > 0) {
											opaVal -= 0.05
											if (opaVal <= 0) {
												opaVal = 0
											}
										}
									}

								}
							}


							new EnemyAim(alignment, 12, Num, scene);


							if (game.time % 5 == 0) {
								for (var i = 0; i < tankEntity.length; i++) {
									if (i != Num && deadFlgs[i] == false && moveSpeed > 0) {

										if (intercept8.intersect(tankEntity[i]) == true) {
											SelDirection(weak, tankEntity[i], 0);
										} else {
											if (escapeFlg == false) {
												let dist = Math.sqrt(Math.pow(weak.x - target.x, 2) + Math.pow(weak.y - target.y, 2));
												if (dist < cateDistances[category]) {
													SelDirection(weak, target, 0)
												} else {
													SelDirection(weak, target, 1)
												}
											} else {
												SelDirection(weak, enemyTarget[Num], 0);
											}
										}
									}
								}
							}

							if (shotStopFlg == false) {
								if (value == 4) {
									//左上
									rot = 45
									this.x -= speed / 1.5;
									this.y -= speed / 1.5;
								} else if (value == 5) {
									//右上
									rot = 135
									this.x += speed / 1.5;
									this.y -= speed / 1.5;
								} else if (value == 6) {
									//左下
									rot = 315
									this.x -= speed / 1.5;
									this.y += speed / 1.5;
								} else if (value == 7) {
									//右下
									rot = 225
									this.x += speed / 1.5;
									this.y += speed / 1.5;
								} else if (value == 0) {
									rot = 0;
									this.x -= speed;
								} else if (value == 1) {
									rot = 180;
									this.x += speed;
								} else if (value == 2) {
									rot = 90;
									this.y -= speed;
								} else if (value == 3) {
									rot = 270;
									this.y += speed;
								}
							}


							tank.intersect(PlayerBulAim).forEach(function() {
								dflg = true;
							})
							tank.intersect(EnemyAim).forEach(function() {
								dflg = true;
							})

							//	迎撃処理群
							//	優先順位：自身の弾＞プレイヤーの弾＞他戦車の弾

							//  他戦車の弾迎撃処理
							if (cateFlgs[category][2] == true) {
								for (let i = 1; i < bulOb.length; i++) {
									if (i != Num) {
										for (let j = 0; j < bulOb[i].length; j++) {
											if (bulStack[i][j] == true) {
												let dist = Instrumentation(enemyTarget[Num], bulOb[i][j]);
												if (dist != null) {
													if (
														(intercept5.intersect(bulOb[i][j]) == true ||
															intercept6.intersect(bulOb[i][j]) == true ||
															intercept3.intersect(bulOb[i][j]) == true) && grade >= 10) {
														enemyTarget[Num] = bulOb[i][j]
														alignment.moveTo(bulOb[i][j].x, bulOb[i][j].y)
														new EnemyAim(alignment, 32, Num, scene);

														if (this.time % 5 == 0) {
															SelDirection(weak, bulOb[i][j], 0);
														}
													} else if (dist < cateRanges[category][2]) {
														tank.intersect(BulAim).forEach(function() {
															if (cateEscapes[category][0] == true && cateEscapes[category][3] != 0) {
																if (dist < cateEscapes[category][3]) escapeFlg = true;
															}
															if (cateEscapes[category][3] != 0) enemyTarget[Num] = bulOb[i][j]; //  迎撃のためにターゲット変更
															if (this.time % 5 == 0) {
																SelDirection(weak, bulOb[i][j], 0)
															}
														})
													}
												}
											}
										}
									}
								}
							}
							//  プレイヤーの弾迎撃処理
							if (cateFlgs[category][0] == true) {
								for (let i = 0; i < bulOb[0].length; i++) {
									if (bulStack[0][i] == true) {
										let dist = Instrumentation(enemyTarget[Num], bulOb[0][i]);
										if (dist != null) {

											if (dist < cateRanges[category][0]) {
												if (cateEscapes[category][0] == true && cateEscapes[category][1] != 0) {
													if (dist < cateEscapes[category][1]) {
														escapeFlg = true;
														if (this.time % 5 == 0) SelDirection(weak, bulOb[0][i], 0);
													}
												}
												this.intersect(PlayerBulAim).forEach(function() {
													if (dist < cateEscapes[category][1]) {
														enemyTarget[Num] = bulOb[0][i];
														if (grade >= 10) {
															alignment.moveTo(bulOb[0][i].x, bulOb[0][i].y)
															new EnemyAim(alignment, 32, Num, scene);
														}
													}
													if (this.time % 5 == 0) {
														SelDirection(weak, bulOb[0][i], 0)
													}
												})

											}
											if (grade == 13) {
												if (intercept5.intersect(bulOb[0][i]) == true || intercept6.intersect(bulOb[0][i]) == true || intercept3.intersect(bulOb[0][i]) == true || dist < 250) {
													enemyTarget[Num] = bulOb[0][i];
													alignment.moveTo(bulOb[0][i].x, bulOb[0][i].y)
													new EnemyAim(alignment, 32, Num, scene);

													if (this.time % 3 == 0) {
														SelDirection(weak, bulOb[0][i], 0);
													}
												}
											}
										}
									}
								}
							}
							//  自身の弾迎撃処理
							if (cateFlgs[category][1] == true) {
								for (let i = 0; i < bulOb[Num].length; i++) {
									if (bulStack[Num][i] == true) {
										let dist = Instrumentation(enemyTarget[Num], bulOb[Num][i]);
										if (dist != null) {
											if (dist < cateRanges[category][1]) {
												if (cateEscapes[category][0] == true && cateEscapes[category][2] != 0) {
													if (dist < cateEscapes[category][2]) {
														this.intersect(BulAim).forEach(function() {
															escapeFlg = true;
															if (this.time % 5 == 0) SelDirection(weak, bulOb[Num][i], 0);
														})
														if (grade == 13) {
															enemyTarget[Num] = bulOb[Num][i];
															alignment.moveTo(bulOb[Num][i].x, bulOb[Num][i].y)
															new EnemyAim(alignment, 32, Num, scene);
														}
													}
												}
												if (grade == 13) {
													if (dist < 400) {
														this.intersect(BulAim).forEach(function() {
															enemyTarget[Num] = bulOb[Num][i];
															alignment.moveTo(bulOb[Num][i].x, bulOb[Num][i].y)
															new EnemyAim(alignment, 32, Num, scene);
														})
													}
												} else if (grade >= 10) {
													if (dist < 180 && bullets[Num] > 0 && bullets[Num] < max / 2) {
														escapeFlg = true;
														enemyTarget[Num] = bulOb[Num][i];
														alignment.moveTo(bulOb[Num][i].x, bulOb[Num][i].y)
														new EnemyAim(alignment, 32, Num, scene);
														fireFlgs[Num] = true;
													}
												}
												this.intersect(BulAim).forEach(function() {
													enemyTarget[Num] = bulOb[Num][i];
													if (grade >= 10 || category == 7) {
														alignment.moveTo(bulOb[Num][i].x, bulOb[Num][i].y)
														new EnemyAim(alignment, 32, Num, scene);
													}
													if (this.time % 5 == 0) {
														SelDirection(weak, bulOb[Num][i], 0);
													}
												})

											}
										}
									}
								}
							}

							alignment.intersect(EnemyAim).forEach(function() {
								fireFlgs[Num] = true;
							})
							for (let i = 1; i < tankEntity.length; i++) {
								if (i != Num && deadFlgs[i] == false) {
									if (intercept7.intersect(tankEntity[i]) == true) {
										fireFlgs[Num] = false;
									}
								}
							}

							if (reloadFlg == false) {
								if (bullets[Num] == emax) reloadFlg = true;
							} else {
								if (reloadTime < cateReloadTimes[category]) {
									reloadTime++;
									if (shotNGflg == false) shotNGflg = true;
								} else {
									shotNGflg = false;
									reloadFlg = false;
									reloadTime = 0;
								}

							}

							if (fireFlgs[Num] == true && intercept7.intersect(Floor) == false) {
								if (grade >= 10) {
									if (grade == 13) {
										if (dflg == true || escapeFlg == true) {
											if ((bullets[Num] < emax + defenseMax && deadFlgs[Num] == false) && (this.time % 15 == 0 || this.time % 23 == 0)) {
												for (let i = 0; i < emax + defenseMax; i++) {
													if (bulStack[Num][i] == false) {
														colOb[Num][i] = new BulletCol(alignment, cannon, 15, 10, scene);
														bulOb[Num][i] = new Bullet(colOb[Num][i], cannon, 0, Num, 15, scene, i)
														ShotBullet(i);
														break;
													}
												}
											}
										} else {
											if (Math.floor(Math.random() * emax * 2) > bullets[Num] && game.time % fireLate == 0) {
												if (bullets[Num] < emax && deadFlgs[Num] == false) {
													for (let i = 0; i < emax; i++) {
														if (bulStack[Num][i] == false) {
															colOb[Num][i] = new BulletCol(alignment, cannon, shotSpeed, 11, scene);
															bulOb[Num][i] = new Bullet(colOb[Num][i], cannon, 1, Num, shotSpeed, scene, i)
															ShotBullet(i);
															break;
														}
													}
												}
											}
										}
									} else if (grade == 11) {
										if (dflg == false) {
											if (Math.floor(Math.random() * emax * 2) > bullets[Num] && game.time % fireLate == 0) {
												if (bullets[Num] < emax && deadFlgs[Num] == false) {
													for (let i = 0; i < emax; i++) {
														if (bulStack[Num][i] == false) {
															colOb[Num][i] = new BulletCol(alignment, cannon, shotSpeed, grade, scene);
															bulOb[Num][i] = new Bullet(colOb[Num][i], cannon, Math.floor(Math.random() * (ref)), Num, shotSpeed, scene, i)
															ShotBullet(i);
															opaFlg = true;
															opaVal = 0.5;
															break;
														}
													}
												}
											} else {
												if (bullets[Num] < emax + defenseMax && deadFlgs[Num] == false && game.time % 13 == 0) {
													for (let i = 0; i < emax + defenseMax; i++) {
														if (bulStack[Num][i] == false) {
															colOb[Num][i] = new BulletCol(alignment, cannon, shotSpeed, 10, scene);
															bulOb[Num][i] = new Bullet(colOb[Num][i], cannon, 0, Num, shotSpeed, scene, i)
															ShotBullet(i);
															opaFlg = true;
															opaVal = 0.5;
															break;
														}
													}
												}
											}
										}
									} else if (grade == 10 && dflg == true) {
										if (bullets[Num] < emax + defenseMax && deadFlgs[Num] == false && game.time % 13 == 0) {
											for (let i = 0; i < emax + defenseMax; i++) {
												if (bulStack[Num][i] == false) {
													colOb[Num][i] = new BulletCol(alignment, cannon, shotSpeed, 10, scene);
													bulOb[Num][i] = new Bullet(colOb[Num][i], cannon, 0, Num, shotSpeed, scene, i)
													ShotBullet(i);
													break;
												}
											}
										}
									} else {
										if (Math.floor(Math.random() * emax * 2) > bullets[Num] && game.time % fireLate == 0) {
											if (bullets[Num] < emax && deadFlgs[Num] == false) {
												for (let i = 0; i < emax; i++) {
													if (bulStack[Num][i] == false) {
														colOb[Num][i] = new BulletCol(alignment, cannon, shotSpeed, grade - 1, scene);
														bulOb[Num][i] = new Bullet(colOb[Num][i], cannon, Math.floor(Math.random() * (ref)), Num, shotSpeed, scene, i)
														ShotBullet(i);
														break;
													}
												}
											}
										}
									}
								} else {
									if (shotNGflg == false) {
										if (Math.floor(Math.random() * emax * 2) > bullets[Num] && game.time % fireLate == 0) {
											if (bullets[Num] < emax && deadFlgs[Num] == false) {
												for (let i = 0; i < emax; i++) {
													if (bulStack[Num][i] == false) {
														if (category == 7 && bullets[Num] == 0 && dflg == false) {
															if (Math.floor(Math.random() * 5) == 0) {
																let r1 = 0;
																let r2 = 0;
																if (Math.floor(Math.random() * 2) == 1) {
																	r1 = -1;
																} else {
																	r1 = 1;
																}
																if (Math.floor(Math.random() * 2) == 1) {
																	r2 = -1;
																} else {
																	r2 = 1;
																}
																const vector = {
																	x: alignment.x - cannon.x - 64,
																	y: alignment.y - cannon.y - 32
																};
																let rad = Math.atan2(vector.y, vector.x);
																alignment.moveTo((cannon.x + (200) * Math.cos(rad) + (20 * r1)), (cannon.y + (200) * Math.sin(rad) + (20 * r2)));
																new EnemyAim(alignment, 32, Num, scene);
															}
														}
														if (dflg == true) {
															colOb[Num][i] = new BulletCol(alignment, cannon, shotSpeed, 10, scene);
														} else {
															colOb[Num][i] = new BulletCol(alignment, cannon, shotSpeed, grade - 4, scene);
														}
														bulOb[Num][i] = new Bullet(colOb[Num][i], cannon, ref, Num, shotSpeed, scene, i)
														ShotBullet(i);
														if (category == 6 && opaVal == 0) {
															opaVal = 0.5;
														}
														break;
													}
												}
											}
										}
									}

								}
							}
							//	戦車本体の角度
							if (moveSpeed > 0) {
								this.rotation = rot;
								tank.rotation = rot;
								weak.rotation = rot;
							}
							for (let i = 0; i < tankDir.length; i++) {
								if (deadFlgs[i] == false && i != Num) {
									if (this.intersect(tankDir[i][0]) == true) {
										this.moveTo(this.x, tankDir[i][0].y - 60)
									}
									if (this.intersect(tankDir[i][1]) == true) {
										this.moveTo(this.x, tankDir[i][1].y + (tankDir[i][1].height))
									}
									if (this.intersect(tankDir[i][2]) == true) {
										this.moveTo(tankDir[i][2].x - 60, this.y)
									}
									if (this.intersect(tankDir[i][3]) == true) {
										this.moveTo(tankDir[i][3].x + (tankDir[i][3].width), this.y)
									}
								}
							}
							for (let i = 0; i < obsdir.length; i++) {
								if (this.intersect(obsdir[i][0]) == true && obsChk[i][0] == true) {
									this.moveTo(this.x, obsdir[i][0].y - 60)
									hittingTime++;
								}
								if (this.intersect(obsdir[i][1]) == true && obsChk[i][1] == true) {
									this.moveTo(this.x, obsdir[i][1].y + (obsdir[i][1].height))
									hittingTime++;
								}
								if (this.intersect(obsdir[i][2]) == true && obsChk[i][2] == true) {
									this.moveTo(obsdir[i][2].x - 60, this.y)
									hittingTime++;
								}
								if (this.intersect(obsdir[i][3]) == true && obsChk[i][3] == true) {
									this.moveTo(obsdir[i][3].x + (obsdir[i][3].width), this.y)
									hittingTime++;
								}
							}
							if (this.intersect(walls[0]) == true) {
								this.moveTo(this.x, walls[0].y + walls[0].height)
								hittingTime++;
							}
							if (this.intersect(walls[1]) == true) {
								this.moveTo(this.x, walls[1].y - walls[1].height + 2)
								hittingTime++;
							}
							if (this.intersect(walls[2]) == true) {
								this.moveTo(walls[2].x + walls[2].width, this.y)
								hittingTime++;
							}
							if (this.intersect(walls[3]) == true) {
								this.moveTo(walls[3].x - walls[3].width + 2, this.y)
								hittingTime++;
							}
						}
					}


				}
			}
			scene.addChild(this);
		}
	});*/

	var NewEnemy = Class.create(Sprite,{
		initialize: function(x,y,tankPath,cannonPath,target,category,grade,scene){
			Sprite.call(this, 60, 60);
			this.x = x * pixelSize + 2;
			this.y = y * pixelSize - 14;
			this.time = 0;

			const Num = entVal;
	        entVal++;
	        bullets[Num] = 0;
	        boms[Num] = 0;
	        deadFlgs.push(false);

			const cannon = new Cannon(this,cannonPath,Num,scene);
	        const tank = new Tank(this,tankPath,Num,scene,cannon);
	        const weak = new Weak(this,Num,scene);
	        this.weak = weak;
	        this.cannon = cannon;
	        this.tank = tank;
	        TankFrame(this,Num,scene);

			const intercept = new Intercept96(this, scene);
			const intercept7 = new InterceptC(cannon, scene);

			var value = 0;
			var rot = 0;
			let life = 3;
	        var emax = cateMaxBullets[category];
	        var speed = cateMoveSpeeds[category];
			var fireLate = cateFireLate[category];
			var shotSpeed = cateShotSpeeds[category];
			var disRange = cateDistances[category];
			switch(grade){
				case 1:
					emax = emax-2;
					speed = speed-0.4;
					fireLate = fireLate+8;
					shotSpeed = 12;
					life = 2;
					break;
				case 2:
					emax = emax-1;
					speed = speed-0.6;
					fireLate = fireLate-2;
					break;
				case 3:
					emax = 6;
					speed = 2.4;
					fireLate = 18;
					shotSpeed = 13;
					intercept.scale(1.5,1.5);
					break;
				default:
					break;
			}
			if(addBullet==1){
				life = life + 1;
			}
			var ref = cateMaxRefs[category];
	        let reloadFlg = false;
	        let reloadTime = 0;
	        let shotNGflg = false;
	        let shotStopFlg = false;
	        let shotStopTime = 0;

			let hittingTime = 0;

			let damFlg = false;
			let damTime = 0;
			let damCng = false;

			let brflg = false;

			enemyTarget[Num] = target;
	        var alignment = new Target(Num,scene);

	        for(var i = 0; i < emax; i++){
	            colOb[Num][i] = new BulletCol(alignment,cannon,cateShotSpeeds[category],grade,scene);
	            bulOb[Num][i] = new Bullet(colOb[Num][i],cannon,cateMaxRefs[category],Num,cateShotSpeeds[category],scene,i);
	            bulStack[Num][i] = false;
	            //colOb[Num][i].moveTo(-250,-250);
	            //bulOb[Num][i].moveTo(-100,-100);
				colOb[Num][i].destroy();
				scene.BulGroup.removeChild(colOb[Num][i]);
				scene.BulGroup.removeChild(bulOb[Num][i]);
	        }

	        bomOb[Num][0] = new Bom(this,Num,scene);

	        var EnemyAim = Class.create(Aim,{
	            initialize: function(){
					if(ref == 0){
						Aim.call(this, alignment, cannon, 24, Num, scene);
						this.scale(2,2);
					}else{
						Aim.call(this, alignment, cannon, 20, Num, scene);
					}
	            }
	        });

			function Instrumentation(target1, target2) {
				let dist1 = Math.sqrt(Math.pow(weak.x - target1.x, 2) + Math.pow(weak.y - target1.y, 2));
				let dist2 = Math.sqrt(Math.pow(weak.x - target2.x, 2) + Math.pow(weak.y - target2.y, 2));
				if (dist1 > dist2) {
					return dist2;
				} else {
					return null;
				}

			}

			function ShotBullet(i) {
				game.assets['./sound/s_car_door_O2.wav'].clone().play();
				if (shotSpeed >= 14) {
					game.assets['./sound/Sample_0003.wav'].clone().play();
				}
				scene.BulGroup.addChild(colOb[Num][i]);
				scene.BulGroup.addChild(bulOb[Num][i]);
				new OpenFire(cannon, alignment, scene);
				bullets[Num]++;
				bulStack[Num][i] = true;
				shotStopFlg = true;
			}

			//  移動方向決め処理
			function SelDirection(target1, target2, or) {
				if (or == 0) {
					if ((target1.x + target1.width / 2) > (target2.x + target2.width / 2)) {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							while (value == 0 || value == 2) value = Math.floor(Math.random() * 4);
						} else {
							while (value == 0 || value == 3) value = Math.floor(Math.random() * 4);
						}
					} else {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							while (value == 1 || value == 2) value = Math.floor(Math.random() * 4);
						} else {
							while (value == 1 || value == 3) value = Math.floor(Math.random() * 4);
						}
					}
				} else if (or == 1) {
					if ((target1.x + target1.width / 2) > (target2.x + target2.width / 2)) {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							while (value == 1 || value == 3) value = Math.floor(Math.random() * 4);
						} else {
							while (value == 1 || value == 2) value = Math.floor(Math.random() * 4);
						}

					} else {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							while (value == 0 || value == 3) value = Math.floor(Math.random() * 4);
						} else {
							while (value == 0 || value == 2) value = Math.floor(Math.random() * 4);
						}
					}
				}
			}

			function ResetAim(from) {
				if(enemyTarget[Num] == tankEntity[0]){
					let v = Rot_to_Vec(enemyTarget[Num].rotation, 0);
					let val = 16 * (Math.floor(Math.random() * 3)+1) + 48;
					v.x = v.x * val + enemyTarget[Num].x;
					v.y = v.y * val + enemyTarget[Num].y;
					//console.log(v);
					let p = Pos_to_Vec({ x: from.x + (from.width / 2), y: from.y + (from.height / 2) }, v);
					//console.log({ x: from.x + (from.width / 2), y: from.y + (from.height / 2) });
					//console.log(p);
					let rad = Math.atan2(p.y, p.x);
					cannon.rotation = (90 + (Math.atan2(Math.cos(rad), Math.sin(rad)) * 180) / Math.PI) * -1;
				}
			}

			function ResetStatus(){
				switch(life){
					case 3:
						if(speed > 1)speed = speed + 0.4;
						break;
					case 2:
						if(speed > 1)speed = speed - 0.3;
						fireLate = fireLate + 5;
						shotSpeed = shotSpeed - 1;
						disRange = 300;
						break;
					case 1:
						if(speed > 1)speed = speed - 0.2;
						fireLate = fireLate - 7;
						shotSpeed = shotSpeed + 4;
						disRange = 150;
						ref = 0;
						break;
					default:
						break;
				}
			}

	        this.onenterframe = function(){
	            if (deleteFlg == true) {
					this.moveTo(-100, -100);
					scene.removeChild(intercept);
					scene.removeChild(intercept7);
					scene.removeChild(alignment);
					scene.TankGroup.removeChild(tank);
					scene.CannonGroup.removeChild(cannon);
					scene.removeChild(weak);
					scene.removeChild(this);
				}
				if(life > 0){
					if (!deadFlgs[0]) {
						
						if(worldFlg){
							//  死亡判定処理
							if(!damFlg){
								Bullet.intersectStrict(weak).forEach(elem => {
									if (bulStack[elem.num][elem.value] == true && defeat == false && victory == false && complete == false) {
										let damage = game.assets['./sound/mini_bomb2.mp3'].clone();
										//game.assets['./sound/mini_bomb2.mp3'].clone().play();
										new TouchFire(elem, scene);
										life--;
										damage.play();
										if(life > 0){
											damage.volume = 0.5;
											damFlg = true;
											ResetStatus();
										}
										Get_NewBullet(elem.num, elem.value);
									}
									return;
								})
							}
							
							if(damFlg){
								if(damCng){
									tank.opacity = 0.0;
									cannon.opacity = 0.0;
								}else{
									tank.opacity = 1.0;
									cannon.opacity = 1.0;
								}
								if(damTime % 5 == 0){
									if(damCng){
										damCng = false;
									}else{
										damCng = true;
									}
								}
								damTime++;
								if(damTime > 60){
									damFlg = false;
									damCng = false;
									damTime = 0;
									tank.opacity = 1.0;
									cannon.opacity = 1.0;
								}
							}
							if (hittingTime >= 15) {
								if(value < 2){
									while (value == 0 || value == 1) value = Math.floor(Math.random() * 4);
								}else{
									while (value == 2 || value == 3) value = Math.floor(Math.random() * 4);
								}
								hittingTime = 0;
							}

							if (shotStopFlg == true) {
								shotStopTime++;
								if (shotStopTime > 10) {
									shotStopFlg = false;
									shotStopTime = 0;
								}
							}

							if(ref > 0 && shotNGflg == false){
								intercept7.intersect(Floor).forEach(function(){
									shotNGflg = true;
									return;
								})
							}

							if(this.time % 2 == 0){
								if (reloadFlg == false) {
									shotNGflg = false;
									if (bullets[Num] == emax){
										reloadFlg = true;
										if (shotNGflg == false) shotNGflg = true;
									} 
								} else {
									if (reloadTime < cateReloadTimes[category]) {
										reloadTime++;
										if (shotNGflg == false) shotNGflg = true;
									} else {
										shotNGflg = false;
										reloadFlg = false;
										reloadTime = 0;
									}
								}
								escapeFlg = false;
								fireFlgs[Num] = false;
							}

							new EnemyAim();

							alignment.intersectStrict(EnemyAim).forEach(elem => {
								if(fireFlgs[Num] == false)fireFlgs[Num] = true;
								return;
							});

							if (this.time % 5 == 0) {
								if (enemyTarget[Num] != target && escapeFlg == false) enemyTarget[Num] = target;
							}

							// 迎撃処理群
							//   優先順位：自身の弾＞プレイヤーの弾＞他戦車の弾

							//  他戦車の弾迎撃処理
							if (cateFlgs[category][2] == true && bulOb.length > 2) {
								brflg = false;
								for (let i = 1; i < bulOb.length; i++) {
									if(i == Num) continue;
									for (let j = 0; j < bulOb[i].length; j++) {
										if (bulStack[i][j] == true) {
											let dist = Instrumentation(enemyTarget[Num], bulOb[i][j]);
											if (dist != null && dist < cateRanges[category][2]) {
												if (cateEscapes[category][0] == true && cateEscapes[category][3] != 0) {
													if (dist < cateEscapes[category][3]) {
														if (dist < 120) enemyTarget[Num] = bulOb[i][j];
														escapeTarget = bulOb[i][j];
														escapeFlg = true;
														brflg = true;
														break;
													}
												}
											}
										}
									}
									if(brflg) break;
								}
							}
							//  プレイヤーの弾迎撃処理
							if (cateFlgs[category][0] == true) {
								for (let i = 0; i < bulOb[0].length; i++) {
									if (bulStack[0][i] == true) {
										let dist = Instrumentation(enemyTarget[Num], bulOb[0][i]);
										if (dist != null && dist < cateRanges[category][0]) {
											if (cateEscapes[category][0] == true && cateEscapes[category][1] != 0) {
												if (dist < cateEscapes[category][1]) {
													escapeTarget = bulOb[0][i];
													escapeFlg = true;
												}
											}
											intercept.intersect(PlayerBulAim).forEach(function() {
												if (cateEscapes[category][1] != 0 && enemyTarget[Num] != bulOb[0][i]) enemyTarget[Num] = bulOb[0][i];
											})
										}
									}
								}
							}
							//  自身の弾迎撃処理
							if (cateFlgs[category][1] == true) {
								for (let i = 0; i < bulOb[Num].length; i++) {
									if (bulStack[Num][i] == true) {
										let dist = Instrumentation(enemyTarget[Num], bulOb[Num][i]);
										if (dist != null && dist < cateRanges[category][1]) {
											this.intersect(BulAim).forEach(function() {
												if (cateEscapes[category][2] != 0) {
													enemyTarget[Num] = bulOb[Num][i];
													escapeTarget = bulOb[Num][i];
													if (cateEscapes[category][0] == true) {
														if (dist < cateEscapes[category][2] && dist > 100) {
															escapeFlg = true;
														}
													}
												}
												
											})
										}
									}
								}
							}

							if (shotNGflg == false) {
								if (this.time % fireLate == 0 && fireFlgs[Num] == true) {
									if (Math.floor(Math.random() * emax * 2) > bullets[Num] && bullets[Num] < emax) {
										for (let i = 0; i < emax; i++) {
											if (bulStack[Num][i] == false) {
												if(Math.floor(Math.random() * 3) == 0) ResetAim(this);
												colOb[Num][i] = new BulletCol(alignment, cannon, shotSpeed, grade, scene);
												bulOb[Num][i] = new Bullet(colOb[Num][i], cannon, ref, Num, shotSpeed, scene, i)
												ShotBullet(i);
												break;
											}

										}
									}
								}
							}

							/*if (this.time % fireLate == 0 && shotNGflg == false) {
								if (Math.floor(Math.random() * (emax * 2)) > bullets[Num]) {
									if (bullets[Num] < emax && deadFlgs[Num] == false && fireFlgs[Num] == true) {
										for (let i = 0; i < emax; i++) {
											if (bulStack[Num][i] == false) {
												colOb[Num][i] = new BulletCol(alignment, cannon, shotSpeed, grade, scene);
												bulOb[Num][i] = new Bullet(colOb[Num][i], cannon, ref, Num, shotSpeed, scene, i)
												ShotBullet(i);
												break;
												
											}
										}	
									}
									
								}
							}*/

							/*if (this.time % fireLate == 0 && shotNGflg == false) {
								if (Math.floor(Math.random() * (emax * 2)) > bullets[Num]) {
									for (let i = 0; i < emax; i++) {
										if (bulStack[Num][i] == false) {
											if (bullets[Num] < emax && deadFlgs[Num] == false && fireFlgs[Num] == true) {
												colOb[Num][i] = new BulletCol(alignment, cannon, shotSpeed, grade, scene);
												bulOb[Num][i] = new Bullet(colOb[Num][i], cannon, ref, Num, shotSpeed, scene, i)
												ShotBullet(i);
												break;
											}
										}
									}
								}
							}*/

							if (speed > 0) {
								if (this.time % 3 == 0) {
									
									if (escapeFlg == false) {
										if(tankEntity.length > 2){
											for (let i = 1; i < tankEntity.length; i++) {
												if (tankEntity[i].intersectStrict(intercept) && i != Num && deadFlgs[i] == false) {
													//fireFlgs[Num] = false;
													//tankStopFlg = true;
													value = Escape_Rot(this, tankEntity[i]);
													break;
												}
											}
										}
										if (Math.sqrt(Math.pow(weak.x - target.x, 2) + Math.pow(weak.y - target.y, 2)) < disRange || damFlg) {
											SelDirection(weak, target, 0);
										} else {
											if (this.time % 10 == 0) {
												SelDirection(weak, target, 1);
											}
										}
										
									} else {
										SelDirection(weak, escapeTarget, 0);
									}
								}
								//	戦車本体の角度
								if (shotStopFlg == false) {
									if (value == 0) {
										rot = 180;
										this.x -= speed;
									} else if (value == 1) {
										rot = 0;
										this.x += speed;
									} else if (value == 2) {
										rot = 270;
										this.y -= speed;
									} else if (value == 3) {
										rot = 90;
										this.y += speed;
									}
								}

								this.rotation = rot;
								tank.rotation = rot;
							}
							for (let i = 0; i < tankDir.length; i++) {
								if (deadFlgs[i] == false && i != Num) {
									if (this.intersect(tankDir[i][0]) == true) {
										this.moveTo(this.x, tankDir[i][0].y - 60)
									}
									if (this.intersect(tankDir[i][1]) == true) {
										this.moveTo(this.x, tankDir[i][1].y + (tankDir[i][1].height))
									}
									if (this.intersect(tankDir[i][2]) == true) {
										this.moveTo(tankDir[i][2].x - 60, this.y)
									}
									if (this.intersect(tankDir[i][3]) == true) {
										this.moveTo(tankDir[i][3].x + (tankDir[i][3].width), this.y)
									}
								}
							}
							ObsWidthTop.intersect(this).forEach(elem => {
								this.moveTo(this.x, elem.y - 60);
								hittingTime++;
							})
							ObsWidthBottom.intersect(this).forEach(elem => {
								this.moveTo(this.x, elem.y + (elem.height))
								hittingTime++;
							})
							ObsHeightLeft.intersect(this).forEach(elem => {
								this.moveTo(elem.x - 60, this.y)
								hittingTime++;
							})
							ObsHeightRight.intersect(this).forEach(elem => {
								this.moveTo(elem.x + (elem.width), this.y)
								hittingTime++;
							})
							/*
							for (let i = 0; i < obsdir.length; i++) {
								if (this.intersect(obsdir[i][0]) == true && obsChk[i][0] == true) {
									this.y = obsdir[i][0].y - 60;
									//this.moveTo(this.x, obsdir[i][0].y - 60)
									hittingTime++;
								}
								if (this.intersect(obsdir[i][1]) == true && obsChk[i][1] == true) {
									this.y = obsdir[i][1].y + (obsdir[i][1].height);
									//this.moveTo(this.x, obsdir[i][1].y + (obsdir[i][1].height))
									hittingTime++;
								}
								if (this.intersect(obsdir[i][2]) == true && obsChk[i][2] == true) {
									this.x = obsdir[i][2].x - 60;
									//this.moveTo(obsdir[i][2].x - 60, this.y)
									hittingTime++;
								}
								if (this.intersect(obsdir[i][3]) == true && obsChk[i][3] == true) {
									this.x = obsdir[i][3].x + (obsdir[i][3].width);
									//this.moveTo(obsdir[i][3].x + (obsdir[i][3].width), this.y)
									hittingTime++;
								}
							}
							if (this.intersect(walls[0]) == true) {
								this.y = (64 * 2) - 16;
								//this.moveTo(this.x, (64 * 2) - 16)
								hittingTime++;
							}
							if (this.intersect(walls[1]) == true) {
								this.y = (64 * 13) - 12;
								//this.moveTo(this.x, (64 * 13) - 12)
								hittingTime++;
							}
							if (this.intersect(walls[2]) == true) {
								this.x = (64 * 1);
								//this.moveTo((64 * 1), this.y)
								hittingTime++;
							}
							if (this.intersect(walls[3]) == true) {
								this.x = (64 * 18) + 3;
								//this.moveTo((64 * 18) + 3, this.y)
								hittingTime++;
							}*/
							this.time++;
						}
					}
					if(life <= 0 || deadFlgs[Num]){
						new Mark(this, scene);
						tankColorCounts[category]--;
						new Explosion(this, scene);
						destruction++;
						this.moveTo((-64 * destruction), -100);
						deadFlgs[Num] = true;
						deadTank[Num - 1] = true;
						if(life > 0) life = 0;
					}
				}
	        }

			scene.addChild(this);
		}
	})

	/*var TestEntity = Class.create(Sprite,{
	    initialize: function(x,y,tankPath,cannonPath,target,grade,category,scene){
	        Sprite.call(this, pixelSize-4, pixelSize-4)
	        this.x = x*pixelSize;
	        this.y = y*pixelSize-16;
	        this.time = 0;
	        
	        const Num = entVal;
	        entVal++;
	        bullets[Num] = 0;
	        boms[Num] = 0;
	        deadFlgs.push(false);
	        
	        const cannon = new Cannon(this,cannonPath,Num,scene)
	        const tank = new Tank(this,tankPath,Num,scene,cannon)
	        const weak = new Weak(this,Num,scene)
	        this.weak = weak;
	        this.cannon = cannon;
	        this.tank = tank;
	        TankFrame(this,Num,scene)

	        var value = 0;
	        var rot = 0;
	        var emax = cateMaxBullets[category];
	        var speed = cateMoveSpeeds[category];
	        let life = 1;
	        let reloadFlg = false;
	        let reloadTime = 0;
	        let shotNGflg = false;
	        let shotStopFlg = false;
	        let shotStopTime = 0;

	        enemyTarget[Num] = target;
	        var alignment = new Target(Num,scene)

	        for(var i = 0; i < emax; i++){
	            colOb[Num][i] = new BulletCol(alignment,cannon,cateShotSpeeds[category],grade,scene);
	            bulOb[Num][i] = new Bullet(colOb[Num][i],cannon,cateMaxRefs[category],Num,cateShotSpeeds[category],scene,i);
	            bulStack[Num][i] = false;
	            colOb[Num][i].moveTo(-250,-250)
	            bulOb[Num][i].moveTo(-100,-100)
	        }

	        bomOb[Num][0] = new Bom(this,Num,scene);

	        var EnemyAim = Class.create(Aim,{
	            initialize: function(){
	                Aim.call(this,alignment,cannon,15,Num,scene);
	            }
	        })

	        this.onenterframe = function(){
	            floors.intersectStrict(this).forEach(elem => {
	                
	            })
	        }
	    }
	})*/

	/* アイコン用戦車クラス */
	var PictureTank = Class.create(Sprite, {
		initialize: function(x, y, tankPath, cannonPath, scene) {
			Sprite.call(this, pixelSize - 4, pixelSize - 4)
			this.x = x * pixelSize;
			this.y = y * pixelSize - 32;

			new Tank(this, tankPath, 0, scene)
			new Cannon(this, cannonPath, 0, scene)

			scene.addChild(this)
		}
	})
	/* プレイヤー位置表示クラス */
	var PlayerLabel = Class.create(Label, {
		initialize: function(player, scene) {
			Label.call(this, 1, 1)
			this.x = player.x - ((player.width * 2))
			this.y = player.y - pixelSize
			this.time = 0
			this.text = userName + "<br><br>↓"
			this.textAlign = 'center';
			this.font = '32px sans-serif';
			this.color = 'aliceblue'
			var flg = false;
			this.onenterframe = function() {
				if (scene.time >= 170) {
					this.time++
					if (this.time % 2 == 0) {
						this.opacity -= 0.1
						if (this.opacity <= 0) {
							scene.removeChild(this)
						}
					}
				} else {
					if (scene.time % 20) {
						if (flg == true) {
							flg = false;
						} else if (flg == false) {
							flg = true
						}
					} else {
						if (flg == true) {
							this.scaleX += 0.1
							this.scaleY += 0.1
						} else {
							this.scaleX -= 0.1
							this.scaleY -= 0.1
						}
					}
				}
			}
			scene.addChild(this)
		}
	})

	/* スコア表示クラス */
	var DispScore = Class.create(Sprite, {
		initialize: function(scene) {
			Sprite.call(this, 320, 240)
			this.x = 480
			this.y = 480
			this.time = 0
			this.opacity = 0
			this.backgroundColor = "#000c";
			var title = new Label('トータル撃破数')
			title.moveTo(this.x + 10, this.y + 60)
			title.textAlign = 'center'
			title.color = 'white'
			title.font = '32px sans-serif'
			title.opacity = this.opacity
			var value = new Label(score + destruction)
			value.moveTo(this.x + 20, this.y + 120)
			value.textAlign = 'center'
			value.color = 'lightblue'
			value.font = 'bold 48px sans-serif'
			value.opacity = this.opacity

			this.onenterframe = function() {
				this.time++
				title.opacity = this.opacity
				value.opacity = this.opacity
				if (this.time > 30 && this.time < 45 && this.time % 3 == 0) {
					this.opacity += 0.2;
				}
				if (this.time > 180 && this.time % 3 == 0) {
					this.opacity -= 0.2;
				}
				if (this.opacity <= 0 && this.time > 45) {
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
	var DispText = Class.create(Label, {
		initialize: function(x, y, width, height, text, font, color, align, scene) {
			Label.call(this)
			this.width = width;
			this.height = height;
			this.moveTo(x, y);
			this.text = text;
			this.font = font;
			this.color = color;
			this.textAlign = align;
			scene.addChild(this)
		}
	})
	var DispLine = Class.create(Sprite, {
		initialize: function(x, y, width, height, color, scene) {
			Sprite.call(this, width, height)
			this.moveTo(x, y)
			this.backgroundColor = color;
			scene.addChild(this)
		}
	})
	var DispHead = function(x, y, width, height, color, scene) {
		new DispLine(x, y, width, height, color, scene)
		new DispLine(x, y + 30, width, 5, "yellow", scene)
		new DispLine(x, y + height - 30, width, 5, "yellow", scene)
	}
	var DispBody = function(x, y, width, height, scene) {
		new DispLine(x, y, width, height, "#eea", scene)
		//new DispLine(x,y+height,width,120,"#a00d",scene)
	}
	var DispCountDown = Class.create(Label,{
		initialize: function(scene){
			Label.call(this);
			this.time = 0;
			this.cnt = 3.3;
			this.opacity = 0;
			this.width = pixelSize * 6;
			this.height = 48;
			this.moveTo(pixelSize * 7.5, pixelSize * 0.5);
			this.text = "ゲーム開始まで...";
			this.font = 'bold 40px "Arial"';
			this.color = '#fffd';
			this.textAlign = 'left';

			let cntText = new DispText(pixelSize * 9, pixelSize * 1.5, pixelSize * 4, 64, (this.cnt) + ' 秒', 'bold 48px "Arial"', '#fffd', 'left', scene);
			cntText.opacity = 0;
			this.onenterframe = function(){
				this.time++;
				if(this.cnt > 0){
					if(this.time % 6 == 0){
						this.cnt = Math.round((this.cnt - 0.1) * 10) / 10;
						cntText.text = (this.cnt.toFixed(1)) + ' 秒';
					}
					if(this.time > 12){
						if(this.opacity < 1.0){
							this.opacity = Math.round((this.opacity + 0.2) * 10) / 10;
							cntText.opacity = Math.round((cntText.opacity + 0.2) * 10) / 10;
						}
					}
				}else{
					if(this.opacity > 0.0){
						this.opacity = Math.round((this.opacity - 0.1) * 10) / 10;
						cntText.opacity = Math.round((cntText.opacity - 0.1) * 10) / 10;
					}else{
						scene.removeChild(cntText);
						scene.removeChild(this);
					}
					
				}
			}
			scene.addChild(this);
		}
	})
	/* 警告演出クラス */
	var Warning = Class.create(Sprite, {
		initialize: function(scene) {
			Sprite.call(this, scene.width, scene.height)
			this.backgroundColor = "#dd0008"
			this.opacity = 0.0;
			this.time = 0;
			this.moveTo(0, 0);
			let flg = false;
			let cnt = 0;
			this.onenterframe = function() {
				this.time++;

				if (cnt % 2 == 0 && flg == false) {
					if (this.time % 2 == 0) {
						this.opacity += 0.05
					}
					if (this.opacity >= 0.60) {
						cnt++
						flg = true;
					}
				} else {
					if (this.time % 2 == 0) {
						this.opacity -= 0.05
					}
					if (this.opacity <= 0) {
						this.opacity = 0
						cnt++
						flg = false
					}
				}

				if (cnt > 5) scene.removeChild(this)
			}
			scene.addChild(this)
		}
	})
	/* フェードインクラス */
	var FadeIn = Class.create(Sprite, {
		initialize: function(scene) {
			Sprite.call(this, scene.width, scene.height)
			this.backgroundColor = "#222"
			this.opacity = 1.0;
			this.time = 0;
			this.moveTo(0, 0);
			this.onenterframe = function() {
				this.time++;
				if (this.time > 15) {
					this.opacity -= 0.25
				}
				if (this.opacity <= 0) {
					scene.removeChild(this)
				}
			}
			scene.addChild(this)
		}
	})
	/* フェードアウトクラス */
	var FadeOut = Class.create(Sprite, {
		initialize: function(scene) {
			Sprite.call(this, scene.width, scene.height)
			this.backgroundColor = "#222"
			this.opacity = 0.0;
			this.time = 0;
			this.moveTo(0, 0);
			this.onenterframe = function() {
				this.time++;
				if (this.time > 15) {
					this.opacity += 0.25
					if (this.time == 30) {
						scene.removeChild(this);
					}
				}
			}
			scene.addChild(this)
		}
	})

	var MainMap = Class.create(Map, {
		initialize: function(scene) {
			Map.call(this, pixelSize, pixelSize);
			this.image = game.assets['./image/MapImage/map0.png']
			this.loadData(stageData[0], this._setNullMap());
			this.collisionData = stageData[2];
			scene.addChild(this);
		},
		_setNullMap: function() {
			let map = [];
			for (let i = 0; i < stage_h; i++) {
				map[i] = [];
				for (let j = 0; j < stage_w; j++) {
					map[i][j] = -1;
				}
			}
			return map;
		}
	});
	var FillterMap = Class.create(Map, {
		initialize: function(scene) {
			Map.call(this, pixelSize, pixelSize);
			this.image = game.assets['./image/MapImage/map0.png']
			this.loadData(this._setNullMap(), this._resetMap());
			if(debugFlg) this.opacity = 0;
			scene.addChild(this);
		},
		_setNullMap: function() {
			let map = [];
			for (let i = 0; i < stage_h; i++) {
				map[i] = [];
				for (let j = 0; j < stage_w; j++) {
					map[i][j] = -1;
				}
			}
			return map;
		},
		_resetMap: function() {
			let map = [];
			for (let i = 0; i < stage_h; i++) {
				map[i] = [];
				for (let j = 0; j < stage_w; j++) {
					if (stageData[0][i][j] == 7) {
						map[i][j] = 7;
					} else if (i < stage_h - 1 && (stageData[0][i][j] != 7 && (stageData[0][i + 1][j] == 7 || stageData[0][i + 1][j] == 23))) {
						map[i][j] = 45;
					} else if (i < stage_h - 1 && stageData[0][i][j] == 23) {
						map[i][j] = 39;
					} else {
						map[i][j] = -1;
					}
				};
			};
			return map;
		}
	});

	function isFullScreen() {
		if ((document.fullscreenElement !== undefined && document.fullscreenElement !== null) || // HTML5 標準
			(document.mozFullScreenElement !== undefined && document.mozFullScreenElement !== null) || // Firefox
			(document.webkitFullscreenElement !== undefined && document.webkitFullscreenElement !== null) || // Chrome・Safari
			(document.webkitCurrentFullScreenElement !== undefined && document.webkitCurrentFullScreenElement !== null) || // Chrome・Safari (old)
			(document.msFullscreenElement !== undefined && document.msFullscreenElement !== null)) { // IE・Edge Legacy
			return true; // fullscreenElement に何か入ってる = フルスクリーン中
		} else {
			return false; // フルスクリーンではない or フルスクリーン非対応の環境（iOS Safari など）
		}
	}
	// ゲームの準備が整ったらメインの処理を実行
	game.onload = function() {

		var BGM = game.assets['./sound/TITLE.mp3'];
		//BGM.src.loop = true;    

		var createSetUpScene = function() {

			var scene = new Scene(); // 新しいシーンを作る
			scene.time = 0;
			scene.backgroundColor = 'black'; // シーンの背景色を設定
			now_scene = scene;
			let flg = false;
			new DispText(0, 440, 320 * 4, 40, 'Touch to StartUp!', '40px sans-serif', 'white', 'center', scene)

			scene.addEventListener('touchstart', function() {
				titleFlg = true;
				flg = true;
				new FadeOut(scene)
			})

			scene.onenterframe = function() {
				if (flg == true) {

					scene.time++;

					if (scene.time == 30) {
						BGM.play();
						game.replaceScene(createTitleScene());

					}
				}

			}
			new FadeIn(scene)
			return scene;
		};

		var createTutorialScene = function() {
			if (navigator.userAgent.match(/iPhone|iPad|Android/)) {
				if (!isFullScreen()) {
					// Chrome & Firefox v64以降
					if (document.body.requestFullscreen) {
						document.body.requestFullscreen();

						// Firefox v63以前
					} else if (document.body.mozRequestFullScreen) {
						document.body.mozRequestFullScreen();

						// Safari & Edge & Chrome v68以前
					} else if (document.body.webkitRequestFullscreen) {
						document.body.webkitRequestFullscreen();

						// IE11
					} else if (document.body.msRequestFullscreen) {
						document.body.msRequestFullscreen();
					}
				}
			}

			var world = new PhysicsWorld(0, 0);
			game.time = 0;
			worldFlg = false;
			deleteFlg = false;
			let outFlg = false;
			let tutorialStage = [
				[
					[7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
					[7, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 7],
					[7, 144, 145, 145, 145, 145, 145, 145, 145, 145, 145, 145, 145, 145, 145, 145, 145, 145, 146, 7],
					[7, 160, 161, 161, 161, 161, 161, 161, 161, 161, 161, 161, 161, 161, 161, 161, 161, 161, 162, 7],
					[7, 160, 161, 161, 161, 161, 161, 161, 161, 161, 161, 161, 161, 161, 161, 161, 161, 161, 162, 7],
					[7, 160, 161, 161, 161, 161, 161, 161, 161, 161, 161, 161, 161, 161, 161, 161, 161, 161, 162, 7],
					[7, 160, 161, 161, 161, 161, 161, 161, 7, 7, 161, 161, 161, 161, 161, 161, 161, 161, 162, 7],
					[7, 160, 161, 161, 161, 161, 161, 161, 7, 7, 161, 161, 161, 161, 161, 161, 161, 161, 162, 7],
					[7, 160, 161, 161, 161, 161, 161, 161, 7, 7, 161, 161, 161, 161, 161, 161, 161, 161, 162, 7],
					[7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
					[7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
					[7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
					[7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
					[7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
					[7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7]
				],
				[
					[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
					[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
					[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
					[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
					[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
					[-1, -1, -1, -1, -1, -1, -1, -1, 45, 45, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
					[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
					[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
					[-1, 45, 45, 45, 45, 45, 45, 45, -1, -1, 45, 45, 45, 45, 45, 45, 45, 45, 45, -1],
					[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
					[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
					[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
					[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
					[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
					[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
				],
				[
					[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
					[1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
					[4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 4],
					[4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 4],
					[4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 4],
					[4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 4],
					[4, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 3, 3, 0, 0, 0, 0, 0, 4],
					[4, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
					[4, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
					[4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4],
					[4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4],
					[4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4],
					[4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4],
					[4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4],
					[1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1]
				]

			]

			var scene = new Scene(); // 新しいシーンを作る
			scene.time = 0;
			now_scene = scene;

			//scene.CursorGroup = new Group();
			scene.MarkGroup = new Group();
			scene.TankGroup = new Group();
			scene.CannonGroup = new Group();
			scene.SmokeGroup = new Group();
			scene.FireGroup = new Group();
			scene.BulGroup = new Group();
			scene.BomGroup = new Group();

			let backgroundMap = new Map(pixelSize, pixelSize);
			backgroundMap.image = game.assets['./image/MapImage/map0.png'];
			backgroundMap.loadData(tutorialStage[0], tutorialStage[1])
			backgroundMap.collisionData = tutorialStage[2];
			scene.addChild(backgroundMap);

			walls[0] = new Wall(18, 1, 1, 1, scene)
			walls[1] = new Wall(18, 1, 1, 14, scene)
			walls[2] = new Wall(1, 13, 0, 1, scene)
			walls[3] = new Wall(1, 13, 19, 1, scene)
			walls[4] = new Wall(24, 1, 0, 15, scene)
			var fy = 0;
			var fx = 0;

			var grid = [];

			/* 壁の当たり判定設置 */
			backgroundMap.collisionData.forEach(colI => {
				grid[fy] = []
				colI.forEach(colJ => {
					if (colJ == 0) {
						grid[fy][fx] = 'Empty';
					} else {
						if (colJ == 2) {
							avoids.push(new Avoid(fx, fy, scene));
							grid[fy][fx] = 'Obstacle';
						} else if (colJ == 3) {
							holes.push(new Hole(fx, fy, scene))
							grid[fy][fx] = 'Obstacle';
							//Obstracle(holes[holes.length - 1], scene)
						} else {

							if (colJ == 1) {
								floors.push(new Floor(fx, fy, scene));
								grid[fy][fx] = 'Obstacle';
								//Obstracle(floors[floors.length - 1], scene)
								//RefObstracle(floors[floors.length - 1], scene)
							} else {
								grid[fy][fx] = 'Obstacle';
							}
						}

					}
					fx++;
				});
				fy++;
				fx = 0;
			});
			
			scene.addChild(scene.MarkGroup);
			scene.addChild(scene.BomGroup);
			scene.addChild(scene.TankGroup);
			scene.addChild(scene.CannonGroup);
			scene.addChild(scene.SmokeGroup);
			scene.addChild(scene.FireGroup);
			scene.addChild(scene.BulGroup);
			//scene.addChild(scene.CursorGroup);

			let filterMap = new Map(pixelSize, pixelSize);
			filterMap.image = backgroundMap.image;
			let filImg = tutorialStage[1];
			for (let i = 0; i < tutorialStage[0].length; i++) {
				for (let j = 0; j < tutorialStage[0][i].length; j++) {
					if (tutorialStage[0][i][j] == 7) {
						filImg[i][j] = 7
					} else if (tutorialStage[0][i][j] == 23) {
						filImg[i][j] = 39
					}
				}
			}
			filterMap.loadData(fmap, filImg);
			scene.addChild(filterMap);

			SetObs(scene,backgroundMap.collisionData);
			SetRefs(scene,backgroundMap.collisionData);

			/* カーソルの設置＆位置取得処理 */
			cur = new Cursor(scene);
			document.addEventListener('mousemove', function(e) {
				cur.x = (e.x - 36) * 2.70 - (ScreenMargin * 2);
				cur.y = (e.y) * 2.65;
			})
			scene.addEventListener('touchmove', function(e) {
				cur.x = (e.x);
				cur.y = (e.y);
			})

			/* 戦車の追加処理 */
			bulOb.push([])
			colOb.push([])
			bomOb.push([])
			bulStack.push([])
			//tankEntity.push(new Player(4, 5, './image/ObjectImage/tank2.png', './image/ObjectImage/cannon.png', 5, 1, 10, 2.2, scene, filterMap))
			tankEntity.push(new Player(4, 5, cateImages[playerType].tank, cateImages[playerType].cannon, playerStatus[0], playerStatus[1], playerStatus[2], playerStatus[3], scene, filterMap))

			bulOb.push([])
			colOb.push([])
			bomOb.push([])
			bulStack.push([])
			tankEntity.push(new newAI(15, 5, './image/ObjectImage/brown.png', './image/ObjectImage/browncannon.png', tankEntity[0], 1, 1, 5, 0, 180, 0, 0, scene, backgroundMap, grid, filterMap))
			tankColorCounts[0]++;

			/*bulOb.push([])
			colOb.push([])
			bomOb.push([])
			bulStack.push([])
			tankEntity.push(new NewEnemy(17, 7, './image/ObjectImage/brown.png', './image/ObjectImage/browncannon.png', tankEntity[0], 5, 0, scene))
			tankColorCounts[0]++;*/

			new PlayerLabel(tankEntity[0], scene)
			new FadeIn(scene)

			let startLabel = new Label();
			startLabel.width = 360;
			startLabel.height = 72;
			startLabel.x = 480;
			startLabel.y = 300;
			startLabel.text = 'スタート';
			startLabel.font = '72px "Arial"';
			startLabel.color = 'yellow';
			startLabel.textAlign = 'left';

			let tutorialLabel = new Label();
			tutorialLabel.width = 32 * 30;
			tutorialLabel.height = 72;
			tutorialLabel.x = pixelSize;
			tutorialLabel.y = pixelSize * 14;
			tutorialLabel.text = '※チュートリアル中はPAUSEボタンでタイトルに戻れます';
			tutorialLabel.font = '32px "Arial"';
			tutorialLabel.color = 'yellow';
			tutorialLabel.textAlign = 'left';



			function AllDelete() {
				/*for (let i = 0; i < obsdir.length; i++) {
					for (let j = 0; j < obsdir[i].length; j++) {
						scene.removeChild(obsdir[i][j])
					}
				}
				for (let i = 0; i < refdir.length; i++) {
					for (let j = 0; j < refdir[i].length; j++) {
						scene.removeChild(refdir[i][j])
					}
				}*/
				for (let i = 0; i < tankDir.length; i++) {
					for (let j = 0; j < tankDir[i].length; j++) {
						scene.removeChild(tankDir[i][j])
					}
				}
				for (let i = 0; i < tankEntity.length; i++) {
					scene.removeChild(tankEntity[i])
				}
				/*for(let i = 0; i < markEntity.length; i++){
				    scene.removeChild(markEntity[i])
				}*/
				for (let i = 0; i < colOb.length; i++) {
					for (let j = 0; j < colOb[i].length; j++) {
						if (bulStack[i][j] == true) {
							bulStack[i][j] = false;
							scene.BulGroup.removeChild(bulOb[i][j])
							colOb[i][j].destroy();
							scene.BulGroup.removeChild(colOb[i][j])
							//scene.removeChild(colOb[i][j])
						}
					}
				}
				floors.forEach(elem => {
					elem.destroy()
				})
				walls.forEach(elem => {
					elem.destroy()
				})
				avoids.forEach(elem => {
					scene.removeChild(elem)
				})
				holes.forEach(elem => {
					scene.removeChild(elem)
				})

			}
			if (navigator.userAgent.match(/iPhone|iPad|Android/)) {
				new DispLine(0, pixelSize * 9, pixelSize * 20, pixelSize * 8, "#000000ee", scene)
				new DispText(pixelSize, pixelSize * 10, pixelSize * 18, pixelSize / 2, '　移動　：左の十字パッド　（斜め移動可）　　　　　　砲撃で発射される弾は', '24px sans-serif', 'white', 'left', scene)
				new DispText(pixelSize, pixelSize * 10.5, pixelSize * 18, pixelSize / 2, '　　　　　　　　　　　　　　　　　　　　　　 　　　  壁に当たると跳ね返ります。', '24px sans-serif', 'white', 'left', scene)
				new DispText(pixelSize, pixelSize * 11, pixelSize * 18, pixelSize / 2, '　照準　：画面タップか画面スライド　　', '24px sans-serif', 'white', 'left', scene)
				new DispText(pixelSize, pixelSize * 11.5, pixelSize * 18, pixelSize / 2, '　砲撃　：右側のBボタン　　　　　　　　　　　　　　跳ね返った弾にも判定があるので', '24px sans-serif', 'white', 'left', scene)
				new DispText(pixelSize, pixelSize * 12, pixelSize * 18, pixelSize / 2, '爆弾設置：右側のAボタン　　　　　　　　　　　　　    自滅には注意してください。', '24px sans-serif', 'white', 'left', scene)
				new DispText(pixelSize, pixelSize * 12.5, pixelSize * 18, pixelSize / 2, '一時停止：Startボタン　　　　　　　　　', '24px sans-serif', 'white', 'left', scene)
			} else {
				tutorialLabel.text = '※チュートリアル中はEscキーを押すとタイトルに戻れます';
				new DispLine(0, pixelSize * 9, pixelSize * 20, pixelSize * 8, "#000000ee", scene)
				new DispText(pixelSize, pixelSize * 10, pixelSize * 18, pixelSize / 2, '　移動　：WASDキー　（斜め移動可）　　　　　　砲撃で発射される弾は', '24px sans-serif', 'white', 'left', scene)
				new DispText(pixelSize, pixelSize * 10.5, pixelSize * 18, pixelSize / 2, '　　　　　　　　　　　　　　　　　　　　　　 　　　  壁に当たると跳ね返ります。', '24px sans-serif', 'white', 'left', scene)
				new DispText(pixelSize, pixelSize * 11, pixelSize * 18, pixelSize / 2, '　照準　：マウス操作、または十字キー　　', '24px sans-serif', 'white', 'left', scene)
				new DispText(pixelSize, pixelSize * 11.5, pixelSize * 18, pixelSize / 2, '　砲撃　：左クリック　　　　　　　　　　　　　　跳ね返った弾にも判定があるので', '24px sans-serif', 'white', 'left', scene)
				new DispText(pixelSize, pixelSize * 12, pixelSize * 18, pixelSize / 2, '爆弾設置：Eキー　　　　　　　　　　　　　　　    自滅には注意してください。', '24px sans-serif', 'white', 'left', scene)
				new DispText(pixelSize, pixelSize * 12.5, pixelSize * 18, pixelSize / 2, '一時停止：Escキー　　　　　　　　　', '24px sans-serif', 'white', 'left', scene)
			}

			new DispCountDown(scene);

			scene.onenterframe = function() {
				if(outFlg){
					obsdir = []
					obsNum = 0;
					refdir = []
					refNum = 0;
					bullets = []; //各戦車の弾数の制御用配列
					boms = []; //爆弾の個数の制御用配列
					bulOb = [
						[]
					]; //戦車の弾情報を保持する配列
					colOb = [
						[]
					]; //弾の物理制御情報を保持する配列
					bomOb = [
						[]
					]; //爆弾の情報を保持する配列
					bulStack = []; //弾の状態の制御用配列
					enemyTarget = []; //敵戦車が狙うターゲット
					entVal = 0; //戦車の連番設定用変数
					tankEntity = []; //戦車情報を保持する配列
					tankDir = [];
					//markEntity = [];
					deadFlgs = []; //戦車の生存確認 
					fireFlgs = []; //敵の砲撃制御
					floors = []; //１ブロック分の壁
					avoids = []; //(敵のみ)通行不可
					walls = []; //ステージの壁
					holes = []; //穴
					tankColorCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
					destruction = 0;
					victory = false;
					defeat = false;
					game.replaceScene(createTitleScene());
				}
				scene.time++;
				Floor.intersectStrict(Aim).forEach(function(pair) {
					scene.removeChild(pair[1])
				})
				Wall.intersectStrict(Aim).forEach(function(pair) {
					scene.removeChild(pair[1])
				})
				Floor.intersectStrict(BulAim).forEach(function(pair) {
					scene.removeChild(pair[1])
				})
				Wall.intersectStrict(BulAim).forEach(function(pair) {
					scene.removeChild(pair[1])
				})
				Floor.intersectStrict(PlayerBulAim).forEach(function(pair) {
					scene.removeChild(pair[1])
				})
				Wall.intersectStrict(PlayerBulAim).forEach(function(pair) {
					scene.removeChild(pair[1])
				})
				if (inputManager.checkButton("Start") == inputManager.keyStatus.DOWN && scene.time > 240) {
					if (confirm("\r\nタイトルに戻りますか？")) {
						BGM.play();
						scene.removeChild(tutorialLabel)
						game.time = 0;
						deleteFlg = true;
						new FadeOut(scene)
						AllDelete();
						outFlg = true;
					}
				}
				/*document.onkeyup = function(e) {
					if ((e.code == 'Escape') && scene.time > 240) {
						if (confirm("\r\nタイトルに戻りますか？")) {
							BGM.play();
							scene.removeChild(tutorialLabel)
							game.time = 0;
							deleteFlg = true;
							new FadeOut(scene)
							AllDelete();
							obsdir = []
							obsNum = 0;
							refdir = []
							refNum = 0;
							bullets = []; //各戦車の弾数の制御用配列
							boms = []; //爆弾の個数の制御用配列
							bulOb = [
								[]
							]; //戦車の弾情報を保持する配列
							colOb = [
								[]
							]; //弾の物理制御情報を保持する配列
							bomOb = [
								[]
							]; //爆弾の情報を保持する配列
							bulStack = []; //弾の状態の制御用配列
							enemyTarget = []; //敵戦車が狙うターゲット
							entVal = 0; //戦車の連番設定用変数
							tankEntity = []; //戦車情報を保持する配列
							tankDir = [];
							//markEntity = [];
							deadFlgs = []; //戦車の生存確認 
							fireFlgs = []; //敵の砲撃制御
							floors = []; //１ブロック分の壁
							avoids = []; //(敵のみ)通行不可
							walls = []; //ステージの壁
							holes = []; //穴
							tankColorCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
							destruction = 0;
							victory = false;
							defeat = false;
							outFlg = true;
						}
					}
				}*/

				if (scene.time == 210 && complete == false && victory == false) {
					worldFlg = true;
					scene.addChild(startLabel)
					scene.addChild(tutorialLabel)
				}

				if (worldFlg == true) {

					if (game.input.up) cur.y -= 8;
					else if (game.input.down) cur.y += 8;
					if (game.input.right) cur.x += 8;
					else if (game.input.left) cur.x -= 8;
					if (scene.time == 240) scene.removeChild(startLabel)

					world.step(game.fps);
					game.time++;
				}
			}
			return scene;
		};
		/* タイトルシーン */
		var createTitleScene = function() {
			if (navigator.userAgent.match(/iPhone|iPad|Android/)) {
				if (!isFullScreen()) {
					alert("左上の\"フルスクリーン表示\"ボタンを押してください。");
					/*
					// Chrome & Firefox v64以降
					if (document.body.requestFullscreen) {
						document.body.requestFullscreen();

						// Firefox v63以前
					} else if (document.body.mozRequestFullScreen) {
						document.body.mozRequestFullScreen();

						// Safari & Edge & Chrome v68以前
					} else if (document.body.webkitRequestFullscreen) {
						document.body.webkitRequestFullscreen();

						// IE11
					} else if (document.body.msRequestFullscreen) {
						document.body.msRequestFullscreen();
					}*/
				}
			}


			zanki = 5;
			var scene = new Scene();
			now_scene = scene;
			scene.time = 0;
			scene.backgroundColor = '#cacaca'; // シーンの背景色を設定
			var flg = false;

			// スタート画像設定
			new DispHead(100, 150, 360 * 3, 240 * 2.8, "#a00d", scene)

			// タイトルラベル設定
			new DispText(100, 230, 260 * size, 96, 'Battle Tank Game', '96px sans-serif', '#ebe799', 'center', scene)

			// ゲーム開始用ラベル
			var toPlay = new DispText(game.width / 2 - 180, 370, 320, 40, '➡　はじめから', '40px sans-serif', '#ebe799', 'left', scene)
			// ゲーム開始用ラベル
			var toContinue = new DispText(game.width / 2 - 180, 450, 320, 40, '➡　つづきから', '40px sans-serif', '#ebe799', 'left', scene)
			//  難易度選択用ラベル
			var level = new DispText(game.width / 2 - 180, 530, 40 * 9, 40, '➡　難易度選択：', '40px sans-serif', '#ebe799', 'left', scene)
			//  難易度「普通」ラベル
			var nomal = new DispText(level.x + level.width - 16, 530, 140, 40, 'Normal', '40px sans-serif', '#ebe799', 'left', scene)
			//  難易度「難しい」ラベル
			var hard = new DispText(level.x + level.width + nomal.width + 16, 530, 120, 40, 'Hard', '40px sans-serif', '#888', 'left', scene)
			//  チュートリアル画面ラベル
			var tutorial = new DispText(game.width / 2 - 180, 610, 40 * 9, 40, '➡　チュートリアル', '40px sans-serif', '#ebe799', 'left', scene)
			//  戦車一覧画面用ラベル
			var picture = new DispText(game.width / 2 - 180, 690, 40 * 10, 40, '➡　戦車一覧', '40px sans-serif', '#ebe799', 'left', scene)


			let lvFlg = false;
			//  難易度選択状態での表示変更処理
			if (addBullet == 0) {
				nomal.color = '#ebe799';
				hard.color = '#888';
				lvFlg = false;
			} else {
				nomal.color = '#888';
				hard.color = 'red';
				lvFlg = true;
			}
			//  難易度普通選択時処理
			nomal.addEventListener(Event.TOUCH_START, function() {
				if (lvFlg == true) {
					nomal.color = '#ebe799';
					hard.color = '#888';
					lvFlg = false;
					addBullet = 0;
					addSpeed = 0;
				}
			})
			//  難易度難しい選択時処理
			hard.addEventListener(Event.TOUCH_START, function() {
				if (lvFlg == false) {
					nomal.color = '#888';
					hard.color = 'red';
					lvFlg = true;
					addBullet = 1;
					addSpeed = 0.5;
				}
			})
			//  難易度変更処理
			level.addEventListener(Event.TOUCH_START, function() {
				if (lvFlg == true) {
					nomal.color = '#ebe799';
					hard.color = '#888';
					lvFlg = false;
					addBullet = 0;
					addSpeed = 0;
				} else {
					nomal.color = '#888';
					hard.color = 'red';
					lvFlg = true;
					addBullet = 1;
					addSpeed = 0.5;
				}
			})

			//  移動先を決める変数
			var orflg = 0;

			// 移動先をプレイ画面に設定
			toPlay.addEventListener(Event.TOUCH_START, function() {
				let returnFlg = true;
				/*while(returnFlg){
				    userName = prompt("\r\nユーザ名を入力してください\r\n\r\n(ユーザ名を設定するとランキングにスコアが記録されます)", "ここにユーザ名を入力");
				    if(userName == "" || userName == null || userName == "ここにユーザ名を入力"){
				        if(confirm("\r\nユーザ名を設定していません。\r\nよろしいですか？")) {
				            returnFlg = false;
				            userName = "Player"
				        }
				    }else{
				        alert("ユーザ名を「" + userName + "」に設定しました。");
				        returnFlg = false;
				    }
				}*/
				Repository.keyName = key;
				Repository.restore();
				if (Repository.data.StageNum > 0) {
					if (confirm("\r\n保存されている進行状況が存在しています。\r\n進行状況をリセットして始めますか？")) {
						Repository.remove();
						Repository.keyName = key;
						Repository.restore();
						flg = true;
						orflg = 1;
						BGM.stop();
						titleFlg = false;
						new FadeOut(scene);
					}
				} else {
					flg = true;
					orflg = 1;
					BGM.stop();
					titleFlg = false;
					new FadeOut(scene)
				};
			});

			// 移動先をプレイ画面に設定
			toContinue.addEventListener(Event.TOUCH_START, function() {
				Repository.keyName = key;
				Repository.restore();
				if (Repository.data.StageNum == 0) {
					alert("保存されているデータはありません。")
				} else {
					stageNum = Repository.data.StageNum;
					zanki = Repository.data.Zanki;
					colors = Repository.data.Scores;
					addBullet = Repository.data.Level;
					colors.forEach(elem => {
						score += elem;
					});
					if (addBullet > 0) addSpeed = 0.5;
					/*PlayData = {
					    StageNum: stageNum,
					    Zanki: zanki,
					    Scores: colors,
					    Level: addBullet
					};*/
					let script = document.createElement("script");
					script.src = stagePath[stageNum];
					script.id = 'stage_' + (stageNum);
					head[0].appendChild(script);
					flg = true
					orflg = 1;
					BGM.stop()
					titleFlg = false;
					new FadeOut(scene)
				}
			});

			// 移動先を戦車一覧画面に設定
			picture.addEventListener(Event.TOUCH_START, function() {
				flg = true
				orflg = 2;
				new FadeOut(scene)
			});

			// 移動先をチュートリアル画面に設定
			tutorial.addEventListener(Event.TOUCH_START, function() {
				flg = true
				orflg = 3;
				BGM.stop()
				new FadeOut(scene)
			});

			//画面遷移の処理
			scene.onenterframe = function() {
				if (titleFlg == true && BGM.currentTime == BGM.duration) {
					BGM.play();
				}
				if (flg == true) {

					scene.time++
					if (scene.time == 30) {
						if (orflg == 1) {
							deadTank = [false];
							Repository.data.Level = addBullet;
							game.replaceScene(createStartScene()); // 現在表示しているシーンをゲームシーンに置き換える
						} else if (orflg == 2) {
							game.replaceScene(createPictureScene());
						} else if (orflg == 3) {
							game.replaceScene(createTutorialScene());
						}

					}
				}

			}
			new FadeIn(scene)
			// タイトルシーンを返します。
			return scene;
		}

		//  戦車一覧画面
		var createPictureScene = function() {
			var scene = new Scene(); // 新しいシーンを作る
			scene.time = 0;
			scene.backgroundColor = '#cacaca'; // シーンの背景色を設定
			now_scene = scene;

			scene.TankGroup = new Group();
			scene.CannonGroup = new Group();

			//  表示用画像一覧
			let tanks = [
				'./image/ObjectImage/tank2.png',
				'./image/ObjectImage/cannon.png',
				'./image/ObjectImage/brown.png',
				'./image/ObjectImage/browncannon.png',
				'./image/ObjectImage/gray.png',
				'./image/ObjectImage/graycannon.png',
				'./image/ObjectImage/green.png',
				'./image/ObjectImage/greencannon.png',
				'./image/ObjectImage/red.png',
				'./image/ObjectImage/redcannon.png',
				'./image/ObjectImage/lightgreen.png',
				'./image/ObjectImage/lightgreencannon.png',
				'./image/ObjectImage/elite.png',
				'./image/ObjectImage/elitecannon.png',
				'./image/ObjectImage/snow.png',
				'./image/ObjectImage/snowcannon.png',
				'./image/ObjectImage/elitegreen.png',
				'./image/ObjectImage/elitegreencannon.png',
				'./image/ObjectImage/sand.png',
				'./image/ObjectImage/sandcannon.png',
				'./image/ObjectImage/pink.png',
				'./image/ObjectImage/pinkcannon.png',
				'./image/ObjectImage/abnormal.png',
				'./image/ObjectImage/abnormalcannon.png',
				'./image/ObjectImage/meisai.png',
				'./image/ObjectImage/meisaicannon.png',
				'./image/ObjectImage/Abyssal.png',
				'./image/ObjectImage/AbyssalCannon.png'
			];

			//  表示する戦車オブジェを格納する配列
			let dispTanks = [];
			//  戦車ごとのテキストを格納する配列
			let performance = [
				["Player", "　弾数　：5", "　弾速　：普通", "跳弾回数：1", "移動速度：速い", "・プレイヤーが操作する戦車<br>　強いか弱いかはあなた次第。"],
				[colorsName[0], '　弾数　：' + (cateMaxBullets[0] + addBullet), "　弾速　：普通", "跳弾回数：" + cateMaxRefs[0], "移動速度：動かない", "・一番最初に戦う雑魚敵。<br>　弱いが油断はできない。"],
				[colorsName[1], '　弾数　：' + (cateMaxBullets[1] + addBullet), "　弾速　：普通", "跳弾回数：" + cateMaxRefs[1], "移動速度：遅い", "・動けるようになったがまだ弱い。<br>　配置によっては化ける。"],
				[colorsName[2], '　弾数　：' + (cateMaxBullets[2] + addBullet), "　弾速　：とても速い", "跳弾回数：" + (cateMaxRefs[2] + addBullet), "移動速度：動かない～遅い", "・とにかく弾が速い。<br>　スナイプされないよう注意！"],
				[colorsName[3], '　弾数　：' + (cateMaxBullets[3] + addBullet), "　弾速　：普通", "跳弾回数：" + cateMaxRefs[3], "移動速度：速い", "・万歳突撃をかますヤバイ奴。<br>　跳弾や角狙いで対処しよう。"],
				[colorsName[4], '　弾数　：' + (cateMaxBullets[4] + addBullet), "　弾速　：速い", "跳弾回数：" + cateMaxRefs[4], "移動速度：遅い", "・弾がよく跳ね返るため厄介。<br>　結構ビビり。"],
				[colorsName[5], '　弾数　：' + (cateMaxBullets[5] + addBullet), "　弾速　：速い", "跳弾回数：" + cateMaxRefs[5], "移動速度：普通", "・Grayの強化個体。<br>　異常な生存能力を誇るが、<br>　冷静に対処すれば倒せる。"],
				[colorsName[6], '　弾数　：' + (cateMaxBullets[6] + addBullet), "　弾速　：速い", "跳弾回数：" + cateMaxRefs[6], "移動速度：遅い", "・ステルスで姿を眩ます厄介者。<br>　死角からの砲撃に要注意！"],
				[colorsName[7], '　弾数　：' + (cateMaxBullets[7] + addBullet), "　弾速　：とても速い", "跳弾回数：" + cateMaxRefs[7], "移動速度：動かない", "・Greenの強化個体。<br>　圧倒的な命中精度を誇る。"],
				[colorsName[8], '　弾数　：' + (cateMaxBullets[8] + addBullet), "　弾速　：速い", "跳弾回数：" + cateMaxRefs[8], "移動速度：とても速い", "・簡潔にいうと爆弾魔。<br>　また移動も弾速も速いので注意。"],
				[colorsName[9], '　弾数　：' + (cateMaxBullets[9] + addBullet), "　弾速　：速い", "跳弾回数：" + cateMaxRefs[9], "移動速度：動かない", "・機関砲のような連射をしてくる。<br>　彼の正面には立たないように…"],
				[colorsName[10], "　弾数　：" + (cateMaxBullets[10] + addBullet), "　弾速　：最速", "跳弾回数：" + cateMaxRefs[10], "移動速度：普通", "・いつ現れるか分からない戦車。<br>　圧倒的な弾速に要注意。"],
				[colorsName[11], "　弾数　：3～5", "　弾速　：普通~とても速い", "跳弾回数：0~1", "移動速度：遅い~速い", "・攻防ともに優れたボス格。<br>　一度の被弾では倒されない。<br>　体力が減ると性能が変化する。<br>　爆破に巻き込めばすぐに倒せる。"],
				["Abyssal", "　弾数　：6", "　弾速　：速い~とても速い", "跳弾回数：0~1", "移動速度：普通~とても速い", "・Dazzleの上位互換。<br>　敵の最高戦力。"]
			]
			let pcnt = 0; //  戦車の番号
			let ccnt = 0; //  車体か砲塔どちらかを指定する番号
			let tcnt = 0; //  初期設定用の戦車の番号

			let flg = false; //  画面遷移フラグ

			new DispHead(100, 80, 360 * 3, 240 * 3.6, "#a00d", scene) //  赤い背景追加
			new DispBody(100, 240, 360 * 3, 240 * 2.5, scene) //  黄色の背景追加

			scene.addChild(scene.TankGroup);
			scene.addChild(scene.CannonGroup);

			//  各戦車を７×２に並べて表示する処理
			for (let i = 0; i < 7; i++) {
				for (let j = 0; j < 2; j++) {
					if (j == 0) {
						dispTanks[tcnt] = new PictureTank(j + 3, i + 4.5, tanks[ccnt], tanks[ccnt + 1], scene);
					} else {
						dispTanks[tcnt] = new PictureTank(j + 4, i + 4.5, tanks[ccnt], tanks[ccnt + 1], scene);
					}

					tcnt++;
					ccnt += 2;
				}
			}

			//  戦車の情報表示テキスト群
			let tankName = new DispText(600, 260, 260 * 1, 48, "戦車名", '48px sans-serif', 'black', 'center', scene) //  戦車名
			let tankBulCnt = new DispText(600, 340, 260 * 1.5, 36, "　弾数　：", '36px sans-serif', 'black', 'left', scene) //  弾数
			let tankBulSpd = new DispText(600, 400, 260 * 2, 36, "　弾速　：", '36px sans-serif', 'black', 'left', scene) //  弾速
			let tankBulRef = new DispText(600, 460, 260 * 1.5, 36, "跳弾回数：", '36px sans-serif', 'black', 'left', scene) //  跳弾回数
			let tankSpd = new DispText(600, 520, 260 * 2, 36, "移動速度：", '36px sans-serif', 'black', 'left', scene) //  移動速度
			let tankDsc = new DispText(600, 580, 260 * 2.4, 72, "・戦車の特徴", '36px sans-serif', 'black', 'left', scene) //  戦車の特徴

			let playerTypeEdit = new DispText(150, 710, 260 * 3, 36, "▶ 操作する戦車の変更", '36px sans-serif', 'black', 'left', scene) //  戦車名
			new DispText(150, 750, 260 * 3, 24, "※プレイヤーが使う戦車を選択中の戦車に変更できます。", '24px sans-serif', 'black', 'left', scene) //  戦車名
			new DispText(150, 780, 260 * 3, 24, "※移動しない戦車を選択しても、最低限移動できる速度で操作できます。", '24px sans-serif', 'black', 'left', scene) //  戦車名
			new DispText(150, 810, 260 * 3, 24, "※DazzleとAbyssalには変更出来ません。", '24px sans-serif', 'black', 'left', scene) //  戦車名
			let selectTankNum = 0;

			//  見出し
			new DispText(120, 150, 260 * 4, 64, '戦車一覧', '64px sans-serif', '#ebe799', 'center', scene)
			//  タイトル画面へ移動するためのテキスト
			var toTitle = new DispText(480, 860, 320, 32, '➡タイトル画面へ', '32px sans-serif', '#ebe799', 'center', scene)

			//  選択されている戦車を青くする処理
			//dispTanks[pcnt].backgroundColor = "#0000ff66"

			// タイトル画面へ遷移する処理
			toTitle.addEventListener(Event.TOUCH_START, function(e) {
				flg = true
				new FadeOut(scene)
			});

			// プレイヤーが操作する戦車を変更する処理
			playerTypeEdit.addEventListener(Event.TOUCH_START, function(e) {
				if(playerType != selectTankNum && selectTankNum < 12){
					if (confirm("\r\n現在選択中の戦車に変更してもよろしいですか？")) {
						playerType = selectTankNum;
						//alert(playerType)
						if(selectTankNum == 0){
							playerStatus = [
								5,
								1,
								10,
								2.4
							];
						}else{
							playerStatus = [
								cateMaxBullets[playerType-1],
								cateMaxRefs[playerType-1],
								cateShotSpeeds[playerType-1],
								cateMoveSpeeds[playerType-1]
							];
							if(cateMoveSpeeds[playerType-1] < 1.5){
								playerStatus[3] = 1.5;
							}
						}
						
					}
				}
			});

			scene.onenterframe = function() {
				if (titleFlg == true && BGM.currentTime == BGM.duration) {
					BGM.play();
				}
				//  戦車がクリックされたとき、表示を変える処理
				for (let i = 0; i < 14; i++) {
					dispTanks[i].addEventListener(Event.TOUCH_START, function() {
						dispTanks[pcnt].backgroundColor = "#00000000"
						pcnt = i;
						tankName.text = performance[pcnt][0];
						tankBulCnt.text = performance[pcnt][1];

						if (addBullet != 0) {
							if (pcnt == 3) {
								tankBulCnt.color = 'red';
								tankBulRef.color = 'red';
							} else if (pcnt != 0) {
								tankBulCnt.color = 'red';
								tankBulRef.color = 'black';
							} else {
								tankBulCnt.color = 'black';
								tankBulRef.color = 'black';
							}

						}

						tankBulSpd.text = performance[pcnt][2];
						tankBulRef.text = performance[pcnt][3];
						tankSpd.text = performance[pcnt][4];
						tankDsc.text = performance[pcnt][5];
						dispTanks[pcnt].backgroundColor = "#00000033";
						selectTankNum = pcnt;
					});
				}
				if (flg == true) {
					scene.time++
					if (scene.time == 30) {
						game.replaceScene(createTitleScene()); // 現在表示しているシーンをゲームシーンに置き換える
					}
				}
			}
			new FadeIn(scene)
			return scene;
		}

		/* スタートシーン */
		var createStartScene = function() {

			deleteFlg = false;

			obsdir = []
			obsNum = 0;
			refdir = []
			refNum = 0;
			bullets = []; //各戦車の弾数の制御用配列
			boms = []; //爆弾の個数の制御用配列
			bulOb = [
				[]
			]; //戦車の弾情報を保持する配列
			colOb = [
				[]
			]; //弾の物理制御情報を保持する配列
			bomOb = [
				[]
			]; //爆弾の情報を保持する配列
			bulStack = []; //弾の状態の制御用配列
			enemyTarget = []; //敵戦車が狙うターゲット
			entVal = 0; //戦車の連番設定用変数
			tankEntity = []; //戦車情報を保持する配列
			tankDir = [];
			//markEntity = [];
			deadFlgs = []; //戦車の生存確認 
			fireFlgs = []; //敵の砲撃制御
			floors = []; //１ブロック分の壁
			avoids = []; //(敵のみ)通行不可
			walls = []; //ステージの壁
			holes = []; //穴
			tankColorCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
			destruction = 0;
			victory = false;
			defeat = false;
			resultFlg = false;
			delStageFile();

			var nextData = LoadStage(); //ステージ情報引き出し

			let count = 0;
			for (var i = 4; i < Object.keys(nextData).length; i++) {
				count++;
			}
			deadTank.forEach(elem => {
				if (elem) {
					count--;
				}
			})

			/*script = document.createElement("script");
			script.src = stagePath[stageNum];
			head[0].appendChild(script);*/
			stageData = LoadStage(); //ステージ情報引き出し

			var scene = new Scene(); // 新しいシーンを作る
			scene.time = 0;
			scene.backgroundColor = '#ebf899'; // シーンの背景色を設定
			now_scene = scene;

			// スタート画像設定
			new DispHead(100, 240, 360 * 3, 240 * 2, "#a00d", scene)

			// タイトルラベル設定
			new DispText(100, 320, 260 * size, 96, 'Stage : ' + stageNum, '96px sans-serif', '#ebe799', 'center', scene)

			// サブタイトルラベル設定
			new DispText(0, 480, 320 * size, 32, '敵戦車数：' + count, '32px sans-serif', '#ebe799', 'center', scene)

			new DispText(0, 550, 320 * size, 32, '残機数：' + zanki, '32px sans-serif', 'aliceblue', 'center', scene)

			new FadeIn(scene)

			scene.onenterframe = function() {
				scene.time++
				if (scene.time == 15) game.assets['./sound/RoundStart.mp3'].play()
				if ((stageNum % 20 == 0) && scene.time == 15) new Warning(scene)
				if (scene.time == 150) {
					new FadeOut(scene)
				}
				if (scene.time == 180) {
					game.replaceScene(createGameScene()); // 現在表示しているシーンをゲームシーンに置き換える
				}
			}

			return scene;
		};
		var createBonusScene = function() {

			var scene = new Scene(); // 新しいシーンを作る
			scene.time = 0;
			scene.backgroundColor = '#ebf899'; // シーンの背景色を設定
			now_scene = scene;

			zanki++;

			// スタート画像設定
			new DispHead(100, 240, 360 * 3, 240 * 2, "#a00d", scene)

			// タイトルラベル設定
			new DispText(100, 360, 260 * size, 72, 'クリアボーナス！', '72px sans-serif', '#ebe799', 'center', scene)

			var zankiLabel = new Label();
			zankiLabel.width = 64;
			zankiLabel.height = 64;
			zankiLabel.x = 320 * 2 + 64;
			zankiLabel.y = 495;
			zankiLabel.text = zanki - 1;
			zankiLabel.font = '64px "Arial"';
			zankiLabel.color = 'aliceblue';
			zankiLabel.textAlign = 'center';
			scene.addChild(zankiLabel)

			new DispText(0, 500, 310 * size, 48, '残機数：', '48px sans-serif', 'aliceblue', 'center', scene)

			new FadeIn(scene)

			scene.onenterframe = function() {
				scene.time++
				if (scene.time == 15) game.assets['./sound/ExtraTank.mp3'].play()
				if (scene.time >= 85 && scene.time < 90) {
					zankiLabel.opacity -= 0.2;
					if (zankiLabel.opacity <= 0) {
						scene.removeChild(zankiLabel)
					}
				}
				if (scene.time == 90) {
					zankiLabel = new Label();
					zankiLabel.width = 64;
					zankiLabel.height = 72;
					zankiLabel.x = 320 * 2 + 64;
					zankiLabel.y = 490;
					zankiLabel.opacity = 1.0;
					zankiLabel.text = zanki;
					zankiLabel.font = 'bold 72px "Arial"';
					zankiLabel.color = '#ebf899';
					zankiLabel.textAlign = 'center';
					scene.addChild(zankiLabel)
				}
				if (scene.time == 150) {
					new FadeOut(scene)
				}
				if (scene.time == 180) {
					game.replaceScene(createStartScene()); // 現在表示しているシーンをゲームシーンに置き換える
				}
			}
			return scene;
		};
		/* ゲームシーン */
		var createGameScene = function() {
			var world = new PhysicsWorld(0, 0);
			game.time = 0;
			worldFlg = false;
			deleteFlg = false;

			stageData = LoadStage(); //ステージ情報引き出し

			var scene = new Scene(); // 新しいシーンを作る
			scene.time = 0;
			now_scene = scene;

			//scene.CursorGroup = new Group();
			scene.MarkGroup = new Group();
			scene.BomGroup = new Group();
			scene.TankGroup = new Group();
			scene.CannonGroup = new Group();
			scene.SmokeGroup = new Group();
			scene.FireGroup = new Group();
			scene.BulGroup = new Group();


			let backgroundMap = new Map(pixelSize, pixelSize);
			backgroundMap.image = game.assets['./image/MapImage/map0.png']
			backgroundMap.loadData(stageData[0], stageData[1])
			backgroundMap.collisionData = stageData[2];
			scene.addChild(backgroundMap);
			//let backgroundMap = new MainMap(scene);

			walls[0] = new Wall(18, 1, 1, 1, scene)
			//Obstracle(walls[0],scene)
			walls[1] = new Wall(18, 1, 1, 14, scene)
			//Obstracle(walls[1],scene)
			walls[2] = new Wall(1, 13, 0, 1, scene)
			//Obstracle(walls[2],scene)
			walls[3] = new Wall(1, 13, 19, 1, scene)
			//Obstracle(walls[3],scene)
			//walls[4] = new Wall(24,1,0,15,scene)
			//Obstracle(walls[4],scene)

			var fy = 0;
			var fx = 0;

			var grid = [];

			/* 壁の当たり判定設置 */
			backgroundMap.collisionData.forEach(colI => {
				grid[fy] = []
				colI.forEach(colJ => {
					if (colJ == 0) {
						grid[fy][fx] = 'Empty';
					} else {
						if (colJ == 2) {
							avoids.push(new Avoid(fx, fy, scene));
							grid[fy][fx] = 'Obstacle';
						} else if (colJ == 3) {
							holes.push(new Hole(fx, fy, scene))
							grid[fy][fx] = 'Obstacle';
							//Obstracle(holes[holes.length - 1], scene)
						} else {

							if (colJ == 1) {
								floors.push(new Floor(fx, fy, scene));
								grid[fy][fx] = 'Obstacle';
								//Obstracle(floors[floors.length - 1], scene)
								//RefObstracle(floors[floors.length - 1], scene)
							} else {
								grid[fy][fx] = 'Obstacle';
							}
						}

					}
					fx++;
				});
				fy++;
				fx = 0;
			});

			scene.addChild(scene.MarkGroup);
			scene.addChild(scene.BomGroup);
			scene.addChild(scene.TankGroup);
			scene.addChild(scene.SmokeGroup);
			scene.addChild(scene.FireGroup);
			scene.addChild(scene.BulGroup);
			scene.addChild(scene.CannonGroup);
			//scene.addChild(scene.CursorGroup);


			let filterMap = new Map(pixelSize, pixelSize);
				filterMap.image = backgroundMap.image;
			let filImg = stageData[1];
			for (let i = 0; i < stageData[0].length; i++) {
				for (let j = 0; j < stageData[0][i].length; j++) {
					if (stageData[0][i][j] == 7) {
						filImg[i][j] = 7
					} else if (stageData[0][i][j] == 23) {
						filImg[i][j] = 39
					}
				}
			}
			filterMap.loadData(fmap, filImg);
			//filterMap.collisionData = fcol;
			if (debugFlg) filterMap.opacity = 0;
			scene.addChild(filterMap);

			//let filterMap = new FillterMap(scene);

			SetObs(scene,backgroundMap.collisionData);
			SetRefs(scene,backgroundMap.collisionData);

			/* カーソルの設置＆位置取得処理 */
			cur = new Cursor(scene);

			/* 戦車の追加処理 */
			bulOb.push([])
			colOb.push([])
			bomOb.push([])
			bulStack.push([])
			/*if (debugFlg) {
				tankEntity.push(new Player(stageData[3][0], stageData[3][1], './image/ObjectImage/tank2.png', './image/ObjectImage/cannon.png', 5, 2, 18, 2.4, scene, filterMap))
			} else {
				tankEntity.push(new Player(stageData[3][0], stageData[3][1], './image/ObjectImage/tank2.png', './image/ObjectImage/cannon.png', 5, 1, 10, 2.4, scene, filterMap))
			}*/
			if(playerType == 0){
				tankEntity.push(new Player(stageData[3][0], stageData[3][1], './image/ObjectImage/tank2.png', './image/ObjectImage/cannon.png', 5, 1, 10, 2.4, scene, filterMap))
			}else{
				tankEntity.push(new Player(stageData[3][0], stageData[3][1], cateImages[playerType].tank, cateImages[playerType].cannon, playerStatus[0]+addBullet, playerStatus[1], playerStatus[2]+addBullet, playerStatus[3]+addSpeed, scene, filterMap))
			}
			

			let abn = Math.floor(Math.random() * 10);

			for (let i = 4; i < Object.keys(stageData).length; i++) {
				if((abn == 0 && stageNum > 10 && i == 4 && stageNum % 5 != 0) || stageData[i][9] == 12) stageData[i][10] = 10;
				if ((stageData[i][10] != 11 && stageData[i][7] > 0) || stageData[i][10] == 8 || stageData[i][10] == 10) {
					stageData[i][7] = cateMoveSpeeds[stageData[i][10]];
					if (stageData[i][9] > 2) {
						stageData[i][7] = cateMoveSpeeds[stageData[i][10]] + addSpeed;
					}
				};
				bulOb.push([])
				colOb.push([])
				bomOb.push([])
				bulStack.push([])
				if (retryFlg == false) {
					if (stageData[i][10] == 10) {
						tankEntity.push(new AIElite(stageData[i][0], stageData[i][1], './image/ObjectImage/abnormal.png', './image/ObjectImage/abnormalcannon.png', tankEntity[0], cateMaxBullets[stageData[i][10]] + addBullet, cateMaxRefs[stageData[i][10]], cateShotSpeeds[stageData[i][10]], stageData[i][7], cateFireLate[stageData[i][10]], 10, stageData[i][10], scene, filterMap, backgroundMap, grid))
						//tankEntity.push(new Elite(stageData[i][0],stageData[i][1],'./image/ObjectImage/abnormal.png','./image/ObjectImage/abnormalcannon.png',tankEntity[0],cateMaxBullets[10]+addBullet,0,cateShotSpeeds[10],1.5,cateFireLate[10],10,10,scene,filterMap))
					} else if (stageData[i][10] == 7 || stageData[i][10] == 0) {
						tankEntity.push(new AnotherElite(stageData[i][0], stageData[i][1], stageData[i][2], stageData[i][3], tankEntity[0], cateMaxBullets[stageData[i][10]] + addBullet, cateMaxRefs[stageData[i][10]], cateShotSpeeds[stageData[i][10]], 0, cateFireLate[stageData[i][10]], stageData[i][9], stageData[i][10], scene, filterMap));
					} else if (stageData[i][10] == 5 || stageData[i][10] == 4) {
						tankEntity.push(new AIElite(stageData[i][0], stageData[i][1], stageData[i][2], stageData[i][3], tankEntity[0], cateMaxBullets[stageData[i][10]] + addBullet, cateMaxRefs[stageData[i][10]], cateShotSpeeds[stageData[i][10]], stageData[i][7], cateFireLate[stageData[i][10]], stageData[i][9], stageData[i][10], scene, filterMap, backgroundMap, grid))
					} else if (stageData[i][10] == 11) {
						tankEntity.push(new NewEnemy(stageData[i][0], stageData[i][1], stageData[i][2], stageData[i][3], tankEntity[0], stageData[i][10], stageData[i][9], scene))
						//tankEntity.push(new Boss(stageData[i][0], stageData[i][1], stageData[i][2], stageData[i][3], tankEntity[0], stageData[i][4] + addBullet, stageData[i][5], stageData[i][6] - 1, stageData[i][7], stageData[i][8], stageData[i][9], stageData[i][10], scene, filterMap))
					} else if (stageData[i][10] == 6) {
						tankEntity.push(new Stealth(stageData[i][0], stageData[i][1], stageData[i][2], stageData[i][3], tankEntity[0], cateMaxBullets[stageData[i][10]] + addBullet, cateMaxRefs[stageData[i][10]], cateShotSpeeds[stageData[i][10]], stageData[i][7], cateFireLate[stageData[i][10]], stageData[i][9], stageData[i][10], scene, filterMap));
					} else if (stageData[i][10] == 8) {
						tankEntity.push(new Bomber(stageData[i][0], stageData[i][1], stageData[i][2], stageData[i][3], tankEntity[0], cateMaxBullets[stageData[i][10]] + addBullet, cateMaxRefs[stageData[i][10]], cateShotSpeeds[stageData[i][10]], stageData[i][7], cateFireLate[stageData[i][10]], stageData[i][9], stageData[i][10], scene, filterMap));
					} else if (stageData[i][10] == 9) {
						tankEntity.push(new FullFire(stageData[i][0], stageData[i][1], stageData[i][2], stageData[i][3], tankEntity[0], cateMaxBullets[stageData[i][10]] + addBullet, cateMaxRefs[stageData[i][10]], cateShotSpeeds[stageData[i][10]], stageData[i][7], cateFireLate[stageData[i][10]], stageData[i][9], stageData[i][10], scene, filterMap));
					} else if (stageData[i][9] > 2) {
						tankEntity.push(new Elite(stageData[i][0], stageData[i][1], stageData[i][2], stageData[i][3], tankEntity[0], cateMaxBullets[stageData[i][10]] + addBullet, cateMaxRefs[stageData[i][10]], cateShotSpeeds[stageData[i][10]], stageData[i][7], cateFireLate[stageData[i][10]], stageData[i][9], stageData[i][10], scene, filterMap));
					} else {
						if(stageData[i][7] == 0){
							tankEntity.push(new Elite(stageData[i][0], stageData[i][1], stageData[i][2], stageData[i][3], tankEntity[0], cateMaxBullets[stageData[i][10]] + addBullet, cateMaxRefs[stageData[i][10]], cateShotSpeeds[stageData[i][10]], stageData[i][7], cateFireLate[stageData[i][10]], stageData[i][9], stageData[i][10], scene, filterMap));
						}else{
							tankEntity.push(new newAI(stageData[i][0], stageData[i][1], stageData[i][2], stageData[i][3], tankEntity[0], cateMaxBullets[stageData[i][10]] + addBullet, cateMaxRefs[stageData[i][10]], cateShotSpeeds[stageData[i][10]], stageData[i][7], cateFireLate[stageData[i][10]], stageData[i][9], stageData[i][10], scene, backgroundMap, grid, filterMap))
						}
						//tankEntity.push(new newAI(stageData[i][0], stageData[i][1], stageData[i][2], stageData[i][3], tankEntity[0], cateMaxBullets[stageData[i][10]] + addBullet, cateMaxRefs[stageData[i][10]], cateShotSpeeds[stageData[i][10]], stageData[i][7], cateFireLate[stageData[i][10]], stageData[i][9], stageData[i][10], scene, backgroundMap, grid, filterMap))
					}
					deadTank[i - 4] = false;
					tankColorCounts[stageData[i][10]]++;
				} else {
					if (deadTank[i - 4] == false) {
						if (stageData[i][10] == 10) {
							tankEntity.push(new AIElite(stageData[i][0], stageData[i][1], './image/ObjectImage/abnormal.png', './image/ObjectImage/abnormalcannon.png', tankEntity[0], cateMaxBullets[10] + addBullet, cateMaxRefs[10], cateShotSpeeds[10], stageData[i][7], cateFireLate[10], 10, 10, scene, filterMap, backgroundMap, grid))
							//tankEntity.push(new Elite(stageData[i][0],stageData[i][1],'./image/ObjectImage/abnormal.png','./image/ObjectImage/abnormalcannon.png',tankEntity[0],cateMaxBullets[10]+addBullet,0,cateShotSpeeds[10],1.5,cateFireLate[10],10,10,scene,filterMap))
						} else if (stageData[i][10] == 7 || stageData[i][10] == 0) {
							tankEntity.push(new AnotherElite(stageData[i][0], stageData[i][1], stageData[i][2], stageData[i][3], tankEntity[0], cateMaxBullets[stageData[i][10]] + addBullet, cateMaxRefs[stageData[i][10]], cateShotSpeeds[stageData[i][10]], 0, cateFireLate[stageData[i][10]], stageData[i][9], stageData[i][10], scene, filterMap));
						} else if (stageData[i][10] == 5 || stageData[i][10] == 4) {
							tankEntity.push(new AIElite(stageData[i][0], stageData[i][1], stageData[i][2], stageData[i][3], tankEntity[0], cateMaxBullets[stageData[i][10]] + addBullet, cateMaxRefs[stageData[i][10]], cateShotSpeeds[stageData[i][10]], stageData[i][7], cateFireLate[stageData[i][10]], stageData[i][9], stageData[i][10], scene, filterMap, backgroundMap, grid))
						} else if (stageData[i][10] == 11) {
							tankEntity.push(new NewEnemy(stageData[i][0], stageData[i][1], stageData[i][2], stageData[i][3], tankEntity[0], stageData[i][10], stageData[i][9], scene))
							//tankEntity.push(new Boss(stageData[i][0], stageData[i][1], stageData[i][2], stageData[i][3], tankEntity[0], stageData[i][4] + addBullet, stageData[i][5], stageData[i][6] - 1, stageData[i][7], stageData[i][8], stageData[i][9], stageData[i][10], scene, filterMap))
						} else if (stageData[i][10] == 6) {
							tankEntity.push(new Stealth(stageData[i][0], stageData[i][1], stageData[i][2], stageData[i][3], tankEntity[0], cateMaxBullets[stageData[i][10]] + addBullet, cateMaxRefs[stageData[i][10]], cateShotSpeeds[stageData[i][10]], stageData[i][7], cateFireLate[stageData[i][10]], stageData[i][9], stageData[i][10], scene, filterMap));
						} else if (stageData[i][10] == 8) {
							tankEntity.push(new Bomber(stageData[i][0], stageData[i][1], stageData[i][2], stageData[i][3], tankEntity[0], cateMaxBullets[stageData[i][10]] + addBullet, cateMaxRefs[stageData[i][10]], cateShotSpeeds[stageData[i][10]], stageData[i][7], cateFireLate[stageData[i][10]], stageData[i][9], stageData[i][10], scene, filterMap));
						} else if (stageData[i][10] == 9) {
							tankEntity.push(new FullFire(stageData[i][0], stageData[i][1], stageData[i][2], stageData[i][3], tankEntity[0], cateMaxBullets[stageData[i][10]] + addBullet, cateMaxRefs[stageData[i][10]], cateShotSpeeds[stageData[i][10]], stageData[i][7], cateFireLate[stageData[i][10]], stageData[i][9], stageData[i][10], scene, filterMap));
						} else if (stageData[i][9] > 2) {
							tankEntity.push(new Elite(stageData[i][0], stageData[i][1], stageData[i][2], stageData[i][3], tankEntity[0], cateMaxBullets[stageData[i][10]] + addBullet, cateMaxRefs[stageData[i][10]], cateShotSpeeds[stageData[i][10]], stageData[i][7], cateFireLate[stageData[i][10]], stageData[i][9], stageData[i][10], scene, filterMap));
						} else {
							if(stageData[i][7] == 0){
								tankEntity.push(new Elite(stageData[i][0], stageData[i][1], stageData[i][2], stageData[i][3], tankEntity[0], cateMaxBullets[stageData[i][10]] + addBullet, cateMaxRefs[stageData[i][10]], cateShotSpeeds[stageData[i][10]], stageData[i][7], cateFireLate[stageData[i][10]], stageData[i][9], stageData[i][10], scene, filterMap));
							}else{
								tankEntity.push(new newAI(stageData[i][0], stageData[i][1], stageData[i][2], stageData[i][3], tankEntity[0], cateMaxBullets[stageData[i][10]] + addBullet, cateMaxRefs[stageData[i][10]], cateShotSpeeds[stageData[i][10]], stageData[i][7], cateFireLate[stageData[i][10]], stageData[i][9], stageData[i][10], scene, backgroundMap, grid, filterMap))
							}
							
						}
						//deadTank[i-4] = 0;
						tankColorCounts[stageData[i][10]]++;
					} else {
						tankEntity.push(new Sprite({ width: 1, height: 1, x: -100, y: -100 }));
						deadFlgs.push(true);
						bulOb[i - 3][0] = new Sprite({ width: 1, height: 1, x: -1, y: -1 });
						colOb[i - 3][0] = new PhyCircleSprite(2.5, enchant.box2d.DYNAMIC_SPRITE, 0.0, 0.0, 1.0, true);
						bomOb[i - 3][0] = new Sprite({ width: 1, height: 1, x: 1280, y: -1 });
						for (let j = 0; j < 4; j++) {
							tankDir[i - 3] = [];
							tankDir[i - 3][j] = new Sprite({ width: 1, height: 1, x: -1, y: -1 });
						}
						entVal++;
						destruction++;
					}
				}

			}

			new PlayerLabel(tankEntity[0], scene)
			new FadeIn(scene)
			let dcnt = 0;

			let startLabel = new Label();
			startLabel.width = 360;
			startLabel.height = 72;
			startLabel.x = 480;
			startLabel.y = 300;
			startLabel.text = 'スタート';
			startLabel.font = '72px "Arial"';
			startLabel.color = 'yellow';
			startLabel.textAlign = 'left';

			let BGM1 = game.assets['./sound/start.mp3'];
			BGM1.play();
			BGM1.volume = 0.2
			let pauseButtton = new Label();
			pauseButtton.width = game.width;
			pauseButtton.height = 96;
			pauseButtton.x = 0;
			pauseButtton.y = game.height / 2 - 96;
			pauseButtton.text = '';
			pauseButtton.font = 'bold 96px "sans-serif"';
			pauseButtton.color = 'aliceblue';
			pauseButtton.textAlign = 'center';
			let remaining = new DispText(252, 960 - 72, 720, 48, '敵残数：' + (tankEntity.length - 1 - destruction) + '　　　残機：' + zanki, 'bold 48px "Arial"', 'white', 'center', scene)
			let BGM2 = game.assets['./sound/end.mp3'];
			let BGM3 = game.assets['./sound/result.mp3'];

			let blackImg = new DispLine(0, 0, game.width, game.height, "#00000000", scene)
			let retire = new DispText(0, 0, 1, 1, '', '48px sans-serif', 'red', 'center', scene)
			retire.addEventListener(Event.TOUCH_START, function() {
				if (pauseFlg == true) {
					if (confirm("本当にリタイアしますか？\r\n※現在の進行状況は保存されます。\r\nタイトルのつづきからを選択すると現在のステージから再開できます。")) {
						Repository.data.StageNum = stageNum;
						Repository.data.Zanki = zanki;
						Repository.data.Scores = colors;
						Repository.save();
						blackImg.backgroundColor = "#00000000"
						worldFlg = true
						pauseButtton.text = '';
						zanki = 0;
						deadFlgs[0] = true;
						deleteFlg = true;
						retireFlg = true;
					}
				}

			});

			let CngBgmNum = BNum;

			function AllDelete() {

				/*for (let i = 0; i < obsdir.length; i++) {
					for (let j = 0; j < obsdir[i].length; j++) {
						scene.removeChild(obsdir[i][j])
					};
				};
				for (let i = 0; i < refdir.length; i++) {
					for (let j = 0; j < refdir[i].length; j++) {
						scene.removeChild(refdir[i][j])
					};
				};*/
				for (let i = 0; i < tankDir.length; i++) {
					for (let j = 0; j < tankDir[i].length; j++) {
						scene.removeChild(tankDir[i][j])
					};
				};
				for (let i = 0; i < tankEntity.length; i++) {
					scene.removeChild(tankEntity[i]);
				};
				scene.MarkGroup.childNodes.forEach(elem => {
					scene.removeChild(elem);
				})
				/*for(let i = 0; i < markEntity.length; i++){
				    scene.removeChild(markEntity[i]);
				};*/
				bulOb.forEach(elem => {
					elem.forEach(elem2 => {
						scene.BulGroup.removeChild(elem2)
					});
				});
				for (let i = 0; i < colOb.length; i++) {
					for (let j = 0; j < colOb[i].length; j++) {
						if (bulStack[i][j] == true) {
							colOb[i][j].destroy();

							scene.BulGroup.removeChild(colOb[i][j]);
						};
					};
				};
				floors.forEach(elem => {
					elem.destroy()
				});
				walls.forEach(elem => {
					elem.destroy()
				});
				avoids.forEach(elem => {
					scene.removeChild(elem)
				});
				holes.forEach(elem => {
					scene.removeChild(elem)
				});
				scene.removeChild(backgroundMap);
				scene.removeChild(filterMap);

			}
			let chgBgm = false;

			new DispCountDown(scene);

			scene.onenterframe = function() {

				scene.time++;
				
				if (scene.time % 6 == 0) {
					remaining.text = '敵残数：' + (tankEntity.length - 1 - destruction) + '　　　残機：' + zanki;
				}
				//if(defeat == false && victory == false && complete == false) 
				Floor.intersectStrict(Aim).forEach(function(pair) {
					scene.removeChild(pair[1])
				})
				Wall.intersectStrict(Aim).forEach(function(pair) {
					scene.removeChild(pair[1])
				})
				Floor.intersectStrict(BulAim).forEach(function(pair) {
					scene.removeChild(pair[1])
				})
				Wall.intersectStrict(BulAim).forEach(function(pair) {
					scene.removeChild(pair[1])
				})
				Floor.intersectStrict(PlayerBulAim).forEach(function(pair) {
					scene.removeChild(pair[1])
				})
				Wall.intersectStrict(PlayerBulAim).forEach(function(pair) {
					scene.removeChild(pair[1])
				})

				//[0,0,0,0,0,0,0,0,0,0,0,0];0～11
				if (tankColorCounts[11] > 0) BNum = 11
				else if (tankColorCounts[7] > 0) BNum = 10
				else if (tankColorCounts[8] > 0) BNum = 9
				else if (tankColorCounts[9] > 0) BNum = 8
				else if (tankColorCounts[10] > 0) BNum = 7
				else if (tankColorCounts[6] > 0) BNum = 6
				else if (tankColorCounts[5] > 0) BNum = 5
				else if (tankColorCounts[4] > 0) BNum = 4
				else if (tankColorCounts[3] > 0) BNum = 3
				else if (tankColorCounts[2] > 0) BNum = 2
				else if (tankColorCounts[1] > 0) BNum = 1
				else BNum = 0

				if (navigator.userAgent.match(/iPhone|iPad|Android/)) {
					if (inputManager.checkButton("Start") == inputManager.keyStatus.DOWN && scene.time > 250 && defeat == false && victory == false && complete == false) {
						if (worldFlg == false) {
							blackImg.backgroundColor = "#00000000"
							worldFlg = true
							pauseButtton.text = '';
							BGM1.volume = 1.0
							pauseFlg = false;
							retire.x = 0
							retire.y = 0
							retire.width = 1;
							retire.height = 1;
							retire.text = ""
						} else {
							blackImg.backgroundColor = "#00000044"
							pauseButtton.text = '一時停止';
							worldFlg = false
							pauseFlg = true;
							BGM1.volume = 0.5
							retire.x = game.width / 2 - 96
							retire.y = game.height / 2 + 96
							retire.width = 48 * 4;
							retire.height = 48;
							retire.text = "リタイア"
						}
					}
				}

				document.onkeyup = function(e) {
					if ((e.code == 'Escape') && scene.time > 250 && defeat == false && victory == false && complete == false && resultFlg == false) {
						if (worldFlg == false) {
							blackImg.backgroundColor = "#00000000"
							worldFlg = true
							pauseButtton.text = '';
							BGM1.volume = 1.0
							pauseFlg = false;
							retire.x = 0
							retire.y = 0
							retire.width = 1;
							retire.height = 1;
							retire.text = ""
						} else {
							blackImg.backgroundColor = "#00000044"
							pauseButtton.text = '一時停止';
							worldFlg = false
							pauseFlg = true;
							BGM1.volume = 0.5
							retire.x = game.width / 2 - 96
							retire.y = game.height / 2 + 96
							retire.width = 48 * 4;
							retire.height = 48;
							retire.text = "リタイア"
						}
					}
				}
				
				

				if (scene.time == 210 && (complete == false && victory == false && defeat == false && resultFlg == false)) {
					worldFlg = true;
					scene.addChild(startLabel)
					scene.addChild(pauseButtton)
				}

				if((victory == false && defeat == false && complete == false && resultFlg == false)){
					
					/*if(CngBgmNum != BNum && BGM1 != game.assets['./sound/start.mp3']){
						CngBgmNum = BNum;
							
						let curTime = BGM1.currentTime;
	
						BGM1.pause();
	
						BGM1 = game.assets[BGMs[BNum]].clone();
						BGM1.currentTime = curTime;
						
						BGM1.play();
						
	
					}*/
					if (BGM1.currentTime == BGM1.duration) {
						//BGM1 = game.assets['./sound/FIRST.mp3'];
						BGM1 = game.assets[BGMs[BNum]];
						BGM1.currentTime = 0;
						BGM1.play()
						if(scene.time > 250)BGM1.currentTime = 0.01;
					}
				}
				

				if (worldFlg == true) {

					
					
					if (game.input.up) cur.y -= 8;
					else if (game.input.down) cur.y += 8;
					if (game.input.right) cur.x += 8;
					else if (game.input.left) cur.x -= 8;
					if (scene.time == 270) scene.removeChild(startLabel)
					world.step(game.fps);
					game.time++;

					if (resultFlg == false) {
						chgBgm = false;
						if (defeat == false && victory == false && complete == false) {
							if (destruction == tankEntity.length - 1 && zanki > 0 && deadFlgs[0] == false) {
								scene.removeChild(pauseButtton)
								scene.removeChild(blackImg)
								scene.removeChild(retire)
								BGM1.stop();
								for (var i = 4; i < Object.keys(stageData).length; i++) {
									colors[stageData[i][10]] += 1;
								}
								let script = document.createElement("script");
								script.src = stagePath[stageNum + 1];
								script.id = 'stage_' + (stageNum + 1);
								head[0].appendChild(script);
								if (stageNum % 20 == 0) {
									complete = true;
									resultFlg = true;
									score += destruction
									scene.time = 0;
									new DispHead(100, 60, 360 * 3, 180, "#a00", scene)
									new DispText(252, 124, 720, 64, 'ミッションコンプリート！', 'bold 60px "Arial"', 'yellow', 'center', scene)
								} else {
									victory = true;
									game.time = 0;
									new DispText(360, 300, 720, 64, 'ミッションクリア！', 'bold 60px "Arial"', 'red', 'left', scene)
									new DispScore(scene)
								}
							} else if (deadFlgs[0] == true) {
								scene.removeChild(pauseButtton)
								scene.removeChild(blackImg)
								scene.removeChild(retire)
								BGM1.stop();

								/*let script = document.createElement("script");
								    script.src = stagePath[stageNum+1];
								let head = document.getElementsByTagName("head");
								    head[0].appendChild(script);*/
								defeat = true;
								if (zanki <= 0) {
									for (var i = 4; i < Object.keys(stageData).length; i++) {
										if (deadFlgs[i - 3]) {
											colors[stageData[i][10]] += 1;
										}
									}
									resultFlg = true;
									score += destruction
									scene.time = 0;
									new DispHead(100, 60, 360 * 3, 180, "#a00", scene)
									new DispText(252, 124, 720, 64, 'ミッション終了！', 'bold 60px "Arial"', 'yellow', 'center', scene)
								} else {
									game.time = 0;
								}
							} else {

							}
						} else if (victory == true) {
							if (game.time == 15) {
								BGM2 = game.assets['./sound/success.mp3'].play()
							}
							if (game.time == 150) {
								new FadeOut(scene)
							}
							if (game.time == 170) {
								deleteFlg = true;
								scene.removeChild(remaining);
							}
							if (game.time == 180) {
								retryFlg = false;
								score += destruction
								deadTank = [false];
								stageNum++;
								AllDelete();

								if (stageNum % 5 == 0) {
									game.replaceScene(createBonusScene())
								} else {
									game.replaceScene(createStartScene())
								}
							}
						} else if (defeat == true) {
							if (game.time == 15) {
								BGM2 = game.assets['./sound/failed.mp3'].play()
							}
							if (game.time == 150) {
								new FadeOut(scene)
							}
							if (game.time == 170) {
								deleteFlg = true;
								scene.removeChild(remaining);
							}
							if (game.time == 180) {
								retryFlg = true;
								AllDelete();

								game.replaceScene(createStartScene())
							}
						}
					} else if (resultFlg) {
						if (scene.time == 15) {
							BGM2 = game.assets['./sound/end.mp3'];
							BGM2.play()
							chgBgm = true;
						} else if (scene.time > 100 && chgBgm == true && BGM2.currentTime == BGM2.duration) {
							BGM2.currentTime = 0;
							BGM2.stop()
							BGM3 = game.assets['./sound/result.mp3'];
							BGM3.currentTime = 0;
							BGM3.play()
							chgBgm = false;
						} else if (scene.time > 100 && chgBgm == false && BGM3.currentTime == BGM3.duration) {
							BGM3 = game.assets['./sound/result.mp3'];
							BGM3.currentTime = 0;
							BGM3.play()
						}
						if (scene.time == 120) {
							deleteFlg = true;
							scene.removeChild(remaining);
							new DispBody(100, 240, 360 * 3, 240 * 3, scene)
						}
						if (scene.time >= 120 && scene.time % 15 == 0 && dcnt < colors.length) {
							new DispText(180, 200 + (56 * (dcnt + 1)), 720, 48, colorsName[dcnt], '48px "Arial"', fontColor[dcnt], 'left', scene)
							new DispText(460, 200 + (56 * (dcnt + 1)), 320 * 2, 48, '：' + colors[dcnt], '48px "Arial"', '#400', 'left', scene)
							dcnt++;
						}
						if (scene.time == 315) {
							if (defeat) {
								new DispText(650, 420, 320 * 2, 64, '撃破数：' + (score), 'bold 64px "Arial"', '#622', 'left', scene)
							} else {
								new DispText(650, 420, 320 * 2, 64, '撃破数+残機：' + (score + zanki), 'bold 64px "Arial"', '#622', 'left', scene)
							}

						}
						if (scene.time >= 345) {
							retryFlg = false;
							deadTank = [false];
							var toTitle = new Label('➡タイトル画面へ');
							toTitle.moveTo(640, 640);
							toTitle.width = 320 * 1.5;
							toTitle.height = 36;
							toTitle.font = '36px "Arial"';
							toTitle.color = '#400';
							toTitle.textAlign = 'center';
							var toProceed = new Label('➡さらなるステージへ...');
							toProceed.moveTo(640, 720);
							toProceed.width = 320 * 1.5;
							toProceed.height = 36;
							toProceed.font = 'bold 36px "Arial"';
							toProceed.color = 'red';
							toProceed.textAlign = 'center';
							if (scene.time == 345) {
								scene.addChild(toTitle)
								if (stageNum != 100 && defeat == false) {
									scene.addChild(toProceed)
								}
							}
							toTitle.addEventListener(Event.TOUCH_START, function() {

								game.stop()
								location.href = "./game.html";
								//location.href = "https://m-kz15.github.io/PlayBTG/game.html";
							});
							toProceed.addEventListener(Event.TOUCH_START, function() {
								complete = false;
								BGM3.stop()

								new FadeOut(scene)
								stageNum++;
								AllDelete();

								game.replaceScene(createStartScene())
							});
						}
					}





					/*if((destruction == tankEntity.length-1 || zanki <= 0) && deadFlgs[0]==false && victory == false && complete == false){
                        scene.removeChild(pauseButtton)
                        scene.removeChild(blackImg)
                        scene.removeChild(retire)
                        BGM1.stop();
                        
                        for(var i = 4; i < Object.keys(stageData).length; i++){
                            colors[stageData[i][10]] += 1;
                        }
                        let script = document.createElement("script");
                            script.src = stagePath[stageNum+1];
                        let head = document.getElementsByTagName("head");
                            head[0].appendChild(script);
                        if(zanki <= 0){
                            scene.time = 0;
                            new DispHead(100,60,360*3,180,"#a00",scene)
                            new DispText(252,124,720,64,'ミッション終了！','bold 64px "Arial"','yellow','center',scene)
                            score += destruction
                            complete = true;
                        }else if(stageNum % 20 == 0){
                            
                            scene.time = 0;
                            new DispHead(100,60,360*3,180,"#a00",scene)
                            new DispText(252,124,720,64,'ミッションコンプリート！','bold 64px "Arial"','yellow','center',scene)
    
                            score += destruction
                            complete = true;
                        }else{
                            new DispText(360,300,720,64,'ミッションクリア！','bold 64px "Arial"','red','left',scene)
                            new DispScore(scene)
                            victory = true;
                            game.time = 0;
                        }
                        
                    }
                    if(complete == true){
                        if(scene.time == 15){
                            BGM2 = game.assets['./sound/end.mp3'];
                            BGM2.play()
                            chgBgm = true;
                        }else if(scene.time > 100 && chgBgm == true && BGM2.currentTime == BGM2.duration){
                            BGM2.currentTime = 0;
                            BGM2.stop()
                            BGM3 = game.assets['./sound/result.mp3'];
                            BGM3.currentTime = 0;
                            BGM3.play()
                            chgBgm = false;
                        }else if(scene.time > 100 && chgBgm == false && BGM3.currentTime == BGM3.duration){
                            BGM3 = game.assets['./sound/result.mp3'];
                            BGM3.currentTime = 0;
                            BGM3.play()
                        }
                        if(scene.time == 120){
                            new DispBody(100,240,360*3,240*3,scene)
                        }
                        if(scene.time >= 120 && scene.time % 15 == 0 && dcnt < colors.length){
                            new DispText(180,200+(56*(dcnt+1)),720,48,colorsName[dcnt],'48px "Arial"',fontColor[dcnt],'left',scene)
                            new DispText(460,200+(56*(dcnt+1)),320*2,48,'：'+colors[dcnt],'48px "Arial"','#400','left',scene)
                            dcnt++;
                        }
                        if(scene.time == 315){
                            new DispText(650,420,320*2,64,'撃破数+残機：'+(score+zanki),'bold 64px "Arial"','#622','left',scene)
                        }
                        if(scene.time >= 345){
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
                                deleteFlg = true;
                                scene.addChild(toTitle)
                                if(stageNum != 100 && zanki > 0){
                                    scene.addChild(toProceed)
                                }
                            }
                            toTitle.addEventListener(Event.TOUCH_START, function() {
                                
                                game.stop()
                                //location.href = "./game.html";
                                location.href = "https://m-kz15.github.io/PlayBTG/game.html";
                            });
                            toProceed.addEventListener(Event.TOUCH_START, function() {
                                complete = false;
                                BGM3.stop()
                                
                                new FadeOut(scene)
                                stageNum++;
                                AllDelete();
                                
                                game.replaceScene(createStartScene())
                            });
                        }
                    }else{
                        if(deadFlgs[0]==true && defeat == false && zanki > 0){
                            game.time = 0;
                            
                            defeat = true;
                            BGM1.stop();
                            scene.removeChild(pauseButtton)
                            scene.removeChild(blackImg)
                            scene.removeChild(retire)
                        }
                        if(defeat == true && zanki > 0 && game.time == 15){
                            
                            BGM2 = game.assets['./sound/failed.mp3'].play()
                        } 
                        if((defeat == true || victory == true && zanki > 0) && game.time == 150){
                            new FadeOut(scene)
                        }
                        if((defeat == true || victory == true && zanki > 0) && game.time == 170){
                            deleteFlg = true;
                        }
                        if(defeat==true && game.time == 180 && zanki > 0){
                            AllDelete();
                            
                            game.replaceScene(createStartScene())
                        }
                        if(victory == true && game.time == 15){
                            
                            BGM2 = game.assets['./sound/success.mp3'].play()
                        }
                        if(victory == true && game.time == 180 && complete==false){
                            score += destruction
                            stageNum++;
                            AllDelete();
                            
                            if(stageNum % 6 == 0){
                                game.replaceScene(createBonusScene())
                            }else{
                                game.replaceScene(createStartScene())
                            }
                        }
                    }*/
				}
			}
			return scene;
		};
		game.replaceScene(createSetUpScene()); // ゲームの_rootSceneをスタートシーンに置き換える

	}

	/* 画面外をクリックしても操作できるようにする処理 */
	game.onenterframe = function() {

		if (game.time % 10 == 0 && worldFlg) {
			window.focus();
		}

	}
	if(debugFlg){
		game.debug();	//	ゲームをデバッグモードで実行させる。
	}else{
		game.start(); // ゲームをスタートさせます
	}
}
window.onresize = function(){
    let viewGame = document.getElementById('enchant-stage');
    //viewGame.style.display = "block";
	if (navigator.userAgent.match(/iPhone|iPad|Android/)) {
		if(window.innerWidth > viewGame.clientWidth){
			//scl = window.innerWidth / viewGame.clientWidth;
			//alert(scl)
			ScreenMargin = ((window.innerWidth-viewGame.clientWidth)/2);
			viewGame.style.position = "absolute";
			viewGame.style.left = ScreenMargin + "px";
			game._pageX = ScreenMargin;
			//viewGame.style.margin = "0px " + ScreenMargin + "px";
		}else{
			ScreenMargin = 120;
			viewGame.style.position = "absolute";
			viewGame.style.left = ScreenMargin + "px";
			game._pageX = ScreenMargin;
		}
	}else{
		ScreenMargin = 120;
		viewGame.style.position = "absolute";
		viewGame.style.left = ScreenMargin + "px";
		game._pageX = ScreenMargin;
	}
};