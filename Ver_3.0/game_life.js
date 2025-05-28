window.focus();
enchant();

const Cell = 4;
const Quarter = 16;
const PixelSize = Quarter * Cell;
const Stage_W = 20;
const Stage_H = 15;
const DebugFlg = false;

var key = "BTG_PlayData_Ver3";
var BGM;

var zanki = 5;
var gameMode = 0;
var score = 0;
var playerType = 0;
var playerLife = 0;

var stageNum = 0;
var stageData;

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
//var colors = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; //戦車の色を数える配列
var tankColorCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; //配色ごとの敵戦車残数格納配列
var colorsName = [ //各戦車の表示名格納配列
	"Player",	//0
	"Brown",	//1
	"Gray",		//2
	"Green",	//3
	"Red",		//4
	"LightGreen",//5
	"EliteGray ",//6
	"EliteGreen",//7
	"Snow",		//8
	"Pink",		//9
	"Sand",		//10
	"Black",	//11
	"Dazzle",	//12
	"Abysal"	//13
]
let fontColor = [ //各戦車の表示色格納配列
	'blue',
	'saddlebrown',
	'lightslategray',
	'lime',
	'red',
	'aquamarine',
	'darkslategray',
	'green',
	'lightcyan',
	'pink',
	'coral',
	'black',
	'maroon',
	'darkblue'
];

var BGMs = [ //bgm指定用配列
	'./sound/FIRST.mp3',	//brown
	'./sound/SECOND.mp3',	//gray
	'./sound/THIRD.mp3',	//green
	'./sound/FOURTH.mp3',	//red
	'./sound/THIRD.mp3',	//lightgreen
	'./sound/SEVENTH.mp3',	//elitegray
	'./sound/TENTH.mp3',	//elitegreen
	'./sound/SIXTH.mp3',	//snow
	'./sound/NINTH.mp3',	//pink
	'./sound/EIGHTH.mp3',	//sand
	'./sound/TENTH.mp3',	//black
	'./sound/ELEVENTH.mp3',	//dazzle
	'./sound/ELEVENTH.mp3'	//abysal
];

