import LoginForm from "../components/LoginForm";
import { Link } from "@tanstack/react-router";

const LoginPage = () => {
  return (
    <div className="text-white min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 pt-10">
      <h1 className="font-bold text-3xl text-center">Placeholder login page</h1>
      <div className="my-4">
        <LoginForm></LoginForm>
      </div>
      <p className="text-center my-4">
        Need to make an account? Register{" "}
        <Link
          className="text-slate-600 font-bold hover:text-slate-950"
          to="/register"
        >
          here.
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
