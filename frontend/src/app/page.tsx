// src/app/page.tsx
import Dashboard from "./components/Dashboard";

export default function Home() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">ダッシュボード</h2>
      <Dashboard />
    </div>
  );
}
