/**
 * Minesweeper関連オブジェクトを格納するNamespace
 */
var MINESWEEPER = MINESWEEPER || {};
 
/**
 * CellのModel
 * 
 * CellModelで初期値を設定
 * CellCollectionで、爆弾設置と各Cellのtypeとgroupを設定
 */
(function(window) {
    var ns = window.MINESWEEPER || {};

    ns.CellModel = Backbone.Model.extend({
        defaults: {
            cellType: 0,    //0:通常,1〜8:周囲に爆弾あり,9:タップ済,99:爆弾,100:旗
            group: 0,
            isOpened: false,
            flaged: false
        }
    });

    ns.CellCollection = Backbone.Collection.extend({
        model: ns.CellModel,
        properties: {
            cellX: 9,   //列の数
            cellY: 9,   //行の数
            mines: 10,  //爆弾の数
        },
        initialize: function() {
            this.models = this.createCellModels();
        },
        createCellModels: function() {
            for(var i=0; i<this.properties.cellX * this.properties.cellY; i++) {
                var cellModel = new ns.CellModel({id: i});
                this.add(cellModel);
            }
            this.setMines();
            this.setCellType();
            var num = 0;
            var loop = 1;
            var group = 0;
            this.setGroup(num, loop, group);
            return this.models;
        },
        setMines: function() {
            // 爆弾設置
            var mine_tmp = this.properties.mines;
            while(mine_tmp !==0) {
                var r = Math.round(Math.random() * this.length -1);
                if(this.models[r].get('cellType') != 99) {
                    this.models[r].set('cellType',99);
                    mine_tmp --;
                }
            }
        },
        setCellType: function() {
            // cellType設定
            var mine_temp = this.properties.mines;
            var cell_cnt_x = this.properties.cellX;
            var cell_cnt_y = this.properties.cellY;
            for(var num = 0; num < this.length ; num++) {
                if(this.models[num].get('cellType') != 99) {
                    var tmp_bomb_cnt = 0;   //爆弾数カウント一時変数
                    if(num - (cell_cnt_x + 1) >= 0 && num % cell_cnt_x !== 0) {   //左上のセルをチェック
                        if(this.models[num - (cell_cnt_x + 1)].get('cellType') == 99) {
                            tmp_bomb_cnt++;
                        }
                    }
                    if(num - cell_cnt_x >= 0) {    //上のセルをチェック
                        if(this.models[num - cell_cnt_x].get('cellType') == 99) {
                            tmp_bomb_cnt++;
                        }
                    }
                    if(num - (cell_cnt_x - 1) >= 0 && (num + 1) % cell_cnt_x !== 0) { //右上のセルをチェック
                        if(this.models[num - (cell_cnt_x - 1)].get('cellType') == 99) {
                            tmp_bomb_cnt++;
                        }
                    }
                    if(num - 1 >= 0 && num % cell_cnt_x !== 0) {   //左のセルをチェック
                        if(this.models[num - 1].get('cellType') == 99) {
                            tmp_bomb_cnt++;
                        }
                    }
                    if(num + 1 < this.length && (num + 1) % cell_cnt_x !== 0) {  //右のセルをチェック
                        if(this.models[num + 1].get('cellType') == 99) {
                            tmp_bomb_cnt++;
                        }
                    }
                    if(num + (cell_cnt_x - 1) < this.length && num % cell_cnt_x !== 0) {    //左下のセルをチェック
                        if(this.models[num + (cell_cnt_x - 1)].get('cellType') == 99) {
                            tmp_bomb_cnt++;
                        }
                    }
                    if(num + cell_cnt_x < this.length) { //下のセルをチェック
                        if(this.models[num + cell_cnt_x].get('cellType') == 99) {
                            tmp_bomb_cnt++;
                        }
                    }
                    if(num + (cell_cnt_x + 1) < this.length && (num + 1) % cell_cnt_x !== 0) {  //右下のセルをチェック
                        if(this.models[num + (cell_cnt_x + 1)].get('cellType') == 99) {
                            tmp_bomb_cnt++;
                        }
                    }
                    this.models[num].set('cellType',tmp_bomb_cnt);
                    if(tmp_bomb_cnt === 0) {
                        this.models[num].set('cellType',9);
                    }
                }
                tmp_bomb_cnt = 0;
            }
        },
        setGroup: function(num, loop, group) {
            // group設定
            var cell_cnt_x = this.properties.cellX;
            var cell_cnt_y = this.properties.cellY;
            loop_label: while(1) {         
                // console.log('num=' + num);
                // console.log('loop=' + loop);
                // console.log('group=' + group);
                for(num; num < loop; num++) {
                    if(this.models[num].get('cellType') == 9) {
                        this.models[num].set('group',group);
                        if(num - cell_cnt_x >= 0) {    //上のセルをチェック
                            this.models[num - cell_cnt_x].set('group', group);
                            if(this.models[num - cell_cnt_x].get('cellType') == 9) {
                                // console.log('上group ' + this.models[num - cell_cnt_x].get('group'));
                                if(this.models[num - cell_cnt_x].get('group') === 0) {
                                    this.setGroup(num - cell_cnt_x, loop, group);
                                }
                            }
                        }
                        if(num - 1 >= 0 && num % cell_cnt_x !== 0) {   //左のセルをチェック
                            this.models[num - 1].set('group', group);
                            if(this.models[num - 1].get('cellType') == 9) {
                                // console.log('左group ' + this.models[num - 1].get('group'));
                                if(this.models[num - 1].get('group') === 0) {
                                    this.setGroup(num - 1, loop, group);
                                }
                            }
                        }
                        if(num + 1 < this.length && (num + 1) % cell_cnt_x !== 0) {  //右のセルをチェック
                            this.models[num + 1].set('group', group);
                            if(this.models[num + 1].get('cellType') == 9) {
                                // console.log('右group ' + this.models[num + 1].get('group'));
                                if(this.models[num + 1].get('group') === 0) {
                                    this.setGroup(num + 1, loop, group);
                                }
                            }
                        }
                        if(num + cell_cnt_x < this.length) { //下のセルをチェック
                            this.models[num + cell_cnt_x].set('group', group);
                            if(this.models[num + cell_cnt_x].get('cellType') == 9) {
                                // console.log('下group ' + this.models[num + cell_cnt_x].get('group'));
                                if(this.models[num + cell_cnt_x].get('group') === 0) {
                                    this.setGroup(num + cell_cnt_x, loop, group);
                                }
                            }
                        }
                    }
                }
                group ++;
                if(num >= loop) break;
            }
        }
    });
})(this);
 
