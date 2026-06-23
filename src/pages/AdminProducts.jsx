import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, BookOpen, Lock } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import AdminProductsTab from "../components/admin/AdminProductsTab";
import AdminArticlesTab from "../components/admin/AdminArticlesTab";

const TABS = [
  { key: "products", label: "Products", icon: Package },
  { key: "articles", label: "Knowledge / Articles", icon: BookOpen },
];

export default function Admin() {
  const [tab, setTab] = useState("products");
  const { isAuthenticated, user, login, isLoadingAuth, adminEmail } = useAuth();

  if (isLoadingAuth) {
    return <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16"><div className="h-32 rounded-lg bg-muted animate-pulse" /></div>;
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return <AdminLogin login={login} adminEmail={adminEmail} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-2">Admin</p>
        <h1 className="font-heading text-4xl font-bold">Content Manager</h1>
      </div>

      <div className="flex gap-1 mb-8 bg-muted/50 rounded-lg p-1 w-fit">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                tab === t.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "products" && <AdminProductsTab />}
      {tab === "articles" && <AdminArticlesTab />}
    </div>
  );
}

function AdminLogin({ login, adminEmail }) {
  const [email, setEmail] = useState(adminEmail || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const user = await login(email, password);
      if (user?.role !== "admin") setError("This account is not authorized for the CYPF admin panel.");
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 lg:px-8 py-20">
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Admin</p>
            <h1 className="font-heading text-2xl font-bold">Sign in to manage CYPF</h1>
          </div>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Email</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Password</label>
            <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="current-password" />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
