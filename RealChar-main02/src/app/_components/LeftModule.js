// export default function LeftModule() {
//     return (
//       <div className="bg-gray-100 h-full p-4">
//         <h2 className="text-lg font-semibold mb-4">左边模块</h2>
//         <ul className="space-y-8">
//           <li className="p-2 bg-white rounded shadow hover:bg-gray-200">菜单项 1</li>
//           <li className="p-2 bg-white rounded shadow hover:bg-gray-200">菜单项 2</li>
//           <li className="p-2 bg-white rounded shadow hover:bg-gray-200">菜单项 3</li>
//           <li className="p-2 bg-white rounded shadow hover:bg-gray-200">菜单项 4</li>
//         </ul>
//       </div>
//     );
//   }
  

export default function LeftModule() {
  return (
    <div className="bg-gray-100 h-full p-4">
      <h2 className="text-lg font-semibold mb-4">导航栏</h2>
      <ul className="space-y-8">
        <li className="p-2 bg-white rounded shadow hover:bg-gray-200 cursor-pointer">Home</li>
        <li className="p-2 bg-white rounded shadow hover:bg-gray-200 cursor-pointer">Explore</li>
        <li className="p-2 bg-white rounded shadow hover:bg-gray-200 cursor-pointer">Favorites</li>
        <li className="p-2 bg-white rounded shadow hover:bg-gray-200 cursor-pointer">Settings</li>
      </ul>
    </div>
  );
}


