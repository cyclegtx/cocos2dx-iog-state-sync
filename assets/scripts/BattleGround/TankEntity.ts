import HealthBar from "../HealthBar";
import CyEntity from "../../IOG/CyEntity";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class TankEntity extends CyEntity {

    @property({
        type: HealthBar
    })
    healthBar: HealthBar = null;

    maxHealth: number = 0;
    private _health: number = 0;
    public get health(): number {
        return this._health;
    }
    public set health(value: number) {
        if (this._health != value) {
            this._health = value;
            this.healthBar.setHealth(this._health);
        }
    }
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        super.onLoad();
        this.node.scale = 0;
        this.node.runAction(cc.scaleTo(0.3, 1, 1));
    }

    init(v) {
        super.init(v);
        this.maxHealth = v.maxHealth;
        this._health = v.health;
        this.healthBar.maxHealth = v.maxHealth;
        this.healthBar.health = v.health;
    }

    replace(attribute, value) {
        super.replace(attribute, value);
        switch (attribute) {
            case "health":
                this.health = value;
                break;
        }
    }
}
