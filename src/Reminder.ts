/**
 * @class Reminder
 * @description Represents a reminder for a given task
 */
// ✅✅✅
export default class Reminder {
    
    /**
     * Creates a new Reminder instance.
     * @param description - The full description of reminder
     * @param tag - The keyword used to help categorize reminder
     */

    // ✅
    private _description!: string;
    private _tag!: string;
    _isCompleted: boolean = false;

    // ✅
    constructor(description: string, tag: string) {
        this._description = description;
        this._tag = tag;
    }

    /**
     * Returns the description of this reminder.
     */
    // ✅
    public get description(): string {
        if (!this._description) throw new Error("Not yet implemented");
        return this._description;
    }

    /**
     * Sets the description of this reminder.
     * @param description - The full description of reminder.
     */
    // ✅
    public set description(description: string) {
        this._description = description;
    }

    /**
     * Returns the tag associated with this reminder.
     */
    // ✅
    public get tag(): string {
        return this._tag;
    }

    /**
     * Sets the tag associated with this reminder.
     * @param tag - The keyword used to help categorize this reminder
     */
    // ✅
    public set tag(tag: string) {
        this._tag = tag;
    }

    /**
     * Returns true if reminder is completed, false otherwise.
     */
    // ✅
    public get isCompleted(): boolean {
        return this._isCompleted;
    }

    /**
     * Toggles reminder completion status true ⬅ ➡ false.
     */
    // ✅
    public toggleTheCompletion(): void {
        this._isCompleted = !this._isCompleted;
    }
}
