'use client';

import { Form } from '@lobehub/ui';
import { Button, Skeleton, message, Input, App } from 'antd';
import { createStyles } from 'antd-style';
import { memo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';
import { DeleteOutlined } from '@ant-design/icons';

import { FORM_STYLE } from '@/const/layoutTokens';

import { useStore } from '../store';

const { TextArea } = Input;

export const useStyles = createStyles(({ css, token, responsive }) => ({
  container: css`
    position: relative;
    width: 100%;
    border-radius: ${token.borderRadiusLG}px;
    background: ${token.colorFillSecondary};
  `,
  content: css`
    z-index: 2;
    padding: 8px;
    border-radius: ${token.borderRadiusLG - 1}px;
    background: ${token.colorBgContainer};
  `,
  markdown: css`
    border: unset;
  `,
  wrapper: css`
    width: 100%;
    ${responsive.mobile} {
      padding-block: 8px;
      padding-inline: 4px;
    }
  `,
  addButton: css`
    margin-top: 12px;
  `,
  messageItem: css`
    position: relative;
    padding: 12px;
    border: 1px solid ${token.colorBorderSecondary};
    border-radius: ${token.borderRadiusLG}px;
    transition: all 0.2s ease-in-out;
    display: flex;
    gap: 8px;
    align-items: flex-start;
    &:hover {
      border-color: ${token.colorBorderSecondary};
      box-shadow: none;
    }
  `,
}));

const AgentRoleFirstMsg = memo<{ modal?: boolean }>(({ modal: isModal }) => {
  const { modal } = App.useApp();
  const { t } = useTranslation(['setting', 'common']);
  const { styles } = useStyles();
  const [isEditing, setIsEditing] = useState(false);
  const [draftMessages, setDraftMessages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, roleFirstMsgs, updateConfig] = useStore((s) => [
    s.loading,
    s.config.roleFirstMsgs,
    s.setAgentConfig,
  ]);

  useEffect(() => {
    setDraftMessages(roleFirstMsgs);
  }, [roleFirstMsgs]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateConfig({ roleFirstMsgs: draftMessages });
      message.success(t('settingAgent.roleFirstMsgs.saveSuccess'));
      setIsEditing(false);
    } catch {
      message.error(t('settingAgent.roleFirstMsgs.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  const headerActions = (
    <Flexbox gap={8} horizontal>
      {isEditing ? (
        <>
          <Button
            onClick={() => {
              if (JSON.stringify(draftMessages) !== JSON.stringify(roleFirstMsgs)) {
                modal.confirm({
                  centered: true,
                  okButtonProps: { danger: true },
                  onOk: async () => {
                    setDraftMessages([...roleFirstMsgs]);
                    setIsEditing(false);
                  },
                  title: t('settingAgent.roleFirstMsgs.closeConfirm'),
                  type: 'error',
                });
              } else {
                setIsEditing(false);
              }
            }}
            size="small"
          >
            {t('cancel', { ns: 'common' })}
          </Button>
          <Button
            loading={saving}
            onClick={handleSave}
            size="small"
            type="primary"
          >
            {t('settingAgent.roleFirstMsgs.save')}
          </Button>
        </>
      ) : (
        <Button
          onClick={() => setIsEditing(true)}
          size="small"
          type="primary"
        >
          {t('edit', { ns: 'common' })}
        </Button>
      )}
    </Flexbox>
  );

  const content = (
    <Flexbox gap={16} style={{ width: '100%' }}>
      {draftMessages.map((message, index) => (
        <Flexbox key={index} align="center" className={styles.messageItem} gap={8} horizontal>
          <TextArea
            autoSize
            onChange={(e) => {
              const newMessages = [...draftMessages];
              newMessages[index] = e.target.value;
              setDraftMessages(newMessages);
            }}
            placeholder={t('settingAgent.roleFirstMsgs.placeholder')}
            readOnly={!isEditing}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              boxShadow: 'none',
              padding: 0,
              whiteSpace: 'pre-wrap',
            }}
            value={message}
            variant="borderless"
          />
          {isEditing && (
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                const newMessages = draftMessages.filter((_, i) => i !== index);
                setDraftMessages(newMessages);
              }}
              size="small"
              style={{
                flexShrink: 0,
                height: 20,
                marginLeft: 8,
                padding: 0,
                width: 20,
                ':hover': {
                  backgroundColor: 'transparent !important',
                },
              }}
              type="text"
            />
          )}
        </Flexbox>
      ))}
      {isEditing && (
        <Button block onClick={() => setDraftMessages([...draftMessages, ''])} type="dashed">
          {t('settingAgent.roleFirstMsgs.addNew')}
        </Button>
      )}
    </Flexbox>
  );

  if (loading) {
    if (isModal)
      return (
        <Form
          items={[
            {
              children: (
                <>
                  <div style={{ height: 24 }} />
                  <Skeleton active title={false} />
                </>
              ),
              title: t('settingAgent.roleFirstMsgs.title'),
            },
          ]}
          itemsType={'group'}
          variant={'pure'}
          {...FORM_STYLE}
        />
      );

    return (
      <div className={styles.wrapper}>
        <Flexbox className={styles.container} padding={4}>
          <Flexbox horizontal justify={'space-between'} paddingBlock={8} paddingInline={12}>
            <h1 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 4 }}>
              {t('settingAgent.roleFirstMsgs.title')}
            </h1>
          </Flexbox>
          <Flexbox
            align={'center'}
            className={styles.content}
            flex={1}
            gap={16}
            horizontal
            justify={'space-between'}
            padding={12}
            wrap={'wrap'}
          >
            <Skeleton active style={{ paddingTop: 12 }} title={false} />
          </Flexbox>
        </Flexbox>
      </div>
    );
  }

  if (isModal)
    return (
      <Form
        items={[
          {
            children: (
              <>
                <div style={{ height: 24 }} />
                {content}
              </>
            ),
            title: t('settingAgent.roleFirstMsgs.title'),
          },
        ]}
        itemsType={'group'}
        variant={'pure'}
        {...FORM_STYLE}
      />
    );

  return (
    <div className={styles.wrapper}>
      <Flexbox className={styles.container} padding={4}>
        <Flexbox horizontal justify={'space-between'} paddingBlock={8} paddingInline={12}>
          <h1 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 4 }}>
            {t('settingAgent.roleFirstMsgs.title')}
          </h1>
          {headerActions}
        </Flexbox>
        <Flexbox
          align={'center'}
          className={styles.content}
          flex={1}
          gap={16}
          horizontal
          justify={'space-between'}
          padding={12}
          wrap={'wrap'}
        >
          {content}
        </Flexbox>
      </Flexbox>
    </div>
  );
});

export default AgentRoleFirstMsg;
