import { describe, expect, it, vi } from "vitest";

import { leads } from "@/features/leads/data";
import {
  activityStorageKey,
  getAllActivitiesForLead,
  readStoredActivities,
  resetStoredActivities,
  saveFollowUpActivity,
} from "@/features/activity/storage";

class MemoryStorage implements Storage {
  private values = new Map<string, string>();

  get length() {
    return this.values.size;
  }

  clear() {
    this.values.clear();
  }

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  key(index: number) {
    return Array.from(this.values.keys())[index] ?? null;
  }

  removeItem(key: string) {
    this.values.delete(key);
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

const fixedNow = () => new Date("2026-02-03T04:05:06.007Z");
const annaLeadId = leads[0].id;
const marcusLeadId = leads[1].id;

describe("activity persistence boundary", () => {
  it("starts with no persisted activities when storage is absent", () => {
    expect(readStoredActivities(new MemoryStorage())).toEqual([]);
  });

  it("saves typed activities with automatic UTC timestamps and reads them back", () => {
    const storage = new MemoryStorage();

    const activity = saveFollowUpActivity({
      leadId: annaLeadId,
      type: "call",
      note: "  Called Anna and confirmed Saturday.  ",
      storage,
      now: fixedNow,
    });

    expect(Object.keys(activity).sort()).toEqual([
      "createdAt",
      "id",
      "leadId",
      "note",
      "type",
    ]);
    expect(activity).toMatchObject({
      leadId: annaLeadId,
      type: "call",
      note: "Called Anna and confirmed Saturday.",
      createdAt: "2026-02-03T04:05:06.007Z",
    });
    expect(readStoredActivities(storage)).toEqual([activity]);
  });

  it("retains prior records and isolates visible history by lead", () => {
    const storage = new MemoryStorage();

    const anna = saveFollowUpActivity({
      leadId: annaLeadId,
      type: "email",
      note: "Anna follow-up",
      storage,
      now: () => new Date("2026-02-03T10:00:00.000Z"),
    });
    saveFollowUpActivity({
      leadId: marcusLeadId,
      type: "message",
      note: "Marcus follow-up",
      storage,
      now: () => new Date("2026-02-04T10:00:00.000Z"),
    });

    expect(readStoredActivities(storage)).toHaveLength(2);
    expect(getAllActivitiesForLead(annaLeadId, storage)).toContainEqual(anna);
    expect(
      getAllActivitiesForLead(annaLeadId, storage).every(
        (activity) => activity.leadId === annaLeadId,
      ),
    ).toBe(true);
    expect(
      getAllActivitiesForLead(annaLeadId, storage, "oldest").at(-1),
    ).toEqual(anna);
  });

  it("migrates valid version 1 records without inventing an activity type", () => {
    const storage = new MemoryStorage();
    storage.setItem(
      activityStorageKey,
      JSON.stringify({
        version: 1,
        activities: [
          {
            id: "activity-legacy",
            leadId: annaLeadId,
            note: "Historical note",
            createdAt: "2026-02-03T04:05:06.007Z",
          },
        ],
      }),
    );

    expect(readStoredActivities(storage)).toEqual([
      {
        id: "activity-legacy",
        leadId: annaLeadId,
        type: null,
        note: "Historical note",
        createdAt: "2026-02-03T04:05:06.007Z",
      },
    ]);
  });

  it("rejects malformed and unsupported persisted data without replacing it", () => {
    const storage = new MemoryStorage();
    storage.setItem(activityStorageKey, JSON.stringify({ version: 2 }));

    expect(() => readStoredActivities(storage)).toThrow(/unsupported/i);
    expect(storage.getItem(activityStorageKey)).toBe(
      JSON.stringify({ version: 2 }),
    );

    storage.setItem(
      activityStorageKey,
      JSON.stringify({
        version: 1,
        activities: [
          {
            id: "activity-bad",
            leadId: annaLeadId,
            note: "Extra field",
            createdAt: "2026-02-03T04:05:06.007Z",
            type: "call",
          },
        ],
      }),
    );

    expect(() => readStoredActivities(storage)).toThrow(/invalid/i);
  });

  it("surfaces read exceptions without replacing saved data", () => {
    const storage = new MemoryStorage();
    storage.setItem(activityStorageKey, "not json");

    expect(() => readStoredActivities(storage)).toThrow();
    expect(storage.getItem(activityStorageKey)).toBe("not json");
  });

  it("removes persisted activities only through explicit recovery", () => {
    const storage = new MemoryStorage();
    const activity = saveFollowUpActivity({
      leadId: annaLeadId,
      type: "call",
      note: "Recoverable note",
      storage,
      now: fixedNow,
    });

    expect(readStoredActivities(storage)).toEqual([activity]);
    resetStoredActivities(storage);
    expect(readStoredActivities(storage)).toEqual([]);
  });

  it("surfaces write failures without adding a memory-only activity", () => {
    const storage = new MemoryStorage();
    const failure = new Error("Storage quota exceeded");
    vi.spyOn(storage, "setItem").mockImplementation(() => {
      throw failure;
    });

    expect(() =>
      saveFollowUpActivity({
        leadId: annaLeadId,
        type: "call",
        note: "Will fail",
        storage,
        now: fixedNow,
      }),
    ).toThrow(failure);
    expect(storage.getItem(activityStorageKey)).toBeNull();
  });
});
