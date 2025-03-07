import { Link } from "react-router-dom";
import PropTypes from "prop-types";
export const Simple_Button = ({ linkName,buttonName }) => {
    return (
        <>
            <Link to={ linkName }>
                <button className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:scale-104 hover:bg-blue-700 transition">
                    { buttonName }
                </button>
            </Link>
        </>
    );
} 

// PropTypes for type checking
Simple_Button.propTypes = {
    linkName: PropTypes.string.isRequired,
    buttonName: PropTypes.string.isRequired,
    buttonType: PropTypes.string.isRequired,
};