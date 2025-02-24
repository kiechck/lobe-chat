import { ChatItem } from '@lobehub/ui';
import isEqual from 'fast-deep-equal';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';
import { ChevronRight, ChevronLeft } from 'lucide-react';

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

  const [currentIndex, setCurrentIndex] = useState(0);

  // 当roleFirstMsgs变化时重置索引
  useEffect(() => {
    setCurrentIndex(0);
  }, [roleFirstMsgs]);

  // 修改切换处理函数
  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + roleFirstMsgs.length) % roleFirstMsgs.length);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % roleFirstMsgs.length);
  };

  let msg = agentMsg;
  if (roleFirstMsgs.length > 0) {
    msg = roleFirstMsgs[currentIndex];
  } else if (!!meta.description) {
    msg = agentSystemRoleMsg;
  }

  const hasMultipleMessages = roleFirstMsgs.length > 1;

  // 添加store方法
  const { setRoleFirstMsg } = useChatStore();

  // 在msg变化时更新store
  useEffect(() => {
    if (roleFirstMsgs.length > 0 && msg) {
      setRoleFirstMsg(msg);
    }
    return () => {
      if (roleFirstMsgs.length > 0) {
        setRoleFirstMsg(undefined);
      }
    };
  }, [msg, roleFirstMsgs.length]);

  return (
    <Flexbox gap={8}>
      <Flexbox gap={8} style={{ position: 'relative', width: 'fit-content' }}>
        <ChatItem
          avatar={meta}
          editing={false}
          message={msg}
          placement={'left'}
          type={type === 'chat' ? 'block' : 'pure'}
        />
        {hasMultipleMessages && (
          <Flexbox
            align="center"
            gap={4}
            horizontal
            style={{
              borderRadius: 4,
              bottom: -20,
              left: 70,
              padding: '2px 4px 8px 0',
              position: 'absolute',
            }}
          >
            <ChevronLeft
              onClick={handlePrev}
              size={16}
              style={{
                color: '#666',
                cursor: 'pointer',
                strokeWidth: 2.5,
              }}
            />
            <span
              style={{
                color: '#333',
                fontSize: 12,
                fontWeight: 500,
                minWidth: 60,
                textAlign: 'center',
              }}
            >
              {currentIndex + 1} / {roleFirstMsgs.length}
            </span>
            <ChevronRight
              onClick={handleNext}
              size={16}
              style={{
                color: '#666',
                cursor: 'pointer',
                strokeWidth: 2.5,
              }}
            />
          </Flexbox>
        )}
      </Flexbox>
    </Flexbox>
  );
};
export default WelcomeMessage;
