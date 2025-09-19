"use client";

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios'; // کلاینت axios
import useAuth from '@/hooks/useAuth'; // برای گرفتن توکن
import Link from 'next/link';
import BackIcon from '@/components/icons/back';

// تابع برای فراخوانی API و گرفتن جزئیات یک کاربر خاص
const fetchUserById = async (userId) => {
    const { data } = await apiClient.get(`/api/admin/user/${userId}`);
    return data;
};

// کامپوننت برای نمایش یک آیتم از اطلاعات کاربر
const InfoRow = ({ label, value, isVerified }) => (
    <div className="flex justify-between items-center py-3 border-b border-gray-700">
        <span className="text-gray-400">{label}:</span>
        <div className="flex items-center gap-2">
            <span className="font-semibold text-white">{value || 'ثبت نشده'}</span>
            {isVerified !== undefined && (
                <span className={`px-2 py-1 text-xs rounded-full ${isVerified ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {isVerified ? 'تأیید شده' : 'تأیید نشده'}
                </span>
            )}
        </div>
    </div>
);


export default function UserDetailPage() {
    const params = useParams();
    const userId = params.id;
    const { accessToken } = useAuth();

    // استفاده از useQuery برای گرفتن و کش کردن اطلاعات کاربر
    const { data: user, error, isLoading, isError } = useQuery({
        // queryKey شامل userId است تا برای هر کاربر، کش جداگانه‌ای داشته باشیم
        queryKey: ['user', userId],
        // تابع فراخوانی API
        queryFn: () => fetchUserById(userId),
        // کوئری فقط زمانی فعال می‌شود که هم userId و هم accessToken وجود داشته باشند
        enabled: !!userId && !!accessToken,
    });

    if (isLoading) {
        return <div className="text-center mt-20 text-white">در حال بارگذاری اطلاعات کاربر...</div>;
    }

    if (isError) {
        return <div className="text-center mt-20 text-red-500">خطا در دریافت اطلاعات: {error.message}</div>;
    }

    return (
        <div className="min-h-screen flex flex-col items-center bg-colorThemeDark-primary pt-10 px-4">
            <div className="w-full max-w-2xl">
                <Link href="/dashboard" className="flex items-center gap-2 text-colorThemeLite-accent hover:text-white mb-6">
                    <BackIcon/>
                    <span>بازگشت به لیست کاربران</span>
                </Link>

                <div className="bg-dark rounded-2xl shadow-lg p-8 border border-colorThemeLite-green">
                    <div className="flex flex-col items-center text-center mb-8">
                        <img
                            src={user.picture_url || '/img/p-user/person.png'}
                            alt={user.name}
                            className="w-32 h-32 rounded-full object-cover border-4 border-colorThemeLite-green mb-4"
                        />
                        <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                        <p className="text-gray-400">@{user.username}</p>
                    </div>

                    <div className="space-y-2">
                        <InfoRow label="شناسه کاربری" value={user.id} />
                        <InfoRow label="ایمیل" value={user.email} isVerified={user.is_email_verified} />
                        <InfoRow label="شماره تلفن" value={user.phone} isVerified={user.is_phone_verified} />
                        <InfoRow label="ادمین" value={user.is_admin ? 'بله' : 'خیر'} />
                        <InfoRow label="تاریخ عضویت" value={new Date(user.created_at).toLocaleDateString('fa-IR')} />
                    </div>
                </div>
            </div>
        </div>
    );
}
