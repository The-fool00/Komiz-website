import ComicCard from "@/components/ComicCard";
import UpdateCard from "@/components/UpdateCard";
import SidebarTabs from "@/components/SidebarTabs";
import ComicCarousel from "@/components/ComicCarousel";
import { getComics, Comic } from "@/lib/api";
import Link from "next/link";

export default async function Home() {
  // Fetch real data from API
  let followedComics: Comic[] = [];
  let newComics: Comic[] = [];
  let popularComics: Comic[] = [];
  let latestUpdates: Comic[] = [];
  let completedComics: Comic[] = [];
  let error: string | null = null;

  try {
    const followedRes = await getComics({ page: 1, size: 25, sort_by: "rating" });
    const newRes = await getComics({ page: 1, size: 50, sort_by: "created_at" });
    const popularRes = await getComics({ page: 1, size: 50, sort_by: "view_count" });
    const updatesRes = await getComics({ page: 1, size: 12, sort_by: "updated_at" });
    const completedRes = await getComics({ page: 1, size: 10, status: "completed", sort_by: "updated_at" });

    followedComics = followedRes.items;
    newComics = newRes.items;
    popularComics = popularRes.items;
    latestUpdates = updatesRes.items;
    completedComics = completedRes.items;
  } catch (e) {
    error = "Failed to load comics";
    console.error(e);
  }

  return (
    <div className="container mx-auto px-4 py-6">

      {/* Announcement / Alert */}
      <div className="mb-8 rounded-lg border border-primary/20 bg-primary/5 p-4 text-center text-sm text-zinc-300">
        <p>- This site is new, so it may have bugs, please report to us!</p>
        <p>- Now everyone can import your list from MAL, AL, MU!</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-10">

          {/* Section 1: Followed Comics (Top Rated) */}
          <ComicCarousel title="Followed Comics" comics={followedComics} showRank={false} variant="standard" />

          {/* Section 2: Most Followed New Comics */}
          <ComicCarousel title="Most Followed New Comics" comics={newComics} showRank={true} />

          {/* Section 3: Most Recent Popular */}
          <ComicCarousel title="Most Recent Popular" comics={popularComics} showRank={true} />

          {/* Section 4: Latest Updates */}
          <div>
            <div className="mb-4 flex items-center justify-between border-b border-zinc-800 pb-2">
              <h2 className="text-xl font-bold text-white">Latest Updates</h2>
              <Link href="/browse?sort_by=updated_at" className="text-xs font-bold text-zinc-500 hover:text-white uppercase">View All</Link>
            </div>

            <div className="grid grid-cols-3 gap-x-4 gap-y-8 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
              {latestUpdates.map((comic) => (
                <UpdateCard
                  key={comic.id}
                  title={comic.title}
                  cover={comic.cover_url || "/placeholder.png"}
                  chapter={comic.last_chapter ? `Ch.${comic.last_chapter.chapter_num}` : "-"}
                  time={comic.status} // Ideally this should be 'updated_at' relative time, but using status for now as placeholer or need a format helper
                  slug={comic.slug}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Tabs */}
        <div className="lg:col-span-1">
          <SidebarTabs recent={newComics.slice(0, 10)} completed={completedComics} />
        </div>

      </div>
    </div>
  );
}
