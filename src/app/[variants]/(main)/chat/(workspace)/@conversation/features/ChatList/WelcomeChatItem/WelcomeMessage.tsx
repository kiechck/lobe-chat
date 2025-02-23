import { ChatItem } from '@lobehub/ui';
import isEqual from 'fast-deep-equal';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useAgentStore } from '@/store/agent';
import { agentSelectors } from '@/store/agent/selectors';
import { useChatStore } from '@/store/chat';
import { featureFlagsSelectors, useServerConfigStore } from '@/store/serverConfig';
import { useSessionStore } from '@/store/session';
import { sessionMetaSelectors } from '@/store/session/selectors';

const WelcomeMessage = () => {
  const { t } = useTranslation('chat');
  const [type = 'chat'] = useAgentStore((s) => {
    const config = agentSelectors.currentAgentChatConfig(s);
    return [config.displayMode];
  });

  const meta = useSessionStore(sessionMetaSelectors.currentAgentMeta, isEqual);
  const { isAgentEditable } = useServerConfigStore(featureFlagsSelectors);
  const activeId = useChatStore((s) => s.activeId);

  const agentSystemRoleMsg = t('agentDefaultMessageWithSystemRole', {
    name: meta.title || t('defaultAgent'),
    systemRole: meta.description,
  });

  const agentMsg = t(isAgentEditable ? 'agentDefaultMessage' : 'agentDefaultMessageWithoutEdit', {
    name: meta.title || t('defaultAgent'),
    url: `/chat/settings?session=${activeId}`,
  });

  // ai开场白
  const roleFirstMsgs = useAgentStore((s) => {
    const config = agentSelectors.currentAgentConfig(s);
    return config.roleFirstMsgs || [];
  });
  let msg = agentMsg;
  if (roleFirstMsgs.length > 0) {
    msg = roleFirstMsgs[0];
  } else if (!!meta.description) {
    msg = agentSystemRoleMsg;
  }

  return (
    <ChatItem
      avatar={meta}
      editing={false}
      // message={!!meta.description ? agentSystemRoleMsg : agentMsg}
      message={ msg }
      placement={'left'}
      type={type === 'chat' ? 'block' : 'pure'}
    />
  );
};
export default WelcomeMessage;
