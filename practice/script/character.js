/**
 * 座標を管理するためのクラス
 */
class Position {
  /**
   * @constructor
   * @param {number} x - X 座標
   * @param {number} y - Y 座標
   */
  constructor(x, y) {
    /**
     * X 座標
     * @type {number}
     */
    this.x = x;

    /**
     * Y 座標
     * @type {number}
     */
    this.y = y;
  }

  /**
   * 値を設定する
   * @param {number} [x] - 設定する X 座標
   * @param {number} [y] - 設定する Y 座標
   */
  set(x, y) {
    if (x != null) {
      this.x = x;
    }
    if (y != null) {
      this.y = y;
    }
  }
}

/**
 * キャラクター管理のための基幹クラス
 */
class Character {
  /**
   * @constructor
   * @param {CanvasRenderingContext2D} ctx - 描画などに利用する 2D コンテキスト
   * @param {number} x - X 座標
   * @param {number} y - Y 座標
   * @param {number} w - 幅
   * @param {number} h - 高さ
   * @param {number} life - キャラクターのライフ（生存フラグを兼ねる）
   * @param {string} imagePath - キャラクターの画像パス
   */
  constructor(ctx, x, y, w, h, life, imagePath) {
    /**
     * @type {boolean}
     */
    this.ready = false;

    /**
     * @type {CanvasRenderingContext2D}
     */
    this.ctx = ctx;

    /**
     * @type {Position}
     */
    this.position = new Position(x, y);

    /**
     * @type {number}
     */
    this.life = life;

    /**
     * @type {Image}
     */
    // this.image = image;
    this.image = new Image();
    this.image.addEventListener(
      'load',
      () => {
        this.ready = true;
      },
      false,
    );
    this.image.src = imagePath;

    /**
     * @type {number}
     */
    this.width = w;

    /**
     * @type {number}
     */
    this.height = h;
  }

  /**
   * キャラクターを描画する
   */
  draw() {
    // キャラクターのサイズを考慮してオフセットする量
    let offsetX = this.width / 2;
    let offsetY = this.height / 2;
    this.ctx.drawImage(this.image, this.position.x - offsetX, this.position.y - offsetY, this.width, this.height);
  }
}

/**
 * viper クラス
 */
class Viper extends Character {
  /**
   * @constructor
   * @param {CanvasRenderingContext2D} ctx - 描画などに利用する 2D コンテキスト
   * @param {number} x - X 座標
   * @param {number} y - Y 座標
   * @param {number} w - 幅
   * @param {number} h - 高さ
   * @param {Image} image - キャラクターの画像
   */
  constructor(ctx, x, y, w, h, image) {
    // Character クラスを継承しているので、まずは継承元となる
    // Character クラスのコンストラクタを呼び出すことで初期化する
    // （super が継承元のコンストラクタの呼び出しに相当する）
    super(ctx, x, y, w, h, 0, image);

    /**
     * 自身のスピード（update一回当たりの移動量）
     * @type {number}
     */
    this.speed = 3;

    /**
     * viper が登場中かどうかを表すフラグ
     * @type {boolean}
     */
    this.isComing = false;

    /**
     * 登場演出を開始した際のタイムスタンプ
     * @type {number}
     */
    this.comingStart = null;

    /**
     * 登場演出を開始する座標
     * @type {Position}
     */
    this.comingStartPosition = null;

    /**
     * 登場演出を完了とする座標
     * @type {Position}
     */
    this.comingEndPosition = null;

    /**
     * 自身が持つショットインスタンスの配列
     * @type {Array<Shot>}
     */
    this.shotArray = null;

    /**
     * ショット用のカウンター
     * @type {number}
     */
    this.shotCheckCounter = 0;

    /**
     * ショットを撃つことができる感覚
     * @type {number}
     */
    this.shotInterval = 10;
  }

  /**
   * 登場演出に関する設定を行う
   * @param {number} startX - 登場開始時の X 座標
   * @param {number} startY - 登場開始時の Y 座標
   * @param {number} endX - 登場終了とする X 座標
   * @param {number} endY - 登場終了とする Y 座標
   */
  setComing(startX, startY, endX, endY) {
    // 登場中のフラグを立てる
    this.isComing = true;
    // 登場開始時のタイムスタンプを取得する
    this.comingStart = Date.now();
    // 登場開始位置に自機を移動させる
    this.position.set(startX, startY);
    // 登場開始位置を設定する
    this.comingStartPosition = new Position(startX, startY);
    // 登場終了とする座標を設定する
    this.comingEndPosition = new Position(endX, endY);
  }

