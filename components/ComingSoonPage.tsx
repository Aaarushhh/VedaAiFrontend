import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import MobileTopBar from '@/components/MobileTopBar';
import MobileBottomNav from '@/components/MobileBottomNav';

interface Props {
  title: string;
}

export default function ComingSoonPage({ title }: Props) {
  return (
    <>
      <div className="min-h-screen md:hidden">
        <MobileTopBar />
        <main className="flex min-h-[70vh] items-center justify-center px-4 pb-24 pt-4">
          <p className="text-sm text-zinc-500">{title} — coming soon.</p>
        </main>
        <MobileBottomNav />
      </div>

      <div className="hidden min-h-screen md:flex">
        <Sidebar />
        <div className="ml-[344px] mr-3 flex min-h-screen flex-1 flex-col">
          <TopBar title={title} />
          <main className="flex flex-1 items-center justify-center">
            <p className="text-zinc-500">{title} — coming soon.</p>
          </main>
        </div>
      </div>
    </>
  );
}
