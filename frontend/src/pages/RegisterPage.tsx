import RegisterForm from "../components/RegisterForm";
import { Link } from "@tanstack/react-router";

const RegisterPage = () => {
  return (
    <div className="text-white min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 pt-10">
      <h1 className="font-bold text-3xl text-center">
        Placeholder register page
      </h1>
      <div className="my-4">
        <RegisterForm></RegisterForm>
        <p className="text-center my-4 ">
          Already Have an account? Login{" "}
          <Link
            className="text-slate-600 font-bold hover:text-slate-950"
            to="/login"
          >
            here.
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
