import React from "react";
import { useForm } from "@inertiajs/react";
import Layout from "../../components/Layout";

interface Props {
  error?: string;
}

const Login: React.FC<Props> = ({ error }) => {
  const { data, setData, post, errors } = useForm({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/login");
  };

  return (
    <Layout title="Login">
      <div>
        <h1>Login</h1>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
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
            Login
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Login;
