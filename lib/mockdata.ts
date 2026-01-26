export interface Chapter {
    id: string;
    chapter_num: number;
    title: string;
    updated_at: string;
    group_name: string;
}

const groups = ["Asura Scans", "Reaper Scans", "Flame Scans", "Official"];

export const mockChapters: Chapter[] = [];

// Generate mock data with duplicates
for (let i = 0; i < 50; i++) {
    const chapterNum = 50 - i;

    // Add primary source
    mockChapters.push({
        id: `ch-${chapterNum}-1`,
        chapter_num: chapterNum,
        title: `Chapter ${chapterNum}`,
        updated_at: new Date(Date.now() - i * 86400000).toISOString(),
        group_name: "Asura Scans"
    });

    // Randomly add a duplicate source for some chapters
    if (Math.random() > 0.7) {
        mockChapters.push({
            id: `ch-${chapterNum}-2`,
            chapter_num: chapterNum,
            title: `Chapter ${chapterNum}`,
            updated_at: new Date(Date.now() - i * 86400000 - 3600000).toISOString(), // slightly older
            group_name: "Reaper Scans"
        });
    }
}

