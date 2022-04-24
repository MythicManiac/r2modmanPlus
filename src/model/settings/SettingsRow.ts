export default class SettingsRow {

    private readonly _group: string;
    private readonly _action: string;
    private readonly _description: string;
    private readonly _value: () => any;
    private readonly _icon: string;
    private readonly _clickAction: () => void;

    public constructor(group: string, action: string, description: string, value: () => Promise<any>, icon: string, clickAction: () => void) {
        this._group = group;
        this._action = action;
        this._description = description;
        this._value = value;
        this._icon = icon;
        this._clickAction = clickAction;
    }

    get group(): string {
        return this._group;
    }

    get action(): string {
        return this._action;
    }

    get description(): string {
        return this._description;
    }

    get value(): any {
        return this._value;
    }

    get icon(): string {
        return this._icon;
    }

    get clickAction(): () => void {
        return this._clickAction;
    }
}
