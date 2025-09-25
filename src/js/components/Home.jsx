export default function Home({ children }) {
  return (
    <div className="min-vh-100 bg-light d-flex align-items-start justify-content-center">
      {children}
    </div>
  );
}
