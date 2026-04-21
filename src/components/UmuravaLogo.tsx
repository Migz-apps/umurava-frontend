const UmuravaLogo = ({ className = "", dark = false }: { className?: string; dark?: boolean }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${dark ? 'bg-primary-foreground' : 'bg-primary'}`}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={dark ? 'text-primary' : 'text-primary-foreground'}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l7 4.5-7 4.5z" fill="currentColor"/>
      </svg>
    </div>
    <span className={`text-xl font-bold ${dark ? 'text-primary-foreground' : 'text-foreground'}`}>Umurava</span>
  </div>
);

export default UmuravaLogo;
