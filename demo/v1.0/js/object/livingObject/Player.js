class Player extends BasicObject {
    static instance
    constructor(name, xCoordinate, yCoordinate, xSize, ySize, HP, speed, skillCD, maxSkillCD) {
        super(
            name,
            PLAYER_TYPE,
            xCoordinate,
            yCoordinate,
            xSize,
            ySize,
            NO_HARM_ATTACK_BIT,
            HP,
            speed,
        );
        // 单例模式，防止多次实例化，全局可获取玩家对象
        if (Player.instance) return Player.instance;
        Player.instance = this;
        this.HPmax = HP;
        this.skillCD = skillCD;
        this.maxSkillCD = maxSkillCD;
        this.equipment = new Equipment(name, 0, 0, 0, 0, 0, {});
        this.wavePushX = 0;
        this.wavePushY = 0;
        this.currentFrames = [];
        this.frameIndex = 0;
        this.lastFrameTime = 0;
        this.frameInterval = 100;
        this.pets = [];

        this.hasAttackedByAoe = false;
        this.lastAttackByAoeTime = 0;

        // 受击变红效果的属性
        this.isFlashing = false;
        this.flashDuration = 150; // 闪烁持续时间(毫秒)
        this.flashStartTime = 0;
    }

    updateAnimation() {
        if (millis() - this.lastFrameTime > this.frameInterval) {
            this.frameIndex = (this.frameIndex + 1) % this.currentFrames.length;
            this.lastFrameTime = millis();
        }
        // 更新受击闪烁
        if (this.isFlashing && (millis() - this.flashStartTime > this.flashDuration)) {
            this.isFlashing = false;
        }
    }

    // 开始受击闪烁
    startFlash() {
        this.isFlashing = true;
        this.flashStartTime = millis();
    }

    setAnimation(type) {
        if (type == 'D') {
            this.currentFrames = frames.shipMove.D;
        }
        else if (type == 'idleD') {
            this.currentFrames = frames.shipMove.IdleD;
        }
        else if (type == 'S') {
            this.currentFrames = frames.shipMove.S;
        }

        else if (type == 'A') {
            this.currentFrames = frames.shipMove.A;
        }

        else if (type == 'W') {
            this.currentFrames = frames.shipMove.W;
        }

        else if (type == 'DS') {
            this.currentFrames = frames.shipMove.DS;
        }

        else if (type == 'AS') {
            this.currentFrames = frames.shipMove.AS;
        }

        else if (type == 'AW') {
            this.currentFrames = frames.shipMove.AW;
        }

        else if (type == 'DW') {
            this.currentFrames = frames.shipMove.DW;
        }

        this.frameIndex = 0
    }

    drawmainboat(){
        imageMode(CENTER);

        // 受击打应用红色染色效果
        if (this.isFlashing) {
            push();
            tint(255, 0, 0); // 应用红色染色
            image(this.currentFrames[this.frameIndex],
                  this.xCoordinate, this.yCoordinate,
                  this.currentFrames[this.frameIndex].width/5, this.currentFrames[this.frameIndex].height/5);
            pop();
        } else {
            image(this.currentFrames[this.frameIndex],
                  this.xCoordinate, this.yCoordinate,
                  this.currentFrames[this.frameIndex].width/5, this.currentFrames[this.frameIndex].height/5);
        }
    }


    show() {
        //fill(255);
        //super.show();
        this.updateAnimation();
        this.drawmainboat();
    }

    updateHP(change) {
        super.updateHP(change);

        // 如果受到伤害，触发受伤效果
        if (change < 0) {
            this.startFlash();
        }
    }

    move(xSpeed, ySpeed) {
        let newX = this.xCoordinate + xSpeed * this.speed;
        let newY = this.yCoordinate + ySpeed * this.speed;

        newX = constrain(newX, this.xSize / 2, logicWidth - this.xSize / 2);
        newY = constrain(newY, this.ySize / 2, logicHeight - this.ySize / 2);

        this.xCoordinate = newX;
        this.yCoordinate = newY;

        /* if(xSpeed > 0 && ySpeed == 0){

            this.setAnimation('D');//调用向右移动帧
        }

        if(xSpeed < 0 && ySpeed == 0){

            this.setAnimation('A');//调用向右移动帧
        }

        if(ySpeed > 0 && xSpeed == 0){

            this.setAnimation('S');//调用向右移动帧
        }

        if(ySpeed < 0 && xSpeed == 0){

            this.setAnimation('W');//调用向右移动帧
        }

        if(xSpeed > 0  && ySpeed > 0){

            this.setAnimation('DS');//调用向右移动帧
        }

        if(xSpeed > 0  && ySpeed < 0){

            this.setAnimation('DW');//调用向右移动帧
        }

        if(xSpeed < 0  && ySpeed < 0){

            this.setAnimation('AW');//调用向右移动帧
        }

        if(xSpeed < 0  && ySpeed > 0){

            this.setAnimation('AS');//调用向右移动帧
        }

        if(xSpeed == 0  && ySpeed == 0  ){

            this.setAnimation('idleD');//调用向右移动
        } */

    }

    applyWaveForce(forceX, forceY) {
        this.wavePushX = forceX / this.speed;
        this.wavePushY = forceY / this.speed;
    }


    putOnBuff() {

    }
}
