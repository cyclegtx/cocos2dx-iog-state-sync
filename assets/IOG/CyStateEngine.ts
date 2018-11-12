import { DataChange } from "./colyseus/colyseus";
import CyEntity from "./CyEntity";

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
export default class CyStateEngine extends cc.Component {

    @property({
        displayName:"服务器IP"
    })
    ip = "localhost";

    @property({
        displayName: "服务器端口"
    })
    port = "2567";

    @property({
        displayName:"房间名称"
    })
    roomName = "room";

    /**
     *Entity列表
     *
     * @type {CyEntity[]}
     * @memberof CyStateEngine
     */
    entities: Map<string, CyEntity> = new Map();

    /**
     *服务器帧插值
     *
     * @type {number}
     * @memberof CyEngine
     */
    serverFrameAcc: number = 3;

    /**
     *服务器帧数
     *
     * @type {number}
     * @memberof CyEngine
     */
    serverFrameRate: number = 20;

    /**
     *玩家列表,存储玩家输入
     *
     * @type {Array<CyPlayer>}
     * @memberof CyEngine
     */
    public players: Array<CyPlayer> = null;

    client:Colyseus.Client = null;
    room:Colyseus.Room = null;
    roomJoined:boolean = false;

    @property({
        displayName: "游戏Prefab",
        type: cc.Prefab
    })
    roundPrefab: cc.Prefab = null;

    @property({
        displayName: "游戏位置",
        type: cc.Node
    })
    roundContainer: cc.Node = null;



    /**
     *随机种子
     *
     * @type {number}
     * @memberof CyEngine
     */
    seed: number = 51;


    static instance: CyStateEngine;

    onLoad () {
        if (CyStateEngine.instance == undefined) {
            CyStateEngine.instance = this;
        } else {
            console.log("CyEngine 单例失败");
            return;
        }
        this.client = new Colyseus.Client(`ws://${this.ip}:${this.port}`);
        this.getAvailableRooms();
    }

    // start () {
    // }

    // update (dt) {}

    /**
     *获取可以加入的房间
     *
     * @memberof CyEngine
     */
    getAvailableRooms(){
        let that = this;
        this.client.getAvailableRooms(this.roomName, function (rooms, err) {
            if (err) console.error(err);
            // console.log(rooms)
            // rooms.forEach(function (room) {
            //     console.log(room.roomId);
            //     console.log(room.clients);
            //     console.log(room.maxClients);
            //     console.log(room.metadata);
            // });
            // that.node.emit("getAvailableRooms",{rooms:rooms});
            if(rooms.length > 0){
                this.joinRoom();
            }else{
                this.createRoom();
            }
        }.bind(this));
    }

    /**
     *创建房间
     *
     * @memberof CyEngine
     */
    createRoom(){
        this.joinRoom();
    }

    /**
     *加入房间
     *
     * @memberof CyEngine
     */
    joinRoom(){
        this.room = this.client.join(this.roomName);
        this.room.onJoin.add(this.onJoinRoom.bind(this));

        this.room.listen("entities/:id", this.onEntityChange.bind(this));
        this.room.listen("entities/:id/:attribute", this.onEntityAttributeChange.bind(this));

        this.room.onMessage.add(this.onMessage.bind(this));
    }

    /**
     *处理服务器Entity变化
     *
     * @param {DataChange} change
     * @memberof CyStateEngine
     */
    async onEntityChange(change: DataChange){
        // console.log(change)

        if (change.operation === "add") {

            if(change.value.y){
                //将标准屏幕坐标系转换为cocos2dx坐标系
                change.value.y = -change.value.y;
            }

            //根据type在resources/prefabs下找同名的prefab
            let entityPrefab = await this.loadPrefab("Entities/" + change.value.type).catch(console.warn);
            //如果找不到则用默认的prefab Entity
            if (entityPrefab == undefined) {
                entityPrefab = await this.loadPrefab("Entities/Entity").catch(console.warn);
            }
            let entityNode: cc.Node = cc.instantiate(entityPrefab) as cc.Node;
            let entity: CyEntity = entityNode.getComponent(CyEntity);
            this.entities.set(change.path.id, entity);

            this.roundContainer.addChild(entityNode);

            entity.init(change.value);


        } else if (change.operation === "remove") {
            let entity: CyEntity = this.entities.get(change.path.id);
            entity.onRemove();
            this.roundContainer.removeChild(entity.node);
            this.entities.delete(change.path.id);
        }
    }

    /**
     *处理服务器Entity属性变化
     *
     * @param {DataChange} change
     * @memberof CyStateEngine
     */
    async onEntityAttributeChange(change: DataChange){

        let entity: CyEntity = this.entities.get(change.path.id);
        if (entity) {
            if (change.operation == "replace") {
                if (change.path.attribute == "y") {
                    //将标准屏幕坐标系转换为cocos2dx坐标系
                    change.value = -change.value;
                }
                entity.replace(change.path.attribute, change.value);
            }
        }

    }

    /**
     *当加入房间时
     *
     * @memberof CyEngine
     */
    onJoinRoom(){
        this.roomJoined = true;
        this.node.emit("roomJoined", { room_id: this.room.id, room_session: this.room.sessionId });
    }

    /**
     *断开链接
     *
     * @memberof CyEngine
     */
    close(){
        this.client.close(this.client.id);
    }

    /**
     *发送命令到服务器
     *
     * @param {string} CMD
     * @param {*} value
     * @memberof CyStateEngine
     */
    sendCMDToRoom(CMD:string,value:any){
        if(this.roomJoined){
            this.room.send({ CMD: CMD, value: value });
        }
    }

    /**
     *发送信息到服务器房间
     *
     * @param {*} data
     * @memberof CyEngine
     */
    sendToRoom(data:any){
        this.room.send(data);
    }

    /**
     *处理服务器消息  
     *
     * @param {*} message 消息
     * @memberof CyEngine
     */
    onMessage(message){
        switch(message[0]){
            default:
                console.warn("未处理的消息:");
                console.warn(message);
                break;
        }
    }



    /**
     *随机函数
     *
     * @param {number} [max=1]
     * @param {number} [min=0]
     * @returns
     * @memberof CyEngine
     */
    seededRandom(max = 1, min = 0) {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        let rnd = this.seed / 233280.0;
        return min + rnd * (max - min);
    }

    async loadPrefab(path:string){

        return new Promise((resolve, reject) => {
            cc.loader.loadRes(path, function (err, prefab) {
                if(err){
                    reject(err)
                }else{
                    resolve(prefab)
                }
            });
        });
        
    }

}
