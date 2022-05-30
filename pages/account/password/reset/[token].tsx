import { Field, Form, Formik } from "formik";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import * as Yup from "yup";
import SweetAlert from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import colors from "tailwindcss/colors";

interface ResetFormValues {
  password: string;
  passwordConfirmation: string;
}

const Swal = withReactContent(SweetAlert);

const resetFormValues: ResetFormValues = {
  password: "",
  passwordConfirmation: "",
};

const resetFormValidationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password length at least 8 characters.")
    .required("Password is required!"),
  passwordConfirmation: Yup.string()
    .oneOf([Yup.ref("password"), null], "Password confirmation doesn't match!")
    .required("Password confirmation is required!"),
});

const Reset: NextPage = () => {
  const router = useRouter();

  const [isSuccess, setSuccess] = useState<boolean>(false);
  const [isResetting, setResetting] = useState<boolean>(false);

  const { token } = router.query;

  const handleSubmit = (values: ResetFormValues) => {
    setResetting(true);

    fetch(
      process.env.NEXT_PUBLIC_MICROGEN_BASE_URL +
        "/api/v1/account/reset-password",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          token,
          ...values,
        }),
      }
    )
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw data;
          });
        }

        return res.json();
      })
      .then(() => {
        setSuccess(true);

        setTimeout(() => {
          router.push("/");
        }, 3000);
      })
      .catch(
        (data: {
          status: "error" | "fail";
          data?: { [key: string]: any };
          message?: string;
        }) => {
          if (data.status === "error") {
            Swal.fire({
              icon: "error",
              position: "bottom-end",
              toast: true,
              timer: 3000,
              timerProgressBar: true,
              showConfirmButton: false,
              title: data.message,
              customClass: {
                popup:
                  "!bg-slate-700 !border !border-solid !border-slate-600 !text-slate-300",
              },
            });
          } else if (data.status === "fail") {
            Swal.fire({
              icon: "error",
              position: "bottom-end",
              toast: true,
              timer: 3000,
              timerProgressBar: true,
              showConfirmButton: false,
              title: data.data?.message,
              customClass: {
                popup:
                  "!bg-slate-700 !border !border-solid !border-slate-600 !text-slate-300",
              },
            });
          }
        }
      )
      .finally(() => {
        setResetting(false);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen px-8 space-y-8">
      <Head>
        <title>Reset Password | Microgen Extra Function - FrontEnd</title>
      </Head>

      <h3 className="text-4xl text-center">Logo</h3>

      <div className="w-full sm:w-2/3 md:w-8/12 lg:w-1/3 px-8 py-10 bg-slate-800 rounded-md border border-slate-700">
        {isSuccess ? (
          <div className="flex flex-col space-y-8 text-center items-center">
            <h4 className="text-2xl font-bold">Password reset successfully</h4>
            <p className="text-slate-400">
              Now you can login with new password. Redirecting...
            </p>
          </div>
        ) : (
          <Formik
            initialValues={resetFormValues}
            onSubmit={handleSubmit}
            validationSchema={resetFormValidationSchema}
            validateOnMount={true}
          >
            {({ errors, touched, isValid }) => (
              <Form className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-2">
                  <label htmlFor="password" className="font-semibold text-xl">
                    New Password
                  </label>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    placeholder="New Password"
                    required={true}
                    className="py-4 px-5 rounded-md bg-slate-700 text-lg"
                  />
                  {touched.password && errors.password && (
                    <p className="text-red-700">{errors.password}</p>
                  )}
                </div>
                <div className="flex flex-col space-y-2">
                  <label
                    htmlFor="password-confirmation"
                    className="font-semibold text-xl"
                  >
                    Confirm New Password
                  </label>
                  <Field
                    id="password-confirmation"
                    name="passwordConfirmation"
                    type="password"
                    placeholder="Confirm New Password"
                    required={true}
                    className="py-4 px-5 rounded-md bg-slate-700 text-lg"
                  />
                  {touched.passwordConfirmation &&
                    errors.passwordConfirmation && (
                      <p className="text-red-700">
                        {errors.passwordConfirmation}
                      </p>
                    )}
                </div>
                <div className="self-center w-full">
                  <button
                    type="submit"
                    className="transition-all uppercase font-bold bg-sky-700 py-4 px-6 rounded-md text-lg tracking-wide w-full disabled:bg-sky-900 disabled:text-slate-500"
                    disabled={!isValid || isResetting}
                  >
                    {isResetting ? "Resetting..." : "Reset"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

export default Reset;
