


// export default function SectionsTab({ tabNow }) {
//   const scenes = {
//     recommend: ['机票预定', '酒店预订', '餐订点餐', '工作面试', '地铁', '超市购物'],
//     daily: ['预约医生', '天气预报', '药店买药', '交通事故', '健康饮食', '购物结账','银行业务','修理家电','邻里交往','社区活动'],
//     work: ['每周例会', '团建活动', '工作汇报', '会议安排', '放假申请', '自我介绍'],
//     travel: ['办理登记', '景点观光', '邀约旅行', '预定酒店', '出行问路', '旅行社'],
//     exam: ['工作面试', '招生面试', '学术面试', '雅思模考'],
//     school: ['学校社团', '教材购买', '校园食堂', '校园兼职', '校园参观']
//   };

//   return (
//     <div className="relative mt-6 p-4 border rounded-lg">
//       {/* 可滑动内容区域 */}
//       <div className="flex overflow-x-auto scroll-snap-x mandatory">
//         {scenes[tabNow].map((scene, index) => (
//           <div key={index} className="min-w-max px-4 py-2 mx-2 bg-gray-100 rounded-lg scroll-snap-align-start">
//             {scene}
//           </div>
//         ))}
//       </div>
//       {/* 向右滑动的箭头 */}
//       <button
//         className="absolute top-1/2 right-2 transform -translate-y-1/2 p-2 bg-blue-500 text-white rounded-full shadow-lg"
//         onClick={() => {
//           const container = document.querySelector('.overflow-x-auto');
//           container.scrollBy({ left: 200, behavior: 'smooth' });
//         }}
//       >
//         →
//       </button>
//     </div>
//   );
// }


// sectiontab.js
export default function SectionsTab({ tabNow }) {
  const scenes = {
    recommend: ['机票预定', '酒店预订', '餐订点餐', '工作面试', '地铁', '超市购物'],
    daily: ['预约医生', '天气预报', '药店买药', '交通事故', '健康饮食', '购物结账', '银行业务', '修理家电', '邻里交往', '社区活动'],
    work: ['每周例会', '团建活动', '工作汇报', '会议安排', '放假申请', '自我介绍'],
    travel: ['办理登记', '景点观光', '邀约旅行', '预定酒店', '出行问路', '旅行社'],
    exam: ['工作面试', '招生面试', '学术面试', '雅思模考'],
    school: ['学校社团', '教材购买', '校园食堂', '校园兼职', '校园参观']
  };

  return (
    <div className="relative mt-6 p-4 border rounded-lg bg-white">
      {/* 可滑动内容区域 */}
      <div className="flex overflow-x-auto scroll-snap-x mandatory">
        {scenes[tabNow].map((scene, index) => (
          <div key={index} className="min-w-max px-4 py-2 mx-2 bg-white rounded-lg scroll-snap-align-start">
            {scene}
          </div>
        ))}
      </div>
      {/* 向右滑动的箭头 */}
      <button
        className="absolute top-1/2 right-2 transform -translate-y-1/2 p-2 bg-blue-500 text-white rounded-full shadow-lg"
        onClick={() => {
          const container = document.querySelector('.overflow-x-auto');
          container.scrollBy({ left: 200, behavior: 'smooth' });
        }}
      >
        →
      </button>
    </div>
  );
}






