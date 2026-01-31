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
   * ショットの最大個数
   * @type {number}
   */
  const SHOT_MAX_COUNT = 10;

  /**
   * ショットのインスタンスを格納する配列
   * @type {Array<Shot>}
   */
  let shotArray = [];

  /**
   * 自機キャラクターのインスタンス
   * @type {Viper}
   */
  let viper = null;

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
   * キーの押下状態を調べるためのオブジェクト
   * @global
   * @type {object}
   */
  window.isKeyDown = {};

  /**
   * イベントを設定する
   */
  function eventSetting() {
    window.addEventListener(
      'keydown',
      (event) => {
        isKeyDown[`key_${event.key}`] = true;
      },
      false
    );

    window.addEventListener(
      'keyup',
      (event) => {
        isKeyDown[`key_${event.key}`] = false;
      },
      false
    );

    // window.addEventListener('keydown', (event) => {
    //   // 自機が登場シーン中なら何もしないで終了する
    //   if (viper.isComing) return;
    //   // 入力されたキーに応じて処理内容を変化させる
    //   switch (event.key) {
    //     case 'ArrowLeft':
    //       viper.position.x -= 10;
    //       break;
    //     case 'ArrowRight':
    //       viper.position.x += 10;
    //       break;
    //     case 'ArrowUp':
    //       viper.position.y -= 10;
    //       break;
    //     case 'ArrowDown':
    //       viper.position.y += 10;
    //       break;
    //   }
    // });
  }

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
        // イベントの設定する
        // eventSetting();
        // 実行開始時のタイムスタンプを取得する
        // startTime = Date.now();
        // 描画処理を行う
        // render();

        // 画像読み込み含め、初期化の準備完了をチェックしてからrenderを実行する
        // MEMO: setTimeoutで再起呼び出ししているけど、Promise使ってもできそう（かつ制限時間を入れていないと画像が読み込まれなかった場合に無限ループで落ちそう）
        loadCheck();
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
    // ショットを初期化する
    for (let i = 0; i < SHOT_MAX_COUNT; ++i) {
      shotArray[i] = new Shot(ctx, 0, 0, 32, 32, './image/viper_shot.png');
    }
    // console.log(shotArray);

    // 自機キャラクターを初期化する
    viper = new Viper(ctx, 0, 0, 64, 64, './image/viper.png');
    viper.setComing(CANVAS_WIDTH / 2, CANVAS_HEIGHT, CANVAS_WIDTH / 2, CANVAS_HEIGHT - 100);
    viper.setShotArray(shotArray);
  }

  function loadCheck() {
    // 準備完了を意味す真偽値
    // MEMO: undefinedで初期化してもよさそうだけど、この後常にready &&で検証するため、あらかじめtrueをセットしている
    let ready = true;
    // 自機の状態を確認
    ready = ready && viper.ready;
    // ショットの状態を確認 MEMO: forEachのほうがいいのでは？
    shotArray.map((v) => {
      ready = ready && v.ready;
    });

    if (ready) {
      eventSetting();
      startTime = Date.now();
      render();
    } else {
      setTimeout(loadCheck, 100);
    }
  }

  /**
   * 描画処理を行う
   */
  function render() {
    // グローバルなアルファを必ず1.0で描画処理を開始する
    ctx.globalAlpha = 1.0;
    // 描画前に画面全体を不透明な明るいグレーで塗りつぶす
    util.drawRect(0, 0, canvas.width, canvas.height, '#eeeeee');
    // 現在までの経過時間を取得する
    // let nowTime = (Date.now() - startTime) / 1000;

    // 自機を更新
    viper.update();

    // ショットを更新
    shotArray.map((v) => {
      v.update();
    });

    // console.log(nowTime);
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
