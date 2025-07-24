"use client";
import Logo from "@/components/common/logo";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import useSidebar from "@/hooks/use-sidebar";
import { SessionUser } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Briefcase,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: SessionUser;
}

const Sidebar = ({ isOpen, setIsSidebarOpen, user }: SidebarProps) => {
  const pathname = usePathname();
  const { isCollapsed, toggleCollapse } = useSidebar();
  const { logout } = useAuth();

  const navItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/",
      roles: ["Admin", "Staff"],
    },
    {
      title: "Users",
      icon: Users,
      href: "/users",
      roles: ["Admin"],
    },
    {
      title: "Staff",
      icon: Briefcase,
      href: "/staff",
      roles: ["Admin"],
    },
    {
      title: "Attendance",
      icon: CalendarCheck,
      href: "/attendance",
      roles: ["Admin", "Staff"],
    },
    {
      title: "Notifications",
      icon: Bell,
      href: "/notifications",
      roles: ["Admin"],
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/profile",
      roles: ["Admin", "Staff"],
    },
  ];

  const filteredNavItems = user?.role
    ? navItems.filter((item) => item.roles.includes(user.role))
    : navItems;

  const isActive = (url: string) =>
    pathname === url || (pathname.startsWith(url) && url !== "/");

  return (
    <>
      {/* Mobile Sidebar */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ ease: "easeOut", duration: 0.3 }}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg dark:bg-gray-950 lg:hidden"
          >
            <div className="flex h-16 items-center justify-between border-b px-4">
              <Link href="" className="flex items-center gap-2">
                <Logo />
                <span className="font-semibold">Soul Touch</span>
              </Link>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="rounded-xl p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900"
                aria-label="Close sidebar"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="space-y-1 p-4">
              {filteredNavItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-brand text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <item.icon size={20} className="mr-3" />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="absolute bottom-0 w-full border-t p-3">
              <button
                onClick={logout}
                className="flex items-center rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <LogOut size={20} className="mr-3" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <motion.div
          className="relative flex h-full flex-col border-r bg-white dark:bg-gray-950"
          animate={{ width: isCollapsed ? 250 : 70 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="flex h-full flex-col">
            {/* Sidebar Header */}
            <div className="flex h-16 items-center justify-between border-b px-4">
              <AnimatePresence initial={false}>
                {isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2"
                  >
                    <Link href="" className="flex items-center gap-2">
                      <Logo />
                      <span className="font-semibold">Soul Touch</span>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={toggleCollapse}
                      className="rounded-xl p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900"
                      aria-label={
                        isCollapsed ? "Collapse sidebar" : "Expand sidebar"
                      }
                    >
                      {isCollapsed ? (
                        <ChevronLeft size={20} />
                      ) : (
                        <ChevronRight size={20} />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    {isCollapsed ? "Collapse sidebar" : "Expand sidebar"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-2">
              {filteredNavItems.map((item) => {
                return (
                  <TooltipProvider key={item.href}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={item.href}
                          className={`my-1 flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                            isActive(item.href)
                              ? "bg-brand text-white"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-900 dark:hover:text-white"
                          }`}
                        >
                          <item.icon
                            size={20}
                            className={`${isCollapsed ? "mr-3" : "mx-auto"}`}
                          />
                          <AnimatePresence initial={false}>
                            {isCollapsed && (
                              <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                {item.title}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </Link>
                      </TooltipTrigger>
                      {!isCollapsed && (
                        <TooltipContent side="right">
                          {item.title}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </nav>

            {/* Sidebar Footer */}
            <div className="border-t border-gray-200 p-4 dark:border-gray-700">
              <button
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-900"
                onClick={logout}
              >
                <LogOut className="h-5 w-5" />
                {isCollapsed && "Logout"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Sidebar;
