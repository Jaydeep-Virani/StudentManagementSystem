const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json()); // ✅ To parse JSON data

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "edusphere",
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "#", // Replace with your email
    pass: "#", // Use App Password if 2FA is enabled
  },
});

const student_storage = multer.diskStorage({
  destination: path.join(__dirname, "../frontend/public/StudentImage"),
  filename: (req, file, cb) => {
    const studentName = req.body.firstName + "_" + req.body.lastName;
    const uniqueSuffix = Date.now();
    cb(
      null,
      studentName + "_" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});
const faculty_storage = multer.diskStorage({
  destination: path.join(__dirname, "../frontend/public/FacultyImage"),
  filename: (req, file, cb) => {
    const studentName = req.body.firstName + "_" + req.body.lastName;
    const uniqueSuffix = Date.now();
    cb(
      null,
      studentName + "_" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});
const student_upload = multer({ storage: student_storage });
const faculty_upload = multer({ storage: faculty_storage });



// ✅ Get all classes
app.get("/get_classes", (req, res) => {
  const sql = "SELECT * FROM class_master";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    return res.json(result);
  });
});

// ✅ Add a new class
app.post("/add_class", (req, res) => {
  const { className } = req.body;
  const sql = "INSERT INTO class_master (class_name) VALUES (?)";
  db.query(sql, [className], (err, result) => {
    if (err) return res.status(500).json(err);
    return res.json({ message: "Class added successfully" });
  });
});

// ✅ Update a class
app.put("/update_class/:id", (req, res) => {
  const { className } = req.body; // ✅ Ensure correct variable name
  const { id } = req.params;

  const sql = "UPDATE class_master SET class_name = ? WHERE class_id = ?"; // ✅ Use correct column name
  db.query(sql, [className, id], (err, result) => {
    if (err)
      return res.status(500).json({ error: "Database error", details: err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Class not found" }); // ✅ Handle non-existing ID
    }

    return res.json({ message: "Class updated successfully" });
  });
});

// ✅ Delete a class
app.delete("/delete_class/:id", (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Class ID is required" }); // ✅ Handle missing ID
  }

  const sql = "DELETE FROM class_master WHERE Class_id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting class:", err); // ✅ Log error in the backend
      return res.status(500).json({ error: "Failed to delete class" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Class not found" }); // ✅ Handle non-existing class
    }

    return res.json({ message: "Class deleted successfully" });
  });
});

app.get("/get_subjects", (req, res) => {
  const sql = "SELECT * FROM subject_master";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    return res.json(result);
  });
});

// ✅ Add a new subject
app.post("/add_subject", (req, res) => {
  const { subjectName } = req.body;
  const sql = "INSERT INTO subject_master (subject_name) VALUES (?)";
  db.query(sql, [subjectName], (err, result) => {
    if (err) return res.status(500).json(err);
    return res.json({ message: "Subject added successfully" });
  });
});

// ✅ Update a subject
app.put("/update_subject/:id", (req, res) => {
  const { subjectName } = req.body;
  const { id } = req.params;

  const sql = "UPDATE subject_master SET subject_name = ? WHERE subject_id = ?";
  db.query(sql, [subjectName, id], (err, result) => {
    if (err)
      return res.status(500).json({ error: "Database error", details: err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Subject not found" });
    }

    return res.json({ message: "Subject updated successfully" });
  });
});

// ✅ Delete a subject
app.delete("/delete_subject/:id", (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Subject ID is required" });
  }

  const sql = "DELETE FROM subject_master WHERE subject_id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting subject:", err);
      return res.status(500).json({ error: "Failed to delete subject" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Subject not found" });
    }

    return res.json({ message: "Subject deleted successfully" });
  });
});

