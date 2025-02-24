'use client';

import Link from 'next/link';
import qs from 'query-string';
import { memo } from 'react';
import { useSearchParams } from 'next/navigation';

import { useQueryRoute } from '@/hooks/useQueryRoute';
import { AssistantCategory } from '@/types/discover';

import CategoryMenu from '../../components/CategoryMenu';
import { useNav } from '../../features/useNav';

const Category = memo(() => {
  const searchParams = useSearchParams();
  const q = searchParams.get('q');
  const type = searchParams.get('type');

  const router = useQueryRoute();
  const { items, activeKey } = useNav();

  return (
    <CategoryMenu
      items={items
        // .filter((item) => item?.key !== DiscoverTab.Home)
        .map((item: any) => ({
          ...item,
          label: (
            <Link
              href={qs.stringifyUrl({
                query: { category: item.key === AssistantCategory.All?'':item.key, q, type },
                url: '/discover/search',
              })}
            >
              {item.label}
            </Link>
          ),
        }))}
      onSelect={({ key }) => router.push('/discover/search', { query: { category: key === AssistantCategory.All?'':key, q, type } })}
      selectedKeys={[activeKey]}
    />
  );
});

export default Category;

