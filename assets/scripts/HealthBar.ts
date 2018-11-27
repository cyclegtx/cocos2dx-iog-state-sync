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
export default class HealthBar extends cc.Component {

    backNode: cc.Node = null;
    frontNode:cc.Node = null;

    maxHealth:number = 0;
    health: number = 0;
    
    @property
    width:number = 100;

    @property
    height:number = 11;

    private _show: boolean = false;
    public get show(): boolean {
        return this._show;
    }
    public set show(value: boolean) {
        this._show = value;
        if(this._show){
            this.node.stopAllActions();
            this.node.runAction(cc.sequence([
                cc.fadeIn(0.3),
                cc.delayTime(3),
                cc.fadeOut(0.3),
                cc.callFunc(()=>{
                    this.show = false;
                })
            ]));
        }
    }

    onLoad () {
        this.backNode = this.node.getChildByName("Back");
        this.frontNode = this.node.getChildByName("Front");
        this.backNode.width = this.width;
        this.frontNode.width = this.width;
        this.backNode.height = this.height;
        this.frontNode.height = this.height;
        this.backNode.setPosition(-this.width/2,0);
        this.frontNode.setPosition(-this.width/2,0);
        this.node.width = this.width;
        this.node.height = this.height;
        this.node.opacity = 0;
    }

    setHealth(_health:number){
        this.health = _health;
        this.frontNode.width = (this.health/this.maxHealth)*this.width;
        this.show = true;
    }

}
