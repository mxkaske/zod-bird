/**
 * These examples are taken from https://github.com/chronark/highstorm
 */

import { z } from "zod";

import { Tinybird } from "./client";

const tb = new Tinybird({ token: "<TINYBIRD_TOKEN>" });

export const getChannelActivity = tb.buildPipe({
  pipe: "get_channel_activity__v1",
  parameters: z.object({
    tenantId: z.string(),
    channelId: z.string().optional(),
    start: z.number(),
    end: z.number().optional(),
    granularity: z.enum(["1m", "1h", "1d", "1w", "1M"]),
  }),
  data: z.object({
    time: z.string().transform((t) => new Date(t).getTime()),
    count: z
      .number()
      .nullable()
      .optional()
      .transform((v) => (typeof v === "number" ? v : 0)),
  }),
});

export const getEventCount = tb.buildPipe({
  pipe: "get_event_count__v1",
  parameters: z.object({
    channelId: z.string().optional(),
    start: z.number(),
    end: z.number(),
  }),
  data: z.object({
    count: z
      .number()
      .nullable()
      .optional()
      .transform((v) => (typeof v === "number" ? v : 0)),
  }),
});

export const getEvents = tb.buildPipe({
  pipe: "get_events__v1",
  parameters: z.object({
    tenantId: z.string(),
    channelId: z.string().optional(),
    since: z.number(),
    limit: z.number().optional(),
  }),
  data: z.object({
    id: z.string(),
    channelId: z.string(),
    event: z.string(),
    time: z.number(),
    content: z.string(),
    metadata: z.string().transform((m) => JSON.parse(m)),
  }),
});

export const getEvent = tb.buildPipe({
  pipe: "get_event__v1",
  parameters: z.object({
    eventId: z.string(),
  }),
  data: z.object({
    id: z.string(),
    channelId: z.string(),
    event: z.string(),
    time: z.number(),
    content: z.string(),
    metadata: z.string().transform((m) => JSON.parse(m)),
  }),
});

export const publishEvents = tb.buildIngestEndpoint({
  datasource: "events__v1",
  event: z.object({
    id: z.string(),
  }),
});

// await publishEvents([{ id: "1" }, { id: "2" }])
