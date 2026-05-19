import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type FC,
  type ReactNode,
} from "react";
import ReportService from "../services/ReportService";
import { useAuth } from "./AuthContext";

interface LowStockContextType {
  lowStockCount: number;
  refreshLowStock: () => Promise<void>;
}

const LowStockContext = createContext<LowStockContextType | undefined>(undefined);

export const LowStockProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [lowStockCount, setLowStockCount] = useState(0);

  const refreshLowStock = useCallback(async () => {
    if (!user) {
      setLowStockCount(0);
      return;
    }
    try {
      const res = await ReportService.dashboard();
      setLowStockCount(res.data.stats.low_stock_count ?? 0);
    } catch {
      setLowStockCount(0);
    }
  }, [user]);

  useEffect(() => {
    refreshLowStock();
  }, [refreshLowStock]);

  return (
    <LowStockContext.Provider value={{ lowStockCount, refreshLowStock }}>
      {children}
    </LowStockContext.Provider>
  );
};

export const useLowStock = () => {
  const context = useContext(LowStockContext);
  if (!context) {
    throw new Error("useLowStock must be used within a LowStockProvider");
  }
  return context;
};
