window.focus();
enchant();

const Cell = 4;
const Quarter = 16;
const PixelSize = Quarter * Cell;
const Stage_W = 20;
const Stage_H = 15;
const DebugFlg = false;

var key = "BTG_PlayData_Ver4";
var totalKey = "BTG_TotalData_Ver4";
var BGM;

var zanki = 5;
var gameMode = 0;
var score = 0;
var playerType = 0;
var playerLife = 0;

var stageNum = 0;
var totalStageNum = -1;
var stageData;
var stageRandom = -1;

var head = document.getElementsByTagName("head");

var game;
var now_scene;
var inputManager;
var stageScreen;
var ScreenMargin = 120;
var WorldFlg = false;
var complete = false;
var victory = false;
var defeat = false;
var resultFlg = false;
var titleFlg = false;
var retryFlg = false;
var BNum = 0; //現在のbgmの番号変数

var gameStatus = 0;

var ActiveFlg = false;

var destruction = 0; //ステージごとの撃破数

let searchId = 1;
const visited = Array.from({ length: Stage_H }, () => Array(Stage_W).fill(0));

const qy = new Array(Stage_H * Stage_W);
const qx = new Array(Stage_H * Stage_W);
const qParent = new Array(Stage_H * Stage_W);
const qMove = new Array(Stage_H * Stage_W);

var tankEntity = []; //敵味方の戦車情報を保持する配列
var deadFlgs = [];
var bulStack = []; //弾の状態を判定する配列
var bullets = []; //戦車の弾情報を保持する配列
var boms = []; //爆弾の情報を保持する配列
var avoids = [];
var walls = [];
var holes = [];
var blocks = [];
var deadTank = [false];
var colors = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; //戦車の色を数える配列
var tankColorCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; //配色ごとの敵戦車残数格納配列
var colorsName = [ //各戦車の表示名格納配列
	"Player", //0
	"Brown", //1
	"Gray", //2
	"Green", //3
	"Red", //4
	"EliteGray ", //5
	"EliteGreen", //6
	"Snow", //7
	"EliteRed", //8
	"Pink", //9
	"Sand", //10
	"Black", //11
	"Dazzle", //12
	"Abysal" //13
]
let fontColor = [ //各戦車の表示色格納配列
	'blue',
	'saddlebrown',
	'lightslategray',
	'lime',
	'red',
	'darkslategray',
	'green',
	'lightcyan',
	'crimson',
	'pink',
	'coral',
	'black',
	'maroon',
	'darkblue'
];
let changePermitNum = [
	0,	//0
	0,	//1
	2,	//2
	4,	//3
	7,	//4
	9,	//5
	14,	//6
	15,	//7
	39,	//8
	30,	//9
	59,	//10
	99,	//11
	99,	//12
	99	//13
];

var BGMs = [ //bgm指定用配列
	'./sound/FIRST.mp3', //brown
	'./sound/SECOND.mp3', //gray
	'./sound/THIRD.mp3', //green
	'./sound/FOURTH.mp3', //red
	'./sound/SEVENTH.mp3', //elitegray
	'./sound/TENTH.mp3', //elitegreen
	'./sound/SIXTH.mp3', //snow
	'./sound/FIVE.mp3', //elitered
	'./sound/NINTH.mp3', //pink
	'./sound/EIGHTH.mp3', //sand
	'./sound/TENTH.mp3', //black
	'./sound/ELEVENTH.mp3', //dazzle
	'./sound/ELEVENTH.mp3' //abysal
];

let collisionUpdates = [];

function scheduleCollisionUpdate(x, y, value) {
    collisionUpdates.push({ x, y, value });
}

//---ステータス----------------------------------------------------------------------------
const Categorys = {
	Image: [
		{ tank: './image/ObjectImage/tank2.png', cannon: './image/ObjectImage/cannon.png' }, //player
		{ tank: './image/ObjectImage/brown.png', cannon: './image/ObjectImage/browncannon.png' }, //brown
		{ tank: './image/ObjectImage/gray.png', cannon: './image/ObjectImage/graycannon.png' }, //gray
		{ tank: './image/ObjectImage/green.png', cannon: './image/ObjectImage/greencannon.png' }, //green
		{ tank: './image/ObjectImage/red.png', cannon: './image/ObjectImage/redcannon.png' }, //red
		{ tank: './image/ObjectImage/elite.png', cannon: './image/ObjectImage/elitecannon.png' }, //elitegray
		{ tank: './image/ObjectImage/elitegreen.png', cannon: './image/ObjectImage/elitegreencannon.png' }, //elitegreen
		{ tank: './image/ObjectImage/snow.png', cannon: './image/ObjectImage/snowcannon.png' }, //snow
		{ tank: './image/ObjectImage/elitered.png', cannon: './image/ObjectImage/eliteredcannon.png' }, //elitered
		{ tank: './image/ObjectImage/pink.png', cannon: './image/ObjectImage/pinkcannon.png' }, //pink
		{ tank: './image/ObjectImage/sand.png', cannon: './image/ObjectImage/sandcannon.png' }, //sand
		{ tank: './image/ObjectImage/abnormal.png', cannon: './image/ObjectImage/abnormalcannon.png' }, //black
		{ tank: './image/ObjectImage/meisai.png', cannon: './image/ObjectImage/meisaicannon.png' }, //dazzle
		{ tank: './image/ObjectImage/Abyssal.png', cannon: './image/ObjectImage/AbyssalCannon.png' } //abysal
	],
	BodyScale: [
		[1.0, 1.0], //Player
		[1.0, 1.0], //brown
		[1.0, 1.0], //gray
		[1.0, 1.0], //green
		[1.0, 1.0], //red
		[1.0, 1.0], //elitegray
		[1.0, 1.0], //elitegreen
		[1.0, 1.0], //snow
		[1.0, 1.0], //elitered
		[1.0, 1.0], //pink
		[1.0, 1.0], //sand
		[1.0, 1.0], //random
		[1.1, 1.1], //dazzle
		[1.1, 1.1] //abysal
	],
	CannonScale: [
		[1.0, 1.0], //Player
		[1.0, 1.0], //brown
		[1.0, 1.0], //gray
		[1.0, 1.0], //green
		[1.0, 1.0], //red
		[1.0, 1.0], //elitegray
		[1.0, 1.0], //elitegreen
		[1.0, 1.0], //snow
		[1.0, 1.0], //elitered
		[1.0, 1.0], //pink
		[1.0, 1.0], //sand
		[1.0, 1.0], //random
		[1.1, 1.1], //dazzle
		[1.3, 1.1] //abysal
	],
	WeakScale: [
		[0.6, 0.6], //Player
		[1.0, 1.0], //brown
		[1.0, 1.0], //gray
		[1.0, 1.0], //green
		[1.0, 1.0], //red
		[1.0, 1.0], //elitegray
		[1.0, 1.0], //elitegreen
		[1.0, 1.0], //snow
		[1.0, 1.0], //elitered
		[1.0, 1.0], //pink
		[1.0, 1.0], //sand
		[1.0, 1.0], //random
		[0.8, 0.8], //dazzle
		[0.8, 0.8] //abysal
	],
	AroundScale: [
		[1.0, 1.0], //Player
		[1.0, 1.0], //brown
		[1.0, 1.0], //gray
		[1.0, 1.0], //green
		[1.0, 1.0], //red
		[1.5, 1.5], //elitegray
		[1.0, 1.0], //elitegreen
		[1.0, 1.0], //snow
		[1.5, 1.5], //elitered
		[1.0, 1.0], //pink
		[1.0, 1.0], //sand
		[1.6, 1.6], //random
		[1.5, 1.5], //dazzle
		[1.6, 1.6] //abysal
	],
	Life: [
		50, //Player
		10, //brown
		10, //gray
		15, //green
		20, //red
		28, //elitegray
		10, //elitegreen
		23, //snow
		18, //elitered
		42, //pink
		30, //sand
		20, //random
		50, //dazzle
		60 //abysal
	],
	MaxBullet: [
		5, //Player
		1, //brown
		2, //gray
		1, //green
		5, //red
		4, //elitegray
		3, //elitegreen
		2, //snow
		3, //elitered
		6, //pink
		3, //sand
		1, //random
		5, //dazzle
		4 //abysal
	],
	MaxRef: [
		1, //Player
		1, //brown
		1, //gray
		0, //green
		0, //red
		1, //elitegray
		2, //elitegreen
		1, //snow
		1, //elitered
		0, //pink
		0, //sand
		0, //random
		1, //dazzle
		0 //abysal
	],
	ShotSpeed: [
		10, //Player
		8, //brown
		8, //gray
		16, //green
		10, //red
		12, //elitegray
		18, //elitegreen
		14, //snow
		10, //elitered
		11, //pink
		12, //sand
		28, //random
		13, //dazzle
		13 //abysal
	],
	FireLate: [
		9, //Player
		30, //brown
		40, //gray
		25, //green
		20, //red
		40, //elitegray
		10, //elitegreen
		30, //snow
		16, //elitered
		6, //pink
		36, //sand
		10, //random
		30, //dazzle
		24 //abysal
	],
	MaxBom: [
		2, //Player
		0, //brown
		0, //gray
		0, //green
		0, //red
		0, //elitegray
		0, //elitegreen
		0, //snow
		1, //elitered
		0, //pink
		1, //sand
		0, //random
		0, //dazzle
		0 //abysal
	],
	MoveSpeed: [
		2.4, //Player
		0.0, //brown
		1.0, //gray
		1.2, //green
		2.0, //red
		1.6, //elitegray
		0.0, //elitegreen
		1.2, //snow
		1.7, //elitered
		0.0, //pink
		2.6, //sand
		2.5, //random
		2.0, //dazzle
		3.0 //abysal
	],
	BodyRotSpeed: [
		15, //Player
		5, //brown
		10, //gray
		10, //green
		15, //red
		15, //elitegray
		5, //elitegreen
		10, //snow
		8, //elitered
		10, //pink
		15, //sand
		15, //random
		10, //dazzle
		8 //abysal
	],
	CannonRotSpeed: [
		15, //Player
		1.5, //brown
		3, //gray
		5, //green
		15, //red
		8, //elitegray
		1.2, //elitegreen
		5, //snow
		8, //elitered
		5, //pink
		10, //sand
		1.2, //random
		10, //dazzle
		15 //abysal
	],
	Reload: [
		10, //Player
		12, //brown
		120, //gray
		120, //green
		240, //red
		180, //elitegray
		90, //elitegreen
		360, //snow
		360, //elitered
		180, //pink
		90, //sand
		90, //random
		210, //dazzle
		180 //abysal
	],
	Critical: [
		5, //Player
		8, //brown
		10, //gray
		12, //green
		10, //red
		10, //elitegray
		10, //elitegreen
		8, //snow
		10, //elitered
		6, //pink
		10, //sand
		12, //random
		8, //dazzle
		10 //abysal
	],
	DefenceFlg: [
		[true, true, true], //Player
		[false, false, false], //brown
		[true, true, false], //gray
		[true, true, true], //green
		[true, false, true], //red
		[true, true, true], //elitegray
		[false, false, false], //elitegreen
		[true, true, true], //snow
		[true, true, true], //elitered
		[false, false, false], //pink
		[true, false, false], //sand
		[true, false, true], //random
		[true, true, true], //dazzle
		[true, true, true] //abysal
	],
	DefenceRange: [
		[400, 300, 400], //Player
		[0, 0, 0], //brown
		[300, 200, 200], //gray
		[400, 200, 150], //green
		[260, 0, 300], //red
		[360, 250, 200], //elitegray
		[0, 0, 0], //elitegreen
		[300, 200, 200], //snow
		[320, 280, 200], //elitered
		[0, 0, 0], //pink
		[250, 0, 0], //sand
		[500, 0, 300], //random
		[250, 300, 200], //dazzle
		[300, 300, 300] //abysal
	],
	EscapeRange: [
		[true, 400, 300, 400], //Player
		[false, 0, 0, 0], //brown
		[true, 200, 0, 0], //gray
		[true, 300, 180, 120], //green
		[true, 200, 0, 0], //red
		[true, 320, 230, 180], //elitegray
		[false, 0, 0, 0], //elitegreen
		[true, 200, 200, 180], //snow
		[true, 280, 240, 180], //elitered
		[false, 0, 0, 0], //pink
		[true, 280, 0, 0], //sand
		[true, 400, 0, 280], //random
		[true, 240, 200, 160], //dazzle
		[true, 280, 200, 160] //abysal
	],
	Distances: [
		196, //Player
		0, //brown
		0, //gray
		300, //green
		0, //red
		200, //elitegray
		0, //elitegreen
		300, //snow
		250, //elitered
		0, //pink
		150, //sand
		280, //random
		250, //dazzle
		224 //abysal
	]
};

//----------------------------------------------------------------------------------------

const stagePath = [
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
	'./stage/stage39.js'
];

class Vector2 {
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}
	get Length() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	get LengthSquared() {
		return this.x * this.x + this.y * this.y;
	}
	Set(x, y) {
		this.x = x;
		this.y = y;
		return this;
	}
	Clone() {
		return new Vector2(this.x, this.y);
	}
	Copy(v) {
		this.x = v.x;
		this.y = v.y;
		return this;
	}
	Add(v) {
		this.x = this.x + v.x;
		this.y = this.y + v.y;
		return this;
	}
	Subtract(v) {
		this.x = this.x - v.x;
		this.y = this.y - v.y;
		return this;
	}
	Multiply(v) {
		this.x = this.x * v.x;
		this.y = this.y * v.y;
		return this;
	}
	Divide(v) {
		this.x = this.x / v.x;
		this.y = this.y / v.y;
		return this;
	}
	Negate() {
		this.x = -this.x;
		this.y = -this.y;
		return this;
	}
	Dot(v) {
		return this.x * v.x + this.y * v.y;
	}
	Cross(v) {
		return this.x * v.x - this.y * v.y;
	}
	Length() {
		let ls = this.x * this.x + this.y * this.y;
		return Math.sqrt(ls);
	}
	LengthSquared() {
		return this.x * this.x + this.y * this.y;
	}
	Distance(left, right) {
		let dx = left.x - right.x;
		let dy = left.y - right.y;
		let ls = dx * dx + dy * dy;
		return Math.sqrt(ls);
	}
	DistanceSquared(left, right) {
		let dx = left.x - right.x;
		let dy = left.y - right.y;
		return dx * dx + dy * dy;
	}
	Normal(p1, p2) {
		const dx = p2.x - p1.x;
		const dy = p2.y - p1.y;
		return new Vector2(-dy, dx); // 90度回転（時計回り）
	}
	Normalize() {
		const length = Math.sqrt(this.x * this.x + this.y * this.y);
		if (length > 0) {
			return new Vector2(this.x / length, this.y / length);
		}
		return new Vector2(0, 0);
	}
	Reflect(vector, normal) {
		let dot = vector.x * normal.x + vector.y * normal.y;
		return new Vector2(vector.x - 2.0 * dot * normal.x, vector.y - 2.0 * dot * normal.y);
	}
	Equals(other) {
		return other instanceof Vector2 && this.x === other.x && this.y === other.y;
	}
	static Add(left, right) {
		return left + right;
	}
	static Subtract(left, right) {
		return left - right;
	}
	static Multiply(left, right) {
		return left * right;
	}
	static Divide(left, right) {
		return left / right;
	}
	static Negate(value) {
		return -value;
	}
	static Dot(left, right) {
		return left.x * right.x + left.y * right.y;
	}
	static Cross(left, right) {
		return left.x * right.x - left.y * right.y;
	}
	static Distance(left, right) {
		let difference = left - right;
		let ls = Vector2.Dot(difference, difference);
		return Math.sqrt(ls);
	}
	static DistanceSquared(left, right) {
		let difference = left - right;
		return Vector2.Dot(difference, difference);
	}
}

function delStageFile() {
	if (stageNum > 0) {
		for (let elem of head[0].childNodes) {
			if (elem.id == 'stage_' + (stageNum - 1)) {
				elem.remove();
			};
		};
	};
};

function Get_Center(obj) {
	var pos = { x: obj.x + (obj.width / 2), y: obj.y + (obj.height / 2) };
	return pos;
};

function Get_Distance(from, to) {
	let vector = Pos_to_Vec(from, to);
	let magnitude = Get_Magnitude(vector);
	return magnitude;
};

function Get_Magnitude(vector) {
	return Math.sqrt(vector.x ** 2 + vector.y ** 2);
};

function Pos_to_Vec(from, to) {
	let v1 = Get_Center(from);
	let v2 = Get_Center(to);
	let vector = {
		x: v1.x - v2.x,
		y: v1.y - v2.y
	};
	return vector;
};

function Vec_Distance(from, to) {
	const dx = from.x - to.x;
    const dy = from.y - to.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function Vec_to_Rad(vector) {
	let rad = Math.atan2(vector.y, vector.x);
	return rad;
}

function Rot_to_Rad(rot) {
	if (Math.abs(rot) >= 360) {
		rot = rot % 360;
	}
	if (rot < 0) {
		rot = 360 + rot;
	}
	var rad = rot * (Math.PI / 180);
	return rad;
};

function Rad_to_Rot(rad) {
	var rot = ((Math.atan2(Math.cos(rad), Math.sin(rad)) * 180) / Math.PI) * -1;
	if (Math.abs(rot) >= 360) {
		rot = rot % 360;
	}
	if (rot < 0) {
		rot = 360 + rot;
	}
	return rot;
};

function Rot_to_Vec(rot, add) {
	let newRot = (rot + add);
	if (Math.abs(newRot) >= 360) {
		newRot = newRot % 360;
	}
	if (newRot < 0) {
		newRot = 360 + newRot;
	}
	let rad = newRot * (Math.PI / 180.0);
	let vector = {
		x: Math.cos(rad) * 1,
		y: Math.sin(rad) * 1
	};
	return vector;
};

function Rad_to_Tan(rad) {
    return Math.tan(rad);
}

function Vec_to_Rot(from, to) {
    let rad = Vec_to_Rad({ x: from.x - to.x, y: from.y - to.y });
    let rot = Rad_to_Rot(rad);

    if (Math.abs(rot) >= 360) rot = rot % 360;
    if (rot < 0) rot = 360 + rot;

    return rot;
}

function Set_Arg(from, to, rad, range) {
    let v1 = Get_Center(from);
    let v2 = { x: (from.width - to.width) / 2, y: (from.height - to.height) / 2 };
    let pos = { x: v1.x + Math.cos(rad) * range - v2.x, y: v1.y + Math.sin(rad) * range - v2.y };
    return pos;
}


// 🔧 角度関連の補助関数
function normalizeRotation(angle) {
	return (angle % 360 + 360) % 360;
}

function normalizeAngle(diff) {
	//return Math.abs(diff) >= 180 ? -diff : diff;
	diff = (diff + 540) % 360 - 180;
	return diff;
}

function Escape_Rot4(from, to, value) {
    const t1 = Get_Center(from);
    const t2 = Get_Center(to);

    // 初期候補方向の決定
    const arrMap = {
        'left-up': [1, 2],
        'left-down': [0, 1],
        'right-up': [2, 3],
        'right-down': [0, 3]
    };
    const key = t1.x > t2.x
        ? (t1.y > t2.y ? 'left-up' : 'left-down')
        : (t1.y > t2.y ? 'right-up' : 'right-down');
    let arr = arrMap[key].slice();

    // 回転角から相対方向を計算
    const v = Rot_to_Vec(to.rotation, -90);
    v.x = v.x * 96 + t2.x;
    v.y = v.y * 96 + t2.y;

    const dx = t1.x - v.x;
    const dy = t1.y - v.y;
    let angle = (Math.atan2(-dy, -dx) * 180 / Math.PI + 360) % 360;

    // ランダム初期化
    if (from.time % 60 === 0) {
        value = Math.floor(Math.random() * 4);
    }

    // 除外方向の計算
    const angleRemovals = [
        { range: [0, 23], remove: 0 },
        { range: [24, 46], remove: 0 },
        { range: [47, 68], remove: 1 },
        { range: [69, 90], remove: 1 },
        { range: [91, 113], remove: 1 },
        { range: [114, 136], remove: 2 },
        { range: [137, 158], remove: 2 },
        { range: [159, 180], remove: 2 },
        { range: [181, 203], remove: 2 },
        { range: [204, 226], remove: 3 },
        { range: [227, 248], remove: 3 },
        { range: [249, 270], remove: 3 },
        { range: [271, 293], remove: 3 },
        { range: [294, 316], remove: 3 },
        { range: [317, 338], remove: 0 },
        { range: [339, 360], remove: 0 }
    ];

    for (const { range, remove } of angleRemovals) {
        if (angle >= range[0] && angle <= range[1]) {
            arr = arr.filter(dir => dir !== remove);
            break;
        }
    }

    // 候補に value がなければランダム選択
    if (!arr.includes(value)) {
        value = arr[Math.floor(Math.random() * arr.length)];
    }

    return value;
}

function Escape_Rot8(from, to, value) {
    const t1 = Get_Center(from);
    const t2 = Get_Center(to);

    // 初期候補方向の決定
    const arrMap = {
        'left-up': [1, 2, 4, 5, 6],
        'left-down': [0, 1, 4, 5, 7],
        'right-up': [2, 3, 5, 6, 7],
        'right-down': [0, 3, 4, 6, 7]
    };
    const key = t1.x > t2.x
        ? (t1.y > t2.y ? 'left-up' : 'left-down')
        : (t1.y > t2.y ? 'right-up' : 'right-down');
    let arr = arrMap[key].slice();

    // 回転角から相対方向を計算
    const v = Rot_to_Vec(to.rotation, -90);
    v.x = v.x * 96 + t2.x;
    v.y = v.y * 96 + t2.y;

    const dx = t1.x - v.x;
    const dy = t1.y - v.y;
    let angle = (Math.atan2(-dy, -dx) * 180 / Math.PI + 360) % 360;

    // ランダム初期化
    if (from.time % 60 === 0) {
        value = Math.floor(Math.random() * 4);
    }

    // 除外方向の計算
    const angleRemovals = [
        { range: [0, 23], remove: [0, 4, 2] },
        { range: [24, 46], remove: [0, 4, 6] },
        { range: [47, 68], remove: [1, 4, 6] },
        { range: [69, 90], remove: [1, 4, 3] },
        { range: [91, 113], remove: [1, 5, 3] },
        { range: [114, 136], remove: [1, 5, 7] },
        { range: [137, 158], remove: [2, 5, 7] },
        { range: [159, 180], remove: [2, 5, 0] },
        { range: [181, 203], remove: [2, 6, 0] },
        { range: [204, 226], remove: [2, 6, 4] },
        { range: [227, 248], remove: [3, 6, 4] },
        { range: [249, 270], remove: [3, 6, 1] },
        { range: [271, 293], remove: [3, 7, 1] },
        { range: [294, 316], remove: [3, 7, 5] },
        { range: [317, 338], remove: [0, 7, 5] },
        { range: [339, 360], remove: [0, 7, 2] }
    ];

    for (const { range, remove } of angleRemovals) {
        if (angle >= range[0] && angle <= range[1]) {
            const backup = arr.slice();
            arr = arr.filter(i => !remove.includes(i));
            if (arr.length === 0) arr = backup;
            break;
        }
    }

    // 候補に value がなければランダム選択
    if (!arr.includes(value)) {
        value = arr[Math.floor(Math.random() * arr.length)];
    }

    return value;
}

function Escape_Rot8_Elite(from, to, value) {
    const t1 = Get_Center(from);
    const t2 = Get_Center(to);

    // 8方向ベクトル
    const dirVec = [
		{x: 0,  y:-1}, // 0 上 (0°)
		{x: 1,  y: 0}, // 1 右 (90°)
		{x: 0,  y: 1}, // 2 下 (180°)
		{x:-1, y: 0}, // 3 左 (270°)
		{x: 1,  y:-1}, // 4 右上 (45°)
		{x: 1,  y: 1}, // 5 右下 (135°)
		{x:-1, y: 1}, // 6 左下 (225°)
		{x:-1, y:-1}  // 7 左上 (315°)
	];

	const dirAngleList = [
		0,   // 0 上
		90,  // 1 右
		180, // 2 下
		270, // 3 左
		45,  // 4 右上
		135, // 5 右下
		225, // 6 左下
		315  // 7 左上
	];

    // ★ 迎撃ロジックと同じ進行方向ベクトルを復元
    const bulletVec = Rot_to_Vec(to.rotation, -90);
    //const bulletRad = Math.atan2(bulletVec.y, bulletVec.x);

    // 弾の未来位置（速度48前提）
    const bulletFuture = {
        x: t2.x + bulletVec.x * 48,
        y: t2.y + bulletVec.y * 48
    };

    // ランダム初期化
    if (from.time % 60 === 0) {
        value = Math.floor(Math.random() * 8);
    }

    let bestDir = value;
    let bestScore = Infinity;

    for (let d = 0; d < 8; d++) {
        const vec = dirVec[d];

        // 仮位置
        const nx = t1.x + vec.x * 32;
        const ny = t1.y + vec.y * 32;

        let score = 0;

        // 1. 壁チェック（即アウト）
        const gy = Math.floor(ny / PixelSize);
        const gx = Math.floor(nx / PixelSize);
        if (now_scene.grid[gy]?.[gx] === 1) {
            score = Infinity;
            continue;
        }

        // 2. 弾の未来位置に近づく方向は危険
        const distFuture = Math.hypot(nx - bulletFuture.x, ny - bulletFuture.y);
        score += (200 - distFuture);

        // 3. 弾の進行方向と同じ方向は危険
        const dirAngle = dirAngleList[d];
        const bulletDeg = (Math.atan2(bulletVec.y, bulletVec.x) * 180 / Math.PI + 360) % 360;
        const diff = Math.abs(bulletDeg - dirAngle);
        score += (45 - Math.min(diff, 360 - diff));

        // 4. 弾との距離が縮まる方向は危険
        const distNow = Math.hypot(t1.x - t2.x, t1.y - t2.y);
        const distNext = Math.hypot(nx - t2.x, ny - t2.y);
        if (distNext < distNow) score += 50;

        // 5. 弾の軌道線に近い方向は危険
        const bulletLineDist = Math.abs(
            (nx - t2.x) * bulletVec.y -
            (ny - t2.y) * bulletVec.x
        );
        score += (100 - bulletLineDist);

        // 6. 現在の方向を少し優遇
        if (d === value) score -= 5;

        // 最小スコアを更新
        if (score < bestScore) {
            bestScore = score;
            bestDir = d;
        }
    }

    return bestDir;
}

function Escape_Rot8_Multi(from, toList, value) {
    const t1 = Get_Center(from);
    const dangerScores = Array(8).fill(0);

    const directionVectors = [
        { dir: 0, x: 0, y: -1 },   // 上
        { dir: 1, x: 1, y: 0 },    // 右
        { dir: 2, x: 0, y: 1 },    // 下
        { dir: 3, x: -1, y: 0 },   // 左
        { dir: 4, x: 1, y: -1 },   // 右上
        { dir: 5, x: 1, y: 1 },    // 右下
        { dir: 6, x: -1, y: 1 },   // 左下
        { dir: 7, x: -1, y: -1 }   // 左上
    ];

    for (const to of toList) {
        const t2 = Get_Center(to);

        // 弾の進行方向ベクトル
        const rotRad = to.rotation * Math.PI / 180;
        const vx = Math.cos(rotRad);
        const vy = Math.sin(rotRad);

        // プレイヤーとの相対ベクトル
        const dx = t1.x - t2.x;
        const dy = t1.y - t2.y;
        const len = Math.hypot(dx, dy);
        const ux = dx / len;
        const uy = dy / len;

        // 弾の進行方向とプレイヤー位置の一致度
        const dot = vx * ux + vy * uy;
        if (dot > 0.7) {
            const angle = (Math.atan2(-vy, -vx) * 180 / Math.PI + 360) % 360;
            const dir = Math.round(angle / 45) % 8;
            dangerScores[dir] += 100;
        }

        // 弾の進行方向に対して各方向の角度を評価
        for (const vec of directionVectors) {
            const len2 = Math.hypot(vec.x, vec.y);
            const dot2 = (vx * vec.x + vy * vec.y) / len2;
            const cross = (vx * vec.y - vy * vec.x) / len2;
            const angle = Math.atan2(cross, dot2) * 180 / Math.PI;
            const absAngle = (angle + 360) % 360;

			if ((absAngle >= 24 && absAngle <= 68) || (absAngle >= 294 && absAngle <= 338)) {
				dangerScores[vec.dir] += 5; // 優遇
			} else if ((absAngle >= 114 && absAngle <= 158) || (absAngle >= 204 && absAngle <= 248)) {
				dangerScores[vec.dir] -= 5; // 優遇
			} else if ((absAngle >= 69 && absAngle <= 113) || (absAngle >= 249 && absAngle <= 293)) {
                dangerScores[vec.dir] -= 15; // 優遇
            } else {
                dangerScores[vec.dir] += 10;  // やや危険
            }
        }

        // 角度ベースの除外方向（従来ロジック）
        const v = Rot_to_Vec(to.rotation, -90);
        v.x = v.x * 96 + t2.x;
        v.y = v.y * 96 + t2.y;

        const dx2 = t1.x - v.x;
        const dy2 = t1.y - v.y;
        const angle2 = (Math.atan2(-dy2, -dx2) * 180 / Math.PI + 360) % 360;

        const angleRemovals = [
            { range: [0, 23], remove: [0, 4] },
            { range: [24, 46], remove: [0, 4] },
            { range: [47, 68], remove: [1, 4] },
            { range: [69, 90], remove: [1, 4] },
            { range: [91, 113], remove: [1, 5] },
            { range: [114, 136], remove: [1, 5] },
            { range: [137, 158], remove: [2, 5] },
            { range: [159, 180], remove: [2, 5] },
            { range: [181, 203], remove: [2, 6] },
            { range: [204, 226], remove: [2, 6] },
            { range: [227, 248], remove: [3, 6] },
            { range: [249, 270], remove: [3, 6] },
            { range: [271, 293], remove: [3, 7] },
            { range: [294, 316], remove: [3, 7] },
            { range: [317, 338], remove: [0, 7] },
            { range: [339, 360], remove: [0, 7] }
        ];

        for (const { range, remove } of angleRemovals) {
            if (angle2 >= range[0] && angle2 <= range[1]) {
                remove.forEach(dir => dangerScores[dir] += 15);
                break;
            }
        }
    }

    // 障害物による除外方向
    const obstacleSet = new Set();
    if (from.category === 11) {
        const grid = JSON.parse(JSON.stringify(now_scene.grid));
        const rad = (from.rotation - 90) * Math.PI / 180;
        const tx = t1.x - Math.cos(rad) * from.width;
        const ty = t1.y - Math.sin(rad) * from.height;
        const y = Math.floor(ty / PixelSize);
        const x = Math.floor(tx / PixelSize);

        const obstacleDirs = [
            [y - 1, x, 0], [y, x + 1, 1], [y + 1, x, 2], [y, x - 1, 3],
            [y - 1, x + 1, 4], [y + 1, x + 1, 5], [y + 1, x - 1, 6], [y - 1, x - 1, 7]
        ];

        obstacleDirs.forEach(([yy, xx, dir]) => {
            if (grid[yy]?.[xx] === 1) {
                obstacleSet.add(dir);
                dangerScores[dir] += 1000;
            }
        });
    }

    // 候補方向の中で最も危険度が低い方向を選択
    const candidates = [...Array(8).keys()].filter(i => !obstacleSet.has(i));
    if (candidates.length === 0) return value;

    const sorted = candidates
        .map(dir => ({ dir, score: dangerScores[dir] }))
        .sort((a, b) => a.score - b.score);

    const top3 = sorted.slice(0, 2).map(item => item.dir);

	// 現在の回避方向が候補に含まれていれば優先
    if (top3.includes(value)) return value;

    // 含まれていなければランダム選択
    return top3[Math.floor(Math.random() * top3.length)];
}

function getOrientation(screen, window) {
	// 新しいAPIが利用可能な場合は、screen.orientationを使用
	if (screen && screen.orientation && screen.orientation.type) {
		return screen.orientation.type;
	}
	// 古いAPIを使う必要がある場合はwindow.orientationを使用
	if ("orientation" in window) {
		return Math.abs(window.orientation) === 90 ? "landscape" : "portrait";
	}
	// どちらも利用できない場合は、デフォルトを'portrait'とする
	return "portrait";
}

function noscroll(e) {
	e.preventDefault();
}

const ViewConfig = {
	'Title': {
		Head: {
			position: {
				x: PixelSize * 2,
				y: PixelSize * 1
			},
			size: {
				width: PixelSize * 16,
				height: PixelSize * 13
			},
			color: '#a00'
		},
		Body: {
			position: {
				x: PixelSize * 2 + Quarter,
				y: PixelSize * 3
			},
			size: {
				width: PixelSize * 15.5,
				height: PixelSize * 10
			},
			color: '#eea'
		}
	},
	'TankList': {
		Head: {
			position: {
				x: PixelSize * 0.5,
				y: PixelSize * 0.5
			},
			size: {
				width: PixelSize * 19,
				height: PixelSize * 14
			},
			color: '#a00'
		},
		Body: {
			position: {
				x: PixelSize * 0.5,
				y: PixelSize * 3
			},
			size: {
				width: PixelSize * 19,
				height: PixelSize * 9.5
			},
			color: '#eea'
		}
	},
	'Start': {
		Head: {
			position: {
				x: PixelSize * 2,
				y: PixelSize * 3
			},
			size: {
				width: PixelSize * 16,
				height: PixelSize * 9
			},
			color: '#a00'
		},
		Body: {
			position: {
				x: PixelSize * 2,
				y: PixelSize * 3
			},
			size: {
				width: PixelSize * 16,
				height: PixelSize * 9
			},
			color: '#eea'
		}
	},
	'Bonus': {
		Head: {
			position: {
				x: PixelSize * 2,
				y: PixelSize * 3
			},
			size: {
				width: PixelSize * 16,
				height: PixelSize * 9
			},
			color: '#a00'
		},
		Body: {
			position: {
				x: PixelSize * 2,
				y: PixelSize * 3
			},
			size: {
				width: PixelSize * 16,
				height: PixelSize * 9
			},
			color: '#eea'
		}
	},
	'Result': {
		Head: {
			position: {
				x: PixelSize * 1.5,
				y: PixelSize * 0.5
			},
			size: {
				width: PixelSize * 17,
				height: PixelSize * 2.5
			},
			color: '#a00'
		},
		Body: {
			position: {
				x: PixelSize * 1.5,
				y: PixelSize * 3
			},
			size: {
				width: PixelSize * 17,
				height: PixelSize * 12
			},
			color: '#eea'
		}
	},
	'Pause': {
		Head: {
			position: {
				x: PixelSize * 0,
				y: PixelSize * 0
			},
			size: {
				width: PixelSize * 0,
				height: PixelSize * 0
			},
			color: '#000'
		},
		Body: {
			position: {
				x: PixelSize * 0,
				y: PixelSize * 9
			},
			size: {
				width: PixelSize * 20,
				height: PixelSize * 8
			},
			color: '#00000000'
		}
	}
}


//設定用
const Config = {
	//画面の解像度
	Screen: {
		Width: PixelSize * Stage_W, //幅
		Height: PixelSize * Stage_H, //高さ
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
 * バーチャルパッド（最適化版）
 ******************************************************/
class Vpad {
    constructor(input) {
        this.input = input;
        this.resizePad();

        // リサイズイベント
        const evt = navigator.userAgent.match(/iPhone/) ? "orientationchange" : "resize";
        window.addEventListener(evt, () => this.resizePad(), { passive: true });
    }

    //画面サイズが変わるたびにvpadも作り変える
    resizePad() {

        let styleDisplay = "block";

        // pad が既にある場合は中身だけクリア（DOM 再生成しない）
        if (this.pad) {
            styleDisplay = this.pad.style.display;
            this.pad.innerHTML = "";
        } else {
            this.pad = document.createElement('div');
            document.body.appendChild(this.pad);
        }

        const pad = this.pad;
        pad.id = "pad";
        pad.style.width = PixelSize * Stage_W / 2;
        pad.style.display = styleDisplay;

        //タッチで拡大とか起こるのを防ぐ
        pad.addEventListener("touchstart", (e) => e.preventDefault(), { passive: false });
        pad.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false });

        //横長の場合位置変更
        if (navigator.userAgent.match(/iPhone/)) {
            let _orientation = getOrientation(screen, window);
            if (_orientation.includes("landscape")) {
                pad.style.width = `${window.innerWidth}px`;
                pad.style.position = "absolute";
                pad.style.backgroundColor = "transparent";
                pad.style.top = `${window.innerHeight - (Number(PixelSize * Stage_H / 2.65) * 0.5)}px`;
                document.addEventListener('touchmove', noscroll, { passive: false });
                document.addEventListener('wheel', noscroll, { passive: false });
            } else {
                document.removeEventListener('touchmove', noscroll);
                document.removeEventListener('wheel', noscroll);
            }
        } else {
            if (window.innerWidth > window.innerHeight) {
                pad.style.width = `${window.innerWidth}px`;
                pad.style.position = "absolute";
                pad.style.backgroundColor = "transparent";
                pad.style.bottom = "0px";
            }
        }

        const height = Number(PixelSize * Stage_H / 2.65) * 0.5;
        pad.style.height = `${height}px`;

        //方向キー作成
        new DirKey(this.pad, this.input, height);

        //Aボタン
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

        //Bボタン
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

        //STARTボタン
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

/******************************************************
 * 方向キー（最適化版）
 ******************************************************/
class DirKey {
    constructor(parent, input, padHeight) {
        this.isTouching = false;
        this.originX = 0;
        this.originY = 0;

        const div = document.createElement('div');
        parent.appendChild(div);
        div.className = "dir-key";
        div.style.width = div.style.height = `${padHeight * 0.8}px`;
        div.style.left = `${padHeight * 0.05}px`;
        div.style.top = `${padHeight * 0.05}px`;

        this.maxRadius = padHeight * 0.15;
        this.emptySpace = padHeight * 0.05;

        //十字キーの見た目
        ["up","left","right","down","mid"].forEach(cls=>{
            const d = document.createElement('div');
            d.className = "dir " + cls;
            div.appendChild(d);
            if(cls==="mid"){
                const circle = document.createElement('div');
                circle.className = "circle";
                d.appendChild(circle);
            }
        });

        // dirReset をインスタンスに保持（毎回生成しない）
        this.dirReset = () => {
            input.keys.Right = input.keys.Left = input.keys.Up = input.keys.Down = false;
        };

        //タッチ開始
        div.addEventListener("touchstart", (e) => {
            e.preventDefault();
            this.isTouching = true;
            this.originX = e.targetTouches[0].clientX;
            this.originY = e.targetTouches[0].clientY;
        }, { passive: false });

        //タッチ移動（軽量化版）
        div.addEventListener("touchmove", (e) => {
            e.preventDefault();
            if (!this.isTouching) return;

            this.dirReset();

            const posX = e.targetTouches[0].clientX;
            const posY = e.targetTouches[0].clientY;

            const dx = posX - this.originX;
            const dy = posY - this.originY;

            const absX = Math.abs(dx);
            const absY = Math.abs(dy);

            //遊び
            if (absX < this.emptySpace && absY < this.emptySpace) return;

            //最大半径を超えたら origin を更新
            if (absX * absX + absY * absY > this.maxRadius * this.maxRadius) {
                const len = Math.sqrt(absX * absX + absY * absY);
                this.originX = posX - dx / len * this.maxRadius;
                this.originY = posY - dy / len * this.maxRadius;
            }

            //左右優先
            if (absX > absY) {
                input.keys.Left  = dx < 0;
                input.keys.Right = dx > 0;

                if (absY * 2 > absX) {
                    input.keys.Up   = dy < 0;
                    input.keys.Down = dy > 0;
                }
            } else {
                input.keys.Up   = dy < 0;
                input.keys.Down = dy > 0;

                if (absX * 2 > absY) {
                    input.keys.Left  = dx < 0;
                    input.keys.Right = dx > 0;
                }
            }
        }, { passive: false });

        //タッチ終了
        div.addEventListener("touchend", () => {
            this.dirReset();
            this.isTouching = false;
        }, { passive: true });
    }
}

/******************************************************
 * アクションボタン（最適化版）
 ******************************************************/
class ActBtn {
    constructor(parent, input, key, name, style) {
        const div = document.createElement('div');
        div.className = "button";
        parent.appendChild(div);

        div.style.width = style.width;
        div.style.height = style.height;
        div.style.right = style.right;
        div.style.top = style.top;
        div.style.borderRadius = style.borderRadius;
        div.style.borderColor = style.borderColor;

        const p = document.createElement('p');
        p.innerHTML = name;
        p.style.color = style.color;
        div.appendChild(p);

        div.addEventListener("touchstart", (e) => {
            e.preventDefault();
            input.keys[key] = true;
        }, { passive: false });

        div.addEventListener("touchend", () => {
            input.keys[key] = false;
        }, { passive: true });
    }
}


/*(function() {

    const FIXED_FPS = 60;
    const FIXED_DT = 1000 / FIXED_FPS;
    const MAX_ACCUM = 200; // ★ ラグ耐性を強化

    enchant.Core.prototype.enableFixedLoop = function() {
        const core = this;

        // enchant.js の内部ループを完全停止
        core._requestNextFrame = function() {};

        let accumulator = 0;
        let lastTime = performance.now();

        // 前フレーム位置を保存（ロジック更新が走る時だけ）
        function storePrevPositions(scene) {
            for (let i = 0; i < scene.childNodes.length; i++) {
                const node = scene.childNodes[i];
                node._prevX = node.x;
                node._prevY = node.y;
            }
        }

        // DOM 版：位置が変わったノードだけ transform 更新
        function renderInterpolated(scene, alpha) {
            for (let i = 0; i < scene.childNodes.length; i++) {
                const node = scene.childNodes[i];
                if (!node._element || node._prevX === undefined) continue;

                const prevX = node._prevX;
                const prevY = node._prevY;

                // 位置が変わっていないなら transform 更新しない（超重要）
                if (prevX === node.x && prevY === node.y) continue;

                const drawX = prevX + (node.x - prevX) * alpha;
                const drawY = prevY + (node.y - prevY) * alpha;

                node._element.style.transform =
                    `translate3d(${drawX}px,${drawY}px,0)`;
            }
        }

        core._fixedTick = function() {
            const now = performance.now();
            const delta = now - lastTime;
            lastTime = now;

            accumulator += delta;
            if (accumulator > MAX_ACCUM) {
                accumulator = FIXED_DT; // ★ ラグ後の復帰が滑らかになる
            }

            const scene = core.currentScene;

            // ロジック更新が走る時だけ prev を保存
            if (scene && accumulator >= FIXED_DT) {
                storePrevPositions(scene);
            }

            // 固定ロジック更新
            while (accumulator >= FIXED_DT) {
                core._tick();
                accumulator -= FIXED_DT;
            }

            // 補間値
            const alpha = Math.min(Math.max(accumulator / FIXED_DT, 0), 1);

            // 補間描画（DOM 版）
            if (scene) {
                renderInterpolated(scene, alpha);
            }

            requestAnimationFrame(core._fixedTick);
        };

        requestAnimationFrame(core._fixedTick);
    };

})();*/
/*(function() {

    const FIXED_FPS = 60;
    const FIXED_DT = 1000 / FIXED_FPS;
    const MAX_ACCUM = 200; // ラグ耐性

    enchant.Core.prototype.enableFixedTick = function() {
        const core = this;

        // enchant.js の内部ループを止める
        core._requestNextFrame = function() {};

        let last = performance.now();
        let accumulator = 0;

        function loop() {
            const now = performance.now();
            let delta = now - last;
            last = now;

            accumulator += delta;

            // ★ ラグが溜まったら完全リセット（最重要）
            if (accumulator > MAX_ACCUM) {
                accumulator = 0;
            }

            // ★ 固定フレームで _tick() を回す
            while (accumulator >= FIXED_DT) {
                core._tick();      // ← enchant.js のロジック更新
                accumulator -= FIXED_DT;
            }

            // ★ 補間値（描画用）
            const alpha = accumulator / FIXED_DT;

            // ★ 補間描画（Canvas なら draw、DOM なら transform）
            if (core.currentScene && core.currentScene._interpolate) {
                core.currentScene._interpolate(alpha);
            }

            requestAnimationFrame(loop);
        }

        requestAnimationFrame(loop);
    };

})();*/


/*// ★ enchant.js 読み込み後、enchant() の後に置く
(function() {
    // Core の初期化をパッチして CanvasLayer を強制使用
    var _coreInit = enchant.Core.prototype.initialize;
    enchant.Core.prototype.initialize = function(width, height) {
        _coreInit.call(this, width, height);

        // DOM レイヤーを消して Canvas レイヤーを作る
        this._layers = {};
        this._layers[0] = new enchant.CanvasLayer();
        this._layers[0].initialize(this);

        // CanvasRenderer を使う
        this._layers[0].context = this._layers[0]._element.getContext('2d');
    };
})();
(function() {

    const FIXED_FPS = 60;
    const FIXED_DT = 1000 / FIXED_FPS;
    const MAX_ACCUM = 200;

    enchant.Core.prototype.enableFixedLoopCanvas = function() {
        const core = this;

        core._requestNextFrame = function() {};

        let accumulator = 0;
        let lastTime = performance.now();

        // 前フレーム位置を保存
        function storePrevPositions(scene) {
            scene.childNodes.forEach(node => {
                node._prevX = node.x;
                node._prevY = node.y;
            });
        }

        // Canvas 版：補間描画
        function renderInterpolated(scene, alpha) {
            const layer = core._layers[0]; // ★ CanvasRenderer
			const ctx = layer.context;
            ctx.clearRect(0, 0, core.width, core.height);

            scene.childNodes.forEach(node => {
                if (!node.image) return;

                const px = node._prevX ?? node.x;
                const py = node._prevY ?? node.y;

                const drawX = px + (node.x - px) * alpha;
                const drawY = py + (node.y - py) * alpha;

                ctx.drawImage(node.image._element, drawX, drawY);
            });
        }

        core._fixedTick = function() {
            const now = performance.now();
            const delta = now - lastTime;
            lastTime = now;

            accumulator += delta;
            if (accumulator > MAX_ACCUM) {
                accumulator = FIXED_DT;
            }

            const scene = core.currentScene;

            if (scene && accumulator >= FIXED_DT) {
                storePrevPositions(scene);
            }

            while (accumulator >= FIXED_DT) {
                core._tick();
                accumulator -= FIXED_DT;
            }

            const alpha = Math.min(Math.max(accumulator / FIXED_DT, 0), 1);

            if (scene) {
                renderInterpolated(scene, alpha);
            }

            requestAnimationFrame(core._fixedTick);
        };

        requestAnimationFrame(core._fixedTick);
    };

})();*/

(function() {

    const FIXED_FPS   = 60;
    const FIXED_DT    = 1000 / FIXED_FPS;
    const MAX_ACCUM   = 100;
    const MIN_RENDER_INTERVAL = 1000 / 40;

    enchant.Core.prototype.enableHybridFixedLoop = function(options) {
        const core = this;

        const opt = Object.assign({
            useCanvas: false,
            autoRenderSkip: true
        }, options || {});

        core._requestNextFrame = function() {};

        let lastTime   = performance.now();
        let accumulator = 0;

        let lastRenderTime = 0;
        let lastRenderCost = 0;
        let renderSkip = 0;

        // --- CSSStyleSheet（高速） ---
        const sheet = new CSSStyleSheet();
        document.adoptedStyleSheets.push(sheet);

        // --- prev 保存 ---
        function storePrevPositions(scene) {
            const children = scene.childNodes;
            for (let i = 0; i < children.length; i++) {
                const node = children[i];
                node._prevX = node.x;
                node._prevY = node.y;
                node._prevRotation = node.rotation;
                node._prevOriginX = node.originX ?? 0;
                node._prevOriginY = node.originY ?? 0;
            }
        }

        // --- DOM 補間描画（originX/Y 対応・スケールなし） ---
        function renderDOM(scene, alpha) {
            const children = scene.childNodes;
            let css = "";

            for (let i = 0; i < children.length; i++) {
                const node = children[i];
                const el = node._element;
                if (!el || node._prevX == null) continue;

                // --- 位置補間 ---
                const drawX = node._prevX + (node.x - node._prevX) * alpha;
                const drawY = node._prevY + (node.y - node._prevY) * alpha;

                // --- 回転補間 ---
                const drawRot = node._prevRotation + (node.rotation - node._prevRotation) * alpha;
                const rad = drawRot * Math.PI / 180;

                // --- origin 補間 ---
                const ox = node._prevOriginX + ((node.originX ?? 0) - node._prevOriginX) * alpha;
                const oy = node._prevOriginY + ((node.originY ?? 0) - node._prevOriginY) * alpha;

                // --- dirty check（微小変化は無視） ---
                if (Math.abs(drawX - node._lastDrawX) < 0.01 &&
                    Math.abs(drawY - node._lastDrawY) < 0.01 &&
                    Math.abs(drawRot - node._lastDrawRot) < 0.01 &&
                    Math.abs(ox - node._lastDrawOX) < 0.01 &&
                    Math.abs(oy - node._lastDrawOY) < 0.01) {
                    continue;
                }

                node._lastDrawX = drawX;
                node._lastDrawY = drawY;
                node._lastDrawRot = drawRot;
                node._lastDrawOX = ox;
                node._lastDrawOY = oy;

                if (!el.id) {
                    el.id = "_enchant_node_" + (renderDOM._idSeed = (renderDOM._idSeed || 0) + 1);
                }

                // --- 回転行列（scale=1） ---
                const cos = Math.cos(rad);
                const sin = Math.sin(rad);

                const a =  cos;
                const b =  sin;
                const c = -sin;
                const d =  cos;

                // --- pivot 補正 ---
                const tx = drawX + ox - (a * ox + c * oy);
                const ty = drawY + oy - (b * ox + d * oy);

                const m = `matrix3d(
                    ${a}, ${b}, 0, 0,
                    ${c}, ${d}, 0, 0,
                    0,   0,   1, 0,
                    ${tx}, ${ty}, 0, 1
                )`;

                css += `#${el.id}{transform:${m};}`;
            }

            sheet.replaceSync(css);
        }

        // --- Canvas 補間描画 ---
        function renderCanvas(scene, alpha) {
            if (typeof scene._interpolateDraw === 'function') {
                scene._interpolateDraw(alpha);
            } else if (typeof scene._draw === 'function') {
                scene._draw();
            }
        }

        function loop() {
            const now = performance.now();
            let delta = now - lastTime;
            lastTime = now;

            accumulator += delta;

            // ★ ラグ発生時は accumulator を即リセット
            if (accumulator > MAX_ACCUM) {
                accumulator = 0;
                renderSkip = 2; // ★ ラグ直後は描画スキップ
            }

            const scene = core.currentScene;

            // --- ロジック更新前に prev を保存 ---
            if (scene && accumulator >= FIXED_DT) {
                storePrevPositions(scene);
            }

            // --- 固定ロジック更新（★ 1フレームあたり最大2回） ---
            while (accumulator >= FIXED_DT) {
                core._tick();
                accumulator -= FIXED_DT;
            }

            let alpha = Math.min(Math.max(accumulator / FIXED_DT, 0), 1);

			// ★ enchant.js 全体で使えるラグフラグ
			core.isLagging = (accumulator > FIXED_DT * 2);

			if (core.isLagging) {
				alpha = 0; // 補間揺れ防止
			}

            // --- 描画スキップ（描画コストベース） ---
            let doRender = true;

            if (opt.autoRenderSkip) {
                if (lastRenderCost > MIN_RENDER_INTERVAL) {
                    if (renderSkip < 5) renderSkip++;
                } else {
                    if (renderSkip > 0) renderSkip--;
                }

                if (renderSkip > 0) {
                    doRender = false;
                    renderSkip--;
                }
            }

            if (scene && doRender) {
                const t0 = performance.now();

                if (opt.useCanvas) {
                    renderCanvas(scene, alpha);
                } else {
                    renderDOM(scene, alpha);
                }

                lastRenderCost = performance.now() - t0;
                lastRenderTime = now;
            }

            requestAnimationFrame(loop);
        }

        requestAnimationFrame(loop);
    };

    // --- will-change 最適化 ---
    const _initialize = enchant.Node.prototype._initialize;
    enchant.Node.prototype._initialize = function() {
        _initialize.call(this);
        if (this._element) {
            this._element.style.willChange = "transform";
        }
    };

	// --- 全 Node の enterframe を共通フック ---
	const _dispatchEvent = enchant.Node.prototype.dispatchEvent;
	enchant.Node.prototype.dispatchEvent = function(e) {

		// ★ enterframe のときだけラグ判定を挟む
		if (e.type === 'enterframe') {
			const core = enchant.Core.instance;

			// ★ ラグ中は enterframe をスキップ（共通化）
			if (core.isLagging) {
				return; // ← ここで止める
			}
		}

		return _dispatchEvent.call(this, e);
	};
})();

function decodeAllImages(core) {
    const promises = [];

    for (const key in core.assets) {
        const asset = core.assets[key];
        const img = asset._element || asset;

        if (!(img instanceof HTMLImageElement)) continue;

        const clone = new Image();
        clone.src = img.src;

        if (clone.decode) {
            promises.push(clone.decode().catch(() => {}));
        }
    }

    return Promise.all(promises);
}


window.onload = function() {
	game = new Core(Stage_W * PixelSize, Stage_H * PixelSize);
	game.fps = 60; //画面の更新頻度
	game.time = 0;
	game.preload(
		'./image/ObjectImage/tank2.png',
		'./image/ObjectImage/cannon.png',
		'./image/ObjectImage/brown.png',
		'./image/ObjectImage/browncannon.png',
		'./image/ObjectImage/gray.png',
		'./image/ObjectImage/graycannon.png',
		'./image/ObjectImage/green.png',
		'./image/ObjectImage/greencannon.png',
		'./image/ObjectImage/elitered.png',
		'./image/ObjectImage/eliteredcannon.png',
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
		'./image/ObjectImage/R2.png',
		'./image/ObjectImage/R3.png',
		'./image/ObjectImage/mark.png',
		'./image/ObjectImage/block.png',
		'./image/ObjectImage/block_top.png',
		'./image/MapImage/map0.png',
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
		'./sound/FIVE.mp3',
		'./sound/SIXTH.mp3',
		'./sound/SEVENTH.mp3',
		'./sound/EIGHTH.mp3',
		'./sound/NINTH.mp3',
		'./sound/TENTH.mp3',
		'./sound/ELEVENTH.mp3'
	);
	//game.enableFixedLoop();
	//game.enableFixedTick();
	//game.enableFixedLoopCanvas();
	game.enableHybridFixedLoop({
		useCanvas: false,
        autoRenderSkip: true
	});

	inputManager = new InputManager();

	let vh = (window.innerHeight / ((PixelSize * Stage_H)));
	if (window.innerWidth < game.width * vh) {
		vh = (window.innerWidth / ((PixelSize * Stage_W) + 128));
	}
	game.scale = vh;

	stageScreen = document.getElementById('enchant-stage');
	stageScreen.style.display = "block";

	ScreenMargin = ((window.innerWidth - stageScreen.clientWidth) / 2);
	stageScreen.style.position = "absolute";
	stageScreen.style.left = ScreenMargin + "px";
	game._pageX = ScreenMargin;

	var Wall = Class.create(PhyBoxSprite, {
		initialize: function(width, height, x, y, name, scene) {
			PhyBoxSprite.call(this, width * PixelSize, height * PixelSize, enchant.box2d.STATIC_SPRITE, 10, 0.0, 1.0, true);
			//this.backgroundColor = "#ddd4";
			this.x = x * PixelSize;
			this.y = y * PixelSize - Quarter;
			this.name = name;
			scene.addChild(this);
		}
	});

	var Block = Class.create(PhyBoxSprite, {
		initialize: function(x, y, scene) {
			PhyBoxSprite.call(this, PixelSize, PixelSize, enchant.box2d.STATIC_SPRITE, 10, 0.0, 1.0, true);
			//this.backgroundColor = "#ddd4";
			//this.image = game.assets['./image/ObjectImage/block.png'];
			this.name = 'block';
			this.x = x * PixelSize;
			this.y = y * PixelSize - Quarter;
			this.tilePath = { x: x, y: y };
			this.frontimage = new Block_Imgage(this);
			this.topimage = new Block_Imgage_Top(this, this.tilePath);
			this.obs = BlockObs(this);
			//this.ref = BlockRef(this);
			scene.addChild(this);
		},
		_Destroy: function() {
			scheduleCollisionUpdate(this.tilePath.x, this.tilePath.y, 0);
			now_scene.grid[this.tilePath.y][this.tilePath.x] = 0;

			this.obs.forEach(elem => now_scene.removeChild(elem));
			this.frontimage._Destroy();
			this.topimage._Destroy();

			new BlockDestroyEffect(this.tilePath.x, this.tilePath.y);
			this.destroy();
		}
	})

	var BlockFragment  = Class.create(Sprite, {
		initialize: function(x, y, size) {
			Sprite.call(this, size, size);
			this.x = x + ((Math.floor(Math.random() * 3) - 1) * 8) + 32;
			this.y = y + ((Math.floor(Math.random() * 3) - 1) * 8) + 32;
			this.vx = (Math.random() - 0.5) * 4; // 横方向速度
			this.vy = (Math.random() - 0.5) * 4 - 2; // 縦方向初速（重力上向き）

			this.rotationSpeed = (Math.random() - 0.5) * 20;

			this.image = new Surface(size, size);
			this.image.context.fillStyle = `rgba(${55 + Math.floor(Math.random() * 80) }, ${20 + Math.floor(Math.random() * 30) }, ${Math.floor(Math.random() * 20) }, ${(7 + Math.floor(Math.random() * 4)) / 10})`;
			this.image.context.fillRect(0, 0, size, size);

			this.life = 30; // 寿命フレーム数
			this.addEventListener("enterframe", function() {
				this.vy += 0.1; // 擬似重力
				this.x += this.vx;
				this.y += this.vy;
				this.rotation += this.rotationSpeed;
				this.opacity -= 1 / this.life;

				if (this.opacity <= 0) {
					this.parentNode.removeChild(this);
				}
			});
		}
	});

	var BlockDestroyEffect = Class.create(Group, {
		initialize: function(x, y) {
			Group.call(this);
			this.x = x * PixelSize;
			this.y = y * PixelSize - Quarter;

			for (let i = 0; i < 10; i++) {
				let frag = new BlockFragment(0, 0, (3 + Math.floor(Math.random() * 5)) * 4);
				this.addChild(frag);
			}

			// 全体の削除（保険）
			this.life = 30;
			this.addEventListener("enterframe", function() {
				if (--this.life <= 0) {
					if (this.parentNode) this.parentNode.removeChild(this);
				}
			});
			now_scene.SparkGroup.addChild(this);
		}
	});

	var Block_Imgage = Class.create(Sprite, {
		initialize: function(from) {
			Sprite.call(this, 64, 64);
			this.from = from;
			this.image = game.assets['./image/ObjectImage/block.png'];
			this.moveTo(this.from.x, this.from.y + 16);

			now_scene.addChild(this);
		},
		_Destroy: function() {
			now_scene.removeChild(this);
		}
	})

	var Block_Imgage_Top = Class.create(Sprite, {
		initialize: function(from, tilePath) {
			Sprite.call(this, 64, 64);
			this.from = from;
			this.image = game.assets['./image/ObjectImage/block_top.png'];
			this.moveTo(this.from.x, this.from.y - 16);

			now_scene.BlockGroup.addChild(this);
		},
		_Destroy: function() {
			now_scene.BlockGroup.removeChild(this);
		}
	})

	var Hole = Class.create(Sprite, {
		initialize: function(x, y, scene) {
			Sprite.call(this, (PixelSize), (PixelSize));
			//this.backgroundColor = "#0004";
			this.x = x * PixelSize;
			this.y = y * PixelSize - Quarter;
			this.image = createHoleSurface();

			scene.addChild(this);
		}
	});

	function createHoleSurface() {
		const size = 64;
		const surface = new Surface(size, size);
		const ctx = surface.context;

		ctx.clearRect(0, 0, size, size);

		// グラデーションで縁取り付きの楕円を描画
		const centerX = size / 2;
		const centerY = size / 2 + 8; // 少し下に寄せる
		const radiusX = 30;
		const radiusY = 24;

		// 楕円の縁取りグラデーション
		const grad = ctx.createRadialGradient(centerX, centerY + 15, 15, centerX, centerY, radiusX);
		grad.addColorStop(0, 'rgba(0, 0, 0, 1)');
		grad.addColorStop(0.6, 'rgba(0, 0, 0, 0.6)');
		grad.addColorStop(1, 'rgba(0, 0, 0, 0.4)');

		ctx.fillStyle = grad;
		ctx.beginPath();
		ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
		ctx.fill();

		return surface;
	}

	var Avoid = Class.create(Sprite, {
		initialize: function(x, y, scene) {
			Sprite.call(this, PixelSize / 2, PixelSize / 2);
			//this.backgroundColor = "#fdda";
			this.x = x * PixelSize + (4 * 4);
			this.y = y * PixelSize - (3 * 2);

			scene.addChild(this);
		}
	});

	var Obstracle = Class.create(Sprite, {
		initialize: function(name, scene) {
			switch (name) {
				case 'ObsTop':
				case 'ObsBottom':
					Sprite.call(this, 60, 4);
					break;
				case 'ObsRight':
				case 'ObsLeft':
					Sprite.call(this, 4, 60);
					break;
			}
			if(DebugFlg) this.debugColor= 'blue';
			this.name = name;
			scene.addChild(this);
		}
	});

	function SetObs(scene, grid) {
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

		for (let i = 0; i < g1.length; i++) {
			for (let j = 0; j < g1[i].length; j++) {
				if (g1[i][j] == 1 || g1[i][j] == 3 || g1[i][j] == 4) {
					if (wsp1 == null) {
						if (i > 0 && !(g1[i - 1][j] == 1 || g1[i - 1][j] == 3 || g1[i - 1][j] == 4)) {
							wsp1 = new Obstracle('ObsTop', scene);
							wsp1.moveTo(PixelSize * j + 2, PixelSize * i - 20);
							wcnt1++;
						}

					} else {
						if (i > 0 && !(g1[i - 1][j] == 1 || g1[i - 1][j] == 3 || g1[i - 1][j] == 4)) {
							wsp1.width = PixelSize * (wcnt1 + 1) - 4;
							wcnt1++;
						} else {
							wsp1 = null;
							wcnt1 = 0;
						}

					}
					if (wsp2 == null) {
						if (i < g1.length - 1 && !(g1[i + 1][j] == 1 || g1[i + 1][j] == 3 || g1[i + 1][j] == 4)) {
							wsp2 = new Obstracle('ObsBottom', scene);
							wsp2.moveTo(PixelSize * j + 2, PixelSize * i + 44);
							wcnt2++;
						}

					} else {
						if (i < g1.length - 1 && !(g1[i + 1][j] == 1 || g1[i + 1][j] == 3 || g1[i + 1][j] == 4)) {
							wsp2.width = PixelSize * (wcnt2 + 1) - 4;
							wcnt2++;
						} else {
							wsp2 = null;
							wcnt2 = 0;
						}

					}
				} else {
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
		for (let i = 0; i < g2.length; i++) {
			//console.log(g2[i]);
			for (let j = 0; j < g2[i].length; j++) {
				if (g2[i][j] == 1 || g2[i][j] == 3 || g2[i][j] == 4) {
					if (hsp1 == null) {
						if (i > 0 && !(g2[i - 1][j] == 1 || g2[i - 1][j] == 3 || g2[i - 1][j] == 4)) {
							hsp1 = new Obstracle('ObsLeft', scene);
							hsp1.moveTo(PixelSize * i - 2, PixelSize * j - 16);
							hcnt1++;
						}

					} else {
						if (i > 0 && !(g2[i - 1][j] == 1 || g2[i - 1][j] == 3 || g2[i - 1][j] == 4)) {
							hsp1.height = PixelSize * (hcnt1 + 1) - 4;
							hcnt1++;
						} else {
							hsp1 = null;
							hcnt1 = 0;
						}

					}
					if (hsp2 == null) {
						if (i < g2.length - 1 && !(g2[i + 1][j] == 1 || g2[i + 1][j] == 3 || g2[i + 1][j] == 4)) {
							hsp2 = new Obstracle('ObsRight', scene);
							hsp2.moveTo(PixelSize * i + 62, PixelSize * j - 16);
							hcnt2++;
						}

					} else {

						if (i < g2.length - 1 && !(g2[i + 1][j] == 1 || g2[i + 1][j] == 3 || g2[i + 1][j] == 4)) {
							hsp2.height = PixelSize * (hcnt2 + 1) - 4;
							hcnt2++;
						} else {
							hsp2 = null;
							hcnt2 = 0;
						}
					}
				} else {
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
	};

	function BlockObs(from) {
		var arr = [];

		arr.push(new Obstracle('ObsTop', now_scene));
		arr.push(new Obstracle('ObsBottom', now_scene));
		arr.push(new Obstracle('ObsLeft', now_scene));
		arr.push(new Obstracle('ObsRight', now_scene));

		arr[0].moveTo(from.x + 2, from.y - 4);
		arr[1].moveTo(from.x + 2, from.y + 60);
		arr[2].moveTo(from.x - 2, from.y);
		arr[3].moveTo(from.x + 62, from.y);

		return arr;
	}

	var RefObstracle = Class.create(Sprite, {
		initialize: function(name, scene) {
			switch (name) {
				case 'RefTop':
				case 'RefBottom':
					Sprite.call(this, 56, 8);
					break;
				case 'RefRight':
				case 'RefLeft':
					Sprite.call(this, 8, 56);
					break;
			}
			if(DebugFlg) this.debugColor = 'orange';
			this.name = name;
			scene.addChild(this);
		}
	});

	function SetRefs(scene, grid) {
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

		for (let i = 0; i < g1.length; i++) {
			for (let j = 0; j < g1[i].length; j++) {
				if (g1[i][j] == 1 || g1[i][j] == 4 || g1[i][j] == 5) {
					if (wsp1 == null) {
						if (i > 0 && !(g1[i - 1][j] == 1 || g1[i - 1][j] == 4 || g1[i - 1][j] == 5)) {
							wsp1 = new RefObstracle('RefTop', scene);
							wsp1.moveTo(PixelSize * j + 4, PixelSize * i - 16);
							//wsp1.backgroundColor = 'blue'
							wcnt1++;
						}

					} else {
						if (i > 0 && !(g1[i - 1][j] == 1 || g1[i - 1][j] == 4 || g1[i - 1][j] == 5)) {
							wsp1.width = PixelSize * (wcnt1 + 1) - 8;
							wcnt1++;
						} else {
							wsp1 = null;
							wcnt1 = 0;
						}

					}
					if (wsp2 == null) {
						if (i < g1.length - 1 && !(g1[i + 1][j] == 1 || g1[i + 1][j] == 4 || g1[i + 1][j] == 5)) {
							wsp2 = new RefObstracle('RefBottom', scene);
							wsp2.moveTo(PixelSize * j + 4, PixelSize * i + 40);
							//wsp2.backgroundColor = 'white'
							wcnt2++;
						}

					} else {
						if (i < g1.length - 1 && !(g1[i + 1][j] == 1 || g1[i + 1][j] == 4 || g1[i + 1][j] == 5)) {
							wsp2.width = PixelSize * (wcnt2 + 1) - 8;
							wcnt2++;
						} else {
							wsp2 = null;
							wcnt2 = 0;
						}

					}
				} else {
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
		for (let i = 0; i < g2.length; i++) {
			//console.log(g2[i]);
			for (let j = 0; j < g2[i].length; j++) {
				if (g2[i][j] == 1 || g2[i][j] == 4 || g2[i][j] == 5) {
					if (hsp1 == null) {
						if (i > 0 && !(g2[i - 1][j] == 1 || g2[i - 1][j] == 4 || g2[i - 1][j] == 5)) {
							hsp1 = new RefObstracle('RefLeft', scene);
							hsp1.moveTo(PixelSize * i, PixelSize * j - 12);
							//hsp1.backgroundColor = 'green'
							hcnt1++;
						}

					} else {
						if (i > 0 && !(g2[i - 1][j] == 1 || g2[i - 1][j] == 4 || g2[i - 1][j] == 5)) {
							hsp1.height = PixelSize * (hcnt1 + 1) - 8;
							hcnt1++;
						} else {
							hsp1 = null;
							hcnt1 = 0;
						}

					}
					if (hsp2 == null) {
						if (i < g2.length - 1 && !(g2[i + 1][j] == 1 || g2[i + 1][j] == 4 || g2[i + 1][j] == 5)) {
							hsp2 = new RefObstracle('RefRight', scene);
							hsp2.moveTo(PixelSize * i + 56, PixelSize * j - 12);
							//hsp2.backgroundColor = 'red'
							hcnt2++;
						}

					} else {

						if (i < g2.length - 1 && !(g2[i + 1][j] == 1 || g2[i + 1][j] == 4 || g2[i + 1][j] == 5)) {
							hsp2.height = PixelSize * (hcnt2 + 1) - 8;
							hcnt2++;
						} else {
							hsp2 = null;
							hcnt2 = 0;
						}
						//hcnt2++;
					}

				} else {
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
	};

	var TankObstracle = Class.create(Sprite, {
		initialize: function(from, num, name, scene) {
			switch (name) {
				case 'TankTop':
				case 'TankBottom':
					Sprite.call(this, PixelSize - 12, 2);
					break;
				case 'TankRight':
				case 'TankLeft':
					Sprite.call(this, 2, PixelSize - 12);
					break;
			}
			this.num = num;
			this.name = name;
			this.scaleX = 1.0;
			this.scaleY = 1.0;
			this.moveTo(0, 0);
			this.onenterframe = function() {
				if (WorldFlg) {
					if (deadFlgs[num]) scene.removeChild(this);
					switch (name) {
						case 'TankTop':
							if (from.rotation == 0) {
								this.x = from.x + 4;
								this.y = from.y - 1;
								if (this.scaleY != 2 && from.moveSpeed > 0) this.scaleY = 2;
								if(DebugFlg){
									if (this.debugColor != "yellow") this.debugColor = "yellow";
								}
								
							} else {
								this.x = from.x + 4;
								this.y = from.y;
								if (this.scaleY != 1 && from.moveSpeed > 0) this.scaleY = 1;
								if(DebugFlg){
									if (this.debugColor != "white") this.debugColor = "white";
								}
							}
							break;
						case 'TankBottom':
							if (from.tank.rotation == 180) {
								this.x = from.x + 4;
								this.y = from.y + 60;
								if (this.scaleY != 2 && from.moveSpeed > 0) this.scaleY = 2;
								if(DebugFlg){
									if (this.debugColor != "yellow") this.debugColor = "yellow";
								}
							} else {
								this.x = from.x + 4;
								this.y = from.y + 60 - 2;
								if (this.scaleY != 1 && from.moveSpeed > 0) this.scaleY = 1;
								if(DebugFlg){
									if (this.debugColor != "blue") this.debugColor = "blue";
								}
							}
							break;
						case 'TankRight':
							if (from.tank.rotation == 90) {
								this.x = from.x + 60;
								this.y = from.y + 4;
								if (this.scaleX != 2 && from.moveSpeed > 0) this.scaleX = 2;
								if(DebugFlg){
									if (this.debugColor != "yellow") this.debugColor = "yellow";
								}
							} else {
								this.x = from.x + 60 - 1;
								this.y = from.y + 4;
								if (this.scaleX != 1 && from.moveSpeed > 0) this.scaleX = 1;
								if(DebugFlg){
									if (this.debugColor != "red") this.debugColor = "red";
								}
							}
							break;
						case 'TankLeft':
							if (from.tank.rotation == 270) {
								this.x = from.x - 2;
								this.y = from.y + 4;
								if (this.scaleX != 2 && from.moveSpeed > 0) this.scaleX = 2;
								if(DebugFlg){
									if (this.debugColor != "yellow") this.debugColor = "yellow";
								}
							} else {
								this.x = from.x - 1;
								this.y = from.y + 4;
								if (this.scaleX != 1 && from.moveSpeed > 0) this.scaleX = 1;
								if(DebugFlg){
									if (this.debugColor != "green") this.debugColor = "green";
								}
							}
							break;
					}
				}

			}
			scene.addChild(this);
		}
	});

	function TankFrame(from, num, scene) {
		let arr = [];
		arr.push(new TankObstracle(from, num, 'TankTop', scene));
		arr.push(new TankObstracle(from, num, 'TankBottom', scene));
		arr.push(new TankObstracle(from, num, 'TankLeft', scene));
		arr.push(new TankObstracle(from, num, 'TankRight', scene));
		return arr;
	}

	var Cursor = Class.create(Sprite, {
		initialize: function(scene) {
			Sprite.call(this, 16, 16);
			//this.backgroundColor = "green";
			this.backgroundColor = "#6afc";
			this.x = 0;
			this.y = 0;
			var cur = this;

			if (navigator.userAgent.match(/iPhone|iPad|Android/)) {
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
					cur.x = (e.x - ScreenMargin) * (game.width / stageScreen.clientWidth) - (cur.width / 2);
					cur.y = (e.y) * (game.height / stageScreen.clientHeight) - (cur.height / 2);
				});
			}

			scene.addChild(this);

			return this;
		}
	});

	var Tank = Class.create(Sprite, {
		initialize: function(area, category) {
			Sprite.call(this, 56, 70);
			//this.backgroundColor = "#fff";
			this.image = game.assets[Categorys.Image[category].tank];
			this.pos = { x: (area.width - this.width) / 2, y: (area.height - this.height) / 2 };
			//this.x = area.x + 2;
			//this.y = area.y - 5;
			this.x = area.x + this.pos.x;
			this.y = area.y + this.pos.y;
			this.scaleX = 0.95;
			this.scaleY = 0.87;
			this.rotation = 0;
			this.onenterframe = function() {
				//this.x = area.x + 2;
				//this.y = area.y - 5;
				this.x = area.x + this.pos.x;
				this.y = area.y + this.pos.y;
			}
			now_scene.TankGroup.addChild(this);
			return this;
		}
	});

	var Cannon = Class.create(Sprite, {
		initialize: function(area, category) {
			Sprite.call(this, 72, 144);
			this.image = game.assets[Categorys.Image[category].cannon];
			this.x = (area.x + area.width / 2) - this.width / 2;
			this.y = (area.y + area.height / 2) - this.height / 2;
			this.rotation = 0;

			this._setSize();

			this.onenterframe = function() {
				/*this.x = area.x - 6.5;
				this.y = area.y - 41.5;*/
				this.x = (area.x + area.width / 2) - this.width / 2;
				this.y = (area.y + area.height / 2) - this.height / 2;
			}
			now_scene.CannonGroup.addChild(this);
		},
		_setSize: function() {
			this.originX = 36;
			this.originY = 72;
			this.scaleX = 0.675
			this.scaleY = 0.675
		}
	});

	var Weak = Class.create(Sprite, {
		initialize: function(from, num) {
			Sprite.call(this, 40, 40);
			//this.backgroundColor = "#f00a";
			this.num = num;
			this.x = from.x + 10;
			this.y = from.y + 10;

			this.onenterframe = function() {
				if (WorldFlg) {
					let f = Get_Center(from);
					this.x = f.x - this.width / 2;
					this.y = f.y - this.height / 2;
					/*BombExplosion.intersect(this).forEach(elem => {
						if (victory == false && defeat == false && complete == false) deadFlgs[num] = true;
					});*/
				}

			}
			now_scene.addChild(this);
		}
	});

	var Mark = Class.create(Sprite, {
		initialize: function(from) {
			Sprite.call(this, 48, 48);
			this.image = game.assets['./image/ObjectImage/mark.png'];
			this.x = (from.x + from.width / 2) - this.width / 2;
			this.y = ((from.y + from.height / 2) - this.height / 2) + 6;
			this.scaleY = 0.8;

			now_scene.MarkGroup.addChild(this);
		}
	});

	// Aim 用のキャッシュ（1回だけ生成）
	const AimSurfaceCache = (() => {
		const s = new Surface(8, 8);
		const ctx = s.context;
		ctx.beginPath();
		ctx.fillStyle = 'rgba(170, 255, 255, 0.3)';
		ctx.arc(4, 4, 4, 0, Math.PI * 2, true);
		ctx.fill();
		return s;
	})();

	const RedAimSurfaceCache = (() => {
		const s = new Surface(8, 8);
		const ctx = s.context;
		ctx.beginPath();
		ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';
		ctx.arc(4, 4, 4, 0, Math.PI * 2, true);
		ctx.fill();
		return s;
	})();

	const PlayerRefAimSurfaceCache = (() => {
		// 可視エフェクト設定
		const s = new Surface(8, 8);
		const ctx = s.context;
		ctx.beginPath();
		ctx.fillStyle = 'rgba(170, 255, 255, 0.3)';
		ctx.arc(4, 4, 4, 0, Math.PI * 2, true);
		ctx.fill();
		return s;
	})();

	var Aim = Class.create(Sprite, {
		initialize: function(from, to, category, num) {
			Sprite.call(this, 8, 8);
			this.time = 0;
			this.category = category;
			this.num = num;
			if (DebugFlg) this.debugColor = 'orange';

			let angle = normalizeRotation(Vec_to_Rot(Get_Center(from), Get_Center(to)) + 90);
			this.rad = Rot_to_Rad(angle);

			// ビジュアル設定
			if (num === 0) {
				this.image = AimSurfaceCache;
			} else{
				this.visible = false;
				if (Categorys.MaxRef[category] === 0) {
					this.scale(2.0, 2.0);
				}
			}

			// 大砲回転処理
			let rot = normalizeRotation(Rad_to_Rot(this.rad));
			let diff = normalizeAngle(from.rotation - rot);
			let speed = Categorys.CannonRotSpeed[category];
			if (Math.abs(diff) >= speed) {
				from.rotation = normalizeRotation(from.rotation + (diff > 0 ? -speed : speed));
			} else {
				from.rotation = rot;
			}

			// 発射角度と座標
			this.rad = Rot_to_Rad(from.rotation - 90);
			var pos = Get_Center(from);
			this.moveTo(
				pos.x - 3.45 + Math.cos(this.rad) * 56,
				pos.y - 4.5 + Math.sin(this.rad) * 56
			);

			this.dx = Math.cos(this.rad) * 28;
			this.dy = Math.sin(this.rad) * 28;

			this.onenterframe = () => {
				if (!WorldFlg) return;

				this.time++;
				if (this.time % 360 === 0) {
					now_scene.removeChild(this);
					return;
				}

				pos = Get_Center(from);
				rad = Rot_to_Rad(from.rotation - 90);
				// 任意：移動ベクトルも更新したい場合
				this.dx = Math.cos(rad) * 28;
				this.dy = Math.sin(rad) * 28;

				this.x = pos.x - 3.45 + Math.cos(rad) * 56 + (this.dx * this.time);
				this.y = pos.y - 4.5 + Math.sin(rad) * 56 + (this.dy * this.time);

				//this.x += this.dx;
				//this.y += this.dy;

				// 壁 or ブロックヒット時に削除
				if (
					Wall.intersectStrict(this).length > 0 ||
					Block.intersectStrict(this).length > 0
				) {
					now_scene.removeChild(this);
					return;
				}

				if (this.num !== 0) {
					const hit = TankBase.intersectStrict(this);
					if (hit.length > 0) {
						if (hit[0].num !== 0) {
							now_scene.removeChild(this);
						}
					}
				}
			};

			now_scene.addChild(this);
		}
	});

	class AimLite {
		static list = [];
		constructor(from, to, category, num, ref) {
			this.from = from;
			this.to = to;
			this.category = category;
			this.num = num;

			// 設定
			this.maxLength = 3600;     // 照準線の最大距離
			this.maxBounce = ref;        // 最大反射回数
			this.lineWidth = 8;        // 線の太さ（自由に変更）
			this.debugColor = null;   // 線の色（自由に変更）

			this.segments = [];        // {x1,y1,x2,y2}

			// リストに登録（描画用）
			AimLite.list.push(this);
		}

		update(from, to) {
			if (gameStatus != 0 || deadFlgs[this.num]){
				this.remove();
				return;
			}
				
			// 砲塔回転処理（元Aimと同じ）
			let angle = normalizeRotation(Vec_to_Rot(Get_Center(from), Get_Center(to)) + 90);
			let rad = Rot_to_Rad(angle);

			let rot = normalizeRotation(Rad_to_Rot(rad));
			let diff = normalizeAngle(from.rotation - rot);
			let speed = Categorys.CannonRotSpeed[this.category];

			if (Math.abs(diff) >= speed) {
				from.rotation = normalizeRotation(from.rotation + (diff > 0 ? -speed : speed));
			} else {
				from.rotation = rot;
			}

			// 発射角度
			this.rad = Rot_to_Rad(from.rotation - 90);

			// 砲塔先端の位置
			const pos = Get_Center(from);
			this.startX = pos.x + Math.cos(this.rad) * 50;
			this.startY = pos.y + Math.sin(this.rad) * 50;

			// 照準線を再計算
			this.computeAimLine();
			this.drawDebug();
		}

		computeAimLine() {
			this.segments = [];

			let cx = this.startX;
			let cy = this.startY;

			let dx = Math.cos(this.rad);
			let dy = Math.sin(this.rad);

			let remain = this.maxLength;
			let bounce = this.maxBounce;

			while (bounce >= 0 && remain > 0) {
				const hit = this.raycast(cx, cy, dx, dy, remain);

				this.segments.push({
					x1: cx,
					y1: cy,
					x2: hit.x,
					y2: hit.y
				});

				if (!hit.reflected) break;

				// 反射
				const n = hit.normal;
				const dot = dx * n.x + dy * n.y;
				dx = dx - 2 * dot * n.x;
				dy = dy - 2 * dot * n.y;

				cx = hit.x;
				cy = hit.y;

				remain -= hit.dist;
				bounce--;
			}
		}

		// レイキャスト（壁との衝突）
		raycast(x, y, dx, dy, maxDist) {
			let nearest = null;

			for (const w of Wall.collection) {
				const hit = this.rayRect(x, y, dx, dy, w);
				if (hit && hit.dist <= maxDist) {
					if (!nearest || hit.dist < nearest.dist) nearest = hit;
				}
			}
			for (const w of Block.collection) {
				const hit = this.rayRect(x, y, dx, dy, w);
				if (hit && hit.dist <= maxDist) {
					if (!nearest || hit.dist < nearest.dist) nearest = hit;
				}
			}

			if (!nearest) {
				return {
					x: x + dx * maxDist,
					y: y + dy * maxDist,
					dist: maxDist,
					reflected: false
				};
			}

			return {
				x: nearest.x,
				y: nearest.y,
				dist: nearest.dist,
				reflected: true,
				normal: nearest.normal
			};
		}

		// レイ vs 矩形（壁）
		rayRect(x, y, dx, dy, rect) {
			// 弾の半径
			const BULLET_R = 2.5;

			const x1 = rect.x;
			const y1 = rect.y;
			const x2 = rect.x + rect.width;
			const y2 = rect.y + rect.height;

			let tMin = Infinity;
			let hitX = 0, hitY = 0;
			let normal = null;

			const EPS = 0.0001;

			// 左
			if (dx !== 0) {
				const t = (x1 - x) / dx;
				const yy = y + dy * t;
				if (t > 0 && yy >= y1 && yy <= y2) {
					if (Math.abs(t - tMin) < EPS) {
						normal = { x: -dx, y: -dy }; // corner
					} else if (t < tMin) {
						tMin = t; hitX = x1; hitY = yy; normal = {x:1,y:0};
					}
				}
			}

			// 右
			if (dx !== 0) {
				const t = (x2 - x) / dx;
				const yy = y + dy * t;
				if (t > 0 && yy >= y1 && yy <= y2) {
					if (Math.abs(t - tMin) < EPS) {
						normal = { x: -dx, y: -dy };
					} else if (t < tMin) {
						tMin = t; hitX = x2; hitY = yy; normal = {x:-1,y:0};
					}
				}
			}

			// 上
			if (dy !== 0) {
				const t = (y1 - y) / dy;
				const xx = x + dx * t;
				if (t > 0 && xx >= x1 && xx <= x2) {
					if (Math.abs(t - tMin) < EPS) {
						normal = { x: -dx, y: -dy };
					} else if (t < tMin) {
						tMin = t; hitX = xx; hitY = y1; normal = {x:0,y:1};
					}
				}
			}

			// 下
			if (dy !== 0) {
				const t = (y2 - y) / dy;
				const xx = x + dx * t;
				if (t > 0 && xx >= x1 && xx <= x2) {
					if (Math.abs(t - tMin) < EPS) {
						normal = { x: -dx, y: -dy };
					} else if (t < tMin) {
						tMin = t; hitX = xx; hitY = y2; normal = {x:0,y:-1};
					}
				}
			}

			if (tMin === Infinity) return null;

			// ★ ここがポイント：壁ヒット位置から「半径ぶん手前」に戻す
			const adjDist = Math.max(0, tMin - BULLET_R);
			const adjX = x + dx * adjDist;
			const adjY = y + dy * adjDist;

			return { x: adjX, y: adjY, dist: adjDist, normal };
		}

		// デバッグ描画（常時可視化）
		drawDebug() {
			if (this.debugColor == null)
				return;
			// 既存の線を削除
			this.domLines?.forEach(l => l.remove());
			this.domLines = [];

			for (const s of this.segments) {
				const line = createLine(s.x1, s.y1, s.x2, s.y2, this.debugColor, this.lineWidth);
				this.domLines.push(line);
			}
		}

		remove() {
			this.domLines?.forEach(l => l.remove());
			this.domLines = [];
			const idx = AimLite.list.indexOf(this);
			if (idx >= 0) AimLite.list.splice(idx, 1);
		}
	}

	function createLine(x1, y1, x2, y2, color = "red", width = 4) {
		const dx = x2 - x1;
		const dy = y2 - y1;
		const length = Math.sqrt(dx*dx + dy*dy);
		const angle = Math.atan2(dy, dx) * 180 / Math.PI;

		const line = document.createElement("div");
		line.style.position = "absolute";

		const dot = width;          // 点の直径
		const spacing = width * 3;  // 点の間隔

		// ★ 点の中心を (x1, y1) に合わせるための補正
		line.style.left = (x1 - dot / 2) + "px";
		line.style.top  = (y1 - dot / 2) + "px";

		line.style.width = length + "px";
		line.style.height = dot + "px";

		// ★ 最初の点（中心が (x1, y1)）
		line.style.background = color;
		line.style.borderRadius = "50%";
		line.style.width = dot + "px";
		line.style.height = dot + "px";

		// ★ 残りの点を box-shadow で複製
		let shadows = [];
		for (let i = spacing; i < length; i += spacing) {
			shadows.push(`${i}px 0 0 0 ${color}`);
		}
		line.style.boxShadow = shadows.join(",");

		// ★ 回転は今のまま
		line.style.transformOrigin = `${dot/2}px ${dot/2}px`;
		line.style.transform = `rotate(${angle}deg)`;

		line.style.zIndex = 9999;
		now_scene._element.appendChild(line);
		return line;
	}

	class RefAimLite {
		static collection = [];

		constructor(ref, from, category, num) {
			this.ref = ref;
			this.category = category;
			this.num = num;

			this.lineWidth = 8;
			this.color = null;

			this.domLines = [];

			// 反射後の最終ターゲット座標（実弾の着弾点に近づける）
			this.tgt = [0, 0];

			// 砲塔が向くべき角度
			this.agl = from.rotation;

			// 当たり判定用（点扱い）
			this.w = 4;
			this.h = 4;

			RefAimLite.collection.push(this);
		}

		update(from) {
			if (gameStatus != 0 || deadFlgs[this.num]) {
				this.remove();
				return;
			}
			if (!WorldFlg) return;

			this.domLines.forEach(l => l.remove());
			this.domLines = [];

			this.segments = [];

			// --- 砲塔角度から方向ベクトルを計算 ---
			const fc = Get_Center(from);
			const baseRot = from.rotation - 90;
			const rad = Rot_to_Rad(baseRot);

			let dx = Math.cos(rad);
			let dy = Math.sin(rad);

			// ★ RefAim と同じ 36px 先端
			let x = fc.x + dx * 48;
			let y = fc.y + dy * 48;

			this.agl = normalizeRotation(from.rotation);

			let remain = 3600;
			let bounce = this.ref;

			let lastX = x;
			let lastY = y;

			while (bounce >= 0 && remain > 0) {
				const hit = this.raycast(x, y, dx, dy, remain);

				this.segments.push({
					x1: x,
					y1: y,
					x2: hit.x,
					y2: hit.y,
					dist: hit.dist
				});

				if (this.color != null) {
					this.domLines.push(
						createLine(x, y, hit.x, hit.y, this.color, this.lineWidth)
					);
				}

				lastX = hit.x;
				lastY = hit.y;

				if (!hit.reflected) break;

				const n = hit.normal;
				const dot = dx * n.x + dy * n.y;
				dx = dx - 2 * dot * n.x;
				dy = dy - 2 * dot * n.y;

				x = hit.x;
				y = hit.y;

				remain -= hit.dist;
				bounce--;
			}

			// ★ 実弾の最終着弾点として保存
			this.tgt = [lastX, lastY];

			this.x = lastX;
			this.y = lastY;
		}

		raycast(x, y, dx, dy, maxDist) {
			let nearest = null;

			// 壁
			for (const w of RefObstracle.collection) {
				const hit = this.rayRect(x, y, dx, dy, w);
				if (hit && hit.dist <= maxDist) {
					if (!nearest || hit.dist < nearest.dist) {
						nearest = { ...hit, type: "wall" };
					}
				}
			}

			// タンク（num == 0 以外）
			for (const t of TankBase.collection) {
				if (t.num === 0) continue;

				const hit = this.rayRect(x, y, dx, dy, t);
				if (hit && hit.dist <= maxDist) {
					if (!nearest || hit.dist < nearest.dist) {
						nearest = { ...hit, type: "tank" };
					}
				}
			}

			if (!nearest) {
				return {
					x: x + dx * maxDist,
					y: y + dy * maxDist,
					dist: maxDist,
					reflected: false,
					type: "none"
				};
			}

			// タンクに当たったら反射なし
			if (nearest.type === "tank") {
				return {
					x: nearest.x,
					y: nearest.y,
					dist: nearest.dist,
					reflected: false,
					type: "tank"
				};
			}

			// 壁は反射
			return {
				x: nearest.x,
				y: nearest.y,
				dist: nearest.dist,
				reflected: true,
				normal: nearest.normal,
				type: "wall"
			};
		}

		rayRect(x, y, dx, dy, rect) {
			const BULLET_R = 2.5;

			const x1 = rect.x;
			const y1 = rect.y;
			const x2 = rect.x + rect.width;
			const y2 = rect.y + rect.height;

			let tMin = Infinity;
			let hitX = 0, hitY = 0;
			let normal = null;

			// --- 1. 四辺との距離（今まで通り） ---
			// 左
			if (dx !== 0) {
				const t = (x1 - x - BULLET_R) / dx;
				const yy = y + dy * t;
				if (t > 0 && yy >= y1 && yy <= y2 && t < tMin) {
					tMin = t; hitX = x1 - BULLET_R; hitY = yy; normal = {x:1,y:0};
				}
			}

			// 右
			if (dx !== 0) {
				const t = (x2 - x + BULLET_R) / dx;
				const yy = y + dy * t;
				if (t > 0 && yy >= y1 && yy <= y2 && t < tMin) {
					tMin = t; hitX = x2 + BULLET_R; hitY = yy; normal = {x:-1,y:0};
				}
			}

			// 上
			if (dy !== 0) {
				const t = (y1 - y - BULLET_R) / dy;
				const xx = x + dx * t;
				if (t > 0 && xx >= x1 && xx <= x2 && t < tMin) {
					tMin = t; hitX = xx; hitY = y1 - BULLET_R; normal = {x:0,y:1};
				}
			}

			// 下
			if (dy !== 0) {
				const t = (y2 - y + BULLET_R) / dy;
				const xx = x + dx * t;
				if (t > 0 && xx >= x1 && xx <= x2 && t < tMin) {
					tMin = t; hitX = xx; hitY = y2 + BULLET_R; normal = {x:0,y:-1};
				}
			}

			// --- 2. ★ 角との距離（円の RayCast で必須） ---
			const corners = [
				{cx: x1, cy: y1},
				{cx: x2, cy: y1},
				{cx: x1, cy: y2},
				{cx: x2, cy: y2},
			];

			for (const c of corners) {
				const vx = c.cx - x;
				const vy = c.cy - y;

				const proj = vx * dx + vy * dy; // Ray 方向への投影

				if (proj > 0) {
					const closestX = x + dx * proj;
					const closestY = y + dy * proj;

					const distSq =
						(closestX - c.cx) ** 2 +
						(closestY - c.cy) ** 2;

					if (distSq <= BULLET_R * BULLET_R) {
						const t = proj - Math.sqrt(BULLET_R * BULLET_R - distSq);
						if (t > 0 && t < tMin) {
							tMin = t;
							hitX = x + dx * t;
							hitY = y + dy * t;

							// 法線は角方向
							const nx = hitX - c.cx;
							const ny = hitY - c.cy;
							const len = Math.hypot(nx, ny);
							normal = {x: nx / len, y: ny / len};
						}
					}
				}
			}

			if (tMin === Infinity) return null;

			return {
				x: hitX,
				y: hitY,
				dist: tMin,
				normal
			};
		}

		remove() {
			this.domLines.forEach(l => l.remove());
			this.domLines = [];

			const idx = RefAimLite.collection.indexOf(this);
			if (idx >= 0) RefAimLite.collection.splice(idx, 1);
		}
	}

	function lineIntersectsRect(x1, y1, x2, y2, rect) {
		const rx1 = rect.x;
		const ry1 = rect.y;
		const rx2 = rect.x + rect.width;
		const ry2 = rect.y + rect.height;

		// 1. 端点が矩形内
		if (x1 >= rx1 && x1 <= rx2 && y1 >= ry1 && y1 <= ry2) return true;
		if (x2 >= rx1 && x2 <= rx2 && y2 >= ry1 && y2 <= ry2) return true;

		// 2. 線分と矩形の4辺が交差するか
		if (segmentsIntersect(x1, y1, x2, y2, rx1, ry1, rx2, ry1)) return true; // 上
		if (segmentsIntersect(x1, y1, x2, y2, rx1, ry2, rx2, ry2)) return true; // 下
		if (segmentsIntersect(x1, y1, x2, y2, rx1, ry1, rx1, ry2)) return true; // 左
		if (segmentsIntersect(x1, y1, x2, y2, rx2, ry1, rx2, ry2)) return true; // 右

		return false;
	}

	function segmentsIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {

		const ccw = (ax, ay, bx, by, cx, cy) =>
			(cy - ay) * (bx - ax) > (by - ay) * (cx - ax);

		return (
			ccw(x1, y1, x3, y3, x4, y4) !== ccw(x2, y2, x3, y3, x4, y4) &&
			ccw(x1, y1, x2, y2, x3, y3) !== ccw(x1, y1, x2, y2, x4, y4)
		);
	}

	function findBestPreAimAngle(ref, from, category, num, target) {

		const originalRot = from.rotation;
		const aim = new RefAimLite(ref, from, category, num);
		aim.color = null;

		// --- 角度評価関数（1角度分） ---
		function evaluateAngle(deg) {
			from.rotation = deg;

			aim.update(from);

			const segments = aim.segments;

			if (!segments || segments.length === 0) {
				
				return -Infinity;
			}

			const first = segments[0];
			if (!first || !isFinite(first.dist)) {
				return -Infinity;
			}

			const distToFirstWall = first.dist;
			const reflectCount = segments.length - 1;
			if (reflectCount < 0) {
				return -Infinity;
			}

			const dx = aim.tgt[0] - target.x;
			const dy = aim.tgt[1] - target.y;
			const distToTarget = Math.hypot(dx, dy);
			if (!isFinite(distToTarget)) {
				return -Infinity;
			}

			// --- スコア ---
			const score =
				-distToTarget * 1.0 +
				distToFirstWall * 0.05 -
				reflectCount * 5;

			return score;
		}

		// --- Step 1: 粗スキャン（10°刻み） ---
		let bestDeg = null;
		let bestScore = -Infinity;

		for (let deg = 0; deg < 360; deg += 10) {
			const score = evaluateAngle(deg);
			if (score > bestScore) {
				bestScore = score;
				bestDeg = deg;
			}
		}

		// --- Step 2: 中スキャン（3°刻み） ---
		let midBest = bestDeg;
		bestScore = -Infinity;

		for (let d = bestDeg - 10; d <= bestDeg + 10; d += 3) {
			const deg = (d + 360) % 360;
			const score = evaluateAngle(deg);
			if (score > bestScore) {
				bestScore = score;
				midBest = deg;
			}
		}

		// --- Step 3: 細スキャン（1°刻み） ---
		let fineBest = midBest;
		bestScore = -Infinity;

		for (let d = midBest - 3; d <= midBest + 3; d++) {
			const deg = (d + 360) % 360;
			const score = evaluateAngle(deg);
			if (score > bestScore) {
				bestScore = score;
				fineBest = deg;
			}
		}

		// --- 元の角度に戻す ---
		from.rotation = originalRot;

		// --- どの角度も評価できなかった ---
		if (fineBest == null) {
			return NaN;
		}

		// --- スコアが極端に低い場合はフォールバック ---
		if (Math.abs(bestScore) < 50) {
			return NaN;
		}

		aim.remove();

		return fineBest;
	}


	function clampDeg(angle, center, range) {
		let diff = normalizeAngle(angle - center);

		if (diff > range) return center + range;
		if (diff < -range) return center - range;

		return angle;
	}

	/* 照準クラス */
	var RefCursor = Class.create(Sprite, {
		initialize: function(from, scene) {
			Sprite.call(this, 1, 1);
			//if(DebugFlg)this.backgroundColor = "white";
			this.num = from.num;
			this.moveTo(from.x + (from.width / 2), from.y + (from.height / 2))
			this.time = 0;
			scene.addChild(this);
		}
	})

	class BulAimLite {
		static list = [];

		constructor(from) {
			this.time = 0;
			this.num = from.num;
			this.id = from.id;

			this.w = 8;
			this.h = 8;

			const fc = Get_Center(from);
			const rad = Rot_to_Rad(from.rotation - 90);

			const cos = Math.cos(rad);
			const sin = Math.sin(rad);

			// BulAim と同じ速度
			this.dx = cos * 24;
			this.dy = sin * 24;

			// 初期位置（Sprite と同じ）
			this.x = fc.x + cos - this.w / 2;
			this.y = fc.y + sin - this.h / 2;

			BulAimLite.list.push(this);
		}

		// --- AABB 衝突 ---
		hitAABB(obj) {
			return !(
				this.x + this.w <= obj.x ||
				this.x >= obj.x + obj.width ||
				this.y + this.h <= obj.y ||
				this.y >= obj.y + obj.height
			);
		}

		update() {
			if (!WorldFlg) return;

			if (DebugFlg)
				new Point({ x: this.x, y: this.y });

			this.time++;

			const vx = this.dx;
			const vy = this.dy;

			this.x += vx;
			this.y += vy;

			// 弾が消えていたら終了
			if (!bulStack[this.num][this.id]) {
				this.remove();
				return;
			}

			// 壁 or ブロックに当たったら終了
			const hitWall = Wall.collection.find(e => this.hitAABB(e));
			const hitBlock = Block.collection.find(e => this.hitAABB(e));

			if (hitWall || hitBlock) {
				this.remove();
				return;
			}

			// 寿命
			if (this.time > 90) {
				this.remove();
			}
		}

		remove() {
			const idx = BulAimLite.list.indexOf(this);
			if (idx >= 0) BulAimLite.list.splice(idx, 1);
		}
	}

	class PlayerBulAimLite {
		static list = [];

		constructor(from) {
			this.time = 0;
			this.target = from;
			this.num = from.num;
			this.id = from.id;

			this.w = 8;
			this.h = 8;

			const fc = Get_Center(from);
			const rad = Rot_to_Rad(from.rotation - 90);

			const cos = Math.cos(rad);
			const sin = Math.sin(rad);

			this.dx = cos * 24;
			this.dy = sin * 24;

			// 初期位置（Sprite と同じ）
			this.x = fc.x + cos - this.w / 2;
			this.y = fc.y + sin - this.h / 2;

			PlayerBulAimLite.list.push(this);
		}

		// --- AABB 衝突 ---
		hitAABB(obj) {
			return !(
				this.x + this.w <= obj.x ||
				this.x >= obj.x + obj.width ||
				this.y + this.h <= obj.y ||
				this.y >= obj.y + obj.height
			);
		}

		update() {
			if (DebugFlg)
				new Point({ x: this.x, y: this.y });

			this.time++;

			const vx = this.dx;
			const vy = this.dy;

			this.x += vx;
			this.y += vy;

			// 弾が消えていたら終了
			if (!bulStack[this.num][this.id]) {
				this.remove();
				return;
			}

			// 壁・ブロック衝突
			const hitWall  = Array.from(Wall.collection).find(e => this.hitAABB(e));
			const hitBlock = Array.from(Block.collection).find(e => this.hitAABB(e));

			if (hitWall || hitBlock) {
				this.remove();
				return;
			}

			if (this.time > 90) {
				this.remove();
			}
		}

		remove() {
			const idx = PlayerBulAimLite.list.indexOf(this);
			if (idx >= 0) PlayerBulAimLite.list.splice(idx, 1);
		}
	}

	function Search(from, to, angle, length) {
		const inRange = from.within(to, length);
		if (!inRange) return false;

		let relativeAngle = (Vec_to_Rot(from, to) - from.rotation + 360) % 360;
		return relativeAngle < angle || relativeAngle > (360 - angle);
	}

	var BulletCol = Class.create(PhyCircleSprite, {
		initialize: function (shotSpeed, ref, from, category, num, id) {
			PhyCircleSprite.call(this, 2.5, enchant.box2d.DYNAMIC_SPRITE, 0, 0, 1, true);

			this.time = 0;
			this.id = id;
			this.num = num;
			this.category = category;
			this.from = from;
			this.shotSpeed = shotSpeed;
			this.ref = ref;
			this.bullet = new Bullet(this, num, id);

			this.prevVx = 0;
			this.prevVy = 0;

			// 射角ブレ
			const [r0, r1] = this.getRandomOffset(category);
			this.applyBulletScaling(category);

			this.vec = Rot_to_Vec(from.rotation + r0 + r1, -90);
			this.rad = Math.atan2(this.vec.y, this.vec.x);

			const pos = Get_Center(from);
			this.moveTo(pos.x + Math.cos(this.rad) * 60 - 2.25,
						pos.y + Math.sin(this.rad) * 60 - 3);

			this.applyImpulse(new b2Vec2(Math.cos(this.rad) * shotSpeed,
										Math.sin(this.rad) * shotSpeed));

			this.onenterframe = () => {
				if (!WorldFlg) return;

				// 前フレーム速度を保存
				const lastVx = this.prevVx;
				const lastVy = this.prevVy;

				this.prevVx = this.vx;
				this.prevVy = this.vy;

				this.vec = { x: this.vx, y: this.vy };
				this.rad = Math.atan2(this.vec.y, this.vec.x);
				this.time++;

				if (this.time % 10 === 0) new Smoke(this);

				// 前フレームと現在の速度ベクトルの角度差
				const dot = lastVx * this.vx + lastVy * this.vy;
				const mag1 = Math.sqrt(lastVx * lastVx + lastVy * lastVy);
				const mag2 = Math.sqrt(this.vx * this.vx + this.vy * this.vy);

				// 速度ゼロは除外
				let angleChanged = false;
				if (mag1 > 0 && mag2 > 0) {
					const cosTheta = dot / (mag1 * mag2);
					const angle = Math.acos(Math.min(1, Math.max(-1, cosTheta))); // 安全クランプ

					// ★ 反射角度が小さくても検出できる
					if (angle > 0.05) { // 0.2rad ≒ 11.5度（調整可能）
						angleChanged = true;
					}
				}

				if (angleChanged) {
					this.ref--;
					if (gameStatus === 0)
						game.assets['./sound/s_car_trunk_O.wav'].clone().play();
				}


				// 反射限界
				if (this.ref < 0) this._Destroy();

				// 他弾との衝突
				Bullet.intersectStrict(this.bullet).forEach(elem => {
					if (this.bullet.num !== elem.num || this.bullet.id !== elem.id) {
						elem.from._Destroy();
						this._Destroy();
					}
				});
			};

		},

		_Shot: function () {
			bullets[this.num]++;
			bulStack[this.num][this.id] = true;
			now_scene.BulletGroup.addChild(this);
			now_scene.BulletGroup.addChild(this.bullet);
			new OpenFire(this.from);
			game.assets['./sound/s_car_door_O2.wav'].clone().play();
			if (this.shotSpeed >= 14)
				game.assets['./sound/Sample_0003.wav'].clone().play();
		},

		_Destroy: function () {
			bullets[this.num]--;
			bulStack[this.num][this.id] = false;
			new TouchFire(this.bullet);
			Spark_Effect(this.bullet);
			this.destroy();
			now_scene.BulletGroup.removeChild(this);
			now_scene.BulletGroup.removeChild(this.bullet);
			if (gameStatus === 0)
				game.assets['./sound/Sample_0000.wav'].clone().play();
		},

		getRandomOffset: function (category) {
			const ranges = { 4: 10, 9: 6, 13: 4 };
			const r = ranges[category];
			if (!r) return [0, 0];
			return [
				(Math.floor(Math.random() * (r * 2)) - r) / 2,
				(Math.floor(Math.random() * (r * 2)) - r) / 2
			];
		},

		applyBulletScaling: function (category) {
			const scaleMap = {
				0: [1.0, 1.0],
				1: [0.8, 1.0],
				6: [0.6, 1.0],
				8: [1.0, 1.0],
				9: [0.7, 0.7],
				11: [0.6, 1.0]
			};
			const s = scaleMap[category];
			if (s) this.bullet.scale(...s);
		}
	});

	var BulletBase = Class.create(Sprite, {
		initialize: function(width, height, from, category, num, id, shotSpeed) {
			Sprite.call(this, width, height);

			this.from = from;
			this.category = category;
			this.num = num;
			this.id = id;
			this.shotSpeed = shotSpeed;
			this.name = 'Bullet';

			this.time = 0;
		}
	});

	var Bullet = Class.create(BulletBase, {
		initialize: function(from, num, id) {
			BulletBase.call(this, 12, 18, from, from.category, num, id, from.shotSpeed);

			this.image = game.assets['./image/ObjectImage/R2.png'];
			this.force = this.computeForce(from);
			this.halfW = this.width / 2; 
			this.halfH = this.height / 3; 
			this.fromH = from.height / 2;

			// 前回の角度を保存するための変数
			this.prevRad = null;

			this.updateRotation(from.rad);
			this.updatePosition();

			this.onenterframe = () => {
				if (!WorldFlg) return;

				this.time++;

				// rad が変わったときだけ回転更新
				const rad = from.rad;
				if (rad !== this.prevRad) {
					this.prevRad = rad;
					this.updateRotation(rad);
					this.force = this.computeForce(from);
				}

				this.updatePosition();

				if (this.time % 2 === 0) {
					if (this.from.shotSpeed >= 14) {
						new Fire(this);
					}
					if (this.time % 4 === 0) {
						this.num === 0 ? new PlayerBulAimLite(this) : new BulAimLite(this);
					}
				}
			};
		},

		computeForce: function(from) {
			const sp = from.shotSpeed;
			if (sp >= 14) {
				const f = sp * (sp / 3) * 2;
				return { x: from.vx / f, y: from.vy / f };
			}
			return { x: 0, y: 0 };
		},

		updateRotation: function(rad) {
			this.rotation = -(180 + Math.atan2(Math.cos(rad), Math.sin(rad)) * 180 / Math.PI);
		},

		updatePosition: function() {
			const { centerX, centerY} = this.from;
			this.moveTo(
				centerX - this.halfW - this.force.x,
				centerY - (this.fromH + this.halfH) - this.force.y
			);
		}
	});

	var PhysBulletCol = Class.create(BulletBase, {
		initialize: function(shotSpeed, ref, from, category, num, id, targetEntity) {
			BulletBase.call(this, 12, 18, from, category, num, id, Math.round(((shotSpeed + 0.5) / 2)*10)/10);

			this.name = 'PhyBullet';

			// 見た目（Bullet と同じ画像）
			this.image = game.assets['./image/ObjectImage/R3.png'];

			// 発射時点のターゲット座標を保持
			const tgt = Get_Center(targetEntity);
			this.targetX = tgt.x;
			this.targetY = tgt.y;

			this.applyBulletScaling(category);
			const [random0, random1] = this.getRandomOffset(category);

			// 発射角度
			const rad = Rot_to_Rad((from.rotation + random0 + random1) - 90);
			this.vx = Math.cos(rad) * this.shotSpeed;
			this.vy = Math.sin(rad) * this.shotSpeed;

			// 初期位置（BulletCol と同じ補正）
			const pos = Get_Center(from);
			this.moveTo(
				pos.x + Math.cos(rad) * 60 - this.width / 2,
				pos.y + Math.sin(rad) * 60 - this.height / 2
			);

			this.targetDistance = Vec_Distance({x: this.x, y: this.y}, tgt);
			this.travelDistance = 0;

			this.damage = Math.round(shotSpeed * ((this.scaleX + this.scaleY) / 2)) - 2;

			// 弾 ON
			bulStack[this.num][this.id] = true;
			bullets[this.num]++;
		},

		// ★★★ BulletCol と同じ呼び出し方を可能にする _Shot() ★★★
		_Shot: function() {
			now_scene.BulletGroup.addChild(this);

			new OpenFire(this.from);
			game.assets['./sound/s_car_door_O2.wav'].clone().play();

			if (this.shotSpeed > 7) {
				game.assets['./sound/Sample_0003.wav'].clone().play();
			}

			this._startMotion();
		},

		// ★★★ 移動・衝突・爆発処理 ★★★
		_startMotion: function() {
			this.onenterframe = () => {
				if (!WorldFlg) return;

				this.time++;

				// 移動（滑らか）
				this.x += this.vx;
				this.y += this.vy;

				this.travelDistance += Math.sqrt(this.vx*this.vx + this.vy*this.vy);

				// 見た目の回転（Bullet と同じ）
				this.rotation = -1 * (180 + Math.atan2(this.vx, this.vy) * 180 / Math.PI);

				// ★ ターゲットと同じ距離だけ進んだら爆発
				if (this.travelDistance >= this.targetDistance) {
					this._Explode();
					return;
				}

				// ② 壁に衝突したら爆発
				if (Block.intersectStrict(this).length > 0 ||
					Wall.intersectStrict(this).length > 0) {
					this._Explode();
					return;
				}

				// ③ 戦車に衝突したら爆発
				TankBase.intersectStrict(this).forEach(elem => {
					if (elem.num !== this.num) {
						elem._Damage();
						this._Explode();
					}
				});

				// ④ 他の弾と衝突したら爆発
				Bullet.intersectStrict(this).forEach(elem => {
					if (this.num !== elem.num || this.id !== elem.id) {
						elem.from._Destroy();
						this._Explode();
					}
				});

				// ④ 他の弾と衝突したら爆発
				PhysBulletCol.intersectStrict(this).forEach(elem => {
					if (this.num !== elem.num || this.id !== elem.id) {
						elem._Explode();
						this._Explode();
					}
				});

				// ⑤ エフェクト（Bullet と同じ）
				if (this.time % 2 === 0) {
					if (this.shotSpeed > 7) new Fire(this);
					if (this.time % 4 === 0) {
						this.num === 0 ? new PlayerBulAimLite(this) : new BulAimLite(this);//new BulAim(this);
					}
				}
			};
		},

		getRandomOffset: function(category) {
			const ranges = {
				4: 10, 9: 6, 13: 4
			};
			const r = ranges[category];
			if (!r) return [0, 0];
			return [
				(Math.floor(Math.random() * (r * 2)) - r) / 2,
				(Math.floor(Math.random() * (r * 2)) - r) / 2
			];
		},

		applyBulletScaling: function(category) {
			const scaleMap = {
				0: [1.0, 1.0],
				1: [0.8, 1.0],
				6: [0.6, 1.0],
				8: [1.0, 1.0],
				9: [0.7, 0.7],
				11: [0.6, 1.0]
			};
			const s = scaleMap[category];
			if (s) this.scale(...s);
		},

		// ★★★ 爆発処理（範囲ダメージ） ★★★
		_Explode: function() {
			if (gameStatus === 0) {
				let sound = game.assets['./sound/mini_bomb2.mp3'].clone();
				sound.play();
				sound.volume = 0.2;
			}

			new TouchFire(this);
			Spark_Effect(this);
			new BulletExplosion(this);

			this._Destroy();
		},

		_Destroy: function() {
			bullets[this.num]--;
			bulStack[this.num][this.id] = false;

			now_scene.BulletGroup.removeChild(this);
		}
	});

	var Bom = Class.create(Sprite, {
		initialize: function(from, num, id) {
			Sprite.call(this, PixelSize / 2, PixelSize / 2);

			this.time = 0;
			this.from = from;
			this.num = num;
			this.id = id;
			this.bombFlg = false;
			this.name = 'Bom';

			const center = Get_Center(from);
			const vec = Rot_to_Vec(from.rotation, -90);
			const rad = Math.atan2(vec.y, vec.x);
			this.moveTo(
				center.x + Math.cos(rad) * 10 - this.width / 2,
				center.y + Math.sin(rad) * 10 - this.height / 2
			);

			this.imageYellow = this.createCircleImage('rgba(255, 255, 0, 1)');
			this.imageRed = this.createCircleImage('rgba(255, 0, 0, 1)');
			this.image = this.imageYellow;

			this.scaleY = 0.9;

			this.onenterframe = () => {
				this.time++;

				// 爆発準備中の点滅と音
				if (this.bombFlg) {
					this.image = (this.time % 4 === 0) ? this.imageRed :
								(this.time % 2 === 0) ? this.imageYellow : this.image;

					if (this.time % 6 === 0 && gameStatus === 0) {
						game.assets['./sound/Sample_0010.wav'].clone().play();
					}
					if (gameStatus === 0 && this.time === 45) {
						this._Destroy();
					}
				}

				// 弾との接触処理
				if (WorldFlg) {
					Bullet.intersectStrict(this).some(elem => {
						if (bulStack[elem.num]?.[elem.id]) {
							elem.from._Destroy();
							this._Destroy();
							return true;
						}
						return false;
					});
					PhysBulletCol.intersectStrict(this).some(elem => {
						if (bulStack[elem.num]?.[elem.id]) {
							elem._Explode();
							this._Destroy();
							return true;
						}
						return false;
					});

					// 一定時間または戦車接近で爆発準備状態へ
					if (this.time > 180 && !this.bombFlg) {
						if (this.time > 555 || TankBase.collection.some(e => this.within(e, 120))) {
							this.bombFlg = true;
							this.time = 0;
							this.explosionRange.setTarget(this); // 自分に追従させる
						}
					}
				}
			};
		},

		_SetBom: function() {
			boms[this.num]++;
			now_scene.BomGroup.addChild(this);
			game.assets['./sound/Sample_0009.wav'].clone().play();
			this.explosionRange = new ExplosionRange(125);
			now_scene.MarkGroup.addChild(this.explosionRange);
		},

		_Destroy: function() {
			if (--boms[this.num] < 0) boms[this.num] = 0;
			new BombExplosion(this);
			this.moveTo(-900, -900);
			now_scene.BomGroup.removeChild(this);
			game.assets['./sound/mini_bomb2.mp3'].play();
			now_scene.MarkGroup.removeChild(this.explosionRange);
		},

		createCircleImage: function(color) {
			const surface = new Surface(this.width, this.height);
			const ctx = surface.context;
			ctx.beginPath();
			ctx.fillStyle = color;
			ctx.arc(Quarter, Quarter, Quarter, 0, Math.PI * 2, true);
			ctx.fill();
			return surface;
		}
	});

	var ExplosionRange = Class.create(Sprite, {
		initialize: function(radius, color = "rgba(255, 0, 0, 0.3)") {
			Sprite.call(this, radius * 2, radius * 2);
			this.radius = radius;
			this.image = this._createRangeImage(color);
			this.visible = false; // デフォルトは非表示
			this.target = null;   // 追従する対象Sprite
			this.opacity = 0.0;
			this.opaVal = 0.1;
			this.time = 0;
			this.scaleY = 0.9;
		},

		_createRangeImage: function(color) {
			const surface = new Surface(this.width, this.height);
			const ctx = surface.context;
			ctx.beginPath();
			ctx.arc(this.radius, this.radius, this.radius, 0, Math.PI * 2, true);
			ctx.strokeStyle = color;
			ctx.lineWidth = 4;
			ctx.stroke();
			ctx.fillStyle = 'rgba(180, 0, 0, 0.3)';
			ctx.fill();
			return surface;
		},

		setTarget: function(target) {
			this.target = target;
			this.visible = true;
		},

		onenterframe: function() {
			if (this.target) {
				this.x = this.target.x + this.target.width / 2 - this.radius;
				this.y = this.target.y + this.target.height / 2 - this.radius;
				if(this.time % 2 == 0){
					this.opacity += this.opaVal;
					if(this.time % 10 == 0 && this.time > 0) this.opaVal *= -1;
				}
				this.time++;
			}
		}
	});

	var BombExplosion = Class.create(Sprite, {
		initialize: function(from) {
			Sprite.call(this, 200, 200);
			this.name = 'BombExplosion';
			this.time = 0;

			const pos = Get_Center(from);
			this.moveTo(pos.x - 100, pos.y - 100);
			this.scaleX = this.scaleY = 0.1;

			// 爆風サークル描画（グラデーション）
			const surface = new Surface(200, 200);
			const ctx = surface.context;
			const grad = ctx.createRadialGradient(100, 50, 15, 100, 100, 100);
			grad.addColorStop(0, 'rgba(255, 255, 200, 1)');
			grad.addColorStop(0.1, 'rgba(255, 255, 0, 0.9)');
			grad.addColorStop(0.4, 'rgba(255, 120, 0, 0.75)');
			grad.addColorStop(0.6, 'rgba(255, 80, 0, 0.6)');
			grad.addColorStop(0.85, 'rgba(220, 0, 0, 0.4)');
			grad.addColorStop(1, 'rgba(180, 0, 0, 0)');
			ctx.fillStyle = grad;
			ctx.beginPath();
			ctx.arc(100, 100, 100, 0, Math.PI * 2);
			ctx.fill();
			this.image = surface;

			// アニメーション
			this.tl
			.scaleTo(1.3, 1.1, 4, enchant.Easing.EXP_EASEOUT)  // 急速拡大
				.scaleTo(1.5, 1.3, 21, enchant.Easing.SIN_EASEOUT)  // 減速拡大
				.and()
				.fadeOut(46)
				.then(() => now_scene.removeChild(this));

			// 火の粉を周囲に生成
			for (let i = 0; i < 7; i++) {
				setTimeout(() => this.spawnFireParticle(pos), 240 + i * 80);
			}

			// 煙を残す
			setTimeout(() => this.spawnSmoke(pos), 200);

			this.onenterframe = function(){
				if(WorldFlg){
					
					if(this.time < 3){
						this.processDamage();
					}
					this.time++;
				}
			}
			function sortBombExplosionsByY(scene) {
				const explosions = scene.childNodes.filter(child => child.name === 'BombExplosion');
				explosions.sort((a, b) => a.y - b.y); // y座標が小さい順にソート

				// 一度すべて削除して、順番に再追加
				explosions.forEach(explosion => {
					scene.removeChild(explosion);
					scene.addChild(explosion);
				});
			}
			now_scene.addChild(this);
			sortBombExplosionsByY(now_scene); // ← これを追加
		},

		spawnFireParticle: function(centerPos) {
			var size = Math.floor(Math.random() * 25) + 15;
			var half = size / 2;
			const flame = new Sprite(size, size);
			const s = new Surface(size, size);
			const ctx = s.context;
			const grad = ctx.createRadialGradient(half, half, 0, half, half, half);
			grad.addColorStop(0, 'rgba(255, 160, 0, 0.4)');
			grad.addColorStop(0.6, 'rgba(255, 100, 0, 0.3)');
			grad.addColorStop(1, 'rgba(180, 0, 0, 0.2)');
			ctx.fillStyle = grad;
			//ctx.fillStyle = 'rgba(255, 100, 0, 0.6)';
			ctx.beginPath();
			ctx.arc(half, half, half, 0, Math.PI * 2);
			ctx.fill();
			flame.image = s;

			const angle = Math.random() * Math.PI * 2;
			const dist = 40 + Math.random() * 60;
			const dx = Math.cos(angle) * dist;
			const dy = Math.sin(angle) * dist;

			flame.moveTo(centerPos.x + dx - half, centerPos.y + dy - size);
			flame.scaleX = flame.scaleY = 0.5;

			flame.tl
			.moveBy(dx / 10, dy / 20, 10)
			.and()
			.scaleTo(1.4, 1.4, 10, enchant.Easing.EXP_EASEOUT)
			.and()
			.fadeOut(30)
			.then(() => now_scene.removeChild(flame));

			now_scene.addChild(flame);
		},

		spawnSmoke: function(centerPos) {
			const smoke = new Sprite(240, 240);
			const s = new Surface(240, 240);
			const ctx = s.context;
			const grad = ctx.createRadialGradient(120, 120, 0, 120, 120, 120);
			grad.addColorStop(0, 'rgba(60,60,60,1)');
			grad.addColorStop(0.75, 'rgba(20,20,20,0.5)');
			grad.addColorStop(1, 'rgba(0,0,0,0)');
			ctx.fillStyle = grad;
			ctx.beginPath();
			ctx.arc(120, 120, 120, 0, Math.PI * 2);
			ctx.fill();

			smoke.image = s;
			smoke.moveTo(centerPos.x - 120, centerPos.y - 100);
			smoke.scaleX = smoke.scaleY = 0.7;
			smoke.opacity = 0.0

			smoke.tl
			.fadeIn(20)
			.and()
			.scaleTo(0.9, 0.7, 20, enchant.Easing.EXP_EASEOUT)
			.scaleTo(1.0, 0.8, 60, enchant.Easing.SIN_EASEOUT)
			.and()
			.fadeOut(180)
			.then(() => now_scene.MarkGroup.removeChild(smoke));

			now_scene.MarkGroup.addChild(smoke);
		},
		
		processDamage: function() {
			if(this.time == 0) this.damageNearbyTanks();
			this.destroyNearbyBlocks();
			this.destroyNearbyBombs();
		},

		destroyNearbyBlocks: function() {
			Block.collection.forEach(elem => {
				if (elem.within(this, 125)){
					elem._Destroy();
				}
			});
		},

		destroyNearbyBombs: function() {
			Bom.collection.forEach(elem => {
				if (elem.within(this, 125)) elem._Destroy();
			});
		},

		damageNearbyTanks: function() {
			// まず条件を満たす戦車をフィルタし、num降順にソート
			const targets = TankBase.collection
				.filter(elem => !deadFlgs[elem.num] && elem.weak.within(this, 125))
				.sort((a, b) => b.num - a.num);

			let cnt = 0;
			targets.forEach(elem => {
				if(elem.num != 0) cnt++;
				if(elem.num == 0 && destruction + cnt == tankEntity.length - 1) return;
				new ViewDamage(elem, 100, false);
				elem.life -= 100;
				elem.lifeBar.Change(elem.life);
				elem._DamageEffect();
			});
		}
	});

	var BulletExplosion = Class.create(Sprite, {
		initialize: function(from) {
			Sprite.call(this, 80, 80);   // ★ 80×80 に変更
			this.name = 'BombExplosion';
			this.time = 0;
			this.from = from;

			const pos = Get_Center(from);
			this.moveTo(pos.x - 40, pos.y - 40); // ★ 中心に合わせる
			this.scaleX = this.scaleY = 0.1;

			// ★ 80×80 用の爆風描画
			const surface = new Surface(80, 80);
			const ctx = surface.context;
			const grad = ctx.createRadialGradient(40, 40, 8, 40, 40, 40);
			grad.addColorStop(0, 'rgba(255, 255, 200, 1)');
			grad.addColorStop(0.1, 'rgba(255, 255, 0, 0.9)');
			grad.addColorStop(0.4, 'rgba(255, 120, 0, 0.75)');
			grad.addColorStop(0.6, 'rgba(255, 80, 0, 0.6)');
			grad.addColorStop(0.85, 'rgba(220, 0, 0, 0.4)');
			grad.addColorStop(1, 'rgba(180, 0, 0, 0)');
			ctx.fillStyle = grad;
			ctx.beginPath();
			ctx.arc(40, 40, 40, 0, Math.PI * 2);
			ctx.fill();
			this.image = surface;

			// ★ アニメーション（80×80 用に調整）
			this.tl
				.scaleTo(1.3, 1.3, 8, enchant.Easing.EXP_EASEOUT)
				.scaleTo(1.5, 1.5, 16, enchant.Easing.SIN_EASEOUT)
				.and()
				.fadeOut(24)
				.then(() => now_scene.removeChild(this));

			this.onenterframe = () => {
				if (WorldFlg && gameStatus == 0) {
					if (this.time < 2) this.processDamage();
					this.time++;
				}
			};

			now_scene.addChild(this);
		},

		// ★ 爆発範囲は半径40（80×80）
		processDamage: function() {
			const range = 50;
			this.damageNearbyTanks(range);
			this.destroyNearbyBlocks(range + 10);
			this.destroyNearbyBombs(range);
		},

		destroyNearbyBlocks: function(range) {
			Block.collection.forEach(elem => {
				if (elem.within(this, range)){
					elem._Destroy();
				}
			});
		},

		destroyNearbyBombs: function(range) {
			Bom.collection.forEach(elem => {
				if (elem.within(this, range)) elem._Destroy();
			});
		},

		damageNearbyTanks: function(range) {
			let damage = this.from.damage;
			if (this.time > 0){
				damage = 2;
				range += 20;
			}
			const targets = TankBase.collection
				.filter(elem => !deadFlgs[elem.num] && elem.weak.within(this, range))
				.sort((a, b) => b.num - a.num);

			let cnt = 0;
			targets.forEach(elem => {
				if (!elem.damFlg){
					if (elem.num != 0) cnt++;
					if (elem.num == 0 && destruction + cnt == tankEntity.length - 1) return;

					new ViewDamage(elem, damage, false);
					elem.life -= damage;
					elem.lifeBar.Change(elem.life);
					elem.damFlg = true;
					if (this.from.category == 9){
						elem.damTimeMax = 4;
					} 
					elem._DamageEffect();
					if (elem.category >= 12){
						elem._ResetStatus();
					}
				}
			});
		}
	});



	var TankBoom = Class.create(Sprite,{
		initialize: function(from){
			Sprite.call(this, 128, 128);
			this.image = createExplosionFrames(from.category);
			this.frame = 0;
			this.moveTo((from.x + from.width / 2) - this.width / 2, (from.y + from.height / 2) - this.height / 2);

			this.tl
				.then(function() {
					this.frame = 0;
				})
				.repeat(function() {
					this.frame++;
				}, 60)
				.then(function() {
					this.remove();
				});

			now_scene.SparkGroup.addChild(this);
		}
	})

	function createExplosionFrames(category) {
		const size = 128;
		const frames = 60;
		const surface = new Surface(size * frames, size);
		const ctx = surface.context;

		const debrisCount = 20;
		const debrisCount2 = 10;

		const rand = Math.random;
		const cos = Math.cos;
		const sin = Math.sin;
		const PI2 = Math.PI * 2;

		// -------------------------
		// 事前生成キャッシュ
		// -------------------------

		// debris
		const debris = Array.from({ length: debrisCount }, () => {
			const angle = rand() * PI2;
			const speed = 30 + rand() * 60;
			const vx = cos(angle) * speed + ((Math.floor(rand() * 9) - 4) * 5);
			const vy = sin(angle) * speed - 60;

			return {
				vx,
				vy,
				sizeW: 2 + rand() * 10,
				sizeH: 2 + rand() * 10,
				rotation: angle,
				// rgba の前半を事前生成
				color: `rgba(${150 + rand() * 100}, ${rand() * 80}, 0,`
			};
		});

		// カラーパレットの事前生成
		const palette = [
			() => `rgba(${10 + rand() * 40}, ${147 + rand() * 60}, 250,`,
			() => `rgba(250, ${100 + rand() * 40}, 0,`,
			() => `rgba(${rand() * 60}, ${rand() * 60}, ${rand() * 60},`,
			() => `rgba(0, ${150 + rand() * 40}, 20,`,
			() => `rgba(${155 + rand() * 100}, 0, 0,`,
			() => `rgba(${60 + rand() * 60}, ${30 + rand() * 30}, 30,`,
			() => `rgba(0, ${70 + rand() * 60}, 30,`,
			() => `rgba(${64 + rand() * 80}, 250, 250,`,
			() => `rgba(${160 + rand() * 40}, 0, ${rand() * 60},`,
			() => `rgba(250, ${150 + rand() * 30}, ${150 + rand() * 30},`,
			() => `rgba(250, 250, ${100 + rand() * 60},`,
			() => `rgba(${rand() * 60}, ${rand() * 30}, 0,`,
			() => `rgba(150, ${40 + rand() * 40}, 0,`,
			() => `rgba(0, 0, ${60 + rand() * 60},`
		];

		// debris2
		const debris2 = Array.from({ length: debrisCount2 }, () => {
			const angle = rand() * PI2;
			const speed = 50 + rand() * 30;
			const vx = cos(angle) * speed + ((Math.floor(rand() * 3) - 1) * 3);
			const vy = sin(angle) * speed - 75;

			const usePalette = rand() < 0.5;
			const color = usePalette
				? palette[category % palette.length]()
				: `rgba(${rand() * 60}, ${rand() * 30}, 0,`;

			return {
				vx,
				vy,
				sizeW: 10 + rand() * 10,
				sizeH: 10 + rand() * 10,
				rotation: angle,
				color
			};
		});

		// spikeCache（ランダムをすべて事前生成）
		const spikeCache = Array.from({ length: frames }, () =>
			Array.from({ length: 10 }, () => ({
				aOffset: rand() * 0.15,
				distOffset: rand() * 5,
				len: 18 + rand() * 10,
				wid: 3 + rand()
			}))
		);

		// -------------------------
		// フレーム描画
		// -------------------------
		for (let frame = 0; frame < frames; frame++) {
			const t = frame / (frames - 1);
			const alpha = 1 - t;

			const x = frame * size;
			const cx = x + size / 2;
			const cy = size / 2;

			ctx.save();

			// 光球
			if (frame < 15) {
				ctx.beginPath();
				ctx.fillStyle = `rgba(255,220,180,${0.7 * (1 - t * 4.5)})`;
				ctx.arc(cx, cy, 25 + frame * 2, 0, PI2);
				ctx.fill();
			}

			// スパイク
			if (frame < 40) {
				const spikes = spikeCache[frame];
				for (let i = 0; i < 10; i++) {
					const s = spikes[i];
					const a = (PI2 / 10) * i + s.aOffset;
					const dist = t * 55 + s.distOffset;

					const px = cx + cos(a) * dist;
					const py = cy + sin(a) * dist;

					ctx.save();
					ctx.translate(px, py);
					ctx.rotate(a);
					ctx.beginPath();
					ctx.fillStyle = `rgba(255, ${80 + rand() * 100}, 0, ${alpha - 0.2})`;
					ctx.ellipse(0, 0, s.wid, s.len, 0, 0, PI2);
					ctx.fill();
					ctx.restore();
				}
			}

			// 破片
			if (frame > 10) {
				const tvy = 120 * t;

				for (let d of debris) {
					const dx = cx + d.vx * t;
					const dy = cy + (d.vy + tvy) * t;

					ctx.save();
					ctx.translate(dx, dy);
					ctx.rotate(d.rotation);
					ctx.fillStyle = `${d.color}${alpha})`;
					ctx.fillRect(-d.sizeW / 2, -d.sizeH / 2, d.sizeW, d.sizeH);
					ctx.restore();
				}

				for (let d of debris2) {
					const dx = cx + d.vx * t;
					const dy = cy + (d.vy + tvy) * t;

					ctx.save();
					ctx.translate(dx, dy);
					ctx.rotate(d.rotation);
					ctx.fillStyle = `${d.color}${0.8 * alpha})`;
					ctx.fillRect(-d.sizeW / 2, -d.sizeH / 2, d.sizeW, d.sizeH);
					ctx.restore();
				}
			}

			// 煙
			if (frame > 10) {
				for (let i = 0; i < 5; i++) {
					const a = rand() * PI2;
					const d = 20 + t * 40 + rand() * 10;
					const px = cx + cos(a) * d;
					const py = cy + sin(a) * d;
					const r = 8 + rand() * 4;

					ctx.beginPath();
					ctx.fillStyle = `rgba(60,60,60,${0.5 * alpha})`;
					ctx.arc(px, py, r, 0, PI2);
					ctx.fill();
				}
			}

			ctx.restore();
		}

		return surface;
	}

	var Target = Class.create(Sprite, {
		initialize: function(from, scene) {
			Sprite.call(this, 40, 40);

			const speed = 32;
			this.num = from.num;
			this.rotation = 0;
			this.originX = this.originY = 20;

			if (DebugFlg) this.debugColor = "yellow";
			this.moveTo(from.x, from.y);

			this.onenterframe = () => {
				if (!WorldFlg || deadFlgs[this.num] || from.attackTarget == null) return;

				const target = from.attackTarget;
				const isBullet = target.name === 'Bullet';
				const dxScale = isBullet ? 0.8 : 0.25;
				const dyScale = isBullet ? 0.8 : 0.25;

				const rad = (target.rotation - 90) * Math.PI / 180;
				const dx = Math.cos(rad) * (target.width * dxScale);
				const dy = Math.sin(rad) * (target.height * dyScale);

				this.rotation = -1 * (45 + Math.atan2(dx, dy) * 180 / Math.PI);

				if (this.intersectStrict(target)) {
					const tx = target.x + target.width / 2 + dx - this.width / 2;
					const ty = target.y + target.height / 2 + dy - this.height / 2;
					this.moveTo(tx, ty);
				} else {
					const tx = target.x + target.width / 2;
					const ty = target.y + target.height / 2;
					const cx = this.x + this.width / 2;
					const cy = this.y + this.height / 2;
					const vecRad = Math.atan2(ty - cy, tx - cx);
					this.moveTo(this.x + Math.cos(vecRad) * speed, this.y + Math.sin(vecRad) * speed);
				}
			};

			scene.addChild(this);
		}
	});

	var Smoke = Class.create(Sprite, {
		initialize: function(from) {
			Sprite.call(this, 12, 12);
			//this.backgroundColor = "#aaa";
			this.time = 0;
			let value = 0.5;
			this.opacity = value;
			this.moveTo(from.x - 3.5, from.y - 1);

			var image = new Surface(this.width, this.height);
			image.context.beginPath();
			image.context.fillStyle = 'rgba(192, 192, 192, 1)';
			image.context.arc(this.width / 2, this.width / 2, this.width / 2, 0, Math.PI * 2, true);
			image.context.fill();

			this.image = image;

			this.onenterframe = function() {
				if (WorldFlg) {
					this.time++
					if (this.time % 4 == 0) {
						if (value < 0.1) now_scene.FireGroup.removeChild(this);
						value -= 0.05;
						this.opacity = value;
						this.rotation = from.rotation

						//if(value < 0) scene.removeChild(this);
					}
				}

			}
			now_scene.FireGroup.addChild(this);
		}
	});

	var Fire = Class.create(Sprite, {
		initialize: function(from) {
			Sprite.call(this, 12, 12);

			// --- shotSpeed による色と初期透明度 ---
			const fastShot = from.from.shotSpeed > 20;
			this.backgroundColor = fastShot ? "#8cf" : "#f20";
			this.opacity = fastShot ? 1.0 : 0.8;
			this.time = 0;

			// --- 乱数オフセット（軽量化 & 一時オブジェクトなし） ---
			let randOffset = 0;
			if (!fastShot) {
				// -3〜3 の整数を高速生成し、5倍
				randOffset = (((Math.random() * 7) | 0) - 3) * 5;
			}

			// --- 角度計算（無駄な一時変数を作らない） ---
			const rad = Rot_to_Rad(from.rotation + 90 + randOffset);
			const dx = Math.cos(rad) * 9;
			const dy = Math.sin(rad) * 9;

			// --- 座標計算（オブジェクト生成なし） ---
			const f = Get_Center(from);
			const x = f.x - 6 + dx;
			const y = f.y - 6 + dy;

			this.rotation = from.rotation;
			this.moveTo(x, y);

			// --- onenterframe（クロージャ変数を使わず JIT 最適化しやすい） ---
			this.onenterframe = function() {
				if (!WorldFlg) return;

				this.time++;
				this.opacity -= 0.1;

				// 透明度が下がったら即削除（余計な更新をしない）
				if (this.opacity <= 0.1) {
					now_scene.FireGroup.removeChild(this);
				}
			};

			now_scene.FireGroup.addChild(this);
		}
	});

	var TouchFire = Class.create(Sprite, {
		initialize: function(from) {
			Sprite.call(this, 24, 24);

			const fastShot = from.from.shotSpeed > 20;
			this.backgroundColor = fastShot ? "#44f" : "#f30";

			this.time = 0;
			this.opacity = 0.8;

			// --- 角度計算（無駄な一時変数なし） ---
			const rad = Rot_to_Rad(from.rotation - 90);
			const dx = Math.cos(rad) * 3;
			const dy = Math.sin(rad) * 3;

			const f = Get_Center(from);
			const x = f.x - 12 + dx;
			const y = f.y - 12 + dy;

			this.rotation = from.rotation;
			this.moveTo(x, y);

			// --- onenterframe（クロージャ変数を使わない） ---
			this.onenterframe = function() {
				if (!WorldFlg) return;

				this.time++;
				this.opacity -= 0.1;
				this.rotation += this.time;

				if (this.opacity <= 0.1) {
					now_scene.FireGroup.removeChild(this);
				}
			};

			now_scene.FireGroup.addChild(this);
		}
	});

	var OpenFire = Class.create(Sprite, {
		initialize: function(from) {
			Sprite.call(this, 24, 24);

			this.backgroundColor = "#f40";
			this.time = 0;
			this.opacity = 1.0;

			// --- 角度計算 ---
			const rad = Rot_to_Rad(from.rotation - 90);
			const dx = Math.cos(rad) * 40;
			const dy = Math.sin(rad) * 40;

			const f = Get_Center(from);
			const x = f.x - 12 + dx;
			const y = f.y - 12 + dy;

			this.rotation = from.rotation;
			this.moveTo(x, y);

			// --- onenterframe（軽量化） ---
			this.onenterframe = function() {
				if (!WorldFlg) return;

				// scale 計算を簡略化
				const v = this.opacity;
				const s = 1 - (v / 2);
				this.scaleX = s;
				this.scaleY = s;

				// 移動
				this.x += Math.cos(rad) * 3;
				this.y += Math.sin(rad) * 3;

				// 透明度減少
				this.opacity -= 0.1;

				if (this.opacity <= 0.1) {
					now_scene.FireGroup.removeChild(this);
				}
			};

			now_scene.FireGroup.addChild(this);
		}
	});

	var Flash = Class.create(Sprite, {
		initialize: function(target) {
			Sprite.call(this, 60, 60);
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
			this.moveTo(target.x, target.y);
			this.onenterframe = function() {
				if (WorldFlg) {
					this.time++;
					if (this.time % 2 == 0 && this.opacity > 0) {
						this.opacity -= 0.1;
						this.scaleX += 0.1;
						this.scaleY += 0.08;
					}
					if (this.opacity <= 0) {
						now_scene.removeChild(this);
					}
				}

			}
			now_scene.addChild(this);
		}
	})

	var Spark = Class.create(Sprite, {
		initialize: function(from) {
			Sprite.call(this, 1, 6);
			let rot = from.rotation;

			var rad = Rot_to_Rad(from.rotation - 90);

			this.moveTo(((from.x + from.width / 2)) + Math.cos(rad) * (10), ((from.y + from.height / 2)) + Math.sin(rad) * (10));

			this.rotation = (rot) + (Math.floor(Math.random() * 120) - 60);
			let v = Rot_to_Vec(this.rotation, 90);
			this.dx = v.x * 3;
			this.dy = v.y * 3;
			this.x += this.dx;
			this.y += this.dy;
			//this.moveTo(v.x,v.y);
			this.backgroundColor = '#ff9';
			this.opacity = 1.0;
			this.scale(2.0, 2.0);
			this.onenterframe = function() {
				this.opacity -= 0.1;
				this.x += this.dx;
				this.y += this.dy;
				if (this.opacity < 0) {
					now_scene.SparkGroup.removeChild(this);
				}
			}
			now_scene.SparkGroup.addChild(this);
		}
	})

	function Spark_Effect(from) {
		new Spark(from);
		new Spark(from);
		new Spark(from);
		new Spark(from);
		new Spark(from);
	}

	var LifeBar = Class.create(Sprite, {
		initialize: function(from, max) {
			Sprite.call(this, 64, 8);
			this.from = from;
			this.max = max;
			var image = new Surface(64, 8);
			image.context.fillStyle = 'rgba(0, 255, 0, 1)';
			image.context.fillRect(0, 0, 64, 8);
			image.context.lineWidth = 4;
			image.context.strokeStyle = 'rgba(180, 180, 180, 1)';
			image.context.strokeRect(0, 0, 64, 8);
			this.image = image;

			this.onenterframe = function() {
				this.moveTo(from.x - 2, from.y - 32);
			}

			now_scene.addChild(this);
		},
		Change: function(life) {
			var percent = (life / this.max);
			//console.log(percent);
			var barSize = Math.round(64 * percent);
			var image = new Surface(64, 64);
			image.context.fillStyle = 'rgba(32, 32, 32, 0.5)';
			image.context.fillRect(0, 0, 64, 8);
			if (percent > 0.5) {
				image.context.fillStyle = 'rgba(0, 255, 0, 1)';
			} else if (percent > 0.25) {
				image.context.fillStyle = 'rgba(255, 255, 0, 1)';
			} else {
				image.context.fillStyle = 'rgba(255, 0, 0, 1)';
			}

			image.context.fillRect(0, 0, barSize, 8);
			image.context.lineWidth = 4;
			image.context.strokeStyle = 'rgba(180, 180, 180, 1)';
			image.context.strokeRect(0, 0, 64, 8);
			this.image = image;
		},
		Reset: function(from, max) {
			this.max = max;
			var percent = (from.life / this.max);
			//console.log(percent);
			var barSize = Math.round(64 * percent);
			var image = new Surface(64, 64);
			image.context.fillStyle = 'rgba(32, 32, 32, 0.5)';
			image.context.fillRect(0, 0, 64, 8);
			if (percent > 0.5) {
				image.context.fillStyle = 'rgba(0, 255, 0, 1)';
			} else if (percent > 0.25) {
				image.context.fillStyle = 'rgba(255, 255, 0, 1)';
			} else {
				image.context.fillStyle = 'rgba(255, 0, 0, 1)';
			}
			image.context.fillRect(0, 0, barSize, 8);
			image.context.lineWidth = 4;
			image.context.strokeStyle = 'rgba(180, 180, 180, 1)';
			image.context.strokeRect(0, 0, 64, 8);
			this.image = image;
		}
	})

	var InterceptAround = Class.create(Sprite, {
		initialize: function(from) {
			Sprite.call(this, 96, 96);
			//this.backgroundColor = "#0ff2";
			this.rotation = 45;
			this.onenterframe = function() {
				let f = Get_Center(from);
				//this.moveTo(area.x - 48 + 32, area.y - 48 + 30);
				this.moveTo(f.x - this.width / 2, f.y - this.height / 2);
				this.rotation = from.rotation + 45;
			}
			now_scene.addChild(this);
		}
	});

	var InterceptFront = Class.create(Sprite, {
		initialize: function(from) {
			Sprite.call(this, 8, from.height / 2);
			this.debugColor = "#0f0";

			let rad;
			this.onenterframe = function() {
				rad = Rot_to_Rad(from.rotation + 90);
				this.moveTo((from.x + (from.width / 2) - this.width / 2) + Math.cos(rad) * (-from.height / 4), (from.y + (from.height / 2) - this.height / 2) + Math.sin(rad) * (-from.height / 4));
				this.rotation = from.rotation;
			}
			now_scene.addChild(this);
		}
	});

	// ------------------------------------------------------
	// 数値版の DIRS（文字列 move はそのまま）
	// ------------------------------------------------------
	const DIRS = [
		{ dy: -1, dx: 0, move: "North" },
		{ dy: 0, dx: 1, move: "East" },
		{ dy: 1, dx: 0, move: "South" },
		{ dy: 0, dx: -1, move: "West" }
	];

	// ------------------------------------------------------
	// locationStatusFast（文字列比較 → 数値比較で高速化）
	// grid[y][x] は 0=Empty, 1=Obstacle, 2=Goal, 3=Start
	// ------------------------------------------------------
	const locationStatusFast = (y, x, grid) => {
		if (y < 0 || y >= Stage_H || x < 0 || x >= Stage_W) return 0;

		const cell = grid[y][x];
		// 0=Empty, 3=Start → 通行可
		if (cell === 0 || cell === 3) return 2;
		// 2=Goal
		if (cell === 2) return 3;
		// 1=Obstacle
		return 1;
	};

	// ------------------------------------------------------
	// reconstructPathFast（reverse を使わない高速版）
	// ------------------------------------------------------
	const reconstructPathFast = (idx) => {
		const path = [];
		let p = idx;

		while (qParent[p] !== -1) {
			path[path.length] = qMove[p];
			p = qParent[p];
		}

		// reverse しないと順番が逆なので reverse 必須
		// ただし path.length が小さいのでコストは軽い
		path.reverse();
		return path;
	};

	// ------------------------------------------------------
	// BFS（findShortestPath）
	// ------------------------------------------------------
	const findShortestPath = (startCoordinates, grid, scene, goalCoordinates = null) => {
		const startY = startCoordinates[0];
		const startX = startCoordinates[1];

		let goalY = null, goalX = null;
		if (goalCoordinates) {
			goalY = goalCoordinates[0];
			goalX = goalCoordinates[1];
		}

		searchId++;

		let head = 0;
		let tail = 0;

		qy[0] = startY;
		qx[0] = startX;
		qParent[0] = -1;
		visited[startY][startX] = searchId;

		while (head <= tail) {
			const y = qy[head];
			const x = qx[head];
			const curIndex = head;
			head++;

			// ゴール指定あり
			if (goalCoordinates && y === goalY && x === goalX) {
				return reconstructPathFast(curIndex);
			}

			// ゴール指定なし
			if (!goalCoordinates && grid[y][x] === 2) { // 2=Goal
				return reconstructPathFast(curIndex);
			}

			for (let i = 0; i < 4; i++) {
				const ny = y + DIRS[i].dy;
				const nx = x + DIRS[i].dx;

				if (ny < 0 || ny >= Stage_H || nx < 0 || nx >= Stage_W) continue;
				if (visited[ny][nx] === searchId) continue;

				const status = locationStatusFast(ny, nx, grid);
				if (status === 0 || status === 1) continue;

				visited[ny][nx] = searchId;

				tail++;
				qy[tail] = ny;
				qx[tail] = nx;
				qParent[tail] = curIndex;
				qMove[tail] = DIRS[i].move;
			}
		}

		return false;
	};

	// ------------------------------------------------------
	// 可視判定（高速版）
	// ------------------------------------------------------
	const isVisibleFast = (fromY, fromX, toY, toX, grid) => {
		let x0 = fromX, y0 = fromY;
		const x1 = toX, y1 = toY;

		const dx = Math.abs(x1 - x0);
		const dy = Math.abs(y1 - y0);
		const sx = x0 < x1 ? 1 : -1;
		const sy = y0 < y1 ? 1 : -1;

		let err = dx - dy;

		for (;;) {
			if (grid[y0][x0] === 1) return false; // obstacle

			if (x0 === x1 && y0 === y1) return true;

			const e2 = err << 1;

			if (e2 > -dy) {
				err -= dy;
				x0 += sx;
			}
			if (e2 < dx) {
				err += dx;
				y0 += sy;
			}
		}
	};

	// ------------------------------------------------------
	// findVisibleAccessibleTile（内部最適化）
	// ------------------------------------------------------
	const findVisibleAccessibleTile = (goal, grid, map, start, scene) => {
		const goalY = goal[0];
		const goalX = goal[1];

		const startY = start[0];
		const startX = start[1];

		let bestLen = Infinity;
		let bestPath = null;

		const minY = Math.max(0, goalY - 8);
		const maxY = Math.min(Stage_H - 1, goalY + 8);
		const minX = Math.max(0, goalX - 8);
		const maxX = Math.min(Stage_W - 1, goalX + 8);

		for (let y = minY; y <= maxY; y++) {
			for (let x = minX; x <= maxX; x++) {

				// 通行不可
				if (grid[y][x] !== 0) continue;

				// マンハッタン距離
				const dist = Math.abs(x - goalX) + Math.abs(y - goalY);
				if (dist > 8) continue;

				// pruning
				if (dist >= bestLen) continue;

				// 可視判定
				if (!isVisibleFast(y, x, goalY, goalX, grid)) continue;

				// BFS
				const path = findShortestPath(start, grid, scene, [y, x]);
				if (!path) continue;

				if (path.length < bestLen) {
					bestLen = path.length;
					bestPath = path;
				}
			}
		}

		return bestPath;
	};

	// ------------------------------------------------------
	// getPathToGoalOrVisibleTile（構造そのまま）
	// ------------------------------------------------------
	const getPathToGoalOrVisibleTile = (start, goal, grid, map, scene) => {
		let path = findShortestPath(start, grid, scene, null);
		if (!path) {
			path = findVisibleAccessibleTile(goal, grid, map, start, scene);
		}
		return path && path.length > 0 ? path : false;
	};


	//	戦車の親クラス
	var TankBase = Class.create(Sprite, {
		initialize: function (x, y, category, num, scene) {
			Sprite.call(this, PixelSize - 4, PixelSize - 4);
			this.name = "Entity";
			this.time = 0;
			this.num = num;
			this.x = x * PixelSize + 2;
			this.y = y * PixelSize - 18;
			this.category = category;

			//	ステータス管理用
			this.life       = Categorys.Life[this.category];
			this.shotSpeed  = Categorys.ShotSpeed[this.category];
			this.fireLate   = Categorys.FireLate[this.category];
			this.ref        = Categorys.MaxRef[this.category];
			this.bulMax     = Categorys.MaxBullet[this.category];
			this.bomMax     = Categorys.MaxBom[this.category];
			this.moveSpeed  = Categorys.MoveSpeed[this.category];
			this.reload     = Categorys.Reload[this.category];
			this.bodyRotSpeed = Categorys.BodyRotSpeed[this.category];
			this.distance   = Categorys.Distances[this.category];

			this.bomSetFlg    = false;
			this.bomReload    = 0;
			this.bulReloadFlg = false;
			this.bulReloadTime = 0;
			this.shotNGflg    = false;
			this.moveFlg      = true;

			//	被弾状態管理用
			this.damFlg    = false;
			this.damTime   = 0;
			this.damTimeMax = (this.num === 0 || this.category === 0) ? 90 : 30;
			this.damCng    = false;

			//	射撃可否管理用
			this.fireFlg   = false;
			this.escapeFlg = false;

			//	射撃後一時停止用
			this.shotStopFlg = false;
			this.shotStopTime = 0;

			//	一斉射撃用
			this.fullFireFlg = false;
			this.firecnt = 0;

			//	座標管理用
			this.myPath = [0, 0];
			this.targetPath = [0, 0];

			//	経路探索用
			this.map = Object.assign({}, scene.backgroundMap);
			this.grid = JSON.parse(JSON.stringify(scene.grid));
			this.root;
			
			this.rot = 0;
			this.dirValue = 0;
			this.hittingTime = 0;
			this.moveRandom = 1;

			this.waitFrame = 0;

			//	追加ステータス付与
			if (gameMode > 0) {
				switch (this.category) {
					case 1:
						this.shotSpeed += 2;
						this.bulMax    += 2;
						break;
					case 2:
						this.shotSpeed += 1;
						this.bulMax    += 1;
						this.moveSpeed += 0.5;
						break;
					case 3:
						this.moveSpeed += 0.5;
						this.bulMax    += 1;
						this.ref        = 1;
						this.reload    += 90;
						break;
					case 4:
						this.shotSpeed += 1;
						this.bulMax    += 1;
						break;
					case 5:
						this.moveSpeed += 0.5;
						this.shotSpeed += 1;
						this.bulMax    += 1;
						this.fireLate   = 24;
						break;
					case 6:
						this.bulMax    += 1;
						break;
					case 7:
						this.moveSpeed += 0.5;
						this.reload    -= 240;
						break;
					case 8:
						this.moveSpeed += 0.5;
						this.fireLate  -= 8;
						this.bulMax    += 1;
						this.CannonRotSpeed += 4;
						break;
					case 9:
						this.fireLate  -= 2;
						break;
					case 10:
						this.fireLate  -= 12;
						this.moveSpeed += 0.5;
						this.bomMax    += 1;
						break;
					case 11:
						this.bulMax    += 1;
						this.fireLate   = 30;
						break;
				}
			}

			this.tank   = new Tank(this, this.category);
			this.cannon = new Cannon(this, this.category);
			this.weak   = new Weak(this, this.num);

			this.tank.scale.apply(this.tank, Categorys.BodyScale[this.category]);
			this.cannon.scale.apply(this.cannon, Categorys.CannonScale[this.category]);
			if (gameMode == 2){
				this.weak.scale(0.6, 0.6);
			}else{
				this.weak.scale.apply(this.weak, Categorys.WeakScale[this.category]);
			}

			this.tankFrame = TankFrame(this, this.num, scene);

			this.lifeBar = new LifeBar(this, this.life);

			bullets.push(0);
			bulStack.push([]);
			boms.push(0);
			deadFlgs.push(false);
			deadTank[this.num] = false;

			scene.addChild(this);
		},

		_Dead: function () {
			deadFlgs[this.num] = true;
			deadTank[this.num] = true;
			if (this.num !== 0) {
				tankColorCounts[this.category]--;
			}
			setTimeout(() => {
				new Mark(this);
				new TankBoom(this);
			}, 0);

			setTimeout(() => {
				this.moveTo(-100 * (this.num + 1), -100 * (this.num + 1));
			}, 0);
			/*new Mark(this);
			new TankBoom(this);
			this.moveTo(-100 * (this.num + 1), -100 * (this.num + 1));*/
		},

		_Rotation: function (rot) {
			if (rot < 0) rot += 360;

			let sa = this.rotation - rot;
			if (Math.abs(sa) >= 180) sa *= -1;

			const currentRot = this.rotation % 360;
			const diff = Math.abs(currentRot - rot);
			const speed = this.bodyRotSpeed;

			let rotating = false; // ← 旋回中かどうかを記録する

			// -------------------------
			// this.rotation の処理（元の構造）
			// -------------------------
			if (diff === 0 || diff === 180) {
				this.rotation = rot;

				if (diff === 180) this.waitFrame = 5;

				if (this.waitFrame > 0) {
					this.waitFrame--;
					rotating = true; // ← 旋回中扱い
				} else {
					this.waitFrame = 0;
				}
			} else {
				if (Math.abs(sa) > speed) {
					const rotmove = sa > 0 ? -speed : speed;
					this.rotation += rotmove;

					if (this.rotation < 0) this.rotation += 360;
					else if (this.rotation > 359) this.rotation -= 360;

					rotating = true; // ← 旋回中扱い
				} else {
					if (sa !== 0) this.rotation = rot;
				}
			}

			// -------------------------
			// tank.rotation の追従処理（常に実行する）
			// -------------------------
			let tankRot = this.tank.rotation % 360;
			let bodyRot = this.rotation % 360;

			let tdiff = bodyRot - tankRot;
			if (tdiff > 180) tdiff -= 360;
			if (tdiff < -180) tdiff += 360;

			// 180°差なら tank.rotation は動かさない
			if (Math.abs(tdiff) !== 180) {
				const tankSpeed = this.bodyRotSpeed;

				if (Math.abs(tdiff) > tankSpeed) {
					tankRot += (tdiff > 0 ? tankSpeed : -tankSpeed);
				} else {
					tankRot = bodyRot;
				}

				if (tankRot < 0) tankRot += 360;
				if (tankRot > 359) tankRot -= 360;
			}

			this.tank.rotation = tankRot;

			// -------------------------
			// 旋回中なら false を返す
			// -------------------------
			return !rotating;
		},

		_Move: function (rot) {
			if (this._Rotation(rot)) {
				let currentRot = this.rotation % 360;
				let targetRot  = rot % 360;
				let diff       = Math.abs(currentRot - targetRot);

				// 移動方向を決定
				rot = (diff === 180) ? currentRot + 90 : currentRot - 90;
				if (rot < 0) rot += 360;
				else if (rot > 359) rot -= 360;

				const speed = this.moveSpeed;
				const rad   = Rot_to_Rad(rot);
				const dx    = Math.cos(rad) * speed;
				const dy    = Math.sin(rad) * speed;

				this.moveBy(dx, dy);
				this.moveFlg = true;
			} else {
				this.moveFlg = false;
			}
			return this.moveFlg;
		},

		_Damage: function () {
			if (this.damFlg) {
				this._DamageEffect();
				return false;
			}

			const hits = Bullet.intersectStrict(this.weak);
			if (!hits.length) {
				this._DamageEffect();
				return false;
			}

			const elem = hits[0];
			const from = elem.from;

			const damageSound = game.assets['./sound/mini_bomb2.mp3'].clone();
			damageSound.play();

			let damValue = Math.round(from.shotSpeed * ((elem.scaleX + elem.scaleY) / 2));
			if (from.category === 11){
				damValue = damValue - 4;
			}
			let randomPercent = Categorys.Critical[this.category];

			if (this.num != 0 && gameMode === 2) {
				randomPercent = 4;
			}

			const isCritical = (Math.floor(Math.random() * randomPercent) === 0);
			if (isCritical) damValue *= 2;

			this.life -= damValue;
			new ViewDamage(this, damValue, isCritical);

			from._Destroy();

			if (this.life > 0) {
				this.lifeBar.opacity = 1.0;
				this.lifeBar.Change(this.life);
				damageSound.volume = 0.5;
				this.damFlg = true;
			}

			this._DamageEffect();
			return true;
		},

		_DamageEffect: function () {
			if (!this.damFlg) return;

			const visible = !this.damCng;
			this.tank.opacity   = visible ? 1.0 : 0.0;
			this.cannon.opacity = visible ? 1.0 : 0.0;

			if (this.damTime % 5 === 0) this.damCng = !this.damCng;

			this.damTime++;
			if (this.damTime <= this.damTimeMax) return;

			this.damFlg  = false;
			this.damCng  = false;
			this.damTime = 0;
			this.damTimeMax = (this.num === 0 || this.category === 0) ? 90 : 30;

			if (this.category === 7 && this.num > 0) {
				new Flash(this);
				this.tank.opacity   = 0.0;
				this.cannon.opacity = 0.0;
				this.lifeBar.opacity = 0;
			} else {
				this.tank.opacity   = 1.0;
				this.cannon.opacity = 1.0;
			}
		}
	});


	//	自機型
	var Entity_Type0 = Class.create(TankBase, {
		initialize: function(x, y, category, num, scene) {
			TankBase.call(this, x, y, category, num, scene);
			let my = this;
			this.cursor = new Cursor(scene);

			if (this.moveSpeed < 2.0) {
				this.moveSpeed = 2.0;
			}

			if (this.bomMax == 0) {
				this.bomMax = 1;
			}

			if (this.category == 1 || this.category == 6){
				this.reload *= 5;
			}else if (this.category != 9){
				this.reload /= 2;
			}

			if (playerLife != 0) {
				if ((playerLife % Categorys.Life[this.category]) <= (Categorys.Life[this.category] - 5)) {
					this.life = playerLife + 5;
					this.lifeBar.Change(this.life);
				} else {
					playerLife = 0;
				}
			}

			this.aim = playerType == 1 || playerType == 6 ?
				new AimLite(this.cannon, this.cursor, this.category, this.num, this.ref) :
				new AimLite(this.cannon, this.cursor, this.category, this.num, 0);

			this.firstFireFlg = false;

			for (var i = 0; i < this.bulMax; i++) {
				bulStack[this.num].push(false); //  弾の状態をoff
			}

			if (!navigator.userAgent.match(/iPhone|iPad|Android/)) {
				scene.addEventListener('touchstart', function() {
					if (my.category == 9 && (my.fullFireFlg || my.firecnt > 0 || bullets[num] > 0) || my.shotNGflg) return;
					my._Attack();
				})
			}

			this.onenterframe = function() {
				if (!deadFlgs[this.num] && gameStatus == 0) {
					if (this.life > 0) {
						if (WorldFlg) {
							this.time++;
							
							this._Damage();

							if ((inputManager.checkButton("A") == inputManager.keyStatus.DOWN)) {
								if (this.category == 9 && (this.fullFireFlg || this.firecnt > 0 || bullets[num] > 0) || this.shotNGflg) return;
								if (this.shotNGflg) return;
								this._Attack();
							}

							if ((inputManager.checkButton("B") == inputManager.keyStatus.DOWN) && !this.bomSetFlg && boms[this.num] < this.bomMax) {
								new Bom(this, this.num, boms[this.num])._SetBom();
								this.bomReload = 0;
								this.bomSetFlg = true;
							}

							//  爆弾が設置された場合の処理
							if (this.bomSetFlg) {
								this.bomReload++;
								if (this.bomReload > 10) { //  1秒後再設置可能にする
									this.bomSetFlg = false;
								}
							}

							if (this.shotStopFlg) {
								this.shotStopTime++;
								if (this.shotStopTime > 10) {
									this.shotStopFlg = false;
									this.shotStopTime = 0;
								}
							}

							/*let aim = playerType == 1 || playerType == 6 ?
								new PlayerRefAim(this.ref, this.cannon, this.cursor, this.category, this.num) :
								new Aim(this.cannon, this.cursor, this.category, this.num);
							if (this.bulReloadFlg){
								aim.image = RedAimSurfaceCache;
							}*/
							
							// AimLite を毎フレーム更新 & 描画
							if (this.bulReloadFlg){
								this.aim.debugColor = "rgba(255, 0, 0, 0.4)";
							}
							else{
								this.aim.debugColor = "rgba(170, 255, 255, 0.3)";
							}

							if (this.category == 9) {
								if (this.bulReloadFlg == false) {
									if (bullets[this.num] == this.bulMax || this.firecnt >= this.bulMax) {
										this.bulReloadFlg = true;
									}
								} else {
									if (this.bulReloadTime < this.reload) {
										this.bulReloadTime++;
										if (this.shotNGflg == false) this.shotNGflg = true;
									} else {
										if (bullets[this.num] <= 0){
											this.shotNGflg = false;
											this.bulReloadFlg = false;
											this.bulReloadTime = 0;
											this.fullFireFlg = false;
											this.firecnt = 0;
											this.firstFireFlg = false;
										}
									}

								}

								if (this.fullFireFlg && this.firecnt >= 0 && !this.shotNGflg) {
									if (!this.firstFireFlg) {
										this.firstFireFlg = true;
										this.time = 0;
									} else {
										if (this.time % this.fireLate == 0) {
											this._Attack();
										}
									}
								}
							}
							else if (this.category > 0){
								if (this.bulReloadFlg == false) {
									if (bullets[this.num] == this.bulMax) this.bulReloadFlg = true;
								} else {
									if (this.bulReloadTime < this.reload) {
										this.bulReloadTime++;
										if (this.shotNGflg == false) this.shotNGflg = true;
									} else {
										if (bullets[this.num] <= 0){
											this.shotNGflg = false;
											this.bulReloadFlg = false;
											this.bulReloadTime = 0;
										}
									}

								}
							}

							if (!this.shotStopFlg) {
								switch (inputManager.checkDirection()) {
									case inputManager.keyDirections.UP:
										this.rot = 0;
										this._Move(this.rot);
										break;
									case inputManager.keyDirections.UP_RIGHT:
										this.rot = 45
										this._Move(this.rot);
										break;
									case inputManager.keyDirections.RIGHT:
										this.rot = 90;
										this._Move(this.rot);
										break;
									case inputManager.keyDirections.DOWN_RIGHT:
										this.rot = 135
										this._Move(this.rot);
										break;
									case inputManager.keyDirections.DOWN:
										this.rot = 180;
										this._Move(this.rot);
										break;
									case inputManager.keyDirections.DOWN_LEFT:
										this.rot = 225
										this._Move(this.rot);
										break;
									case inputManager.keyDirections.LEFT:
										this.rot = 270;
										this._Move(this.rot);
										break;
									case inputManager.keyDirections.UP_LEFT:
										this.rot = 315
										this._Move(this.rot);
										break;
									default:
										break;
								}
							}


							TankObstracle.intersect(this).forEach(elem => {
								if (!deadFlgs[elem.num] && elem.num != this.num) {
									switch (elem.name) {
										case 'TankTop':
											this.moveTo(this.x, elem.y - 60);
											break;
										case 'TankBottom':
											this.moveTo(this.x, elem.y + (elem.height));
											break;
										case 'TankLeft':
											this.moveTo(elem.x - 60, this.y);
											break;
										case 'TankRight':
											this.moveTo(elem.x + (elem.width), this.y);
											break;
									}
								}
							})

							Obstracle.intersect(this).forEach(elem => {
								switch (elem.name) {
									case 'ObsTop':
										this.moveTo(this.x, elem.y - 60);
										break;
									case 'ObsBottom':
										this.moveTo(this.x, elem.y + (elem.height))
										break;
									case 'ObsLeft':
										this.moveTo(elem.x - 60, this.y)
										break;
									case 'ObsRight':
										this.moveTo(elem.x + (elem.width), this.y)
										break;
								}
							})
						}
					} else {
						zanki--;
						this._Dead();
					}
				}
			}
		},
		_Attack: function() {
			if (WorldFlg && gameStatus == 0) { //  処理しても良い状態か
				if (bullets[this.num] < this.bulMax && deadFlgs[this.num] == false) { //  発射最大数に到達していないか＆死んでいないか
					let stack = bulStack[this.num];
					for (let i = 0; i < this.bulMax; i++) {
						if (!stack[i]) { //  弾の状態がoffならば
							this.shotStopFlg = true;
							
							if (this.category == 9) {
								new PhysBulletCol(this.shotSpeed, this.ref, this.cannon, this.category, this.num, i, this.cursor)._Shot();
								this.fullFireFlg = true;
								this.firecnt++;
							}
							else if (this.category == 13 && bullets[this.num] % 2 == 0){
								new PhysBulletCol(this.shotSpeed, this.ref, this.cannon, this.category, this.num, i, this.cursor)._Shot();
							}
							else{
								new BulletCol(this.shotSpeed, this.ref, this.cannon, this.category, this.num, i)._Shot();
							}
							break;
						}
					}

				}
			}
		}
	});

	//	最短追尾型
	var Entity_Type1 = Class.create(TankBase, {
		initialize: function (x, y, category, num, scene) {
			TankBase.call(this, x, y, category, num, scene);

			this.around = new InterceptAround(this);
			this.front = new InterceptFront(this.cannon);
			this.target = tankEntity[0];

			this.attackTarget = this.target;
			this.escapeTarget = null;

			this.cursor = new Target(this, scene);

			this.tankStopFlg = false;

			let moveCnt = 0;
			let moveCmp = 64;
			let returnFlg = false;

			let cflg = false;

			// 1秒ごとに更新されるキャッシュ
			this.cachedGrid = null;
			this.cachedCollision = null;
			this.lastGridUpdate = -9999;


			for (let i = 0; i < this.bulMax; i++) {
				bulStack[this.num].push(false);
			}

			const EnemyAim = Class.create(Aim, {
				initialize: function (cannon, cursor, category, num) {
					Aim.call(this, cannon, cursor, category, num, scene);
				}
			});

			const getGridCoord = (entity) => [
				Math.floor((entity.y + entity.height / 2) / PixelSize),
				Math.floor((entity.x + entity.width / 2) / PixelSize)
			];

			const directionMap = {
				East:  { rot: 90,  dx: 1, dy: 0 },
				West:  { rot: 270, dx: -1, dy: 0 },
				North: { rot: 0,   dx: 0, dy: -1 },
				South: { rot: 180, dx: 0, dy: 1 }
			};

			const obstacleOffsets = {
				0:   [-1, 0],
				90:  [0, 1],
				180: [1, 0],
				270: [0, -1]
			};

			const collisionHandlers = {
				0:   { frame: 0, dx: 0, dy: 1 },
				180: { frame: 1, dx: 0, dy: -1 },
				270: { frame: 2, dx: 1, dy: 0 },
				90:  { frame: 3, dx: -1, dy: 0 }
			};

			const updateRotationAndDistance = (dir, myPath, self) => {
				const d = directionMap[dir];
				if (!d) return;

				this.rot = d.rot;

				const center = Get_Center(self);
				const target = {
					x: PixelSize * (myPath[1] + d.dx) + 32,
					y: PixelSize * (myPath[0] + d.dy) + 14
				};

				moveCmp = Math.round(Vec_Distance(center, target));
			};

			const updatePathAndRotation = (self, grid, scene) => {
				this.myPath = getGridCoord(self);
				this.root = getPathToGoalOrVisibleTile(this.myPath, this.targetPath, grid, this.map, scene);
				if (this.root && this.root.length > 0) {
					updateRotationAndDistance(this.root[0], this.myPath, self);
				}
				moveCnt = 0;
			};

			const markObstacle = (rot, myPath, grid) => {
				const off = obstacleOffsets[rot];
				if (!off) return;
				grid[myPath[0] + off[0]][myPath[1] + off[1]] = 1;
			};

			this.onenterframe = () => {
				if (deadFlgs[this.num] || gameStatus !== 0) return;

				if (this.life <= 0) {
					destruction++;
					this._Dead();
					return;
				}
				if (!WorldFlg) return;

				this._Damage();

				// grid / map 更新（60Fごと）
				/*if (this.time % (60 + this.num) === 0) {
					this.grid = JSON.parse(JSON.stringify(scene.grid));
					this.map = Object.assign({}, scene.backgroundMap);

					if (this.moveSpeed > 0 && !this.tankStopFlg) {
						this.myPath = getGridCoord(this);
						this.targetPath = getGridCoord(this.target);

						for (let i = 0; i < this.grid.length; i++) {
							for (let j = 0; j < this.grid[i].length; j++) {
								if (i === this.myPath[0] && j === this.myPath[1]) {
									this.grid[i][j] = 3;
								} else if (i === this.targetPath[0] && j === this.targetPath[1]) {
									this.grid[i][j] = 2;
								} else {
									this.grid[i][j] = this.map.collisionData[i][j] === 0 ? 0 : 1;
								}
							}
						}

						if (this.time === 0) {
							this.root = findShortestPath(this.myPath, this.grid, scene);
							const dir = directionMap[this.root?.[0]];
							if (dir) {
								this.rot = dir.rot;
								const center = Get_Center(this);
								moveCmp = Math.round(Vec_Distance(center, {
									x: PixelSize * (this.myPath[1] + dir.dx) + 32,
									y: PixelSize * (this.myPath[0] + dir.dy) + 14
								}));
							}
						}
					}
				}*/
				if (this.time % (60 + this.num) === 0) {

					// ★ 1秒ごとにキャッシュ更新
					this._UpdateGridCache(scene);

					// ★ キャッシュを使う（超高速）
					this.grid = this.cachedGrid;

					if (this.moveSpeed > 0 && !this.tankStopFlg) {
						this.myPath = getGridCoord(this);
						this.targetPath = getGridCoord(this.target);

						// Start / Goal の書き込みだけ行う
						const g = this.grid;

						const sy = this.myPath[0];
						const sx = this.myPath[1];
						const ty = this.targetPath[0];
						const tx = this.targetPath[1];

						// 既存構造を壊さず、必要な部分だけ上書き
						g[sy][sx] = 3; // Start
						g[ty][tx] = 2; // Goal

						if (this.time === 0) {
							this.root = findShortestPath(this.myPath, g, scene);
							const dir = directionMap[this.root?.[0]];
							if (dir) {
								this.rot = dir.rot;
								const center = Get_Center(this);
								moveCmp = Math.round(Vec_Distance(center, {
									x: PixelSize * (this.myPath[1] + dir.dx) + 32,
									y: PixelSize * (this.myPath[0] + dir.dy) + 14
								}));
							}
						}
					}
				}


				// 2Fごとに射撃系フラグリセット
				if (this.time % 2 === 0) {
					this.fireFlg = false;
					this.shotNGflg = false;
					if (this.tankStopFlg) this.tankStopFlg = false;
				}

				// 戦車同士の衝突
				if ((tankEntity.length - destruction) > 2) {
					const handler = collisionHandlers[this.rotation];
					if (handler){
						const frame = this.tankFrame[handler.frame];
						let match = TankBase.intersectStrict(frame)
							.filter(t => t.num !== this.num && deadFlgs[t.num] === false);;
						if (match.length > 0){
							this.tankStopFlg = true;
							this.x += handler.dx * this.moveSpeed;
							this.y += handler.dy * this.moveSpeed;
							moveCnt -= this.moveSpeed;
						}
					}
				}

				// EnemyAim 生成
				new EnemyAim(this.cannon, this.cursor, this.category, this.num);

				// 照準ヒット
				if (this.time > 60){
					const hit = EnemyAim.intersect(this.cursor)[0];
					if (hit) this.fireFlg = true;
				}

				// 前方反射障害物
				if (this.ref > 0) {
					if (this.front.intersectStrict(RefObstracle).length > 0) this.shotNGflg = true;
				}

				// 攻撃ターゲットの更新（5Fごと）
				if (this.time % 5 === 0) {
					if (this.attackTarget != tankEntity[0] && this.escapeFlg == false) {
						this.attackTarget = tankEntity[0];
					}
					this.escapeFlg = false;
				}

				// 弾迎撃ロジック
				this._Defense();

				// リロード処理
				this._Reload();

				// 射撃
				if (!this.shotNGflg && this.fireFlg && this.time % this.fireLate === 0) {
					if (Math.floor(Math.random() * this.bulMax + 1) > bullets[this.num] + Math.floor(Math.random() * 3)) {
						this._Attack();
					}
				}

				// 移動処理
				if (this.moveSpeed > 0) {
					if (returnFlg) {
						cflg = this._Move(this.rot);
						if (cflg) moveCnt += this.moveSpeed;

						if (moveCnt >= moveCmp) {
							if (moveCnt > moveCmp) {
								const rad = Rot_to_Rad(this.rot - 270);
								this.moveBy(Math.cos(rad) * (moveCnt - moveCmp), Math.sin(rad) * (moveCnt - moveCmp));
							}
							returnFlg = false;
							updatePathAndRotation(this, this.grid, scene);
							markObstacle(this.rot, this.myPath, this.grid);
						}
					} else if (!this.shotStopFlg && !this.tankStopFlg) {
						if (this.root && !this.around.intersect(this.target)) {
							cflg = this._Move(this.rot);
							if (cflg) moveCnt += this.moveSpeed;
						}
						if (moveCnt >= moveCmp) {
							if (moveCnt > moveCmp) {
								const rad = Rot_to_Rad(this.rotation - 270);
								this.moveBy(Math.cos(rad) * (moveCnt - moveCmp), Math.sin(rad) * (moveCnt - moveCmp));
							}
							updatePathAndRotation(this, this.grid, scene);
						}
					}

					if (!this.root && this.time % 30 === 0) {
						updatePathAndRotation(this, this.grid, scene);
					}

					let obsHit = false;
					Obstracle.intersect(this).forEach(elem => {
						switch (elem.name) {
							case 'ObsTop':    this.moveTo(this.x, elem.y - 60); break;
							case 'ObsBottom': this.moveTo(this.x, elem.y + elem.height); break;
							case 'ObsLeft':   this.moveTo(elem.x - 60, this.y); break;
							case 'ObsRight':  this.moveTo(elem.x + elem.width, this.y); break;
						}
						obsHit = true;
					});

					if (cflg && obsHit) {
						updatePathAndRotation(this, this.grid, scene);
						markObstacle(this.rot, this.myPath, this.grid);
					}
				}

				// ショット停止フラグの時間管理
				if (this.shotStopFlg) {
					this.shotStopTime++;
					if (this.shotStopTime > 10) {
						this.shotStopFlg = false;
						this.shotStopTime = 0;
					}
				}

				this.time++;
			};
		},
		_Attack: function () {
			if (gameMode == -1 && Math.floor(Math.random() * 3)) return;
			if (!WorldFlg) return;

			if (bullets[this.num] < this.bulMax && !deadFlgs[this.num]) {
				let stack = bulStack[this.num];
				for (let i = 0; i < this.bulMax; i++) {
					if (!stack[i]) {
						this.shotStopFlg = true;
						new BulletCol(this.shotSpeed, this.ref, this.cannon, this.category, this.num, i)._Shot();
						this.time += Math.floor(Math.random() * 3);
						break;
					}
				}
			}
		},
		_Defense: function () {
			if (BulletBase.collection.length > 0) {
				const match1 = [];
				for (const a of PlayerBulAimLite.list) {
					if (a.hitAABB(this.around)) {
						match1.push(a);
					}
				}
				const match2 = [];
				for (const a of BulAimLite.list) {
					if (a.hitAABB(this.around)) {
						match2.push(a);
					}
				}
				for (let i = 0, l = BulletBase.collection.length; i < l; i++) {
					const c = BulletBase.collection[i];
					if (!bulStack[c.num][c.id]) continue;

					const defFlg = Categorys.DefenceFlg[this.category];
					if ((c.num === 0 && !defFlg[0]) ||
						(c.num === this.num && !defFlg[1]) ||
						(c.num !== 0 && c.num !== this.num && !defFlg[2])) continue;

					const dist = (function Instrumentation(weak, target1, target2) {
						const dist1 = Get_Distance(weak, target1);
						const dist2 = Get_Distance(weak, target2);
						return dist1 >= dist2 ? dist2 : null;
					})(this.weak, this.attackTarget, c);

					if (dist == null) continue;

					const defRange = Categorys.DefenceRange[this.category];

					switch (c.num) {
						case 0:
							if (dist < defRange[0]) {
								if (match1.some(elem => elem.target === c)) {
									this.attackTarget = c;
									this.escapeFlg = true;
								}
							}
							break;

						case this.num:
							if (this.ref == 0) break;
							if (dist < defRange[1] && dist > 100) {
								if (match2.some(elem => elem.target === c)) {
									this.attackTarget = c;
									this.escapeFlg = true;
								}
							}
							break;

						default:
							if (dist < defRange[2]) {
								if (match2.some(elem => elem.target === c)) {
									this.attackTarget = c;
									this.escapeFlg = true;
								}
							}
							break;
					}
				}
			}
		},
		_Reload: function () {
			if (!this.bulReloadFlg) {
				if (bullets[this.num] === this.bulMax) this.bulReloadFlg = true;
			} else {
				if (this.bulReloadTime < this.reload) {
					this.bulReloadTime++;
					if (!this.shotNGflg) this.shotNGflg = true;
				} else {
					if (bullets[this.num] <= 0){
						this.shotNGflg = false;
						this.bulReloadFlg = false;
						this.bulReloadTime = 0;
					}
				}
			}
		},
		_UpdateGridCache(scene) {
			// 60Fごと（1秒ごと）に更新
			if (this.time - this.lastGridUpdate >= 60) {

				const srcGrid = scene.grid;
				const srcCol = scene.backgroundMap.collisionData;

				// キャッシュ用の数値グリッドを作成
				const g = [];
				for (let i = 0; i < Stage_H; i++) {
					const row = new Array(Stage_W);
					const colRow = srcCol[i];
					for (let j = 0; j < Stage_W; j++) {
						row[j] = colRow[j] === 0 ? 0 : 1; // 0=Empty, 1=Obstacle
					}
					g[i] = row;
				}

				this.cachedGrid = g;
				this.cachedCollision = srcCol;
				this.lastGridUpdate = this.time;
			}
		}

	});


	//	攻守両立型
	var Entity_Type2 = Class.create(TankBase, {
		initialize: function(x, y, category, num, scene) {
			TankBase.call(this, x, y, category, num, scene);

			this.around = new InterceptAround(this);
			this.front = new InterceptFront(this.cannon);
			this.target = tankEntity[0];

			this.attackTarget = tankEntity[0];
			this.escapeTarget = null;

			this.cursor = new Target(this, scene);

			var h = {x: 0, y: 0};

			var shadow = new Surface(this.width, this.height);
			shadow.context.beginPath();
			if(gameMode > 0){
				shadow.context.fillStyle = 'rgba(0, 0, 0, 0.05)';
			}else{
				shadow.context.fillStyle = 'rgba(0, 0, 0, 0.1)';
			}
			shadow.context.arc(30, 30, 24, 0, Math.PI * 2, true);
			shadow.context.fill();

			for (var i = 0; i < this.bulMax; i++) {
				bulStack[this.num].push(false); //  弾の状態をoff
			}

			var EnemyAim = Class.create(Aim, {
				initialize: function(cannon, cursor, category, num) {
					Aim.call(this, cannon, cursor, category, num, scene);
				}
			});

			const SelDirection = (target1, target2, or) => {
				let arr = [0, 1, 2, 3];
				//	0:	離れる	1:	近寄る
				//	0:	上
				// 	1:	右
				// 	2:	下
				// 	3:	左
				if (or == 0) {
					if ((target1.x + target1.width / 2) > (target2.x + target2.width / 2)) { //	相手より右にいる場合
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) { //	相手より下にいる場合
							arr = [1, 2];
						} else {
							arr = [1, 0];
						}
					} else {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							arr = [2, 3];
						} else {
							arr = [0, 3];
						}
					}
				} else if (or == 1) {
					if ((target1.x + target1.width / 2) > (target2.x + target2.width / 2)) {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							arr = [0, 3];
						} else {
							arr = [2, 3];
						}
					} else {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							arr = [0, 1];
						} else {
							arr = [1, 2];
						}
					}
				}
				if (arr.indexOf(this.dirValue) == -1) this.dirValue = arr[Math.floor(Math.random() * arr.length)];
			}

			const resolveCollision = (entity, elem, isTank = false) => {
				switch (elem.name) {
					case isTank ? 'TankTop' : 'ObsTop':
						entity.moveTo(entity.x, elem.y - 60);
						break;
					case isTank ? 'TankBottom' : 'ObsBottom':
						entity.moveTo(entity.x, elem.y + elem.height);
						break;
					case isTank ? 'TankLeft' : 'ObsLeft':
						entity.moveTo(elem.x - 60, entity.y);
						break;
					case isTank ? 'TankRight' : 'ObsRight':
						entity.moveTo(elem.x + elem.width, entity.y);
						break;
				}
				if(entity.moveFlg) this.hittingTime++;
				h = Get_Center(elem);
			}

			const getGridCoord = (entity) => [
				Math.floor((entity.y + entity.height / 2) / PixelSize),
				Math.floor((entity.x + entity.width / 2) / PixelSize)
			];

			const isNear = (a, b, range) => { 
				const dx = a.x - b.x; 
				const dy = a.y - b.y; 
				return (dx * dx + dy * dy) < (range * range); 
			}

			this.onenterframe = function() {
				if (!deadFlgs[this.num] && gameStatus == 0) {
					if (this.life > 0) {
						if (WorldFlg) {
							if (this.category == 7 && this.time == 0) {
								new Flash(this);
								this.tank.opacity = 0;
								this.cannon.opacity = 0;
								this.image = shadow;
								this.lifeBar.opacity = 0;
							}

							this._Damage();

							this.time++;

							if (this.time % 60 == 0){
								this.moveRandom = Math.floor(Math.random() * 5) > 1 ? 1 : 0;
							}

							if (this.time % 2 == 0) {
								this.shotNGflg = false;
								this.fireFlg = false;
							}

							if (this.shotStopFlg) {
								this.shotStopTime++;
								if (this.shotStopTime > 10) {
									this.shotStopFlg = false;
									this.shotStopTime = 0;
								}
							} else {
								new EnemyAim(this.cannon, this.cursor, this.category, this.num);
							}

							if (this.time > 60){
								if (!this.fireFlg && EnemyAim.intersect(this.cursor).length > 0){
									this.fireFlg = true; //  発射可能状態にする
								}
							}

							if (this.ref > 0) {
								if (this.front.intersectStrict(RefObstracle).length > 0) this.shotNGflg = true;
							}

							if (this.time % 5 == 0) {
								if (this.attackTarget != tankEntity[0] && this.escapeFlg == false) this.attackTarget = tankEntity[0];
								this.escapeFlg = false;
							}

							this._Defense();
							
							this._Reload();
							
							if (!this.shotNGflg) {
								if (this.time % this.fireLate == 0 && this.fireFlg) {
									if (Math.floor(Math.random() * this.bulMax * 2) > bullets[this.num]) {
										this._Attack();
									}
								}
							}

							if (this.moveSpeed > 0) {
								if (this.time % 5 == 0) {
									if (this.escapeFlg) {
										SelDirection(this.weak, this.escapeTarget, 0);
									} else {
										if (this.hittingTime >= 35) {
											this.myPath = getGridCoord(this);

											let arr = [];
											switch (this.dirValue) {
												case 0: this.y += this.moveSpeed; break;
												case 1: this.x -= this.moveSpeed; break;
												case 2: this.y -= this.moveSpeed; break;
												case 3: this.x += this.moveSpeed; break;
											}

											h = {x: Math.floor(h.x / PixelSize), y: Math.floor(h.y / PixelSize)};

											if (h.x === 0 || h.y === 0) {
												arr = this.dirValue % 2 === 0 ? [1, 3] : [0, 2];
											} else {
												if (this.dirValue % 2 === 0) {
													arr.push(h.x > this.myPath[1] ? 3 : 1);
												} else {
													arr.push(h.y > this.myPath[0] ? 0 : 2);
												}
											}

											if (!arr.includes(this.dirValue)) {
												this.dirValue = arr[Math.floor(Math.random() * arr.length)];
											}
											this.hittingTime = 0;
										} else if (isNear(this.weak, this.attackTarget, this.distance)) {
											SelDirection(this.weak, this.attackTarget, 0);
										} else {
											if (this.time % 10 == 0) {
												SelDirection(this.weak, this.attackTarget, this.moveRandom);
											}
										}
										
										if ((tankEntity.length - destruction) - 1 > 2) {
											let match = TankBase.intersectStrict(this.around);
											if (match.length > 0){
												if(match[0].num != this.num && deadFlgs[match[0].num] == false){
													SelDirection(this.weak, match[0], 0);
												}
											}
										}
										if (Bom.collection.length > 0) {
											for (var i = 0, l = Bom.collection.length; i < l; i++) {
												let c = Bom.collection[i];
												if (isNear(this.weak, c, 150)) {
													SelDirection(this.weak, c, 0);
													break;
												}
											}
										}
									}
								}
								if (!this.shotStopFlg) {
									if (this.dirValue == 0) {
										this.rot = 0;
									} else if (this.dirValue == 1) {
										this.rot = 90;
									} else if (this.dirValue == 2) {
										this.rot = 180;
									} else if (this.dirValue == 3) {
										this.rot = 270;
									}
									this._Move(this.rot);
								}
							}
							h = { x: 0, y: 0 };
							// タンクとの衝突処理
							TankObstracle.intersect(this).forEach(elem => {
								if (!deadFlgs[elem.num] && elem.num !== this.num) {
									resolveCollision(this, elem, true);
								}
							});

							// 障害物との衝突処理
							Obstracle.intersect(this).forEach(elem => {
								resolveCollision(this, elem, false);
							});
						}
					} else {
						destruction++;
						this._Dead();
					}
				}
			}
		},
		_Attack: function() {
			if (gameMode == -1 && Math.floor(Math.random() * 3)) return;
			if (WorldFlg) { //  処理しても良い状態か
				if (bullets[this.num] < this.bulMax && deadFlgs[this.num] == false) { //  発射最大数に到達していないか＆死んでいないか
					let stack = bulStack[this.num];
					for (let i = 0; i < this.bulMax; i++) {
						if (!stack[i]) { //  弾の状態がoffならば
							this.shotStopFlg = true;
							new BulletCol(this.shotSpeed, this.ref, this.cannon, this.category, this.num, i)._Shot();
							this.time += Math.floor(Math.random() * 5);
							break;
						}
					}

				}
			}
		},
		_Defense: function(){
			if (BulletBase.collection.length > 0) {
				const match1 = [];
				for (const a of PlayerBulAimLite.list) {
					if (a.hitAABB(this.around)) {
						match1.push(a);
					}
				}
				const match2 = [];
				for (const a of BulAimLite.list) {
					if (a.hitAABB(this.around)) {
						match2.push(a);
					}
				}
				for (var i = 0, l = BulletBase.collection.length; i < l; i++) {
					const c = BulletBase.collection[i];
					if (!bulStack[c.num][c.id]) continue;

					const defFlg = Categorys.DefenceFlg[this.category];
					if ((c.num === 0 && !defFlg[0]) ||
						(c.num === this.num && !defFlg[1]) ||
						(c.num !== 0 && c.num !== this.num && !defFlg[2])) continue;

					const dist = (function Instrumentation(weak, target1, target2) {
						const dist1 = Get_Distance(weak, target1);
						const dist2 = Get_Distance(weak, target2);
						return dist1 >= dist2 ? dist2 : null;
					})(this.weak, this.attackTarget, c);
					if (dist == null) continue;

					const defRange = Categorys.DefenceRange[this.category];
					const escRange = Categorys.EscapeRange[this.category];

					switch (c.num) {
						case 0:
							if (dist < defRange[0]) {
								if (match1.some(elem => elem.target === c)){
									this.attackTarget = c; //  迎撃のためにターゲット変更
								}
							if (escRange[0] && escRange[1] != 0) {
									if (dist < escRange[1]) {
										this.escapeTarget = c;
										this.escapeFlg = true;
									}
								}
							}
							break;

						case this.num:
							if (this.ref == 0) break;
							if (dist < defRange[1] && dist > 100) {
								if (match2.some(elem => elem.target === c)) {
									if (escRange[0] && escRange[2] != 0) {
										if (dist < escRange[2]) {
											this.escapeTarget = c;
											this.escapeFlg = true;
										}
									}
									this.attackTarget = c; //  迎撃のためにターゲット変更
								}
							}
							break;

						default:
							if (dist < defRange[2]) {
								if (match2.some(elem => elem.target === c)){
									this.attackTarget = c; //  迎撃のためにターゲット変更
								}
								if (escRange[0] && escRange[3] != 0) {
									if (dist < escRange[3]) {
										this.escapeTarget = c;
										this.escapeFlg = true;
									}
								}
							}
							break;
					}
				}
			}
		},
		_Reload: function(){
			if (this.bulReloadFlg == false) {
				if (bullets[this.num] == this.bulMax) this.bulReloadFlg = true;
			} else {
				if (this.bulReloadTime < this.reload) {
					this.bulReloadTime++;
					if (this.shotNGflg == false) this.shotNGflg = true;
				} else {
					this.shotNGflg = false;
					this.bulReloadFlg = false;
					this.bulReloadTime = 0;
				}
			}
		}
	})

	//	生存特化型
	var Entity_Type3 = Class.create(TankBase, {
		initialize: function (x, y, category, num, scene) {
			TankBase.call(this, x, y, category, num, scene);

			this.around = new InterceptAround(this);
			this.front = new InterceptFront(this.cannon);

			this.around.scale.apply(this.around, Categorys.AroundScale[this.category]);

			this.target = tankEntity[0];

			this.attackTarget = this.target;
			this.escapeTarget = null;

			this.cursor = new Target(this, scene);

			let rootFlg = false;

			let h = { x: 0, y: 0 };

			for (let i = 0; i < this.bulMax; i++) {
				bulStack[this.num].push(false);
			}

			const EnemyAim = Class.create(Aim, {
				initialize: function (cannon, cursor, category, num) {
					Aim.call(this, cannon, cursor, category, num, scene);
				}
			});

			const getGridCoord = (entity) => [
				(entity.y + entity.height / 2) / PixelSize | 0,
				(entity.x + entity.width / 2) / PixelSize | 0
			];

			const NG_root_set = (grid, myPath) => {
				const res = [];
				if (grid[myPath[0] - 1][myPath[1]] === 1) res.push(0);
				if (grid[myPath[0]][myPath[1] + 1] === 1) res.push(1);
				if (grid[myPath[0] + 1][myPath[1]] === 1) res.push(2);
				if (grid[myPath[0]][myPath[1] - 1] === 1) res.push(3);
				return res;
			}

			const SelDirection = (target1, target2, or, grid, myPath) => {
				let arr;
				const t1x = target1.x + target1.width / 2;
				const t1y = target1.y + target1.height / 2;
				const t2x = target2.x + target2.width / 2;
				const t2y = target2.y + target2.height / 2;

				if (or === 0) {
					if (t1x > t2x) {
						arr = t1y > t2y ? [1, 2] : [0, 1];
					} else {
						arr = t1y > t2y ? [2, 3] : [0, 3];
					}
				} else {
					if (t1x > t2x) {
						arr = t1y > t2y ? [0, 3] : [2, 3];
					} else {
						arr = t1y > t2y ? [0, 1] : [1, 2];
					}
				}

				const ng = NG_root_set(grid, myPath);
				arr = arr.filter(i => ng.indexOf(i) === -1);
				if (arr.length > 0 && arr.indexOf(this.dirValue) === -1) {
					this.dirValue = arr[(Math.random() * arr.length) | 0];
				}
			}

			const getDistanceSq = (a, b) => {
				const dx = a.x - b.x;
				const dy = a.y - b.y;
				return dx * dx + dy * dy;
			}

			const updateDirection = (entity, target, mode, grid, myPath) => {
				SelDirection(entity, target, mode, grid, myPath);
			}

			const resolveCollision = (entity, elem, isTank) => {
				switch (elem.name) {
					case isTank ? 'TankTop' : 'ObsTop':
						entity.moveTo(entity.x, elem.y - 60);
						break;
					case isTank ? 'TankBottom' : 'ObsBottom':
						entity.moveTo(entity.x, elem.y + elem.height);
						break;
					case isTank ? 'TankLeft' : 'ObsLeft':
						entity.moveTo(elem.x - 60, entity.y);
						break;
					case isTank ? 'TankRight' : 'ObsRight':
						entity.moveTo(elem.x + elem.width, entity.y);
						break;
				}
				h = Get_Center(elem);
				this.hittingTime++;
				rootFlg = true;
			}

			const dirToRot = [0, 90, 180, 270];

			this.onenterframe = function () {
				if (deadFlgs[this.num] || gameStatus !== 0) return;

				if (this.life <= 0) {
					destruction++;
					this._Dead();
					return;
				}

				if (!WorldFlg) return;

				this._Damage();

				if (this.time % 2 === 0) {
					if (!this.escapeFlg) rootFlg = false;
					if (this.attackTarget !== this.target) rootFlg = true;

					this.shotNGflg = false;
					this.fireFlg = false;

					if (this.moveSpeed > 0 && !rootFlg && this.time % (60 + this.num) === 0) {
						this.grid = JSON.parse(JSON.stringify(scene.grid));
						this.map = Object.assign({}, scene.backgroundMap);

						this.myPath = getGridCoord(this);
						this.targetPath = getGridCoord(this.target);

						const colData = this.map.collisionData;
						for (let i = 0, gl = this.grid.length; i < gl; i++) {
							const gi = this.grid[i];
							const ci = colData[i];
							for (let j = 0, gl2 = gi.length; j < gl2; j++) {
								if (i === this.myPath[0] && j === this.myPath[1]) {
									gi[j] = 3;
								} else if (i === this.targetPath[0] && j === this.targetPath[1]) {
									gi[j] = 2;
								} else {
									gi[j] = ci[j] === 0 ? 0 : 1;
								}
							}
						}

						this.root = findShortestPath(this.myPath, this.grid, scene);

						if (this.root && this.root.length > 0) {
							switch (this.root[0]) {
								case 'East': this.dirValue = 1; break;
								case 'West': this.dirValue = 3; break;
								case 'North': this.dirValue = 0; break;
								case 'South': this.dirValue = 2; break;
							}
						} else {
							rootFlg = true;
						}
					}
				}

				this.time++;

				if (this.shotStopFlg) {
					if (++this.shotStopTime > 10) {
						this.shotStopFlg = false;
						this.shotStopTime = 0;
					}
				} else {
					new EnemyAim(this.cannon, this.cursor, this.category, this.num);
				}

				if (this.time > 60){
					const aimHits = EnemyAim.intersectStrict(this.cursor);
					if (aimHits.length > 0) {
						if (!this.fireFlg) this.fireFlg = true;
						if (!rootFlg) rootFlg = true;
					}
				}
				
				if (this.ref > 0) {
					if (this.front.intersectStrict(RefObstracle).length > 0) this.shotNGflg = true;
				}

				if (this.time % 3 === 0) {
					if (this.attackTarget !== this.target && !this.escapeFlg) this.attackTarget = this.target;
					this.escapeFlg = false;
				}

				this._Defense();
				
				this._Reload();
				
				let matchFront = TankBase.intersectStrict(this.front);
				if (matchFront.length > 0){
					if(matchFront[0].num != this.num && !deadFlgs[matchFront[0].num] && matchFront[0].num != 0) this.fireFlg = false;
				}

				if (!this.shotNGflg && this.time % this.fireLate === 0 && this.fireFlg) {
					if (Math.floor(Math.random() * this.bulMax * 2) > bullets[this.num]) {
						this._Attack();
					}
				}

				if (this.moveSpeed > 0 && this.time % 5 === 0) {
					if (this.escapeFlg) {
						this.dirValue = Escape_Rot4(this, this.escapeTarget, this.dirValue);
					} else {
						const distSq = getDistanceSq(this.weak, this.attackTarget);
						const thresholdSq = this.distance * this.distance;

						if (this.hittingTime >= 35) {
							this.myPath = [
								((this.y + this.height / 2) / PixelSize) | 0,
								((this.x + this.width / 2) / PixelSize) | 0
							];

							switch (this.dirValue) {
								case 0: this.y += this.moveSpeed; break;
								case 1: this.x -= this.moveSpeed; break;
								case 2: this.y -= this.moveSpeed; break;
								case 3: this.x += this.moveSpeed; break;
							}

							h = {
								x: (h.x / PixelSize) | 0,
								y: (h.y / PixelSize) | 0
							};

							let arr = [];
							if (h.x === 0 || h.y === 0) {
								arr = this.dirValue % 2 === 0 ? [1, 3] : [0, 2];
							} else {
								if (this.dirValue % 2 === 0) {
									arr.push(h.x > this.myPath[1] ? 3 : 1);
								} else {
									arr.push(h.y > this.myPath[0] ? 0 : 2);
								}
							}

							if (arr.length && !arr.includes(this.dirValue)) {
								this.dirValue = arr[(Math.random() * arr.length) | 0];
							}
							this.hittingTime = 0;
						} else if (distSq < thresholdSq) {
							updateDirection(this.weak, this.attackTarget, 0, this.grid, this.myPath);
						} else if (rootFlg && this.time % 10 === 0) {
							updateDirection(this.weak, this.target, 1, this.grid, this.myPath);
						}

						const bomCol = Bom.collection;
						if (bomCol.length > 0){
							for (let i = 0, l = bomCol.length; i < l; i++) {
								const c = bomCol[i];
								if (getDistanceSq(this.weak, c) < 150 * 150) {
									updateDirection(this.weak, c, 0, this.grid, this.myPath);
									break;
								}
							}
						}
					}
				}

				if (!this.shotStopFlg) {
					this.rot = dirToRot[this.dirValue];
					this._Move(this.rot);
				}

				h = { x: 0, y: 0 };

				TankObstracle.intersect(this).forEach(elem => {
					if (!deadFlgs[elem.num] && elem.num !== this.num) {
						resolveCollision(this, elem, true);
					}
				});

				Obstracle.intersect(this).forEach(elem => {
					resolveCollision(this, elem, false);
				});
			}
		},

		_Attack: function () {
			if (gameMode == -1 && Math.floor(Math.random() * 3)) return;
			if (!WorldFlg) return;

			if (bullets[this.num] >= this.bulMax || deadFlgs[this.num]) return;
			let stack = bulStack[this.num];
			for (let i = 0; i < this.bulMax; i++) {
				if (!stack[i]) {
					this.shotStopFlg = true;
					if (this.category === 5) this._ResetAim();
					new BulletCol(this.shotSpeed, this.ref, this.cannon, this.category, this.num, i)._Shot();
					this.time += (Math.random() * 3) | 0;
					break;
				}
			}
		},

		_ResetAim: function () {
			if (this.attackTarget.name !== 'Bullet' && this.attackTarget.name !== 'PhyBullet') return;

			const shooterPos = Get_Center(this);
			const bullet = this.attackTarget;
			const bulletPos = Get_Center(bullet);
			const bulletVec = Rot_to_Vec(bullet.rotation, -90);
			const targetSpeed = this.attackTarget.name === 'Bullet' ? bullet.from.shotSpeed : bullet.shotSpeed;
			const shotSpeed = this.shotSpeed;

			const dx = bulletPos.x - shooterPos.x;
			const dy = bulletPos.y - shooterPos.y;
			const dvx = bulletVec.x * targetSpeed;
			const dvy = bulletVec.y * targetSpeed;

			const a = dvx * dvx + dvy * dvy - shotSpeed * shotSpeed;
			const b = 2 * (dx * dvx + dy * dvy);
			const c = dx * dx + dy * dy;

			if (c < 2000) return;

			if (Math.abs(a) < 0.0001) {
				const aimAngle = Math.atan2(dy, dx);
				this.cannon.rotation = Rad_to_Rot(aimAngle) + 180;
				return;
			}

			const discriminant = b * b - 4 * a * c;
			if (discriminant < 0) return;

			const sqrtDisc = Math.sqrt(discriminant);
			const t1 = (-b - sqrtDisc) / (2 * a);
			const t2 = (-b + sqrtDisc) / (2 * a);

			const time = (t1 > 0 && t1 < t2) || t2 <= 0 ? t1 : t2;
			if (time < 0) return;

			const biasFactor = 0.95;
			const futureX = bulletPos.x + dvx * time * biasFactor;
			const futureY = bulletPos.y + dvy * time * biasFactor;

			const aimAngle = Math.atan2(futureY - shooterPos.y, futureX - shooterPos.x);
			this.cannon.rotation = Rad_to_Rot(aimAngle) + 180;
		},
		_Defense: function(){
			if (BulletBase.collection.length > 0) {
				const defFlg = Categorys.DefenceFlg[this.category];
				const defRange = Categorys.DefenceRange[this.category];
				const escRange = Categorys.EscapeRange[this.category];

				const match1 = [];
				for (const a of PlayerBulAimLite.list) {
					if (a.hitAABB(this.around)) {
						match1.push(a);
					}
				}
				const match2 = [];
				for (const a of BulAimLite.list) {
					if (a.hitAABB(this.around)) {
						match2.push(a);
					}
				}

				for (let i = 0, l = BulletBase.collection.length; i < l; i++) {
					const c = BulletBase.collection[i];
					if (!bulStack[c.num][c.id]) continue;

					if ((c.num === 0 && !defFlg[0]) ||
						(c.num === this.num && !defFlg[1]) ||
						(c.num !== 0 && c.num !== this.num && !defFlg[2])) continue;

					const dist = (function Instrumentation(weak, target1, target2) {
						const dist1 = Get_Distance(weak, target1);
						const dist2 = Get_Distance(weak, target2);
						return dist1 >= dist2 ? dist2 : null;
					})(this.weak, this.attackTarget, c);
					if (dist == null) continue;

					switch (c.num) {
						case 0: {
							if (dist < defRange[0]) {
								if (match1.some(elem => elem.target === c)) {
									this.attackTarget = c;
								} else if (this.category == 5) {
									this.attackTarget = this.target;
								}
								if (escRange[0] && escRange[1] !== 0 && dist < escRange[1]) {
									this.escapeTarget = c;
									this.escapeFlg = true;
								}
							}
							break;
						}
						case this.num: {
							if (this.ref === 0) break;
							if (dist < defRange[1] && dist > 100) {
								if (match2.some(elem => elem.target === c) && escRange[0] && escRange[2] !== 0 && dist < escRange[2]) {
									this.escapeTarget = c;
									this.escapeFlg = true;
								}
								if (Search(this.cannon, c, 45, defRange[1]) && c.time > 30) {
									this.attackTarget = c;
								}
							}
							break;
						}
						default: {
							if (dist < defRange[2]) {
								if (match2.some(elem => elem.target === c)) {
									this.attackTarget = c;
								}
								if (escRange[0] && escRange[3] !== 0 && dist < escRange[3]) {
									this.escapeTarget = c;
									this.escapeFlg = true;
								}
							}
							break;
						}
					}
				}
			}
		},
		_Reload: function(){
			if (!this.bulReloadFlg) {
				if (bullets[this.num] === this.bulMax) this.bulReloadFlg = true;
			} else {
				if (this.bulReloadTime < this.reload) {
					this.bulReloadTime++;
					if (!this.shotNGflg) this.shotNGflg = true;
				} else {
					if (bullets[this.num] <= 0){
						this.shotNGflg = false;
						this.bulReloadFlg = false;
						this.bulReloadTime = 0;
					}
				}
			}
		}
	});


	//	弾幕型
	var Entity_Type4 = Class.create(TankBase, {
		initialize: function(x, y, category, num, scene) {
			TankBase.call(this, x, y, category, num, scene);
			this.target = tankEntity[0];

			this.attackTarget = this.target;

			this.cursor = new Target(this, scene);

			for (var i = 0; i < this.bulMax; i++) {
				bulStack[this.num].push(false); //  弾の状態をoff
			}

			var EnemyAim = Class.create(Aim, {
				initialize: function(cannon, cursor, category, num) {
					Aim.call(this, cannon, cursor, category, num, scene);
				}
			});

			this.onenterframe = function() {
				if (!deadFlgs[this.num] && gameStatus == 0) {
					if (this.life > 0) {
						if (WorldFlg) {
							
							this._Damage();

							if (this.time % 2 == 0) {
								this.shotNGflg = false;
								this.fireFlg = false;
							}

							if (this.shotStopFlg) {
								this.shotStopTime++;
								if (this.shotStopTime > 10) {
									this.shotStopFlg = false;
									this.shotStopTime = 0;
								}
								new EnemyAim(this.cannon, this.cursor, this.category, this.num);
							} else {
								new EnemyAim(this.cannon, this.cursor, this.category, this.num);
							}

							this.time++;

							if (this.time > 60){
								if (!this.fireFlg && EnemyAim.intersectStrict(this.cursor).length > 0){
									this.fireFlg = true; //  発射可能状態にする
								}
							}
							
							this._Reload();
							
							if (!this.shotNGflg) {
								if (this.time % this.fireLate == 0 && ((this.fireFlg && bullets[this.num] <= 0) || this.fullFireFlg)) {
									if (bulStack[this.num][Math.floor(Math.random() * this.bulMax)] == false || this.fullFireFlg) {
										this._Attack();
									}
								}
							}

							Obstracle.intersect(this).forEach(elem => {
								switch (elem.name) {
									case 'ObsTop':
										this.moveTo(this.x, elem.y - 60);
										break;
									case 'ObsBottom':
										this.moveTo(this.x, elem.y + (elem.height))
										break;
									case 'ObsLeft':
										this.moveTo(elem.x - 60, this.y)
										break;
									case 'ObsRight':
										this.moveTo(elem.x + (elem.width), this.y)
										break;
								}
							})
						}
					} else {
						destruction++;
						this._Dead();
					}
				}
			}
		},
		_Attack: function() {
			if (!this.fullFireFlg && gameMode == -1 && Math.floor(Math.random() * 3)) return;
			if (WorldFlg) { //  処理しても良い状態か
				if (bullets[this.num] < this.bulMax && deadFlgs[this.num] == false) { //  発射最大数に到達していないか＆死んでいないか
					let stack = bulStack[this.num];
					for (let i = 0; i < this.bulMax; i++) {
						if (!stack[i]) { //  弾の状態がoffならば
							this.fullFireFlg = true;
							this.shotStopFlg = true;
							this.cannon.rotation += (Math.floor(Math.random() * 3) - 1) * ((bullets[this.num] + 1)*2);
							//new BulletCol(this.shotSpeed, this.ref, this.cannon, this.category, this.num, i)._Shot();
							new PhysBulletCol(this.shotSpeed, this.ref, this.cannon, this.category, this.num, i, this.cursor)._Shot();
							this.firecnt++;
							break;
						}
					}
				}
			}
		},
		_Reload: function(){
			if (this.bulReloadFlg == false) {
				if (bullets[this.num] == this.bulMax || this.firecnt == this.bulMax) {
					this.bulReloadFlg = true;
					this.fullFireFlg = false;
					this.firecnt = 0;
				}
			} else {
				if (this.bulReloadTime < this.reload) {
					this.bulReloadTime++;
					if (this.shotNGflg == false) this.shotNGflg = true;
				} else {
					if (bullets[this.num] <= 0){
						this.shotNGflg = false;
						this.bulReloadFlg = false;
						this.bulReloadTime = 0;
					}
				}
			}
		}
	})

	//	弾道予測型
	var Entity_Type5 = Class.create(TankBase, {
		initialize: function (x, y, category, num, scene) {
			TankBase.call(this, x, y, category, num, scene);

			this.cannon2 = new Cannon(this, this.category);
			this.cannon2.opacity = 0;

			this.y -= 32;

			this.target = tankEntity[0];
			this.attackTarget = this.target;

			this.cursor = new RefCursor(this, scene);

			this.aimingTime = 0;
			this.aimCmpTime = 60;
			this.aimRot = Categorys.CannonRotSpeed[this.category];

			this.aim = new RefAimLite(this.ref, this.cannon, this.category, this.num);

			this.aimHitCnt = 0;
			this.bestDeg = null;
			this.swingDir = this.swingDir ?? 1; // 1:右回転, -1:左回転

			if (Math.random() < 0.5) this.aimRot *= -1;

			for (let i = 0; i < this.bulMax; i++) {
				bulStack[this.num].push(false);
			}

			const resolveCollision = (entity, elem, isTank = false) => {
				const top = isTank ? 'TankTop' : 'ObsTop';
				const bottom = isTank ? 'TankBottom' : 'ObsBottom';
				const left = isTank ? 'TankLeft' : 'ObsLeft';
				const right = isTank ? 'TankRight' : 'ObsRight';

				switch (elem.name) {
					case top:
						entity.moveTo(entity.x, elem.y - 60);
						break;
					case bottom:
						entity.moveTo(entity.x, elem.y + elem.height);
						break;
					case left:
						entity.moveTo(elem.x - 60, entity.y);
						break;
					case right:
						entity.moveTo(elem.x + elem.width, entity.y);
						break;
				}
			};

			this.onenterframe = () => {
				if (deadFlgs[this.num] || gameStatus !== 0) return;
				if (this.life <= 0) {
					destruction++;
					this._Dead();
					return;
				}
				if (!WorldFlg) return;

				this._Damage();

				// 照準生成（2フレームに1回）
				if (this.time % 2 === 0) {
					this.fireFlg = false;
				}
				const useCannon = (this.time % 2 === 0) ? this.cannon2 : this.cannon;
				this.aim.update(useCannon);

				this.time++;

				let hit = false;

				for (const s of this.aim.segments) {
					if (lineIntersectsRect(s.x1, s.y1, s.x2, s.y2, this.target)) {
						hit = true;
						break;
					}
				}

				if (hit) {
					this.aimHitCnt++;
					// ★ 砲塔回転（物理反射版）
					const diff = normalizeAngle(
						this.cannon.rotation - normalizeRotation(this.aim.agl)
					);

					this.aimRot = diff > 0
						? -Categorys.CannonRotSpeed[this.category]
						:  Categorys.CannonRotSpeed[this.category];

					// ★ 砲塔の微調整（ランダムブレも維持）
					this.cannon2.rotation = this.aim.agl -
						this.aimRot * ((1 + Math.floor(Math.random() * 6)) * 2);

					// ★ 照準カーソルを tgt に合わせる
					if (this.cannon.rotation !== this.aim.agl) {
						this.cannon.rotation = this.aim.agl;
					}
					if (this.cursor.x !== this.aim.tgt[0] || this.cursor.y !== this.aim.tgt[1]) {
						this.cursor.x = this.aim.tgt[0];
						this.cursor.y = this.aim.tgt[1];
					}

					// ★ 発射タイミング
					if (!this.fireFlg && this.aimHitCnt > 6 + bullets[this.num] * 5) {
						this.fireFlg = true;
					}

					// ★ 照準完了時間
					if (this.aimingTime < this.aimCmpTime + 15) {
						this.aimingTime += 6;
					}
				}

				if (this.shotStopFlg) {
					if (++this.shotStopTime > 5) {
						this.shotStopFlg = false;
						this.shotStopTime = 0;
					}
				}
				else if (!this.fireFlg && this.aimingTime < this.aimCmpTime) {

					this.bestDeg = findBestPreAimAngle(
						this.ref, this.cannon, this.category, this.num, this.target
					);

					// ★ 最適角度が取得できなかった場合 → 既存の回転処理だけ行う
					if (!isFinite(this.bestDeg)) {
						// 既存の回転処理
						this.cannon2.rotation += (this.cannon.rotation !== this.cannon2.rotation)
							? -this.aimRot
							:  this.aimRot;

						this.cannon.rotation += this.aimRot;
					}else{
						// ★ ここから先は「最適角度がある場合」の処理
						const rangeDeg = 45; // ±45°など
						const clamped = clampDeg(this.cannon.rotation, this.bestDeg, rangeDeg);

						const diffToCenter = normalizeAngle(this.bestDeg - this.cannon.rotation);
						const isInsideRange = Math.abs(diffToCenter) <= rangeDeg;

						// --- 範囲外：中心へ寄せる ---
						if (!isInsideRange) {
							
							const diff = normalizeAngle(clamped - this.cannon.rotation);

							if (Math.abs(diff) < Math.abs(this.aimRot)) {
								this.cannon.rotation = clamped;
								this.cannon2.rotation = clamped;
							} else {
								this.cannon.rotation += this.aimRot;
								this.cannon2.rotation += this.aimRot;
							}

						} else {
							// --- 範囲内：メトロノーム運動 ---
							if (this.swingDir === undefined) this.swingDir = 1;

							this.cannon.rotation += this.aimRot * this.swingDir;
							this.cannon2.rotation += this.aimRot * this.swingDir;

							const diffNow = normalizeAngle(this.cannon.rotation - this.bestDeg);

							if (Math.abs(diffNow) >= rangeDeg) {
								this.swingDir *= -1;
							} else if (Math.abs(diffNow) < this.aimRot) {
								// ★ 中心付近で反転させない
								const dir = (this.swingDir >= 0 ? 1 : -1);
								this.cannon.rotation += this.aimRot * dir;
								this.cannon2.rotation += this.aimRot * dir;
							}
						}
					}
				}

				// --- リロード・射撃 ---
				if (this.time % 5 === 0) {
					if (this.aimingTime > 0 && !this.fireFlg) this.aimingTime -= 3;

					this._Reload();

					if (!this.shotNGflg && this.fireFlg && this.time % this.fireLate === 0) {
						const idx = Math.floor(Math.random() * this.bulMax);
						if (!bulStack[this.num][idx]) {
							this._Attack();
						}
					}
				}

				// --- 衝突処理 ---
				TankObstracle.intersect(this).forEach(elem => {
					if (!deadFlgs[elem.num] && elem.num !== this.num) {
						resolveCollision(this, elem, true);
					}
				});

				Obstracle.intersect(this).forEach(elem => {
					resolveCollision(this, elem, false);
				});
			};
		},

		_Attack: function () {
			if (gameMode == -1 && Math.random() < 0.33) return;
			if (!WorldFlg) return;

			if (bullets[this.num] < this.bulMax && !deadFlgs[this.num]) {
				let stack = bulStack[this.num];
				for (let i = 0; i < this.bulMax; i++) {
					if (!stack[i]) {
						this.shotStopFlg = true;
						new BulletCol(this.shotSpeed, this.ref, this.cannon, this.category, this.num, i)._Shot();

						this.aimingTime = 0;
						this.aimHitCnt = 0;
						this.aimCmpTime = (this.category != 1)
							? Math.floor(Math.random() * 60) + 20
							: Math.floor(Math.random() * 30) + 30;

						this.cannon.rotation += this.aimRot / 2;
						this.cannon2.rotation += this.aimRot / 2;

						break;
					}
				}
			}
		},
		_Reload: function(){
			if (!this.bulReloadFlg) {
				if (bullets[this.num] === this.bulMax) this.bulReloadFlg = true;
			} else {
				if (this.bulReloadTime < this.reload) {
					this.bulReloadTime++;
					if (!this.shotNGflg) this.shotNGflg = true;
				} else {
					if (bullets[this.num] <= 0){
						this.shotNGflg = false;
						this.bulReloadFlg = false;
						this.bulReloadTime = 0;
					}
				}
			}
		}
	});


	//	爆弾設置型
	var Entity_Type6 = Class.create(TankBase, {
		initialize: function(x, y, category, num, scene) {
			TankBase.call(this, x, y, category, num, scene);

			//if(gameMode == 2)this.weak.scale(0.6, 0.6);

			var that = this;

			this.around = new InterceptAround(this);
			this.front = new InterceptFront(this.cannon);
			this.target = tankEntity[0];

			this.attackTarget = tankEntity[0];
			this.escapeTarget = null;

			this.cursor = new Target(this, scene);

			for (var i = 0; i < this.bulMax; i++) {
				bulStack[this.num].push(false); //  弾の状態をoff
			}

			var EnemyAim = Class.create(Aim, {
				initialize: function(cannon, cursor, category, num) {
					Aim.call(this, cannon, cursor, category, num, scene);
				}
			});

			const SelDirection = (target1, target2, or) => {
				let arr = [0, 1, 2, 3, 4, 5, 6, 7];

				const cx1 = target1.x + target1.width / 2;
				const cy1 = target1.y + target1.height / 2;
				const cx2 = target2.x + target2.width / 2;
				const cy2 = target2.y + target2.height / 2;

				// 近づく or 離れるの象限ベース候補
				if (or === 0) { // 離れる
					if (cx1 > cx2) {
						if (cy1 > cy2) arr = [1, 2, 5];
						else            arr = [0, 1, 4];
					} else {
						if (cy1 > cy2) arr = [2, 3, 6];
						else            arr = [0, 3, 7];
					}
				} else { // 近づく
					if (cx1 > cx2) {
						if (cy1 > cy2) arr = [0, 3, 7];
						else            arr = [2, 3, 6];
					} else {
						if (cy1 > cy2) arr = [0, 1, 4];
						else            arr = [1, 2, 5];
					}
				}

				// 壁チェック
				const safe = arr.filter(d => canMoveTank(cx1, cy1, d));

				// 壁で全滅したら元の候補に戻す
				const finalArr = safe.length > 0 ? safe : arr;

				// ランダム性を維持
				if (!finalArr.includes(this.dirValue)) {
					this.dirValue = finalArr[Math.floor(Math.random() * finalArr.length)];
				}
			};

			function canMoveTank(cx, cy, dir) {
				const dirVec = [
					{x: 0,  y:-1}, // 0 上
					{x: 1,  y: 0}, // 1 右
					{x: 0,  y: 1}, // 2 下
					{x:-1, y: 0}, // 3 左
					{x: 1,  y:-1}, // 4 右上
					{x: 1,  y: 1}, // 5 右下
					{x:-1, y: 1}, // 6 左下
					{x:-1, y:-1}  // 7 左上
				];

				const v = dirVec[dir];

				// 移動後の中心座標
				const nx = cx + v.x * 32;
				const ny = cy + v.y * 32;

				// 戦車の半径（60×60 → 半径30）
				const r = 30;

				// 四隅の座標
				const points = [
					{x: nx - r, y: ny - r}, // 左上
					{x: nx + r, y: ny - r}, // 右上
					{x: nx - r, y: ny + r}, // 左下
					{x: nx + r, y: ny + r}  // 右下
				];

				for (const p of points) {
					const gx = Math.floor(p.x / PixelSize);
					const gy = Math.floor(p.y / PixelSize);

					if (scene.grid[gy]?.[gx] === 1) {
						return false; // どれか1つでも壁に当たるなら移動不可
					}
				}

				return true; // 全て通れるならOK
			}

			const resolveCollision = (entity, elem, isTank = false) => {
				switch (elem.name) {
					case isTank ? 'TankTop' : 'ObsTop':
						entity.moveTo(entity.x, elem.y - 60);
						break;
					case isTank ? 'TankBottom' : 'ObsBottom':
						entity.moveTo(entity.x, elem.y + elem.height);
						break;
					case isTank ? 'TankLeft' : 'ObsLeft':
						entity.moveTo(elem.x - 60, entity.y);
						break;
					case isTank ? 'TankRight' : 'ObsRight':
						entity.moveTo(elem.x + elem.width, entity.y);
						break;
				}
				this.hittingTime++;
			}

			// ===============================
			// 爆弾回避ロジック 完全版
			// ===============================

			const RANGE = 4; // 自分を中心に4マス → 9×9

			// --- ローカルグリッド取得 ---
			function getLocalGrid(sceneGrid, cx, cy) {
				const local = [];
				const H = sceneGrid.length;      // 15
				const W = sceneGrid[0].length;   // 20

				for (let dy = -RANGE; dy <= RANGE; dy++) {
					const row = [];
					for (let dx = -RANGE; dx <= RANGE; dx++) {
						const y = cy + dy;
						const x = cx + dx;

						if (y < 0 || y >= H || x < 0 || x >= W) {
							row.push(1); // 範囲外は壁扱い
						} else {
							row.push(sceneGrid[y][x]);
						}
					}
					local.push(row);
				}
				return local;
			}


			// --- 爆風範囲外の安全セル ---
			function getSafeCells(localGrid, targetLocalPos, safeRange = 3) {
				const safe = [];
				const size = localGrid.length;

				for (let y = 0; y < size; y++) {
					for (let x = 0; x < size; x++) {
						if (localGrid[y][x] === 1) continue;

						const dx = x - targetLocalPos.x;
						const dy = y - targetLocalPos.y;

						if (Math.abs(dx) > safeRange || Math.abs(dy) > safeRange) {
							safe.push({ x, y });
						}
					}
				}
				return safe;
			}


			// --- 危険度コスト（1マス隙間を避ける） ---
			function dangerCost(grid, x, y) {
				let cost = 1;

				const dirs = [
					{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}
				];

				let wallCount = 0;

				for (const d of dirs) {
					const nx = x + d.x;
					const ny = y + d.y;

					// ★ 範囲外は壁扱い
					if (ny < 0 || ny >= grid.length || nx < 0 || nx >= grid[0].length) {
						wallCount++;
						continue;
					}

					if (grid[ny][nx] === 1) {
						wallCount++;
					}
				}

				if (wallCount >= 2) {
					cost += 5;
				} else if (wallCount === 1) {
					cost += 2;
				}

				return cost;
			}


			// --- A*（危険度コスト付き） ---
			function astar(grid, start, goal) {
				const H = grid.length;
				const W = grid[0].length;

				const open = [];
				const closed = new Set();

				open.push({
					x: start.x,
					y: start.y,
					g: 0,
					h: Math.abs(goal.x - start.x) + Math.abs(goal.y - start.y),
					parent: null
				});

				while (open.length > 0) {
					open.sort((a,b)=> (a.g+a.h)-(b.g+b.h));
					const cur = open.shift();
					const key = `${cur.x},${cur.y}`;
					if (closed.has(key)) continue;
					closed.add(key);

					if (cur.x === goal.x && cur.y === goal.y) {
						const path = [];
						let p = cur;
						while (p) {
							path.push({x:p.x, y:p.y});
							p = p.parent;
						}
						return path.reverse();
					}

					const dirs = [
						{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1},
						{x:1,y:1},{x:1,y:-1},{x:-1,y:1},{x:-1,y:-1}
					];

					for (const d of dirs) {
						const nx = cur.x + d.x;
						const ny = cur.y + d.y;

						// ★ 範囲外は無視
						if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;

						if (grid[ny][nx] === 1) continue;

						const nkey = `${nx},${ny}`;
						if (closed.has(nkey)) continue;

						const moveCost = dangerCost(grid, nx, ny);

						open.push({
							x: nx,
							y: ny,
							g: cur.g + moveCost,
							h: Math.abs(goal.x - nx) + Math.abs(goal.y - ny),
							parent: cur
						});
					}
				}
				return null;
			}


			// --- 最遠セル（フォールバック用） ---
			function findFarthestCell(localGrid, targetLocalPos) {
				let best = null;
				let bestDist = -1;

				for (let y = 0; y < localGrid.length; y++) {
					for (let x = 0; x < localGrid[0].length; x++) {
						if (localGrid[y][x] === 1) continue;

						const dx = x - targetLocalPos.x;
						const dy = y - targetLocalPos.y;
						const dist = dx*dx + dy*dy;

						if (dist > bestDist) {
							bestDist = dist;
							best = { x, y };
						}
					}
				}
				return best;
			}

			// --- 方向変換 ---
			function dirFromDelta(dx, dy) {
				if (dx === 0 && dy === -1) return 0;
				if (dx === 1 && dy === 0) return 1;
				if (dx === 0 && dy === 1) return 2;
				if (dx === -1 && dy === 0) return 3;
				if (dx === 1 && dy === -1) return 4;
				if (dx === 1 && dy === 1) return 5;
				if (dx === -1 && dy === 1) return 6;
				if (dx === -1 && dy === -1) return 7;
				return null;
			}

			// --- escapeFromTarget（完全版） ---
			function escapeFromTarget(self, target) {
				const selfCenter = Get_Center(self);
				const targetCenter = Get_Center(target);

				const cx = Math.floor(selfCenter.x / 64);
				const cy = Math.floor(selfCenter.y / 64);

				const tx = Math.floor(targetCenter.x / 64);
				const ty = Math.floor(targetCenter.y / 64);

				const localGrid = getLocalGrid(scene.grid, cx, cy);

				const start = { x: RANGE, y: RANGE };
				const targetLocal = { 
					x: RANGE + (tx - cx), 
					y: RANGE + (ty - cy) 
				};

				// ① 安全セルを列挙
				const safeCells = getSafeCells(localGrid, targetLocal, 4);

				let bestPath = null;

				// ② 安全セルの中から最短で行ける場所を探す
				for (const cell of safeCells) {
					const path = astar(localGrid, start, cell);
					if (!path) continue;

					if (!bestPath || path.length < bestPath.length) {
						bestPath = path;
					}
				}

				// ③ 安全セルへ行けるならその方向へ
				if (bestPath && bestPath.length >= 2) {
					const next = bestPath[1];
					return dirFromDelta(next.x - start.x, next.y - start.y);
				}

				// ④ 安全セルが無い → 最遠セルへフォールバック
				const goal = findFarthestCell(localGrid, targetLocal);
				if (!goal) return null;

				const path = astar(localGrid, start, goal);
				if (!path || path.length < 2) return null;

				const next = path[1];
				return dirFromDelta(next.x - start.x, next.y - start.y);
			}


			this.onenterframe = function() {
				if (!deadFlgs[this.num] && gameStatus == 0) {
					if (this.life > 0) {
						if (WorldFlg) {

							this._Damage();

							this.time++;

							if (this.time % 2 == 0) {
								this.shotNGflg = false;
								this.fireFlg = false;
							}

							//  爆弾が設置された場合の処理
							if (this.bomSetFlg) {
								this.bomReload++;
								if (this.bomReload > 60) { //  1秒後再設置可能にする
									this.bomSetFlg = false;
								}
							}

							if (this.shotStopFlg) {
								this.shotStopTime++;
								if (this.shotStopTime > 10) {
									this.shotStopFlg = false;
									this.shotStopTime = 0;
								}
							} else {
								new EnemyAim(this.cannon, this.cursor, this.category, this.num);
							}

							if (this.time > 60){
								if (!this.fireFlg && EnemyAim.intersectStrict(this.cursor).length > 0){
									this.fireFlg = true; //  発射可能状態にする
								}

								if (this.fireFlg && EnemyAim.intersectStrict(Bom).length > 0) {
									this.fireFlg = false;
								}
							}

							if (this.ref > 0) {
								if (this.front.intersectStrict(RefObstracle).length > 0) this.shotNGflg = true;
							}

							if (this.time % 5 == 0) {
								if (this.attackTarget != tankEntity[0] && this.escapeFlg == false) this.attackTarget = tankEntity[0];
								this.escapeFlg = false;
							}

							this._Defense();
							
							this._Reload();

							let matchFront = TankBase.intersectStrict(this.front);
							if (matchFront.length > 0){
								if(matchFront[0].num != this.num && !deadFlgs[matchFront[0].num] && matchFront[0].num != 0) this.fireFlg = false;
							}

							if (!this.shotNGflg) {
								if (this.time % this.fireLate == 0 && this.fireFlg) {
									if (Math.floor(Math.random() * this.bulMax * 2) > bullets[this.num]) {
										this._Attack();
									}
								}
							}

							if (this.time % 60 == 0) {
								let hasCloseTarget = false;
								if (Bom.collection.length > 0) {
									for (const c of Bom.collection) {
										const dx = this.weak.x - c.x;
										const dy = this.weak.y - c.y;
										const dSq = dx * dx + dy * dy;
										if (dSq < 200 * 200) {
											hasCloseTarget = true;
											break; // 1件でも該当したら即終了
										}
									}
								}
								if (!hasCloseTarget){
									if (Block.collection.length > 0) {
										if (Math.floor(Math.random() * 2)) {
											for (var i = 0, l = Block.collection.length; i < l; i++) {
												let c = Block.collection[i];
												if (this.within(c, 68) == true && !this.bomSetFlg && boms[this.num] < this.bomMax) {
													new Bom(this, this.num, boms[this.num])._SetBom();
													this.bomReload = 0;
													this.bomSetFlg = true;
													this.bulReloadFlg = true;
													break;
												}
											}
										}
									}
								}
							}

							if (this.moveSpeed > 0) {
								if (this.time % 5 === 0 && this.moveFlg) {
									if (this.escapeFlg) {
										this.dirValue = Escape_Rot8(this, this.escapeTarget, this.dirValue);
									} else {
										// 爆弾設置条件
										if (this.within(this.target, 160) && !this.bomSetFlg && boms[this.num] < this.bomMax) {
											new Bom(this, this.num, boms[this.num])._SetBom();
											this.bomReload = 0;
											this.bomSetFlg = true;
											this.bulReloadFlg = true;
										}

										// 攻撃対象との距離チェック
										const dx = this.weak.x - this.attackTarget.x;
										const dy = this.weak.y - this.attackTarget.y;
										const distSq = dx * dx + dy * dy;
										const thresholdSq = this.distance ** 2;

										if (distSq < thresholdSq) {
											SelDirection(this.weak, this.attackTarget, 0);
										} else {
											if (this.hittingTime > 15) {
												const diagonalObstacleMap = {
													4: [-1, 1],
													5: [1, 1],
													6: [1, -1],
													7: [-1, -1]
												};

												const directionCandidates = {
													0: [1, 3],
													1: [0, 2],
													2: [1, 3],
													3: [0, 2],
													4: [2, 3, 5, 6, 7],
													5: [0, 3, 4, 6, 7],
													6: [0, 1, 4, 5, 7],
													7: [1, 2, 4, 5, 6]
												};

												let arr = directionCandidates[this.dirValue] || [];

												this.myPath = [
													Math.floor((that.y + that.height / 2) / PixelSize),
													Math.floor((that.x + that.width / 2) / PixelSize)
												];

												const rem = new Set();
												this.grid = JSON.parse(JSON.stringify(scene.grid));

												for (const [dir, [dy, dx]] of Object.entries(diagonalObstacleMap)) {
													const y = this.myPath[0] + dy;
													const x = this.myPath[1] + dx;
													if (this.grid[y]?.[x] === 1) rem.add(Number(dir));
												}

												arr = arr.filter(i => !rem.has(i));

												if (arr.length === 0) {
													arr = Array.from({ length: 8 }, (_, i) => i).filter(i => !rem.has(i));
												}

												if (!arr.includes(this.dirValue)) {
													this.dirValue = arr[Math.floor(Math.random() * arr.length)];
												}
												this.hittingTime = 0;
											} else{
												if (this.time % 10 === 0) SelDirection(this.weak, this.attackTarget, 1);
												// 他のタンクとの接近チェック
												if ((tankEntity.length - destruction) - 1 > 2) {
													let match = TankBase.intersectStrict(this.around);
													if (match.length > 0){
														if(match[0].num != this.num && deadFlgs[match[0].num] == false){
															SelDirection(this.weak, match[0], 0);
														}
													}
												}
												// 爆弾との距離チェック
												if (Bom.collection.length > 0) {
													let closest = null;
													let minDistSq = Infinity; // ← ここが重要

													for (const c of Bom.collection) {
														const dx = this.weak.x - c.x;
														const dy = this.weak.y - c.y;
														const dSq = dx * dx + dy * dy;

														if (dSq < minDistSq) {
															minDistSq = dSq;
															closest = c;
														}
													}

													// 200px以内なら回避
													if (closest && minDistSq <= 200 * 200) {
														this.bomReload = 0;
														this.bomSetFlg = true;
														this.dirValue = escapeFromTarget(this.weak, closest);
													}
												}

												
											}
										}
									}
								}

								// 移動処理
								if (!this.shotStopFlg) {
									const rotationMap = [0, 90, 180, 270, 45, 135, 225, 315];
									this.rot = rotationMap[this.dirValue] ?? this.rot;
									this._Move(this.rot);
								}
							}
							// タンクとの衝突処理
							TankObstracle.intersect(this).forEach(elem => {
								if (!deadFlgs[elem.num] && elem.num !== this.num) {
									resolveCollision(this, elem, true);
								}
							});

							// 障害物との衝突処理
							Obstracle.intersect(this).forEach(elem => {
								resolveCollision(this, elem, false);
							});
						}
					} else {
						destruction++;
						if (this.within(this.target, 256) == true && !this.bomSetFlg && boms[this.num] < this.bomMax) new Bom(this, this.num, boms[this.num])._SetBom();
						this._Dead();
					}
				}
			}
		},
		_Attack: function() {
			if (gameMode == -1 && Math.floor(Math.random() * 3)) return;
			if (WorldFlg) { //  処理しても良い状態か
				if (bullets[this.num] < this.bulMax && deadFlgs[this.num] == false) { //  発射最大数に到達していないか＆死んでいないか
					let stack = bulStack[this.num];
					for (let i = 0; i < this.bulMax; i++) {
						if (!stack[i]) { //  弾の状態がoffならば
							this._ResetAim();
							this.shotStopFlg = true;
							new BulletCol(this.shotSpeed, this.ref, this.cannon, this.category, this.num, i)._Shot();
							this.time += Math.floor(Math.random() * 5);
							break;
						}
					}

				}
			}
		},
		_ResetAim: function() {
			if (this.attackTarget.name == "Entity") {
				let random = 35 + (15 * Math.floor(Math.random() * 3));
				//console.log(random)
				let t1 = Get_Center(this);
				let t2 = Get_Center(this.attackTarget);
				let v = Rot_to_Vec(this.attackTarget.rotation, -90);
				let dis = Math.trunc(Vec_Distance(t1, t2) / random);
				let val = dis * this.shotSpeed;
				v.x = v.x * val + t2.x;
				v.y = v.y * val + t2.y;
				let p = {
					x: t1.x - v.x,
					y: t1.y - v.y
				};
				let rad = Math.atan2(p.y, p.x);
				this.cannon.rotation = Rad_to_Rot(rad);
			}
		},
		_Defense: function(){
			if (BulletBase.collection.length > 0) {
				const match1 = [];
				for (const a of PlayerBulAimLite.list) {
					if (a.hitAABB(this.around)) {
						match1.push(a);
					}
				}
				const match2 = [];
				for (const a of BulAimLite.list) {
					if (a.hitAABB(this.around)) {
						match2.push(a);
					}
				}
				for (var i = 0, l = BulletBase.collection.length; i < l; i++) {
					const c = BulletBase.collection[i];
					if (!bulStack[c.num][c.id]) continue;

					const defFlg = Categorys.DefenceFlg[this.category];
					if ((c.num === 0 && !defFlg[0]) ||
						(c.num === this.num && !defFlg[1]) ||
						(c.num !== 0 && c.num !== this.num && !defFlg[2])) continue;

					const dist = (function Instrumentation(weak, target1, target2) {
						const dist1 = Get_Distance(weak, target1);
						const dist2 = Get_Distance(weak, target2);
						return dist1 >= dist2 ? dist2 : null;
					})(this.weak, this.attackTarget, c);
					if (dist == null) continue;

					const defRange = Categorys.DefenceRange[this.category];
					const escRange = Categorys.EscapeRange[this.category];

					switch (c.num) {
						case 0:
							if (dist < defRange[0]) {
								if (match1.some(elem => elem.target === c)){
									this.attackTarget = c; //  迎撃のためにターゲット変更
								}
								if (escRange[0] && escRange[1] != 0) {
									if (dist < escRange[1]) {
										this.escapeTarget = c;
										this.escapeFlg = true;
									}
								}
							}
							break;

						case this.num:
							if (this.ref == 0) break;
							if (dist < defRange[1] && dist > 100) {
								if (match2.some(elem => elem.target === c)) {
									if (escRange[0] && escRange[2] != 0) {
										if (dist < escRange[2]) {
											this.escapeTarget = c;
											this.escapeFlg = true;
										}
									}
									this.attackTarget = c; //  迎撃のためにターゲット変更
								}
							}
							break;

						default:
							if (dist < defRange[2]) {
								if (match2.some(elem => elem.target === c)){
									this.attackTarget = c; //  迎撃のためにターゲット変更
								}
								if (escRange[0] && escRange[3] != 0) {
									if (dist < escRange[3]) {
										this.escapeTarget = c;
										this.escapeFlg = true;
									}
								}
							}
							break;
					}
				}
			}
		},
		_Reload: function(){
			if (this.bulReloadFlg == false) {
				if (bullets[this.num] == this.bulMax) this.bulReloadFlg = true;
			} else {
				if (this.bulReloadTime < this.reload) {
					this.bulReloadTime++;
					if (this.shotNGflg == false) this.shotNGflg = true;
				} else {
					if (bullets[this.num] <= 0){
						this.shotNGflg = false;
						this.bulReloadFlg = false;
						this.bulReloadTime = 0;
					}
				}
			}
		}
	})

	//	機動狙撃型
	var Entity_Type7 = Class.create(TankBase, {
		initialize: function(x, y, category, num, scene) {
			TankBase.call(this, x, y, category, num, scene);

			var that = this;

			this.around = new InterceptAround(this);
			this.front = new InterceptFront(this.cannon);
			this.target = tankEntity[0];

			this.around.scale.apply(this.around, Categorys.AroundScale[this.category]);

			this.attackTarget = tankEntity[0];
			this.escapeTarget = null;

			this.cursor = new Target(this, scene);

			this.escapeTargets = [];

			for (var i = 0; i < this.bulMax; i++) {
				bulStack[this.num].push(false); //  弾の状態をoff
			}

			var EnemyAim = Class.create(Aim, {
				initialize: function(cannon, cursor, category, num) {
					Aim.call(this, cannon, cursor, category, num, scene);
				}
			});

			const SelDirection = (target1, target2, or) => {
				let arr = [0, 1, 2, 3, 4, 5, 6, 7];
				//	0:	離れる	1:	近寄る
				//	0:	上
				// 	1:	右
				// 	2:	下
				// 	3:	左
				//	4:	右上
				//	5:	右下
				//	6:	左下
				//	7:	左上
				if (or == 0) {
					if ((target1.x + target1.width / 2) > (target2.x + target2.width / 2)) { //	相手より右にいる場合
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) { //	相手より下にいる場合
							arr = [1, 2, 5];
						} else {
							arr = [0, 1, 4];
						}
					} else {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							arr = [2, 3, 6];
						} else {
							arr = [0, 3, 7];
						}
					}
				} else if (or == 1) {
					if ((target1.x + target1.width / 2) > (target2.x + target2.width / 2)) {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							arr = [0, 3, 7];
						} else {
							arr = [2, 3, 6];
						}
					} else {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							arr = [0, 1, 4];
						} else {
							arr = [1, 2, 5];
						}
					}
				}

				let rem = [];
				this.myPath = [parseInt((target1.y + target1.height / 2) / PixelSize), parseInt((target1.x + target1.width / 2) / PixelSize)];
				this.grid = JSON.parse(JSON.stringify(scene.grid));
				let bk = arr;

				if (this.grid[this.myPath[0] - 1][this.myPath[1]] == 1) rem.push(0);
				if (this.grid[this.myPath[0]][this.myPath[1] + 1] == 1) rem.push(1);
				if (this.grid[this.myPath[0] + 1][this.myPath[1]] == 1) rem.push(2);
				if (this.grid[this.myPath[0]][this.myPath[1] - 1] == 1) rem.push(3);
				if (this.grid[this.myPath[0] - 1][this.myPath[1] + 1] == 1) rem.push(4);
				if (this.grid[this.myPath[0] + 1][this.myPath[1] + 1] == 1) rem.push(5);
				if (this.grid[this.myPath[0] + 1][this.myPath[1] - 1] == 1) rem.push(6);
				if (this.grid[this.myPath[0] - 1][this.myPath[1] - 1] == 1) rem.push(7);

				arr = arr.filter(i => rem.indexOf(i) == -1);

				if (arr.length == 0) {
					arr = bk;
				}

				if (arr.indexOf(this.dirValue) == -1) this.dirValue = arr[Math.floor(Math.random() * arr.length)];
			}

			const resolveCollision = (entity, elem, isTank = false) => {
				switch (elem.name) {
					case isTank ? 'TankTop' : 'ObsTop':
						entity.moveTo(entity.x, elem.y - 60);
						break;
					case isTank ? 'TankBottom' : 'ObsBottom':
						entity.moveTo(entity.x, elem.y + elem.height);
						break;
					case isTank ? 'TankLeft' : 'ObsLeft':
						entity.moveTo(elem.x - 60, entity.y);
						break;
					case isTank ? 'TankRight' : 'ObsRight':
						entity.moveTo(elem.x + elem.width, entity.y);
						break;
				}
				this.hittingTime++;
			}

			this.onenterframe = function() {
				if (!deadFlgs[this.num] && gameStatus == 0) {
					if (this.life > 0) {
						if (WorldFlg) {

							this._Damage();

							this.time++;

							if (this.time % 45 == 0){
								this.moveRandom = Math.floor(Math.random() * 5) > 1 ? 1 : 0;
							}

							if (this.time % 2 == 0) {
								this.shotNGflg = false;
								this.fireFlg = false;
							}

							if (this.hittingTime > 20) {
								let arr = [];
								switch (this.dirValue) {
									case 0:
									case 2:
										arr = [1, 3];
										break;
									case 1:
									case 3:
										arr = [0, 2];
										break;
									case 4:
									case 6:
										arr = [5, 7];
										break;
									case 5:
									case 7:
										arr = [4, 6];
								}

								let rem = [];
								this.myPath = [parseInt((this.y + this.height / 2) / PixelSize), parseInt((this.x + this.width / 2) / PixelSize)];
								this.grid = JSON.parse(JSON.stringify(scene.grid));
								let bk = arr;

								if (this.grid[this.myPath[0] - 1][this.myPath[1]] == 1) rem.push(0);
								if (this.grid[this.myPath[0]][this.myPath[1] + 1] == 1) rem.push(1);
								if (this.grid[this.myPath[0] + 1][this.myPath[1]] == 1) rem.push(2);
								if (this.grid[this.myPath[0]][this.myPath[1] - 1] == 1) rem.push(3);
								if (this.grid[this.myPath[0] - 1][this.myPath[1] + 1] == 1) rem.push(4);
								if (this.grid[this.myPath[0] + 1][this.myPath[1] + 1] == 1) rem.push(5);
								if (this.grid[this.myPath[0] + 1][this.myPath[1] - 1] == 1) rem.push(6);
								if (this.grid[this.myPath[0] - 1][this.myPath[1] - 1] == 1) rem.push(7);

								arr = arr.filter(i => rem.indexOf(i) == -1);

								if (arr.length == 0) {
									arr = bk;
								}

								if (arr.indexOf(this.dirValue) == -1) {
									this.dirValue = arr[Math.floor(Math.random() * arr.length)];
								}

								this.hittingTime = 0;
							}

							//  爆弾が設置された場合の処理
							/*if (this.bomSetFlg) {
								this.bomReload++;
								if (this.bomReload > 60) { //  1秒後再設置可能にする
									this.bomSetFlg = false;
								}
							}*/

							if (this.shotStopFlg) {
								this.shotStopTime++;
								if (this.shotStopTime > 10) {
									this.shotStopFlg = false;
									this.shotStopTime = 0;
								}
							} else {
								new EnemyAim(this.cannon, this.cursor, this.category, this.num);
							}

							if (this.time > 60){
								if (!this.fireFlg && EnemyAim.intersectStrict(this.cursor).length > 0){
									this.fireFlg = true; //  発射可能状態にする
								}
							}
							
							if (this.ref > 0) {
								if (this.front.intersectStrict(RefObstracle).length > 0) this.shotNGflg = true;
							}

							if (this.time % 3 == 0) {
								if (this.attackTarget != tankEntity[0] && this.escapeFlg == false) this.attackTarget = tankEntity[0];
								this.escapeFlg = false;
							}

							this._Defense();

							this._Reload();

							let matchFront = TankBase.intersectStrict(this.front);
							if (matchFront.length > 0){
								if(matchFront[0].num != this.num && !deadFlgs[matchFront[0].num] && matchFront[0].num != 0) this.fireFlg = false;
							}

							if (!this.shotNGflg) {
								if (this.time % this.fireLate == 0 && this.fireFlg) {
									//if (Math.floor(Math.random() * this.bulMax * 2) > bullets[this.num]) {
									if (Math.floor(Math.random() * this.bulMax * 2) > bullets[this.num]) {
										if (scene.time >= 480) this._Attack();
									}
								}
							}

							if (this.moveSpeed > 0) {
								if (this.time % 3 == 0) {
									if (this.escapeFlg) {
										this.dirValue = Escape_Rot8_Elite(this, this.escapeTarget, this.dirValue);
										//this.dirValue = Escape_Rot8_Multi(this, this.escapeTargets, this.dirValue);
									} else if (this.moveFlg) {
										if (Math.sqrt(Math.pow(this.weak.x - this.attackTarget.x, 2) + Math.pow(this.weak.y - this.attackTarget.y, 2)) < this.distance) {
											SelDirection(this.weak, this.attackTarget, 0);
										} else {
											if (this.time % 9 == 0) {
												SelDirection(this.weak, this.target, this.moveRandom);
												// 他のタンクとの接近チェック
												if ((tankEntity.length - destruction) - 1 > 2) {
													let match = TankBase.intersectStrict(this.around);
													if (match.length > 0){
														if(match[0].num != this.num && deadFlgs[match[0].num] == false){
															SelDirection(this.weak, match[0], 0);
														}
													}
												}
												if (this.hittingTime > 20) {
													const diagonalObstacleMap = {
														4: [-1, 1],
														5: [1, 1],
														6: [1, -1],
														7: [-1, -1]
													};

													const directionCandidates = {
														0: [1, 3],
														1: [0, 2],
														2: [1, 3],
														3: [0, 2],
														4: [2, 3, 5, 6, 7],
														5: [0, 3, 4, 6, 7],
														6: [0, 1, 4, 5, 7],
														7: [1, 2, 4, 5, 6]
													};

													let arr = directionCandidates[this.dirValue] || [];

													this.myPath = [
														Math.floor((that.y + that.height / 2) / PixelSize),
														Math.floor((that.x + that.width / 2) / PixelSize)
													];

													const rem = new Set();
													this.grid = JSON.parse(JSON.stringify(scene.grid));

													for (const [dir, [dy, dx]] of Object.entries(diagonalObstacleMap)) {
														const y = this.myPath[0] + dy;
														const x = this.myPath[1] + dx;
														if (this.grid[y]?.[x] === 1) rem.add(Number(dir));
													}

													arr = arr.filter(i => !rem.has(i));

													if (arr.length === 0) {
														arr = Array.from({ length: 8 }, (_, i) => i).filter(i => !rem.has(i));
													}

													if (!arr.includes(this.dirValue)) {
														this.dirValue = arr[Math.floor(Math.random() * arr.length)];
													}
													this.hittingTime = 0;
												}
											}
										}
										if (Bom.collection.length > 0) {
											for (var i = 0, l = Bom.collection.length; i < l; i++) {
												let c = Bom.collection[i];
												if (Math.sqrt(Math.pow(this.weak.x - c.x, 2) + Math.pow(this.weak.y - c.y, 2)) < 200) {
													SelDirection(this.weak, c, 0);
													break;
												}
											}
										}
									}
								}
								if (!this.shotStopFlg) {
									const rotationMap = [0, 90, 180, 270, 45, 135, 225, 315];
									this.rot = rotationMap[this.dirValue] ?? this.rot;
									this._Move(this.rot);
								}
							}

							// タンクとの衝突処理
							TankObstracle.intersect(this).forEach(elem => {
								if (!deadFlgs[elem.num] && elem.num !== this.num) {
									resolveCollision(this, elem, true);
								}
							});

							// 障害物との衝突処理
							Obstracle.intersect(this).forEach(elem => {
								resolveCollision(this, elem, false);
							});
						}
					} else {
						destruction++;
						this._Dead();
					}
				}
			}
		},
		_Attack: function() {
			if (gameMode == -1 && Math.floor(Math.random() * 3)) return;
			if (WorldFlg) { //  処理しても良い状態か
				if (bullets[this.num] < this.bulMax && deadFlgs[this.num] == false) { //  発射最大数に到達していないか＆死んでいないか
					let stack = bulStack[this.num];
					for (let i = 0; i < this.bulMax; i++) {
						if (!stack[i]) { //  弾の状態がoffならば
							this._ResetAim();
							this.shotStopFlg = true;
							new BulletCol(this.shotSpeed, this.ref, this.cannon, this.category, this.num, i)._Shot();
							break;
						}
					}

				}
			}
		},
		_ResetAim: function () {
			if (this.attackTarget.name == 'Bullet' || this.attackTarget.name == 'PhyBullet') {
				const shooterPos = Get_Center(this);
				const bullet = this.attackTarget;
				const bulletPos = Get_Center(bullet);
				const bulletVec = Rot_to_Vec(bullet.rotation, -90);
				const targetSpeed = this.attackTarget.name == 'Bullet' ? bullet.from.shotSpeed : bullet.shotSpeed;
				const shotSpeed = this.shotSpeed;

				// 相対位置と速度ベクトル
				const dx = bulletPos.x - shooterPos.x;
				const dy = bulletPos.y - shooterPos.y;
				const dvx = bulletVec.x * targetSpeed;
				const dvy = bulletVec.y * targetSpeed;

				// 二次方程式を解いて迎撃時間を推定
				const a = dvx * dvx + dvy * dvy - shotSpeed * shotSpeed;
				const b = 2 * (dx * dvx + dy * dvy);
				const c = dx * dx + dy * dy;

				const discriminant = b * b - 4 * a * c;
				if (discriminant >= 0){
					const sqrtDisc = Math.sqrt(discriminant);
					let t1 = (-b - sqrtDisc) / (2 * a);
					let t2 = (-b + sqrtDisc) / (2 * a);

					const time = Math.min(t1, t2) > 0 ? Math.min(t1, t2) : Math.max(t1, t2);
					if (time >= 0){
						// 少し手前を狙うための係数（例：90%の位置を狙う）
						var biasFactor = 0.75;

						// 予測位置
						const futureX = bulletPos.x + dvx * time * biasFactor;
						const futureY = bulletPos.y + dvy * time * biasFactor;

						const aimAngle = Math.atan2(futureY - shooterPos.y, futureX - shooterPos.x);
						this.cannon.rotation = Rad_to_Rot(aimAngle) + 180;
					}
				}
			}
		},
		_Defense: function(){
			this.escapeTargets = [];

			if (BulletBase.collection.length > 0) {
				const escapeList = [];
				const match1 = [];
				for (const a of PlayerBulAimLite.list) {
					if (a.hitAABB(this.around)) {
						match1.push(a);
					}
				}
				const match2 = [];
				for (const a of BulAimLite.list) {
					if (a.hitAABB(this.around)) {
						match2.push(a);
					}
				}
				for (var i = 0, l = BulletBase.collection.length; i < l; i++) {
					const c = BulletBase.collection[i];
					if (!bulStack[c.num][c.id]) continue;

					const defFlg = Categorys.DefenceFlg[this.category];
					if ((c.num === 0 && !defFlg[0]) ||
						(c.num === this.num && !defFlg[1]) ||
						(c.num !== 0 && c.num !== this.num && !defFlg[2])) continue;

					const dist = (function Instrumentation(weak, target1, target2) {
						const dist1 = Get_Distance(weak, target1);
						const dist2 = Get_Distance(weak, target2);
						return dist1 >= dist2 ? dist2 : null;
					})(this.weak, this.attackTarget, c);
					if (dist == null) continue;

					const defRange = Categorys.DefenceRange[this.category];
					const escRange = Categorys.EscapeRange[this.category];

					let escapeScore = 0;

					switch (c.num) {
						case 0:
							if (dist < defRange[0]) {
								if (match1.some(elem => elem.target === c)){
									this.attackTarget = c; //  迎撃のためにターゲット変更
								}else{
									this.attackTarget = this.target;
								}
								if (escRange[0] && escRange[1] != 0 && dist < escRange[1]) {
									if (Search(c, this, 75, escRange[1])) {
										escapeScore += 1000 - dist;
									}
								}
							}
							break;

						case this.num:
							if (this.ref == 0) break;
							if (dist < defRange[1] && dist > 100) {
								if (match2.some(elem => elem.target === c)) {
									if (escRange[0] && escRange[2] != 0 && dist < escRange[2]) {
										if (Search(c, this, 60, escRange[2])) {
											escapeScore += 800 - dist;
										}
									}
									this.attackTarget = c; //  迎撃のためにターゲット変更
								}
							}
							
							break;

						default:
							if (dist < defRange[2]) {
								if (match2.some(elem => elem.target === c)){
									this.attackTarget = c; //  迎撃のためにターゲット変更
								}else{
									this.attackTarget = this.target;
								}
								if (escRange[0] && escRange[3] != 0 && dist < escRange[3]) {
									if (Search(c, this, 60, escRange[3])) {
									escapeScore += 600 - dist;
									}
								}
							}
							break;
					}

					if (escapeScore > 0) {
						escapeList.push({ bullet: c, score: escapeScore });
					}
				}
				// 優先度順にソート
				escapeList.sort((a, b) => b.score - a.score);

				// 複数の回避対象を保持
				this.escapeTargets = escapeList.map(item => item.bullet);
			}

			// 最も危険な弾を主回避対象に設定（従来互換）
			if (this.escapeTargets.length > 0) {
				this.escapeTarget = this.escapeTargets[0];
				this.escapeFlg = true;
			}
		},
		_Reload: function(){
			if (this.bulReloadFlg == false) {
				if (bullets[this.num] == this.bulMax) this.bulReloadFlg = true;
			} else {
				if (this.bulReloadTime < this.reload) {
					this.bulReloadTime++;
					if (this.shotNGflg == false) this.shotNGflg = true;
				} else {
					if (bullets[this.num] <= 0){
						this.shotNGflg = false;
						this.bulReloadFlg = false;
						this.bulReloadTime = 0;
					}
				}
			}
		}
	})

	//	精強型
	var Entity_Type8 = Class.create(TankBase, {
		initialize: function(x, y, category, num, scene) {
			TankBase.call(this, x, y, category, num, scene);

			/*this.weak.scale(0.8, 0.8);
			this.tank.scale(1.1, 1.1);
			this.cannon.scale(1.3, 1.1);*/

			this.around = new InterceptAround(this);
			this.front = new InterceptFront(this.cannon);

			//this.around.scale(1.5, 1.5);
			this.around.scale.apply(this.around, Categorys.AroundScale[this.category]);

			this.target = tankEntity[0];

			this.attackTarget = this.target;
			this.escapeTarget = null;

			this.cursor = new Target(this, scene);

			for (var i = 0; i < this.bulMax; i++) {
				bulStack[this.num].push(false); //  弾の状態をoff
			}

			var EnemyAim = Class.create(Aim, {
				initialize: function(cannon, cursor, category, num) {
					Aim.call(this, cannon, cursor, category, num, scene);
				}
			});

			const SelDirection = (target1, target2, or) => {
				let arr = [0, 1, 2, 3];
				if (or == 0) {
					if ((target1.x + target1.width / 2) > (target2.x + target2.width / 2)) { //	相手より右にいる場合
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) { //	相手より下にいる場合
							arr = [1, 2];
						} else {
							arr = [0, 1];
						}
					} else {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							arr = [2, 3];
						} else {
							arr = [0, 3];
						}
					}
				} else if (or == 1) {
					if ((target1.x + target1.width / 2) > (target2.x + target2.width / 2)) {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							arr = [0, 3];
						} else {
							arr = [2, 3];
						}
					} else {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							arr = [0, 1];
						} else {
							arr = [1, 2];
						}
					}
				}

				if (arr.length > 0) {
					if (arr.indexOf(this.dirValue) == -1) this.dirValue = arr[Math.floor(Math.random() * arr.length)];
				}
			}

			this.onenterframe = function() {
				if (!deadFlgs[this.num] && gameStatus == 0) {
					if (this.life > 0) {
						if (WorldFlg) {
							
							if(this._Damage()) this._ResetStatus();

							if (this.time % 45 == 0){
								this.moveRandom = Math.floor(Math.random() * 5) ? 1 : 0;
							}

							if (this.time % 2 == 0) {
								this.shotNGflg = false;
								this.fireFlg = false;
							}

							this.time++;

							if (this.hittingTime >= 35) {
								let arr = [];

								switch (this.dirValue) {
									case 0:
										this.y += this.moveSpeed;
										arr = [1, 3];
										break;
									case 1:
										this.x -= this.moveSpeed;
										arr = [0, 2];
										break;
									case 2:
										this.y -= this.moveSpeed;
										arr = [1, 3];
										break;
									case 3:
										this.x += this.moveSpeed;
										arr = [0, 2];
										break;
								}

								let rem = [];
								this.myPath = [parseInt((this.y + this.height / 2) / PixelSize), parseInt((this.x + this.width / 2) / PixelSize)];
								this.grid = JSON.parse(JSON.stringify(scene.grid));

								if (this.grid[this.myPath[0] - 1][this.myPath[1]] == 1) rem.push(0);
								if (this.grid[this.myPath[0]][this.myPath[1] + 1] == 1) rem.push(1);
								if (this.grid[this.myPath[0] + 1][this.myPath[1]] == 1) rem.push(2);
								if (this.grid[this.myPath[0]][this.myPath[1] - 1] == 1) rem.push(3);

								arr = arr.filter(i => rem.indexOf(i) == -1);

								if (arr.length == 0) {
									arr = [0, 1, 2, 3];
									arr = arr.filter(i => rem.indexOf(i) == -1);
								}

								if (arr.indexOf(this.dirValue) == -1) {
									this.dirValue = arr[Math.floor(Math.random() * arr.length)];
								}

								this.hittingTime = 0;
							}

							if (this.shotStopFlg) {
								this.shotStopTime++;
								if (this.shotStopTime > 10) {
									this.shotStopFlg = false;
									this.shotStopTime = 0;
								}
							} else {
								new EnemyAim(this.cannon, this.cursor, this.category, this.num);
							}

							if (this.time > 60){
								if (!this.fireFlg && EnemyAim.intersectStrict(this.cursor).length > 0){
									this.fireFlg = true; //  発射可能状態にする
								}	
							}

							if (this.ref > 0) {
								if (this.front.intersectStrict(RefObstracle).length > 0) this.shotNGflg = true;
							}

							if (this.time % 3 == 0) {
								if (this.attackTarget != this.target && !this.escapeFlg) this.attackTarget = this.target;
								this.escapeFlg = false;
							}

							this._Defense();
							
							this._Reload();
							
							let matchFront = TankBase.intersectStrict(this.front);
							if (matchFront.length > 0){
								if(matchFront[0].num != this.num && !deadFlgs[matchFront[0].num] && matchFront[0].num != 0) this.fireFlg = false;
							}

							if (!this.shotNGflg) {
								if (this.time % this.fireLate == 0 && (this.fireFlg || this.fullFireFlg)) {
									if (bulStack[this.num][Math.floor(Math.random() * this.bulMax)] == false || this.fullFireFlg) {
										this._Attack();
									}
								}
							}

							if (this.moveSpeed > 0) {
								if (this.time % 5 == 0) {
									if (this.escapeFlg) {
										this.dirValue = Escape_Rot4(this, this.escapeTarget, this.dirValue);
									} else {
										if (Math.sqrt(Math.pow(this.weak.x - this.attackTarget.x, 2) + Math.pow(this.weak.y - this.attackTarget.y, 2)) < this.distance) {
											SelDirection(this.weak, this.attackTarget, 0);
										} else {
											if (this.time % 10 == 0) {
												SelDirection(this.weak, this.attackTarget, this.moveRandom);
											}
										}
										if (Bom.collection.length > 0) {
											for (var i = 0, l = Bom.collection.length; i < l; i++) {
												let c = Bom.collection[i];
												if (Math.sqrt(Math.pow(this.weak.x - c.x, 2) + Math.pow(this.weak.y - c.y, 2)) < 200) {
													SelDirection(this.weak, c, 0);
													break;
												}
											}
										}
									}
								}
								if (!this.shotStopFlg) {
									if (this.dirValue == 0) {
										this.rot = 0;
									} else if (this.dirValue == 1) {
										this.rot = 90;
									} else if (this.dirValue == 2) {
										this.rot = 180;
									} else if (this.dirValue == 3) {
										this.rot = 270;
									}
									this._Move(this.rot);

								}
							}

							TankObstracle.intersect(this).forEach(elem => {
								if (!deadFlgs[elem.num] && elem.num != this.num) {
									switch (elem.name) {
										case 'TankTop':
											this.moveTo(this.x, elem.y - 60);
											break;
										case 'TankBottom':
											this.moveTo(this.x, elem.y + (elem.height));
											break;
										case 'TankLeft':
											this.moveTo(elem.x - 60, this.y);
											break;
										case 'TankRight':
											this.moveTo(elem.x + (elem.width), this.y);
											break;
									}
									this.hittingTime++;
								}
							})

							Obstracle.intersect(this).forEach(elem => {
								switch (elem.name) {
									case 'ObsTop':
										this.moveTo(this.x, elem.y - 60);
										break;
									case 'ObsBottom':
										this.moveTo(this.x, elem.y + (elem.height))
										break;
									case 'ObsLeft':
										this.moveTo(elem.x - 60, this.y)
										break;
									case 'ObsRight':
										this.moveTo(elem.x + (elem.width), this.y)
										break;
								}
								this.hittingTime++;
							})
						}
					} else {
						destruction++;
						this._Dead();
					}
				}
			}
		},
		_Attack: function() {
			if (!this.fullFireFlg && gameMode == -1 && Math.floor(Math.random() * 3)) return;
			if (WorldFlg) { //  処理しても良い状態か
				if (bullets[this.num] < this.bulMax && deadFlgs[this.num] == false) { //  発射最大数に到達していないか＆死んでいないか
					let stack = bulStack[this.num];
					for (let i = 0; i < this.bulMax; i++) {
						if (!stack[i]) { //  弾の状態がoffならば
							this.shotStopFlg = true;
							if (Math.floor(Math.random() * 3) == 0 && gameMode > 0) this._ResetAim();
							new BulletCol(this.shotSpeed, this.ref, this.cannon, this.category, this.num, i)._Shot();
							if ((this.life / Categorys.Life[this.category]) < 0.25) {
								this.fullFireFlg = true;
								this.firecnt++;
								this.fireLate = (Math.floor(Math.random() * 4) + 1) * 10;
							}
							break;
						}
					}

				}
			}
		},
		_ResetAim: function() {
			if (this.attackTarget.name == "Entity") {
				let t1 = Get_Center(this);
				let t2 = Get_Center(this.attackTarget);
				let v = Rot_to_Vec(this.attackTarget.rotation, -90);
				let val = 16 * (Math.floor(Math.random() * 3) + 1) + 24
				v.x = v.x * val + t2.x;
				v.y = v.y * val + t2.y;
				let p = {
					x: t1.x - v.x,
					y: t1.y - v.y
				};
				let rad = Math.atan2(p.y, p.x);
				this.cannon.rotation = Rad_to_Rot(rad);
			}
		},
		_ResetStatus: function() {
			let percent = (this.life / Categorys.Life[this.category]);
			if (percent < 0.25) {
				if (this.moveSpeed > 1) this.moveSpeed = Categorys.MoveSpeed[this.category] + 0.2;
				this.fireLate = Categorys.FireLate[this.category] - 10;
				this.shotSpeed = Categorys.ShotSpeed[this.category] + 5;
				this.ref = 0;
				this.reload = Categorys.Reload[this.category] - 30;
			} else if (percent < 0.5) {
				if (this.moveSpeed > 1) this.moveSpeed = Categorys.MoveSpeed[this.category] - 0.3;
				this.fireLate = Categorys.FireLate[this.category] + 5;
				this.shotSpeed = Categorys.ShotSpeed[this.category] - 1;
			} else if (percent < 0.75) {
				if (this.moveSpeed > 1) this.moveSpeed = Categorys.MoveSpeed[this.category] + 0.4;
			}
		},
		_Defense: function(){
			if (BulletBase.collection.length > 0) {
				const match1 = [];
				for (const a of PlayerBulAimLite.list) {
					if (a.hitAABB(this.around)) {
						match1.push(a);
					}
				}
				const match2 = [];
				for (const a of BulAimLite.list) {
					if (a.hitAABB(this.around)) {
						match2.push(a);
					}
				}
				for (var i = 0, l = BulletBase.collection.length; i < l; i++) {
					const c = BulletBase.collection[i];
					if (!bulStack[c.num][c.id]) continue;

					const defFlg = Categorys.DefenceFlg[this.category];
					if ((c.num === 0 && !defFlg[0]) ||
						(c.num === this.num && !defFlg[1]) ||
						(c.num !== 0 && c.num !== this.num && !defFlg[2])) continue;

					const dist = (function Instrumentation(weak, target1, target2) {
						const dist1 = Get_Distance(weak, target1);
						const dist2 = Get_Distance(weak, target2);
						return dist1 >= dist2 ? dist2 : null;
					})(this.weak, this.attackTarget, c);
					if (dist == null) continue;

					const defRange = Categorys.DefenceRange[this.category];
					const escRange = Categorys.EscapeRange[this.category];

					switch (c.num) {
						case 0:
							if (dist < defRange[0]) {
								if (match1.some(elem => elem.target === c)){
									this.attackTarget = c; //  迎撃のためにターゲット変更
								}
								if (escRange[0] && escRange[1] != 0) {
									if (dist < escRange[1]) {
										this.escapeTarget = c;
										this.escapeFlg = true;
									}
								}
							}
							break;

						case this.num:
							if (this.ref == 0) break;
							if (dist < defRange[1] && dist > 100) {
								if (match2.some(elem => elem.target === c)) {
									if (escRange[0] && escRange[2] != 0) {
										if (dist < escRange[2]) {
											this.escapeTarget = c;
											this.escapeFlg = true;
										}
									}
									this.attackTarget = c; //  迎撃のためにターゲット変更
								}
							}
							break;

						default:
							if (dist < defRange[2]) {
								if (match2.some(elem => elem.target === c)){
									this.attackTarget = c; //  迎撃のためにターゲット変更
								}
								if (escRange[0] && escRange[3] != 0) {
									if (dist < escRange[3]) {
										this.escapeTarget = c;
										this.escapeFlg = true;
									}
								}
							}
							break;
					}
				}
			}
		},
		_Reload: function(){
			if (this.bulReloadFlg == false) {
				if (bullets[this.num] == this.bulMax || this.firecnt == this.bulMax) {
					this.bulReloadFlg = true;
					this.fullFireFlg = false;
					this.firecnt = 0;
					if((this.life / Categorys.Life[this.category]) < 0.25)this.fireLate = Categorys.FireLate[this.category] - 10;
				}
			} else {
				if (this.bulReloadTime < this.reload) {
					this.bulReloadTime++;
					if (this.shotNGflg == false) this.shotNGflg = true;
				} else {
					if (bullets[this.num] <= 0){
						this.shotNGflg = false;
						this.bulReloadFlg = false;
						this.bulReloadTime = 0;
					}
				}

			}
		}
	})

	//	異能型
	var Entity_Type9 = Class.create(TankBase, {
		initialize: function(x, y, category, num, scene) {
			TankBase.call(this, x, y, category, num, scene);

			this.around = new InterceptAround(this);
			this.front = new InterceptFront(this.cannon);

			this.around.scale.apply(this.around, Categorys.AroundScale[this.category]);

			this.target = tankEntity[0];

			this.attackTarget = this.target;
			this.escapeTarget = null;

			this.cursor = new Target(this, scene);

			this.distance = Categorys.Distances[this.category];

			for (var i = 0; i < this.bulMax; i++) {
				bulStack[this.num].push(false); //  弾の状態をoff
			}

			var EnemyAim = Class.create(Aim, {
				initialize: function(cannon, cursor, category, num) {
					Aim.call(this, cannon, cursor, category, num, scene);
				}
			});

			const SelDirection = (target1, target2, or) => {
				let arr = [0, 1, 2, 3, 4, 5, 6, 7];

				const cx1 = target1.x + target1.width / 2;
				const cy1 = target1.y + target1.height / 2;
				const cx2 = target2.x + target2.width / 2;
				const cy2 = target2.y + target2.height / 2;

				// 近づく or 離れるの象限ベース候補
				if (or === 0) { // 離れる
					if (cx1 > cx2) {
						if (cy1 > cy2) arr = [1, 2, 5];
						else            arr = [0, 1, 4];
					} else {
						if (cy1 > cy2) arr = [2, 3, 6];
						else            arr = [0, 3, 7];
					}
				} else { // 近づく
					if (cx1 > cx2) {
						if (cy1 > cy2) arr = [0, 3, 7];
						else            arr = [2, 3, 6];
					} else {
						if (cy1 > cy2) arr = [0, 1, 4];
						else            arr = [1, 2, 5];
					}
				}

				// 壁チェック
				const safe = arr.filter(d => canMoveTank(cx1, cy1, d));

				// 壁で全滅したら元の候補に戻す
				const finalArr = safe.length > 0 ? safe : arr;

				// ランダム性を維持
				if (!finalArr.includes(this.dirValue)) {
					this.dirValue = finalArr[Math.floor(Math.random() * finalArr.length)];
				}
			};

			function canMoveTank(cx, cy, dir) {
				const dirVec = [
					{x: 0,  y:-1}, // 0 上
					{x: 1,  y: 0}, // 1 右
					{x: 0,  y: 1}, // 2 下
					{x:-1, y: 0}, // 3 左
					{x: 1,  y:-1}, // 4 右上
					{x: 1,  y: 1}, // 5 右下
					{x:-1, y: 1}, // 6 左下
					{x:-1, y:-1}  // 7 左上
				];

				const v = dirVec[dir];

				// 移動後の中心座標
				const nx = cx + v.x * 32;
				const ny = cy + v.y * 32;

				// 戦車の半径（60×60 → 半径30）
				const r = 30;

				// 四隅の座標
				const points = [
					{x: nx - r, y: ny - r}, // 左上
					{x: nx + r, y: ny - r}, // 右上
					{x: nx - r, y: ny + r}, // 左下
					{x: nx + r, y: ny + r}  // 右下
				];

				for (const p of points) {
					const gx = Math.floor(p.x / PixelSize);
					const gy = Math.floor(p.y / PixelSize);

					if (scene.grid[gy]?.[gx] === 1) {
						return false; // どれか1つでも壁に当たるなら移動不可
					}
				}

				return true; // 全て通れるならOK
			}


			this.onenterframe = function() {
				if (!deadFlgs[this.num] && gameStatus == 0) {
					if (this.life > 0) {
						if (WorldFlg) {
							
							if(this._Damage()) this._ResetStatus();

							if (this.time % 2 == 0) {
								this.shotNGflg = false;
								this.fireFlg = false;
							}

							this.time++;

							if (this.time % 45 == 0){
								this.moveRandom = Math.floor(Math.random() * 5) ? 1 : 0;
							}

							if (this.hittingTime >= 35) {
								let arr = [];

								switch (this.dirValue) {
									case 0:
									case 2:
										arr = [1, 3];
										break;
									case 1:
									case 3:
										arr = [0, 2];
										break;
									case 4:
									case 6:
										arr = [5, 7];
										break;
									case 5:
									case 7:
										arr = [4, 6];
								}

								let rem = [];
								this.myPath = [parseInt((this.y + this.height / 2) / PixelSize), parseInt((this.x + this.width / 2) / PixelSize)];
								this.grid = JSON.parse(JSON.stringify(scene.grid));
								let bk = arr;

								if (this.grid[this.myPath[0] - 1][this.myPath[1]] == 1) rem.push(0);
								if (this.grid[this.myPath[0]][this.myPath[1] + 1] == 1) rem.push(1);
								if (this.grid[this.myPath[0] + 1][this.myPath[1]] == 1) rem.push(2);
								if (this.grid[this.myPath[0]][this.myPath[1] - 1] == 1) rem.push(3);
								if (this.grid[this.myPath[0] - 1][this.myPath[1] + 1] == 1) rem.push(4);
								if (this.grid[this.myPath[0] + 1][this.myPath[1] + 1] == 1) rem.push(5);
								if (this.grid[this.myPath[0] + 1][this.myPath[1] - 1] == 1) rem.push(6);
								if (this.grid[this.myPath[0] - 1][this.myPath[1] - 1] == 1) rem.push(7);

								arr = arr.filter(i => rem.indexOf(i) == -1);

								if (arr.length == 0) {
									arr = bk;
								}

								if (arr.indexOf(this.dirValue) == -1) {
									this.dirValue = arr[Math.floor(Math.random() * arr.length)];
								}

								this.hittingTime = 0;
							}

							if (this.shotStopFlg) {
								this.shotStopTime++;
								if (this.shotStopTime > 10) {
									this.shotStopFlg = false;
									this.shotStopTime = 0;
								}
							} else {
								new EnemyAim(this.cannon, this.cursor, this.category, this.num);
							}

							if (this.time > 60){
								if (!this.fireFlg && EnemyAim.intersectStrict(this.cursor).length > 0){
									this.fireFlg = true; //  発射可能状態にする
								}
							}
							

							if (this.ref > 0) {
								if (this.front.intersectStrict(RefObstracle).length > 0) this.shotNGflg = true;
							}

							if (this.time % 3 == 0) {
								if (this.attackTarget != this.target && !this.escapeFlg) this.attackTarget = this.target;
								this.escapeFlg = false;
							}

							this._Defense();
							
							this._Reload();

							let matchFront = TankBase.intersectStrict(this.front);
							if (matchFront.length > 0){
								if(matchFront[0].num != this.num && !deadFlgs[matchFront[0].num] && matchFront[0].num != 0) this.fireFlg = false;
							}

							if (!this.shotNGflg) {
								if (this.time % this.fireLate == 0 && (this.fireFlg || this.fullFireFlg)) {
									if (Math.floor(Math.random() * this.bulMax * 2) > bullets[this.num] || this.fullFireFlg) {
										this._Attack();
									}
								}
							}

							if (this.moveSpeed > 0) {
								if (this.time % 3 == 0) {
									if (this.escapeFlg) {
										if (gameMode > 0)
											this.dirValue = Escape_Rot8_Elite(this, this.escapeTarget, this.dirValue);
										else
											this.dirValue = Escape_Rot8(this, this.escapeTarget, this.dirValue);
									} else if (this.moveFlg) {
										if (Math.sqrt(Math.pow(this.weak.x - this.attackTarget.x, 2) + Math.pow(this.weak.y - this.attackTarget.y, 2)) < this.distance) {
											SelDirection(this.weak, this.attackTarget, 0);
										} else {

											if (this.time % 9 == 0) {
												SelDirection(this.weak, this.attackTarget, this.moveRandom);
											}

										}
										if (Bom.collection.length > 0) {
											for (var i = 0, l = Bom.collection.length; i < l; i++) {
												let c = Bom.collection[i];
												if (Math.sqrt(Math.pow(this.weak.x - c.x, 2) + Math.pow(this.weak.y - c.y, 2)) < 200) {
													SelDirection(this.weak, c, 0);
													break;
												}
											}
										}
									}
								}
								if (!this.shotStopFlg) {
									switch (this.dirValue) {
										case 0:
											this.rot = 0;
											break;
										case 1:
											this.rot = 90;
											break;
										case 2:
											this.rot = 180;
											break;
										case 3:
											this.rot = 270;
											break;
										case 4:
											this.rot = 45;
											break;
										case 5:
											this.rot = 135;
											break;
										case 6:
											this.rot = 225;
											break;
										case 7:
											this.rot = 315;
											break;
									}
									this._Move(this.rot);

								}
							}

							TankObstracle.intersect(this).forEach(elem => {
								if (!deadFlgs[elem.num] && elem.num != this.num) {
									switch (elem.name) {
										case 'TankTop':
											this.moveTo(this.x, elem.y - 60);
											break;
										case 'TankBottom':
											this.moveTo(this.x, elem.y + (elem.height));
											break;
										case 'TankLeft':
											this.moveTo(elem.x - 60, this.y);
											break;
										case 'TankRight':
											this.moveTo(elem.x + (elem.width), this.y);
											break;
									}
									this.hittingTime++;
								}

							})

							Obstracle.intersect(this).forEach(elem => {
								switch (elem.name) {
									case 'ObsTop':
										this.moveTo(this.x, elem.y - 60);
										break;
									case 'ObsBottom':
										this.moveTo(this.x, elem.y + (elem.height))
										break;
									case 'ObsLeft':
										this.moveTo(elem.x - 60, this.y)
										break;
									case 'ObsRight':
										this.moveTo(elem.x + (elem.width), this.y)
										break;
								}
								this.hittingTime++;
							})
						}
					} else {
						destruction++;
						this._Dead();
					}
				}
			}
		},
		_Attack: function() {
			if (!this.fullFireFlg && gameMode == -1 && Math.floor(Math.random() * 3)) return;
			if (WorldFlg) { //  処理しても良い状態か
				if (bullets[this.num] < this.bulMax && deadFlgs[this.num] == false) { //  発射最大数に到達していないか＆死んでいないか
					let stack = bulStack[this.num];
					for (let i = 0; i < this.bulMax; i++) {
						if (!stack[i]) { //  弾の状態がoffならば
							this.shotStopFlg = true;
							if (Math.floor(Math.random() * 2) == 0 && gameMode > 0) this._ResetAim();

							if ((this.life / Categorys.Life[this.category]) < 0.35) {
								if (!this.fullFireFlg) {
									if (Math.floor(Math.random() * 7) == 0) {
										this.fullFireFlg = true;
										this.cannon.rotation += (Math.floor(Math.random() * 3) - 1);
										this.firecnt++;
										this.fireLate = 8;
									}
								} else {
									this.cannon.rotation += (Math.floor(Math.random() * 3) - 1);
									this.firecnt++;
								}
							}
							if (bullets[this.num] % 2 == 1){
								new PhysBulletCol(this.shotSpeed, this.ref, this.cannon, this.category, this.num, i, this.cursor)._Shot();
							}
							else{
								new BulletCol(this.shotSpeed, this.ref, this.cannon, this.category, this.num, i)._Shot();
							}
							break;
						}
					}

				}
			}
		},
		_ResetAim: function() {
			if (this.attackTarget.name == "Entity") {
				let t1 = Get_Center(this);
				let t2 = Get_Center(this.attackTarget);
				let v = Rot_to_Vec(this.attackTarget.rotation, -90);
				let val = 16 * (Math.floor(Math.random() * 5) + 1) + 24
				v.x = v.x * val + t2.x;
				v.y = v.y * val + t2.y;
				let p = {
					x: t1.x - v.x,
					y: t1.y - v.y
				};
				let rad = Math.atan2(p.y, p.x);
				this.cannon.rotation = Rad_to_Rot(rad);
			}
			else if (this.attackTarget.name == 'Bullet' || this.attackTarget.name == 'PhyBullet') {
				const shooterPos = Get_Center(this);
				const bullet = this.attackTarget;
				const bulletPos = Get_Center(bullet);
				const bulletVec = Rot_to_Vec(bullet.rotation, -90);
				const targetSpeed = this.attackTarget.name == 'Bullet' ? bullet.from.shotSpeed : bullet.shotSpeed;
				const shotSpeed = this.shotSpeed;

				// 相対位置と速度ベクトル
				const dx = bulletPos.x - shooterPos.x;
				const dy = bulletPos.y - shooterPos.y;
				const dvx = bulletVec.x * targetSpeed;
				const dvy = bulletVec.y * targetSpeed;

				// 二次方程式を解いて迎撃時間を推定
				var a = dvx * dvx + dvy * dvy - shotSpeed * shotSpeed;
				var b = 2 * (dx * dvx + dy * dvy);
				var c = dx * dx + dy * dy;

				if (Math.abs(a) < 0.0001) {
					if (gameMode == 2){
						a = a <= 0 ? 0.0001 : -0.0001; 
					}
					else{
						const aimAngle = Math.atan2(dy, dx);
						this.cannon.rotation = Rad_to_Rot(aimAngle) + 180;
						return;
					}
				}

				const discriminant = b * b - 4 * a * c;
				if (discriminant >= 0){
					const sqrtDisc = Math.sqrt(discriminant);
					let t1 = (-b - sqrtDisc) / (2 * a);
					let t2 = (-b + sqrtDisc) / (2 * a);

					const time = Math.min(t1, t2) > 0 ? Math.min(t1, t2) : Math.max(t1, t2);
					if (time >= 0){
						// 少し手前を狙うための係数（例：90%の位置を狙う）
						var biasFactor = 0.4;

						// 予測位置
						const futureX = bulletPos.x + dvx * time * biasFactor;
						const futureY = bulletPos.y + dvy * time * biasFactor;

						const aimAngle = Math.atan2(futureY - shooterPos.y, futureX - shooterPos.x);
						this.cannon.rotation = Rad_to_Rot(aimAngle) + 180;
					}
				}
			}
		},
		_ResetStatus: function() {
			let percent = (this.life / Categorys.Life[this.category]);
			if (percent < 0.35) {
				if (this.moveSpeed > 1) this.moveSpeed = Categorys.MoveSpeed[this.category] + 0.4;
				this.fireLate = Categorys.FireLate[this.category] - 8;
				this.shotSpeed = Categorys.ShotSpeed[this.category] + 3;
				this.bodyRotSpeed = Categorys.BodyRotSpeed[this.category] + 7;
				this.ref = 0;
				this.reload = Categorys.Reload[this.category] - 30;
				this.distance = Categorys.Distances[this.category] + 160;
			} else if (percent < 0.6) {
				if (this.moveSpeed > 1) this.moveSpeed = Categorys.MoveSpeed[this.category] - 0.4;
				this.fireLate = Categorys.FireLate[this.category] + 3;
				this.shotSpeed = Categorys.ShotSpeed[this.category] - 1;
				this.bodyRotSpeed = Categorys.BodyRotSpeed[this.category] + 4;
				this.distance = Categorys.Distances[this.category] + 64;
			} else if (percent < 0.8) {
				if (this.moveSpeed > 1) this.moveSpeed = Categorys.MoveSpeed[this.category] + 0.2;
			}
		},
		_Defense: function(){
			if (BulletBase.collection.length > 0) {
				const match1 = [];
				for (const a of PlayerBulAimLite.list) {
					if (a.hitAABB(this.around)) {
						match1.push(a);
					}
				}
				const match2 = [];
				for (const a of BulAimLite.list) {
					if (a.hitAABB(this.around)) {
						match2.push(a);
					}
				}
				for (var i = 0, l = BulletBase.collection.length; i < l; i++) {
					const c = BulletBase.collection[i];
					if (!bulStack[c.num][c.id]) continue;

					const defFlg = Categorys.DefenceFlg[this.category];
					if ((c.num === 0 && !defFlg[0]) ||
						(c.num === this.num && !defFlg[1]) ||
						(c.num !== 0 && c.num !== this.num && !defFlg[2])) continue;

					const dist = (function Instrumentation(weak, target1, target2) {
						const dist1 = Get_Distance(weak, target1);
						const dist2 = Get_Distance(weak, target2);
						return dist1 >= dist2 ? dist2 : null;
					})(this.weak, this.attackTarget, c);
					if (dist == null) continue;

					const defRange = Categorys.DefenceRange[this.category];
					const escRange = Categorys.EscapeRange[this.category];

					switch (c.num) {
						case 0:
							if (dist < defRange[0]) {
								if (match1.some(elem => elem.target === c)){
									this.attackTarget = c; //  迎撃のためにターゲット変更
								}else{
									this.attackTarget = this.target;
								}
								if (escRange[0] && escRange[1] != 0) {
									if (dist < escRange[1]) {
										if (Search(c, this, 80, escRange[1])) {
											this.escapeTarget = c;
											this.escapeFlg = true;
										}
									}
								}
							}
							break;

						case this.num:
							if (this.ref == 0) break;
							if (dist < defRange[1] && dist > 100) {
								if (match2.some(elem => elem.target === c)) {
									if (escRange[0] && escRange[2] != 0) {
										if (dist < escRange[2]) {
											this.escapeTarget = c;
											this.escapeFlg = true;
										}
									}
									this.attackTarget = c; //  迎撃のためにターゲット変更
								}
							}
							break;

						default:
							if (dist < defRange[2]) {
								if (match2.some(elem => elem.target === c)){
									this.attackTarget = c; //  迎撃のためにターゲット変更
								}
								if (escRange[0] && escRange[3] != 0) {
									if (dist < escRange[3]) {
										this.escapeTarget = c;
										this.escapeFlg = true;
									}
								}
							}
							break;
					}
				}
			}
		},
		_Reload: function(){
			if (this.bulReloadFlg == false) {
				if (bullets[this.num] == this.bulMax || this.firecnt == this.bulMax) {
					this.bulReloadFlg = true;
					this.fullFireFlg = false;
					this.firecnt = 0;
					if((this.life / Categorys.Life[this.category]) < 0.35)this.fireLate = 16;
					this.distance = Categorys.Distances[this.category] + 200;
				}
			} else {
				if (this.bulReloadTime < this.reload) {
					this.bulReloadTime++;
					if (this.shotNGflg == false) this.shotNGflg = true;
				} else {
					if (bullets[this.num] <= 0){
						this.shotNGflg = false;
						this.bulReloadFlg = false;
						this.bulReloadTime = 0;
						let percent = (this.life / Categorys.Life[this.category]);
						if (percent < 0.35) this.distance = Categorys.Distances[this.category] + 160;
						else if (percent < 0.6) this.distance = Categorys.Distances[this.category] + 64;
						else this.distance = Categorys.Distances[this.category];
					}	
				}
			}
		}
	});

	//	自機模倣型
	var Entity_Type10 = Class.create(TankBase, {
		initialize: function(x, y, category, num, scene) {
			TankBase.call(this, x, y, category, num, scene);

			const self = this;
			//if(gameMode == 2)this.weak.scale(0.6, 0.6);

			this.around = new InterceptAround(this);
			this.front = new InterceptFront(this.cannon);

			this.target = tankEntity[0];

			//this.around.scale(1.5, 1.5);
			this.around.scale.apply(this.around, Categorys.AroundScale[this.category]);

			this.attackTarget = this.target;
			this.escapeTarget = null;

			this.cursor = new Target(this, scene);

			var rootFlg = false;

			for (var i = 0; i < this.bulMax; i++) {
				bulStack[this.num].push(false); //  弾の状態をoff
			}

			var EnemyAim = Class.create(Aim, {
				initialize: function(cannon, cursor, category, num) {
					Aim.call(this, cannon, cursor, category, num, scene);
				}
			});

			const NG_root_set = () => {
				dir = [];
				if (self.grid[self.myPath[0] - 1][self.myPath[1]] == 1) dir.push(0);
				if (self.grid[self.myPath[0]][self.myPath[1] + 1] == 1) dir.push(1);
				if (self.grid[self.myPath[0] + 1][self.myPath[1]] == 1) dir.push(2);
				if (self.grid[self.myPath[0]][self.myPath[1] - 1] == 1) dir.push(3);
				if (self.grid[self.myPath[0] - 1][self.myPath[1] + 1] == 1) dir.push(4);
				if (self.grid[self.myPath[0] + 1][self.myPath[1] + 1] == 1) dir.push(5);
				if (self.grid[self.myPath[0] + 1][self.myPath[1] - 1] == 1) dir.push(6);
				if (self.grid[self.myPath[0] - 1][self.myPath[1] - 1] == 1) dir.push(7);
				return dir;
			};

			const SelDirection = (target1, target2, or) => {
				let arr = [0, 1, 2, 3, 4, 5, 6, 7];
				//	0:	離れる	1:	近寄る
				//	0:	上
				// 	1:	右
				// 	2:	下
				// 	3:	左
				//	4:	右上
				//	5:	右下
				//	6:	左下
				//	7:	左上
				if (or == 0) {
					if ((target1.x + target1.width / 2) > (target2.x + target2.width / 2)) { //	相手より右にいる場合
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) { //	相手より下にいる場合
							arr = [1, 2, 5];
						} else {
							arr = [0, 1, 4];
						}
					} else {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							arr = [2, 3, 6];
						} else {
							arr = [0, 3, 7];
						}
					}
				} else if (or == 1) {
					if ((target1.x + target1.width / 2) > (target2.x + target2.width / 2)) {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							arr = [0, 3, 7];
						} else {
							arr = [2, 3, 6];
						}
					} else {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							arr = [0, 1, 4];
						} else {
							arr = [1, 2, 5];
						}
					}
				}

				self.myPath = [parseInt((target1.y + target1.height / 2) / PixelSize), parseInt((target1.x + target1.width / 2) / PixelSize)];
				self.grid = JSON.parse(JSON.stringify(scene.grid));
				let bk = arr;

				let ng = NG_root_set();
				arr = arr.filter(i => ng.indexOf(i) == -1);

				if (arr.length == 0) {
					arr = bk;
				}

				if (arr.indexOf(self.dirValue) == -1) self.dirValue = arr[Math.floor(Math.random() * arr.length)];
			}

			// ===============================
			// 爆弾回避ロジック 完全版
			// ===============================

			const RANGE = 4; // 自分を中心に4マス → 9×9

			// --- ローカルグリッド取得 ---
			function getLocalGrid(sceneGrid, cx, cy) {
				const local = [];
				const H = sceneGrid.length;      // 15
				const W = sceneGrid[0].length;   // 20

				for (let dy = -RANGE; dy <= RANGE; dy++) {
					const row = [];
					for (let dx = -RANGE; dx <= RANGE; dx++) {
						const y = cy + dy;
						const x = cx + dx;

						if (y < 0 || y >= H || x < 0 || x >= W) {
							row.push(1); // 範囲外は壁扱い
						} else {
							row.push(sceneGrid[y][x]);
						}
					}
					local.push(row);
				}
				return local;
			}


			// --- 爆風範囲外の安全セル ---
			function getSafeCells(localGrid, targetLocalPos, safeRange = 3) {
				const safe = [];
				const size = localGrid.length;

				for (let y = 0; y < size; y++) {
					for (let x = 0; x < size; x++) {
						if (localGrid[y][x] === 1) continue;

						const dx = x - targetLocalPos.x;
						const dy = y - targetLocalPos.y;

						if (Math.abs(dx) > safeRange || Math.abs(dy) > safeRange) {
							safe.push({ x, y });
						}
					}
				}
				return safe;
			}


			// --- 危険度コスト（1マス隙間を避ける） ---
			function dangerCost(grid, x, y) {
				let cost = 1;

				const dirs = [
					{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}
				];

				let wallCount = 0;

				for (const d of dirs) {
					const nx = x + d.x;
					const ny = y + d.y;

					// ★ 範囲外は壁扱い
					if (ny < 0 || ny >= grid.length || nx < 0 || nx >= grid[0].length) {
						wallCount++;
						continue;
					}

					if (grid[ny][nx] === 1) {
						wallCount++;
					}
				}

				if (wallCount >= 2) {
					cost += 5;
				} else if (wallCount === 1) {
					cost += 2;
				}

				return cost;
			}


			// --- A*（危険度コスト付き） ---
			function astar(grid, start, goal) {
				const H = grid.length;
				const W = grid[0].length;

				const open = [];
				const closed = new Set();

				open.push({
					x: start.x,
					y: start.y,
					g: 0,
					h: Math.abs(goal.x - start.x) + Math.abs(goal.y - start.y),
					parent: null
				});

				while (open.length > 0) {
					open.sort((a,b)=> (a.g+a.h)-(b.g+b.h));
					const cur = open.shift();
					const key = `${cur.x},${cur.y}`;
					if (closed.has(key)) continue;
					closed.add(key);

					if (cur.x === goal.x && cur.y === goal.y) {
						const path = [];
						let p = cur;
						while (p) {
							path.push({x:p.x, y:p.y});
							p = p.parent;
						}
						return path.reverse();
					}

					const dirs = [
						{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1},
						{x:1,y:1},{x:1,y:-1},{x:-1,y:1},{x:-1,y:-1}
					];

					for (const d of dirs) {
						const nx = cur.x + d.x;
						const ny = cur.y + d.y;

						// ★ 範囲外は無視
						if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;

						if (grid[ny][nx] === 1) continue;

						const nkey = `${nx},${ny}`;
						if (closed.has(nkey)) continue;

						const moveCost = dangerCost(grid, nx, ny);

						open.push({
							x: nx,
							y: ny,
							g: cur.g + moveCost,
							h: Math.abs(goal.x - nx) + Math.abs(goal.y - ny),
							parent: cur
						});
					}
				}
				return null;
			}


			// --- 最遠セル（フォールバック用） ---
			function findFarthestCell(localGrid, targetLocalPos) {
				let best = null;
				let bestDist = -1;

				for (let y = 0; y < localGrid.length; y++) {
					for (let x = 0; x < localGrid[0].length; x++) {
						if (localGrid[y][x] === 1) continue;

						const dx = x - targetLocalPos.x;
						const dy = y - targetLocalPos.y;
						const dist = dx*dx + dy*dy;

						if (dist > bestDist) {
							bestDist = dist;
							best = { x, y };
						}
					}
				}
				return best;
			}

			// --- 方向変換 ---
			function dirFromDelta(dx, dy) {
				if (dx === 0 && dy === -1) return 0;
				if (dx === 1 && dy === 0) return 1;
				if (dx === 0 && dy === 1) return 2;
				if (dx === -1 && dy === 0) return 3;
				if (dx === 1 && dy === -1) return 4;
				if (dx === 1 && dy === 1) return 5;
				if (dx === -1 && dy === 1) return 6;
				if (dx === -1 && dy === -1) return 7;
				return null;
			}

			// --- escapeFromTarget（完全版） ---
			function escapeFromTarget(self, target) {
				const selfCenter = Get_Center(self);
				const targetCenter = Get_Center(target);

				const cx = Math.floor(selfCenter.x / 64);
				const cy = Math.floor(selfCenter.y / 64);

				const tx = Math.floor(targetCenter.x / 64);
				const ty = Math.floor(targetCenter.y / 64);

				const localGrid = getLocalGrid(scene.grid, cx, cy);

				const start = { x: RANGE, y: RANGE };
				const targetLocal = { 
					x: RANGE + (tx - cx), 
					y: RANGE + (ty - cy) 
				};

				// ① 安全セルを列挙
				const safeCells = getSafeCells(localGrid, targetLocal, 4);

				let bestPath = null;

				// ② 安全セルの中から最短で行ける場所を探す
				for (const cell of safeCells) {
					const path = astar(localGrid, start, cell);
					if (!path) continue;

					if (!bestPath || path.length < bestPath.length) {
						bestPath = path;
					}
				}

				// ③ 安全セルへ行けるならその方向へ
				if (bestPath && bestPath.length >= 2) {
					const next = bestPath[1];
					return dirFromDelta(next.x - start.x, next.y - start.y);
				}

				// ④ 安全セルが無い → 最遠セルへフォールバック
				const goal = findFarthestCell(localGrid, targetLocal);
				if (!goal) return null;

				const path = astar(localGrid, start, goal);
				if (!path || path.length < 2) return null;

				const next = path[1];
				return dirFromDelta(next.x - start.x, next.y - start.y);
			}

			this.onenterframe = function() {
				if (!deadFlgs[this.num] && gameStatus == 0) {
					if (this.life > 0) {
						if (WorldFlg) {
							
							this._Damage();

							if (this.time % 3 == 0) {
								if (!this.escapeFlg) rootFlg = false;
								if (this.attackTarget != this.target) rootFlg = true;

								this.shotNGflg = false;
								this.fireFlg = false;

								if (this.moveSpeed > 0 && !rootFlg) {
									
									if (this.time % 60 == 0 && !this.bomSetFlg) {
										this.grid = JSON.parse(JSON.stringify(scene.grid));
										this.map = Object.assign({}, scene.backgroundMap);

										//  自身の位置とターゲットの位置をざっくり算出
										this.myPath = [parseInt((this.y + this.height / 2) / PixelSize), parseInt((this.x + this.width / 2) / PixelSize)]
										this.targetPath = [parseInt((this.target.y + this.target.height / 2) / PixelSize), parseInt((this.target.x + this.target.width / 2) / PixelSize)]
										//  マップの障害物情報に自身とターゲットの位置設定
										for (var i = 0; i < this.grid.length; i++) {
											for (var j = 0; j < this.grid[i].length; j++) {
												if (i == this.myPath[0] && j == this.myPath[1]) {
													this.grid[i][j] = 3;
												} else if (i == this.targetPath[0] && j == this.targetPath[1]) {
													this.grid[i][j] = 2;
												} else {
													//  StartやGoalの位置が更新されている場合の処理
													if (this.map.collisionData[i][j] == 0 || this.map.collisionData[i][j] == 5) {
														this.grid[i][j] = 0;
													} else {
														this.grid[i][j] = 1;
													}
												}
											}
										}

										this.root = findShortestPath([this.myPath[0], this.myPath[1]], this.grid, scene);
										//this.root = getPathToGoalOrVisibleTile([this.myPath[0], this.myPath[1]], [this.targetPath[0], this.targetPath[1]], grid, this.map, scene);
										if (this.root[0] == "East") {
											this.dirValue = 1;
											if (this.root[1] == "North" && this.grid[this.myPath[0] - 1][this.myPath[1] + 1] != 1) {
												this.dirValue = 4;
											} else if (this.root[1] == "South" && this.grid[this.myPath[0] + 1][this.myPath[1] + 1] != 1) {
												this.dirValue = 5;
											}
										} else if (this.root[0] == "West") {
											this.dirValue = 3;
											if (this.root[1] == "North" && this.grid[this.myPath[0] - 1][this.myPath[1] - 1] != 1) {
												this.dirValue = 7;
											} else if (this.root[1] == "South" && this.grid[this.myPath[0] + 1][this.myPath[1] - 1] != 1) {
												this.dirValue = 6;
											}
										} else if (this.root[0] == "North") {
											this.dirValue = 0;
											if (this.root[1] == "East" && this.grid[this.myPath[0] - 1][this.myPath[1] + 1] != 1) {
												this.dirValue = 4;
											} else if (this.root[1] == "West" && this.grid[this.myPath[0] - 1][this.myPath[1] - 1] != 1) {
												this.dirValue = 7;
											}
										} else if (this.root[0] == "South") {
											this.dirValue = 2;
											if (this.root[1] == "East" && this.grid[this.myPath[0] + 1][this.myPath[1] + 1] != 1) {
												this.dirValue = 5;
											} else if (this.root[1] == "West" && this.grid[this.myPath[0] + 1][this.myPath[1] - 1] != 1) {
												this.dirValue = 6;
											}
										}
									}
									if (this.root == false) rootFlg = true;
								}
							}

							this.time++;

							

							//  爆弾が設置された場合の処理
							if (this.bomSetFlg) {
								this.bomReload++;
								if (this.bomReload > 60) { //  1秒後再設置可能にする
									this.bomSetFlg = false;
								}
							}

							if (this.shotStopFlg) {
								this.shotStopTime++;
								if (this.shotStopTime > 10) {
									this.shotStopFlg = false;
									this.shotStopTime = 0;
								}
							} else {
								new EnemyAim(this.cannon, this.cursor, this.category, this.num);
							}

							if (this.time > 60){
								if (EnemyAim.intersectStrict(this.cursor).length > 0){
									if (!this.fireFlg)this.fireFlg = true; //  発射可能状態にする
									if (!rootFlg) rootFlg = true;
								}
							}

							if (this.ref > 0) {
								if (this.front.intersectStrict(RefObstracle).length > 0) this.shotNGflg = true;
							}

							if (this.time % 3 == 0) {
								if (this.attackTarget != this.target && !this.escapeFlg) this.attackTarget = this.target;
								this.escapeFlg = false;
							}

							this._Defense();
							
							this._Reload();
							
							if (!this.shotNGflg && !this.bomSetFlg) {
								if (this.time % this.fireLate == 0 && this.fireFlg) {
									if (bulStack[this.num][Math.floor(Math.random() * this.bulMax)] == false || this.escapeFlg) {
										this._Attack();
									}
								}
							}

							if (this.time % 60 == 0) {
								let hasCloseTarget = false;
								if (Bom.collection.length > 0) {
									for (const c of Bom.collection) {
										const dx = this.weak.x - c.x;
										const dy = this.weak.y - c.y;
										const dSq = dx * dx + dy * dy;
										if (dSq < 200 * 200) {
											hasCloseTarget = true;
											break; // 1件でも該当したら即終了
										}
									}
								}
								if (!hasCloseTarget){
									if (Block.collection.length > 0) {
										if (Math.floor(Math.random() * 2)) {
											for (var i = 0, l = Block.collection.length; i < l; i++) {
												let c = Block.collection[i];
												if (this.within(c, 76) == true && !this.bomSetFlg && boms[this.num] < this.bomMax) {
													new Bom(this, this.num, boms[this.num])._SetBom();
													this.bomReload = 0;
													this.bomSetFlg = true;
													this.bulReloadFlg = true;
													break;
												}
											}
										}
									}
								}
							}

							if (this.moveSpeed > 0) {
								if (this.time % 3 == 0) {
									if (this.escapeFlg) {
										this.dirValue = Escape_Rot8(this, this.escapeTarget, this.dirValue);
									} else {
										if (this.hittingTime >= 30) {
											if (!this.bomSetFlg) {
												let arr = [];
												switch (this.dirValue) {
													case 0:
														arr = [5, 6];
														if (this.root[0] == "North") {
															arr = [4, 7];
														}
														break;
													case 1:
														arr = [7, 6];
														if (this.root[0] == "East") {
															arr = [4, 5];
														}
														break;
													case 2:
														arr = [4, 7];
														if (this.root[0] == "South") {
															arr = [5, 6];
														}
														break;
													case 3:
														arr = [4, 5];
														if (this.root[0] == "West") {
															arr = [6, 7];
														}
														break;
													case 4:
														arr = [2, 3, 5, 7];
														break;
													case 5:
														arr = [0, 3, 4, 6];
														break;
													case 6:
														arr = [0, 1, 5, 7];
														break;
													case 7:
														arr = [1, 2, 4, 6];
												}

												this.myPath = [parseInt((this.y + this.height / 2) / PixelSize), parseInt((this.x + this.width / 2) / PixelSize)];
												this.grid = JSON.parse(JSON.stringify(scene.grid));
												let bk = arr;

												let ng = NG_root_set();
												arr = arr.filter(i => ng.indexOf(i) == -1);

												if (arr.length == 0) {
													arr = bk;
												}

												if (arr.indexOf(this.dirValue) == -1) this.dirValue = arr[Math.floor(Math.random() * arr.length)];
											}


											this.hittingTime = 0;
										}else{
											if (Math.sqrt(Math.pow(this.weak.x - this.attackTarget.x, 2) + Math.pow(this.weak.y - this.attackTarget.y, 2)) < this.distance) {
												SelDirection(this, this.attackTarget, 0);
											} else {
												if (rootFlg) {
													if (this.time % 9 == 0) {
														SelDirection(this, this.target, 1);
													}
												} else {

												}
											}
											// 爆弾との距離チェック
											if (Bom.collection.length > 0) {
												let closest = null;
												let minDistSq = 200 * 200;
												for (const c of Bom.collection) {
													const dx = this.weak.x - c.x;
													const dy = this.weak.y - c.y;
													const dSq = dx * dx + dy * dy;
													if (dSq < minDistSq) {
														minDistSq = dSq;
														closest = c;
													}
												}
												if (closest){
													this.bomReload = 0;
													this.bomSetFlg = true;
													this.dirValue = escapeFromTarget(this.weak, closest);
												}
											}
										}
										
									}
								}
								if (!this.shotStopFlg) {
									switch (this.dirValue) {
										case 0:
											this.rot = 0;
											break;
										case 1:
											this.rot = 90;
											break;
										case 2:
											this.rot = 180;
											break;
										case 3:
											this.rot = 270;
											break;
										case 4:
											this.rot = 45;
											break;
										case 5:
											this.rot = 135;
											break;
										case 6:
											this.rot = 225;
											break;
										case 7:
											this.rot = 315;
											break;
									}
									this._Move(this.rot);
								}
							}

							TankObstracle.intersect(this).forEach(elem => {
								if (!deadFlgs[elem.num] && elem.num != this.num) {
									switch (elem.name) {
										case 'TankTop':
											this.moveTo(this.x, elem.y - 60);
											break;
										case 'TankBottom':
											this.moveTo(this.x, elem.y + (elem.height));
											break;
										case 'TankLeft':
											this.moveTo(elem.x - 60, this.y);
											break;
										case 'TankRight':
											this.moveTo(elem.x + (elem.width), this.y);
											break;
									}
									this.hittingTime++;
									rootFlg = true;
								}

							})

							Obstracle.intersect(this).forEach(elem => {
								switch (elem.name) {
									case 'ObsTop':
										this.moveTo(this.x, elem.y - 60);
										break;
									case 'ObsBottom':
										this.moveTo(this.x, elem.y + (elem.height))
										break;
									case 'ObsLeft':
										this.moveTo(elem.x - 60, this.y)
										break;
									case 'ObsRight':
										this.moveTo(elem.x + (elem.width), this.y)
										break;
								}
								this.hittingTime++;
							})
						}
					} else {
						destruction++;
						this._Dead();
					}
				}
			}
		},
		_Attack: function() {
			if (gameMode == -1 && Math.floor(Math.random() * 3)) return;
			if (bullets[this.num] >= this.bulMax-2 && this.attackTarget.name == "Entity") return;
			if (WorldFlg) { //  処理しても良い状態か
				if (bullets[this.num] < this.bulMax && deadFlgs[this.num] == false) { //  発射最大数に到達していないか＆死んでいないか
					let stack = bulStack[this.num];
					for (let i = 0; i < this.bulMax; i++) {
						if (!stack[i]) { //  弾の状態がoffならば
							this.shotStopFlg = true;
							this._ResetAim();
							new BulletCol(this.shotSpeed, this.ref, this.cannon, this.category, this.num, i)._Shot();
							break;
						}
					}

				}
			}
		},
		_ResetAim: function() {
			if (this.attackTarget.name === 'Bullet') {
				const shooterPos = Get_Center(this);
				const bullet = this.attackTarget;
				const bulletPos = Get_Center(bullet);
				const bulletVec = Rot_to_Vec(bullet.rotation, -90);
				const targetSpeed = bullet.from.shotSpeed;
				const shotSpeed = this.shotSpeed;

				const dx = bulletPos.x - shooterPos.x;
				const dy = bulletPos.y - shooterPos.y;
				const dvx = bulletVec.x * targetSpeed;
				const dvy = bulletVec.y * targetSpeed;

				var a = (dvx*dvx + dvy*dvy) - shotSpeed*shotSpeed;
				var b = 2 * (dx*dvx + dy*dvy);
				var c = dx*dx + dy*dy;

				a = Math.round(a * 1000) / 1000;
				b = Math.round(b * 1000) / 1000;
				c = Math.round(c * 1000) / 1000;

				// 近すぎると暴れる
				if (c < 2000) return;

				// a が小さいときは未来予測が不安定
				if (Math.abs(a) < 0.0001) {
					if (gameMode == 2){
						a = a >= 0 ? 0.0001 : -0.0001; 
					}
					else{
						const aimAngle = Math.atan2(dy, dx);
						this.cannon.rotation = Rad_to_Rot(aimAngle) + 180;
						return;
					}
					
					//	完璧すぎたためNG
					//a = a <= 0 ? 0.0001 : -0.0001; 
				}

				const discriminant = b*b - 4*a*c;
				if (discriminant < 0) return;

				const sqrtDisc = Math.sqrt(discriminant);
				const t1 = (-b - sqrtDisc) / (2*a);
				const t2 = (-b + sqrtDisc) / (2*a);

				// 正の時間のみ採用
				const times = [t1, t2].filter(t => t > 0);
				if (times.length === 0) return;

				const time = Math.min(...times);

				const biasFactor = 0.4;
				const futureX = bulletPos.x + dvx * time * biasFactor;
				const futureY = bulletPos.y + dvy * time * biasFactor;

				const aimAngle = Math.atan2(futureY - shooterPos.y, futureX - shooterPos.x);
				this.cannon.rotation = Rad_to_Rot(aimAngle) + 180;
			}
			else if (this.attackTarget.name === 'PhyBullet') {
				const shooterPos = Get_Center(this);
				const bullet = this.attackTarget;
				const bulletPos = Get_Center(bullet);
				const bulletVec = Rot_to_Vec(bullet.rotation, -90);
				const targetSpeed = bullet.shotSpeed;
				const shotSpeed = this.shotSpeed;

				const dx = bulletPos.x - shooterPos.x;
				const dy = bulletPos.y - shooterPos.y;
				const dvx = bulletVec.x * targetSpeed;
				const dvy = bulletVec.y * targetSpeed;

				var a = (dvx*dvx + dvy*dvy) - shotSpeed*shotSpeed;
				var b = 2 * (dx*dvx + dy*dvy);
				var c = dx*dx + dy*dy;

				a = Math.round(a * 1000) / 1000;
				b = Math.round(b * 1000) / 1000;
				c = Math.round(c * 1000) / 1000;

				// 近すぎると暴れる
				if (c < 2000) return;

				// a が小さいときは未来予測が不安定
				if (Math.abs(a) < 0.0001) {
					if (gameMode == 2){
						a = a >= 0 ? 0.0001 : -0.0001; 
					}
					else{
						const aimAngle = Math.atan2(dy, dx);
						this.cannon.rotation = Rad_to_Rot(aimAngle) + 180;
						return;
					}
					
					//	完璧すぎたためNG
					//a = a <= 0 ? 0.0001 : -0.0001; 
				}

				const discriminant = b*b - 4*a*c;
				if (discriminant < 0) return;

				const sqrtDisc = Math.sqrt(discriminant);
				const t1 = (-b - sqrtDisc) / (2*a);
				const t2 = (-b + sqrtDisc) / (2*a);

				// 正の時間のみ採用
				const times = [t1, t2].filter(t => t > 0);
				if (times.length === 0) return;

				const time = Math.min(...times);

				const biasFactor = 0.4;
				const futureX = bulletPos.x + dvx * time * biasFactor;
				const futureY = bulletPos.y + dvy * time * biasFactor;

				const aimAngle = Math.atan2(futureY - shooterPos.y, futureX - shooterPos.x);
				this.cannon.rotation = Rad_to_Rot(aimAngle) + 180;
			}
		},
		_Defense: function(){
			if (BulletBase.collection.length > 0) {
				const match1 = [];
				for (const a of PlayerBulAimLite.list) {
					if (a.hitAABB(this.around)) {
						match1.push(a);
					}
				}
				const match2 = [];
				for (const a of BulAimLite.list) {
					if (a.hitAABB(this.around)) {
						match2.push(a);
					}
				}
				for (var i = 0, l = BulletBase.collection.length; i < l; i++) {
					let c = BulletBase.collection[i];
					if (!bulStack[c.num][c.id]) continue;
					if (c.num == this.target.num && !Categorys.DefenceFlg[this.category][0]) continue;
					if (c.num == this.num && !Categorys.DefenceFlg[this.category][1]) continue;
					if (!(c.num == this.target.num || c.num == this.num) && !Categorys.DefenceFlg[this.category][2]) continue;
					const dist = (function Instrumentation(weak, target1, target2) {
						const dist1 = Get_Distance(weak, target1);
						const dist2 = Get_Distance(weak, target2);
						return dist1 >= dist2 ? dist2 : null;
					})(this.weak, this.attackTarget, c);
					if (dist == null) continue;

					switch (c.num) {
						case this.target.num:
							if (dist != null && dist < Categorys.DefenceRange[this.category][0]) {
								if (match1.some(elem => elem.target === c)){
									this.attackTarget = c; //  迎撃のためにターゲット変更
								}else{
									this.attackTarget = this.target;
								}
								if (Categorys.EscapeRange[this.category][0] == true && Categorys.EscapeRange[this.category][1] != 0) {
									if (dist < Categorys.EscapeRange[this.category][1]) {
										if (Search(c, this, 90, Categorys.EscapeRange[this.category][1])) {
											this.escapeTarget = c;
											this.escapeFlg = true;
										}
									}
								}
							}
							break;
						case this.num:
							if (this.ref == 0) break;
							if (dist != null && dist < Categorys.DefenceRange[this.category][1] && dist > 100) {
								if (match2.some(elem => elem.target === c)){
									if (Categorys.EscapeRange[this.category][0] == true && Categorys.EscapeRange[this.category][2] != 0) {
										if (dist < Categorys.EscapeRange[this.category][2]) {
											if (Search(c, this, 45, Categorys.EscapeRange[this.category][2])) {
												this.escapeTarget = c;
												this.escapeFlg = true;
											}
										}
									}
									this.attackTarget = c; //  迎撃のためにターゲット変更
								}
							}
							break;
						default:
							if (dist != null && dist < Categorys.DefenceRange[this.category][2]) {
								if (match2.some(elem => elem.target === c)){
									this.attackTarget = c; //  迎撃のためにターゲット変更
								}
								if (Categorys.EscapeRange[this.category][0] == true && Categorys.EscapeRange[this.category][3] != 0) {
									if (dist < Categorys.EscapeRange[this.category][3]) {
										if (Search(c, this, 45, Categorys.EscapeRange[this.category][3])) {
											this.escapeTarget = c;
											this.escapeFlg = true;
										}
									}
								}
							}
							break;
					}
				}
			}
		},
		_Reload: function(){
			if (this.bulReloadFlg == false) {
				if (bullets[this.num] == this.bulMax) this.bulReloadFlg = true;
			} else {
				if (this.bulReloadTime < this.reload) {
					this.bulReloadTime++;
					if (this.shotNGflg == false) this.shotNGflg = true;
				} else {
					if (bullets[this.num] <= 0){
						this.shotNGflg = false;
						this.bulReloadFlg = false;
						this.bulReloadTime = 0;
					}
				}
			}
		}
	})

	var PictureTank = Class.create(Sprite, {
		initialize: function(x, y, category, scene) {
			Sprite.call(this, PixelSize + 8, PixelSize);
			//this.from = scene;
			this.x = x * PixelSize;
			this.y = y * PixelSize;
			this.category = category;
			//this.backgroundColor = '#fff4';

			var image = new Surface(this.width, this.height);
			if (this.category == playerType) {
				image.context.fillStyle = '#0000';
				image.context.lineWidth = 4;
				image.context.strokeStyle = '#0ff';
			} else {
				if (changePermitNum[this.category] > totalStageNum){
					image.context.fillStyle = '#c008';
				}else{
					image.context.fillStyle = '#0008';
				}
				image.context.lineWidth = 4;
				image.context.strokeStyle = '#0000';
			}
			roundedRect(image.context, 0, 0, this.width, this.height, 10);

			this.image = image;

			this.tank = new Tank(this, category);
			this.cannon = new Cannon(this, category);

			this.tank.rotation = 90;
			this.cannon.rotation = 90;

			//scene.addChild(this);
		},
		_Output: function() {
			now_scene.addChild(this);
		}

	})

	var Point = Class.create(Sprite, {
		initialize: function(v) {
			Sprite.call(this, 1, 1);
			this.moveTo(v.x + 4, v.y + 4);
			this.backgroundColor = '#ff0';
			this.opacity = 0.5;
			this.scale(8.0, 8.0);
			this.onenterframe = function() {
				this.opacity -= 0.05;
				if (this.opacity < 0) {
					now_scene.removeChild(this);
				}
			}
			now_scene.addChild(this);
		}
	})

	var TestSurface = Class.create(Sprite, {
		initialize: function(scene) {
			Sprite.call(this, 64, 64);
			this.moveTo(128, 128);

			var image = new Surface(64, 64);
			image.context.fillRect(0, 0, 64, 64);
			image.context.clearRect(8, 8, 48, 48);
			image.context.lineWidth = 4;
			image.context.strokeStyle = 'rgba(255, 255, 255, 1)';
			image.context.strokeRect(16, 15, 32, 32);



			this.image = image;

			/*var a_color = new Surface(PixelSize / 2, PixelSize / 2);
				a_color.context.beginPath();
				a_color.context.fillStyle = 'rgba(255, 0, 0, 1)';
				a_color.context.arc(Quarter, Quarter, Quarter, 0, Math.PI * 2, true);
				a_color.context.fill();*/

			/*ctx.fillRect(25, 25, 100, 100);
			ctx.clearRect(45, 45, 60, 60);
			ctx.strokeRect(50, 50, 50, 50);*/
			scene.addChild(this);
		}
	})



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

	/* プレイヤー位置表示クラス */
	var PlayerLabel = Class.create(Label, {
		initialize: function(player) {
			Label.call(this, 1, 1)
			this.x = player.x - ((player.width * 2))
			this.y = player.y - PixelSize;
			this.time = 0
			this.text = "Player<br><br>↓"
			this.textAlign = 'center';
			this.font = '32px sans-serif';
			this.color = 'aliceblue'
			var flg = false;
			this.onenterframe = function() {
				if (game.time >= 170) {
					this.time++
					if (this.time % 2 == 0) {
						this.opacity -= 0.1
						if (this.opacity <= 0) {
							now_scene.removeChild(this)
						}
					}
				} else {
					if (game.time % 20) {
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
			now_scene.addChild(this)
		}
	})

	var ViewCountDown = Class.create(Label, {
		initialize: function() {
			Label.call(this);
			this.time = 0;
			this.cnt = 3.3;
			this.opacity = 0;
			this.width = PixelSize * 6;
			this.height = 48;
			this.moveTo(PixelSize * 7.5, PixelSize * 0.5);
			this.text = "ゲーム開始まで...";
			this.font = 'bold 40px "Arial"';
			this.color = '#fffd';
			this.textAlign = 'left';

			let cntText = new ViewText(now_scene, 'cnt', { width: PixelSize * 2.5, height: 64 }, { x: PixelSize * 9, y: PixelSize * 1.5 }, (this.cnt) + ' 秒', 'bold 48px "Arial', '#fffd', 'left', true);
			cntText.opacity = 0;
			this.onenterframe = function() {
				this.time++;
				if (this.cnt > 0) {
					if (this.time % 6 == 0) {
						this.cnt = Math.round((this.cnt - 0.1) * 10) / 10;
						cntText.text = (this.cnt.toFixed(1)) + ' 秒';
					}
					if (this.time > 12) {
						if (this.opacity < 1.0) {
							this.opacity = Math.round((this.opacity + 0.2) * 10) / 10;
							cntText.opacity = Math.round((cntText.opacity + 0.2) * 10) / 10;
						}
					}
				} else {
					if (this.opacity > 0.0) {
						this.opacity = Math.round((this.opacity - 0.1) * 10) / 10;
						cntText.opacity = Math.round((cntText.opacity - 0.1) * 10) / 10;
					} else {
						now_scene.removeChild(cntText);
						now_scene.removeChild(this);
					}

				}
			}
			now_scene.addChild(this);
		}
	})

	var ViewScore = Class.create(Sprite, {
		initialize: function(scene) {
			Sprite.call(this, 320, 240)
			this.x = 480
			this.y = 480
			this.time = 0
			this.opacity = 0
			this.backgroundColor = "#000c";
			var title = new ViewText(scene, 'Title', { width: 240, height: 32 }, { x: this.x + 40, y: this.y + 60 }, 'トータル撃破数', '32px sans-serif', 'white', 'center', false);
			var value = new ViewText(scene, 'Title', { width: 192, height: 48 }, { x: this.x + 64, y: this.y + 120 }, (score + destruction), 'bold 48px sans-serif', 'lightblue', 'center', false);
			title.opacity = this.opacity;
			value.opacity = this.opacity;

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
	});

	var ViewRemaining = Class.create(Label, {
		initialize: function() {
			Label.call(this);
			this.backgroundColor = "#0008";
			this.time = 0

			this.width = PixelSize * 12;
			this.height = 48;
			this.moveTo(PixelSize * 4, PixelSize * 14);
			this.text = '敵残数：' + (tankEntity.length - 1 - destruction) + '　耐久値：' + tankEntity[0].life + '　残機：' + zanki;
			this.font = 'bold 40px "Arial"';
			this.color = '#fffd';
			this.textAlign = 'center';

			this.onenterframe = function() {
				if (WorldFlg) {
					this.time++;
					if (this.time % 6 == 0) {
						this.text = '敵残数：' + (tankEntity.length - 1 - destruction) + '　耐久値：' + tankEntity[0].life + '　残機：' + zanki;
					}
				}
			}
		},
		_Add: function() {
			now_scene.addChild(this);
		}
	})

	var ViewText = Class.create(Label, {
		initialize: function(from, type, size, position, text, font, color, align, flg) {
			Label.call(this);
			this.from = from;
			this.type = type;
			//this.backgroundColor = '#fff2';
			this.width = size.width;
			this.height = size.height;
			this.moveTo(position.x, position.y);
			this.text = text;
			this.font = font;
			this.color = color;
			this.textAlign = align;
			if (flg) this._Output();
		},
		_Output: function() {
			this.from.addChild(this);
		}
	})

	function roundedRect(ctx, x, y, width, height, radius) {
		ctx.beginPath();
		ctx.moveTo(x, y + radius);
		ctx.arcTo(x, y + height, x + radius, y + height, radius);
		ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
		ctx.arcTo(x + width, y, x + width - radius, y, radius);
		ctx.arcTo(x, y, x, y + radius, radius);

		ctx.fill();
		ctx.stroke();
	}

	var ViewButton = Class.create(Sprite, {
		initialize: function(from, type, size, position, text, font, color, align, lineColor, backColor) {
			Sprite.call(this, size.width, size.height);
			this.from = from;
			this.text = new ViewText(from, type, size, position, text, font, color, align, true);
			//this.backgroundColor = '#fff2';
			var image = new Surface(size.width, size.height);
			image.context.fillStyle = backColor;
			image.context.lineWidth = 4;
			image.context.strokeStyle = lineColor;
			roundedRect(image.context, 0, 0, size.width, size.height, 10);
			/*image.context.fillRect(0, 0, size.width, size.height);
			image.context.strokeRect(0, 0, size.width, size.height);*/
			this.image = image;
			this.moveTo(position.x, position.y);
			this._Output();
		},
		_Output: function() {
			this.from.addChild(this);
		}
	})

	var ViewMessage = Class.create(ViewText, {
		initialize: function(from, type, size, position, text, font, color, align, delTime) {
			ViewText.call(this, from, type, size, position, text, font, color, align, true);
			this.time = 0;
			this.opacity = 0.25;

			this.onenterframe = function() {
				this.time++;
				if (this.time < 12 && this.time % 3 == 0) {
					this.opacity += 0.25;
				} else if (this.time > delTime + 15 && this.time % 3 == 0) {
					this.opacity -= 0.2;
				}
				if (this.time == delTime + 30) {
					this._Remove();
				}
			}
		},
		_Remove: function() {
			this.from.removeChild(this);
		}
	})

	var ViewDamage = Class.create(Label, {
		initialize: function(from, damage, critical) {
			Label.call(this);
			this.time = 0;
			this.opacity = 1.0;
			this.from = from;
			this.width = 64;
			this.height = 32;

			const offsetX = ((Math.floor(Math.random() * 5) - 2) * 3);
			const offsetY = ((Math.floor(Math.random() * 5) - 2) * 2);
			const startX = from.x + offsetX;
			const startY = from.y - 32 + offsetY;

			this.moveTo(startX, startY);
			this.text = damage;
			this.font = '32px sans-serif';
			this.color = critical ? 'yellow' : 'white';
			this.textAlign = 'center';

			if (critical) this.scale(1.5, 1.5);

			const hopX = (Math.random() * 10 - 5); // -5〜+5 のランダム横移動

			// 跳ねるようなアニメーション（上に移動 → 下に落ちる）
			this.tl
				.moveBy(hopX, -10, 6, enchant.Easing.SIN_EASEOUT)  // 上に跳ねる
				.moveBy(hopX, 5, 40, enchant.Easing.EXP_EASEOUT)    // 少し戻る
				.and()
				.fadeOut(40)         // フェードアウト
				.then(() => {
					now_scene.removeChild(this);
				});
			
			this.onenterframe = function(){
				this.time++;
				if(this.time == 15){
					this.color = 'red';
				}
			}

			now_scene.addChild(this);
		}
	});

	function createSlidingStripeBar(isTop) {
		const screenWidth = game.width;
		const barHeight = 120;

		// 表示用のバー（固定サイズ）
		const bar = new Sprite(screenWidth, barHeight);

		// 斜線を描いた大きな Surface
		const patternWidth = screenWidth * 2;
		const patternSurface = new Surface(patternWidth, barHeight);
		const ctx = patternSurface.context;

		// 赤背景
		ctx.fillStyle = 'rgba(255,255,255,0.0)';
		ctx.fillRect(0, 0, patternWidth, barHeight);

		// 白い斜線
		ctx.fillStyle = 'rgba(255,0,0,1)';
		const stripeWidth = 40;
		const stripeHeight = barHeight;
		const stripeSkew = 40;

		for (let x = -patternWidth; x < patternWidth * 2; x += stripeWidth + 10) {
			ctx.beginPath();
			ctx.moveTo(x, isTop ? 0 : 25);
			ctx.lineTo(x + stripeSkew, isTop ? 0 : 25);
			ctx.lineTo(x + stripeSkew + stripeWidth, isTop ? stripeHeight - 25 : stripeHeight);
			ctx.lineTo(x + stripeWidth, isTop ? stripeHeight - 25 : stripeHeight);
			ctx.closePath();
			ctx.fill();
		}

		ctx.strokeStyle = 'rgba(255,0,0,1)';
		ctx.lineWidth = 30;
		ctx.beginPath();
		ctx.moveTo(0, isTop ? barHeight : 0);
		ctx.lineTo(patternWidth, isTop ? barHeight : 0);
		ctx.stroke();

		// パターンを描画するための内部スプライト
		const patternSprite = new Sprite(patternWidth, barHeight);
		patternSprite.image = patternSurface;
		patternSprite.x = 0;
		patternSprite.y = 0;
		patternSprite.opacity = 0;
		patternSprite.time = 0;
		patternSprite.time2 = 0;

		let opaVal = 0.1;

		patternSprite.tl
			.fadeTo(1.0,30,enchant.Easing.EXP_EASEOUT)
			.delay(120)
			.fadeOut(30,enchant.Easing.SIN_EASEOUT);

		// パターンをスライドさせる
		patternSprite.onenterframe = function () {
			const t = patternSprite.time / (180 - 1);
			const alpha = 1.0 - t;
			patternSprite.time++;
			/*if(patternSprite.time % 2 == 0){
				if(patternSprite.time2 == 0)patternSprite.opacity += opaVal;
				if(patternSprite.opacity >= 1){
					patternSprite.time2++;
					if(patternSprite.time2 == 3){
						patternSprite.time2 = 0;
 						opaVal = -0.05;
					}
				}
				if(patternSprite.opacity < 0.05) opaVal = 0.1;
			}*/
			patternSprite.x -= isTop ? (12 * alpha + 1) : -(12 * alpha + 1);
			if(isTop){
				if (patternSprite.x <= -screenWidth) patternSprite.x = -(16 * alpha + 1);
			}else{
				if (patternSprite.x >= screenWidth) patternSprite.x = (16 * alpha + 1);
			}
		};

		// グループとしてまとめる
		const group = new Group();
		group.addChild(patternSprite);
		group.addChild(bar); // 表示枠として使う（透明）

		group.y = isTop ? 0 : game.height - barHeight;
		group.x = isTop ? 0 : game.width - patternWidth;
		return group;
	}


	function showEmergencyAlert(scene) {
		const screenWidth = game.width;
		const screenHeight = game.height;

		// 中央の「EMERGENCY」テキスト
		const label = new Label('EMERGENCY');
		label.font = '128px Arial Black';
		label.color = 'yellow';
		label.textAlign = 'center';
		label.width = screenWidth;
		label.y = screenHeight / 2 - 64;
		label.opacity = 0;

		label.tl
			.delay(5)
			.fadeIn(15, enchant.Easing.EXP_EASEOUT)
			.delay(20)
			.fadeOut(15,enchant.Easing.SIN_EASEOUT)
			.fadeIn(15, enchant.Easing.EXP_EASEOUT)
			.delay(20)
			.fadeOut(15,enchant.Easing.SIN_EASEOUT)
			.fadeIn(15, enchant.Easing.EXP_EASEOUT)
			.delay(20)
			.fadeOut(15,enchant.Easing.SIN_EASEOUT)
			.then(() => {
				scene.removeChild(label);
				scene.removeChild(topBar);
				scene.removeChild(bottomBar);
			});

		const topBar = createSlidingStripeBar(true);
    	const bottomBar = createSlidingStripeBar(false);

		scene.addChild(label);
		scene.addChild(topBar);
		scene.addChild(bottomBar);
	}

	var ViewFrame = Class.create(Sprite, {
		initialize: function(from, type, size, position, color) {
			Sprite.call(this, size.width, size.height);

			this.from = from;
			this.type = type;

			this.moveTo(position.x, position.y);
			this.backgroundColor = color;

			from.addChild(this);
		}
	})

	var ViewArea = Class.create(Group, {
		initialize: function(position, name) {
			Group.call(this);
			this.moveTo(position.x, position.y);
			this.name = name;
			this.head = new Group();
			this.body = new Group();

			this.addChild(this.head);
			this.addChild(this.body);

			now_scene.addChild(this);
		}
	});

	var SetArea = Class.create(ViewArea, {
		initialize: function(position, name) {
			ViewArea.call(this, position, name);
			this.type;
			switch (name) {
				case 'Title':
					this.type = ViewConfig.Title;
					this._SetTitle();
					break;
				case 'TankList':
					this.type = ViewConfig.TankList;
					this._SetTankList();
					break;
				case 'Start':
					this.type = ViewConfig.Start;
					this._SetStart();
					break;
				case 'Bonus':
					this.type = ViewConfig.Bonus;
					this._SetBonus();
					break;
				case 'Result':
					this.type = ViewConfig.Result;
					this._SetResult();
					break;
				case 'Pause':
					this.type = ViewConfig.Pause;
					this._SetPause();
					break;
			};

			return this;
		},
		_SetTitle: function() {
			this.head.moveTo(this.type.Head.position.x, this.type.Head.position.y);
			this.body.moveTo(this.type.Body.position.x, this.type.Body.position.y);
			new ViewFrame(this.head, 'Title', this.type.Head.size, { x: 0, y: 0 }, this.type.Head.color);
			new ViewFrame(this.head, 'Top', { width: this.type.Head.size.width, height: 5 }, { x: 0, y: 32 }, 'yellow');
			new ViewFrame(this.head, 'Bottom', { width: this.type.Head.size.width, height: 5 }, { x: 0, y: this.type.Head.size.height - 37 }, 'yellow');

			new ViewText(this.head, 'Title', { width: 720, height: 80 }, { x: 192, y: 64 }, 'Battle Tank Game', '80px sans-serif', 'white', 'center', true);
		},
		_SetTankList: function() {
			this.head.moveTo(this.type.Head.position.x, this.type.Head.position.y);
			this.body.moveTo(this.type.Body.position.x, this.type.Body.position.y);
			new ViewFrame(this.head, 'TankList', this.type.Head.size, { x: 0, y: 0 }, this.type.Head.color);
			new ViewFrame(this.head, 'Top', { width: this.type.Head.size.width, height: 5 }, { x: 0, y: 32 }, 'yellow');
			new ViewFrame(this.head, 'Bottom', { width: this.type.Head.size.width, height: 5 }, { x: 0, y: this.type.Head.size.height - 37 }, 'yellow');
			new ViewFrame(this.body, 'TankList', this.type.Body.size, { x: 0, y: 0 }, this.type.Body.color);

			new ViewText(this.head, 'Title', { width: 64 * 4, height: 64 }, { x: 64 * 7, y: 64 }, '戦車一覧', '64px sans-serif', '#ebe799', 'center', true);
			//new DispText(120, 150, 260 * 4, 64, '戦車一覧', '64px sans-serif', '#ebe799', 'center', scene)
		},
		_SetStart: function() {
			this.head.moveTo(this.type.Head.position.x, this.type.Head.position.y);
			this.body.moveTo(this.type.Body.position.x, this.type.Body.position.y);
			new ViewFrame(this.head, 'Start', this.type.Head.size, { x: 0, y: 0 }, this.type.Head.color);
			new ViewFrame(this.head, 'Top', { width: this.type.Head.size.width, height: 5 }, { x: 0, y: 32 }, 'yellow');
			new ViewFrame(this.head, 'Bottom', { width: this.type.Head.size.width, height: 5 }, { x: 0, y: this.type.Head.size.height - 37 }, 'yellow');
			//new ViewFrame(this.body, 'Result', this.type.Body.size, {x: 0, y: 0}, this.type.Body.color);
		},
		_SetBonus: function() {
			this.head.moveTo(this.type.Head.position.x, this.type.Head.position.y);
			this.body.moveTo(this.type.Body.position.x, this.type.Body.position.y);
			new ViewFrame(this.head, 'Bonus', this.type.Head.size, { x: 0, y: 0 }, this.type.Head.color);
			new ViewFrame(this.head, 'Top', { width: this.type.Head.size.width, height: 5 }, { x: 0, y: 32 }, 'yellow');
			new ViewFrame(this.head, 'Bottom', { width: this.type.Head.size.width, height: 5 }, { x: 0, y: this.type.Head.size.height - 37 }, 'yellow');
			//new ViewFrame(this.body, 'Result', this.type.Body.size, {x: 0, y: 0}, this.type.Body.color);
		},
		_SetResult: function() {
			this.head.moveTo(this.type.Head.position.x, this.type.Head.position.y);
			this.body.moveTo(this.type.Body.position.x, this.type.Body.position.y);
			new ViewFrame(this.head, 'Result', this.type.Head.size, { x: 0, y: 0 }, this.type.Head.color);
			new ViewFrame(this.head, 'Top', { width: this.type.Head.size.width, height: 5 }, { x: 0, y: 32 }, 'yellow');
			//new ViewFrame(this.body, 'Result', this.type.Body.size, {x: 0, y: 0}, this.type.Body.color);
		},
		_SetPause: function() {
			this.body.moveTo(this.type.Body.position.x, this.type.Body.position.y);
			new ViewFrame(this.body, 'Pause', this.type.Body.size, { x: 0, y: 0 }, this.type.Body.color);
		}
	});

	var SelWindow = Class.create(ViewArea, {
		initialize: function(position, name) {
			ViewArea.call(this, position, name);
			var my = this;
			this.type;

			ActiveFlg = true;

			new ViewFrame(this.head, 'Window', { width: 960, height: 540 }, { x: 0, y: 0 }, '#fff');
			new ViewText(this.head, 'Title', { width: 400, height: 48 }, { x: 8, y: 8 }, 'ゲームモード選択', '48px sans-serif', 'black', 'center', true);

			/*var nomal = new ViewText(this.head, 'Mode', {width: 240, height: 48}, {x: 8, y: 128}, 'ノーマル', '48px sans-serif', 'black', 'center', true);
			var hard = new ViewText(this.head, 'Mode', {width: 240, height: 48}, {x: 300, y: 128}, 'ハード', '48px sans-serif', 'black', 'center', true);
			var survival = new ViewText(this.head, 'Mode', {width: 240, height: 48}, {x: 600, y: 128}, 'サバイバル', '48px sans-serif', 'black', 'center', true);*/

			var easy = new ViewButton(this.head, 'Mode', { width: 200, height: 48 }, { x: 32, y: 128 }, 'Easy', '40px sans-serif', 'black', 'center', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.1)');
			var nomal = new ViewButton(this.head, 'Mode', { width: 200, height: 48 }, { x: 264, y: 128 }, 'Normal', '40px sans-serif', 'black', 'center', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.1)');
			var hard = new ViewButton(this.head, 'Mode', { width: 200, height: 48 }, { x: 496, y: 128 }, 'Hard', '40px sans-serif', 'black', 'center', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.1)');
			var survival = new ViewButton(this.head, 'Mode', { width: 200, height: 48 }, { x: 728, y: 128 }, 'Insanity', '40px sans-serif', 'black', 'center', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.1)');

			//var toList = new ViewButton(area.head, 'Mode', {width: 48 * 8, height: 48}, {x: PixelSize * 5, y: PixelSize * 8.25}, '➡　戦車一覧へ', '48px sans-serif', '#ebe799', 'left', 'rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0)');

			var dsc = new ViewText(this.head, 'Mode', { width: 896, height: 32 * 9 }, { x: 32, y: 216 }, 'ゲームモード説明', '32px sans-serif', 'black', 'left', true);
			dsc.backgroundColor = '#44444444';

			function changeMode() {
				switch (gameMode) {
					case -1:
						easy.text.color = 'red';
						nomal.text.color = 'black';
						hard.text.color = 'black';
						survival.text.color = 'black';
						dsc.text = '難易度：簡単<br>初心者におすすめのモード。<br>敵の攻撃頻度が抑えられているため遊びやすい。<br>慣れないうちはこのモードで練習してみましょう。';
						break;
					case 0:
						easy.text.color = 'black';
						nomal.text.color = 'red';
						hard.text.color = 'black';
						survival.text.color = 'black';
						dsc.text = '難易度：普通<br>中級者向けのモード。<br>敵味方ともに100%のステータスで戦う。<br>イージーモードでは足りなくなってきた方におすすめ。';
						break;
					case 1:
						nomal.text.color = 'black';
						hard.text.color = 'red';
						survival.text.color = 'black';
						dsc.text = '難易度：難しい<br>敵のステータスが強化される難易度の高いモード。<br>デフォルト以外の戦車を自機として選択している場合、<br>ステータス強化の恩恵を受けられる。';
						break;
					case 2:
						easy.text.color = 'black';
						nomal.text.color = 'black';
						hard.text.color = 'black';
						survival.text.color = 'red';
						dsc.text = '難易度：狂気的<br>Hardモードのステータス強化に加えて、敵の当たり判定が小さくなったモード。<br>敵のクリティカル発生率が高くなるため、安易に被弾しないことをおすすめする。';
						break;
				}
			}

			this.back = new ViewText(this.head, 'Back', { width: 64, height: 64 }, { x: 896, y: 0 }, '×', '64px sans-serif', 'white', 'center', true);
			this.back.backgroundColor = 'red';

			changeMode();

			easy.addEventListener(Event.TOUCH_START, function() {
				gameMode = -1;
				changeMode();
			})

			nomal.addEventListener(Event.TOUCH_START, function() {
				gameMode = 0;
				changeMode();
			})

			hard.addEventListener(Event.TOUCH_START, function() {
				gameMode = 1;
				changeMode();
			})

			survival.addEventListener(Event.TOUCH_START, function() {
				gameMode = 2;
				changeMode();
			})

			this.back.addEventListener(Event.TOUCH_START, function() {
				console.log('remove')
				ActiveFlg = false;
				now_scene.removeChild(my);
			})

			now_scene.addChild(this);
		}
	})

	var MainMap = Class.create(Map, {
		initialize: function(scene) {
			Map.call(this, PixelSize, PixelSize);
			this.image = game.assets['./image/MapImage/map0.png']
			this.loadData(stageData[0], this._setNullMap());
			this.collisionData = stageData[2];
			scene.addChild(this);
			return this;
		},
		_setNullMap: function() {
			let map = [];
			for (let i = 0; i < Stage_H; i++) {
				map[i] = [];
				for (let j = 0; j < Stage_W; j++) {
					map[i][j] = -1;
				}
			}
			return map;
		}
	});
	var FillterMap = Class.create(Map, {
		initialize: function(scene) {
			Map.call(this, PixelSize, PixelSize);
			this.image = game.assets['./image/MapImage/map0.png']
			this.loadData(this._setNullMap(), this._resetMap());
			scene.addChild(this);
			return this;
		},
		_setNullMap: function() {
			let map = [];
			for (let i = 0; i < Stage_H; i++) {
				map[i] = [];
				for (let j = 0; j < Stage_W; j++) {
					map[i][j] = -1;
				}
			}
			return map;
		},
		_resetMap: function() {
			let map = [];
			for (let i = 0; i < Stage_H; i++) {
				map[i] = [];
				for (let j = 0; j < Stage_W; j++) {
					if (stageData[0][i][j] == 7) {
						map[i][j] = 7
					} else if (i < Stage_H - 1 && ((stageData[0][i][j] != 7 && stageData[0][i + 1][j] == 7)) || (stageData[0][i][j] != 23 && stageData[0][i + 1][j] == 23)) {
						map[i][j] = 45;
					} else if (stageData[0][i][j] == 23) {
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

	var SetUpScene = Class.create(Scene, {
		initialize: function() {
			Scene.call(this);
			this.time = 0;
			this.backgroundColor = 'black'; // シーンの背景色を設定
			//now_scene = this;

			let flg = false;
			new ViewText(this, 'Play', { width: 320 * 4, height: 48 }, { x: PixelSize * 0, y: PixelSize * 7 }, 'Touch to StartUp!', '48px sans-serif', 'white', 'center', true);

			this.addEventListener('touchstart', function() {
				TotalRepository.keyName = totalKey;
				TotalRepository.restore();
				/*TotalRepository.remove();
				TotalRepository.keyName = totalKey;
				TotalRepository.restore();*/
				if (TotalRepository.data.ClearStageNum >= 0) {
					totalStageNum = TotalRepository.data.ClearStageNum;
				}
				titleFlg = true;
				flg = true;
				new FadeOut(this)
			})

			this.onenterframe = function() {
				if (flg == true) {

					this.time++;

					if (this.time == 30) {
						BGM.play();
						game.replaceScene(new TitleScene());
					}
				}
			}
			new FadeIn(this)
		}
	});

	var TitleScene = Class.create(Scene, {

		initialize: function () {
			Scene.call(this);
			this.backgroundColor = '#cacaca';
			this.time = 0;
			now_scene = this;

			// 遷移管理
			this.transitionFlag = false;
			this.nextSceneType = 0;

			// UIエリア
			this.area = new SetArea({ x: 0, y: 0 }, 'Title');

			// UI生成
			this.createUI();

			// イベント登録
			this.registerEvents();

			// フェードイン
			new FadeIn(this);

			return this;
		},

		// ============================================================
		// UI生成
		// ============================================================
		createUI: function () {
			const a = this.area;

			this.btnPlay = new ViewText(a.head, 'Play',
				{ width: 48 * 8, height: 48 },
				{ x: PixelSize * 5, y: PixelSize * 3 },
				'➡　はじめから', '48px sans-serif', '#ebe799', 'left', true);

			this.btnContinue = new ViewText(a.head, 'Continue',
				{ width: 48 * 8, height: 48 },
				{ x: PixelSize * 5, y: PixelSize * 4.5 },
				'➡　つづきから', '48px sans-serif', '#ebe799', 'left', true);

			this.btnMode = new ViewText(a.head, 'Mode',
				{ width: 48 * 12, height: 48 },
				{ x: PixelSize * 5, y: PixelSize * 6 },
				'➡　ゲームモード選択', '48px sans-serif', '#ebe799', 'left', true);

			new ViewText(a.head, 'Mode',
				{ width: 280, height: 40 },
				{ x: PixelSize * 5 + 80, y: PixelSize * 7 },
				'現在のモード：', '40px sans-serif', '#ebe799', 'left', true);

			this.lblMode = new ViewText(a.head, 'Mode',
				{ width: 200, height: 40 },
				{ x: PixelSize * 9.5 + 80, y: PixelSize * 7 },
				'ノーマル', '40px sans-serif', '#ebe799', 'left', true);

			this.btnList = new ViewText(a.head, 'List',
				{ width: 48 * 8, height: 48 },
				{ x: PixelSize * 5, y: PixelSize * 8.25 },
				'➡　戦車一覧へ', '48px sans-serif', '#ebe799', 'left', true);
		},

		// ============================================================
		// イベント登録
		// ============================================================
		registerEvents: function () {
			this.btnPlay.addEventListener(Event.TOUCH_START, this.onPlay.bind(this));
			this.btnContinue.addEventListener(Event.TOUCH_START, this.onContinue.bind(this));
			this.btnMode.addEventListener(Event.TOUCH_START, this.onModeSelect.bind(this));
			this.btnList.addEventListener(Event.TOUCH_START, this.onList.bind(this));

			this.onenterframe = this.update.bind(this);
		},

		// ============================================================
		// 「はじめから」
		// ============================================================
		onPlay: function () {
			if (ActiveFlg) return;

			Repository.keyName = key;
			Repository.restore();

			if (Repository.data.StageNum > 0) {
				const ok = confirm("\r\n保存されている進行状況があります。\r\nリセットして始めますか？");
				if (!ok) return;

				Repository.remove();
				Repository.keyName = key;
				Repository.restore();
			}

			this.startTransition(1);
		},

		// ============================================================
		// 「つづきから」
		// ============================================================
		onContinue: function () {
			Repository.keyName = key;
			Repository.restore();

			if (Repository.data.StageNum === 0) {
				alert("保存されているデータはありません。");
				return;
			}

			stageNum = Repository.data.StageNum;
			zanki = Repository.data.Zanki;
			colors = Repository.data.Scores;
			gameMode = Repository.data.Level;
			playerType = Repository.data.Type;
			stageRandom = Repository.data.Pattern;

			score = colors.reduce((a, b) => a + b, 0);

			let script = document.createElement("script");
			script.src = stagePath[stageNum];
			script.id = 'stage_' + stageNum;
			head[0].appendChild(script);

			this.startTransition(1);
		},

		// ============================================================
		// 「ゲームモード選択」
		// ============================================================
		onModeSelect: function () {
			if (!ActiveFlg) {
				new SelWindow({ x: PixelSize * 2.5, y: PixelSize * 4 }, 'Mode');
			}
		},

		// ============================================================
		// 「戦車一覧へ」
		// ============================================================
		onList: function () {
			if (!ActiveFlg) {
				this.startTransition(3);
			}
		},

		// ============================================================
		// モード表示更新
		// ============================================================
		updateModeLabel: function () {
			const label = this.lblMode;
			label.color = '#ebe799';

			switch (gameMode) {
				case -1: label.text = 'Easy'; break;
				case 0:  label.text = 'Normal'; break;
				case 1:  label.text = 'Hard'; break;
				case 2:  label.text = 'Insanity'; break;
			}
		},

		// ============================================================
		// シーン遷移開始
		// ============================================================
		startTransition: function (type) {
			this.transitionFlag = true;
			this.nextSceneType = type;
			if (type !== 3) {
				BGM.stop();
				titleFlg = false;
			}
			new FadeOut(this);
		},

		// ============================================================
		// 毎フレーム更新
		// ============================================================
		update: function () {
			game.time++;

			if (game.time % 12 === 0) {
				this.updateModeLabel();
			}

			if (titleFlg && BGM.currentTime === BGM.duration) {
				BGM.play();
			}

			if (this.transitionFlag) {
				this.time++;

				if (this.time === 30) {
					this._Remove();
					game.time = 0;

					switch (this.nextSceneType) {
						case 1:
							deadTank = [false];
							Repository.data.Level = gameMode;
							game.replaceScene(new StartScene());
							break;
						case 2:
							game.replaceScene(new TestScene());
							break;
						case 3:
							game.replaceScene(new TankListScene());
							break;
					}
				}
			}
		},

		// ============================================================
		// 子要素削除
		// ============================================================
		_Remove: function () {
			while (this.firstChild) {
				if (this.firstChild instanceof enchant.box2d.PhySprite) {
					this.firstChild.destroy();
				}
				this.removeChild(this.firstChild);
			}
		}
	});


	var TankListScene = Class.create(Scene, {
		initialize: function() {
			Scene.call(this);
			this.backgroundColor = '#ebf899';
			this.time = 0;
			now_scene = this;

			this.TankGroup = new Group();
			this.CannonGroup = new Group();

			var flg = false;
			let dispTanks = [];
			let performance = [];

			if (gameMode <= 0) {
				performance = [
					[colorsName[0], "　耐久　：" + Categorys.Life[0], "　弾数　：" + Categorys.MaxBullet[0], "　弾速　：普通(" + Categorys.ShotSpeed[0] + ")", "跳弾回数：" + Categorys.MaxRef[0], "移動速度：速い(" + Categorys.MoveSpeed[0] + ")", "・プレイヤーが操作する戦車。<br>　高性能かつ汎用性が高いため<br>　初心者におすすめ。<br>　クリティカル発生率が高い。"],
					[colorsName[1], "　耐久　：" + Categorys.Life[1], "　弾数　：" + Categorys.MaxBullet[1], "　弾速　：遅い(" + Categorys.ShotSpeed[1] + ")", "跳弾回数：" + Categorys.MaxRef[1], "移動速度：動かない(" + Categorys.MoveSpeed[1] + ")", "・弾道予測型<br>　最も弱い戦車。<br>　よく狙って攻撃するため命中率は高い。"],
					[colorsName[2], "　耐久　：" + Categorys.Life[2], "　弾数　：" + Categorys.MaxBullet[2], "　弾速　：普通(" + Categorys.ShotSpeed[2] + ")", "跳弾回数：" + Categorys.MaxRef[2], "移動速度：遅い(" + Categorys.MoveSpeed[2] + ")", "・最短追尾型<br>　最短経路を計算して移動する。<br>　配置によっては脅威になりうる。"],
					[colorsName[3], "　耐久　：" + Categorys.Life[3], "　弾数　：" + Categorys.MaxBullet[3], "　弾速　：速い(" + Categorys.ShotSpeed[3] + ")", "跳弾回数：" + Categorys.MaxRef[3], "移動速度：遅い(" + Categorys.MoveSpeed[3] + ")", "・攻守両立型<br>　数は少ないが速い弾を撃てる戦車。<br>　物量で攻めると倒しやすい。"],
					[colorsName[4], "　耐久　：" + Categorys.Life[4], "　弾数　：" + Categorys.MaxBullet[4], "　弾速　：普通(" + Categorys.ShotSpeed[4] + ")", "跳弾回数：" + Categorys.MaxRef[4], "移動速度：やや速い(" + Categorys.MoveSpeed[4] + ")", "・最短追尾型<br>　弾数が多く、発射頻度も高いため<br>　物量で攻める突撃をしてくる。"],
					[colorsName[5], "　耐久　：" + Categorys.Life[5], "　弾数　：" + Categorys.MaxBullet[5], "　弾速　：普通(" + Categorys.ShotSpeed[5] + ")", "跳弾回数：" + Categorys.MaxRef[5], "移動速度：普通(" + Categorys.MoveSpeed[5] + ")", "・生存特化型<br>　追尾、迎撃、回避全て揃ったエリート戦車<br>　跳弾を活用すると倒しやすい。"],
					[colorsName[6], "　耐久　：" + Categorys.Life[6], "　弾数　：" + Categorys.MaxBullet[6], "　弾速　：とても速い(" + Categorys.ShotSpeed[6] + ")", "跳弾回数：" + Categorys.MaxRef[6], "移動速度：動かない(" + Categorys.MoveSpeed[6] + ")", "・弾道予測型<br>　敵戦車の中でも指折りの狙撃手。<br>　壁の後ろに隠れても油断してはいけない。"],
					[colorsName[7], "　耐久　：" + Categorys.Life[7], "　弾数　：" + Categorys.MaxBullet[7], "　弾速　：速い(" + Categorys.ShotSpeed[7] + ")", "跳弾回数：" + Categorys.MaxRef[7], "移動速度：やや遅い(" + Categorys.MoveSpeed[7] + ")", "・攻守両立型<br>　ステルス能力を持つ敵戦車。<br>　死角からの砲撃に要注意。"],
					[colorsName[8], "　耐久　：" + Categorys.Life[8], "　弾数　：" + Categorys.MaxBullet[8], "　弾速　：普通(" + Categorys.ShotSpeed[8] + ")", "跳弾回数：" + Categorys.MaxRef[8], "移動速度：普通(" + Categorys.MoveSpeed[8] + ")", "・近距離迎撃型<br>　追尾、迎撃、回避全て揃ったエリート戦車<br>　攻撃は弾を1発しか使わないが<br>　迎撃時には弾幕を貼って防御する。<br>　地雷も搭載している。"],
					[colorsName[9], "　耐久　：" + Categorys.Life[9], "　弾数　：" + Categorys.MaxBullet[9], "　弾速　：やや速い(" + Categorys.ShotSpeed[9] + ")", "跳弾回数：" + Categorys.MaxRef[9], "移動速度：動かない(" + Categorys.MoveSpeed[9] + ")", "・弾幕爆撃型<br>　撃てる弾を全て使い弾幕を張る戦車。<br>　発射される弾には爆弾が仕込まれており、<br>　狙った場所で小規模の爆発させることが可能。"],
					[colorsName[10], "　耐久　：" + Categorys.Life[10], "　弾数　：" + Categorys.MaxBullet[10], "　弾速　：やや速い(" + Categorys.ShotSpeed[10] + ")", "跳弾回数：" + Categorys.MaxRef[10], "移動速度：速い(" + Categorys.MoveSpeed[10] + ")", "・地雷設置型<br>　高機動かつ地雷をばら撒く戦車。<br>　偏差射撃も使うため危険度が高い。"],
					[colorsName[11], "　耐久　：" + Categorys.Life[11], "　弾数　：" + Categorys.MaxBullet[11], "　弾速　：最速(" + Categorys.ShotSpeed[11] + ")", "跳弾回数：" + Categorys.MaxRef[11], "移動速度：速い(" + Categorys.MoveSpeed[11] + ")", "・強襲狙撃型<br>　高機動かつ最速の弾を放つ戦車。<br>　稀に乱入する危険な不明車両。<br>　回避能力が極めて高いため撃破は困難。"],
					[colorsName[12], "　耐久　：" + Categorys.Life[12], "　弾数　：" + Categorys.MaxBullet[12], "　弾速　：速い(" + Categorys.ShotSpeed[12] + ")", "跳弾回数：" + Categorys.MaxRef[12], "移動速度：やや速い(" + Categorys.MoveSpeed[12] + ")", "・精鋭型<br>　高い能力と耐久を持つボス戦車。<br>　地雷の爆破に巻き込めば耐久を無視して、<br>　撃破可能。"],
					[colorsName[13], "　耐久　：" + Categorys.Life[13], "　弾数　：" + Categorys.MaxBullet[13], "　弾速　：速い(" + Categorys.ShotSpeed[13] + ")", "跳弾回数：" + Categorys.MaxRef[13], "移動速度：とても速い(" + Categorys.MoveSpeed[13] + ")", "・精鋭型<br>　最上位の戦闘力を誇るボス戦車。<br>　優秀なプレイヤーしか対峙できない。<br>　耐久が1になると殲滅モードに移行する。"]
				];
			} else {
				performance = [
					[colorsName[0], "　耐久　：" + Categorys.Life[0], "　弾数　：" + Categorys.MaxBullet[0], "　弾速　：普通(" + Categorys.ShotSpeed[0] + ")", "跳弾回数：" + Categorys.MaxRef[0], "移動速度：速い(" + Categorys.MoveSpeed[0] + ")", "・プレイヤーが操作する戦車。<br>　高性能かつ汎用性が高いため<br>　初心者におすすめ。<br>　クリティカル発生率が高い。"],
					[colorsName[1], "　耐久　：" + Categorys.Life[1], "　弾数　：" + (Categorys.MaxBullet[1] + 2), "　弾速　：普通(" + (Categorys.ShotSpeed[1] + 2) + ")", "跳弾回数：" + Categorys.MaxRef[1], "移動速度：動かない(" + Categorys.MoveSpeed[1] + ")", "・弾道予測型<br>　最も弱い戦車。<br>　よく狙って攻撃するため命中率は高い。"],
					[colorsName[2], "　耐久　：" + Categorys.Life[2], "　弾数　：" + (Categorys.MaxBullet[2] + 1), "　弾速　：普通(" + (Categorys.ShotSpeed[2] + 1) + ")", "跳弾回数：" + Categorys.MaxRef[2], "移動速度：普通(" + (Categorys.MoveSpeed[2] + 0.5) + ")", "・最短追尾型<br>　最短経路を計算して移動する。<br>　配置によっては脅威になりうる。"],
					[colorsName[3], "　耐久　：" + Categorys.Life[3], "　弾数　：" + (Categorys.MaxBullet[3] + 1), "　弾速　：速い(" + Categorys.ShotSpeed[3] + ")", "跳弾回数：" + (Categorys.MaxRef[3] + 1), "移動速度：普通(" + (Categorys.MoveSpeed[3] + 0.5) + ")", "・攻守両立型<br>　数は少ないが速い弾を撃てる戦車。<br>　物量で攻めると倒しやすい。<br>【弱化】装填にかかる時間の延長"],
					[colorsName[4], "　耐久　：" + Categorys.Life[4], "　弾数　：" + (Categorys.MaxBullet[4] + 1), "　弾速　：やや速い(" + (Categorys.ShotSpeed[4] + 1) + ")", "跳弾回数：" + Categorys.MaxRef[4], "移動速度：やや速い(" + Categorys.MoveSpeed[4] + ")", "・最短追尾型<br>　弾数が多く、発射頻度も高いため<br>　物量で攻める突撃をしてくる。"],
					[colorsName[5], "　耐久　：" + Categorys.Life[5], "　弾数　：" + (Categorys.MaxBullet[5] + 1), "　弾速　：やや速い(" + (Categorys.ShotSpeed[5] + 1) + ")", "跳弾回数：" + Categorys.MaxRef[5], "移動速度：速い(" + (Categorys.MoveSpeed[5] + 0.5) + ")", "・生存特化型<br>　追尾、迎撃、回避全て揃ったエリート戦車<br>　跳弾を活用すると倒しやすい。　<br>【強化】砲撃間隔の短縮"],
					[colorsName[6], "　耐久　：" + Categorys.Life[6], "　弾数　：" + (Categorys.MaxBullet[6] + 1), "　弾速　：とても速い(" + Categorys.ShotSpeed[6] + ")", "跳弾回数：" + Categorys.MaxRef[6], "移動速度：動かない(" + Categorys.MoveSpeed[6] + ")", "・弾道予測型<br>　敵戦車の中でも指折りの狙撃手。<br>　壁の後ろに隠れても油断してはいけない。"],
					[colorsName[7], "　耐久　：" + Categorys.Life[7], "　弾数　：" + Categorys.MaxBullet[7], "　弾速　：速い(" + Categorys.ShotSpeed[7] + ")", "跳弾回数：" + Categorys.MaxRef[7], "移動速度：普通(" + (Categorys.MoveSpeed[7] + 0.5) + ")", "・攻守両立型<br>　ステルス能力を持つ敵戦車。<br>　死角からの砲撃に要注意。<br>【強化】装填にかかる時間の短縮"],
					[colorsName[8], "　耐久　：" + Categorys.Life[8], "　弾数　：" + (Categorys.MaxBullet[8] + 1), "　弾速　：普通(" + Categorys.ShotSpeed[8] + ")", "跳弾回数：" + Categorys.MaxRef[8], "移動速度：速い(" + (Categorys.MoveSpeed[8] + 0.5) + ")", "・近距離迎撃型<br>　追尾、迎撃、回避全て揃ったエリート戦車<br>　攻撃は弾を2発しか使わないが<br>　迎撃時には弾幕を貼って防御する。<br>　地雷も搭載している。"],
					[colorsName[9], "　耐久　：" + Categorys.Life[9], "　弾数　：" + Categorys.MaxBullet[9], "　弾速　：やや速い(" + Categorys.ShotSpeed[9] + ")", "跳弾回数：" + Categorys.MaxRef[9], "移動速度：動かない(" + Categorys.MoveSpeed[9] + ")", "・弾幕爆撃型<br>　撃てる弾を全て使い弾幕を張る戦車。<br>　発射される弾には爆弾が仕込まれており、<br>　狙った場所で小規模の爆発させることが可能。<br>【強化】砲撃間隔の短縮"],
					[colorsName[10], "　耐久　：" + Categorys.Life[10], "　弾数　：" + Categorys.MaxBullet[10], "　弾速　：やや速い(" + Categorys.ShotSpeed[10] + ")", "跳弾回数：" + Categorys.MaxRef[10], "移動速度：とても速い(" + (Categorys.MoveSpeed[10] + 0.5) + ")", "・地雷設置型<br>　高機動かつ地雷をばら撒く戦車。<br>　偏差射撃も使うため危険度が高い。<br>【強化】地雷の数が2個に増加"],
					[colorsName[11], "　耐久　：" + Categorys.Life[11], "　弾数　：" + (Categorys.MaxBullet[11] + 1), "　弾速　：最速(" + Categorys.ShotSpeed[11] + ")", "跳弾回数：" + Categorys.MaxRef[11], "移動速度：速い(" + Categorys.MoveSpeed[11] + ")", "・強襲狙撃型<br>　高機動かつ最速の弾を放つ戦車。<br>　稀に乱入する危険な不明車両。<br>　回避能力が極めて高いため撃破は困難。<br>【弱化】砲撃間隔の延長"],
					[colorsName[12], "　耐久　：" + Categorys.Life[12], "　弾数　：" + Categorys.MaxBullet[12], "　弾速　：速い(" + Categorys.ShotSpeed[12] + ")", "跳弾回数：" + Categorys.MaxRef[12], "移動速度：やや速い(" + Categorys.MoveSpeed[12] + ")", "・精鋭型<br>　高い能力と耐久を持つボス戦車。<br>　地雷の爆破に巻き込めば耐久を無視して、<br>　撃破可能。<br>【強化】自機狙いの偏差射撃追加"],
					[colorsName[13], "　耐久　：" + Categorys.Life[13], "　弾数　：" + Categorys.MaxBullet[13], "　弾速　：速い(" + Categorys.ShotSpeed[13] + ")", "跳弾回数：" + Categorys.MaxRef[13], "移動速度：とても速い(" + Categorys.MoveSpeed[13] + ")", "・精鋭型<br>　最上位の戦闘力を誇るボス戦車。<br>　優秀なプレイヤーしか対峙できない。<br>　耐久が1になると殲滅モードに移行する。<br>【強化】自機狙いの偏差射撃追加"]
				];
			}

			let area = new SetArea({ x: 0, y: 0 }, 'TankList');

			this.addChild(this.TankGroup);
			this.addChild(this.CannonGroup);

			let listCnt = 0;
			let margin = 0;
			let selCnt = playerType;

			for (let i = 0; i < 7; i++) {
				for (let j = 0; j < 2; j++) {
					if (j == 0) {
						dispTanks[listCnt] = new PictureTank(j + 2, i + 3.2 + margin, listCnt, this)._Output();
					} else {
						dispTanks[listCnt] = new PictureTank(j + 3.5, i + 3.2 + margin, listCnt, this)._Output();
					}
					listCnt++;
				}
				margin += 0.05;
			}

			var tankName = new ViewText(area.body, 'Text', { width: 48 * 12, height: 48 }, { x: PixelSize * 6.5, y: PixelSize * 0.5 }, '戦車名', '48px sans-serif', 'black', 'left', true);
			var tankLife = new ViewText(area.body, 'Text', { width: 36 * 12, height: 36 }, { x: PixelSize * 6.5, y: PixelSize * 1.5 }, '　耐久　：', '36px sans-serif', 'black', 'left', true);
			var tankBulCnt = new ViewText(area.body, 'Text', { width: 36 * 12, height: 48 }, { x: PixelSize * 6.5, y: PixelSize * 2.5 }, '　弾数　：', '36px sans-serif', 'black', 'left', true);
			var tankBulSpd = new ViewText(area.body, 'Text', { width: 36 * 12, height: 48 }, { x: PixelSize * 6.5, y: PixelSize * 3.5 }, '　弾速　：', '36px sans-serif', 'black', 'left', true);
			var tankBulRef = new ViewText(area.body, 'Text', { width: 36 * 12, height: 48 }, { x: PixelSize * 6.5, y: PixelSize * 4.5 }, '跳弾回数：', '36px sans-serif', 'black', 'left', true);
			var tankSpd = new ViewText(area.body, 'Text', { width: 36 * 12, height: 48 }, { x: PixelSize * 6.5, y: PixelSize * 5.5 }, '移動速度：', '36px sans-serif', 'black', 'left', true);
			var tankDsc = new ViewText(area.body, 'Text', { width: 36 * 22, height: 36 * 5 }, { x: PixelSize * 6.5, y: PixelSize * 6.5 }, '・戦車の特徴', '36px sans-serif', 'black', 'left', true);

			var change = new ViewButton(area.body, 'Change', { width: 36 * 10, height: 36 }, { x: PixelSize * 0.5, y: PixelSize * 8 }, '選択中の戦車に変更', '36px sans-serif', 'black', 'center', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.1)');
			var selTank = new ViewText(this, 'Select', { width: 60, height: 20 }, { x: 0, y: 0 }, '自機→', '20px sans-serif', '#00f', 'center', true);

			var toTitle = new ViewText(area.head, 'Back', { width: PixelSize * 5.5, height: 48 }, { x: PixelSize * 6.5, y: PixelSize * 12.5 }, 'タイトル画面へ', '48px sans-serif', '#ebe799', 'center', true);

			change.addEventListener(Event.TOUCH_START, function() {
				if (selCnt > 11) {
					new ViewMessage(now_scene, 'Message', { width: 960, height: 48 }, { x: PixelSize * 2.5, y: PixelSize * 7.5 }, performance[selCnt][0] + 'は自機として使用できません！', '48px sans-serif', '#f00', 'center', 60).backgroundColor = '#000a';
				} else if (playerType != selCnt) {
					if (changePermitNum[selCnt] > stagePath.length){
						new ViewMessage(now_scene, 'Message', { width: 960, height: 104 }, { x: PixelSize * 2.5, y: PixelSize * 7 }, '現在のバージョンでは' + performance[selCnt][0] + 'を<br><br>自機として使用できません！', '48px sans-serif', '#f00', 'center', 60).backgroundColor = '#000a';
					}else if (changePermitNum[selCnt] > totalStageNum){
						new ViewMessage(now_scene, 'Message', { width: 960, height: 104 }, { x: PixelSize * 2.5, y: PixelSize * 7 }, performance[selCnt][0] + 'は自機として使用できません！<br><br>ステージ' + (changePermitNum[selCnt] + 1) + 'を一度クリアしてください。', '48px sans-serif', '#f00', 'center', 60).backgroundColor = '#000a';
					}else{
						let i = playerType;
						playerType = selCnt;
						TankColorChange(i, false);
						TankColorChange(playerType, false);
						selTank.moveTo(PictureTank.collection[playerType].x - 60, PictureTank.collection[playerType].y + 20);
						new ViewMessage(now_scene, 'Message', { width: 960, height: 48 }, { x: PixelSize * 2.5, y: PixelSize * 7.5 }, '自機を' + performance[selCnt][0] + 'に変更しました。', '48px sans-serif', '#0ff', 'center', 60).backgroundColor = '#000a';
					}
				}

			});

			toTitle.addEventListener(Event.TOUCH_START, function() {
				flg = true;
				new FadeOut(now_scene);
			});

			function TankColorChange(i, selFlg) {
				let c = PictureTank.collection[i];
				if (selFlg) {
					var image = new Surface(c.width, c.height);
					image.context.fillStyle = '#0000';
					image.context.lineWidth = 6;
					image.context.strokeStyle = '#FF1493';
					roundedRect(image.context, 0, 0, c.width, c.height, 10);
					c.image = image;
				} else if (i == playerType) {
					var image = new Surface(c.width, c.height);
					image.context.fillStyle = '#0000';
					image.context.lineWidth = 4;
					image.context.strokeStyle = '#0ff';
					roundedRect(image.context, 0, 0, c.width, c.height, 10);
					c.image = image;
				} else {
					var image = new Surface(c.width, c.height);
					if (changePermitNum[i] > totalStageNum){
						image.context.fillStyle = '#c008';
					}else{
						image.context.fillStyle = '#0008';
					}
					image.context.lineWidth = 4;
					image.context.strokeStyle = '#0000';
					roundedRect(image.context, 0, 0, c.width, c.height, 10);
					c.image = image;
				}
			}

			function ResetText() {
				tankName.text = performance[selCnt][0];
				tankLife.text = performance[selCnt][1];
				tankBulCnt.text = performance[selCnt][2];
				tankBulSpd.text = performance[selCnt][3];
				tankBulRef.text = performance[selCnt][4];
				tankSpd.text = performance[selCnt][5];
				tankDsc.text = performance[selCnt][6];
				if (gameMode > 0) {
					tankBulCnt.color = 'black';
					tankBulSpd.color = 'black';
					tankBulRef.color = 'black';
					tankSpd.color = 'black';
					tankDsc.color = 'black';
					switch (selCnt) {
						case 1:
							tankBulCnt.color = 'red';
							tankBulSpd.color = 'red';
							break;
						case 2:
							tankBulCnt.color = 'red';
							tankBulSpd.color = 'red';
							tankSpd.color = 'red';
							break;
						case 3:
							tankBulCnt.color = 'red';
							tankBulRef.color = 'red';
							tankSpd.color = 'red';
							tankDsc.color = 'red';
							break;
						case 4:
							tankBulCnt.color = 'red';
							tankBulSpd.color = 'red';
							break;
						case 5:
							tankBulCnt.color = 'red';
							tankBulSpd.color = 'red';
							tankSpd.color = 'red';
							tankDsc.color = 'red';
							break;
						case 6:
							tankBulCnt.color = 'red';
							break;
						case 7:
							tankSpd.color = 'red';
							tankDsc.color = 'red';
							break;
						case 8:
							tankBulCnt.color = 'red';
							tankSpd.color = 'red';
							tankDsc.color = 'red';
							break;
						case 9:
							tankDsc.color = 'red';
							break;
						case 10:
							tankSpd.color = 'red';
							tankDsc.color = 'red';
							break;
						case 11:
							tankBulCnt.color = 'red';
							tankDsc.color = 'red';
							break;
						case 12:
						case 13:
							tankDsc.color = 'red';
							break;
					}
				}
			}

			this.onenterframe = function() {
				if (!flg && BGM.currentTime == BGM.duration) {
					BGM.play();
				}

				if (flg) {
					this.time++;
					if (this.time % 30 == 0) {
						this._Remove();
						game.replaceScene(new TitleScene());
					}
				}
			}

			for (let i = 0; i < PictureTank.collection.length; i++) {
				let c = PictureTank.collection[i];
				if (c.category == playerType) {
					selTank.moveTo(c.x - 60, c.y + 20);
				}
				c.addEventListener(Event.TOUCH_START, function() {
					if (selCnt != -1) TankColorChange(selCnt, false);
					selCnt = c.category;
					ResetText();
					TankColorChange(selCnt, true);
				})
			}

			new FadeIn(this);
			return this;
		},
		_Remove: function() {
			while (this.firstChild) {
				if (this.firstChild instanceof enchant.box2d.PhySprite) {
					this.firstChild.destroy();
				} else {}
				this.removeChild(this.firstChild);
			}
		}
	})
	


	var StartScene = Class.create(Scene, {
		initialize: function() {
			Scene.call(this);
			this.backgroundColor = '#ebf899';
			this.time = 0;
			now_scene = this;

			tankEntity = []; //敵味方の戦車情報を保持する配列
			deadFlgs = [];
			bulStack = []; //弾の状態を判定する配列
			bullets = []; //戦車の弾情報を保持する配列
			boms = []; //爆弾の情報を保持する配列
			avoids = [];
			walls = [];
			holes = [];
			blocks = [];
			tankColorCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
			destruction = 0;
			gameStatus = 0;
			victory = false;
			defeat = false;
			resultFlg = false;
			WorldFlg = false;
			deadTank[0] = false;

			game.time = 0;

			delStageFile();

			var nextData = LoadStage(); //ステージ情報引き出し

			if (stageRandom == -1) {
				stageRandom = Math.floor(Math.random() * Object.keys(nextData).length);
			}

			let count = 0;
			for (var i = 4; i < Object.keys(nextData[stageRandom]).length; i++) {
				count++;
			}

			deadTank.forEach(elem => {
				if (elem) {
					count--;
				}
			})

			stageData = LoadStage()[stageRandom]; //ステージ情報引き出し

			let area = new SetArea({ x: 0, y: 0 }, 'Start');
			new ViewText(area.head, 'Title', { width: 960, height: 96 }, { x: PixelSize * 0.5, y: PixelSize * 2 }, 'Stage : ' + (stageNum + 1), '96px sans-serif', '#ebe799', 'center', true);
			new ViewText(area.head, 'Title', { width: 960, height: 96 }, { x: PixelSize * 0.5, y: PixelSize * 5 }, '敵戦車数：' + count, '32px sans-serif', '#ebe799', 'center', true);
			new ViewText(area.head, 'Title', { width: 960, height: 96 }, { x: PixelSize * 0.5, y: PixelSize * 6 }, '残機数：' + zanki, '32px sans-serif', 'aliceblue', 'center', true);

			this.onenterframe = function() {
				this.time++
				if (this.time == 15){
					game.assets['./sound/RoundStart.mp3'].play();
					if((stageNum+1) % 20 == 0){
						showEmergencyAlert(this);
					}
				}
				//if ((stageNum % 20 == 0 && stageNum > 0) && this.time == 15) new Warning(scene)
				if (this.time == 150) {
					new FadeOut(this)
				}
				if (this.time == 180) {
					this._Remove();
					console.clear();
					game.replaceScene(new TestScene()); // 現在表示しているシーンをゲームシーンに置き換える
				}
			}
			new FadeIn(this);
			return this;
		},
		_Remove: function() {
			while (this.firstChild) {
				if (this.firstChild instanceof enchant.box2d.PhySprite) {
					this.firstChild.destroy();
				} else {}
				this.removeChild(this.firstChild);
			}
		}
	});

	var BonusScene = Class.create(Scene, {
		initialize: function() {
			Scene.call(this);
			this.backgroundColor = '#ebf899';
			this.time = 0;
			now_scene = this;

			zanki++;

			let area = new SetArea({ x: 0, y: 0 }, 'Bonus');
			new ViewText(area.head, 'Title', { width: 960, height: 72 }, { x: PixelSize * 0.5, y: PixelSize * 2 }, 'クリアボーナス！', '72px sans-serif', '#ebe799', 'center', true);
			new ViewText(area.head, 'Title', { width: 48 * 5, height: 48 }, { x: PixelSize * 5.5, y: PixelSize * 5 }, '残機数：', '48px sans-serif', 'aliceblue', 'left', true);
			var zankiLabel = new ViewText(area.head, 'Title', { width: 128, height: 64 }, { x: PixelSize * 8.5, y: PixelSize * 5 }, (zanki - 1), '64px "Arial"', 'aliceblue', 'left', true);

			this.onenterframe = function() {
				this.time++
				if (this.time == 15) game.assets['./sound/ExtraTank.mp3'].play()
				if (this.time >= 85 && this.time < 90) {
					zankiLabel.opacity -= 0.2;
					if (zankiLabel.opacity <= 0) {
						this.removeChild(zankiLabel);
					}
				}
				if (this.time == 90) {
					zankiLabel = new ViewText(area.head, 'Title', { width: 128, height: 72 }, { x: PixelSize * 8.5, y: (PixelSize * 5) - 8 }, zanki, 'bold 72px "Arial"', '#ebf899', 'left', true);
				}
				if (this.time == 150) {
					new FadeOut(this)
				}
				if (this.time == 180) {
					this._Remove();
					game.replaceScene(new StartScene()); // 現在表示しているシーンをゲームシーンに置き換える
				}
			}

			new FadeIn(this);
			return this;
		},
		_Remove: function() {
			while (this.firstChild) {
				if (this.firstChild instanceof enchant.box2d.PhySprite) {
					this.firstChild.destroy();
				} else {}
				this.removeChild(this.firstChild);
			}
		}
	})

	var TestScene = Class.create(Scene, {

        initialize: function () {
            Scene.call(this);
            this.backgroundColor = "white";
            this.time = 0;
			this.area = null;
			this.dcnt = 1;
            this.skipcnt = 0;
            now_scene = this;

            // -----------------------------
            // 可視状態変化イベント登録
            // -----------------------------
            this.setupVisibilityHandler();

            // -----------------------------
            // ステージデータ読み込み
            // -----------------------------
            stageData = LoadStage()[stageRandom];

            // -----------------------------
            // 物理ワールド
            // -----------------------------
            this.world = new PhysicsWorld(0, 0);

            // -----------------------------
            // グループ生成
            // -----------------------------
            this.createGroups();

            // -----------------------------
            // マップ生成
            // -----------------------------
            this.backgroundMap = new MainMap(this);

            // -----------------------------
            // 壁・障害物生成
            // -----------------------------
            this.createWallsAndObstacles();

            // -----------------------------
            // グループをシーンに追加
            // -----------------------------
            this.addGroupsToScene();

            // -----------------------------
            // フィルターマップ
            // -----------------------------
            this.filterMap = new FillterMap(this);
            if (DebugFlg) this.filterMap.opacity = 0;

            SetObs(this, this.backgroundMap.collisionData);
            SetRefs(this, this.backgroundMap.collisionData);

            // -----------------------------
            // プレイヤー生成
            // -----------------------------
            this.spawnPlayer();

            // -----------------------------
            // 敵戦車生成
            // -----------------------------
            this.spawnEnemies();

            // -----------------------------
            // UI 生成
            // -----------------------------
            this.createUI();

            // -----------------------------
            // BGM 再生
            // -----------------------------
            this.startBGM();

            // -----------------------------
            // フェードイン
            // -----------------------------
            new FadeIn(this);

            // -----------------------------
            // メインループ
            // -----------------------------
            this.onenterframe = this.mainLoop.bind(this);

            return this;
        },
            // -----------------------------
        // 可視状態変化イベント登録
        // -----------------------------
        setupVisibilityHandler: function () {

            const onHidden = () => {

                if (document.hidden) {

                    // BGM 停止
                    if (BGM && !BGM.paused) {
                        BGM.pause();
                    }

                    // ポーズ条件
                    if (gameStatus == 0 && game.time > 250) {
                        if (!(game.currentScene instanceof PauseScene)) {
                            new PauseScene();
                        }
                    }

                } else {

                    // タブ復帰時 BGM 再開
                    if (BGM && BGM.paused && gameStatus == 0) {
                        BGM.play();
                    }
                }
            };

            // TestScene 入場時にイベント登録
            this.addEventListener("enter", () => {
                document.addEventListener("visibilitychange", onHidden);
            });

            // TestScene 退出時にイベント解除
            this.addEventListener("exit", () => {
                document.removeEventListener("visibilitychange", onHidden);
            });
        },

        // -----------------------------
        // グループ生成
        // -----------------------------
        createGroups: function () {
            this.MarkGroup = new Group();
            this.BomGroup = new Group();
            this.TankGroup = new Group();
            this.BulletGroup = new Group();
            this.FireGroup = new Group();
            this.CannonGroup = new Group();
            this.BlockGroup = new Group();
            this.SparkGroup = new Group();
        },

        // -----------------------------
        // 壁・障害物生成
        // -----------------------------
        createWallsAndObstacles: function () {

            this.grid = [];
            let fy = 0;

            // 外枠の壁
            walls[0] = new Wall(18, 1, 1, 1, 'Top', this);
            walls[1] = new Wall(18, 1, 1, 14, 'Bottom', this);
            walls[2] = new Wall(1, 13, 0, 1, 'Left', this);
            walls[3] = new Wall(1, 13, 19, 1, 'Right', this);

            // マップデータから壁・障害物生成
            this.backgroundMap.collisionData.forEach(row => {

                this.grid[fy] = [];
                let wallStartX = null;
                let wallLength = 0;

                row.forEach((col, j) => {

                    this.grid[fy][j] = (col === 0) ? 0 : 1;

                    if (col === 1) {

                        // 連続壁の開始
                        if (wallStartX === null) {
                            wallStartX = j;
                            wallLength = 1;
                        } else {
                            wallLength++;
                        }

                    } else {

                        // 連続壁の終了 → まとめて生成
                        if (wallStartX !== null) {
                            walls.push(new Wall(wallLength, 1, wallStartX, fy, 'block', this));
                            wallStartX = null;
                            wallLength = 0;
                        }

                        // その他障害物
                        if (col === 2) avoids.push(new Avoid(j, fy, this));
                        if (col === 3) holes.push(new Hole(j, fy, this));
                        if (col === 5) blocks.push(new Block(j, fy, this));
                    }
                });

                // 行末の連続壁処理
                if (wallStartX !== null) {
                    walls.push(new Wall(wallLength, 1, wallStartX, fy, 'block', this));
                }

                fy++;
            });
        },

        // -----------------------------
        // グループをシーンに追加
        // -----------------------------
        addGroupsToScene: function () {
            this.addChild(this.MarkGroup);
            this.addChild(this.BomGroup);
            this.addChild(this.TankGroup);
            this.addChild(this.BulletGroup);
            this.addChild(this.FireGroup);
            this.addChild(this.CannonGroup);
            this.addChild(this.SparkGroup);
            this.addChild(this.BlockGroup);
        },
            // -----------------------------
        // プレイヤー生成
        // -----------------------------
        spawnPlayer: function () {
            // プレイヤー戦車
            tankEntity.push(
                new Entity_Type0(
                    stageData[3][0],
                    stageData[3][1],
                    playerType,
                    0,
                    this
                )
            );
        },

        // -----------------------------
        // 敵戦車生成
        // -----------------------------
        spawnEnemies: function () {

            for (let i = 4; i < Object.keys(stageData).length; i++) {

                // 特殊条件：ランダムで11番戦車に差し替え
                if (
                    (Math.floor(Math.random() * 10) == 0 &&
                        stageNum > 10 &&
                        i == 4 &&
                        stageNum % 5 != 4) ||
                    stageData[i][2] == 11
                ) {
                    stageData[i][2] = 11;
                }

                // リトライでない場合
                if (!retryFlg) {
                    this.spawnEnemyNormal(i);
                }
                // リトライ時
                else {
                    this.spawnEnemyRetry(i);
                }
            }
        },

        // -----------------------------
        // 通常時の敵生成
        // -----------------------------
        spawnEnemyNormal: function (i) {

            let x = stageData[i][0];
            let y = stageData[i][1];
            let type = stageData[i][2];
            let idx = i - 3;

            switch (type) {
                case 0:
                case 8:
                    tankEntity.push(new Entity_Type10(x, y, type, idx, this));
                    break;
                case 1:
                case 6:
                    tankEntity.push(new Entity_Type5(x, y, type, idx, this));
                    break;
                case 2:
                case 4:
                    tankEntity.push(new Entity_Type1(x, y, type, idx, this));
                    break;
                case 3:
                case 7:
                    tankEntity.push(new Entity_Type2(x, y, type, idx, this));
                    break;
                case 5:
                    tankEntity.push(new Entity_Type3(x, y, type, idx, this));
                    break;
                case 9:
                    tankEntity.push(new Entity_Type4(x, y, type, idx, this));
                    break;
                case 10:
                    tankEntity.push(new Entity_Type6(x, y, type, idx, this));
                    break;
                case 11:
                    tankEntity.push(new Entity_Type7(x, y, type, idx, this));
                    break;
                case 12:
                    tankEntity.push(new Entity_Type8(x, y, type, idx, this));
                    break;
                case 13:
                    tankEntity.push(new Entity_Type9(x, y, type, idx, this));
                    break;
            }

            tankColorCounts[type]++;
        },

        // -----------------------------
        // リトライ時の敵生成
        // -----------------------------
        spawnEnemyRetry: function (i) {

            let x = stageData[i][0];
            let y = stageData[i][1];
            let type = stageData[i][2];
            let idx = i - 3;

            // すでに倒した敵は復活しない
            if (deadTank[idx] === false) {
                this.spawnEnemyNormal(i);
            } else {
                // ダミーを置いておく
                tankEntity.push(new Sprite({ width: 1, height: 1, x: -100, y: -100 }));
                bullets.push(0);
                bulStack.push([]);
                boms.push(0);
                deadFlgs.push(true);
                destruction++;
            }
        },

        // -----------------------------
        // UI 生成
        // -----------------------------
        createUI: function () {

            new PlayerLabel(tankEntity[0]);

            // カウントダウン
            new ViewCountDown();

            // 残機表示
            this.remaining = new ViewRemaining();

            // ポーズ説明
            this.pauseText = new ViewText(
                this,
                'Pause',
                { width: 28 * 13.5, height: 28 },
                { x: 32, y: 16 },
                '',
                'bold 28px sans-serif',
                'white',
                'left',
                false
            );

            if (navigator.userAgent.match(/iPhone|iPad|Android/)) {
                this.pauseText.text = 'PAUSEボタンで一時停止<br>操作方法確認';
            } else {
                this.pauseText.text = 'Escキーで一時停止<br>操作方法確認';
            }
        },

        // -----------------------------
        // BGM 開始
        // -----------------------------
        startBGM: function () {
            BGM = game.assets['./sound/start.mp3'];
            BGM.play();
            BGM.volume = 0.2;
        },
        // -----------------------------
        // メインループ
        // -----------------------------
        mainLoop: function () {
            game.time++;

            // BGM 切替（敵の色で決定）
            this.updateBGMIndex();

            // 開始演出
            this.handleStartSequence();

            // BGM ループ処理
            this.handleBGMLoop();

            // 物理処理
            if (WorldFlg) {
                this.world.step(game.fps);
                this.time++;

                // ポーズ
                this.handlePauseInput();

                // 勝敗判定
                if (!resultFlg) {
                    this.handleGameProgress();
                }
                // リザルト処理
                else {
                    this.handleResultSequence();
                }

                // 衝突更新
                this.handleCollisionUpdates();

				//RefAimLite.list.forEach(a => a.update());
				BulAimLite.list.forEach(a => a.update());
				PlayerBulAimLite.list.forEach(a => a.update());
				AimLite.list.forEach(a => a.update(a.from, a.to));
            }
        },

        // -----------------------------
        // BGM インデックス更新
        // -----------------------------
        updateBGMIndex: function () {

            if (tankColorCounts[13] > 0) BNum = 12;
            else if (tankColorCounts[12] > 0) BNum = 11;
            else if (tankColorCounts[11] > 0) BNum = 10;
            else if (tankColorCounts[8] > 0) BNum = 7;
            else if (tankColorCounts[6] > 0) BNum = 5;
            else if (tankColorCounts[10] > 0) BNum = 9;
            else if (tankColorCounts[9] > 0) BNum = 8;
            else if (tankColorCounts[7] > 0) BNum = 6;
            else if (tankColorCounts[5] > 0) BNum = 4;
            else if (tankColorCounts[4] > 0) BNum = 3;
            else if (tankColorCounts[3] > 0) BNum = 2;
            else if (tankColorCounts[2] > 0) BNum = 1;
            else BNum = 0;
        },

        // -----------------------------
        // 開始演出
        // -----------------------------
        handleStartSequence: function () {

            if (game.time == 210 &&
                !complete && !victory && !defeat && !resultFlg) {

                WorldFlg = true;
                this.remaining._Add();

                new ViewMessage(
                    this,
                    'Message',
                    { width: 640, height: 64 },
                    { x: PixelSize * 5, y: PixelSize * 6 },
                    'S T A R T',
                    'bold 64px "Arial"',
                    'yellow',
                    'center',
                    60
                );

                this.pauseText._Output();
            }
        },

        // -----------------------------
        // BGM ループ処理
        // -----------------------------
        handleBGMLoop: function () {

            if (gameStatus == 0) {
                if (BGM.currentTime == BGM.duration) {
                    BGM = game.assets[BGMs[BNum]];
                    BGM.currentTime = 0;
                    BGM.play();
                    if (game.time > 250) BGM.currentTime = 0.01;
                }
            }
        },

        // -----------------------------
        // ポーズ入力
        // -----------------------------
        handlePauseInput: function () {

            if (inputManager.checkButton("Start") == inputManager.keyStatus.DOWN &&
                gameStatus == 0 &&
                game.time > 250) {

                new PauseScene();
            }
        },

        // -----------------------------
        // ゲーム進行（勝敗判定）
        // -----------------------------
        handleGameProgress: function () {

            // 勝利条件
            if (gameStatus == 0) {

                // 全敵撃破
                if (destruction == tankEntity.length - 1 &&
                    zanki > 0 &&
                    !deadFlgs[0]) {

                    this.handleVictory();
                }

                // プレイヤー死亡
                else if (deadFlgs[0]) {
                    this.handleDefeat();
                }
            }

            // 勝利後の遷移
            else if (gameStatus == 1) {
                this.handleVictoryTransition();
            }

            // 敗北後の遷移
            else if (gameStatus == 2) {
                this.handleDefeatTransition();
            }
        },

        // -----------------------------
        // 勝利処理
        // -----------------------------
        handleVictory: function () {

            playerLife = tankEntity[0].life % Categorys.Life[tankEntity[0].category];
            BGM.stop();

            // 色カウント加算
            for (let i = 4; i < Object.keys(stageData).length; i++) {
                colors[stageData[i][2]] += 1;
            }

            // 次ステージ読み込み
            let script = document.createElement("script");
            script.src = stagePath[stageNum + 1];
            script.id = 'stage_' + (stageNum + 1);
            head[0].appendChild(script);

            gameStatus = 1;

            // 20ステージごとのボスクリア
            if (stageNum % 20 == 19) {

                this.removeChild(this.remaining);
                this.removeChild(this.pauseText);

                complete = true;
                resultFlg = true;
                score += destruction;
                this.time = 0;

                this.area = new SetArea({ x: 0, y: 0 }, 'Result');
                new ViewText(
                    this.area.head,
                    'Title',
                    { width: 784, height: 60 },
                    { x: 146, y: 64 },
                    'ミッションコンプリート！',
                    'bold 60px "Arial"',
                    'yellow',
                    'center',
                    true
                );
            }

            // 通常クリア
            else {
                victory = true;
                this.time = 0;

                new ViewText(
                    this,
                    'Title',
                    { width: 720, height: 64 },
                    { x: 360, y: 300 },
                    'ミッションクリア！',
                    'bold 60px "Arial"',
                    'red',
                    'left',
                    true
                );

                new ViewScore(this);
            }

            // クリアステージ更新
            if (TotalRepository.data.ClearStageNum < stageNum) {
                TotalRepository.data.ClearStageNum = stageNum;
                TotalRepository.save();
            }
        },

        // -----------------------------
        // 敗北処理
        // -----------------------------
        handleDefeat: function () {

            playerLife = 0;
            BGM.stop();
            defeat = true;
            gameStatus = 2;

            // 残機なし → リザルトへ
            if (zanki <= 0) {

                this.removeChild(this.remaining);
                this.removeChild(this.pauseText);

                for (let i = 4; i < Object.keys(stageData).length; i++) {
                    if (deadFlgs[i - 3]) {
                        colors[stageData[i][2]] += 1;
                    }
                }

                resultFlg = true;
                score += destruction;
                this.time = 0;

                this.area = new SetArea({ x: 0, y: 0 }, 'Result');
                new ViewText(
                    this.area.head,
                    'Title',
                    { width: 784, height: 60 },
                    { x: 146, y: 64 },
                    'ミッション終了！',
                    'bold 60px "Arial"',
                    'yellow',
                    'center',
                    true
                );
            }

            // 残機あり → リトライ
            else {
                this.time = 0;
            }
        },

        // -----------------------------
        // 勝利後の遷移
        // -----------------------------
        handleVictoryTransition: function () {

            if (this.time == 15) {
                BGM = game.assets['./sound/success.mp3'].play();
            }

            if (this.time == 150) {
                new FadeOut(this);
            }

            if (this.time == 180) {

                retryFlg = false;
                score += destruction;
                deadTank = [false];
                stageNum++;
                stageRandom = -1;

                this._Remove();

                if ((stageNum + 1) % 5 == 0) {
                    game.replaceScene(new BonusScene());
                } else {
                    game.replaceScene(new StartScene());
                }
            }
        },

        // -----------------------------
        // 敗北後の遷移
        // -----------------------------
        handleDefeatTransition: function () {

            if (this.time == 15) {
                BGM = game.assets['./sound/failed.mp3'].play();
            }

            if (this.time == 150) {
                new FadeOut(this);
            }

            if (this.time == 180) {
                retryFlg = true;
                this._Remove();
                game.replaceScene(new StartScene());
            }
        },

        // -----------------------------
        // リザルト処理
        // -----------------------------
        handleResultSequence: function () {

            // BGM 切替
            this.handleResultBGM();

            // リザルトフレーム表示
            if (this.time == 120) {
                new ViewFrame(this.area.body, 'Result', this.area.type.Body.size, { x: 0, y: 0 }, this.area.type.Body.color);
                new ViewFrame(this.area.body, 'Back', { width: 460, height: 56 * 13.5 }, { x: 0, y: 0 }, '#dd9');
            }

            // 色別撃破数の表示
            this.handleColorScore();

            // 総合スコア表示
            this.handleTotalScore();

            // タイトルへ / 次ステージへ
            this.handleResultButtons();
        },

        // -----------------------------
        // リザルト BGM
        // -----------------------------
        handleResultBGM: function () {

            if (this.time == 15) {
                BGM = game.assets['./sound/end.mp3'];
                BGM.play();
                this.chgBgm = true;
            }

            else if (this.time > 100 && this.chgBgm && BGM.currentTime == BGM.duration) {
                BGM.currentTime = 0;
                BGM.stop();
                BGM = game.assets['./sound/result.mp3'];
                BGM.play();
                this.chgBgm = false;
            }

            else if (this.time > 100 && !this.chgBgm && BGM.currentTime == BGM.duration) {
                BGM = game.assets['./sound/result.mp3'];
                BGM.currentTime = 0;
                BGM.play();
            }
        },

        // -----------------------------
        // 色別撃破数表示
        // -----------------------------
        handleColorScore: function () {

            if (this.time >= 120 && this.time % 15 == 0 && this.dcnt + this.skipcnt < colors.length) {

                while (colors[this.dcnt + this.skipcnt] == 0 && this.dcnt + this.skipcnt < colors.length - 1) {
                    this.skipcnt++;
                }

                if (colors[this.dcnt + this.skipcnt] > 0) {
                    new ViewText(this.area.body, 'Name',
                        { width: 280, height: 48 },
                        { x: 44, y: 52 * (this.dcnt) - 32 },
                        colorsName[this.dcnt + this.skipcnt],
                        '48px "Arial"',
                        fontColor[this.dcnt + this.skipcnt],
                        'left',
                        true
                    );

                    new ViewText(this.area.body, 'Score',
                        { width: 180, height: 48 },
                        { x: 324, y: 52 * (this.dcnt) - 32 },
                        '：' + colors[this.dcnt + this.skipcnt],
                        '48px "Arial"',
                        '#400',
                        'left',
                        true
                    );
                }

                this.dcnt++;
            }
        },

        // -----------------------------
        // 総合スコア表示
        // -----------------------------
        handleTotalScore: function () {

            if (this.time == 120 + 15 * (this.dcnt + 3)) {

                if (defeat) {
                    new ViewText(this.area.body, 'Score',
                        { width: 570, height: 64 },
                        { x: 520, y: 220 },
                        '撃破数：' + score,
                        'bold 64px "Arial"',
                        '#622',
                        'left',
                        true
                    );
                } else {
                    new ViewText(this.area.body, 'Score',
                        { width: 570, height: 64 },
                        { x: 520, y: 220 },
                        '撃破数+残機：' + (score + zanki),
                        'bold 64px "Arial"',
                        '#622',
                        'left',
                        true
                    );
                }
            }
        },

        // -----------------------------
        // リザルトボタン
        // -----------------------------
        handleResultButtons: function () {

            if (this.time >= 120 + 15 * (this.dcnt + 5)) {

                retryFlg = false;
                deadTank = [false];

                let toTitle = new ViewText(
                    this.area.body,
                    'toTitle',
                    { width: 520, height: 48 },
                    { x: 620, y: 570 },
                    '➡タイトル画面へ',
                    '40px "Arial"',
                    '#400',
                    'center',
                    false
                );

                let toProceed = new ViewText(
                    this.area.body,
                    'toProceed',
                    { width: 520, height: 48 },
                    { x: 620, y: 670 },
                    '➡さらなるステージへ...',
                    '40px "Arial"',
                    'red',
                    'center',
                    false
                );

                if (this.time == 120 + 15 * (this.dcnt + 5)) {
                    this.addChild(toTitle);
                    if (stageNum != (stagePath.length - 1) && defeat == false) {
                        this.addChild(toProceed);
                    }
                }

                toTitle.addEventListener(Event.TOUCH_START, function () {
                    game.stop();
                    location.href = "./game_life.html";
                });

                toProceed.addEventListener(Event.TOUCH_START, function () {
                    complete = false;
                    BGM.stop();
                    new FadeOut(now_scene);
                    stageNum++;
                    now_scene._Remove();
                    game.replaceScene(new StartScene());
                });
            }
        },

        // -----------------------------
        // 衝突更新
        // -----------------------------
        handleCollisionUpdates: function () {

            if (collisionUpdates.length > 0) {

                collisionUpdates.forEach(u => {
                    now_scene.backgroundMap.collisionData[u.y][u.x] = u.value;
                });

                collisionUpdates = [];

                // 既存 RefObstacle を削除
                const children = now_scene.childNodes
                    .slice()
                    .filter(child => child instanceof RefObstracle);

                children.forEach(child => {
                    now_scene.removeChild(child);
                });

                // 再生成
                SetRefs(now_scene, now_scene.backgroundMap.collisionData);
            }
        },
            // -----------------------------
        // 子要素削除（元コード完全維持）
        // -----------------------------
        _Remove: function () {
            while (this.firstChild) {
                if (this.firstChild instanceof enchant.box2d.PhySprite) {
                    this.firstChild.destroy();
                }
                this.removeChild(this.firstChild);
            }
			RefAimLite.collection.forEach(e => e.remove());
			RefAimLite.collection.length = 0;
			BulAimLite.list.forEach(e => e.remove());
			BulAimLite.list.length = 0;
			PlayerBulAimLite.list.forEach(e => e.remove());
			PlayerBulAimLite.list.length = 0;
			AimLite.list.forEach(e => e.remove());
			AimLite.list.length = 0;
        }
    });

	var PauseScene = Class.create(Scene, {
		initialize: function() {
			Scene.call(this);
			var that = this;
			this.backgroundColor = '#0008';
			this.time = 0;

			BGM.volume = 0.5;

			new ViewText(this, 'Title', { width: 640, height: 96 }, { x: 64 * 5, y: 64 * 1.5 }, 'PAUSE', '96px sans-serif', 'white', 'center', true);

			var save = new ViewButton(this, 'Title', { width: 640, height: 64 }, { x: 64 * 5, y: 64 * 4 }, 'SAVE', '64px sans-serif', 'white', 'center', 'rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)');
			var retire = new ViewButton(this, 'Title', { width: 640, height: 64 }, { x: 64 * 5, y: 64 * 6.5 }, 'RETIRE', '64px sans-serif', 'white', 'center', 'rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)');
			var back = new ViewButton(this, 'Title', { width: 640, height: 64 }, { x: 64 * 5, y: 64 * 9 }, 'CONTINUE', '64px sans-serif', 'white', 'center', 'rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)');

			//let area = new SetArea({x: 0, y: 0}, 'Pause');

			if (navigator.userAgent.match(/iPhone|iPad|Android/)) {
				new ViewFrame(this, 'Pause', { width: PixelSize * 20, height: PixelSize * 4.5 }, { x: 0, y: PixelSize * 10.5 }, '#000000aa');
				new ViewText(this, 'Move', { width: PixelSize * 8, height: PixelSize * 0.5 }, { x: PixelSize * 0.5, y: PixelSize * 11 }, '　移動　：十字パッド（斜め移動可）', '28px sans-serif', 'white', 'left', true);
				new ViewText(this, 'Move', { width: PixelSize * 8, height: PixelSize * 0.5 }, { x: PixelSize * 0.5, y: PixelSize * 11.75 }, '　照準　：画面タップか画面スライド', '28px sans-serif', 'white', 'left', true);
				new ViewText(this, 'Move', { width: PixelSize * 8, height: PixelSize * 0.5 }, { x: PixelSize * 0.5, y: PixelSize * 12.5 }, '　砲撃　：Bボタン', '28px sans-serif', 'white', 'left', true);
				new ViewText(this, 'Move', { width: PixelSize * 8, height: PixelSize * 0.5 }, { x: PixelSize * 0.5, y: PixelSize * 13.25 }, '爆弾設置：Aボタン', '28px sans-serif', 'white', 'left', true);
				new ViewText(this, 'Move', { width: PixelSize * 8, height: PixelSize * 0.5 }, { x: PixelSize * 0.5, y: PixelSize * 14 }, '一時停止：PAUSEボタン', '28px sans-serif', 'white', 'left', true);

				new ViewText(this, 'Move', { width: PixelSize * 11, height: PixelSize * 0.5 }, { x: PixelSize * 9, y: PixelSize * 11 }, '※補足説明', '28px sans-serif', 'white', 'left', true);
				new ViewText(this, 'Move', { width: PixelSize * 11, height: PixelSize * 0.5 }, { x: PixelSize * 9, y: PixelSize * 11.75 }, '・ステージ上にある茶色の壁は爆弾でしか壊せません。', '28px sans-serif', 'white', 'left', true);
				new ViewText(this, 'Move', { width: PixelSize * 11, height: PixelSize * 0.5 }, { x: PixelSize * 9, y: PixelSize * 12.5 }, '・爆弾は一定範囲内の戦車に100ダメージを与えます。', '28px sans-serif', 'white', 'left', true);
				new ViewText(this, 'Move', { width: PixelSize * 11, height: PixelSize * 0.5 }, { x: PixelSize * 9, y: PixelSize * 13.25 }, '・砲弾が当たった際、クリティカルが発生すると', '28px sans-serif', 'white', 'left', true);
				new ViewText(this, 'Move', { width: PixelSize * 11, height: PixelSize * 0.5 }, { x: PixelSize * 9, y: PixelSize * 14 }, '　2倍のダメージを与えることが出来ます。', '28px sans-serif', 'white', 'left', true);
			} else {
				new ViewFrame(this, 'Pause', { width: PixelSize * 20, height: PixelSize * 4.5 }, { x: 0, y: PixelSize * 10.5 }, '#000000aa');
				new ViewText(this, 'Move', { width: PixelSize * 8, height: PixelSize * 0.5 }, { x: PixelSize * 0.5, y: PixelSize * 11 }, '　移動　：WASDキー　（斜め移動可）', '28px sans-serif', 'white', 'left', true);
				new ViewText(this, 'Move', { width: PixelSize * 8, height: PixelSize * 0.5 }, { x: PixelSize * 0.5, y: PixelSize * 11.75 }, '　照準　：マウス操作', '28px sans-serif', 'white', 'left', true);
				new ViewText(this, 'Move', { width: PixelSize * 8, height: PixelSize * 0.5 }, { x: PixelSize * 0.5, y: PixelSize * 12.5 }, '　砲撃　：左クリック', '28px sans-serif', 'white', 'left', true);
				new ViewText(this, 'Move', { width: PixelSize * 8, height: PixelSize * 0.5 }, { x: PixelSize * 0.5, y: PixelSize * 13.25 }, '爆弾設置：Eキー', '28px sans-serif', 'white', 'left', true);
				new ViewText(this, 'Move', { width: PixelSize * 8, height: PixelSize * 0.5 }, { x: PixelSize * 0.5, y: PixelSize * 14 }, '一時停止：Escキー', '28px sans-serif', 'white', 'left', true);

				new ViewText(this, 'Move', { width: PixelSize * 11, height: PixelSize * 0.5 }, { x: PixelSize * 9, y: PixelSize * 11 }, '※補足説明', '28px sans-serif', 'white', 'left', true);
				new ViewText(this, 'Move', { width: PixelSize * 11, height: PixelSize * 0.5 }, { x: PixelSize * 9, y: PixelSize * 11.75 }, '・ステージ上にある茶色の壁は爆弾でしか壊せません。', '28px sans-serif', 'white', 'left', true);
				new ViewText(this, 'Move', { width: PixelSize * 11, height: PixelSize * 0.5 }, { x: PixelSize * 9, y: PixelSize * 12.5 }, '・爆弾は一定範囲内の戦車に100ダメージを与えます。', '28px sans-serif', 'white', 'left', true);
				new ViewText(this, 'Move', { width: PixelSize * 11, height: PixelSize * 0.5 }, { x: PixelSize * 9, y: PixelSize * 13.25 }, '・砲弾が当たった際、クリティカルが発生すると', '28px sans-serif', 'white', 'left', true);
				new ViewText(this, 'Move', { width: PixelSize * 11, height: PixelSize * 0.5 }, { x: PixelSize * 9, y: PixelSize * 14 }, '　2倍のダメージを与えることが出来ます。', '28px sans-serif', 'white', 'left', true);
			}

			save.addEventListener(Event.TOUCH_START, function() {
				if (confirm("現在の進捗をセーブしますか？\r\nタイトルのつづきからを選択すると現在のステージから再開できます。")) {
					Repository.data.StageNum = stageNum;
					Repository.data.Zanki = zanki;
					Repository.data.Scores = colors;
					Repository.data.Level = gameMode;
					Repository.data.Type = playerType;
					Repository.data.Pattern = stageRandom;
					Repository.save();
					alert('セーブが完了しました。');
					//new ViewMessage(that, 'Message', {width: PixelSize * 11, height: 64}, {x: PixelSize * 4.5, y: PixelSize * 5}, 'セーブが完了しました。', '64px "Arial"', 'white', 'center', 60);
				}
			});

			retire.addEventListener(Event.TOUCH_START, function() {
				if (confirm("本当にリタイアしますか？\r\n※現在の進行状況は保存されます。\r\nタイトルのつづきからを選択すると現在のステージから再開できます。")) {
					Repository.data.StageNum = stageNum;
					Repository.data.Zanki = zanki;
					Repository.data.Scores = colors;
					Repository.data.Level = gameMode;
					Repository.data.Type = playerType;
					Repository.data.Pattern = stageRandom;
					Repository.save();
					zanki = 0;
					deadFlgs[0] = true;
					that._Remove();
				}
			});

			back.addEventListener(Event.TOUCH_START, function() {
				BGM.volume = 1.0;
				that._Remove();
			});

			this.onenterframe = function() {
				this.time++;
				if (gameStatus == 0) {
					if (BGM.currentTime == BGM.duration) {
						BGM.currentTime = 0;
						BGM.play();
						BGM.volume = 0.5;
					}
				}
				if (inputManager.checkButton("Start") == inputManager.keyStatus.DOWN) {
					BGM.volume = 1.0;
					this._Remove();
				}
			}
			game.pushScene(this);
		},
		_Remove: function() {
			while (this.firstChild) {
				if (this.firstChild instanceof enchant.box2d.PhySprite) {
					this.firstChild.destroy();
				} else {}
				this.removeChild(this.firstChild);
			}
			game.popScene(this);
		}
	})

	var canStart = false;

	if (navigator.userAgent.match(/iPhone|iPad|Android/)) {
		if (Math.abs(window.orientation) == 90) {
			canStart = true;
		} else {
			alert("このゲームは横向きで遊んで下さい\r\n※画面を横向きにしないとゲームは始まりません。");
		}
	} else {
		canStart = true;
	}

	if (canStart) {
		decodeAllImages(game).then(() => {
			if (DebugFlg) {
			game.debug();
			} else {
				game.start();
			}
		});
	}

	game.onload = function() {
		var script = document.createElement("script");
		script.src = stagePath[stageNum];
		script.id = 'stage_' + stageNum;
		head[0].appendChild(script);

		BGM = game.assets['./sound/TITLE.mp3'];

		game.replaceScene(new SetUpScene());
	};

	game.onenterframe = function() {
		if (game.time % 10 == 0 && WorldFlg) {
			window.focus();
		}
	}
	/*let drawFps = 0;
	let drawCount = 0;
	let lastDraw = performance.now();

	function measureDrawFps() {
		drawCount++;

		const now = performance.now();
		const diff = now - lastDraw;

		if (diff >= 1000) {
			drawFps = (drawCount / diff) * 1000;
			drawCount = 0;
			lastDraw = now;

			const elem = document.getElementById("fpsLabel");
			if (elem) elem.textContent = "FPS: " + drawFps.toFixed(1);
		}

		requestAnimationFrame(measureDrawFps);
	}

	// ★ ゲーム開始時に一度だけ呼ぶ
	requestAnimationFrame(measureDrawFps);*/

};
if (navigator.userAgent.match(/iPhone/)) {
	window.addEventListener('orientationchange', function() {
		stageScreen = document.getElementById('enchant-stage');
		let vh = (window.innerHeight / ((PixelSize * Stage_H)));
		if (window.innerWidth < game.width * vh) {
			vh = (window.innerWidth / ((PixelSize * Stage_W) + 128));
		}
		//console.log(vh);
		game.scale = vh;
		ScreenMargin = ((window.innerWidth - stageScreen.clientWidth) / 2);
		stageScreen.style.position = "absolute";
		stageScreen.style.left = ScreenMargin + "px";
		game._pageX = ScreenMargin;
	})
}
window.onresize = function() {
	stageScreen = document.getElementById('enchant-stage');
	let vh = (window.innerHeight / ((PixelSize * Stage_H)));
	if (window.innerWidth < game.width * vh) {
		vh = (window.innerWidth / ((PixelSize * Stage_W) + 128));
	}
	//console.log(vh);
	game.scale = vh;
	ScreenMargin = ((window.innerWidth - stageScreen.clientWidth) / 2);
	stageScreen.style.position = "absolute";
	stageScreen.style.left = ScreenMargin + "px";
	game._pageX = ScreenMargin;
};