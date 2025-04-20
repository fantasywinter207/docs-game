/**
 * 金币增加buff
 */
class GoldBuff extends Buff {
    constructor() {
        super({
            label: "GoldBuff",
            price: 500,
            effectDesc: "increases by 1 gold per second",
            imgPath: frames.buff.get("health")
        });
        this.isTime = true;
        this.second = 1000;
        this.gold = 1;
    }


    update(curTime) {
        if (this.isTime) {
            setTimeout(() => {
                this.player.info.gold += this.gold;
                this.isTime = true;
            }, this.second)
            this.isTime = false;
        }

    }
    updateSecond(second) {
        this.second = second;
    }

    updateGold(gold) {
        this.gold = gold;
    }
}

/**
 * 攻击力增加buff
 */
class IncreasesAttackDamage extends Buff{
    constructor() {
        super({
            label: "attack power",
            price: 100,
            effectDesc: "Increase attack power by 10%",
            imgPath: frames.buff.get("health")
        });
        this.percentage = 0.1
    }

    start() {
        this.updatePercentage(10)
    }

    update(curTime) {

    }

    /**
     * example 1
     * @param percentage Number
     */
    updatePercentage(percentage) {
        this.percentage = percentage / 100;
        const weapon = Player.instance.equipment.getCurrentWeapon();
        weapon.attackPower += weapon.attackPower * this.percentage;
        this.description = `Increase attack power by ${percentage}%`
    }

}

/**
 * 子弹速度buff
 */
class IncreasesBulletSpeed extends Buff {
    constructor() {
        super({
            label: "bullet speed",
            price: 300,
            effectDesc: "Increase bullet speed by 30%",
            imgPath: frames.buff.get("health")
        });
        this.percentage = 0.3
    }

    start() {
        this.updatePercentage(30)
    }

    update(curTime) {

    }

    /**
     * example 1
     * @param percentage Number
     */
    updatePercentage(percentage) {
        this.percentage = percentage / 100;
        const weapon = Player.instance.equipment.getCurrentWeapon();
        weapon.bulletSpeed  += weapon.bulletSpeed * this.percentage;
        this.description = `Increase bullet speed by ${percentage}%`
    }
}

/**
 * 增加生命值
 */
class IncreasesHealth extends Buff {
    constructor() {
        super({
            label: "Increases health",
            price: 200,
            effectDesc: "每秒增加生命值0.5",
            imgPath: frames.buff.get("health")
        });
        this.value = 0.5;
        this.second = 1000
        this.isTimer = true;
    }

    update(curTime) {
        if (this.isTimer) {
            setTimeout(() => {
                this.player.HP = this.player.HP === this.player.HPmax
                    ? this.player.HP
                    : this.player.HP + this.value

                this.isTimer = true;
            }, this.second)
            this.isTimer = false;
        }
    }


}

/**
 * 增加百分比最大生命值
 */
class IncreasesMaxHealth extends Buff {
    constructor() {
        super({
            label: "max health",
            price: 100,
            effectDesc: "增加30%最大生命值",
            imgPath: frames.buff.get("health")
        });
        this.max = 0.3
    }

    start() {
        this.updateMaxValue(30)
    }

    updateMaxValue(value) {
        this.HPmax = value / 100;
        Player.instance.HPmax += Player.instance.HPmax * this.max
        this.description = `增加${value }%最大生命值`
    }

}

class IncreasesPlayerMovementSpeed extends Buff {
    constructor() {
        super({
            label: "move speed",
            price: 300,
            effectDesc: "增加玩家移动速度50%",
            imgPath: frames.buff.get("health")
        });
        this.value = 0.5
    }

    start() {
        this.updatePlayerMoveSpeed(50)
    }

    updatePlayerMoveSpeed(value) {
        this.value = value / 100;
        Player.instance.speed += Player.instance.speed * this.value
        this.description = `Increase player move speed by ${value}%`
    }

}


