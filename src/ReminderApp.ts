import readlineSync from "readline-sync";
import Logger from "./util/ReminderLogger";
import RemindersHandler from "./RemindersHandler";
import { EOL } from "node:os";
import fs from "node:fs/promises";
import Reminder from "./Reminder";
import { parse } from "node:path";



// ✅✅✅
export default class ReminderApp {
    private _remindersHandler: RemindersHandler;

    /**
     * Creates a new instance of the reminder application.
     */
    constructor() {
        this._remindersHandler = new RemindersHandler();
    }

    /**
     * Starts application and continually prompts user to choose
     * from one of six menu items.
     */
    // 🦈
    public async start(): Promise<void> {
        let exitFlag: boolean = false;
        for (;;) {
            const item: string = ReminderApp.handleMenuSelection();
            switch (item) {
                case "1":
                    this.handleShowReminders();
                    break;

                case "2":
                    this.handleSearchReminders();
                    break;

                case "3":
                    this.handleAddReminder();
                    break;

                case "4":
                    this.handleModifyReminders();
                    break;

                case "5":
                    this.handleToggleCompletion();
                    break;
                case "6":
                    await this.handleExport();
                    break;
                    // ❌
                case "7":
                    await this.handleImport();
                    break;
                case "8":
                    exitFlag = true
                    console.log("Invalid Option");
                default:
                    break;
            }
            
            if (exitFlag) break;
        }
        Logger.log(`${EOL}  ❌  Exited application${EOL}`);
    }

    /**
     * Interfaces with user to toggle completion status of a specific reminder.
     */


    // ❌
    private async handleImport(): Promise<void> {
        const path: string = 'src/reminders.JSON';
        try {
            const remindersData = await this.importReminders(path);
            const parsedData = this._remindersHandler.jsonParseReminders(remindersData);
            console.log(parsedData)
            Logger.log(typeof parsedData);
            Logger.log('Import Completed🔥');
        } catch(err) {
            console.error(err, 'Import failed');
        }
    }

    // Writes the list of reminders to a json file.
    private async handleExport(): Promise<void> {
        const remindersList: Reminder[] = this._remindersHandler.reminders;
        const exportContent: string = this._remindersHandler.prepareExportJSON(remindersList);
        try {
            if (remindersList.length === 0) throw new Error;
            await this.exportReminders(exportContent);
            Logger.log('Successfully exported reminders to JSON file 🔥');
        } catch (err) {
            console.error('Export failed, no reminders');
        }
    }


    private async importReminders(location: string): Promise<string> {
        const dataFormat = await fs.readFile(location, 'utf8');
        return dataFormat;
    }


    // Exports reminders to a JSON file
    private async exportReminders(content: string): Promise<void> {
        await fs.writeFile('src/reminders.JSON', content, 'utf8');
    }

    // ✅
    private handleToggleCompletion(): void {


        if (this._remindersHandler.reminders.length === 0) {
            Logger.log(`${EOL}  ⚠️  You have no reminders`)
            return;
        };

        Logger.logReminders(this._remindersHandler.reminders);
        const selectedReminder: number = Number(this.getUserChoice('Reminder #', true));
        this._remindersHandler.toggleCompletion(selectedReminder - 1); // subtract 1 to align with list of reminders indexes.
        Logger.log(`${EOL}  🏁   Reminder Completion Toggled`);
    }

    /**
     * Communicates with user to modify a specific reminder.
     */
    // ✅
    private handleModifyReminders(): void {

        Logger.logReminders(this._remindersHandler.reminders);
        const chosenReminder: number = Number(this.getUserChoice('Reminder # to edit', true));
        const chosenDescription: string = this.getUserChoice('New Description', false);

        this._remindersHandler.modifyReminder(chosenReminder - 1, chosenDescription);

        let completionStatus!: string;


        for (;;) {
            completionStatus = readlineSync.question(`${EOL}Would you like to toggle completion? [y/n]: `).toLowerCase();
            switch(completionStatus) {
                case 'y':
                    this._remindersHandler.toggleCompletion(chosenReminder - 1);
                    break;
                case 'n':
                    break;
                default:
                    Logger.log(`${EOL}Invalid input, retry`);
                    break;

            }
            if (completionStatus === 'y' || completionStatus ===  'n') {
                Logger.log(`${EOL}  🏁   Reminder Modified`);
                break;    
            }
        }

            

        
    }

    /**
     * Works with user to add a reminder.
     */
    // ✅
    private handleAddReminder(): void {
        const chosenReminder = this.getUserChoice("Reminder", false);
        const chosenTag = this.getUserChoice("Tag", false);
        this._remindersHandler.addReminder(chosenReminder, chosenTag);
        Logger.log(`${EOL} 🏁 Reminder Added`);
    }

