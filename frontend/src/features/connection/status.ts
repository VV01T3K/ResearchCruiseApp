export type ConnectionProblem = 'checking' | 'unhealthy' | 'offline';
export type HealthResult = 'healthy' | 'unhealthy' | 'offline';

let state: { problem: ConnectionProblem | null; outage: number } = { problem: null, outage: 0 };
const listeners = new Set<() => void>();

function update(next: typeof state) {
  state = next;
  listeners.forEach((listener) => listener());
}

export const connectionStatus = {
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => void listeners.delete(listener);
  },
  get: () => state,
  suspect(problem: 'checking' | 'offline' = 'checking') {
    if (state.problem === null) update({ problem, outage: state.outage + 1 });
    else if (problem === 'offline' && state.problem !== 'offline') update({ ...state, problem });
  },
  report(outage: number, result: HealthResult) {
    if (outage !== state.outage || state.problem === null) return;
    update({ problem: result === 'healthy' ? null : result, outage });
  },
  recover() {
    if (state.problem !== null) update({ ...state, problem: null });
  },
};
