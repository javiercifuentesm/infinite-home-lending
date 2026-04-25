/**
 * Lightweight eval harness — no assertions library; prints pass/fail summaries.
 */
import { runAgentV3Turn, runAgentV3Welcome } from "../agentV3Orchestrator";
import { mergeSessionPatch } from "../agentV3State";
import type { AgentV3SessionState } from "../agentV3Types";
import { EVAL_SCENARIOS } from "./agentV3EvalFixtures";

async function runScenario(id: string): Promise<{ ok: boolean; log: string }> {
  const scenario = EVAL_SCENARIOS.find((s) => s.id === id);
  if (!scenario) return { ok: false, log: `Unknown scenario: ${id}` };

  const welcome = runAgentV3Welcome(`sess_${id}`, "eval");
  let state = welcome.statePatch as AgentV3SessionState;

  for (const turn of scenario.turns) {
    const out = await runAgentV3Turn({
      sessionId: state.sessionId,
      pageContext: state.pageContext,
      state,
      turn,
      clientTimeZone: "America/New_York",
    });
    state = mergeSessionPatch(state, out.statePatch ?? {}) as AgentV3SessionState;
  }

  const flags = state.complianceFlags.join(",");
  const expect = scenario.expect;
  let ok = true;
  const issues: string[] = [];

  if (expect.complianceFlagIncludes && !flags.includes(expect.complianceFlagIncludes)) {
    ok = false;
    issues.push(`expected flag ${expect.complianceFlagIncludes}, got ${flags}`);
  }
  if (expect.minStage) {
    const order = ["greeting", "discovery", "summary_ready", "contact_capture", "scheduling", "confirmation"];
    const si = order.indexOf(state.stage);
    const mi = order.indexOf(expect.minStage);
    if (si < mi) {
      ok = false;
      issues.push(`stage ${state.stage} < expected ${expect.minStage}`);
    }
  }

  return {
    ok,
    log: `${scenario.id}: ${ok ? "PASS" : "FAIL"} ${issues.join("; ") || ""} stage=${state.stage} flags=[${flags}]`,
  };
}

export async function runAllEvals(): Promise<void> {
  for (const s of EVAL_SCENARIOS) {
    const { log } = await runScenario(s.id);
    console.log(log);
  }
}

if (process.argv[1]?.includes("agentV3EvalRunner")) {
  void runAllEvals();
}
