import { z } from "zod";

export const BaseMessage = z.object({
  id: z.string(),
  ts: z.date().default(new Date()),
});

export const InitMessage = BaseMessage.extend({
  type: z.literal("init"),
});

export const RunCodeMessage = BaseMessage.extend({
  type: z.literal("run_code"),
  code: z.string(),
  input: z.string(),
});

export const CodeResultMessage = BaseMessage.extend({
  type: z.literal("code_result"),
  success: z.boolean(),
  result: z.string().optional(),
  error: z
    .object({
      name: z.string(),
      message: z.string(),
      stack: z.string(),
    })
    .optional(),
  runId: BaseMessage.shape.id,
});

export const RuntimeMessage = z.discriminatedUnion("type", [
  InitMessage,
  RunCodeMessage,
  CodeResultMessage,
]);
