import PropTypes from "prop-types";
export const Submit_Button = ({buttonType,buttonName}) => {
    return (
        <>
            <button
              type={buttonType}
              className="w-50 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition"
            >
            {buttonName}
            </button>
        </>
    );
}

Submit_Button.propTypes = {
    buttonType: PropTypes.string.isRequired,
    buttonName: PropTypes.string.isRequired,
};