import { InferModel } from 'drizzle-orm';
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const assistantTag = pgTable('assistant_tag', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type AssistantsTagItem = InferModel<typeof assistantTag>;
export type NewAssistantTag = InferModel<typeof assistantTag, 'insert'>;
