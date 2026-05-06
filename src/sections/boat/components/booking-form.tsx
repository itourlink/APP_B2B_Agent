const BookingForm = () => {
    return (
        <div>
            <div className="w-full lg:w-[350px]">
                <div className="sticky top-32 bg-white p-6 rounded-2xl border border-slate-200 shadow-xl">
                    <h2 className="text-[#2566b0] text-2xl font-bold mb-6">Đặt tàu</h2>

                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold mb-1">
                                Ngày khởi hành <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#2566b0] focus:border-transparent outline-none"
                            />
                        </div>

                        <div>
                            <select className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none">
                                <option>1 N.Lớn - 0 T.Em</option>
                                <option>2 N.Lớn - 1 T.Em</option>
                            </select>
                        </div>

                        <button className="w-full bg-[#2566b0] hover:bg-[#1e5492] text-white font-bold py-3 rounded-xl transition-all shadow-lg active:scale-[0.98]">
                            KIỂM TRA GIÁ
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default BookingForm