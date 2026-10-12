import { fixtureActivities, sortActivities } from "@/features/activity/data";
import {
  isActivityType,
  validateFollowUpInput,
} from "@/features/activity/validation";
import { getLead } from "@/features/leads/data";
import {
  type ActivityPage,
  type ActivitySort,
  type ActivityType,
  type LeadActivity,
} from "@/types/api";

export { isActivityType } from "@/features/activity/validation";

const STORAGE_KEY = "keyloop.leadActivities.v1";
const STORAGE_VERSION = 2;
const LEGACY_STORAGE_VERSION = 1;

type StoredActivities = {
  version: typeof STORAGE_VERSION;
  activities: LeadActivity[];
};

type LegacyLeadActivity = Omit<LeadActivity, "type">;

const exactKeys = (value: Record<string, unknown>, keys: string[]) => {
  const valueKeys = Object.keys(value).sort();
  return (
    valueKeys.length === keys.length &&
    keys.toSorted().every((key, index) => key === valueKeys[index])
  );
};

const isUtcIsoDateTime = (value: string) => {
  return (
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value) &&
    !Number.isNaN(Date.parse(value))
  );
};

const hasValidActivityFields = (record: Record<string, unknown>) =>
  typeof record.id === "string" &&
  record.id.length > 0 &&
  typeof record.leadId === "string" &&
  Boolean(getLead(record.leadId)) &&
  typeof record.note === "string" &&
  record.note.trim().length > 0 &&
  typeof record.createdAt === "string" &&
  isUtcIsoDateTime(record.createdAt);

const isLegacyLeadActivity = (value: unknown): value is LegacyLeadActivity => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const record = value as Record<string, unknown>;
  return (
    exactKeys(record, ["id", "leadId", "note", "createdAt"]) &&
    hasValidActivityFields(record)
  );
};

const isLeadActivity = (value: unknown): value is LeadActivity => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const record = value as Record<string, unknown>;
  return (
    exactKeys(record, ["id", "leadId", "type", "note", "createdAt"]) &&
    hasValidActivityFields(record) &&
    (record.type === null || isActivityType(record.type))
  );
};

const parseStoredActivities = (rawValue: string | null): LeadActivity[] => {
  if (rawValue === null) {
    return [];
  }

  const parsed: unknown = JSON.parse(rawValue);

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("Saved follow-up data is malformed.");
  }

  const record = parsed as Record<string, unknown>;

  if (!exactKeys(record, ["version", "activities"])) {
    throw new Error("Saved follow-up data uses an unsupported structure.");
  }

  if (!Array.isArray(record.activities)) {
    throw new Error("Saved follow-up data uses an unsupported version.");
  }

  if (record.version === LEGACY_STORAGE_VERSION) {
    if (!record.activities.every(isLegacyLeadActivity)) {
      throw new Error(
        "Saved follow-up data includes invalid activity records.",
      );
    }

    return record.activities.map((activity) => ({ ...activity, type: null }));
  }

  if (record.version !== STORAGE_VERSION) {
    throw new Error("Saved follow-up data uses an unsupported version.");
  }

  if (!record.activities.every(isLeadActivity)) {
    throw new Error("Saved follow-up data includes invalid activity records.");
  }

  return record.activities;
};

export const readStoredActivities = (
  storage: Storage = window.localStorage,
) => {
  return parseStoredActivities(storage.getItem(STORAGE_KEY));
};

const writeStoredActivities = (
  activities: LeadActivity[],
  storage: Storage = window.localStorage,
) => {
  const payload: StoredActivities = {
    version: STORAGE_VERSION,
    activities,
  };

  storage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

const createActivityId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `activity-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const getPersistedActivitiesForLead = (
  leadId: string,
  storage: Storage = window.localStorage,
) =>
  readStoredActivities(storage).filter(
    (activity) => activity.leadId === leadId,
  );

export const getAllActivitiesForLead = (
  leadId: string,
  storage: Storage = window.localStorage,
  sort: ActivitySort = "newest",
): LeadActivity[] => {
  return sortActivities(
    [
      ...fixtureActivities,
      ...getPersistedActivitiesForLead(leadId, storage),
    ].filter((activity) => activity.leadId === leadId),
    sort,
  );
};

type ActivityCursor = {
  leadId: string;
  sort: ActivitySort;
  createdAt: string;
  id: string;
};

const encodeCursor = (cursor: ActivityCursor) =>
  encodeURIComponent(JSON.stringify(cursor));

const decodeCursor = (value: string, leadId: string, sort: ActivitySort) => {
  let parsed: unknown;

  try {
    parsed = JSON.parse(decodeURIComponent(value));
  } catch {
    throw new Error("Activity cursor is invalid.");
  }

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    Array.isArray(parsed) ||
    !exactKeys(parsed as Record<string, unknown>, [
      "leadId",
      "sort",
      "createdAt",
      "id",
    ])
  ) {
    throw new Error("Activity cursor is invalid.");
  }

  const cursor = parsed as ActivityCursor;

  if (
    cursor.leadId !== leadId ||
    cursor.sort !== sort ||
    typeof cursor.id !== "string" ||
    typeof cursor.createdAt !== "string" ||
    !isUtcIsoDateTime(cursor.createdAt)
  ) {
    throw new Error("Activity cursor does not match this history.");
  }

  return cursor;
};

export const getActivityPageForLead = ({
  leadId,
  sort = "newest",
  limit,
  cursor = null,
  storage = window.localStorage,
}: {
  leadId: string;
  sort?: ActivitySort;
  limit: number;
  cursor?: string | null;
  storage?: Storage;
}): ActivityPage => {
  const activities = getAllActivitiesForLead(leadId, storage, sort);
  const cursorActivity = cursor ? decodeCursor(cursor, leadId, sort) : null;
  const startIndex = cursorActivity
    ? activities.findIndex(
        (activity) =>
          activity.id === cursorActivity.id &&
          activity.createdAt === cursorActivity.createdAt,
      ) + 1
    : 0;

  if (cursorActivity && startIndex === 0) {
    throw new Error("Activity cursor is no longer valid.");
  }

  const pageWithExtra = activities.slice(startIndex, startIndex + limit + 1);
  const items = pageWithExtra.slice(0, limit);
  const lastItem = items.at(-1);

  return {
    items,
    nextCursor:
      pageWithExtra.length > limit && lastItem
        ? encodeCursor({
            leadId,
            sort,
            createdAt: lastItem.createdAt,
            id: lastItem.id,
          })
        : null,
  };
};

export const saveFollowUpActivity = ({
  leadId,
  type,
  note,
  storage = window.localStorage,
  now = () => new Date(),
}: {
  leadId: string;
  type: ActivityType;
  note: string;
  storage?: Storage;
  now?: () => Date;
}): LeadActivity => {
  const validation = validateFollowUpInput({ leadId, type, note });

  if (!validation.ok) {
    throw new Error(validation.error.message);
  }

  const existingActivities = readStoredActivities(storage);
  const activity: LeadActivity = {
    id: createActivityId(),
    leadId: validation.value.leadId,
    type: validation.value.type,
    note: validation.value.note,
    createdAt: now().toISOString(),
  };

  writeStoredActivities([...existingActivities, activity], storage);

  return activity;
};

export const resetStoredActivities = (
  storage: Storage = window.localStorage,
) => {
  storage.removeItem(STORAGE_KEY);
};

export const activityStorageKey = STORAGE_KEY;
