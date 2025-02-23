import { AssistantModel } from '@/database/server/models/assistant';
import { AssistantCateModel } from '@/database/server/models/category';
import { AssistantTagModel } from '@/database/server/models/tag';
import {
  AssistantCategory,
  DiscoverAssistantItem
} from '@/types/discover';
import { serverDB } from '@/database/server';

const revalidate: number = 3600;

export class AssistantService {
  // Assistants
  searchAssistant = async (keywords: string): Promise<DiscoverAssistantItem[]> => {
    const assistants = await AssistantModel.search(serverDB, keywords);
    return assistants.map((assistant) => this.convertToDiscoverAssistantItem(assistant));
  };

  getAssistantCategory = async (
    category: string,
  ): Promise<DiscoverAssistantItem[]> => {
    const assistants = await AssistantModel.findByCategory(serverDB, category);
    return assistants.map((assistant) => this.convertToDiscoverAssistantItem(assistant));
  };

  getAssistantList = async (): Promise<DiscoverAssistantItem[]> => {
    const assistantModel = new AssistantModel(serverDB, '');
    const assistants = await assistantModel.getAssistantList();
    return assistants.map((assistant) => this.convertToDiscoverAssistantItem(assistant));
  };

  getAssistantById = async (
    identifier: string,
  ): Promise<DiscoverAssistantItem | undefined> => {
    const assistant = await AssistantModel.findById(serverDB, identifier);
    if (!assistant) return undefined;
    return this.convertToDiscoverAssistantItem(assistant);
  };

  getAssistantByIds = async (
    identifiers: string[],
  ): Promise<DiscoverAssistantItem[]> => {
    const assistants = await AssistantModel.findByIds(serverDB, identifiers);
    return assistants.map((assistant) => this.convertToDiscoverAssistantItem(assistant));
  };

  getAssistantByTags = async (
    tags: string[],
  ): Promise<DiscoverAssistantItem[]> => {
    // const tagIds = await this.getTagIdsByName(tags);
    const assistants = await AssistantModel.findByTags(serverDB, tags);
    return assistants.map((assistant) => this.convertToDiscoverAssistantItem(assistant));
  };

  private getTagIdsByName = async (tags: string[]): Promise<number[]> => {
    const tagRecords = await this.db.query.tags.findMany({ where: inArray(tags.id, tags) });
    return tagRecords.map((tag) => tag.id);
  };


  // 在 AssistantService 类中添加以下方法
  private convertToDiscoverAssistantItem(assistant: any): DiscoverAssistantItem {
    // 构建 DiscoverAssistantItem
    return {
      // 直接展开剩余数据库字段（自动附加到末尾）
      ...assistant,
      // 直接映射字段
      identifier: assistant.id?.toString() ?? '',
      author: assistant.authorName,
      createdAt: assistant.createdAt,
      schemaVersion: 1,

      // LobeAgentSettings 结构
      config: {
        model: assistant.model || 'gpt-3.5-turbo',
        params: {
          frequencyPenalty: assistant.frequencyPenalty ?? 0,
          presencePenalty: assistant.presencePenalty ?? 0,
          temperature: assistant.temperature ?? 0.5,
          topP: assistant.topP ?? 1
        },
        systemRole: assistant.systemRole || '',
        inputTemplate: assistant.inputTemplate || '',
        displayMode: assistant.displayMode === 'docs' ? 'docs' : 'chat'
      },
      meta: {
        avatar: assistant.avatar || '',
        title: assistant.title || '',
        description: assistant.description || '',
        tags: Array.isArray(assistant.tags) ? assistant.tags : [],
        backgroundColor: '', // 默认空值
        category: assistant.category as AssistantCategory
      },

      // 默认空值字段
      homepage: '',
      examples: [],
      socialData: {
        conversations: 0,
        likes: 0,
        users: 0
      },
      suggestions: [],

      // 覆盖需要特殊处理的字段
      roleFirstMsgs: Array.isArray(assistant.roleFirstMsgs) ? assistant.roleFirstMsgs : [],
      // 移除与接口冲突的字段（如有必要）
      // ...('id' in assistant && { id: undefined }) // 示例：移除 id 字段
    } as DiscoverAssistantItem; // 类型断言确保兼容性;
  }
}
