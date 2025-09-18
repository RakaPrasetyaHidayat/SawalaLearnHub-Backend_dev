import AdminGuard from "@/components/client/AdminGuard";
import AdminNavigationBottom from "@/components/molecules/navigation-bottom/navigationbottom-admin";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="justify-center items-center flex w-full relative">
        <div className="justify-center items-center flex h-full relative border-2 w-[350px] max-[340px]:w-full">
          <div className="w-full h-full relative pb-16 ">
            {children}
            <AdminNavigationBottom />
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
