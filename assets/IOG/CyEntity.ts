import CyStateEngine from "./CyStateEngine";

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
    debugLineWidth:number = 2;
    graphics:cc.Graphics = null;

    /**
     *Entity id
     *
     * @type {string}
     * @memberof CyEntity
     */
    id:string = "";

    targetPosition:cc.Vec2 = cc.Vec2.ZERO;
    targetRotation:number = 0;

    type:string = "";
    width:number = 0;
    height:number = 0;
    r:number = 0;
    scale:number = 1;
    sides:number = 0;
    bodyType:string = null;

    physicsOptions:any = null;
    physicsEnabled:boolean = false;
    action:string = "";


    engine:CyStateEngine = null;

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
        this.engine = CyStateEngine.instance;
    }

    init(v){
        this.type = v.type;
        this.width = v.width;
        this.height = v.height;
        this.r = v.r;
        this.scale = v.scale;
        this.sides =v.sides;
        this.targetPosition = cc.v2(v.x,v.y);
        this.targetRotation = cc.misc.radiansToDegrees(v.angle);
        this.node.setPosition(this.targetPosition);
        this.node.setRotation(this.targetRotation);
        this.action = v.action;

        this.debug = v.debug === undefined?false:v.debug;

        this.physicsOptions = v.physicsOptions;
        this.physicsEnabled = v.physicsEnabled != undefined?v.physicsEnabled:false;
        this.bodyType = v.bodyType;

        if (this.debug) {
            this.graphics = this.addComponent(cc.Graphics);
        }
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
            case "r":
                this.r = value;
                this.drawDebug();
                break;
            case "scale":
                this.scale = value;
                this.node.scale = value;
                this.drawDebug();
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
        if (this.debug && this.graphics != null && this.bodyType != undefined) {
            
            this.graphics.clear();
            this.graphics.lineWidth = this.debugLineWidth;

            if (this.physicsEnabled) {
                //开启物理效果

                if (this.physicsOptions.isSensor){
                    //Sensor
                    this.graphics.strokeColor = cc.color(161, 196, 90, 255);
                    this.graphics.fillColor = cc.color(161, 196, 90, 60);
                }else{
                    if (this.physicsOptions && this.physicsOptions.isStatic) {
                        //静态物体
                        this.graphics.strokeColor = cc.color(37, 42, 52, 255);
                        this.graphics.fillColor = cc.color(37, 42, 52, 60);
                    } else {
                        //动态物体
                        this.graphics.strokeColor = cc.color(255, 46, 99, 255);
                        this.graphics.fillColor = cc.color(255, 46, 99, 60);
                    }
                }
                
            } else {
                //没有物理效果
                this.graphics.strokeColor = cc.color(255, 188, 66, 255);
                this.graphics.fillColor = cc.color(255, 188, 66, 60);
            }


            //画坐标轴
            // this.graphics.strokeColor = cc.Color.CYAN;
            // this.graphics.moveTo(0, 0);
            // this.graphics.lineTo(3, 0);
            // this.graphics.stroke();

            // this.graphics.moveTo(0, 0);
            // this.graphics.lineTo(0, 3);
            // this.graphics.stroke();

            
            if(this.bodyType == "rect"){

                this.graphics.moveTo(0, 0);
                this.graphics.lineTo(this.width / 2, 0);
                this.graphics.stroke();

                this.graphics.moveTo(-this.width / 2, this.height / 2);
                this.graphics.lineTo(this.width / 2, this.height / 2);
                this.graphics.lineTo(this.width / 2, -this.height / 2);
                this.graphics.lineTo(-this.width / 2, -this.height / 2);
                this.graphics.lineTo(-this.width / 2, this.height / 2);
                this.graphics.fill();
                this.graphics.stroke();

            }else if(this.bodyType == "circle"){

                this.graphics.moveTo(0, 0);
                this.graphics.lineTo(this.width / 2, 0);
                this.graphics.stroke();
                
                this.graphics.circle(0,0,this.r);
                this.graphics.fill();
                this.graphics.stroke();

            }else if(this.bodyType == "polygon"){


                let vertices = [];
                let theta = 2 * Math.PI / this.sides,
                    offset = theta * 0.5;

                for (let i = 0; i < this.sides; i++) {
                    let angle = offset + (i * theta),
                        xx = Math.cos(angle) * this.r,
                        yy = Math.sin(angle) * this.r;
                    vertices.push({ x: xx, y: yy });
                }

                vertices.forEach((v, k) => {
                    if (k == 0) {
                        this.graphics.moveTo(0, 0);
                        this.graphics.lineTo(v.x, v.y);
                        this.graphics.stroke();
                        this.graphics.moveTo(v.x, v.y);
                    } else {
                        this.graphics.lineTo(v.x, v.y);
                    }
                });
                this.graphics.close();
                this.graphics.fill();
                this.graphics.stroke();

            }

            
        }
    }

    /**
     *当从服务器移除时
     *
     * @memberof CyEntity
     */
    onRemove(){

        this.engine.roundContainer.removeChild(this.node);
        this.engine.entities.delete(this.id);
        this.engine.players.delete(this.id);

    }

}
