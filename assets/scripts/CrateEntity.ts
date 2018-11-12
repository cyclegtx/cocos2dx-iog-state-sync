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
export default class CrateEntity extends CyEntity {
    @property({
        type:cc.Node
    })
    shadowNode:cc.Node = null;

    @property({
        type:cc.Sprite
    })
    avatar:cc.Sprite = null;

    @property({
        displayName:"在空中时的Sprite",
        type:cc.SpriteFrame
    })
    spriteInAir:cc.SpriteFrame = null;

    @property({
        displayName:"在地面时的Sprite",
        type:cc.SpriteFrame
    })
    spriteOnGround:cc.SpriteFrame = null;

    @property({
        displayName:"移除时的效果",
        type:cc.Prefab
    })
    prefabOnRemove:cc.Prefab = null;

    action:string = null;
    
    animation:cc.Animation = null;
    
    onLoad () {
        super.onLoad();
        this.animation = this.getComponent(cc.Animation);
    }


    init(v) {
        super.init(v);
    }

    replace(attribute, value) {
        super.replace(attribute, value);
    }
    /**
     *当Action发生变化
     *
     * @param {string} oldAction 原Action
     * @param {string} newAction 新Action
     * @memberof CyEntity
     */
    onActionChange(oldAction: string, newAction: string) {
        super.onActionChange(oldAction, newAction);
        switch (newAction) {
            case "hold":
                this.shadowNode.active = false;
                this.avatar.spriteFrame = this.spriteInAir;
                break;
            case "idle":
                this.shadowNode.active = true;
                this.avatar.spriteFrame = this.spriteOnGround;
                break;
            case "throw":
                this.shadowNode.active = true;
                this.avatar.spriteFrame = this.spriteOnGround;
                this.avatar.node.runAction(cc.jumpBy(0.3,cc.Vec2.ZERO,8,2));
                break;
            case "break":
                let node = cc.instantiate(this.prefabOnRemove);
                this.node.addChild(node);
                this.animation.play("onhit");
                break;
        }
    }


    // start () {

    // }

    // update (dt) {}

}
