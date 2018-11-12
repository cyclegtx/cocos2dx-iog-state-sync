import CameraController from "./CameraController";
import CyStateEngine from "../IOG/CyStateEngine";

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
export default class InputManager extends cc.Component {

    public inputDirection: cc.Vec2 = cc.Vec2.ZERO;
    public inputDirectionLocal: cc.Vec2 = cc.Vec2.ZERO;
    public leftPressed: boolean = false;
    public rightPressed: boolean = false;
    public upPressed: boolean = false;
    public downPressed:boolean = false;

    @property(cc.Node)
    mousePoint:cc.Node = null;

    @property({
        displayName:"摄像机",
        type:cc.Camera
    })
    camera:cc.Camera = null;

    _mousePosition:cc.Vec2 = cc.Vec2.ZERO;
    public get mousePosition():cc.Vec2{
        // CameraController.instance.camera.getCameraToWorldPoint(this.mousePostionInCanvas, this._mousePosition)
        this._mousePosition = this.mousePositionInCanvas;
        return this._mousePosition;
    }

    mouseLeftButtonDown:boolean = false;
    mouseRightButtonDown:boolean = false;

    mousePositionInCanvas:cc.Vec2 = cc.Vec2.ZERO;
    eventPosition:cc.Vec2 = cc.Vec2.ZERO;
    static instance: InputManager;
    
    engine:CyStateEngine = null;

    onLoad () {
        if (InputManager.instance == undefined) {
            InputManager.instance = this;
        } else {
            console.log("InputManager 单例失败");
            return;
        }
        this.engine = CyStateEngine.instance;
        this.schedule(this.sendMousemoveCMDToRoom, 0.05,cc.macro.REPEAT_FOREVER,0);
    }

    sendMousemoveCMDToRoom(){
        if (this.engine.room) {
            //将cocos2dx坐标转换为系标准屏幕坐标系
            this.engine.sendCMDToRoom("mousemove", { x: this.mousePositionInCanvas.x, y: -this.mousePositionInCanvas.y });
        }
    }

    // update(dt){
    //     this.cyEngine.sendInputToServer({
    //         dir:this.inputDirection
    //     })
    // }

    // start(){
    // }

    onEnable(){
        this.node.on(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this);
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
        this.node.on(cc.Node.EventType.MOUSE_UP, this.onMouseUp, this);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        //使canvas之外的地方依然可以响应事件
        if(document){
            document.addEventListener("keydown", this.onKeyDown.bind(this));
            document.addEventListener("keyup", this.onKeyUp.bind(this));
        }
    }

