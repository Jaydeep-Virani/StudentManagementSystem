const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const app = express();
const session = require("express-session");
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Set up session
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false, // 🔹 Only store sessions after login
    cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 },
  })
);

// Database Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "edusphere",
});

// Mail Send Configration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "#", // Replace with your email
    pass: "#", // Use App Password if 2FA is enabled
  },
});

app.get("/session", (req, res) => {
  console.log("Session request:", req.session.user); // ✅ Debug
  if (!req.session.user) {
    return res.status(401).json({ message: "No active session" });
  }
  res.json({ user: req.session.user });
});
app.post("/login", (req, res) => {
  const { userName, password } = req.body;
  req.session.pass = {
    password: password,
  };
  const sql = "SELECT * FROM users WHERE username = ?";

  db.query(sql, [userName], async (err, result) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: "Server error" });
    }

    if (result.length === 0) {
      return res.status(401).json({ error: "Username not registered" });
    }

    const user = result[0];
    const hashedPassword = user.password;

    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    req.session.user = {
      userId: user.uid,
      userName: user.username,
      email: user.username,
      role: user.role,
      password: user.password,
    };

    console.log("Session After Login:", req.session); // ✅ Check session

    return res.json({
      message: "Login successful",
      user: req.session.user,
    });
  });
});
app.post("/logout", (req, res) => {
  res.clearCookie("connect.sid"); // Adjust cookie name if needed
  req.session.destroy(() => {
    res.status(200).json({ message: "Logged out successfully" });
  });
});
app.get("/password", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "No active session" });
  }
  res.json({ user: req.session.pass });
});

const folderMap = {
  1: "AdminImage",
  2: "PrincipalImage",
  3: "FacultyImage",
  4: "StudentImage",
  5: "ParentImage",
};

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
const update_faculty_storage = multer.diskStorage({
  destination: path.join(__dirname, "../frontend/public/FacultyImage"),
  filename: function (req, file, cb) {
    const { firstname, lastname } = req.body;
    const fileExt = path.extname(file.originalname);
    const filename = `${firstname}_${lastname}${fileExt}`;
    const uniqueSuffix = Date.now();
    cb(null, filename + "_" + uniqueSuffix);
  },
});

const profile_picture_storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const role = req.session.user.role; // Make sure session is set
    const folder = folderMap[role];

    if (!folder) return cb(new Error("Invalid role"));

    const folderPath = path.join(__dirname, "../frontend/public", folder);
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const firstName = req.body.firstName || "user";
    const lastName = req.body.lastName || "profile";
    const timeStamp = Date.now();
    const extension = path.extname(file.originalname);
    const safeName = `${firstName}_${lastName}_${timeStamp}${extension}`;
    cb(null, safeName);
  },
});

const student_upload = multer({ storage: student_storage });
const faculty_upload = multer({ storage: faculty_storage });
const update_student = multer({ storage: multer.memoryStorage() });
const update_faculty = multer({ storage: update_faculty_storage });
const profile_picture_upload = multer({ storage: profile_picture_storage });

// Get Profile
app.get("/profile", (req, res) => {
  console.log("🔍 Session Debug:", req.session); // ✅ Log session

  if (!req.session.user) {
    return res.status(401).json({
      message: "Unauthorized access",
      session: req.session, // ✅ Return session object for debugging
    });
  }

  const email = req.session.user.email;
  console.log("✅ User email from session:", email);

  const sql = `
      SELECT email FROM student_master WHERE email LIKE ?
      UNION ALL
      SELECT email FROM faculty_master WHERE email LIKE ?
      UNION ALL
      SELECT email FROM admin_master WHERE email LIKE ?
  `;

  const emailSearch = `%${email}%`;

  db.query(sql, [emailSearch, emailSearch, emailSearch], (err, result) => {
    if (err) {
      console.error("❌ Database Error:", err);
      return res
        .status(500)
        .json({ message: "Error inside server", error: err.message });
    }
    const matchEmail = result[0].email;
    console.log("✅ Query Result:", result);
    // return res.json(matchEmail);

    const profileQuery = `
      SELECT firstname, lastname, email, pnumber, dob, address, gender, image FROM student_master WHERE email = ?
      UNION ALL
      SELECT firstname, lastname, email, pnumber, dob, address, gender, image FROM faculty_master WHERE email = ?
      UNION ALL
      SELECT firstname, lastname, email, pnumber, dob, address, gender, image FROM admin_master WHERE email = ?
  `;

    db.query(
      profileQuery,
      [matchEmail, matchEmail, matchEmail],
      (err, profileResult) => {
        if (err) {
          console.error("❌ Database Error:", err);
          return res
            .status(500)
            .json({ message: "Error retrieving profile", error: err.message });
        }

        console.log("✅ Full Profile Data:", profileResult);
        return res.json({
          message: "Profile retrieved successfully",
          profile: profileResult[0],
        });
      }
    );
  });
});

// Update Profile
app.put("/profile_update", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  const { role } = req.session.user;
  let table_name;
  switch (role) {
    case 1:
      table_name = "admin_master";
      break;
    case 4:
      table_name = "student_master";
      break;
    case 3:
      table_name = "faculty_master";
  }

  const { firstName, lastName, phoneNo, dob, address, gender, email } =
    req.body;
  console.log("Updating profile for:", {
    firstName,
    lastName,
    phoneNo,
    dob,
    address,
    gender,
    email,
  });

  if (
    !firstName ||
    !lastName ||
    !phoneNo ||
    !dob ||
    !address ||
    !gender ||
    !email
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Ensure user exists before updating
  const checkQuery = `SELECT * FROM ${table_name} WHERE email = ?`;
  db.query(checkQuery, [email], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update profile if user exists
    const updateQuery = `
          UPDATE ${table_name} 
          SET firstname = ?, lastname = ?, pnumber = ?, dob = ?, address = ?, gender = ?
          WHERE email = ?
      `;

    db.query(
      updateQuery,
      [firstName, lastName, phoneNo, dob, address, gender, email],
      (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Database error" });
        }
        res.json({ message: "Profile updated successfully!" });
      }
    );
  });
});

