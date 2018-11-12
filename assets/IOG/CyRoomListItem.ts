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
export default class CyRoomListItem extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    public roomID: string = "";

    joinRoom() {
        if (this.roomID == "createRoom") {
            CyStateEngine.instance.createRoom();
        } else {
            CyStateEngine.instance.joinRoom();
        }
    }
}
