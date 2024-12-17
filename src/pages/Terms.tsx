import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-12">
        <div className="prose prose-blue max-w-none">
          <h1>Terms of Service</h1>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2>1. Terms</h2>
          <p>By accessing Bedtimey, you agree to be bound by these terms of service and agree that you are responsible for compliance with any applicable local laws.</p>

          <h2>2. Use License</h2>
          <p>Permission is granted to temporarily access the materials (information or software) on Bedtimey's website for personal, non-commercial transitory viewing only.</p>

          <h2>3. Disclaimer</h2>
          <p>The materials on Bedtimey's website are provided on an 'as is' basis. Bedtimey makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>

          <h2>4. Limitations</h2>
          <p>In no event shall Bedtimey or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Bedtimey's website.</p>

          <h2>5. Accuracy of Materials</h2>
          <p>The materials appearing on Bedtimey's website could include technical, typographical, or photographic errors. Bedtimey does not warrant that any of the materials on its website are accurate, complete, or current.</p>

          <h2>6. Links</h2>
          <p>Bedtimey has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Bedtimey of the site.</p>

          <h2>7. Modifications</h2>
          <p>Bedtimey may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}