const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const util = require("util");
const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");
const render = require("./lib/htmlRenderer");
const writeFileAsync = util.promisify(fs.writeFile);
const members = [];


async function notBlank(input) {
    if(!input) {
        return 'Cannot be Blank';
    }
    return true
};

async function numCheck(input) {
    if(isNaN(input)) {
        return 'Must be a number'
    }
    return true
};


async function intFunc() {
    const internQ = await inquirer.prompt([
        {
            message: "What is the interns' name?",
            type: 'input',
            name: 'name',
            validate: await notBlank
        },
        {
            message: 'What is their ID number?',
            type: 'input',
            name: 'id',
            validate: await numCheck
        },
        {
            message: 'What is their email address?',
            type: 'input',
            name: 'email'
        },
        {
            message: 'What school do they attend?',
            type: 'input',
            name: 'school',
            validate: await notBlank
        },
        {
            message: 'Would you like to enter another employee?',
            type: 'confirm',
            name: 'confirm',
            default: 'false'
        }
    ]);

    const intern = new Intern(internQ.name, internQ.id, internQ.email, internQ.school);
    members.push(intern);

    if(internQ.confirm == true) {
        empFunc();
        } else {
            const html = await render(members);
            await writeFileAsync(outputPath, html);
        };
};


async function engFunc() {
    const engineerQ = await inquirer.prompt([
        {
            message: "What is the engineers' name?",
            type: 'input',
            name: 'name',
            validate: await notBlank
        },
        {
            message: 'What is their ID number?',
            type: 'input',
            name: 'id',
            validate: await numCheck
        },
        {
            message: 'What is their email address?',
            type: 'input',
            name: 'email',
            validate: await notBlank
        },
        {
            message: 'What is their personal GitHub URL?',
            type: 'input',
            name: 'github',
            validate: await notBlank
        },
        {
            message: 'Would you like to enter another employee?',
            type: 'confirm',
            name: 'confirm',
            default: 'false'
        }
    ]);

    const engineer = new Engineer(engineerQ.name, engineerQ.id, engineerQ.email, engineerQ.github);
    members.push(engineer);

    if(engineerQ.confirm == true) {
        empFunc();
    } else {
        const html = await render(members);
        await writeFileAsync(outputPath, html);
    };
};

async function manFunc() {
    try {
        const manager = await inquirer.prompt([
            {
                message: "What is the managers' name?",
                type: 'input',
                name: 'name',
                validate: await notBlank
            },
            {
                message: "What is their ID number?",
                type: 'input',
                name: 'id',
                validate: await numCheck
            },
            {
                message: "What is their email address?",
                type: 'input',
                name: 'email',
                validate: await notBlank
            },
            {
                message: 'What is their office phone number?',
                type: 'input',
                name: 'officenumber',
                validate: await numCheck
            }
        ]);

        const manager1 = new Manager(manager.name, manager.id, manager.email, manager.officenumber);
        members.push(manager1);

        empFunc();

    } catch(error) {
        console.log(error);
    };
};


async function empFunc() {
    try {
        const choice = await inquirer.prompt([
            {
                type: 'list',
                choices: [
                    'Intern',
                    'Engineer'
                ],
                name: 'type'
            },
        ]);

        if(choice.type == 'Intern') {
            await intFunc();
        } else {
            await engFunc();
        }; 
    } catch(error) {
        console.log(error);
    };
};


manFunc();
