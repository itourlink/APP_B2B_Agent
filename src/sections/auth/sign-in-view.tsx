import CloseCircleIcon from "@/assets/icons/auth/close-circle-icon";
import CloseEyeIcon from "@/assets/icons/auth/close-eye-icon";
import EyeIcon from "@/assets/icons/auth/eye-icon";
import PrimaryButton from "@/components/button/primary-button";
import { Field, Form } from "@/components/hook-form";
import { useBoolean } from "@/hooks/components/use-boolean";
// import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z as zod } from "zod";
import AuthBox from "./components/auth-box";
// import { useLogin } from "@/hooks/actions/useAuth";
import { useSearchParams } from "react-router-dom";
// import { useToastStore } from "@/zustand/useToastStore";
const SignInView = () => {
  const { t } = useTranslation("auth");
  const { value: showPassword, onToggle } = useBoolean();
  const [searchParams] = useSearchParams();
  // const { showToast } = useToastStore()
  const appId = searchParams.get("app_id") ?? "";
  const challengeCode = searchParams.get("challenge_code") ?? "";
  const state = searchParams.get("state") ?? "";

  // const { mutate: loginApi, isPending: isLoading } = useMutation({
  //   mutationFn: useLogin,
  // });

  type SchemaType = zod.infer<typeof Schema>;

  const defaultValues = {
    email: "", password: "", appId: "",
    challengeCode: "",
    state: ""
  };

  const Schema = zod.object({
    email: zod
      .string()
      .trim()
      .min(1, { message: t("emailRequired") })
      .email({ message: t("emailMust") }),
    password: zod.string().min(1, { message: t("passwordRequired") }),
  });
  const methods = useForm<SchemaType>({
    resolver: zodResolver(Schema),
    defaultValues,
  });
  const { handleSubmit, formState } = methods;
  const { isValid } = formState;

  const onSubmit = handleSubmit(async (data) => {
    const payload = {
      ...data,
      appId,
      challengeCode,
      state,
    };

    console.log("payload:", payload);

    // loginApi(payload, {
    //   onSuccess: () => {
    //     showToast("success", "Đăng nhập thành công");
    //   },
    //   onError: (error: any) => {
    //     const code = error?.response?.data?.code;
    //     if (code === "LOGIN_INVALID_CREDENTIALS") {
    //       showToast("error", "Email hoặc mật khẩu không chính xác");
    //     } else if (code === "LOGIN_USER_NOT_ACTIVE") {
    //       showToast("error", "Tài khoản không hoạt động");
    //     } else if (code === "LOGIN_ACCOUNT_TYPE_NOT_PERMITTED") {
    //       showToast("error", "Loại tài khoản không được phép đăng nhập vào ứng dụng");
    //     } else {
    //       showToast("error", "Đăng nhập thất bại");
    //     }
    //   },
    // });
  });

  const renderForm = (
    <div className=" w-full ">
      <div className="mt-2 flex flex-col items-start gap-3 w-full">
        <Field.Text
          label={{
            text: "Email",
            icon: <span className="text-red-500">*</span>,
          }}
          name="email"
          placeholder={t("enterEmail")}
          InputProps={{
            endAdornment: (
              <button
                type="reset"
                tabIndex={-1}
                onClick={() => methods.setValue("email", "")}
                className="cursor-pointer"
              >
                <CloseCircleIcon />
              </button>
            ),
          }}
        />
      </div>
      <div className="mt-2 flex flex-col items-start gap-3 w-full">
        <Field.Text
          label={{
            text: t("password"),
            icon: <span className="text-red-500">*</span>,
          }}
          name="password"
          placeholder={t("enterPassword")}
          type={showPassword ? "text" : "password"}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: (
              <button
                type="reset"
                tabIndex={-1}
                onClick={() => onToggle()}
                className="cursor-pointer"
              >
                {showPassword ? <CloseEyeIcon /> : <EyeIcon />}
              </button>
            ),
          }}
        />
      </div>

      <div className="mt-2.5 flex items-center justify-end w-full">
        <button
          type="reset"
          onClick={() => {
            // router.push(paths.auth.forgotPass);
          }}
          className="text-[14px] text-white cursor-pointer hover:underline underline-offset-4"
        >
          {t("forgotPassword")}
        </button>
      </div>
      <div className="mt-7 flex flex-col gap-4">
        <PrimaryButton
          text={t("login")}
          // isLoading={isLoading}
          disabled={!isValid}
          className={`${isValid ? "cursor-pointer" : "cursor-default"}`}
        />
      </div>

    </div>
  );

  return (
    <AuthBox title={t("login")} subtitle={t("noAccount")} link={t("register")}>
      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>
    </AuthBox>
  );
};

export default SignInView;
