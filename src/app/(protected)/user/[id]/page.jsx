"use client";

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import useAuth from '@/hooks/useAuth';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
// کامپوننت اسکلت لودینگ جدید را وارد می‌کنیم
import UserDetailSkeleton from '@/components/Template/users/UserDetailSkeleton';

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

    const { data: user, error, isLoading, isError } = useQuery({
        queryKey: ['user', userId],
        queryFn: () => fetchUserById(userId),
        enabled: !!userId && !!accessToken,
    });

    // در زمان لودینگ، به جای متن ساده، کامپوننت اسکلت را نمایش می‌دهیم
    if (isLoading) {
        return <UserDetailSkeleton />;
    }

    if (isError) {
        return <div className="text-center mt-20 text-red-500">خطا در دریافت اطلاعات: {error.message}</div>;
    }

    // کامنت فارسی برای توضیح کد:
    // قبل از نمایش تاریخ، بررسی می‌کنیم که user.created_at وجود داشته باشد.
    // اگر وجود داشت، آن را به تاریخ شمسی تبدیل می‌کنیم.
    // در غیر این صورت، یک متن جایگزین نمایش می‌دهیم تا از بروز خطا جلوگیری شود.
    const creationDate = user?.created_at
        ? new Date(user.created_at).toLocaleDateString('fa-IR')
        : 'نامشخص';

    return (
        <div className="min-h-screen flex flex-col items-center bg-colorThemeDark-primary pt-10 px-4">
            <div className="w-full max-w-2xl">
                <Link href="/dashboard" className="flex items-center gap-2 text-colorThemeLite-accent hover-text-white mb-6">
                    <ArrowRight size={20} />
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
                        {/* از متغیر جدیدی که ساختیم برای نمایش تاریخ استفاده می‌کنیم */}
                        <InfoRow label="تاریخ عضویت" value={creationDate} />
                    </div>
                </div>
            </div>
        </div>
    );
}

