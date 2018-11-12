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
export default class CyEntity extends cc.Component {

    debug:boolean = false;
    graphics:cc.Graphics = null;

    targetPosition:cc.Vec2 = cc.Vec2.ZERO;
    targetRotation:number = 0;

    width:number = 0;
    height:number = 0;

    physicsOptions:any = null;
    physicsEnabled:boolean = false;
    action:string = "";

    /**
     *是否平滑移动
     *
     * @type {boolean}
     * @memberof CyEntity
     */
    enableSmoothMove:boolean = true;

    /**
     *是否平滑旋转
     *
     * @type {boolean}
     * @memberof CyEntity
     */
    enableSmoothRotation:boolean = true;

    onLoad(){
        if(this.debug){
            this.graphics = this.addComponent(cc.Graphics);
        }
    }

    init(v){
        this.width = v.width;
        this.height = v.height;
        this.targetPosition = cc.v2(v.x,v.y);
        this.targetRotation = cc.misc.radiansToDegrees(v.angle);
        this.node.setPosition(this.targetPosition);
        this.node.setRotation(this.targetRotation);
        this.action = v.action;

        this.physicsOptions = v.physicsOptions;

        this.physicsEnabled = v.physicsEnabled != undefined?v.physicsEnabled:false;
        this.drawDebug();
    }

    replace(attribute:string,value:any){
        switch (attribute) {
            case "x":
                this.targetPosition.x = value;
                break;
            case "y":
                this.targetPosition.y = value;
                break;
            case "angle":
                this.targetRotation = cc.misc.radiansToDegrees(value);
                break;
            case "action":
                this.onActionChange(this.action,value);
                break;
            case "physicsEnabled":
                this.physicsEnabled = value;
                this.drawDebug();
                break;
            case "physicsOptions":
                this.physicsOptions = value;
                this.drawDebug();
                break;
        }
    }

    update(dt){
        if(this.enableSmoothMove){
            this.node.setPosition(this.node.position.lerp(this.targetPosition,0.3));
        }else{
            this.node.setPosition(this.targetPosition);
        }
        if(this.enableSmoothRotation){
            this.rotateToTarget();
        }else{
            this.node.setRotation(this.targetRotation);
        }
    }

    rotateToTarget(){
        let from = this.node.rotation;
        let to = this.targetRotation;
        if(Math.abs(to - from) > 0.01){
            this.node.setRotation(this.angleLerp(from, to, 0.01));
        }
    }

    angleLerp(from:number,to: number, step: number):number {
        let res = from;
        let delta = Math.abs(to - from) / step;
        if (Math.abs(to - from) < delta) {
            res = to;
        } else {
            res = from > to ? from - delta : from + delta;
        }
        return res;
    }

    /**
     *当Action发生变化
     *
     * @param {string} oldAction 原Action
     * @param {string} newAction 新Action
     * @memberof CyEntity
     */
    onActionChange(oldAction:string,newAction:string) {
        this.action = newAction;
    }

    /**
     *绘制Debug
     *
     * @memberof CyEntity
     */
    drawDebug(){
        if (this.debug && this.graphics != null) {
            if (this.physicsEnabled) {
                //开启物理效果
                if (this.physicsOptions && this.physicsOptions.isStatic) {
                    //静态物体为白色
                    this.graphics.strokeColor = cc.Color.WHITE;
                    this.graphics.fillColor = cc.Color.WHITE.setA(60);
                } else {
                    //动态物体为白色
                    this.graphics.strokeColor = cc.Color.RED;
                    this.graphics.fillColor = cc.Color.RED.setA(60);
                }
            } else {
                //没有物理效果
                this.graphics.strokeColor = cc.Color.YELLOW;
                this.graphics.fillColor = cc.Color.YELLOW.setA(60);
            }

            this.graphics.lineWidth = 1;

            this.graphics.moveTo(0, 0);
            this.graphics.lineTo(0, this.height / 2);
            this.graphics.lineTo(this.width / 2, this.height / 2);
            this.graphics.lineTo(this.width / 2, -this.height / 2);
            this.graphics.lineTo(-this.width / 2, -this.height / 2);
            this.graphics.lineTo(-this.width / 2, this.height / 2);
            this.graphics.lineTo(0, this.height / 2);
            this.graphics.close();
            this.graphics.fill();
            this.graphics.stroke();
        }
    }

    /**
     *当从服务器移除时
     *
     * @memberof CyEntity
     */
    onRemove(){

    }

}
