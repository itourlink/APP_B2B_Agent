import PrimaryButton from "@/components/button/primary-button";
import Pagination from "@/components/pagination/pagination";
import PanelPopup from "@/components/popup/panel-popup";
import { TableCore, type ColumnDef } from "@/components/table/table-core";
import { fDateTime } from "@/utils/format-time";
import { Calendar, CreditCard, Edit3, Globe, Landmark, PlusCircle, RotateCcw, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import CustomFilter from "@/components/form/custom-filter";
import AddAccountBank from "./add-account-bank";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { useFilterCompanyBankAccount, useGetFilterCompanyBankAccount } from "@/hooks/actions/useUser";
import type { ICompanyBankAccount } from "@/hooks/interfaces/user";
import { useUserStore } from "@/zustand/useUserStore";
import UpdateAccountBank from "./update-account-bank";
import DeleteAccountBank from "./delele-account-bank";

const BankAccount = () => {
    const [open, setOpen] = useState({
        add: false,
        update: false,
        delete: false
    })
    const [filters, setFilters] = useState({
        nameAccount: "",
        idAccount: "",
        idSwift: "",
        addRess: "",
    });

    const [listSearch, setListSearch] = useState<ICompanyBankAccount[]>([]);
    const [item, setItem] = useState<ICompanyBankAccount | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const { mutate: useGetFilterCompanyBankAccountApi, isPending: isSearchLoading } = useMutation({
        mutationFn: useGetFilterCompanyBankAccount,
    });
    const safeValue = (val: string) => val.replace(/'/g, "''");

    const buildWhere = () => {
        let where = "";

        if (filters.nameAccount) {
            where += ` AND MB28.MB28_CompanyBankAccountName LIKE N'%${safeValue(filters.nameAccount)}%'`;
        }

        if (filters.idAccount) {
            where += ` AND MB28.MB28_CompanyBankAccountCode LIKE N'%${safeValue(filters.idAccount)}%'`;
        }

        if (filters.idSwift) {
            where += ` AND MB28.MB28_SwiftCode LIKE N'%${safeValue(filters.idSwift)}%'`;
        }

        if (filters.addRess) {
            where += ` AND MB28.MB28_BankAddress LIKE N'%${safeValue(filters.addRess)}%'`;
        }

        return where || null;
    };

    const handleSearch = () => {
        const payload = {
            strAgentCode: user?.strAgentCode,
            strOrder: null,
            strCompanyGUID: null,
            intCurPage: 1,
            intPageSize: pageSize,
            strWhere: buildWhere(),
            tblsReturn: "[0]",
        };

        setPage(1);

        setIsSearching(true);
        useGetFilterCompanyBankAccountApi(payload, {
            onSuccess: (res) => {
                setListSearch(res?.[0] ?? []);
            },
        });
    };

    const handleReset = () => {
        setFilters({
            nameAccount: "",
            idAccount: "",
            idSwift: "",
            addRess: "",
        });
        setListSearch([]);
        setPage(1);
        setIsSearching(false);
    };

    const user = useUserStore((state) => state.user);
    const [page, setPage] = useState(1);
    const pageSize = 5;
    const { data, isLoading, isError } = useQuery({
        queryKey: [QUERY_KEYS.USER.LIST_COMPANY_BANK_ACCOUNT, page],
        queryFn: () =>
            useFilterCompanyBankAccount({
                strAgentCode: user?.strAgentCode,
                strOrder: null,
                strCompanyGUID: null,
                intCurPage: page,
                intPageSize: pageSize,
                strWhere: null,
                tblsReturn: "[0]"
            }),
        placeholderData: keepPreviousData,
    });

    const listData = isSearching ? listSearch : (data?.[0] ?? []);
    const totalRecords = listData?.[0]?.intTotalRecords || 0;
    const totalPages = Math.ceil(totalRecords / pageSize);

    useEffect(() => {
        if (page > totalPages) {
            setPage(1);
        }
    }, [totalPages]);

    const colDefs: ColumnDef<ICompanyBankAccount>[] = [
        {
            field: "No",
            headerName: "STT",
            render: (value) => <span className="text-gray-400 font-medium">{value}</span>
        },

        {
            field: "strNameDisplay",
            headerName: "Tên hiển thị",
            render: (value) => (
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-50 text-[#004b91] rounded-lg">
                        <Landmark size={16} />
                    </div>
                    <span className="font-bold text-gray-800">{value}</span>
                </div>
            )
        },

        {
            field: "strCompanyBankAccountInfo",
            headerName: "Ngân hàng & Chi nhánh",
            render: (value, row) => (
                <div className="flex flex-col py-1">
                    <span className="font-medium text-gray-700">{value}</span>
                    <span className="text-[11px] text-gray-500 flex items-center gap-1 mt-1">
                        <Globe size={10} /> {row.strBankAddress}
                    </span>
                </div>
            )
        },

        {
            field: "strCompanyBankAccountName",
            headerName: "Chủ tài khoản",
            render: (value) => (
                <div className="flex items-center gap-2 text-sm uppercase font-semibold text-gray-600">
                    <CreditCard size={14} className="text-gray-400" />
                    {value}
                </div>
            )
        },

        {
            field: "strCompanyBankAccountCode",
            headerName: "Số TK / SWIFT",
            render: (_, row) => (
                <div className="flex flex-col">
                    <span className="text-[#004b91] font-mono font-bold">{row.strCompanyBankAccountCode}</span>
                    <span className="text-[10px] text-orange-600 font-semibold bg-orange-50 px-1.5 py-0.5 rounded w-fit mt-1">
                        SWIFT: {row.strSwiftCode}
                    </span>
                </div>
            )
        },

        {
            field: "dtmCreatedDate",
            headerName: "Ngày tạo",
            render: (value) => (
                <div className="text-xs text-gray-500 flex items-center gap-1.5">
                    <Calendar size={13} className="text-gray-400" />
                    {fDateTime(value)}
                </div>
            ),
        },
        {
            field: "dtmLastUpdatedDate",
            headerName: "Ngày cập nhật",
            render: (value) => (
                <div className="text-xs text-gray-500 flex items-center gap-1.5">
                    <Calendar size={13} className="text-gray-400" />
                    {fDateTime(value)}
                </div>
            ),
        },

        {
            field: "No",
            headerName: "Thao tác",
            render: (_, row) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => {
                            setItem(row);
                            setOpen(prev => ({ ...prev, update: true }));
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Chỉnh sửa"
                    >
                        <Edit3 size={18} />
                    </button>
                    <button
                        onClick={() => {
                            setItem(row);
                            setOpen(prev => ({ ...prev, delete: true }));
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Xóa"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            ),
        },
    ];


    const onChangeFilters = (key: string, value: string | number) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    return (
        <div>
            <div className="pt-4">
                <PrimaryButton
                    text="Thêm tài khoản ngân hàng"
                    isLoading={false}
                    className="bg-[#4e6d9a] hover:bg-[#3d567a] rounded-lg w-fit text-sm font-medium transition shadow-sm"
                    prefixIcon={<PlusCircle size={18} />}
                    onClick={() => { setOpen((prev) => ({ ...prev, add: true })) }}
                />
            </div>
            <div className="mt-4">
                <CustomFilter
                    onChangeFilters={onChangeFilters}
                    search={[
                        {
                            keySearch: "nameAccount",
                            value: filters.nameAccount,
                            placeHoder: "Tên tài khoản",
                        },
                        {
                            keySearch: "idAccount",
                            value: filters.idAccount,
                            placeHoder: "Mã tài khoản",
                        },
                        {
                            keySearch: "idSwift",
                            value: filters.idSwift,
                            placeHoder: "Mã Swift",
                        },
                        {
                            keySearch: "addRess",
                            value: filters.addRess,
                            placeHoder: "Địa chỉ",
                        },
                    ]}

                />
                <div className="flex gap-2 mt-3">
                    <PrimaryButton
                        text="Tìm kiếm"
                        onClick={handleSearch}
                        className="bg-[#4e6d9a] hover:bg-[#3d567a] rounded-lg px-4 py-2 text-sm w-fit"
                        prefixIcon={<Search size={18} />}
                    />

                    <PrimaryButton
                        text="Reset"
                        onClick={handleReset}
                        className="bg-gray-200 hover:bg-gray-300 text-black rounded-lg px-4 py-2 text-sm w-fit"
                        prefixIcon={<RotateCcw size={18} />}
                    />
                </div>
                <div className="mt-4"></div>

                <TableCore
                    rowData={listData ?? []}
                    columnDefs={colDefs}
                    loading={isLoading || isSearchLoading}
                />

                {!isError && (
                    <Pagination
                        currentPage={page}
                        onPageChange={(value) => setPage(value)}
                        totalPages={totalPages || 1}
                    />
                )}


                {open.add && (
                    <PanelPopup open={open.add} onClose={() => setOpen((prev) => ({ ...prev, add: false }))} title="Thêm tài khoản ngân hàng">
                        <AddAccountBank onClose={() => setOpen(prev => ({ ...prev, add: false }))} />
                    </PanelPopup>
                )}
                {open.update && (
                    <PanelPopup
                        open={open.update}
                        onClose={() => setOpen(prev => ({ ...prev, update: false }))}
                        title="Cập nhật tài khoản ngân hàng"
                    >
                        <UpdateAccountBank item={item} onClose={() => setOpen(prev => ({ ...prev, update: false }))} />
                    </PanelPopup>
                )}
                {open.delete && (
                    <PanelPopup
                        open={open.delete}
                        onClose={() => setOpen(prev => ({ ...prev, delete: false }))}
                        title="Xác nhận xóa tài khoản ngân hàng"
                    >
                        <DeleteAccountBank item={item} onClose={() => setOpen(prev => ({ ...prev, delete: false }))} />
                    </PanelPopup>
                )}
            </div>
        </div>
    )
}

export default BankAccount