import Banner from "@/components/banner/banner";
import Carousel from "@/components/carousel/carousel";
import FormSchedule from "@/components/form-schedule/form-schedule";
import Map from "@/components/map/map";

export default function Home() {
  return (
    <div>
      <Banner />
      <FormSchedule />
      <Carousel />
      <Map />
    </div>
  );
}
