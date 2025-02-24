import { pgTable, uuid, text, jsonb, timestamp, integer } from 'drizzle-orm/pg-core';
import { timestamps } from './_helpers';

export const assistant = pgTable('assistant', {
  id: uuid('id').defaultRandom().primaryKey(), // 改为UUID
  identifier: text('identifier').notNull(),
  authorName: text('author_name').notNull(),
  authorUid: text('author_uid').notNull(),
  authorAvatar: text('author_avatar').notNull(),
  category: text('category').notNull(),
  tags: jsonb('tags').$type<string[]>().notNull().default([]),
  displayMode: text('display_mode').default('chat').notNull(),
  model: text('model'),
  frequencyPenalty: integer('frequency_penalty'),
  presencePenalty: integer('presence_penalty'),
  temperature: integer('temperature'),
  topP: integer('top_p'),
  inputTemplate: text('input_template').notNull(),
  avatar: text('avatar').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  systemRole: text('system_role').notNull(),
  roleFirstMsgs: jsonb('role_first_msgs').$type<string[]>().default([]),
  ...timestamps,
});

export type AssistantItem = typeof assistant.$inferSelect;
export type NewAssistant = typeof assistant.$inferInsert;
