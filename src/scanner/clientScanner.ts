import JSZip from 'jszip';
import * as yaml from 'js-yaml';

export interface Evidence {
  input: string;
  agent: string;
  identity: string;
  credential: string;
  artifact: string;
  trigger: string;
  workflow: string;
  job: string;
  privileges: string[];
}

export interface Finding {
  rule: string;
  severity: string;
  decision: string;
  evidence: Evidence;
}

function canTrigger(tokenType: string, eventType: string): boolean {
  if (tokenType === 'github_token') {
    return ['workflow_dispatch', 'repository_dispatch'].includes(eventType);
  }
  if (['github_app_installation_token', 'pat'].includes(tokenType)) {
    return true;
  }
  return false;
}

function isPrivilegedJob(job: any): [boolean, string[]] {
  const privileges: string[] = [];
  if (!job || typeof job !== 'object') return [false, []];

  const permissions = job.permissions || {};
  if (typeof permissions === 'object') {
    if (permissions.contents === 'write') privileges.push('contents:write');
    if (permissions['id-token'] === 'write') privileges.push('id-token:write');
    if (permissions.deployments === 'write') privileges.push('deployments:write');
    if (permissions.packages === 'write') privileges.push('packages:write');
  }

  const steps = job.steps || [];
  for (const step of steps) {
    const stepStr = JSON.stringify(step);
    if (stepStr.includes('secrets.')) privileges.push('secrets.*');
    if (stepStr.includes('actions/checkout') && stepStr.includes('github.event.pull_request.head.sha')) {
      privileges.push('actions/checkout:untrusted-ref');
    }
  }

  const jobStr = JSON.stringify(job);
  if (jobStr.includes('secrets.') && !privileges.includes('secrets.*')) {
    privileges.push('secrets.*');
  }

  return [privileges.length > 0, privileges];
}

function matchesTrigger(producerEvent: string, wfData: any): boolean {
  if (!wfData) return false;
  let onClause = wfData.on;
  if (onClause === undefined && wfData[true as any]) {
    onClause = wfData[true as any];
  }

  if (typeof onClause === 'string') {
    return producerEvent === onClause;
  }
  if (Array.isArray(onClause)) {
    return onClause.includes(producerEvent);
  }
  if (typeof onClause === 'object' && onClause !== null) {
    if (producerEvent === 'issue_comment' && 'issue_comment' in onClause) return true;
    if (producerEvent === 'issue_label' && ('issues' in onClause || 'pull_request_target' in onClause)) return true;
    if (producerEvent === 'repository_dispatch' && 'repository_dispatch' in onClause) return true;
    if (producerEvent in onClause) return true;
  }

  return false;
}

export async function scanZipFile(file: File): Promise<Finding[]> {
  const zip = await JSZip.loadAsync(file);

  // Find agents file (.traceshield/agents.yml or .traceshield/agents.yaml)
  let agentsFileEntry: JSZip.JSZipObject | null = null;
  zip.forEach((relativePath, zipEntry) => {
    if (relativePath.endsWith('.traceshield/agents.yml') || relativePath.endsWith('.traceshield/agents.yaml')) {
      agentsFileEntry = zipEntry;
    }
  });

  if (!agentsFileEntry) {
    return [];
  }

  const agentsStr = await (agentsFileEntry as JSZip.JSZipObject).async('string');
  const agentsData = yaml.load(agentsStr) as any;
  const agents = agentsData?.agents || [];

  // Find workflow files (.github/workflows/*.yml or *.yaml)
  const workflowEntries: { path: string; entry: JSZip.JSZipObject }[] = [];
  zip.forEach((relativePath, zipEntry) => {
    if (
      !zipEntry.dir &&
      (relativePath.includes('.github/workflows/') || relativePath.includes('.github/workflows\\')) &&
      (relativePath.endsWith('.yml') || relativePath.endsWith('.yaml'))
    ) {
      workflowEntries.push({ path: relativePath, entry: zipEntry });
    }
  });

  const workflowsParsed: { path: string; data: any }[] = [];
  for (const wf of workflowEntries) {
    try {
      const content = await wf.entry.async('string');
      const data = yaml.load(content);
      if (data && typeof data === 'object') {
        workflowsParsed.push({ path: wf.path, data });
      }
    } catch (e) {
      // Ignore parse errors on individual workflows
    }
  }

  const findings: Finding[] = [];

  for (const agent of agents) {
    const tokenType = agent.credential?.type || '';
    const produces = agent.produces || [];
    const consumes = agent.consumes || [];

    for (const producerEvent of produces) {
      if (!canTrigger(tokenType, producerEvent)) continue;

      for (const wf of workflowsParsed) {
        if (matchesTrigger(producerEvent, wf.data)) {
          const jobs = wf.data.jobs || {};
          for (const [jobId, job] of Object.entries<any>(jobs)) {
            const [isPriv, privs] = isPrivilegedJob(job);
            if (isPriv) {
              const relPath = wf.path.split('.github/workflows/').pop() || wf.path;
              findings.push({
                rule: 'TSE-001',
                severity: 'CRITICAL',
                decision: 'BLOCK',
                evidence: {
                  input: consumes[0] || 'unknown',
                  agent: agent.id || 'agent',
                  identity: agent.identity || 'bot',
                  credential: tokenType,
                  artifact: producerEvent,
                  trigger: producerEvent,
                  workflow: `.github/workflows/${relPath}`,
                  job: jobId,
                  privileges: privs,
                },
              });
            }
          }
        }
      }
    }
  }

  return findings;
}
