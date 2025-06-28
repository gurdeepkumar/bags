export default function Footer() {
  return (
    <footer className="bg-neutral-800 text-amber-50 text-sm py-4 px-6 w-full shadow-inner mt-auto">
      <div className="container mx-auto text-center">
        Bags © {new Date().getFullYear()}. All rights reserved.
      </div>
    </footer>
  );
}
