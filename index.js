const core = require('@actions/core');
const github = require('@actions/github');
const Octokit = require("@octokit/rest");
const octokit = new Octokit({auth: core.getInput('github_token')});

async function main() {
    const event = github.context.payload;
    const fullName = event['repository']['full_name'];
    const [owner, repo] = fullName.split('/');
    const headCommit = event['head_commit']['id'];
    core.debug(`The event payload: ${JSON.stringify(github.context, undefined, 2)}`);

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

    core.debug(`The PR info: ${JSON.stringify(pull, undefined, 2)}`);
    core.setOutput('is_found', true);
    core.setOutput('number', pull['number']);
}

main().catch(error => core.setFailed(error.message));
