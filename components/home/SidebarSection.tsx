import SidebarTabs from "@/components/SidebarTabs";
import { getComics } from "@/lib/api";

export default async function SidebarSection() {
    // Fetch both concurrently
    const [newRes, completedRes] = await Promise.all([
        getComics({ page: 1, size: 10, sort_by: "created_at" }),
        getComics({ page: 1, size: 10, status: "completed", sort_by: "updated_at" })
    ]);

    return <SidebarTabs recent={newRes.items} completed={completedRes.items} />;
}
