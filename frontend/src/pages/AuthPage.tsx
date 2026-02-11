import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";

type AuthMode = "login" | "register";

const AuthPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, register, isAuthenticated } = useAuth();
    const { toast } = useToast();

    // Determine mode based on path or state
    const [mode, setMode] = useState<AuthMode>(
        location.pathname === "/join" ? "register" : "login"
    );

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            const destination = (location.state as any)?.from?.pathname || "/";
            navigate(destination, { replace: true });
        }
    }, [isAuthenticated, navigate, location]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (mode === "login") {
                await login(formData.email, formData.password);
                toast({ title: "Welcome back!", description: "You have successfully logged in." });
            } else {
                if (!formData.name) {
                    throw new Error("Full name is required");
                }
                await register(formData.email, formData.password, formData.name);
                toast({ title: "Account created!", description: "Welcome to LiveBid." });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Something went wrong",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-secondary/30">
            <div className="w-full max-w-[900px] bg-background rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[550px]">
                {/* Left side: branding/image */}
                <div className="hidden md:block w-1/2 relative bg-primary overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1515562141589-67f0d569b6f5?w=800"
                        alt="Auction"
                        className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute inset-0 p-10 flex flex-col justify-between text-white">
                        <Link to="/" className="flex items-center gap-2 group w-fit">
                            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                            <span className="font-medium">Back to Home</span>
                        </Link>
                        <div>
                            <h2 className="text-4xl font-serif font-bold mb-4 leading-tight">
                                {mode === "login"
                                    ? "Access the world's finest collections."
                                    : "Join a community of connoisseurs."}
                            </h2>
                            <p className="text-white/80 text-lg">
                                {mode === "login"
                                    ? "Log in to place bids and track your favorite items in real-time."
                                    : "Create your account to start bidding, selling, and collecting today."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right side: form */}
                <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
                    <div className="max-w-sm mx-auto w-full">
                        <h1 className="text-3xl font-serif font-bold mb-2">
                            {mode === "login" ? "Welcome Back" : "Create Account"}
                        </h1>
                        <p className="text-muted-foreground mb-8">
                            {mode === "login"
                                ? "Enter your credentials to access your account."
                                : "Fill in your details to get started with LiveBid."}
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {mode === "register" && (
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-foreground uppercase tracking-widest">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="John Doe"
                                        className="w-full h-12 px-4 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-foreground uppercase tracking-widest">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="name@example.com"
                                    className="w-full h-12 px-4 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-bold text-foreground uppercase tracking-widest">
                                        Password
                                    </label>
                                    {mode === "login" && (
                                        <button type="button" className="text-xs text-primary font-medium hover:underline">
                                            Forgot password?
                                        </button>
                                    )}
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        required
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="••••••••"
                                        className="w-full h-12 px-4 pr-12 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 mt-4 bg-accent text-accent-foreground rounded-xl font-bold uppercase tracking-widest hover:bg-accent/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    mode === "login" ? "Sign In" : "Create Account"
                                )}
                            </button>
                        </form>

                        <div className="mt-8 pt-8 border-t border-border text-center">
                            <p className="text-muted-foreground">
                                {mode === "login"
                                    ? "Don't have an account yet?"
                                    : "Already have an account?"}{" "}
                                <button
                                    onClick={() => setMode(mode === "login" ? "register" : "login")}
                                    className="text-primary font-bold hover:underline"
                                >
                                    {mode === "login" ? "Join Now" : "Log In"}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