app.put(
  "/update_profile_picture",
  profile_picture_upload.single("profilePicture"),
  async (req, res) => {
    const { email } = req.body;
    const { role } = req.session.user;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    let table_name;
    switch (role) {
      case 1:
        table_name = "admin_master";
        break;
      case 4:
        table_name = "student_master";
        break;
      case 3:
        table_name = "faculty_master";
    }

    const fetchImageQuery = `SELECT image FROM ${table_name} WHERE email = ?`;

    db.query(fetchImageQuery, [email], (err, imageResult) => {
      if (err) {
        console.error("❌ Database Error:", err);
        return res.status(500).json({
          message: "Error retrieving profile picture",
          error: err.message,
        });
      }

      if (imageResult.length > 0) {
        const oldImage = imageResult[0].image;

        // 🚨 Ensure the old image is not "default_profile.jpg" before deleting
        if (oldImage && oldImage !== "default_profile.jpg") {
          const oldImagePath = path.join(
            __dirname,
            "../frontend/public",
            oldImage
          );

          fs.unlink(oldImagePath, (unlinkErr) => {
            if (unlinkErr && unlinkErr.code !== "ENOENT") {
              console.error("⚠️ Error deleting old image:", unlinkErr);
            } else {
              console.log("✅ Old profile picture deleted successfully.");
            }
          });
        }
      }

      // Save new image filename
      const newImagePath = req.file.filename;

      const updateQuery = `UPDATE ${table_name} SET image = ? WHERE email = ?`;

      db.query(updateQuery, [newImagePath, email], (updateErr, result) => {
        if (updateErr) {
          console.error("❌ Database error:", updateErr);
          return res.status(500).json({ error: "Database error" });
        }
        res.json({
          message: "Profile Picture updated successfully!",
          imageUrl: `/uploads/${newImagePath}`,
        });
      });
    });
  }
);

//Dlete Profile Picture
app.delete("/delete_profile_picture", async (req, res) => {
  const { email } = req.body;
  const { role } = req.session.user;

  let table_name;
  switch (role) {
    case 1:
      table_name = "admin_master";
      break;
    case 4:
      table_name = "student_master";
      break;
    case 3:
      table_name = "faculty_master";
  }

  const fetchImageQuery = `SELECT image FROM ${table_name} WHERE email = ?`;

  db.query(fetchImageQuery, [email], (err, imageResult) => {
    if (err) {
      return res.status(500).json({
        message: "Error retrieving profile picture",
        error: err.message,
      });
    }

    if (imageResult.length > 0 && imageResult[0].image) {
      const imageName = imageResult[0].image;

      // 🔥 Determine folder based on role
      let imageFolder = "";
      switch (role) {
        case 1:
          imageFolder = "AdminImage";
          break;
        case 2:
          imageFolder = "PrincipalImage";
          break;
        case 3:
          imageFolder = "FacultyImage";
          break;
        case 4:
          imageFolder = "StudentImage";
          break;
        case 5:
          imageFolder = "ParentImage";
          break;
        default:
          return res.status(400).json({ message: "Invalid role" });
      }

      // 🧩 Build the full image path
      const imagePath = path.join(
        __dirname,
        "../frontend/public",
        imageFolder,
        imageName
      );

      // 🔄 Delete the image
      fs.unlink(imagePath, (unlinkErr) => {
        if (unlinkErr && unlinkErr.code !== "ENOENT") {
          console.error("Error deleting image:", unlinkErr);
          return res.status(500).json({ message: "Failed to delete image" });
        }

        // 🛠 Update DB to set default image
        const updateQuery = `UPDATE ${table_name} SET image = "default_profile.jpg" WHERE email = ?`;
        db.query(updateQuery, [email], (updateErr) => {
          if (updateErr) {
            return res.status(500).json({ error: "Database error" });
          }

          res.json({ message: "Profile picture deleted successfully!" });
        });
      });
    } else {
      res.status(404).json({ message: "No profile picture found" });
    }
  });
});

app.post("/change_password", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  const { currentPassword, newPassword } = req.body;
  const userEmail = req.session.user.email;

  try {
    // Fetch user from DB
    const sql = "SELECT password FROM users WHERE username = ?";
    db.query(sql, [userEmail], async (err, result) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ error: "Server error" });
      }

      if (result.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const hashedPassword = result[0].password;

      // Compare passwords
      const isMatch = await bcrypt.compare(currentPassword, hashedPassword);
      if (!isMatch) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }

      // Hash new password
      const saltRounds = 10;
      const newHashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update password in DB
      const updateSql = "UPDATE users SET password = ? WHERE username = ?";
      db.query(updateSql, [newHashedPassword, userEmail], (updateErr) => {
        if (updateErr) {
          console.error("Update Error:", updateErr);
          return res.status(500).json({ error: "Could not update password" });
        }
        req.session.pass = {
          password: newPassword,
        };
        res.json({ message: "Password changed successfully" });
      });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Get all classes
app.get("/get_classes", (req, res) => {
  const sql = "SELECT * FROM class_master";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    return res.json(result);
  });
});
// Add a new class
app.post("/add_class", (req, res) => {
  const { className } = req.body;
  const sql = "INSERT INTO class_master (class_name) VALUES (?)";
  db.query(sql, [className], (err, result) => {
    if (err) return res.status(500).json(err);
    return res.json({ message: "Class added successfully" });
  });
});
// Update a class
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
// Delete a class
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