/**
 * CellのView
 * 
 * CellのDOM生成とイベント設定、表示変更
 */
(function(window) {
    var ns = window.MINESWEEPER || {};

    ns.CellView = Backbone.View.extend({
        tagName: 'li',
        className: 'cell',
        initialize: function(options) {
            var self = this;
            this.model = options;
            this.modelEvents();
            this.render();
            var interval = 300;
            //旗を立てる処理（セル長押しでイベント発生）
            this.$el.bind('touchstart',function() {
                if(self.model.get('isOpened') == false) {
                    timer = setTimeout(function() {
                        self.trigger('cellHold', event, self);
                        self.$el.off('click');  //旗消去と同時にclickイベントが発生しない様に一旦イベントをアンバインドする
                        setTimeout(function() {self.$el.on('click',$.proxy(self.clickHandler, self))}, 400);    //時間差でclickイベント復活
                    }, interval);

                    function clearFunction() {
                        clearTimeout(timer);
                    }
                    self.$el.bind('touchend touchmove touchcancel', clearFunction);
                }
            });
        },
        events: {
            'click': 'clickHandler',
        },
        modelEvents: function() {
            this.on('open', $.proxy(this.open, this));
        },
        clickHandler: function(event) {
            if(this.model.get('flaged') == false) {
                this.trigger('cellClick', event, this);
                this.$el.attr('class', this.render().className);
                this.trigger('open');
            }
        },
        open: function() {
            this.$el.addClass('opened');
            this.model.set('isOpened', true);
        },
        render: function() {
            return this;
        }
    });
})(this);
 