    onDisable(){
        this.node.off(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this);
        this.node.off(cc.Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
        this.node.off(cc.Node.EventType.MOUSE_UP, this.onMouseUp, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        if (document) {
            document.removeEventListener("keydown", this.onKeyDown.bind(this));
            document.removeEventListener("keyup", this.onKeyUp.bind(this));
        }
    }

    onDestroy(){
        this.node.off(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this);
        this.node.off(cc.Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
        this.node.off(cc.Node.EventType.MOUSE_UP, this.onMouseUp, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        if (document) {
            document.removeEventListener("keydown", this.onKeyDown.bind(this));
            document.removeEventListener("keyup", this.onKeyUp.bind(this));
        }
    }

    onMouseMove(e:cc.Event.EventMouse){
        this.eventPosition = e.getLocation();
        this.calcMousePositionInCanvas();
    }

    onMouseDown(e:cc.Event.EventMouse){
        switch (e.getButton()) {
            case 0:
                this.mouseLeftButtonDown = true;
                this.engine.sendCMDToRoom("mlb", true);
                break;
            case 2:
                this.mouseRightButtonDown = true;
                this.engine.sendCMDToRoom("mrb", true);
                break;
        }
    }

    onMouseUp(e: cc.Event.EventMouse) {
        switch (e.getButton()) {
            case 0:
                this.mouseLeftButtonDown = false;
                this.engine.sendCMDToRoom("mlb", false);
                break;
            case 2:
                this.mouseRightButtonDown = false;
                this.engine.sendCMDToRoom("mrb", false);
                break;
        }
    }

    onKeyDown(e:cc.Event.EventKeyboard){
        switch (e.keyCode) {
            case cc.macro.KEY.w:
                this.upPressed = true;
                let wy = this.downPressed?0:1;
                if (this.inputDirectionLocal.y != wy){
                    this.inputDirectionLocal.y = wy;
                    //将cocos2dx坐标转换为系标准屏幕坐标系
                    this.engine.sendCMDToRoom("move", { x: this.inputDirectionLocal.x, y: -this.inputDirectionLocal.y});
                }
                break;
            case cc.macro.KEY.s:
                this.downPressed = true;
                let sy = this.upPressed ? 0 : -1;
                if (this.inputDirectionLocal.y != sy){
                    this.inputDirectionLocal.y = sy;
                    //将cocos2dx坐标转换为系标准屏幕坐标系
                    this.engine.sendCMDToRoom("move", { x: this.inputDirectionLocal.x, y: -this.inputDirectionLocal.y});
                }
                break;
            case cc.macro.KEY.a:
                this.leftPressed = true;
                let ax = this.rightPressed ? 0 : -1;
                if(this.inputDirectionLocal.x != ax){
                    this.inputDirectionLocal.x = ax;
                    //将cocos2dx坐标转换为系标准屏幕坐标系
                    this.engine.sendCMDToRoom("move", { x: this.inputDirectionLocal.x, y: -this.inputDirectionLocal.y});
                }
                break;
            case cc.macro.KEY.d:
                this.rightPressed = true;
                let dx = this.leftPressed ? 0 : 1;
                if(this.inputDirectionLocal.x != dx){
                    this.inputDirectionLocal.x = dx;
                    //将cocos2dx坐标转换为系标准屏幕坐标系
                    this.engine.sendCMDToRoom("move", { x: this.inputDirectionLocal.x, y: -this.inputDirectionLocal.y});
                }
                break;
            default:
                break;
        }

    }
    
    onKeyUp(e:cc.Event.EventKeyboard){
        switch (e.keyCode) {
            case cc.macro.KEY.w:
                this.upPressed = false;
                let wy = this.downPressed ? -1 : 0;
                if (this.inputDirectionLocal.y != wy){
                    this.inputDirectionLocal.y = wy;
                    //将cocos2dx坐标转换为系标准屏幕坐标系
                    this.engine.sendCMDToRoom("move", { x: this.inputDirectionLocal.x, y: -this.inputDirectionLocal.y});
                }
                break;
            case cc.macro.KEY.s:
                this.downPressed = false;
                let sy = this.upPressed ? 1 : 0;
                if (this.inputDirectionLocal.y != sy) {
                    this.inputDirectionLocal.y = sy;
                    //将cocos2dx坐标转换为系标准屏幕坐标系
                    this.engine.sendCMDToRoom("move", { x: this.inputDirectionLocal.x, y: -this.inputDirectionLocal.y});
                }
                break;
            case cc.macro.KEY.a:
                this.leftPressed = false;
                this.inputDirectionLocal.x = this.rightPressed?1: 0;
                    //将cocos2dx坐标转换为系标准屏幕坐标系
                    this.engine.sendCMDToRoom("move", { x: this.inputDirectionLocal.x, y: -this.inputDirectionLocal.y});
                break;
            case cc.macro.KEY.d:
                this.rightPressed = false;
                this.inputDirectionLocal.x = this.leftPressed?-1: 0;
                    //将cocos2dx坐标转换为系标准屏幕坐标系
                    this.engine.sendCMDToRoom("move", { x: this.inputDirectionLocal.x, y: -this.inputDirectionLocal.y});
                break;
            default:
                break;
        }
    }

    toServerData(){
        return {
            mlb:this.mouseLeftButtonDown,
            mrb:this.mouseRightButtonDown,
            dir:this.inputDirectionLocal,
            mpos:this.mousePosition
        };
    }

    calcMousePositionInCanvas(){
        this.camera.getCameraToWorldPoint(this.eventPosition, this.mousePositionInCanvas);
        this.mousePositionInCanvas = this.node.convertToNodeSpaceAR(this.mousePositionInCanvas);
        this.mousePoint.setPosition(this.mousePositionInCanvas)
    }

}
