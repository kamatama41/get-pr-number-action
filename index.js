const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

if (!("GITHUB_TOKEN" in process.env)) {
    core.setFailed('GITHUB_TOKEN must be set.');
    return
}

try {
    const contents = fs.readFileSync(process.env['GITHUB_EVENT_PATH'], 'utf8');
    console.log(JSON.parse(contents))

    // `who-to-greet` input defined in action metadata file
    const nameToGreet = core.getInput('who-to-greet');
    console.log(`Hello ${nameToGreet}!`);
    const time = (new Date()).toTimeString();
    core.setOutput("time", time);
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);
} catch (error) {
    core.setFailed(error.message);
}
