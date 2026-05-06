import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAddDayTourCustomized } from "@/hooks/actions/useUser";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { useToastStore } from "@/zustand/useToastStore";
import PrimaryButton from "@/components/button/primary-button";
import { useEffect } from "react";


interface AddTourCustomizeProps {
  onClose: () => void;
  strTourCustomizedGUID: string;
  intDayOrder: number;
}

interface FormValues {
  strDayTitle: string;
}

const AddTourCustomize = ({
  onClose,
  strTourCustomizedGUID,
  intDayOrder,
}: AddTourCustomizeProps) => {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();
  const location = useLocation();
  const item = location.state?.item;
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      strDayTitle: "",
    },
  });

  // Log lỗi validation nếu có
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("--- Form Errors ---", errors);
    }
  }, [errors]);

  const { mutate: addDayApi, isPending } = useMutation({
    mutationFn: (payload: any) => useAddDayTourCustomized(payload),
    onSuccess: (res) => {
      console.log("--- API Success ---", res);
      showToast("success", "Thêm ngày mới thành công");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TOUR.LIST_TOUR_CUSTOMIZE_DETAIL],
      });
      onClose();
    },
    onError: (error) => {
      console.error("--- API Error ---", error);
      showToast("error", "Có lỗi xảy ra khi thêm ngày");
    },
  });

  const onSubmit = (data: FormValues) => {
    const finalGUID = item?.strTourCustomizedGUID || strTourCustomizedGUID;
    
    if (!finalGUID) {
      console.error("LỖI: Không tìm thấy GUID của Tour!");
      // showToast("error", "Lỗi: Không tìm thấy thông tin Tour");
      return;
    }

    addDayApi({
      strTourCustomizedGUID: finalGUID,
      strDayTitle: data.strDayTitle,
      intDayOrder,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-1">
      <div className="space-y-1.5">
        <label className="text-[13px] font-medium text-gray-700">
          Day title <span className="text-red-500">*</span>
        </label>
        <input
          {...register("strDayTitle", { required: "Vui lòng nhập tiêu đề" })}
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

      <div className="flex justify-start pt-2">
        <PrimaryButton
          type="submit"
          isLoading={isPending}
          text={isPending ? "Đang lưu..." : "Lưu"}
          className="px-8 py-2 bg-[#004b91] text-white rounded-md font-medium text-sm h-[36px] w-auto"
        />
      </div>
    </form>
  );
};

export default AddTourCustomize;