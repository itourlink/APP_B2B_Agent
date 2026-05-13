import { useMemo, useRef } from "react";
import { useListMedia } from "@/hooks/actions/useMedia";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/axios";
import { useUserStore } from "@/zustand/useUserStore";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { CONFIG } from "@/config-global";

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
    const { mediaData, refetch } =
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

    console.log(mediaData?.data?.file);
    console.log(imageFiles);
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
                // refetch?.();
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

    return (
        <div>
            <button
                onClick={handleChooseImage}
                className="px-4 py-2 bg-blue-500 text-white rounded"
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

            <div className="grid grid-cols-4 gap-4 p-4 border mt-4">
                {imageFiles.length > 0 ? (
                    imageFiles.map(
                        (
                            item: any,
                            index: number
                        ) => (
                            <div
                                key={index}
                                className="border rounded overflow-hidden"
                            >

                                <img
                                    src={`${CONFIG.serverUrl}${mediaData?.pathRoot}${item.path}`}
                                    onError={(e) => {
                                        console.log(
                                            "image error",
                                            e.currentTarget.src
                                        );
                                    }}
                                    alt={item.name}
                                    className="w-full h-40 object-cover"
                                />

                                <p className="p-2 text-sm">
                                    {item.name}
                                </p>
                            </div>
                        )
                    )
                ) : (
                    <div>
                        Không có ảnh
                    </div>
                )}
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