// Fetch All Subject
app.get("/get_subjects", (req, res) => {
  const sql = "SELECT * FROM subject_master";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    return res.json(result);
  });
});
// Add a new subject
app.post("/add_subject", (req, res) => {
  const { subjectName } = req.body;
  const sql = "INSERT INTO subject_master (subject_name) VALUES (?)";
  db.query(sql, [subjectName], (err, result) => {
    if (err) return res.status(500).json(err);
    return res.json({ message: "Subject added successfully" });
  });
});
// Update a subject
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
// Delete a subject
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
// Fetch Student
app.get("/students", (req, res) => {
  db.query("SELECT * FROM student_master", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});
// Update Student
app.put("/update-student/:id", update_student.single("image"), (req, res) => {
  const studentId = req.params.id;
  const { firstname, lastname, email, pnumber, dob, gender } = req.body;

  console.log("Request Body:", req.body);
  console.log("Uploaded File:", req.file);

  if (!firstname || !lastname || !email || !pnumber || !dob || !gender) {
    return res.status(400).json({ message: "All fields are required." });
  }

  let finalImage = null;

  if (req.file) {
    const uploadPath = path.join(__dirname, "../frontend/public/StudentImage");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    const uniqueSuffix = Date.now();
    const fileExtension = path.extname(req.file.originalname);
    const filename = `${firstname}_${lastname}_${uniqueSuffix}${fileExtension}`;
    const filePath = path.join(uploadPath, filename);

    fs.writeFileSync(filePath, req.file.buffer);
    finalImage = filename;
  }

  const selectQuery = `SELECT image FROM student_master WHERE sid = ?`;
  db.query(selectQuery, [studentId], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ message: "Error fetching student record." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Student not found." });
    }

    const existingImage = results[0].image;
    finalImage = finalImage || existingImage; // Keep old image if new not provided

    const updateQuery = `
      UPDATE student_master
      SET firstname = ?, lastname = ?, email = ?, pnumber = ?, dob = ?, gender = ?, image = ?
      WHERE sid = ?
    `;

    db.query(
      updateQuery,
      [firstname, lastname, email, pnumber, dob, gender, finalImage, studentId],
      (updateErr, result) => {
        if (updateErr) {
          console.error("Database error:", updateErr);
          return res
            .status(500)
            .json({ message: "Error updating student record." });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Student not found." });
        }

        res.status(200).json({
          message: "Student updated successfully.",
          image: finalImage,
        });
      }
    );
  });
});
// Delete Student
app.delete("/delete-student/:id", (req, res) => {
  const { id } = req.params;

  console.log("🗑️ Received Delete Request for Student ID:", id);

  // Step 1: Get the UID from student_master before deleting
  const getUidQuery = "SELECT uid FROM student_master WHERE sid = ?";
  db.query(getUidQuery, [id], (err, results) => {
    if (err) {
      console.error("❌ Error Student faculty UID:", err);
      return res.status(500).json({ error: "Error retrieving Student data" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    const uid = results[0].uid; // Extract UID from the faculty record

    console.log("🔎 Found UID:", uid);

    // Step 2: Delete faculty from Student_master
    const deleteFacultyQuery = "DELETE FROM student_master WHERE sid = ?";
    db.query(deleteFacultyQuery, [id], (err, facultyResult) => {
      if (err) {
        console.error("❌ Error deleting faculty:", err);
        return res.status(500).json({ error: "Error deleting faculty" });
      }

      console.log("✅ Student deleted successfully");

      // Step 3: Delete user from users table (if UID exists)
      if (uid) {
        const deleteUserQuery = "DELETE FROM users WHERE uid = ?";
        db.query(deleteUserQuery, [uid], (err, userResult) => {
          if (err) {
            console.error("❌ Error deleting user:", err);
            return res
              .status(500)
              .json({ error: "Error deleting associated user" });
          }

          console.log("✅ User deleted successfully");
          res.status(200).json({
            message: "Faculty and associated user deleted successfully",
          });
        });
      } else {
        res
          .status(200)
          .json({ message: "Faculty deleted, but no associated user found" });
      }
    });
  });
});

//  Add New Faculty
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

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNo ||
      !dob ||
      !address ||
      !gender ||
      !subjects
    ) {
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
    db.query(
      "SELECT COUNT(*) AS count FROM users WHERE username = ?",
      [userName],
      (err, result) => {
        if (err) {
          console.error("❌ Database error while checking email:", err.message);
          return res
            .status(500)
            .json({ error: "Database error while checking email" });
        }

        if (result[0].count > 0) {
          return res.status(400).json({
            message: "Email already exists. Please use a different email.",
          });
        }

        // ✅ Insert into `users`
        const user_sql =
          "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";
        db.query(
          user_sql,
          [userName, hash_password, role],
          (err, userResult) => {
            if (err) {
              console.error(
                "❌ Error inserting into users table:",
                err.message
              );
              return res
                .status(500)
                .json({ error: "Error inserting into users table" });
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
                return res
                  .status(500)
                  .json({ message: "Database error", error: err.message });
              }

              console.log(
                "✅ Faculty Inserted Successfully:",
                facultyResult.insertId
              );

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
                if (error)
                  return res
                    .status(500)
                    .json({ error: "Email sending failed" });

                console.log("📧 Faculty Email Sent:", info.response);

                res.status(201).json({
                  message: "Faculty added successfully",
                  user_id: user_id,
                  faculty_id: facultyResult.insertId,
                });
              });
            });
          }
        );
      }
    );
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// Fetch all faculty members
app.get("/faculty", (req, res) => {
  const query = `
    SELECT f.*, 
           IFNULL(GROUP_CONCAT(DISTINCT s.subject_name ORDER BY s.subject_name SEPARATOR ', '), 'No Subject') AS subjects
    FROM faculty_master f
    LEFT JOIN subject_master s ON FIND_IN_SET(s.subject_id, f.subjectid) > 0
    GROUP BY f.fid;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Database Error:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});
// Update faculty details
app.put(
  "/update-faculty/:id",
  update_faculty.single("image"),
  async (req, res) => {
    try {
      const { id } = req.params;
      let {
        firstname,
        lastname,
        email,
        pnumber,
        dob,
        gender,
        address,
        subject_id,
      } = req.body;
      const image = req.file ? req.file.filename : null;

      console.log("🔄 Received Update Request for Faculty ID:", id);
      console.log(
        "📌 Received subject_id:",
        subject_id,
        "Type:",
        typeof subject_id
      );
      console.log("🔎 Request Body:", req.body);

      // Convert ISO date to 'YYYY-MM-DD'
      const formattedDob = dob
        ? new Date(dob).toISOString().split("T")[0]
        : null;

      // Retrieve existing faculty details
      const getQuery = "SELECT * FROM faculty_master WHERE fid = ?";
      db.query(getQuery, [id], (err, results) => {
        if (err) {
          console.error("❌ Error fetching faculty:", err);
          return res
            .status(500)
            .json({ error: "Error fetching existing data" });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: "Faculty not found" });
        }

        const existingData = results[0];

        const newsubjectid = Array.isArray(subject_id)
          ? subject_id.join(",")
          : String(subject_id);

        console.log(newsubjectid); // Output: "2,3"
        console.log(typeof newsubjectid);
        // ✅ Fix: Ensure subject_id is parsed correctly from JSON

        const updateQuery = `
      UPDATE faculty_master 
      SET firstname=?, lastname=?, email=?, pnumber=?, dob=?, gender=?, address=?, subjectid=?, image=? 
      WHERE fid=?
    `;

        const values = [
          firstname || existingData.firstname,
          lastname || existingData.lastname,
          email || existingData.email,
          pnumber || existingData.pnumber,
          formattedDob || existingData.dob,
          gender || existingData.gender,
          address || existingData.address,
          newsubjectid, // ✅ Ensured Not NULL
          image || existingData.image,
          id,
        ];

        console.log("🟢 Executing SQL Query:", updateQuery);
        console.log("📊 Query Values:", values);

        db.query(updateQuery, values, (err, result) => {
          if (err) {
            console.error("❌ Database update error:", err);
            return res.status(500).json({ error: "Database update failed" });
          }
          if (result.affectedRows === 0) {
            return res
              .status(400)
              .json({ error: "No rows updated. Possible invalid faculty ID." });
          }
          res.status(200).json({ message: "✅ Faculty updated successfully" });
        });
      });
    } catch (error) {
      console.error("❌ Update error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);
// Delete faculty member
app.delete("/delete-faculty/:id", (req, res) => {
  const { id } = req.params;

  console.log("🗑️ Received Delete Request for Faculty ID:", id);

  // Step 1: Get the UID from faculty_master before deleting
  const getUidQuery = "SELECT uid FROM faculty_master WHERE fid = ?";
  db.query(getUidQuery, [id], (err, results) => {
    if (err) {
      console.error("❌ Error fetching faculty UID:", err);
      return res.status(500).json({ error: "Error retrieving faculty data" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Faculty not found" });
    }

    const uid = results[0].uid; // Extract UID from the faculty record

    console.log("🔎 Found UID:", uid);

    // Step 2: Delete faculty from faculty_master
    const deleteFacultyQuery = "DELETE FROM faculty_master WHERE fid = ?";
    db.query(deleteFacultyQuery, [id], (err, facultyResult) => {
      if (err) {
        console.error("❌ Error deleting faculty:", err);
        return res.status(500).json({ error: "Error deleting faculty" });
      }

      console.log("✅ Faculty deleted successfully");

      // Step 3: Delete user from users table (if UID exists)
      if (uid) {
        const deleteUserQuery = "DELETE FROM users WHERE uid = ?";
        db.query(deleteUserQuery, [uid], (err, userResult) => {
          if (err) {
            console.error("❌ Error deleting user:", err);
            return res
              .status(500)
              .json({ error: "Error deleting associated user" });
          }

          console.log("✅ User deleted successfully");
          res.status(200).json({
            message: "Faculty and associated user deleted successfully",
          });
        });
      } else {
        res
          .status(200)
          .json({ message: "Faculty deleted, but no associated user found" });
      }
    });
  });
});

// Add New Holiday
app.post("/add-holiday", async (req, res) => {
  const { holidayName, date, month, day } = req.body;

  console.log("HolidayName : " + holidayName);
  console.log("HolidayDate : " + date);
  console.log("HolidayMonth : " + month);
  console.log("HolidayDay : " + day);
  try {
    const { holidayName, date, month, day } = req.body;

    db.query(
      "INSERT INTO holiday_master (holiday_name, holiday_date, holiday_day, month_id) VALUES (?, ?, ?, ?)",
      [holidayName, date, day, month]
    );
    return res.json({ success: true });
  } catch (error) {
    console.error("Error adding holiday:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});
// Get Month
app.get("/get-months", (req, res) => {
  const sql = "SELECT * FROM month";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    return res.json(result);
  });
});
// Get Holiday
app.get("/get-holidays", (req, res) => {
  const monthName = req.query.monthname;

  // Step 1: Find the month_id from month_master
  const findMonthIdQuery = `
    SELECT mid FROM month WHERE monthname = ?
  `;

  db.query(findMonthIdQuery, [monthName], (err, monthResults) => {
    if (err) {
      console.error("Error fetching month ID:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (monthResults.length === 0) {
      return res.status(404).json({ error: "Month not found" });
    }
    const monthId = monthResults[0].mid;

    const getHolidaysQuery = `
      SELECT hid, holiday_name, DATE_FORMAT(holiday_date, '%d-%m-%Y') AS holiday_date, holiday_day, month_id 
      FROM holiday_master
      WHERE month_id = ?
    `;

    db.query(getHolidaysQuery, [monthId], (err, holidayResults) => {
      if (err) {
        console.error("Error fetching holidays:", err);
        return res.status(500).json({ error: "Database error" });
      }

      res.json(holidayResults);
    });
  });
});
// Update Holiday
app.put("/update-holiday/:id", (req, res) => {
  const { id } = req.params;
  const { holiday_name, holiday_date } = req.body;

  // Convert from 'DD-MM-YYYY' to 'YYYY-MM-DD'
  const dateParts = holiday_date.split("-");
  const dateObj = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);

  if (isNaN(dateObj.getTime())) {
    return res.status(400).json({ error: "Invalid date format" });
  }

  const formattedDate = dateObj.toISOString().split("T")[0]; // 'YYYY-MM-DD'
  const monthName = dateObj.toLocaleString("default", { month: "long" });
  const dayName = dateObj.toLocaleString("default", { weekday: "long" });

  console.log("Holiday ID:", id);
  console.log("Holiday Name:", holiday_name);
  console.log("Original Date (DD-MM-YYYY):", holiday_date);
  console.log("Formatted Date (YYYY-MM-DD):", formattedDate);
  console.log("Month Name:", monthName);
  console.log("Day Name:", dayName);

  // Step 1: Get month_id from month table
  const getMonthIdQuery = "SELECT mid FROM month WHERE monthname = ?";
  db.query(getMonthIdQuery, [monthName], (err, results) => {
    if (err) {
      console.error("Error getting month_id:", err);
      return res.status(500).json({ error: "DB error while getting month_id" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Month not found" });
    }

    const month_id = results[0].mid;

    // Step 2: Update holiday_master
    const updateQuery = `
      UPDATE holiday_master 
      SET holiday_name = ?, holiday_date = ?, holiday_day = ?, month_id = ? 
      WHERE hid = ?
    `;

    db.query(
      updateQuery,
      [holiday_name, formattedDate, dayName, month_id, id],
      (err, result) => {
        if (err) {
          console.error("Error updating holiday:", err);
          return res
            .status(500)
            .json({ error: "DB error while updating holiday" });
        }

        res.json({ success: true, message: "Holiday updated successfully" });
      }
    );
  });
});
// Delete Holiday
app.delete("/delete-holiday/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM holiday_master WHERE hid = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// Add new note
app.post("/add-note", (req, res) => {
  const { note_content } = req.body;
  const sql = "INSERT INTO notes_master (notes) VALUES (?)";
  db.query(sql, [note_content], (err, result) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, message: "Note added" });
  });
});
// Get all notes
app.get("/get-notes", (req, res) => {
  const sql = "SELECT * FROM notes_master ORDER BY nid DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching notes:", err);
      return res.status(500).json({ success: false, error: err });
    }
    return res.json(results);
  });
});

app.put("/update-note/:id", (req, res) => {
  const noteId = req.params.id;
  const { note_content } = req.body;

  console.log("Note ID:", noteId);
  console.log("Body Content:", note_content);
  if (!noteId) {
    return res.status(400).json({ success: false, message: "Missing note ID" });
  }

  const sql = "UPDATE notes_master SET notes = ? WHERE nid = ?";
  db.query(sql, [note_content, noteId], (err, result) => {
    if (err) {
      return res.json({ success: false, error: err });
    }
    res.json({ success: true });
  });
});

// DELETE a note
app.delete("/delete-note/:id", (req, res) => {
  const noteId = req.params.id;

  if (!noteId) {
    return res
      .status(400)
      .json({ success: false, message: "Note ID is required" });
  }

  const sql = "DELETE FROM notes_master WHERE nid = ?";
  db.query(sql, [noteId], (err, result) => {
    if (err) {
      console.error("Error deleting note:", err);
      return res.status(500).json({ success: false, error: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    }

    res.json({ success: true, message: "Note deleted successfully" });
  });
});

const otpStore = {};
// Forget Password
app.post("/forgot_password", (req, res) => {
  const { email } = req.body;

  const findEmail = `
        SELECT email, uid, firstname, lastname FROM student_master WHERE email LIKE ?
        UNION ALL
        SELECT email, uid, firstname, lastname FROM faculty_master WHERE email LIKE ?
        UNION ALL
        SELECT email, uid, firstname, lastname FROM admin_master WHERE email LIKE ?
    `;
  const placeholders = new Array(3).fill(`${email}%`);

  db.query(findEmail, placeholders, (err, result) => {
    if (err) return res.status(500).json({ error: "Internal server error" });
    if (result.length === 0)
      return res.status(404).json({ error: "Email is not registered!" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 2 * 60 * 1000;

    const { uid, firstname, lastname } = result[0];

    // Store OTP
    otpStore[email] = { otp, expiry: otpExpiry };

    // Store user info in session (consistent object)
    req.session.u_id = {
      userId: uid,
      firstName: firstname,
      lastName: lastname,
      email: email,
    };
    console.log("New Session set:", req.session.u_id.userId);
    const mailOptions = {
      from: '"EDUSPHERE TEAM" <support@edusphere.com>',
      to: email,
      subject: "🔐 Password Reset OTP - Edusphere",
      html: `
          <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; padding: 40px; background: linear-gradient(to bottom, #2c3e50, #1c2833); color: #fff; border-radius: 10px; text-align: center;">
              <h1 style="font-size: 26px; margin-bottom: 10px; color: #f1c40f;">🔐 Password Reset Request</h1>
              <p style="font-size: 16px; color: #ccc;">We received a request to reset your password for <strong>Edusphere</strong>.</p>
              <div style="margin: 30px 0; background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px;">
                  <p style="font-size: 18px; margin-bottom: 10px; color: #f1c40f;">Your One-Time Password (OTP) is:</p>
                  <p style="font-size: 32px; font-weight: bold; color: #fff;">${otp}</p>
                  <p style="font-size: 14px; color: #bbb;">This OTP is valid for 1 minutes.</p>
              </div>
              <p style="font-size: 14px; color: #eee;">If you didn’t request this, you can safely ignore this email.</p>
              <div style="margin-top: 30px; font-size: 14px; color: #ccc;">
                  <p>Need help? Contact us at <a href="mailto:support@edusphere.com" style="color: #f1c40f;">support@edusphere.com</a></p>
                  <p>— The Edusphere Team</p>
              </div>
          </div>
      `,
    };

    transporter.sendMail(mailOptions, (emailErr) => {
      if (emailErr)
        return res.status(500).json({ error: "Failed to send OTP email." });

      console.log("✅ OTP sent and session saved:", req.session.u_id);
      return res.status(200).json({ message: "OTP sent to your email." });
    });
  });
});
// Verify OTP
app.post("/verify_otp", (req, res) => {
  const { email, otp } = req.body;
  const stored = otpStore[email];

  if (!stored || stored.otp !== otp) {
    return res.status(400).json({ error: "Invalid or expired OTP." });
  }

  if (Date.now() > stored.expiry) {
    delete otpStore[email];
    return res.status(400).json({ error: "OTP has expired." });
  }

  const findUserQuery = `
    SELECT uid, firstname, lastname FROM student_master WHERE email = ?
    UNION ALL
    SELECT uid, firstname, lastname FROM faculty_master WHERE email = ?
    UNION ALL
    SELECT uid, firstname, lastname FROM admin_master WHERE email = ?
  `;
  const values = [email, email, email];

  db.query(findUserQuery, values, (err, result) => {
    if (err || result.length === 0) {
      return res.status(500).json({ error: "User not found or DB error." });
    }
    const user = result[0];
    req.session.save((err) => {
      if (err) {
        return res.status(500).json({ error: "Session error" });
      }
      delete otpStore[email];
      return res.status(200).json({ message: "OTP verified successfully." });
    });
  });
});
// Reset Password
app.post("/reset_password", async (req, res) => {
  const password = req.body.password;
  console.log("Password :", password);

  if (!req.session || !req.session.u_id) {
    console.log("🚫 No session or session expired.");
    return res.status(401).json({ error: "Session not found or expired." });
  }

  const { userId, firstName, lastName, email } = req.session.u_id;

  try {
    const hash_password = await bcrypt.hash(password, 10);
    const query = `UPDATE users SET password = ? WHERE uid = ?`;

    db.query(query, [hash_password, userId], (err, result) => {
      if (err) {
        console.error("❌ DB Error:", err);
        return res.status(500).json({ error: "Database error." });
      }

      if (result.affectedRows > 0) {
        // ✅ Send confirmation email
        const fullName = `${firstName} ${lastName}`.trim();
        const mailOptions = {
          from: '"EDUSPHERE TEAM" <support@edusphere.com>',
          to: email,
          subject: "✅ Password Changed - Edusphere",
          html: `
            <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; padding: 40px; background: linear-gradient(to bottom, #2c3e50, #1c2833); color: #fff; border-radius: 10px; text-align: center;">
              <h1 style="font-size: 26px; margin-bottom: 10px; color: #2ecc71;">✅ Hello ${fullName},</h1>
              <p style="font-size: 16px; color: #ccc;">Your password for <strong>Edusphere</strong> has been successfully updated.</p>
              <div style="margin: 20px auto; background: #34495e; padding: 15px; border-radius: 8px;">
                <p style="font-size: 16px; color: #f1c40f; margin-bottom: 5px;">🔑 Your new password is:</p>
                <p style="font-size: 22px; font-weight: bold; color: #fff;">${password}</p>
              </div>
              <p style="font-size: 14px; color: #bbb;">If you didn’t make this change, please contact support immediately.</p>
              <div style="margin-top: 30px; font-size: 14px; color: #ccc;">
                <p>Need help? Contact us at <a href="mailto:support@edusphere.com" style="color: #f1c40f;">support@edusphere.com</a></p>
                <p>— The Edusphere Team</p>
              </div>
            </div>
          `,
        };
        transporter.sendMail(mailOptions, (emailErr, info) => {
          if (emailErr) {
            console.error("❌ Error sending confirmation email:", emailErr);
          } else {
            console.log("📧 Confirmation email sent:", info.response);
          }
        });

        return res.status(200).json({ message: "Password reset successful." });
      } else {
        return res.status(404).json({ error: "User not found." });
      }
    });
  } catch (error) {
    console.error("❌ Error:", error);
    return res.status(500).json({ error: "Server error." });
  }
});

const material_storage = multer.diskStorage({
  destination: path.join(__dirname, "../frontend/public/material"),
  filename: (req, file, cb) => {
    const material_name = req.body.materialTitle + " " + req.body.chapter; // Fix: Use `chapter`, not `selectedChapters`
    cb(null, material_name + path.extname(file.originalname));
  },
});

const material_upload = multer({ storage: material_storage });

// ✅ API Route to Upload Material

// Add Material
app.post("/material", material_upload.single("file"), async (req, res) => {
  try {
    console.log("Body Data:", req.body);
    console.log("File Data:", req.file);

    const { materialTitle, class: materialClass, subject, chapter } = req.body;
    const file = req.file ? req.file.filename : null; // Fix: Use `filename`, not `materialname`

    if (!file) return res.status(400).json({ message: "File upload failed" });

    const sql = `INSERT INTO material_detail 
                 (material_title, class, subject, chapter, material_file) 
                 VALUES (?, ?, ?, ?, ?)`;
    const values = [materialTitle, materialClass, subject, chapter, file]; // Fix: Use `file`, not `image`

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error inserting material:", err);
        return res.status(500).json({ message: "Database error" });
      }
      res.json({ message: "Material uploaded successfully" });
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get Material
app.get("/materials", (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: "Unauthorized. No active session." });
  }

  const userID = req.session.user.userId;
  const { role } = req.session.user;

  // ✅ Roles 1 (Admin), 2 (Parent), 3 (Faculty) get all materials
  if (role == 1 || role == 2 || role == 3) {
    const materialQuery = "SELECT * FROM material_detail";
    db.query(materialQuery, (err, materials) => {
      if (err) {
        console.error("Error fetching materials:", err);
        return res.status(500).json({ error: "Database error" });
      }

      return res.json(materials);
    });
  } else {
    // 👨‍🎓 Assume student role
    const classIdQuery = "SELECT classid FROM student_master WHERE uid = ?";

    db.query(classIdQuery, [userID], (err, classResult) => {
      if (err) {
        console.error("❌ Error fetching class ID:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (classResult.length === 0) {
        return res.status(404).json({ error: "Student not found" });
      }

      const classId = classResult[0].classid;

      // 🏫 Get class_name from class_master
      const classNameQuery = "SELECT class_name FROM class_master WHERE class_id = ?";
      db.query(classNameQuery, [classId], (err, nameResult) => {
        if (err) {
          console.error("❌ Error fetching class name:", err);
          return res.status(500).json({ error: "Database error" });
        }

        if (nameResult.length === 0) {
          return res.status(404).json({ error: "Class not found" });
        }

        const className = nameResult[0].class_name;

        // 📚 Get materials for the class name
        const materialQuery = "SELECT * FROM material_detail WHERE class = ?";
        db.query(materialQuery, [className], (err, materials) => {
          if (err) {
            console.error("❌ Error fetching materials:", err);
            return res.status(500).json({ error: "Database error" });
          }

          return res.json(materials);
        });
      });
    });
  }
});

// DELETE Material API
app.delete("/material/:id", (req, res) => {
  const materialId = req.params.id;

  // Get the file name before deleting
  const getFileQuery =
    "SELECT material_file FROM material_detail WHERE material_id = ?";
  db.query(getFileQuery, [materialId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Material not found" });
    }

    const fileName = result[0].material_file;
    const filePath = path.join(
      __dirname,
      "../frontend/public/material",
      fileName
    ); // Adjust path as needed

    // Delete the file from the server
    fs.unlink(filePath, (fileErr) => {
      if (fileErr && fileErr.code !== "ENOENT") {
        console.error("Error deleting file:", fileErr);
        return res
          .status(500)
          .json({ message: "Error deleting file", error: fileErr });
      }

      // Delete the record from the database
      const deleteQuery = "DELETE FROM material_detail WHERE material_id = ?";
      db.query(deleteQuery, [materialId], (dbErr) => {
        if (dbErr) {
          return res
            .status(500)
            .json({ message: "Database error while deleting", error: dbErr });
        }

        res.status(200).json({ message: "Material deleted successfully" });
      });
    });
  });
});

const MATERIALS_DIR = path.join(__dirname, "../frontend/public/material");

app.use("/material", express.static(MATERIALS_DIR));

// ✅ API to Download a File
app.get("/download/:fileName", (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(MATERIALS_DIR, fileName);

  res.download(filePath, fileName, (err) => {
    if (err) {
      console.error("Error downloading file:", err);
      res.status(500).json({ message: "File not found" });
    }
  });
});

// Add leave
app.post("/add-leave", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  const { leaveReason, fromDate, toDate } = req.body;
  const { userId, role } = req.session.user;

  let role_name, sql;

  if (role === 3) {
    role_name = "Faculty";
    sql = "SELECT firstname, lastname, email FROM faculty_master WHERE uid = ?";
  } else {
    role_name = "Student";
    sql = "SELECT firstname, lastname, email FROM student_master WHERE uid = ?";
  }

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("SQL Error:", err);
      return res
        .status(500)
        .json({ message: "Error inside server", error: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const { firstname, lastname, email } = result[0];
    const fullName = `${firstname} ${lastname}`;
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const oneDay = 1000 * 60 * 60 * 24;
    const diffInDays = Math.round((end - start) / oneDay) + 1;
    const today = new Date();
    const current_date = today.toISOString().split("T")[0];

    const Sql = `INSERT INTO leave_detail (full_name, email, leave_reason, leave_day, from_date, to_date, applyed_on, role) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(
      Sql,
      [
        fullName,
        email,
        leaveReason,
        diffInDays,
        fromDate,
        toDate,
        current_date,
        role_name,
      ],
      (err, result) => {
        if (err) {
          console.error("SQL Error:", err);
          return res
            .status(500)
            .json({ message: "Database insertion error", error: err });
        }
        res
          .status(200)
          .json({ message: "Leave application submitted successfully" });
      }
    );
  });
});

