import { Suspense } from "react";
import FollowedSection from "@/components/home/FollowedSection";
import NewComicsSection from "@/components/home/NewComicsSection";
import PopularSection from "@/components/home/PopularSection";
import LatestUpdatesSection from "@/components/home/LatestUpdatesSection";
import SidebarSection from "@/components/home/SidebarSection";
import { CarouselSkeleton, GridSkeleton, SidebarSkeleton } from "@/components/home/Skeletons";

export default function Home() {
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

          {/* Section 1: Followed Comics */}
          <Suspense fallback={<CarouselSkeleton />}>
            <FollowedSection />
          </Suspense>

          {/* Section 2: Most Followed New Comics */}
          <Suspense fallback={<CarouselSkeleton />}>
            <NewComicsSection />
          </Suspense>

          {/* Section 3: Most Recent Popular */}
          <Suspense fallback={<CarouselSkeleton />}>
            <PopularSection />
          </Suspense>

          {/* Section 4: Latest Updates */}
          <Suspense fallback={<GridSkeleton />}>
            <LatestUpdatesSection />
          </Suspense>
        </div>

        {/* Sidebar: Tabs */}
        <div className="lg:col-span-1">
          <Suspense fallback={<SidebarSkeleton />}>
            <SidebarSection />
          </Suspense>
        </div>

      </div>
    </div>
  );
}
