class TutorialUI {
    constructor(tutorialCompleteCallback) {
        this.tutorialCompleteCallback = tutorialCompleteCallback;
        this.borderSize = 50;
        this.targetBorderSize = 50;
        this.borderColor = null;
        this.currentStep = 0;
        this.totalSteps = 3;
        this.keyPressTime = 0;
        this.currentAnimatedKey = '';
        this.wasdIndex = -1;
        this.nextButton = null;
        this.backButton = null;
        this.createButtons();
        this.soundEffects = new SoundEffects();
        this.soundEffects.preload();
        this.initialSoundsPlayed = false;
    }

    // 实际按钮类
    TutorialButton = class {
        constructor(x, y, w, h, label, onClick) {
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
            this.label = label;
            this.onClick = onClick;
            this.isHovered = false;
            this.scale = 1;
        }

        draw() {
            drawingContext.save();

            const mainColor = color(100, 255, 218);
            const hoverColor = color(100, 255, 218, 153);
            const textColor = this.isHovered ? color(0) : mainColor;
            const bgColor = this.isHovered ? hoverColor : color(0, 0);

            const currentScale = lerp(this.scale, 1, 0.2);
            translate(this.x + this.w / 2, this.y + this.h / 2);
            scale(currentScale);

            drawingContext.shadowColor = mainColor;
            drawingContext.shadowBlur = this.isHovered ? 40 : 20;

            fill(bgColor);
            stroke(mainColor);
            strokeWeight(1);
            rectMode(CENTER);
            rect(0, 0, this.w, this.h, 5);

            fill(textColor);
            noStroke();
            textSize(24);
            textAlign(CENTER, CENTER);
            text(this.label, 0, 0);

            drawingContext.restore();
        }

        checkHover(parentUI) {
            this.isHovered =
                logicX > this.x &&
                logicX < this.x + this.w &&
                logicY > this.y &&
                logicY < this.y + this.h;
            if (this.isHovered) {
                parentUI.targetBorderSize = 80;
                parentUI.borderColor = color(100, 255, 218, 102);
            }
        }

        press() {
            this.scale = 0.95;
        }

        release() {
            this.scale = 1;
            return this.isHovered;
        }
    };

    // 创建按钮
    createButtons() {
        const btnWidth = 200;
        const btnHeight = 60;
        const btnX = (logicWidth - btnWidth) / 2;
        const btnY = logicHeight * 0.85;

        const buttonLabel = this.currentStep == this.totalSteps - 1 ? 'Start Game' : 'Next';

        this.nextButton = new this.TutorialButton(
            btnX,
            btnY,
            btnWidth,
            btnHeight,
            buttonLabel,
            () => {
                if (this.currentStep < this.totalSteps - 1) {
                    this.currentStep++;
                    this.createButtons();
                } else {
                    this.soundEffects.stopAllSounds();
                    this.soundEffects.playHorn();
                    setTimeout(() => {
                        if (this.tutorialCompleteCallback) {
                            this.tutorialCompleteCallback();
                        }
                    }, 100); // 假设喇叭声持续约1秒
                }
            }
        );

        // 创建Back按钮
        if (this.currentStep > 0) {
            this.backButton = new this.TutorialButton(
                btnX,
                btnY - 70,
                btnWidth,
                btnHeight,
                'Back',
                () => {
                    if (this.currentStep > 0) {
                        this.currentStep--;
                        this.createButtons();
                    }
                }
            );
        } else {
            this.backButton = null;
        }
    }

    // 绘制键盘按键
    drawKey(x, y, size, keyLabel, isActive) {
        push();

        const keyColor = color(40, 40, 40);
        const keyActiveColor = color(100, 255, 218);
        const textColor = color(255);
        const radius = 5;

        if (isActive) {
            drawingContext.shadowColor = keyActiveColor;
            drawingContext.shadowBlur = 15;
        }

        fill(isActive ? keyActiveColor : keyColor);
        stroke(isActive ? color(150, 255, 255) : color(100, 100, 100));
        strokeWeight(2);
        rect(x, y, size, size, radius);

        fill(isActive ? color(0) : textColor);
        noStroke();
        textSize(size * 0.5);
        textAlign(CENTER, CENTER);
        text(keyLabel, x + size / 2, y + size / 2);

        pop();
    }

