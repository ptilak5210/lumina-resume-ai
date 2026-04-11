import React from 'react';


interface StatsCardProps {
    title: string;
    value: string | number;
    trend?: string;
    trendUp?: boolean;
    icon: React.ElementType;
    color?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, trend, trendUp, icon: Icon, color = "text-blue-600" }) => {
    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all flex items-start justify-between group">
            <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{title}</h4>
                <div className="text-3xl font-black text-slate-900 mb-2">{value}</div>
                {trend && (
                    <p className={`text-xs font-bold ${trendUp ? 'text-emerald-500' : 'text-rose-500'} flex items-center gap-1`}>
                        {trend}
                    </p>
                )}
            </div>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-50 group-hover:bg-slate-900 transition-colors`}>
                <Icon className={`w-6 h-6 ${color} group-hover:text-white transition-colors`} />
            </div>
        </div>
    );
};

export default StatsCard;
