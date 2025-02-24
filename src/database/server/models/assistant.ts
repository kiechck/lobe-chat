import {TRPCError} from '@trpc/server';
import {eq, inArray} from 'drizzle-orm/expressions';
import {sql} from 'drizzle-orm';
import {LobeChatDatabase} from '@/database/type';
import {assistant, AssistantItem, NewAssistant} from '../../schemas';

export class AssistantNotFoundError extends TRPCError {
  constructor() {
    super({ code: 'NOT_FOUND', message: 'Assistant not found' });
  }
}

export class AssistantModel {
  private assistantId: string;
  private db: LobeChatDatabase;

  constructor(db: LobeChatDatabase, assistantId: string) {
    this.assistantId = assistantId;
    this.db = db;
  }

  getAssistantById = async (): Promise<AssistantItem | undefined> => {
    const assistantRecord = await this.db.query.assistant.findFirst({ where: eq(assistant.id, this.assistantId) });
    if (!assistantRecord) throw new AssistantNotFoundError();
    return assistantRecord;
  };

  getAssistantList = async (): Promise<AssistantItem[]> => {
    return await this.db.query.assistant.findMany();
  };

  updateAssistant = async (value: Partial<AssistantItem>) => {
    return this.db
      .update(assistant)
      .set({ ...value, updatedAt: new Date() })
      .where(eq(assistant.id, this.assistantId));
  };

  deleteAssistant = async () => {
    return this.db.delete(assistant).where(eq(assistant.id, this.assistantId));
  };

  // Static methods

  static createAssistant = async (db: LobeChatDatabase, params: NewAssistant) => {
    const [assistantRecord] = await db
      .insert(assistant)
      .values({ ...params })
      .returning();
    return assistantRecord;
  };

  static findById = async (db: LobeChatDatabase, id: string) => {
    return db.query.assistant.findFirst({ where: eq(assistant.id, id) });
  };

  static findByIds = async (db: LobeChatDatabase, ids: string[]) => {
    return db.query.assistant.findMany({ where: inArray(assistant.id, ids) });
  };

  static findByUserId = async (db: LobeChatDatabase, userId: string) => {
    return db.query.assistant.findMany({
      where: eq(assistant.authorUid, userId)
    });
  };

  static findByCategory = async (db: LobeChatDatabase, category: string) => {
    return db.query.assistant.findMany({ where: eq(assistant.category, category) });
  };

  static findByTags = async (db: LobeChatDatabase, tags: string[]) => {
    return db.query.assistant.findMany({
      where: sql`${assistant.tags} @> ${JSON.stringify(tags)}`,
    });
  };

  static search = async (db: LobeChatDatabase, keywords: string, category: string = '') => {
    const keywordPattern = `%${keywords.toLowerCase()}%`;
    return db.query.assistant.findMany({
      where: sql`
        (LOWER(${assistant.authorName}) LIKE ${keywordPattern}
        OR LOWER(${assistant.title}) LIKE ${keywordPattern}
        OR LOWER(${assistant.description}) LIKE ${keywordPattern}
        OR LOWER(${assistant.tags}::text) LIKE ${keywordPattern})
        AND (${category} = '' OR ${assistant.category} = ${category})
      `,
    });
  };

  static findRandomByCategoryAndTags = async (db: LobeChatDatabase, category: string, tags: string[]) => {
    return db.query.assistant.findMany({
      limit: 3,
      orderBy: sql`RANDOM()`,
      where: sql`
        ${assistant.category} = ${category}
        AND ${assistant.tags}::jsonb @> ${JSON.stringify(tags)}::jsonb
      `,
    });
  };
}
