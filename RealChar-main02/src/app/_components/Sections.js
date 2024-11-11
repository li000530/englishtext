'use client';
import { useState } from 'react';
import TabButton from '@/components/TabButton';
import SceneTab from './SectionsTab';

export default function Sections() {
  const [tabNow, setTabNow] = useState('recommend'); // 默认显示第一个标签

  const tabs = [
    { key: 'recommend', label: '热门推荐' },
    { key: 'daily', label: '日常生活' },
    { key: 'work', label: '职场沟通' },
    { key: 'travel', label: '旅行出行' },
    { key: 'exam', label: '考试面试' },
    { key: 'school', label: '校园生活' }
  ];

  return (
    <>
      <div className='flex flex-row justify-center mt-10'>
        <div className='w-[600px] grid grid-cols-6 gap-3 border-2 rounded-full p-2 border-tab bg-white'>
          {tabs.map((tab) => (
            <TabButton
              key={tab.key}
              isSelected={tabNow === tab.key}
              handlePress={() => setTabNow(tab.key)}
              className='text-black'
            >
              {tab.label}
            </TabButton>
          ))}
        </div>
      </div>
      <SceneTab tabNow={tabNow} />
    </>
  );
}
