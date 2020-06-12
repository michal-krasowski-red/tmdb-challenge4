import {Img, Lightning} from "wpe-lightning-sdk";
import {getImgUrl, defaultEasing} from "./lib/tools";

export default class Background extends Lightning.Component{

    static _template() {
        return {
            Background: {
                colorTop: 0xff717171, colorBottom: 0xff000000, scale: 1.2, alpha: 0,
                transitions: {
                    alpha: defaultEasing,
                    scale: defaultEasing
                }
            }
        };
    }

    _init() {
        let bg;

        this.application.on("updateItem", ({item})=> {
            if(item.background === bg){
                return;
            }

            bg = item.background;

            this.tag("Background").patch({
                alpha:0, scale:1.2
            });
            this.tag("Background").patch({
                texture: Img(getImgUrl(bg, 1280)).contain(1920, 1080),
                smooth: {scale: 1, alpha: 1}
            });

        });
    }
}
