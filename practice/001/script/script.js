(() => {
  /**
   * canvas の幅
   * @type {number}
   */
  const CANVAS_WIDTH = 640;
  /**
   * canvas の高さ
   * @type {number}
   */
  const CANVAS_HEIGHT = 480;

  /**
   * Canvas2D API をラップしたユーティリティクラス
   * @type {Canvas2DUtility}
   */
  let util = null;
  /**
   * 描画対象となる Canvas Element
   * @type {HTMLCanvasElement}
   */
  let canvas = null;
  /**
   * Canvas2D API のコンテキスト
   * @type {CanvasRenderingContext2D}
   */
  let ctx = null;
  /**
   * イメージのインスタンス
   * @type {Image}
   */
  let image = null;
  /**
   * 実行開始時のタイムスタンプ
   * @type {number}
   */
  let startTime = null;

  /**
   * ページのロードが完了したときに発火する load イベント
   */
  window.addEventListener(
    'load',
    () => {
      // ユーティリティクラスを初期化
      util = new Canvas2DUtility(document.body.querySelector('#main_canvas'));
      // ユーティリティクラスから canvas を取得
      canvas = util.canvas;
      // ユーティリティクラスから 2d コンテキストを取得
      ctx = util.context;

      // まず最初に画像の読み込みを開始する
      util.imageLoader('./image/viper.png', (loadedImage) => {
        // 引数経由で画像を受け取り変数に代入しておく
        image = loadedImage;
        // 初期化処理を行う
        initialize();
        // 実行開始時のタイムスタンプを取得する
        startTime = Date.now();
        // 描画処理を行う
        render();
      });
    },
    false
  );

  /**
   * canvas やコンテキストを初期化する
   */
  function initialize() {
    // canvas の大きさを設定
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
  }

  /**
   * 描画処理を行う
   */
  function render() {
    // 描画前に画面全体を不透明な明るいグレーで塗りつぶす
    util.drawRect(0, 0, canvas.width, canvas.height, '#eeeeee');

    // 現在までの経過時間を取得する
    let nowTime = (Date.now() - startTime) / 1000;

    // nowTimeをラジアンに見立ててsinに与えることで-1~1の往復する値を取得できる
    let s = Math.sin(nowTime);
    let x = s * 100;

    // 画像を描画する
    ctx.drawImage(image, CANVAS_WIDTH / 2 + x, CANVAS_HEIGHT / 2);

    requestAnimationFrame(render);
  }

  /**
   * 特定の範囲におけるランダムな整数の値を生成する
   * @param {number} range - 乱数を生成する範囲（0 以上 ～ range 未満）
   */
  function generateRandomInt(range) {
    let random = Math.random();
    return Math.floor(random * range);
  }
})();
