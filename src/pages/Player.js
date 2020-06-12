import {Lightning, Utils, MediaPlayer} from "wpe-lightning-sdk";
import {defaultEasing} from "../lib/tools";

export default class Player extends Lightning.Component {
    static _template() {
        const inactiveImageTint = 0x20ffffff;
        const activeImageTint = 0xafffffff;
        return {
            MediaPlayer: {
                type: MediaPlayer,
            },
            Overlay: {
                w: 1920,
                h: 250,
                y: 830,
                rect: true,
                colorTop: 0x00000000,
                colorBottom: 0xff000000,
                transitions: {alpha: defaultEasing},
            },
            Controls: {
                transitions: {alpha: defaultEasing},
                y: 980,
                PlayPause: {
                    x: 50,
                    color: activeImageTint,
                    src: Utils.asset("mediaplayer/pause.png"),
                },
                Skip: {
                    x: 100,
                    color: inactiveImageTint,
                    src: Utils.asset("mediaplayer/skip.png"),
                },
                ProgressBar: {
                    w: 1720,
                    h: 20,
                    x: 150,
                    rect: true,
                    color: inactiveImageTint,
                    Watched: {
                        w: 500,
                        h: h => h,
                        rect: true,
                        color: activeImageTint,
                    },
                    DurationLabel: {
                        y: -50,
                        text: {
                            textColor: activeImageTint,
                            text: "",
                            fontFace: "SourceSansPro-Regular"
                        },
                    },
                },
            },
        };
    }

    _init() {
        this.tag("MediaPlayer").updateSettings({consumer: this});
        this.play("http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", true);
    }

    _focus() {
        this.tag("Controls").setSmooth("alpha", 1);
        this.tag("Overlay").setSmooth("alpha", 1);
    }

    _unfocus() {
        this.tag("Controls").setSmooth("alpha", 0);
        this.tag("Overlay").setSmooth("alpha", 1);
    }

    play(src, loop) {
        this.tag("MediaPlayer").open(src);
        this.tag("MediaPlayer").loop = loop;
    }

    stop() {
    }

    set item(v) {
        this._item = v;
    }

    _handleEnter() {
        this.tag("MediaPlayer").doPause();
    }

    /**
     * This will be automatically called when the mediaplayer pause event is triggerd
     */
    $mediaplayerPause() {
        this._setState("Paused");
    }

    $mediaplayerPlay() {
        this._setState("");
    }

    $mediaplayerProgress({currentTime, duration}) {
        const format = (timeSeconds) => {
            let date = new Date(0);
            date.setSeconds(timeSeconds);
            return date.toISOString().substr(11, 8);
        };

        let progress = currentTime / duration;

        this.patch({
            Controls: {
                ProgressBar: {
                    Watched: {
                        w: (w) => w * progress,
                    },
                    DurationLabel: {
                        text: {
                            text: `${format(currentTime)} / ${format(duration)}`,
                        },
                    },
                },
            },
        });
    }

    static _states() {
        return [
            class Paused extends this {
                $enter() {
                    this.tag("PlayPause").src = Utils.asset("mediaplayer/play.png");
                }

                $exit() {
                    this.tag("PlayPause").src = Utils.asset("mediaplayer/pause.png");
                }

                _handleEnter() {
                    this.tag("MediaPlayer").doPlay();
                }
            },
        ];
    }
}