//---ステータス----------------------------------------------------------------------------
const Categorys = {
    Image: [
        {tank: './image/ObjectImage/tank2.png', cannon: './image/ObjectImage/cannon.png'},          		//player
        {tank: './image/ObjectImage/brown.png', cannon: './image/ObjectImage/browncannon.png'},     		//brown
        {tank: './image/ObjectImage/gray.png', cannon: './image/ObjectImage/graycannon.png'},       		//gray
        {tank: './image/ObjectImage/green.png', cannon: './image/ObjectImage/greencannon.png'},     		//green
        {tank: './image/ObjectImage/red.png', cannon: './image/ObjectImage/redcannon.png'},         		//red
		{tank: './image/ObjectImage/lightgreen.png', cannon: './image/ObjectImage/lightgreencannon.png'},   //lightgreen
    	{tank: './image/ObjectImage/elite.png', cannon: './image/ObjectImage/elitecannon.png'},              //elitegray
		{tank: './image/ObjectImage/elitegreen.png', cannon: './image/ObjectImage/elitegreencannon.png'},   //elitegreen
		{tank: './image/ObjectImage/snow.png', cannon: './image/ObjectImage/snowcannon.png'},               //snow
		{tank: './image/ObjectImage/pink.png', cannon: './image/ObjectImage/pinkcannon.png'},               //pink
		{tank: './image/ObjectImage/sand.png', cannon: './image/ObjectImage/sandcannon.png'},               //sand
		{tank: './image/ObjectImage/abnormal.png', cannon: './image/ObjectImage/abnormalcannon.png'},       //black
		{tank: './image/ObjectImage/meisai.png', cannon: './image/ObjectImage/meisaicannon.png'},           //dazzle
		{tank: './image/ObjectImage/Abyssal.png', cannon: './image/ObjectImage/AbyssalCannon.png'}          //abysal
    ],
    Life: [
        50,  //Player
        10,  //brown
        18,  //gray
        15,  //green
        20,   //red
		32, //lightgreen
		28,  //elitegray
		10,//elitegreen
		23, //snow
		42, //pink
		30, //sand
		20, //random
		50,  //dazzle
		60	//abysal
    ],
    MaxBullet: [
        5, //Player
        1, //brown
        2, //gray
        1, //green
        5, //red
		3, //lightgreen
		4,  //elitegray
		3, //elitegreen
		2, //snow
		6, //pink
		3, //sand
		1, //random
		5, //dazzle
		4	//abysal
    ],
    MaxRef: [
        1,  //Player
        1,  //brown
        1,  //gray
        0,  //green
        0,  //red
		2, //lightgreen
		1,  //elitegray
		2, //elitegreen
		1, //snow
		0, //pink
		0, //sand
		0, //random
		1, //dazzle
		0	//abysal
    ],
    ShotSpeed: [
        10, //Player
        8,  //brown
        8,  //gray
        16, //green
        10, //red
		11,	//lightgreen
		12,  //elitegray
		18, //elitegreen
		14, //snow
		11, //pink
		12, //sand
		23, //random
		13, //dazzle
		13	//abysal
    ],
	FireLate: [
		0, //Player
        30, //brown
        40, //gray
        25, //green
        20, //red
		30,	//lightgreen
		24,  //elitegray
		10, //elitegreen
		30, //snow
		6, //pink
		23, //sand
		10, //random
		30, //dazzle
		24	//abysal
	],
	MaxBom: [
		2, //Player
        0, //brown
        0, //gray
        0, //green
        0,  //red
		0,	//lightgreen
		0,  //elitegray
		0, //elitegreen
		0, //snow
		0, //pink
		1, //sand
		0, //random
		0, //dazzle
		0	//abysal
	],
    MoveSpeed: [
        2.4,    //Player
        0.0,    //brown
        1.0,    //gray
        1.2,    //green
        2.0,     //red
		1.2, //lightgreen
		1.6, //elitegray
		0.0, //elitegreen
		1.2, //snow
		0.0, //pink
		2.6, //sand
		2.5, //random
		2.0, //dazzle
		3.0	 //abysal
    ],
	BodyRotSpeed: [
		15,		//Player
		5,		//brown
		10,		//gray
		10,		//green
		15,		//red
		10,		//lightgreen
		15,		//elitegray
		5, //elitegreen
		10, //snow
		10, //pink
		15,	//sand
		15,	//random
		10, //dazzle
		8	//abysal
	],
	CannonRotSpeed: [
		15,		//Player
		1.5,		//brown
		3,		//gray
		5,		//green
		8,		//red
		5,		//lightgreen
		8,		//elitegray
		1.2, //elitegreen
		5, //snow
		5, //pink
		10,	//sand
		1.5,	//random
		10, //dazzle
		15	//abysal
	],
    Reload: [
        10,      //Player
        12,     //brown
        120,    //gray
        120,    //green
        240,    //red
		300,	//lightgreen
		180,		//elitegray
		90, //elitegreen
		600, //snow
		180, //pink
		90, //sand
		90, //random
		210, //dazzle
		180	//abysal
    ],
    DefenceFlg: [
        [true, true, true],     //Player
        [false, false, false],  //brown
        [true, false, false],   //gray
        [true, true, true],     //green
        [true, false, false],    //red
		[true, true, true],     //lightgreen
        [true, true, true],    //elitegray
		[false, false, false], //elitegreen
		[true, true, true], //snow
		[false, false, false], //pink
		[true, false, false], //sand
		[true, false, true], //random
		[true, true, true], //dazzle
		[true, true, true] //abysal
    ],
    DefenceRange: [
        [0, 0, 0],          //Player
        [0, 0, 0],          //brown
        [300, 200, 0],        //gray
        [400, 200, 150],    //green
        [220, 0, 0],         //red
		[300, 200, 200], //lightgreen
		[360, 250, 200], //elitegray
		[0, 0, 0], //elitegreen
		[300, 200, 200], //snow
		[0, 0, 0], //pink
		[250, 0, 0], //sand
		[500, 0, 300], //random
		[250, 300, 200], //dazzle
		[300, 300, 300] //abysal
    ],
    EscapeRange: [
        [true, 0, 0, 0],        //Player
        [false, 0, 0, 0],       //brown
        [true, 200, 0, 0],      //gray
        [true, 300, 180, 120],  //green
        [true, 200, 0, 0],       //red
		[true, 200, 0, 0], //lightgreen
		[true, 320, 230, 180], //elitegray
		[false, 0, 0, 0], //elitegreen
		[true, 200, 200, 180], //snow
		[false, 0, 0, 0], //pink
		[true, 280, 0, 0], //sand
		[true, 400, 0, 280], //random
		[true, 240, 200, 160], //dazzle
		[true, 240, 200, 160] //abysal
    ],
    Distances: [
        0,      //Player
        0,      //brown
	    0,      //gray
	    300,    //green
	    0,       //red
		150, //lightgreen
		200, //elitegray
		0, //elitegreen
		300, //snow
		0, //pink
		150, //sand
		320, //random
		250, //dazzle
		300	//abysal
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
	'./stage/stage39.js',
];

class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    get Length() {
        return Math.sqrt( this.x * this.x + this.y * this.y );
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
	Copy(v){
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
	Normal(a, b){
		return b
			.Clone()
			.Subtract(a);
	}
    Normalize(){
        let ls = this.x * this.x + this.y + this.y;
        let invNorm = 1.0 / Math.sqrt(ls);
        return new Vector2(this.x * invNorm, this.y * invNorm);
    }
    Reflect(vector, normal){
        let dot = vector.x * normal.x + vector.y * normal.y;
        return new Vector2(vector.x - 2.0 * dot * normal.x, vector.y - 2.0 * dot * normal.y);
    }
	Equals(v){
		if(v !== Vector2){
			return false;
		}
		return this == v;
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


var delStageFile = function() {
	if (stageNum > 0) {
		for (let elem of head[0].childNodes) {
			if (elem.id == 'stage_' + (stageNum - 1)) {

				elem.remove();
			};
		};
	};
};

var Get_Center = function(obj){
    var pos = {x: obj.x + (obj.width / 2), y: obj.y + (obj.height / 2)};

    return pos;
};

var Get_Distance = function(from, to) {
    let vector = Pos_to_Vec(from, to);
    let magnitude = Get_Magnitude(vector);
    return magnitude;
};

var Get_Magnitude = function(vector) {
    let magnitude = Math.sqrt(vector.x**2 + vector.y**2);
    return magnitude;
};

var Pos_to_Vec = function(from, to) {
    let v1 = Get_Center(from);
    let v2 = Get_Center(to);
	let vector = {
		x: v1.x - v2.x,
		y: v1.y - v2.y
	};
	return vector;
};

var Vec_Distance = function(from, to) {
	let vector = {
		x: Math.pow(from.x - to.x, 2),
		y: Math.pow(from.y - to.y, 2)
	};

	return Math.sqrt(vector.x + vector.y);
}

var Vec_to_Rad = function(vector){
	let rad = Math.atan2(vector.y, vector.x);
	return rad;
}

var Rot_to_Rad = function(rot){
	if(Math.abs(rot) >= 360){
		rot = rot % 360;
	}
	if(rot < 0){
		rot = 360 + rot;
	}
	
    var rad = rot * (Math.PI / 180);

    return rad;
};

var Rad_to_Rot = function(rad){
    //var rot = rad / (Math.PI / 180);
	var rot = ((Math.atan2(Math.cos(rad), Math.sin(rad)) * 180) / Math.PI) * -1;

	if(Math.abs(rot) >= 360){
		rot = rot % 360;
	}
	if(rot < 0){
		rot = 360 + rot;
	}

    return rot;
};

var Rot_to_Vec = function(rot, add) {
	let newRot = (rot + add);

	if(Math.abs(newRot) >= 360){
		newRot = newRot % 360;
	}
	if(newRot < 0){
		newRot = 360 + newRot;
	}
	
	let rad = newRot * (Math.PI / 180.0);
	let vector = {
		x: Math.cos(rad) * 1,
		y: Math.sin(rad) * 1
	};
	return vector;
};

var Rad_to_Tan = function(rad){
	return Math.tan(rad);
}

var Get_RefPoint = function(from, to){
	let t2 = Get_Center(to);
	let v2 = Rot_to_Vec(to.rotation, 315);
	let rad2 = Math.atan2(-v2.x, -v2.y);

	let rect = from.getOrientedBoundingRect(),
	lt = {x: rect.leftTop[0], y: rect.leftTop[1]}, rt = {x: rect.rightTop[0], y: rect.rightTop[1]},
	lb = {x: rect.leftBottom[0], y: rect.leftBottom[1]}, rb = {x: rect.rightBottom[0], y: rect.rightBottom[1]},

	top = {x: rt.x - lt.x, y: rt.y - lt.y},
    right = {x: rb.x - rt.x, y: rb.y - rt.y},
	bottom = {x: lb.x - rb.x, y: lb.y - rb.y},
    left = {x: lt.x - lb.x, y: lt.y - lb.y};

	/*let lines = [
		[rt, lt],
		[lt, lb],
		[lb, rb],
		[rb, rt]
	];*/

	let lines = [
		top, right, bottom, left
	]

	let close = 9999;
	let closeNum = -1;

	for(let i = 0; i < 4; i++){
		let a = new Vector2().Distance(t2, lines[i]);
		if(close > a){
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
    }
    else {
        // めり込まないように補正
		return {x: point.x + n.x * 1, y: point.y + n.y * 1};
        to.x = point.x + n.x * 1;
        to.y = point.y + n.y * 1;
        // 反射ベクトル適用
        var r = Vector2.Reflect({x: to.dx, y: to.dy}, n);
        to.dx = r.x;
		to.dy = r.y;

    }
};

var Nearest = function(A, B, P){
	var a = new Vector2().Subtract(B, A);
    var b = new Vector2().Subtract(P, A);
    // 内積 ÷ |a|^2
    var r = Vector2.Dot(a, b) / a.LengthSquared();
	//var r = Vector2.Dot(a, b) / (a.x * a.x + a.y * a.y);

    if (r <= 0) return A;
    if (r >= 1) return B;

    return new Vector2(A.x + r * a.x, A.y + r * a.y);
}

var Hit_Reflection = function(from, to){
	let t1 = Get_Center(from);
	let t2 = Get_Center(to);

	let rect1 = from.getOrientedBoundingRect(),
	lt1 = {x: rect1.leftTop[0], y: rect1.leftTop[1]}, rt1 = {x: rect1.rightTop[0], y: rect1.rightTop[1]},
	lb1 = {x: rect1.leftBottom[0], y: rect1.leftBottom[1]}, rb1 = {x: rect1.rightBottom[0], y: rect1.rightBottom[1]},
	top1 = {x: rt1.x - lt1.x, y: rt1.y - lt1.y},
    right1 = {x: rb1.x - rt1.x, y: rb1.y - rt1.y},
	bottom1 = {x: lb1.x - rb1.x, y: lb1.y - rb1.y},
    left1 = {x: lt1.x - lb1.x, y: lt1.y - lb1.y};

	let rect2 = to.getOrientedBoundingRect(),
	lt2 = {x: rect2.leftTop[0], y: rect2.leftTop[1]}, rt2 = {x: rect2.rightTop[0], y: rect2.rightTop[1]},
	lb2 = {x: rect2.leftBottom[0], y: rect2.leftBottom[1]}, rb2 = {x: rect2.rightBottom[0], y: rect2.rightBottom[1]},
	top2 = {x: rt2.x - lt2.x, y: rt2.y - lt2.y},
    right2 = {x: rb2.x - rt2.x, y: rb2.y - rt2.y},
	bottom2 = {x: lb2.x - rb2.x, y: lb2.y - rb2.y},
    left2 = {x: lt2.x - lb2.x, y: lt2.y - lb2.y};

	let boundWidth = 0, boundHeight = 0;
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

/*var Hit_Reflection = function(from, to, addRot){

	let vector = Rot_to_Vec(from.rotation, addRot);
	let radian = Math.atan2(vector.x, vector.y);

	this.dx = Math.cos(this.rad) * 20;
	this.dy = Math.sin(this.rad) * 20;


	
	this.v = Rot_to_Vec(this.rotation, 315);
	this.f = Math.atan2(this.v.x, this.v.y);
	switch(elem.name){
		case 'RefTop':
			this.x = (this.x) - (Math.cos(this.f) * ((elem.y) - (this.y + this.height)));
			this.y = elem.y - (this.height);
			this.dy = this.dy * -1;
			break;
		case 'RefBottom':
			this.x = (this.x) - (Math.cos(this.f) * ((this.y - this.height/2) - (elem.y + elem.height)));
			this.y = elem.y + elem.height;
			this.dy = this.dy * -1;
			break;
		case 'RefLeft':
				this.y = (this.y) - (Math.sin(this.f) * ((this.x + this.width) - (elem.x)));
				this.x = elem.x - (this.width);
				this.dx = this.dx * -1;
				break;
		case 'RefRight':
				this.y = (this.y) - (Math.sin(this.f) * ((elem.x + elem.width) - (this.x + this.width)));
				this.x = elem.x + elem.width;
				this.dx = this.dx * -1;
				break;
	}
	this.ref--;
	this.rotation = (addRot + (Math.atan2(this.dx, this.dy) * 180) / Math.PI) * -1;
	return;
					

}*/

var Vec_to_Rot = function(from, to){
	let rad = Vec_to_Rad({x: from.x - to.x, y: from.y - to.y});
	let rot = Rad_to_Rot(rad);
	if(Math.abs(rot) >= 360){
		rot = rot % 360;
	}
	if(rot < 0){
		rot = 360 + rot;
	}
	
	return rot;
	//return Math.atan2((from.x - to.x), (from.y - to.y)) * (180 / Math.PI);
}

var Set_Arg = function(from, to, rad, range) {
    let v1 = Get_Center(from);
    let v2 = {x: (from.width - to.width) / 2, y: (from.height - to.height) / 2};
    let pos = {x: v1.x + Math.cos(rad) * range - v2.x, y: v1.y + Math.sin(rad) * range - v2.y};
    return pos;
};

var Escape_Rot4 = function(from, to, value){
	let t1 = Get_Center(from);
	let t2 = Get_Center(to);
	let arr = [0,1,2,3];
	let rem = [-1];

	if (t1.x > t2.x) {
		if (t1.y > t2.y) {
			arr = [1,2];
		} else {
			arr = [0,1];
		}
	} else {
		if (t1.y > t2.y) {
			arr = [2,3];
		} else {
			arr = [0,3];
		}
	}

	let v = Rot_to_Vec(to.rotation, -90);
	v.x = v.x * 96 + t2.x;
	v.y = v.y * 96 + t2.y;
	let p = {
		x: t1.x - v.x,
		y: t1.y - v.y
	};
	let rad = Math.atan2(p.y, p.x);
	let r = ((Math.atan2(Math.cos(rad), Math.sin(rad)) * 180) / Math.PI) * -1;
	if(from.time % 60 == 0){
		value = Math.floor(Math.random() * 4);
	}
	if(r < 0){
		r = 359 + r;
	}else if(r > 359){
		r = r - 360;
	}
	if (r > 338 || r <= 23) {
		//arr = [1,2,3];
		rem = [0];
	} else if (r > 23 && r <= 68) {
		if (r > 46) {
			//arr = [0,2,3];
			rem = [1];
		} else {
			//arr = [1,2,3];
			rem = [0];
		}
	} else if (r > 68 && r <= 113) {
		//arr = [0,2,3];
		rem = [1];
	} else if (r > 113 && r <= 158) {
		if (r > 136) {
			//arr = [0,1,3];
			rem = [2];
		} else {
			//arr = [0,2,3];
			rem = [1];
		}
	} else if (r > 158 && r <= 203) {
		//arr = [0,1,3];
		rem = [2];
	} else if (r > 203 && r <= 248) {
		if (r > 226) {
			//arr = [0,1,2];
			rem = [3];
		} else {
			//arr = [0,1,3];
			rem = [2];
		}
	} else if (r > 248 && r <= 293) {
		//arr = [0,1,2];
		rem = [3];
	} else if (r > 293 && r <= 338) {
		if (r > 316) {
			//arr = [1,2,3];
			rem = [0];
		} else {
			//arr = [0,1,2];
			rem = [3];
		}
	}else{
		rem = [-1];
	}

	for(i = 0; i < rem.length; i++){
		if(arr.indexOf(rem[i]) != -1){
			arr.splice(arr.indexOf(rem[i]), 1);
		}
	}

	if(arr.indexOf(value) == -1){
		value = arr[Math.floor(Math.random() * arr.length)];
	}
	return value;
}

var Escape_Rot8 = function(from, to, value){
	let t1 = Get_Center(from);
	let t2 = Get_Center(to);
	let arr = [0,1,2,3,4,5,6,7];
	let rem = [-1];

	if (t1.x > t2.x) {
		if (t1.y > t2.y) {
			arr = [1,2,4,6];
		} else {
			arr = [0,1,5,7];
		}
	} else {
		if (t1.y > t2.y) {
			arr = [2,3,5,7];
		} else {
			arr = [0,3,4,6];
		}
	}

	let v = Rot_to_Vec(to.rotation, -90);
	v.x = v.x * 96 + t2.x;
	v.y = v.y * 96 + t2.y;

	let p = {
		x: t1.x - v.x,
		y: t1.y - v.y
	};
	let rad = Math.atan2(p.y, p.x);
	let r = ((Math.atan2(Math.cos(rad), Math.sin(rad)) * 180) / Math.PI) * -1;
	if(from.time % 60 == 0){
		value = Math.floor(Math.random() * 4);
	}
	if(r < 0){
		r = 359 + r;
	}else if(r > 359){
		r = r - 360;
	}
	if (r > 338 || r <= 23) {
		if(r <= 23){
			rem = [0,4];
		}else{
			rem = [0,7];
		}
		//arr = [1,2,3];
		//rem = [0];
	} else if (r > 23 && r <= 68) {
		if (r > 46) {
			//arr = [0,2,3];
			rem = [1,4];
		} else {
			//arr = [1,2,3];
			rem = [0,4];
		}
	} else if (r > 68 && r <= 113) {
		if(r > 90){
			rem = [1,5];
		}else{
			rem = [1,4];
		}
		//arr = [0,2,3];
		//rem = [1];
	} else if (r > 113 && r <= 158) {
		if (r > 136) {
			//arr = [0,1,3];
			rem = [2,5];
		} else {
			//arr = [0,2,3];
			rem = [1,5];
		}
	} else if (r > 158 && r <= 203) {
		if(r > 180){
			rem = [2,6];
		}else{
			rem = [2,5];
		}
		//arr = [0,1,3];
		//rem = [2];
	} else if (r > 203 && r <= 248) {
		if (r > 226) {
			//arr = [0,1,2];
			rem = [3,6];
		} else {
			//arr = [0,1,3];
			rem = [2,6];
		}
	} else if (r > 248 && r <= 293) {
		if(r > 270){
			rem = [3,7];
		}else{
			rem = [3,6];
		}
		//arr = [0,1,2];
		//rem = [3];
	} else if (r > 293 && r <= 338) {
		if (r > 316) {
			//arr = [1,2,3];
			rem = [0,7];
		} else {
			//arr = [0,1,2];
			rem = [3,7];
		}
	}else{
		rem = [-1];
	}

	for(i = 0; i < rem.length; i++){
		if(arr.indexOf(rem[i]) != -1){
			arr.splice(arr.indexOf(rem[i]), 1);
		}
	}

	if(arr.indexOf(value) == -1){
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

function noscroll(e){
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
				x: PixelSize * 1,
				y: PixelSize * 0.5
			},
			size: {
				width: PixelSize * 18,
				height: PixelSize * 14
			},
			color: '#a00'
		},
		Body: {
			position: {
				x: PixelSize * 1,
				y: PixelSize * 3
			},
			size: {
				width: PixelSize * 18,
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
			window.addEventListener('orientationchange',  () => {
				this.resizePad();
			});
		}else{
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
			if(_orientation === "landscape-primary" || _orientation === "landscape-secondary" || _orientation === "landscape"){
				pad.style.width = `${window.innerWidth}px`;
				pad.style.position = "absolute"; //画面の上にかぶせるため
				pad.style.backgroundColor = "transparent"; //透明
				//pad.style.bottom = "0px"; //下に固定
				pad.style.top = `${window.innerHeight - (Number(PixelSize * Stage_H / 2.65) * 0.5)}px`; //下に固定
				document.addEventListener('touchmove', noscroll, {passive: false});
				document.addEventListener('wheel', noscroll, {passive: false});
			}else{
				document.removeEventListener('touchmove', noscroll);
				document.removeEventListener('wheel', noscroll);
			}
			//console.log(_orientation)
		}else{
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

window.onload = function(){
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
		'./image/ObjectImage/R2.png',
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
		'./sound/SIXTH.mp3',
		'./sound/SEVENTH.mp3',
		'./sound/EIGHTH.mp3',
		'./sound/NINTH.mp3',
		'./sound/TENTH.mp3',
		'./sound/ELEVENTH.mp3'
	);

	inputManager = new InputManager();

	game.scale = (window.innerHeight / ((PixelSize * Stage_H) + 32));

    stageScreen = document.getElementById('enchant-stage');
    stageScreen.style.display = "block";
	
    ScreenMargin = ((window.innerWidth-stageScreen.clientWidth)/2);
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
		initialize: function(x, y, scene){
			PhyBoxSprite.call(this, PixelSize, PixelSize, enchant.box2d.STATIC_SPRITE, 10, 0.0, 1.0, true);
			//this.backgroundColor = "#ddd4";
			//this.image = game.assets['./image/ObjectImage/block.png'];
			this.x = x * PixelSize;
			this.y = y * PixelSize - Quarter;
			this.tilePath = {x: x, y: y};
			this.frontimage = new Block_Imgage(this);
			this.topimage = new Block_Imgage_Top(this, this.tilePath);
			this.obs = BlockObs(this);
			this.ref = BlockRef(this);
			scene.addChild(this);
		},
		_Destroy: function(){
			now_scene.backgroundMap.collisionData[this.tilePath.y][this.tilePath.x] = 0;
			now_scene.grid[this.tilePath.y][this.tilePath.x] = 'Empty';
			this.obs.forEach(elem => {
				now_scene.removeChild(elem);
			});
			this.ref.forEach(elem => {
				now_scene.removeChild(elem);
			});
			this.frontimage._Destroy();
			this.topimage._Destroy();
			this.destroy();
			//now_scene.removeChild(this);
		}
	})

	var Block_Imgage = Class.create(Sprite,{
		initialize: function(from){
			Sprite.call(this, 64, 64);
			this.from = from;
			this.image = game.assets['./image/ObjectImage/block.png'];
			this.moveTo(this.from.x, this.from.y+16);
			
			now_scene.addChild(this);
		},
		_Destroy: function(){
			now_scene.removeChild(this);
		}
	})

	var Block_Imgage_Top = Class.create(Sprite,{
		initialize: function(from,tilePath){
			Sprite.call(this, 64, 64);
			this.from = from;
			this.image = game.assets['./image/ObjectImage/block_top.png'];
			this.moveTo(this.from.x, this.from.y - 16);
			
			now_scene.BlockGroup.addChild(this);
		},
		_Destroy: function(){
			now_scene.BlockGroup.removeChild(this);
		}
	})

	var Hole = Class.create(Sprite, {
		initialize: function(x, y, scene) {
			Sprite.call(this, (PixelSize), (PixelSize));
			//obstacle.push(this)
			this.backgroundColor = "#0004";
			this.x = x * PixelSize;
			this.y = y * PixelSize - Quarter;
			new HoleImage(2, this.x, this.y, scene);
			new HoleImage(1, this.x, this.y, scene);
			
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

	var Avoid = Class.create(Sprite, {
		initialize: function(x, y, scene) {
			Sprite.call(this, PixelSize / 2, PixelSize / 2);
			//this.backgroundColor = "#fdda";
			this.x = x * PixelSize + (4 * 4);
			this.y = y * PixelSize - (3 * 2);

			scene.addChild(this);
		}
	});

	var Obstracle = Class.create(Sprite,{
		initialize: function(name, scene){
			switch(name){
				case 'ObsTop':
				case 'ObsBottom':
					Sprite.call(this,60,4);
					break;
				case 'ObsRight':
				case 'ObsLeft':
					Sprite.call(this,4,60);
					break;
			}
			this.debugColor = 'blue';
			this.name = name;
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
							wsp1 = new Obstracle('ObsTop',scene);
							wsp1.moveTo(PixelSize * j + 2, PixelSize * i - 20);
							wcnt1++;
						}
						
					}else{
						if(i > 0 && !(g1[i-1][j] == 1 || g1[i-1][j] == 3 || g1[i-1][j] == 4)){
							wsp1.width = PixelSize * (wcnt1+1) - 4;
							wcnt1++;
						}else{
							wsp1 = null;
							wcnt1 = 0;
						}
						
					}
					if(wsp2 == null){
						if(i < g1.length-1 && !(g1[i+1][j] == 1 || g1[i+1][j] == 3 || g1[i+1][j] == 4)){
							wsp2 = new Obstracle('ObsBottom',scene);
							wsp2.moveTo(PixelSize * j + 2, PixelSize * i + 44);
							wcnt2++;
						}
						
					}else{
						if(i < g1.length-1 && !(g1[i+1][j] == 1 || g1[i+1][j] == 3 || g1[i+1][j] == 4)){
							wsp2.width = PixelSize * (wcnt2+1) - 4;
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
							hsp1 = new Obstracle('ObsLeft',scene);
							hsp1.moveTo(PixelSize * i - 2, PixelSize * j - 16);
							hcnt1++;
						}
						
					}else{
						if(i > 0 && !(g2[i-1][j] == 1 || g2[i-1][j] == 3 || g2[i-1][j] == 4)){
							hsp1.height = PixelSize * (hcnt1+1) - 4;
							hcnt1++;
						}else{
							hsp1 = null;
							hcnt1 = 0;
						}
						
					}
					if(hsp2 == null){
						if(i < g2.length-1 && !(g2[i+1][j] == 1 || g2[i+1][j] == 3 || g2[i+1][j] == 4)){
							hsp2 = new Obstracle('ObsRight',scene);
							hsp2.moveTo(PixelSize * i + 62, PixelSize * j - 16);
							hcnt2++;
						}
						
					}else{
						
						if(i < g2.length-1 && !(g2[i+1][j] == 1 || g2[i+1][j] == 3 || g2[i+1][j] == 4)){
							hsp2.height = PixelSize * (hcnt2+1) - 4;
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
	};

	function BlockObs(from){
		var arr = [];

		arr.push(new Obstracle('ObsTop',now_scene));
		arr.push(new Obstracle('ObsBottom',now_scene));
		arr.push(new Obstracle('ObsLeft',now_scene));
		arr.push(new Obstracle('ObsRight',now_scene));

		arr[0].moveTo(from.x + 2, from.y - 4);
		arr[1].moveTo(from.x + 2, from.y + 60);
		arr[2].moveTo(from.x - 2, from.y);
		arr[3].moveTo(from.x + 62, from.y);

		return arr;
	}

	var RefObstracle = Class.create(Sprite,{
		initialize: function(name, scene){
			switch(name){
				case 'RefTop':
				case 'RefBottom':
					Sprite.call(this,56,8);
					break;
				case 'RefRight':
				case 'RefLeft':
					Sprite.call(this,8,56);
					break;
			}
			this.debugColor = 'orange';
			this.name = name;
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
							wsp1 = new RefObstracle('RefTop',scene);
							wsp1.moveTo(PixelSize * j + 4, PixelSize * i - 16);
							//wsp1.backgroundColor = 'blue'
							wcnt1++;
						}
						
					}else{
						if(i > 0 && !(g1[i-1][j] == 1 || g1[i-1][j] == 4)){
							wsp1.width = PixelSize * (wcnt1+1) - 8;
							wcnt1++;
						}else{
							wsp1 = null;
							wcnt1 = 0;
						}
						
					}
					if(wsp2 == null){
						if(i < g1.length-1 && !(g1[i+1][j] == 1 || g1[i+1][j] == 4)){
							wsp2 = new RefObstracle('RefBottom',scene);
							wsp2.moveTo(PixelSize * j + 4, PixelSize * i + 40);
							//wsp2.backgroundColor = 'white'
							wcnt2++;
						}
						
					}else{
						if(i < g1.length-1 && !(g1[i+1][j] == 1 || g1[i+1][j] == 4)){
							wsp2.width = PixelSize * (wcnt2+1) - 8;
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
				if(g2[i][j] == 1 || g2[i][j] == 4){
					if(hsp1 == null){
						if(i > 0 && !(g2[i-1][j] == 1 || g2[i-1][j] == 4)){
							hsp1 = new RefObstracle('RefLeft',scene);
							hsp1.moveTo(PixelSize * i, PixelSize * j - 12);
							//hsp1.backgroundColor = 'green'
							hcnt1++;
						}
						
					}else{
						if(i > 0 && !(g2[i-1][j] == 1 || g2[i-1][j] == 4)){
							hsp1.height = PixelSize * (hcnt1+1) - 8;
							hcnt1++;
						}else{
							hsp1 = null;
							hcnt1 = 0;
						}
						
					}
					if(hsp2 == null){
						if(i < g2.length-1 && !(g2[i+1][j] == 1 || g2[i+1][j] == 4)){
							hsp2 = new RefObstracle('RefRight',scene);
							hsp2.moveTo(PixelSize * i + 56, PixelSize * j - 12);
							//hsp2.backgroundColor = 'red'
							hcnt2++;
						}
						
					}else{
						
						if(i < g2.length-1 && !(g2[i+1][j] == 1 || g2[i+1][j] == 4)){
							hsp2.height = PixelSize * (hcnt2+1) - 8;
							hcnt2++;
						}else{
							hsp2 = null;
							hcnt2 = 0;
						}
						//hcnt2++;
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
	};

	function BlockRef(from){
		var arr = [];

		arr.push(new RefObstracle('RefTop',now_scene));
		arr.push(new RefObstracle('RefBottom',now_scene));
		arr.push(new RefObstracle('RefLeft',now_scene));
		arr.push(new RefObstracle('RefRight',now_scene));

		arr[0].moveTo(from.x + 4, from.y);
		arr[1].moveTo(from.x + 4, from.y + 56);
		arr[2].moveTo(from.x, from.y + 4);
		arr[3].moveTo(from.x + 56, from.y +4);
		
		return arr;
	}

	var TankObstracle = Class.create(Sprite,{
		initialize: function(from, num, name, scene){
			switch(name){
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
			this.onenterframe = function(){
				if(WorldFlg){
					if(deadFlgs[num]) scene.removeChild(this);
					switch(name){
						case 'TankTop':
							if(from.rotation == 0){
								this.x = from.x + 4;
								this.y = from.y - 1;
								if(this.scaleY != 2) this.scaleY = 2;
								if(this.debugColor != "yellow") this.debugColor = "yellow";
							}else{
								this.x = from.x + 4;
								this.y = from.y;
								if(this.scaleY != 1) this.scaleY = 1;
								if(this.debugColor != "white") this.debugColor = "white";
							}
							break;
						case 'TankBottom':
							if(from.tank.rotation == 180){
								this.x = from.x + 4;
								this.y = from.y + 60 - 1;
								if(this.scaleY != 2) this.scaleY = 2;
								if(this.debugColor != "yellow") this.debugColor = "yellow";
							}else{
								this.x = from.x + 4;
								this.y = from.y + 60 - 2;
								if(this.scaleY != 1) this.scaleY = 1;
								if(this.debugColor != "blue") this.debugColor = "blue";
							}
							break;
						case 'TankRight':
							if(from.tank.rotation == 90){
								this.x = from.x + 60;
								this.y = from.y + 4;
								if(this.scaleX != 2) this.scaleX = 2;
								if(this.debugColor != "yellow") this.debugColor = "yellow";
							}else{
								this.x = from.x + 60 - 1;
								this.y = from.y + 4;
								if(this.scaleX != 1) this.scaleX = 1;
								if(this.debugColor != "red") this.debugColor = "red";
							}
							break;
						case 'TankLeft':
							if(from.tank.rotation == 270){
								this.x = from.x-2;
								this.y = from.y + 4;
								if(this.scaleX != 2) this.scaleX = 2;
								if(this.debugColor != "yellow") this.debugColor = "yellow";
							}else{
								this.x = from.x-1;
								this.y = from.y + 4;
								if(this.scaleX != 1) this.scaleX = 1;
								if(this.debugColor != "green") this.debugColor = "green";
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

	var Cursor = Class.create(Sprite,{
        initialize: function(scene){
            Sprite.call(this,16,16);
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
			}else{
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
			this.pos = {x: (area.width - this.width) / 2, y: (area.height - this.height) / 2};
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

			this.onenterframe = function(){
				/*this.x = area.x - 6.5;
				this.y = area.y - 41.5;*/
				this.x = (area.x + area.width/2) - this.width/2;
				this.y = (area.y + area.height/2) - this.height/2;
			}
			now_scene.CannonGroup.addChild(this);
		},
		_setSize: function(){
			this.scaleX = 0.675
			this.scaleY = 0.675
			this.originX = 36;
            this.originY = 72;
		}
	});

	var Weak = Class.create(Sprite,{
		initialize: function(from, num){
			Sprite.call(this, 40, 40);
			//this.backgroundColor = "#f00a";
			this.num = num;
			this.x = from.x + 10;
			this.y = from.y + 10;
			
			this.onenterframe = function() {
				if(WorldFlg){
					let f = Get_Center(from);
					this.x = f.x - this.width/2;
					this.y = f.y - this.height/2;
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

	var Aim = Class.create(Sprite,{
		initialize: function(from, to, category, num){
			Sprite.call(this, 8, 8);
			this.time = 0;
			this.category = category;
			this.num = num;
			this.rotation = 0;
			//this.opacity = 0;
			this.debugColor = 'orange';
			
			//this.vector = Pos_to_Vec(from, to);
			//this.rad = Vec_to_Rad(this.vector);

			let angle = Vec_to_Rot(Get_Center(from), Get_Center(to)) + 90;
			if(Math.abs(angle) >= 360){
				angle = angle % 360;
			}
			if(angle < 0){
				angle = 360 + angle;
			}

			this.rad = Rot_to_Rad(angle);

			if(num == 0){
				let n_color = new Surface(this.width, this.height);
					n_color.context.beginPath();
					n_color.context.fillStyle = 'rgba(170, 255, 255, 0.3)';
					n_color.context.arc(4, 4, 4, 0, Math.PI * 2, true);
					n_color.context.fill();
				this.image = n_color;
			}else if(Categorys.MaxRef[category] == 0){
				this.scale(2.0, 2.0);
			}

			var rot = Rad_to_Rot(this.rad);
			if(Math.abs(rot) >= 360){
				rot = rot % 360;
			}
			if(rot < 0){
				rot = 360 + rot;
			}
			
			let sa = from.rotation - (rot);
			if(Math.abs(sa) >= 180){
				sa = sa * -1; 
			}
			
			let resultRot = 0;

			let speed = Categorys.CannonRotSpeed[category];
			if(Math.abs(sa) >= speed){
				let rotmove = sa == 0 ? 0 : sa > 0 ? -speed : speed;
				if(rotmove != 0){
					resultRot = from.rotation + rotmove;
					//from.rotation += rotmove;
				}
			}else{
				resultRot = rot;
				//from.rotation = rot;
			}
				
			/*if(Math.abs(from.rotation) >= 360) from.rotation %= 360;
			if(from.rotation < 0) from.rotation = 359 + from.rotation;*/

			if(Math.abs(resultRot) >= 360) resultRot %= 360;
			if(resultRot < 0) resultRot = 360 + resultRot;

			from.rotation = resultRot;

			/*if (num == 0 && gameMode == 0) {
				//from.rotation = ((Math.atan2(Math.cos(this.rad), Math.sin(this.rad)) * 180) / Math.PI) * -1;
				//from.rotation = Rad_to_Rot(this.rad);
			}else{
				var rot = Rad_to_Rot(this.rad);
				if(rot < 0){
					rot = 360 + rot;
				}
				if(rot >= 360){
					rot = rot % 360;
				}
				let sa = from.rotation - (rot);
				if(Math.abs(sa) >= 180){
					sa = sa * -1; 
				}
				

				let speed = Categorys.CannonRotSpeed[category];
				if(Math.abs(sa) >= speed){
					let rotmove = sa == 0 ? 0 : sa > 0 ? -speed : speed;
					if(rotmove != 0){
						from.rotation += rotmove;
					}
				}else{
					from.rotation = rot;
				}
				
				if(Math.abs(from.rotation) >= 360) from.rotation %= 360;
				if(from.rotation < 0) from.rotation = 360 - Math.abs(from.rotation);
			}*/
			this.rad = Rot_to_Rad(from.rotation - 90);
			let f = Get_Center(from);
			this.moveTo((f.x - 3.45) + Math.cos(this.rad) * (56), (f.y - 4.5) + Math.sin(this.rad) * (56));
			this.dx = Math.cos(this.rad) * 28;
			this.dy = Math.sin(this.rad) * 28;

			
			
			now_scene.addChild(this);
		},
		onenterframe: function(){
			
			if(WorldFlg){
				this.time++;
				if(this.time % 360 == 0){
					now_scene.removeChild(this);
				}
				this.x += this.dx;
				this.y += this.dy;

				//this.tl.moveTo(this.x + this.dx, this.y + this.dy, 1, enchant.Easing.QUAD_EASEINOUT);
			}
			Wall.intersectStrict(this).forEach(elem => {
				now_scene.removeChild(this);
			});
			Block.intersectStrict(this).forEach(elem => {
				
				now_scene.removeChild(this);
			})
			if(this.num != 0){
				TankBase.intersectStrict(this).forEach(elem => {
					if(elem.num != 0){
						now_scene.removeChild(this);
					}
				})
			}
		}
	});

	var RefAim = Class.create(Sprite,{
		initialize: function(ref, from, category, num){
			Sprite.call(this, 8, 8);
			this.time = 0;
			this.category = category;
			this.num = num;
			this.ref = ref;
			this.hitTime = 0;
			this.debugColor = 'orange';
			//this.backgroundColor = 'orange'

			this.originX = 4;
			this.originY = 4;

			let fc = Get_Center(from);
			this.rad = Rot_to_Rad(from.rotation - 90);
			this.dx = Math.cos(this.rad) * 20;
			this.dy = Math.sin(this.rad) * 20;
			this.agl = from.rotation;
			this.tgt = [fc.x + (this.dx * 3), fc.y + (this.dy * 3)];
			this.rotation = (315 + (Math.atan2(this.dx, this.dy) * 180) / Math.PI) * -1;
			this.v;
			this.f;
			this.moveTo(fc.x + (36 * Math.cos(this.rad)) - (this.width / 2), fc.y + (36 * Math.sin(this.rad)) - (this.height / 2));

			this.onenterframe = function(){
				if(WorldFlg){
					this.time++;

					this.x += this.dx;
					this.y += this.dy;

					RefObstracle.intersectStrict(this).forEach(elem => {
						this.v = Rot_to_Vec(this.rotation, 315);
						this.f = Math.atan2(this.v.x, this.v.y);
						switch(elem.name){
							case 'RefTop':
								if(this.ref == Categorys.MaxRef[category]){
									//this.tgt[0] = (this.x + (this.width/2)) - (Math.cos(this.f) * ((elem.y) - (this.y)));
									//this.tgt[1] = elem.y - 2.5;
									this.tgt[0] = (this.x + this.width/2) - (Math.cos(this.f) * ((elem.y) - (this.y + this.height)))
									this.tgt[1] = elem.y - 2.5;
								}
								//this.x = (this.x) - (Math.cos(this.f) * ((elem.y) - (this.y)));
								//this.y = elem.y - (this.height);
								this.x = (this.x) - (Math.cos(this.f) * ((elem.y) - (this.y + this.height)));
								this.y = elem.y - (this.height);
								this.dy = this.dy * -1;
								break;
							case 'RefBottom':
								if(this.ref == Categorys.MaxRef[category]){
									//this.tgt[0] = (this.x + (this.width/2)) - (Math.cos(this.f) * (this.y - (elem.y + elem.height)));
									//this.tgt[1] = elem.y + elem.height + 2.5;
									this.tgt[0] = (this.x + this.width/2) - (Math.cos(this.f) * ((this.y - this.height/2) - (elem.y + elem.height)));
									this.tgt[1] = elem.y + elem.height + 2.5;
								}
								//this.x = (this.x) - (Math.cos(this.f) * (this.y - (elem.y + elem.height)));
								//this.y = elem.y + elem.height;
								this.x = (this.x) - (Math.cos(this.f) * ((this.y - this.height/2) - (elem.y + elem.height)));
								this.y = elem.y + elem.height;
								this.dy = this.dy * -1;
								break;
							case 'RefLeft':
								if(this.ref == Categorys.MaxRef[category]){
									//this.tgt[0] = elem.x - 2.5;
									//this.tgt[1] = (this.y + (this.height/2)) - (Math.sin(this.f) * ((elem.x) - (this.x)));
									this.tgt[0] = elem.x - 2.5;
									this.tgt[1] = (this.y + this.height/2) - (Math.sin(this.f) * ((this.x + this.width) - (elem.x)));
								};
								//this.x = elem.x - (this.width);
								//this.y = (this.y) - (Math.sin(this.f) * ((elem.x) - (this.x)));
								this.y = (this.y) - (Math.sin(this.f) * ((this.x + this.width) - (elem.x)));
								this.x = elem.x - (this.width);
								this.dx = this.dx * -1;
								break;
							case 'RefRight':
								if(this.ref == Categorys.MaxRef[category]){
									//this.tgt[0] = elem.x + elem.width + 2.5;
									//this.tgt[1] = (this.y + (this.height/2)) - (Math.sin(this.f) * (this.x - (elem.x + elem.width)));
									this.tgt[0] = elem.x + elem.width + 2.5;
									this.tgt[1] = (this.y + this.height/2) - (Math.sin(this.f) * ((elem.x + elem.width) - (this.x + this.width)));
								};
								//this.x = elem.x + elem.width + 1;
								//this.y = (this.y) - (Math.sin(this.f) * (this.x - (elem.x + elem.width)));
								this.y = (this.y) - (Math.sin(this.f) * ((elem.x + elem.width) - (this.x + this.width)));
								this.x = elem.x + elem.width;
								this.dx = this.dx * -1;
								break;
						}
						this.ref--;
						this.rotation = (315 + (Math.atan2(this.dx, this.dy) * 180) / Math.PI) * -1;
						return;
					})
					TankBase.intersectStrict(this).forEach(elem => {
						//let point = new Point(Get_HitPoint(this, elem));
						if(elem.num != 0){
							now_scene.removeChild(this);
						}
					})
					if (this.time > 150) now_scene.removeChild(this);
					if (this.ref < 0) now_scene.removeChild(this)
				}
			};

			now_scene.addChild(this);
		}
	});

	var PlayerRefAim = Class.create(Sprite,{
		initialize: function(ref, from, to, category, num){
			Sprite.call(this, 8, 8);
			this.time = 0;
			this.category = category;
			this.num = num;
			this.ref = ref;
			this.hitTime = 0;
			this.debugColor = 'orange';
			//this.backgroundColor = 'ffa500';

			let n_color = new Surface(this.width, this.height);
				n_color.context.beginPath();
				n_color.context.fillStyle = 'rgba(170, 255, 255, 0.3)';
				n_color.context.arc(4, 4, 4, 0, Math.PI * 2, true);
				n_color.context.fill();
			this.image = n_color;

			this.originX = 4;
			this.originY = 4;

			let fc = Get_Center(from);
			this.vector = Pos_to_Vec(from, to);
			this.rad = Vec_to_Rad(this.vector);

			var rot = Rad_to_Rot(this.rad);
			if(rot < 0){
				rot = 360 + rot;
			}
			if(rot >= 360){
				rot = rot % 360;
			}
			let sa = from.rotation - (rot);
			if(Math.abs(sa) >= 180){
				sa = sa * -1; 
			}

			let resultRot = 0;
				
			let speed = Categorys.CannonRotSpeed[category];
			if(Math.abs(sa) >= speed){
				let rotmove = sa == 0 ? 0 : sa > 0 ? -speed : speed;
				if(rotmove != 0){
					resultRot = from.rotation + rotmove;
				}
			}else{
				resultRot = rot;
			}
				
			if(Math.abs(resultRot) >= 360) resultRot %= 360;
			if(resultRot < 0) resultRot = 360 + resultRot;

			from.rotation = resultRot;

			
			//from.rotation = Rad_to_Rot(this.rad);
			this.rad = Rot_to_Rad(from.rotation - 90);
			this.dx = Math.cos(this.rad) * 20;
			this.dy = Math.sin(this.rad) * 20;
			this.rotation = (315 + (Math.atan2(this.dx, this.dy) * 180) / Math.PI) * -1;
			
			this.v;
			this.f;
			this.moveTo(fc.x + (36 * Math.cos(this.rad)) - (this.width / 2), fc.y + (36 * Math.sin(this.rad)) - (this.height / 2));

			this.onenterframe = function(){
				if(WorldFlg){
					this.time++;

					this.x += this.dx;
					this.y += this.dy;

					/*Wall.intersectStrict(this).forEach(elem => {
						let point = new Point(Get_RefPoint(elem, this));
					})
					Block.intersectStrict(this).forEach(elem => {
						let point = new Point(Get_RefPoint(elem, this));
					})*/

					RefObstracle.intersectStrict(this).forEach(elem => {
						//let point = new Point(Get_HitPoint(elem, this));
						
						this.v = Rot_to_Vec(this.rotation, 315);
						this.f = Math.atan2(this.v.x, this.v.y);
						switch(elem.name){
							case 'RefTop':
								this.x = (this.x) - (Math.cos(this.f) * ((elem.y) - (this.y + this.height)));
								this.y = elem.y - (this.height);
								this.dy = this.dy * -1;
								break;
							case 'RefBottom':
								
								this.x = (this.x) - (Math.cos(this.f) * ((this.y - this.height/2) - (elem.y + elem.height)));
								this.y = elem.y + elem.height;
								this.dy = this.dy * -1;
								break;
							case 'RefLeft':

								this.y = (this.y) - (Math.sin(this.f) * ((this.x + this.width) - (elem.x)));
								this.x = elem.x - (this.width);
									
								this.dx = this.dx * -1;
								break;
							case 'RefRight':
								this.y = (this.y) - (Math.sin(this.f) * ((elem.x + elem.width) - (this.x + this.width)));
								this.x = elem.x + elem.width;
								
								
								this.dx = this.dx * -1;
								break;
						}
						this.ref--;
						this.rotation = (315 + (Math.atan2(this.dx, this.dy) * 180) / Math.PI) * -1;
						return;
					})
					if (tankEntity[this.num].intersectStrict(this)) {
						now_scene.removeChild(this);
					};
					TankBase.intersectStrict(this).forEach(elem => {
						if(elem.num != 0){
							now_scene.removeChild(this);
						}
					})
					if (this.time > 150) now_scene.removeChild(this);
					if (this.ref < 0) now_scene.removeChild(this)
				}
			};

			now_scene.addChild(this);
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

	var BulAim = Class.create(Sprite,{
		initialize: function(from){
			Sprite.call(this, 8, 8);
			//this.backgroundColor = "#aff8";
			this.time = 0;
			var rad = Rot_to_Rad(from.rotation - 90);
			var dx = Math.cos(rad) * 24;
			var dy = Math.sin(rad) * 24;
			this.target = from;
			this.num = from.num;
			this.id = from.id;

			this.moveTo(((from.x + from.width/2) - this.width/2) + Math.cos(rad) * (1), ((from.y + from.height/2) - this.height/2) + Math.sin(rad) * (1));

			this.onenterframe = function() {
				if(WorldFlg){
					this.x += dx;
					this.y += dy;
					if (bulStack[this.num][this.id] == false) now_scene.removeChild(this);
				}
				Wall.intersectStrict(this).forEach(elem => {
					now_scene.removeChild(this);
				});
				Block.intersectStrict(this).forEach(elem => {
					now_scene.removeChild(this);
				})
			}
			now_scene.addChild(this);
		}
	});

	var PlayerBulAim = Class.create(BulAim,{
		initialize: function(from){
			BulAim.call(this, from);
		}
	})

	function Search(from, to, angle, length){
		const SightAngle = angle;
		const SightLength = length;

		if(from.within(to, SightLength)){
			
			let target_angle = (Vec_to_Rot(from, to)) - from.rotation;
			if(Math.abs(target_angle) >= 360){
				target_angle = target_angle % 360;
			}
			if(target_angle < 0){
				target_angle = 360 + target_angle;
			}
			//console.log(target_angle + ' ' + from.rotation)
			//console.log(target_angle < SightAngle || target_angle > (360 - SightAngle));
			if(target_angle < SightAngle || target_angle > (360 - SightAngle)){
				return true;
			}else{
				return false;
			}
			
		}
		return false;
	}
	
	var BulletCol = Class.create(PhyCircleSprite,{
		initialize: function(shotSpeed, ref, from, category, num, id){
			PhyCircleSprite.call(this, 2.5, enchant.box2d.DYNAMIC_SPRITE, 0.0, 0.0, 1.0, true);
			this.time = 0;
			this.id = id;
			this.num = num;
			this.category = category;
			this.from = from;
			this.shotSpeed = shotSpeed;
			this.ref = ref;
			this.bullet = new Bullet(this, num, id);
			this.rotation = 0;
			let random0 = 0;
			let random1 = 0;
			let refFlg = false;
			let cnt = 0;
			let hitTime = 0;

			switch(category){
				case 0:
					break;
				case 1:
					this.bullet.scale(0.8, 1.0);
					break;
				case 2:
					break;
				case 3:
					break;
				case 4:
					random0 = (Math.floor(Math.random() * 20) - 10) / 2;
					random1 = (Math.floor(Math.random() * 20) - 10) / 2;
					break;
				case 5:
					random0 = (Math.floor(Math.random() * 12) - 6) / 2;
					random1 = (Math.floor(Math.random() * 12) - 6) / 2;
					break;
				case 6:
					
					break;
				case 7:
					this.bullet.scale(0.8, 0.8);
					break;
				case 9:
					if(this.num == 0){
						random0 = (Math.floor(Math.random() * 16) - 8) / 2;
						random1 = (Math.floor(Math.random() * 16) - 8) / 2;
					}else{
						random0 = (Math.floor(Math.random() * 30) - 15) / 2;
						random1 = (Math.floor(Math.random() * 30) - 15) / 2;
					}
					
					this.bullet.scale(0.7, 0.7);
					break;
				case 11:
					this.bullet.scale(0.6, 1.0);
					break;
			};

			this.vec = Rot_to_Vec(from.rotation + (random0 + random1), -90);
			this.rad = Math.atan2(this.vec.y, this.vec.x);

			this.moveTo(Get_Center(from).x + Math.cos(this.rad) * (60) - 2.25, Get_Center(from).y + Math.sin(this.rad) * (60) - 3);
			this.applyImpulse(new b2Vec2(Math.cos(this.rad) * (this.shotSpeed), Math.sin(this.rad) * (this.shotSpeed)));

			this.onenterframe = function(){
				if(WorldFlg){
					this.vec = { x: this.vx, y: this.vy };
					this.rad = Math.atan2(this.vec.y, this.vec.x);
					this.time++
					if (this.time % 10 == 0) new Smoke(this)

					if(cnt > 0) cnt = 0;
					Wall.intersectStrict(this.bullet).forEach(elem => {
						//cnt++;
						elem.contact(function(){
							cnt++;
						})
					});
					Block.intersectStrict(this.bullet).forEach(elem => {
						//cnt++;
						elem.contact(function(){
							cnt++;
						})
					})
					if(cnt > 0){
						hitTime++;
						if(!refFlg){
							this.ref--;
							refFlg = true;
							if(gameStatus == 0)game.assets['./sound/s_car_trunk_O.wav'].clone().play();
						}
						if(hitTime >= 30){
							hitTime = 0;
							this.ref--;
							refFlg = true;
						}
					}else{
						refFlg = false;
					}
					
					if(this.ref < 0) this._Destroy();

					Bullet.intersectStrict(this.bullet).forEach(elem => {
						if (!(this.bullet.num == elem.num && this.bullet.id == elem.id)) {
							elem.from._Destroy();
							this._Destroy();
						}
					})
				}
			}
		},
		_Shot: function(){
			bullets[this.num]++; //  弾の発射済み個数を増やす
			bulStack[this.num][this.id] = true; //  弾の状態をonにする
			now_scene.BulletGroup.addChild(this);
			now_scene.BulletGroup.addChild(this.bullet);
			new OpenFire(this.from);
			game.assets['./sound/s_car_door_O2.wav'].clone().play();
			if(this.shotSpeed >= 14){
				game.assets['./sound/Sample_0003.wav'].clone().play();
			}
		},
		_Destroy: function(){
			bullets[this.num]--;
			bulStack[this.num][this.id] = false; //  弾の状態をoffにする
			new TouchFire(this.bullet);
			Spark_Effect(this.bullet);
			this.destroy();
			now_scene.BulletGroup.removeChild(this);
			now_scene.BulletGroup.removeChild(this.bullet);
			if(gameStatus == 0)game.assets['./sound/Sample_0000.wav'].clone().play();
		}
	});

	var Bullet = Class.create(Sprite, {
		initialize: function(from, num, id) {
			Sprite.call(this, 12, 18);
			this.image = game.assets['./image/ObjectImage/R2.png'];
			this.time = 0;
			this.id = id;
			this.num = num;
			this.from = from;
			this.name = 'Bullet';
			this.rotation = 0;
			//this.opacity = 0.2;
			this.force = { x: 0, y: 0 };
			if (from.shotSpeed >= 14) {
				this.force = { x: from.vx / (from.shotSpeed * ((from.shotSpeed / 3) * 2)), y: from.vy / (from.shotSpeed * ((from.shotSpeed / 3) * 2)) };
			}
			this.rotation = (180 + (Math.atan2(Math.cos(from.rad), Math.sin(from.rad)) * 180) / Math.PI) * -1;
			this.moveTo(from.centerX - (this.width / 2) - (this.force.x), from.centerY - (from.height / 2 + this.height / 3) - (this.force.y))
			this.onenterframe = function(){
				if(WorldFlg){
					this.rotation = (180 + (Math.atan2(Math.cos(from.rad), Math.sin(from.rad)) * 180) / Math.PI) * -1;
					this.moveTo(from.centerX - (this.width / 2) - (this.force.x), from.centerY - (from.height / 2 + this.height / 3) - (this.force.y));
					
					if(this.from.time % 2 == 0){
						if(this.from.shotSpeed >= 14){
							new Fire(this);
						}
						if(this.num == 0){
							new PlayerBulAim(this);
						}else{
							new BulAim(this);
						}
					}
				}
			}
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

			let f = Get_Center(from);

			//this.moveTo(from.x - Quarter + 33.5, from.y - Quarter + 32);
			//this.moveTo(f.x - this.width/2, f.y - this.height/2);

			let vec = Rot_to_Vec(from.rotation, -90);
			let rad = Math.atan2(vec.y, vec.x);

			this.moveTo(f.x + Math.cos(rad) * (5) - this.width/2, f.y + Math.sin(rad) * (5) - this.height/2);

			var n_color = new Surface(PixelSize / 2, PixelSize / 2);
			n_color.context.beginPath();
			n_color.context.fillStyle = 'rgba(255, 255, 0, 1)';
			n_color.context.arc(Quarter, Quarter, Quarter, 0, Math.PI * 2, true);
			n_color.context.fill();

			var a_color = new Surface(PixelSize / 2, PixelSize / 2);
			a_color.context.beginPath();
			a_color.context.fillStyle = 'rgba(255, 0, 0, 1)';
			a_color.context.arc(Quarter, Quarter, Quarter, 0, Math.PI * 2, true);
			a_color.context.fill();

			this.image = n_color;
			this.scaleY = 0.9;

			this.onenterframe = function(){
				this.time++;
				if(this.bombFlg){
					if (this.time % 4 == 0) {
						this.image = a_color;
						//this.backgroundColor = "red"
					} else if (this.time % 2 == 0) {
						this.image = n_color;
						//this.backgroundColor = "yellow"
					}
					if (this.time % 6 == 0 && gameStatus == 0) {
						game.assets['./sound/Sample_0010.wav'].clone().play();
					}
					if(gameStatus == 0 && this.time == 45){
						this._Destroy();
					}
				}
				if(WorldFlg){
					/*BombExplosion.intersectStrict(this).forEach(elem => {
						if (victory == false && defeat == false) {
							this._Destroy();
						}
					});*/

					
					Bullet.intersectStrict(this).forEach(elem => {
						if(bulStack[elem.num][elem.id]){
							elem.from._Destroy();
							this._Destroy();
						}
						return;
					})
					if(this.time > 180 && !this.bombFlg){
						
						tankEntity.forEach(elem => {
							if (this.within(elem,120) || this.time > 555) {
								this.bombFlg = true;
								this.time = 0;
							}
						})
					}
					
				}
			}
		},
		_SetBom: function(){
			boms[this.num]++; //  弾の発射済み個数を増やす
			now_scene.BomGroup.addChild(this);
			game.assets['./sound/Sample_0009.wav'].clone().play();
		},
		_Destroy: function(){
			boms[this.num]--;
			if(boms[this.num] < 0){
				boms[this.num] = 0;
			}
			new BombExplosion(this);
			this.moveTo(-900, -900);
			now_scene.BomGroup.removeChild(this);
			game.assets['./sound/mini_bomb2.mp3'].play();
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
				if(WorldFlg){
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

	var BombExplosion = Class.create(Sprite,{
		initialize: function(from){
			Sprite.call(this, 200, 200);
			this.backgroundColor = "red";
			this.time = 0;
			var value = 1.0;
			this.opacity = value;
			let f = Get_Center(from);
			this.moveTo(f.x - (this.width / 2), f.y - (this.height / 2));

			/*var a_color = new Surface(this.width, this.height);
			a_color.context.beginPath();
			a_color.context.fillStyle = 'rgba(255, 0, 0, 1)';
			a_color.context.arc(this.width/2, this.width/2, this.width/2, 0, Math.PI * 2, true);
			a_color.context.fill();

			this.image = a_color;*/

			this.onenterframe = function() {
				if(WorldFlg){
					this.rotation += 45;
					if (this.time % 2 == 0) {
						value -= 0.1;
						this.opacity = value;
					}
					if (value < 0) {
						this.moveTo(-1000, -1000)
						if (this.time > 20) {
							now_scene.removeChild(this);
						}
					}
					if(this.time < 4){
						Block.collection.forEach(elem => {
							if(this.within(elem,125)){
								elem._Destroy();
							}
						})
						this.intersectStrict(Bom).forEach(elem => {
							elem._Destroy();
							return;
						})
						if(this.time < 1){
							TankBase.collection.forEach(elem => {
								if(!deadFlgs[elem.num]){
									if (elem.weak.within(this,125)) {
										new ViewDamage(elem, 100, false);
										elem.life -= 100;
										elem.lifeBar.Change(elem.life);
										if(gameMode == 2 && elem.num == 0){
											zanki = Math.floor((elem.life-1) / Categorys.Life[elem.category]) + 1;
										}
									}
								}
							})
						}
						
						
					}
					
					this.time++;
				}
			}
			now_scene.addChild(this);
		}
	})

	var Target = Class.create(Sprite, {
		initialize: function(from, scene) {
			Sprite.call(this, 40, 40);
			//this.backgroundColor = "#0f0a"
			this.debugColor = "yellow"
			let speed = 32;
			this.num = from.num;
			this.rotation = 0;
			this.originX = 20;
			this.originY = 20;
			let rad, dx, dy;
			let prediction = [0, 0];
			this.moveTo(from.x, from.y)

			this.onenterframe = function() {
				if(WorldFlg){
					if(!deadFlgs[this.num]){
						switch(from.attackTarget.name){
							case 'Entity':
								rad = (from.attackTarget.rotation - 90) * (Math.PI / 180.0);
								dx = Math.cos(rad) * (from.attackTarget.width / 4);
								dy = Math.sin(rad) * (from.attackTarget.height / 4);
								this.rotation = (45 + (Math.atan2(dx, dy) * 180) / Math.PI) * -1;
								break;
							case 'Bullet':
								rad = (from.attackTarget.rotation - 90) * (Math.PI / 180.0);
								dx = Math.cos(rad) * (from.attackTarget.width*0.8);
								dy = Math.sin(rad) * (from.attackTarget.height*0.8);
								this.rotation = (45 + (Math.atan2(dx, dy) * 180) / Math.PI) * -1;
								break;
						}
						if(this.intersectStrict(from.attackTarget)){
							switch(from.attackTarget.name){
								case 'Entity':
									prediction = [(from.attackTarget.x + from.attackTarget.width / 2) + (dx - (this.width / 2)), (from.attackTarget.y + from.attackTarget.height / 2) + (dy - (this.height / 2))];
									break;
								case 'Bullet':
									prediction = [(from.attackTarget.x + from.attackTarget.width / 2) + (dx - (this.width / 2)), (from.attackTarget.y + from.attackTarget.height / 2) + (dy - (this.height / 2))];
									break;
							}
							this.moveTo(prediction[0], prediction[1]);
						}else{
							var vector = {
								x: (from.attackTarget.x + from.attackTarget.width/2) - (this.x + this.width/2),
								y: (from.attackTarget.y + from.attackTarget.height/2) - (this.y + this.height/2)
							};
							this.rad = Math.atan2(vector.y, vector.x);
							this.moveTo(this.x + Math.cos(this.rad) * speed, this.y + Math.sin(this.rad) * speed)
						}
					}
					
				}
				
			}
			scene.addChild(this);
		}
	});

	var Smoke = Class.create(Sprite,{
		initialize: function(from){
			Sprite.call(this, 12, 12);
			//this.backgroundColor = "#aaa";
			this.time = 0;
			let value = 0.5;
			this.opacity = value;
			this.moveTo(from.x - 3.5, from.y - 1);

			var image = new Surface(this.width, this.height);
			image.context.beginPath();
			image.context.fillStyle = 'rgba(192, 192, 192, 1)';
			image.context.arc(this.width/2, this.width/2, this.width/2, 0, Math.PI * 2, true);
			image.context.fill();

			this.image = image;

			this.onenterframe = function() {
				if(WorldFlg){
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

	var Fire = Class.create(Sprite,{
		initialize: function(from){
			Sprite.call(this, 12, 12);
			this.backgroundColor = "#f20";
			this.time = 0;
			let value = 0.8;
			if(from.from.shotSpeed >= 20){
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
				if(WorldFlg){
					this.time++
					value -= 0.1;
					this.opacity = value;
					if (value < 0.1) now_scene.FireGroup.removeChild(this);
				}
			}
			now_scene.FireGroup.addChild(this);
		}
	})

	var TouchFire = Class.create(Sprite,{
		initialize: function(from){
			Sprite.call(this, 24, 24);
			this.backgroundColor = "#f30";
			if (from.from.shotSpeed > 19) this.backgroundColor = "#44f";
			this.time = 0;
			let value = 0.8;
			this.opacity = value;

			let rad = Rot_to_Rad(from.rotation - 90);
			let dx = Math.cos(rad) * (3);
			let dy = Math.sin(rad) * (3);
			let f = Get_Center(from);
			this.moveTo((f.x - this.width / 2) + dx, (f.y - this.height / 2) + dy);
			this.rotation = from.rotation;

			this.onenterframe = function(){
				if(WorldFlg){
					this.time++
					value -= 0.1;
					this.opacity = value;
					this.rotation += this.time;
					if (value < 0) now_scene.FireGroup.removeChild(this);
				}
			}
			now_scene.FireGroup.addChild(this);
		}
	});

	var OpenFire = Class.create(Sprite,{
		initialize: function(from){
			Sprite.call(this, 24, 24);
			this.backgroundColor = "#f40";
			this.time = 0;

			let value = 1.0;
			this.opacity = value;

			let rad = Rot_to_Rad(from.rotation - 90);
			let dx = Math.cos(rad) * (40);
			let dy = Math.sin(rad) * (40);
			let f = Get_Center(from);
			this.moveTo((f.x - this.width / 2) + dx, (f.y - this.height / 2) + dy);
			this.rotation = from.rotation;

			this.onenterframe = function(){
				if(WorldFlg){
					this.scaleX = 1 - (value / 2);
					this.scaleY = 1 - (value / 2);
					value -= 0.1;
					this.x += Math.cos(rad) * 3;
					this.y += Math.sin(rad) * 3;
					this.opacity = value;
					if (value < 0) now_scene.removeChild(this);
				}
			}
			now_scene.addChild(this);
		}
	});

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
				if(WorldFlg){
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

	var Spark = Class.create(Sprite, {
		initialize: function(from){
			Sprite.call(this, 1, 6);
			let rot = from.rotation;
			
			var rad = Rot_to_Rad(from.rotation - 90);

			this.moveTo(((from.x + from.width/2)) + Math.cos(rad) * (10), ((from.y + from.height/2)) + Math.sin(rad) * (10));

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
			this.onenterframe = function(){
				this.opacity -= 0.1;
				this.x += this.dx;
				this.y += this.dy;
				if(this.opacity < 0){
					now_scene.SparkGroup.removeChild(this);
				}
			}
			now_scene.SparkGroup.addChild(this);
		}
	})

	function Spark_Effect(from){
		new Spark(from);
		new Spark(from);
		new Spark(from);
		new Spark(from);
		new Spark(from);
	}

	var LifeBar = Class.create(Sprite,{
		initialize: function(from, max){
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

			this.onenterframe = function(){
				this.moveTo(from.x - 2, from.y - 32);
			}

			now_scene.addChild(this);
		},
		Change: function(life){
			var percent = (life / this.max);
			//console.log(percent);
			var barSize = Math.round(64 * percent);
			var image = new Surface(64, 64);
				image.context.fillStyle = 'rgba(32, 32, 32, 0.5)';
				image.context.fillRect(0, 0, 64, 8);
				if(percent > 0.5){
					image.context.fillStyle = 'rgba(0, 255, 0, 1)';
				}else if(percent > 0.25){
					image.context.fillStyle = 'rgba(255, 255, 0, 1)';
				}else{
					image.context.fillStyle = 'rgba(255, 0, 0, 1)';
				}
				
				image.context.fillRect(0, 0, barSize, 8);
				image.context.lineWidth = 4;
				image.context.strokeStyle = 'rgba(180, 180, 180, 1)';
				image.context.strokeRect(0, 0, 64, 8);
			this.image = image;
		},
		Reset: function(from, max){
			this.max = max;
			var percent = (from.life / this.max);
			//console.log(percent);
			var barSize = Math.round(64 * percent);
			var image = new Surface(64, 64);
				image.context.fillStyle = 'rgba(32, 32, 32, 0.5)';
				image.context.fillRect(0, 0, 64, 8);
				if(percent > 0.5){
					image.context.fillStyle = 'rgba(0, 255, 0, 1)';
				}else if(percent > 0.25){
					image.context.fillStyle = 'rgba(255, 255, 0, 1)';
				}else{
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
				this.moveTo(f.x - this.width/2, f.y - this.height/2);
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
				rad = Rot_to_Rad(from.rotation +90);
				this.moveTo((from.x + (from.width / 2) - this.width/2) + Math.cos(rad) * (-from.height / 2), (from.y + (from.height / 2) - this.height/2) + Math.sin(rad) * (-from.height / 2));
				this.rotation = from.rotation;
			}
			now_scene.addChild(this);
		}
	});

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
		} else if (direction === 'East') {
			dfl += 1;
		} else if (direction === 'South') {
			dft += 1;
		} else if (direction === 'West') {
			dfl -= 1;
		}

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

	//	戦車の親クラス
	var TankBase = Class.create(Sprite,{
		initialize: function(x, y, category, num, scene) {
			Sprite.call(this, PixelSize - 4, PixelSize - 4);
			this.name = "Entity";
			this.time = 0;
			this.num = num;
			this.x = x * PixelSize + 2;
			this.y = y * PixelSize - 18;
			this.category = category;

			this.life = Categorys.Life[this.category];
			this.shotSpeed = Categorys.ShotSpeed[this.category];
			this.fireLate = Categorys.FireLate[this.category];
			this.ref = Categorys.MaxRef[this.category];
			this.bulMax = Categorys.MaxBullet[this.category];
			this.bomMax = Categorys.MaxBom[this.category];
			this.moveSpeed = Categorys.MoveSpeed[this.category];
			this.reload = Categorys.Reload[this.category];
			this.bodyRotSpeed = Categorys.BodyRotSpeed[this.category];

			this.bomSetFlg = false;
			this.bomReload = 0;
			this.bulReloadFlg = false;
			this.bulReloadTime = 0;
			this.shotNGflg = false;

			this.fireFlg = false;

			this.tank = new Tank(this, this.category);
			this.cannon = new Cannon(this, this.category);
			this.weak = new Weak(this, this.num);

			this.tankFrame = TankFrame(this, this.num, scene);

			this.lifeBar = new LifeBar(this, this.life);

			bullets.push(0); //  発射済み弾数カウントリセット
			bulStack.push([]);
			boms.push(0); //  設置済み爆弾カウントリセット
			deadFlgs.push(false); //  生存判定をセット
			deadTank[this.num] = false;
			
			scene.addChild(this);
		},
		_Dead: function(){
			deadFlgs[this.num] = true;
			deadTank[this.num] = true;
			new Mark(this);
			new Explosion(this); //  車体の爆破エフェクト生成
			this.moveTo(-100 * (this.num + 1), -100  * (this.num + 1)); //  戦車を移動
			//console.log(this.x)
		},
		_Rotation: function(rot){
			if(rot < 0){
				rot = 360 + rot;
			}
			let sa = this.rotation - (rot);
			if(Math.abs(sa) >= 180){
				sa = sa * -1; 
			}

			let speed = this.bodyRotSpeed;

			if(Math.abs(sa) > speed){
				let rotmove = sa == 0 ? 0 : sa > 0 ? -speed : speed;
				if(rotmove != 0){
					this.rotation += rotmove;
					if(this.rotation < 0){
						this.rotation = 360 + this.rotation;
					}else if(this.rotation > 359){
						this.rotation = this.rotation - 360;
					}
				}
				if(this.tank.rotation != this.rotation) this.tank.rotation = this.rotation;
				//console.log(this._matrix)
				return false;
			}else{
				if(sa != 0) this.rotation = rot;
				if(this.tank.rotation != this.rotation) this.tank.rotation = this.rotation;
				return true;
			}
		},
		_Move: function(rot){
			if(this._Rotation(rot)){
				rot = this.rotation - 90;
				if(rot < 0){
					rot = 360 + rot;
				}else if(rot > 359){
					rot = rot - 360;
				}
				let speed = this.moveSpeed;
				let rad = Rot_to_Rad(rot);
				let dx = Math.cos(rad) * speed;
				let dy = Math.sin(rad) * speed;
				this.moveBy(dx, dy);
				return true;
			}
			return false;
		}
	})

	
	var Entity_TypeTest = Class.create(TankBase,{
		initialize: function(x, y, category, num, scene){
			TankBase.call(this, x, y, category, num, scene);

			const Around = new InterceptAround(this);
			const Front = new InterceptFront(this.cannon);

			this.attackTarget = tankEntity[0];
			this.escapeTarget = null;

			this.cursor = new Target(this, scene);
			//this.bulMax = Categorys.MaxBullet[category];

			let damFlg = false;
			let damTime = 0;
			let damCng = false;
			let escapeFlg = false;

			for (var i = 0; i < this.bulMax; i++) {
				bulStack[this.num].push(false); //  弾の状態をoff
			}

			var EnemyAim = Class.create(Aim, {
				initialize: function(cannon, cursor, category, num) {
					Aim.call(this, cannon, cursor, category, num, scene);
				}
			})

			function Instrumentation(weak,target1, target2) {
				let dist1 = Get_Distance(weak, target1);
				let dist2 = Get_Distance(weak, target2);
				if (dist1 >= dist2) {
					return dist2;
				} else {
					return null;
				}
			}

			this.onenterframe = function(){

				if(!deadFlgs[this.num]){
					if(this.life > 0){
						if(WorldFlg){
							this.time++;
							Bullet.intersectStrict(this.weak).forEach(elem => {
								let damage = game.assets['./sound/mini_bomb2.mp3'].clone();
								damage.play();
								this.life--;
								elem.from._Destroy();		
								if(this.life > 0){
									damage.volume = 0.5;
									damFlg = true;
								}		
							});

							new EnemyAim(this.cannon, this.cursor, this.category, this.num);

							if (this.time % 5 == 0) {
								if (this.attackTarget != tankEntity[0] && escapeFlg == false) this.attackTarget = tankEntity[0];
								escapeFlg = false;
							}
	
							if(damFlg){
								if(damCng){
									this.tank.opacity = 0.0;
									this.cannon.opacity = 0.0;
								}else{
									this.tank.opacity = 1.0;
									this.cannon.opacity = 1.0;
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
									this.tank.opacity = 1.0;
									this.cannon.opacity = 1.0;
								}
							}

							if(Bullet.collection.length > 0){
								for (var i = 0, l = Bullet.collection.length; i < l; i++) {
									if(bulStack[Bullet.collection[i].num][Bullet.collection[i].id]){
										if(this.within(Bullet.collection[i], 300)){
											this.attackTarget = Bullet.collection[i];
										}
									}
								}
							}

							TankObstracle.intersect(this).forEach(elem => {
								if(!deadFlgs[elem.num] && elem.num != this.num){
									switch(elem.name){
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
								switch(elem.name){
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
					}else{
						this._Dead();
					}
				}
				
			}
		},
		_Attack: function(){
			if (WorldFlg) { //  処理しても良い状態か
				if (bullets[this.num] < this.bulMax && deadFlgs[this.num] == false) { //  発射最大数に到達していないか＆死んでいないか
					for (let i = 0; i < this.bulMax; i++) {
						if (bulStack[this.num][i] == false) { //  弾の状態がoffならば
							new BulletCol(this.shotSpeed, this.ref, this.cannon, this.category, this.num, i)._Shot();
							break;
						}
					}

				}
			}
		}
	});

	//	自機型
	var Entity_Type0 = Class.create(TankBase, {
		initialize: function(x, y, category, num, scene){
			TankBase.call(this, x, y, category, num, scene);
			let my = this;
			this.cursor = new Cursor(scene);
			this.rot = 0;

			if(this.moveSpeed < 2.0){
				this.moveSpeed = 2.0;
			}

			if(this.bomMax == 0){
				this.bomMax = 1;
			}

			if(playerLife != 0){
				if((playerLife % Categorys.Life[this.category]) <= (Categorys.Life[this.category] - 5)){
					this.life = playerLife + 5;
					this.lifeBar.Change(this.life);
				}else{
					playerLife = 0;
				}
			}
			
			

			if(gameMode > 0){
				if(gameMode == 2){
					this.life += Categorys.Life[this.category] * (zanki - 1);
					/*if(playerLife != 0){
						this.life = playerLife + Categorys.Life[this.category] * (zanki - 1);
						if((this.life % Categorys.Life[this.category]) <= (Categorys.Life[this.category] - 5)){
							this.life+=5;
						}else{
							this.life = Categorys.Life[this.category] * zanki;
						}
					}else{
						this.life = Categorys.Life[this.category] * zanki;
					}*/
					
					this.lifeBar.Reset(this, Categorys.Life[this.category] * (zanki));
				}
				switch(category){
					case 1:
						this.shotSpeed += 2;
						this.bulMax += 2;
						break;
					case 2:
						this.shotSpeed += 1;
						this.bulMax += 1;
						break;
					case 3:
						this.moveSpeed += 0.5;
						this.bulMax += 1;
						this.ref = 1;
						break;
					case 4:
						this.shotSpeed += 1;
						this.bulMax += 1;
						break;
					case 5:
						this.moveSpeed += 0.5;
						this.bulMax += 1;
						break;
					case 6:
						this.moveSpeed += 0.5;
						this.shotSpeed += 1;
						this.bulMax += 1;
						break;
					case 7:
						this.bulMax += 1;
						break;
					case 8:
						this.moveSpeed += 0.5;
						break;
					case 9:
						this.bulMax += 1;
						this.fireLate -= 2;
						break;
					case 10:
						this.moveSpeed += 0.5;
						this.bomMax += 2;
						break;
					case 11:
						this.shotSpeed += 1;
						this.bulMax += 1;
						break;
				}
			}
			//console.log(this.life)
			this.weak.scale(0.8, 0.8);

			let damFlg = false;
			let damTime = 0;
			let damCng = false;

			this.shotStopFlg = false;
			this.shotStopTime = 0;

			this.fullFireFlg = false;
			this.firecnt = 0;
			this.firstFireFlg = false;

			for (var i = 0; i < this.bulMax; i++) {
				bulStack[this.num].push(false); //  弾の状態をoff
			}

			if (!navigator.userAgent.match(/iPhone|iPad|Android/)) {
				scene.addEventListener('touchstart', function() {
					if(my.category == 9 && (my.fullFireFlg || my.firecnt > 0) || my.shotNGflg) return;
					my._Attack();
				})
			}
			

			this.onenterframe = function(){
				if(!deadFlgs[this.num] && gameStatus == 0){
					if(this.life > 0){
						if(WorldFlg){
							this.time++;
							if(!damFlg){
								Bullet.intersectStrict(this.weak).forEach(elem => {
									let damage = game.assets['./sound/mini_bomb2.mp3'].clone();
									damage.play();
									let damValue = Math.round(elem.from.shotSpeed * ((elem.scaleX + elem.scaleY) / 2));
									let randomPercent = 10;
									if(elem.from.category == 0){
										randomPercent = 5;
									}else if(elem.from.category == 9){
										randomPercent = 3;
									}
									if(Math.floor(Math.random() * randomPercent) == 0){
										damValue = Math.round(damValue * 2);
										this.life-=damValue;
										new ViewDamage(this, damValue, true);
									}else{
										this.life-=damValue;
										new ViewDamage(this, damValue, false);
									}
									//console.log(this.life + ' ' + damValue)
									
									
									//if(gameMode == 2 && this.life < (Categorys.Life[this.category] * (zanki - 1))){
										//zanki--;
									//}
									if(gameMode == 2){
										zanki = Math.floor((this.life-1) / Categorys.Life[this.category]) + 1;
									}
									elem.from._Destroy();		
									if(this.life > 0){
										this.lifeBar.Change(this.life);
										damage.volume = 0.5;
										damFlg = true;
									}		
								})
							}
							
							if(damFlg){
								if(damCng){
									this.tank.opacity = 0.0;
									this.cannon.opacity = 0.0;
								}else{
									this.tank.opacity = 1.0;
									this.cannon.opacity = 1.0;
								}
								if(damTime % 5 == 0){
									if(damCng){
										damCng = false;
									}else{
										damCng = true;
									}
								}
								damTime++;
								if(damTime > 90){
									damFlg = false;
									damCng = false;
									damTime = 0;
									this.tank.opacity = 1.0;
									this.cannon.opacity = 1.0;
								}
							}
	
							if ((inputManager.checkButton("A") == inputManager.keyStatus.DOWN)) {
								if(this.category == 9 && (this.fullFireFlg || this.firecnt > 0) || this.shotNGflg) return;
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
							}
		
							if(playerType == 1 || playerType == 7){
								new PlayerRefAim(this.ref, this.cannon, this.cursor, this.category, this.num);
							}else{
								let aim = new Aim(this.cannon, this.cursor, this.category, this.num);
								if(this.category == 9 && this.bulReloadFlg){
									let n_color = new Surface(aim.width, aim.height);
										n_color.context.beginPath();
										n_color.context.fillStyle = 'rgba(255, 0, 0, 0.4)';
										n_color.context.arc(4, 4, 4, 0, Math.PI * 2, true);
										n_color.context.fill();
									aim.image = n_color;
								}
							}

							if(this.category == 9){
								if (this.bulReloadFlg == false) {
									if (bullets[this.num] == this.bulMax || this.firecnt >= this.bulMax){
										this.bulReloadFlg = true;
									} 
								} else {
									if (this.bulReloadTime < this.reload) {
										this.bulReloadTime++;
										if (this.shotNGflg == false) this.shotNGflg = true;
									} else {
										this.shotNGflg = false;
										this.bulReloadFlg = false;
										this.bulReloadTime = 0;
										this.fullFireFlg = false;
										this.firecnt = 0;
										this.firstFireFlg = false;
									}

								}
								
								if (this.fullFireFlg && this.firecnt >= 0 && !this.shotNGflg) {
									if(!this.firstFireFlg){
										this.firstFireFlg = true;
										this.time = 0;
									}else{
										if(this.time % this.fireLate == 0){
											this._Attack();
										}
									}
								}
							}
							

							if(!this.shotStopFlg){
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
								if(!deadFlgs[elem.num] && elem.num != this.num){
									switch(elem.name){
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
								switch(elem.name){
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
					}else{
						if(gameMode == 2){
							zanki = 0;
						}else{
							zanki--;
						}
						this._Dead();
					}
				}
				
				
			}
		},
		_Attack: function(){
			if (WorldFlg && gameStatus == 0) { //  処理しても良い状態か
				if (bullets[this.num] < this.bulMax && deadFlgs[this.num] == false) { //  発射最大数に到達していないか＆死んでいないか
					for (let i = 0; i < this.bulMax; i++) {
						if (bulStack[this.num][i] == false) { //  弾の状態がoffならば
							this.shotStopFlg = true;
							new BulletCol(this.shotSpeed, this.ref, this.cannon, this.category, this.num, i)._Shot();
							if(this.category == 9){
								this.fullFireFlg = true;
								this.firecnt++;
							}
							break;
						}
					}

				}		
			}
		}
	});

	//	最短追尾型
	var Entity_Type1 = Class.create(TankBase,{
		initialize: function(x, y, category, num, scene){
			TankBase.call(this, x, y, category, num, scene);

			const Around = new InterceptAround(this);
			const Front = new InterceptFront(this.cannon);
			const target = tankEntity[0];

			this.attackTarget = tankEntity[0];
			this.escapeTarget = null;

			this.cursor = new Target(this, scene);

			let damFlg = false;
			let damTime = 0;
			let damCng = false;
			let escapeFlg = false;

			this.shotStopFlg = false;
			this.shotStopTime = 0;
			this.tankStopFlg = false;
			this.stopTime = 0;

			var myPath = [0, 0];
			var targetPath = [0, 0];

			var map = scene.backgroundMap;
			var grid = scene.grid;
			var root;
			var moveCnt = 0 //  移動距離
			var moveCmp = 64;
			var returnFlg = false;

			var rot = 0;
			var cflg = false;

			if(gameMode > 0){
				switch(category){
					case 2:
						this.shotSpeed += 1;
						this.bulMax += 1;
						this.moveSpeed += 0.5;
						break;
					case 4:
						this.shotSpeed += 1;
						this.bulMax += 1;
						break;
				}
			}

			for (var i = 0; i < this.bulMax; i++) {
				bulStack[this.num].push(false); //  弾の状態をoff
			}

			var EnemyAim = Class.create(Aim, {
				initialize: function(cannon, cursor, category, num) {
					Aim.call(this, cannon, cursor, category, num, scene);
				}
			});

			function Instrumentation(weak,target1, target2) {
				let dist1 = Get_Distance(weak, target1);
				let dist2 = Get_Distance(weak, target2);
				if (dist1 >= dist2) {
					return dist2;
				} else {
					return null;
				}
			}

			this.onenterframe = function(){
				if(!deadFlgs[this.num] && gameStatus == 0){
					if(this.life > 0){
						if(WorldFlg){
							if(!damFlg){
								Bullet.intersectStrict(this.weak).forEach(elem => {
									let damage = game.assets['./sound/mini_bomb2.mp3'].clone();
									damage.play();
									let damValue = Math.round(elem.from.shotSpeed * ((elem.scaleX + elem.scaleY) / 2));
									let randomPercent = 10;
									if(elem.from.category == 0){
										randomPercent = 5;
									}else if(elem.from.category == 9){
										randomPercent = 3;
									}
									if(Math.floor(Math.random() * randomPercent) == 0){
										damValue = Math.round(damValue * 2);
										this.life-=damValue;
										new ViewDamage(this, damValue, true);
									}else{
										this.life-=damValue;
										new ViewDamage(this, damValue, false);
									}
									
									elem.from._Destroy();		
									if(this.life > 0){
										this.lifeBar.Change(this.life);
										damage.volume = 0.5;
										damFlg = true;
									}		
								})
							}

							if(damFlg){
								if(damCng){
									this.tank.opacity = 0.0;
									this.cannon.opacity = 0.0;
								}else{
									this.tank.opacity = 1.0;
									this.cannon.opacity = 1.0;
								}
								if(damTime % 4 == 0){
									if(damCng){
										damCng = false;
									}else{
										damCng = true;
									}
								}
								damTime++;
								if(damTime > 24){
									damFlg = false;
									damCng = false;
									damTime = 0;
									this.tank.opacity = 1.0;
									this.cannon.opacity = 1.0;
								}
							}

							if(this.time % 2 == 0){
								this.fireFlg = false; //  発射状態をリセット
								this.shotNGflg = false;
								if (this.moveSpeed > 0 && !this.tankStopFlg) {
									//  自身の位置とターゲットの位置をざっくり算出
									myPath = [parseInt((this.y + this.height/2) / PixelSize), parseInt((this.x + this.width/2) / PixelSize)]
									targetPath = [parseInt((target.y + target.height/2) / PixelSize), parseInt((target.x + target.width/2) / PixelSize)]
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
											rot = 90;
											let center = Get_Center(this);
											moveCmp = Math.round(Vec_Distance(center, {x: PixelSize * (myPath[1] + 1) + 32, y: PixelSize * (myPath[0]) + 14}));
										} else if (root[0] == "West") {
											rot = 270;
											let center = Get_Center(this);
											moveCmp = Math.round(Vec_Distance(center, {x: PixelSize * (myPath[1] - 1) + 32, y: PixelSize * (myPath[0]) + 14}));
										} else if (root[0] == "North") {
											rot = 0;
											let center = Get_Center(this);
											moveCmp = Math.round(Vec_Distance(center, {x: PixelSize * (myPath[1]) + 32, y: PixelSize * (myPath[0] - 1) + 14}));
										} else if (root[0] == "South") {
											rot = 180;
											let center = Get_Center(this);
											moveCmp = Math.round(Vec_Distance(center, {x: PixelSize * (myPath[1]) + 32, y: PixelSize * (myPath[0] + 1) + 14}));
										}
										//console.log(moveCmp)
									}
									
								}
								if (this.tankStopFlg) this.tankStopFlg = false;
							}

							for(let i = 0; i < tankEntity.length; i++){
								if (i != this.num && !deadFlgs[i]) {
									if(this.tankFrame[0].intersectStrict(tankEntity[i])){
										if(this.rotation == 0){
											this.tankStopFlg = true;

											this.y += this.moveSpeed;
											moveCnt -= this.moveSpeed;
										}
									}else if(this.tankFrame[1].intersectStrict(tankEntity[i])){
										if(this.rotation == 180){
											this.tankStopFlg = true;

											this.y -= this.moveSpeed;
											moveCnt -= this.moveSpeed;
										}
									}else if(this.tankFrame[2].intersectStrict(tankEntity[i])){
										if(this.rotation == 270){
											this.tankStopFlg = true;

											this.x += this.moveSpeed;
											moveCnt -= this.moveSpeed;
										}
									}else if(this.tankFrame[3].intersectStrict(tankEntity[i])){
										if(this.rotation == 90){
											this.tankStopFlg = true;
											
											this.x -= this.moveSpeed;
											moveCnt -= this.moveSpeed;
										}
									}
								}
							}
							if(this.tankStopFlg){
								if(!returnFlg){
									if (root[0] == "East") {
										rot = 270;
										let center = Get_Center(this);
										moveCmp = Math.round(Vec_Distance(center, {x: PixelSize * (myPath[1] + 1) + 32, y: PixelSize * (myPath[0]) + 14}));
									} else if (root[0] == "West") {
										rot = 90;
										let center = Get_Center(this);
										moveCmp = Math.round(Vec_Distance(center, {x: PixelSize * (myPath[1] - 1) + 32, y: PixelSize * (myPath[0]) + 14}));
									} else if (root[0] == "North") {
										rot = 180;
										let center = Get_Center(this);
										moveCmp = Math.round(Vec_Distance(center, {x: PixelSize * (myPath[1]) + 32, y: PixelSize * (myPath[0] - 1) + 14}));
									} else if (root[0] == "South") {
										rot = 0;
										let center = Get_Center(this);
										moveCmp = Math.round(Vec_Distance(center, {x: PixelSize * (myPath[1]) + 32, y: PixelSize * (myPath[0] + 1) + 14}));
									}
									//console.log(rot);
									//moveCnt = moveCmp - Math.abs(moveCnt);
									returnFlg = true;
								}
								this.stopTime++;
							}
							this.time++;

							if(this.time % 60 == 0){
								grid = scene.grid;
								//console.log(myPath);
							} 

							if(this.stopTime % 30 == 0 && this.stopTime > 0 && !returnFlg){
								this.stopTime = 0;
								myPath = [parseInt((this.y + this.height/2) / PixelSize), parseInt((this.x + this.width/2) / PixelSize)]
								switch(rot){
									case 0:
										grid[myPath[0]-1][myPath[1]] = 'Obstacle';
										break;
									case 90:
										grid[myPath[0]][myPath[1]+1] = 'Obstacle';
										break;
									case 180:
										grid[myPath[0]+1][myPath[1]] = 'Obstacle';
										break;
									case 270:
										grid[myPath[0]][myPath[1]-1] = 'Obstacle';
										break;
								}
								root = findShortestPath([myPath[0], myPath[1]], grid, scene);
								if (root[0] == "East") {
									rot = 90;
									let center = Get_Center(this);
									moveCmp = Math.round(Vec_Distance(center, {x: PixelSize * (myPath[1] + 1) + 32, y: PixelSize * (myPath[0]) + 14}));
								} else if (root[0] == "West") {
									rot = 270;
									let center = Get_Center(this);
									moveCmp = Math.round(Vec_Distance(center, {x: PixelSize * (myPath[1] - 1) + 32, y: PixelSize * (myPath[0]) + 14}));
								} else if (root[0] == "North") {
									rot = 0;
									let center = Get_Center(this);
									moveCmp = Math.round(Vec_Distance(center, {x: PixelSize * (myPath[1]) + 32, y: PixelSize * (myPath[0] - 1) + 14}));
								} else if (root[0] == "South") {
									rot = 180;
									let center = Get_Center(this);
									moveCmp = Math.round(Vec_Distance(center, {x: PixelSize * (myPath[1]) + 32, y: PixelSize * (myPath[0] + 1) + 14}));
								}
								//console.log(moveCmp)
								//moveCnt = 0
								moveCnt = moveCmp - Math.abs(moveCnt);
							}

							if (this.shotStopFlg) {
								this.shotStopTime++;
								if (this.shotStopTime > 10) {
									this.shotStopFlg = false;
									this.shotStopTime = 0;
								}
							}

							new EnemyAim(this.cannon, this.cursor, this.category, this.num);

							EnemyAim.intersect(this.cursor).forEach(elem => {
								if(!this.fireFlg)this.fireFlg = true; //  発射可能状態にする
								return;
							})

							if (this.time % 5 == 0) {
								if (this.attackTarget != tankEntity[0] && escapeFlg == false) this.attackTarget = tankEntity[0];
								escapeFlg = false;
							}

							if(Bullet.collection.length > 0){
								for (var i = 0, l = Bullet.collection.length; i < l; i++) {
									let c = Bullet.collection[i];
									if(!bulStack[c.num][c.id]) continue;
									if(c.num == 0 && !Categorys.DefenceFlg[this.category][0]) continue;
									if(c.num == this.num && !Categorys.DefenceFlg[this.category][1]) continue;
									if(!(c.num == 0 || c.num == this.num) && !Categorys.DefenceFlg[this.category][2]) continue;
									let dist = Instrumentation(this.weak, this.attackTarget, c);
									switch(c.num){
										case 0:
											if (dist != null && dist < Categorys.DefenceRange[this.category][0]) {
												PlayerBulAim.intersectStrict(Around).forEach(elem => {
													if(elem.target == c){
														this.attackTarget = c; //  迎撃のためにターゲット変更
														escapeFlg = true;
													}
												})
											}
											break;

										case this.num:
											if(this.ref == 0) break;
											if (dist != null && dist < Categorys.DefenceRange[this.category][1] && dist > 100) {
												BulAim.intersectStrict(Around).forEach(elem => {
													if(elem.target == c){
														this.attackTarget = c; //  迎撃のためにターゲット変更
														escapeFlg = true;
													}
												})
											}
											
											break;

										default:
											if (dist != null && dist < Categorys.DefenceRange[this.category][2]) {
												BulAim.intersect(Around).forEach(elem => {
													if(elem.target == c){
														this.attackTarget = c; //  迎撃のためにターゲット変更
														escapeFlg = true;
													}
												})
											}
											break;
									}
								}
							}

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

							if (!this.shotNGflg) {
								if (this.time % this.fireLate == 0 && this.fireFlg) {
									//if(bulStack[this.num][Math.floor(Math.random() * this.bulMax)] == false) {
									if (Math.floor(Math.random() * this.bulMax * 2) > bullets[this.num]) {
										this._Attack();
									}
								}
							}

							if(this.moveSpeed > 0){
								if(returnFlg){
									cflg = this._Move(rot);
									if(cflg) moveCnt += this.moveSpeed;
									if(moveCnt >= moveCmp){
										if(moveCnt > moveCmp){
											let rad = Rot_to_Rad(rot - 270);
											let dx = Math.cos(rad) * (moveCnt - moveCmp);
											let dy = Math.sin(rad) * (moveCnt - moveCmp);
											this.moveBy(dx, dy);
										}
										returnFlg = false;
										myPath = [parseInt((this.y + this.height/2) / PixelSize), parseInt((this.x + this.width/2) / PixelSize)];
										if (root[0] == "East") {
											rot = 90;
										} else if (root[0] == "West") {
											rot = 270;
										} else if (root[0] == "North") {
											rot = 0;
										} else if (root[0] == "South") {
											rot = 180;
										}
										switch(rot){
											case 0:
												grid[myPath[0]-1][myPath[1]] = 'Obstacle';
												break;
											case 90:
												grid[myPath[0]][myPath[1]+1] = 'Obstacle';
												break;
											case 180:
												grid[myPath[0]+1][myPath[1]] = 'Obstacle';
												break;
											case 270:
												grid[myPath[0]][myPath[1]-1] = 'Obstacle';
												break;
										}
										root = findShortestPath([myPath[0], myPath[1]], grid, scene);
										if (root[0] == "East") {
											rot = 90;
											let center = Get_Center(this);
											moveCmp = Math.round(Vec_Distance(center, {x: PixelSize * (myPath[1] + 1) + 32, y: PixelSize * (myPath[0]) + 14}));
										} else if (root[0] == "West") {
											rot = 270;
											let center = Get_Center(this);
											moveCmp = Math.round(Vec_Distance(center, {x: PixelSize * (myPath[1] - 1) + 32, y: PixelSize * (myPath[0]) + 14}));
										} else if (root[0] == "North") {
											rot = 0;
											let center = Get_Center(this);
											moveCmp = Math.round(Vec_Distance(center, {x: PixelSize * (myPath[1]) + 32, y: PixelSize * (myPath[0] - 1) + 14}));
										} else if (root[0] == "South") {
											rot = 180;
											let center = Get_Center(this);
											moveCmp = Math.round(Vec_Distance(center, {x: PixelSize * (myPath[1]) + 32, y: PixelSize * (myPath[0] + 1) + 14}));
										}
										moveCnt = 0
									}
								}else if (!this.shotStopFlg && !this.tankStopFlg) {
									//  移動処理
									if (root != false && !Around.intersect(target)) {
										cflg = this._Move(rot);
										if(cflg) moveCnt += this.moveSpeed;	
									}
									//console.log(moveCnt);
									if (moveCnt >= moveCmp) {
										if(moveCnt > moveCmp){
											let rad = Rot_to_Rad(this.rotation - 270);
											let dx = Math.cos(rad) * (moveCnt - moveCmp);
											let dy = Math.sin(rad) * (moveCnt - moveCmp);
											this.moveBy(dx, dy);
											//console.log(dx + ' ' + dy)
										}
										myPath = [parseInt((this.y + this.height/2) / PixelSize), parseInt((this.x + this.width/2) / PixelSize)];
										root = findShortestPath([myPath[0], myPath[1]], grid, scene)
										if (root[0] == "East") {
											rot = 90;
											let center = Get_Center(this);
											moveCmp = Math.round(Vec_Distance(center, {x: PixelSize * (myPath[1] + 1) + 32, y: PixelSize * (myPath[0]) + 14}));
										} else if (root[0] == "West") {
											rot = 270;
											let center = Get_Center(this);
											moveCmp = Math.round(Vec_Distance(center, {x: PixelSize * (myPath[1] - 1) + 32, y: PixelSize * (myPath[0]) + 14}));
										} else if (root[0] == "North") {
											rot = 0;
											let center = Get_Center(this);
											moveCmp = Math.round(Vec_Distance(center, {x: PixelSize * (myPath[1]) + 32, y: PixelSize * (myPath[0] - 1) + 14}));
										} else if (root[0] == "South") {
											rot = 180;
											let center = Get_Center(this);
											moveCmp = Math.round(Vec_Distance(center, {x: PixelSize * (myPath[1]) + 32, y: PixelSize * (myPath[0] + 1) + 14}));
										}
										
										moveCnt = 0
									}
								}
								if (root == false) {
									root = findShortestPath([myPath[0], myPath[1]], grid, scene);
									if (root[0] == "East") {
										rot = 90;
										let center = Get_Center(this);
										moveCmp = Math.round(Vec_Distance(center, {x: PixelSize * (myPath[1] + 1) + 32, y: PixelSize * (myPath[0]) + 14}));
									} else if (root[0] == "West") {
										rot = 270;
										let center = Get_Center(this);
										moveCmp = Math.round(Vec_Distance(center, {x: PixelSize * (myPath[1] - 1) + 32, y: PixelSize * (myPath[0]) + 14}));
									} else if (root[0] == "North") {
										rot = 0;
										let center = Get_Center(this);
										moveCmp = Math.round(Vec_Distance(center, {x: PixelSize * (myPath[1]) + 32, y: PixelSize * (myPath[0] - 1) + 14}));
									} else if (root[0] == "South") {
										rot = 180;
										let center = Get_Center(this);
										moveCmp = Math.round(Vec_Distance(center, {x: PixelSize * (myPath[1]) + 32, y: PixelSize * (myPath[0] + 1) + 14}));
									}
									moveCnt = 0
								}
							}

							
							/*TankObstracle.intersect(this).forEach(elem => {
								if(!deadFlgs[elem.num] && elem.num != this.num){
									switch(elem.name){
										case 'TankTop':
											if(this.rotation == 180){
												tankStopFlg = true;
												if (!this.shotStopFlg) {
													this.y -= this.moveSpeed;
												}
											}
											break;
										case 'TankBottom':
											if(this.rotation == 0){
												tankStopFlg = true;
												if (!this.shotStopFlg){
													this.y += this.moveSpeed;
												}
											}
											break;
										case 'TankLeft':
											if(this.rotation == 90){
												tankStopFlg = true;
												if (!this.shotStopFlg){
													this.x += this.moveSpeed;
												}
											}
											break;
										case 'TankRight':
											if(this.rotation == 270){
												tankStopFlg = true;
												if (!this.shotStopFlg){
													this.x -= this.moveSpeed;
												}
											}
											break;
									}
									root = false;
								}
							})*/

							Obstracle.intersect(this).forEach(elem => {
								switch(elem.name){
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
								//if(cflg)this.tankStopFlg = true;
								if(cflg){
									myPath = [parseInt((this.y + this.height/2) / PixelSize), parseInt((this.x + this.width/2) / PixelSize)];
									switch(rot){
										case 0:
											grid[myPath[0]-1][myPath[1]] = 'Obstacle';
											break;
										case 90:
											grid[myPath[0]][myPath[1]+1] = 'Obstacle';
											break;
										case 180:
											grid[myPath[0]+1][myPath[1]] = 'Obstacle';
											break;
										case 270:
											grid[myPath[0]][myPath[1]-1] = 'Obstacle';
											break;
									}
									root = findShortestPath([myPath[0], myPath[1]], grid, scene);
									if (root[0] == "East") {
										rot = 90;
										let center = Get_Center(this);
										moveCmp = Math.round(Vec_Distance(center, {x: PixelSize * (myPath[1] + 1) + 32, y: PixelSize * (myPath[0]) + 14}));
									} else if (root[0] == "West") {
										rot = 270;
										let center = Get_Center(this);
										moveCmp = Math.round(Vec_Distance(center, {x: PixelSize * (myPath[1] - 1) + 32, y: PixelSize * (myPath[0]) + 14}));
									} else if (root[0] == "North") {
										rot = 0;
										let center = Get_Center(this);
										moveCmp = Math.round(Vec_Distance(center, {x: PixelSize * (myPath[1]) + 32, y: PixelSize * (myPath[0] - 1) + 14}));
									} else if (root[0] == "South") {
										rot = 180;
										let center = Get_Center(this);
										moveCmp = Math.round(Vec_Distance(center, {x: PixelSize * (myPath[1]) + 32, y: PixelSize * (myPath[0] + 1) + 14}));
									}
									moveCnt = 0
								}
							})
						}
					}else{
						destruction++;
						this._Dead();
					}
				}
			}
		},
		_Attack: function(){
			if (WorldFlg) { //  処理しても良い状態か
				if (bullets[this.num] < this.bulMax && deadFlgs[this.num] == false) { //  発射最大数に到達していないか＆死んでいないか
					for (let i = 0; i < this.bulMax; i++) {
						if (bulStack[this.num][i] == false) { //  弾の状態がoffならば
							this.shotStopFlg = true;
							new BulletCol(this.shotSpeed, this.ref, this.cannon, this.category, this.num, i)._Shot();
							break;
						}
					}

				}
			}
		}
	});

	//	攻守両立型
	var Entity_Type2 = Class.create(TankBase,{
		initialize: function(x, y, category, num, scene){
			TankBase.call(this, x, y, category, num, scene);

			const Around = new InterceptAround(this);
			const Front = new InterceptFront(this.cannon);
			const target = tankEntity[0];

			this.attackTarget = tankEntity[0];
			this.escapeTarget = null;

			this.cursor = new Target(this, scene);

			let damFlg = false;
			let damTime = 0;
			let damCng = false;
			let escapeFlg = false;

			this.shotStopFlg = false;
			this.shotStopTime = 0;

			var dirValue = 0;
			var hittingTime = 0;

			var rot = 0;

			var shadow = new Surface(this.width, this.height);
				shadow.context.beginPath();
				shadow.context.fillStyle = 'rgba(0, 0, 0, 0.1)';
				shadow.context.arc(30, 30, 24, 0, Math.PI * 2, true);
				shadow.context.fill();
			
			if(gameMode > 0){
				switch(category){
					case 3:
						this.moveSpeed += 0.5;
						this.bulMax += 1;
						this.ref = 1;
						this.reload += 90;
						break;
					case 8:
						this.moveSpeed += 0.5;
						this.reload -= 240;
						break;
				}
			}

			for (var i = 0; i < this.bulMax; i++) {
				bulStack[this.num].push(false); //  弾の状態をoff
			}

			var EnemyAim = Class.create(Aim, {
				initialize: function(cannon, cursor, category, num) {
					Aim.call(this, cannon, cursor, category, num, scene);
				}
			});

			function Instrumentation(weak,target1, target2) {
				let dist1 = Get_Distance(weak, target1);
				let dist2 = Get_Distance(weak, target2);
				if (dist1 >= dist2) {
					return dist2;
				} else {
					return null;
				}
			}

			function SelDirection(target1, target2, or) {
				let arr = [0,1,2,3];
				//	0:	離れる	1:	近寄る
				//	0:	上
				// 	1:	右
				// 	2:	下
				// 	3:	左
				if (or == 0) {
					if ((target1.x + target1.width / 2) > (target2.x + target2.width / 2)) {		//	相手より右にいる場合
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {	//	相手より下にいる場合
							arr = [1,2];
						} else {
							arr = [1,0];
						}
					} else {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							arr = [2,3];
						} else {
							arr = [0,3];
						}
					}
				} else if (or == 1) {
					if ((target1.x + target1.width / 2) > (target2.x + target2.width / 2)) {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							arr = [0,3];
						} else {
							arr = [2,3];
						}
					} else {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							arr = [0,1];
						} else {
							arr = [1,2];
						}
					}
				}
				if(arr.indexOf(dirValue) == -1) dirValue = arr[Math.floor(Math.random() * arr.length)];
			}

			this.onenterframe = function(){
				if(!deadFlgs[this.num] && gameStatus == 0){
					if(this.life > 0){
						if(WorldFlg){
							if(this.category == 8 && this.time == 0){
								new Flash(this);
								this.tank.opacity = 0;
								this.cannon.opacity = 0;
								this.image = shadow;
								this.lifeBar.opacity = 0;
							}

							if(!damFlg){
								Bullet.intersectStrict(this.weak).forEach(elem => {
									let damage = game.assets['./sound/mini_bomb2.mp3'].clone();
									damage.play();
									let damValue = Math.round(elem.from.shotSpeed * ((elem.scaleX + elem.scaleY) / 2));
									let randomPercent = 10;
									if(elem.from.category == 0){
										randomPercent = 5;
									}else if(elem.from.category == 9){
										randomPercent = 3;
									}
									if(Math.floor(Math.random() * randomPercent) == 0){
										damValue = Math.round(damValue * 2);
										this.life-=damValue;
										new ViewDamage(this, damValue, true);
									}else{
										this.life-=damValue;
										new ViewDamage(this, damValue, false);
									}
									
									elem.from._Destroy();		
									if(this.life > 0){
										this.lifeBar.opacity = 1.0;
										this.lifeBar.Change(this.life);
										damage.volume = 0.5;
										damFlg = true;
									}		
								})
							}

							if(damFlg){
								if(damCng){
									this.tank.opacity = 0.0;
									this.cannon.opacity = 0.0;
								}else{
									this.tank.opacity = 1.0;
									this.cannon.opacity = 1.0;
								}
								if(damTime % 4 == 0){
									if(damCng){
										damCng = false;
									}else{
										damCng = true;
									}
								}
								damTime++;
								if(damTime > 24){
									damFlg = false;
									damCng = false;
									damTime = 0;
									if(this.category == 8){
										new Flash(this);
										this.tank.opacity = 0.0;
										this.cannon.opacity = 0.0;
										this.lifeBar.opacity = 0;
									}else{
										this.tank.opacity = 1.0;
										this.cannon.opacity = 1.0;
									}
								}
							}

							this.time++;

							if (this.time % 2 == 0) {
								this.shotNGflg = false;
								this.fireFlg = false;
							}

							if (hittingTime > 20) {
								let arr = [];
								switch(dirValue){
									case 0:
									case 1:
										arr = [2,3];
										break;
									case 2:
									case 3:
										arr = [0,1];
										break;
								}
								if(arr.indexOf(dirValue) == -1){
									dirValue = arr[Math.floor(Math.random() * arr.length)];
								}
								
								hittingTime = 0;
							}

							if (this.shotStopFlg) {
								this.shotStopTime++;
								if (this.shotStopTime > 10) {
									this.shotStopFlg = false;
									this.shotStopTime = 0;
								}
							}

							new EnemyAim(this.cannon, this.cursor, this.category, this.num);

							EnemyAim.intersect(this.cursor).forEach(elem => {
								if(!this.fireFlg)this.fireFlg = true; //  発射可能状態にする
								return;
							})

							if (this.time % 5 == 0) {
								if (this.attackTarget != tankEntity[0] && escapeFlg == false) this.attackTarget = tankEntity[0];
								escapeFlg = false;
							}

							if(Bullet.collection.length > 0){
								for (var i = 0, l = Bullet.collection.length; i < l; i++) {
									let c = Bullet.collection[i];
									if(!bulStack[c.num][c.id]) continue;
									if(c.num == 0 && !Categorys.DefenceFlg[this.category][0]) continue;
									if(c.num == this.num && !Categorys.DefenceFlg[this.category][1]) continue;
									if(!(c.num == 0 || c.num == this.num) && !Categorys.DefenceFlg[this.category][2]) continue;
									let dist = Instrumentation(this.weak, this.attackTarget, c);
									switch(c.num){
										case 0:
											if (dist != null && dist < Categorys.DefenceRange[this.category][0]) {
												PlayerBulAim.intersectStrict(Around).forEach(elem => {
													if(elem.target == c)this.attackTarget = c; //  迎撃のためにターゲット変更
												})
												if (Categorys.EscapeRange[this.category][0] == true && Categorys.EscapeRange[this.category][1] != 0) {
													if (dist < Categorys.EscapeRange[this.category][1]) {
														this.escapeTarget = c;
														escapeFlg = true;
													}
												}
											}
											break;

										case this.num:
											if(this.ref == 0) break;
											if (dist != null && dist < Categorys.DefenceRange[this.category][1] && dist > 100) {
												BulAim.intersectStrict(Around).forEach(elem => {
													if(elem.target == c){
														if (Categorys.EscapeRange[this.category][0] == true && Categorys.EscapeRange[this.category][2] != 0) {
															if (dist < Categorys.EscapeRange[this.category][2]) {
																this.escapeTarget = c;
																escapeFlg = true;
															}
														}
														this.attackTarget = c; //  迎撃のためにターゲット変更
													}
												})
											}
											break;

										default:
											if (dist != null && dist < Categorys.DefenceRange[this.category][2]) {
												BulAim.intersect(Around).forEach(elem => {
													if(elem.target == c){
														this.attackTarget = c; //  迎撃のためにターゲット変更
													}
												})
												if (Categorys.EscapeRange[this.category][0] == true && Categorys.EscapeRange[this.category][3] != 0) {
													if (dist < Categorys.EscapeRange[this.category][3]) {
														this.escapeTarget = c;
														escapeFlg = true;
													}
												}
											}
											break;
									}
								}
							}

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
									if(escapeFlg){
										SelDirection(this.weak, this.escapeTarget, 0);
									}else{
										if (Math.sqrt(Math.pow(this.weak.x - this.attackTarget.x, 2) + Math.pow(this.weak.y - this.attackTarget.y, 2)) < Categorys.Distances[category]) {
											SelDirection(this.weak, this.attackTarget, 0);
										}else{
											if (this.time % 10 == 0) {
												SelDirection(this.weak, this.attackTarget, 1);
											}
										}
										if((tankEntity.length - destruction) - 1 > 2){
											for (var i = 0; i < tankEntity.length; i++) {
												if (i != this.num && deadFlgs[i] == false) {
													if (tankEntity[i].intersectStrict(Around)) {
														SelDirection(this.weak, tankEntity[i], 0);
														break;
													}
												}
											}
										}
										if(Bom.collection.length > 0){
											for (var i = 0, l = Bom.collection.length; i < l; i++) {
												let c = Bom.collection[i];
												if(Math.sqrt(Math.pow(this.weak.x - c.x, 2) + Math.pow(this.weak.y - c.y, 2)) < 150){
													SelDirection(this.weak, c, 0);
													break;
												}
											}
										}
									}
								}
								if (!this.shotStopFlg) {
									if (dirValue == 0) {
										rot = 0;
									} else if (dirValue == 1) {
										rot = 90;
									} else if (dirValue == 2) {
										rot = 180;
									} else if (dirValue == 3) {
										rot = 270;
									}
									this._Move(rot);
								}
							}

							TankObstracle.intersect(this).forEach(elem => {
								if(!deadFlgs[elem.num] && elem.num != this.num){
									switch(elem.name){
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
									hittingTime++;
								}
								
							})

							Obstracle.intersect(this).forEach(elem => {
								switch(elem.name){
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
								hittingTime++;
							})
						}
					}else{
						destruction++;
						this._Dead();
					}
				}
			}
		},
		_Attack: function(){
			if (WorldFlg) { //  処理しても良い状態か
				if (bullets[this.num] < this.bulMax && deadFlgs[this.num] == false) { //  発射最大数に到達していないか＆死んでいないか
					for (let i = 0; i < this.bulMax; i++) {
						if (bulStack[this.num][i] == false) { //  弾の状態がoffならば
							this.shotStopFlg = true;
							new BulletCol(this.shotSpeed, this.ref, this.cannon, this.category, this.num, i)._Shot();
							break;
						}
					}

				}
			}
		}
	})

	//	生存特化型
	var Entity_Type3 = Class.create(TankBase,{
		initialize: function(x, y, category, num, scene){
			TankBase.call(this, x, y, category, num, scene);

			const Around = new InterceptAround(this);
			const Front = new InterceptFront(this.cannon);

			switch(this.category){
				case 6:
					Around.scale(1.5, 1.5);
					break;
			}

			const target = tankEntity[0];

			//this.weak.backgroundColor = 'blue';

			this.attackTarget = target;
			this.escapeTarget = null;

			this.cursor = new Target(this, scene);

			let damFlg = false;
			let damTime = 0;
			let damCng = false;
			let escapeFlg = false;

			this.shotStopFlg = false;
			this.shotStopTime = 0;
			this.tankStopFlg = false;
			this.stopTime = 0;

			var dirValue = 0;
			var hittingTime = 0;

			var map = scene.backgroundMap;
			var grid = scene.grid;

			var myPath = [0, 0];
			var targetPath = [0, 0];
			var root;
			var rootFlg = false;

			var rot = 0;

			if(gameMode > 0){
				switch(category){
					case 5:
						this.moveSpeed += 0.5;
						this.bulMax += 1;
						break;
					case 6:
						this.moveSpeed += 0.5;
						this.shotSpeed += 1;
						this.bulMax += 1;
						break;
				}
			}

			for (var i = 0; i < this.bulMax; i++) {
				bulStack[this.num].push(false); //  弾の状態をoff
			}

			var EnemyAim = Class.create(Aim, {
				initialize: function(cannon, cursor, category, num) {
					Aim.call(this, cannon, cursor, category, num, scene);
				}
			});

			function Instrumentation(weak,target1, target2) {
				let dist1 = Get_Distance(weak, target1);
				let dist2 = Get_Distance(weak, target2);
				if (dist1 >= dist2) {
					return dist2;
				} else {
					return null;
				}
			};

			function NG_root_set(){
				dir = [];
				if(grid[myPath[0]-1][myPath[1]] == 'Obstacle') dir.push(0);
				if(grid[myPath[0]][myPath[1]+1] == 'Obstacle') dir.push(1);
				if(grid[myPath[0]+1][myPath[1]] == 'Obstacle') dir.push(2);
				if(grid[myPath[0]][myPath[1]-1] == 'Obstacle') dir.push(3);
				return dir;
			};

			function SelDirection(target1, target2, or) {
				let arr = [0,1,2,3];
				if (or == 0) {
					if ((target1.x + target1.width / 2) > (target2.x + target2.width / 2)) {		//	相手より右にいる場合
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {	//	相手より下にいる場合
							arr = [1,2];
						} else {
							arr = [0,1];
						}
					} else {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							arr = [2,3];
						} else {
							arr = [0,3];
						}
					}
				} else if (or == 1) {
					if ((target1.x + target1.width / 2) > (target2.x + target2.width / 2)) {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							arr = [0,3];
						} else {
							arr = [2,3];
						}
					} else {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							arr = [0,1];
						} else {
							arr = [1,2];
						}
					}
				}
				let ng = NG_root_set();
				arr = arr.filter(i => ng.indexOf(i) == -1);
				if(arr.length > 0){
					if(arr.indexOf(dirValue) == -1) dirValue = arr[Math.floor(Math.random() * arr.length)];
				}
			}

			this.onenterframe = function(){
				if(!deadFlgs[this.num] && gameStatus == 0){
					if(this.life > 0){
						if(WorldFlg){
							if(!damFlg){
								Bullet.intersectStrict(this.weak).forEach(elem => {
									let damage = game.assets['./sound/mini_bomb2.mp3'].clone();
									damage.play();
									let damValue = Math.round(elem.from.shotSpeed * ((elem.scaleX + elem.scaleY) / 2));
									let randomPercent = 10;
									if(elem.from.category == 0){
										randomPercent = 5;
									}else if(elem.from.category == 9){
										randomPercent = 3;
									}
									if(Math.floor(Math.random() * randomPercent) == 0){
										damValue = Math.round(damValue * 2);
										this.life-=damValue;
										new ViewDamage(this, damValue, true);
									}else{
										this.life-=damValue;
										new ViewDamage(this, damValue, false);
									}
									
									elem.from._Destroy();		
									if(this.life > 0){
										this.lifeBar.Change(this.life);
										damage.volume = 0.5;
										damFlg = true;
									}		
								})
							}

							if(damFlg){
								if(damCng){
									this.tank.opacity = 0.0;
									this.cannon.opacity = 0.0;
								}else{
									this.tank.opacity = 1.0;
									this.cannon.opacity = 1.0;
								}
								if(damTime % 4 == 0){
									if(damCng){
										damCng = false;
									}else{
										damCng = true;
									}
								}
								damTime++;
								if(damTime > 24){
									damFlg = false;
									damCng = false;
									damTime = 0;
									this.tank.opacity = 1.0;
									this.cannon.opacity = 1.0;
								}
							}

							if(this.time % 60 == 0){
								grid = scene.grid;
								map = scene.backgroundMap;
							}

							if(this.time % 2 == 0){
								if (!escapeFlg) rootFlg = false;
								if (this.attackTarget != target) rootFlg = true;
								
								this.shotNGflg = false;
								this.fireFlg = false;

								if(this.moveSpeed > 0 && !rootFlg){
									//  自身の位置とターゲットの位置をざっくり算出
									myPath = [parseInt((this.y + this.height/2) / PixelSize), parseInt((this.x + this.width/2) / PixelSize)]
									targetPath = [parseInt((target.y + target.height/2) / PixelSize), parseInt((target.x + target.width/2) / PixelSize)]
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
									if (this.time % 60 == 0) {
									//if(this.time == 0){
										root = findShortestPath([myPath[0], myPath[1]], grid, scene);
										//if(this.time % 60 == 0) console.log(myPath);
										if (root[0] == "East") {
											dirValue = 1;
										} else if (root[0] == "West") {
											dirValue = 3;
										} else if (root[0] == "North") {
											dirValue = 0;
										} else if (root[0] == "South") {
											dirValue = 2;
										} else {
											rootFlg = true;
										}
									}
								}
							}

							this.time++;

							if (hittingTime >= 35) {
								let arr = [];
								switch(dirValue){
									case 0:
										this.y += this.moveSpeed;
										arr = [1,3];
										break;
									case 1:
										this.x -= this.moveSpeed;
										arr = [0,2];
										break;
									case 2:
										this.y -= this.moveSpeed;
										arr = [1,3];
										break;
									case 3:
										this.x += this.moveSpeed;
										arr = [0,2];
										break;
								}
								
								if(arr.indexOf(dirValue) == -1){
									dirValue = arr[Math.floor(Math.random() * arr.length)];
								}
								/*myPath = [parseInt((this.y + (this.height/2) - 1) / PixelSize), parseInt((this.x + (this.width/2) - 1) / PixelSize)];
								switch(dirValue){
									case 0:
										grid[myPath[0]-1][myPath[1]] = 'Obstacle';
										break;
									case 1:
										grid[myPath[0]][myPath[1]+1] = 'Obstacle';
										break;
									case 2:
										grid[myPath[0]+1][myPath[1]] = 'Obstacle';
										break;
									case 3:
										grid[myPath[0]][myPath[1]-1] = 'Obstacle';
										break;
								}
								root = findShortestPath([myPath[0], myPath[1]], grid, scene);
								if (root[0] == "East") {
									dirValue = 1;
								} else if (root[0] == "West") {
									dirValue = 3;
								} else if (root[0] == "North") {
									dirValue = 0;
								} else if (root[0] == "South") {
									dirValue = 2;
								}*/
								hittingTime = 0;
							}

							if(this.ref > 0){
								Front.intersect(Wall).forEach(function(){
									this.shotNGflg = true;
									return;
								})
								Front.intersect(Block).forEach(function(){
									this.shotNGflg = true;
									return;
								})
							}

							if (this.shotStopFlg) {
								this.shotStopTime++;
								if (this.shotStopTime > 10) {
									this.shotStopFlg = false;
									this.shotStopTime = 0;
								}
							}

							new EnemyAim(this.cannon, this.cursor, this.category, this.num);

							EnemyAim.intersectStrict(this.cursor).forEach(elem => {
								if(!this.fireFlg)this.fireFlg = true; //  発射可能状態にする
								if(!rootFlg)rootFlg = true;
								return;
							})

							if (this.time % 3 == 0) {
								if (this.attackTarget != target && !escapeFlg) this.attackTarget = target;
								escapeFlg = false;
							}

							if(Bullet.collection.length > 0){
								for (var i = 0, l = Bullet.collection.length; i < l; i++) {
									let c = Bullet.collection[i];
									if(!bulStack[c.num][c.id]) continue;
									if(c.num == 0 && !Categorys.DefenceFlg[this.category][0]) continue;
									if(c.num == this.num && !Categorys.DefenceFlg[this.category][1]) continue;
									if(!(c.num == 0 || c.num == this.num) && !Categorys.DefenceFlg[this.category][2]) continue;
									let dist = Instrumentation(this.weak, this.attackTarget, c);

									switch(c.num){
										case 0:
											if (dist != null && dist < Categorys.DefenceRange[this.category][0]) {
												let tgtFlg = false;
												/*if(Search(this.cannon, c, 25, Categorys.DefenceRange[this.category][0])){
													this.attackTarget = c; //  迎撃のためにターゲット変更
													tgtFlg = true;
												}*/
												PlayerBulAim.intersectStrict(Around).forEach(elem => {
													if(tgtFlg) return;
													if(elem.target == c){
														this.attackTarget = c; //  迎撃のためにターゲット変更
														tgtFlg = true;
													}
												})
												if(!tgtFlg && category == 6){
													this.attackTarget = target;
												}
												/*if(this.attackTarget != c){
													if(Search(c, this.weak, 3, dist)) this.attackTarget = c; //  迎撃のためにターゲット変更
													//if(this.time % 6 == 0) dirValue = Escape_Rot4(this, this.attackTarget, dirValue);
												}*/
												if (Categorys.EscapeRange[this.category][0] == true && Categorys.EscapeRange[this.category][1] != 0) {
													if (dist < Categorys.EscapeRange[this.category][1]) {
														this.escapeTarget = c;
														escapeFlg = true;
														
													}
												}
											}
											break;

										case this.num:
											if(this.ref == 0) break;
											if (dist != null && dist < Categorys.DefenceRange[this.category][1] && dist > 100) {
												BulAim.intersectStrict(Around).forEach(elem => {
													if(elem.target == c){
														if (Categorys.EscapeRange[this.category][0] == true && Categorys.EscapeRange[this.category][2] != 0) {
															if (dist < Categorys.EscapeRange[this.category][2]) {
																this.escapeTarget = c;
																escapeFlg = true;
															}
														}
														this.attackTarget = c; //  迎撃のためにターゲット変更
													}
												})
											}
											break;

										default:
											if (dist != null && dist < Categorys.DefenceRange[this.category][2]) {
												BulAim.intersectStrict(Around).forEach(elem => {
													if(elem.target == c){
														this.attackTarget = c; //  迎撃のためにターゲット変更
													}
												})
												if (Categorys.EscapeRange[this.category][0] == true && Categorys.EscapeRange[this.category][3] != 0) {
													if (dist < Categorys.EscapeRange[this.category][3]) {
														this.escapeTarget = c;
														escapeFlg = true;
													}
												}
											}
											break;
									}
								}
							}

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

							TankBase.intersectStrict(Front).forEach(elem => {
								if(elem.num != this.num && elem.num != 0){
									if(!deadFlgs[elem.num]){
										this.fireFlg = false;
									}
								}
							})

							if (!this.shotNGflg) {
								if (this.time % this.fireLate == 0 && this.fireFlg) {
									//if(bulStack[this.num][Math.floor(Math.random() * this.bulMax)] == false) {
									if (Math.floor(Math.random() * this.bulMax * 2) > bullets[this.num]) {
										this._Attack();
									}
								}
							}

							if (this.moveSpeed > 0) {
								if (this.time % 5 == 0) {
									if(escapeFlg){
										//SelDirection(this.weak, this.escapeTarget, 0);
										dirValue = Escape_Rot4(this, this.escapeTarget, dirValue);
									}else{
										if (Math.sqrt(Math.pow(this.weak.x - this.attackTarget.x, 2) + Math.pow(this.weak.y - this.attackTarget.y, 2)) < Categorys.Distances[category]) {
											SelDirection(this.weak, this.attackTarget, 0);
										}else{
											if(rootFlg){
												if (this.time % 10 == 0) {
													SelDirection(this.weak, this.attackTarget, 1);
												}
											}else{
												
												
											}
											/*if(this.time % 30 == 0){
												if((tankEntity.length - destruction) - 1 > 2){
													for (var i = 0; i < tankEntity.length; i++) {
														if (i != this.num && deadFlgs[i] == false) {
															if (tankEntity[i].intersectStrict(Around)) {
																SelDirection(this.weak, tankEntity[i], 0);
																break;
															}
														}
													}
												}
											}*/
										}
										if(Bom.collection.length > 0){
											for (var i = 0, l = Bom.collection.length; i < l; i++) {
												let c = Bom.collection[i];
												if(Math.sqrt(Math.pow(this.weak.x - c.x, 2) + Math.pow(this.weak.y - c.y, 2)) < 150){
													SelDirection(this.weak, c, 0);
													break;
												}
											}
										}
									}
								}
								if (!this.shotStopFlg) {
									if (dirValue == 0) {
										rot = 0;
									} else if (dirValue == 1) {
										rot = 90;
									} else if (dirValue == 2) {
										rot = 180;
									} else if (dirValue == 3) {
										rot = 270;
									}
									this._Move(rot);
									if(!rootFlg){
										if(myPath[0] != parseInt((this.y + this.height/2) / PixelSize) || myPath[1] != parseInt((this.x + this.width/2) / PixelSize)){
											root = findShortestPath([myPath[0], myPath[1]], grid, scene);
											//if(this.time % 60 == 0) console.log(myPath);
											if (root[0] == "East") {
												dirValue = 1;
											} else if (root[0] == "West") {
												dirValue = 3;
											} else if (root[0] == "North") {
												dirValue = 0;
											} else if (root[0] == "South") {
												dirValue = 2;
											} else {
												rootFlg = true;
											}
										}
									}
									
								}
							}

							TankObstracle.intersect(this).forEach(elem => {
								if(!deadFlgs[elem.num] && elem.num != this.num){
									switch(elem.name){
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
									hittingTime++;
									rootFlg = true;
								}
								
							})

							Obstracle.intersect(this).forEach(elem => {
								switch(elem.name){
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
								hittingTime++;
								rootFlg = true;
							})
						}
					}else{
						destruction++;
						this._Dead();
					}
				}
			}
		},
		_Attack: function(){
			if (WorldFlg) { //  処理しても良い状態か
				if (bullets[this.num] < this.bulMax && deadFlgs[this.num] == false) { //  発射最大数に到達していないか＆死んでいないか
					for (let i = 0; i < this.bulMax; i++) {
						if (bulStack[this.num][i] == false) { //  弾の状態がoffならば
							this.shotStopFlg = true;
							if(this.category == 6) this._ResetAim();
							new BulletCol(this.shotSpeed, this.ref, this.cannon, this.category, this.num, i)._Shot();
							break;
						}
					}

				}
			}
		},
		_ResetAim: function() {
			if(this.attackTarget.name == 'Bullet'){
				let t1 = Get_Center(this);
				let t2 = Get_Center(this.attackTarget);
				let v = Rot_to_Vec(this.attackTarget.rotation, -90);
				let dis = Math.trunc(Vec_Distance(t1, t2) / 30);
				let val = dis * this.attackTarget.from.shotSpeed + this.shotSpeed;
				v.x = v.x * val + t2.x;
				v.y = v.y * val + t2.y;
				//new Point(v);
				//console.log(v);
				let p = {
					x: t1.x - v.x,
					y: t1.y - v.y
				};
				//console.log({ x: from.x + (from.width / 2), y: from.y + (from.height / 2) });
				//console.log(p);
				let rad = Math.atan2(p.y, p.x);
				//from.cannon.rotation = (90 + (Math.atan2(Math.cos(rad), Math.sin(rad)) * 180) / Math.PI) * -1;
				this.cannon.rotation = Rad_to_Rot(rad);
			}
		}
	})

	//	弾幕型
	var Entity_Type4 = Class.create(TankBase, {
		initialize: function(x, y, category, num, scene){
			TankBase.call(this, x, y, category, num, scene);
			const target = tankEntity[0];

			//this.weak.backgroundColor = 'blue';

			this.attackTarget = target;

			this.cursor = new Target(this, scene);

			let damFlg = false;
			let damTime = 0;
			let damCng = false;

			this.fullFireFlg = false;
			this.firecnt = 0;

			if(gameMode > 0){
				this.bulMax += 1;
				this.fireLate -= 2;
			}

			for (var i = 0; i < this.bulMax; i++) {
				bulStack[this.num].push(false); //  弾の状態をoff
			}

			var EnemyAim = Class.create(Aim, {
				initialize: function(cannon, cursor, category, num) {
					Aim.call(this, cannon, cursor, category, num, scene);
				}
			});

			this.onenterframe = function(){
				if(!deadFlgs[this.num] && gameStatus == 0){
					if(this.life > 0){
						if(WorldFlg){
							if(!damFlg){
								Bullet.intersectStrict(this.weak).forEach(elem => {
									let damage = game.assets['./sound/mini_bomb2.mp3'].clone();
									damage.play();
									let damValue = Math.round(elem.from.shotSpeed * ((elem.scaleX + elem.scaleY) / 2));
									let randomPercent = 10;
									if(elem.from.category == 0){
										randomPercent = 5;
									}else if(elem.from.category == 9){
										randomPercent = 3;
									}
									if(Math.floor(Math.random() * randomPercent) == 0){
										damValue = Math.round(damValue * 2);
										this.life-=damValue;
										new ViewDamage(this, damValue, true);
									}else{
										this.life-=damValue;
										new ViewDamage(this, damValue, false);
									}
									elem.from._Destroy();		
									if(this.life > 0){
										this.lifeBar.Change(this.life);
										damage.volume = 0.5;
										damFlg = true;
									}		
								})
							}

							if(damFlg){
								if(damCng){
									this.tank.opacity = 0.0;
									this.cannon.opacity = 0.0;
								}else{
									this.tank.opacity = 1.0;
									this.cannon.opacity = 1.0;
								}
								if(damTime % 4 == 0){
									if(damCng){
										damCng = false;
									}else{
										damCng = true;
									}
								}
								damTime++;
								if(damTime > 24){
									damFlg = false;
									damCng = false;
									damTime = 0;
									this.tank.opacity = 1.0;
									this.cannon.opacity = 1.0;
								}
							}

							if(this.time % 2 == 0){
								this.shotNGflg = false;
								this.fireFlg = false;
							}

							this.time++;

							new EnemyAim(this.cannon, this.cursor, this.category, this.num);

							EnemyAim.intersectStrict(this.cursor).forEach(elem => {
								if(!this.fireFlg)this.fireFlg = true; //  発射可能状態にする
								return;
							})


							if (this.bulReloadFlg == false) {
								if (bullets[this.num] == this.bulMax || this.firecnt == this.bulMax){
									this.bulReloadFlg = true;
									this.fullFireFlg = false;
									this.firecnt = 0;
								} 
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

							if (!this.shotNGflg) {
								if (this.time % this.fireLate == 0 && (this.fireFlg || this.fullFireFlg)) {
									if(bulStack[this.num][Math.floor(Math.random() * this.bulMax)] == false || this.fullFireFlg) {
										this._Attack();
									}
								}
							}


							Obstracle.intersect(this).forEach(elem => {
								switch(elem.name){
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
					}else{
						destruction++;
						this._Dead();
					}
				}
			}
		},
		_Attack: function(){
			if (WorldFlg) { //  処理しても良い状態か
				if (bullets[this.num] < this.bulMax && deadFlgs[this.num] == false) { //  発射最大数に到達していないか＆死んでいないか
					for (let i = 0; i < this.bulMax; i++) {
						if (bulStack[this.num][i] == false) { //  弾の状態がoffならば
							this.fullFireFlg = true;
							this.shotStopFlg = true;
							this.cannon.rotation += (Math.floor(Math.random() * 3) - 1) * (3 - gameMode);
							new BulletCol(this.shotSpeed, this.ref, this.cannon, this.category, this.num, i)._Shot();
							this.firecnt++;
							break;
						}
					}
				}
			}
		}
	})

	//	弾道予測型
	var Entity_Type5 = Class.create(TankBase,{
		initialize: function(x, y, category, num, scene){
			TankBase.call(this, x, y, category, num, scene);

			this.y = this.y - 32;

			const target = tankEntity[0];

			//this.weak.backgroundColor = 'blue';

			this.attackTarget = target;

			this.cursor = new RefCursor(this, scene);

			let damFlg = false;
			let damTime = 0;
			let damCng = false;

			this.aimingTime = 0;
			this.aimCmpTime = 60;
			this.aimRot = Categorys.CannonRotSpeed[this.category];

			if (Math.floor(Math.random() * 2)) {
				this.aimRot *= -1;
			}

			if(gameMode > 0){
				switch(category){
					case 1:
						this.shotSpeed += 2;
						this.bulMax += 2;
						break;
					case 7:
						this.bulMax += 1;
						break;
				}
			}

			for (var i = 0; i < this.bulMax; i++) {
				bulStack[this.num].push(false); //  弾の状態をoff
			}

			let EnemyAim = Class.create(RefAim, {
				initialize: function(ref, from, category, num) {
					RefAim.call(this, ref, from, category, num);
				}
			})

			this.onenterframe = function(){
				if(!deadFlgs[this.num] && gameStatus == 0){
					if(this.life > 0){
						if(WorldFlg){
							if(!damFlg){
								Bullet.intersectStrict(this.weak).forEach(elem => {
									let damage = game.assets['./sound/mini_bomb2.mp3'].clone();
									damage.play();
									let damValue = Math.round(elem.from.shotSpeed * ((elem.scaleX + elem.scaleY) / 2));
									let randomPercent = 10;
									if(elem.from.category == 0){
										randomPercent = 5;
									}else if(elem.from.category == 9){
										randomPercent = 3;
									}
									if(Math.floor(Math.random() * randomPercent) == 0){
										damValue = Math.round(damValue * 2);
										this.life-=damValue;
										new ViewDamage(this, damValue, true);
									}else{
										this.life-=damValue;
										new ViewDamage(this, damValue, false);
									}
									elem.from._Destroy();		
									if(this.life > 0){
										this.lifeBar.Change(this.life);
										damage.volume = 0.5;
										damFlg = true;
									}		
								})
							}

							if(damFlg){
								if(damCng){
									this.tank.opacity = 0.0;
									this.cannon.opacity = 0.0;
								}else{
									this.tank.opacity = 1.0;
									this.cannon.opacity = 1.0;
								}
								if(damTime % 4 == 0){
									if(damCng){
										damCng = false;
									}else{
										damCng = true;
									}
								}
								damTime++;
								if(damTime > 24){
									damFlg = false;
									damCng = false;
									damTime = 0;
									this.tank.opacity = 1.0;
									this.cannon.opacity = 1.0;
								}
							}

							if(this.time % 2 == 0){
								this.shotNGflg = false;
								this.fireFlg = false;

								new EnemyAim(this.ref, this.cannon, this.category, this.num);
							}

							this.time++;

							EnemyAim.intersectStrict(target).forEach(elem => {
								if (this.cursor.x != elem.tgt[0] || this.cursor.y != elem.tgt[1]) {
									this.cursor.x = elem.tgt[0];
									this.cursor.y = elem.tgt[1];
								}
								if (elem.hitTime == 0 && this.cannon.rotation != elem.agl) this.cannon.rotation = elem.agl;
								if (elem.hitTime < 5 && !this.fireFlg) this.fireFlg = true;
								if (this.aimingTime < (this.aimCmpTime + 15)) this.aimingTime += 3;
                                elem.hitTime++;
								if(elem.hitTime >= 5){
									now_scene.removeChild(elem);
								}
								return;
							})

							if (this.aimingTime > 0) {
								if (this.fireFlg && this.aimingTime % 10 == 0) {
									this.aimRot *= -1;
								}
							}
							/*if(this.category == 7){
								if(this.aimingTime > 0){
									if(this.aimRot<0){
										this.aimRot = -Categorys.CannonRotSpeed[this.category] / 2;
									}else{
										this.aimRot = Categorys.CannonRotSpeed[this.category] / 2;
									}
								}else{
									if(this.aimRot<0){
										this.aimRot = -Categorys.CannonRotSpeed[this.category];
									}else{
										this.aimRot = Categorys.CannonRotSpeed[this.category];
									}
								}
							}*/
							
							if (this.aimingTime < this.aimCmpTime) {
								if (!this.fireFlg) {
									this.cannon.rotation += this.aimRot;
								}
							}

							if(this.time % 5 == 0){
								if (this.aimingTime > 0 && !this.fireFlg) this.aimingTime-=3;
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

								if (!this.shotNGflg) {
									if (this.time % this.fireLate == 0 && this.fireFlg) {
										//if (Math.floor(Math.random() * this.bulMax * 2) > bullets[this.num]) {
										if(bulStack[this.num][Math.floor(Math.random() * this.bulMax)] == false) {
											this._Attack();
										}
									}
								}
							}


							TankObstracle.intersect(this).forEach(elem => {
								if(!deadFlgs[elem.num] && elem.num != this.num){
									switch(elem.name){
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
								switch(elem.name){
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
					}else{
						destruction++;
						this._Dead();
					}
				}
			}
		},
		_Attack: function(){
			if (WorldFlg) { //  処理しても良い状態か
				if (bullets[this.num] < this.bulMax && deadFlgs[this.num] == false) { //  発射最大数に到達していないか＆死んでいないか
					for (let i = 0; i < this.bulMax; i++) {
						if (bulStack[this.num][i] == false) { //  弾の状態がoffならば
							this.shotStopFlg = true;
							if(this.category == 6) this._ResetAim();
							new BulletCol(this.shotSpeed, this.ref, this.cannon, this.category, this.num, i)._Shot();
							this.aimingTime = 0;
							if (this.category != 1) {
								this.aimCmpTime = Math.floor(Math.random() * 60) + 20;
								//this.cannon.rotation += this.aimRot/2;
							} else {
								this.aimCmpTime = Math.floor(Math.random() * 30) + 30;
							}
							break;
						}
					}

				}
			}
		}
	})

//	爆弾設置型
	var Entity_Type6 = Class.create(TankBase,{
		initialize: function(x, y, category, num, scene){
			TankBase.call(this, x, y, category, num, scene);

			var that = this;

			const Around = new InterceptAround(this);
			const Front = new InterceptFront(this.cannon);
			const target = tankEntity[0];

			this.attackTarget = tankEntity[0];
			this.escapeTarget = null;

			this.cursor = new Target(this, scene);

			let damFlg = false;
			let damTime = 0;
			let damCng = false;
			let escapeFlg = false;

			this.shotStopFlg = false;
			this.shotStopTime = 0;

			var dirValue = 0;
			var hittingTime = 0;

			var rot = 0;

			if(gameMode > 0){
				this.moveSpeed += 0.5;
				this.bomMax += 2;
			}

			for (var i = 0; i < this.bulMax; i++) {
				bulStack[this.num].push(false); //  弾の状態をoff
			}

			var EnemyAim = Class.create(Aim, {
				initialize: function(cannon, cursor, category, num) {
					Aim.call(this, cannon, cursor, category, num, scene);
				}
			});

			function Instrumentation(weak,target1, target2) {
				let dist1 = Get_Distance(weak, target1);
				let dist2 = Get_Distance(weak, target2);
				if (dist1 >= dist2) {
					return dist2;
				} else {
					return null;
				}
			}

			function SelDirection(target1, target2, or) {
				let arr = [0,1,2,3,4,5,6,7];
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
					if ((target1.x + target1.width / 2) > (target2.x + target2.width / 2)) {		//	相手より右にいる場合
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {	//	相手より下にいる場合
							arr = [1,2,5,6];
						} else {
							arr = [0,1,4,7];
						}
					} else {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							arr = [2,3,5,6];
						} else {
							arr = [0,3,4,7];
						}
					}
				} else if (or == 1) {
					if ((target1.x + target1.width / 2) > (target2.x + target2.width / 2)) {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							arr = [0,3,7];
						} else {
							arr = [2,3,6];
						}
					} else {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							arr = [0,1,4];
						} else {
							arr = [1,2,5];
						}
					}
				}

				if(boms[that.num] != 0){
					
					let rem = [];
					var myPath = [parseInt((that.y + that.height/2) / PixelSize), parseInt((that.x + that.width/2) / PixelSize)];
					var grid = scene.grid;
					
					if(grid[myPath[0]-1][myPath[1]] == 'Obstacle') rem.push(0);
					if(grid[myPath[0]][myPath[1]+1] == 'Obstacle') rem.push(1);
					if(grid[myPath[0]+1][myPath[1]] == 'Obstacle') rem.push(2);
					if(grid[myPath[0]][myPath[1]-1] == 'Obstacle') rem.push(3);
					if(grid[myPath[0]-1][myPath[1]+1] == 'Obstacle') rem.push(4);
					if(grid[myPath[0]+1][myPath[1]+1] == 'Obstacle') rem.push(5);
					if(grid[myPath[0]+1][myPath[1]-1] == 'Obstacle') rem.push(6);
					if(grid[myPath[0]-1][myPath[1]-1] == 'Obstacle') rem.push(7);
	
					arr = arr.filter(i => rem.indexOf(i) == -1);

					if(arr.length == 0){
						arr = [0,1,2,3,4,5,6,7];
						arr = arr.filter(i => rem.indexOf(i) == -1);
					}
				}

				if(arr.indexOf(dirValue) == -1) dirValue = arr[Math.floor(Math.random() * arr.length)];
			}

			this.onenterframe = function(){
				if(!deadFlgs[this.num] && gameStatus == 0){
					if(this.life > 0){
						if(WorldFlg){

							if(!damFlg){
								Bullet.intersectStrict(this.weak).forEach(elem => {
									let damage = game.assets['./sound/mini_bomb2.mp3'].clone();
									damage.play();
									let damValue = Math.round(elem.from.shotSpeed * ((elem.scaleX + elem.scaleY) / 2));
									let randomPercent = 10;
									if(elem.from.category == 0){
										randomPercent = 5;
									}else if(elem.from.category == 9){
										randomPercent = 3;
									}
									if(Math.floor(Math.random() * randomPercent) == 0){
										damValue = Math.round(damValue * 2);
										this.life-=damValue;
										new ViewDamage(this, damValue, true);
									}else{
										this.life-=damValue;
										new ViewDamage(this, damValue, false);
									}
									
									elem.from._Destroy();		
									if(this.life > 0){
										this.lifeBar.Change(this.life);
										damage.volume = 0.5;
										damFlg = true;
									}		
								})
							}

							if(damFlg){
								if(damCng){
									this.tank.opacity = 0.0;
									this.cannon.opacity = 0.0;
								}else{
									this.tank.opacity = 1.0;
									this.cannon.opacity = 1.0;
								}
								if(damTime % 4 == 0){
									if(damCng){
										damCng = false;
									}else{
										damCng = true;
									}
								}
								damTime++;
								if(damTime > 24){
									damFlg = false;
									damCng = false;
									damTime = 0;
									this.tank.opacity = 1.0;
									this.cannon.opacity = 1.0;
								}
							}

							this.time++;

							if (this.time % 2 == 0) {
								this.shotNGflg = false;
								this.fireFlg = false;
							}

							if (hittingTime > 15) {
								let arr = [];
								switch(dirValue){
									case 0:
									case 2:
										arr = [1,3];
										break;
									case 1:
									case 3:
										arr = [0,2];
										break;
									case 4:
										arr = [2,3,5,6,7];
										break;
									case 5:
										arr = [0,3,4,6,7];
										break;
									case 6:
										arr = [0,1,4,5,7];
										break;
									case 7:
										arr = [1,2,4,5,6];
										break;
								}
								//let arr = [0,1,2,3,4,5,6,7];
								let rem = [];
								var myPath = [parseInt((that.y + that.height/2) / PixelSize), parseInt((that.x + that.width/2) / PixelSize)];
								var grid = scene.grid;
								
								/*if(grid[myPath[0]-1][myPath[1]] == 'Obstacle') rem.push(0);
								if(grid[myPath[0]][myPath[1]+1] == 'Obstacle') rem.push(1);
								if(grid[myPath[0]+1][myPath[1]] == 'Obstacle') rem.push(2);
								if(grid[myPath[0]][myPath[1]-1] == 'Obstacle') rem.push(3);*/
								if(grid[myPath[0]-1][myPath[1]+1] == 'Obstacle') rem.push(4);
								if(grid[myPath[0]+1][myPath[1]+1] == 'Obstacle') rem.push(5);
								if(grid[myPath[0]+1][myPath[1]-1] == 'Obstacle') rem.push(6);
								if(grid[myPath[0]-1][myPath[1]-1] == 'Obstacle') rem.push(7);
				
								arr = arr.filter(i => rem.indexOf(i) == -1);

								if(arr.length == 0){
									arr = [0,1,2,3,4,5,6,7];
									arr = arr.filter(i => rem.indexOf(i) == -1);
								}
								
								if(arr.indexOf(dirValue) == -1){
									dirValue = arr[Math.floor(Math.random() * arr.length)];
								}
								
								hittingTime = 0;
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
							}

							new EnemyAim(this.cannon, this.cursor, this.category, this.num);

							EnemyAim.intersect(this.cursor).forEach(elem => {
								if(!this.fireFlg)this.fireFlg = true; //  発射可能状態にする
								return;
							})

							if (this.time % 5 == 0) {
								if (this.attackTarget != tankEntity[0] && escapeFlg == false) this.attackTarget = tankEntity[0];
								escapeFlg = false;
							}

							if(Bullet.collection.length > 0){
								for (var i = 0, l = Bullet.collection.length; i < l; i++) {
									let c = Bullet.collection[i];
									if(!bulStack[c.num][c.id]) continue;
									if(c.num == 0 && !Categorys.DefenceFlg[this.category][0]) continue;
									if(c.num == this.num && !Categorys.DefenceFlg[this.category][1]) continue;
									if(!(c.num == 0 || c.num == this.num) && !Categorys.DefenceFlg[this.category][2]) continue;
									let dist = Instrumentation(this.weak, this.attackTarget, c);
									switch(c.num){
										case 0:
											if (dist != null && dist < Categorys.DefenceRange[this.category][0]) {
												PlayerBulAim.intersectStrict(Around).forEach(elem => {
													if(elem.target == c)this.attackTarget = c; //  迎撃のためにターゲット変更
												})
												if (Categorys.EscapeRange[this.category][0] == true && Categorys.EscapeRange[this.category][1] != 0) {
													if (dist < Categorys.EscapeRange[this.category][1]) {
														this.escapeTarget = c;
														escapeFlg = true;
													}
												}
											}
											break;

										case this.num:
											if(this.ref == 0) break;
											if (dist != null && dist < Categorys.DefenceRange[this.category][1] && dist > 100) {
												BulAim.intersectStrict(Around).forEach(elem => {
													if(elem.target == c){
														if (Categorys.EscapeRange[this.category][0] == true && Categorys.EscapeRange[this.category][2] != 0) {
															if (dist < Categorys.EscapeRange[this.category][2]) {
																this.escapeTarget = c;
																escapeFlg = true;
															}
														}
														this.attackTarget = c; //  迎撃のためにターゲット変更
													}
												})
											}
											break;

										default:
											if (dist != null && dist < Categorys.DefenceRange[this.category][2]) {
												BulAim.intersect(Around).forEach(elem => {
													if(elem.target == c){
														this.attackTarget = c; //  迎撃のためにターゲット変更
													}
												})
												if (Categorys.EscapeRange[this.category][0] == true && Categorys.EscapeRange[this.category][3] != 0) {
													if (dist < Categorys.EscapeRange[this.category][3]) {
														this.escapeTarget = c;
														escapeFlg = true;
													}
												}
											}
											break;
									}
								}
							}

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

							TankBase.intersectStrict(Front).forEach(elem => {
								if(elem.num != this.num && elem.num != 0){
									if(!deadFlgs[elem.num]){
										this.fireFlg = false;
									}
								}
							})

							if (!this.shotNGflg) {
								if (this.time % this.fireLate == 0 && this.fireFlg) {
									//if (Math.floor(Math.random() * this.bulMax * 2) > bullets[this.num]) {
									if (Math.floor(Math.random() * this.bulMax * 2) > bullets[this.num]) {
										this._Attack();
									}
								}
							}

							if(this.time % 60 == 0){
								if(Block.collection.length > 0){
									if(Math.floor(Math.random() * 2)){
										for (var i = 0, l = Block.collection.length; i < l; i++) {
											let c = Block.collection[i];
											if(this.within(c, 120) == true && !this.bomSetFlg && boms[this.num] < this.bomMax){
												new Bom(this, this.num, boms[this.num])._SetBom();
												this.bomReload = 0;
												this.bomSetFlg = true;
												break;
											}
										}
									}
								}
								
							}

							if (this.moveSpeed > 0) {
								if (this.time % 5 == 0) {
									if(escapeFlg){
										//SelDirection(this.weak, this.escapeTarget, 0);
										dirValue = Escape_Rot8(this.weak, this.escapeTarget, dirValue);
									}else{
										if(this.within(target, 160) == true && !this.bomSetFlg && boms[this.num] < this.bomMax){
											new Bom(this, this.num, boms[this.num])._SetBom();
											this.bomReload = 0;
											this.bomSetFlg = true;
										}
										if (Math.sqrt(Math.pow(this.weak.x - this.attackTarget.x, 2) + Math.pow(this.weak.y - this.attackTarget.y, 2)) < Categorys.Distances[category]) {
											SelDirection(this.weak, this.attackTarget, 0);
										}else{
											if (this.time % 10 == 0) {
												SelDirection(this.weak, this.attackTarget, 1);
											}
										}
										if((tankEntity.length - destruction) - 1 > 2){
											for (var i = 0; i < tankEntity.length; i++) {
												if (i != this.num && deadFlgs[i] == false) {
													if (tankEntity[i].intersectStrict(Around)) {
														SelDirection(this.weak, tankEntity[i], 0);
														break;
													}
												}
											}
										}
										if(Bom.collection.length > 0){
											for (var i = 0, l = Bom.collection.length; i < l; i++) {
												let c = Bom.collection[i];
												if(Math.sqrt(Math.pow(this.weak.x - c.x, 2) + Math.pow(this.weak.y - c.y, 2)) < 200){
													SelDirection(this.weak, c, 0);
													break;
												}
											}
										}
									}
								}
								
								if (!this.shotStopFlg) {
									switch(dirValue){
										case 0:
											rot = 0;
											break;
										case 1:
											rot = 90;
											break;
										case 2:
											rot = 180;
											break;
										case 3:
											rot = 270;
											break;
										case 4:
											rot = 45;
											break;
										case 5:
											rot = 135;
											break;
										case 6:
											rot = 225;
											break;
										case 7:
											rot = 315;
											break;
									}
									
									this._Move(rot);
								}
							}

							TankObstracle.intersect(this).forEach(elem => {
								if(!deadFlgs[elem.num] && elem.num != this.num){
									switch(elem.name){
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
									hittingTime++;
								}
								
							})

							Obstracle.intersect(this).forEach(elem => {
								switch(elem.name){
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
								hittingTime++;
							})
						}
					}else{
						destruction++;
						this._Dead();
					}
				}
			}
		},
		_Attack: function(){
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
		_ResetAim: function() {
			if(this.attackTarget.name == "Entity"){
				let t1 = Get_Center(this);
				let t2 = Get_Center(this.attackTarget);
				let v = Rot_to_Vec(this.attackTarget.rotation, -90);
				let dis = Math.trunc(Vec_Distance(t1, t2) / 30);
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
		}
	})

	//	機動狙撃型
	var Entity_Type7 = Class.create(TankBase,{
		initialize: function(x, y, category, num, scene){
			TankBase.call(this, x, y, category, num, scene);

			var that = this;

			const Around = new InterceptAround(this);
			const Front = new InterceptFront(this.cannon);
			const target = tankEntity[0];

			Around.scale(1.5, 1.5);

			this.attackTarget = tankEntity[0];
			this.escapeTarget = null;

			this.cursor = new Target(this, scene);

			let damFlg = false;
			let damTime = 0;
			let damCng = false;
			let escapeFlg = false;

			this.shotStopFlg = false;
			this.shotStopTime = 0;

			var dirValue = 0;
			var hittingTime = 0;

			var rot = 0;

			this.cflg = true;

			if(gameMode > 0){
				this.shotSpeed += 1;
				this.bulMax += 1;
				this.fireLate = 30;
			}

			for (var i = 0; i < this.bulMax; i++) {
				bulStack[this.num].push(false); //  弾の状態をoff
			}

			var EnemyAim = Class.create(Aim, {
				initialize: function(cannon, cursor, category, num) {
					Aim.call(this, cannon, cursor, category, num, scene);
				}
			});

			function Instrumentation(weak,target1, target2) {
				let dist1 = Get_Distance(weak, target1);
				let dist2 = Get_Distance(weak, target2);
				if (dist1 >= dist2) {
					return dist2;
				} else {
					return null;
				}
			}

			function SelDirection(target1, target2, or) {
				let arr = [0,1,2,3,4,5,6,7];
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
					if ((target1.x + target1.width / 2) > (target2.x + target2.width / 2)) {		//	相手より右にいる場合
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {	//	相手より下にいる場合
							arr = [1,2,5];
						} else {
							arr = [0,1,4];
						}
					} else {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							arr = [2,3,6];
						} else {
							arr = [0,3,7];
						}
					}
				} else if (or == 1) {
					if ((target1.x + target1.width / 2) > (target2.x + target2.width / 2)) {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							arr = [0,3,7];
						} else {
							arr = [2,3,6];
						}
					} else {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							arr = [0,1,4];
						} else {
							arr = [1,2,5];
						}
					}
				}

				if(arr.indexOf(dirValue) == -1) dirValue = arr[Math.floor(Math.random() * arr.length)];
			}

			this.onenterframe = function(){
				if(!deadFlgs[this.num] && gameStatus == 0){
					if(this.life > 0){
						if(WorldFlg){

							if(!damFlg){
								Bullet.intersectStrict(this.weak).forEach(elem => {
									let damage = game.assets['./sound/mini_bomb2.mp3'].clone();
									damage.play();
									let damValue = Math.round(elem.from.shotSpeed * ((elem.scaleX + elem.scaleY) / 2));
									let randomPercent = 10;
									if(elem.from.category == 0){
										randomPercent = 5;
									}else if(elem.from.category == 9){
										randomPercent = 3;
									}
									if(Math.floor(Math.random() * randomPercent) == 0){
										damValue = Math.round(damValue * 2);
										this.life-=damValue;
										new ViewDamage(this, damValue, true);
									}else{
										this.life-=damValue;
										new ViewDamage(this, damValue, false);
									}
									
									elem.from._Destroy();		
									if(this.life > 0){
										this.lifeBar.Change(this.life);
										damage.volume = 0.5;
										damFlg = true;
									}		
								})
							}

							if(damFlg){
								if(damCng){
									this.tank.opacity = 0.0;
									this.cannon.opacity = 0.0;
								}else{
									this.tank.opacity = 1.0;
									this.cannon.opacity = 1.0;
								}
								if(damTime % 4 == 0){
									if(damCng){
										damCng = false;
									}else{
										damCng = true;
									}
								}
								damTime++;
								if(damTime > 24){
									damFlg = false;
									damCng = false;
									damTime = 0;
									this.tank.opacity = 1.0;
									this.cannon.opacity = 1.0;
								}
							}

							this.time++;

							if (this.time % 2 == 0) {
								this.shotNGflg = false;
								this.fireFlg = false;
							}

							if (hittingTime > 20) {
								let arr = [];
								switch(dirValue){
									case 0:
									case 1:
										arr = [2,3];
										break;
									case 2:
									case 3:
										arr = [0,1];
										break;
									case 4:
									case 6:
										arr = [5,7];
										break;
									case 5:
									case 7:
										arr = [4,6];
								}
								if(arr.indexOf(dirValue) == -1){
									dirValue = arr[Math.floor(Math.random() * arr.length)];
								}
								
								hittingTime = 0;
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
							}

							new EnemyAim(this.cannon, this.cursor, this.category, this.num);

							EnemyAim.intersect(this.cursor).forEach(elem => {
								if(!this.fireFlg)this.fireFlg = true; //  発射可能状態にする
								return;
							})

							if (this.time % 5 == 0) {
								if (this.attackTarget != tankEntity[0] && escapeFlg == false) this.attackTarget = tankEntity[0];
								escapeFlg = false;
							}

							if(Bullet.collection.length > 0){
								for (var i = 0, l = Bullet.collection.length; i < l; i++) {
									let c = Bullet.collection[i];
									if(!bulStack[c.num][c.id]) continue;
									if(c.num == 0 && !Categorys.DefenceFlg[this.category][0]) continue;
									if(c.num == this.num && !Categorys.DefenceFlg[this.category][1]) continue;
									if(!(c.num == 0 || c.num == this.num) && !Categorys.DefenceFlg[this.category][2]) continue;
									let dist = Instrumentation(this.weak, this.attackTarget, c);
									switch(c.num){
										case 0:
											if (dist != null && dist < Categorys.DefenceRange[this.category][0]) {
												let tgtFlg = false;
												PlayerBulAim.intersectStrict(Around).forEach(elem => {
													if(tgtFlg) return;
													if(elem.target == c){
														tgtFlg = true;
														this.attackTarget = c; //  迎撃のためにターゲット変更
													}
												})
												if(!tgtFlg) this.attackTarget = target;
												if (Categorys.EscapeRange[this.category][0] == true && Categorys.EscapeRange[this.category][1] != 0) {
													if (dist < Categorys.EscapeRange[this.category][1]) {
														if(this.escapeTarget == null){
															this.escapeTarget = c;
															escapeFlg = true;
														}else{
															if(Search(c, this, 25, Categorys.EscapeRange[this.category][1])){
																this.escapeTarget = c;
																escapeFlg = true;
															}
														}
														//this.escapeTarget = c;
														//escapeFlg = true;
													}
												}
											}
											break;
										/*case 0:
											if(dist != null){
												let tgtFlg = false;
												if (dist < Categorys.DefenceRange[this.category][0]) {
													PlayerBulAim.intersectStrict(Around).forEach(elem => {
														if(this.attackTarget == c && tgtFlg) return;
														if(elem.target == c){
															tgtFlg = true;
															this.attackTarget = c; //  迎撃のためにターゲット変更
														}
													})
													if(!tgtFlg) this.attackTarget = target;
												}
												if (Categorys.EscapeRange[this.category][0] == true && Categorys.EscapeRange[this.category][1] != 0) {
													if (dist < Categorys.EscapeRange[this.category][1]) {
														if(this.escapeTarget == null || this.escapeTarget != c){

														}else{
															escapeFlg = true;
															this.escapeTarget = c;
														}
														
													}
												}
											}
											break;*/

										case this.num:
											if(this.ref == 0) break;
											if (dist != null && dist < Categorys.DefenceRange[this.category][1] && dist > 100) {
												BulAim.intersectStrict(Around).forEach(elem => {
													if(elem.target == c){
														if (Categorys.EscapeRange[this.category][0] == true && Categorys.EscapeRange[this.category][2] != 0) {
															if (dist < Categorys.EscapeRange[this.category][2]) {
																this.escapeTarget = c;
																escapeFlg = true;
															}
														}
														this.attackTarget = c; //  迎撃のためにターゲット変更
													}
												})
											}
											break;

										default:
											if (dist != null && dist < Categorys.DefenceRange[this.category][2]) {
												BulAim.intersect(Around).forEach(elem => {
													if(elem.target == c){
														this.attackTarget = c; //  迎撃のためにターゲット変更
													}
												})
												if (Categorys.EscapeRange[this.category][0] == true && Categorys.EscapeRange[this.category][3] != 0) {
													if (dist < Categorys.EscapeRange[this.category][3]) {
														this.escapeTarget = c;
														escapeFlg = true;
													}
												}
											}
											break;
									}
								}
							}

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

							TankBase.intersectStrict(Front).forEach(elem => {
								if(elem.num != this.num && elem.num != 0){
									if(!deadFlgs[elem.num]){
										this.fireFlg = false;
									}
								}
							})

							if (!this.shotNGflg) {
								if (this.time % this.fireLate == 0 && this.fireFlg) {
									//if (Math.floor(Math.random() * this.bulMax * 2) > bullets[this.num]) {
									if (Math.floor(Math.random() * this.bulMax * 2) > bullets[this.num]) {
										if(scene.time >= 720) this._Attack();
									}
								}
							}

							if (this.moveSpeed > 0) {
								if (this.time % 3 == 0) {
									if(escapeFlg){
										//SelDirection(this.weak, this.escapeTarget, 0);
										dirValue = Escape_Rot8(this.weak, this.escapeTarget, dirValue);
									}else{
										/*if(this.within(target, 200) == true && !this.bomSetFlg && boms[this.num] < this.bomMax){
											new Bom(this, this.num, boms[this.num])._SetBom();
											this.bomReload = 0;
											this.bomSetFlg = true;
										}*/
										if(!this.cflg) return;
										if (Math.sqrt(Math.pow(this.weak.x - this.attackTarget.x, 2) + Math.pow(this.weak.y - this.attackTarget.y, 2)) < Categorys.Distances[category]) {
											SelDirection(this.weak, this.attackTarget, 0);
										}else{
											if (this.time % 10 == 0) {
												SelDirection(this.weak, target, 1);
											}
										}
										if((tankEntity.length - destruction) - 1 > 2){
											for (var i = 0; i < tankEntity.length; i++) {
												if (i != this.num && deadFlgs[i] == false) {
													if (tankEntity[i].intersectStrict(Around)) {
														SelDirection(this.weak, tankEntity[i], 0);
														break;
													}
												}
											}
										}
										if(Bom.collection.length > 0){
											for (var i = 0, l = Bom.collection.length; i < l; i++) {
												let c = Bom.collection[i];
												if(Math.sqrt(Math.pow(this.weak.x - c.x, 2) + Math.pow(this.weak.y - c.y, 2)) < 150){
													SelDirection(this.weak, c, 0);
													break;
												}
											}
										}
									}
								}
								
								if (!this.shotStopFlg) {
									switch(dirValue){
										case 0:
											rot = 0;
											break;
										case 1:
											rot = 90;
											break;
										case 2:
											rot = 180;
											break;
										case 3:
											rot = 270;
											break;
										case 4:
											rot = 45;
											break;
										case 5:
											rot = 135;
											break;
										case 6:
											rot = 225;
											break;
										case 7:
											rot = 315;
											break;
									}
									
									this.cflg = this._Move(rot);
								}
							}

							TankObstracle.intersect(this).forEach(elem => {
								if(!deadFlgs[elem.num] && elem.num != this.num){
									switch(elem.name){
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
									hittingTime++;
								}
								
							})

							Obstracle.intersect(this).forEach(elem => {
								switch(elem.name){
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
								hittingTime++;
							})
						}
					}else{
						destruction++;
						this._Dead();
					}
				}
			}
		},
		_Attack: function(){
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
		_ResetAim: function() {
			if(this.attackTarget.name == 'Bullet'){
				let t1 = Get_Center(this);
				let t2 = Get_Center(this.attackTarget);
				let v = Rot_to_Vec(this.attackTarget.rotation, -90);
				let dis = Math.trunc(Vec_Distance(t1, t2) / 30);
				let val = dis * this.attackTarget.from.shotSpeed;
				v.x = v.x * val + t2.x;
				v.y = v.y * val + t2.y;
				//new Point(v);
				//console.log(v);
				let p = {
					x: t1.x - v.x,
					y: t1.y - v.y
				};
				//console.log({ x: from.x + (from.width / 2), y: from.y + (from.height / 2) });
				//console.log(p);
				let rad = Math.atan2(p.y, p.x);
				//from.cannon.rotation = (90 + (Math.atan2(Math.cos(rad), Math.sin(rad)) * 180) / Math.PI) * -1;
				this.cannon.rotation = Rad_to_Rot(rad);
			}
		}/*,
		_JudgeDist: function(elem) {
			if(this.attackTarget.name == 'Bullet'){
				let t1 = Get_Center(this);
				let t2 = Get_Center(elem);
				let v = Rot_to_Vec(elem.rotation, -90);
				let dis = Math.trunc(Vec_Distance(t1, t2) / 30);
				let val = dis * elem.from.shotSpeed;
				v.x = v.x * val + t2.x;
				v.y = v.y * val + t2.y;
				let p = {
					x: t1.x - v.x,
					y: t1.y - v.y
				};
				return p;
			}
		}*/
	})

	//	精強型
	var Entity_Type8 = Class.create(TankBase,{
		initialize: function(x, y, category, num, scene){
			TankBase.call(this, x, y, category, num, scene);

			const Around = new InterceptAround(this);
			const Front = new InterceptFront(this.cannon);

			Around.scale(1.5, 1.5);

			const target = tankEntity[0];

			//this.weak.backgroundColor = 'blue';

			this.attackTarget = target;
			this.escapeTarget = null;

			this.cursor = new Target(this, scene);

			let damFlg = false;
			let damTime = 0;
			let damCng = false;
			let escapeFlg = false;

			this.shotStopFlg = false;
			this.shotStopTime = 0;
			this.tankStopFlg = false;
			this.stopTime = 0;

			var dirValue = 0;
			var hittingTime = 0;

			this.fullFireFlg = false;
			this.firecnt = 0;

			/*var map = scene.backgroundMap;
			var grid = scene.grid;

			var myPath = [0, 0];
			var targetPath = [0, 0];
			var root;
			var rootFlg = false;*/

			var rot = 0;

			for (var i = 0; i < this.bulMax; i++) {
				bulStack[this.num].push(false); //  弾の状態をoff
			}

			var EnemyAim = Class.create(Aim, {
				initialize: function(cannon, cursor, category, num) {
					Aim.call(this, cannon, cursor, category, num, scene);
				}
			});

			function Instrumentation(weak,target1, target2) {
				let dist1 = Get_Distance(weak, target1);
				let dist2 = Get_Distance(weak, target2);
				if (dist1 >= dist2) {
					return dist2;
				} else {
					return null;
				}
			};

			function SelDirection(target1, target2, or) {
				let arr = [0,1,2,3];
				if (or == 0) {
					if ((target1.x + target1.width / 2) > (target2.x + target2.width / 2)) {		//	相手より右にいる場合
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {	//	相手より下にいる場合
							arr = [1,2];
						} else {
							arr = [0,1];
						}
					} else {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							arr = [2,3];
						} else {
							arr = [0,3];
						}
					}
				} else if (or == 1) {
					if ((target1.x + target1.width / 2) > (target2.x + target2.width / 2)) {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							arr = [0,3];
						} else {
							arr = [2,3];
						}
					} else {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							arr = [0,1];
						} else {
							arr = [1,2];
						}
					}
				}
				
				if(arr.length > 0){
					if(arr.indexOf(dirValue) == -1) dirValue = arr[Math.floor(Math.random() * arr.length)];
				}
			}

			this.onenterframe = function(){
				if(!deadFlgs[this.num] && gameStatus == 0){
					if(this.life > 0){
						if(WorldFlg){
							if(!damFlg){
								Bullet.intersectStrict(this.weak).forEach(elem => {
									let damage = game.assets['./sound/mini_bomb2.mp3'].clone();
									damage.play();
									let damValue = Math.round(elem.from.shotSpeed * ((elem.scaleX + elem.scaleY) / 2));
									let randomPercent = 10;
									if(elem.from.category == 0){
										randomPercent = 5;
									}else if(elem.from.category == 9){
										randomPercent = 3;
									}
									if(Math.floor(Math.random() * randomPercent) == 0){
										damValue = Math.round(damValue * 2);
										this.life-=damValue;
										new ViewDamage(this, damValue, true);
									}else{
										this.life-=damValue;
										new ViewDamage(this, damValue, false);
									}
									elem.from._Destroy();		
									if(this.life > 0){
										this.lifeBar.Change(this.life);
										damage.volume = 0.5;
										damFlg = true;
										this._ResetStatus();
									}		
								})
							}

							if(damFlg){
								if(damCng){
									this.tank.opacity = 0.0;
									this.cannon.opacity = 0.0;
								}else{
									this.tank.opacity = 1.0;
									this.cannon.opacity = 1.0;
								}
								if(damTime % 4 == 0){
									if(damCng){
										damCng = false;
									}else{
										damCng = true;
									}
								}
								damTime++;
								if(damTime > 24){
									damFlg = false;
									damCng = false;
									damTime = 0;
									this.tank.opacity = 1.0;
									this.cannon.opacity = 1.0;
								}
							}

							if(this.time % 2 == 0){
								this.shotNGflg = false;
								this.fireFlg = false;
							}

							this.time++;

							if (hittingTime >= 35) {
								let arr = [];
								
								switch(dirValue){
									case 0:
										this.y += this.moveSpeed;
										arr = [1,3];
										break;
									case 1:
										this.x -= this.moveSpeed;
										arr = [0,2];
										break;
									case 2:
										this.y -= this.moveSpeed;
										arr = [1,3];
										break;
									case 3:
										this.x += this.moveSpeed;
										arr = [0,2];
										break;
								}

								let rem = [];
								var myPath = [parseInt((this.y + this.height/2) / PixelSize), parseInt((this.x + this.width/2) / PixelSize)];
								var grid = scene.grid;
								
								if(grid[myPath[0]-1][myPath[1]] == 'Obstacle') rem.push(0);
								if(grid[myPath[0]][myPath[1]+1] == 'Obstacle') rem.push(1);
								if(grid[myPath[0]+1][myPath[1]] == 'Obstacle') rem.push(2);
								if(grid[myPath[0]][myPath[1]-1] == 'Obstacle') rem.push(3);
				
								arr = arr.filter(i => rem.indexOf(i) == -1);

								if(arr.length == 0){
									arr = [0,1,2,3];
									arr = arr.filter(i => rem.indexOf(i) == -1);
								}
								
								if(arr.indexOf(dirValue) == -1){
									dirValue = arr[Math.floor(Math.random() * arr.length)];
								}
								
								hittingTime = 0;
							}

							if(this.ref > 0){
								Front.intersect(Wall).forEach(function(){
									this.shotNGflg = true;
									return;
								})
								Front.intersect(Block).forEach(function(){
									this.shotNGflg = true;
									return;
								})
							}

							if (this.shotStopFlg) {
								this.shotStopTime++;
								if (this.shotStopTime > 10) {
									this.shotStopFlg = false;
									this.shotStopTime = 0;
								}
							}

							new EnemyAim(this.cannon, this.cursor, this.category, this.num);

							EnemyAim.intersectStrict(this.cursor).forEach(elem => {
								if(!this.fireFlg)this.fireFlg = true; //  発射可能状態にする
								return;
							})

							if (this.time % 3 == 0) {
								if (this.attackTarget != target && !escapeFlg) this.attackTarget = target;
								escapeFlg = false;
							}

							if(Bullet.collection.length > 0){
								for (var i = 0, l = Bullet.collection.length; i < l; i++) {
									let c = Bullet.collection[i];
									if(!bulStack[c.num][c.id]) continue;
									if(c.num == 0 && !Categorys.DefenceFlg[this.category][0]) continue;
									if(c.num == this.num && !Categorys.DefenceFlg[this.category][1]) continue;
									if(!(c.num == 0 || c.num == this.num) && !Categorys.DefenceFlg[this.category][2]) continue;
									let dist = Instrumentation(this.weak, this.attackTarget, c);

									switch(c.num){
										case 0:
											if (dist != null && dist < Categorys.DefenceRange[this.category][0]) {
												PlayerBulAim.intersectStrict(Around).forEach(elem => {
													if(elem.target == c){
														this.attackTarget = c; //  迎撃のためにターゲット変更
														//if(this.time % 6 == 0) dirValue = Escape_Rot4(this, c, dirValue);
													}
												})
												if (Categorys.EscapeRange[this.category][0] == true && Categorys.EscapeRange[this.category][1] != 0) {
													if (dist < Categorys.EscapeRange[this.category][1]) {
														this.escapeTarget = c;
														escapeFlg = true;
													}
												}
											}
											break;

										case this.num:
											if(this.ref == 0) break;
											if (dist != null && dist < Categorys.DefenceRange[this.category][1] && dist > 100) {
												BulAim.intersectStrict(Around).forEach(elem => {
													if(elem.target == c){
														if (Categorys.EscapeRange[this.category][0] == true && Categorys.EscapeRange[this.category][2] != 0) {
															if (dist < Categorys.EscapeRange[this.category][2]) {
																this.escapeTarget = c;
																escapeFlg = true;
															}
														}
														this.attackTarget = c; //  迎撃のためにターゲット変更
													}
												})
											}
											break;

										default:
											if (dist != null && dist < Categorys.DefenceRange[this.category][2]) {
												BulAim.intersectStrict(Around).forEach(elem => {
													if(elem.target == c){
														this.attackTarget = c; //  迎撃のためにターゲット変更
													}
												})
												if (Categorys.EscapeRange[this.category][0] == true && Categorys.EscapeRange[this.category][3] != 0) {
													if (dist < Categorys.EscapeRange[this.category][3]) {
														this.escapeTarget = c;
														escapeFlg = true;
													}
												}
											}
											break;
									}
								}
							}

							if (this.bulReloadFlg == false) {
								if (bullets[this.num] == this.bulMax || this.firecnt == this.bulMax){
									this.bulReloadFlg = true;
									this.fullFireFlg = false;
									this.firecnt = 0;
								} 
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

							TankBase.intersectStrict(Front).forEach(elem => {
								if(elem.num != this.num && elem.num != 0){
									if(!deadFlgs[elem.num]){
										this.fireFlg = false;
									}
								}
							})

							if (!this.shotNGflg && !this.damFlg) {
								if (this.time % this.fireLate == 0 && (this.fireFlg || this.fullFireFlg)) {
									if(bulStack[this.num][Math.floor(Math.random() * this.bulMax)] == false || this.fullFireFlg) {
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
									if(escapeFlg){
										//SelDirection(this.weak, this.escapeTarget, 0);
										dirValue = Escape_Rot4(this, this.escapeTarget, dirValue);
									}else{
										if (Math.sqrt(Math.pow(this.weak.x - this.attackTarget.x, 2) + Math.pow(this.weak.y - this.attackTarget.y, 2)) < Categorys.Distances[category]) {
											SelDirection(this.weak, this.attackTarget, 0);
										}else{
											
											if (this.time % 10 == 0) {
												SelDirection(this.weak, this.attackTarget, 1);
											}
											
										}
										if(Bom.collection.length > 0){
											for (var i = 0, l = Bom.collection.length; i < l; i++) {
												let c = Bom.collection[i];
												if(Math.sqrt(Math.pow(this.weak.x - c.x, 2) + Math.pow(this.weak.y - c.y, 2)) < 200){
													SelDirection(this.weak, c, 0);
													break;
												}
											}
										}
									}
								}
								if (!this.shotStopFlg) {
									if (dirValue == 0) {
										rot = 0;
									} else if (dirValue == 1) {
										rot = 90;
									} else if (dirValue == 2) {
										rot = 180;
									} else if (dirValue == 3) {
										rot = 270;
									}
									this._Move(rot);
									
								}
							}

							TankObstracle.intersect(this).forEach(elem => {
								if(!deadFlgs[elem.num] && elem.num != this.num){
									switch(elem.name){
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
									hittingTime++;
									rootFlg = true;
								}
								
							})

							Obstracle.intersect(this).forEach(elem => {
								switch(elem.name){
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
								hittingTime++;
							})
						}
					}else{
						destruction++;
						this._Dead();
					}
				}
			}
		},
		_Attack: function(){
			if (WorldFlg) { //  処理しても良い状態か
				if (bullets[this.num] < this.bulMax && deadFlgs[this.num] == false) { //  発射最大数に到達していないか＆死んでいないか
					for (let i = 0; i < this.bulMax; i++) {
						if (bulStack[this.num][i] == false) { //  弾の状態がoffならば
							this.shotStopFlg = true;
							if(Math.floor(Math.random() * 3) == 0) this._ResetAim();
							new BulletCol(this.shotSpeed, this.ref, this.cannon, this.category, this.num, i)._Shot();
							if((this.life / Categorys.Life[this.category]) < 0.25){
								this.fullFireFlg = true;
								this.firecnt++;
							}
							break;
						}
					}

				}
			}
		},
		_ResetAim: function() {
			if(this.attackTarget.name == "Entity"){
				let t1 = Get_Center(this);
				let t2 = Get_Center(this.attackTarget);
				let v = Rot_to_Vec(this.attackTarget.rotation, -90);
				//let dis = Math.trunc(Vec_Distance(t1, t2) / 30);
				let val = 16 * (Math.floor(Math.random() * 3)+1) + 24
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
		_ResetStatus: function(){
			let percent = (this.life / Categorys.Life[this.category]);
			if(percent < 0.25){
				if(this.MoveSpeed > 1) this.MoveSpeed = Categorys.MoveSpeed[this.category] - 0.5;
				this.fireLate = Categorys.FireLate[this.category] - 10;
				this.shotSpeed = Categorys.ShotSpeed[this.category] + 3;
				this.ref = 0;
				this.reload = Categorys.Reload[this.category] - 30;
			}else if(percent < 0.5){
				if(this.MoveSpeed > 1) this.MoveSpeed = Categorys.MoveSpeed[this.category] - 0.3;
				this.fireLate = Categorys.FireLate[this.category] + 5;
				this.shotSpeed = Categorys.ShotSpeed[this.category] - 1;
			}else if(percent < 0.75){
				if(this.MoveSpeed > 1) this.MoveSpeed = Categorys.MoveSpeed[this.category] + 0.4;
			}
		}
	})

	//	異能型
	var Entity_Type9 = Class.create(TankBase,{
		initialize: function(x, y, category, num, scene){
			TankBase.call(this, x, y, category, num, scene);

			const Around = new InterceptAround(this);
			const Front = new InterceptFront(this.cannon);

			Around.scale(1.25, 1.25);

			const target = tankEntity[0];

			//this.weak.backgroundColor = 'blue';

			this.attackTarget = target;
			this.escapeTarget = null;

			this.cursor = new Target(this, scene);

			let damFlg = false;
			let damTime = 0;
			let damCng = false;
			let escapeFlg = false;

			this.shotStopFlg = false;
			this.shotStopTime = 0;
			this.tankStopFlg = false;
			this.stopTime = 0;

			var dirValue = 0;
			var hittingTime = 0;

			this.fullFireFlg = false;
			this.firecnt = 0;

			this.distance = Categorys.Distances[this.category];
			this.cflg = true;

			/*var map = scene.backgroundMap;
			var grid = scene.grid;

			var myPath = [0, 0];
			var targetPath = [0, 0];
			var root;
			var rootFlg = false;*/

			var rot = 0;

			for (var i = 0; i < this.bulMax; i++) {
				bulStack[this.num].push(false); //  弾の状態をoff
			}

			var EnemyAim = Class.create(Aim, {
				initialize: function(cannon, cursor, category, num) {
					Aim.call(this, cannon, cursor, category, num, scene);
				}
			});

			function Instrumentation(weak,target1, target2) {
				let dist1 = Get_Distance(weak, target1);
				let dist2 = Get_Distance(weak, target2);
				if (dist1 >= dist2) {
					return dist2;
				} else {
					return null;
				}
			};

			function SelDirection(target1, target2, or) {
				let arr = [0,1,2,3,4,5,6,7];
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
					if ((target1.x + target1.width / 2) > (target2.x + target2.width / 2)) {		//	相手より右にいる場合
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {	//	相手より下にいる場合
							arr = [1,2,5];
						} else {
							arr = [0,1,4];
						}
					} else {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							arr = [2,3,6];
						} else {
							arr = [0,3,7];
						}
					}
				} else if (or == 1) {
					if ((target1.x + target1.width / 2) > (target2.x + target2.width / 2)) {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							arr = [0,3,7];
						} else {
							arr = [2,3,6];
						}
					} else {
						if ((target1.y + target1.height / 2) > (target2.y + target2.height / 2)) {
							arr = [0,1,4];
						} else {
							arr = [1,2,5];
						}
					}
				}

				if(arr.indexOf(dirValue) == -1) dirValue = arr[Math.floor(Math.random() * arr.length)];
			}

			this.onenterframe = function(){
				if(!deadFlgs[this.num] && gameStatus == 0){
					if(this.life > 0){
						if(WorldFlg){
							if(!damFlg){
								Bullet.intersectStrict(this.weak).forEach(elem => {
									let damage = game.assets['./sound/mini_bomb2.mp3'].clone();
									damage.play();
									let damValue = Math.round(elem.from.shotSpeed * ((elem.scaleX + elem.scaleY) / 2));
									let randomPercent = 10;
									if(elem.from.category == 0){
										randomPercent = 5;
									}else if(elem.from.category == 9){
										randomPercent = 3;
									}
									if(Math.floor(Math.random() * randomPercent) == 0){
										damValue = Math.round(damValue * 2);
										this.life-=damValue;
										new ViewDamage(this, damValue, true);
									}else{
										this.life-=damValue;
										new ViewDamage(this, damValue, false);
									}
									elem.from._Destroy();		
									if(this.life > 0){
										this.lifeBar.Change(this.life);
										damage.volume = 0.5;
										damFlg = true;
										this._ResetStatus();
									}		
								})
							}

							if(damFlg){
								if(damCng){
									this.tank.opacity = 0.0;
									this.cannon.opacity = 0.0;
								}else{
									this.tank.opacity = 1.0;
									this.cannon.opacity = 1.0;
								}
								if(damTime % 4 == 0){
									if(damCng){
										damCng = false;
									}else{
										damCng = true;
									}
								}
								damTime++;
								if(damTime > 24){
									damFlg = false;
									damCng = false;
									damTime = 0;
									this.tank.opacity = 1.0;
									this.cannon.opacity = 1.0;
								}
							}

							if(this.time % 2 == 0){
								this.shotNGflg = false;
								this.fireFlg = false;
							}

							this.time++;

							if (hittingTime >= 35) {
								let arr = [];
								
								switch(dirValue){
									case 0:
									case 1:
										arr = [2,3];
										break;
									case 2:
									case 3:
										arr = [0,1];
										break;
									case 4:
									case 6:
										arr = [5,7];
										break;
									case 5:
									case 7:
										arr = [4,6];
								}

								let rem = [];
								var myPath = [parseInt((this.y + this.height/2) / PixelSize), parseInt((this.x + this.width/2) / PixelSize)];
								var grid = scene.grid;
								
								if(grid[myPath[0]-1][myPath[1]] == 'Obstacle') rem.push(0);
								if(grid[myPath[0]][myPath[1]+1] == 'Obstacle') rem.push(1);
								if(grid[myPath[0]+1][myPath[1]] == 'Obstacle') rem.push(2);
								if(grid[myPath[0]][myPath[1]-1] == 'Obstacle') rem.push(3);
				
								arr = arr.filter(i => rem.indexOf(i) == -1);

								if(arr.length == 0){
									arr = [0,1,2,3];
									arr = arr.filter(i => rem.indexOf(i) == -1);
								}
								
								if(arr.indexOf(dirValue) == -1){
									dirValue = arr[Math.floor(Math.random() * arr.length)];
								}
								
								hittingTime = 0;
							}

							if(this.ref > 0){
								Front.intersect(Wall).forEach(function(){
									this.shotNGflg = true;
									return;
								})
								Front.intersect(Block).forEach(function(){
									this.shotNGflg = true;
									return;
								})
							}

							if (this.shotStopFlg) {
								this.shotStopTime++;
								if (this.shotStopTime > 10) {
									this.shotStopFlg = false;
									this.shotStopTime = 0;
								}
							}

							new EnemyAim(this.cannon, this.cursor, this.category, this.num);

							EnemyAim.intersectStrict(this.cursor).forEach(elem => {
								if(!this.fireFlg)this.fireFlg = true; //  発射可能状態にする
								return;
							})

							if (this.time % 3 == 0) {
								if (this.attackTarget != target && !escapeFlg) this.attackTarget = target;
								escapeFlg = false;
							}

							if(Bullet.collection.length > 0){
								for (var i = 0, l = Bullet.collection.length; i < l; i++) {
									let c = Bullet.collection[i];
									if(!bulStack[c.num][c.id]) continue;
									if(c.num == 0 && !Categorys.DefenceFlg[this.category][0]) continue;
									if(c.num == this.num && !Categorys.DefenceFlg[this.category][1]) continue;
									if(!(c.num == 0 || c.num == this.num) && !Categorys.DefenceFlg[this.category][2]) continue;
									let dist = Instrumentation(this.weak, this.attackTarget, c);

									switch(c.num){
										case 0:
											if (dist != null && dist < Categorys.DefenceRange[this.category][0]) {
												PlayerBulAim.intersectStrict(Around).forEach(elem => {
													if(elem.target == c){
														this.attackTarget = c; //  迎撃のためにターゲット変更
														//if(this.time % 6 == 0) dirValue = Escape_Rot4(this, c, dirValue);
													}
												})
												if (Categorys.EscapeRange[this.category][0] == true && Categorys.EscapeRange[this.category][1] != 0) {
													if (dist < Categorys.EscapeRange[this.category][1]) {
														if(this.escapeTarget == null){
															this.escapeTarget = c;
															escapeFlg = true;
														}else{
															if(Search(c, this, 25, Categorys.EscapeRange[this.category][1])){
																this.escapeTarget = c;
																escapeFlg = true;
															}
														}
														
													}
												}
											}
											break;

										case this.num:
											if(this.ref == 0) break;
											if (dist != null && dist < Categorys.DefenceRange[this.category][1] && dist > 100) {
												BulAim.intersectStrict(Around).forEach(elem => {
													if(elem.target == c){
														if (Categorys.EscapeRange[this.category][0] == true && Categorys.EscapeRange[this.category][2] != 0) {
															if (dist < Categorys.EscapeRange[this.category][2]) {
																this.escapeTarget = c;
																escapeFlg = true;
															}
														}
														this.attackTarget = c; //  迎撃のためにターゲット変更
													}
												})
											}
											break;

										default:
											if (dist != null && dist < Categorys.DefenceRange[this.category][2]) {
												BulAim.intersectStrict(Around).forEach(elem => {
													if(elem.target == c){
														this.attackTarget = c; //  迎撃のためにターゲット変更
													}
												})
												if (Categorys.EscapeRange[this.category][0] == true && Categorys.EscapeRange[this.category][3] != 0) {
													if (dist < Categorys.EscapeRange[this.category][3]) {
														this.escapeTarget = c;
														escapeFlg = true;
													}
												}
											}
											break;
									}
								}
							}

							if (this.bulReloadFlg == false) {
								if (bullets[this.num] == this.bulMax || this.firecnt == this.bulMax){
									this.bulReloadFlg = true;
									this.fullFireFlg = false;
									this.firecnt = 0;
									this.fireLate = 15;
								} 
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

							TankBase.intersectStrict(Front).forEach(elem => {
								if(elem.num != this.num && elem.num != 0){
									if(!deadFlgs[elem.num]){
										this.fireFlg = false;
									}
								}
							})

							if (!this.shotNGflg && !this.damFlg) {
								if (this.time % this.fireLate == 0 && (this.fireFlg || this.fullFireFlg)) {
									//if(bulStack[this.num][Math.floor(Math.random() * this.bulMax)] == false || this.fullFireFlg) {
									if(Math.floor(Math.random() * this.bulMax * 2) > bullets[this.num] || this.fullFireFlg) {
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
									if(escapeFlg){
										//SelDirection(this.weak, this.escapeTarget, 0);
										dirValue = Escape_Rot8(this, this.escapeTarget, dirValue);
									}else{
										if(!this.cflg) return;
										if (Math.sqrt(Math.pow(this.weak.x - this.attackTarget.x, 2) + Math.pow(this.weak.y - this.attackTarget.y, 2)) < this.distance) {
											SelDirection(this.weak, this.attackTarget, 0);
										}else{
											
											if (this.time % 9 == 0) {
												SelDirection(this.weak, this.attackTarget, 1);
											}
											
										}
										if(Bom.collection.length > 0){
											for (var i = 0, l = Bom.collection.length; i < l; i++) {
												let c = Bom.collection[i];
												if(Math.sqrt(Math.pow(this.weak.x - c.x, 2) + Math.pow(this.weak.y - c.y, 2)) < 200){
													SelDirection(this.weak, c, 0);
													break;
												}
											}
										}
									}
								}
								if (!this.shotStopFlg) {
									switch(dirValue){
										case 0:
											rot = 0;
											break;
										case 1:
											rot = 90;
											break;
										case 2:
											rot = 180;
											break;
										case 3:
											rot = 270;
											break;
										case 4:
											rot = 45;
											break;
										case 5:
											rot = 135;
											break;
										case 6:
											rot = 225;
											break;
										case 7:
											rot = 315;
											break;
									}
									this.cflg = this._Move(rot);
									
								}
							}

							TankObstracle.intersect(this).forEach(elem => {
								if(!deadFlgs[elem.num] && elem.num != this.num){
									switch(elem.name){
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
									hittingTime++;
									rootFlg = true;
								}
								
							})

							Obstracle.intersect(this).forEach(elem => {
								switch(elem.name){
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
								hittingTime++;
							})
						}
					}else{
						destruction++;
						this._Dead();
					}
				}
			}
		},
		_Attack: function(){
			if (WorldFlg) { //  処理しても良い状態か
				if (bullets[this.num] < this.bulMax && deadFlgs[this.num] == false) { //  発射最大数に到達していないか＆死んでいないか
					for (let i = 0; i < this.bulMax; i++) {
						if (bulStack[this.num][i] == false) { //  弾の状態がoffならば
							this.shotStopFlg = true;
							if(Math.floor(Math.random() * 2) == 0) this._ResetAim();
							
							if((this.life / Categorys.Life[this.category]) < 0.25){
								/*this.fullFireFlg = true;
								this.firecnt++;*/
								if(!this.fullFireFlg){
									if(Math.floor(Math.random() * 5) == 0){
										this.fullFireFlg = true;
										this.cannon.rotation += (Math.floor(Math.random() * 3) - 1);
										this.firecnt++;
										this.fireLate = 10;
									}
									
								}else{
									this.cannon.rotation += (Math.floor(Math.random() * 3) - 1);
									this.firecnt++;
								}
								//console.log(this.fireLate)
								
							}
							new BulletCol(this.shotSpeed, this.ref, this.cannon, this.category, this.num, i)._Shot();
							break;
						}
					}

				}
			}
		},
		_ResetAim: function() {
			if(this.attackTarget.name == "Entity"){
				let t1 = Get_Center(this);
				let t2 = Get_Center(this.attackTarget);
				let v = Rot_to_Vec(this.attackTarget.rotation, -90);
				//let dis = Math.trunc(Vec_Distance(t1, t2) / 30);
				let val = 16 * (Math.floor(Math.random() * 5)+1) + 24
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
		_ResetStatus: function(){
			let percent = (this.life / Categorys.Life[this.category]);
			if(percent < 0.25){
				if(this.MoveSpeed > 1) this.MoveSpeed = Categorys.MoveSpeed[this.category] - 0.5;
				this.fireLate = Categorys.FireLate[this.category] - 12;
				this.shotSpeed = Categorys.ShotSpeed[this.category] + 3;
				this.bodyRotSpeed = Categorys.BodyRotSpeed[this.category] + 7;
				this.ref = 0;
				this.reload = Categorys.Reload[this.category] - 30;
				this.distance = Categorys.Distances[this.category] + 100;
			}else if(percent < 0.5){
				if(this.MoveSpeed > 1) this.MoveSpeed = Categorys.MoveSpeed[this.category] - 0.3;
				this.fireLate = Categorys.FireLate[this.category] + 3;
				this.shotSpeed = Categorys.ShotSpeed[this.category] - 1;
				this.bodyRotSpeed = Categorys.BodyRotSpeed[this.category] + 4;
				this.distance = Categorys.Distances[this.category] + 50;
			}else if(percent < 0.75){
				if(this.MoveSpeed > 1) this.MoveSpeed = Categorys.MoveSpeed[this.category] + 0.4;
			}
		}
	});

	var PictureTank = Class.create(Sprite, {
		initialize: function(x, y, category, scene) {
			Sprite.call(this, PixelSize+8, PixelSize);
			//this.from = scene;
			this.x = x * PixelSize;
			this.y = y * PixelSize;
			this.category = category;
			//this.backgroundColor = '#fff4';

			var image = new Surface(this.width, this.height);
			if(this.category == playerType){
				image.context.fillStyle = '#0000';
				image.context.lineWidth = 4;
				image.context.strokeStyle = '#0ff';
			}else{
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
		_Output: function(){
			now_scene.addChild(this);
		}

	})

	var Point = Class.create(Sprite,{
		initialize: function(v){
			Sprite.call(this,1, 1);
			this.moveTo(v.x,v.y);
			this.backgroundColor = '#ff0';
			this.opacity = 1.0;
			this.scale(10.0, 10.0);
			this.onenterframe = function(){
				this.opacity -= 0.05;
				if(this.opacity < 0){
					now_scene.removeChild(this);
				}
			}
			now_scene.addChild(this);
		}
	})

	var TestSurface = Class.create(Sprite,{
		initialize: function(scene){
			Sprite.call(this,64,64);
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
	
	var ViewCountDown = Class.create(Label,{
		initialize: function(){
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

			let cntText = new ViewText(now_scene, 'cnt', {width: PixelSize * 2.5, height: 64}, {x: PixelSize * 9, y: PixelSize * 1.5}, (this.cnt) + ' 秒', 'bold 48px "Arial', '#fffd', 'left', true);
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
			var title = new ViewText(scene, 'Title', {width: 224, height: 32}, {x: this.x + 48, y: this.y + 60}, 'トータル撃破数', '32px sans-serif', 'white', 'center', false);
			var value = new ViewText(scene, 'Title', {width: 192, height: 48}, {x: this.x + 64, y: this.y + 120}, (score + destruction), 'bold 48px sans-serif', 'lightblue', 'center', false);
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

	var ViewRemaining = Class.create(Label,{
		initialize: function(){
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

			this.onenterframe = function(){
				if(WorldFlg){
					this.time++;
					if(this.time % 6 == 0){
						this.text = '敵残数：' + (tankEntity.length - 1 - destruction) + '　耐久値：' + tankEntity[0].life + '　残機：' + zanki;
					}
				}
			}
		},
		_Add: function(){
			now_scene.addChild(this);
		}
	})

	var ViewText = Class.create(Label, {
		initialize: function(from, type, size, position, text, font, color, align, flg){
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
			if(flg) this._Output();
		},
		_Output: function(){
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
		initialize: function(from, type, size, position, text, font, color, align, lineColor, backColor){
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
		_Output: function(){
			this.from.addChild(this);
		}
	})

	var ViewMessage = Class.create(ViewText,{
		initialize: function(from, type, size, position, text, font, color, align, delTime){
			ViewText.call(this, from, type, size, position, text, font, color, align, true);
			this.time = 0;
			this.opacity = 0.25;

			this.onenterframe = function(){
				this.time++;
				if(this.time < 12 && this.time % 3 == 0){
					this.opacity += 0.25;
				}else if(this.time > delTime + 15 && this.time % 3 == 0){
					this.opacity -= 0.2;
				}
				if(this.time == delTime + 30){
					this._Remove();
				}
			}
		},
		_Remove: function(){
			this.from.removeChild(this);
		}
	})

	var ViewDamage = Class.create(Label,{
		initialize: function(from, damage, critical){
			Label.call(this);
			this.time = 0;
			this.opacity = 1.0;
			this.from = from;
			this.width = 64;
			this.height = 32;
			this.moveTo(from.x, from.y - 32);
			this.text = damage;
			this.font = '32px sans-serif';
			this.color = 'white';
			this.textAlign = 'center';

			if(critical){
				this.color = 'yellow';
				this.scale(1.5, 1.5)
			}

			this.onenterframe = function(){
				this.time++;
				if(this.time == 15){
					this.color = 'red';
				}
				if(this.time > 20){
					this.opacity-= 0.1;
				}
				if(this.opacity <= 0){
					now_scene.removeChild(this);
				}
			}

			now_scene.addChild(this);
		}
	})

	var ViewFrame = Class.create(Sprite,{
		initialize: function(from, type, size, position, color){
			Sprite.call(this, size.width, size.height);

			this.from = from;
			this.type = type;

			this.moveTo(position.x, position.y);
			this.backgroundColor = color;

			from.addChild(this);
		}
	})

	var ViewArea = Class.create(Group, {
		initialize: function(position, name){
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

	var SetArea = Class.create(ViewArea,{
		initialize: function(position, name){
			ViewArea.call(this, position, name);
			this.type;
			switch(name){
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
		_SetTitle: function(){
			this.head.moveTo(this.type.Head.position.x, this.type.Head.position.y);
			this.body.moveTo(this.type.Body.position.x, this.type.Body.position.y);
			new ViewFrame(this.head, 'Title', this.type.Head.size, {x: 0, y: 0}, this.type.Head.color);
			new ViewFrame(this.head, 'Top', {width: this.type.Head.size.width, height: 5}, {x: 0, y: 32}, 'yellow');
			new ViewFrame(this.head, 'Bottom', {width: this.type.Head.size.width, height: 5}, {x: 0, y: this.type.Head.size.height - 37}, 'yellow');

			new ViewText(this.head, 'Title', {width: 720, height: 80}, {x: 192, y: 64}, 'Battle Tank Game', '80px sans-serif', 'white', 'center', true);
		},
		_SetTankList: function(){
			this.head.moveTo(this.type.Head.position.x, this.type.Head.position.y);
			this.body.moveTo(this.type.Body.position.x, this.type.Body.position.y);
			new ViewFrame(this.head, 'TankList', this.type.Head.size, {x: 0, y: 0}, this.type.Head.color);
			new ViewFrame(this.head, 'Top', {width: this.type.Head.size.width, height: 5}, {x: 0, y: 32}, 'yellow');
			new ViewFrame(this.head, 'Bottom', {width: this.type.Head.size.width, height: 5}, {x: 0, y: this.type.Head.size.height - 37}, 'yellow');
			new ViewFrame(this.body, 'TankList', this.type.Body.size, {x: 0, y: 0}, this.type.Body.color);

			new ViewText(this.head, 'Title', {width: 64 * 4, height: 64}, {x: 64 * 7, y: 64}, '戦車一覧', '64px sans-serif', '#ebe799', 'center', true);
			//new DispText(120, 150, 260 * 4, 64, '戦車一覧', '64px sans-serif', '#ebe799', 'center', scene)
		},
		_SetStart: function(){
			this.head.moveTo(this.type.Head.position.x, this.type.Head.position.y);
			this.body.moveTo(this.type.Body.position.x, this.type.Body.position.y);
			new ViewFrame(this.head, 'Start', this.type.Head.size, {x: 0, y: 0}, this.type.Head.color);
			new ViewFrame(this.head, 'Top', {width: this.type.Head.size.width, height: 5}, {x: 0, y: 32}, 'yellow');
			new ViewFrame(this.head, 'Bottom', {width: this.type.Head.size.width, height: 5}, {x: 0, y: this.type.Head.size.height - 37}, 'yellow');
			//new ViewFrame(this.body, 'Result', this.type.Body.size, {x: 0, y: 0}, this.type.Body.color);
		},
		_SetBonus: function(){
			this.head.moveTo(this.type.Head.position.x, this.type.Head.position.y);
			this.body.moveTo(this.type.Body.position.x, this.type.Body.position.y);
			new ViewFrame(this.head, 'Bonus', this.type.Head.size, {x: 0, y: 0}, this.type.Head.color);
			new ViewFrame(this.head, 'Top', {width: this.type.Head.size.width, height: 5}, {x: 0, y: 32}, 'yellow');
			new ViewFrame(this.head, 'Bottom', {width: this.type.Head.size.width, height: 5}, {x: 0, y: this.type.Head.size.height - 37}, 'yellow');
			//new ViewFrame(this.body, 'Result', this.type.Body.size, {x: 0, y: 0}, this.type.Body.color);
		},
		_SetResult: function(){
			this.head.moveTo(this.type.Head.position.x, this.type.Head.position.y);
			this.body.moveTo(this.type.Body.position.x, this.type.Body.position.y);
			new ViewFrame(this.head, 'Result', this.type.Head.size, {x: 0, y: 0}, this.type.Head.color);
			new ViewFrame(this.head, 'Top', {width: this.type.Head.size.width, height: 5}, {x: 0, y: 32}, 'yellow');
			//new ViewFrame(this.body, 'Result', this.type.Body.size, {x: 0, y: 0}, this.type.Body.color);
		},
		_SetPause: function(){
			this.body.moveTo(this.type.Body.position.x, this.type.Body.position.y);
			new ViewFrame(this.body, 'Pause', this.type.Body.size, {x: 0, y: 0}, this.type.Body.color);
		}
	});

	var SelWindow = Class.create(ViewArea,{
		initialize: function(position, name){
			ViewArea.call(this, position, name);
			var my = this;
			this.type;

			ActiveFlg = true;

			new ViewFrame(this.head, 'Window', {width: 960, height: 540}, {x: 0, y: 0}, '#fff');
			new ViewText(this.head, 'Title', {width: 400, height: 48}, {x: 8, y: 8}, 'ゲームモード選択', '48px sans-serif', 'black', 'center', true);

			/*var nomal = new ViewText(this.head, 'Mode', {width: 240, height: 48}, {x: 8, y: 128}, 'ノーマル', '48px sans-serif', 'black', 'center', true);
			var hard = new ViewText(this.head, 'Mode', {width: 240, height: 48}, {x: 300, y: 128}, 'ハード', '48px sans-serif', 'black', 'center', true);
			var survival = new ViewText(this.head, 'Mode', {width: 240, height: 48}, {x: 600, y: 128}, 'サバイバル', '48px sans-serif', 'black', 'center', true);*/

			var nomal = new ViewButton(this.head, 'Mode', {width: 264, height: 48}, {x: 32, y: 128}, 'ノーマル', '48px sans-serif', 'black', 'center', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.1)');
			var hard = new ViewButton(this.head, 'Mode', {width: 264, height: 48}, {x: 344, y: 128}, 'ハード', '48px sans-serif', 'black', 'center', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.1)');
			var survival = new ViewButton(this.head, 'Mode', {width: 264, height: 48}, {x: 664, y: 128}, 'サバイバル', '48px sans-serif', 'black', 'center', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.1)');

			//var toList = new ViewButton(area.head, 'Mode', {width: 48 * 8, height: 48}, {x: PixelSize * 5, y: PixelSize * 8.25}, '➡　戦車一覧へ', '48px sans-serif', '#ebe799', 'left', 'rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0)');

			var dsc = new ViewText(this.head, 'Mode', {width: 896, height: 32 * 9}, {x: 32, y: 216}, 'ゲームモード説明', '32px sans-serif', 'black', 'left', true);
			dsc.backgroundColor = '#44444444';

			function changeMode() {
				switch(gameMode){
					case 0:
						nomal.text.color = 'red';
						hard.text.color = 'black';
						survival.text.color = 'black';
						dsc.text = 'ノーマルモード<br>初心者におすすめの難易度。';
						break;
					case 1:
						nomal.text.color = 'black';
						hard.text.color = 'red';
						survival.text.color = 'black';
						dsc.text = 'ハードモード<br>敵のステータスが強化され、より難しいモード。';
						break;
					case 2:
						nomal.text.color = 'black';
						hard.text.color = 'black';
						survival.text.color = 'red';
						dsc.text = 'サバイバルモード<br>敵の攻撃を受けると撃破されるかわりに残機が消費されるモード。<br>敵の強化はあり。';
						break;
				}
			}

			this.back = new ViewText(this.head, 'Back', {width: 64, height: 64}, {x: 896, y: 0}, '×', '64px sans-serif', 'white', 'center', true);
			this.back.backgroundColor = 'red';

			changeMode();

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

	var TestText = Class.create(Entity,{
		initialize: function(){
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

	var TestButton = Class.create(Button,{
		initialize: function(){
			Button.call(this, "ボタン", "light");
			this.tag = "ボタン";
			this.width = 256;
			this.height = 32;
			this.moveTo(300, 300);
			now_scene.addChild(this);
		}
	})

	var InputForm = Class.create(Entity,{
		initialize: function(){
			Entity.call(this);
			this._element = document.createElement('input');
			this._element.setAttribute('type','text');
			this._element.setAttribute('maxlength','10');
			this._element.setAttribute('id','test');
			this._element.setAttribute('value','test');
			this.width = 100;
			this.height = 20;
			this.x = 10;
			this.y = 50;

			//console.log(this._element.value);

			now_scene.addChild(this);
		},
		_delete: function(){
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
			new ViewText(this, 'Play', {width: 320 * 4, height: 48}, {x: PixelSize * 0, y: PixelSize * 7}, 'Touch to StartUp!', '48px sans-serif', 'white', 'center', true);

			this.addEventListener('touchstart', function() {
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

	var TitleScene = Class.create(Scene,{
		initialize: function(){
			Scene.call(this);
			this.backgroundColor = '#cacaca';
			this.time = 0;
			now_scene = this;

			var flg = false;
			var orFlg = 0;

			let area = new SetArea({x: 0, y: 0}, 'Title');

			var toPlay = new ViewText(area.head, 'Play', {width: 48 * 8, height: 48}, {x: PixelSize * 5, y: PixelSize * 3}, '➡　はじめから', '48px sans-serif', '#ebe799', 'left', true);
			var toContinue = new ViewText(area.head, 'Continue', {width: 48 * 8, height: 48}, {x: PixelSize * 5, y: PixelSize * 4.5}, '➡　つづきから', '48px sans-serif', '#ebe799', 'left', true);
			var toMode = new ViewText(area.head, 'Mode', {width: 48 * 12, height: 48}, {x: PixelSize * 5, y: PixelSize * 6}, '➡　ゲームモード選択', '48px sans-serif', '#ebe799', 'left', true);
			new ViewText(area.head, 'Mode', {width: 280, height: 40}, {x: PixelSize * 5 + 80, y: PixelSize * 7}, '現在のモード：', '40px sans-serif', '#ebe799', 'left', true);
			var nowMode = new ViewText(area.head, 'Mode', {width: 200, height: 40}, {x: PixelSize * 9.5 + 80, y: PixelSize * 7}, 'ノーマル', '40px sans-serif', '#ebe799', 'left', true);
			var toList = new ViewText(area.head, 'Mode', {width: 48 * 8, height: 48}, {x: PixelSize * 5, y: PixelSize * 8.25}, '➡　戦車一覧へ', '48px sans-serif', '#ebe799', 'left', true);
			//var toList = new ViewButton(area.head, 'Mode', {width: 48 * 8, height: 48}, {x: PixelSize * 5, y: PixelSize * 8.25}, '➡　戦車一覧へ', '48px sans-serif', '#ebe799', 'left', 'rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0)');

			//new TestSurface(this);

			toPlay.addEventListener(Event.TOUCH_START, function() {
				if(!ActiveFlg){

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
				if(!ActiveFlg){
					flg = true;
					orFlg = 3;
					new FadeOut(now_scene);
				}
			});

			function Mode_Change(label){
				switch(gameMode){
					case 0:
						label.text = 'ノーマル';
						label.color = '#ebe799';
						break;
					case 1:
						label.text = 'ハード';
						label.color = '#ebe799';
						break;
					case 2:
						label.text = 'サバイバル';
						label.color = '#ebe799';
						break;
				}
			}

			toMode.addEventListener(Event.TOUCH_START, function() {
				if(!ActiveFlg){
					new SelWindow({x: PixelSize * 2.5, y: PixelSize * 4}, 'Mode');
				}
			})

			this.onenterframe = function() {
				game.time++;
				if(game.time % 12 == 0){
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
						
						switch(orFlg){
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
		_Remove: function(){
			while(this.firstChild){
				if(this.firstChild instanceof enchant.box2d.PhySprite){
					this.firstChild.destroy();
				}else{
				}
				this.removeChild(this.firstChild);
			}
		}
	})

	var TankListScene = Class.create(Scene,{
		initialize: function(){
			Scene.call(this);
			this.backgroundColor = '#ebf899';
			this.time = 0;
			now_scene = this;

			this.TankGroup = new Group();
			this.CannonGroup = new Group();

			var flg = false;
			let dispTanks = [];
			let performance = [];

			if(gameMode == 0){
				performance = [
					[colorsName[0], "　耐久　：" + Categorys.Life[0], "　弾数　：" + Categorys.MaxBullet[0], "　弾速　：普通(" + Categorys.ShotSpeed[0] + ")", "跳弾回数：" + Categorys.MaxRef[0], "移動速度：速い(" + Categorys.MoveSpeed[0] + ")", "・プレイヤーが操作する戦車。<br>　高性能かつ汎用性が高いため<br>　初心者におすすめ。<br>　クリティカル発生率が高い。"],
					[colorsName[1], "　耐久　：" + Categorys.Life[1], "　弾数　：" + Categorys.MaxBullet[1], "　弾速　：遅い(" + Categorys.ShotSpeed[1] + ")", "跳弾回数：" + Categorys.MaxRef[1], "移動速度：動かない(" + Categorys.MoveSpeed[1] + ")", "・弾道予測型<br>　最も弱い戦車。<br>　よく狙って攻撃するため命中率は高い。"],
					[colorsName[2], "　耐久　：" + Categorys.Life[2], "　弾数　：" + Categorys.MaxBullet[2], "　弾速　：普通(" + Categorys.ShotSpeed[2] + ")", "跳弾回数：" + Categorys.MaxRef[2], "移動速度：遅い(" + Categorys.MoveSpeed[2] + ")", "・最短追尾型<br>　最短経路を計算して移動する。<br>　配置によっては脅威になりうる。"],
					[colorsName[3], "　耐久　：" + Categorys.Life[3], "　弾数　：" + Categorys.MaxBullet[3], "　弾速　：速い(" + Categorys.ShotSpeed[3] + ")", "跳弾回数：" + Categorys.MaxRef[3], "移動速度：遅い(" + Categorys.MoveSpeed[3] + ")", "・攻守両立型<br>　数は少ないが速い弾を撃てる戦車。<br>　物量で攻めると倒しやすい。"],
					[colorsName[4], "　耐久　：" + Categorys.Life[4], "　弾数　：" + Categorys.MaxBullet[4], "　弾速　：普通(" + Categorys.ShotSpeed[4] + ")", "跳弾回数：" + Categorys.MaxRef[4], "移動速度：やや速い(" + Categorys.MoveSpeed[4] + ")", "・最短追尾型<br>　弾数が多く、発射頻度も高いため<br>　物量で攻める突撃をしてくる。"],
					[colorsName[5], "　耐久　：" + Categorys.Life[5], "　弾数　：" + Categorys.MaxBullet[5], "　弾速　：やや速い(" + Categorys.ShotSpeed[5] + ")", "跳弾回数：" + Categorys.MaxRef[5], "移動速度：やや遅い(" + Categorys.MoveSpeed[5] + ")", "・生存特化型<br>　跳弾回数の多さが特徴の戦車。<br>　反射した弾に要注意。"],
					[colorsName[6], "　耐久　：" + Categorys.Life[6], "　弾数　：" + Categorys.MaxBullet[6], "　弾速　：普通(" + Categorys.ShotSpeed[6] + ")", "跳弾回数：" + Categorys.MaxRef[6], "移動速度：普通(" + Categorys.MoveSpeed[6] + ")", "・生存特化型<br>　追尾、迎撃、回避全て揃ったエリート戦車<br>　跳弾を活用すると倒しやすい。"],
					[colorsName[7], "　耐久　：" + Categorys.Life[7], "　弾数　：" + Categorys.MaxBullet[7], "　弾速　：とても速い(" + Categorys.ShotSpeed[7] + ")", "跳弾回数：" + Categorys.MaxRef[7], "移動速度：動かない(" + Categorys.MoveSpeed[7] + ")", "・弾道予測型<br>　敵戦車の中でも指折りの狙撃手。<br>　壁の後ろに隠れても油断してはいけない。"],
					[colorsName[8], "　耐久　：" + Categorys.Life[8], "　弾数　：" + Categorys.MaxBullet[8], "　弾速　：速い(" + Categorys.ShotSpeed[8] + ")", "跳弾回数：" + Categorys.MaxRef[8], "移動速度：やや遅い(" + Categorys.MoveSpeed[8] + ")", "・攻守両立型<br>　ステルス能力を持つ敵戦車。<br>　死角からの砲撃に要注意。"],
					[colorsName[9], "　耐久　：" + Categorys.Life[9], "　弾数　：" + Categorys.MaxBullet[9], "　弾速　：やや速い(" + Categorys.ShotSpeed[9] + ")", "跳弾回数：" + Categorys.MaxRef[9], "移動速度：動かない(" + Categorys.MoveSpeed[9] + ")", "・固定弾幕型<br>　撃てる弾を全て使い弾幕を張る戦車。<br>　弾切れを起こすと無防備になる。<br>　クリティカル発生率がとても高い。"],
					[colorsName[10], "　耐久　：" + Categorys.Life[10], "　弾数　：" + Categorys.MaxBullet[10], "　弾速　：やや速い(" + Categorys.ShotSpeed[10] + ")", "跳弾回数：" + Categorys.MaxRef[10], "移動速度：速い(" + Categorys.MoveSpeed[10] + ")", "・地雷設置型<br>　高機動かつ地雷をばら撒く戦車。<br>　偏差射撃も使うため危険度が高い。"],
					[colorsName[11], "　耐久　：" + Categorys.Life[11], "　弾数　：" + Categorys.MaxBullet[11], "　弾速　：最速(" + Categorys.ShotSpeed[11] + ")", "跳弾回数：" + Categorys.MaxRef[11], "移動速度：速い(" + Categorys.MoveSpeed[11] + ")", "・強襲狙撃型<br>　高機動かつ最速の弾を放つ戦車。<br>　稀に乱入する危険な不明車両。"],
					[colorsName[12], "　耐久　：" + Categorys.Life[12], "　弾数　：" + Categorys.MaxBullet[12], "　弾速　：速い(" + Categorys.ShotSpeed[12] + ")", "跳弾回数：" + Categorys.MaxRef[12], "移動速度：やや速い(" + Categorys.MoveSpeed[12] + ")", "・精鋭型<br>　高い能力と耐久を持つボス戦車。<br>　地雷の爆破に巻き込めば耐久を無視して、<br>　撃破可能。"],
					[colorsName[13], "　耐久　：" + Categorys.Life[13], "　弾数　：" + Categorys.MaxBullet[13], "　弾速　：速い(" + Categorys.ShotSpeed[13] + ")", "跳弾回数：" + Categorys.MaxRef[13], "移動速度：とても速い(" + Categorys.MoveSpeed[13] + ")", "・精鋭型<br>　最上位の戦闘力を誇るボス戦車。<br>　優秀なプレイヤーしか対峙できない。<br>　耐久が1になると殲滅モードに移行する。"]
				];
			}else{
				performance = [
					[colorsName[0], "　耐久　：" + Categorys.Life[0], "　弾数　：" + Categorys.MaxBullet[0], "　弾速　：普通(" + Categorys.ShotSpeed[0] + ")", "跳弾回数：" + Categorys.MaxRef[0], "移動速度：速い(" + Categorys.MoveSpeed[0] + ")", "・プレイヤーが操作する戦車。<br>　高性能かつ汎用性が高いため<br>　初心者におすすめ。<br>　クリティカル発生率が高い。"],
					[colorsName[1], "　耐久　：" + Categorys.Life[1], "　弾数　：" + (Categorys.MaxBullet[1] + 2), "　弾速　：普通(" + (Categorys.ShotSpeed[1] + 2) + ")", "跳弾回数：" + Categorys.MaxRef[1], "移動速度：動かない(" + Categorys.MoveSpeed[1] + ")", "・弾道予測型<br>　最も弱い戦車。<br>　よく狙って攻撃するため命中率は高い。"],
					[colorsName[2], "　耐久　：" + Categorys.Life[2], "　弾数　：" + (Categorys.MaxBullet[2] + 1), "　弾速　：普通(" + (Categorys.ShotSpeed[2] + 1) + ")", "跳弾回数：" + Categorys.MaxRef[2], "移動速度：普通(" + (Categorys.MoveSpeed[2] + 0.5) + ")", "・最短追尾型<br>　最短経路を計算して移動する。<br>　配置によっては脅威になりうる。"],
					[colorsName[3], "　耐久　：" + Categorys.Life[3], "　弾数　：" + (Categorys.MaxBullet[3] + 1), "　弾速　：速い(" + Categorys.ShotSpeed[3] + ")", "跳弾回数：" + (Categorys.MaxRef[3] + 1), "移動速度：普通(" + (Categorys.MoveSpeed[3] + 0.5) + ")", "・攻守両立型<br>　数は少ないが速い弾を撃てる戦車。<br>　物量で攻めると倒しやすい。<br>【弱化】装填にかかる時間の延長"],
					[colorsName[4], "　耐久　：" + Categorys.Life[4], "　弾数　：" + (Categorys.MaxBullet[4] + 1), "　弾速　：やや速い(" + (Categorys.ShotSpeed[4] + 1) + ")", "跳弾回数：" + Categorys.MaxRef[4], "移動速度：やや速い(" + Categorys.MoveSpeed[4] + ")", "・最短追尾型<br>　弾数が多く、発射頻度も高いため<br>　物量で攻める突撃をしてくる。"],
					[colorsName[5], "　耐久　：" + Categorys.Life[5], "　弾数　：" + (Categorys.MaxBullet[5] + 1), "　弾速　：やや速い(" + Categorys.ShotSpeed[5] + ")", "跳弾回数：" + Categorys.MaxRef[5], "移動速度：普通(" + (Categorys.MoveSpeed[5] + 0.5) + ")", "・生存特化型<br>　跳弾回数の多さが特徴の戦車。<br>　反射した弾に要注意。"],
					[colorsName[6], "　耐久　：" + Categorys.Life[6], "　弾数　：" + (Categorys.MaxBullet[6] + 1), "　弾速　：やや速い(" + (Categorys.ShotSpeed[6] + 1) + ")", "跳弾回数：" + Categorys.MaxRef[6], "移動速度：速い(" + (Categorys.MoveSpeed[6] + 0.5) + ")", "・生存特化型<br>　追尾、迎撃、回避全て揃ったエリート戦車<br>　跳弾を活用すると倒しやすい。"],
					[colorsName[7], "　耐久　：" + Categorys.Life[7], "　弾数　：" + (Categorys.MaxBullet[7] + 1), "　弾速　：とても速い(" + Categorys.ShotSpeed[7] + ")", "跳弾回数：" + Categorys.MaxRef[7], "移動速度：動かない(" + Categorys.MoveSpeed[7] + ")", "・弾道予測型<br>　敵戦車の中でも指折りの狙撃手。<br>　壁の後ろに隠れても油断してはいけない。"],
					[colorsName[8], "　耐久　：" + Categorys.Life[8], "　弾数　：" + Categorys.MaxBullet[8], "　弾速　：速い(" + Categorys.ShotSpeed[8] + ")", "跳弾回数：" + Categorys.MaxRef[8], "移動速度：普通(" + (Categorys.MoveSpeed[8] + 0.5) + ")", "・攻守両立型<br>　ステルス能力を持つ敵戦車。<br>　死角からの砲撃に要注意。<br>【強化】装填にかかる時間の短縮"],
					[colorsName[9], "　耐久　：" + Categorys.Life[9], "　弾数　：" + (Categorys.MaxBullet[9] + 1), "　弾速　：やや速い(" + Categorys.ShotSpeed[9] + ")", "跳弾回数：" + Categorys.MaxRef[9], "移動速度：動かない(" + Categorys.MoveSpeed[9] + ")", "・固定弾幕型<br>　撃てる弾を全て使い弾幕を張る戦車。<br>　弾切れを起こすと無防備になる。<br>　クリティカル発生率がとても高い。<br>【強化】砲撃間隔の短縮"],
					[colorsName[10], "　耐久　：" + Categorys.Life[10], "　弾数　：" + Categorys.MaxBullet[10], "　弾速　：やや速い(" + Categorys.ShotSpeed[10] + ")", "跳弾回数：" + Categorys.MaxRef[10], "移動速度：とても速い(" + (Categorys.MoveSpeed[10] + 0.5) + ")", "・地雷設置型<br>　高機動かつ地雷をばら撒く戦車。<br>　偏差射撃も使うため危険度が高い。<br>【強化】地雷の数が3個に増加"],
					[colorsName[11], "　耐久　：" + Categorys.Life[11], "　弾数　：" + (Categorys.MaxBullet[11] + 1), "　弾速　：最速(" + (Categorys.ShotSpeed[11] + 1) + ")", "跳弾回数：" + Categorys.MaxRef[11], "移動速度：速い(" + Categorys.MoveSpeed[11] + ")", "・強襲狙撃型<br>　高機動かつ最速の弾を放つ戦車。<br>　稀に乱入する危険な不明車両。<br>【弱化】砲撃間隔の延長"],
					[colorsName[12], "　耐久　：" + Categorys.Life[12], "　弾数　：" + Categorys.MaxBullet[12], "　弾速　：速い(" + Categorys.ShotSpeed[12] + ")", "跳弾回数：" + Categorys.MaxRef[12], "移動速度：やや速い(" + Categorys.MoveSpeed[12] + ")", "・精鋭型<br>　高い能力と耐久を持つボス戦車。<br>　地雷の爆破に巻き込めば耐久を無視して、<br>　撃破可能。"],
					[colorsName[13], "　耐久　：" + Categorys.Life[13], "　弾数　：" + Categorys.MaxBullet[13], "　弾速　：速い(" + Categorys.ShotSpeed[13] + ")", "跳弾回数：" + Categorys.MaxRef[13], "移動速度：とても速い(" + Categorys.MoveSpeed[13] + ")", "・精鋭型<br>　最上位の戦闘力を誇るボス戦車。<br>　優秀なプレイヤーしか対峙できない。<br>　耐久が1になると殲滅モードに移行する。"]
				];
			}

			let area = new SetArea({x: 0, y: 0}, 'TankList');

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

			var tankName = new ViewText(area.body, 'Text', {width: 48 * 12, height: 48}, {x: PixelSize * 6.5, y: PixelSize * 0.5}, '戦車名', '48px sans-serif', 'black', 'left', true);
			var tankLife = new ViewText(area.body, 'Text', {width: 36 * 12, height: 36}, {x: PixelSize * 6.5, y: PixelSize * 1.5}, '　耐久　：', '36px sans-serif', 'black', 'left', true);
			var tankBulCnt = new ViewText(area.body, 'Text', {width: 36 * 12, height: 48}, {x: PixelSize * 6.5, y: PixelSize * 2.5}, '　弾数　：', '36px sans-serif', 'black', 'left', true);
			var tankBulSpd = new ViewText(area.body, 'Text', {width: 36 * 12, height: 48}, {x: PixelSize * 6.5, y: PixelSize * 3.5}, '　弾速　：', '36px sans-serif', 'black', 'left', true);
			var tankBulRef = new ViewText(area.body, 'Text', {width: 36 * 12, height: 48}, {x: PixelSize * 6.5, y: PixelSize * 4.5}, '跳弾回数：', '36px sans-serif', 'black', 'left', true);
			var tankSpd = new ViewText(area.body, 'Text', {width: 36 * 12, height: 48}, {x: PixelSize * 6.5, y: PixelSize * 5.5}, '移動速度：', '36px sans-serif', 'black', 'left', true);
			var tankDsc = new ViewText(area.body, 'Text', {width: 36 * 20, height: 36 * 3}, {x: PixelSize * 6.5, y: PixelSize * 6.5}, '・戦車の特徴', '36px sans-serif', 'black', 'left', true);

			var change = new ViewButton(area.body, 'Change', {width: 36 * 10, height: 36}, {x: PixelSize * 0.5, y: PixelSize * 8}, '選択中の戦車に変更', '36px sans-serif', 'black', 'center', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.1)');
			var selTank = new ViewText(this, 'Select', {width: 60, height: 20}, {x: 0, y: 0}, '自機→', '20px sans-serif', '#00f', 'center', true);

			var toTitle = new ViewText(area.head, 'Back', {width: PixelSize * 5.5, height: 48}, {x: PixelSize * 6.5, y: PixelSize * 12.5}, 'タイトル画面へ', '48px sans-serif', '#ebe799', 'center', true);

			change.addEventListener(Event.TOUCH_START, function() {
				if(selCnt > 11){
					new ViewMessage(now_scene, 'Message', {width: 960, height: 48}, {x: PixelSize * 2.5, y: PixelSize * 7.5}, performance[selCnt][0] + 'は自機として使用できません！', '48px sans-serif', '#f00', 'center', 60).backgroundColor = '#000a';
				}else if(playerType != selCnt){
					let i = playerType;
					playerType = selCnt;
					TankColorChange(i,false);
					TankColorChange(playerType,false);
					selTank.moveTo(PictureTank.collection[playerType].x - 60, PictureTank.collection[playerType].y + 20);
					new ViewMessage(now_scene, 'Message', {width: 960, height: 48}, {x: PixelSize * 2.5, y: PixelSize * 7.5}, '自機を' + performance[selCnt][0] + 'に変更しました。', '48px sans-serif', '#0ff', 'center', 60).backgroundColor = '#000a';
				}
				
			});

			toTitle.addEventListener(Event.TOUCH_START, function() {
				flg = true;
				new FadeOut(now_scene);
			});

			function TankColorChange(i, selFlg){
				let c = PictureTank.collection[i];
				if(selFlg){
					var image = new Surface(c.width, c.height);
						image.context.fillStyle = '#0000';
						image.context.lineWidth = 6;
						image.context.strokeStyle = '#FF1493';
						roundedRect(image.context, 0, 0, c.width, c.height, 10);
						c.image = image;
				}else if(i == playerType){
					var image = new Surface(c.width, c.height);
						image.context.fillStyle = '#0000';
						image.context.lineWidth = 4;
						image.context.strokeStyle = '#0ff';
						roundedRect(image.context, 0, 0, c.width, c.height, 10);
						c.image = image;
				}else{
					var image = new Surface(c.width, c.height);
						image.context.fillStyle = '#0008';
						image.context.lineWidth = 4;
						image.context.strokeStyle = '#0000';
						roundedRect(image.context, 0, 0, c.width, c.height, 10);
						c.image = image;
				}
			}

			function ResetText(){
				tankName.text = performance[selCnt][0];
				tankLife.text = performance[selCnt][1];
				tankBulCnt.text = performance[selCnt][2];
				tankBulSpd.text = performance[selCnt][3];
				tankBulRef.text = performance[selCnt][4];
				tankSpd.text = performance[selCnt][5];
				tankDsc.text = performance[selCnt][6];
				if(gameMode != 0){
					tankBulCnt.color = 'black';
					tankBulSpd.color = 'black';
					tankBulRef.color = 'black';
					tankSpd.color = 'black';
					tankDsc.color = 'black';
					switch(selCnt){
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
							tankSpd.color = 'red';
							break;
						case 6:
							tankBulCnt.color = 'red';
							tankBulSpd.color = 'red';
							tankSpd.color = 'red';
							break;
						case 7:
							tankBulCnt.color = 'red';
							break;
						case 8:
							tankSpd.color = 'red';
							tankDsc.color = 'red';
							break;
						case 9:
							tankBulCnt.color = 'red';
							tankDsc.color = 'red';
							break;
						case 10:
							tankSpd.color = 'red';
							tankDsc.color = 'red';
							break;
						case 11:
							tankBulCnt.color = 'red';
							tankBulSpd.color = 'red';
							tankDsc.color = 'red';
							break;
					}
				}
			}

			this.onenterframe = function(){
				if (!flg && BGM.currentTime == BGM.duration) {
					BGM.play();
				}
				
				if(flg){
					this.time++;
					if(this.time % 30 == 0){
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

			for(let i = 0; i < PictureTank.collection.length; i++){
				let c = PictureTank.collection[i];
				if(c.category == playerType){
					selTank.moveTo(c.x - 60, c.y + 20);
				}
				c.addEventListener(Event.TOUCH_START, function(){
					if(selCnt != -1)TankColorChange(selCnt,false);
					selCnt = c.category;
					ResetText();
					TankColorChange(selCnt,true);
				})
			}

			new FadeIn(this);
			return this;
		},
		_Remove: function(){
			while(this.firstChild){
				if(this.firstChild instanceof enchant.box2d.PhySprite){
					this.firstChild.destroy();
				}else{
				}
				this.removeChild(this.firstChild);
			}
		}
	})

	var StartScene = Class.create(Scene,{
		initialize: function(){
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
			tankColorCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
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

			let count = 0;
			for (var i = 4; i < Object.keys(nextData).length; i++) {
				count++;
			}

			deadTank.forEach(elem => {
				if (elem) {
					count--;
				}
			})

			stageData = LoadStage(); //ステージ情報引き出し

			let area = new SetArea({x: 0, y: 0}, 'Start');
			new ViewText(area.head, 'Title', {width: 960, height: 96}, {x: PixelSize * 0.5, y: PixelSize * 2}, 'Stage : ' + (stageNum + 1), '96px sans-serif', '#ebe799', 'center', true);
			new ViewText(area.head, 'Title', {width: 960, height: 96}, {x: PixelSize * 0.5, y: PixelSize * 5}, '敵戦車数：' + count, '32px sans-serif', '#ebe799', 'center', true);
			new ViewText(area.head, 'Title', {width: 960, height: 96}, {x: PixelSize * 0.5, y: PixelSize * 6}, '残機数：' + zanki, '32px sans-serif', 'aliceblue', 'center', true);

			this.onenterframe = function() {
				this.time++
				if (this.time == 15) game.assets['./sound/RoundStart.mp3'].play();
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
		_Remove: function(){
			while(this.firstChild){
				if(this.firstChild instanceof enchant.box2d.PhySprite){
					this.firstChild.destroy();
				}else{
				}
				this.removeChild(this.firstChild);
			}
		}
	});

	var BonusScene = Class.create(Scene,{
		initialize: function(){
			Scene.call(this);
            this.backgroundColor = '#ebf899';
            this.time = 0;
			now_scene = this;

			zanki++;

			let area = new SetArea({x: 0, y: 0}, 'Bonus');
			new ViewText(area.head, 'Title', {width: 960, height: 72}, {x: PixelSize * 0.5, y: PixelSize * 2}, 'クリアボーナス！', '72px sans-serif', '#ebe799', 'center', true);
			new ViewText(area.head, 'Title', {width: 48 * 5, height: 48}, {x: PixelSize * 5.5, y: PixelSize * 5}, '残機数：', '48px sans-serif', 'aliceblue', 'left', true);
			var zankiLabel = new ViewText(area.head, 'Title', {width: 128, height: 64}, {x: PixelSize * 8.5, y: PixelSize * 5}, (zanki - 1), '64px "Arial"', 'aliceblue', 'left', true);

			this.onenterframe = function(){
				this.time++
				if (this.time == 15) game.assets['./sound/ExtraTank.mp3'].play()
				if (this.time >= 85 && this.time < 90) {
					zankiLabel.opacity -= 0.2;
					if (zankiLabel.opacity <= 0) {
						this.removeChild(zankiLabel);
					}
				}
				if(this.time == 90){
					zankiLabel = new ViewText(area.head, 'Title', {width: 128, height: 72}, {x: PixelSize * 8.5, y: (PixelSize * 5) - 8}, zanki, 'bold 72px "Arial"', '#ebf899', 'left', true);
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
		_Remove: function(){
			while(this.firstChild){
				if(this.firstChild instanceof enchant.box2d.PhySprite){
					this.firstChild.destroy();
				}else{
				}
				this.removeChild(this.firstChild);
			}
		}
	})

    var TestScene = Class.create(Scene,{
        initialize: function(){
            Scene.call(this);
            this.backgroundColor = "white";
            this.time = 0;
			
			now_scene = this;

			stageData = LoadStage(); //ステージ情報引き出し

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
					switch(colJ){
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

			SetObs(this,this.backgroundMap.collisionData);
			SetRefs(this,this.backgroundMap.collisionData);

			tankEntity.push(new Entity_Type0(stageData[3][0], stageData[3][1], playerType, 0, this));

			for (let i = 4; i < Object.keys(stageData).length; i++) {
				if((Math.floor(Math.random() * 10) == 0 && stageNum > 10 && i == 4 && stageNum % 5 != 4) || stageData[i][2] == 11) stageData[i][2] = 11;
				if (!retryFlg) {
					switch(stageData[i][2]){
						case 1:
						case 7:
							tankEntity.push(new Entity_Type5(stageData[i][0], stageData[i][1], stageData[i][2], i-3, this));
							break;
						case 2:
						case 4:
							tankEntity.push(new Entity_Type1(stageData[i][0], stageData[i][1], stageData[i][2], i-3, this));
							break;
						case 3:
						case 8:
							tankEntity.push(new Entity_Type2(stageData[i][0], stageData[i][1], stageData[i][2], i-3, this));
							break;
						case 5:
						case 6:
							tankEntity.push(new Entity_Type3(stageData[i][0], stageData[i][1], stageData[i][2], i-3, this));
							break;
						case 9:
							tankEntity.push(new Entity_Type4(stageData[i][0], stageData[i][1], stageData[i][2], i-3, this));
							break;
						case 10:
							tankEntity.push(new Entity_Type6(stageData[i][0], stageData[i][1], stageData[i][2], i-3, this));
							break;
						case 11:
							tankEntity.push(new Entity_Type7(stageData[i][0], stageData[i][1], stageData[i][2], i-3, this));
							break;
						case 12:
							tankEntity.push(new Entity_Type8(stageData[i][0], stageData[i][1], stageData[i][2], i-3, this));
							break;
						case 13:
							tankEntity.push(new Entity_Type9(stageData[i][0], stageData[i][1], stageData[i][2], i-3, this));
							break;
					}
					tankColorCounts[stageData[i][2]]++;
				}else{
					if (deadTank[i - 3] == false) {
						switch(stageData[i][2]){
							case 1:
							case 7:
								tankEntity.push(new Entity_Type5(stageData[i][0], stageData[i][1], stageData[i][2], i-3, this));
								break;
							case 2:
							case 4:
								tankEntity.push(new Entity_Type1(stageData[i][0], stageData[i][1], stageData[i][2], i-3, this));
								break;
							case 3:
							case 8:
								tankEntity.push(new Entity_Type2(stageData[i][0], stageData[i][1], stageData[i][2], i-3, this));
								break;
							case 5:
							case 6:
								tankEntity.push(new Entity_Type3(stageData[i][0], stageData[i][1], stageData[i][2], i-3, this));
								break;
							case 9:
								tankEntity.push(new Entity_Type4(stageData[i][0], stageData[i][1], stageData[i][2], i-3, this));
								break;
							case 10:
								tankEntity.push(new Entity_Type6(stageData[i][0], stageData[i][1], stageData[i][2], i-3, this));
								break;
							case 11:
								tankEntity.push(new Entity_Type7(stageData[i][0], stageData[i][1], stageData[i][2], i-3, this));
								break;
							case 12:
								tankEntity.push(new Entity_Type8(stageData[i][0], stageData[i][1], stageData[i][2], i-3, this));
								break;
							case 13:
								tankEntity.push(new Entity_Type9(stageData[i][0], stageData[i][1], stageData[i][2], i-3, this));
								break;
						}
						tankColorCounts[stageData[i][2]]++;
					}else{
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

			var remaining = new ViewRemaining();

			BGM = game.assets['./sound/start.mp3'];
			BGM.play();
			BGM.volume = 0.2;

			let chgBgm = false;

			

            this.onenterframe = function(){
                game.time++;


				if (tankColorCounts[13] > 0) BNum = 12
				else if (tankColorCounts[12] > 0) BNum = 11
				else if (tankColorCounts[11] > 0) BNum = 10
				else if (tankColorCounts[7] > 0) BNum = 6
				else if (tankColorCounts[10] > 0) BNum = 9
				else if (tankColorCounts[9] > 0) BNum = 8
				else if (tankColorCounts[8] > 0) BNum = 7
				else if (tankColorCounts[6] > 0) BNum = 5
				else if (tankColorCounts[5] > 0) BNum = 4
				else if (tankColorCounts[4] > 0) BNum = 3
				else if (tankColorCounts[3] > 0) BNum = 2
				else if (tankColorCounts[2] > 0) BNum = 1
				else BNum = 0

				if(game.time == 210 && (complete == false && victory == false && defeat == false && resultFlg == false)){
					WorldFlg = true;
					remaining._Add();
					new ViewMessage(this, 'Message', {width: 640, height: 64}, {x: PixelSize * 5, y: PixelSize * 6}, 'S T A R T', 'bold 64px "Arial"', 'yellow', 'center', 60);
				}

				if(gameStatus == 0){
					if (BGM.currentTime == BGM.duration) {
						BGM = game.assets[BGMs[BNum]];
						BGM.currentTime = 0;
						BGM.play();
						if(game.time > 250)BGM.currentTime = 0.01;
					}
				}

				if(WorldFlg){
					world.step(game.fps);
					this.time++;

					if (inputManager.checkButton("Start") == inputManager.keyStatus.DOWN && gameStatus == 0 && game.time > 250) {
						new PauseScene();
					}

					if(!resultFlg){
						if(gameStatus == 0){
							if (destruction == tankEntity.length - 1 && zanki > 0 && !deadFlgs[0]) {
								playerLife = tankEntity[0].life % (Categorys.Life[tankEntity[0].category]);
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
									complete = true;
									
									resultFlg = true;
									score += destruction;
									this.time = 0;
									area = new SetArea({x: 0, y: 0}, 'Result');
									new ViewText(area.head, 'Title', {width: 784, height: 60}, {x: 146, y: 64}, 'ミッションコンプリート！', 'bold 60px "Arial"', 'yellow', 'center', true);
								} else {
									victory = true;
									this.time = 0;
									new ViewText(this, 'Title', {width: 720, height: 64}, {x: 360, y: 300}, 'ミッションクリア！', 'bold 60px "Arial"', 'red', 'left', true);
									new ViewScore(this);
								}
							}else if(deadFlgs[0]){
								playerLife = 0;
								BGM.stop();
								defeat = true;
								gameStatus = 2;
								if (zanki <= 0) {
									this.removeChild(remaining);
									for (var i = 4; i < Object.keys(stageData).length; i++) {
										if (deadFlgs[i - 3]) {
											colors[stageData[i][2]] += 1;
										}
									}
									resultFlg = true;
									score += destruction
									this.time = 0;
									area = new SetArea({x: 0, y: 0}, 'Result');
									new ViewText(area.head, 'Title', {width: 784, height: 60}, {x: 146, y: 64}, 'ミッション終了！', 'bold 60px "Arial"', 'yellow', 'center', true);
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
					}else{
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
							new ViewFrame(area.body, 'Result', area.type.Body.size, {x: 0, y: 0}, area.type.Body.color);
							new ViewFrame(area.body, 'Back', {width: 460, height: 56 * 13.5}, {x: 0, y: 0}, '#dd9');
						}
						if (this.time >= 120 && this.time % 15 == 0 && dcnt < colors.length) {
							if(colors[dcnt] > 0){
								new ViewText(area.body, 'Name', {width: 280, height: 48}, {x: 44, y: 56 * (dcnt) - 32}, colorsName[dcnt], '48px "Arial"', fontColor[dcnt], 'left', true);
								new ViewText(area.body, 'Score', {width: 180, height: 48}, {x: 324, y: 56 * (dcnt) - 32}, '：' + colors[dcnt], '48px "Arial"', '#400', 'left', true);
							}
							dcnt++;
						}
						if (this.time == 315) {
							if (defeat) {
								new ViewText(area.body, 'Score', {width: 570, height: 64}, {x: 520, y: 220}, '撃破数：' + (score), 'bold 64px "Arial"', '#622', 'left', true);
							} else {
								new ViewText(area.body, 'Score', {width: 570, height: 64}, {x: 520, y: 220}, '撃破数+残機：' + (score + zanki), 'bold 64px "Arial"', '#622', 'left', true);
							}

						}
						if (this.time >= 345) {
							retryFlg = false;
							deadTank = [false];
							var toTitle = new ViewText(area.body, 'toTitle', {width: 520, height: 48}, {x: 620, y: 570}, '➡タイトル画面へ', '40px "Arial"', '#400', 'center', false);
							var toProceed = new ViewText(area.body, 'toProceed', {width: 520, height: 48}, {x: 620, y: 670}, '➡さらなるステージへ...', '40px "Arial"', 'red', 'center', false);
							
							if (this.time == 345) {
								this.addChild(toTitle)
								if (stageNum != (stagePath.length-1) && defeat == false) {
									this.addChild(toProceed)
								}
							}
							toTitle.addEventListener(Event.TOUCH_START, function() {

								game.stop();
								location.href = "./game_life.html";
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
				}
				
            }
            return this;
        },
		_Remove: function(){
			while(this.firstChild){
				if(this.firstChild instanceof enchant.box2d.PhySprite){
					this.firstChild.destroy();
				}else{
				}
				this.removeChild(this.firstChild);
			}
		}
    })

	var PauseScene = Class.create(Scene,{
		initialize: function(){
			Scene.call(this);
			var that = this;
			this.backgroundColor = '#0008';
			this.time = 0;

			BGM.volume = 0.5;

			new ViewText(this, 'Title', {width: 640, height: 96}, {x: 64 * 5, y: 64 * 1.5}, 'PAUSE', '96px sans-serif', 'white', 'center',true);

			var save = new ViewButton(this, 'Title', {width: 640, height: 64}, {x: 64 * 5, y: 64 * 4}, 'SAVE', '64px sans-serif', 'white', 'center', 'rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)');
			var retire = new ViewButton(this, 'Title', {width: 640, height: 64}, {x: 64 * 5, y: 64 * 6.5}, 'RETIRE', '64px sans-serif', 'white', 'center', 'rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)');
			var back = new ViewButton(this, 'Title', {width: 640, height: 64}, {x: 64 * 5, y: 64 * 9}, 'CONTINUE', '64px sans-serif', 'white', 'center', 'rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)');

			//let area = new SetArea({x: 0, y: 0}, 'Pause');

			if (navigator.userAgent.match(/iPhone|iPad|Android/)) {
				new ViewFrame(this, 'Pause', {width: PixelSize * 20,height: PixelSize * 4.5}, {x: 0, y: PixelSize * 10.5}, '#000000aa');
				new ViewText(this, 'Move', {width: PixelSize * 8, height: PixelSize * 0.5}, {x: PixelSize * 0.5, y: PixelSize * 11}, '　移動　：十字パッド（斜め移動可）', '28px sans-serif', 'white', 'left', true);
				new ViewText(this, 'Move', {width: PixelSize * 8, height: PixelSize * 0.5}, {x: PixelSize * 0.5, y: PixelSize * 11.75}, '　照準　：画面タップか画面スライド', '28px sans-serif', 'white', 'left', true);
				new ViewText(this, 'Move', {width: PixelSize * 8, height: PixelSize * 0.5}, {x: PixelSize * 0.5, y: PixelSize * 12.5}, '　砲撃　：Bボタン', '28px sans-serif', 'white', 'left', true);
				new ViewText(this, 'Move', {width: PixelSize * 8, height: PixelSize * 0.5}, {x: PixelSize * 0.5, y: PixelSize * 13.25}, '爆弾設置：Aボタン', '28px sans-serif', 'white', 'left', true);
				new ViewText(this, 'Move', {width: PixelSize * 8, height: PixelSize * 0.5}, {x: PixelSize * 0.5, y: PixelSize * 14}, '一時停止：Startボタン', '28px sans-serif', 'white', 'left', true);

				new ViewText(this, 'Move', {width: PixelSize * 11, height: PixelSize * 0.5}, {x: PixelSize * 9, y: PixelSize * 11}, '※補足説明', '28px sans-serif', 'white', 'left', true);
				new ViewText(this, 'Move', {width: PixelSize * 11, height: PixelSize * 0.5}, {x: PixelSize * 9, y: PixelSize * 11.75}, '・ステージ上にある茶色の壁は爆弾でしか壊せません。', '28px sans-serif', 'white', 'left', true);
				new ViewText(this, 'Move', {width: PixelSize * 11, height: PixelSize * 0.5}, {x: PixelSize * 9, y: PixelSize * 12.5}, '・爆弾の爆発は、戦車の耐久を無視して撃破が可能。', '28px sans-serif', 'white', 'left', true);
				new ViewText(this, 'Move', {width: PixelSize * 11, height: PixelSize * 0.5}, {x: PixelSize * 9, y: PixelSize * 13.25}, '　サバイバルモードでは爆発に巻き込まれると即', '28px sans-serif', 'white', 'left', true);
				new ViewText(this, 'Move', {width: PixelSize * 11, height: PixelSize * 0.5}, {x: PixelSize * 9, y: PixelSize * 14}, '　ゲームオーバーになるため注意してください。', '28px sans-serif', 'white', 'left', true);
			} else {
				new ViewFrame(this, 'Pause', {width: PixelSize * 20,height: PixelSize * 4.5}, {x: 0, y: PixelSize * 10.5}, '#000000aa');
				new ViewText(this, 'Move', {width: PixelSize * 8, height: PixelSize * 0.5}, {x: PixelSize * 0.5, y: PixelSize * 11}, '　移動　：WASDキー　（斜め移動可）', '28px sans-serif', 'white', 'left', true);
				new ViewText(this, 'Move', {width: PixelSize * 8, height: PixelSize * 0.5}, {x: PixelSize * 0.5, y: PixelSize * 11.75}, '　照準　：マウス操作', '28px sans-serif', 'white', 'left', true);
				new ViewText(this, 'Move', {width: PixelSize * 8, height: PixelSize * 0.5}, {x: PixelSize * 0.5, y: PixelSize * 12.5}, '　砲撃　：左クリック', '28px sans-serif', 'white', 'left', true);
				new ViewText(this, 'Move', {width: PixelSize * 8, height: PixelSize * 0.5}, {x: PixelSize * 0.5, y: PixelSize * 13.25}, '爆弾設置：Eキー', '28px sans-serif', 'white', 'left', true);
				new ViewText(this, 'Move', {width: PixelSize * 8, height: PixelSize * 0.5}, {x: PixelSize * 0.5, y: PixelSize * 14}, '一時停止：Escキー', '28px sans-serif', 'white', 'left', true);

				new ViewText(this, 'Move', {width: PixelSize * 11, height: PixelSize * 0.5}, {x: PixelSize * 9, y: PixelSize * 11}, '※補足説明', '28px sans-serif', 'white', 'left', true);
				new ViewText(this, 'Move', {width: PixelSize * 11, height: PixelSize * 0.5}, {x: PixelSize * 9, y: PixelSize * 11.75}, '・ステージ上にある茶色の壁は爆弾でしか壊せません。', '28px sans-serif', 'white', 'left', true);
				new ViewText(this, 'Move', {width: PixelSize * 11, height: PixelSize * 0.5}, {x: PixelSize * 9, y: PixelSize * 12.5}, '・爆弾の爆発は、戦車の耐久を無視して撃破が可能。', '28px sans-serif', 'white', 'left', true);
				new ViewText(this, 'Move', {width: PixelSize * 11, height: PixelSize * 0.5}, {x: PixelSize * 9, y: PixelSize * 13.25}, '　サバイバルモードでは爆発に巻き込まれると即', '28px sans-serif', 'white', 'left', true);
				new ViewText(this, 'Move', {width: PixelSize * 11, height: PixelSize * 0.5}, {x: PixelSize * 9, y: PixelSize * 14}, '　ゲームオーバーになるため注意してください。', '28px sans-serif', 'white', 'left', true);
			}

			save.addEventListener(Event.TOUCH_START, function() {
				if (confirm("現在の進捗をセーブしますか？\r\nタイトルのつづきからを選択すると現在のステージから再開できます。")) {
					Repository.data.StageNum = stageNum;
					Repository.data.Zanki = zanki;
					Repository.data.Scores = colors;
					Repository.data.Level = gameMode;
					Repository.data.Type = playerType;
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

			this.onenterframe = function(){
				this.time++;
				if(gameStatus == 0){
					if (BGM.currentTime == BGM.duration) {
						BGM.currentTime = 0;
						BGM.play();
						BGM.volume = 0.5;
					}
				}
				if (inputManager.checkButton("Start") == inputManager.keyStatus.DOWN){
					BGM.volume = 1.0;
					this._Remove();
				}
			}
			game.pushScene(this);
		},
		_Remove: function(){
			while(this.firstChild){
				if(this.firstChild instanceof enchant.box2d.PhySprite){
					this.firstChild.destroy();
				}else{
				}
				this.removeChild(this.firstChild);
			}
			game.popScene(this);
		}
	})

    game.onload = function() {
		var script = document.createElement("script");
		script.src = stagePath[stageNum];
		script.id = 'stage_' + stageNum;
		head[0].appendChild(script);
		
		BGM = game.assets['./sound/TITLE.mp3'];
        game.replaceScene(new SetUpScene());
    };

	game.onenterframe = function(){
		if (game.time % 10 == 0 && WorldFlg) {
			window.focus();
		}
	}
    
	if (navigator.userAgent.match(/iPhone|iPad|Android/)) {
		if (Math.abs(window.orientation) == 90) {
			if(DebugFlg){
				game.debug();	//	ゲームをデバッグモードで実行させる。
			}else{
				game.start(); // ゲームをスタートさせます
			}
		}else{
			
		}
	}else{
		if(DebugFlg){
			game.debug();	//	ゲームをデバッグモードで実行させる。
		}else{
			game.start(); // ゲームをスタートさせます
		}
	}
};
if (navigator.userAgent.match(/iPhone/)) {
	window.addEventListener('orientationchange',function(){
		stageScreen = document.getElementById('enchant-stage');
		let vh = (window.innerHeight / ((PixelSize * Stage_H) + 32));
		//console.log(vh);
		game.scale = vh;
		ScreenMargin = ((window.innerWidth-stageScreen.clientWidth)/2);
		stageScreen.style.position = "absolute";
		stageScreen.style.left = ScreenMargin + "px";
		game._pageX = ScreenMargin;
	})
}
window.onresize = function(){
	stageScreen = document.getElementById('enchant-stage');
	let vh = (window.innerHeight / ((PixelSize * Stage_H) + 32));
	//console.log(vh);
	game.scale = vh;
	ScreenMargin = ((window.innerWidth-stageScreen.clientWidth)/2);
	stageScreen.style.position = "absolute";
	stageScreen.style.left = ScreenMargin + "px";
	game._pageX = ScreenMargin;
};