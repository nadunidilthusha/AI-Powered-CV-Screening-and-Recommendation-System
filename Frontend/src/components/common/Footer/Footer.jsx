const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white py-3 px-6">
      <p className="text-xs text-slate-400 text-center">
        © {year} AI-Powered CV Screening and Recommendation System. Enterprise Privacy Protected.
      </p>
    </footer>
  );
};

export default Footer;
