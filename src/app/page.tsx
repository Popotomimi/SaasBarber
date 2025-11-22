import Banner from "@/components/banner/banner";
import Carousel from "@/components/carousel/carousel";
import FormSchedule from "@/components/form-schedule/form-schedule";
import Map from "@/components/map/map";
import SearchAppointment from "@/components/search-appointment/search-appointment";

export default function Home() {
  return (
    <div>
      <Banner />
      <FormSchedule />
      <SearchAppointment />
      <Carousel />
      <Map />
    </div>
  );
}
