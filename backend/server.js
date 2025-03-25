const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // ✅ To parse JSON data

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "edusphere",
});

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
      if (err) return res.status(500).json({ error: "Database error", details: err });
      
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
      if (err) return res.status(500).json({ error: "Database error", details: err });
  
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
  
app.listen(8081, () => {
  console.log("Server is running on port 8081");
});
