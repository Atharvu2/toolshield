export const initialNodes = [
  { id: '1', position: { x: 50, y: 350 }, data: { label: 'Attacker opens PR', sublabel: 'pull_request.body' }, type: 'custom' },
  { id: '2', position: { x: 200, y: 350 }, data: { label: 'Agent reads it', sublabel: 'triage-agent' }, type: 'custom' },
  { id: '3', position: { x: 350, y: 200 }, data: { label: 'Bot applies label', sublabel: 'safe-to-test, as triage-bot[bot]' }, type: 'custom' },
  { id: '4', position: { x: 500, y: 50 }, data: { label: 'Label fires workflow', sublabel: 'pull_request_target: labeled' }, type: 'custom' },
  { id: '5', position: { x: 650, y: 50 }, data: { label: 'Job runs with secrets', sublabel: 'contents: write, DEPLOY_KEY' }, type: 'custom' }
];

export const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', type: 'smoothstep' },
  { id: 'e2-3', source: '2', target: '3', type: 'smoothstep' },
  { id: 'e3-4', source: '3', target: '4', type: 'smoothstep' },
  { id: 'e4-5', source: '4', target: '5', type: 'smoothstep' }
];