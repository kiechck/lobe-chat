import { Locales } from '@/locales/resources';
import { DiscoverService } from '@/server/services/discover';
import { AssistantService } from '@/server/services/assistant';

import Back from '../../(detail)/features/Back';
import List from '../../(list)/assistants/features/List';

const AssistantsResult = async ({
  locale,
  q,
  mobile,
  category,
}: {
  category: string;
  locale: Locales;
  mobile?: boolean;
  q: string;
}) => {
  const assistantService = new AssistantService();
  console.log('category', category);
  const items = await assistantService.searchAssistant(q, category);

  return (
    <>
      {!mobile && <Back href={'/discover/assistants'} style={{ marginBottom: 0 }} />}
      <List items={items} mobile={mobile} searchKeywords={q} />
    </>
  );
};

export default AssistantsResult;