    // 绘制空格键
    drawSpacebar(x, y, width, height, isActive) {
        push();

        const keyColor = color(40, 40, 40);
        const keyActiveColor = color(100, 255, 218);
        const textColor = color(255);
        const radius = 5;

        if (isActive) {
            drawingContext.shadowColor = keyActiveColor;
            drawingContext.shadowBlur = 15;
        }

        fill(isActive ? keyActiveColor : keyColor);
        stroke(isActive ? color(150, 255, 255) : color(100, 100, 100));
        strokeWeight(2);
        rect(x, y, width, height, radius);

        fill(isActive ? color(0) : textColor);
        noStroke();
        textSize(height * 0.6);
        textAlign(CENTER, CENTER);
        text("Space", x + width / 2, y + height / 2);

        pop();
    }

    // 绘制鼠标
    drawMouse(x, y, width, height, isLeftClicking) {
        push();

        const mouseColor = color(40, 40, 40);
        const activeColor = color(100, 255, 218);
        const inactiveColor = color(60, 60, 60);
        const radius = height / 4;

        // 鼠标整体
        fill(mouseColor);
        stroke(100);
        strokeWeight(2);
        rect(x, y, width, height, radius);

        // 鼠标分割线
        stroke(color(100, 100, 100));
        strokeWeight(1);
        line(x + width / 2, y, x + width / 2, y + height / 3);

        // 左键
        if (isLeftClicking) {
            drawingContext.save();
            drawingContext.shadowColor = activeColor;
            drawingContext.shadowBlur = 15;
            fill(activeColor);
            stroke(150, 255, 255);
            strokeWeight(2);
            rect(x, y, width / 2, height / 3, radius, 0, 0, 0);
            drawingContext.restore();
        } else {
            fill(inactiveColor);
            stroke(100);
            strokeWeight(2);
            rect(x, y, width / 2, height / 3, radius, 0, 0, 0);
        }

        // 右键
        fill(inactiveColor);
        stroke(100);
        strokeWeight(2);
        rect(x + width / 2, y, width / 2, height / 3, 0, radius, 0, 0);

        // 鼠标图标标签
        fill(255);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(16);
        text("Left", x + width / 4, y + height / 6);

        // 鼠标线
        stroke(color(150, 150, 150));
        strokeWeight(2);
        noFill();
        bezier(
            x + width / 2, y,
            x + width / 2 + 10, y - height / 5,
            x + width / 2 + 20, y - height / 2,
            x + width / 2 + 10, y - height * 0.6
        );

        pop();
    }

