import { table, TableUserConfig } from "table";
import { EOL } from "node:os";
import Reminder from "../Reminder";
import RemindersHandler, { RemindersGroupingByTag } from "../RemindersHandler";

// line 7 - 25 is to where you hit enter to display menu
const data = [
    ["1", "Show all reminders 👀"],
    ["2", "Search reminders 🔎"],
    ["3", "Add reminder ➕"],
    ["4", "Modify reminders 📝"],
    ["5", "Toggle completion ✅"],
    ["6", "Exit 👋"],
];

const config: TableUserConfig = {
    header: {
        alignment: "center",
        content: "Reminders Menu",
    },
};

// ✅✅✅`
export default class ReminderLogger {
    static readonly MENU = table(data, config);

    /**
     * Prints a reminders menu to the console.
     * Leading spaces on each line is first removed
     */
    // 🦈
    public static logMenu(): void {
        console.log(this.MENU);
    }

    /**
     * Prints reminder tag uppercased to console proceeded by 🏷️
     *
     * @param reminder - reminder instance for task
    */
   // 🦈
    public static logTag(reminder: Reminder): void {
    console.log(`🏷️  ${reminder.tag.toUpperCase()}`);
}

/**
 * Prints tag to console proceeded by 🏷️
*
* @param tag - category of reminder
*/ 
    // 🦈
    public static logTagString(tag: string): void {
        console.log(`${EOL}🏷️  ${tag.toUpperCase()}`);
    }

    /**
     * Prints reminder description to console
     * preceded  by 🟢 if reminder status is complete;
     * otherwise, proceeded by ⭕️.
     */
    // 🦈
    public static logDescription(reminder: Reminder): void {
        if (reminder.isCompleted) {
            console.log(`  🟢 ${reminder.description}`);
        } else {
            console.log(`  ⭕️ ${reminder.description}`);
        }
    }

    /**
     * Prints reminder descriptions to console, grouped by tag
     *
     * @param remindersGroupings - grouping of reminders by tag
     */

    // 🦈 
    public static logGroupedReminders(remindersGroupings: RemindersGroupingByTag): void {
        Object.keys(remindersGroupings).forEach((tag) => {
            this.logTagString(`${tag}${EOL}`);
            remindersGroupings[tag].forEach((reminder: Reminder) => {
                this.logDescription(reminder);
            });
        });
    }

    /**
     * Prints descriptions to console for each reminder
     *
     * @param reminders - list of reminders added
     */
    // 🦈
    public static logReminders(reminders: Reminder[]): void {
        console.log(EOL);
        reminders.forEach((reminder, index) => {
            console.log(` [${index + 1}] ${reminder.description}`);
        });
    }

    /**
     * Prints descriptions to console for each reminder
     *
     * @param reminders - list of reminders added
     */
    // 🦈
    public static logSearchResults(reminders: Reminder[]): void {
        if (reminders.length === 0) this.log(`No results found for search.${EOL}`);
        else {
            console.log("");
            reminders.forEach((reminder) => {
                this.logDescription(reminder);
            });
        }
    }

    /**
     * Prints given message to console
     *
     * @param msg - message to log
     */
    // 🦈
    public static log(msg: string): void {
        console.log(msg);
    }
}
