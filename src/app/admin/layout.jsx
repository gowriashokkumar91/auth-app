"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout, setCredentials } from "@/redux/slices/auth.slice";
import { toast } from "react-toastify";
import { useProfileQuery } from "@/redux/slices/auth.slice";
import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} from "@/redux/slices/adminApi.slice";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const [isClient, setIsClient] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  const token = isClient ? localStorage.getItem("token") : null;
  const isLogged = isAuthenticated || token;
  const isAdmin = user?.role === "admin";

  const {
    data: profileData,
    error: profileError,
    isLoading: isFetchingProfile,
  } = useProfileQuery(undefined, {
    skip: !isClient || !localStorage.getItem("token") || !!user,
  });

  const { data: notificationsData } = useGetNotificationsQuery(undefined, {
    skip: !isAdmin || !isLogged,
    pollingInterval: 10000,
  });

  const [markRead] = useMarkNotificationReadMutation();
  const [markAllRead] = useMarkAllNotificationsReadMutation();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const token = localStorage.getItem("token");
      if (token && !user) {
        if (profileError) {
          localStorage.removeItem("token");
          dispatch(logout());
        } else if (profileData && profileData.email) {
          dispatch(setCredentials({ user: profileData, token }));
        }
      }
    }
  }, [isClient, user, profileData, profileError, dispatch]);

  useEffect(() => {
    if (notificationsData && Array.isArray(notificationsData)) {
      setNotifications(notificationsData);
    }
  }, [notificationsData]);

  const isFetchingUser = !isClient || (isLogged && !user && isFetchingProfile);

  // Ensure only logged in admin users can see admin panel
  useEffect(() => {
    if (isClient && !isFetchingUser) {
      if (!isLogged) {
        toast.error("Please login to access the admin panel.");
        router.push("/login");
      } else if (user && !isAdmin) {
        toast.error("You are not authorized to access the admin panel.");
        router.push("/");
      }
    }
  }, [isClient, isLogged, isAdmin, user, router, isFetchingUser]);

  const handleMarkAsRead = async (id) => {
    try {
      await markRead(id).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllRead().unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  if (!isClient || isFetchingUser || !isLogged || !isAdmin) return null;

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    setShowLogoutConfirm(false);
    router.push("/login");
  };

  const navLinks = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="3" width="7" height="9" />
          <rect x="14" y="3" width="7" height="5" />
          <rect x="14" y="12" width="7" height="9" />
          <rect x="3" y="16" width="7" height="5" />
        </svg>
      ),
    },
    {
      name: "Orders",
      href: "/admin/orders",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
    },
    {
      name: "Products",
      href: "/admin/products",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M7.5 4.27 16.5 9.42" />
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
          <path d="m3.3 7 8.7 5 8.7-5" />
          <path d="M12 22V12" />
        </svg>
      ),
    },
    {
      name: "Customers",
      href: "/admin/customers",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
  ];

  if (!isClient || !isLogged || !isAdmin) return null;

  const getHeaderContent = () => {
    switch (pathname) {
      case "/admin/customers":
        return {
          title: "Customers",
          subtitle: "Manage your customer base and view their activity.",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-primary group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          ),
        };
      case "/admin/orders":
        return {
          title: "Orders",
          subtitle: "Manage and track customer orders.",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-primary group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-300"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          ),
        };
      case "/admin/products":
        return {
          title: "Products",
          subtitle: "Manage your farm's inventory.",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-primary group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300"
            >
              <path d="M7.5 4.27 16.5 9.42" />
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
              <path d="m3.3 7 8.7 5 8.7-5" />
              <path d="M12 22V12" />
            </svg>
          ),
        };
      case "/admin":
        return {
          title: "Dashboard",
          subtitle: "Overview of your farm's performance.",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-primary group-hover:scale-110 transition-transform duration-300"
            >
              <rect x="3" y="3" width="7" height="9" />
              <rect x="14" y="3" width="7" height="5" />
              <rect x="14" y="12" width="7" height="9" />
              <rect x="3" y="16" width="7" height="5" />
            </svg>
          ),
        };
      default:
        return {
          title: "Admin Portal",
          subtitle: "Welcome to Sivamazhil Admin",
          icon: null,
        };
    }
  };

  const header = getHeaderContent();

  return (
    <div className="flex h-screen bg-secondary overflow-hidden font-sans">
      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full border border-primary/10">
            <h3 className="text-xl font-bold text-primary mb-2">
              Confirm Logout
            </h3>
            <p className="text-primary/70 mb-6">
              Are you sure you want to log out of the admin panel?
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-primary/70 hover:bg-primary/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-5 py-2.5 rounded-xl font-bold text-white bg-blue-500 hover:bg-blue-600 transition-colors shadow-sm"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden animate-fade-in"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-primary text-white flex flex-col shadow-2xl transition-transform duration-300 md:relative md:translate-x-0 ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="h-16 px-6 border-b border-white/10 flex items-center gap-3 shrink-0">
          <img
            src="/logos.png"
            alt="Sivamazhil Logo"
            className="h-9 w-9 object-contain bg-white rounded-full p-1"
          />
          <div className="flex flex-col justify-center">
            <h1 className="text-lg font-extrabold tracking-tight text-white leading-tight">
              Sivamazhil
            </h1>
            <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">
              Admin Portal
            </span>
          </div>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-white text-primary font-bold shadow-lg shadow-white/20 translate-x-1"
                    : "text-white/70 hover:text-white hover:bg-white/10 font-medium"
                }`}
              >
                <div
                  className={`${isActive ? "text-primary" : "text-white/70"}`}
                >
                  {link.icon}
                </div>
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-3 w-full px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Home
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10 w-full">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-primary/10 flex items-center justify-between px-4 sm:px-8 shadow-sm z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors"
              onClick={() => setIsMobileSidebarOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div className="hidden sm:flex items-center gap-3 group cursor-default">
              {header.icon && (
                <div className="p-2 bg-primary/5 rounded-xl border border-primary/10 flex items-center justify-center">
                  {header.icon}
                </div>
              )}
              <div className="flex flex-col justify-center">
                <h2 className="text-xl font-bold text-primary tracking-tight leading-tight">
                  {header.title}
                </h2>
                <p className="text-[11px] font-medium text-primary/60">
                  {header.subtitle}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-primary/5 border border-primary/10 rounded-lg text-primary/70 text-xs font-semibold cursor-default">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {currentTime.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}{" "}
              •{" "}
              {currentTime.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </div>
            <div className="relative">
              <button
                className="text-primary/70 hover:text-primary transition-colors focus:outline-none"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-primary/10 overflow-hidden z-50 animate-slide-up">
                  <div className="p-4 border-b border-primary/10 flex justify-between items-center bg-primary/5">
                    <h3 className="font-bold text-primary">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-xs text-blue-500 hover:underline font-semibold"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-primary/50 text-sm">
                        No new notifications
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif._id}
                          onClick={() => {
                            if (!notif.isRead) handleMarkAsRead(notif._id);
                            if (notif.link) router.push(notif.link);
                            setShowNotifications(false);
                          }}
                          className={`p-4 border-b border-primary/5 cursor-pointer hover:bg-primary/5 transition-colors ${!notif.isRead ? "bg-blue-50/50" : ""}`}
                        >
                          <div className="flex gap-3">
                            <div className="mt-1">
                              {!notif.isRead ? (
                                <span className="w-2 h-2 bg-blue-500 rounded-full block"></span>
                              ) : (
                                <span className="w-2 h-2 bg-transparent rounded-full block"></span>
                              )}
                            </div>
                            <div>
                              <p
                                className={`text-sm ${!notif.isRead ? "font-bold text-primary" : "text-primary/70"}`}
                              >
                                {notif.message}
                              </p>
                              <span className="text-[10px] text-primary/50 font-medium">
                                {new Date(notif.createdAt).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 pl-4 border-l border-primary/10 cursor-pointer group">
              {user?.profileImage ? (
                <div className="w-9 h-9 rounded-full overflow-hidden border border-primary/20 relative shadow-sm group-hover:scale-105 transition-transform">
                  <Image
                    src={user.profileImage}
                    alt="Profile"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold group-hover:scale-105 transition-transform border border-primary/20">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                </div>
              )}
              <div className="flex flex-col items-start">
                <span className="text-sm font-bold text-primary leading-none mb-1">
                  {user?.name || "Admin User"}
                </span>
                <span className="text-[10px] text-blue-600 font-extrabold uppercase tracking-widest bg-blue-50 px-1.5 py-0.5 rounded-sm">
                  Admin
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-secondary p-4 sm:p-5 md:p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}
