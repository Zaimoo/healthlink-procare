import NavBar from './navbar'; 
import Students from './components/Students'
import Dashboard from "./components/Dashboard";
import Visits from './components/Visits';
import StudentDetails from './components/StudentDetails';
import { Route, Routes} from "react-router-dom"


import './navbar.css'
import './css/app.css'
function App() {

    return (

        <>
        <NavBar />
            <Routes>
                <Route path="/" element = {<Dashboard />} />
                <Route path="/patients/*" element = {<Students />} />
                <Route path="/admissions" element = {<Visits />} />
                <Route path="/patients/:idNumber" element={<StudentDetails />} />

            </Routes>
        </>
    )
}


export default App