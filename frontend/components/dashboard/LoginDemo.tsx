"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import { useDemoStore } from "@/store/useDemoStore";
import type { Role } from "@/types/demo";
import "./login.css";

const schema = z.object({ email: z.email("Enter a valid email address"), password: z.string().min(6, "Enter at least 6 characters"), role: z.enum(["Admin", "Traffic Operator", "Viewer"]) });
type LoginValues = z.infer<typeof schema>;

export default function LoginDemo() {
  const router = useRouter();
  const signIn = useDemoStore((state) => state.signIn);
  const [showPassword, setShowPassword] = useState(false);
  const reducedMotion = useReducedMotion();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginValues>({ resolver: zodResolver(schema), defaultValues: { email: "demo@traffiq.cloud", password: "demo1234", role: "Traffic Operator" } });
  const submit = (values: LoginValues) => { const name = values.email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()); signIn(name, values.role as Role); router.push("/dashboard"); };

  return <main className="login-page"><div className="login-page__visual" /><header className="login-header"><Link href="/" className="login-logo"><span>T/</span> TRAFFIQ CLOUD</Link><Link href="/" className="login-back">BACK TO INTRO <ArrowRight size={16} /></Link></header><motion.section className="login-card" initial={reducedMotion ? false : { opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}><span className="login-card__icon"><LockKeyhole size={21} /></span><p className="login-card__eyebrow">OPERATOR WORKSPACE</p><h1>Welcome to TRAFFIQ CLOUD.</h1><p className="login-card__copy">Explore a front-end demonstration of connected traffic operations.</p><form onSubmit={handleSubmit(submit)}><label className="form-field"><span>EMAIL ADDRESS</span><input type="email" autoComplete="email" {...register("email")} />{errors.email && <em>{errors.email.message}</em>}</label><label className="form-field"><span>PASSWORD</span><span className="password-field"><input type={showPassword ? "text" : "password"} autoComplete="current-password" {...register("password")} /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span>{errors.password && <em>{errors.password.message}</em>}</label><label className="form-field"><span>DEMO ROLE</span><select {...register("role")}><option>Traffic Operator</option><option>Admin</option><option>Viewer</option></select></label><button className="login-submit" type="submit" disabled={isSubmitting}>ENTER DEMO WORKSPACE <ArrowRight size={17} /></button></form><div className="login-card__notice"><ShieldCheck size={16} /><span>Demo authentication only. Any valid email and 6-character password works. No real account or secure login is provided.</span></div></motion.section><footer className="login-footer">INTELLIGENT ROADS. CONNECTED CITIES. <span>ILLUSTRATIVE EVENT DEMO</span></footer></main>;
}
