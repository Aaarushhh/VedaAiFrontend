import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import MobileTopBar from '@/components/MobileTopBar';
import MobileBottomNav from '@/components/MobileBottomNav';
import CreateAssignmentForm from '@/components/CreateAssignmentForm';

export default function CreatePage() {
  return (
    <>
      <div className="min-h-screen md:hidden">
        <MobileTopBar />
        <main className="px-2 pb-24 pt-2">
          <CreateAssignmentForm />
        </main>
        <MobileBottomNav />
      </div>

      <div className="hidden min-h-screen md:flex">
        <Sidebar />
        <div className="ml-[344px] mr-3 flex min-h-screen flex-1 flex-col">
          <TopBar title="Create Assignment" />
          <main className="flex flex-1 flex-col gap-4 py-4">
            <CreateAssignmentForm />
          </main>
        </div>
      </div>
    </>
  );
}