// Get Leave
app.get("/get-leave", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({
      message: "Unauthorized access",
      session: req.session,
    });
  }

  const { email, role } = req.session.user;
  console.log("✅ User email from session:", email);

  let sql;
  let params = [];

  if (role === 1) {
    // Admin sees all pending leave requests
    sql = "SELECT * FROM leave_detail WHERE status = 0";
  } else if (role === 3) {
    // Parent sees only pending Student leaves
    sql = "SELECT * FROM leave_detail WHERE role = 'Student' AND status = 0";
  } else if (role === 2) {
    // Faculty sees only pending Faculty leaves
    sql = "SELECT * FROM leave_detail WHERE role = 'Faculty' AND status = 0";
  } else if (role === 4) {
    // Student sees their own leaves (email LIKE match)
    sql = "SELECT * FROM leave_detail WHERE email LIKE ?";
    params = [`%${email}%`];
  } else {
    return res.status(403).json({ message: "Access forbidden: Unknown role" });
  }

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("❌ SQL Error:", err);
      return res
        .status(500)
        .json({ message: "Error inside server", error: err });
    }
    return res.json(result);
  });
});

// Get Master
app.get("/master", (req, res) => {
  console.log("🔍 Session Debug:", req.session); // ✅ Log session

  if (!req.session.user) {
    return res.status(401).json({
      message: "Unauthorized access",
      session: req.session, // ✅ Return session object for debugging
    });
  }

  const email = req.session.user.email;
  const role = req.session.user.role;
  console.log("🔍 Session User ID:", req.session.user.userId); // ✅ Log user ID
  console.log("✅ User email from session:", email);

  const sql = `
      SELECT image, firstname, lastname FROM admin_master WHERE email LIKE ?
      UNION ALL
      SELECT image, firstname, lastname FROM student_master WHERE email LIKE ?
      UNION ALL
      SELECT image, firstname, lastname FROM faculty_master WHERE email LIKE ?
  `;

  const emailSearch = `%${email}%`;

  db.query(sql, [emailSearch, emailSearch, emailSearch], (err, result) => {
    if (err) {
      console.error("❌ Database Error:", err);
      return res
        .status(500)
        .json({ message: "Error inside server", error: err.message });
    }
    console.log("✅ Query Result:", result);
    return res.status(200).json({
      role: role,
      data: result[0] || null,
    });
  });
});

