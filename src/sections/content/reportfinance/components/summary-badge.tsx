
interface SummaryBadgeProps {
  label: string;
  value: number;
  color?: string; 
}

const SummaryBadge = ({ label, value, color = "text-[#0066b2]" }: SummaryBadgeProps) => {
  return (
    <div className="inline-flex items-center px-5 py-2.5 bg-white border border-gray-200 rounded-2xl shadow-sm transition-all hover:shadow-md">
      <span className="text-gray-700 text-[13px] font-medium flex items-center gap-1">
        {label}:
        <span className={`${color} font-normal underline decoration-blue-200 underline-offset-4 ml-0.5`}>
          đ{new Intl.NumberFormat('vi-VN').format(value)}
        </span>
      </span>
    </div>
  );
};

export default SummaryBadge;