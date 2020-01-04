const core = require('@actions/core');
const github = require('@actions/github');
const Octokit = require("@octokit/rest");
const fs = require('fs');

async function main() {
    const contents = fs.readFileSync(process.env['GITHUB_EVENT_PATH'], 'utf8');
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
    if (!pull) {
        console.log('Pull request not found');
        core.setOutput('is_found', false);
        return
    }

    console.log(JSON.stringify(pull, undefined, 2));
    core.setOutput('is_found', true);
    core.setOutput('number', pull['number']);
}

main().catch(error => core.setFailed(error.message));