//Update Status on Leave
app.patch("/leave/:id", (req, res) => {
  const { id } = req.params;
  const { status, email, fullName, reason, fromDate, toDate } = req.body; // Get email & name from frontend

  if (typeof status !== "number") {
    return res.status(400).json({ error: "Invalid status value" });
  }

  const sql = "UPDATE leave_detail SET status = ? WHERE leave_id = ?";
  db.query(sql, [status, id], (err, result) => {
    if (err) {
      console.error("Error updating leave status:", err);
      return res.status(500).json({ error: "Database update failed" });
    }

    // ✅ If status is Active (1), send an email
    if (status === 1) {
      const mailOptions = {
        from: '"Edusphere School" <edusphere@gmail.com>',
        to: email,
        subject: "Leave Request Approved ✅",
        html: `<div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; padding: 40px; background: linear-gradient(to bottom, #2c3e50, #1c2833); color: #fff; border-radius: 10px; text-align: center;">
  
  <!-- Header -->
  <h1 style="margin-bottom: 10px; font-size: 28px;">✅ Leave Request <span style="color: #2ecc71;">Approved</span>!</h1>
  <p style="font-size: 16px; color: #ddd;">Hello <strong>${fullName}</strong>, your leave request has been successfully approved.</p>

  <!-- Leave Details Box -->
  <div style="background: rgba(255, 255, 255, 0.15); padding: 25px; border-radius: 10px; backdrop-filter: blur(10px); box-shadow: 0 4px 8px rgba(255, 255, 255, 0.2); margin-top: 20px;">
      <h3 style="color: #f1c40f;">📅 Leave Summary</h3>
      <p><strong>🧾 Reason:</strong> <span style="color: #ecf0f1;">${reason}</span></p>
      <p><strong>📆 From:</strong> <span style="color: #f1c40f;">${fromDate}</span></p>
      <p><strong>📆 To:</strong> <span style="color: #f1c40f;">${toDate}</span></p>
      <p style="font-size: 14px; color: #2ecc71;"><strong>✔ Enjoy your time off! Make sure to return rejuvenated.</strong></p>

      <!-- Dashboard Button -->
      <div style="margin-top: 20px;">
          <a href="http://localhost:5173/" target="_blank"
             style="background: #3498db; color: #fff; padding: 12px 24px; font-size: 18px; font-weight: bold; border-radius: 5px; text-decoration: none; display: inline-block; box-shadow: 0 2px 5px rgba(255, 255, 255, 0.3);">
              🔗 Go to Dashboard
          </a>
      </div>
  </div>

  <!-- Encouragement Section -->
  <div style="margin-top: 20px; text-align: center;">
      <h2 style="color: #f1c40f;">🧘‍♀️ Recharge & Refresh!</h2>
      <p style="font-size: 16px; color: #ddd;">
          Taking time off is essential. We're glad you're taking care of yourself.
      </p>
      <p style="font-style: italic; font-size: 14px; color: #bbb;">
          "Almost everything will work again if you unplug it for a few minutes… including you." – Anne Lamott
      </p>
  </div>

  <!-- Footer -->
  <div style="margin-top: 20px; padding: 15px; background: rgba(255, 255, 255, 0.1); border-radius: 5px;">
      <p style="font-size: 18px;"><strong>Take Care,</strong></p>
      <p style="font-size: 16px;">🧑‍💼 HR Department – Easy Way</p>
      <p style="font-size: 14px;">📧 support@edusphere.com | 🌐 <a href="https://www.edusphere.com" style="color: #f1c40f; text-decoration: underline;">www.edusphere.com</a></p>
  </div>
</div>`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          return res.status(500).json({ error: "Email sending failed" });
        }
        console.log("Email sent:", info.response);
      });
    }
    res.json({ message: "Leave status updated successfully", status });
  });
});

