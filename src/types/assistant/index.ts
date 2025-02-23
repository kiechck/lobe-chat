export interface AssistantItem {
  id: number; // 自增ID
  identifier: string; // 标识符
  authorName: string; // 作者名称
  authorUid: string; // 作者UID
  authorAvatar: string; // 作者头像
  category: string; // 分类
  tags: string[]; // 标签
  displayMode: 'chat' | 'docs'; // 显示模式 chat or docs
  model?: string; // 建议模型
  frequencyPenalty?: number; // 频率惩罚
  presencePenalty?: number; // 存在惩罚
  temperature?: number; // 温度
  topP?: number; // 顶部P
  inputTemplate: string; // 输入模板
  avatar: string; // 头像
  title: string; // 标题
  description: string; // 描述
  systemRole: string; // 系统角色
  roleFirstMsgs: string[]; // 角色初始消息
  createdAt: string; // 创建时间
  updatedAt: string; // 更新时间
  accessedAt: string; // 访问时间
}
