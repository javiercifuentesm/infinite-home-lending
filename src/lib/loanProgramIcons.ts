import {
  Banknote,
  Briefcase,
  Building2,
  Calculator,
  FileText,
  Globe,
  Hammer,
  HandCoins,
  Home,
  Landmark,
  LineChart,
  MapPin,
  Medal,
  RefreshCw,
  ScrollText,
  Shield,
  Wallet,
  Wrench,
  type LucideIcon,
} from "lucide-react";

const LOAN_ICONS: Record<string, LucideIcon> = {
  conventional: Landmark,
  fha: Shield,
  va: Medal,
  usda: MapPin,
  refinance: RefreshCw,
  "cash-out-refinance": Banknote,
  heloc: LineChart,
  reverse: Home,
  "non-qm": Briefcase,
  dscr: Building2,
  "bank-statement": ScrollText,
  "1099-income": FileText,
  "dpa-advantage": HandCoins,
  "asset-depletion": Wallet,
  "fha-repair-escrow": Wrench,
  "fha-203k-limited": Hammer,
  "pl-loan": Calculator,
  "foreign-national": Globe,
};

export function getLoanProgramIcon(programId: string): LucideIcon {
  return LOAN_ICONS[programId] ?? Landmark;
}
