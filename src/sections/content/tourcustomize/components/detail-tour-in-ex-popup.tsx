import { useEffect, useState } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import PanelPopup from "@/components/popup/panel-popup";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import {
  useListTourCustomizedInExService,
  useUpdTourCustomizedInExclude,
} from "@/hooks/actions/useUser";
import { useToastStore } from "@/zustand/useToastStore";
import { useUserStore } from "@/zustand/useUserStore";

export interface DetailTourInExPopupItem {
  id: string | number;
  supplierType: string;
  content: string;
  checked?: boolean;
}

export interface DetailTourInExPopupData {
  includeItems: DetailTourInExPopupItem[];
  excludeItems: DetailTourInExPopupItem[];
}

export interface DetailTourInExApiItem {
  excludeID?: string;
  include?: string;
  strInExName?: string;
  inIsSelected?: boolean;
  isInclude?: boolean;
  CateName?: string;
}

interface DetailTourInExPopupProps {
  open: boolean;
  onClose: () => void;
  strTourCustomizedGUID?: string;
  onSave?: (data: DetailTourInExPopupData) => void;
  loading?: boolean;
}

interface UpdateResponse {
  data?: DetailTourInExApiItem[][];
  isSuccess?: boolean;
  message?: string | null;
  errors?: unknown;
}

const sectionCardClassName =
  "rounded-2xl border border-gray-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]";

const textareaClassName =
  "min-h-[62px] w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2 text-[12px] leading-5 text-gray-700 outline-none transition focus:border-[#2f69b1] focus:ring-1 focus:ring-[#2f69b1]";

export const getTourCustomizedInExQueryKey = (
  strTourCustomizedGUID?: string
) =>
  [QUERY_KEYS.USER.LIST_TOUR_CUSTOMIZED_INEX, strTourCustomizedGUID] as const;

export const mapPopupItem = (
  entry: DetailTourInExApiItem
): DetailTourInExPopupItem => ({
  id:
    entry?.excludeID ||
    `${entry?.CateName || "unknown"}-${entry?.strInExName || entry?.include || "empty"}`,
  supplierType: entry?.CateName || "",
  content: entry?.strInExName || entry?.include || "",
  checked: Boolean(entry?.inIsSelected),
});

export const mapApiListToPopupData = (
  listData: DetailTourInExApiItem[]
): DetailTourInExPopupData => ({
  includeItems: listData.filter((entry) => entry?.isInclude).map(mapPopupItem),
  excludeItems: listData.filter((entry) => !entry?.isInclude).map(mapPopupItem),
});

