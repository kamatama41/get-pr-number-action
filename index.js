const core = require('@actions/core');
const github = require('@actions/github');
const Octokit = require("@octokit/rest");
const fs = require('fs');

async function main() {
    const contents = fs.readFileSync(process.env['GITHUB_EVENT_PATH'], 'utf8');
    // console.log(contents);
    const event = JSON.parse(contents);
    const fullName = event['repository']['full_name'];
    const [owner, repo] = fullName.split('/');
    const headCommit = event['head_commit']['id'];

    console.log(owner, repo, headCommit);
    const githubToken = core.getInput('github_token');
    const octokit = new Octokit({auth: githubToken});

    const {data: pulls} = await octokit.pulls.list({
        owner: owner,
        repo: repo,
        state: 'open',
    });

    const pull = pulls.find(pull => {
        return pull['head']['sha'] === headCommit
    });
    if (pull) {
        throw new Error('Pull request not found');
    }

    core.setOutput("time", pull['number']);
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);
}

main().catch(error => core.setFailed(error.message));
