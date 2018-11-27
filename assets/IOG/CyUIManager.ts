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
export default class CyUIManager extends cc.Component {

    @property({
        type: cc.Prefab
    })
    toastItemPrefab: cc.Prefab = null;

    @property({
        type:cc.Node
    })
    toastContainer:cc.Node = null;

    @property({
        type: cc.Node
    })
    startPanel: cc.Node = null;

    @property({
        type: cc.Node
    })
    leaderboardContainer: cc.Node = null;

    engine:CyStateEngine = null;

    //TODO:改成null
    playername:string = "ads";

    static instance: CyUIManager;

    onLoad() {
        if (CyUIManager.instance == undefined) {
            CyUIManager.instance = this;
        } else {
            console.log("CyUIManager 单例失败");
            return;
        }
        this.engine = CyStateEngine.instance;
        this.schedule(this.updateLeaderBoard,0.5,cc.macro.REPEAT_FOREVER,0);
    }

    /**
     *当点击用户昵称输入提交
     *
     * @memberof CyUIManager
     */
    onNameEditSubmit(){
        if(this.playername == "" || this.playername == null){
            this.showToast("请输入昵称");
        }else{
            if(this.engine.room){
                this.engine.sendCMDToRoom("addplayer",{name:this.playername});
            }else{
                this.showToast("请等待服务器连接成功");
            }
        }
    }

    /**
     *当用户昵称修改
     *
     * @param {*} name
     * @memberof CyUIManager
     */
    onNameChanged(name){
        this.playername = name;
    }

    /**
     *显示提示
     *
     * @param {string} text
     * @memberof CyUIManager
     */
    showToast(text:string){
        if(text){

            for(let i=0;i<this.toastContainer.childrenCount;i++){
                let child = this.toastContainer.children[i];
                child.runAction(cc.sequence([
                    cc.spawn([
                        cc.fadeOut(0.2),
                        cc.moveTo(0.2, 0, 30),
                    ]),
                    cc.callFunc(() => {
                        this.toastContainer.removeChild(child);
                    }, this)
                ]));
            }

            let toastItem = cc.instantiate(this.toastItemPrefab);
            toastItem.getComponentInChildren(cc.Label).string = text.toString();
            toastItem.opacity = 0;
            this.toastContainer.addChild(toastItem);
            toastItem.runAction(cc.sequence([
                cc.place(0, -30),
                cc.spawn([
                    cc.fadeIn(0.3),
                    cc.moveTo(0.3, 0, 0),
                ]),
                cc.delayTime(1),
                cc.spawn([
                    cc.fadeOut(0.2),
                    cc.moveTo(0.2, 0, 30),
                ]),
                cc.callFunc(() => {
                    this.toastContainer.removeChild(toastItem);
                }, this)

            ]));
        }
    }

    /**
     *游戏开始，隐藏StartPanel
     *
     * @memberof CyUIManager
     */
    gameStart(){
        this.startPanel.active = false;
    }

    /**
     *更新积分榜
     *
     * @memberof CyUIManager
     */
    updateLeaderBoard(){
        // this.leaderboardContainer.removeAllChildren();
        let label = this.leaderboardContainer.getComponentInChildren(cc.Label);
        label.string = "";
        this.engine.players.forEach((p,key)=>{
            // let leaderboardItem = new cc.Node();
            // let label: cc.Label = leaderboardItem.addComponent(cc.Label);
            label.string += p.nickname + ":" + p.score.toString()+"\n";
            // label.fontSize = 16;
            // label.lineHeight = 16;
            // leaderboardItem.color = cc.Color.BLACK;
            // this.leaderboardContainer.addChild(leaderboardItem);
        });
    }

    // start () {

    // }

    // update (dt) {}
}
