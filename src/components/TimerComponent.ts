import Component from "engine/Component";
import Camera from "engine/Camera";
import Text from 'engine/entities/Text';

const TIMER_POSITION_X = 854 / 8 - 4;
const TIMER_POSITION_Y = 480 / 8 - 4;

class TimerComponent extends Component {
    private _camera             : Camera;
    private _text               : Text;
    private _time               : number;

    public static readonly ComponentName           : string = "TimerComponent";

    constructor() {
        super(TimerComponent.ComponentName);
    }

    private followCamera(): void {
        this._entity.position.x = this._camera.position.x + TIMER_POSITION_X;
        this._entity.position.y = this._camera.position.y + TIMER_POSITION_Y;
    }

    private countTime(): void {
        this._time = Math.max(this._time - 1 / 60, 0);

        let minutes: string = ((this._time / 60) << 0) + "",
            seconds: string = ((this._time % 60) << 0) + "";

        if (parseInt(minutes) < 10) { minutes = "0" + minutes; }
        if (parseInt(seconds) < 10) { seconds = "0" + seconds; }

        this._text.text = "TIME: " + minutes + ":" + seconds;
    }

    public start(): void {
        this._camera = this._entity.scene.camera;
        this._text = <Text> this._entity;
        this._time = 10;
    }

    public update(): void {
        this.countTime();
    }

    public postUpdate(): void {
        this.followCamera();
    }

    public destroy(): void {

    }
}

export default TimerComponent;