import HealthProfCalendar from "../components/Calendar/HealthProfCalendar"
import HealthProfessionalScheduler from "../components/Scheduler/HealthProfessionalScheduler"
function ViewPage() {

    return (
        <div>
        <h1>This is the view page for new files before configuration.</h1>
        <HealthProfCalendar />
        <HealthProfessionalScheduler />
        </div>
    );
}
export default ViewPage;