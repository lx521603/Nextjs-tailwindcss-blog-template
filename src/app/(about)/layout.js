import InsightRoll from "@/src/components/About/InsightRoll";


const insights = [
    "测试滚动条",
    "1 条信息",
    "2 条信息",
    "3 条信息",
    "4 条信息",
    "5 条信息📝",
    "6 条信息🏆",
  ];

export default function AboutLayout({ children }) {
  return (
    <main className="w-full flex flex-col items-center justify-between">
      <InsightRoll insights={insights} />
      {children}
    </main>
  );
}
