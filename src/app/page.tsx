import Banner from "@/components/banner/banner";
import FormSchedule from "@/components/form-schedule/form-schedule";
import Map from "@/components/map/map";
import PublicAgenda from "@/components/public-agenda/public-agenda";

export default function Home() {
  return (
    <div>
      <Banner />
      <FormSchedule />
      <PublicAgenda />
      <Map />
    </div>
  );
}