const renderSection = (
  title: string,
  items: DetailTourInExPopupItem[],
  loading: boolean,
  error: boolean,
  onToggle: (index: number, checked: boolean) => void,
  onContentChange: (index: number, value: string) => void
) => {
  return (
    <div className={sectionCardClassName}>
      <div className="mb-3 text-[15px] font-semibold text-gray-800">{title}</div>

      <div className="grid grid-cols-[28px_110px_minmax(0,1fr)] items-center gap-x-3 border-b border-gray-200 px-1 pb-2 text-[12px] font-semibold text-[#2f69b1]">
        <div>
          <input
            type="checkbox"
            checked
            readOnly
            className="h-3.5 w-3.5 cursor-default accent-[#1677ff]"
          />
        </div>
        <div>Supplier type</div>
        <div>Content</div>
      </div>

      <div className="mt-2 space-y-2">
        {loading ? (
          [...Array(4)].map((_, index) => (
            <div
              key={`${title}-loading-${index}`}
              className="grid grid-cols-[28px_110px_minmax(0,1fr)] items-start gap-x-3 rounded-lg px-1 py-1"
            >
              <div className="pt-2">
                <div className="h-3.5 w-3.5 animate-pulse rounded-sm bg-gray-200" />
              </div>

              <div className="pt-2">
                <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
              </div>

              <div className="h-[62px] animate-pulse rounded-md bg-gray-100" />
            </div>
          ))
        ) : error ? (
          <div className="px-1 py-6 text-center text-sm text-red-500">
            Failed to load data
          </div>
        ) : items.length === 0 ? (
          <div className="px-1 py-6 text-center text-sm text-gray-500">
            No data
          </div>
        ) : (
          items.map((item, index) => (
            <div
              key={item.id}
              className="grid grid-cols-[28px_110px_minmax(0,1fr)] items-start gap-x-3 rounded-lg px-1 py-1"
            >
              <div className="pt-2">
                <input
                  type="checkbox"
                  checked={item.checked ?? false}
                  onChange={(event) => onToggle(index, event.target.checked)}
                  className="h-3.5 w-3.5 accent-[#1677ff]"
                />
              </div>

              <div className="pt-2 text-[12px] font-medium text-gray-700">
                {item.supplierType}
              </div>

              <textarea
                value={item.content}
                onChange={(event) => onContentChange(index, event.target.value)}
                className={textareaClassName}
                rows={3}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const DetailTourInExPopup = ({
  open,
  onClose,
  strTourCustomizedGUID,
  onSave,
  loading,
}: DetailTourInExPopupProps) => {
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);
  const { showToast } = useToastStore();

  const [includeDraft, setIncludeDraft] = useState<DetailTourInExPopupItem[]>([]);
  const [excludeDraft, setExcludeDraft] = useState<DetailTourInExPopupItem[]>([]);
  const [loadedData, setLoadedData] = useState<DetailTourInExPopupData>({
    includeItems: [],
    excludeItems: [],
  });

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: getTourCustomizedInExQueryKey(strTourCustomizedGUID),
    queryFn: () =>
      useListTourCustomizedInExService({
        strTourCustomizedGUID: strTourCustomizedGUID,
        IsSelected: null,
      }),
    placeholderData: keepPreviousData,
    enabled: open && !!strTourCustomizedGUID,
  });

  const {
    mutateAsync: updateInExcludeAsync,
    isPending: isSaving,
  } = useMutation({
    mutationFn: useUpdTourCustomizedInExclude,
  });

  useEffect(() => {
    if (!open) return;

    const listData: DetailTourInExApiItem[] = data?.[0] ?? [];
    const nextData = mapApiListToPopupData(listData);

    setIncludeDraft(nextData.includeItems);
    setExcludeDraft(nextData.excludeItems);
    setLoadedData(nextData);
  }, [open, data]);

  const handleSave = async () => {
    if (!user?.strUserGUID || !strTourCustomizedGUID) {
      showToast("error", "Missing user or tour information");
      return;
    }

    const draftItems = [...includeDraft, ...excludeDraft];
    const sourceMap = new Map(
      [...loadedData.includeItems, ...loadedData.excludeItems].map((item) => [
        String(item.id),
        item,
      ])
    );

    const changedItems = draftItems.filter((item) => {
      const sourceItem = sourceMap.get(String(item.id));
      return (sourceItem?.content || "") !== item.content;
    });

    if (changedItems.length === 0) {
      onSave?.({
        includeItems: includeDraft,
        excludeItems: excludeDraft,
      });
      onClose();
      return;
    }

    try {
      let latestResponseList: DetailTourInExApiItem[] | null = null;

      for (const item of changedItems) {
        const response = (await updateInExcludeAsync({
          strUserGUID: user.strUserGUID,
          strTourCustomizedGUID,
          strTourCustomizedInExcludeGUID: item.id,
          strInExName: item.content,
          IsRefresh: true,
        })) as UpdateResponse;

        if (response?.isSuccess === false) {
          throw new Error(response?.message || "Update failed");
        }

        const nextListData = Array.isArray(response?.data?.[0])
          ? response.data[0]
          : null;

        if (nextListData) {
          latestResponseList = nextListData;
        }
      }

      const nextData =
        latestResponseList !== null
          ? mapApiListToPopupData(latestResponseList)
          : {
              includeItems: includeDraft,
              excludeItems: excludeDraft,
            };

      setIncludeDraft(nextData.includeItems);
      setExcludeDraft(nextData.excludeItems);
      setLoadedData(nextData);

      if (latestResponseList !== null) {
        queryClient.setQueryData(
          getTourCustomizedInExQueryKey(strTourCustomizedGUID),
          [latestResponseList]
        );
      }

      await queryClient.invalidateQueries({
        queryKey: getTourCustomizedInExQueryKey(strTourCustomizedGUID),
      });

      onSave?.(nextData);
      showToast("success", "Cập nhật thành công");
      onClose();
    } catch (saveError: any) {
      showToast("error", saveError?.message || "Cập nhật thất bại");
    }
  };

  const isTableLoading = isLoading || isFetching;
  const isCheckboxInteractive = false;

  return (
    <PanelPopup
      open={open}
      onClose={onClose}
      title="Update Include/Exclude"
      className="w-[1150px] max-w-[96vw]"
      footer={
        <div className="flex items-center justify-between gap-3">
          {/* <div className="text-xs text-gray-500">
            Checkbox state is read-only until the backend exposes a save field for it.
          </div> */}

          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={loading || isTableLoading || isSaving}
            className="cursor-pointer rounded bg-[#004b91] px-5 py-2 text-[13px] font-semibold text-white transition hover:bg-[#003d75] disabled:opacity-50"
          >
            {loading || isSaving ? "Lưu..." : "Lưu"}
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {renderSection(
          "Include",
          includeDraft,
          isTableLoading,
          !!error,
          (index, checked) => {
            if (!isCheckboxInteractive) return;

            setIncludeDraft((prev) =>
              prev.map((item, itemIndex) =>
                itemIndex === index ? { ...item, checked } : item
              )
            );
          },
          (index, value) => {
            setIncludeDraft((prev) =>
              prev.map((item, itemIndex) =>
                itemIndex === index ? { ...item, content: value } : item
              )
            );
          }
        )}

        {renderSection(
          "Exclude",
          excludeDraft,
          isTableLoading,
          !!error,
          (index, checked) => {
            if (!isCheckboxInteractive) return;

            setExcludeDraft((prev) =>
              prev.map((item, itemIndex) =>
                itemIndex === index ? { ...item, checked } : item
              )
            );
          },
          (index, value) => {
            setExcludeDraft((prev) =>
              prev.map((item, itemIndex) =>
                itemIndex === index ? { ...item, content: value } : item
              )
            );
          }
        )}
      </div>
    </PanelPopup>
  );
};

export default DetailTourInExPopup;