/**
 * CellリストのView
 * 
 * Collectionを初期化し、各Cellをレンダリング
 * Cellのclickイベントをハンドリング
 *    同一groupのisOpendプロパティをtrue化
 *    cellTypeが地雷だったらburstイベントを発行
 */
(function(window) {
    var ns = window.MINESWEEPER || {};
 
    ns.CellListView = Backbone.View.extend({
        initialize: function() {
            this.collection = new ns.CellCollection();
            this.render();
        },
        render: function() {
            var lis = [];
            _.each(this.collection,function(i,id,model) {
                lis[id] = new ns.CellView(model.models[id]);
                lis[id].on('cellClick', this.cellClickHandler);
                lis[id].on('cellHold', this.cellHoldHandler);
                this.$el.append(lis[id].el);
            }, this);
        },
        cellClickHandler: function(event, cellView) {
            cellView.className = 'cell cell_type_' + cellView.model.get('cellType');
            if(cellView.model.get('cellType') === 99) {
                this.collection.trigger('burst');
            }
            // this.cellGroupOpen();
        },
        cellHoldHandler: function(event, cellView) {
            if(cellView.model.get('flaged') == false) {
                cellView.$el.attr('class','cell cell_type_100');
                cellView.model.set('flaged',true);
            } else {
                cellView.$el.attr('class','cell cell_type_0');
                cellView.model.set('flaged',false);
            }
        },
        cellGroupOpen: function(cellView) {
            var group = cellView.model.get('group');
            _(this.collection).each(function(model, index) {
                if(model.get('group')===group) {
                    model.set('isOpened', true);
                }
            }, this);
        }
    });
})(this);
 
/**
 * 時間表示のView
 * 
 * カウント表示
 * カウントアップの開始と停止
 * 
 */
(function(window) {
    var ns = window.MINESWEEPER || {};
 
    ns.TimeStatusView = Backbone.View.extend({
        properties: {
            min: 0,
            sec: 0,
            timerId: undefined,
        },
        initialize: function(options) {
        },
        start: function() {
            var self = this;
            this.properties.timerId = window.setInterval(function() {
                self.countUp();
            }, 1000);
        },
        stop: function() {
            window.clearInterval(this.properties.timerId);
        },
        countUp: function() {
            var prop = this.properties;
            prop.sec++;
            if(prop.sec == 60) {
                prop.min++;
                prop.sec = 0;
            }
            this.render(prop);
        },
        render: function(prop) {
            this.$el.html(prop.min + '分' + prop.sec + '秒');
        }
    });
})(this);
 
/**
 * 全体のController
 * 各ビューは自身の振る舞い制御と、イベントをGameControllerへ通知
 * 
 * GameController
 * ├TimeStatusView
 * └CellListView
 * 　└CellView
 * 
 */
(function(window) {
    var ns = window.MINESWEEPER || {},
        prop;
 
    ns.GameController = Backbone.View.extend({
        properties: {
            is_started: false,
        },
        initialize: function(options) {
            this.options = options;
            this.initCellListView();
            this.initTimeStatusView();
        },
        initCellListView: function() {
            this.cellListView = new ns.CellListView({
                el: this.options.cellListEl
            });
            this.cellListView.collection.on('burst', this.gameOver);
        },
        initTimeStatusView: function() {
            this.timeStatusView = new ns.TimeStatusView({
                el: this.options.timeStatusEl
            });
        },
        events: {
            'click': 'gameStart'
        },
        gameStart: function() {
            if(this.properties.is_started == false) {
                this.timeStatusView.start();
            }
            this.properties.is_started = true;
        },
        gameOver: function() {
            // gameOver処理
            this.timeStatusView = new ns.TimeStatusView();
            this.timeStatusView.stop();
            setTimeout("alert('GAME OVER!')",200);
        }
    });
})(this);
 
/**
 * GameController起動
 */
(function(window) {
    var gameController = new MINESWEEPER.GameController({
        el: $('#minesweeper'),
        cellListEl: $('#cell_list'),
        timeStatusEl: $('#time_status')
    });
})(this);