app.get("/dashboard_totals", (req, res) => {
  console.log("✅ API /dashboard_totals hit");

  if (!req.session.user) {
      console.log("❌ No session found");
      return res.status(401).json({
          message: "Unauthorized access",
          session: req.session
      });
  }

  const role = req.session.user.role;
  const email = req.session.user.email;
  console.log("✅ User email from session:", email);

  const sql = `
      SELECT email FROM admin_master WHERE email LIKE ?
      UNION ALL
      SELECT email FROM student_master WHERE email LIKE ?
      UNION ALL
      SELECT email FROM faculty_master WHERE email LIKE ?
      
  `;

  const emailSearch = `%${email}%`;

  db.query(sql, [emailSearch, emailSearch, emailSearch], (err, result) => {
      if (err) {
          console.error("❌ Database Error:", err);
          return res.status(500).json({ message: "Error inside server", error: err.message });
      }
      const matchEmail = result[0].email;
      let queries = {};

      if (role === 1 || role === 3) { // ✅ Corrected comparison
          queries = {
              students: "SELECT COUNT(*) AS total FROM student_master",
              faculty: "SELECT COUNT(*) AS total FROM faculty_master",
              classes: "SELECT COUNT(*) AS total FROM class_master",
              subjects: "SELECT COUNT(*) AS total FROM subject_master",
          };
      } else if (role === 4) {
        queries = {
          notes: "SELECT COUNT(*) AS total FROM notes_master",
        };
      } else {
          console.log("❌ Unauthorized Role");
          return res.status(403).json({ message: "Unauthorized role" });
      }

      let responseData = {};
      let completedQueries = 0;
      const totalQueries = Object.keys(queries).length;

      console.log("✅ Queries to Execute:", queries);

      for (let key in queries) {
          const query = queries[key];
          

          db.query(query, (err, results) => {
              if (err) {
                  console.error(`❌ Error fetching ${key}:`, err);
                  return res.status(500).json({ error: `Database error fetching ${key}` });
              }

              console.log(`✅ Result for ${key}:`, results);
              responseData[key] = results[0]?.total || 0; // Handle NULL results
              completedQueries++;

              if (completedQueries === totalQueries) {
                  console.log("✅ Final API Response:", responseData);
                  res.json(responseData);
              }
          });
      }
  });
});


// Start the server
app.listen(8081, () => {
  console.log("Server is running on port 8081");
});
