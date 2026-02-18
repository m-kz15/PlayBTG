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
var sclx = 0;
var scly = 0;
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
	19,	//8
	19,	//9
	19,	//10
	19,	//11
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
	Life: [
		1, //Player
		1, //brown
		1, //gray
		1, //green
		1, //red
		1, //elitegray
		1, //elitegreen
		1, //snow
		1, //elitered
		1, //pink
		1, //sand
		1, //random
		3, //dazzle
		3 //abysal
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
	/*Normalize(){
	    let ls = this.x * this.x + this.y + this.y;
	    let invNorm = 1.0 / Math.sqrt(ls);
	    return new Vector2(this.x * invNorm, this.y * invNorm);
	}*/
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
	/*Equals(v){
		if(v !== Vector2){
			return false;
		}
		return this == v;
	}*/
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
	/*static Normalize(value) {
	    let length = value.Length();
	    return value / length;
	}*/
}

/*class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    clone() {
        return new Vector2(this.x, this.y);
    }
	copy(v){
		this.x = v.x;
		this.y = v.y;
		return this;
	}
    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }
	dot(v1, v2) {
        return (v1.x * v2.x + v1.y * v2.y);
    }
    times(num) {
        this.x *= num;
        this.y *= num;
        return this;
    }
	normal(a, b){
		return b
			.clone()
			.sub(a);
	}
	multiply(v, w) {
		if (w !== undefined ) {
			return this.multiplyVectors( v, w );
		}
		this.x *= v.x;
		this.y *= v.y;
		return this;
	}
	multiplyVectors(a, b) {
		this.x = a.x * b.x;
		this.y = a.y * b.y;
		return this;
	}
	multiplyScalar(scalar){
		this.x *= scalar;
		this.y *= scalar;
		return this;
	}
	reflect(normal){
		let _vector = this.clone();
		return this.sub(_vector.copy( normal ).multiplyScalar( 2 * this.dot( normal ) ) );
	}
	normalized() {
        const {x, y, magnitude} = this;
        return new Vector2(x/magnitude, y/magnitude);
    }
	equals(v){
		if(v !== Vector2){
			return false;
		}
		return this == v;
	}
	isVertical(v1, v2) {
		return (Vector2.dot(v1, v2) === 0);
	}
    get inverse() {
        return this.clone().times(-1);
    }
    get magnitude() {
        const {x, y} = this;
        return Math.sqrt(x**2 + y**2);
    }
    static add(v1, v2) {
        return v1.clone().add(v2);
    }
    static sub(v1, v2) {
        return v1.clone().sub(v2);
    }
    static times(v1, num) {
        return v1.clone().times(num);
    }
    static dot(v1, v2) {
        return (v1.x * v2.x + v1.y * v2.y);
    }
    static cross(v1, v2) {
        return (v1.x * v2.x - v1.y * v2.y);
    }
    static distance(v1, v2) {
        return Vector2.sub(v1, v2).magnitude;
    }

}*/


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

function Get_RefPoint(from, to) {
	let t2 = Get_Center(to);
	let v2 = Rot_to_Vec(to.rotation, 315);
	let rad2 = Math.atan2(-v2.x, -v2.y);
	let rect = from.getOrientedBoundingRect(),
		lt = { x: rect.leftTop[0], y: rect.leftTop[1] },
		rt = { x: rect.rightTop[0], y: rect.rightTop[1] },
		lb = { x: rect.leftBottom[0], y: rect.leftBottom[1] },
		rb = { x: rect.rightBottom[0], y: rect.rightBottom[1] },
		top = { x: rt.x - lt.x, y: rt.y - lt.y },
		right = { x: rb.x - rt.x, y: rb.y - rt.y },
		bottom = { x: lb.x - rb.x, y: lb.y - rb.y },
		left = { x: lt.x - lb.x, y: lt.y - lb.y };
	let lines = [
		top, right, bottom, left
	]
	let close = 9999;
	let closeNum = -1;
	for (let i = 0; i < 4; i++) {
		let a = new Vector2().Distance(t2, lines[i]);
		if (close > a) {
			close = a;
			closeNum = i;
		}
		/*let a = Vec_Distance(lines[i][0], t2);
		let b = Vec_Distance(lines[i][1], t2);
		let c = Math.abs(a) + Math.abs(b);
		if(c < close){
			close = c;
			closeNum = i;
		}*/
		/*let a = new Vector2(lines[i][0].x, lines[i][0].y);
		let b = new Vector2(lines[i][1].x, lines[i][1].y);
		let cross = Vector2.Cross(a, b);
		console.log(cross);
		if(cross < 0)*/
	}
	console.log(closeNum)
	var p1 = new Vector2(lines[closeNum].x, lines[closeNum].y);
	var p2 = new Vector2(t2.x, t2.y);
	var n = new Vector2().Normal(p1, p2).Normalize();
	var point = Nearest(p1, p2, new Vector2(t2.x, t2.y));
	if (point.Equals(p1) || point.Equals(p2)) {
		return to;
	} else {
		// めり込まないように補正
		return { x: point.x + n.x * 1, y: point.y + n.y * 1 };
		to.x = point.x + n.x * 1;
		to.y = point.y + n.y * 1;
		// 反射ベクトル適用
		var r = Vector2.Reflect({ x: to.dx, y: to.dy }, n);
		to.dx = r.x;
		to.dy = r.y;
	}
};

function Nearest(A, B, P) {
	var a = new Vector2().Subtract(B, A);
	var b = new Vector2().Subtract(P, A);
	// 内積 ÷ |a|^2
	var r = Vector2.Dot(a, b) / a.LengthSquared();
	//var r = Vector2.Dot(a, b) / (a.x * a.x + a.y * a.y);
	if (r <= 0) return A;
	if (r >= 1) return B;
	return new Vector2(A.x + r * a.x, A.y + r * a.y);
}

function Hit_Reflection(from, to) {
	let t1 = Get_Center(from);
	let t2 = Get_Center(to);
	let rect1 = from.getOrientedBoundingRect(),
		lt1 = { x: rect1.leftTop[0], y: rect1.leftTop[1] },
		rt1 = { x: rect1.rightTop[0], y: rect1.rightTop[1] },
		lb1 = { x: rect1.leftBottom[0], y: rect1.leftBottom[1] },
		rb1 = { x: rect1.rightBottom[0], y: rect1.rightBottom[1] },
		top1 = { x: rt1.x - lt1.x, y: rt1.y - lt1.y },
		right1 = { x: rb1.x - rt1.x, y: rb1.y - rt1.y },
		bottom1 = { x: lb1.x - rb1.x, y: lb1.y - rb1.y },
		left1 = { x: lt1.x - lb1.x, y: lt1.y - lb1.y };
	let rect2 = to.getOrientedBoundingRect(),
		lt2 = { x: rect2.leftTop[0], y: rect2.leftTop[1] },
		rt2 = { x: rect2.rightTop[0], y: rect2.rightTop[1] },
		lb2 = { x: rect2.leftBottom[0], y: rect2.leftBottom[1] },
		rb2 = { x: rect2.rightBottom[0], y: rect2.rightBottom[1] },
		top2 = { x: rt2.x - lt2.x, y: rt2.y - lt2.y },
		right2 = { x: rb2.x - rt2.x, y: rb2.y - rt2.y },
		bottom2 = { x: lb2.x - rb2.x, y: lb2.y - rb2.y },
		left2 = { x: lt2.x - lb2.x, y: lt2.y - lb2.y };
	let boundWidth = 0,
		boundHeight = 0;
	if (dx < 0) { boundWidth = right1.x - left2.x; } //dx = 負の値ならこのアクターが左側。自分の右端から、相手の左端を引いた値が重なりの幅。
	else if (dx > 0) { boundWidth = right2.x - left1.x; } //dx = 正の値ならこのアクターが右側。相手の右端から、自分の左端を引いた値が重なりの幅。
	if (dy < 0) { boundHeight = bottom1.y - top2.y; } //dy = 負の値ならこのアクターが上側。自分の下端から、相手の上端を引いた値が重なりの高さ。
	else if (dy > 0) { boundHeight = bottom2.y - top1.y; } //dy = 正の値ならこのアクターが下側。相手の下端から、自分の上端を引いた値が重なりの高さ。
	if (boundWidth <= boundHeight + 3) { // 横の重なりより縦の重なりが大きいなら、横の衝突。誤差3ピクセルまで許容
		if (dx < 0) { this._velocityX += -speed; } // dx = 負の値ならこのアクターが左側。左にバウンス
		else if (dx > 0) { this._velocityX += speed; } // dx = 正の値ならこのアクターが右側。右にバウンス。
	}
	if (boundHeight <= boundWidth + 3) { // 縦の重なりより横の重なりが大きいなら、縦の衝突。誤差3ピクセルまで許容
		if (dy < 0) { this._velocityY += -speed; } // dy = 負の値ならこのアクターが上側、上にバウンス
		else if (dy > 0) { this._velocityY += speed; } // dy = 正の値ならこのアクターが下側、下にバウンス
	}
	return;
}

function Vec_to_Rot(from, to) {
	let rad = Vec_to_Rad({ x: from.x - to.x, y: from.y - to.y });
	let rot = Rad_to_Rot(rad);
	if (Math.abs(rot) >= 360) {
		rot = rot % 360;
	}
	if (rot < 0) {
		rot = 360 + rot;
	}

	return rot;
	//return Math.atan2((from.x - to.x), (from.y - to.y)) * (180 / Math.PI);
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
        if (angle >= range[0] && angle <= range[1]) {
            const backup = arr.slice();
            arr = arr.filter(i => !remove.includes(i));
            if (arr.length === 0) arr = backup;
            break;
        }
    }

    // カテゴリ11の障害物チェック
    if (from.category === 11) {
        const grid = JSON.parse(JSON.stringify(now_scene.grid));
        const rad = (from.rotation - 90) * Math.PI / 180;
        const tx = t1.x - Math.cos(rad) * from.width;
        const ty = t1.y - Math.sin(rad) * from.height;
        const y = Math.floor(ty / PixelSize);
        const x = Math.floor(tx / PixelSize);

        const obstacleDirs = [
            [y - 1, x, 0],     // 上
            [y, x + 1, 1],     // 右
            [y + 1, x, 2],     // 下
            [y, x - 1, 3],     // 左
            [y - 1, x + 1, 4], // 右上
            [y + 1, x + 1, 5], // 右下
            [y + 1, x - 1, 6], // 左下
            [y - 1, x - 1, 7]  // 左上
        ];

        const obstacles = obstacleDirs
            .filter(([yy, xx]) => grid[yy]?.[xx] === 'Obstacle')
            .map(([, , dir]) => dir);

        const backup = arr.slice();
        arr = arr.filter(i => !obstacles.includes(i));
        if (arr.length === 0) arr = backup;
    }

    // 候補に value がなければランダム選択
    if (!arr.includes(value)) {
        value = arr[Math.floor(Math.random() * arr.length)];
    }

    return value;
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

function circleHit(a, b) {
	const ax = a.x + a.width / 2;
	const ay = a.y + a.height / 2;
	const bx = b.x + b.width / 2;
	const by = b.y + b.height / 2;
	const dx = ax - bx;
	const dy = ay - by;
	const r = (a.width / 2) + (b.width / 2);
	return dx * dx + dy * dy <= r * r;
}

