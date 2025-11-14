"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

type AuthStatus = {
  authenticated: boolean;
  user?: {
    id?: string;
    email?: string;
    name?: string;
    role?: string;
  };
  message?: string;
};

type AuthResponse = {
  ok: boolean;
  user?: AuthStatus["user"];
  message?: string;
  error?: string;
};

type ApiError = {
  message?: string;
  error?: string;
};

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  createdAt: string;
};

type AdminProductsResponse = {
  ok: boolean;
  message?: string;
  error?: string;
  product?: Product;
  products?: Product[];
};

const resolveUrl = (pathname: string) => {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  if (!base) {
    return pathname.startsWith("/") ? `/api${pathname}` : `/api/${pathname}`;
  }

  if (pathname.startsWith("http")) {
    return pathname;
  }

  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${base.replace(/\/$/, "")}${normalizedPath}`;
};

type TabType = "signin" | "signup" | "admin";

const ADMIN_EMAIL_HINT = "admin@throtter.io";

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("signin");
  // identifier is used for sign-in (email or phone)
  const [identifier, setIdentifier] = useState(""); // email OR phone for sign-in
  const [email, setEmail] = useState(""); // used for signup fallback (kept for simplicity)
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [status, setStatus] = useState<AuthStatus | null>(null);
  const [isStatusLoading, setIsStatusLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [identifierError, setIdentifierError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  const [adminEmail, setAdminEmail] = useState(ADMIN_EMAIL_HINT);
  const [adminPassword, setAdminPassword] = useState("");
  const [isAdminLoading, setIsAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);
  const [adminSuccess, setAdminSuccess] = useState<string | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [productActionLoading, setProductActionLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  // endpoints
  const statusEndpoint = useMemo(() => resolveUrl("/auth/status"), []);
  // your server route (the one you pasted): POST handler for sign-in
  const loginEndpoint = useMemo(() => resolveUrl("/api/auth/sign-in"), []);
  const registerEndpoint = useMemo(() => resolveUrl("/auth/register"), []);
  const adminLoginEndpoint = useMemo(() => resolveUrl("/admin/login"), []);
  const adminProductsEndpoint = useMemo(
    () => resolveUrl("/admin/products"),
    []
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = () => setIsReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timeoutId);
  }, []);

  const fetchStatus = useCallback(async () => {
    setIsStatusLoading(true);
    setError(null);

    try {
      const response = await fetch(statusEndpoint, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        const data: ApiError = await response.json().catch(() => ({}));
        throw new Error(
          data.message || data.error || "Unable to verify session"
        );
      }

      const data = (await response.json()) as AuthStatus;
      setStatus(data);
      if (data.authenticated) {
        setSuccessMessage(data.message ?? "Session active");
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to reach the authentication service";
      setError(message);
      setStatus(null);
    } finally {
      setIsStatusLoading(false);
    }
  }, [statusEndpoint]);

  useEffect(() => {
    void fetchStatus();
  }, [fetchStatus]);

  const fetchAdminProducts = useCallback(async () => {
    try {
      const response = await fetch(adminProductsEndpoint, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        const data: ApiError = await response.json().catch(() => ({}));
        throw new Error(
          data.message || data.error || "Unable to load products"
        );
      }

      const data = (await response.json()) as AdminProductsResponse;
      setProducts(data.products ?? []);
    } catch (err) {
      setAdminError(
        err instanceof Error ? err.message : "Unable to load products"
      );
    }
  }, [adminProductsEndpoint]);

  useEffect(() => {
    if (activeTab === "admin" && isAdminAuthenticated) {
      void fetchAdminProducts();
    }
  }, [activeTab, isAdminAuthenticated, fetchAdminProducts]);

  const validateIdentifier = (value: string) => {
    if (!value) {
      setIdentifierError("Email or phone is required");
      return false;
    }
    // crude phone check: digits and optional +, -, spaces — keep lightweight
    const phoneLike = /^[+\d][\d\s\-]{5,}$/;
    const emailLike = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailLike.test(value) && !phoneLike.test(value)) {
      setIdentifierError("Enter a valid email or phone");
      return false;
    }
    setIdentifierError(null);
    return true;
  };

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      setEmailError("Email is required");
      return false;
    }
    if (!emailRegex.test(value)) {
      setEmailError("Invalid email format");
      return false;
    }
    setEmailError(null);
    return true;
  };

  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordError("Password is required");
      return false;
    }
    if (value.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    }
    setPasswordError(null);
    return true;
  };

  const handleIdentifierChange = (value: string) => {
    setIdentifier(value);
    if (identifierError) validateIdentifier(value);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (emailError) validateEmail(value);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (passwordError) validatePassword(value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);
    setSuccessMessage(null);

    if (activeTab === "signin") {
      const okId = validateIdentifier(identifier);
      const okPass = validatePassword(password);
      if (!okId || !okPass) return;
    }

    // signup path validations
    if (activeTab === "signup") {
      const okEmail = validateEmail(email);
      const okPassword = validatePassword(password);
      if (!okEmail || !okPassword) return;
      if (!firstName.trim() || !lastName.trim()) {
        setError("First name and last name are required");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (activeTab === "signin") {
        // POST identifier + password directly to login API
        const body = identifier.includes("@")
          ? { email: identifier.trim(), password: password }
          : { phone: identifier.trim(), password: password };

        const response = await fetch(loginEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          const data: ApiError = await response.json().catch(() => ({}));
          throw new Error(data.message || data.error || "Sign-in failed");
        }

        const data = (await response.json()) as AuthResponse;
        setSuccessMessage(data.message ?? "Signed in");
        setStatus({
          authenticated: data.user ? true : false,
          user:
            data.user ??
            (identifier.includes("@")
              ? { email: identifier.trim() }
              : undefined),
          message: data.message,
        });
      } else {
        // register: POST firstName + lastName + email + password
        const response = await fetch(registerEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email,
            password,
          }),
        });

        if (!response.ok) {
          const data: ApiError = await response.json().catch(() => ({}));
          throw new Error(data.message || data.error || "Registration failed");
        }

        const data = (await response.json()) as AuthResponse;
        setSuccessMessage(data.message ?? "Account created successfully");
        setStatus({
          authenticated: true,
          user: data.user ?? {
            email,
            name: `${firstName.trim()} ${lastName.trim()}`,
          },
          message: data.message,
        });

        // clear signup fields
        setEmail("");
        setPassword("");
        setFirstName("");
        setLastName("");
      }

      // refresh session status (best-effort)
      setTimeout(() => void fetchStatus(), 300);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsAdminLoading(true);
    setAdminError(null);
    setAdminSuccess(null);

    try {
      const response = await fetch(adminLoginEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email: adminEmail, password: adminPassword }),
      });

      if (!response.ok) {
        const data: ApiError = await response.json().catch(() => ({}));
        throw new Error(
          data.message || data.error || "Unable to open admin console"
        );
      }

      const data = (await response.json()) as AuthResponse;
      setAdminSuccess(data.message ?? "Admin session active");
      setIsAdminAuthenticated(true);
      setAdminPassword("");
      await fetchAdminProducts();
    } catch (err) {
      setAdminError(
        err instanceof Error ? err.message : "Unable to sign in as admin"
      );
      setIsAdminAuthenticated(false);
    } finally {
      setIsAdminLoading(false);
    }
  };

  const handleAddProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProductActionLoading(true);
    setAdminError(null);
    setAdminSuccess(null);

    try {
      const response = await fetch(adminProductsEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: productForm.name.trim(),
          description: productForm.description.trim(),
          price: Number(productForm.price),
        }),
      });

      if (!response.ok) {
        const data: ApiError = await response.json().catch(() => ({}));
        throw new Error(data.message || data.error || "Unable to add product");
      }

      const data = (await response.json()) as AdminProductsResponse;
      setProducts(data.products ?? []);
      setAdminSuccess(data.message ?? "Product added");
      setProductForm({ name: "", description: "", price: "" });
    } catch (err) {
      setAdminError(
        err instanceof Error ? err.message : "Unable to add product"
      );
    } finally {
      setProductActionLoading(false);
    }
  };

  const handleRemoveProduct = async (productId: string) => {
    setProductActionLoading(true);
    setAdminError(null);
    setAdminSuccess(null);

    try {
      const response = await fetch(adminProductsEndpoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        const data: ApiError = await response.json().catch(() => ({}));
        throw new Error(
          data.message || data.error || "Unable to remove product"
        );
      }

      const data = (await response.json()) as AdminProductsResponse;
      setProducts(data.products ?? []);
      setAdminSuccess(data.message ?? "Product removed");
    } catch (err) {
      setAdminError(
        err instanceof Error ? err.message : "Unable to remove product"
      );
    } finally {
      setProductActionLoading(false);
    }
  };

  const animationClass = isReducedMotion
    ? ""
    : `transition-all duration-1000 ${
        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`;

  return (
    <section className="min-h-screen w-full bg-black text-white flex items-center justify-center py-20 px-6">
      <div className={`w-full max-w-3xl ${animationClass}`}>
        <div className="bg-white/4 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
              THROTTLE
            </h1>
            <p className="text-sm text-white/70">
              Access your account or manage the catalog
            </p>
          </div>

          <div className="flex gap-2 mb-8 border-b border-white/10">
            {(["signin", "signup", "admin"] as TabType[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setActiveTab(tab);
                  setError(null);
                  setAdminError(null);
                  setAdminSuccess(null);
                  setSuccessMessage(null);
                }}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                  activeTab === tab
                    ? "text-white border-b-2 border-white"
                    : "text-white/50 hover:text-white/70"
                }`}
              >
                {tab === "signin" && "Sign In"}
                {tab === "signup" && "Create Account"}
                {tab === "admin" && "Admin Console"}
              </button>
            ))}
          </div>

          {activeTab !== "admin" ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {activeTab === "signup" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="firstName"
                      className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70"
                    >
                      First Name
                    </label>
                    <input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      type="text"
                      placeholder="John"
                      className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-white/40 focus:bg-white/10"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="lastName"
                      className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70"
                    >
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      type="text"
                      placeholder="Doe"
                      className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-white/40 focus:bg-white/10"
                    />
                  </div>
                </div>
              )}

              {activeTab === "signin" ? (
                <>
                  <div className="space-y-2">
                    <label
                      htmlFor="identifier"
                      className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70"
                    >
                      Email or Phone
                    </label>
                    <input
                      id="identifier"
                      required
                      value={identifier}
                      onChange={(e) => handleIdentifierChange(e.target.value)}
                      onBlur={() => validateIdentifier(identifier)}
                      type="text"
                      placeholder="you@example.com or +911234567890"
                      className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-white/40 focus:bg-white/10"
                      aria-invalid={!!identifierError}
                      aria-describedby={
                        identifierError ? "identifier-error" : undefined
                      }
                    />
                    {identifierError && (
                      <p
                        id="identifier-error"
                        className="text-xs text-red-400"
                        role="alert"
                      >
                        {identifierError}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="signin-password"
                      className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="signin-password"
                        required
                        value={password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        onBlur={() => validatePassword(password)}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 pr-12 text-sm text-white placeholder-white/30 outline-none transition focus:border-white/40 focus:bg-white/10"
                        aria-invalid={!!passwordError}
                        aria-describedby={
                          passwordError ? "password-error" : undefined
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/70 text-xs"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    {passwordError && (
                      <p
                        id="password-error"
                        className="text-xs text-red-400"
                        role="alert"
                      >
                        {passwordError}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      required={activeTab === "signup"}
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      onBlur={() =>
                        activeTab === "signup" && validateEmail(email)
                      }
                      type="email"
                      placeholder="you@example.com"
                      className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-white/40 focus:bg-white/10"
                      aria-invalid={!!emailError}
                      aria-describedby={emailError ? "email-error" : undefined}
                    />
                    {emailError && (
                      <p
                        id="email-error"
                        className="text-xs text-red-400"
                        role="alert"
                      >
                        {emailError}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        required={activeTab === "signup"}
                        value={password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        onBlur={() =>
                          activeTab === "signup" && validatePassword(password)
                        }
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 pr-12 text-sm text-white placeholder-white/30 outline-none transition focus:border-white/40 focus:bg-white/10"
                        aria-invalid={!!passwordError}
                        aria-describedby={
                          passwordError ? "password-error" : undefined
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/70 text-xs"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    {passwordError && (
                      <p
                        id="password-error"
                        className="text-xs text-red-400"
                        role="alert"
                      >
                        {passwordError}
                      </p>
                    )}
                  </div>
                </>
              )}

              {activeTab === "signin" && (
                <div className="flex items-center gap-2">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-white/20 bg-white/5 text-white focus:ring-2 focus:ring-white/20"
                  />
                  <label htmlFor="remember" className="text-xs text-white/70">
                    Remember me
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full bg-white text-black px-6 py-3 font-semibold text-sm tracking-wide hover:bg-white/90 transition-all duration-500 transform hover:scale-105 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none motion-reduce:transition-none motion-reduce:transform-none"
              >
                <span className="relative z-10">
                  {isSubmitting
                    ? activeTab === "signin"
                      ? "Signing in..."
                      : "Creating account..."
                    : activeTab === "signin"
                    ? "Sign In"
                    : "Create Account"}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 motion-reduce:hidden" />
              </button>
            </form>
          ) : (
            <div className="space-y-8">
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="admin-email"
                    className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70"
                  >
                    Admin Email
                  </label>
                  <input
                    id="admin-email"
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-white/40 focus:bg-white/10"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="admin-password"
                    className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70"
                  >
                    Admin Password
                  </label>
                  <input
                    id="admin-password"
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-white/40 focus:bg-white/10"
                  />
                  <p className="text-xs text-white/40">
                    Default:{" "}
                    <span className="text-white/70">ThrottleAdmin!23</span>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isAdminLoading}
                  className="w-full rounded-lg bg-white text-black py-3 text-sm font-semibold tracking-wide hover:bg-white/90 transition disabled:opacity-50"
                >
                  {isAdminLoading ? "Connecting…" : "Enter Admin Console"}
                </button>
              </form>

              {isAdminAuthenticated && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">
                      Add Product
                    </h3>
                    <form
                      onSubmit={handleAddProduct}
                      className="mt-4 grid gap-4"
                    >
                      <input
                        type="text"
                        placeholder="Product name"
                        value={productForm.name}
                        onChange={(e) =>
                          setProductForm((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-white/40 focus:bg-white/10"
                        required
                      />
                      <textarea
                        placeholder="Short description"
                        value={productForm.description}
                        onChange={(e) =>
                          setProductForm((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-white/40 focus:bg-white/10"
                        rows={3}
                        required
                      />
                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        placeholder="Price"
                        value={productForm.price}
                        onChange={(e) =>
                          setProductForm((prev) => ({
                            ...prev,
                            price: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-white/40 focus:bg-white/10"
                        required
                      />
                      <button
                        type="submit"
                        disabled={productActionLoading}
                        className="rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-white/20 transition disabled:opacity-50"
                      >
                        {productActionLoading ? "Saving…" : "Add Product"}
                      </button>
                    </form>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">
                      Catalog
                    </h3>
                    <div className="mt-4 space-y-3 max-h-64 overflow-y-auto pr-2">
                      {products.length === 0 && (
                        <p className="text-sm text-white/40">
                          No products available yet.
                        </p>
                      )}
                      {products.map((product) => (
                        <div
                          key={product.id}
                          className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col gap-2"
                        >
                          <div className="flex items-center justify-between text-sm font-semibold text-white">
                            <span>{product.name}</span>
                            <span>${product.price.toFixed(2)}</span>
                          </div>
                          <p className="text-xs text-white/60">
                            {product.description}
                          </p>
                          <button
                            type="button"
                            onClick={() => handleRemoveProduct(product.id)}
                            className="self-start text-xs text-red-300 hover:text-red-200 transition"
                            disabled={productActionLoading}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {error && (
            <div
              className="mt-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
              role="alert"
              aria-live="assertive"
            >
              {error}
            </div>
          )}

          {successMessage && (
            <div
              className="mt-6 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200"
              role="status"
              aria-live="polite"
            >
              {successMessage}
            </div>
          )}

          {activeTab === "admin" && (adminError || adminSuccess) && (
            <div
              className={`mt-6 rounded-xl border px-4 py-3 text-sm ${
                adminError
                  ? "border-red-500/40 bg-red-500/10 text-red-200"
                  : "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
              }`}
              role="status"
            >
              {adminError ?? adminSuccess}
            </div>
          )}

          <div className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4 text-xs">
            <p className="text-white/70 mb-1 flex items-center gap-2">
              Session
              {isStatusLoading && (
                <span className="text-[10px] uppercase tracking-[0.3em]">
                  …
                </span>
              )}
            </p>
            {status?.authenticated && status.user?.email ? (
              <>
                <p className="text-white/50">{status.user.email}</p>
                {status.user.role && (
                  <p className="text-white/30">Role: {status.user.role}</p>
                )}
              </>
            ) : (
              <p className="text-white/40">No active user session.</p>
            )}
          </div>
        </div>

        <p className="mt-8 text-center text-xs uppercase tracking-[0.35em] text-white/30">
          Protected by industry-grade encryption
        </p>
      </div>
    </section>
  );
};

export default LoginPage;
