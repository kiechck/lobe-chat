import { TRPCError } from '@trpc/server';
import { eq, inArray } from 'drizzle-orm/expressions';
import { LobeChatDatabase } from '@/database/type';
import { AssistantItem, NewAssistant, assistant } from '../../schemas';

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
    const assistant = await this.db.query.assistant.findFirst({ where: eq(assistant.id, this.assistantId) });
    if (!assistant) throw new AssistantNotFoundError();
    return assistant;
  };

  getAssistantList = async (): Promise<AssistantItem[]> => {
    const assistant = await this.db.query.assistant.findMany();
    return assistant;
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
    const [assistant] = await db
      .insert(assistant)
      .values({ ...params })
      .returning();
    return assistant;
  };

  static findById = async (db: LobeChatDatabase, id: string) => {
    return db.query.assistant.findFirst({ where: eq(assistant.id, id) });
  };

  static findByIds = async (db: LobeChatDatabase, ids: string[]) => {
    return db.query.assistant.findMany({ where: inArray(assistant.id, ids) });
  };

  static findByUserId = async (db: LobeChatDatabase, userId: string) => {
    return db.query.assistant.findMany({ where: eq(assistant.userId, userId) });
  };

  static findByCategory = async (db: LobeChatDatabase, category: number) => {
    return db.query.assistant.findMany({ where: eq(assistant.category, category) });
  };

  static findByTags = async (db: LobeChatDatabase, tags: string[]) => {
    return db.query.assistant.findMany({
      where: sql`${assistant.tags} @> ${JSON.stringify(tags)}`,
    });
  };

  static search = async (db: LobeChatDatabase, keywords: string) => {
    const keywordPattern = `%${keywords.toLowerCase()}%`;
    return db.query.assistant.findMany({
      where: sql`
        LOWER(${assistant.authorName}) LIKE ${keywordPattern}
        OR LOWER(${assistant.title}) LIKE ${keywordPattern}
        OR LOWER(${assistant.description}) LIKE ${keywordPattern}
        OR LOWER(${assistant.tags}::text) LIKE ${keywordPattern}
      `,
    });
  };
}
