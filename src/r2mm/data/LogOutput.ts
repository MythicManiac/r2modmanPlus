import Profile from '../../model/Profile';
import * as path from 'path'
import FsProvider from '../../providers/generic/file/FsProvider';
import Timeout = NodeJS.Timeout;
import GameManager from '../../model/game/GameManager';
import { PackageLoader } from '../../model/installing/PackageLoader';
let fs: FsProvider;

export default class LogOutput {

    private _exists: boolean = false;

    private static INTERVAL: Timeout | undefined;
    private static LOG_OUTPUT: LogOutput | undefined;

    public static getSingleton(): LogOutput {
        if (this.LOG_OUTPUT === undefined) {
            this.LOG_OUTPUT = new LogOutput();
        }
        return this.LOG_OUTPUT;
    }

    private constructor() {
        fs = FsProvider.instance;

        this.confirmOutputExists();

        LogOutput.INTERVAL = setInterval(() => {
            this.confirmOutputExists();
        }, 1000);
    }

    private confirmOutputExists() {
        const game = GameManager.activeGame;
        switch (game.packageLoader) {
            case PackageLoader.BEPINEX:
                fs.exists(path.join(Profile.getActiveProfile().getPathOfProfile(), 'BepInEx', 'LogOutput.log'))
                    .then(value => this._exists = value);
                break;
            case PackageLoader.MELON_LOADER:
                fs.exists(path.join(Profile.getActiveProfile().getPathOfProfile(), 'MelonLoader', 'Latest.log'))
                    .then(value => this._exists = value);
                break;
        }
    }

    get exists(): boolean {
        return this._exists;
    }


    set exists(value: boolean) {
        this._exists = value;
    }


    public disconnect() {
        if (LogOutput.INTERVAL !== undefined) {
            clearInterval(LogOutput.INTERVAL);
        }
    }
}
