import { LuLogOut } from "react-icons/lu";
import { Sidebar } from "@/components/layout/Sidebar";
import { logoutAction } from "@/lib/actions/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="flex w-64 shrink-0 flex-col border-r border-line bg-paper-soft p-4">
        <div className="px-2 py-3">
          <span className="font-semibold text-lg tracking-tight text-ink">
            SILUET
          </span>
          <span className="ml-1.5 text-xs text-ink-soft">admin</span>
        </div>
        <div className="mt-4 flex-1">
          <Sidebar />
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-paper hover:text-ink"
          >
            <LuLogOut size={18} />
            Вийти
          </button>
        </form>
      </aside>
      <main className="flex-1 overflow-x-hidden p-8">{children}</main>
    </div>
  );
}
