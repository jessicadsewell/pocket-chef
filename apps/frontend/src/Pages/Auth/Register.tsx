import React from "react";
import { useForm } from "@inertiajs/react";
import Layout from "../../components/Layout";

const Register: React.FC = () => {
  const { data, setData, post, errors } = useForm({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/register");
  };

  return (
    <Layout title="Register">
      <div>
        <h1>Register</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block">Name</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
              className="border rounded p-2 w-full"
            />
            {errors.name && <span className="text-red-500">{errors.name}</span>}
          </div>
          <div>
            <label className="block">Email</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => setData("email", e.target.value)}
              className="border rounded p-2 w-full"
            />
            {errors.email && (
              <span className="text-red-500">{errors.email}</span>
            )}
          </div>
          <div>
            <label className="block">Password</label>
            <input
              type="password"
              value={data.password}
              onChange={(e) => setData("password", e.target.value)}
              className="border rounded p-2 w-full"
            />
            {errors.password && (
              <span className="text-red-500">{errors.password}</span>
            )}
          </div>
          <button type="submit" className="bg-blue-600 text-white p-2 rounded">
            Register
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Register;