  /**
   * ショットを設定する
   * @param {*} shotArray
   */
  setShotArray(shotArray) {
    this.shotArray = shotArray;
  }

  /**
   * キャラクターの状態を更新し描画を行う
   * @param {*} viper
   * @param {*} isComing
   */

  update() {
    // 現時点のタイムスタンプを取得する
    let justTime = Date.now();

    // 登場シーンの処理
    if (this.isComing) {
      // 登場シーンが始まってからの開始時間
      let comingTime = (justTime - this.comingStart) / 1000;
      // 登場中は時間がたつほど上に向かて進む
      let y = this.comingStartPosition.y - comingTime * 50;
      // 一定の位置まで経過したら登場シーンを終了する
      if (y <= this.comingEndPosition.y) {
        this.isComing = false;
        y = this.comingEndPosition.y; // 行き過ぎの可能性もあるので位置を再設定
      }
      // 求めたY座標を自機に設定する
      this.position.set(this.position.x, y);
      // justTimeを100で割ったときの余りが50より小さくなる場合だけ半透明にする(登場時に点滅させる)
      if (justTime % 100 < 50) {
        this.ctx.globalAlpha = 0.5;
      }
    } else {
      // 機体の移動
      // --------------------------------------------------
      if (window.isKeyDown.key_ArrowLeft) this.position.x -= this.speed; // アローキーの左
      if (window.isKeyDown.key_ArrowRight) this.position.x += this.speed; // アローキーの右
      if (window.isKeyDown.key_ArrowUp) this.position.y -= this.speed; // アローキーの上
      if (window.isKeyDown.key_ArrowDown) this.position.y += this.speed; // アローキーの下
      // 移動後の位置が画面外に行ってしまうことを防ぐ
      let canvasWidth = this.ctx.canvas.width;
      let canvasHeight = this.ctx.canvas.height;
      let tx = Math.min(Math.max(this.position.x, 0), canvasWidth);
      let ty = Math.min(Math.max(this.position.y, 0), canvasHeight);
      this.position.set(tx, ty);
      // ショットの生成
      // --------------------------------------------------
      if (window.isKeyDown.key_z) {
        // ショットの生存を確認して非生存のモノがあれば生成する
        if (this.shotCheckCounter >= 0) {
          for (let i = 0; i < this.shotArray.length; ++i) {
            // 非生存かどうかを確認する
            if (this.shotArray[i].life <= 0) {
              // 自機キャラクターの座標にショットを生成
              this.shotArray[i].set(this.position.x, this.position.y);
              // ショットカウンターをリセット
              this.shotCheckCounter = -this.shotInterval;
              // 1つ生成したらループを抜ける
              break;
            }
          }
        }
      }
    }

    // ショットカウンターをインクリメント（毎フレーム）
    ++this.shotCheckCounter;

    // 自機キャラクターを描画する
    this.draw();

    // 念のためグローバルなアルファの状態を元に戻す
    this.ctx.globalAlpha = 1.0;
  }
}

/**
 * Shotクラス
 */
class Shot extends Character {
  /**
   * @constructor
   * @param {CanvasRenderingContext2D} ctx - 描画などに利用する 2D コンテキスト
   * @param {number} x - X 座標
   * @param {number} y - Y 座標
   * @param {number} w - 幅
   * @param {number} h - 高さ
   * @param {Image} image - キャラクターの画像
   */
  constructor(ctx, x, y, w, h, imagePath) {
    super(ctx, x, y, w, h, 0, imagePath);
    this.speed = 7;
  }

  set(x, y) {
    this.position.set(x, y);
    // 生存状態の1を設定
    this.life = 1;
  }

  update() {
    // lifeが0であれば何もしない
    if (this.life <= 0) return;
    // shotが画面外に出た場合はlifeを0にする（例：高さ5pxでyが-6pxであれば画面外にある）
    if (this.position.y + this.height < 0) {
      this.life = 0;
    }
    // ショットを上に向かって移動させる
    this.position.y -= this.speed;
    // ショットを描画する
    this.draw();
  }
}
