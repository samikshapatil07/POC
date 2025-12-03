import React, { useState } from "react";
import { api } from "./api";
import { Calendar } from "primereact/calendar";

function App() {
  const [form, setForm] = useState({
    name: "",
    dob: null,              // now store Date object
    email: "",
    phone: "",
    technical_domain: "",
  });

  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [domainFilter, setDomainFilter] = useState("");

  // Handle input change (for text fields)
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle DOB change (Calendar)
  const handleDateChange = (e) => {
    setForm({ ...form, dob: e.value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert Date object to YYYY-MM-DD string
    const dobFormatted = form.dob
      ? form.dob.toISOString().split("T")[0]
      : "";

    const payload = {
      ...form,
      dob: dobFormatted
    };

    try {
      await api.post("/users", payload);
      setMessage("User added successfully!");

      setForm({
        name: "",
        dob: null,
        email: "",
        phone: "",
        technical_domain: ""
      });
    } catch (err) {
      setMessage("Error submitting form");
    }
  };

  // Fetch all users
  const fetchUsers = async () => {
    const res = await api.get("/users");
    setUsers(res.data);
  };

  // Fetch users by domain
  const fetchByDomain = async () => {
    const res = await api.get(`/users/domain/${domainFilter}`);
    setUsers(res.data);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h2>User Details Form</h2>

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        /><br /><br />

        {/* DOB with PrimeReact Calendar */}
        <Calendar
          value={form.dob}
          onChange={handleDateChange}
          placeholder="Select Date of Birth"
          showIcon
        />
        <br /><br />

        {/* Email */}
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        /><br /><br />

        {/* Phone */}
        <input
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          required
        /><br /><br />

        {/* Technical Domain */}
        <input
          name="technical_domain"
          placeholder="Technical Domain (e.g., Python, React)"
          value={form.technical_domain}
          onChange={handleChange}
          required
        /><br /><br />

        <button type="submit">Submit</button>
      </form>

      <p>{message}</p>

      <hr />

      <h3>Fetch Users</h3>
      <button onClick={fetchUsers}>Get All Users</button>

      <h4>Filter by Domain</h4>
      <input
        placeholder="Enter domain"
        onChange={(e) => setDomainFilter(e.target.value)}
      />
      <button onClick={fetchByDomain}>Search</button>

      <hr />

      <h3>User List</h3>

      {users.map((u) => (
        <div
          key={u.id}
          style={{
            border: "1px solid black",
            padding: "10px",
            marginBottom: "10px"
          }}
        >
          <p><b>Name:</b> {u.name}</p>
          <p><b>DOB:</b> {u.dob}</p>
          <p><b>Email:</b> {u.email}</p>
          <p><b>Phone:</b> {u.phone}</p>
          <p><b>Domain:</b> {u.technical_domain}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
