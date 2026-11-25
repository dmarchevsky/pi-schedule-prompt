import { describe, expect, it, vi } from "vitest";
import type { CronJob } from "../src/types.ts";
import { JobsView } from "../src/ui/jobs-view.js";

const theme = {
  fg: () => (s: string) => s,
  bold: (s: string) => s,
};

function job(overrides: Partial<CronJob>): CronJob {
  return {
    id: "j1",
    name: "job",
    schedule: "0 * * * * *",
    prompt: "p",
    enabled: true,
    type: "cron",
    createdAt: new Date().toISOString(),
    runCount: 0,
    ...overrides,
  };
}

function buildView(jobs: CronJob[], sessionId = "me") {
  const storageUpdates: Array<[string, Partial<CronJob>]> = [];
  const storage = {
    getAllJobs: () => jobs,
    updateJob: (id: string, patch: Partial<CronJob>) => {
      storageUpdates.push([id, patch]);
      const j = jobs.find((x) => x.id === id);
      if (j) Object.assign(j, patch);
    },
  };
  const scheduler = {
    onUserPresent: vi.fn(),
    updateJob: vi.fn(),
    getNextRun: () => null,
  };
  const view = new JobsView(
    storage as any,
    scheduler as any,
    sessionId,
    async () => {},
    theme as any,
    () => {},
    () => {},
  );
  return { view, storageUpdates };
}

describe("JobsView — 'p' persists toggle (model jobs)", () => {
  it("first press opts a model job out (undefined → false)", () => {
    const jobs = [job({ id: "m1", model: "haiku" })];
    const { view, storageUpdates } = buildView(jobs);
    view.handleInput("p");
    expect(storageUpdates).toEqual([["m1", { persistSession: false }]]);
  });

  it("presses back on (false → true)", () => {
    const jobs = [job({ id: "m1", model: "haiku", persistSession: false })];
    const { view, storageUpdates } = buildView(jobs);
    view.handleInput("p");
    expect(storageUpdates).toEqual([["m1", { persistSession: true }]]);
  });

  it("is a no-op for inline (no-model) jobs", () => {
    const jobs = [job({ id: "m1" })];
    const { view, storageUpdates } = buildView(jobs);
    view.handleInput("p");
    expect(storageUpdates).toEqual([]);
  });

  it("does not touch foreign-session jobs", () => {
    const jobs = [job({ id: "mine", model: "haiku", session: "me" }), job({ id: "other", model: "haiku", session: "other" })];
    const { view, storageUpdates } = buildView(jobs, "me");
    view.handleInput("\x1b[B"); // down arrow → foreign row // move onto the foreign row
    view.handleInput("p");
    expect(storageUpdates).toEqual([]);
  });
});
