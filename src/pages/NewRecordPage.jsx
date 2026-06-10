import Navbar from "../components/Navbar";
import ContactForm from "../components/ContactForm";

export default function NewRecordPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">


        <ContactForm />
      </main>
    </div>
  );
}
