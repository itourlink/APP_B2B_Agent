import { paths } from "@/routes/paths";
import {
    Info, ClipboardList, Quote, Package, MessageSquare,
    Tag, BarChart3, CheckCircle2, Users, Map
} from "lucide-react";

export const SIDEBAR_DATA = [
    { title: "Thông tin", path: paths.content.info, icon: Info },
    {
        title: "Danh sách yêu cầu",
        path: "",
        icon: ClipboardList,
        children: [
            {
                title: "Booking Request",
                path: paths.content.requestBooking,
                matchPaths: [
                    paths.content.requestBooking,
                    paths.content.detailRequest,
                ]
            },
            {
                title: "Yêu cầu Customize", path: paths.content.requestCustomize,
                matchPaths: [
                    paths.content.requestCustomize,
                    paths.content.detailRequestCustomize
                ]
            },
        ],
    },
    {
        title: "Danh sách báo giá", path: paths.content.quote, icon: Quote,
        matchPaths: [
            paths.content.quote,
            paths.content.detaiQuote,
        ]
    },
    {
        title: "Danh sách Đặt DV", path: paths.content.service, icon: Package,
        matchPaths: [
            paths.content.service,
            paths.content.detailService,
        ]
    },
    { title: "Danh sách phản hồi", path: paths.content.feedback, icon: MessageSquare },
    { title: "Kênh giá", path: paths.content.pricing, icon: Tag },
    { title: "Báo cáo khoản thu chi", path: paths.content.reportFinance, icon: BarChart3 },
    { title: "Báo cáo khoản đã duyệt", path: paths.content.reportApproved, icon: CheckCircle2 },
    { title: "Danh sách đại lý liên kết", path: paths.content.agent, icon: Users },
    {
        title: "Tour Customized",
        path: "",
        icon: Map,
        children: [
            { title: "Đề xuất", path: paths.content.tourProposals },
            { title: "Đặt", path: paths.content.tourBookings },
            { title: "Hủy", path: paths.content.tourCancelled },
        ],
    },
];

export interface ISidebarChildren {
    title: string;
    path: string;
    matchPaths?: string[];
}

export interface ISidebarProps {
    title: string;
    path: string;
    icon?: any;
    children?: ISidebarChildren[];
    matchPaths?: string[];
}