import ComicCarousel from "@/components/ComicCarousel";
import { getComics } from "@/lib/api";

export default async function NewComicsSection() {
    const { items } = await getComics({ page: 1, size: 50, sort_by: "created_at" });
    return <ComicCarousel title="Most Followed New Comics" comics={items} showRank={true} />;
}
