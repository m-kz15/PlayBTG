window.focus();
enchant();

const size = 4;                 //サイズ倍率(勝手に触らない方が良い)
const base = 16;                //基準サイズ
const pixelSize = base*size;    //1セルごとのサイズ

const stage_w = 20;
const stage_h = 15;

var cheat = false;      //チート用

var cur;                //カーソルの位置情報を保持する配列

var stageData;          //ステージ情報を管理する変数

var floors = [];        //ステージの障害物を保持する配列
var walls = [];         //ステージの壁を保持する配列
var holes = [];         //ステージの穴を保持する配列
var avoids = [];        //（敵のみ適応）見えない壁を保持する配列
var obsdir = []
var obsChk = []
var obsNum = 0;
var refdir = []
var refChk = []
var refNum = 0;

var tankEntity = [];    //敵味方の戦車情報を保持する配列
var tankDir = []
var markEntity = [];
var bulOb = [[]];       //戦車の弾情報を保持する配列
var colOb = [[]];       //弾の物理判定を保持する配列
var bomOb = [[]];       //爆弾の情報を保持する配列
var bullets = [];       //各戦車の弾数の制御用の配列
var boms = [];          //各戦車の爆弾設置制御用の配列
var bulStack = [];      //弾の状態を判定する配列
var fireFlgs = [];      //敵の砲撃制御
var deadFlgs = [];      //戦車の生存確認
var entVal = 0;             //戦車の連番設定用変数
var addBullet = 0;          //難易度ごとの弾追加数
var addSpeed = 0;           //難易度ごとの移動速度
var deleteFlg = false;
var enemyTarget = [];   //敵戦車が狙うターゲット

var userName = "Player";

/* 各戦車の迎撃判定
    プレイヤー,自身,他戦車 */
var cateFlgs = [
    [true,false,false], //brown
    [true,false,false], //gray
    [true,true,true],  //green
    [true,false,false], //red
    [true,true,true],   //lightgreen
    [true,true,true],   //elitegray
    [true,true,true],   //snow
    [true,true,true],   //elitegreen
    [true,true,false],  //sand
    [true,false,false], //pink
    [true,false,false], //random
    [true,true,true]    //dazzle
]
/* 各戦車の守備範囲
    プレイヤー,自身,他戦車 */
var cateRanges = [
    [200,0,0],      //brown
    [200,0,0],      //gray
    [400,200,150],    //green
    [200,0,0],      //red
    [300,200,250],  //lightgreen
    [300,250,200],  //elitegray
    [400,300,200],  //snow
    [400,300,250],  //elitegreen
    [300,250,0],    //sand
    [500,0,0],      //pink
    [200,0,0],      //random
    [300,300,300]   //dazzle
]
var cateEscapes = [
    [false,0,0,0],  //brown
    [true,300,0,0],  //gray
    [true,300,180,120], //green
    [false,0,0,0],  //red
    [true,200,0,0],  //lightgreen
    [true,280,230,180], //elitegray
    [true,200,0,180], //snow
    [true,200,0,200], //elitegreen
    [false,0,0,0],  //sand
    [false,0,0,0],  //pink
    [false,0,0,0],  //random
    [true,190,0,200]  //dazzle
]
var cateDistances = [
    0,    //brown
    0,    //gray
    400,  //green
    0,    //red
    150,  //lightgreen
    200,  //elitegray
    400,  //snow
    300,  //elitegreen
    150,  //sand
    0,    //pink
    200,  //random
    300   //dazzle
]
var cateReloadTimes = [
    60,    //brown
    120,    //gray
    120,  //green
    240,    //red
    300,  //lightgreen
    180,  //elitegray
    600,  //snow
    180,  //elitegreen
    360,  //sand
    240,    //pink
    120,  //random
    30   //dazzle
]
var cateMaxBullets = [
    1,    //brown
    2,    //gray
    1,  //green
    8,    //red
    4,  //lightgreen
    4,  //elitegray
    3,  //snow
    3,  //elitegreen
    2,  //sand
    4,    //pink
    0,  //random
    0   //dazzle
]

var tankColorCounts = [0,0,0,0,0,0,0,0,0,0,0,0];    //配色ごとの敵戦車残数格納配列

var worldFlg = false;   //ゲームのon/off制御ボタン
var victory = false;    //勝利判定
var defeat = false;     //敗北判定
var complete = false;   //攻略完了判定
var pauseFlg = false;   //一時停止判定
var titleFlg = false;

