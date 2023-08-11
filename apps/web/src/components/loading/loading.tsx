export const EdgeLoading = () => (
  <div className="w-12 h-12 rounded-full animate-spin border-y-2 border-dashed border-blue-500 border-t-transparent"></div>
);

export const FullScreenLoading = () => (
  <div className="w-full h-screen grid items-center justify-center">
    <div className="flex items-center justify-center space-x-2">
      <div className="w-4 h-4 rounded-full animate-pulse dark:bg-violet-400"></div>
      <div className="w-4 h-4 rounded-full animate-pulse dark:bg-violet-400"></div>
      <div className="w-4 h-4 rounded-full animate-pulse dark:bg-violet-400"></div>
    </div>
  </div>
);
