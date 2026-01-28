import ComicCarousel from "@/components/ComicCarousel";
import { getComics } from "@/lib/api";

export default async function PopularSection() {
    const { items } = await getComics({ page: 1, size: 50, sort_by: "view_count" });
    return <ComicCarousel title="Most Recent Popular" comics={items} showRank={true} />;
}
