export interface GlossaryTerm {
  term: string;
  plain: string;
  example: string;
}

export const glossary: GlossaryTerm[] = [
  {
    term: 'GitHub Actions',
    plain: 'A system built into GitHub that runs scripts automatically when something happens in a repository — like when someone proposes a code change.',
    example: 'When a developer opens a pull request, GitHub Actions can automatically run tests.',
  },
  {
    term: 'workflow',
    plain: 'A script file (ending in .yml) that tells GitHub Actions what to do and when to do it.',
    example: 'A workflow called ci.yml might run tests every time code is pushed.',
  },
  {
    term: 'pull request',
    plain: 'A proposal to merge code changes into a repository. Anyone — including strangers — can open one on a public project.',
    example: 'A stranger opens a pull request and includes hidden instructions in the description.',
  },
  {
    term: 'AI helper (agent)',
    plain: 'An automation that uses AI to read content like pull request descriptions, then takes actions like adding labels or posting comments.',
    example: 'A triage agent reads every pull request and decides whether to add the label "safe-to-test".',
  },
  {
    term: 'label',
    plain: 'A tag applied to a pull request or issue. Other workflows can watch for specific labels and start running when one appears.',
    example: 'When the label "safe-to-test" is applied, a powerful CI workflow starts.',
  },
  {
    term: 'trigger',
    plain: 'The event that starts a workflow running. Common triggers: a new pull request, a label being added, a comment posted.',
    example: 'The trigger "pull_request_target: labeled" fires whenever any label is added to a pull request.',
  },
  {
    term: 'privileged job',
    plain: 'A workflow step that has access to secrets (passwords, API keys) or can write to the repository. Its actions have real consequences.',
    example: 'A deployment job has access to DEPLOY_KEY and can push code to production.',
  },
  {
    term: 'secret',
    plain: 'A password, API key, or token stored securely in GitHub and injected into workflows at run time. Workflows cannot accidentally log them, but they can misuse them.',
    example: 'DEPLOY_KEY is a secret that lets a workflow push code to a server.',
  },
  {
    term: 'token',
    plain: 'A credential (like a password) that proves who is making a request. GitHub gives each app or workflow its own token.',
    example: 'The triage bot uses AGENT_APP_TOKEN to apply labels on behalf of triage-bot[bot].',
  },
  {
    term: 'trusted identity',
    plain: 'A bot or app account whose actions GitHub treats as legitimate. When it applies a label, other workflows trust that label.',
    example: 'triage-bot[bot] is a trusted identity. Its labels can unlock workflows.',
  },
  {
    term: 'TSE-001',
    plain: 'The only finding ToolShield raises. Short for "Trust and Safety Event 001: an outsider\'s text can start a powerful job through an AI helper." It fires only when all nine conditions are true.',
    example: 'TSE-001 fires when a stranger\'s pull request body reaches a privileged job via an AI agent.',
  },
  {
    term: 'authority escalation',
    plain: 'When content written by an untrusted person ends up causing a trusted system to do something powerful — without any human approving it.',
    example: 'A stranger writes text. An AI reads it. The AI, as a trusted bot, applies a label. The label unlocks a workflow with secrets.',
  },
  {
    term: 'provenance',
    plain: 'Where a piece of content originally came from. ToolShield tracks whether content started from an untrusted source (like a public pull request).',
    example: 'The label "safe-to-test" has untrusted provenance because the text that caused it came from a stranger.',
  },
  {
    term: 'artifact',
    plain: 'Something the AI helper creates or modifies — a label, a comment, an event — that then flows into another workflow.',
    example: 'The label "safe-to-test" is the artifact. It carries the stranger\'s influence forward.',
  },
  {
    term: 'sink',
    plain: 'The final destination where the danger lands — the workflow step that actually uses secrets or writes to the repository.',
    example: 'The step that runs with DEPLOY_KEY is the sink.',
  },
  {
    term: 'fixture',
    plain: 'A test case. ToolShield has seven: A1, A2, A3 are real attacks; C1, C2, C3 are safe look-alikes; B4 has no AI agent.',
    example: 'Fixture A2 is a pull request where an AI agent applies a label that triggers a privileged workflow.',
  },
  {
    term: 'BLOCK',
    plain: 'ToolShield found a real attack path. The AI helper\'s action should be denied.',
    example: 'BLOCK: the label write is denied because it would unlock a privileged workflow.',
  },
  {
    term: 'ALLOW',
    plain: 'ToolShield found no attack path. The AI helper\'s action is safe to proceed.',
    example: 'ALLOW: the agent writes to a branch that no privileged workflow watches.',
  },
  {
    term: 'REVIEW',
    plain: 'ToolShield cannot make a confident decision. A human should check.',
    example: 'REVIEW: the workflow permissions are not fully declared in the file.',
  },
  {
    term: 'detection rate',
    plain: 'The share of real attacks that ToolShield correctly blocked. 100% means it caught every attack in the test set.',
    example: '3 attacks tested, 3 blocked = 100% detection rate.',
  },
  {
    term: 'false positive',
    plain: 'A safe action that ToolShield wrongly blocked. A false positive means the tool is too aggressive.',
    example: 'If ToolShield blocks fixture C1 (which is safe), that is a false positive.',
  },
  {
    term: 'CI gate',
    plain: 'Running ToolShield as part of your automated checks. If it finds TSE-001, the check fails and a human must review before merging.',
    example: 'Add "toolshield scan" to your GitHub Actions workflow to block merges when an attack path is found.',
  },
];

export function getTerm(name: string): GlossaryTerm | undefined {
  return glossary.find(g => g.term.toLowerCase() === name.toLowerCase());
}
