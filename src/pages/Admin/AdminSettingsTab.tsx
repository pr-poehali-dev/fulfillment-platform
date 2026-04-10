import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

interface AdminSettingsTabProps {
  user: { email: string; role: string };
  onLogout: () => void;
}

export default function AdminSettingsTab({ user, onLogout }: AdminSettingsTabProps) {
  return (
    <div className="max-w-lg space-y-5">
      {/* Account info */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="font-golos font-bold text-navy-900 mb-4 flex items-center gap-2">
          <Icon name="User" size={16} className="text-navy-700" />
          Аккаунт
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="text-xs text-gray-400 font-ibm">Email</div>
              <div className="text-sm font-semibold text-navy-900 font-ibm">{user.email}</div>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600">
              <Icon name="CheckCircle" size={14} />
              <span className="text-xs font-medium">Подтверждён</span>
            </div>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-gray-100">
            <div>
              <div className="text-xs text-gray-400 font-ibm">Роль</div>
              <div className="text-sm font-semibold text-navy-900 font-ibm capitalize">{user.role || "fulfillment"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-xl border border-red-100 shadow-sm p-5">
        <div className="font-golos font-bold text-red-700 mb-3 flex items-center gap-2">
          <Icon name="AlertTriangle" size={16} className="text-red-500" />
          Опасная зона
        </div>
        <p className="text-xs text-gray-500 font-ibm mb-4">
          Выход из аккаунта. Для повторного входа потребуется ввести логин и пароль.
        </p>
        <Button
          onClick={onLogout}
          variant="destructive"
          className="font-golos font-bold text-sm h-10"
        >
          <Icon name="LogOut" size={16} className="mr-2" />
          Выйти из аккаунта
        </Button>
      </div>
    </div>
  );
}
