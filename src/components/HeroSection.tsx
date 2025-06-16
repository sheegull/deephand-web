import React, { useState } from "react";
import { Menu, Loader2 } from "lucide-react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { t, getCurrentLanguage, setCurrentLanguage } from "../lib/i18n";
import { LanguageToggle } from "./ui/language-toggle";

interface HeroSectionProps {
  onRequestClick?: () => void;
  onNavClick?: (element: string) => void;
  onLogoClick?: () => void;
  isLoading?: boolean;
}

export const HeroSection = ({
  onRequestClick,
  onNavClick,
  onLogoClick,
  isLoading = false,
}: HeroSectionProps): JSX.Element => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState<"idle" | "success" | "error">("idle");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      organization: formData.get('organization'),
      email: formData.get('email'),
      message: formData.get('message'),
    };

    try {
      console.log('📨 Sending contact form data:', data);
      
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log('📡 Response status:', response.status, response.statusText);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
      
      // レスポンステキストを先に取得して確認
      const responseText = await response.text();
      console.log('📄 Raw response text:', responseText);
      
      let result;
      try {
        result = JSON.parse(responseText);
        console.log('✅ Parsed JSON result:', result);
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError);
        console.error('❌ Response text that failed to parse:', responseText);
        setSubmitStatus("error");
        return;
      }
      
      // 詳細な条件チェック
      console.log('🔍 Checking conditions:');
      console.log('  - response.ok:', response.ok);
      console.log('  - result.success:', result.success);
      console.log('  - result:', result);
      
      if (response.ok && result && result.success === true) {
        console.log('✅ Form submission successful!');
        setSubmitStatus("success");
        e.currentTarget.reset();
      } else {
        console.error('❌ Form submission failed based on conditions:', {
          responseOk: response.ok,
          resultExists: !!result,
          resultSuccess: result?.success,
          fullResult: result
        });
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error('❌ Contact form submission failed with exception:', error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigation links data
  const navLinks = [
    { text: t('nav.solutions'), href: "#solutions" },
    { text: t('nav.resources'), href: "#resources" },
    { text: t('nav.pricing'), href: "#pricing" },
    { text: t('nav.aboutUs'), href: "#about" },
  ];

  // Footer links data
  const footerLinks = [
    { text: t('footer.termsOfService'), href: "#terms" },
    { text: t('footer.privacyPolicy'), href: "#privacy" },
  ];

  return (
    <div className="flex flex-col w-full items-start bg-[#1e1e1e] min-h-screen">
      {/* Navigation Bar */}
      <header className="fixed top-0 z-50 w-full h-20 flex items-center justify-between px-4 md:px-20 bg-[#1e1e1e]">
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = '/'}>
            <img className="w-8 h-8 object-cover" alt="Icon" src="/logo.png" />
            <div className="font-alliance font-light text-white text-xl md:text-2xl leading-[28.8px]">
              DeepHand
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="flex items-center gap-2">
              <Menu className="w-6 h-6" />
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:block mx-auto">
            <ul className="flex gap-4 lg:gap-8">
              {navLinks.map((link, index) => (
                <li 
                  key={index}
                  onClick={() => onNavClick?.(link.text.toLowerCase())}
                  className="cursor-pointer"
                >
                  <span className="font-alliance font-light text-white text-[13px] lg:text-[15px] leading-[19.2px] hover:text-gray-300 transition-colors">
                    {link.text}
                  </span>
                </li>
              ))}
            </ul>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-2 md:gap-4">
            <LanguageToggle 
              currentLanguage={getCurrentLanguage()}
              onLanguageChange={(lang) => {
                setCurrentLanguage(lang);
                window.location.reload();
              }}
            />
            <motion.div
              whileHover={{ 
                scale: 1.05,
                y: -2,
                boxShadow: "0 8px 25px rgba(35, 74, 217, 0.4)"
              }}
              whileTap={{ 
                scale: 0.95,
                y: 0,
                transition: { duration: 0.1 }
              }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 20 
              }}
            >
              <Button
                onClick={() => {
                  window.location.href = '/request';
                }}
                className="w-[120px] md:w-[150px] h-9 md:h-11 bg-transparent text-white border-2 border-white rounded-md font-alliance font-normal text-xs md:text-sm relative overflow-hidden group transition-all duration-300"
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-[#234ad9] to-[#1e3eb8] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ scale: 0, rotate: 45 }}
                  whileHover={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
                <span className="relative z-10">{t('nav.getStarted')}</span>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`absolute top-20 left-0 right-0 bg-[#1e1e1e] transition-all duration-300 ease-in-out ${
            isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          } md:hidden border-t border-gray-700 shadow-lg`}
        >
          <nav className="flex flex-col py-3">
            {navLinks.map((link, index) => (
              <a
                key={index}
                onClick={() => onNavClick?.(link.text.toLowerCase())}
                className="py-2 px-4 text-white hover:bg-white/20 active:bg-white/30 transition-colors text-sm cursor-pointer"
              >
                {link.text}
              </a>
            ))}
            <div className="flex flex-col gap-2 mt-2 p-2 border-t border-gray-700">
              <div className="mb-2">
                <LanguageToggle 
                  currentLanguage={getCurrentLanguage()}
                  onLanguageChange={(lang) => {
                    setCurrentLanguage(lang);
                    window.location.reload();
                  }}
                />
              </div>
              <Button
                onClick={() => {
                  window.location.href = '/request';
                }}
                className="w-full h-9 bg-transparent text-white border-2 border-white rounded-md font-alliance font-normal text-sm transition-all duration-300 ease-out hover:bg-[#234ad9] hover:border-[#234ad9] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#234ad9]/25 hover:scale-105 active:scale-95 active:translate-y-0 active:bg-[#1e3eb8] active:border-[#1e3eb8] active:shadow-md"
              >
                {t('nav.getStarted')}
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative w-full px-4 md:px-[92px] flex-1 shadow-[0px_4px_4px_#00000040] mt-20">
        <div className="flex flex-wrap justify-center md:justify-between py-[100px] md:py-[219px] gap-16">
          {/* Left Content */}
          <motion.div 
            className="flex flex-col max-w-[654px] gap-10 text-center md:text-left"
            style={{ y: textY }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1 
              className="font-alliance font-normal text-white text-4xl md:text-[64px] leading-[1.1] mt-[65px]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              {t('hero.title').split('\n').map((line, index) => (
                <motion.span 
                  key={index} 
                  className="block"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.2 }}
                >
                  {line}
                </motion.span>
              ))}
            </motion.h1>
            <motion.p 
              className="font-alliance font-light text-zinc-400 text-lg md:text-xl leading-[30px] max-w-[555px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            >
              {t('hero.subtitle')}
            </motion.p>
            <motion.div
              whileHover={{ 
                scale: 1.05,
                y: -3,
                boxShadow: "0 10px 30px rgba(35, 74, 217, 0.4)"
              }}
              whileTap={{ 
                scale: 0.95,
                transition: { duration: 0.1 }
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 20,
                duration: 0.8, 
                delay: 0.8 
              }}
            >
              <Button
                onClick={() => {
                  window.location.href = '/request';
                }}
                size="lg"
                className="w-40 mx-auto md:mx-0 relative overflow-hidden group"
              >
                <motion.div 
                  className="absolute inset-1 bg-gradient-to-r from-[#1e3eb8] to-[#234ad9] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded"
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileHover={{ scale: 0.98, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10">{t('hero.requestButton')}</span>
              </Button>
            </motion.div>
          </motion.div>

          {/* Contact Form Card */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={isInView ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: 50, scale: 0.9 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            <Card className="w-full md:w-[460px] !bg-[#3A3A3A] rounded-2xl shadow-[0px_0px_40px_#0000004d] border-none backdrop-blur-sm">
            <CardHeader className="px-8 pt-8 pb-4">
              <CardTitle className="font-alliance font-normal text-white text-xl md:text-2xl leading-[28px]">
                {t('contact.title')}
              </CardTitle>
              <CardDescription className="font-alliance font-light text-[#aaaaaa] text-sm leading-[18px] whitespace-pre-line">
                {t('contact.subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <form className="flex flex-col gap-5" onSubmit={onSubmit}>
                <div className="flex flex-col gap-2">
                  <label className="font-alliance font-normal text-slate-200 text-sm leading-[18px]">
                    {t('contact.name')} *
                  </label>
                  <Input
                    name="name"
                    placeholder={t('contact.placeholder.name')}
                    required
                    className="h-12 !bg-[#2A2A2A] !border-gray-600 rounded-lg !text-white !placeholder:text-gray-400 font-sans font-light text-base focus:!border-gray-500 focus:!ring-1 focus:!ring-gray-500/20"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-alliance font-normal text-slate-200 text-sm leading-[18px]">
                    {t('contact.organization')}
                  </label>
                  <Input
                    name="organization"
                    placeholder={t('contact.placeholder.organization')}
                    className="h-12 !bg-[#2A2A2A] !border-gray-600 rounded-lg !text-white !placeholder:text-gray-400 font-sans font-light text-base focus:!border-gray-500 focus:!ring-1 focus:!ring-gray-500/20"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-alliance font-normal text-slate-200 text-sm leading-[18px]">
                    {t('contact.email')} *
                  </label>
                  <Input
                    name="email"
                    type="email"
                    placeholder={t('contact.placeholder.email')}
                    required
                    className="h-12 !bg-[#2A2A2A] !border-gray-600 rounded-lg !text-white !placeholder:text-gray-400 font-sans font-light text-base focus:!border-gray-500 focus:!ring-1 focus:!ring-gray-500/20"
                  />
                </div>


                <div className="flex flex-col gap-2">
                  <label className="font-alliance font-normal text-slate-200 text-sm leading-[18px]">
                    {t('contact.message')} *
                  </label>
                  <Textarea
                    name="message"
                    placeholder={t('contact.placeholder.message')}
                    required
                    className="h-[80px] !bg-[#2A2A2A] !border-gray-600 rounded-lg !text-white !placeholder:text-gray-400 font-sans font-light text-base resize-none focus:!border-gray-500 focus:!ring-1 focus:!ring-gray-500/20"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 font-alliance font-medium text-white text-base bg-[#234ad9] hover:bg-[#1e3eb8] active:bg-[#183099] transition-colors disabled:bg-[#234ad9]/70 flex items-center justify-center gap-2 rounded-lg mt-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSubmitting ? t('contact.submitting') : t('contact.submit')}
                </Button>

                {submitStatus === "success" && (
                  <p className="text-green-400 text-sm text-center font-alliance font-light">
                    {t('contact.success')}
                  </p>
                )}
                {submitStatus === "error" && (
                  <p className="text-red-500 text-sm text-center font-alliance font-light">
                    {t('contact.error')}
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="flex flex-col md:flex-row items-center justify-between w-full mt-20 gap-4 md:gap-0 pb-8">
          <div className="font-alliance font-light text-zinc-400 text-[10px] leading-[16.8px]">
            {t('footer.copyright')}
          </div>
          <div className="flex items-center gap-6">
            {footerLinks.map((link, index) => (
              <a
                key={index}
                onClick={() => onNavClick?.(link.text.toLowerCase().replace(/\s+/g, '-'))}
                className="font-alliance font-light text-zinc-400 text-[10px] leading-[16.8px] hover:text-gray-300 transition-colors cursor-pointer"
              >
                {link.text}
              </a>
            ))}
          </div>
        </footer>
      </main>
    </div>
  );
};