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
(function(window){
    var ns = window.MINESWEEPER || {};

    ns.CellModel = Backbone.Model.extend({
        defaults: {
            cellType: 0,
            group: 0,
            isOpened: false
        }
    });

    ns.CellCollection = Backbone.Collection.extend({
        model: ns.CellModel,
        properties: {
            cellX: 9,
            cellY: 9,
            cellModels: []
        },
        initialize: function(){
            this.models = this.createCellModels();
        },
        createCellModels: function(){
            this.setMines();
            this.setCellType();
            this.setGroup();
            return this.properties.cellModels;
        },
        setMines: function(){
            // 爆弾設置

        },
        setCellType: function(){
            // cellType設定

        },
        setGroup: function(){
            // group設定

        }
    });
})(this);
 
/**
 * CellのView
 * 
 * CellのDOM生成とイベント設定、表示変更
 */
(function(window){
    var ns = window.MINESWEEPER || {};
 
    ns.CellView = Backbone.View.extend({
        el: 'li',
        initialize: function(options){
            this.modelEvents();
        },
        events: {
            'click': 'clickHandler',
        },
        modelEvents: function(){
            this.model.on('change:isOpened', $.proxy(this.open, this));
        },
        clickHandler: function(event){
            this.trigger('cellClick', event, this);
        },
        open: function(){
            this.$el.addClass('opened');
        },
        cellClick: function(){

        },
        template: _.template( $('#list-template').html() ),
        render: function(){
            this.$el.html(this.template(this.model.toJSON()));
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
(function(window){
    var ns = window.MINESWEEPER || {};
 
    ns.CellListView = Backbone.View.extend({
        initialize: function(options){
            this.collection = new ns.CellCollection();
            this.render();
        },
        render: function(){
            var lis = [];
            _(this.collection).each(function(index, model){
                lis[index] = new CellView(model);
                lis[index].$el.on('cellClick', this.cellClickHandler);
            }, this);
            this.$el.append(lis);
        },
        cellClickHandler: function(event, cellView){
            if(cellView.model.get('cellType')==='99'){
                this.trigger('burst');
            }
            this.cellGroupOpen();
        },
        cellGroupOpen: function(cellView){
            var group = cellView.model.get('group');
            _(this.collection).each(function(model, index){
                if(model.get('group')===group){
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
(function(window){
    var ns = window.MINESWEEPER || {};
 
    ns.TimeStatusView = Backbone.View.extend({
        properties: {
            min: 0,
            sec: 0,
            timerId: undefined,
        },
        initialize: function(options){
        },
        start: function(){
            var self = this;
            this.properties.timerId = window.setTimeout(function(){
                self.countUp();
            }, 1000);
        },
        stop: function(){
            window.clearInterval(this.properties.timerId);
        },
        countUp: function(){
            var prop = this.properties;
            prop.sec++;
            if(prop.sec == 60) {
                prop.min++;
                prop.sec = 0;
            }
            this.render();
        },
        render: function(){
            this.$el.html();
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
(function(window){
    var ns = window.MINESWEEPER || {},
        prop;
 
    ns.GameController = Backbone.View.extend({
        properties: {
            is_started: false,
        },
        initialize: function(options){
            this.options = options;
            this.initCellListView();
            this.initTimeStatusView();
        },
        initCellListView: function(){
            this.cellListView = new ns.CellListView({
                el: this.options.cellListEl
            });
            this.cellListView.on('burst', this.gameOver);
            console.log(this.cellListView);
        },
        initTimeStatusView: function(){
            this.timeStatusView = new ns.TimeStatusView({
                el: this.options.timeStatusEl
            });
            // this.timeStatusView.on('timeOver', this.gameOver);
        },
        events: {
            'click': 'gameStart'
        },
        gameStart: function(){
            this.timeStatusView.start();
        },
        gameOver: function(){
            // gameOver処理
        }
    });
})(this);
 
/**
 * GameController起動
 */
(function(window){
    var gameController = new MINESWEEPER.GameController({
        el: $('#minesweeper'),
        cellListEl: $('#cell_list'),
        timeStatusEl: $('#time_status')
    });
})(this);