    draw() {
        background(0);

        // 标题
        fill(255);
        textSize(36);
        textAlign(CENTER, TOP);
        text("Game Controls", logicWidth / 2, logicHeight * 0.1);

        // 布局变量
        const leftColumnX = logicWidth * 0.3;
        const rightColumnX = logicWidth * 0.6;
        const middleY = logicHeight * 0.45;
        const keySize = 60;
        const keySpacing = 5;

        // 更新动画时间
        if (frameCount % 120 == 0) {
            this.keyPressTime = frameCount;
            switch (this.currentStep) {
                case 0:
                    // WASD 按顺序点亮
                    const wasdSequence = ['W', 'A', 'S', 'D'];
                    this.wasdIndex = (this.wasdIndex + 1) % wasdSequence.length;
                    this.currentAnimatedKey = wasdSequence[this.wasdIndex];
                    break;
                case 1:
                    this.currentAnimatedKey = 'MOUSE';
                    break;
                case 2:
                    this.currentAnimatedKey = 'SPACE';
                    break;
            }
        }

        // 计算按键当前是否正在动画中
        const keyAnimationDuration = 30;
        const isAnimating = frameCount - this.keyPressTime < keyAnimationDuration;

        push();
        switch (this.currentStep) {
            case 0:
                this.drawKey(
                    leftColumnX,
                    middleY - keySize - keySpacing,
                    keySize,
                    "W",
                    isAnimating && this.currentAnimatedKey == 'W'
                );
                this.drawKey(
                    leftColumnX - keySize - keySpacing,
                    middleY,
                    keySize,
                    "A",
                    isAnimating && this.currentAnimatedKey == 'A'
                );
                this.drawKey(
                    leftColumnX,
                    middleY,
                    keySize,
                    "S",
                    isAnimating && this.currentAnimatedKey == 'S'
                );
                this.drawKey(
                    leftColumnX + keySize + keySpacing,
                    middleY,
                    keySize,
                    "D",
                    isAnimating && this.currentAnimatedKey == 'D'
                );

                textAlign(LEFT, CENTER);
                textSize(24);
                fill(255);
                text("Movement Controls:", rightColumnX, middleY - 60);

                textSize(20);
                fill(200);
                text("W - Move Up", rightColumnX, middleY - 20);
                text("A - Move Left", rightColumnX, middleY + 10);
                text("S - Move Down", rightColumnX, middleY + 40);
                text("D - Move Right", rightColumnX, middleY + 70);
                break;

            case 1: // 鼠标控制
                this.drawMouse(
                    leftColumnX - 40,
                    middleY - 60,
                    80,
                    120,
                    isAnimating && this.currentAnimatedKey == 'MOUSE'
                );

                textAlign(LEFT, CENTER);
                textSize(24);
                fill(255);
                text("Combat Controls:", rightColumnX, middleY - 60);

                textSize(20);
                fill(200);
                text("Left Click - Fire Bullets", rightColumnX, middleY - 20);
                text("Aim with the mouse to target enemies", rightColumnX, middleY + 20);
                text("Destroy obstacles and defeat enemies", rightColumnX, middleY + 60);
                break;

            case 2: // 空格键
                this.drawSpacebar(
                    leftColumnX - 120,
                    middleY,
                    240,
                    60,
                    isAnimating && this.currentAnimatedKey == 'SPACE'
                );

                textAlign(LEFT, CENTER);
                textSize(24);
                fill(255);
                text("Special Skills:", rightColumnX, middleY - 60);

                textSize(20);
                fill(200);
                text("Spacebar - Use Special Ability", rightColumnX, middleY - 20);
                text("Ship has a unique special skill", rightColumnX, middleY + 20);
                text("Watch the cooldown timer before using again", rightColumnX, middleY + 60);
                break;
        }
        pop();

        // 进度指示器
        push();
        const dotSize = 12;
        const dotSpacing = 25;
        const dotsWidth = (this.totalSteps * dotSpacing) - dotSpacing;
        const dotsStartX = (logicWidth - dotsWidth) / 2;

        for (let i = 0; i < this.totalSteps; i++) {
            const dotX = dotsStartX + (i * dotSpacing);
            const dotY = logicHeight * 0.75;

            fill(i == this.currentStep ? color(100, 255, 218) : color(80, 80, 80));
            noStroke();
            ellipse(dotX, dotY, dotSize, dotSize);
        }
        pop();

        // 绘制next按钮
        this.nextButton.checkHover(this);
        this.nextButton.draw();

        if (this.backButton) {
            this.backButton.checkHover(this);
            this.backButton.draw();
        }
    }

    // 处理鼠标按下事件
    handleMousePressed() {
        if (this.nextButton && this.nextButton.isHovered) {
            this.nextButton.press();
        }
        if (this.backButton && this.backButton.isHovered) {
            this.backButton.press();
        }
    }

    // 处理鼠标释放事件
    handleMouseReleased() {
        if (this.nextButton && this.nextButton.release() && this.nextButton.isHovered) {
            this.nextButton.onClick();
        }
        if (this.backButton && this.backButton.release() && this.backButton.isHovered) {
            this.backButton.onClick();
        }
    }

    handleWindowResized() {
        this.createButtons();
    }
}