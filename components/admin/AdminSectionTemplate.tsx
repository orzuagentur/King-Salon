import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminPlaceholder } from "@/components/admin/AdminPlaceholder";
import { requireAdmin } from "@/lib/auth/admin";
import { getAdminPageConfig } from "@/lib/admin/page-config";

type AdminSectionTemplateProps = {
  pathname: string;
};

export async function AdminSectionTemplate({ pathname }: AdminSectionTemplateProps) {
  const { admin } = await requireAdmin();
  const config = getAdminPageConfig(pathname);

  return (
    <div className="space-y-8">
      <AdminHeader
        description={config.description}
        email={admin.email}
        role={admin.role === "admin" ? "Administrator" : "Editor"}
        title={config.title}
      />
      <AdminPlaceholder message={config.placeholderMessage} title={config.placeholderTitle} />
    </div>
  );
}
