type ReportPriceVariant = "agency" | "selling";

type ReportPriceTabProps = {
  variant: ReportPriceVariant;
};

const SaveIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mr-2"
  >
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

const AGENCY_SUMMARY = [
  "Sub Total: $13,125,000",
  "Voucher: $0",
  "Price Total: $13,125,000",
  "Total Commission: $600,000",
];

const ReportPriceTab = ({ variant }: ReportPriceTabProps) => {
  if (variant === "selling") {
    return (
      <div className="relative min-h-[100px]">
        <div className="absolute top-0 right-0 text-[18px] font-semibold text-red-500">
          Sub Total: $13,650,000
        </div>

        <div className="absolute right-0 bottom-0">
          <button className="flex cursor-pointer items-center rounded-md bg-[#6e97c5] px-5 py-2 text-sm text-white transition-colors hover:bg-[#5e87b6]">
            <SaveIcon />
            Luu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[100px]">
      <div className="absolute top-0 right-0 space-y-1 text-right text-[18px] font-semibold text-red-500">
        {AGENCY_SUMMARY.map((summaryItem) => (
          <div key={summaryItem}>{summaryItem}</div>
        ))}
      </div>
    </div>
  );
};

export default ReportPriceTab;
