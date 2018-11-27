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
export default class CyPlayer extends CyEntity {

    nickname:string = "";
    score:number = 0;

    init(v) {
        super.init(v);
        this.nickname = v.name;
        this.score = v.score;
    }

    replace(attribute: string, value: any){
        super.replace(attribute,value);
        switch (attribute) {
            case "score":
                this.score = value;
                break;
            case "name":
                this.nickname = value;
                break;
        }
    }

}
