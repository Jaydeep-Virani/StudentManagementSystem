import PropTypes from "prop-types";
import { Navbar } from "./Components/Navbar";
import { Sidebar } from "./Components/Sidebar";
const MasterPage = ({ children }) => {
  return (
    <div className="h-screen flex flex-col bg-white text-black">
      < Navbar />
      <div className="flex flex-1 pt-16">
         < Sidebar />
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-6">{children}</div>
          {/* <footer className="p-4 bg-white text-black">
            <p className="text-center">Footer Content</p>
          </footer> */}
        </div>
      </div>
    </div>
  );
};

MasterPage.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MasterPage;
