export default function NotificationPage() {
    const notifications = [
        {
            id: 1,
            title: "Thông báo lịch thi học kỳ I năm 2024",
            date: "25/10/2024",
            link: "https://huit.edu.vn/thong-bao-lich-thi-hk1-2024",
        },
        {
            id: 2,
            title: "Kế hoạch xét học bổng HK1 năm học 2024 - 2025",
            date: "22/10/2024",
            link: "https://huit.edu.vn/xet-hoc-bong-2024",
        },
        {
            id: 3,
            title: "Hướng dẫn đăng ký môn học trực tuyến",
            date: "15/10/2024",
            link: "https://huit.edu.vn/dang-ky-mon-hoc",
        },
        {
            id: 4,
            title: "Thông báo lịch nghỉ lễ 20/11",
            date: "10/10/2024",
            link: "https://huit.edu.vn/nghi-le-20-11",
        },
        {
            id: 4,
            title: "Thông báo lịch nghỉ lễ 20/11",
            date: "10/10/2024",
            link: "https://huit.edu.vn/nghi-le-20-11",
        },
    ];

    return (
        <div className="w-full bg-white/90 rounded-xl p-5 shadow-lg">
            <ul className="space-y-3">
                {notifications.map((item) => (
                    <li key={item.id}>
                        <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-all duration-200 hover:translate-x-1"
                        >
                            <h3 className="font-medium text-gray-800">{item.title}</h3>
                            <p className="text-xs text-gray-500 mt-1">{item.date}</p>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
