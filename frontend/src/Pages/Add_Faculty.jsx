import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Submit_Button from "../Components/Submit_Button";
const Add_Faculty = () => {
  const navigate = useNavigate();
  const [subjectOptions, setSubjectOptions] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch("http://localhost:8081/get_subjects");
        const data = await response.json();
        setSubjectOptions(data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };
    fetchSubjects();
  }, []);

  const validationSchema = Yup.object({
    firstName: Yup.string().required("Please Enter First Name"),
    lastName: Yup.string().required("Please Enter Last Name"),
    email: Yup.string().email("Invalid Email").required("Please Enter Email"),
    subjects: Yup.array().min(1, "Select At Least One Subject"),
    phoneNo: Yup.string()
      .matches(/^\d{10}$/, "Phone Number Must Be 10 Digits")
      .required("Required"),
    ephoneNo: Yup.string()
      .matches(/^\d{10}$/, "Emergency Phone Must Be 10 Digits")
      .required("Required"),
    dob: Yup.string().required("Enter Date Of Birth"),
    gender: Yup.string().required("Select Gender"),
    address: Yup.string().required("Enter Address"),
    image: Yup.mixed()
      .required("Please select Image")
      .test(
        "fileType",
        "Only PNG, JPG and JPEG files are allowed",
        (value) =>
          value && ["image/png", "image/jpg", "image/jpeg"].includes(value.type)
      ),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      subjects: [],
      phoneNo: "",
      ephoneNo: "",
      dob: "",
      gender: "",
      address: "",
      image: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          if (key === "subjects") {
            formData.append(key, values.subjects.join(","));
          } else {
            formData.append(key, value);
          }
        });

        await axios.post("http://localhost:8081/add-faculty", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        Swal.fire({
          title: "Success!",
          text: "Faculty Added Successfully",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => navigate("/faculty_manage"));
      } catch (error) {
        console.error("❌ Error Adding Faculty:", error);
        Swal.fire({
          title: "Error!",
          text: error.response?.data?.message || "Failed to add faculty",
          icon: "error",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    },
  });
  return (
    <div className="flex justify-center items-center">
      <div className="w-full bg-gray-10 shadow-lg rounded-lg p-6 mt-3">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
          Add New Faculty
        </h2>
        <form className="space-y-4" onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium pb-3">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                {...formik.getFieldProps("firstName")}
                className="w-full px-3 py-2 bg-white border rounded-lg focus:outline-sky-600"
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <span className="text-red-500 text-sm">
                  {formik.errors.firstName}
                </span>
              )}
            </div>
            <div>
              <label className="block text-gray-700 font-medium pb-3">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                {...formik.getFieldProps("lastName")}
                className="w-full px-3 py-2 bg-white border rounded-lg focus:outline-sky-600"
              />
              {formik.touched.lastName && formik.errors.lastName && (
                <span className="text-red-500 text-sm">
                  {formik.errors.lastName}
                </span>
              )}
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-medium pb-3">
              Email
            </label>
            <input
              type="email"
              name="email"
              {...formik.getFieldProps("email")}
              className="w-full px-3 py-2 bg-white border rounded-lg focus:outline-sky-600"
            />
            {formik.touched.email && formik.errors.email && (
              <span className="text-red-500 text-sm">
                {formik.errors.email}
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium pb-3">
                Phone No.
              </label>
              <input
                type="text"
                name="phoneNo"
                {...formik.getFieldProps("phoneNo")}
                className="w-full px-3 py-2 bg-white border rounded-lg focus:outline-sky-600"
              />
              {formik.touched.phoneNo && formik.errors.phoneNo && (
                <span className="text-red-500 text-sm">
                  {formik.errors.phoneNo}
                </span>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium pb-3">
                Emergency Phone No.
              </label>
              <input
                type="text"
                name="ephoneNo"
                {...formik.getFieldProps("ephoneNo")}
                className="w-full px-3 py-2 bg-white border rounded-lg focus:outline-sky-600"
              />
              {formik.touched.ephoneNo && formik.errors.ephoneNo && (
                <span className="text-red-500 text-sm">
                  {formik.errors.ephoneNo}
                </span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium pb-3">
                Date Of Birth
              </label>
              <input
                type="date"
                name="dob"
                {...formik.getFieldProps("dob")}
                className="w-full px-3 py-2 bg-white border rounded-lg focus:outline-sky-600"
              />
              {formik.touched.dob && formik.errors.dob && (
                <span className="text-red-500 text-sm">
                  {formik.errors.dob}
                </span>
              )}
            </div>
            <div>
              <label className="block text-gray-700 font-medium pb-3">
                Address
              </label>
              <input
                type="text"
                name="address"
                {...formik.getFieldProps("address")}
                className="w-full px-3 py-2 bg-white border rounded-lg focus:outline-sky-600"
              />
              {formik.touched.address && formik.errors.address && (
                <span className="text-red-500 text-sm">
                  {formik.errors.address}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium pb-3">
                Gender
              </label>
              <select
                name="gender"
                {...formik.getFieldProps("gender")}
                className="w-full px-3 py-2 bg-white border rounded-lg focus:outline-sky-600"
              >
                <option value="">Choose...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {formik.touched.gender && formik.errors.gender && (
                <span className="text-red-500 text-sm">
                  {formik.errors.gender}
                </span>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium pb-3">
                Subjects
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {subjectOptions.map((subj) => {
                  const subjectId = subj.subject_id.toString(); // Ensure it's a string for comparison
                  return (
                    <div key={subj.subject_id} className="flex items-center">
                      <input
                        type="checkbox"
                        name="subjects"
                        value={subjectId} // Store subject_id as a string
                        onChange={(event) => {
                          const { value } = event.target;
                          const updatedSubjects =
                            formik.values.subjects.includes(value)
                              ? formik.values.subjects.filter(
                                  (s) => s !== value
                                )
                              : [...formik.values.subjects, value];

                          formik.setFieldValue("subjects", updatedSubjects);
                        }}
                        checked={formik.values.subjects.includes(subjectId)} // Compare with converted string
                        className="mr-2"
                      />
                      <span>{subj.subject_name}</span>
                    </div>
                  );
                })}
              </div>

              {formik.touched.subjects && formik.errors.subjects && (
                <span className="text-red-500 text-sm">
                  {formik.errors.subjects}
                </span>
              )}
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-medium pb-3">
              Faculty Image
            </label>
            <input
              type="file"
              name="image"
              className="w-full px-3 py-2 bg-white border rounded-lg focus:outline-sky-600"
              onChange={(event) =>
                formik.setFieldValue("image", event.currentTarget.files[0])
              }
            />
            {formik.touched.image && formik.errors.image && (
              <span className="text-red-500 text-sm">
                {formik.errors.image}
              </span>
            )}
          </div>

          <div className="text-left">
            <Submit_Button buttonType="submit" buttonName="+ Add Faculty" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add_Faculty;
