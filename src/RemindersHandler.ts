import { get } from "node:http";
import Reminder from "./Reminder";








  
/**
 * A grouping of reminders based on tag (case-insensitive)
 */
// ✅✅✅
export interface RemindersGroupingByTag {
    [tag: string]: Reminder[];
}

// ✅✅✅
export default class RemindersHandler {
    private _reminders: Reminder[];

    /**
     * Creates a new RemindersHandler instance with no reminders.
     */
    constructor() {
        this._reminders = [];
    }

    /**
     * Returns the list of reminders added so far.
     */
    // ✅
    public get reminders(): Reminder[] {
        return this._reminders;
    }

    public set importedReminders(reminders: Reminder[]) {
        this._reminders = reminders;
    }

    /**
     * Creates a new reminder and adds it to list of reminders.
     * @param description - The full description of reminder
     * @param tag - The keyword used to help categorize reminder
     */

    // ✅
    public addReminder(description: string, tag: string): void {
        const addedReminder = new Reminder(description, tag);
        this._reminders.push(addedReminder);
    }

    /**
     * Returns the reminder at specified index.
     * @throws ReminderError if specified index is not valid
     * @param index - The index of the reminder
     */
    // ✅
    public getReminder(index: number): Reminder {
        return this.reminders[index];
    }

    /**
     * Returns true if specified index is valid, false otherwise.
     * @param index - The position of the reminder in list of reminders
     */
    // 🦈
    public isIndexValid(index: number): boolean {
        if (this.size() === 0) return false;
        if (index < 0 || index + 1 > this.size()) return false;
        return true;
    }

    /**
     * Returns the number of reminders added so far.
     */
    // 🦈
    public size(): number {
        return this._reminders.length;
    }

    /**
     * Modifies the description of the reminder at a specified index.
     * Silently ignores call if index is not valid.
     * @param index - The index of the reminder
     * @param description - The full description of reminder
     * @param tag - The keyword used to help categorize reminder
     */
    // ✅
    public modifyReminder(index: number, description: string): void {
        const targetReminder: Reminder = this.getReminder(index);
        targetReminder.description = description;
    }

    /**
     * Toggle the completion status of the reminder at specified index.
     * Silently ignores call if index is not valid.
     * @param index - The index of the reminder
     */

    // ✅
    public toggleCompletion(index: number): void {

        if (!this.isIndexValid(index)) return;
        
        const selectedReminder = this.getReminder(index); 
        selectedReminder.toggleTheCompletion();
    }

    /**
     * Returns a list of reminders that match the keyword
     * All reminders with tags that match the search keyword
     * exactly will be returned first.
     *
     * If none exist, then all reminders with descriptions that match
     * the search keyword (even partially) are returned.
     * @param keyword - Text to search for in description and tag
     */
    // ✅
    public search(keyword: string): Reminder[] {
        const searchByTag = this.searchTags(keyword);
        if (searchByTag.length !== 0) {
            return searchByTag
        }

        const searchByDescription = this.searchDescriptions(keyword);
        return searchByDescription;
    }

    /**
     * Returns a grouping of the reminders based on tag (case-insensitive).
     */
    // ✅
    public groupByTag(): RemindersGroupingByTag {
        const groupings: RemindersGroupingByTag = {};
        this.reminders.forEach((remind) => {
            const { tag } = remind;
            if (!groupings[tag]) {
                groupings[tag] = [];
            }

            groupings[tag].push(remind);
        });
        return groupings;
    }

    /**
     * Returns a list of reminders with tags that match the keyword exactly.
     * @param keyword - Text to search for in description and tag
     */
    // ✅
    private searchTags(keyword: string): Reminder[] {
        return this.reminders.filter((task) => task.tag === keyword);
    }

    /**
     * Returns a list of reminders with descriptions that match the keyword.
     * @param keyword - Text to search for in description and tag
     */
    // ✅
    private searchDescriptions(keyword: string): Reminder[] {
        return this.reminders.filter((task) => task.description.includes(keyword))
    }




    public jsonParseReminders(data: string): object[] {
        return JSON.parse(data);
    }
  
    public prepareExportJSON(reminders: Reminder[]): string {
        return JSON.stringify(reminders, null, 2);
    }
}