import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";
import Submit_Button from "../Components/Submit_Button";

const Add_Holiday = () => {
  const navigate = useNavigate();

  // Yup validation schema
  const validationSchema = Yup.object({
    holidayName: Yup.string().required("Please Enter Holiday Name"),
    date: Yup.string().required("Please Enter Date"),
  });

  // Formik form handling
  const formik = useFormik({
    initialValues: {
      holidayName: "",
      date: "",
    },
    validationSchema,
    onSubmit: (values) => {
      const dateObj = new Date(values.date);
      const month = dateObj.getMonth() + 1; // JS months are 0-based
      const dayIndex = dateObj.getDay();
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const day = days[dayIndex];

    
      const payload = {
        holidayName: values.holidayName,
        date: values.date,
        month,
        day,
      };
    
      fetch("http://localhost:8081/add-holiday", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            Swal.fire({
              title: "Success!",
              text: "Add New Holiday Successfully",
              icon: "success",
              timer: 1000,
              showConfirmButton: true,
              timerProgressBar: true,
            });
    
            setTimeout(() => {
              navigate("/holiday");
            }, 2000);
          } else {
            Swal.fire("Error", data.message || "Failed to add holiday", "error");
          }
        });
    },    
  });

  return (
    <>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Holiday</h2>
          <form onSubmit={formik.handleSubmit}>
            {/* Holiday Name */}
            <div className="mb-4">
              <label htmlFor="holidayName" className="block text-sm font-medium text-gray-700">Holiday Name</label>
              <input
                type="text"
                name="holidayName"
                id="holidayName"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...formik.getFieldProps("holidayName")}
              />
              {formik.touched.holidayName && formik.errors.holidayName && (
                <span className="text-red-500 text-sm">{formik.errors.holidayName}</span>
              )}
            </div>

            {/* Date */}
            <div className="mb-4">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                name="date"
                id="date"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...formik.getFieldProps("date")}
              />
              {formik.touched.date && formik.errors.date && (
                <span className="text-red-500 text-sm">{formik.errors.date}</span>
              )}
            </div>
            {/* Submit Button */}
            <div className="mb-4">
              <Submit_Button buttonType="submit" buttonName="+ Add Holiday" />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Add_Holiday;