import { useMemo, useRef, useState } from "react";
import { useListMedia } from "@/hooks/actions/useMedia";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/axios";
import { useUserStore } from "@/zustand/useUserStore";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { CONFIG } from "@/config-global";
import clsx from "clsx";

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
    const { mediaData } = useListMedia();

    const { user } = useUserStore();
    const queryClient = useQueryClient();

    const inputRef =
        useRef<HTMLInputElement>(null);

    const [selectedImage, setSelectedImage] =
        useState<any>(null);

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

    const {
        mutate: uploadFilesMediaApi,
        isPending,
    } = useMutation({
        mutationFn: (body: FormData) =>
            uploadFilesMedia(
                body,
                user?.strCompanyCode
            ),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [
                    QUERY_KEYS.MEDIA.LIST_MEDIA,
                ],
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

        if (!file) return;

        const formData = new FormData();

        formData.append(file.name, file);

        uploadFilesMediaApi(formData);
    };

    const getImageUrl = (path: string) => {
        return `${CONFIG.serverUrlSP}${path.replace(
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

            <div className="max-h-[600px]">
                <div className="grid grid-cols-3 gap-4 p-4 mt-4">
                    {imageFiles.length > 0 ? (
                        imageFiles.map(
                            (
                                item: any,
                                index: number
                            ) => {
                                const isActive =
                                    selectedImage?.path ===
                                    item.path;

                                return (
                                    <div
                                        key={index}
                                        onClick={() =>
                                            setSelectedImage(
                                                item
                                            )
                                        }
                                        className={clsx(
                                            "rounded overflow-hidden border p-2 cursor-pointer transition-all duration-200",
                                            isActive
                                                ? "border-[#2566b0] ring-2 ring-[#2566b0] bg-blue-50"
                                                : "border-slate-200 hover:border-[#2566b0]"
                                        )}
                                    >
                                        <img
                                            src={getImageUrl(
                                                item.path
                                            )}
                                            alt={
                                                item.name
                                            }
                                            className="w-30 h-30 object-cover"
                                        />

                                        <p className="text-sm break-all pt-2">
                                            {
                                                item.name
                                            }
                                        </p>
                                    </div>
                                );
                            }
                        )
                    ) : (
                        <div>Không có ảnh</div>
                    )}
                </div>
            </div>

            {selectedImage && (
                <div className="flex justify-end px-4 pt-10">
                    <button className="px-5 py-2 rounded bg-[#2566b0] hover:bg-[#1d4f87] text-white cursor-pointer">
                        Chọn
                    </button>
                </div>
            )}
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


