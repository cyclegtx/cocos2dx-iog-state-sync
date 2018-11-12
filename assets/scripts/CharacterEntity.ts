import CyEntity from "../IOG/CyEntity";

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
export default class CharacterEntity extends CyEntity {

    @property({
        displayName:"Avatar",
        type:cc.Node
    })
    avatarNode:cc.Node = null;

    animation:cc.Animation = null;

    private _dirX: number = 0;
    public get dirX(): number {
        return this._dirX;
    }
    public set dirX(value: number) {
        this._dirX = value;
        if (value < 0) {
            this.avatarNode.scaleX = -Math.abs(this.avatarNode.scaleX);
        } else {
            this.avatarNode.scaleX = Math.abs(this.avatarNode.scaleX);
        }
    }
    dirY:number = 0;

    onLoad(){
        super.onLoad();
        this.animation = this.getComponent(cc.Animation);
    }

    replace(attribute,value){
        super.replace(attribute,value);
        switch (attribute) {
            case "dirX":
                this.dirX = value;
                break;
            case "dirY":
                this.dirY = value;
                break;
        }
    }

    /**
     *当Action发生变化
     *
     * @param {string} oldAction 原Action
     * @param {string} newAction 新Action
     * @memberof CyEntity
     */
    onActionChange(oldAction: string, newAction: string) {
        super.onActionChange(oldAction,newAction);
        switch (newAction) {
            case "idle":
                this.node.active = true;
                this.animation.play("player1_idle");
                break;
            case "move":
                this.node.active = true;
                this.animation.play("player1_walk");
                break;
            case "aim":
                this.node.active = true;
                this.animation.play("player1_aim");
                break;
            case "hide":
                this.node.active = false;
                break;
            case "dead":
                this.node.active = false;
                break;
        }

        if(newAction === "dead"){
            this.avatarNode.color = cc.Color.RED;
        }else{
            this.avatarNode.color = cc.Color.WHITE;
        }
        if(newAction === "dead" || newAction === "idle"){
            this.enableSmoothMove = false;
        }else{
            this.enableSmoothMove = true;
        }


    }

    init(v){
        super.init(v);
        this.dirX = v.dirX;
        this.dirY = v.dirY;
    }
}
