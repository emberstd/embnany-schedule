import { Client, isFullDatabase, isFullPage } from "@notionhq/client";
import { mapNotionPageToEvent } from "@schedule/lib/notion/mapPageToEvent";
import { notionPropertyNames } from "@schedule/lib/notion/propertyConfig";
import type { ScheduleEvent } from "@schedule/types/schedule";

function sanitizeEnvValue(value: string): string {
  let trimmed = value.trim();
  while (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    trimmed = trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

function readEnv(name: string) {
  const raw = process.env[name];
  if (!raw) return "";
  return sanitizeEnvValue(raw);
}

function isPlaceholderValue(value: string) {
  return (
    !value ||
    value.includes("your_notion") ||
    value.includes("your_32_char") ||
    value === "your_notion_integration_secret_here" ||
    value === "your_32_char_database_id_here"
  );
}

function isConfigured() {
  const apiKey = readEnv("NOTION_API_KEY");
  const databaseId = readEnv("NOTION_DATABASE_ID");
  return Boolean(apiKey && databaseId && !isPlaceholderValue(apiKey) && !isPlaceholderValue(databaseId));
}

function normalizeNotionId(id: string): string {
  const trimmed = sanitizeEnvValue(id);
  if (trimmed.includes("-")) return trimmed;
  const hex = trimmed.replace(/[^a-fA-F0-9]/g, "");
  if (hex.length !== 32) return trimmed;
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function createNotionClient() {
  return new Client({ auth: readEnv("NOTION_API_KEY") });
}

async function resolveDataSourceId(
  notion: Client,
  databaseId: string,
): Promise<string> {
  const configuredDataSourceId = process.env.NOTION_DATA_SOURCE_ID?.trim();
  if (configuredDataSourceId) {
    return configuredDataSourceId;
  }

  const database = await notion.databases.retrieve({
    database_id: databaseId,
  });

  if (!isFullDatabase(database)) {
    throw new Error(
      "Could not read Notion database metadata. Share the database with your integration.",
    );
  }

  const dataSourceId = database.data_sources[0]?.id;
  if (!dataSourceId) {
    throw new Error("No data source found on this Notion database.");
  }

  return dataSourceId;
}

/**
 * Fetches all rows from the configured Notion database (server-side only).
 * Uses Notion SDK v5: database_id → data_source_id → dataSources.query.
 */
export async function getScheduleEventsFromNotion(): Promise<ScheduleEvent[]> {
  if (!isConfigured()) {
    return [];
  }

  const notion = createNotionClient();
  const databaseId = normalizeNotionId(readEnv("NOTION_DATABASE_ID"));
  const dataSourceId = await resolveDataSourceId(notion, databaseId);
  const events: ScheduleEvent[] = [];
  let cursor: string | undefined;

  try {
    do {
      const response = await notion.dataSources.query({
        data_source_id: dataSourceId,
        start_cursor: cursor,
        sorts: [
          {
            property: notionPropertyNames.date,
            direction: "ascending",
          },
        ],
      });

      for (const result of response.results) {
        if (!isFullPage(result)) continue;
        const event = mapNotionPageToEvent(result);
        if (event) events.push(event);
      }

      cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
    } while (cursor);
  } catch (error) {
    console.error("[Notion] Failed to fetch schedule:", error);
    throw error;
  }

  return events;
}

export function isNotionConfigured() {
  return isConfigured();
}