function reflectVector(v, normal) {
    const dot = v.x * normal.x + v.y * normal.y;
    return {
        x: v.x - 2 * dot * normal.x,
        y: v.y - 2 * dot * normal.y
    };
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
 * バーチャルパッド
 ******************************************************/
class Vpad {
	constructor(input) {
		this.input = input; //InputManagerのinput
		this.resizePad();

		// リサイズイベントの登録
		if (navigator.userAgent.match(/iPhone/)) {
			window.addEventListener('orientationchange', () => {
				this.resizePad();
			});
		} else {
			window.addEventListener('resize', () => {
				this.resizePad();
			});
		}
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
		pad.style.width = PixelSize * Stage_W / 2;
		pad.style.display = styleDisplay;

		//タッチで拡大とか起こるのを防ぐ
		pad.addEventListener("touchstart", (e) => {
			e.preventDefault();
		});
		pad.addEventListener("touchmove", (e) => {
			e.preventDefault();
		});

		//横長の場合位置変更
		if (navigator.userAgent.match(/iPhone/)) {
			let _orientation = getOrientation(screen, window);
			if (_orientation === "landscape-primary" || _orientation === "landscape-secondary" || _orientation === "landscape") {
				pad.style.width = `${window.innerWidth}px`;
				pad.style.position = "absolute"; //画面の上にかぶせるため
				pad.style.backgroundColor = "transparent"; //透明
				//pad.style.bottom = "0px"; //下に固定
				pad.style.top = `${window.innerHeight - (Number(PixelSize * Stage_H / 2.65) * 0.5)}px`; //下に固定
				document.addEventListener('touchmove', noscroll, { passive: false });
				document.addEventListener('wheel', noscroll, { passive: false });
			} else {
				document.removeEventListener('touchmove', noscroll);
				document.removeEventListener('wheel', noscroll);
			}
			//console.log(_orientation)
		} else {
			if (window.innerWidth > window.innerHeight) {
				pad.style.width = `${window.innerWidth}px`;
				pad.style.position = "absolute"; //画面の上にかぶせるため
				pad.style.backgroundColor = "transparent"; //透明
				pad.style.bottom = "0px"; //下に固定
			}
		}

		const height = Number(PixelSize * Stage_H / 2.65) * 0.5; //ゲーム画面の半分の高さをゲームパッドの高さに
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

(function() {

    const FIXED_FPS = 60;
    const FIXED_DT = 1000 / FIXED_FPS;
    const MAX_ACCUM = 200;

    enchant.Core.prototype.enableFixedLoop = function() {
        const core = this;

        // enchant.js の内部ループを完全停止
        core._requestNextFrame = function() {};

        let accumulator = 0;
        let lastTime = performance.now();

        // 補間用：前フレーム位置を保存
        function storePrevPositions(scene) {
            scene.childNodes.forEach(node => {
                node._prevX = node.x;
                node._prevY = node.y;
            });
        }

        // DOM 版用：補間描画
        function renderInterpolated(scene, alpha) {
            scene.childNodes.forEach(node => {
                if (node._prevX !== undefined && node._element) {

                    const drawX = node._prevX + (node.x - node._prevX) * alpha;
                    const drawY = node._prevY + (node.y - node._prevY) * alpha;

                    // DOM 版の描画は transform を使う
                    node._element.style.transform =
                        'translate(' + drawX + 'px,' + drawY + 'px)';
                }
            });
        }

        // 固定ロジック＋補間描画ループ
        core._fixedTick = function() {
            const now = performance.now();
            const delta = now - lastTime;
            lastTime = now;

            accumulator += delta;
            if (accumulator > MAX_ACCUM) {
                accumulator = FIXED_DT;
            }

            const scene = core.currentScene;

            if (scene) {
                storePrevPositions(scene);
            }

            // 固定ロジック更新（60fps）
            while (accumulator >= FIXED_DT) {
                core._tick(); // enchant.js のロジック更新
                accumulator -= FIXED_DT;
            }

            const alpha = accumulator / FIXED_DT;

            // DOM 版の補間描画
            if (scene) {
                renderInterpolated(scene, alpha);
            }

            requestAnimationFrame(core._fixedTick);
        };

        requestAnimationFrame(core._fixedTick);
    };

})();

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
	game.enableFixedLoop();

	inputManager = new InputManager();

	let vh = (window.innerHeight / ((PixelSize * Stage_H)));
	if (window.innerWidth < game.width * vh) {
		vh = (window.innerWidth / ((PixelSize * Stage_W) + 128));
	}
	game.scale = vh;
	//game.scale = (window.innerHeight / ((PixelSize * Stage_H) + 32));

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
			/*now_scene.backgroundMap.collisionData[this.tilePath.y][this.tilePath.x] = 0;
			now_scene.grid[this.tilePath.y][this.tilePath.x] = 'Empty';
			this.obs.forEach(elem => {
				now_scene.removeChild(elem);
			});
			//this.ref.forEach(elem => {
				//now_scene.removeChild(elem);
			//});
			this.frontimage._Destroy();
			this.topimage._Destroy();
			new BlockDestroyEffect(this.tilePath.x, this.tilePath.y);
			this.destroy();
			//now_scene.removeChild(this);*/
			scheduleCollisionUpdate(this.tilePath.x, this.tilePath.y, 0);
			now_scene.grid[this.tilePath.y][this.tilePath.x] = 'Empty';

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
			//obstacle.push(this)
			//this.backgroundColor = "#0004";
			this.x = x * PixelSize;
			this.y = y * PixelSize - Quarter;
			//new HoleImage(2, this.x, this.y, scene);
			//new HoleImage(1, this.x, this.y, scene);
			this.image = createHoleSurface();

			scene.addChild(this);
		}
	});

	var HoleImage = Class.create(Sprite, {
		initialize: function(val, x, y, scene) {
			Sprite.call(this, (Quarter * (4 - val)), (Quarter * (4 - val)));
			this.backgroundColor = "#0008";
			this.x = x + ((Quarter / 2) * val);
			this.y = y + ((Quarter / 2) * val);
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
			if(DebugFlg) this.debugColor= 'orange';
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

	function BlockRef(from) {
		var arr = [];

		arr.push(new RefObstracle('RefTop', now_scene));
		arr.push(new RefObstracle('RefBottom', now_scene));
		arr.push(new RefObstracle('RefLeft', now_scene));
		arr.push(new RefObstracle('RefRight', now_scene));

		arr[0].moveTo(from.x + 4, from.y);
		arr[1].moveTo(from.x + 4, from.y + 56);
		arr[2].moveTo(from.x, from.y + 4);
		arr[3].moveTo(from.x + 56, from.y + 4);

		return arr;
	}

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
			this.x = area.x - 6.5;
			this.y = area.y - 41.5;
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
			this.scaleX = 0.675
			this.scaleY = 0.675
			this.originX = 36;
			this.originY = 72;
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
			}else{
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

	/*var RefAim = Class.create(Sprite, {
		initialize: function(ref, from, category, num) {
			Sprite.call(this, 8, 8);
			this.time = 0;
			this.category = category;
			this.num = num;
			this.ref = ref;
			this.hitTime = 0;
			if (DebugFlg) this.debugColor = 'orange';
			this.visible = false;

			this.originX = 4;
			this.originY = 4;

			const lists = RefAim.collection
				.filter(elem => elem.num == this.num);
			const percent = this.category == 6 ? lists.length % 3 == 0 : lists.length % 2;

			const fc = Get_Center(from);
			this.rad = Rot_to_Rad(from.rotation - 90);
			this.dx = Math.cos(this.rad) * 20;
			this.dy = Math.sin(this.rad) * 20;
			this.agl = from.rotation;
			this.tgt = [fc.x + this.dx * 3, fc.y + this.dy * 3];
			this.rotation = (315 + Math.atan2(this.dx, this.dy) * 180 / Math.PI) * -1;

			this.moveTo(fc.x + 36 * Math.cos(this.rad) - this.width / 2, fc.y + 36 * Math.sin(this.rad) - this.height / 2);

			if(percent) {
				this.x += this.dx/2;
				this.y += this.dy/2;
			}

			const self = this;

			this.onenterframe = function () {
				if (!WorldFlg) return;

				self.time++;
				self.x += self.dx;
				self.y += self.dy;

				// 衝突チェック：RefObstracle
				RefObstracle.intersectStrict(self).some(elem => {
					self.handleCollision(elem);
					return true;
				});

				// 衝突チェック：TankBase
				TankBase.intersectStrict(self).forEach(elem => {
					if (elem.num !== 0) {
						now_scene.removeChild(self);
					}
				});

				// 生存時間と反射回数のチェック
				if (self.time > 150 || self.ref < 0) {
					now_scene.removeChild(self);
				}
			};

			this.handleCollision = function (elem) {
				const v = Rot_to_Vec(self.rotation, 315);
				const f = Math.atan2(v.x, v.y);
				const midX = self.x + self.width / 2;
				const midY = self.y + self.height / 2;

				const isMaxRef = self.ref === Categorys.MaxRef[category];

				switch (elem.name) {
					case 'RefTop':
						if (isMaxRef) {
							self.tgt = [midX - Math.cos(f) * (elem.y - ((self.y - 1) + (self.height + 2))), elem.y - 2.5];
						}
						self.x -= Math.cos(f) * (elem.y - (self.y + self.height));
						self.y = elem.y - self.height;
						self.dy *= -1;
						break;

					case 'RefBottom':
						if (isMaxRef) {
							self.tgt = [midX - Math.cos(f) * (((self.y - 1) - (self.height + 2) / 2) - (elem.y + elem.height)), elem.y + elem.height + 2.5];
						}
						self.x -= Math.cos(f) * ((self.y - self.height / 2) - (elem.y + elem.height));
						self.y = elem.y + elem.height;
						self.dy *= -1;
						break;

					case 'RefLeft':
						if (isMaxRef) {
							self.tgt = [elem.x - 2.5, midY - Math.sin(f) * (((self.x - 1) + (self.width + 2)) - elem.x)];
						}
						self.y -= Math.sin(f) * ((self.x + self.width) - elem.x);
						self.x = elem.x - self.width;
						self.dx *= -1;
						break;

					case 'RefRight':
						if (isMaxRef) {
							self.tgt = [elem.x + elem.width + 2.5, midY - Math.sin(f) * ((elem.x + elem.width) - ((self.x - 1) + (self.width + 2)))];
						}
						self.y -= Math.sin(f) * ((elem.x + elem.width) - (self.x + self.width));
						self.x = elem.x + elem.width;
						self.dx *= -1;
						break;
				}

				self.ref--;
				self.rotation = (315 + Math.atan2(self.dx, self.dy) * 180 / Math.PI) * -1;
				if(percent) {
					self.x += self.dx/2;
					self.y += self.dy/2;
				}
			};

			now_scene.addChild(this);
		}
	});*/

	var RefAim = Class.create(Sprite, {
		initialize: function (ref, from, category, num) {
			Sprite.call(this, 8, 8);

			this.time = 0;
			this.category = category;
			this.num = num;
			this.ref = ref;
			this.hitTime = 0;
			this.visible = false;

			if (DebugFlg) this.debugColor = 'orange';

			this.originX = 4;
			this.originY = 4;

			// --- 前処理の最適化 ---
			const lists = RefAim.collection.filter(e => e.num === num);
			const percent = category == 6 ? lists.length % 3 === 0 : lists.length % 2 === 1;

			const fc = Get_Center(from);
			const baseRot = from.rotation - 90;
			const rad = Rot_to_Rad(baseRot);

			const cos = Math.cos(rad);
			const sin = Math.sin(rad);

			this.dx = cos * 20;
			this.dy = sin * 20;
			this.agl = from.rotation;

			this.tgt = [fc.x + this.dx * 3, fc.y + this.dy * 3];
			this.rotation = normalizeRotation((315 + Math.atan2(this.dx, this.dy) * 180 / Math.PI) * -1);

			this.moveTo(
				fc.x + 36 * cos - this.width / 2,
				fc.y + 36 * sin - this.height / 2
			);

			if (percent) {
				this.x += this.dx / 2;
				this.y += this.dy / 2;
			}

			// --- onenterframe ---
			this.onenterframe = () => {
				if (!WorldFlg) return;

				this.time++;

				// 2 ステップ移動
				for (let i = 0; i < 2; i++) {
					this.x += this.dx / 2;
					this.y += this.dy / 2;

					// RefObstracle 衝突
					const hit = RefObstracle.intersectStrict(this).find(e => true);
					if (hit) {
						this.handleCollision(hit, percent);
						break;
					}
				}

				// TankBase 衝突
				if (this.num !== 0) {
					const hit = TankBase.intersectStrict(this);
					if (hit.length > 0) {
						if (hit[0].num !== 0) {
							now_scene.removeChild(this);
						}
					}
				}


				// 生存時間 or 反射回数
				if (this.time > 150 || this.ref < 0) {
					now_scene.removeChild(this);
				}
			};

			// --- 衝突処理 ---
			this.handleCollision = (elem, percent) => {
				const v = Rot_to_Vec(this.rotation, 315);
				const f = Math.atan2(v.x, v.y);

				const midX = this.x + this.width / 2;
				const midY = this.y + this.height / 2;

				const isMaxRef = this.ref === Categorys.MaxRef[this.category];

				switch (elem.name) {
					case 'RefTop':
						if (isMaxRef) {
							this.tgt = [
								midX - Math.cos(f) * (elem.y - (this.y - 1 + this.height + 2)),
								elem.y - 2.5
							];
						}
						this.x -= Math.cos(f) * (elem.y - (this.y + this.height));
						this.y = elem.y - this.height;
						this.dy = -this.dy;
						break;

					case 'RefBottom':
						if (isMaxRef) {
							this.tgt = [
								midX - Math.cos(f) * (((this.y - 1) - (this.height + 2) / 2) - (elem.y + elem.height)),
								elem.y + elem.height + 2.5
							];
						}
						this.x -= Math.cos(f) * ((this.y - this.height / 2) - (elem.y + elem.height));
						this.y = elem.y + elem.height;
						this.dy = -this.dy;
						break;

					case 'RefLeft':
						if (isMaxRef) {
							this.tgt = [
								elem.x - 2.5,
								midY - Math.sin(f) * (((this.x - 1) + (this.width + 2)) - elem.x)
							];
						}
						this.y -= Math.sin(f) * ((this.x + this.width) - elem.x);
						this.x = elem.x - this.width;
						this.dx = -this.dx;
						break;

					case 'RefRight':
						if (isMaxRef) {
							this.tgt = [
								elem.x + elem.width + 2.5,
								midY - Math.sin(f) * ((elem.x + elem.width) - ((this.x - 1) + (this.width + 2)))
							];
						}
						this.y -= Math.sin(f) * ((elem.x + elem.width) - (this.x + this.width));
						this.x = elem.x + elem.width;
						this.dx = -this.dx;
						break;
				}

				this.ref--;

				// 反射後の角度更新
				this.rotation = (315 + Math.atan2(this.dx, this.dy) * 180 / Math.PI) * -1;

				if (percent) {
					this.x += this.dx / 2;
					this.y += this.dy / 2;
				}
			};

			now_scene.addChild(this);
		}
	});

	var PlayerRefAim = Class.create(Sprite, {
		initialize: function(ref, from, to, category, num) {
			Sprite.call(this, 8, 8);
			this.time = 0;
			this.category = category;
			this.num = num;
			this.ref = ref;
			this.hitTime = 0;
			if (DebugFlg) this.debugColor = 'orange';

			if (num == 0){
				this.image = PlayerRefAimSurfaceCache;
			}
			else{
				this.visible = false;
			}
			
			this.originX = this.originY = 4;

			const fc = Get_Center(from);
			this.vector = Pos_to_Vec(from, to);
			this.rad = Vec_to_Rad(this.vector);

			// 回転方向補正
			const targetRot = normalizeRotation(this.rad);
			const sa = normalizeAngle(from.rotation - targetRot);
			const speed = Categorys.CannonRotSpeed[category];

			let resultRot = from.rotation;
			if (Math.abs(sa) >= speed) {
				resultRot += (sa > 0 ? -speed : speed);
			} else {
				resultRot = targetRot;
			}
			from.rotation = normalizeRotationBy360(resultRot);

			this.rad = Rot_to_Rad(from.rotation - 90);
			this.dx = Math.cos(this.rad) * 20;
			this.dy = Math.sin(this.rad) * 20;
			this.rotation = (315 + Math.atan2(this.dx, this.dy) * 180 / Math.PI) * -1;

			this.moveTo(
				fc.x + 36 * Math.cos(this.rad) - this.width / 2,
				fc.y + 36 * Math.sin(this.rad) - this.height / 2
			);

			this.onenterframe = () => {
				if (!WorldFlg) return;
				this.time++;
				this.x += this.dx;
				this.y += this.dy;

				RefObstracle.intersectStrict(this).some(elem => {
					handleReflection.call(this, elem);
					return true;
				});
				/*Wall.intersectStrict(this).some(elem => {
					handleReflection.call(this, elem);
					return true;
				});
				Block.intersectStrict(this).some(elem => {
					handleReflection.call(this, elem);
					return true;
				});*/

				if (tankEntity[this.num]?.intersectStrict(this)) {
					now_scene.removeChild(this);
				}

				TankBase.intersectStrict(this).forEach(elem => {
					if (elem.num !== 0) now_scene.removeChild(this);
				});

				if (this.time > 150 || this.ref < 0) {
					now_scene.removeChild(this);
				}
			};

			now_scene.addChild(this);

			// 🔧 内部補助関数

			function normalizeRotation(rad) {
				let deg = Rad_to_Rot(rad);
				return normalizeRotationBy360(deg);
			}

			function normalizeRotationBy360(rot) {
				rot %= 360;
				return (rot < 0) ? rot + 360 : rot;
			}

			function getCollisionSide(ray, wall) {
				const rayCenterX = ray.x + ray.width / 2;
				const rayCenterY = ray.y + ray.height / 2;
				const wallCenterX = wall.x + wall.width / 2;
				const wallCenterY = wall.y + wall.height / 2;

				const dx = rayCenterX - wallCenterX;
				const dy = rayCenterY - wallCenterY;

				const absDX = Math.abs(dx);
				const absDY = Math.abs(dy);
				const overlapX = (ray.width + wall.width) / 2;
				const overlapY = (ray.height + wall.height) / 2;

				if (absDX < overlapX && absDY < overlapY) {
					// 進行方向ベースの優先判定
					const vx = ray.dx;
					const vy = ray.dy;

					if (absDX > absDY) {
						if (dx > 0) {
							return (vx < 0) ? 'right' : 'left';
						} else {
							return (vx > 0) ? 'left' : 'right';
						}
					} else {
						if (dy > 0) {
							return (vy < 0) ? 'bottom' : 'top';
						} else {
							return (vy > 0) ? 'top' : 'bottom';
						}
					}
				}
				return null;
			}

			function getPreContactPosition(ray, wall, side, margin = 1) {
				const rx = ray.x;
				const ry = ray.y;
				const rw = ray.width;
				const rh = ray.height;

				const wx = wall.x;
				const wy = wall.y;
				const ww = wall.width;
				const wh = wall.height;

				switch (side) {
					case 'top':
						return {
							x: rx,
							y: wy - rh - margin
						};
					case 'bottom':
						return {
							x: rx,
							y: wy + wh + margin
						};
					case 'left':
						return {
							x: wx - rw - margin,
							y: ry
						};
					case 'right':
						return {
							x: wx + ww + margin,
							y: ry
						};
					default:
						return { x: rx, y: ry }; // fallback: 現在位置
				}
			}


			function handleReflection(elem) {
				/*const side = getCollisionSide(this, elem);
				if(side){
					if(side == 'top' || side == 'bottom'){
						this.dy *= -1;
					}else if(side == 'left' || side == 'right'){
						this.dx *= -1;
					}
					const safePos = getPreContactPosition(this, elem, side, 1);
    				this.moveTo(safePos.x, safePos.y);
				}*/
				
				const v = Rot_to_Vec(this.rotation, 315);
				const f = Math.atan2(v.x, v.y);
				const hw = this.width, hh = this.height;

				switch (elem.name) {
					case 'RefTop':
						this.x -= Math.cos(f) * (elem.y - (this.y + hh));
						this.y = elem.y - hh;
						this.dy *= -1;
						break;
					case 'RefBottom':
						this.x -= Math.cos(f) * ((this.y - hh / 2) - (elem.y + elem.height));
						this.y = elem.y + elem.height;
						this.dy *= -1;
						break;
					case 'RefLeft':
						this.y -= Math.sin(f) * ((this.x + hw) - elem.x);
						this.x = elem.x - hw;
						this.dx *= -1;
						break;
					case 'RefRight':
						this.y -= Math.sin(f) * ((elem.x + elem.width) - (this.x + hw));
						this.x = elem.x + elem.width;
						this.dx *= -1;
						break;
				}
				this.ref--;
				this.rotation = (315 + Math.atan2(this.dx, this.dy) * 180 / Math.PI) * -1;
			}
		}
	});

	/* 照準クラス */
	var RefCursor = Class.create(Sprite, {
		initialize: function(from, scene) {
			Sprite.call(this, 4, 4);
			//if(DebugFlg)this.backgroundColor = "white";
			this.num = from.num;
			this.moveTo(from.x + (from.width / 2), from.y + (from.height / 2))
			this.time = 0;
			scene.addChild(this);
		}
	})

	var BulAim = Class.create(Sprite, {
		initialize: function(from) {
			Sprite.call(this, 8, 8);

			this.time = 0;
			this.target = from;
			this.num = from.num;
			this.id = from.id;
			this.visible = false;

			const rad = Rot_to_Rad(from.rotation - 90);
			const dx = Math.cos(rad) * 24;
			const dy = Math.sin(rad) * 24;

			const centerX = from.x + from.width / 2;
			const centerY = from.y + from.height / 2;

			this.moveTo(centerX - this.width / 2 + Math.cos(rad), centerY - this.height / 2 + Math.sin(rad));

			const self = this;

			this.onenterframe = function () {
				if (!WorldFlg) return;

				self.x += dx;
				self.y += dy;

				if (!bulStack[self.num][self.id]) {
					now_scene.removeChild(self);
					return;
				}

				const groups = [Wall, Block, TankBase];
				for (const group of groups) {
					if (group.intersectStrict(self).length > 0) {
						now_scene.removeChild(self);
						break;
					}
				}
			};

			now_scene.addChild(this);
		}
	});


	var PlayerBulAim = Class.create(Sprite, {
		initialize: function(from) {
			Sprite.call(this, 8, 8);

			this.time = 0;
			this.target = from;
			this.num = from.num;
			this.id = from.id;
			this.visible = false;

			const rad = Rot_to_Rad(from.rotation - 90);
			const dx = Math.cos(rad) * 24;
			const dy = Math.sin(rad) * 24;

			const centerX = from.x + from.width / 2;
			const centerY = from.y + from.height / 2;

			this.moveTo(centerX - this.width / 2 + Math.cos(rad), centerY - this.height / 2 + Math.sin(rad));

			const self = this;

			this.onenterframe = function () {
				if (!WorldFlg) return;

				self.x += dx;
				self.y += dy;

				if (!bulStack[self.num][self.id]) {
					now_scene.removeChild(self);
					return;
				}

				const groups = [Wall, Block, TankBase];
				for (const group of groups) {
					if (group.intersectStrict(self).length > 0) {
						now_scene.removeChild(self);
						break;
					}
				}
			};

			now_scene.addChild(this);
		}
	});

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

			let wasHit = false;   // 前フレームで当たっていたか
			let hitTime = 0;      // 接触継続フレーム数

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
						this.num === 0 ? new PlayerBulAim(this) : new BulAim(this);
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
						//elem._Damage();
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
						this.num === 0 ? new PlayerBulAim(this) : new BulAim(this);
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
			/*const ex = this.x + this.width / 2;
			const ey = this.y + this.height / 2;*/

			if (gameStatus === 0) {
				//game.assets['./sound/Sample_0000.wav'].clone().play();
				let sound = game.assets['./sound/mini_bomb2.mp3'].clone();
				sound.play();
				sound.volume = 0.2;
			}

			new TouchFire(this);
			Spark_Effect(this);
			new BulletExplosion(this);

			/*const range = 48;
			TankBase.collection.forEach(t => {
				if (!deadFlgs[t.num]) {
					const d = Vec_Distance(Get_Center(t), {x:ex, y:ey});
					if (d < range) t._Damage();
				}
			});*/

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
						if (this.time > 555 || tankEntity.some(e => this.within(e, 120))) {
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

	var Explosion = Class.create(Sprite, {
		initialize: function(from) {
			Sprite.call(this, 100, 100);
			this.backgroundColor = "red";
			this.time = 0;
			var value = 1.0;
			this.opacity = value;
			this.moveTo((from.x + from.width / 2) - this.width / 2, (from.y + from.height / 2) - this.height / 2);

			this.onenterframe = function() {
				if (WorldFlg) {
					this.time++;
					this.rotation += 45;
					if (this.time % 2 == 0) {
						value -= 0.05;
						this.opacity = value;
					}
					if (value < 0.1) now_scene.removeChild(this);
				}

			}
			now_scene.addChild(this);
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
			//let cnt = 0;
			Block.collection.forEach(elem => {
				if (elem.within(this, 125)){
					elem._Destroy();
					//cnt++;
				}
			});
			/*if(cnt > 0){
				const children = now_scene.childNodes.slice().filter(child => child instanceof RefObstracle); // enchant.jsでは childNodes は配列風
				children.forEach(child => {
					now_scene.removeChild(child);
				});
				SetRefs(now_scene, now_scene.backgroundMap.collisionData);
			}*/
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
				elem.life = 0;
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
					if (this.time < 1) this.processDamage();
					this.time++;
				}
			};

			now_scene.addChild(this);
		},

		// ★ 爆発範囲は半径40（80×80）
		processDamage: function() {
			const range = 55;
			this.damageNearbyTanks(range);
			this.destroyNearbyBlocks(range + 5);
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
			let damage = 1;
			const targets = TankBase.collection
				.filter(elem => !deadFlgs[elem.num] && elem.weak.within(this, range))
				.sort((a, b) => b.num - a.num);

			let cnt = 0;
			targets.forEach(elem => {
				if (!elem.damFlg){
					if (elem.num != 0) cnt++;
					if (elem.num == 0 && destruction + cnt == tankEntity.length - 1) return;

					elem.life -= damage;
					elem.damFlg = true;
					elem._DamageEffect();
					if (elem.category >= 12){
						elem._ResetStatus();
					}
				}
			});
		}
	});

	/*var BombExplosion = Class.create(Sprite, {
		initialize: function(from) {
			Sprite.call(this, 200, 200);

			this.name = 'BombExplosion';
			this.time = 0;
			this.opacity = 1.0;
			this.backgroundColor = 'red';

			const center = Get_Center(from);
			this.moveTo(center.x - this.width / 2, center.y - this.height / 2);

			now_scene.addChild(this);

			this.onenterframe = () => {
				if (!WorldFlg) return;

				this.rotation += 45;

				if (this.time % 2 === 0) {
					this.opacity = Math.max(0, this.opacity - 0.1);
				}

				if (this.opacity <= 0 && this.time > 20) {
					this.moveTo(-1000, -1000);
					now_scene.removeChild(this);
					return;
				}

				if (this.time < 4) this.applyExplosionEffects();
				this.time++;
			};
		},

		applyExplosionEffects: function() {
			const range = 125;

			Block.collection.forEach(block => {
				if (block.within(this, range)) block._Destroy();
			});

			this.intersectStrict(Bom).forEach(bom => bom._Destroy());

			if (this.time === 0) {
				TankBase.collection.forEach(tank => {
					if (!deadFlgs[tank.num] && tank.weak.within(this, range)) {
						tank.life = 0;
					}
				});
			}
		}
	});*/


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
			this.originX = 20;
			this.originY = 20;
			this.rotation = 0;

			if (DebugFlg) this.debugColor = "yellow";

			this.moveTo(from.x, from.y);

			this.onenterframe = () => {
				if (!WorldFlg || deadFlgs[this.num] || from.attackTarget == null) return;

				const target = from.attackTarget;
				const rad = (target.rotation - 90) * Math.PI / 180;
				const scale = target.name === 'Entity' ? 0.25 : 0.8;
				const dx = Math.cos(rad) * (target.width * scale);
				const dy = Math.sin(rad) * (target.height * scale);

				// 追尾の見た目回転
				this.rotation = -1 * (45 + Math.atan2(dx, dy) * 180 / Math.PI);

				// ターゲットと接触していれば予測位置に移動
				if (this.intersectStrict(target)) {
					const px = target.x + target.width / 2 + dx - this.width / 2;
					const py = target.y + target.height / 2 + dy - this.height / 2;
					this.moveTo(px, py);
				} else {
					// 徐々に近づく追尾処理
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

	/*var Fire = Class.create(Sprite, {
		initialize: function(from) {
			Sprite.call(this, 12, 12);
			this.backgroundColor = "#f20";
			this.time = 0;
			let value = 0.8;
			if (from.from.shotSpeed > 20) {
				this.backgroundColor = "#8cf";
				value = 1.0;
			}
			this.opacity = value;

			let rad = Rot_to_Rad(from.rotation + 90);
			let dx = Math.cos(rad) * (9);
			let dy = Math.sin(rad) * (9);
			this.rotation = from.rotation;
			let f = Get_Center(from);
			this.moveTo((f.x - this.width / 2) + dx, (f.y - this.height / 2) + dy);

			this.onenterframe = function() {
				if (WorldFlg) {
					this.time++
					value -= 0.1;
					this.opacity = value;
					if (value < 0.1) now_scene.FireGroup.removeChild(this);
				}
			}
			now_scene.FireGroup.addChild(this);
		}
	})*/
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

	var InterceptAround = Class.create(Sprite, {
		initialize: function(from) {
			Sprite.call(this, 96, 96);
			//this.backgroundColor = "#0ff2";
			this.rotation = 45;
			this.onenterframe = function() {
				let f = Get_Center(from);
				//this.moveTo(area.x - 48 + 32, area.y - 48 + 30);
				this.moveTo(f.x - this.width / 2, f.y - this.height / 2);
			}
			now_scene.addChild(this);
		}
	});

	var InterceptFront = Class.create(Sprite, {
		initialize: function(from) {
			Sprite.call(this, 8, from.height / 2);
			//this.backgroundColor = "#0f04";

			let rad;
			this.onenterframe = function() {
				rad = Rot_to_Rad(from.rotation + 90);
				this.moveTo((from.x + (from.width / 2) - this.width / 2) + Math.cos(rad) * (-from.height / 4), (from.y + (from.height / 2) - this.height / 2) + Math.sin(rad) * (-from.height / 4));
				this.rotation = from.rotation;
			}
			now_scene.addChild(this);
		}
	});

	//	経路探索アルゴリズム
	/*const deltas = {
		North: [-1, 0],
		East: [0, 1],
		South: [1, 0],
		West: [0, -1]
	};

	const findShortestPath = (startCoordinates, grid, scene) => {
		const [startTop, startLeft] = startCoordinates;
		const queue = [{
			distanceFromTop: startTop,
			distanceFromLeft: startLeft,
			parent: null,
			move: null,
			status: 'Start'
		}];

		const visited = new Set();
		const key = (r, c) => `${r},${c}`;
		visited.add(key(startTop, startLeft));

		const directions = ['North', 'East', 'South', 'West'];

		while (queue.length > 0) {
			const currentLocation = queue.shift();

			for (const direction of directions) {
			const newLocation = exploreInDirection(currentLocation, direction, grid, scene, visited);
			if (!newLocation) continue;

			if (newLocation.status === 'Goal') {
				return reconstructPath(newLocation);
			}

			if (newLocation.status === 'Valid') {
				queue.push(newLocation);
			}
			}
		}

		return false; // 経路が見つからなかった
	};

	const locationStatus = (location, grid) => {
		const { distanceFromTop: dft, distanceFromLeft: dfl } = location;
		const rows = grid.length;
		const cols = grid[0].length;

		if (dft < 0 || dft >= rows || dfl < 0 || dfl >= cols) return 'Invalid';
		if (grid[dft][dfl] === 'Goal') return 'Goal';
		if (grid[dft][dfl] === 'Empty') return 'Valid';
		return 'Blocked';
	};

	const exploreInDirection = (currentLocation, direction, grid, scene, visited) => {
		const { distanceFromTop: dft, distanceFromLeft: dfl } = currentLocation;
		const [deltaT, deltaL] = deltas[direction];
		const newTop = dft + deltaT;
		const newLeft = dfl + deltaL;
		const locKey = `${newTop},${newLeft}`;

		if (visited.has(locKey)) return null;

		const newLocation = {
			distanceFromTop: newTop,
			distanceFromLeft: newLeft,
			parent: currentLocation,
			move: direction,
			status: 'Unknown'
		};

		newLocation.status = locationStatus(newLocation, grid);

		if (newLocation.status === 'Valid' || newLocation.status === 'Goal') {
			visited.add(locKey);
			return newLocation;
		}

		return null;
		};

		const reconstructPath = (node) => {
		const path = [];
		while (node.parent) {
			path.unshift(node.move);
			node = node.parent;
		}
		return path;
	};*/
	/*const deltas = {
		North: [-1, 0],
		East: [0, 1],
		South: [1, 0],
		West: [0, -1]
	};

	const key = (r, c) => `${r},${c}`;

	// 視線が通るかどうかを判定（Bresenhamの直線アルゴリズム）
	const isVisible = (from, to, grid) => {
		let [y0, x0] = from;
		const [y1, x1] = to;

		let dx = Math.abs(x1 - x0);
		let dy = Math.abs(y1 - y0);
		let sx = x0 < x1 ? 1 : -1;
		let sy = y0 < y1 ? 1 : -1;
		let err = dx - dy;

		let x = x0;
		let y = y0;

		while (true) {
			if (x === x1 && y === y1) break;

			if (y > grid.length - 1) y = grid.length - 1;
			if (x > grid[y].length - 1) x = grid[y].length - 1;

			if (grid[y][x] === 'Obstacle') {
				return false; // 障害物に当たったら即失敗
			}

			const e2 = 2 * err;
			if (e2 > -dy) {
				err -= dy;
				x = Math.min(Math.max(x + sx, 0), grid[0].length - 1);
			}
			if (e2 < dx) {
				err += dx;
				y = Math.min(Math.max(y + sy, 0), grid.length - 1);
			}
		}
		return true; // ゴールに到達できた
	};

	const locationStatus = (location, grid) => {
		const { distanceFromTop: dft, distanceFromLeft: dfl } = location;
		const rows = grid.length;
		const cols = grid[0].length;

		if (dft < 0 || dft >= rows || dfl < 0 || dfl >= cols) return 'Invalid';
		if (grid[dft][dfl] === 'Goal') return 'Goal';
		if (grid[dft][dfl] === 'Empty') return 'Valid';
		return 'Blocked';
	};

	const exploreInDirection = (currentLocation, direction, grid, scene, visited) => {
		const { distanceFromTop: dft, distanceFromLeft: dfl } = currentLocation;
		const [deltaT, deltaL] = deltas[direction];
		const newTop = dft + deltaT;
		const newLeft = dfl + deltaL;
		const locKey = key(newTop, newLeft);

		if (visited.has(locKey)) return null;

		const newLocation = {
			distanceFromTop: newTop,
			distanceFromLeft: newLeft,
			parent: currentLocation,
			move: direction,
			status: 'Unknown'
		};

		newLocation.status = locationStatus(newLocation, grid);

		if (newLocation.status === 'Valid' || newLocation.status === 'Goal') {
			visited.add(locKey);
			return newLocation;
		}

		return null;
	};

	const reconstructPath = (node) => {
		const path = [];
		while (node.parent) {
			if (["North", "East", "South", "West"].includes(node.move)) {
				path.unshift(node.move);
			}
			node = node.parent;
		}
		return path.length > 0 ? path : false;
	};

	// 幅優先探索（BFS）で経路を探す
	const findShortestPath = (startCoordinates, grid, scene, goalCoordinates = null) => {
		const [startTop, startLeft] = startCoordinates;
		const [goalTop, goalLeft] = goalCoordinates || [];

		const queue = [{
			distanceFromTop: startTop,
			distanceFromLeft: startLeft,
			parent: null,
			move: null,
			status: 'Start'
		}];

		const visited = new Set();
		visited.add(key(startTop, startLeft));

		const directions = ['North', 'East', 'South', 'West'];

		while (queue.length > 0) {
			const currentLocation = queue.shift();

			if (goalCoordinates &&
				currentLocation.distanceFromTop === goalTop &&
				currentLocation.distanceFromLeft === goalLeft) {
				return reconstructPath(currentLocation);
			}

			for (const direction of directions) {
				const newLocation = exploreInDirection(currentLocation, direction, grid, scene, visited);
				if (!newLocation) continue;

				if (!goalCoordinates && newLocation.status === 'Goal') {
					return reconstructPath(newLocation);
				}

				if (newLocation.status === 'Valid') {
					queue.push(newLocation);
				}
			}
		}

		return false;
	};

	// ゴールが見え、かつ到達可能なマスを探す
	const findVisibleAccessibleTile = (goal, grid, map, start, scene) => {
		const [goalY, goalX] = goal;
		const candidates = [];

		// 通行可能なマスを 'Empty' に変換
		for (let i = 0; i < grid.length; i++) {
			for (let j = 0; j < grid[i].length; j++) {
				if (map.collisionData[i][j] === 2 || map.collisionData[i][j] === 3) {
					grid[i][j] = 'Empty';
				}
			}
		}

		for (let y = 0; y < grid.length; y++) {
			for (let x = 0; x < grid[y].length; x++) {
				if (grid[y][x] === 'Empty' && isVisible([y, x], [goalY, goalX], grid) && Math.abs(x - goalX) + Math.abs(y - goalY) <= 8) {
					const path = findShortestPath(start, grid, scene, [y, x]);
					if (path) {
						candidates.push({ x, y, path });
					}
				}
			}
		}

		candidates.sort((a, b) => a.path.length - b.path.length);
		return candidates.length > 0 ? candidates[0].path : null;
	};*/
	/*const DIRS = [
		[-1, 0, "North"],
		[0, 1, "East"],
		[1, 0, "South"],
		[0, -1, "West"]
	];

	// 視線が通るかどうかを判定（Bresenhamの直線アルゴリズム）
	const isVisible = (from, to, grid) => {
		let [y0, x0] = from;
		const [y1, x1] = to;

		const rows = grid.length;
		const cols = grid[0].length;

		let dx = Math.abs(x1 - x0);
		let dy = Math.abs(y1 - y0);
		let sx = x0 < x1 ? 1 : -1;
		let sy = y0 < y1 ? 1 : -1;
		let err = dx - dy;

		while (true) {
			// 障害物チェック
			if (grid[y0][x0] === "Obstacle") return false;

			// ゴールに到達
			if (x0 === x1 && y0 === y1) return true;

			const e2 = err * 2;

			if (e2 > -dy) {
				err -= dy;
				x0 += sx;
			}
			if (e2 < dx) {
				err += dx;
				y0 += sy;
			}

			// 範囲外なら不可視扱い（安全対策）
			if (x0 < 0 || x0 >= cols || y0 < 0 || y0 >= rows) return false;
		}
	};


	// 0 = Invalid, 1 = Blocked, 2 = Valid, 3 = Goal
	const locationStatusFast = (y, x, grid) => {
		if (y < 0 || y >= grid.length || x < 0 || x >= grid[0].length) return 0;

		const cell = grid[y][x];
		if (cell === "Goal") return 3;
		if (cell === "Empty") return 2;
		return 1;
	};

	const exploreInDirectionFast = (cur, dy, dx, moveName, grid, visited) => {
		const ny = cur.y + dy;
		const nx = cur.x + dx;

		// 範囲外 or 訪問済み
		if (ny < 0 || ny >= grid.length || nx < 0 || nx >= grid[0].length) return null;
		if (visited[ny][nx]) return null;

		const status = locationStatusFast(ny, nx, grid);
		if (status === 0 || status === 1) return null; // Invalid / Blocked

		visited[ny][nx] = true;

		return {
			y: ny,
			x: nx,
			parent: cur,
			move: moveName,
			status
		};
	};

	const reconstructPath = (node) => {
		const path = [];
		while (node.parent) {
			path.unshift(node.move);
			node = node.parent;
		}
		return path.length > 0 ? path : false;
	};

	const findShortestPath = (startCoordinates, grid, scene, goalCoordinates = null) => {
		const [startY, startX] = startCoordinates;
		const goalY = goalCoordinates ? goalCoordinates[0] : null;
		const goalX = goalCoordinates ? goalCoordinates[1] : null;

		// BFS キュー（shift を使わない）
		const queue = new Array(400);
		let head = 0;
		let tail = 0;

		queue[tail++] = {
			y: startY,
			x: startX,
			parent: null,
			move: null
		};

		// visited を boolean 配列に
		const visited = Array.from({ length: grid.length }, () =>
			Array(grid[0].length).fill(false)
		);
		visited[startY][startX] = true;

		while (head < tail) {
			const cur = queue[head++];

			// ゴール指定あり
			if (goalCoordinates && cur.y === goalY && cur.x === goalX) {
				return reconstructPath(cur);
			}

			for (const [dy, dx, moveName] of DIRS) {
				const next = exploreInDirectionFast(cur, dy, dx, moveName, grid, visited);
				if (!next) continue;

				// ゴール指定なしで Goal に到達
				if (!goalCoordinates && next.status === 3) {
					return reconstructPath(next);
				}

				if (next.status === 2) { // Valid
					queue[tail++] = next;
				}
			}
		}

		return false;
	};

	// ゴールが見え、かつ到達可能なマスを探す
	const findVisibleAccessibleTile = (goal, grid, map, start, scene) => {
		const [goalY, goalX] = goal;
		let bestPath = null;

		// ★ 事前に通行可能マスを Empty に変換（1回だけ）
		for (let y = 0; y < grid.length; y++) {
			for (let x = 0; x < grid[y].length; x++) {
				if (map.collisionData[y][x] === 2 || map.collisionData[y][x] === 3) {
					grid[y][x] = 'Empty';
				}
			}
		}

		// ★ 探索範囲（ゴール中心 ±8）
		const minY = Math.max(0, goalY - 8);
		const maxY = Math.min(grid.length - 1, goalY + 8);
		const minX = Math.max(0, goalX - 8);
		const maxX = Math.min(grid[0].length - 1, goalX + 8);

		for (let y = minY; y <= maxY; y++) {
			for (let x = minX; x <= maxX; x++) {

				if (grid[y][x] !== 'Empty') continue;

				// 距離フィルタ
				const dist = Math.abs(x - goalX) + Math.abs(y - goalY);
				if (dist > 8) continue;

				// ★ 既に最短経路が見つかっているなら、距離がそれより長い候補は無視
				if (bestPath && dist >= bestPath.length) continue;

				// 可視判定
				if (!isVisible([y, x], goal, grid)) continue;

				// 経路探索
				const path = findShortestPath(start, grid, scene, [y, x]);
				if (!path) continue;

				// 最短経路を更新
				if (!bestPath || path.length < bestPath.length) {
					bestPath = path;
				}
			}
		}

		return bestPath;
	};*/

	const DIRS = [
		{ dy: -1, dx: 0, move: "North" },
		{ dy: 0, dx: 1, move: "East" },
		{ dy: 1, dx: 0, move: "South" },
		{ dy: 0, dx: -1, move: "West" }
	];

	const locationStatusFast = (y, x, grid) => {
		if (y < 0 || y >= Stage_H || x < 0 || x >= Stage_W) return 0;
		const cell = grid[y][x];
		if (cell === "Goal") return 3;
		if (cell === "Empty" || cell === "Start") return 2;
		return 1;
	};

	const reconstructPathFast = (idx) => {
		const path = [];
		while (qParent[idx] !== -1) {
			path.push(qMove[idx]);
			idx = qParent[idx];
		}
		return path.reverse();
	};

	// ------------------------------------------------------
	// ★ 既存の引数順を維持したまま最適化 BFS を実装
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

			// ゴール指定なし → grid 内の "Goal" に到達したら終了
			if (!goalCoordinates && grid[y][x] === "Goal") {
				return reconstructPathFast(curIndex);
			}

			for (let i = 0; i < 4; i++) {
				const dy = DIRS[i].dy;
				const dx = DIRS[i].dx;
				const ny = y + dy;
				const nx = x + dx;

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
	// grid[y][x] === 1 → Obstacle
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
	// findVisibleAccessibleTileFast（引数は既存のまま）
	// goal = [goalY, goalX]
	// start = [startY, startX]
	// grid は数値グリッド（0=Empty, 1=Obstacle, 2=Goal）
	// ------------------------------------------------------
	const findVisibleAccessibleTile = (goal, grid, map, start, scene) => {
		const goalY = goal[0];
		const goalX = goal[1];

		const startY = start[0];
		const startX = start[1];

		let bestLen = Infinity;
		let bestPath = null;

		// 探索範囲（±8）
		const minY = Math.max(0, goalY - 8);
		const maxY = Math.min(Stage_H - 1, goalY + 8);
		const minX = Math.max(0, goalX - 8);
		const maxX = Math.min(Stage_W - 1, goalX + 8);

		for (let y = minY; y <= maxY; y++) {
			for (let x = minX; x <= maxX; x++) {

				// 通行不可
				if (grid[y][x] !== 0) continue; // 0 = Empty

				// マンハッタン距離
				const dist = Math.abs(x - goalX) + Math.abs(y - goalY);
				if (dist > 8) continue;

				// 既に最短があるなら pruning
				if (dist >= bestLen) continue;

				// 可視判定
				if (!isVisibleFast(y, x, goalY, goalX, grid)) continue;

				// BFS（最適化版）
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


	const getPathToGoalOrVisibleTile = (start, goal, grid, map, scene) => {
		let path = findShortestPath(start, grid, scene, null);
		if (!path) {
			path = findVisibleAccessibleTile(goal, grid, map, start, scene);
		}
		//let path = findVisibleAccessibleTile(goal, grid, map, start, scene);
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

			this.life        = Categorys.Life[this.category];
			this.shotSpeed   = Categorys.ShotSpeed[this.category];
			this.fireLate    = Categorys.FireLate[this.category];
			this.ref         = Categorys.MaxRef[this.category];
			this.bulMax      = Categorys.MaxBullet[this.category];
			this.bomMax      = Categorys.MaxBom[this.category];
			this.moveSpeed   = Categorys.MoveSpeed[this.category];
			this.reload      = Categorys.Reload[this.category];
			this.bodyRotSpeed = Categorys.BodyRotSpeed[this.category];
			this.distance    = Categorys.Distances[this.category];

			this.bomSetFlg    = false;
			this.bomReload    = 0;
			this.bulReloadFlg = false;
			this.bulReloadTime = 0;
			this.shotNGflg    = false;
			this.moveFlg      = true;

			this.damFlg    = false;
			this.damTime   = 0;
			this.damTimeMax = (this.num === 0 || this.category === 0) ? 90 : 60;
			this.damCng    = false;

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

			this.tankFrame = TankFrame(this, this.num, scene);

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
			new Mark(this);
			new TankBoom(this);
			this.moveTo(-100 * (this.num + 1), -100 * (this.num + 1));
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

			if (from.category === 9) {
				this.damTimeMax = 20;
			}

			this.life--;
			from._Destroy();

			if (this.life > 0) {
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
			this.damTimeMax = (this.num === 0 || this.category === 0) ? 90 : 60;

			if (this.category === 7 && this.num > 0) {
				new Flash(this);
				this.tank.opacity   = 0.0;
				this.cannon.opacity = 0.0;
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
			
			this.weak.scale(0.6, 0.6);

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

							let aim = playerType == 1 || playerType == 6 ?
								new PlayerRefAim(this.ref, this.cannon, this.cursor, this.category, this.num) :
								new Aim(this.cannon, this.cursor, this.category, this.num);
							if (this.bulReloadFlg){
								aim.image = RedAimSurfaceCache;
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
										if (bullets[this.num] == 0){
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
										if (bullets[this.num] == 0){
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
					for (let i = 0; i < this.bulMax; i++) {
						if (bulStack[this.num][i] == false) { //  弾の状態がoffならば
							this.shotStopFlg = true;
							
							if (this.category == 9) {
								new PhysBulletCol(this.shotSpeed, this.ref, this.cannon, this.category, this.num, i, this.cursor)._Shot();
								this.fullFireFlg = true;
								this.firecnt++;
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

			if (gameMode == 2) this.weak.scale(0.6, 0.6);

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
				grid[myPath[0] + off[0]][myPath[1] + off[1]] = 'Obstacle';
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
				if (this.time % 60 === 0) {
					this.grid = JSON.parse(JSON.stringify(scene.grid));
					this.map = Object.assign({}, scene.backgroundMap);

					if (this.moveSpeed > 0 && !this.tankStopFlg) {
						this.myPath = getGridCoord(this);
						this.targetPath = getGridCoord(this.target);

						for (let i = 0; i < this.grid.length; i++) {
							for (let j = 0; j < this.grid[i].length; j++) {
								if (i === this.myPath[0] && j === this.myPath[1]) {
									this.grid[i][j] = 'Start';
								} else if (i === this.targetPath[0] && j === this.targetPath[1]) {
									this.grid[i][j] = 'Goal';
								} else {
									this.grid[i][j] = this.map.collisionData[i][j] === 0 ? 'Empty' : 'Obstacle';
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
				}

				// 2Fごとに射撃系フラグリセット
				if (this.time % 2 === 0) {
					this.fireFlg = false;
					this.shotNGflg = false;
					if (this.tankStopFlg) this.tankStopFlg = false;
				}

				// 戦車同士の衝突
				if ((tankEntity.length - destruction) - 1 > 2) {
					const handler = collisionHandlers[this.rotation];
					if (handler){
						const frame = this.tankFrame[handler.frame];
						let match = TankBase.intersectStrict(frame);
						if (match.length > 0){
							if(match[0].num != this.num && deadFlgs[match[0].num] == false){
								this.tankStopFlg = true;
								this.x += handler.dx * this.moveSpeed;
								this.y += handler.dy * this.moveSpeed;
								moveCnt -= this.moveSpeed;
							}
						}
					}
				}

				// EnemyAim 生成
				new EnemyAim(this.cannon, this.cursor, this.category, this.num);

				// 照準ヒット
				const hit = EnemyAim.intersect(this.cursor)[0];
				if (hit) this.fireFlg = true;

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
				/*if (BulletBase.collection.length > 0) {
					const match1 = PlayerBulAim.intersectStrict(this.around);
					const match2 = BulAim.intersectStrict(this.around);
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
				}*/

				// リロード処理
				this._Reload();
				/*if (!this.bulReloadFlg) {
					if (bullets[this.num] === this.bulMax) this.bulReloadFlg = true;
				} else {
					if (this.bulReloadTime < this.reload) {
						this.bulReloadTime++;
						if (!this.shotNGflg) this.shotNGflg = true;
					} else {
						if (bullets[this.num] == 0){
							this.shotNGflg = false;
							this.bulReloadFlg = false;
							this.bulReloadTime = 0;
						}
					}
				}*/

				// 射撃
				if (!this.shotNGflg && this.fireFlg && this.time % this.fireLate === 0) {
					if (Math.floor(Math.random() * this.bulMax * 2) > bullets[this.num]) {
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
				for (let i = 0; i < this.bulMax; i++) {
					if (!bulStack[this.num][i]) {
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
				const match1 = PlayerBulAim.intersectStrict(this.around);
				const match2 = BulAim.intersectStrict(this.around);
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
					if (bullets[this.num] == 0){
						this.shotNGflg = false;
						this.bulReloadFlg = false;
						this.bulReloadTime = 0;
					}
				}
			}
		}
	});


	//	攻守両立型
	var Entity_Type2 = Class.create(TankBase, {
		initialize: function(x, y, category, num, scene) {
			TankBase.call(this, x, y, category, num, scene);

			if(gameMode == 2)
				this.weak.scale(0.6, 0.6);

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

			/*const Instrumentation = (weak, target1, target2) => {
				let dist1 = Get_Distance(weak, target1);
				let dist2 = Get_Distance(weak, target2);
				if (dist1 >= dist2) {
					return dist2;
				} else {
					return null;
				}
			}*/

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
							}

							this._Damage();

							this.time++;

							if (this.time % 60 == 0){
								moveRandom = Math.floor(Math.random() * 5) > 1 ? 1 : 0;
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

							if (!this.fireFlg && EnemyAim.intersect(this.cursor).length > 0){
								this.fireFlg = true; //  発射可能状態にする
							}
							/*EnemyAim.intersect(this.cursor).forEach(elem => {
								if (!this.fireFlg) this.fireFlg = true; //  発射可能状態にする
								return;
							})*/

							if (this.ref > 0) {
								if (this.front.intersectStrict(RefObstracle).length > 0) this.shotNGflg = true;
							}

							if (this.time % 5 == 0) {
								if (this.attackTarget != tankEntity[0] && this.escapeFlg == false) this.attackTarget = tankEntity[0];
								this.escapeFlg = false;
							}

							this._Defense();
							/*if (BulletBase.collection.length > 0) {
								const match1 = PlayerBulAim.intersectStrict(this.around);
								const match2 = BulAim.intersectStrict(this.around);
								for (var i = 0, l = BulletBase.collection.length; i < l; i++) {
									const c = BulletBase.collection[i];
									if (!bulStack[c.num][c.id]) continue;

									const defFlg = Categorys.DefenceFlg[this.category];
									if ((c.num === 0 && !defFlg[0]) ||
										(c.num === this.num && !defFlg[1]) ||
										(c.num !== 0 && c.num !== this.num && !defFlg[2])) continue;

									const dist = Instrumentation(this.weak, this.attackTarget, c);
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
							}*/

							this._Reload();
							/*if (this.bulReloadFlg == false) {
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

							}*/

							if (!this.shotNGflg) {
								if (this.time % this.fireLate == 0 && this.fireFlg) {
									//if (Math.floor(Math.random() * this.bulMax * 2) > bullets[this.num]) {
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
					for (let i = 0; i < this.bulMax; i++) {
						if (bulStack[this.num][i] == false) { //  弾の状態がoffならば
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
				const match1 = PlayerBulAim.intersectStrict(this.around);
				const match2 = BulAim.intersectStrict(this.around);
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

			if (gameMode == 2) this.weak.scale(0.6, 0.6);

			this.around = new InterceptAround(this);
			this.front = new InterceptFront(this.cannon);

			if (this.category === 5) {
				this.around.scale(1.5, 1.5);
			}

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
				if (grid[myPath[0] - 1][myPath[1]] === 'Obstacle') res.push(0);
				if (grid[myPath[0]][myPath[1] + 1] === 'Obstacle') res.push(1);
				if (grid[myPath[0] + 1][myPath[1]] === 'Obstacle') res.push(2);
				if (grid[myPath[0]][myPath[1] - 1] === 'Obstacle') res.push(3);
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

					if (this.moveSpeed > 0 && !rootFlg && this.time % 60 === 0) {
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
									gi[j] = 'Start';
								} else if (i === this.targetPath[0] && j === this.targetPath[1]) {
									gi[j] = 'Goal';
								} else {
									gi[j] = ci[j] === 0 ? 'Empty' : 'Obstacle';
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

				const aimHits = EnemyAim.intersectStrict(this.cursor);
				if (aimHits.length > 0) {
					if (!this.fireFlg) this.fireFlg = true;
					if (!rootFlg) rootFlg = true;
				}

				if (this.ref > 0) {
					if (this.front.intersectStrict(RefObstracle).length > 0) this.shotNGflg = true;
				}

				if (this.time % 3 === 0) {
					if (this.attackTarget !== this.target && !this.escapeFlg) this.attackTarget = this.target;
					this.escapeFlg = false;
				}

				this._Defense();
				/*if (BulletBase.collection.length > 0) {
					const defFlg = Categorys.DefenceFlg[this.category];
					const defRange = Categorys.DefenceRange[this.category];
					const escRange = Categorys.EscapeRange[this.category];

					const match1 = PlayerBulAim.intersectStrict(this.around);
					const match2 = BulAim.intersectStrict(this.around);

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
									} else if (category == 5) {
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
				}*/

				this._Reload();
				/*if (!this.bulReloadFlg) {
					if (bullets[this.num] === this.bulMax) this.bulReloadFlg = true;
				} else {
					if (this.bulReloadTime < this.reload) {
						this.bulReloadTime++;
						if (!this.shotNGflg) this.shotNGflg = true;
					} else {
						if (bullets[this.num] == 0){
							this.shotNGflg = false;
							this.bulReloadFlg = false;
							this.bulReloadTime = 0;
						}
					}
				}*/

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
						for (let i = 0, l = bomCol.length; i < l; i++) {
							const c = bomCol[i];
							if (getDistanceSq(this.weak, c) < 150 * 150) {
								updateDirection(this.weak, c, 0, this.grid, this.myPath);
								break;
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

			for (let i = 0; i < this.bulMax; i++) {
				if (!bulStack[this.num][i]) {
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

				const match1 = PlayerBulAim.intersectStrict(this.around);
				const match2 = BulAim.intersectStrict(this.around);

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
					if (bullets[this.num] == 0){
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

			if(gameMode == 2)
				this.weak.scale(0.6, 0.6);

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

							if (!this.fireFlg && EnemyAim.intersectStrict(this.cursor).length > 0){
								this.fireFlg = true; //  発射可能状態にする
							}

							this._Reload();
							/*if (this.bulReloadFlg == false) {
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
									if (bullets[this.num] == 0){
										this.shotNGflg = false;
										this.bulReloadFlg = false;
										this.bulReloadTime = 0;
									}
								}

							}*/

							if (!this.shotNGflg) {
								if (this.time % this.fireLate == 0 && ((this.fireFlg && bullets[this.num] == 0) || this.fullFireFlg)) {
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
					for (let i = 0; i < this.bulMax; i++) {
						if (bulStack[this.num][i] == false) { //  弾の状態がoffならば
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
					if (bullets[this.num] == 0){
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

			if (gameMode == 2) this.weak.scale(0.6, 0.6);

			this.cannon2 = new Cannon(this, this.category);
			this.cannon2.opacity = 0;

			this.y -= 32;

			this.target = tankEntity[0];
			this.attackTarget = this.target;

			this.cursor = new RefCursor(this, scene);

			this.aimingTime = 0;
			this.aimCmpTime = 60;
			this.aimRot = Categorys.CannonRotSpeed[this.category];

			if (Math.random() < 0.5) this.aimRot *= -1;

			for (let i = 0; i < this.bulMax; i++) {
				bulStack[this.num].push(false);
			}

			// クラス定義を毎フレーム作らないように外へ移動
			const EnemyAim = Class.create(RefAim, {
				initialize: function (ref, from, category, num) {
					RefAim.call(this, ref, from, category, num);
				}
			});

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
					this.shotNGflg = false;
					this.fireFlg = false;

					const useCannon = (this.time % 4 === 0) ? this.cannon2 : this.cannon;
					new EnemyAim(this.ref, useCannon, this.category, this.num);
				}

				this.time++;

				// --- 照準ヒットチェック ---
				const hitList = EnemyAim.intersectStrict(this.target);
				if (hitList.length > 0) {
					const elem = hitList[0];

					if (elem.hitTime === 0) {
						const diff = normalizeAngle(this.cannon.rotation - normalizeRotation(elem.agl));
						this.aimRot = diff > 0
							? -Categorys.CannonRotSpeed[this.category]
							:  Categorys.CannonRotSpeed[this.category];

						this.cannon2.rotation = elem.agl - this.aimRot * ((1 + Math.floor(Math.random() * 10)) * 2);

						if (this.cannon.rotation !== elem.agl) {
							if (this.cursor.x !== elem.tgt[0] || this.cursor.y !== elem.tgt[1]) {
								this.cursor.x = elem.tgt[0];
								this.cursor.y = elem.tgt[1];
							}
							this.cannon.rotation = elem.agl;
						}
					}

					if (elem.hitTime < 5 && !this.fireFlg) {
						this.fireFlg = true;
					}

					if (this.aimingTime < this.aimCmpTime + 15) {
						this.aimingTime += 3;
					}

					elem.hitTime++;
					if (elem.hitTime >= 5) now_scene.removeChild(elem);
				}

				// --- エイム回転 ---
				if (!this.fireFlg && this.aimingTime < this.aimCmpTime) {
					this.cannon2.rotation += (this.cannon.rotation !== this.cannon2.rotation)
						? -this.aimRot
						:  this.aimRot;
					this.cannon.rotation += this.aimRot;
				}

				// --- リロード・射撃 ---
				if (this.time % 5 === 0) {
					if (this.aimingTime > 0 && !this.fireFlg) this.aimingTime -= 3;

					this._Reload();
					/*if (!this.bulReloadFlg) {
						if (bullets[this.num] === this.bulMax) this.bulReloadFlg = true;
					} else {
						if (this.bulReloadTime < this.reload) {
							this.bulReloadTime++;
							if (!this.shotNGflg) this.shotNGflg = true;
						} else {
							if (bullets[this.num] == 0){
								this.shotNGflg = false;
								this.bulReloadFlg = false;
								this.bulReloadTime = 0;
							}
						}
					}*/

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
				for (let i = 0; i < this.bulMax; i++) {
					if (!bulStack[this.num][i]) {
						this.shotStopFlg = true;
						new BulletCol(this.shotSpeed, this.ref, this.cannon, this.category, this.num, i)._Shot();

						this.aimingTime = 0;
						this.aimCmpTime = (this.category != 1)
							? Math.floor(Math.random() * 60) + 20
							: Math.floor(Math.random() * 30) + 30;

						this.cannon.rotation += this.aimRot / 2;
						this.cannon2.rotation += this.aimRot / 2;

						const children = now_scene.childNodes.slice().filter(
							child => child instanceof RefAim && child.num == this.num
						);
						children.forEach(child => now_scene.removeChild(child));

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
					if (bullets[this.num] == 0){
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

			if(gameMode == 2)
				this.weak.scale(0.6, 0.6);

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
							arr = [1, 2, 5, 6];
						} else {
							arr = [0, 1, 4, 7];
						}
					} else {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							arr = [2, 3, 5, 6];
						} else {
							arr = [0, 3, 4, 7];
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

				if (target2.name == 'Bom') {

					let rem = [];
					this.myPath = [parseInt((that.y + that.height / 2) / PixelSize), parseInt((that.x + that.width / 2) / PixelSize)];
					this.grid = JSON.parse(JSON.stringify(scene.grid));
					let bk = arr;

					if (this.grid[this.myPath[0] - 1][this.myPath[1]] == 'Obstacle') rem.push(0);
					if (this.grid[this.myPath[0]][this.myPath[1] + 1] == 'Obstacle') rem.push(1);
					if (this.grid[this.myPath[0] + 1][this.myPath[1]] == 'Obstacle') rem.push(2);
					if (this.grid[this.myPath[0]][this.myPath[1] - 1] == 'Obstacle') rem.push(3);
					if (this.grid[this.myPath[0] - 1][this.myPath[1] + 1] == 'Obstacle') rem.push(4);
					if (this.grid[this.myPath[0] + 1][this.myPath[1] + 1] == 'Obstacle') rem.push(5);
					if (this.grid[this.myPath[0] + 1][this.myPath[1] - 1] == 'Obstacle') rem.push(6);
					if (this.grid[this.myPath[0] - 1][this.myPath[1] - 1] == 'Obstacle') rem.push(7);

					arr = arr.filter(i => rem.indexOf(i) == -1);

					if (arr.length == 0) {
						arr = bk;
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
				this.hittingTime++;
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

							if (!this.fireFlg && EnemyAim.intersectStrict(this.cursor).length > 0){
								this.fireFlg = true; //  発射可能状態にする
							}

							if (this.fireFlg && EnemyAim.intersectStrict(Bom).length > 0) {
								this.fireFlg = false;
							}

							if (this.ref > 0) {
								if (this.front.intersectStrict(RefObstracle).length > 0) this.shotNGflg = true;
							}

							if (this.time % 5 == 0) {
								if (this.attackTarget != tankEntity[0] && this.escapeFlg == false) this.attackTarget = tankEntity[0];
								this.escapeFlg = false;
							}

							this._Defense();
							/*if (BulletBase.collection.length > 0) {
								const match1 = PlayerBulAim.intersectStrict(this.around);
								const match2 = BulAim.intersectStrict(this.around);
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
							}*/

							this._Reload();
							/*if (this.bulReloadFlg == false) {
								if (bullets[this.num] == this.bulMax) this.bulReloadFlg = true;
							} else {
								if (this.bulReloadTime < this.reload) {
									this.bulReloadTime++;
									if (this.shotNGflg == false) this.shotNGflg = true;
								} else {
									if (bullets[this.num] == 0){
										this.shotNGflg = false;
										this.bulReloadFlg = false;
										this.bulReloadTime = 0;
									}
								}

							}*/

							let matchFront = TankBase.intersectStrict(this.front);
							if (matchFront.length > 0){
								if(matchFront[0].num != this.num && !deadFlgs[matchFront[0].num] && matchFront[0].num != 0) this.fireFlg = false;
							}

							if (!this.shotNGflg) {
								if (this.time % this.fireLate == 0 && this.fireFlg) {
									//if (Math.floor(Math.random() * this.bulMax * 2) > bullets[this.num]) {
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
													if (this.grid[y]?.[x] === 'Obstacle') rem.add(Number(dir));
												}

												arr = arr.filter(i => !rem.has(i));

												if (arr.length === 0) {
													arr = Array.from({ length: 8 }, (_, i) => i).filter(i => !rem.has(i));
												}

												if (!arr.includes(this.dirValue)) {
													this.dirValue = arr[Math.floor(Math.random() * arr.length)];
												}
												this.hittingTime = 0;
											} else if (this.time % 10 === 0) SelDirection(this.weak, this.attackTarget, 1);
										}
										

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
												SelDirection(this.weak, closest, 0);
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
					for (let i = 0; i < this.bulMax; i++) {
						if (bulStack[this.num][i] == false) { //  弾の状態がoffならば
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
				const match1 = PlayerBulAim.intersectStrict(this.around);
				const match2 = BulAim.intersectStrict(this.around);
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
					if (bullets[this.num] == 0){
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

			if(gameMode == 2)
				this.weak.scale(0.6, 0.6);

			var that = this;

			this.around = new InterceptAround(this);
			this.front = new InterceptFront(this.cannon);
			this.target = tankEntity[0];

			this.around.scale(1.6, 1.6);

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

				if (this.grid[this.myPath[0] - 1][this.myPath[1]] == 'Obstacle') rem.push(0);
				if (this.grid[this.myPath[0]][this.myPath[1] + 1] == 'Obstacle') rem.push(1);
				if (this.grid[this.myPath[0] + 1][this.myPath[1]] == 'Obstacle') rem.push(2);
				if (this.grid[this.myPath[0]][this.myPath[1] - 1] == 'Obstacle') rem.push(3);
				if (this.grid[this.myPath[0] - 1][this.myPath[1] + 1] == 'Obstacle') rem.push(4);
				if (this.grid[this.myPath[0] + 1][this.myPath[1] + 1] == 'Obstacle') rem.push(5);
				if (this.grid[this.myPath[0] + 1][this.myPath[1] - 1] == 'Obstacle') rem.push(6);
				if (this.grid[this.myPath[0] - 1][this.myPath[1] - 1] == 'Obstacle') rem.push(7);

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

								if (this.grid[this.myPath[0] - 1][this.myPath[1]] == 'Obstacle') rem.push(0);
								if (this.grid[this.myPath[0]][this.myPath[1] + 1] == 'Obstacle') rem.push(1);
								if (this.grid[this.myPath[0] + 1][this.myPath[1]] == 'Obstacle') rem.push(2);
								if (this.grid[this.myPath[0]][this.myPath[1] - 1] == 'Obstacle') rem.push(3);
								if (this.grid[this.myPath[0] - 1][this.myPath[1] + 1] == 'Obstacle') rem.push(4);
								if (this.grid[this.myPath[0] + 1][this.myPath[1] + 1] == 'Obstacle') rem.push(5);
								if (this.grid[this.myPath[0] + 1][this.myPath[1] - 1] == 'Obstacle') rem.push(6);
								if (this.grid[this.myPath[0] - 1][this.myPath[1] - 1] == 'Obstacle') rem.push(7);

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

							if (!this.fireFlg && EnemyAim.intersectStrict(this.cursor).length > 0){
								this.fireFlg = true; //  発射可能状態にする
							}

							if (this.ref > 0) {
								if (this.front.intersectStrict(RefObstracle).length > 0) this.shotNGflg = true;
							}

							if (this.time % 3 == 0) {
								if (this.attackTarget != tankEntity[0] && this.escapeFlg == false) this.attackTarget = tankEntity[0];
								this.escapeFlg = false;
							}

							this._Defense();
							/*this.escapeTargets = [];

							if (BulletBase.collection.length > 0) {
								const escapeList = [];
								const match1 = PlayerBulAim.intersectStrict(this.around);
								const match2 = BulAim.intersectStrict(this.around);
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
							}*/

							this._Reload();
							/*if (this.bulReloadFlg == false) {
								if (bullets[this.num] == this.bulMax) this.bulReloadFlg = true;
							} else {
								if (this.bulReloadTime < this.reload) {
									this.bulReloadTime++;
									if (this.shotNGflg == false) this.shotNGflg = true;
								} else {
									if (bullets[this.num] == 0){
										this.shotNGflg = false;
										this.bulReloadFlg = false;
										this.bulReloadTime = 0;
									}
								}

							}*/

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
										//SelDirection(this.weak, this.escapeTarget, 0);
										this.dirValue = Escape_Rot8(this, this.escapeTarget, this.dirValue);
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
														if (this.grid[y]?.[x] === 'Obstacle') rem.add(Number(dir));
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
					for (let i = 0; i < this.bulMax; i++) {
						if (bulStack[this.num][i] == false) { //  弾の状態がoffならば
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
				const match1 = PlayerBulAim.intersectStrict(this.around);
				const match2 = BulAim.intersectStrict(this.around);
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
					if (bullets[this.num] == 0){
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

			this.weak.scale(0.8, 0.8);
			this.tank.scale(1.1, 1.1);
			this.cannon.scale(1.3, 1.1);

			this.around = new InterceptAround(this);
			this.front = new InterceptFront(this.cannon);

			this.around.scale(1.5, 1.5);

			this.target = tankEntity[0];

			//this.weak.backgroundColor = 'blue';

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

								if (this.grid[this.myPath[0] - 1][this.myPath[1]] == 'Obstacle') rem.push(0);
								if (this.grid[this.myPath[0]][this.myPath[1] + 1] == 'Obstacle') rem.push(1);
								if (this.grid[this.myPath[0] + 1][this.myPath[1]] == 'Obstacle') rem.push(2);
								if (this.grid[this.myPath[0]][this.myPath[1] - 1] == 'Obstacle') rem.push(3);

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

							if (!this.fireFlg && EnemyAim.intersectStrict(this.cursor).length > 0){
								this.fireFlg = true; //  発射可能状態にする
							}

							if (this.ref > 0) {
								if (this.front.intersectStrict(RefObstracle).length > 0) this.shotNGflg = true;
							}

							if (this.time % 3 == 0) {
								if (this.attackTarget != this.target && !this.escapeFlg) this.attackTarget = this.target;
								this.escapeFlg = false;
							}

							this._Defense();
							/*if (BulletBase.collection.length > 0) {
								const match1 = PlayerBulAim.intersectStrict(this.around);
								const match2 = BulAim.intersectStrict(this.around);
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
							}*/

							this._Reload();
							/*if (this.bulReloadFlg == false) {
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
									if (bullets[this.num] == 0){
										this.shotNGflg = false;
										this.bulReloadFlg = false;
										this.bulReloadTime = 0;
									}
								}

							}*/

							let matchFront = TankBase.intersectStrict(this.front);
							if (matchFront.length > 0){
								if(matchFront[0].num != this.num && !deadFlgs[matchFront[0].num] && matchFront[0].num != 0) this.fireFlg = false;
							}

							if (!this.shotNGflg) {
								if (this.time % this.fireLate == 0 && (this.fireFlg || this.fullFireFlg)) {
									if (bulStack[this.num][Math.floor(Math.random() * this.bulMax)] == false || this.fullFireFlg) {
										//if(Math.floor(Math.random() * this.bulMax * 2) > bullets[this.num] || this.fullFireFlg) {
										this._Attack();
									}
								}
							}

							/*if (!this.shotNGflg) {
								if (this.time % this.fireLate == 0 && this.fireFlg) {
									//if(bulStack[this.num][Math.floor(Math.random() * this.bulMax)] == false) {
									if (Math.floor(Math.random() * this.bulMax * 2) > bullets[this.num]) {
										this._Attack();
									}
								}
							}*/

							if (this.moveSpeed > 0) {
								if (this.time % 5 == 0) {
									if (this.escapeFlg) {
										//SelDirection(this.weak, this.escapeTarget, 0);
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
					for (let i = 0; i < this.bulMax; i++) {
						if (bulStack[this.num][i] == false) { //  弾の状態がoffならば
							this.shotStopFlg = true;
							if (Math.floor(Math.random() * 3) == 0 && gameMode > 0) this._ResetAim();
							new BulletCol(this.shotSpeed, this.ref, this.cannon, this.category, this.num, i)._Shot();
							if (this.life == 1) {
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
				//let dis = Math.trunc(Vec_Distance(t1, t2) / 30);
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
			switch (this.life) {
				case 3:
					if (this.moveSpeed > 1) this.moveSpeed = Categorys.MoveSpeed[this.category] + 0.4;
					break;
				case 2:
					if (this.moveSpeed > 1) this.moveSpeed = Categorys.MoveSpeed[this.category] - 0.3;
					this.fireLate = Categorys.FireLate[this.category] + 5;
					this.shotSpeed = Categorys.ShotSpeed[this.category] - 1;
					break;
				case 1:
					if (this.moveSpeed > 1) this.moveSpeed = Categorys.MoveSpeed[this.category] + 0.2;
					this.fireLate = Categorys.FireLate[this.category] - 10;
					this.shotSpeed = Categorys.ShotSpeed[this.category] + 5;
					this.ref = 0;
					this.reload = Categorys.Reload[this.category] - 30;
					break;
				default:
					break;
			}
		},
		_Defense: function(){
			if (BulletBase.collection.length > 0) {
				const match1 = PlayerBulAim.intersectStrict(this.around);
				const match2 = BulAim.intersectStrict(this.around);
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
					if(this.life == 1)this.fireLate = Categorys.FireLate[this.category] - 10;
				}
			} else {
				if (this.bulReloadTime < this.reload) {
					this.bulReloadTime++;
					if (this.shotNGflg == false) this.shotNGflg = true;
				} else {
					if (bullets[this.num] == 0){
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

			this.around.scale(1.4, 1.4);
			this.weak.scale(0.8, 0.8);
			this.tank.scale(1.1, 1.1);
			this.cannon.scale(1.3, 1.1);

			this.target = tankEntity[0];

			//this.weak.backgroundColor = 'blue';

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

				if (this.grid[this.myPath[0] - 1][this.myPath[1]] == 'Obstacle') rem.push(0);
				if (this.grid[this.myPath[0]][this.myPath[1] + 1] == 'Obstacle') rem.push(1);
				if (this.grid[this.myPath[0] + 1][this.myPath[1]] == 'Obstacle') rem.push(2);
				if (this.grid[this.myPath[0]][this.myPath[1] - 1] == 'Obstacle') rem.push(3);
				if (this.grid[this.myPath[0] - 1][this.myPath[1] + 1] == 'Obstacle') rem.push(4);
				if (this.grid[this.myPath[0] + 1][this.myPath[1] + 1] == 'Obstacle') rem.push(5);
				if (this.grid[this.myPath[0] + 1][this.myPath[1] - 1] == 'Obstacle') rem.push(6);
				if (this.grid[this.myPath[0] - 1][this.myPath[1] - 1] == 'Obstacle') rem.push(7);

				arr = arr.filter(i => rem.indexOf(i) == -1);

				if (arr.length == 0) {
					arr = bk;
				}

				if (arr.indexOf(this.dirValue) == -1) this.dirValue = arr[Math.floor(Math.random() * arr.length)];
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

								if (this.grid[this.myPath[0] - 1][this.myPath[1]] == 'Obstacle') rem.push(0);
								if (this.grid[this.myPath[0]][this.myPath[1] + 1] == 'Obstacle') rem.push(1);
								if (this.grid[this.myPath[0] + 1][this.myPath[1]] == 'Obstacle') rem.push(2);
								if (this.grid[this.myPath[0]][this.myPath[1] - 1] == 'Obstacle') rem.push(3);
								if (this.grid[this.myPath[0] - 1][this.myPath[1] + 1] == 'Obstacle') rem.push(4);
								if (this.grid[this.myPath[0] + 1][this.myPath[1] + 1] == 'Obstacle') rem.push(5);
								if (this.grid[this.myPath[0] + 1][this.myPath[1] - 1] == 'Obstacle') rem.push(6);
								if (this.grid[this.myPath[0] - 1][this.myPath[1] - 1] == 'Obstacle') rem.push(7);

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

							if (!this.fireFlg && EnemyAim.intersectStrict(this.cursor).length > 0){
								this.fireFlg = true; //  発射可能状態にする
							}

							if (this.ref > 0) {
								if (this.front.intersectStrict(RefObstracle).length > 0) this.shotNGflg = true;
							}

							if (this.time % 3 == 0) {
								if (this.attackTarget != this.target && !this.escapeFlg) this.attackTarget = this.target;
								this.escapeFlg = false;
							}

							this._Defense();
							/*if (BulletBase.collection.length > 0) {
								const match1 = PlayerBulAim.intersectStrict(this.around);
								const match2 = BulAim.intersectStrict(this.around);
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
														if (Search(c, this, 60, escRange[1])) {
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
							}*/

							this._Reload();
							/*if (this.bulReloadFlg == false) {
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
									if (bullets[this.num] == 0){
										this.shotNGflg = false;
										this.bulReloadFlg = false;
										this.bulReloadTime = 0;
										let percent = (this.life / Categorys.Life[this.category]);
										if (percent < 0.35) this.distance = Categorys.Distances[this.category] + 160;
										else if (percent < 0.6) this.distance = Categorys.Distances[this.category] + 64;
										else this.distance = Categorys.Distances[this.category];
									}
									
									
								}

							}*/

							let matchFront = TankBase.intersectStrict(this.front);
							if (matchFront.length > 0){
								if(matchFront[0].num != this.num && !deadFlgs[matchFront[0].num] && matchFront[0].num != 0) this.fireFlg = false;
							}

							if (!this.shotNGflg) {
								if (this.time % this.fireLate == 0 && (this.fireFlg || this.fullFireFlg)) {
									//if(bulStack[this.num][Math.floor(Math.random() * this.bulMax)] == false || this.fullFireFlg) {
									if (Math.floor(Math.random() * this.bulMax * 2) > bullets[this.num] || this.fullFireFlg) {
										this._Attack();
									}
								}
							}

							/*if (!this.shotNGflg) {
								if (this.time % this.fireLate == 0 && this.fireFlg) {
									//if(bulStack[this.num][Math.floor(Math.random() * this.bulMax)] == false) {
									if (Math.floor(Math.random() * this.bulMax * 2) > bullets[this.num]) {
										this._Attack();
									}
								}
							}*/

							if (this.moveSpeed > 0) {
								if (this.time % 3 == 0) {
									if (this.escapeFlg) {
										//SelDirection(this.weak, this.escapeTarget, 0);
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
					for (let i = 0; i < this.bulMax; i++) {
						if (bulStack[this.num][i] == false) { //  弾の状態がoffならば
							this.shotStopFlg = true;
							if (Math.floor(Math.random() * 2) == 0 && gameMode > 0) this._ResetAim();

							if (this.life == 1) {
								/*this.fullFireFlg = true;
								this.firecnt++;*/
								if (!this.fullFireFlg) {
									if (Math.floor(Math.random() * 5) == 0) {
										this.fullFireFlg = true;
										this.cannon.rotation += (Math.floor(Math.random() * 3) - 1);
										this.firecnt++;
										this.fireLate = 9;
									}

								} else {
									this.cannon.rotation += (Math.floor(Math.random() * 3) - 1);
									this.firecnt++;
								}
								//console.log(this.fireLate)

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
				//let dis = Math.trunc(Vec_Distance(t1, t2) / 30);
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
		},
		_ResetStatus: function() {
			switch (this.life) {
				case 3:
					if (this.moveSpeed > 1) this.moveSpeed = Categorys.MoveSpeed[this.category] + 0.4;
					break;
				case 2:
					if (this.moveSpeed > 1) this.moveSpeed = Categorys.MoveSpeed[this.category] - 0.3;
					this.fireLate = Categorys.FireLate[this.category] + 3;
					this.shotSpeed = Categorys.ShotSpeed[this.category] - 1;
					this.bodyRotSpeed = Categorys.BodyRotSpeed[this.category] + 4;
					this.distance = Categorys.Distances[this.category] + 100;
					break;
				case 1:
					if (this.moveSpeed > 1) this.moveSpeed = Categorys.MoveSpeed[this.category] - 0.5;
					this.fireLate = Categorys.FireLate[this.category] - 12;
					this.shotSpeed = Categorys.ShotSpeed[this.category] + 3;
					this.bodyRotSpeed = Categorys.BodyRotSpeed[this.category] + 7;
					this.ref = 0;
					this.reload = Categorys.Reload[this.category] - 30;
					this.distance = Categorys.Distances[this.category] + 200;
					break;
				default:
					break;
			}
		},
		_Defense: function(){
			if (BulletBase.collection.length > 0) {
				const match1 = PlayerBulAim.intersectStrict(this.around);
				const match2 = BulAim.intersectStrict(this.around);
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
										if (Search(c, this, 60, escRange[1])) {
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
					if(this.life == 1)this.fireLate = 16;
					this.distance = Categorys.Distances[this.category] + 200;
				}
			} else {
				if (this.bulReloadTime < this.reload) {
					this.bulReloadTime++;
					if (this.shotNGflg == false) this.shotNGflg = true;
				} else {
					if (bullets[this.num] == 0){
						this.shotNGflg = false;
						this.bulReloadFlg = false;
						this.bulReloadTime = 0;
						if (this.life == 1) this.distance = Categorys.Distances[this.category] + 160;
						else if (this.life == 2) this.distance = Categorys.Distances[this.category] + 64;
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
			if(gameMode == 2)
				this.weak.scale(0.6, 0.6);

			this.around = new InterceptAround(this);
			this.front = new InterceptFront(this.cannon);

			this.target = tankEntity[0];

			this.around.scale(1.5, 1.5);

			//this.weak.backgroundColor = 'blue';

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
				if (self.grid[self.myPath[0] - 1][self.myPath[1]] == 'Obstacle') dir.push(0);
				if (self.grid[self.myPath[0]][self.myPath[1] + 1] == 'Obstacle') dir.push(1);
				if (self.grid[self.myPath[0] + 1][self.myPath[1]] == 'Obstacle') dir.push(2);
				if (self.grid[self.myPath[0]][self.myPath[1] - 1] == 'Obstacle') dir.push(3);
				if (self.grid[self.myPath[0] - 1][self.myPath[1] + 1] == 'Obstacle') dir.push(4);
				if (self.grid[self.myPath[0] + 1][self.myPath[1] + 1] == 'Obstacle') dir.push(5);
				if (self.grid[self.myPath[0] + 1][self.myPath[1] - 1] == 'Obstacle') dir.push(6);
				if (self.grid[self.myPath[0] - 1][self.myPath[1] - 1] == 'Obstacle') dir.push(7);
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
													this.grid[i][j] = 'Start';
												} else if (i == this.targetPath[0] && j == this.targetPath[1]) {
													this.grid[i][j] = 'Goal';
												} else {
													//  StartやGoalの位置が更新されている場合の処理
													if (this.map.collisionData[i][j] == 0 || this.map.collisionData[i][j] == 5) {
														this.grid[i][j] = 'Empty';
													} else {
														this.grid[i][j] = 'Obstacle';
													}
												}
											}
										}

										this.root = findShortestPath([this.myPath[0], this.myPath[1]], this.grid, scene);
										//this.root = getPathToGoalOrVisibleTile([this.myPath[0], this.myPath[1]], [this.targetPath[0], this.targetPath[1]], grid, this.map, scene);
										if (this.root[0] == "East") {
											this.dirValue = 1;
											if (this.root[1] == "North" && this.grid[this.myPath[0] - 1][this.myPath[1] + 1] != 'Obstacle') {
												this.dirValue = 4;
											} else if (this.root[1] == "South" && this.grid[this.myPath[0] + 1][this.myPath[1] + 1] != 'Obstacle') {
												this.dirValue = 5;
											}
										} else if (this.root[0] == "West") {
											this.dirValue = 3;
											if (this.root[1] == "North" && this.grid[this.myPath[0] - 1][this.myPath[1] - 1] != 'Obstacle') {
												this.dirValue = 7;
											} else if (this.root[1] == "South" && this.grid[this.myPath[0] + 1][this.myPath[1] - 1] != 'Obstacle') {
												this.dirValue = 6;
											}
										} else if (this.root[0] == "North") {
											this.dirValue = 0;
											if (this.root[1] == "East" && this.grid[this.myPath[0] - 1][this.myPath[1] + 1] != 'Obstacle') {
												this.dirValue = 4;
											} else if (this.root[1] == "West" && this.grid[this.myPath[0] - 1][this.myPath[1] - 1] != 'Obstacle') {
												this.dirValue = 7;
											}
										} else if (this.root[0] == "South") {
											this.dirValue = 2;
											if (this.root[1] == "East" && this.grid[this.myPath[0] + 1][this.myPath[1] + 1] != 'Obstacle') {
												this.dirValue = 5;
											} else if (this.root[1] == "West" && this.grid[this.myPath[0] + 1][this.myPath[1] - 1] != 'Obstacle') {
												this.dirValue = 6;
											}
										}
									}
									if (this.root == false) rootFlg = true;
								}
							}

							this.time++;

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

							if (EnemyAim.intersectStrict(this.cursor).length > 0){
								if (!this.fireFlg)this.fireFlg = true; //  発射可能状態にする
								if (!rootFlg) rootFlg = true;
							}

							if (this.ref > 0) {
								if (this.front.intersectStrict(RefObstracle).length > 0) this.shotNGflg = true;
							}

							if (this.time % 3 == 0) {
								if (this.attackTarget != this.target && !this.escapeFlg) this.attackTarget = this.target;
								this.escapeFlg = false;
							}

							this._Defense();
							/*if (BulletBase.collection.length > 0) {
								const match1 = PlayerBulAim.intersectStrict(this.around);
								const match2 = BulAim.intersectStrict(this.around);
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
							}*/

							this._Reload();
							/*if (this.bulReloadFlg == false) {
								if (bullets[this.num] == this.bulMax) this.bulReloadFlg = true;
							} else {
								if (this.bulReloadTime < this.reload) {
									this.bulReloadTime++;
									if (this.shotNGflg == false) this.shotNGflg = true;
								} else {
									if (bullets[this.num] == 0){
										this.shotNGflg = false;
										this.bulReloadFlg = false;
										this.bulReloadTime = 0;
									}
								}

							}*/

							if (!this.shotNGflg && !this.bomSetFlg) {
								if (this.time % this.fireLate == 0 && this.fireFlg) {
									if (bulStack[this.num][Math.floor(Math.random() * this.bulMax)] == false) {
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
										//SelDirection(this.weak, this.escapeTarget, 0);
										this.dirValue = Escape_Rot8(this, this.escapeTarget, this.dirValue);
									} else {
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
										if (Bom.collection.length > 0) {
											for (var i = 0, l = Bom.collection.length; i < l; i++) {
												let c = Bom.collection[i];
												if (Math.sqrt(Math.pow(this.weak.x - c.x, 2) + Math.pow(this.weak.y - c.y, 2)) < 200) {
													SelDirection(this, c, 0);
													//this.dirValue = Escape_Rot8(this, c, this.dirValue);
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
								//rootFlg = true;
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
					for (let i = 0; i < this.bulMax; i++) {
						if (bulStack[this.num][i] == false) { //  弾の状態がoffならば
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
				const match1 = PlayerBulAim.intersectStrict(this.around);
				const match2 = BulAim.intersectStrict(this.around);
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
					if (bullets[this.num] == 0){
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
				image.context.fillStyle = '#0008';
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
			this.moveTo(v.x, v.y);
			this.backgroundColor = '#ff0';
			this.opacity = 1.0;
			this.scale(10.0, 10.0);
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

			this.width = PixelSize * 8;
			this.height = 48;
			this.moveTo(PixelSize * 6, PixelSize * 14);
			this.text = '敵残数：' + (tankEntity.length - 1 - destruction) + '　　　残機：' + zanki;
			this.font = 'bold 40px "Arial"';
			this.color = '#fffd';
			this.textAlign = 'center';

			this.onenterframe = function() {
				if (WorldFlg) {
					this.time++;
					if (this.time % 6 == 0) {
						this.text = '敵残数：' + (tankEntity.length - 1 - destruction) + '　　　残機：' + zanki;
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
						dsc.text = '難易度：狂気的<br>Hardモードのステータス強化に加えて、敵の当たり判定が小さくなったモード。';
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

	var TestText = Class.create(Entity, {
		initialize: function() {
			Entity.call(this);
			this._element = document.createElement('p');
			this._element.innerHTML = 'Test';
			this._element.style.color = 'white';
			this.x = 10;
			this.y = 50;
			this._element.style.font = '48px sans-serif';
			now_scene.addChild(this);
		}
	})

	var TestButton = Class.create(Button, {
		initialize: function() {
			Button.call(this, "ボタン", "light");
			this.tag = "ボタン";
			this.width = 256;
			this.height = 32;
			this.moveTo(300, 300);
			now_scene.addChild(this);
		}
	})

	var InputForm = Class.create(Entity, {
		initialize: function() {
			Entity.call(this);
			this._element = document.createElement('input');
			this._element.setAttribute('type', 'text');
			this._element.setAttribute('maxlength', '10');
			this._element.setAttribute('id', 'test');
			this._element.setAttribute('value', 'test');
			this.width = 100;
			this.height = 20;
			this.x = 10;
			this.y = 50;

			//console.log(this._element.value);

			now_scene.addChild(this);
		},
		_delete: function() {
			now_scene.removeChild(this);
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
		initialize: function() {
			Scene.call(this);
			this.backgroundColor = '#cacaca';
			this.time = 0;
			now_scene = this;

			var flg = false;
			var orFlg = 0;

			let area = new SetArea({ x: 0, y: 0 }, 'Title');

			var toPlay = new ViewText(area.head, 'Play', { width: 48 * 8, height: 48 }, { x: PixelSize * 5, y: PixelSize * 3 }, '➡　はじめから', '48px sans-serif', '#ebe799', 'left', true);
			var toContinue = new ViewText(area.head, 'Continue', { width: 48 * 8, height: 48 }, { x: PixelSize * 5, y: PixelSize * 4.5 }, '➡　つづきから', '48px sans-serif', '#ebe799', 'left', true);
			var toMode = new ViewText(area.head, 'Mode', { width: 48 * 12, height: 48 }, { x: PixelSize * 5, y: PixelSize * 6 }, '➡　ゲームモード選択', '48px sans-serif', '#ebe799', 'left', true);
			new ViewText(area.head, 'Mode', { width: 280, height: 40 }, { x: PixelSize * 5 + 80, y: PixelSize * 7 }, '現在のモード：', '40px sans-serif', '#ebe799', 'left', true);
			var nowMode = new ViewText(area.head, 'Mode', { width: 200, height: 40 }, { x: PixelSize * 9.5 + 80, y: PixelSize * 7 }, 'ノーマル', '40px sans-serif', '#ebe799', 'left', true);
			var toList = new ViewText(area.head, 'Mode', { width: 48 * 8, height: 48 }, { x: PixelSize * 5, y: PixelSize * 8.25 }, '➡　戦車一覧へ', '48px sans-serif', '#ebe799', 'left', true);
			//var toList = new ViewButton(area.head, 'Mode', {width: 48 * 8, height: 48}, {x: PixelSize * 5, y: PixelSize * 8.25}, '➡　戦車一覧へ', '48px sans-serif', '#ebe799', 'left', 'rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0)');

			//new TestSurface(this);

			toPlay.addEventListener(Event.TOUCH_START, function() {
				if (!ActiveFlg) {

					Repository.keyName = key;
					Repository.restore();
					if (Repository.data.StageNum > 0) {
						if (confirm("\r\n保存されている進行状況が存在しています。\r\n進行状況をリセットして始めますか？")) {
							Repository.remove();
							Repository.keyName = key;
							Repository.restore();
							flg = true;
							orFlg = 1;
							BGM.stop();
							titleFlg = false;
							new FadeOut(now_scene)
						}
					} else {
						flg = true;
						orFlg = 1;
						BGM.stop();
						titleFlg = false;
						new FadeOut(now_scene)
					}
				}
			});

			toContinue.addEventListener(Event.TOUCH_START, function() {
				Repository.keyName = key;
				Repository.restore();
				if (Repository.data.StageNum == 0) {
					alert("保存されているデータはありません。")
				} else {
					stageNum = Repository.data.StageNum;
					zanki = Repository.data.Zanki;
					colors = Repository.data.Scores;
					gameMode = Repository.data.Level;
					playerType = Repository.data.Type;
					stageRandom = Repository.data.Pattern;
					colors.forEach(elem => {
						score += elem;
					});

					let script = document.createElement("script");
					script.src = stagePath[stageNum];
					script.id = 'stage_' + (stageNum);
					head[0].appendChild(script);
					flg = true
					orFlg = 1;
					BGM.stop()
					titleFlg = false;
					new FadeOut(now_scene)
				}
			});

			toList.addEventListener(Event.TOUCH_START, function() {
				if (!ActiveFlg) {
					flg = true;
					orFlg = 3;
					new FadeOut(now_scene);
				}
			});

			function Mode_Change(label) {
				switch (gameMode) {
					case -1:
						label.text = 'Easy';
						label.color = '#ebe799';
						break;
					case 0:
						label.text = 'Normal';
						label.color = '#ebe799';
						break;
					case 1:
						label.text = 'Hard';
						label.color = '#ebe799';
						break;
					case 2:
						label.text = 'Insanity';
						label.color = '#ebe799';
						break;
				}
			}

			toMode.addEventListener(Event.TOUCH_START, function() {
				if (!ActiveFlg) {
					new SelWindow({ x: PixelSize * 2.5, y: PixelSize * 4 }, 'Mode');
				}
			})

			this.onenterframe = function() {
				game.time++;
				if (game.time % 12 == 0) {
					Mode_Change(nowMode);
				}
				if (titleFlg == true && BGM.currentTime == BGM.duration) {
					BGM.play();
				}
				if (flg == true) {

					this.time++;

					if (this.time == 30) {
						//BGM.play();
						this._Remove();
						game.time = 0;

						switch (orFlg) {
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
					if (changePermitNum[selCnt] == 99){
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
					image.context.fillStyle = '#0008';
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

			/*c.addEventListener(Event.TOUCH_START, function(){
				if(selCnt != -1)TankColorChange(selCnt,false);
				selCnt = c.category;
				ResetText();
				TankColorChange(selCnt,true);
			})*/

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
		initialize: function() {
			Scene.call(this);
			this.backgroundColor = "white";
			this.time = 0;

			now_scene = this;

			const onHidden = () => { 
				if (document.hidden) {
					// ★ 既存の条件を満たすときだけポーズ 
					if (gameStatus == 0 && game.time > 250) {
						// ★ PauseScene が重複しないようにチェック 
						if (!(game.currentScene instanceof PauseScene)) { 
							new PauseScene();
						} 
					} 
				} 
			};
			// ★ TestScene が開始されたときだけイベント登録 
			this.addEventListener("enter", () => { 
				document.addEventListener("visibilitychange", onHidden); 
			}); 
			// ★ TestScene を抜けたらイベント解除（重要） 
			this.addEventListener("exit", () => { 
				document.removeEventListener("visibilitychange", onHidden); 
			});

			stageData = LoadStage()[stageRandom]; //ステージ情報引き出し

			var world = new PhysicsWorld(0, 0);

			this.MarkGroup = new Group();
			this.BomGroup = new Group();
			this.TankGroup = new Group();
			this.BulletGroup = new Group();
			this.FireGroup = new Group();
			this.CannonGroup = new Group();
			this.BlockGroup = new Group();
			this.SparkGroup = new Group();

			this.backgroundMap = new MainMap(this);

			var fy = 0;
			var fx = 0;

			this.grid = [];

			walls[0] = new Wall(18, 1, 1, 1, 'Top', this);
			walls[1] = new Wall(18, 1, 1, 14, 'Bottom', this);
			walls[2] = new Wall(1, 13, 0, 1, 'Left', this);
			walls[3] = new Wall(1, 13, 19, 1, 'Right', this);

			/* 壁の当たり判定設置 */
			this.backgroundMap.collisionData.forEach(colI => {
				this.grid[fy] = []
				colI.forEach(colJ => {
					switch (colJ) {
						case 0:
							this.grid[fy][fx] = 'Empty';
							break;
						case 1:
							walls.push(new Wall(1, 1, fx, fy, 'block', this));
							this.grid[fy][fx] = 'Obstacle';
							break;
						case 2:
							avoids.push(new Avoid(fx, fy, this));
							this.grid[fy][fx] = 'Obstacle';
							break;
						case 3:
							holes.push(new Hole(fx, fy, this))
							this.grid[fy][fx] = 'Obstacle';
							break;
						case 4:
							this.grid[fy][fx] = 'Obstacle';
							break;
						case 5:
							blocks.push(new Block(fx, fy, this));
							this.grid[fy][fx] = 'Obstacle';
							break;
					}
					fx++;
				});
				fy++;
				fx = 0;
			});

			this.addChild(this.MarkGroup);
			this.addChild(this.BomGroup);
			this.addChild(this.TankGroup);
			this.addChild(this.BulletGroup);
			this.addChild(this.FireGroup);
			this.addChild(this.CannonGroup);
			this.addChild(this.SparkGroup);
			this.addChild(this.BlockGroup);


			let filterMap = new FillterMap(this);
			//if (DebugFlg) filterMap.opacity = 0;

			SetObs(this, this.backgroundMap.collisionData);
			SetRefs(this, this.backgroundMap.collisionData);

			tankEntity.push(new Entity_Type0(stageData[3][0], stageData[3][1], playerType, 0, this));

			for (let i = 4; i < Object.keys(stageData).length; i++) {
				if ((Math.floor(Math.random() * 10) == 0 && stageNum > 10 && i == 4 && stageNum % 5 != 4) || stageData[i][2] == 11) stageData[i][2] = 11;
				if (!retryFlg) {
					switch (stageData[i][2]) {
						case 0:
						case 8:
							tankEntity.push(new Entity_Type10(stageData[i][0], stageData[i][1], stageData[i][2], i - 3, this));
							break;
						case 1:
						case 6:
							tankEntity.push(new Entity_Type5(stageData[i][0], stageData[i][1], stageData[i][2], i - 3, this));
							break;
						case 2:
						case 4:
							tankEntity.push(new Entity_Type1(stageData[i][0], stageData[i][1], stageData[i][2], i - 3, this));
							break;
						case 3:
						case 7:
							tankEntity.push(new Entity_Type2(stageData[i][0], stageData[i][1], stageData[i][2], i - 3, this));
							break;
						case 5:
							tankEntity.push(new Entity_Type3(stageData[i][0], stageData[i][1], stageData[i][2], i - 3, this));
							break;
						case 9:
							tankEntity.push(new Entity_Type4(stageData[i][0], stageData[i][1], stageData[i][2], i - 3, this));
							break;
						case 10:
							tankEntity.push(new Entity_Type6(stageData[i][0], stageData[i][1], stageData[i][2], i - 3, this));
							break;
						case 11:
							tankEntity.push(new Entity_Type7(stageData[i][0], stageData[i][1], stageData[i][2], i - 3, this));
							break;
						case 12:
							tankEntity.push(new Entity_Type8(stageData[i][0], stageData[i][1], stageData[i][2], i - 3, this));
							break;
						case 13:
							tankEntity.push(new Entity_Type9(stageData[i][0], stageData[i][1], stageData[i][2], i - 3, this));
							break;
					}
					tankColorCounts[stageData[i][2]]++;
				} else {
					if (deadTank[i - 3] == false) {
						switch (stageData[i][2]) {
							case 0:
							case 8:
								tankEntity.push(new Entity_Type10(stageData[i][0], stageData[i][1], stageData[i][2], i - 3, this));
								break;
							case 1:
							case 6:
								tankEntity.push(new Entity_Type5(stageData[i][0], stageData[i][1], stageData[i][2], i - 3, this));
								break;
							case 2:
							case 4:
								tankEntity.push(new Entity_Type1(stageData[i][0], stageData[i][1], stageData[i][2], i - 3, this));
								break;
							case 3:
							case 7:
								tankEntity.push(new Entity_Type2(stageData[i][0], stageData[i][1], stageData[i][2], i - 3, this));
								break;
							case 5:
								tankEntity.push(new Entity_Type3(stageData[i][0], stageData[i][1], stageData[i][2], i - 3, this));
								break;
							case 9:
								tankEntity.push(new Entity_Type4(stageData[i][0], stageData[i][1], stageData[i][2], i - 3, this));
								break;
							case 10:
								tankEntity.push(new Entity_Type6(stageData[i][0], stageData[i][1], stageData[i][2], i - 3, this));
								break;
							case 11:
								tankEntity.push(new Entity_Type7(stageData[i][0], stageData[i][1], stageData[i][2], i - 3, this));
								break;
							case 12:
								tankEntity.push(new Entity_Type8(stageData[i][0], stageData[i][1], stageData[i][2], i - 3, this));
								break;
							case 13:
								tankEntity.push(new Entity_Type9(stageData[i][0], stageData[i][1], stageData[i][2], i - 3, this));
								break;
						}
						tankColorCounts[stageData[i][2]]++;
					} else {
						tankEntity.push(new Sprite({ width: 1, height: 1, x: -100, y: -100 }));
						bullets.push(0); //  発射済み弾数カウントリセット
						bulStack.push([]);
						boms.push(0); //  設置済み爆弾カウントリセット
						deadFlgs.push(true);
						destruction++;
					}
				}
			}

			//let area = new SetArea({x: 0, y: 0}, 'Test');

			//let inp = new InputForm();

			var area;

			new PlayerLabel(tankEntity[0]);

			new FadeIn(this);
			new ViewCountDown();
			var dcnt = 1;
			var skipcnt = 0;

			var remaining = new ViewRemaining();
			var pauseText = new ViewText(this, 'Pause', {width: 28*13.5, height: 28}, {x: 32, y: 16}, '', 'bold 28px sans-serif', 'white', 'left', false);
			if (navigator.userAgent.match(/iPhone|iPad|Android/)) {
				pauseText.text = 'PAUSEボタンで一時停止';
			}else{
				pauseText.text = 'Escキーで一時停止';
			}

			BGM = game.assets['./sound/start.mp3'];
			BGM.play();
			BGM.volume = 0.2;

			let chgBgm = false;



			this.onenterframe = function() {
				game.time++;


				if (tankColorCounts[13] > 0) BNum = 12
				else if (tankColorCounts[12] > 0) BNum = 11
				else if (tankColorCounts[11] > 0) BNum = 10
				else if (tankColorCounts[8] > 0) BNum = 7
				else if (tankColorCounts[6] > 0) BNum = 5
				else if (tankColorCounts[10] > 0) BNum = 9
				else if (tankColorCounts[9] > 0) BNum = 8
				else if (tankColorCounts[7] > 0) BNum = 6
				else if (tankColorCounts[5] > 0) BNum = 4
				else if (tankColorCounts[4] > 0) BNum = 3
				else if (tankColorCounts[3] > 0) BNum = 2
				else if (tankColorCounts[2] > 0) BNum = 1
				else BNum = 0

				if (game.time == 210 && (complete == false && victory == false && defeat == false && resultFlg == false)) {
					WorldFlg = true;
					remaining._Add();
					new ViewMessage(this, 'Message', { width: 640, height: 64 }, { x: PixelSize * 5, y: PixelSize * 6 }, 'S T A R T', 'bold 64px "Arial"', 'yellow', 'center', 60);
					/*var pauseText = new ViewText(this, 'Pause', { width: 28 * 13.5, height: 28 }, { x: 32, y: 16 }, '', 'bold 28px sans-serif', 'white', 'left', true);
					if (navigator.userAgent.match(/iPhone|iPad|Android/)) {
						pauseText.text = 'PAUSEボタンで一時停止';
					} else {
						pauseText.text = 'Escキーで一時停止';
					}*/
					pauseText._Output();
				}

				if (gameStatus == 0) {
					if (BGM.currentTime == BGM.duration) {
						BGM = game.assets[BGMs[BNum]];
						BGM.currentTime = 0;
						BGM.play();
						if (game.time > 250) BGM.currentTime = 0.01;
					}
				}

				if (WorldFlg) {
					world.step(game.fps);
					this.time++;

					if (inputManager.checkButton("Start") == inputManager.keyStatus.DOWN && gameStatus == 0 && game.time > 250) {
						new PauseScene();
					}

					if (!resultFlg) {
						if (gameStatus == 0) {
							if (destruction == tankEntity.length - 1 && zanki > 0 && !deadFlgs[0]) {
								BGM.stop();
								for (var i = 4; i < Object.keys(stageData).length; i++) {
									colors[stageData[i][2]] += 1;
								}
								let script = document.createElement("script");
								script.src = stagePath[stageNum + 1];
								script.id = 'stage_' + (stageNum + 1);
								head[0].appendChild(script);
								gameStatus = 1;
								if (stageNum % 20 == 19) {
									this.removeChild(remaining);
									this.removeChild(pauseText);
									complete = true;

									resultFlg = true;
									score += destruction;
									this.time = 0;
									area = new SetArea({ x: 0, y: 0 }, 'Result');
									new ViewText(area.head, 'Title', { width: 784, height: 60 }, { x: 146, y: 64 }, 'ミッションコンプリート！', 'bold 60px "Arial"', 'yellow', 'center', true);
								} else {
									victory = true;
									this.time = 0;
									new ViewText(this, 'Title', { width: 720, height: 64 }, { x: 360, y: 300 }, 'ミッションクリア！', 'bold 60px "Arial"', 'red', 'left', true);
									new ViewScore(this);
								}
								if(TotalRepository.data.ClearStageNum < stageNum){
									TotalRepository.data.ClearStageNum = stageNum;
									TotalRepository.save();
								}
							} else if (deadFlgs[0]) {
								BGM.stop();
								defeat = true;
								gameStatus = 2;
								if (zanki <= 0) {
									this.removeChild(remaining);
									this.removeChild(pauseText);
									for (var i = 4; i < Object.keys(stageData).length; i++) {
										if (deadFlgs[i - 3]) {
											colors[stageData[i][2]] += 1;
										}
									}
									resultFlg = true;
									score += destruction
									this.time = 0;
									area = new SetArea({ x: 0, y: 0 }, 'Result');
									new ViewText(area.head, 'Title', { width: 784, height: 60 }, { x: 146, y: 64 }, 'ミッション終了！', 'bold 60px "Arial"', 'yellow', 'center', true);
								} else {
									this.time = 0;
								}
							}
						} else if (gameStatus == 1) {
							if (this.time == 15) {
								BGM = game.assets['./sound/success.mp3'].play();
							}
							if (this.time == 150) {
								new FadeOut(this);
							}
							if (this.time == 180) {
								retryFlg = false;
								score += destruction
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
						} else if (gameStatus == 2) {
							if (this.time == 15) {
								BGM = game.assets['./sound/failed.mp3'].play();
							}
							if (this.time == 150) {
								new FadeOut(this)
							}
							if (this.time == 180) {
								retryFlg = true;
								this._Remove();
								game.replaceScene(new StartScene());
							}
						}
					} else {
						if (this.time == 15) {
							BGM = game.assets['./sound/end.mp3'];
							BGM.play()
							chgBgm = true;
						} else if (this.time > 100 && chgBgm == true && BGM.currentTime == BGM.duration) {
							BGM.currentTime = 0;
							BGM.stop();
							BGM = game.assets['./sound/result.mp3'];
							BGM.currentTime = 0;
							BGM.play();
							chgBgm = false;
						} else if (this.time > 100 && chgBgm == false && BGM.currentTime == BGM.duration) {
							BGM = game.assets['./sound/result.mp3'];
							BGM.currentTime = 0;
							BGM.play();
						}
						if (this.time == 120) {
							new ViewFrame(area.body, 'Result', area.type.Body.size, { x: 0, y: 0 }, area.type.Body.color);
							new ViewFrame(area.body, 'Back', { width: 460, height: 56 * 13.5 }, { x: 0, y: 0 }, '#dd9');
						}
						if (this.time >= 120 && this.time % 15 == 0 && dcnt + skipcnt < colors.length) {
							while(colors[dcnt + skipcnt] == 0 && dcnt + skipcnt < colors.length-1){
								skipcnt++;
							}
							if (colors[dcnt + skipcnt] > 0) {
								new ViewText(area.body, 'Name', { width: 280, height: 48 }, { x: 44, y: 52 * (dcnt) - 32 }, colorsName[dcnt + skipcnt], '48px "Arial"', fontColor[dcnt + skipcnt], 'left', true);
								new ViewText(area.body, 'Score', { width: 180, height: 48 }, { x: 324, y: 52 * (dcnt) - 32 }, '：' + colors[dcnt + skipcnt], '48px "Arial"', '#400', 'left', true);
							}
							dcnt++;
						}
						if (this.time == 120 + 15 * (dcnt + 3)) {
							if (defeat) {
								new ViewText(area.body, 'Score', { width: 570, height: 64 }, { x: 520, y: 220 }, '撃破数：' + (score), 'bold 64px "Arial"', '#622', 'left', true);
							} else {
								new ViewText(area.body, 'Score', { width: 570, height: 64 }, { x: 520, y: 220 }, '撃破数+残機：' + (score + zanki), 'bold 64px "Arial"', '#622', 'left', true);
							}

						}
						if (this.time >= 120 + 15 * (dcnt + 5)) {
							retryFlg = false;
							deadTank = [false];
							var toTitle = new ViewText(area.body, 'toTitle', { width: 520, height: 48 }, { x: 620, y: 570 }, '➡タイトル画面へ', '40px "Arial"', '#400', 'center', false);
							var toProceed = new ViewText(area.body, 'toProceed', { width: 520, height: 48 }, { x: 620, y: 670 }, '➡さらなるステージへ...', '40px "Arial"', 'red', 'center', false);

							if (this.time == 120 + 15 * (dcnt + 5)) {
								this.addChild(toTitle)
								if (stageNum != (stagePath.length - 1) && defeat == false) {
									this.addChild(toProceed)
								}
							}
							toTitle.addEventListener(Event.TOUCH_START, function() {

								game.stop();
								location.href = "./game.html";
							});
							toProceed.addEventListener(Event.TOUCH_START, function() {
								complete = false;
								BGM.stop()

								new FadeOut(now_scene)
								stageNum++;

								now_scene._Remove();

								game.replaceScene(new StartScene());
							});
						}
					}
					if (collisionUpdates.length > 0) {
						collisionUpdates.forEach(u => {
							now_scene.backgroundMap.collisionData[u.y][u.x] = u.value;
						});
						collisionUpdates = [];

						const children = now_scene.childNodes.slice().filter(child => child instanceof RefObstracle); // enchant.jsでは childNodes は配列風
						children.forEach(child => {
							now_scene.removeChild(child);
						});
						// まとめて参照更新
						SetRefs(now_scene, now_scene.backgroundMap.collisionData);
					}
				}

			}
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
				new ViewText(this, 'Move', { width: PixelSize * 8, height: PixelSize * 0.5 }, { x: PixelSize * 0.5, y: PixelSize * 14 }, '一時停止：Pauseボタン', '28px sans-serif', 'white', 'left', true);

				new ViewText(this, 'Move', { width: PixelSize * 11, height: PixelSize * 0.5 }, { x: PixelSize * 9, y: PixelSize * 11 }, '※補足説明', '28px sans-serif', 'white', 'left', true);
				new ViewText(this, 'Move', { width: PixelSize * 11, height: PixelSize * 0.5 }, { x: PixelSize * 9, y: PixelSize * 11.75 }, '・ステージ上にある茶色の壁は爆弾でしか壊せません。', '28px sans-serif', 'white', 'left', true);
				new ViewText(this, 'Move', { width: PixelSize * 11, height: PixelSize * 0.5 }, { x: PixelSize * 9, y: PixelSize * 12.5 }, '・爆弾の爆発は、戦車の耐久を無視して撃破が可能。', '28px sans-serif', 'white', 'left', true);
				new ViewText(this, 'Move', { width: PixelSize * 11, height: PixelSize * 0.5 }, { x: PixelSize * 9, y: PixelSize * 13.25 }, '　サバイバルモードでは爆発に巻き込まれると即', '28px sans-serif', 'white', 'left', true);
				new ViewText(this, 'Move', { width: PixelSize * 11, height: PixelSize * 0.5 }, { x: PixelSize * 9, y: PixelSize * 14 }, '　ゲームオーバーになるため注意してください。', '28px sans-serif', 'white', 'left', true);
			} else {
				new ViewFrame(this, 'Pause', { width: PixelSize * 20, height: PixelSize * 4.5 }, { x: 0, y: PixelSize * 10.5 }, '#000000aa');
				new ViewText(this, 'Move', { width: PixelSize * 8, height: PixelSize * 0.5 }, { x: PixelSize * 0.5, y: PixelSize * 11 }, '　移動　：WASDキー　（斜め移動可）', '28px sans-serif', 'white', 'left', true);
				new ViewText(this, 'Move', { width: PixelSize * 8, height: PixelSize * 0.5 }, { x: PixelSize * 0.5, y: PixelSize * 11.75 }, '　照準　：マウス操作', '28px sans-serif', 'white', 'left', true);
				new ViewText(this, 'Move', { width: PixelSize * 8, height: PixelSize * 0.5 }, { x: PixelSize * 0.5, y: PixelSize * 12.5 }, '　砲撃　：左クリック', '28px sans-serif', 'white', 'left', true);
				new ViewText(this, 'Move', { width: PixelSize * 8, height: PixelSize * 0.5 }, { x: PixelSize * 0.5, y: PixelSize * 13.25 }, '爆弾設置：Eキー', '28px sans-serif', 'white', 'left', true);
				new ViewText(this, 'Move', { width: PixelSize * 8, height: PixelSize * 0.5 }, { x: PixelSize * 0.5, y: PixelSize * 14 }, '一時停止：Escキー', '28px sans-serif', 'white', 'left', true);

				new ViewText(this, 'Move', { width: PixelSize * 11, height: PixelSize * 0.5 }, { x: PixelSize * 9, y: PixelSize * 11 }, '※補足説明', '28px sans-serif', 'white', 'left', true);
				new ViewText(this, 'Move', { width: PixelSize * 11, height: PixelSize * 0.5 }, { x: PixelSize * 9, y: PixelSize * 11.75 }, '・ステージ上にある茶色の壁は爆弾でしか壊せません。', '28px sans-serif', 'white', 'left', true);
				new ViewText(this, 'Move', { width: PixelSize * 11, height: PixelSize * 0.5 }, { x: PixelSize * 9, y: PixelSize * 12.5 }, '・爆弾の爆発は、戦車の耐久を無視して撃破が可能。', '28px sans-serif', 'white', 'left', true);
				new ViewText(this, 'Move', { width: PixelSize * 11, height: PixelSize * 0.5 }, { x: PixelSize * 9, y: PixelSize * 13.25 }, '　サバイバルモードでは爆発に巻き込まれると即', '28px sans-serif', 'white', 'left', true);
				new ViewText(this, 'Move', { width: PixelSize * 11, height: PixelSize * 0.5 }, { x: PixelSize * 9, y: PixelSize * 14 }, '　ゲームオーバーになるため注意してください。', '28px sans-serif', 'white', 'left', true);
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
		if (DebugFlg) {
			game.debug();
		} else {
			game.start();
		}
	}

	/*function startFixedLoop(game) {
		// enchant.js の内部ループを止める
		game._requestNextFrame = function() {};

		var FIXED_FPS = 60;
		var FIXED_DT = 1000 / FIXED_FPS;
		var accumulator = 0;
		var lastTime = performance.now();

		// ラグ補正（200ms 以上溜まったら切り捨て） 
		const MAX_ACCUM = 200;

		// 補間用：各 Node に prevX, prevY を追加する 
		function storePrevPositions(scene) { 
			scene.childNodes.forEach(node => { 
				node.prevX = node.x; 
				node.prevY = node.y; 
			}); 
		} 
		// 補間適用：prev → curr を alpha で補間して描画 
		function applyInterpolation(scene, alpha) { 
			scene.childNodes.forEach(node => { 
				if (node.prevX !== undefined) { 
					node.x = node.prevX * (1 - alpha) + node.x * alpha; 
					node.y = node.prevY * (1 - alpha) + node.y * alpha; 
				} 
			}); 
		} 
		// 補間後に元に戻す（次の tick のため） 
		function restoreCurrentPositions(scene) { 
			scene.childNodes.forEach(node => { 
				if (node.prevX !== undefined) { 
					node.x = node.x; // currX のまま 
					node.y = node.y; 
				} 
			}); 
		}
		game._fixedTick = function() {
			var now = performance.now();
			var delta = now - lastTime;
			lastTime = now;

			accumulator += delta;

			// ラグが溜まりすぎたら切り捨てる 
			if (accumulator > MAX_ACCUM) { 
				accumulator = FIXED_DT; 
			}

			// ロジック更新前に現在位置を保存 
			if (game.currentScene) { 
				storePrevPositions(game.currentScene);
			}

			while (accumulator >= FIXED_DT) {
				game._tick();
				accumulator -= FIXED_DT;
			}

			// 補間係数（0〜1） 
			const alpha = accumulator / FIXED_DT;

			// 補間して描画 
			if (game._renderer && game.currentScene) { 
				applyInterpolation(game.currentScene, alpha); 
				game._renderer.render(game.currentScene); 
				restoreCurrentPositions(game.currentScene); 
			}
			requestAnimationFrame(game._fixedTick);
		};

		requestAnimationFrame(game._fixedTick);
	}*/

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

	if (canStart){
		//startFixedLoop(game);
	}
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