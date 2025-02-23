create table if not exists public.assistant
(
  id                serial
  primary key,
  identifier        varchar(32)                                   not null,
  author_name       varchar(32),
  author_uid        text                                          not null,
  author_avatar     varchar(512),
  category          varchar(32)                                   not null,
  tags              jsonb       default '[]'::jsonb               not null,
  display_mode      varchar(16) default 'chat'::character varying not null,
  model             varchar(64),
  frequency_penalty integer,
  presence_penalty  integer,
  temperature       integer,
  top_p             integer,
  input_template    varchar(1024)                                 not null,
  avatar            varchar(512)                                  not null,
  title             varchar(128)                                  not null,
  description       varchar(1024)                                 not null,
  system_role       varchar(4096)                                 not null,
  role_first_msgs   jsonb       default '[]'::jsonb               not null,
  created_at        timestamp   default CURRENT_TIMESTAMP,
  updated_at        timestamp   default CURRENT_TIMESTAMP,
  accessed_at       timestamp   default CURRENT_TIMESTAMP
  );

comment on column public.assistant.id is '自增ID';

comment on column public.assistant.identifier is '标识符';

comment on column public.assistant.author_name is '作者名称';

comment on column public.assistant.author_uid is '作者UID';

comment on column public.assistant.author_avatar is '作者头像';

comment on column public.assistant.category is '分类';

comment on column public.assistant.tags is '标签';

comment on column public.assistant.display_mode is '显示模式 chat or docs';

comment on column public.assistant.model is '建议模型';

comment on column public.assistant.frequency_penalty is '频率惩罚';

comment on column public.assistant.presence_penalty is '存在惩罚';

comment on column public.assistant.temperature is '温度';

comment on column public.assistant.top_p is '顶部P';

comment on column public.assistant.input_template is '输入模板';

comment on column public.assistant.avatar is '头像';

comment on column public.assistant.title is '标题';

comment on column public.assistant.description is '描述';

comment on column public.assistant.system_role is '系统角色';

comment on column public.assistant.role_first_msgs is '角色初始消息';

comment on column public.assistant.created_at is '创建时间';

comment on column public.assistant.updated_at is '更新时间';

comment on column public.assistant.accessed_at is '访问时间';

alter table public.assistant
  owner to neondb_owner;

