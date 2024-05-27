import { getPopularTvShows } from "@/lib/apis/movieApi";
import TvCard from "./tvCard";

const PopularTvShows = async () => {
    const tvShows = await getPopularTvShows();

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {tvShows.map((tvShow) => (
                    <TvCard key={tvShow.id} tv={tvShow} />
                ))}
            </div>
        </div>
    );
};

export default PopularTvShows;



