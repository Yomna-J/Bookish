import { useFormik, FormikHelpers } from "formik";
import { loginSchema } from "../schemas";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

type LoginFormValues = {
  email: string;
  password: string;
};

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuth(); // Use setUser from the context

  const onSubmit = async (
    values: LoginFormValues,
    actions: FormikHelpers<LoginFormValues>
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (response.ok) {
        const data = await response.json();
        const user = { token: data.token };
        setUser(user);
        navigate("/home", { replace: true });
      } else if (response.status === 401) {
        actions.setFieldError("email", "Incorrect email or password");
        actions.setFieldError("password", "Incorrect email or password");
      }
    } catch (error) {
      console.error("An error occurred during login", error);
    } finally {
      actions.setSubmitting(false);
      setIsLoading(false);
    }
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit,
  });

  return (
    <div className="mx-auto flex h-[90vh] flex-col items-center justify-center gap-12 px-4 py-12 lg:max-w-7xl">
      <h1 className="font-comfortaa text-4xl font-bold">Login</h1>

      <form
        onSubmit={handleSubmit}
        className="grid w-full grid-cols-2 gap-6 rounded-md bg-white p-4 shadow-lg md:w-[60%] md:p-9"
      >
        <div className="col-span-2">
          <label htmlFor="email" className="block">
            Email Address
          </label>
          <input
            value={values.email}
            onChange={handleChange}
            id="email"
            type="email"
            onBlur={handleBlur}
            className={`w-full rounded-md border bg-transparent p-1 ${
              errors.email && touched.email ? "rounded-lg border-red-600" : ""
            }`}
          />
          {errors.email && touched.email && (
            <p className="text-xs text-red-600">{errors.email}</p>
          )}
        </div>
        <div className="col-span-2">
          <label htmlFor="password" className="block">
            Password
          </label>
          <input
            value={values.password}
            onChange={handleChange}
            id="password"
            type="password"
            onBlur={handleBlur}
            className={`w-full rounded-md border bg-transparent p-1 ${
              errors.password && touched.password
                ? "rounded-lg border-red-600"
                : ""
            }`}
          />
          {errors.password && touched.password && (
            <p className="text-xs text-red-600">{errors.password}</p>
          )}
        </div>

        <button
          disabled={isLoading || isSubmitting}
          type="submit"
          className="col-span-2 mt-2 flex items-center justify-center rounded-md bg-primary p-1 font-comfortaa text-xl text-white disabled:bg-lightGray"
        >
          {isLoading || isSubmitting ? (
            <div role="status">
              <svg
                aria-hidden="true"
                className="mr-2 h-6 animate-spin fill-white text-gray-300  "
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            </div>
          ) : (
            "Login"
          )}
        </button>
        <p className="col-span-2 text-center text-lightGray">
          Don't have an account?
          <Link
            to="/register"
            className="text-primary hover:text-darkPrimary ml-1"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
