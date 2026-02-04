"use client";

import { useTranslation } from "@/i18n/useTranslation";
import { Logo } from "@/components/Logo";

export default function Home() {
  const { t } = useTranslation();

  return (
    <main>
      <header style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Logo width={200} height={200} />
        <h2>{t("welcome.title")}</h2>
      </header>
      
      <div className="container">
        <section>
          <h2>Welcome</h2>
          <p>{t("welcome.publicContent")}</p>
          <p>{t("welcome.loginPrompt")}</p>
        </section>
        
        <section>
          <h2>About</h2>
          <p>This is a semantic HTML structure with responsive CSS Grid layout.</p>
          <p>The page adapts to different screen sizes with visual breakpoint indicators.</p>
        </section>
        
        <section>
          <h3>Features</h3>
          <p>Fully semantic HTML using header, nav, main, section, and footer elements.</p>
          <p>Responsive grid that adjusts columns based on viewport width.</p>
        </section>
        
        <section>
          <h3>Breakpoints</h3>
          <p>Yellow border: Mobile (sm)</p>
          <p>Orange border: Tablet (md)</p>
          <p>Red border: Desktop (lg)</p>
          <p>Blue border: Large Desktop (xl)</p>
        </section>
      </div>
    </main>
  );
}
