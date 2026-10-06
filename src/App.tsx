import { Routes, Route } from "react-router";
import { Sidebar } from "./layouts/Sidebar";
import { InvoicesDashboard } from "./features/invoices/InvoicesDashboard";
import { InvoiceDetails } from "./features/invoices/InvoiceDetails";

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row dark:bg-very-dark-blue transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 pt-24 px-6 pb-12 lg:pt-16 lg:pl-40 lg:pr-16 max-w-4xl mx-auto w-full transition-all duration-300 dark:text-white ">
        <Routes>
          <Route path="/" element={<InvoicesDashboard />} />
          <Route path="/invoice/:id" element={<InvoiceDetails />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
