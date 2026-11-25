import {
  Building2,
  Compass,
  Home,
  RefreshCw,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { AdvisorHomepageGoalIcon } from "../../../config/advisors/types";

export const ADVISOR_HOME_GOAL_ICONS: Record<AdvisorHomepageGoalIcon, LucideIcon> = {
  home: Home,
  refresh: RefreshCw,
  wallet: Wallet,
  building: Building2,
  compass: Compass,
};