    /**
     * Finds and logs all reminders with a tag that matches the keyword exactly.
     * If none exists, then all reminders with descriptions that match the search
     * keyword (even partially) are logged instead.
     */
    // ✅
    private handleSearchReminders(): void {
       if (this._remindersHandler.reminders.length === 0) {
            Logger.log(`${EOL}  ⚠️  You have no reminders`)
            return;
       }

       const chosenSearch = this.getUserChoice('Search Key Word', false);
       const searchList = this._remindersHandler.search(chosenSearch);
       Logger.logSearchResults(searchList);
    }

    /**
     * Logs any existing reminders to console, grouped by tags.
     */
    //
    // ✅
    private handleShowReminders(): void {
        if (this._remindersHandler.reminders.length === 0) Logger.log(`${EOL}  ⚠️  You have no reminders`);
        Logger.logGroupedReminders(this._remindersHandler.groupByTag());
    }

    /**
     * Returns verified user input based on Main Menu item selected.
     * @param question - Text that describes what to ask the user
     * @param isIndexRequired - True if user chooses to either modify or toggle reminder, otherwise false
     */
    // 🦈
    private getUserChoice(question: string, isIndexRequired: boolean): string {
        let userChoice: string;
        for (;;) {
            userChoice = readlineSync.question(`${EOL}Enter a ${question} here: `, {
                limit: (input: string) => {
                    return this.validateInput(input, isIndexRequired);
                },
                limitMessage: "",
            });
            const userDecision: string = this.checkUserChoice(question, userChoice);
            if (userDecision === "n") Logger.log(`${EOL}  🔄  Please try typing it again`);
            else break;
        }
        return userChoice;
    }

    /**
     * Verifies user input and returns 'y' if input is accepted by user, otherwise 'n'.
     * @param question - Portion of question to prompt with, based on Main Menu item selected
     * @param userChoice - Text that user enters
     */
    // 🦈
    private checkUserChoice(question: string, userChoice: string): string {
        return readlineSync
            .question(`You entered ${question}: '${userChoice}', is it correct? y/n: `, {
                limit: /^[YNyn]{1}$/,
                limitMessage: `${EOL}  🚨  Invalid input: Please enter either y/n.${EOL}`,
            })
            .toLowerCase();
    }

    /**
     * Returns true if the user wishes to toggle the complete status of a reminder, otherwise false.
     */
    // 🦈
    private static checkUserToggleChoice(): boolean {
        const toggleAnswer: string = readlineSync.question(`${EOL}Do you wish to toggle the completed status? y/n: `, {
            limit: /^[YNyn]{1}$/,
            limitMessage: `${EOL}  🚨  Invalid input: Please enter either y/n.${EOL}`,
        });

        if (toggleAnswer.toLowerCase() === "y") return true;
        return false;
    }

    /**
     * Validates if user's input is valid for the selected menu item.
     * @param input - The text the user enters
     * @param isIndexRequired - True if user chooses to either modify or toggle reminder, otherwise false
     */
    // 🦈
    private validateInput(input: string, isIndexRequired: boolean): boolean {
        if (!input) {
            Logger.log(`${EOL}  🚨  Input cannot be blank: Please try again.${EOL}`);
            return false;
        }
        if (isIndexRequired) {
            if (ReminderApp.matches(/^\d+$/, input)) {
                const index: number = Number(input) - 1;
                if (this._remindersHandler.isIndexValid(index)) return true;
                Logger.log(`${EOL}  🚨  Input must be number from the list of reminders: Please try again.${EOL}`);
                return false;
            }
            Logger.log(`${EOL}  🚨  Input must be positive number from the list of reminders: Please try again.${EOL}`);
            return false;
        }
        return true;
    }

    /**
     * Returns true if text matches the RegExp pattern, otherwise false.
     * @param regex - Pattern used to match text
     * @param str - Text to match
     */
    // 🦈
    private static matches(regex: RegExp, str: string): boolean {
        return regex.test(str);
    }

    /**
     * Returns the menu item number that the user selects.
     * Keeps prompting user until item is valid (between 1 and 6 inclusive).
     */
    // 🦈
    private static getMenuItem(): string {
        const item: string = readlineSync.question("Choose a [Number] followed by [Enter]: ", {
            limit: ["1", "2", "3", "4", "5", "6", "7", "8"],
            limitMessage: `${EOL}  🚨  Sorry, input is not a valid menu item.${EOL}`,
        });
        return item;
    }

    /**
     * Prompts user to return to Main Menu.
     */
    // 🦈
    private static handleMenuSelection(): string {
        readlineSync.question(`${EOL}Hit [Enter] key to see main menu: `, {
            hideEchoBack: true,
            mask: "",
        });
        Logger.logMenu();
        return ReminderApp.getMenuItem();
    }
}
