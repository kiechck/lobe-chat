import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm/expressions';
import { LobeChatDatabase } from '@/database/type';
import { CategoryItem, NewCategory, categories } from '../../schemas';

export class CategoryNotFoundError extends TRPCError {
  constructor() {
    super({ code: 'NOT_FOUND', message: 'Category not found' });
  }
}

export class CategoryModel {
  private categoryId: string;
  private db: LobeChatDatabase;

  constructor(db: LobeChatDatabase, categoryId: string) {
    this.categoryId = categoryId;
    this.db = db;
  }

  getCategoryById = async (): Promise<CategoryItem | undefined> => {
    const category = await this.db.query.categories.findFirst({ where: eq(categories.id, this.categoryId) });
    if (!category) throw new CategoryNotFoundError();
    return category;
  };

  getCategoryList = async (): Promise<CategoryItem[]> => {
    const categories = await this.db.query.categories.findMany();
    return categories;
  };

  updateCategory = async (value: Partial<CategoryItem>) => {
    return this.db
      .update(categories)
      .set({ ...value, updatedAt: new Date() })
      .where(eq(categories.id, this.categoryId));
  };

  deleteCategory = async () => {
    return this.db.delete(categories).where(eq(categories.id, this.categoryId));
  };

  // Static methods

  static createCategory = async (db: LobeChatDatabase, params: NewCategory) => {
    const [category] = await db
      .insert(categories)
      .values({ ...params })
      .returning();
    return category;
  };

  static findById = async (db: LobeChatDatabase, id: string) => {
    return db.query.categories.findFirst({ where: eq(categories.id, id) });
  };
}