var stageNum = 1;           //ステージ番号
var BGMs = [                //bgm指定用配列
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
var BNum = 0;       //現在のbgmの番号変数

var colors = [0,0,0,0,0,0,0,0,0,0,0,0];         //戦車の色を数える配列
var colorsName = [                              //各戦車の表示名格納配列
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
let fontColor = [                               //各戦車の表示色格納配列
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

var terminal = false;

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

let inputManager;

//設定用
const Config = {
    //画面の解像度
    Screen: {
    Width: pixelSize*stage_w,//幅
    Height: pixelSize*stage_h,//高さ
    BackGroundColor: 0x444444,//背景色
    },
    Keys: { //キーボード入力
    Up: "w",
    Right: "d",
    Down: "s",
    Left: "a",
    A: "Space",
    B: "q",
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
        switch(e.key){
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
        switch(e.key){
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
      let direction = 0;//初期化
      if(this.input.keys.Up){
          direction += this.keyDirections.UP;
      }
      if(this.input.keys.Right){
        direction += this.keyDirections.RIGHT;
      }
      if(this.input.keys.Down){
        direction += this.keyDirections.DOWN;
      }
      if(this.input.keys.Left){
        direction += this.keyDirections.LEFT;
      }
      return direction;
    }
  
    //ボタンの入力状態をチェックして返す
    checkButton(key) {
      if(this.input.keys[key]){
        if(this.input.keysPrev[key] == false){
          this.input.keysPrev[key] = true;
          return this.keyStatus.DOWN;//押されたとき
        }
        return this.keyStatus.HOLD;//押しっぱなし
      }else{
        if(this.input.keysPrev[key] == true){
          this.input.keysPrev[key] = false;
          return this.keyStatus.RELEASE;//ボタンを離した時
        }
        return this.keyStatus.UNDOWN;//押されていない
      }
    }
  }
  
  /******************************************************
   * バーチャルパッド
   ******************************************************/
  class Vpad {
    constructor(input){
      this.input = input;//InputManagerのinput
      this.resizePad();
      // リサイズイベントの登録
      window.addEventListener('resize', ()=>{this.resizePad();});
    }
    //画面サイズが変わるたびにvpadも作り変える
    resizePad(){
      let styleDisplay = "block";//ゲームパッド対策
      //すでにあれば一度削除する
      if(this.pad != undefined){
        styleDisplay = this.pad.style.display;//ゲームパッド対策
        while(this.pad.firstChild){
          this.pad.removeChild(this.pad.firstChild);
        }
        this.pad.parentNode.removeChild(this.pad);
      }
  
      //HTMLのdivでvpad作成
      const pad = document.createElement('div');
      document.body.appendChild(pad);
      this.pad = pad;
      pad.id = "pad";
      pad.style.width = pixelSize*stage_w/2;
      pad.style.display = styleDisplay;
      
      //タッチで拡大とか起こるのを防ぐ
      pad.addEventListener("touchstart", (e) => {
        e.preventDefault();
      });
      pad.addEventListener("touchmove", (e) => {
        e.preventDefault();
      });
  
      //横長の場合位置変更
      if(window.innerWidth > window.innerHeight){
        pad.style.width = `${window.innerWidth}px`;
        pad.style.position = "absolute";//画面の上にかぶせるため
        pad.style.backgroundColor = "transparent";//透明
        pad.style.bottom = "0px";//下に固定
      }
      const height = Number(pixelSize*stage_h/2.65) * 0.5;//ゲーム画面の半分の高さをゲームパッドの高さに
      pad.style.height = `${height}px`;
      
      //方向キー作成
      new DirKey(this.pad, this.input, height);
      
      //Aボタン作成
      let style = {
        width: `${height * 0.5}px`,
        height: `${height * 0.5}px`,
        right: `${height * 0.5}px`,
        top: `${height * 0.4}px`,
        borderRadius: "50%"
      }
      new ActBtn(this.pad, this.input, "A", "A", style);
  
      //Bボタン作成
      style = {
        width: `${height * 0.5}px`,
        height: `${height * 0.5}px`,
        right: `${height * 0.05}px`,
        top: `${height * 0.1}px`,
        borderRadius: "50%"
      }
      new ActBtn(this.pad, this.input, "B", "B", style);
  
      //STARTボタン作成
      style = {
        width: `${height * 0.3}px`,
        height: `${height * 0.15}px`,
        right: `${height * 0.65}px`,
        top: `${height * 0.05}px`,
        borderRadius: `${height * 0.15 * 0.5}px`
      }
      new ActBtn(this.pad, this.input, "Start", "START", style);
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
      this.maxRadius = padHeight * 0.15;//中心移動させる半径
      this.emptySpace = padHeight * 0.05;//あそび
  
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
        if(!this.isTouching) return;
        dirReset();//からなず一度リセット
        
        //タッチ位置を取得
        const posX = e.targetTouches[0].clientX;
        const posY = e.targetTouches[0].clientY;
  
        //原点からの移動量を計算
        let vecY = posY - this.originY;
        let vecX = posX - this.originX;
        let vec = Math.sqrt(vecX * vecX + vecY * vecY);
        if(vec < this.emptySpace)return;//移動が少ない時は反応しない(遊び)
  
        const rad = Math.atan2(posY - this.originY, posX - this.originX);
        const y = Math.sin(rad);
        const x = Math.cos(rad);
  
        //移動幅が大きいときは中心を移動させる
        if(vec > this.maxRadius){
          this.originX = posX - x * this.maxRadius;
          this.originY = posY - y * this.maxRadius;
        }
       
        const abs_x = Math.abs(x);
        const abs_y = Math.abs(y);
        if(abs_x > abs_y){//xの方が大きい場合左右移動となる
          if(x < 0){//マイナスであれば左
            input.keys.Left = true;
          }else{
            input.keys.Right = true;
          }
          if(abs_x <= abs_y * 2){//2yがxより大きい場合斜め入力と判断
            if(y < 0){//マイナスであれば上
              input.keys.Up = true;
            }else{
              input.keys.Down = true;
            }
          }
        }else{//yの方が大きい場合上下移動となる
          if(y < 0){//マイナスであれば上
            input.keys.Up = true;
          }else{
            input.keys.Down = true;
          }
          if(abs_y <= abs_x * 2){//2xがyより大きい場合斜め入力と判断
            if(x < 0){//マイナスであれば左
              input.keys.Left = true;
            }else{
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
  
      //ボタン名を表示
      const p = document.createElement('p');
      p.innerHTML = name;
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
    const game = new Game(pixelSize*stage_w,pixelSize*stage_h);
    inputManager = new InputManager();
    game.fps = 120;      //画面の更新頻度
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
            this.y = y*pixelSize-base;
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
            this.x = x+((base/2)*val);
            this.y = y+((base/2)*val);
            scene.addChild(this);
        }
    });
    /* 不可視の壁（敵専用） */
    var Avoid = Class.create(Sprite, {
        initialize: function(x,y,scene) {
            Sprite.call(this, pixelSize/2, pixelSize/2);
            //this.backgroundColor = "#fdda";
            this.x = x*pixelSize+(4*4);
            this.y = y*pixelSize-(3*2);
            
            scene.addChild(this);
        }
    });
    /* 障害物の当たり判定クラス群 */
    var ObsTop = Class.create(Sprite, {
        initialize: function(target,num,scene) {
            Sprite.call(this,target.width-4,2);
            //this.backgroundColor = "white";
            this.x = target.x+2;
            this.y = target.y-1;
            obsChk[num][0] = true
            this.onenterframe = function(){
                for(let i = 0; i < obsdir.length; i++){
                    if(i != num){
                        if(this.intersect(obsdir[i][1])==true){
                            obsChk[num][0]=false;
                            obsChk[i][1]=false;
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
        initialize: function(target,num,scene) {
            Sprite.call(this,target.width-4,2);
            //this.backgroundColor = "blue";
            this.x = target.x+2;
            this.y = target.y+target.height-1;
            obsChk[num][1] = true
            scene.addChild(this);
        }
    });
    var ObsLeft = Class.create(Sprite, {
        initialize: function(target,num,scene) {
            Sprite.call(this,2,target.height-4);
            //this.backgroundColor = "green";
            this.x = target.x-1;
            this.y = target.y+2;
            obsChk[num][2] = true
            this.onenterframe = function(){
                for(let i = 0; i < obsdir.length; i++){
                    if(i != num){
                        if(this.intersect(obsdir[i][3])==true){
                            obsChk[num][2]=false;
                            obsChk[i][3]=false;
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
        initialize: function(target,num,scene) {
            Sprite.call(this,2,target.height-4);
            //this.backgroundColor = "red";
            this.x = target.x+target.width-1;
            this.y = target.y+2;
            obsChk[num][3] = true
            scene.addChild(this);
        }
    });
    /* 当たり判定生成処理 */
    function Obstracle(target,scene){
        obsdir[obsNum]=[]
        obsChk[obsNum]=[false,false,false,false]
        obsdir[obsNum][0]=new ObsTop(target,obsNum,scene)
        obsdir[obsNum][1]=new ObsBottom(target,obsNum,scene)
        obsdir[obsNum][2]=new ObsLeft(target,obsNum,scene)
        obsdir[obsNum][3]=new ObsRight(target,obsNum,scene)
        obsNum++;
    }
    /* 照準反射クラス群 */
    var RefTop = Class.create(Sprite, {
        initialize: function(target,num,scene) {
            Sprite.call(this,target.width-6,8);
            //this.backgroundColor = "white";
            this.x = target.x+(this.height/2);
            this.y = target.y-1;
            refChk[num][0] = true
            this.onenterframe = function(){
                for(let i = 0; i < refdir.length; i++){
                    if(i != num){
                        if(this.intersect(refdir[i][1])==true){
                            refChk[num][0]=false;
                            refChk[i][1]=false;
                            scene.removeChild(this);
                            scene.removeChild(refdir[i][1])
                        }
                    }
                }
            }
            scene.addChild(this);
        }
    });
    var RefBottom = Class.create(Sprite, {
        initialize: function(target,num,scene) {
            Sprite.call(this,target.width-6,8);
            //this.backgroundColor = "blue";
            this.x = target.x+(this.height/2);
            this.y = target.y+target.height-(this.height-1);
            refChk[num][1] = true
            scene.addChild(this);
        }
    });
    var RefLeft = Class.create(Sprite, {
        initialize: function(target,num,scene) {
            Sprite.call(this,8,target.height);
            //this.backgroundColor = "green";
            this.x = target.x-1;
            this.y = target.y;
            refChk[num][2] = true
            this.onenterframe = function(){
                for(let i = 0; i < refdir.length; i++){
                    if(i != num){
                        if(this.intersect(refdir[i][3])==true){
                            refChk[num][2]=false;
                            refChk[i][3]=false;
                            scene.removeChild(this);
                            scene.removeChild(refdir[i][3])
                        }
                    }
                }
            }
            scene.addChild(this);
        }
    });
    var RefRight = Class.create(Sprite, {
        initialize: function(target,num,scene) {
            Sprite.call(this,8,target.height);
            //this.backgroundColor = "red";
            this.x = target.x+target.width-(this.width-1);
            this.y = target.y;
            refChk[num][3] = true
            scene.addChild(this);
        }
    });
    /* 当たり判定生成処理 */
    function RefObstracle(target,scene){
        refdir[refNum]=[]
        refChk[refNum]=[false,false,false,false]
        refdir[refNum][0]=new RefTop(target,refNum,scene)
        refdir[refNum][1]=new RefBottom(target,refNum,scene)
        refdir[refNum][2]=new RefLeft(target,refNum,scene)
        refdir[refNum][3]=new RefRight(target,refNum,scene)
        refNum++;
    }
    /* 戦車同士の当たり判定クラス群 */
    var TankTop = Class.create(Sprite, {
        initialize: function(target,num,scene) {
            Sprite.call(this,pixelSize-12,2);
            //this.backgroundColor = "white";
            this.x = target.x+4;
            this.y = target.y-1;
            this.onenterframe = function(){
                if(deadFlgs[num]==true){
                    scene.removeChild(this);
                }
                this.x = target.x+4;
                this.y = target.y-1;
            }
            scene.addChild(this);
        }
    });
    var TankBottom = Class.create(Sprite, {
        initialize: function(target,num,scene) {
            Sprite.call(this,pixelSize-12,2);
            //this.backgroundColor = "blue";
            this.x = target.x+4;
            this.y = target.y+60-2;
            this.onenterframe = function(){
                if(deadFlgs[num]==true){
                    scene.removeChild(this);
                }
                this.x = target.x+4;
                this.y = target.y+60-2;
            }
            scene.addChild(this);
        }
    });
    var TankLeft = Class.create(Sprite, {
        initialize: function(target,num,scene) {
            Sprite.call(this,2,pixelSize-12);
            //this.backgroundColor = "green";
            this.x = target.x;
            this.y = target.y+4;
            this.onenterframe = function(){
                if(deadFlgs[num]==true){
                    scene.removeChild(this);
                }
                this.x = target.x;
                this.y = target.y+4;
            }
            scene.addChild(this);
        }
    });
    var TankRight = Class.create(Sprite, {
        initialize: function(target,num,scene) {
            Sprite.call(this,2,pixelSize-12);
            //this.backgroundColor = "red";
            this.x = target.x+60-1;
            this.y = target.y+4;
            this.onenterframe = function(){
                if(deadFlgs[num]==true){
                    scene.removeChild(this);
                }
                this.x = target.x+60-1;
                this.y = target.y+4;
            }
            scene.addChild(this);
        }
    });
    /* 戦車の当たり判定生成処理 */
    function TankFrame(target,num,scene){
        tankDir[num]=[]
        tankDir[num][0]=new TankTop(target,num,scene)
        tankDir[num][1]=new TankBottom(target,num,scene)
        tankDir[num][2]=new TankLeft(target,num,scene)
        tankDir[num][3]=new TankRight(target,num,scene)
    }
    
    /* カーソル描画クラス */
    var Cursor = Class.create(Sprite,{
        initialize: function(scene){
            Sprite.call(this,base,base);
            this.backgroundColor = "#6af8"
            this.moveTo(0,0)
            this.onenterframe = function(){
                if(deleteFlg == true) scene.removeChild(this);
            }
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
        initialize: function(area,num,scene) {
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
            scene.addChild(this);
            //scene.insertBefore(this,filterMap);
        }
    });
    /* 撃破後の描画クラス */
    var Mark = Class.create(Sprite, {
        initialize: function(ax,ay,target,scene) {
            Sprite.call(this,base*(size/1.3),base*(size/1.3));
            this.image = game.assets['./image/ObjectImage/mark.png']
            this.moveTo(ax+9.25,ay+8.5)
            this.scaleY = 0.8;
            scene.insertBefore(this,target);
        }
    });
    /* 照準クラス */
    var Aim = Class.create(Sprite,{
        initialize: function(target,cannon,shotSpeed,num,scene){
            Sprite.call(this,base/2,base/2);
            if(num == 0) 
            this.backgroundColor = "#aff4"
            this.moveTo(cannon.x+(cannon.width/2)-3.45,cannon.y+(cannon.height/2)-4.5)
            const vector = {
                x: (target.x+target.width/2) - (cannon.x+cannon.width/2),
                y: (target.y+target.height/2) - (cannon.y+cannon.height/2)
            };
            var rad = Math.atan2(vector.y, vector.x);
            var dx = Math.cos(rad) * shotSpeed;
            var dy = Math.sin(rad) * shotSpeed;
            this.moveTo(this.x+(base*4)*Math.cos(rad), this.y+(base*4)*Math.sin(rad));
            cannon.rotation = (270+(Math.atan2(Math.cos(rad), Math.sin(rad)) * 180) / Math.PI)*-1;
            this.rotation = (315+(Math.atan2(dx, dy) * 180) / Math.PI)*-1;
            this.onenterframe = function(){
                this.rotation = (315+(Math.atan2(dx,dy) * 180) / Math.PI)*-1;
                this.x += dx
                this.y += dy
            }
            scene.addChild(this);
        }
    })
    var AnotherAim = Class.create(Sprite,{
        initialize: function(target,cannon,ref,num,scene){
            Sprite.call(this,8,8);
            //this.backgroundColor = "#f00";
            this.moveTo(cannon.x+(cannon.width/2)-5.2,cannon.y+(cannon.height/2)-5.2)
            this.time = 0;
            var rad = (cannon.rotation) * (Math.PI / 180.0);
            var dx = Math.cos(rad) * 24;
            var dy = Math.sin(rad) * 24;
            this.moveTo(this.x+(base*3)*Math.cos(rad), this.y+(base*3)*Math.sin(rad));
            //this.moveTo(this.x+(base*3)*Math.cos(rad), this.y+(base*3)*Math.sin(rad));
            let refcnt = 0;
            let agl = cannon.rotation;
            let tgt = [cannon.x+(cannon.width/2)+(dx*3),cannon.y+(cannon.height/2)+(dy*3)];
            this.rotation = (315+(Math.atan2(dx, dy) * 180) / Math.PI)*-1;
            this.onenterframe = function(){
                this.time++;
                
                this.x += dx
                this.y += dy
                this.rotation = (315+(Math.atan2(dx, dy) * 180) / Math.PI)*-1;
                for(let i = 0; i < refdir.length; i++){
                    if(this.intersect(refdir[i][0])==true){
                        if(refcnt == 0){
                            target.moveTo(this.x-(this.width),floors[i].y-(this.height/2));
                            tgt[0] = this.x-(this.width);
                            tgt[1] = floors[i].y-(this.height/2);
                        }
                        this.moveTo(this.x+(this.width/2),floors[i].y-8);
                        dy = dy*-1;
                        refcnt++;
                    }
                    if(this.intersect(refdir[i][1])==true){
                        if(refcnt == 0){
                            target.moveTo(this.x-(this.width),floors[i].y+floors[i].height+(this.height/2));
                            tgt[0] = this.x-(this.width);
                            tgt[1] = floors[i].y+floors[i].height+(this.height/2);
                        }
                        this.moveTo(this.x-(this.width)+8,floors[i].y+floors[i].height+4)
                        dy = dy*-1;
                        refcnt++;
                    }
                    
                    if(this.intersect(refdir[i][2])==true){
                        if(refcnt == 0){
                            target.moveTo(floors[i].x-(this.width/2),this.y-(this.height));
                            tgt[0] = floors[i].x-(this.width/2)
                            tgt[1] = this.y-(this.height);
                        }
                        this.moveTo(floors[i].x-12,this.y)
                        dx = dx*-1;
                        refcnt++;
                    }
                    if(this.intersect(refdir[i][3])==true){
                        if(refcnt == 0){
                            target.moveTo(floors[i].x+floors[i].width,this.y-(this.height));
                            tgt[0] = floors[i].x+floors[i].width;
                            tgt[1] = this.y-(this.height);
                        }
                        this.moveTo(floors[i].x+floors[i].width+4,this.y)
                        dx = dx*-1;
                        refcnt++;
                    }
                }
                if(this.intersect(walls[0])==true){
                    if(refcnt == 0){
                        target.moveTo(this.x-(this.width),walls[0].y+walls[0].height+(this.height/2));
                        tgt[0] = this.x-(this.width);
                        tgt[1] = walls[0].y+walls[0].height+(this.height/2);
                    } 
                    this.moveTo(this.x-(this.width),walls[0].y+walls[0].height+4)
                    dy = dy*-1;
                    refcnt++;
                }
                if(this.intersect(walls[1])==true){
                    if(refcnt == 0){
                        target.moveTo(this.x-(this.width),walls[1].y-(this.height/2));
                        tgt[0] = this.x-(this.width);
                        tgt[1] = walls[1].y-(this.height/2);
                    } 
                    this.moveTo(this.x-(this.width),walls[1].y-8)
                    dy = dy*-1;
                    refcnt++;
                }
                
                if(this.intersect(walls[2])==true){
                    if(refcnt == 0){
                        target.moveTo(walls[2].x+walls[2].width+(this.width/2),this.y-(this.height));
                        tgt[0] = walls[2].x+walls[2].width+(this.width/2);
                        tgt[1] = this.y-(this.height);
                    }
                    this.moveTo(walls[2].x+walls[2].width+8,this.y-(this.height)+4)
                    dx = dx*-1;
                    refcnt++;
                }
                if(this.intersect(walls[3])==true){
                    if(refcnt == 0){
                        target.moveTo(walls[3].x-(this.width/2),this.y-(this.height));
                        tgt[0] = walls[3].x-(this.width/2);
                        tgt[1] = this.y-(this.height);
                    }
                    this.moveTo(walls[3].x-8,this.y)
                    dx = dx*-1;
                    refcnt++;
                }
                
                this.intersect(Player).forEach(function(){
                    
                    if(fireFlgs[num]==false){
                        cannon.rotation = agl;
                        target.moveTo(tgt[0],tgt[1])
                    } 
                })
                if(this.intersect(tankEntity[num])==true){
                    scene.removeChild(this);
                }
                if(this.time > 180) scene.removeChild(this);
                if(refcnt > ref) scene.removeChild(this)
                
            }
            scene.addChild(this);
        }
    })
    /* 照準クラス */
    var AnotherPoint = Class.create(Sprite,{
        initialize: function(target,num,scene){
            Sprite.call(this,2,2);
            //this.backgroundColor = "blue";
            //this.rotation = 45;
            this.moveTo(target.x+(target.width/2),target.y+(target.height/2))
            this.time = 0;
            scene.addChild(this);
        }
    })
    /* 弾の弾道クラス */
    var BulAim = Class.create(Sprite,{
        initialize: function(target,shotSpeed,num,value,scene){
            Sprite.call(this,base/2,base/2);
            //this.backgroundColor = "#aff8"
            this.moveTo(target.x,target.y)
            this.time = 0;
            var rad = (target.rotation-90) * (Math.PI / 180.0);
            var dx = Math.cos(rad) * shotSpeed;
            var dy = Math.sin(rad) * shotSpeed;

            this.onenterframe = function(){
                if(deleteFlg == true) scene.removeChild(this);
                this.x += dx
                this.y += dy
                if(bulStack[num][value]==false) scene.removeChild(this)
            }
            scene.addChild(this);
        }
    })
    /* プレイヤーの弾の弾道クラス */
    var PlayerBulAim = Class.create(Sprite,{
        initialize: function(target,shotSpeed,num,value,scene){
            Sprite.call(this,base/2,base/2);
            //this.backgroundColor = "#aff8"
            this.moveTo(target.x,target.y)
            this.time = 0;
            var rad = (target.rotation-90) * (Math.PI / 180.0);
            var dx = Math.cos(rad) * (shotSpeed*1.5);
            var dy = Math.sin(rad) * (shotSpeed*1.5);

            this.onenterframe = function(){
                if(deleteFlg == true) scene.removeChild(this);
                this.x += dx
                this.y += dy
                if(bulStack[num][value]==false) scene.removeChild(this)
            }
            scene.addChild(this);
        }
    })
    /* 弾丸の物理判定クラス */
    var BulletCol = Class.create(PhyCircleSprite,{
        initialize: function(target,cannon,shotSpeed,grade,num,scene,value){
            PhyCircleSprite.call(this, 2.5, enchant.box2d.DYNAMIC_SPRITE, 0.0, 0.0, 1.0, true)
            //this.backgroundColor = "blue"
            this.time = 0;
            let random0 = 0;
            let random1 = 0;
            if(grade == 10){
                random0 = (Math.floor( Math.random() * 15)-7.5)/2;
                random1 = (Math.floor( Math.random() * 15)-7.5)/2;
            }else if(grade == 11 || grade == 5){
                random0 = (Math.floor( Math.random() * 40)-20)/2;
                random1 = (Math.floor( Math.random() * 40)-20)/2;
            }else if(grade == 6){
                random0 = (Math.floor( Math.random() * 60)-30)/2;
                random1 = (Math.floor( Math.random() * 60)-30)/2;
            }else if(grade >= 2){
                random0 = (Math.floor( Math.random() * 30)-15)/2;
                random1 = (Math.floor( Math.random() * 30)-15)/2;
            }
            this.moveTo(cannon.x+(cannon.width/2)-2.25,cannon.y+(cannon.height/2)-3)
            var rad = (cannon.rotation+(random0+random1)) * (Math.PI / 180.0);
            this.moveTo(this.x+(base*3.2)*Math.cos(rad), this.y+(base*3.2)*Math.sin(rad));
            this.applyImpulse(new b2Vec2(Math.cos(rad) * (shotSpeed*2), Math.sin(rad) * (shotSpeed*2)));

            this.onenterframe = function(){
                this.time++
                if(this.time % 10 == 0) new Smoke(this,scene)
                if(this.time > 1){
                    if(this.intersect(Bullet)==false){
                        if(bullets[num]>0) bullets[num]--;
                        this.moveTo(-100,-100)
                        this.destroy()
                        bulStack[num][value] = false;
                        scene.removeChild(this);
                    }
                }
            }
        }
    })
    /* 弾丸クラス */
    var Bullet = Class.create(Sprite,{
        initialize: function(target,cannon,ref,num,max,shotSpeed,scene,value){
            Sprite.call(this,12,18);
            this.image = game.assets['./image/ObjectImage/R2.png'];
            
            this.time = 0;
            this.opacity = 0

            var rcnt = 0;       //反射回数計測
            var rcnt2 = 0;      //反射時の効果音制御変数
            var rflg = false;   //反射フラグ
            let timeCnt = 0;
            if(shotSpeed>=12){
                this.scaleY = 1.25;
            }
           
            this.moveTo(target.centerX-(this.width/2),target.centerY-(target.height/2 + this.height/3))
            this.onenterframe = function(){
                if(deleteFlg == true) scene.removeChild(this);
                if(num != 0){
                    new BulAim(this,32,num,value,scene)
                }else{
                    new PlayerBulAim(this,32,num,value,scene)
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
                if(rflg == true){
                    timeCnt++;
                    let judge = [false,false]
                    floors.forEach(elem=>{
                        if(this.intersect(elem)==true) judge[0] = true
                    })
                    walls.forEach(elem=>{
                        if(this.intersect(elem)==true) judge[1] = true
                    })
                    if((judge[0]==true || judge[1]==true)&& timeCnt >= 30){
                        rflg = false;
                        timeCnt = 0;
                    }  
                    if(judge[0] == false && judge[1] == false){
                        rflg = false;
                        timeCnt = 0;
                    } 
                    
                }
                
                if(rcnt > ref){
                    new TouchFire(this,scene);
                    target.moveTo(-100,-100)
                    target.destroy()
                    game.assets['./sound/Sample_0000.wav'].clone().play();
                    //game.assets['./sound/Sample_0004.wav'].clone().play();
                    scene.removeChild(target);
                }
                if(this.intersect(target)==false){
                    bullets[num]--;
                    game.assets['./sound/Sample_0000.wav'].clone().play();
                    //game.assets['./sound/Sample_0004.wav'].clone().play();
                    this.moveTo(-100,-100)
                    bulStack[num][value] = false;
                    scene.removeChild(this);
                }
                for(var i = 0;  i < max;  i++){
                    for(var j = 0; j < max; j++){
                        if (bulOb[num][i].intersect(bulOb[num][j])==true&&i != j) {
                            if(bulStack[num][i] == true && bulStack[num][j]==true){
                                game.assets['./sound/Sample_0000.wav'].clone().play();
                               // game.assets['./sound/Sample_0004.wav'].clone().play();
                                new TouchFire(bulOb[num][i],scene);
                                new TouchFire(bulOb[num][j],scene);
                                scene.removeChild(bulOb[num][i]);
                                scene.removeChild(bulOb[num][j]);
                                bulOb[num][i]=new Bullet(target,cannon,1,num,max,scene,i);
                                bulStack[num][i] = false;
                                bulOb[num][j]=new Bullet(target,cannon,1,num,max,scene,j);
                                bulStack[num][j] = false;
                            }
                            
                        }
                    }
                    for(var j = 0; j < bulOb.length; j++){
                        for(var k = 0; k < bulOb[j].length; k++){
                            if(j != num){
                                if (bulOb[num][i].intersect(bulOb[j][k])==true) {
                                    if(bulStack[num][i] == true && bulStack[j][k]==true){
                                        game.assets['./sound/Sample_0000.wav'].clone().play();
                                        //game.assets['./sound/Sample_0004.wav'].clone().play();
                                        new TouchFire(bulOb[num][i],scene);
                                        new TouchFire(bulOb[j][k],scene);
                                        scene.removeChild(bulOb[num][i]);
                                        scene.removeChild(bulOb[j][k]);
                                        bulOb[num][i]=new Bullet(target,cannon,1,num,max,scene,i);
                                        bulStack[num][i] = false;
                                        bulOb[j][k]=new Bullet(target,cannon,1,j,max,scene,k);
                                        bulStack[j][k] = false;
                                    }
                                    
                                }
                            }
                            
                        }
                    }
                }
                if(rcnt != rcnt2 && rcnt <= ref){
                    game.assets['./sound/s_car_trunk_O.wav'].clone().play();
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
                if(deleteFlg == true) scene.removeChild(this);
                this.time++
                this.intersect(BombExplosion).forEach(function(){
                    if(victory == false && defeat == false){
                        new BombExplosion(bomb,num,scene)
                        bomb.moveTo(-900,-900)
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
                        if(this.time % 6 == 0){
                            game.assets['./sound/Sample_0010.wav'].clone().play();
                        }
                        if(this.time == 45){
                            new BombExplosion(this,num,scene)
                            this.moveTo(-900,-900)
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
                            colOb[i][j] = new BulletCol(cur,floors[0],0,0,i,scene,j);
                            bulOb[i][j] = new Bullet(colOb[i][j],floors[0],0,i,0,0,scene,j);
                            bulStack[i][j] = false;
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
                if(deleteFlg == true) scene.removeChild(this);
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
                if(deleteFlg == true) scene.removeChild(this);
                this.time++
                this.rotation = area.rotation
                value -= 0.1;
                this.opacity = value;
                this.rotation = area.rotation
                if(value < 0) scene.removeChild(this);
            }
            scene.addChild(this);
            //scene.insertBefore(this,area);
        }
    })
    /* 着弾描画クラス */
    var TouchFire = Class.create(Sprite,{
        initialize: function(area,scene){
            Sprite.call(this,24,24);
            this.opacity = 0;
            this.backgroundColor = "#f30";
            this.time = 0;
            this.moveTo(area.x,area.y);

            const vector = {
                x: area.x-6 - this.x,
                y: area.y-4 - this.y
            };

            this.rad = Math.atan2(vector.y, vector.x);
            this.moveTo(this.x+6*Math.cos(this.rad), this.y+9*Math.sin(this.rad));
            let value = 0.8;
            this.opacity = value;
            
            this.onenterframe = function(){
                if(deleteFlg == true) scene.removeChild(this);
                this.time++
                value -= 0.1;
                this.opacity = value;
                this.rotation = area.rotation+this.time
                if(value < 0) scene.removeChild(this);
            }
            scene.insertBefore(this,area);
        }
    })
    /* 発砲描画クラス */
    var OpenFire = Class.create(Sprite,{
        initialize: function(area,target,scene,filterMap){
            Sprite.call(this,24,24);
            this.backgroundColor = "#f40";
            this.time = 0;
            this.moveTo(area.x+62,area.y+24);

            const vector = {
                x: this.x+6.5 - target.x,
                y: this.y+3 - target.y
            };

            this.rad = Math.atan2(vector.y, vector.x);
            this.moveTo(area.x+62+Math.cos(this.rad) * -40, area.y+24+Math.sin(this.rad) * -40);
            let value = 1.0;
            this.opacity = value;
            
            this.onenterframe = function(){
                if(deleteFlg == true) scene.removeChild(this);
                this.time++
                this.scaleX = 1 - (value/2);
                this.scaleY = 1 - (value/2);
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
    //  用途：主に弾の感知
    //1
    var Intercept420 = Class.create(Sprite,{
        initialize: function(area,scene){
            Sprite.call(this,420,420);
            //this.backgroundColor = "#0ff2";
            this.onenterframe = function(){
                if(deleteFlg == true) scene.removeChild(this);
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
                if(deleteFlg == true) scene.removeChild(this);
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
                if(deleteFlg == true) scene.removeChild(this);
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
                if(deleteFlg == true) scene.removeChild(this);
                this.moveTo(area.x-300+33.5,area.y-300+33.5);
            }
            scene.addChild(this);
        }
    })
    var Intercept96 = Class.create(Sprite,{
        initialize: function(area,scene){
            Sprite.call(this,96,96);
            //this.backgroundColor = "#0ff2";
            this.onenterframe = function(){
                if(deleteFlg == true) scene.removeChild(this);
                this.moveTo(area.x-48+32,area.y-48+30);
            }
            scene.addChild(this);
        }
    })
    var InterceptA = Class.create(Sprite, {
        initialize: function(cannon,scene) {
            Sprite.call(this, 240, 240);
            //this.backgroundColor = "#0f04";
            this.onenterframe = function(){
                if(deleteFlg == true) scene.removeChild(this);
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
                if(deleteFlg == true) scene.removeChild(this);
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
                if(deleteFlg == true) scene.removeChild(this);
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
                if(deleteFlg == true) scene.removeChild(this);
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
                if(deleteFlg == true) scene.removeChild(this);
                this.time++;
                this.rotation+= 45;
                if(this.time % 2 == 0){
                    value -= 0.05;
                    this.opacity = value;
                }
                if(value < 0) scene.removeChild(this);
            }
            scene.addChild(this);
        }
    })
    /* 爆破の描画クラス */
    var BombExplosion = Class.create(Sprite,{
        initialize: function(point,num,scene){
            Sprite.call(this,200,200,point);
            boms[num]-=1;
            this.backgroundColor = "red";
            this.time = 0;
            var value = 1.0;
            this.opacity = value;
            this.moveTo(point.x-78,point.y-78)
            this.onenterframe = function(){
                if(deleteFlg == true) scene.removeChild(this);
                this.time++;
                this.rotation+= 45;
                if(this.time % 2 == 0){
                    value -= 0.1;
                    this.opacity = value;
                }
                if(value < 0){
                    this.moveTo(-1000,-1000)
                    if(this.time > 20){
                        scene.removeChild(this);
                    } 
                }
                
            }
            scene.addChild(this);
            game.assets['./sound/mini_bomb2.mp3'].play();
        }
    })
    
    /* 敵が狙う対象を追いかけるクラス */
    var Target = Class.create(Sprite,{
        initialize: function(num,scene){
            Sprite.call(this,20,20);
            //this.backgroundColor = "#0f0a"
            let speed = 32;
            this.rotation = 90;
            let target,rad,dx,dy;
            let prediction = [0,0]
            this.moveTo(0,0)
            this.onenterframe = function(){
                if(deadFlgs[num] == true){
                    scene.removeChild(this);
                }
                target = enemyTarget[num]
                rad = (target.rotation) * (Math.PI / 180.0);
                dx = Math.cos(rad) * (target.width/2);
                dy = Math.sin(rad) * (target.height/2);
                prediction = [(target.x+target.width/2)+dx-(this.width/2),(target.y+target.height/2)+dy-(this.height/2)];
                this.rotation = (270+(Math.atan2(dx, dy) * 180) / Math.PI)*-1;
                if(this.intersect(target)==false){
                    var vector = {
                        x: target.x - this.x,
                        y: target.y - this.y
                    };
                    this.rad = Math.atan2(vector.y, vector.x);
                    this.moveTo(this.x + Math.cos(this.rad)*speed,this.y + Math.sin(this.rad)*speed)
                }else if(this.intersect(target)==true){
                    this.moveTo(prediction[0],prediction[1]);
                }
                
            }
            scene.addChild(this);
            /*Sprite.call(this,20,20);
            //this.backgroundColor = "#0f0a"
            let speed = 24;
            this.rotation = (45)
            let target;
            this.onenterframe = function(){
                if(deleteFlg == true) scene.removeChild(this);
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
            scene.addChild(this);*/
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
            //this.backgroundColor = "red"
            //  プレイヤーの初期位置設定
            this.x = x*pixelSize;
            this.y = y*pixelSize-16;

            var pmax = max;         //  最大弾数
            const Num = entVal;     //  戦車の番号を取得(tankEntityで使う)
            entVal++;               //  現在の戦車番号更新
            bullets[Num] = 0;       //  発射済み弾数カウントリセット
            boms[Num] = 0;          //  設置済み爆弾カウントリセット
            deadFlgs.push(false);   //  生存判定をセット
            
            //  戦車の各パーツ呼び出し
            const weak = new Weak(this,Num,scene)                       //  弱点
            const cannon = new Cannon(this,path2,Num,scene,filterMap)   //  砲塔
            const tank = new Tank(this,path1,Num,scene,cannon)          //  車体
            TankFrame(this,Num,scene)

            markEntity[Num] = null;

            var value = 0;          //角度制御変数
            var speed = moveSpeed;  //移動速度
            var rot = 0;            //車体の角度
            var bflg = false;       //爆弾設置フラグ
            var late = 0;           //発射頻度調整用
            var shotStopTime = 0; 
            var shotStopFlg = false;
            var life = 1;
            
            //  弾の初期状態を設定
            for(var i = 0; i < pmax; i++){
                colOb[Num][i] = new BulletCol(cur,floors[0],shotSpeed,0,Num,scene,i);
                bulOb[Num][i] = new Bullet(colOb[Num][i],floors[0],ref,Num,pmax,shotSpeed,scene,i);
                bulStack[Num][i] = false;   //  弾の状態をoff
                colOb[Num][i].moveTo(-210,-210)
                bulOb[Num][i].moveTo(-100,-100)
            }
            //  爆弾の初期状態を設定
            for(var i = 0; i < 2; i++){
                bomOb[Num][i] = new Bom(this,Num,scene);
            }

            if (screen.width > 844) {
                //  画面クリック時の砲撃処理
                scene.addEventListener('touchstart', function(){
                    if(worldFlg == true && scene.time > 210){   //  処理しても良い状態か
                        if(bullets[Num] < pmax && deadFlgs[Num] == false){  //  発射最大数に到達していないか＆死んでいないか
                            for(let i = 0; i < pmax; i++){
                                if(bulStack[Num][i] == false){                                                          //  弾の状態がoffならば
                                    game.assets['./sound/s_car_door_O2.wav'].clone().play();                            //  発射音再生
                                    colOb[Num][i] = new BulletCol(cur,cannon,shotSpeed,0,Num,scene,i);                  //  弾の物理制御をセット
                                    bulOb[Num][i] = new Bullet(colOb[Num][i],cannon,ref,Num,pmax,shotSpeed,scene,i)     //  弾の制御をセット
                                    scene.insertBefore(colOb[Num][i],filterMap);                                        //  フィールドに弾物理を生成
                                    scene.insertBefore(bulOb[Num][i],filterMap);                                        //  フィールドに弾を生成
                                    bullets[Num]++;                                                                     //  弾の発射済み個数を増やす
                                    bulStack[Num][i] = true;                                                            //  弾の状態をonにする
                                    new OpenFire(cannon,cur,scene,filterMap)                                            //  発砲エフェクト生成
                                    shotStopFlg = true;
                                    //scene.insertBefore(new AnotherBullet(cur,cannon,1,Num,pmax,16,scene,i),filterMap); 
                                    break;  
                                }
                            }
                            
                        }
                    }
                })
            }else{
                scene.addEventListener('touchstart', function(){
                    cur.x = (e.x);
                    cur.y = (e.y);
                })
            }
            //  常に稼働する処理
            this.onenterframe = function(){
                if(deleteFlg == true){
                    this.moveTo(-100,-100)          //  戦車を移動
                    //  各パーツと本体の消去
                    scene.removeChild(tank)
                    scene.removeChild(cannon)
                    scene.removeChild(weak)
                    scene.removeChild(this)
                }
                if(life > 0){

                    //  稼働しても良いなら
                    if(worldFlg == true){
                        if(shotStopFlg == true){
                            shotStopTime++;
                            if(shotStopTime > 10){
                                shotStopFlg = false;
                                shotStopTime = 0;
                            }
                        }
                        //  チートを使ってなければ死亡判定処理をする
                        if(cheat == false){
                            for(var j = 0; j < bulOb.length; j++){
                                for(var k = 0; k < bulOb[j].length; k++){
                                    if((tank.within(bulOb[j][k],25)==true || weak.intersect(bulOb[j][k])==true) &&
                                        defeat == false && victory == false && complete == false){
    
                                        game.assets['./sound/mini_bomb2.mp3'].clone().play();
                                        deadFlgs[Num] = true
                                        bulStack[j][k] = false;
                                        colOb[j][k].destroy()
                                        colOb[j][k].moveTo(-200,-200)
                                        bulOb[j][k].moveTo(-200,-200)
                                        moveSpeed = 0;
                                    }
                                }
                            }
                        }
                        //  死亡判定時の処理
                        if(deadFlgs[Num] == true){
                            //markEntity[Num] = new Mark(this.x,this.y,this,scene)   //  撃破後の物体設置
                            new Explosion(this,scene);      //  車体の爆破エフェクト生成
                            this.moveTo(-100,-100)          //  戦車を移動
                            zanki--;                        //  残機を減らす
                            life--;
                        }
                        if(scene.time > 210){
                            if(shotStopFlg == false){
                                switch(inputManager.checkDirection()){
                                    case inputManager.keyDirections.UP:
                                        value = 2;
                                        rot = 270;
                                        this.y -= speed;
                                        break;
                                    case inputManager.keyDirections.UP_RIGHT:
                                        value = 5;
                                        rot = 315
                                        this.x += speed/1.5;
                                        this.y -= speed/1.5;
                                        break;
                                    case inputManager.keyDirections.RIGHT:
                                        value = 1;
                                        rot = 0;
                                        this.x += speed;
                                        break;
                                    case inputManager.keyDirections.DOWN_RIGHT:
                                        value = 7;
                                        rot = 45
                                        this.x += speed/1.5;
                                        this.y += speed/1.5;
                                        break;
                                    case inputManager.keyDirections.DOWN:
                                        value = 3;
                                        rot = 90;
                                        this.y += speed;
                                        break;
                                    case inputManager.keyDirections.DOWN_LEFT:
                                        value = 6;
                                        rot = 135
                                        this.x -= speed/1.5;
                                        this.y += speed/1.5;
                                      break;
                                    case inputManager.keyDirections.LEFT:
                                        value = 0;
                                        rot = 180;
                                        this.x -= speed;
                                        break;
                                    case inputManager.keyDirections.UP_LEFT:
                                        value = 4;
                                        rot = 225
                                        this.x -= speed/1.5;
                                        this.y -= speed/1.5;
                                        break;
                                    default:
                                        break;
                                  }
                            }
                            
                          
                              if((inputManager.checkButton("A") == inputManager.keyStatus.DOWN || game.input.e) && late == 0 && worldFlg == true){
                                if(bullets[Num] < pmax && deadFlgs[Num] == false){  //  発射最大数に到達していないか＆死んでいないか
                                    for(let i = 0; i < pmax; i++){
                                        if(bulStack[Num][i] == false){                                                          //  弾の状態がoffならば
                                            game.assets['./sound/s_car_door_O2.wav'].clone().play();                            //  発射音再生
                                            colOb[Num][i] = new BulletCol(cur,cannon,shotSpeed,0,Num,scene,i);                  //  弾の物理制御をセット
                                            bulOb[Num][i] = new Bullet(colOb[Num][i],cannon,ref,Num,pmax,shotSpeed,scene,i)     //  弾の制御をセット
                                            scene.insertBefore(colOb[Num][i],filterMap);                                        //  フィールドに弾物理を生成
                                            scene.insertBefore(bulOb[Num][i],filterMap);                                        //  フィールドに弾を生成
                                            bullets[Num]++;                                                                     //  弾の発射済み個数を増やす
                                            bulStack[Num][i] = true;                                                            //  弾の状態をonにする
                                            new OpenFire(cannon,cur,scene,filterMap)                                            //  発砲エフェクト生成
                                            shotStopFlg = true;
                                            //scene.insertBefore(new AnotherBullet(cur,cannon,1,Num,pmax,16,scene,i),filterMap); 
                                            break;  
                                        }
                                    }
                                    
                                }
                              }
                              if((inputManager.checkButton("B") == inputManager.keyStatus.DOWN || game.input.q) && bflg == false && boms[Num]<2){
                                    game.assets['./sound/Sample_0009.wav'].clone().play();
                                    bomOb[Num][boms[Num]] = new Bom(this,Num,scene)
                                    scene.insertBefore(bomOb[Num][boms[Num]],tank);
                                    this.time = 0;
                                    bflg = true;
                                    boms[Num]++;
                              }
                              /*if(inputManager.checkButton("Start") == inputManager.keyStatus.DOWN){
                                    core.pushScene(new PauseScene());
                              }*/
                            
                            //  制限が掛かったら
                            if(late >= 1){
                                late++
                            }
                            //  一定の時間が経過したら
                            if(late == 10){
                                late = 0;   //  制限解除
                            }
                            
                            //  爆弾が設置された場合の処理
                            if(bflg == true){
                                this.time++
                                if(this.time > 60){     //  1秒後再設置可能にする
                                    bflg = false;
                                }
                            }
                            
                            //  死んでいなければ弾道予測の描画をする
                            if(deadFlgs[Num] == false) new Aim(cur,cannon,48,Num,scene)
                            
                        
                            /* 戦車本体の角度設定 */
                            this.rotation = rot;
                            tank.rotation = rot;
                            weak.rotation = rot;

                            for(let i = 1; i < tankDir.length; i++){
                                if(deadFlgs[i]==false){
                                    if(this.intersect(tankDir[i][0])==true){
                                        this.moveTo(this.x,tankDir[i][0].y-60)
                                    }
                                    if(this.intersect(tankDir[i][1])==true){
                                        this.moveTo(this.x,tankDir[i][1].y+(tankDir[i][1].height))
                                    }
                                    if(this.intersect(tankDir[i][2])==true){
                                        this.moveTo(tankDir[i][2].x-60,this.y)
                                    }
                                    if(this.intersect(tankDir[i][3])==true){
                                        this.moveTo(tankDir[i][3].x+(tankDir[i][3].width),this.y)
                                    }
                                }
                            }
                            for(let i = 0; i < obsdir.length; i++){
                                if(this.intersect(obsdir[i][0])==true && obsChk[i][0]==true){
                                    this.moveTo(this.x,obsdir[i][0].y-60)
                                }
                                if(this.intersect(obsdir[i][1])==true && obsChk[i][1]==true){
                                    this.moveTo(this.x,obsdir[i][1].y+(obsdir[i][1].height))
                                }
                                if(this.intersect(obsdir[i][2])==true && obsChk[i][2]==true){
                                    this.moveTo(obsdir[i][2].x-60,this.y)
                                }
                                if(this.intersect(obsdir[i][3])==true && obsChk[i][3]==true){
                                    this.moveTo(obsdir[i][3].x+(obsdir[i][3].width),this.y)
                                }
                            }
                            //  フィールドの壁に衝突した場合の処理
                            if(this.intersect(walls[0])==true){
                                this.moveTo(this.x,walls[0].y+walls[0].height)
                            }
                            if(this.intersect(walls[1])==true){
                                this.moveTo(this.x,walls[1].y-walls[1].height+2)
                            }
                            if(this.intersect(walls[2])==true){
                                this.moveTo(walls[2].x+walls[2].width,this.y)
                            }
                            if(this.intersect(walls[3])==true){
                                this.moveTo(walls[3].x-walls[3].width+2,this.y)
                            }
                        }
                        
                    }
                }
                
            }
            scene.insertBefore(this,tank)
        }
    });
    /* 敵(弱)クラス */
    var newAI = Class.create(Sprite,{
        initialize: function(x,y,tankPath,cannonPath,target,max,ref,shotSpeed,moveSpeed,fireLate,grade,category,scene,map,g,filterMap){
            Sprite.call(this,pixelSize-4,pixelSize-4);
            //  敵の初期位置設定
            this.x = x*pixelSize;
            this.y = y*pixelSize-16;

            this.time = 0;

            const Num = entVal;     //  戦車の番号設定
            entVal++;               //  現在の戦車番号更新
            bullets[Num] = 0;       //  弾の発射数リセット
            boms[Num] = 0;          //  爆弾設置数リセット
            deadFlgs.push(false)    //  生存判定をセット
            
            //  戦車の各パーツ生成
            const weak = new Weak(this,Num,scene)                           //  弱点生成
            const cannon = new Cannon(this,cannonPath,Num,scene,filterMap)  //  砲塔生成
            const tank = new Tank(this,tankPath,Num,scene,cannon)           //  車体生成
            TankFrame(this,Num,scene)
            
            markEntity[Num] = null;

            //  警戒範囲の生成
            const intercept = new Intercept96(this,scene);
            const intercept1 = new Intercept420(this,scene) //  直径420の警戒範囲生成
            const intercept3 = new Intercept192(this,scene) //  直径192の警戒範囲生成
            const intercept4 = new Intercept600(this,scene) //  直径600の警戒範囲生成
            const intercept8 = new InterceptF(cannon,scene) //  砲身の警戒範囲生成

            var moveCnt = 0     //  移動距離
            var grid = g;       //  マップの障害物配置情報
            var root;           //  移動ルート

            var myPath = [0,0]
            var targetPath = [0,0]

            let shotNGflg = false;
            let reloadFlg = false;
            let reloadTime = 0;

            let shotStopFlg = false;
            let shotStopTime = 0;

            let tankStopFlg = false;

            let life = 1;       //  命

            enemyTarget[Num] = target;                          //  この戦車の標的設定
            var alignment = new Target(Num,scene) //  ターゲットを追跡オブジェクト設定

            //  ステージ20以降のステータス強化処理
            if(stageNum > 20){
                shotSpeed = shotSpeed + (0.4*(stageNum / 20));
            }

            if(category == 2 && addBullet != 0){
                ref = ref+addBullet;
            }

            //  弾の初期設定
            for(var i = 0; i < max; i++){
                colOb[Num][i] = new BulletCol(alignment,cannon,shotSpeed,grade,Num,scene,i);
                bulOb[Num][i] = new Bullet(colOb[Num][i],cannon,ref,Num,max,shotSpeed,scene,i);
                bulStack[Num][i] = false;
                colOb[Num][i].moveTo(-220,-220)
                bulOb[Num][i].moveTo(-100,-100)
            }

            //  爆弾の初期設定
            bomOb[Num][0] = new Bom(this,Num,scene);

            //  独自の敵の照準処理
            var EnemyAim = Class.create(Aim,{   //  Aimクラスを継承
                initialize: function(alignment,cannon,ssp,Num){
                    Aim.call(this,alignment,cannon,ssp,Num,scene);
                }
            })
            function ShotBullet(i){
                game.assets['./sound/s_car_door_O2.wav'].clone().play();
                if(shotSpeed >= 12){
                    game.assets['./sound/Sample_0003.wav'].clone().play();
                }
                scene.insertBefore(colOb[Num][i],filterMap);
                scene.insertBefore(bulOb[Num][i],filterMap);
                new OpenFire(cannon,alignment,scene,filterMap)
                bullets[Num]++;  
                bulStack[Num][i] = true;
                shotStopFlg = true;
            }
            function Instrumentation(target1,target2){
                let dist1 = Math.sqrt(Math.pow(weak.x - target1.x, 2) + Math.pow(weak.y - target1.y, 2));
                let dist2 = Math.sqrt(Math.pow(weak.x - target2.x, 2) + Math.pow(weak.y - target2.y, 2));
                if(dist1 > dist2){
                    return dist2;
                }else{
                    return null;
                }
                
            }

            //  難易度設定によるステータス強化処理
            if(addBullet != 0 && fireLate > 19) fireLate = fireLate - ((fireLate/5)*2); 
            
            //  常に処理する
            this.onenterframe = function(){
                if(deleteFlg == true){
                    this.moveTo(-100,-100);
                    scene.removeChild(intercept)
                    scene.removeChild(intercept1);
                    scene.removeChild(intercept3);
                    scene.removeChild(intercept4);
                    scene.removeChild(intercept8);
                    scene.removeChild(tank)
                    scene.removeChild(cannon)
                    scene.removeChild(weak)
                    scene.removeChild(this);
                }
                //  死んでいなければ処理
                if(life > 0){
                    //  死亡判定処理
                    for(var j = 0; j < bulOb.length; j++){
                        for(var k = 0; k < bulOb[j].length; k++){
                            let dist = Math.sqrt(Math.pow(weak.x - bulOb[j][k].x, 2) + Math.pow(weak.y - bulOb[j][k].y, 2));
                            if(defeat == false && (dist < 30 || this.intersect(bulOb[j][k])==true) && bulStack[j][k] == true){
                                game.assets['./sound/mini_bomb2.mp3'].clone().play();
                                deadFlgs[Num] = true
                                bulStack[j][k] = false;
                                colOb[j][k].destroy()
                                colOb[j][k].moveTo(-200,-200)
                                bulOb[j][k].moveTo(-200,-200)
                                moveSpeed = 0;
                            }
                            /*if((this.within(bulOb[j][k],28)==true || weak.intersect(bulOb[j][k])==true) && defeat == false){
                                
                            }*/
                        }
                    }
                    //  死亡判定がfalseなら
                    if(deadFlgs[Num]==false){
                        
                        
                        
                        if(tankStopFlg == true)tankStopFlg = false;
                        fireFlgs[Num] = false;  //  発射状態をリセット
                        shotNGflg = false;
                        if(moveSpeed != 0){
                            //  自身の位置とターゲットの位置をざっくり算出
                            myPath = [parseInt((this.y+41)/pixelSize),parseInt((this.x+34.5)/pixelSize)]
                            targetPath = [parseInt((target.y+41)/pixelSize),parseInt((target.x+34.5)/pixelSize)]
                            //  マップの障害物情報に自身とターゲットの位置設定
                            for(var i = 0; i < grid.length; i++){
                                for(var j = 0; j < grid[i].length; j++){
                                    if(i == myPath[0] && j == myPath[1]){
                                        grid[i][j] = 'Start';
                                    }else if(i == targetPath[0] && j == targetPath[1]){
                                        grid[i][j] = 'Goal';
                                    }else{
                                        //  StartやGoalの位置が更新されている場合の処理
                                        if(map.collisionData[i][j] == 0){
                                            grid[i][j] = 'Empty';
                                        }else{
                                            grid[i][j] = 'Obstacle';
                                        }
                                    }
                                }
                            }
                            if(this.time == 0){
                                root = findShortestPath([myPath[0],myPath[1]], grid,scene);
                                if(root[0] == "East"){
                                    this.rotation = 0
                                }else if(root[0] == "West"){
                                    this.rotation = 180;
                                }else if(root[0] == "North"){
                                    this.rotation = 270;
                                }else if(root[0] == "South"){
                                    this.rotation = 90;
                                }
                            }
                        }
                        //  実行可能なら
                        if(worldFlg == true){
                            this.time++;
                            
                            for(let i = 0; i < tankEntity.length; i++){
                                if(i != Num && deadFlgs[i] == false){
                                    if(tankDir[Num][0].intersect(tankEntity[i])==true){
                                        shotNGflg = true;
                                        if(this.rotation == 270){
                                            tankStopFlg = true;
                                            if(shotStopFlg == false){
                                                this.y += moveSpeed;
                                                moveCnt -= moveSpeed;
                                            }        
                                        }
                                    }else if(tankDir[Num][1].intersect(tankEntity[i])==true){
                                        shotNGflg = true;
                                        if(this.rotation == 90){
                                            tankStopFlg = true;
                                            if(shotStopFlg == false){
                                                this.y -= moveSpeed;
                                                moveCnt -= moveSpeed;
                                            }
                                            
                                        }
                                    }else if(tankDir[Num][2].intersect(tankEntity[i])==true){
                                        shotNGflg = true;
                                        if(this.rotation == 0){
                                            tankStopFlg = true;
                                            if(shotStopFlg == false){
                                                this.x += moveSpeed;
                                                moveCnt -= moveSpeed;
                                            }
                                            
                                        }
                                    }else if(tankDir[Num][3].intersect(tankEntity[i])==true){
                                        shotNGflg = true;
                                        if(this.rotation == 180){
                                            tankStopFlg = true;
                                            if(shotStopFlg == false){
                                                this.x -= moveSpeed;
                                                moveCnt -= moveSpeed;
                                            }
                                        }
                                    }
                                }
                            }
                            for(let i = 0; i < obsdir.length; i++){
                                if(this.intersect(obsdir[i][0])==true && obsChk[i][0]==true){
                                    this.moveTo(this.x,obsdir[i][0].y-61)
                                }
                                if(this.intersect(obsdir[i][1])==true && obsChk[i][1]==true){
                                    this.moveTo(this.x,obsdir[i][1].y+obsdir[i][1].height+3)
                                }
                                if(this.intersect(obsdir[i][2])==true && obsChk[i][2]==true){
                                    this.moveTo(obsdir[i][2].x-62,this.y)
                                }
                                if(this.intersect(obsdir[i][3])==true && obsChk[i][3]==true){
                                    this.moveTo(obsdir[i][3].x+obsdir[i][3].width+3,this.y)
                                }
                            }
                            if(this.intersect(walls[0])==true){
                                this.moveTo(this.x,(64*2)-15)
                            }
                            if(this.intersect(walls[1])==true){
                                this.moveTo(this.x,(64*13)-13)
                            }
                            if(this.intersect(walls[2])==true){
                                this.moveTo((64*1)+3,this.y)
                            }
                            if(this.intersect(walls[3])==true){
                                this.moveTo((64*18)+3,this.y)
                            }
                            if(shotStopFlg == true){
                                shotStopTime++;
                                if(shotStopTime > 10){
                                    shotStopFlg = false;
                                    shotStopTime = 0;
                                }
                            }
                            
                            //  敵の照準生成
                            new EnemyAim(alignment,cannon,32,Num,scene);
                            //  照準がバグった場合の処理
                            /*if(enemyTarget[Num] == eAim){
                                enemyTarget[Num] = target
                            }*/
                            if(this.time % 5 == 0){
                                if(enemyTarget[Num] != target)enemyTarget[Num] = target;
                            }
                            
                            //  一定範囲内にターゲットがいた場合
                            if(tank.within(target,320)==true){
                                enemyTarget[Num] = target
                            }
                            //  照準がターゲット追跡オブジェと重なったら
                            alignment.intersect(EnemyAim).forEach(function(){
                                fireFlgs[Num] = true;   //  発射可能状態にする
                            })
                            
                            
                            /* 迎撃処理群
                                優先順位：自身の弾＞プレイヤーの弾＞他戦車の弾
                            */
                            //  他戦車の弾迎撃処理
                            if(cateFlgs[category][2] == true){
                                for(let i = 1; i < bulOb.length; i++){
                                    if(i != Num){
                                        for(let j = 0; j < bulOb[i].length; j++){
                                            if(bulStack[i][j] == true){
                                                let dist = Instrumentation(enemyTarget[Num],bulOb[i][j]);
                                                intercept.intersect(BulAim).forEach(function(){
                                                    if(dist != null && dist < cateRanges[category][2]){
                                                        enemyTarget[Num] = bulOb[i][j];    //  迎撃のためにターゲット変更
                                                    }
                                                })
                                                
                                            }
                                        }
                                    }
                                }
                            }
                            //  プレイヤーの弾迎撃処理
                            if(cateFlgs[category][0] == true){
                                for(let i = 0; i < bulOb[0].length; i++){
                                    if(bulStack[0][i] == true){
                                        let dist = Instrumentation(enemyTarget[Num],bulOb[0][i]);
                                        if(dist != null && dist < cateRanges[category][0]){
                                            this.intersect(PlayerBulAim).forEach(function(){
                                                enemyTarget[Num] = bulOb[0][i];    //  迎撃のためにターゲット変更
                                            })
                                        }
                                        
                                    }
                                }
                            }
                            //  自身の弾迎撃処理
                            if(cateFlgs[category][1] == true){
                                for(let i = 0; i < bulOb[Num].length; i++){
                                    if(bulStack[Num][i] == true){
                                        let dist = Instrumentation(enemyTarget[Num],bulOb[Num][i]);
                                        if(dist != null && dist < cateRanges[category][1]){
                                            enemyTarget[Num] = bulOb[Num][i];    //  迎撃のためにターゲット変更
                                        }
                                    }
                                }
                            }

                            if(reloadFlg == false){
                                if(bullets[Num] == max) reloadFlg = true;
                            }else{
                                if(reloadTime < cateReloadTimes[category]){
                                    reloadTime++;
                                    if(shotNGflg == false) shotNGflg = true;
                                }else{
                                    shotNGflg = false;
                                    reloadFlg = false;
                                    reloadTime = 0;
                                }
                                
                            }
                            
                            //  砲撃処理
                            if(shotNGflg == false){
                                if(this.time % fireLate == 0 && fireFlgs[Num]==true){
                                    if(Math.floor(Math.random() * max*2)>bullets[Num]){
                                        if(bullets[Num] < max && deadFlgs[Num] == false){
                                            for(let i = 0; i < max; i++){
                                                if(bulStack[Num][i] == false){
                                                    colOb[Num][i] = new BulletCol(alignment,cannon,shotSpeed,grade,Num,scene,i);
                                                    bulOb[Num][i] = new Bullet(colOb[Num][i],cannon,ref,Num,max,shotSpeed,scene,i)
                                                    ShotBullet(i)
                                                    break;
                                                }
                                                
                                            }
                                            
                                        } 
                                    }
                                }
                            }
                            
                            
                            if(moveSpeed != 0 && shotStopFlg == false && tankStopFlg == false){
                                //  移動処理
                                if(root != false && intercept.intersect(target)==false){
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
                                if(moveCnt == pixelSize && moveSpeed != 0){
                                    root = findShortestPath([myPath[0],myPath[1]], grid,scene)
                                    if(root[0] == "East"){
                                        this.rotation = 0
                                    }else if(root[0] == "West"){
                                        this.rotation = 180;
                                    }else if(root[0] == "North"){
                                        this.rotation = 270;
                                    }else if(root[0] == "South"){
                                        this.rotation = 90;
                                    }
                                    moveCnt = 0    
                                }        
                                
                                weak.rotation = this.rotation;
                            }
                            if(root == false && moveSpeed != 0){
                                root = findShortestPath([myPath[0],myPath[1]], grid,scene)
                                if(root[0] == "East"){
                                    this.rotation = 0
                                }else if(root[0] == "West"){
                                    this.rotation = 180;
                                }else if(root[0] == "North"){
                                    this.rotation = 270;
                                }else if(root[0] == "South"){
                                    this.rotation = 90;
                                }
                                moveCnt = 0    
                            }
                        }
                    //  死亡判定時の処理
                    }else{
                        tankColorCounts[category]--;
                        //alert(tankColorCwwsaounts)
                        //markEntity[Num] = new Mark(this.x,this.y,target,scene)   //  撃破後の物体設置
                        new Explosion(this,scene);
                        this.moveTo(-100,-100);
                        destruction++
                        life--;
                    }
                }
            }
            scene.insertBefore(this,tank)
        }
    });
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
            
            const cannon = new Cannon(this,path2,Num,scene,filterMap)
            const tank = new Tank(this,path1,Num,scene,cannon)
            const weak = new Weak(this,Num,scene)
            TankFrame(this,Num,scene)

            markEntity[Num] = null;

            tank.opacity = 1.0;
            cannon.opacity = 1.0;
            
            const intercept = new Intercept96(this,scene)
            const intercept7 = new InterceptC(cannon,scene)
            var value = Math.floor(Math.random() * 4);;
            var speed = moveSpeed;
            var bomFlg = false;
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
        
            if(moveSpeed != 0){
                speed = moveSpeed + addSpeed;
                if(stageNum >= 20){
                    speed = speed + (0.2*(stageNum / 20));
                }
            }

            if(category == 2 && addBullet != 0){
                ref = ref+addBullet;
            }

            enemyTarget[Num] = target;
            var alignment = new Target(Num,scene)
            //alignment.backgroundColor = 'blue'

            for(var i = 0; i < emax; i++){
                colOb[Num][i] = new BulletCol(alignment,cannon,shotSpeed,grade,Num,scene,i);
                bulOb[Num][i] = new Bullet(colOb[Num][i],cannon,ref,Num,emax,shotSpeed,scene,i);
                bulStack[Num][i] = false;
                colOb[Num][i].moveTo(-230,-230)
                bulOb[Num][i].moveTo(-100,-100)
            }

            bomOb[Num][0] = new Bom(this,Num,scene);

            var EnemyAim = Class.create(Aim,{
                initialize: function(alignment,cannon,ssp,Num){
                    if(pauseFlg == false){
                        Aim.call(this,alignment,cannon,20,Num,scene);
                    }
                    
                }
            })

            //  移動方向決め処理
            function SelDirection(target1,target2,or){
                if(or == 0){
                    if((target1.x + target1.width/2) > (target2.x + target2.width/2)){
                        if((target1.y + target1.height/2) > (target2.y + target2.height/2)){
                            while(value == 0 || value == 2) value = Math.floor(Math.random() * 4);
                        }
                        else{
                            while(value == 0 || value == 3) value = Math.floor(Math.random() * 4);
                        }
                    }else{
                        if((target1.y + target1.height/2) > (target2.y + target2.height/2)){
                            while(value == 1 || value == 2) value = Math.floor(Math.random() * 4);
                        }
                        else{
                            while(value == 1 || value == 3) value = Math.floor(Math.random() * 4);
                        }
                    }
                    
                }else if(or == 1){
                    if((target1.x + target1.width/2) > (target2.x + target2.width/2)){
                        if((target1.y + target1.height/2) > (target2.y + target2.height/2)){
                            while(value == 1 || value == 3) value = Math.floor(Math.random() * 4);
                        }
                        else{
                            while(value == 1 || value == 2) value = Math.floor(Math.random() * 4);
                        }
                            
                    }else{
                        if((target1.y + target1.height/2) > (target2.y + target2.height/2)){
                            while(value == 0 || value == 3) value = Math.floor(Math.random() * 4);
                        }
                        else{
                            while(value == 0 || value == 2) value = Math.floor(Math.random() * 4);
                        }
                    }
                    
                }
            }
            function ShotBullet(i){
                game.assets['./sound/s_car_door_O2.wav'].clone().play();
                if(shotSpeed >= 12){
                    game.assets['./sound/Sample_0003.wav'].clone().play();
                }
                scene.insertBefore(colOb[Num][i],filterMap);
                scene.insertBefore(bulOb[Num][i],filterMap);
                new OpenFire(cannon,alignment,scene,filterMap)
                bullets[Num]++;  
                bulStack[Num][i] = true;
                shotStopFlg = true;
            }
            function Instrumentation(target1,target2){
                let dist1 = Math.sqrt(Math.pow(weak.x - target1.x, 2) + Math.pow(weak.y - target1.y, 2));
                let dist2 = Math.sqrt(Math.pow(weak.x - target2.x, 2) + Math.pow(weak.y - target2.y, 2));
                if(dist1 > dist2){
                    return dist2;
                }else{
                    return null;
                }
                
            }

            if(addBullet != 0 && fireLate > 19) fireLate = fireLate - ((fireLate/5)*2); 
            
            this.onenterframe = function(){
                if(deleteFlg == true){
                    this.moveTo(-100,-100)
                    scene.removeChild(intercept7);
                    scene.removeChild(tank)
                    scene.removeChild(cannon)
                    scene.removeChild(weak)
                    scene.removeChild(this)
                }
                if(life > 0){
                    
                    
                    //  死亡判定処理
                    for(var j = 0; j < bulOb.length; j++){
                        for(var k = 0; k < bulOb[j].length; k++){
                            let dist = Math.sqrt(Math.pow(weak.x - bulOb[j][k].x, 2) + Math.pow(weak.y - bulOb[j][k].y, 2));
                            if(defeat == false && (dist < 30 || this.intersect(bulOb[j][k])==true) && bulStack[j][k] == true){
                                game.assets['./sound/mini_bomb2.mp3'].clone().play();
                                deadFlgs[Num] = true
                                bulStack[j][k] = false;
                                colOb[j][k].destroy()
                                colOb[j][k].moveTo(-200,-200)
                                bulOb[j][k].moveTo(-200,-200)
                                moveSpeed = 0;
                            }
                            /*if((this.within(bulOb[j][k],28)==true || weak.intersect(bulOb[j][k])==true) && defeat == false){
                                
                            }*/
                        }
                    }
                    if(shotStopFlg == true){
                        shotStopTime++;
                        if(shotStopTime > 10){
                            shotStopFlg = false;
                            shotStopTime = 0;
                        }
                    }

                    if(game.time == 1800){
                        if(fireLate < 15){
                            fireLate = 20;
                        }
                    }

                    if(hittingTime==30){
                        let val = value;
                        while(value == val) value = Math.floor(Math.random() * 4);
                        hittingTime = 0;
                    }
  
                    if(worldFlg == true){
                        this.time++;

                        if(deadFlgs[0] == false){
                            if(this.time % 2 == 0){
                                stopFlg = false;
                                escapeFlg = false;
                                shotNGflg = false;
                                fireFlgs[Num] = false;
                                if(tank.opacity != opaVal){
                                    tank.opacity = opaVal;
                                    cannon.opacity = opaVal;
                                }
                                if(Math.sqrt(Math.pow(weak.x - target.x, 2) + Math.pow(weak.y - target.y, 2)) < 300) opaFlg = true;
                                if(category == 6){
                                    if(this.time % 600 == 0 && addBullet == 0){
                                        opaFlg = true;
                                    }
                                    if(opaFlg == false && opaVal > 0){
                                        opaVal -= 0.05;
                                        if(opaVal <= 0){
                                            opaVal = 0;
                                        }
                                    }else if(opaFlg == true && opaVal <= 1.0){
                                        opaVal += 0.1;
                                        if(opaVal >= 1.0){
                                            opaVal = 1.0;
                                            opaFlg = false;
                                        }
                                    }
                                }else if(category == 8){
                                    if(tank.within(target,300)==true && bomFlg == false && boms[Num] == 0){
                                        game.assets['./sound/Sample_0009.wav'].clone().play();
                                        bomOb[Num][0] = new Bom(this,Num,scene);
                                        scene.insertBefore(bomOb[Num][0],target);
                                        this.time = 0;
                                        bomFlg = true;
                                        boms[Num]++;
                                    }else if(bomFlg == true && boms[Num] <= 0){
                                        bomFlg = false;
                                        bomOb[Num][0] = new Bom(this,Num,scene);
                                        boms[Num] = 0
                                    }
                                }
                            }
                            
                            new EnemyAim(alignment,cannon,12,Num,scene);
                            
                            if(deadFlgs[Num] == true){
                                tankColorCounts[category]--;
                                //alert(tankColorCounts)
                                //markEntity[Num] = new Mark(this.x,this.y,target,scene)   //  撃破後の物体設置
                                new Explosion(this,scene);
                                this.moveTo(-100,-100)
                                destruction++
                                life--;
                            }

                            intercept7.intersect(Floor).forEach(function(){
                                shotNGflg = true;
                            })
                            intercept7.intersect(Wall).forEach(function(){
                                shotNGflg = true;
                            })
                            
                            alignment.intersect(EnemyAim).forEach(function(){
                                fireFlgs[Num] = true;
                            })
                            for(let i = 1; i < tankEntity.length; i++){
                                if(tank.within(tankEntity[i],64) && i != Num && deadFlgs[i]==false){
                                    fireFlgs[Num] = false;
                                }
                            }
                            
                            /*avoids.forEach(elem=>{
                                if(tank.within(elem,60)==true){
                                    stopFlg = true;
                                }
                            })*/
                            if(this.time % 5 == 0){
                                    if(enemyTarget[Num] != target)enemyTarget[Num] = target;
                                }
                                if(grade == 6 && boms[Num]>0 && bomFlg == true){
                                    let dist = Math.sqrt(Math.pow(weak.x - bomOb[Num][0].x, 2) + Math.pow(weak.y - bomOb[Num][0].y, 2));
                                    if(dist < 300){
                                        fireFlgs[Num] = false;
                                        if(this.time % 5 == 0){
                                            SelDirection(weak,bomOb[Num][0],0)
                                        }
                                    }
                                }

                                /* 迎撃処理群
                                    優先順位：自身の弾＞プレイヤーの弾＞他戦車の弾
                                */
                                //  他戦車の弾迎撃処理
                                if(cateFlgs[category][2] == true && bulOb.length > 2){
                                    for(let i = 1; i < bulOb.length; i++){
                                        if(i != Num){
                                            for(let j = 0; j < bulOb[i].length; j++){
                                                if(bulStack[i][j] == true){
                                                    let dist = Instrumentation(enemyTarget[Num],bulOb[i][j]);
                                                    if(dist != null && dist < cateRanges[category][2]){
                                                        if(cateEscapes[category][0]==true && cateEscapes[category][3] != 0){
                                                            if(dist < cateEscapes[category][3]){
                                                                if(dist < 120) enemyTarget[Num] = bulOb[i][j];
                                                                escapeTarget = bulOb[i][j];
                                                                escapeFlg = true;
                                                            } 
                                                        }
                                                        intercept.intersect(BulAim).forEach(function(){
                                                            if(cateEscapes[category][3] != 0) enemyTarget[Num] = bulOb[i][j];    //  迎撃のためにターゲット変更
                                                            if(this.time % 5 == 0){
                                                                SelDirection(weak,bulOb[i][j],0)
                                                            }
                                                        })
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                //  プレイヤーの弾迎撃処理
                                if(cateFlgs[category][0] == true){
                                    for(let i = 0; i < bulOb[0].length; i++){
                                        if(bulStack[0][i] == true){
                                            let dist = Instrumentation(enemyTarget[Num],bulOb[0][i]);
                                            if(dist != null && dist < cateRanges[category][0]){
                                                if(cateEscapes[category][0] == true && cateEscapes[category][1] != 0){
                                                    if(dist < cateEscapes[category][1]){
                                                        escapeTarget = bulOb[0][i];
                                                        escapeFlg = true;
                                                    }
                                                }
                                                intercept.intersect(PlayerBulAim).forEach(function(){
                                                    if(cateEscapes[category][1] != 0) enemyTarget[Num] = bulOb[0][i];
                                                    if(this.time % 5 == 0){
                                                        SelDirection(weak,bulOb[0][i],0)
                                                    }
                                                })
                                            }
                                        }
                                    }
                                }
                                //  自身の弾迎撃処理
                                if(cateFlgs[category][1] == true){
                                    for(let i = 0; i < bulOb[Num].length; i++){
                                        if(bulStack[Num][i] == true){
                                            let dist = Instrumentation(enemyTarget[Num],bulOb[Num][i]);
                                            if(dist != null && dist < cateRanges[category][1]){
                                                this.intersect(BulAim).forEach(function(){     
                                                    if(cateEscapes[category][2] != 0){
                                                        enemyTarget[Num] = bulOb[Num][i];
                                                        escapeTarget = bulOb[Num][i];
                                                        if(cateEscapes[category][0]==true){
                                                            if(dist < cateEscapes[category][2] && dist > 100){
                                                                escapeFlg = true
                                                            }
                                                        }
                                                    }
                                                    if(this.time % 5 == 0){
                                                        SelDirection(weak,bulOb[0][i],0)
                                                    }
                                                })
                                            }
                                        }
                                    }
                                }

                                if(reloadFlg == false){
                                    if(bullets[Num] == emax) reloadFlg = true;
                                }else{
                                    if(reloadTime < cateReloadTimes[category]){
                                        reloadTime++;
                                        if(shotNGflg == false) shotNGflg = true;
                                    }else{
                                        shotNGflg = false;
                                        reloadFlg = false;
                                        reloadTime = 0;
                                    }
                                    
                                }

                                if(game.time % fireLate == 0 && shotNGflg == false){
                                    if(Math.floor(Math.random() * emax*2)>bullets[Num]){
                                        for(let i = 0; i < emax; i++){
                                            if(bulStack[Num][i] == false){
                                                if(category == 7){
                                                    if(bullets[Num] < emax-2 && deadFlgs[Num] == false && fireFlgs[Num]==false && game.time % 120 == 0){
                                                        if(Math.floor(Math.random() * 2) == 0){
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
                                                            const vector = {
                                                                x: alignment.x - cannon.x-64,
                                                                y: alignment.y - cannon.y-32
                                                            };
                                                            let rad = Math.atan2(vector.y, vector.x);
                                                            alignment.moveTo((cannon.x+(200)*Math.cos(rad)+(100*r1)), (cannon.y+(200)*Math.sin(rad)+(100*r2)));
                                                            new EnemyAim(alignment,cannon,32,Num,scene);
                                                            colOb[Num][i] = new BulletCol(alignment,cannon,shotSpeed,grade,Num,scene,i);
                                                            bulOb[Num][i] = new Bullet(colOb[Num][i],cannon,ref,Num,emax,shotSpeed,scene,i)
                                                            ShotBullet(i);
                                                            break;
                                                        }
                                                        
                                                    }else if(bullets[Num] < emax && deadFlgs[Num] == false && fireFlgs[Num]==true){
                                                        colOb[Num][i] = new BulletCol(alignment,cannon,shotSpeed,grade,Num,scene,i);
                                                        bulOb[Num][i] = new Bullet(colOb[Num][i],cannon,ref,Num,emax,shotSpeed,scene,i)
                                                        ShotBullet(i);
                                                        break;
                                                    }
                                                }else if(category == 8){
                                                    if(bullets[Num] < emax && deadFlgs[Num] == false && boms[Num] > 0 && fireFlgs[Num]==true){
                                                        colOb[Num][i] = new BulletCol(alignment,cannon,shotSpeed,grade,Num,scene,i);
                                                        bulOb[Num][i] = new Bullet(colOb[Num][i],cannon,ref,Num,emax,shotSpeed,scene,i)
                                                        ShotBullet(i);
                                                        break;
                                                    }
                                                }else if(category == 5 || category == 2){
                                                    if(bullets[Num] < emax && deadFlgs[Num] == false && fireFlgs[Num]==true){
                                                        colOb[Num][i] = new BulletCol(alignment,cannon,shotSpeed,10,Num,scene,i);
                                                        bulOb[Num][i] = new Bullet(colOb[Num][i],cannon,ref,Num,emax,shotSpeed,scene,i)
                                                        ShotBullet(i);
                                                        break;
                                                    }
                                                }else{
                                                    if(bullets[Num] < emax && deadFlgs[Num] == false && fireFlgs[Num]==true){
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
                                                        colOb[Num][i] = new BulletCol(alignment,cannon,shotSpeed,grade,Num,scene,i);
                                                        bulOb[Num][i] = new Bullet(colOb[Num][i],cannon,ref,Num,emax,shotSpeed,scene,i)
                                                        ShotBullet(i);
                                                        if(category == 6 && opaVal == 0){
                                                            opaVal = 0.5;
                                                        }
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                               
                                if(escapeFlg == false){
                                    
                                    if(category == 8){
                                        if(boms[Num] > 0){
                                            if(Math.sqrt(Math.pow(weak.x - bomOb[Num][0].x, 2) + Math.pow(weak.y - bomOb[Num][0].y, 2)) < 250){
                                                if(this.time % 10 == 0){
                                                    SelDirection(weak,bomOb[Num][0],0)
                                                }
                                            }
                                        }
                                    }else if(grade > 3){
                                        if(boms[0] > 0){
                                            bomOb[0].forEach(elem=>{
                                                if(Math.sqrt(Math.pow(weak.x - bomOb[Num][0].x, 2) + Math.pow(weak.y - bomOb[Num][0].y, 2)) < 250){
                                                    if(this.time % 10 == 0){
                                                        SelDirection(weak,elem,0)
                                                    }
                                                }
                                            })
                                        }
                                    }
                                }
                                if(game.time % 5 == 0){
                                    for(var i = 0; i < tankEntity.length; i++){
                                        if(i != Num && deadFlgs[i] == false && moveSpeed > 0){
                                            if(this.intersect(tankEntity[i])==true){
                                                SelDirection(weak,tankEntity[i],0)
                                            }else{ 
                                                if(escapeFlg == false){
                                                    if(Math.sqrt(Math.pow(weak.x - target.x, 2) + Math.pow(weak.y - target.y, 2)) < cateDistances[category]){
                                                        SelDirection(weak,target,0)
                                                    }else{
                                                        if(game.time % 10 == 0){
                                                            SelDirection(weak,target,1) 
                                                        }
                                                    }
                                                }else{
                                                    SelDirection(weak,escapeTarget,0);
                                                }
                                            }
                                        }
                                    }
                                }
                                if(shotStopFlg == false){
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
                                }
                                
                            
                            /* 戦車本体の角度 */
                            if(moveSpeed > 0){
                                this.rotation = rot;
                                tank.rotation = rot;
                                weak.rotation = rot;
                            }
                            for(let i = 0; i < tankDir.length; i++){
                                if(deadFlgs[i]==false && i != Num){
                                    if(this.intersect(tankDir[i][0])==true){
                                        this.moveTo(this.x,tankDir[i][0].y-60)
                                    }
                                    if(this.intersect(tankDir[i][1])==true){
                                        this.moveTo(this.x,tankDir[i][1].y+(tankDir[i][1].height))
                                    }
                                    if(this.intersect(tankDir[i][2])==true){
                                        this.moveTo(tankDir[i][2].x-60,this.y)
                                    }
                                    if(this.intersect(tankDir[i][3])==true){
                                        this.moveTo(tankDir[i][3].x+(tankDir[i][3].width),this.y)
                                    }
                                }
                            }
                            for(let i = 0; i < obsdir.length; i++){
                                if(this.intersect(obsdir[i][0])==true && obsChk[i][0]==true){
                                    this.moveTo(this.x,obsdir[i][0].y-60)
                                    hittingTime++;
                                }
                                if(this.intersect(obsdir[i][1])==true && obsChk[i][1]==true){
                                    this.moveTo(this.x,obsdir[i][1].y+(obsdir[i][1].height))
                                    hittingTime++;
                                }
                                if(this.intersect(obsdir[i][2])==true && obsChk[i][2]==true){
                                    this.moveTo(obsdir[i][2].x-60,this.y)
                                    hittingTime++;
                                }
                                if(this.intersect(obsdir[i][3])==true && obsChk[i][3]==true){
                                    this.moveTo(obsdir[i][3].x+(obsdir[i][3].width),this.y)
                                    hittingTime++;
                                }
                            }
                            if(this.intersect(walls[0])==true){
                                this.moveTo(this.x,walls[0].y+walls[0].height)
                                hittingTime++;
                            }
                            if(this.intersect(walls[1])==true){
                                this.moveTo(this.x,walls[1].y-walls[1].height+2)
                                hittingTime++;
                            }
                            if(this.intersect(walls[2])==true){
                                this.moveTo(walls[2].x+walls[2].width,this.y)
                                hittingTime++;
                            }
                            if(this.intersect(walls[3])==true){
                                this.moveTo(walls[3].x-walls[3].width+2,this.y)
                                hittingTime++;
                            }
                        }
                    }
                    
                    
                }
            }
            scene.insertBefore(this,tank)
        }
    });
    var AIElite = Class.create(Sprite,{
        initialize: function(x,y,path1,path2,target,max,ref,shotSpeed,moveSpeed,fireLate,grade,category,scene,filterMap,map,g){
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
            
            const cannon = new Cannon(this,path2,Num,scene,filterMap)
            const tank = new Tank(this,path1,Num,scene,cannon)
            const weak = new Weak(this,Num,scene)
            TankFrame(this,Num,scene)

            markEntity[Num] = null;

            tank.opacity = 1.0;
            cannon.opacity = 1.0;
            
            const intercept = new Intercept96(this,scene)
            const intercept7 = new InterceptC(cannon,scene)
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
            let now = 0;

            var grid = g;       //  マップの障害物配置情報
            var root;           //  移動ルート
            var rootFlg = false;

            var myPath = [parseInt((this.y+41)/pixelSize),parseInt((this.x+34.5)/pixelSize)]
            var targetPath = [parseInt((target.y+41)/pixelSize),parseInt((target.x+34.5)/pixelSize)]

            let life = 1;
        
            if(moveSpeed != 0){
                speed = moveSpeed + addSpeed;
                if(stageNum >= 20){
                    speed = speed + (0.2*(stageNum / 20));
                }
            }

            enemyTarget[Num] = target;
            var alignment = new Target(Num,scene);
            //alignment.backgroundColor = 'blue'

            for(var i = 0; i < emax; i++){
                colOb[Num][i] = new BulletCol(alignment,cannon,shotSpeed,grade,Num,scene,i);
                bulOb[Num][i] = new Bullet(colOb[Num][i],cannon,ref,Num,emax,shotSpeed,scene,i);
                bulStack[Num][i] = false;
                colOb[Num][i].moveTo(-240,-240)
                bulOb[Num][i].moveTo(-100,-100)
            }

            bomOb[Num][0] = new Bom(this,Num,scene);

            var EnemyAim = Class.create(Aim,{
                initialize: function(alignment,cannon,ssp,Num){
                    if(pauseFlg == false){
                        Aim.call(this,alignment,cannon,20,Num,scene);
                    }
                    
                }
            })

            //  移動方向決め処理
            function SelDirection(target1,target2,or){
                if(or == 0){
                    if((target1.x + target1.width/2) > (target2.x + target2.width/2)){
                        if((target1.y + target1.height/2) > (target2.y + target2.height/2)){
                            while(value == 0 || value == 2) value = Math.floor(Math.random() * 4);
                        }
                        else{
                            while(value == 0 || value == 3) value = Math.floor(Math.random() * 4);
                        }
                    }else{
                        if((target1.y + target1.height/2) > (target2.y + target2.height/2)){
                            while(value == 1 || value == 2) value = Math.floor(Math.random() * 4);
                        }
                        else{
                            while(value == 1 || value == 3) value = Math.floor(Math.random() * 4);
                        }
                    }
                }else if(or == 1){
                    if((target1.x + target1.width/2) > (target2.x + target2.width/2)){
                        if((target1.y + target1.height/2) > (target2.y + target2.height/2)){
                            while(value == 1 || value == 3) value = Math.floor(Math.random() * 4);
                        }
                        else{
                            while(value == 1 || value == 2) value = Math.floor(Math.random() * 4);
                        }
                            
                    }else{
                        if((target1.y + target1.height/2) > (target2.y + target2.height/2)){
                            while(value == 0 || value == 3) value = Math.floor(Math.random() * 4);
                        }
                        else{
                            while(value == 0 || value == 2) value = Math.floor(Math.random() * 4);
                        }
                    }
                }
            }
            function ShotBullet(i){
                game.assets['./sound/s_car_door_O2.wav'].clone().play();
                if(shotSpeed >= 12){
                    game.assets['./sound/Sample_0003.wav'].clone().play();
                }
                scene.insertBefore(colOb[Num][i],filterMap);
                scene.insertBefore(bulOb[Num][i],filterMap);
                new OpenFire(cannon,alignment,scene,filterMap)
                bullets[Num]++;  
                bulStack[Num][i] = true;
                shotStopFlg = true;
            }
            function Instrumentation(target1,target2){
                let dist1 = Math.sqrt(Math.pow(weak.x - target1.x, 2) + Math.pow(weak.y - target1.y, 2));
                let dist2 = Math.sqrt(Math.pow(weak.x - target2.x, 2) + Math.pow(weak.y - target2.y, 2));
                if(dist1 > dist2){
                    return dist2;
                }else{
                    return null;
                }
                
            }

            if(addBullet != 0 && fireLate > 19) fireLate = fireLate - ((fireLate/5)*2); 
            
            this.onenterframe = function(){
                if(deadFlgs[Num] == true){
                    this.moveTo(-100,-100)
                    scene.removeChild(intercept7);
                    scene.removeChild(tank)
                    scene.removeChild(cannon)
                    scene.removeChild(weak)
                    scene.removeChild(this)                        
                }
                if(life > 0){
                    //  死亡判定処理
                    for(var j = 0; j < bulOb.length; j++){
                        for(var k = 0; k < bulOb[j].length; k++){
                            let dist = Math.sqrt(Math.pow(weak.x - bulOb[j][k].x, 2) + Math.pow(weak.y - bulOb[j][k].y, 2));
                            if(defeat == false && (dist < 30 || this.intersect(bulOb[j][k])==true) && bulStack[j][k] == true){
                                game.assets['./sound/mini_bomb2.mp3'].clone().play();
                                deadFlgs[Num] = true
                                bulStack[j][k] = false;
                                colOb[j][k].destroy()
                                colOb[j][k].moveTo(-200,-200)
                                bulOb[j][k].moveTo(-200,-200)
                                moveSpeed = 0;
                            }
                            /*if((this.within(bulOb[j][k],28)==true || weak.intersect(bulOb[j][k])==true) && defeat == false){
                                
                            }*/
                        }
                    }
                    if(shotStopFlg == true){
                        shotStopTime++;
                        if(shotStopTime > 10){
                            shotStopFlg = false;
                            shotStopTime = 0;
                        }
                    }
                    if(escapeFlg == false)rootFlg = false;
                    if(enemyTarget[Num] != target) rootFlg = true;
                    if(moveSpeed != 0 && escapeFlg == false){
                        //  自身の位置とターゲットの位置をざっくり算出
                        myPath = [parseInt((this.y+(this.height/2)-1)/pixelSize),parseInt((this.x+(this.width/2)-1)/pixelSize)]
                        targetPath = [parseInt((target.y+41)/pixelSize),parseInt((target.x+34.5)/pixelSize)]
                        //  マップの障害物情報に自身とターゲットの位置設定
                        for(var i = 0; i < grid.length; i++){
                            for(var j = 0; j < grid[i].length; j++){
                                if(i == myPath[0] && j == myPath[1]){
                                    grid[i][j] = 'Start';
                                }else if(i == targetPath[0] && j == targetPath[1]){
                                    grid[i][j] = 'Goal';
                                }else{
                                    //  StartやGoalの位置が更新されている場合の処理
                                    if(map.collisionData[i][j] == 0){
                                        grid[i][j] = 'Empty';
                                    }else{
                                        grid[i][j] = 'Obstacle';
                                    }
                                }
                            }
                        }
                        if((rootFlg == false && this.time % 20 == 0) || this.time == 0){
                            root = findShortestPath([myPath[0],myPath[1]], grid,scene);
                            if(root[0] == "East"){
                                value = 1;
                            }else if(root[0] == "West"){
                                value = 0;
                            }else if(root[0] == "North"){
                                value = 2;
                            }else if(root[0] == "South"){
                                value = 3;
                            }else{
                                rootFlg = true;
                            }
                        }
                        
                    }
                    
                    if(worldFlg == true && defeat == false && victory == false && complete == false){
                        this.time++;
                        if(deadFlgs[0] == false){
                            
                            
                                
                            if(hittingTime>=30){
                                while(value == now) value = Math.floor(Math.random() * 4);
                                hittingTime = 0;
                            }

                            if(this.time % 2 == 0){
                                escapeFlg = false;
                                shotNGflg = false;
                                fireFlgs[Num] = false;
                            }
                            
                            /*for(var j = 0; j < bulOb.length; j++){
                                for(var k = 0; k < bulOb[j].length; k++){
                                    if(tank.within(bulOb[j][k],28)==true || weak.intersect(bulOb[j][k])==true){
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
                            
                            new EnemyAim(alignment,cannon,12,Num,scene);
                            
                            if(deadFlgs[Num] == true){
                                tankColorCounts[category]--;
                                //alert(tankColorCounts)
                                //markEntity[Num] = new Mark(this.x,this.y,target,scene)   //  撃破後の物体設置
                                new Explosion(this,scene);
                                this.moveTo(-100,-100)
                                destruction++
                                life--;
                            }

                            intercept7.intersect(Floor).forEach(function(){
                                shotNGflg = true;
                            })
                            intercept7.intersect(Wall).forEach(function(){
                                shotNGflg = true;
                            })
                            
                            alignment.intersect(EnemyAim).forEach(function(){
                                fireFlgs[Num] = true;
                                rootFlg = true;
                            })
                            for(let i = 1; i < tankEntity.length; i++){
                                if(tank.within(tankEntity[i],64) && i != Num && deadFlgs[i]==false){
                                    fireFlgs[Num] = false;
                                }
                            }
                            
                            if(this.time % 5 == 0){
                                if(enemyTarget[Num] != target)enemyTarget[Num] = target;
                            }

                            /* 迎撃処理群
                                優先順位：自身の弾＞プレイヤーの弾＞他戦車の弾
                            */
                            //  他戦車の弾迎撃処理
                            if(cateFlgs[category][2] == true && bulOb.length > 2){
                                for(let i = 1; i < bulOb.length; i++){
                                    if(i != Num){
                                        for(let j = 0; j < bulOb[i].length; j++){
                                            if(bulStack[i][j] == true){
                                                let dist = Instrumentation(enemyTarget[Num],bulOb[i][j]);
                                                if(dist != null && dist < cateRanges[category][2]){
                                                    if(cateEscapes[category][0]==true && cateEscapes[category][3] != 0){
                                                        if(dist < cateEscapes[category][3]){
                                                            if(dist < 120) enemyTarget[Num] = bulOb[i][j];
                                                            escapeTarget = bulOb[i][j];
                                                            escapeFlg = true;
                                                        } 
                                                    }
                                                    intercept.intersect(BulAim).forEach(function(){
                                                        if(cateEscapes[category][3] != 0) enemyTarget[Num] = bulOb[i][j];    //  迎撃のためにターゲット変更
                                                        if(this.time % 5 == 0){
                                                            SelDirection(weak,bulOb[i][j],0)
                                                        }
                                                    })
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            //  プレイヤーの弾迎撃処理
                            if(cateFlgs[category][0] == true){
                                for(let i = 0; i < bulOb[0].length; i++){
                                    if(bulStack[0][i] == true){
                                        let dist = Instrumentation(enemyTarget[Num],bulOb[0][i]);
                                        if(dist != null && dist < cateRanges[category][0]){
                                            if(cateEscapes[category][0] == true && cateEscapes[category][1] != 0){
                                                if(dist < cateEscapes[category][1]){
                                                    escapeTarget = bulOb[0][i]
                                                    escapeFlg = true;
                                                }
                                            }
                                            intercept.intersect(PlayerBulAim).forEach(function(){
                                                if(cateEscapes[category][1] != 0) enemyTarget[Num] = bulOb[0][i];
                                                if(this.time % 5 == 0){
                                                    SelDirection(weak,bulOb[0][i],0)
                                                }
                                            })
                                        }
                                    }
                                }
                            }
                            //  自身の弾迎撃処理
                            if(cateFlgs[category][1] == true){
                                for(let i = 0; i < bulOb[Num].length; i++){
                                    if(bulStack[Num][i] == true){
                                        let dist = Instrumentation(enemyTarget[Num],bulOb[Num][i]);
                                        if(dist != null && dist < cateRanges[category][1]){
                                            this.intersect(BulAim).forEach(function(){     
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
                                                    SelDirection(weak,bulOb[0][i],0)
                                                }
                                            })
                                        }
                                    }
                                }
                            }

                            if(reloadFlg == false){
                                if(bullets[Num] == emax) reloadFlg = true;
                            }else{
                                if(reloadTime < cateReloadTimes[category]){
                                    reloadTime++;
                                    if(shotNGflg == false) shotNGflg = true;
                                }else{
                                    shotNGflg = false;
                                    reloadFlg = false;
                                    reloadTime = 0;
                                }
                                
                            }

                            if(game.time % fireLate == 0 && shotNGflg == false){
                                if(Math.floor(Math.random() * (emax*2))>bullets[Num]){
                                    for(let i = 0; i < emax; i++){
                                        if(bulStack[Num][i] == false){
                                            if(category == 5){
                                                if(bullets[Num] < emax && deadFlgs[Num] == false && fireFlgs[Num]==true){
                                                    colOb[Num][i] = new BulletCol(alignment,cannon,shotSpeed,0,Num,scene,i);
                                                    bulOb[Num][i] = new Bullet(colOb[Num][i],cannon,ref,Num,emax,shotSpeed,scene,i)
                                                    ShotBullet(i);
                                                    break;
                                                }
                                            }else{
                                                if(bullets[Num] < emax && deadFlgs[Num] == false && fireFlgs[Num]==true){
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
                                                    colOb[Num][i] = new BulletCol(alignment,cannon,shotSpeed,grade,Num,scene,i);
                                                    bulOb[Num][i] = new Bullet(colOb[Num][i],cannon,ref,Num,emax,shotSpeed,scene,i)
                                                    ShotBullet(i);
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            if(game.time % 5 == 0){
                                for(var i = 0; i < tankEntity.length; i++){
                                    if(i != Num && deadFlgs[i] == false && moveSpeed > 0){
                                        if(this.intersect(tankEntity[i])==true){
                                            SelDirection(weak,tankEntity[i],0)
                                        }else{ 
                                            if(escapeFlg == false){
                                                if(Math.sqrt(Math.pow(weak.x - target.x, 2) + Math.pow(weak.y - target.y, 2)) < cateDistances[category]){
                                                    SelDirection(weak,target,0)
                                                }else{
                                                    if(game.time % 10 == 0 && rootFlg == true){
                                                        SelDirection(weak,target,1) 
                                                    }
                                                   
                                                }
                                                
                                                
                                            }else{
                                                SelDirection(weak,escapeTarget,0);
                                            }
                                        }
                                    }
                                }
                            }
                            if(shotStopFlg == false){
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
                            }
                            
                            
                            /* 戦車本体の角度 */
                            if(moveSpeed > 0){
                                this.rotation = rot;
                                tank.rotation = rot;
                                weak.rotation = rot;
                            }
                            for(let i = 0; i < tankDir.length; i++){
                                if(deadFlgs[i]==false && i != Num){
                                    if(this.intersect(tankDir[i][0])==true){
                                        this.moveTo(this.x,tankDir[i][0].y-60)
                                    }
                                    if(this.intersect(tankDir[i][1])==true){
                                        this.moveTo(this.x,tankDir[i][1].y+(tankDir[i][1].height))
                                    }
                                    if(this.intersect(tankDir[i][2])==true){
                                        this.moveTo(tankDir[i][2].x-60,this.y)
                                    }
                                    if(this.intersect(tankDir[i][3])==true){
                                        this.moveTo(tankDir[i][3].x+(tankDir[i][3].width),this.y)
                                    }
                                }
                            }
                            for(let i = 0; i < obsdir.length; i++){
                                if(this.intersect(obsdir[i][0])==true && obsChk[i][0]==true){
                                    this.moveTo(this.x,obsdir[i][0].y-60)
                                    hittingTime++;
                                    now = value;
                                }
                                if(this.intersect(obsdir[i][1])==true && obsChk[i][1]==true){
                                    this.moveTo(this.x,obsdir[i][1].y+(obsdir[i][1].height))
                                    hittingTime++;
                                    now = value;
                                }
                                if(this.intersect(obsdir[i][2])==true && obsChk[i][2]==true){
                                    this.moveTo(obsdir[i][2].x-60,this.y)
                                    hittingTime++;
                                    now = value;
                                }
                                if(this.intersect(obsdir[i][3])==true && obsChk[i][3]==true){
                                    this.moveTo(obsdir[i][3].x+(obsdir[i][3].width),this.y)
                                    hittingTime++;
                                    now = value;
                                }
                            }
                            if(this.intersect(walls[0])==true){
                                this.moveTo(this.x,(64*2)-16)
                                hittingTime++;
                                now = value;
                            }
                            if(this.intersect(walls[1])==true){
                                this.moveTo(this.x,(64*13)-12)
                                hittingTime++;
                                now = value;
                            }
                            if(this.intersect(walls[2])==true){
                                this.moveTo((64*1),this.y)
                                hittingTime++;
                                now = value;
                            }
                            if(this.intersect(walls[3])==true){
                                this.moveTo((64*18)+3,this.y)
                                hittingTime++;
                                now = value;
                            }
                        }
                    }
                    
                    
                }
            }
            scene.insertBefore(this,tank)
        }
    });
    var AnotherElite = Class.create(Sprite,{
        initialize: function(x,y,path1,path2,target,max,ref,shotSpeed,moveSpeed,fireLate,grade,category,scene,filterMap){
            Sprite.call(this, pixelSize-4, pixelSize-4)
            this.x = x*pixelSize;
            this.y = y*pixelSize-48;
            this.time = 0;

            var emax = max;
            const Num = entVal;
            entVal++;
            bullets[Num] = 0;
            boms[Num] = 0;
            deadFlgs.push(false)
            
            const cannon = new Cannon(this,path2,Num,scene,filterMap)
            const tank = new Tank(this,path1,Num,scene,cannon)
            const weak = new Weak(this,Num,scene)
            TankFrame(this,Num,scene)

            cannon.rotation = 0;
            markEntity[Num] = null;

            const intercept7 = new InterceptC(cannon,scene)
            const anoPoint = new AnotherPoint(target,Num,scene)
            var shotNGflg = false;
            let reloadTime = 0;
            let reloadFlg = false;
            let aimingTime = 0;
            let aimRot = 1.2;

            let life = 1;

            enemyTarget[Num] = target;

            for(var i = 0; i < emax; i++){
                colOb[Num][i] = new BulletCol(anoPoint,cannon,shotSpeed,grade,Num,scene,i);
                bulOb[Num][i] = new Bullet(colOb[Num][i],cannon,ref,Num,emax,shotSpeed,scene,i);
                bulStack[Num][i] = false;
                colOb[Num][i].moveTo(-230,-230)
                bulOb[Num][i].moveTo(-100,-100)
            }

            bomOb[Num][0] = new Bom(this,Num,scene);

            var EnemyAim = Class.create(AnotherAim,{
                initialize: function(){
                    if(pauseFlg == false){
                        AnotherAim.call(this,anoPoint,cannon,ref,Num,scene);
                    }
                    
                }
            })

            function ShotBullet(i){
                game.assets['./sound/s_car_door_O2.wav'].clone().play();
                if(shotSpeed >= 12){
                    game.assets['./sound/Sample_0003.wav'].clone().play();
                }
                scene.insertBefore(colOb[Num][i],filterMap);
                scene.insertBefore(bulOb[Num][i],filterMap);
                new OpenFire(cannon,anoPoint,scene,filterMap)
                bullets[Num]++;  
                bulStack[Num][i] = true;
                shotStopFlg = true;
            }

            if(addBullet != 0 && fireLate > 19) fireLate = fireLate - ((fireLate/5)*2); 
            
            this.onenterframe = function(){
                if(deleteFlg == true){
                    this.moveTo(-100,-100)
                    scene.removeChild(intercept7);
                    scene.removeChild(tank)
                    scene.removeChild(cannon)
                    scene.removeChild(weak)
                    scene.removeChild(this)
                }
                if(life > 0){
                    //  死亡判定処理
                    for(var j = 0; j < bulOb.length; j++){
                        for(var k = 0; k < bulOb[j].length; k++){
                            let dist = Math.sqrt(Math.pow(weak.x - bulOb[j][k].x, 2) + Math.pow(weak.y - bulOb[j][k].y, 2));
                            if(defeat == false && (dist < 30 || this.intersect(bulOb[j][k])==true) && bulStack[j][k] == true){
                                game.assets['./sound/mini_bomb2.mp3'].clone().play();
                                deadFlgs[Num] = true
                                bulStack[j][k] = false;
                                colOb[j][k].destroy()
                                colOb[j][k].moveTo(-200,-200)
                                bulOb[j][k].moveTo(-200,-200)
                                moveSpeed = 0;
                            }
                            /*if((this.within(bulOb[j][k],28)==true || weak.intersect(bulOb[j][k])==true) && defeat == false){
                                
                            }*/
                        }
                    }
                    
  
                    if(worldFlg == true){
                        this.time++;

                        if(deadFlgs[0] == false){
                            if(this.time % 10 == 0 && aimingTime > 0 && fireFlgs[Num]==false) aimingTime--;
                            shotNGflg = false;
                            fireFlgs[Num] = false;
                            
                            if(deadFlgs[Num] == true){
                                tankColorCounts[category]--;
                                //alert(tankColorCounts)
                                //markEntity[Num] = new Mark(this.x,this.y,target,scene)   //  撃破後の物体設置
                                new Explosion(this,scene);
                                this.moveTo(-100,-100)
                                destruction++
                                life--;
                            }
                            new EnemyAim();
                            EnemyAim.intersect(target).forEach(function(){
                                fireFlgs[Num] = true;
                                aimingTime++;
                            })
                            if(aimingTime % 5 == 0 && aimingTime > 0){
                                aimRot *= -1;
                            }
                            if(fireFlgs[Num] == false)cannon.rotation += aimRot;

                            if(this.time % 5 == 0){

                                if(reloadFlg == false){
                                    if(bullets[Num] == emax) reloadFlg = true;
                                }else{
                                    if(reloadTime < cateReloadTimes[category]){
                                        reloadTime++;
                                        if(shotNGflg == false) shotNGflg = true;
                                    }else{
                                        shotNGflg = false;
                                        reloadFlg = false;
                                        reloadTime = 0;
                                    }
                                    
                                }

                                if(game.time % fireLate == 0 && shotNGflg == false && aimingTime > 30){
                                    if(Math.floor(Math.random() * emax*2)>bullets[Num]){
                                        for(let i = 0; i < emax; i++){
                                            if(bulStack[Num][i] == false){
                                                if(bullets[Num] < emax && deadFlgs[Num] == false && fireFlgs[Num]==true){
                                                    colOb[Num][i] = new BulletCol(anoPoint,cannon,shotSpeed,0,Num,scene,i);
                                                    bulOb[Num][i] = new Bullet(colOb[Num][i],cannon,ref,Num,emax,shotSpeed,scene,i)
                                                    ShotBullet(i);
                                                    aimingTime = 0;
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                               
                                for(let i = 0; i < tankDir.length; i++){
                                    if(deadFlgs[i]==false && i != Num){
                                        if(this.intersect(tankDir[i][0])==true){
                                            this.moveTo(this.x,tankDir[i][0].y-60)
                                        }
                                        if(this.intersect(tankDir[i][1])==true){
                                            this.moveTo(this.x,tankDir[i][1].y+(tankDir[i][1].height))
                                        }
                                        if(this.intersect(tankDir[i][2])==true){
                                            this.moveTo(tankDir[i][2].x-60,this.y)
                                        }
                                        if(this.intersect(tankDir[i][3])==true){
                                            this.moveTo(tankDir[i][3].x+(tankDir[i][3].width),this.y)
                                        }
                                    }
                                }
                                for(let i = 0; i < obsdir.length; i++){
                                    if(this.intersect(obsdir[i][0])==true && obsChk[i][0]==true){
                                        this.moveTo(this.x,obsdir[i][0].y-60)
                                    }
                                    if(this.intersect(obsdir[i][1])==true && obsChk[i][1]==true){
                                        this.moveTo(this.x,obsdir[i][1].y+(obsdir[i][1].height))
                                    }
                                    if(this.intersect(obsdir[i][2])==true && obsChk[i][2]==true){
                                        this.moveTo(obsdir[i][2].x-60,this.y)
                                    }
                                    if(this.intersect(obsdir[i][3])==true && obsChk[i][3]==true){
                                        this.moveTo(obsdir[i][3].x+(obsdir[i][3].width),this.y)
                                    }
                                }
                                if(this.intersect(walls[0])==true){
                                    this.moveTo(this.x,walls[0].y+walls[0].height)
                                }
                                if(this.intersect(walls[1])==true){
                                    this.moveTo(this.x,walls[1].y-walls[1].height+2)
                                }
                                if(this.intersect(walls[2])==true){
                                    this.moveTo(walls[2].x+walls[2].width,this.y)
                                }
                                if(this.intersect(walls[3])==true){
                                    this.moveTo(walls[3].x-walls[3].width+2,this.y)
                                }
                            }
                        }
                    }
                    
                    
                }
            }
            scene.insertBefore(this,tank)
        }
    });
    /* 強敵クラス */
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
            
            const cannon = new Cannon(this,cannonPath,Num,scene,filterMap)
            const tank = new Tank(this,tankPath,Num,scene,cannon)
            const weak = new Weak(this,Num,scene)
            TankFrame(this,Num,scene)

            markEntity[Num] = null;

            tank.opacity = 1.0;
            cannon.opacity = 1.0;
            
            const intercept3 = new Intercept192(this,scene)
            const intercept4 = new Intercept600(this,scene)
            const intercept5 = new InterceptA(cannon,scene)
            const intercept6 = new InterceptB(cannon,scene)
            const intercept7 = new InterceptC(cannon,scene)
            const intercept8 = new Intercept96(this,scene)
            var value = 0;
            var rot = 0;
            var emax = max
            var speed = moveSpeed;
            var stopFlg = false;
            var dflg = false;
            var defenseMax = parseInt(max/2)-1;
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

            if(moveSpeed != 0){
                speed = moveSpeed + addSpeed;
                if(stageNum >= 20 && grade < 10){
                    speed = speed + (0.2*(stageNum / 20));
                }
            }
            
            if(category == 2 && addBullet != 0){
                ref = ref+addBullet;
            }

            enemyTarget[Num] = target;
            var alignment = new Target(Num,scene)

            for(var i = 0; i < max+defenseMax; i++){
                colOb[Num][i] = new BulletCol(alignment,cannon,shotSpeed,grade,Num,scene,i);
                bulOb[Num][i] = new Bullet(colOb[Num][i],cannon,ref,Num,max,shotSpeed,scene,i);
                bulStack[Num][i] = false;
                colOb[Num][i].moveTo(-250,-250)
                bulOb[Num][i].moveTo(-100,-100)
            }

            bomOb[Num][0] = new Bom(this,Num,scene);

            var EnemyAim = Class.create(Aim,{
                initialize: function(target,shotSpeed,num,scene){
                    Aim.call(this,target,cannon,15,num,scene);
                }
            })
            if(addBullet != 0){
                if(shotSpeed < 14) shotSpeed += 1; 
                if(fireLate > 19) fireLate = fireLate - ((fireLate/5)*2);
            }

            function SelDirection(target1,target2,or){
                if(or == 0){
                    if(Math.floor(Math.random() * 2) == 0){
                        if((target1.x + target1.width/2) > (target2.x + target2.width/2)){
                            if((target1.y + target1.height/2) > (target2.y + target2.height/2)){
                                while(value == 0 || value == 2 || value == 4) value = Math.floor(Math.random() * 8);
                            }else{
                                while(value == 0 || value == 3 || value == 6) value = Math.floor(Math.random() * 8);
                            }
                        }else{
                            if((target1.y + target1.height/2) > (target2.y + target2.height/2)){
                                while(value == 1 || value == 2 || value == 5) value = Math.floor(Math.random() * 8);
                            }else{
                                while(value == 1 || value == 3 || value == 7) value = Math.floor(Math.random() * 8);
                            }
                        }
                    }else{
                        if((target1.x + target1.width/2) > (target2.x + target2.width/2)){
                            if((target1.y + target1.height/2) > (target2.y + target2.height/2)){
                                while(value == 0 || value == 2) value = Math.floor(Math.random() * 8);
                            }else{
                                while(value == 0 || value == 3) value = Math.floor(Math.random() * 8);
                            }
                        }else{
                            if((target1.y + target1.height/2) > (target2.y + target2.height/2)){
                                while(value == 1 || value == 2) value = Math.floor(Math.random() * 8);
                            }else{
                                while(value == 1 || value == 3) value = Math.floor(Math.random() * 8);
                            }
                        }
                    }
                    /*if((target1.x + target1.width/2) > (target2.x + target2.width/2)){
                        if((target1.y + target1.height/2) > (target2.y + target2.height/2)){
                            while(value == 0 || value == 2 || value == 4) value = Math.floor(Math.random() * 8);
                        }else{
                            while(value == 0 || value == 3 || value == 6) value = Math.floor(Math.random() * 8);
                        }
                    }else{
                        if((target1.y + target1.height/2) > (target2.y + target2.height/2)){
                            while(value == 1 || value == 2 || value == 5) value = Math.floor(Math.random() * 8);
                        }else{
                            while(value == 1 || value == 3 || value == 7) value = Math.floor(Math.random() * 8);
                        }
                    }*/
                    /*if(weakX-2.75 > targetX){
                        if(weakY-2.75 > targetY){
                            while(value == 0 || value == 2 || value == 4) value = Math.floor(Math.random() * 8);
                        }
                        else{
                            while(value == 0 || value == 3 || value == 6) value = Math.floor(Math.random() * 8);
                        }
                    }else{
                        if(weakY-2.75 > targetY){
                            while(value == 1 || value == 2 || value == 5) value = Math.floor(Math.random() * 8);
                        }
                        else{
                            while(value == 1 || value == 3 || value == 7) value = Math.floor(Math.random() * 8);
                        }
                    }*/
                }else if(or == 1){
                    if(Math.floor(Math.random() * 2) == 0){
                        if((target1.x + target1.width/2) > (target2.x + target2.width/2)){
                            if((target1.y + target1.height/2) > (target2.y + target2.height/2)){
                                while(value == 1 || value == 3 || value == 7) value = Math.floor(Math.random() * 8);
                            }
                            else{
                                while(value == 1 || value == 2 || value == 5) value = Math.floor(Math.random() * 8);
                            }
                                
                        }else{
                            if((target1.y + target1.height/2) > (target2.y + target2.height/2)){
                                while(value == 0 || value == 3 || value == 6) value = Math.floor(Math.random() * 8);
                            }
                            else{
                                while(value == 0 || value == 2 || value == 4) value = Math.floor(Math.random() * 8);
                            }
                        }
                    }else{
                        if((target1.x + target1.width/2) > (target2.x + target2.width/2)){
                            if((target1.y + target1.height/2) > (target2.y + target2.height/2)){
                                while(value == 1 || value == 3) value = Math.floor(Math.random() * 8);
                            }
                            else{
                                while(value == 1 || value == 2) value = Math.floor(Math.random() * 8);
                            }
                                
                        }else{
                            if((target1.y + target1.height/2) > (target2.y + target2.height/2)){
                                while(value == 0 || value == 3) value = Math.floor(Math.random() * 8);
                            }
                            else{
                                while(value == 0 || value == 2) value = Math.floor(Math.random() * 8);
                            }
                        }
                    }
                    
                }
            }
            function ShotBullet(i){
                game.assets['./sound/s_car_door_O2.wav'].clone().play();
                if(shotSpeed >= 12){
                    game.assets['./sound/Sample_0003.wav'].clone().play();
                }
                scene.insertBefore(colOb[Num][i],filterMap);
                scene.insertBefore(bulOb[Num][i],filterMap);
                new OpenFire(cannon,alignment,scene,filterMap)
                bullets[Num]++;  
                bulStack[Num][i] = true;
                shotStopFlg = true;
            }
            function Instrumentation(target1,target2){
                let dist1 = Math.sqrt(Math.pow(weak.x - target1.x, 2) + Math.pow(weak.y - target1.y, 2));
                let dist2 = Math.sqrt(Math.pow(weak.x - target2.x, 2) + Math.pow(weak.y - target2.y, 2));
                if(dist1 > dist2){
                    return dist2;
                }else{
                    return null;
                }
                
            }
            this.onenterframe = function(){
                
                if(deleteFlg == true){
                    this.moveTo(-100,-100)
                    scene.removeChild(intercept3);
                    scene.removeChild(intercept4);
                    scene.removeChild(intercept5);
                    scene.removeChild(intercept6);
                    scene.removeChild(intercept7);
                    scene.removeChild(intercept8);
                    scene.removeChild(tank)
                    scene.removeChild(cannon)
                    scene.removeChild(weak)
                    scene.removeChild(this)
                }    
                if(life > 0){
                    //  死亡判定処理
                    for(var j = 0; j < bulOb.length; j++){
                        for(var k = 0; k < bulOb[j].length; k++){
                            let dist = Math.sqrt(Math.pow(weak.x - bulOb[j][k].x, 2) + Math.pow(weak.y - bulOb[j][k].y, 2));
                            if(defeat == false && (dist < 30 || this.intersect(bulOb[j][k])==true) && bulStack[j][k] == true){
                                game.assets['./sound/mini_bomb2.mp3'].clone().play();
                                deadFlgs[Num] = true
                                bulStack[j][k] = false;
                                colOb[j][k].destroy()
                                colOb[j][k].moveTo(-200,-200)
                                bulOb[j][k].moveTo(-200,-200)
                                moveSpeed = 0;
                            }
                            /*if((this.within(bulOb[j][k],28)==true || weak.intersect(bulOb[j][k])==true) && defeat == false){
                                
                            }*/
                        }
                    }
                    if(shotStopFlg == true){
                        shotStopTime++;
                        if(shotStopTime > 10){
                            shotStopFlg = false;
                            shotStopTime = 0;
                        }
                    }

                    
                    
                    
                    if(worldFlg == true){
                        this.time++;

                        if(deadFlgs[0] == false){
                            if(intercept8.rotation != this.rotation+45)intercept8.rotation = this.rotation+45;

                            if(hittingTime>15 && escapeFlg == false){
                                let val = value;
                                if(grade > 9){
                                    while(value == val) value = Math.floor(Math.random() * 8);
                                }else{
                                    while(value == val) value = Math.floor(Math.random() * 4);
                                }
                                hittingTime = 0;
                            }
                            

                            
                            
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
                                    if(stageNum >= 20 && grade < 10){
                                        speed = speed + (0.2*(stageNum / 20));
                                    }
                                    if(stopFlg == false){
                                        if(grade == 13){
                                            speed = speed + 1.2;
                                        }else if(grade >= 10){
                                            speed = speed + 0.8;
                                        }
                                    }
                                }
                            }
                            
                            if(this.time % 2 == 0){
                                dflg = false;
                                stopFlg = false;
                                escapeFlg = false;
                                if(tank.opacity != opaVal){
                                    tank.opacity = opaVal;
                                    cannon.opacity = opaVal;
                                }
                                fireFlgs[Num] = false;
                                enemyTarget[Num] = target;
                                if(category == 6){
                                    if(this.time % 600 == 0 && addBullet == 0){
                                        opaFlg = true;
                                    }
                                    if(Math.sqrt(Math.pow(weak.x - target.x, 2) + Math.pow(weak.y - target.y, 2)) < 300) opaFlg = true;
                                    if(opaFlg == false && opaVal > 0){
                                        opaVal-=0.05
                                        if(opaVal <= 0){
                                            opaVal = 0
                                        }
                                    }else if(opaFlg == true && opaVal <= 1.0){
                                        opaVal += 0.1;
                                        if(opaVal >= 1.0){
                                            opaVal = 1.0;
                                            opaFlg = false;
                                        }
                                    }
                                }else if(grade == 11){
                                    if(Math.sqrt(Math.pow(weak.x - target.x, 2) + Math.pow(weak.y - target.y, 2)) < 400){
                                        opaFlg = true;
                                    }
                                    if(opaFlg == false && opaVal > 0){
                                        opaVal-=0.05
                                        
                                        if(opaVal <= 0){
                                            opaVal = 0
                                        }
                                    }else if(opaFlg == true && opaVal <= 1.0){
                                        opaVal += 0.25;

                                        if(opaVal >= 1.0){
                                            opaVal = 1.0;
                                            opaFlg = false;
                                        }
                                    }
                                }
                            }
                            

                            new EnemyAim(alignment,12,Num,scene);
      
                            if(deadFlgs[Num] == true){
                                tankColorCounts[category]--;
                               //markEntity[Num] = new Mark(this.x,this.y,target,scene)   //  撃破後の物体設置
                                new Explosion(this,scene);
                                this.moveTo(-100,-100)
                                destruction++
                                life--;
                            }
                            
                            /*avoids.forEach(elem=>{
                                if(tank.within(elem,64)==true){
                                    stopFlg = true;
                                }
                            })*/
                            
                            if(game.time % 5 == 0){
                                for(var i = 0; i < tankEntity.length; i++){
                                    if(i != Num && deadFlgs[i]==false && moveSpeed > 0){
                                        
                                        if(intercept8.intersect(tankEntity[i])==true){
                                            SelDirection(weak,tankEntity[i],0);
                                        }else{
                                            if(escapeFlg == false){
                                                let dist = Math.sqrt(Math.pow(weak.x - target.x, 2) + Math.pow(weak.y - target.y, 2));
                                                if(dist < cateDistances[category]){
                                                    SelDirection(weak,target,0)
                                                }else{
                                                    SelDirection(weak,target,1) 
                                                }
                                            }
                                            else{
                                                SelDirection(weak,enemyTarget[Num],0);
                                            }
                                        }
                                    }
                                }
                            }        
                            
                            if(shotStopFlg == false){
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
                            }
                            
                                
                            tank.intersect(PlayerBulAim).forEach(function(){
                                dflg = true;
                            })
                            tank.intersect(EnemyAim).forEach(function(){
                                dflg = true;
                            })
                            /* 迎撃処理群
                                優先順位：自身の弾＞プレイヤーの弾＞他戦車の弾
                            */
                            //  他戦車の弾迎撃処理
                            if(cateFlgs[category][2] == true){
                                for(let i = 1; i < bulOb.length; i++){
                                    if(i != Num){
                                        for(let j = 0; j < bulOb[i].length; j++){
                                            if(bulStack[i][j] == true){
                                                let dist = Instrumentation(enemyTarget[Num],bulOb[i][j]);
                                                if(dist != null){
                                                    if(
                                                        (intercept5.intersect(bulOb[i][j])==true ||
                                                         intercept6.intersect(bulOb[i][j])==true ||
                                                         intercept3.intersect(bulOb[i][j])==true)&& grade >= 10){
                                                        enemyTarget[Num] = bulOb[i][j]
                                                        alignment.moveTo(bulOb[i][j].x,bulOb[i][j].y)
                                                        new EnemyAim(alignment,32,Num,scene);
                                                        
                                                        if(this.time % 5 == 0){
                                                            SelDirection(weak,bulOb[i][j],0);
                                                        }  
                                                    }else if(dist < cateRanges[category][2]){
                                                        tank.intersect(BulAim).forEach(function(){
                                                            if(cateEscapes[category][0]==true && cateEscapes[category][3] != 0){
                                                                if(dist < cateEscapes[category][3]) escapeFlg = true;
                                                            }
                                                            if(cateEscapes[category][3] != 0)enemyTarget[Num] = bulOb[i][j];    //  迎撃のためにターゲット変更
                                                            if(this.time % 5 == 0){
                                                                SelDirection(weak,bulOb[i][j],0)
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
                            if(cateFlgs[category][0] == true){
                                for(let i = 0; i < bulOb[0].length; i++){
                                    if(bulStack[0][i] == true){
                                        let dist = Instrumentation(enemyTarget[Num],bulOb[0][i]);
                                        if(dist != null){
                                            
                                            if(dist < cateRanges[category][0]){
                                                if(cateEscapes[category][0] == true && cateEscapes[category][1] != 0){
                                                    if(dist < cateEscapes[category][1]){
                                                        escapeFlg = true;
                                                        if(this.time % 5 == 0) SelDirection(weak,bulOb[0][i],0);
                                                    }
                                                }
                                                this.intersect(PlayerBulAim).forEach(function(){
                                                    if(dist < cateEscapes[category][1]){
                                                        enemyTarget[Num] = bulOb[0][i];
                                                        if(grade >= 10){
                                                            alignment.moveTo(bulOb[0][i].x,bulOb[0][i].y)
                                                            new EnemyAim(alignment,32,Num,scene);
                                                        }
                                                    } 
                                                    if(this.time % 5 == 0){
                                                        SelDirection(weak,bulOb[0][i],0)
                                                    }
                                                })
                                                
                                            }
                                            if(grade == 13){
                                                if(intercept5.intersect(bulOb[0][i])==true || intercept6.intersect(bulOb[0][i])==true || intercept3.intersect(bulOb[0][i])==true || dist < 250){
                                                    enemyTarget[Num] = bulOb[0][i];
                                                    alignment.moveTo(bulOb[0][i].x,bulOb[0][i].y)
                                                    new EnemyAim(alignment,32,Num,scene);
                                                    
                                                    if(this.time % 3 == 0){
                                                        SelDirection(weak,bulOb[0][i],0);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }    
                            //  自身の弾迎撃処理
                            if(cateFlgs[category][1] == true){
                                for(let i = 0; i < bulOb[Num].length; i++){
                                    if(bulStack[Num][i] == true){
                                        let dist = Instrumentation(enemyTarget[Num],bulOb[Num][i]);
                                        if(dist != null){
                                            if(dist < cateRanges[category][1]){
                                                if(cateEscapes[category][0]==true && cateEscapes[category][2] != 0){
                                                    if(dist < cateEscapes[category][2]){
                                                        this.intersect(BulAim).forEach(function(){
                                                            escapeFlg = true;
                                                            if(this.time % 5 == 0) SelDirection(weak,bulOb[Num][i],0);
                                                        })
                                                        if(grade == 13){
                                                            enemyTarget[Num] = bulOb[Num][i];
                                                            alignment.moveTo(bulOb[Num][i].x,bulOb[Num][i].y)
                                                            new EnemyAim(alignment,32,Num,scene);
                                                        }
                                                    }
                                                }
                                                if(grade == 13){
                                                    if(dist < 400){
                                                        this.intersect(BulAim).forEach(function(){
                                                            enemyTarget[Num] = bulOb[Num][i];
                                                            alignment.moveTo(bulOb[Num][i].x,bulOb[Num][i].y)
                                                            new EnemyAim(alignment,32,Num,scene);
                                                        })
                                                    }
                                                }else if(grade >= 10){
                                                    if(dist < 180 && bullets[Num]>0 && bullets[Num] < max/2){
                                                        escapeFlg = true;
                                                        enemyTarget[Num] = bulOb[Num][i];
                                                        alignment.moveTo(bulOb[Num][i].x,bulOb[Num][i].y)
                                                        new EnemyAim(alignment,32,Num,scene);
                                                        fireFlgs[Num] = true;
                                                    }
                                                }
                                                this.intersect(BulAim).forEach(function(){
                                                    enemyTarget[Num] = bulOb[Num][i];
                                                    if(grade >= 10 || category == 7){
                                                        alignment.moveTo(bulOb[Num][i].x,bulOb[Num][i].y)
                                                        new EnemyAim(alignment,32,Num,scene);
                                                    }
                                                    if(this.time % 5 == 0){
                                                        SelDirection(weak,bulOb[Num][i],0);
                                                    }
                                                })
                                                
                                            } 
                                        }
                                    }
                                }
                            }    
                                
                            alignment.intersect(EnemyAim).forEach(function(){
                                fireFlgs[Num] = true;
                            })
                            for(let i = 1; i < tankEntity.length; i++){
                                if(i != Num && deadFlgs[i]==false){
                                    if(intercept7.intersect(tankEntity[i])==true){
                                        fireFlgs[Num] = false;
                                    }
                                }
                            }

                            if(reloadFlg == false){
                                if(bullets[Num] == emax) reloadFlg = true;
                            }else{
                                if(reloadTime < cateReloadTimes[category]){
                                    reloadTime++;
                                    if(shotNGflg == false) shotNGflg = true;
                                }else{
                                    shotNGflg = false;
                                    reloadFlg = false;
                                    reloadTime = 0;
                                }
                                
                            }
                            
                            if(fireFlgs[Num]==true && intercept7.intersect(Floor)==false){
                                if(grade >= 10){
                                    if(grade == 13){
                                        if(dflg == true || escapeFlg == true){
                                            if((bullets[Num] < emax+defenseMax && deadFlgs[Num] == false) && (this.time % 13 == 0 || this.time % 25 == 0)){
                                                for(let i = 0; i < emax+defenseMax; i++){
                                                    if(bulStack[Num][i] == false){
                                                        colOb[Num][i] = new BulletCol(alignment,cannon,15,10,Num,scene,i);
                                                        bulOb[Num][i] = new Bullet(colOb[Num][i],cannon,0,Num,emax+defenseMax,15,scene,i)
                                                        ShotBullet(i);
                                                        break;
                                                    }
                                                } 
                                            } 
                                        }else{
                                            if(Math.floor(Math.random() * emax*2)>bullets[Num] && game.time % fireLate == 0){
                                                if(bullets[Num] < emax && deadFlgs[Num] == false){
                                                    for(let i = 0; i < emax; i++){
                                                        if(bulStack[Num][i] == false){
                                                            colOb[Num][i] = new BulletCol(alignment,cannon,shotSpeed,11,Num,scene,i);
                                                            bulOb[Num][i] = new Bullet(colOb[Num][i],cannon,1,Num,emax,shotSpeed,scene,i)
                                                            ShotBullet(i);
                                                            break;
                                                        }
                                                    }
                                                }
                                            } 
                                        }
                                    }else if(grade == 11){
                                        if(dflg == false){
                                            if(Math.floor(Math.random() * emax*2)>bullets[Num] && game.time % fireLate == 0){
                                                if(bullets[Num] < emax && deadFlgs[Num] == false){
                                                    for(let i = 0; i < emax; i++){
                                                        if(bulStack[Num][i] == false){
                                                            colOb[Num][i] = new BulletCol(alignment,cannon,shotSpeed,grade,Num,scene,i);
                                                            bulOb[Num][i] = new Bullet(colOb[Num][i],cannon,Math.floor(Math.random() * (ref)),Num,emax,shotSpeed,scene,i)
                                                            ShotBullet(i);
                                                            opaFlg = true;
                                                            break;
                                                        }
                                                    }
                                                }
                                            }else{
                                                if(bullets[Num] < emax+defenseMax && deadFlgs[Num] == false && game.time % 10 == 0){
                                                    for(let i = 0; i < emax+defenseMax; i++){
                                                        if(bulStack[Num][i] == false){
                                                            colOb[Num][i] = new BulletCol(alignment,cannon,shotSpeed,10,Num,scene,i);
                                                            bulOb[Num][i] = new Bullet(colOb[Num][i],cannon,0,Num,emax+defenseMax,shotSpeed,scene,i)
                                                            ShotBullet(i);
                                                            opaFlg = true;
                                                            break;
                                                        }
                                                    }
                                                }  
                                            }
                                        }
                                    }else if(grade == 10 && dflg == true){
                                        if(bullets[Num] < emax+defenseMax && deadFlgs[Num] == false && game.time % 10 == 0){
                                            for(let i = 0; i < emax+defenseMax; i++){
                                                if(bulStack[Num][i] == false){
                                                    colOb[Num][i] = new BulletCol(alignment,cannon,shotSpeed,10,Num,scene,i);
                                                    bulOb[Num][i] = new Bullet(colOb[Num][i],cannon,0,Num,emax+defenseMax,shotSpeed,scene,i)
                                                    ShotBullet(i);
                                                    break;
                                                }
                                            }
                                        } 
                                    }else{
                                        if(Math.floor(Math.random() * emax*2)>bullets[Num] && game.time % fireLate == 0){
                                            if(bullets[Num] < emax && deadFlgs[Num] == false){
                                                for(let i = 0; i < emax; i++){
                                                    if(bulStack[Num][i] == false){
                                                        colOb[Num][i] = new BulletCol(alignment,cannon,shotSpeed,grade-1,Num,scene,i);
                                                        bulOb[Num][i] = new Bullet(colOb[Num][i],cannon,Math.floor(Math.random() * (ref)),Num,emax,shotSpeed,scene,i)
                                                        ShotBullet(i);
                                                        break;
                                                    }
                                                }
                                            } 
                                        }
                                    }
                                }
                                else{
                                    if(shotNGflg == false){
                                        if(Math.floor(Math.random() * emax*2)>bullets[Num] && game.time % fireLate == 0){
                                            if(bullets[Num] < emax && deadFlgs[Num] == false){
                                                for(let i = 0; i < emax; i++){
                                                    if(bulStack[Num][i] == false){
                                                        if(category == 7 && bullets[Num]==0 && dflg == false){
                                                            if(Math.floor(Math.random() * 5) == 0){
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
                                                                const vector = {
                                                                    x: alignment.x - cannon.x-64,
                                                                    y: alignment.y - cannon.y-32
                                                                };
                                                                let rad = Math.atan2(vector.y, vector.x);
                                                                alignment.moveTo((cannon.x+(200)*Math.cos(rad)+(20*r1)), (cannon.y+(200)*Math.sin(rad)+(20*r2)));
                                                                new EnemyAim(alignment,32,Num,scene);
                                                            }
                                                        }
                                                        if(dflg == true){
                                                            colOb[Num][i] = new BulletCol(alignment,cannon,shotSpeed,10,Num,scene,i);
                                                        }else{
                                                            colOb[Num][i] = new BulletCol(alignment,cannon,shotSpeed,grade-4,Num,scene,i);
                                                        }
                                                        bulOb[Num][i] = new Bullet(colOb[Num][i],cannon,ref,Num,emax,shotSpeed,scene,i)
                                                        ShotBullet(i);
                                                        if(category == 6 && opaVal == 0){
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
                            /* 戦車本体の角度 */
                            if(moveSpeed > 0){
                                this.rotation = rot;
                                tank.rotation = rot;
                                weak.rotation = rot;
                            }
                            for(let i = 0; i < tankDir.length; i++){
                                if(deadFlgs[i]==false && i != Num){
                                    if(this.intersect(tankDir[i][0])==true){
                                        this.moveTo(this.x,tankDir[i][0].y-60)
                                    }
                                    if(this.intersect(tankDir[i][1])==true){
                                        this.moveTo(this.x,tankDir[i][1].y+(tankDir[i][1].height))
                                    }
                                    if(this.intersect(tankDir[i][2])==true){
                                        this.moveTo(tankDir[i][2].x-60,this.y)
                                    }
                                    if(this.intersect(tankDir[i][3])==true){
                                        this.moveTo(tankDir[i][3].x+(tankDir[i][3].width),this.y)
                                    }
                                }
                            }
                            for(let i = 0; i < obsdir.length; i++){
                                if(this.intersect(obsdir[i][0])==true && obsChk[i][0]==true){
                                    this.moveTo(this.x,obsdir[i][0].y-60)
                                    hittingTime++;
                                }
                                if(this.intersect(obsdir[i][1])==true && obsChk[i][1]==true){
                                    this.moveTo(this.x,obsdir[i][1].y+(obsdir[i][1].height))
                                    hittingTime++;
                                }
                                if(this.intersect(obsdir[i][2])==true && obsChk[i][2]==true){
                                    this.moveTo(obsdir[i][2].x-60,this.y)
                                    hittingTime++;
                                }
                                if(this.intersect(obsdir[i][3])==true && obsChk[i][3]==true){
                                    this.moveTo(obsdir[i][3].x+(obsdir[i][3].width),this.y)
                                    hittingTime++;
                                }
                            }
                            if(this.intersect(walls[0])==true){
                                this.moveTo(this.x,walls[0].y+walls[0].height)
                                hittingTime++;
                            }
                            if(this.intersect(walls[1])==true){
                                this.moveTo(this.x,walls[1].y-walls[1].height+2)
                                hittingTime++;
                            }
                            if(this.intersect(walls[2])==true){
                                this.moveTo(walls[2].x+walls[2].width,this.y)
                                hittingTime++;
                            }
                            if(this.intersect(walls[3])==true){
                                this.moveTo(walls[3].x-walls[3].width+2,this.y)
                                hittingTime++;
                            }
                        }
                    }
                    
                }
            }
            scene.insertBefore(this,tank)
        }
    });
    /* アイコン用戦車クラス */
    var PictureTank = Class.create(Sprite,{
        initialize: function(x,y,tankPath,cannonPath,scene){
            Sprite.call(this, pixelSize-4, pixelSize-4)
            this.x = x*pixelSize;
            this.y = y*pixelSize-32;

            new Tank(this,tankPath,0,scene)
            new Cannon(this,cannonPath,0,scene)

            scene.addChild(this)
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
    function isFullScreen() {
        if ((document.fullscreenElement !== undefined && document.fullscreenElement !== null) || // HTML5 標準
            (document.mozFullScreenElement !== undefined && document.mozFullScreenElement !== null) || // Firefox
            (document.webkitFullscreenElement !== undefined && document.webkitFullscreenElement !== null) || // Chrome・Safari
            (document.webkitCurrentFullScreenElement !== undefined && document.webkitCurrentFullScreenElement !== null) || // Chrome・Safari (old)
            (document.msFullscreenElement !== undefined && document.msFullscreenElement !== null)){ // IE・Edge Legacy
            return true; // fullscreenElement に何か入ってる = フルスクリーン中
        } else {
            return false; // フルスクリーンではない or フルスクリーン非対応の環境（iOS Safari など）
        }
    }
    // ゲームの準備が整ったらメインの処理を実行
    game.onload = function() { 
        var world = new PhysicsWorld(0, 0);
        
        var BGM = game.assets['./sound/TITLE.mp3'];
            //BGM.src.loop = true;    

        var createSetUpScene = function() {
            
            var scene = new Scene();                              // 新しいシーンを作る
            scene.time = 0;
            scene.backgroundColor = 'black';                      // シーンの背景色を設定
            let flg = false;
            new DispText(0,440,320*4,40,'Touch to StartUp!','40px sans-serif','white','center',scene)

            scene.addEventListener('touchstart', function(){
                titleFlg = true;
                flg = true;
                new FadeOut(scene)
            })
            
            scene.onenterframe = function(){
                if(flg == true){
                    
                    scene.time++;
                
                    if(scene.time == 30){
                        BGM.play();
                        game.replaceScene(createTitleScene());
                    
                    }
                }
                
            }
            new FadeIn(scene)
            return scene;
        };

        var createTutorialScene = function() {
            game.time = 0;
            worldFlg = false;
            deleteFlg = false;
            let tutorialStage = [
                [
                    [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
                    [7,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,7],
                    [7,144,145,145,145,145,145,145,145,145,145,145,145,145,145,145,145,145,146,7],
                    [7,160,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,162,7],
                    [7,160,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,162,7],
                    [7,160,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,161,162,7],
                    [7,160,161,161,161,161,161,161,7,7,161,161,161,161,161,161,161,161,162,7],
                    [7,160,161,161,161,161,161,161,7,7,161,161,161,161,161,161,161,161,162,7],
                    [7,160,161,161,161,161,161,161,7,7,161,161,161,161,161,161,161,161,162,7],
                    [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
                    [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
                    [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
                    [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
                    [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
                    [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7]
                ],
                [
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,45,45,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,45,45,45,45,45,45,45,-1,-1,45,45,45,45,45,45,45,45,45,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
                ],
                [
                    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                    [1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1],
                    [4,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,4],
                    [4,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,4],
                    [4,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,4],
                    [4,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,4],
                    [4,0,0,0,0,0,0,0,1,1,0,0,3,3,0,0,0,0,0,4],
                    [4,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,4],
                    [4,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,4],
                    [4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4],
                    [4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4],
                    [4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4],
                    [4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4],
                    [4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4],
                    [1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1]
                ]
                
            ]

            var scene = new Scene();                            // 新しいシーンを作る
                scene.time = 0;

            let backgroundMap = new Map(pixelSize, pixelSize);
                backgroundMap.image = game.assets['./image/MapImage/map0.png'];
                backgroundMap.loadData(tutorialStage[0],tutorialStage[1])
                backgroundMap.collisionData = tutorialStage[2];
                scene.addChild(backgroundMap);

                walls[0] = new Wall(18,1,1,1,scene)
                walls[1] = new Wall(18,1,1,14,scene)
                walls[2] = new Wall(1,13,0,1,scene)
                walls[3] = new Wall(1,13,19,1,scene)
                walls[4] = new Wall(24,1,0,15,scene)
            var fy = 0;
            var fx = 0;
    
            var grid = [];
    
            /* 壁の当たり判定設置 */
            backgroundMap.collisionData.forEach(colI => {
                grid[fy] = []
                colI.forEach(colJ => {
                    if(colJ == 0){
                        grid[fy][fx] = 'Empty';
                    }else{
                        if(colJ == 2){
                            avoids.push(new Avoid(fx,fy,scene));
                            grid[fy][fx] = 'Obstacle';
                        }else if(colJ == 3){
                            holes.push(new Hole(fx,fy,scene))
                            grid[fy][fx] = 'Obstacle';
                            Obstracle(holes[holes.length-1],scene)
                        }else{
                            
                            if(colJ == 1){
                                floors.push(new Floor(fx,fy,scene));
                                grid[fy][fx] = 'Obstacle';
                                Obstracle(floors[floors.length-1],scene)
                                RefObstracle(floors[floors.length-1],scene)
                            }else{
                                grid[fy][fx] = 'Obstacle';
                            } 
                        }
                        
                    }
                    fx++;
                });
                fy++;
                fx = 0;
            });
            

            let filterMap = new Map(pixelSize,pixelSize);
                filterMap.image = backgroundMap.image;
            let filImg = tutorialStage[1];
            for(let i = 0; i < tutorialStage[0].length; i++){
                for(let j = 0; j < tutorialStage[0][i].length; j++){
                    if(tutorialStage[0][i][j] == 7){
                        filImg[i][j] = 7
                    }else if(tutorialStage[0][i][j] == 23){
                        filImg[i][j] = 39
                    }
                }
            }
                filterMap.loadData(fmap,filImg);
                scene.addChild(filterMap);

            /* カーソルの設置＆位置取得処理 */
            cur = new Cursor(scene);
            document.addEventListener('mousemove', function(e) {
                cur.x = (e.x-36)*2.70-240;
                cur.y = (e.y)*2.65;
            })
            scene.addEventListener('touchmove',function(e){
                cur.x = (e.x);
                cur.y = (e.y);
            })
    
            /* 戦車の追加処理 */
            bulOb.push([])
            colOb.push([])
            bomOb.push([])
            bulStack.push([])
            tankEntity.push(new Player(4,5,'./image/ObjectImage/tank2.png','./image/ObjectImage/cannon.png',5,1,9,2.2,scene,filterMap))
    
            bulOb.push([])
            colOb.push([])
            bomOb.push([])
            bulStack.push([])
            tankEntity.push(new newAI(15,5,'./image/ObjectImage/brown.png','./image/ObjectImage/browncannon.png',tankEntity[0],0,1,8,0,60,0,0,scene,backgroundMap,grid,filterMap))
            tankColorCounts[0]++;    
            
            new PlayerLabel(tankEntity[0],scene)
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
                tutorialLabel.width = 32*25;
                tutorialLabel.height = 72;
                tutorialLabel.x = pixelSize;
                tutorialLabel.y = pixelSize*14;
                tutorialLabel.text = '※チュートリアル中はStartボタンでタイトルに戻れます';
                tutorialLabel.font = '32px "Arial"';
                tutorialLabel.color = 'yellow';
                tutorialLabel.textAlign = 'left';
            
            
            
            function AllDelete(){
                for(let i = 0; i < obsdir.length; i++){
                    for(let j = 0; j < obsdir[i].length; j++){
                        scene.removeChild(obsdir[i][j])
                    }
                }
                for(let i = 0; i < refdir.length; i++){
                    for(let j = 0; j < refdir[i].length; j++){
                        scene.removeChild(refdir[i][j])
                    }
                }
                for(let i = 0; i < tankDir.length; i++){
                    for(let j = 0; j < tankDir[i].length; j++){
                        scene.removeChild(tankDir[i][j])
                    }
                }
                for(let i = 0; i < tankEntity.length; i++){
                    scene.removeChild(tankEntity[i])
                }
                for(let i = 0; i < markEntity.length; i++){
                    scene.removeChild(markEntity[i])
                }
                bulOb.forEach(elem=>{
                    elem.forEach(elem2=>{
                        scene.removeChild(elem2)
                    })
                })
                for(let i = 0; i < colOb.length; i++){
                    for(let j = 0; j < colOb[i].length; j++){
                        if(bulStack[i][j] == true){
                            colOb[i][j].destroy();
                            scene.removeChild(colOb[i][j])
                        }
                    }
                }
                floors.forEach(elem=>{
                    elem.destroy()
                })
                walls.forEach(elem=>{
                    elem.destroy()
                })
                avoids.forEach(elem=>{
                    scene.removeChild(elem)
                })
                holes.forEach(elem=>{
                    scene.removeChild(elem)
                })
                
            }
            new DispLine(0,pixelSize*9,pixelSize*20,pixelSize*8,"#000000ee",scene)
            new DispText(pixelSize,pixelSize*10,pixelSize*18,pixelSize/2,  '　移動　：左の十字パッド　（斜め移動可）　　　　　　砲撃で発射される弾は','24px sans-serif','white','left',scene)
            new DispText(pixelSize,pixelSize*10.5,pixelSize*18,pixelSize/2,'　　　　　　　　　　　　　　　　　　　　　　 　　　  壁に当たると跳ね返ります。','24px sans-serif','white','left',scene)
            new DispText(pixelSize,pixelSize*11,pixelSize*18,pixelSize/2,  '　照準　：画面タップか画面スライド　　','24px sans-serif','white','left',scene)
            new DispText(pixelSize,pixelSize*11.5,pixelSize*18,pixelSize/2,'　砲撃　：右側のAボタン　　　　　　　　　　　　　　跳ね返った弾にも判定があるので','24px sans-serif','white','left',scene)
            new DispText(pixelSize,pixelSize*12,pixelSize*18,pixelSize/2,  '爆弾設置：右側のBボタン　　　　　　　　　　　　　    自滅には注意してください。','24px sans-serif','white','left',scene)
            new DispText(pixelSize,pixelSize*12.5,pixelSize*18,pixelSize/2,'一時停止：Startボタン　　　　　　　　　','24px sans-serif','white','left',scene)
                
            scene.onenterframe = function() {
                scene.time++;
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
                if(inputManager.checkButton("Start") == inputManager.keyStatus.DOWN && scene.time > 240){
                    if(confirm("\r\nタイトルに戻りますか？")) {
                        BGM.play();
                        scene.removeChild(tutorialLabel)
                        game.time = 0;
                        deleteFlg = true;
                        new FadeOut(scene)
                        AllDelete();
                        deleteFlg = false;
                        obsdir = []
                        obsNum = 0;
                        refdir = []
                        refNum = 0;
                        bullets = [];       //各戦車の弾数の制御用配列
                        boms = [];          //爆弾の個数の制御用配列
                        bulOb = [[]];       //戦車の弾情報を保持する配列
                        colOb = [[]];       //弾の物理制御情報を保持する配列
                        bomOb = [[]];       //爆弾の情報を保持する配列
                        bulStack = [];      //弾の状態の制御用配列
                        enemyTarget = [];   //敵戦車が狙うターゲット
                        entVal = 0;         //戦車の連番設定用変数
                        tankEntity = [];    //戦車情報を保持する配列
                        tankDir = [];
                        markEntity = [];
                        deadFlgs = [];      //戦車の生存確認 
                        fireFlgs = [];      //敵の砲撃制御
                        floors = [];        //１ブロック分の壁
                        avoids = [];        //(敵のみ)通行不可
                        walls = [];         //ステージの壁
                        holes = [];         //穴
                        tankColorCounts = [0,0,0,0,0,0,0,0,0,0,0,0];
                        destruction = 0;
                        victory = false;
                        defeat = false;
                        game.replaceScene(createTitleScene())
                    }
                }
                document.onkeyup = function(e){
                    if((e.code == 'Escape') && scene.time > 240){
                        if(confirm("\r\nタイトルに戻りますか？")) {
                            BGM.play();
                            scene.removeChild(tutorialLabel)
                            game.time = 0;
                            deleteFlg = true;
                            new FadeOut(scene)
                            AllDelete();
                            deleteFlg = false;
                            obsdir = []
                            obsNum = 0;
                            refdir = []
                            refNum = 0;
                            bullets = [];       //各戦車の弾数の制御用配列
                            boms = [];          //爆弾の個数の制御用配列
                            bulOb = [[]];       //戦車の弾情報を保持する配列
                            colOb = [[]];       //弾の物理制御情報を保持する配列
                            bomOb = [[]];       //爆弾の情報を保持する配列
                            bulStack = [];      //弾の状態の制御用配列
                            enemyTarget = [];   //敵戦車が狙うターゲット
                            entVal = 0;         //戦車の連番設定用変数
                            tankEntity = [];    //戦車情報を保持する配列
                            tankDir = [];
                            markEntity = [];
                            deadFlgs = [];      //戦車の生存確認 
                            fireFlgs = [];      //敵の砲撃制御
                            floors = [];        //１ブロック分の壁
                            avoids = [];        //(敵のみ)通行不可
                            walls = [];         //ステージの壁
                            holes = [];         //穴
                            tankColorCounts = [0,0,0,0,0,0,0,0,0,0,0,0];
                            destruction = 0;
                            victory = false;
                            defeat = false;
                            game.replaceScene(createTitleScene())
                        }
                    }
                }
                
                if(scene.time == 210 && complete == false && victory == false){
                    worldFlg = true;
                    scene.addChild(startLabel) 
                    scene.addChild(tutorialLabel)
                }
                
                if(worldFlg == true){

                    if(game.input.up)cur.y -= 8;
                    else if(game.input.down)cur.y += 8;
                    if(game.input.right) cur.x += 8;
                    else if(game.input.left) cur.x -= 8;
                    if(scene.time == 240) scene.removeChild(startLabel)

                    world.step(game.fps);
                    game.time++;
                }
            }
            return scene;
        };
        /* タイトルシーン */
        var createTitleScene = function(){

            var scene = new Scene();
            scene.time = 0;
            scene.backgroundColor = '#cacaca';                      // シーンの背景色を設定
            var flg = false;
                
            // スタート画像設定
            new DispHead(100,200,360*3,240*2.8,"#a00d",scene)
            
            // タイトルラベル設定
            new DispText(100,280,260*size,96,'Battle Tank Game','96px sans-serif','#ebe799','center',scene)
            
            // ゲーム開始用ラベル
            var toPlay = new DispText(game.width/2-180,440,320,40,'➡　S t a r t !','40px sans-serif','#ebe799','left',scene)
            //  難易度選択用ラベル
            var level = new DispText(game.width/2-180,520,40*9,40,'➡　難易度選択：','40px sans-serif','#ebe799','left',scene)
            //  難易度「普通」ラベル
            var nomal = new DispText(level.x+level.width-16,520,140,40,'Normal','40px sans-serif','#ebe799','left',scene)
            //  難易度「難しい」ラベル
            var hard = new DispText(level.x+level.width+nomal.width+16,520,120,40,'Hard','40px sans-serif','#888','left',scene)
            //  戦車一覧画面用ラベル
            var picture = new DispText(game.width/2-180,600,40*10,40,'➡　戦車一覧','40px sans-serif','#ebe799','left',scene)
            //  チュートリアル画面ラベル
            var tutorial = new DispText(game.width/2-180,680,40*9,40,'➡　チュートリアル','40px sans-serif','#ebe799','left',scene)


            let lvFlg = false;
            //  難易度選択状態での表示変更処理
            if(addBullet == 0){
                nomal.color = '#ebe799';
                hard.color = '#888';
                lvFlg = false;
            }else{
                nomal.color = '#888';
                hard.color = 'red';
                lvFlg = true;
            }
            //  難易度普通選択時処理
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
            //  難易度難しい選択時処理
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
            //  難易度変更処理
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

                flg = true
                orflg = 1;
                BGM.stop()
                titleFlg = false;
                new FadeOut(scene)
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
            scene.onenterframe = function(){
                if(titleFlg == true && BGM.currentTime == BGM.duration){
                    BGM.play();
                }
                if(flg == true){
                    
                    scene.time++
                    if(scene.time == 30){
                        if(orflg == 1){
                            game.replaceScene(createStartScene());    // 現在表示しているシーンをゲームシーンに置き換える
                        }else if(orflg == 2){
                            game.replaceScene(createPictureScene());
                        }else if(orflg == 3){
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
            var scene = new Scene();                              // 新しいシーンを作る
                scene.time = 0;
                scene.backgroundColor = '#cacaca';                      // シーンの背景色を設定

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
                './image/ObjectImage/AbyssalCannon.png'
            ];

            //  表示する戦車オブジェを格納する配列
            let dispTanks = [];
            //  戦車ごとのテキストを格納する配列
            let performance = [
                ["Player","　弾数　：5","　弾速　：普通","跳弾回数：1","移動速度：普通","・プレイヤーが操作する戦車<br>　強いか弱いかはあなた次第。"],
                [colorsName[0],'　弾数　：'+(cateMaxBullets[0]+addBullet),"　弾速　：普通","跳弾回数：1","移動速度：動かない","・一番最初に戦う雑魚敵。<br>　弱いが油断はできない。"],
                [colorsName[1],'　弾数　：'+(cateMaxBullets[1]+addBullet),"　弾速　：普通","跳弾回数：1","移動速度：遅い","・動けるようになったがまだ弱い。<br>　配置によっては化ける。"],
                [colorsName[2],'　弾数　：'+(cateMaxBullets[2]+addBullet),"　弾速　：とても速い","跳弾回数："+addBullet,"移動速度：動かない～遅い","・とにかく弾が速い。<br>　スナイプされないよう注意！"],
                [colorsName[4],'　弾数　：'+(cateMaxBullets[4]+addBullet),"　弾速　：速い","跳弾回数：2","移動速度：遅い","・弾がよく跳ね返るため厄介。<br>　結構ビビり。"],
                [colorsName[3],'　弾数　：'+(cateMaxBullets[3]+addBullet),"　弾速　：普通","跳弾回数：0","移動速度：普通","・万歳突撃をかますヤバイ奴。<br>　跳弾や角狙いで対処しよう。"],
                [colorsName[5],'　弾数　：'+(cateMaxBullets[5]+addBullet),"　弾速　：速い","跳弾回数：1","移動速度：普通","・Grayの強化個体。<br>　冷静に対処すれば倒せる。"],
                [colorsName[7],'　弾数　：'+(cateMaxBullets[7]+addBullet),"　弾速　：とても速い","跳弾回数：3","移動速度：動かない","・Greenの強化個体。<br>　圧倒的な命中精度を誇る。"],
                [colorsName[6],'　弾数　：'+(cateMaxBullets[6]+addBullet),"　弾速　：速い","跳弾回数：1","移動速度：遅い","・ステルスで姿を眩ます厄介者。<br>　距離を詰めれば見えるようになる。"],
                [colorsName[8],'　弾数　：'+(cateMaxBullets[8]+addBullet),"　弾速　：とても速い","跳弾回数：2","移動速度：とても速い","・簡潔にいうと爆弾魔。<br>　爆弾を設置しないと攻撃してこない。"],
                [colorsName[9],'　弾数　：'+(cateMaxBullets[9]+addBullet),"　弾速　：速い","跳弾回数：0","移動速度：動かない","・機関砲のような連射をしてくる。<br>　彼の正面には立たないように…"],
                [colorsName[10],"　弾数　：?","　弾速　：?","跳弾回数：?","移動速度：?","・いつ現れるか分からない戦車。<br>　出現したら要注意。"],
                [colorsName[11],"　弾数　：?","　弾速　：普通~速い","跳弾回数：0~1","移動速度：普通~速い","・攻防ともに優れたボス格。<br>　ステージごとに強さが異なる。"],
                ["Abyssal","　弾数　：?","　弾速　：速い~とても速い","跳弾回数：0~1","移動速度：普通~速い","・ステルスも使えるボス格。<br>　\"最後\"は真っ向勝負となる。"]
            ]
            let pcnt = 0;   //  戦車の番号
            let ccnt = 0;   //  車体か砲塔どちらかを指定する番号
            let tcnt = 0;   //  初期設定用の戦車の番号

            let flg = false;    //  画面遷移フラグ

            new DispHead(100,80,360*3,240*3.2,"#a00d",scene)    //  赤い背景追加
            new DispBody(100,240,360*3,240*2,scene)             //  黄色の背景追加

            //  各戦車を７×２に並べて表示する処理
            for(let i = 0; i < 7; i++){
                for(let j = 0; j < 2; j++){
                    if(j == 0){
                        dispTanks[tcnt] = new PictureTank(j+3,i+4.5,tanks[ccnt],tanks[ccnt+1],scene);
                    }else{
                        dispTanks[tcnt] = new PictureTank(j+4,i+4.5,tanks[ccnt],tanks[ccnt+1],scene);
                    }
                    
                    tcnt++;
                    ccnt += 2;
                }
            }
            
            //  戦車の情報表示テキスト群
            let tankName = new DispText(240,260,260*4,48,"戦車名",'48px sans-serif','black','center',scene)     //  戦車名
            let tankBulCnt = new DispText(600,340,260*4,36,"　弾数　：",'36px sans-serif','black','left',scene) //  弾数
            let tankBulSpd = new DispText(600,400,260*4,36,"　弾速　：",'36px sans-serif','black','left',scene) //  弾速
            let tankBulRef = new DispText(600,460,260*4,36,"跳弾回数：",'36px sans-serif','black','left',scene) //  跳弾回数
            let tankSpd = new DispText(600,520,260*4,36,"移動速度：",'36px sans-serif','black','left',scene)    //  移動速度
            let tankDsc = new DispText(600,580,260*4,72,"・戦車の特徴",'36px sans-serif','black','left',scene)  //  戦車の特徴

            //  見出し
            new DispText(120,150,260*4,64,'戦車一覧','64px sans-serif','#ebe799','center',scene)                    
            //  タイトル画面へ移動するためのテキスト
            var toTitle = new DispText(480,740,320,32,'➡タイトル画面へ','32px sans-serif','#ebe799','center',scene)

            //  選択されている戦車を青くする処理
            //dispTanks[pcnt].backgroundColor = "#0000ff66"

            // タイトル画面へ遷移する処理
            toTitle.addEventListener(Event.TOUCH_START, function(e) {
                flg = true
                new FadeOut(scene)
            });

            scene.onenterframe = function(){
                if(titleFlg == true && BGM.currentTime == BGM.duration){
                    BGM.play();
                }
                //  戦車がクリックされたとき、表示を変える処理
                for(let i = 0; i < 14; i++){
                    dispTanks[i].addEventListener(Event.TOUCH_START, function() {
                        dispTanks[pcnt].backgroundColor = "#00000000"
                        pcnt = i;
                        tankName.text = performance[pcnt][0];
                        tankBulCnt.text = performance[pcnt][1];
                        
                        if(addBullet != 0){
                            if(pcnt == 3){
                                tankBulCnt.color = 'red';
                                tankBulRef.color = 'red';
                            }else if(pcnt != 0){
                                tankBulCnt.color = 'red';
                                tankBulRef.color = 'black';
                            }else{
                                tankBulCnt.color = 'black';
                                tankBulRef.color = 'black';
                            } 
                            
                        } 
                        
                        tankBulSpd.text = performance[pcnt][2];
                        tankBulRef.text = performance[pcnt][3];
                        tankSpd.text = performance[pcnt][4];
                        tankDsc.text = performance[pcnt][5];
                        dispTanks[pcnt].backgroundColor = "#00000033"
                    });
                }
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

            deleteFlg = false;
            
            obsdir = []
            obsNum = 0;
            refdir = []
            refNum = 0;
            bullets = [];       //各戦車の弾数の制御用配列
            boms = [];          //爆弾の個数の制御用配列
            bulOb = [[]];       //戦車の弾情報を保持する配列
            colOb = [[]];       //弾の物理制御情報を保持する配列
            bomOb = [[]];       //爆弾の情報を保持する配列
            bulStack = [];      //弾の状態の制御用配列
            enemyTarget = [];   //敵戦車が狙うターゲット
            entVal = 0;         //戦車の連番設定用変数
            tankEntity = [];    //戦車情報を保持する配列
            tankDir = [];
            markEntity = [];
            deadFlgs = [];      //戦車の生存確認 
            fireFlgs = [];      //敵の砲撃制御
            floors = [];        //１ブロック分の壁
            avoids = [];        //(敵のみ)通行不可
            walls = [];         //ステージの壁
            holes = [];         //穴
            tankColorCounts = [0,0,0,0,0,0,0,0,0,0,0,0];
            destruction = 0;
            victory = false;
            defeat = false;
            
            var nextData = LoadStage();    //ステージ情報引き出し
    
            let count = 0;
            for(var i = 4; i < Object.keys(nextData).length; i++){
                count++;
            }
    
            /*script = document.createElement("script");
            script.src = stagePath[stageNum];
            head[0].appendChild(script);*/
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
                if(scene.time == 15) game.assets['./sound/RoundStart.mp3'].play()
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
                if(scene.time == 15) game.assets['./sound/ExtraTank.mp3'].play()
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
            deleteFlg = false;

            stageData = LoadStage();    //ステージ情報引き出し
    
            var scene = new Scene();                            // 新しいシーンを作る
                scene.time = 0;

            let backgroundMap = new Map(pixelSize, pixelSize);
                backgroundMap.image = game.assets['./image/MapImage/map0.png'];
                backgroundMap.loadData(stageData[0],stageData[1])
                backgroundMap.collisionData = stageData[2];
                scene.addChild(backgroundMap);

                walls[0] = new Wall(18,1,1,1,scene)
                //Obstracle(walls[0],scene)
                walls[1] = new Wall(18,1,1,14,scene)
                //Obstracle(walls[1],scene)
                walls[2] = new Wall(1,13,0,1,scene)
                //Obstracle(walls[2],scene)
                walls[3] = new Wall(1,13,19,1,scene)
                //Obstracle(walls[3],scene)
                walls[4] = new Wall(24,1,0,15,scene)
                //Obstracle(walls[4],scene)
            var fy = 0;
            var fx = 0;
    
            var grid = [];
    
            /* 壁の当たり判定設置 */
            backgroundMap.collisionData.forEach(colI => {
                grid[fy] = []
                colI.forEach(colJ => {
                    if(colJ == 0){
                        grid[fy][fx] = 'Empty';
                    }else{
                        if(colJ == 2){
                            avoids.push(new Avoid(fx,fy,scene));
                            grid[fy][fx] = 'Obstacle';
                        }else if(colJ == 3){
                            holes.push(new Hole(fx,fy,scene))
                            grid[fy][fx] = 'Obstacle';
                            Obstracle(holes[holes.length-1],scene)
                        }else{
                            
                            if(colJ == 1){
                                floors.push(new Floor(fx,fy,scene));
                                grid[fy][fx] = 'Obstacle';
                                Obstracle(floors[floors.length-1],scene)
                                RefObstracle(floors[floors.length-1],scene)
                            }else{
                                grid[fy][fx] = 'Obstacle';
                            } 
                        }
                        
                    }
                    fx++;
                });
                fy++;
                fx = 0;
            });
            

            let filterMap = new Map(pixelSize,pixelSize);
                filterMap.image = backgroundMap.image;
            let filImg = stageData[1];
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
                //filterMap.collisionData = fcol;
                scene.addChild(filterMap);

            /* カーソルの設置＆位置取得処理 */
            cur = new Cursor(scene);
            
            document.addEventListener('mousemove', function(e) {
                cur.x = (e.x-36)*2.7-240;
                cur.y = (e.y)*2.65;
            })
            scene.addEventListener('touchmove',function(e){
                cur.x = (e.x);
                cur.y = (e.y);
            })
            
            /* 戦車の追加処理 */
            bulOb.push([])
            colOb.push([])
            bomOb.push([])
            bulStack.push([])
            if(cheat == true){
                tankEntity.push(new Player(stageData[3][0],stageData[3][1],'./image/ObjectImage/tank2.png','./image/ObjectImage/cannon.png',5,1,8,4,scene,filterMap))
            }else{
                tankEntity.push(new Player(stageData[3][0],stageData[3][1],'./image/ObjectImage/tank2.png','./image/ObjectImage/cannon.png',5,1,9,2.2,scene,filterMap))
            }
            
            let abn = Math.floor(Math.random() * 10);
    
            for(let i = 4; i < Object.keys(stageData).length; i++){
                bulOb.push([])
                colOb.push([])
                bomOb.push([])
                bulStack.push([])
                if((abn == 0 && stageNum > 10 && i == 4 && stageNum % 5 != 0) || stageData[i][9] == 12){
                    tankEntity.push(new Elite(stageData[i][0],stageData[i][1],'./image/ObjectImage/abnormal.png','./image/ObjectImage/abnormalcannon.png',tankEntity[0],Math.floor(Math.random() * 4)+1+addBullet,Math.floor(Math.random() * 3),Math.floor(Math.random() * 9)+6,Math.floor(Math.random() * 3),Math.floor(Math.random() * 35)+5,Math.floor(Math.random() * 4)+3,10,scene,filterMap))
                    stageData[i][10] = 10;
                }else if(stageData[i][10] == 7){
                    tankEntity.push(new AnotherElite(stageData[i][0],stageData[i][1],stageData[i][2],stageData[i][3],tankEntity[0],cateMaxBullets[stageData[i][10]]+addBullet,stageData[i][5],stageData[i][6],0,stageData[i][8],stageData[i][9],stageData[i][10],scene,filterMap));
                }else if(stageData[i][10]==5 || stageData[i][10] == 4){
                    tankEntity.push(new AIElite(stageData[i][0],stageData[i][1],stageData[i][2],stageData[i][3],tankEntity[0],cateMaxBullets[stageData[i][10]]+addBullet,stageData[i][5],stageData[i][6],stageData[i][7],stageData[i][8],stageData[i][9],stageData[i][10],scene,filterMap,backgroundMap,grid))
                }else if(stageData[i][10] == 0){
                    tankEntity.push(new Elite(stageData[i][0],stageData[i][1],stageData[i][2],stageData[i][3],tankEntity[0],cateMaxBullets[stageData[i][10]]+addBullet,stageData[i][5],stageData[i][6],stageData[i][7],stageData[i][8],stageData[i][9],stageData[i][10],scene,filterMap));
                }else if(stageData[i][9] >= 8){
                    if(stageData[i][10] == 11){
                        tankEntity.push(new Boss(stageData[i][0],stageData[i][1],stageData[i][2],stageData[i][3],tankEntity[0],stageData[i][4]+addBullet,stageData[i][5],stageData[i][6],stageData[i][7],stageData[i][8],stageData[i][9],stageData[i][10],scene,filterMap))
                    }else{
                        tankEntity.push(new Boss(stageData[i][0],stageData[i][1],stageData[i][2],stageData[i][3],tankEntity[0],cateMaxBullets[stageData[i][10]]+addBullet,stageData[i][5],stageData[i][6],stageData[i][7],stageData[i][8],stageData[i][9],stageData[i][10],scene,filterMap))
                    }
                }else if(addBullet != 0 && (stageData[i][10] == 5)){
                    tankEntity.push(new Boss(stageData[i][0],stageData[i][1],stageData[i][2],stageData[i][3],tankEntity[0],cateMaxBullets[stageData[i][10]]+addBullet,stageData[i][5],stageData[i][6],stageData[i][7],stageData[i][8],stageData[i][9],stageData[i][10],scene,filterMap))
                }else if(stageData[i][9]>2){
                    
                    tankEntity.push(new Elite(stageData[i][0],stageData[i][1],stageData[i][2],stageData[i][3],tankEntity[0],cateMaxBullets[stageData[i][10]]+addBullet,stageData[i][5],stageData[i][6],stageData[i][7],stageData[i][8],stageData[i][9],stageData[i][10],scene,filterMap));
                    
                }else{
                    tankEntity.push(new newAI(stageData[i][0],stageData[i][1],stageData[i][2],stageData[i][3],tankEntity[0],cateMaxBullets[stageData[i][10]]+addBullet,stageData[i][5],stageData[i][6],stageData[i][7],stageData[i][8],stageData[i][9],stageData[i][10],scene,backgroundMap,grid,filterMap))
                }
                tankColorCounts[stageData[i][10]]++;
            }
            
            new PlayerLabel(tankEntity[0],scene)
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
                pauseButtton.y = game.height/2-96;
                pauseButtton.text = '';
                pauseButtton.font = 'bold 96px "sans-serif"';
                pauseButtton.color = 'aliceblue';
                pauseButtton.textAlign = 'center';
            let remaining = new DispText(252,960-72,720,48,'敵残数：'+(tankEntity.length-1-destruction)+'　　　残機：'+zanki,'bold 48px "Arial"','white','center',scene)
            let BGM2 = game.assets['./sound/end.mp3'];
            let BGM3 = game.assets['./sound/result.mp3'];
            
            let blackImg = new DispLine(0,0,game.width,game.height,"#00000000",scene)
            let retire = new DispText(0,0,1,1,'','48px sans-serif','red','center',scene)
            retire.addEventListener(Event.TOUCH_START, function() {
                if(pauseFlg == true){
                    if(confirm("\r\n本当にリタイアしますか？")) {
                        blackImg.backgroundColor = "#00000000"
                        worldFlg = true
                        pauseButtton.text ='';
                        zanki = 0;
                        deleteFlg = true;
                    }
                }
                
            });

            let CngBgmNum = BNum;

            function AllDelete(){
                for(let i = 0; i < obsdir.length; i++){
                    for(let j = 0; j < obsdir[i].length; j++){
                        scene.removeChild(obsdir[i][j])
                    }
                }
                for(let i = 0; i < refdir.length; i++){
                    for(let j = 0; j < refdir[i].length; j++){
                        scene.removeChild(refdir[i][j])
                    }
                }
                for(let i = 0; i < tankDir.length; i++){
                    for(let j = 0; j < tankDir[i].length; j++){
                        scene.removeChild(tankDir[i][j])
                    }
                }
                for(let i = 0; i < tankEntity.length; i++){
                    scene.removeChild(tankEntity[i])
                }
                for(let i = 0; i < markEntity.length; i++){
                    scene.removeChild(markEntity[i])
                }
                bulOb.forEach(elem=>{
                    elem.forEach(elem2=>{
                        scene.removeChild(elem2)
                    })
                })
                for(let i = 0; i < colOb.length; i++){
                    for(let j = 0; j < colOb[i].length; j++){
                        if(bulStack[i][j] == true){
                            colOb[i][j].destroy();
                            scene.removeChild(colOb[i][j])
                        }
                    }
                }
                floors.forEach(elem=>{
                    elem.destroy()
                })
                walls.forEach(elem=>{
                    elem.destroy()
                })
                avoids.forEach(elem=>{
                    scene.removeChild(elem)
                })
                holes.forEach(elem=>{
                    scene.removeChild(elem)
                })
                
            }
            let chgBgm = false;

            scene.onenterframe = function() {
                if(complete == false) chgBgm = false;
                scene.time++;
                if(defeat == false && victory == false && complete == false) remaining.text = '敵残数：'+(tankEntity.length-1-destruction)+'　　　残機：'+zanki
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
                
                if(screen.width < 844){
                    if(inputManager.checkButton("Start") == inputManager.keyStatus.DOWN && scene.time > 250 && defeat == false && victory == false && complete == false){
                        if (worldFlg == false){
                            blackImg.backgroundColor = "#00000000"
                            worldFlg = true
                            pauseButtton.text ='';
                            BGM1.volume = 1.0
                            pauseFlg = false;
                            retire.x = 0
                            retire.y = 0
                            retire.width = 1;
                            retire.height = 1;
                            retire.text = ""
                        }else{
                            blackImg.backgroundColor = "#00000044"
                            pauseButtton.text ='一時停止'; 
                            worldFlg = false
                            pauseFlg = true;
                            BGM1.volume = 0.5
                            retire.x = game.width/2-96
                            retire.y = game.height/2+96
                            retire.width = 48*4;
                            retire.height = 48;
                            retire.text = "リタイア"
                        }
                    }
                }
                
                document.onkeyup = function(e){
                    if((e.code == 'Escape') && scene.time > 250 && defeat == false && victory == false && complete == false){
                        if (worldFlg == false){
                            blackImg.backgroundColor = "#00000000"
                            worldFlg = true
                            pauseButtton.text ='';
                            BGM1.volume = 1.0
                            pauseFlg = false;
                            retire.x = 0
                            retire.y = 0
                            retire.width = 1;
                            retire.height = 1;
                            retire.text = ""
                        }else{
                            blackImg.backgroundColor = "#00000044"
                            pauseButtton.text ='一時停止'; 
                            worldFlg = false
                            pauseFlg = true;
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
       
                if(scene.time == 210 && complete == false && victory == false){
                    worldFlg = true;
                    scene.addChild(startLabel) 
                    scene.addChild(pauseButtton)  
                }
                
                if(worldFlg == true){
                    /*if(CngBgmNum != BNum && victory == false && complete == false && defeat == false && BGM1 != game.assets['./sound/start.mp3']){
                        CngBgmNum = BNum
                        
                        
                        let curTime = BGM1.currentTime;
                        BGM1.stop()
                        let kariBGM = game.assets[BGMs[BNum]];
                            kariBGM.currentTime = curTime;
                            kariBGM.play()
                            
                        
                        BGM1 = kariBGM;
                        
                        //alert(BNum)

                    }*/
                    if(game.input.up)cur.y -= 8;
                    else if(game.input.down)cur.y += 8;
                    if(game.input.right) cur.x += 8;
                    else if(game.input.left) cur.x -= 8;
                    if(scene.time == 240) scene.removeChild(startLabel)
                    world.step(game.fps);
                    game.time++;
                    
                    
                    if((destruction == tankEntity.length-1 || zanki <= 0) && deadFlgs[0]==false && victory == false && complete == false){
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
                    }

                    
                }
            }
            return scene;
        };
        game.replaceScene(createSetUpScene());  // ゲームの_rootSceneをスタートシーンに置き換える
        
    }
    
    /* 画面外をクリックしても操作できるようにする処理 */
    game.onenterframe = function(){
        
        if(game.time % 5 == 0 && game.time > 0){
            window.focus();
            // フルスクリーン表示
            if(!isFullScreen()){
                // Chrome & Firefox v64以降
                if( document.body.requestFullscreen ) {
                    document.body.requestFullscreen();
                        
                // Firefox v63以前
                } else if( document.body.mozRequestFullScreen ) {
                document.body.mozRequestFullScreen();

                // Safari & Edge & Chrome v68以前
                } else if( document.body.webkitRequestFullscreen ) {
                document.body.webkitRequestFullscreen();

                // IE11
                } else if( document.body.msRequestFullscreen ) {
                document.body.msRequestFullscreen();
                }
            }
			
        }
        
    }

    game.start(); // ゲームをスタートさせます
}
