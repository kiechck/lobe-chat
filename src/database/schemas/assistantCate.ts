import { InferModel } from 'drizzle-orm';
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const assistantCate = pgTable('assistant_cate', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type AssistantCateItem = InferModel<typeof assistantCate>;
export type NewAssistantCate = InferModel<typeof assistantCate, 'insert'>;