// Add New Student
app.post("/add-student", student_upload.single("image"), async (req, res) => {
  try {
    console.log("Body Data:", req.body);
    console.log("File Data:", req.file);

    const {
      firstName,
      lastName,
      email,
      phoneNo,
      ephoneNo,
      dob,
      address,
      gender,
      class: studentClass,
    } = req.body;
    const image = req.file ? req.file.filename : null;
    if (!image) return res.status(400).json({ message: "Image upload failed" });

    const admission_date = new Date().toISOString().slice(0, 10);
    const userName = email.split("@")[0];
    const password = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(password, salt);
    const role = "4";
    const fullName = `${firstName} ${lastName}`;

    // ✅ Step 1: Check if email already exists
    const checkEmailSQL =
      "SELECT COUNT(*) AS count FROM users WHERE username = ?";
    db.query(checkEmailSQL, [userName], (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ error: "Database error while checking email" });

      if (result[0].count > 0) {
        return res.status(400).json({
          message: "Email already exists. Please use a different email.",
        });
      }

      // ✅ Step 2: Insert user into users table
      const user_sql =
        "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";
      const user_values = [userName, hash_password, role];

      db.query(user_sql, user_values, (err, userResult) => {
        if (err) return res.status(500).json({ error: err.message });

        const user_id = userResult.insertId; // ✅ Fetching user_id correctly
        console.log("✅ New user ID:", user_id);

        // ✅ Step 3: Insert student into student_master table
        const student_sql = `INSERT INTO student_master 
                  (uid, firstname, lastname, email, pnumber, emrnumber, dob, gender, address, classid, image, admissiondate ) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const student_values = [
          user_id,
          firstName,
          lastName,
          email,
          phoneNo,
          ephoneNo,
          dob,
          gender,
          address,
          studentClass,
          image,
          admission_date,
        ];

        db.query(student_sql, student_values, (err, studentResult) => {
          if (err)
            return res
              .status(500)
              .json({ message: "Database error", error: err.message });

          // ✅ Send email after student record is inserted
          const mailOptions = {
            from: '"Edusphere Team" <support@edusphere.com>',
            to: email,
            subject: `🎓 Welcome to Edusphere, ${fullName}!`,
            html: `
                <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; padding: 40px; background: linear-gradient(to bottom, #2c3e50, #1c2833); color: #fff; border-radius: 10px; text-align: center;">
                    
                    <!-- Header -->
                    <h1 style="margin-bottom: 10px; font-size: 28px;">🚀 Welcome to <span style="color: #f39c12;">Edusphere</span>!</h1>
                    <p style="font-size: 16px; color: #ddd;">Hello <strong>${fullName}</strong>, we’re thrilled to have you with us!</p>
        
                    <!-- Content Box -->
                    <div style="background: rgba(255, 255, 255, 0.15); padding: 25px; border-radius: 10px; backdrop-filter: blur(10px); box-shadow: 0 4px 8px rgba(255, 255, 255, 0.2); margin-top: 20px;">
                        <h3 style="color: #f1c40f;">🔑 Your Login Credentials</h3>
                        <p><strong>👤 Username:</strong> <span style="color: #f1c40f;">${userName}</span></p>
                        <p><strong>🔐 Password:</strong> <span style="color: #e74c3c;">${password}</span></p>
                        <p style="font-size: 14px; color: #e74c3c;"><strong>⚠️ Keep your credentials safe and do not share them.</strong></p>
                        
                        <!-- Login Button with Hover Effect -->
                        <div style="margin-top: 20px;">
                            <a href="http://localhost:5173/" target="_blank"
                               style="background: #3498db; color: #fff; padding: 12px 24px; font-size: 18px; font-weight: bold; border-radius: 5px; text-decoration: none; display: inline-block; box-shadow: 0 2px 5px rgba(255, 255, 255, 0.3);
                               transition: background 0.3s ease-in-out;">
                                🔓 Login to Your Account
                            </a>
                        </div>
                        <style>
                            a:hover {
                                background: #2980b9 !important;
                            }
                        </style>
                    </div>
        
                    <!-- Learning Journey Section -->
                    <div style="margin-top: 20px; text-align: center;">
                        <h2 style="color: #f1c40f;">📖 Your Learning Journey Begins!</h2>
                        <p style="font-size: 16px; color: #ddd;">
                            At <strong style="color: #f39c12;">Edusphere</strong>, we empower students with knowledge and innovation.
                        </p>
                        <p style="font-style: italic; font-size: 14px; color: #bbb;">
                            "Education is the passport to the future, for tomorrow belongs to those who prepare for it today." – Edusphere
                        </p>
                    </div>
        
                    <!-- Footer -->
                    <div style="margin-top: 20px; padding: 15px; background: rgba(255, 255, 255, 0.1); border-radius: 5px;">
                        <p style="font-size: 18px;"><strong>Best Wishes,</strong></p>
                        <p style="font-size: 16px;">🎓 The Edusphere Team</p>
                        <p style="font-size: 14px;">📧 support@edusphere.com | 🌐 <a href="https://www.edusphere.com" style="color: #f1c40f; text-decoration: underline;">www.edusphere.com</a></p>
                    </div>
                </div>
            `,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error)
              return res.status(500).json({ error: "Email sending failed" });

            console.log("📧 Email sent:", info.response);

            res.status(201).json({
              message: "Student and user added successfully",
              user_id: user_id,
              student_id: studentResult.insertId,
            });
          });
        });
      });
    });
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Add New Faculty
app.post("/add-faculty", faculty_upload.single("image"), async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNo,
      ephoneNo,
      dob,
      address,
      gender,
      subjects,
    } = req.body;
    const image = req.file?.filename || null;

    if (!firstName || !lastName || !email || !phoneNo || !dob || !address || !gender || !subjects) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    if (!image) return res.status(400).json({ message: "Image upload failed" });

    const userName = email.split("@")[0];
    const password = Math.random().toString(36).slice(-8);
    const salt = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(password, salt);
    const role = "3"; // Faculty role
    const fullName = `${firstName} ${lastName}`;

    // ✅ Check if Email Already Exists
    db.query("SELECT COUNT(*) AS count FROM users WHERE username = ?", [userName], (err, result) => {
      if (err) {
        console.error("❌ Database error while checking email:", err.message);
        return res.status(500).json({ error: "Database error while checking email" });
      }

      if (result[0].count > 0) {
        return res.status(400).json({ message: "Email already exists. Please use a different email." });
      }

      // ✅ Insert into `users`
      const user_sql = "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";
      db.query(user_sql, [userName, hash_password, role], (err, userResult) => {
        if (err) {
          console.error("❌ Error inserting into users table:", err.message);
          return res.status(500).json({ error: "Error inserting into users table" });
        }

        const user_id = userResult.insertId;
        console.log("✅ User ID:", user_id);

        // ✅ Insert into `faculty_master`
        const faculty_sql = `INSERT INTO faculty_master 
          (uid, firstname, lastname, email, pnumber, emrnumber, dob, gender, address, subjectid, image) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const faculty_values = [
          user_id,
          firstName,
          lastName,
          email,
          phoneNo,
          ephoneNo,
          dob,
          gender,
          address,
          subjects, // Assuming subjects are stored as an array or comma-separated values
          image,
        ];

        db.query(faculty_sql, faculty_values, (err, facultyResult) => {
          if (err) {
            console.error("❌ Faculty Insert Error:", err.message);
            return res.status(500).json({ message: "Database error", error: err.message });
          }

          console.log("✅ Faculty Inserted Successfully:", facultyResult.insertId);

          // ✅ Send Welcome Email to Faculty
          const mailOptions = {
            from: '"Edusphere Team" <support@edusphere.com>',
            to: email,
            subject: `🎓 Welcome to Edusphere, Professor ${fullName}!`,
            html: `
              <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; padding: 40px; background: linear-gradient(to bottom, #2c3e50, #1c2833); color: #fff; border-radius: 10px; text-align: center;">
                
                <h1 style="margin-bottom: 10px; font-size: 28px;">🚀 Welcome to <span style="color: #f39c12;">Edusphere</span>!</h1>
                <p style="font-size: 16px; color: #ddd;">Hello <strong>${fullName}</strong>, we’re excited to have you join us as a faculty member!</p>

                <div style="background: rgba(255, 255, 255, 0.15); padding: 25px; border-radius: 10px; box-shadow: 0 4px 8px rgba(255, 255, 255, 0.2); margin-top: 20px;">
                  <h3 style="color: #f1c40f;">🔑 Your Login Credentials</h3>
                  <p><strong>👤 Username:</strong> <span style="color: #f1c40f;">${userName}</span></p>
                  <p><strong>🔐 Password:</strong> <span style="color: #e74c3c;">${password}</span></p>
                  <p style="font-size: 14px; color: #e74c3c;"><strong>⚠️ Keep your credentials safe and do not share them.</strong></p>

                  <div style="margin-top: 20px;">
                    <a href="http://localhost:5173/" target="_blank"
                       style="background: #3498db; color: #fff; padding: 12px 24px; font-size: 18px; font-weight: bold; border-radius: 5px; text-decoration: none; display: inline-block; box-shadow: 0 2px 5px rgba(255, 255, 255, 0.3);
                       transition: background 0.3s ease-in-out;">
                      🔓 Login to Your Faculty Dashboard
                    </a>
                  </div>
                  <style>
                      a:hover { background: #2980b9 !important; }
                  </style>
                </div>

                <div style="margin-top: 20px; text-align: center;">
                  <h2 style="color: #f1c40f;">📖 Inspire and Educate!</h2>
                  <p style="font-size: 16px; color: #ddd;">
                    At <strong style="color: #f39c12;">Edusphere</strong>, we value your role in shaping the future.
                  </p>
                  <p style="font-style: italic; font-size: 14px; color: #bbb;">
                    "A good teacher can inspire hope, ignite the imagination, and instill a love of learning." – Edusphere
                  </p>
                </div>

                <div style="margin-top: 20px; padding: 15px; background: rgba(255, 255, 255, 0.1); border-radius: 5px;">
                  <p style="font-size: 18px;"><strong>Best Regards,</strong></p>
                  <p style="font-size: 16px;">🎓 The Edusphere Team</p>
                  <p style="font-size: 14px;">📧 support@edusphere.com | 🌐 <a href="https://www.edusphere.com" style="color: #f1c40f; text-decoration: underline;">www.edusphere.com</a></p>
                </div>
              </div>
            `,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) return res.status(500).json({ error: "Email sending failed" });

            console.log("📧 Faculty Email Sent:", info.response);

            res.status(201).json({
              message: "Faculty added successfully",
              user_id: user_id,
              faculty_id: facultyResult.insertId,
            });
          });
        });
      });
    });
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
app.listen(8081, () => {
  console.log("Server is running on port 8081");
});
