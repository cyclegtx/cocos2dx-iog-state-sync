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
export default class BulletEntity extends CyEntity {

    onRemove(){
        this.node.runAction(cc.sequence([
            cc.spawn([
                cc.fadeOut(0.3),
                cc.scaleTo(0.3,0,0)
            ]),
            cc.callFunc(()=>{
                this.engine.roundContainer.removeChild(this.node);
                this.engine.entities.delete(this.id);
                this.engine.players.delete(this.id);     
            },this)
        ]));
    }
}
