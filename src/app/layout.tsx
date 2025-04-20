'use client'
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Store, { persistor } from "@/data/redux/Store";
import { useEffect} from "react";
import Header from "@/components/header";
import './globals.css'
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.base_url = 'https://smartroll.live/api';
      window.socket_url = 'https://smartroll.live';
    }
  }, []);

  return (
    <html lang="en">
      <body>
        <Provider store={Store}>
          <PersistGate loading={null} persistor={persistor}>
            <div className="relative h-[100dvh]">
              <div className="wrapper flex h-full flex-col overflow-hidden">
                {/* Header Component */}
                <Header/>
                {/* Main Content */}
                <main className="relative">
                  {children}
                </main>
              </div>
            </div>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
