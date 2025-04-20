export default function DashboardCard({ title, icon, total }) {
    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{total}</h2>
            </div>
            <div className="text-blue-500">{icon}</div>
        </div>
    );
}