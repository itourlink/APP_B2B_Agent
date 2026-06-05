import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useToastStore } from "@/zustand/useToastStore";

interface AddTourCustomizeProps {
  onClose: () => void;
  strTourCustomizedGUID: string;
  intDayOrder: number;
  onAddLocalDay?: (day: any) => void;
}

interface FormValues {
  strDayTitle: string;
}

const AddTourCustomize = ({
  onClose,
  strTourCustomizedGUID,
  onAddLocalDay,
}: AddTourCustomizeProps) => {
  const { showToast } = useToastStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      strDayTitle: "",
    },
  });

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("FORM ERROR", errors);
    }
  }, [errors]);

  const onSubmit = (data: FormValues) => {
    if (!strTourCustomizedGUID) {
      showToast("error", "Không tìm thấy tour");
      return;
    }

    onAddLocalDay?.({
      strTourCustomizedDayGUID: crypto.randomUUID(),
      strDayTitle: data.strDayTitle,
      strDateDay: "",
      strListLocation: "",
      isLocal: true,
    });

    reset();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-1">

      {/* TITLE */}
      <div className="space-y-1.5">
        <label className="text-[13px] font-medium text-gray-700">
          Day title <span className="text-red-500">*</span>
        </label>

        <input
          {...register("strDayTitle", {
            required: "Vui lòng nhập tiêu đề",
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm"
          style={{ height: "40px" }}
          placeholder="Nhập tiêu đề ngày..."
        />

        {errors.strDayTitle && (
          <span className="text-red-500 text-[11px]">
            {errors.strDayTitle.message}
          </span>
        )}
      </div>

      {/* BUTTON */}
      <div className="flex justify-start pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-2 bg-[#004b91] text-white rounded-md font-medium text-sm h-[36px] hover:bg-[#003c73] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Đang xử lý..." : "Lưu"}
        </button>
      </div>
    </form>
  );
};

export default AddTourCustomize;