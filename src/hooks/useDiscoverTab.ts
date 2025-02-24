import { useQueryState } from 'nuqs';

import { DiscoverTab, AssistantCategory } from '@/types/discover';

export const useDiscoverTab = () => {
  const [type] = useQueryState('type', {
    clearOnDefault: true,
    defaultValue: DiscoverTab.Assistants,
  });

  return type as DiscoverTab;
};

export const useAssistantCategory = () => {
  const [type] = useQueryState('type', {
    clearOnDefault: true,
    defaultValue: AssistantCategory.All,
  });

  return type as AssistantCategory;
};
