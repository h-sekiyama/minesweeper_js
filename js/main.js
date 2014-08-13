/*
◆classについて整理◆
cell__0：基本状態
cell__1：周辺に爆弾が1個ある状態
cell__2：周辺に爆弾が2個ある状態
 ・
 ・
cell__8：周辺に爆弾が8個ある状態
cell__9：押された状態
cell__99：爆弾
*/

var MineSweeper = function(cell_cnt_x, cell_cnt_y, bomb_cnt) {
	this.cell_cnt_x = cell_cnt_x;	//セルのXの数
	this.cell_cnt_y = cell_cnt_y;	//セルのYの数
	this.bomb_cnt = bomb_cnt;		//爆弾の数
	this.cell_num_all = cell_cnt_x * cell_cnt_y;	//全セル数
	this.cell_stat = new Array(cell_cnt_x * cell_cnt_y);	//セルの状態（0:安全、1〜8:周りにある爆弾数、9:タップ済、99:爆弾）
	this.stage = $('#cell');	//ステージ配置箇所を定義
	this.init();
};

MineSweeper.prototype = {
	//初回処理
	init: function() {
		this.setCell();
		this.setBomb();
		this.coordinateCell();
		this.countTimer();
	},

	//基本セルの配置
	setCell: function() {
		num = 0;
		for(num = 0; num < this.cell_num_all ; num++) {
			this.stage.append('<div id="'+num+'" class="cell__0"></div>');
			this.cell = $('#'+num);
			this.cell.on('click', tapCell);
			this.cell_stat[num] = 0;
		}
	},

	//爆弾の配置
	setBomb: function() {
		while(this.bomb_cnt !== 0) {
			r = Math.round(Math.random() * this.cell_stat.length);
			if(this.cell_stat[r] != 99) {
				this.cell_stat[r] = 99;
				this.bomb_cnt --;
			}
		}
	},

	//爆弾の状態によりセル情報を書き換え
	coordinateCell: function() {
		for(num = 0; num < this.cell_num_all ; num++) {
			if(this.cell_stat[num] != 99) {
				tmp_bomb_cnt = 0;	//爆弾数カウント一時変数
				if(num - (this.cell_cnt_x + 1) >= 0 && num % this.cell_cnt_x !== 0) {	//左上のセルをチェック
					if(this.cell_stat[num - (this.cell_cnt_x + 1)] == 99) {
						tmp_bomb_cnt++;
					}
				}
				if(num - this.cell_cnt_x >= 0) {	//上のセルをチェック
					if(this.cell_stat[num - this.cell_cnt_x] == 99) {
						tmp_bomb_cnt++;
					}
				}
				if(num - (this.cell_cnt_x - 1) >= 0 && (num + 1) % this.cell_cnt_x !== 0) {	//右上のセルをチェック
					if(this.cell_stat[num - (this.cell_cnt_x - 1)] == 99) {
						tmp_bomb_cnt++;
					}
				}
				if(num - 1 >= 0 && num % this.cell_cnt_x !== 0) {	//左のセルをチェック
					if(this.cell_stat[num - 1] == 99) {
						tmp_bomb_cnt++;
					}
				}
				if(num + 1 < this.cell_num_all && (num + 1) % this.cell_cnt_x !== 0) {	//右のセルをチェック
					if(this.cell_stat[num + 1] == 99) {
						tmp_bomb_cnt++;
					}
				}
				if(num + (this.cell_cnt_x - 1) < this.cell_num_all && num % this.cell_cnt_x !== 0) {	//左下のセルをチェック
					if(this.cell_stat[num + (this.cell_cnt_x - 1)] == 99) {
						tmp_bomb_cnt++;
					}
				}
				if(num + this.cell_cnt_x < this.cell_num_all) {	//下のセルをチェック
					if(this.cell_stat[num + this.cell_cnt_x] == 99) {
						tmp_bomb_cnt++;
					}
				}
				if(num + (this.cell_cnt_x + 1) < this.cell_num_all && (num + 1) % this.cell_cnt_x !== 0) {	//右下のセルをチェック
					if(this.cell_stat[num + (this.cell_cnt_x + 1)] == 99) {
						tmp_bomb_cnt++;
					}
				}
				this.cell_stat[num] = tmp_bomb_cnt;
			}
			tmp_bomb_cnt = 0;
		}
	},

	//時間を図る処理
	countTimer: function() {
		var timer = 0;
		var timer_m = 0;
		timerID = setInterval(function() {
			timer++;
			if(timer == 60) {
				timer_m++;
				timer = 0;
			}
			$('#timer_s').html(timer);
			$('#timer_m').html(timer_m);
		},1000);
	}
};

// function TapCell() {
// 	MineSweeper.apply(this,arguments);
// 	var tapCell = new MineSweeper.prototype;
// }

//セルタップ時の処理
var tapCell = function() {

	this.id = $(this).attr('id');
	switch(game.cell_stat[this.id]) {
		case 0 :
			$(this).attr('class','cell__9');
			game.cell_num_all --;
			break;
		case 1:
			$(this).attr('class','cell__1');
			game.cell_num_all --;
			break;
		case 2:
			$(this).attr('class','cell__2');
			game.cell_num_all --;
			break;
		case 3:
			$(this).attr('class','cell__3');
			game.cell_num_all --;
			break;
		case 4:
			$(this).attr('class','cell__4');
			game.cell_num_all --;
			break;
		case 5:
			$(this).attr('class','cell__5');
			game.cell_num_all --;
			break;
		case 6:
			$(this).attr('class','cell__6');
			game.cell_num_all --;
			break;
		case 7:
			$(this).attr('class','cell__7');
			game.cell_num_all --;
			break;
		case 8:
			$(this).attr('class','cell__8');
			game.cell_num_all --;
			break;
		case 99:
			$(this).attr('class','cell__99');
			console.log(timerID);
			clearInterval(timerID);
			$('#game_over').html('<span style="color:red;">死！</span>');
			break;
		case 9:
			break;
	}
	
	//クリア時の処理
	if(game.cell_num_all == game.bomb_cnt) {
		console.log(timerID);
		clearInterval(timerID);
		$('#game_over').html('<span style="color:green;">クリア！</span>');
	}
};

$(function() {
	game = new MineSweeper(9, 9, 10);
});