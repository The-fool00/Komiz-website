import ComicCarousel from "@/components/ComicCarousel";
import { getComics } from "@/lib/api";

export default async function FollowedSection() {
    const { items } = await getComics({ page: 1, size: 25, sort_by: "latest" });
    return <ComicCarousel title="Followed Comics" comics={items} showRank={false} variant="followed" />;
}
