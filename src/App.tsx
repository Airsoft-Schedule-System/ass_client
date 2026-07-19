// 모바일 화면 너비를 제한하는 앱 최상위 레이아웃

function App() {
  return (
    <div className="mx-auto grid min-h-dvh w-full max-w-[480px] grid-rows-[minmax(0,1fr)] bg-white">
      <main className="min-w-0" />
    </div>
  );
}

export default App;
