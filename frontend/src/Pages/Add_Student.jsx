import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Submit_Button from "../Components/Submit_Button";
const Add_Student = () => {
  const navigate = useNavigate();
  const [classOptions, setClassOptions] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch("http://localhost:8081/get_classes");
        const data = await response.json();
        setClassOptions(data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };
    fetchClasses();
  }, []);

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .matches(/^[A-Za-z]+$/, "First name should contain only alphabets")
      .required("Please Enter First Name"),
    lastName: Yup.string()
      .matches(/^[A-Za-z]+$/, "Last name should contain only alphabets")
      .required("Please Enter Last Name"),
    email: Yup.string()
      .email("Please Enter A Valid Email address")
      .required("Please Enter Email"),
    class: Yup.string().required("Please Select Class"),
    phoneNo: Yup.string()
      .matches(/^\d+$/, "Only Numbers Are Allowed")
      .length(10, "Phone Number Must Be 10 Digits")
      .required("Phone Number Is Required"),
    ephoneNo: Yup.string()
      .matches(/^\d+$/, "Only Numbers Are Allowed")
      .length(10, "Phone Number Must Be 10 Digits")
      .required("Emergency Phone Number Is Required"),
    dob: Yup.string().required("Please Enter Date Of Birth"),
    gender: Yup.string().required("Please Select Gender"),
    address: Yup.string().required("Please Enter Address"),
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
      phoneNo: "",
      ephoneNo: "",
      dob: "",
      address: "",
      gender: "",
      class: "",
      image: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("firstName", values.firstName);
        formData.append("lastName", values.lastName);
        formData.append("email", values.email);
        formData.append("phoneNo", values.phoneNo);
        formData.append("ephoneNo", values.ephoneNo);
        formData.append("dob", values.dob);
        formData.append("address", values.address);
        formData.append("gender", values.gender);
        formData.append("class", values.class);
        formData.append("image", values.image); // Append file

        await axios.post("http://localhost:8081/add-student", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        Swal.fire({
          title: "Success!",
          text: "New student successfully added",
          icon: "success",
          timer: 1000,
          showConfirmButton: true,
          timerProgressBar: true,
        }).then(() => {
          formik.resetForm();
          navigate("/student_manage");
        });
      } catch (error) {
        console.error("Error adding student:", error);

        // ✅ If email already exists, show an error
        if (error.response && error.response.status === 400) {
          Swal.fire({
            toast: true,
            position: "top",
            icon: "warning",
            title: "Duplicate Email!",
            text: "This email is already registered. Please use a different email.",
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
          });
        } else {
          Swal.fire({
            title: "Error!",
            text: "Failed to add student",
            icon: "error",
            timer: 1000,
            showConfirmButton: true,
          });
        }
      }
    },
  });

  return (
    <div className="flex justify-center items-center ">
      <div className="w-full bg-gray-10 shadow-lg rounded-lg p-6 mt-3">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
          Add New Student
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
                Class
              </label>
              <select
                name="class"
                {...formik.getFieldProps("class")}
                className="w-full px-3 py-2 bg-white border rounded-lg focus:outline-sky-600"
              >
                <option value="">Choose...</option>
                {classOptions.length === 0 ? (
                  <option disabled>Loading...{classOptions.length}</option>
                ) : (
                  classOptions.map((cls) => (
                    <option key={cls.class_id} value={cls.class_id}>
                      {cls.class_name}
                    </option>
                  ))
                )}
              </select>
              {formik.touched.class && formik.errors.class && (
                <span className="text-red-500 text-sm">
                  {formik.errors.class}
                </span>
              )}
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-medium pb-3">
              Student Image
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
            <Submit_Button buttonType="submit" buttonName="+ Add Student" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add_Student;
