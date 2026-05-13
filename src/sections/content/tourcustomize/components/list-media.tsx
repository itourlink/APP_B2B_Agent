import { useMemo, useRef } from "react";
import { useListMedia } from "@/hooks/actions/useMedia";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/axios";
import { useUserStore } from "@/zustand/useUserStore";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";

const IMAGE_EXTENSIONS = [
    "jpg",
    "jpeg",
    "png",
    "webp",
    "gif",
    "svg",
    "bmp",
    "avif",
];

const ListMedia = () => {
    const { mediaData } =
        useListMedia();

    const { user } = useUserStore();
    const queryClient = useQueryClient();

    const inputRef =
        useRef<HTMLInputElement>(null);

    const imageFiles = useMemo(() => {
        const files = mediaData?.file || [];

        return files.filter((item: any) => {
            const fileName =
                item.name?.toLowerCase();

            return IMAGE_EXTENSIONS.some((ext) =>
                fileName?.endsWith(`.${ext}`)
            );
        });
    }, [mediaData]);

    const { mutate: uploadFilesMediaApi, isPending } =
        useMutation({
            mutationFn: (
                body: FormData
            ) =>
                uploadFilesMedia(
                    body,
                    user?.strCompanyCode
                ),

            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: [QUERY_KEYS.MEDIA.LIST_MEDIA],
                });
            },

            onError: (error) => {
                console.log(
                    "upload error",
                    error
                );
            },
        });

    const handleChooseImage = () => {
        inputRef.current?.click();
    };

    const handleUploadImage = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        console.log("selected file", file);

        if (!file) return;

        const formData = new FormData();

        formData.append(file.name, file);

        uploadFilesMediaApi(formData);
    };

    const getImageUrl = (path: string) => {
        return `https://localhost:7153/${path.replace(
            /^\//,
            ""
        )}`;
    };
    return (
        <div>
            <button
                onClick={handleChooseImage}
                className="px-4 py-2 bg-[#004b91] hover:bg-[#003d75] text-white rounded cursor-pointer"
            >
                {isPending
                    ? "Uploading..."
                    : "Up ảnh"}
            </button>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleUploadImage}
            />

            <div className="max-h-[600px] overflow-y-auto">
                <div className="grid grid-cols-3 gap-4 p-4 mt-4">
                    {imageFiles.length > 0 ? (
                        imageFiles.map(
                            (
                                item: any,
                                index: number
                            ) => (
                                <div
                                    key={index}
                                    className="rounded overflow-hidden border border-slate-200 p-2"
                                >
                                    <img
                                        src={getImageUrl(
                                            item.path
                                        )}
                                        onError={(e) => {
                                            console.log(
                                                "image error",
                                                e.currentTarget
                                                    .src
                                            );
                                        }}
                                        alt={item.name}
                                        className="w-30 h-30 object-cover"
                                    />

                                    <p className="text-sm break-all pt-2">
                                        {item.name}
                                    </p>
                                </div>
                            )
                        )
                    ) : (
                        <div>Không có ảnh</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ListMedia;

const uploadFilesMedia = async (
    body: FormData,
    companyCode?: string
) => {
    const res = await apiClient.post(
        `system/UploadFiles?path=Agent/${companyCode}//`,
        body,
        {
            headers: {
                "Content-Type":
                    "multipart/form-data",
            },
        }
    );

    return res.data;
};