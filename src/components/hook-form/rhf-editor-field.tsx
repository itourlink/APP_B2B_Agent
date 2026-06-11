import { Controller, useFormContext, useFormState } from "react-hook-form";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useTranslate } from "@/locales";

type Props = {
    name: string;
    label?: string;
};

export const RHFEditorField = ({ name, label }: Props) => { 
    const { t } = useTranslate("tourcustomize")
    const { control } = useFormContext();
    const { errors } = useFormState({ name });

    const error = errors[name];

    return (
        <div className="w-full">
            {label && (
                <label className="block mb-2 text-sm font-semibold">
                    {label}
                </label>
            )}

            <div
                className={`border rounded-xl overflow-hidden ${error ? "border-red-500" : "border-gray-200"
                    }`}
            >
                <Controller
                    name={name}
                    control={control}
                    defaultValue="" // 👉 tránh warning uncontrolled
                    render={({ field }) => (
                        <CKEditor
                            editor={ClassicEditor as any}
                            data={field.value || ""}
                            config={{
                                placeholder:t("enterContent"),
                                toolbar: [
                                    "heading",
                                    "|",
                                    "bold",
                                    "italic",
                                    "link",
                                    "bulletedList",
                                    "numberedList",
                                    "blockQuote",
                                    "|",
                                    "insertTable",
                                    "mediaEmbed",
                                    "undo",
                                    "redo",
                                ],
                            }}
                            onChange={(_, editor) => {
                                field.onChange(editor.getData());
                            }}
                            onBlur={() => field.onBlur()}
                        />
                    )}
                />
            </div>

            {/* ERROR */}
            {error && (
                <p className="text-red-500 text-xs mt-1">
                    {String(error.message)}
                </p>
            )}
        </div>
    );
};