import Drivers from "./components/Driver";
import NavigationBar from "./components/Navigation";
import Order from "./components/Order";
import Vechile from "./components/Vechile";

function App() {
  return (
    <>
      <NavigationBar />
      <div>
        <Drivers />
        <Order />
        <Vechile/>
      </div>
    </>
  );
}

export default App;
