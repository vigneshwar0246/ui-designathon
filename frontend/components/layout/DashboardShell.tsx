"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Cloud, LogOut, MapPin, Menu, Search, ShieldCheck, X } from "lucide-react";
import { Toaster, toast } from "sonner";
import { dashboardNav, secondaryNav } from "@/config/dashboardNav";
import { roads } from "@/data/roads";
import { useDemoStore } from "@/store/useDemoStore";

export default function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [clock, setClock] = useState("");
  const settings = useDemoStore((state) => state.settings);
  const updateSettings = useDemoStore((state) => state.updateSettings);
  const notifications = useDemoStore((state) => state.notifications);
  const incidents = useDemoStore((state) => state.incidents);
  const markNotificationsRead = useDemoStore((state) => state.markNotificationsRead);
  const userName = useDemoStore((state) => state.userName);
  const role = useDemoStore((state) => state.role);
  const signOut = useDemoStore((state) => state.signOut);

  useEffect(() => {
    useDemoStore.persist.rehydrate();
    const update = () => setClock(new Date().toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" }));
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => { setMobileOpen(false); setSearchOpen(false); }, [pathname]);

  const page = dashboardNav.find((item) => item.href === pathname) ?? dashboardNav[0];
  const matches = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return [];
    return [
      ...dashboardNav.filter((item) => item.title.toLowerCase().includes(query)).map((item) => ({ label: item.title, detail: "Page", href: item.href })),
      ...roads.filter((road) => road.name.toLowerCase().includes(query)).map((road) => ({ label: road.name, detail: `${road.region} · Road`, href: `/dashboard/map?road=${road.id}` })),
    ].slice(0, 7);
  }, [search]);

  const navigateResult = (href: string) => { router.push(href); setSearch(""); setSearchOpen(false); };
  const unread = notifications.filter((item) => !item.read).length;
  const activeIncidents = incidents.filter((item) => item.status !== "Resolved").length;
  const congestionScore = { Low: 24, Moderate: 52, High: 74, Severe: 91 };
  const congestionAlerts = roads.filter((road) => congestionScore[road.congestion] >= settings.alertThreshold);
  const notificationCount = settings.notificationsEnabled ? unread + congestionAlerts.length : 0;

  return (
    <div className={`dash-shell ${collapsed ? "dash-shell--collapsed" : ""} ${settings.compactMode ? "dash-shell--compact" : ""} ${settings.highContrast ? "dash-shell--contrast" : ""}`}>
      {mobileOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
      <aside className={`dash-sidebar ${mobileOpen ? "dash-sidebar--open" : ""}`}>
        <div className="dash-sidebar__brand">
          <Link href="/dashboard" className="dash-brand" title="TRAFFIQ CLOUD">
            <span className="dash-brand__symbol">T<span>/</span></span>
            <span className="dash-brand__text"><strong>TRAFFIQ<span>CLOUD</span></strong><small>INTELLIGENT ROADS</small></span>
          </Link>
          <button className="sidebar-collapse" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
          <button className="sidebar-mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X size={20} /></button>
        </div>
        <div className="dash-sidebar__section-label">WORKSPACE</div>
        <nav className="dash-sidebar__nav" aria-label="Dashboard navigation">
          {dashboardNav.map(({ title, href, icon: Icon }) => (
            <Link key={href} href={href} title={collapsed ? title : undefined} className={`dash-nav-link ${pathname === href ? "dash-nav-link--active" : ""}`}>
              <Icon size={19} strokeWidth={1.8} aria-hidden="true" /><span>{title}</span>
              {title === "Incidents & Alerts" && activeIncidents > 0 && <i>{activeIncidents}</i>}
            </Link>
          ))}
        </nav>
        <div className="dash-sidebar__bottom">
          <div className="dash-sidebar__section-label">MORE</div>
          {secondaryNav.map(({ title, href, icon: Icon }) => <Link key={href} href={href} className="dash-nav-link" title={collapsed ? title : undefined}><Icon size={19} strokeWidth={1.8} /><span>{title}</span></Link>)}
          <div className="sidebar-account"><span className="avatar">DO</span><span><strong>{userName}</strong><small>{role} · Demo</small></span></div>
        </div>
      </aside>

      <div className="dash-main-wrap">
        <header className="dash-topbar">
          <div className="dash-topbar__left">
            <button className="mobile-menu-button icon-button" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu size={21} /></button>
            <div className="dash-breadcrumb"><span>Workspace</span><ChevronRight size={14} /><strong>{page.title}</strong></div>
          </div>
          <div className="dash-topbar__right">
            <div className="dash-search-wrap">
              <Search size={17} aria-hidden="true" />
              <input aria-label="Search pages and roads" placeholder="Search pages, roads..." value={search} onChange={(event) => { setSearch(event.target.value); setSearchOpen(true); }} onFocus={() => setSearchOpen(true)} onKeyDown={(event) => { if (event.key === "Enter" && matches[0]) navigateResult(matches[0].href); if (event.key === "Escape") setSearchOpen(false); }} />
              <kbd>⌘ K</kbd>
              {searchOpen && search.trim() && <div className="search-results">{matches.length ? matches.map((item) => <button key={item.href} onClick={() => navigateResult(item.href)}><strong>{item.label}</strong><span>{item.detail}</span></button>) : <p>No matching pages or roads</p>}</div>}
            </div>
            <label className="city-picker"><MapPin size={15} /><select aria-label="Demo city" value={settings.city} onChange={(event) => { updateSettings({ city: event.target.value }); toast.info(`${event.target.value} view selected`, { description: event.target.value === "Coimbatore" ? "Illustrative Coimbatore locations" : "Demo data remains based on Coimbatore" }); }}><option>Coimbatore</option><option>Chennai</option><option>Bengaluru</option></select><ChevronDown size={13} /></label>
            <span className="demo-indicator"><span /> DEMO MODE</span>
            <div className="topbar-popover-wrap">
              <button className="icon-button notification-button" aria-label={settings.notificationsEnabled ? `${notificationCount} demo notifications` : "Demo notifications muted"} aria-expanded={notificationsOpen} onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileOpen(false); }}><Bell size={19} />{notificationCount > 0 && <i />}</button>
              {notificationsOpen && <div className="topbar-popover notifications-popover"><div className="popover-heading"><strong>Notifications</strong><button onClick={markNotificationsRead}>Mark all read</button></div>{!settings.notificationsEnabled && <p className="notification-muted">Notifications are muted in Settings.</p>}{settings.notificationsEnabled && congestionAlerts.map((road) => <div key={`road-${road.id}`} className="notification-row notification-row--unread"><strong>Congestion threshold reached</strong><p>{road.name} · {road.congestion} · index {congestionScore[road.congestion]}/100</p><small>Illustrative road condition</small></div>)}{notifications.length ? notifications.slice(0, 6).map((item) => <div key={item.id} className={`notification-row ${item.read ? "" : "notification-row--unread"}`}><strong>{item.title}</strong><p>{item.detail}</p><small>{item.time}</small></div>) : <p className="empty-copy">No notification history</p>}</div>}
            </div>
            <div className="topbar-popover-wrap">
              <button className="profile-button" aria-label="Open profile menu" aria-expanded={profileOpen} onClick={() => { setProfileOpen(!profileOpen); setNotificationsOpen(false); }}><span className="avatar">DO</span><ChevronDown size={14} /></button>
              {profileOpen && <div className="topbar-popover profile-popover"><strong>{userName}</strong><small>{role} · Frontend demo</small><Link href="/dashboard/settings" onClick={() => setProfileOpen(false)}><Cloud size={16} /> Settings</Link><Link href="/login" onClick={() => { signOut(); setProfileOpen(false); }}><LogOut size={16} /> Logout / switch role</Link></div>}
            </div>
          </div>
        </header>
        <main className="dash-content">
          <div className="dash-page-header"><div><div className="dash-page-header__eyebrow"><ShieldCheck size={14} /> SIMULATED OPERATIONS VIEW <span>·</span> {clock || "LOCAL DEMO"}</div><h1>{page.title}</h1><p>Intelligent Roads. Connected Cities.</p></div><Link href="/dashboard/cloud" className="dash-page-header__help"><CircleHelp size={16} /> About this demo</Link></div>
          {children}
        </main>
      </div>
      <Toaster position="bottom-right" richColors closeButton />
    </div>
  );
}
