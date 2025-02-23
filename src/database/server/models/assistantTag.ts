import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm/expressions';
import { LobeChatDatabase } from '@/database/type';
import { TagItem, NewTag, tags } from '../../schemas';

export class TagNotFoundError extends TRPCError {
  constructor() {
    super({ code: 'NOT_FOUND', message: 'Tag not found' });
  }
}

export class TagModel {
  private tagId: string;
  private db: LobeChatDatabase;

  constructor(db: LobeChatDatabase, tagId: string) {
    this.tagId = tagId;
    this.db = db;
  }

  getTagById = async (): Promise<TagItem | undefined> => {
    const tag = await this.db.query.tags.findFirst({ where: eq(tags.id, this.tagId) });
    if (!tag) throw new TagNotFoundError();
    return tag;
  };

  getTagList = async (): Promise<TagItem[]> => {
    const tags = await this.db.query.tags.findMany();
    return tags;
  };

  updateTag = async (value: Partial<TagItem>) => {
    return this.db
      .update(tags)
      .set({ ...value, updatedAt: new Date() })
      .where(eq(tags.id, this.tagId));
  };

  deleteTag = async () => {
    return this.db.delete(tags).where(eq(tags.id, this.tagId));
  };

  // Static methods

  static createTag = async (db: LobeChatDatabase, params: NewTag) => {
    const [tag] = await db
      .insert(tags)
      .values({ ...params })
      .returning();
    return tag;
  };

  static findById = async (db: LobeChatDatabase, id: string) => {
    return db.query.tags.findFirst({ where: eq(tags.id, id) });
  };

  static findByName = async (db: LobeChatDatabase, name: string) => {
    return db.query.tags.findFirst({ where: eq(tags.name, name) });
  };
}
