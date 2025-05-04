import CommonRoute from "@/app/[locale]/home/CommonRoute";
import Feature from "@/app/[locale]/home/Feature";
import Honor from "@/app/[locale]/home/Honor";
import SearchTrip from "@/components/common/SearchTrip";

export default function Home() {
  return (
    <div>
      <SearchTrip />
      <div className="mt-160 layout">
        <Feature />
      </div>
      <div className="bg-[#FFF7F5] my-5">
        <CommonRoute />
      </div>
      <div className="my-20 layout">
        <Honor />
      </div>
    </div>
  );
}
