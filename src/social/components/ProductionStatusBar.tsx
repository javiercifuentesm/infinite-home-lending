import {
  PRODUCTION_STATUS_ORDER,
  type ProductionStatus,
} from "../config/campaignConfig";

type ProductionStatusBarProps = {
  activeStatus: ProductionStatus;
};

export function ProductionStatusBar({ activeStatus }: ProductionStatusBarProps) {
  return (
    <div className="studio-status-bar" role="list" aria-label="Production workflow">
      {PRODUCTION_STATUS_ORDER.map((status) => {
        const isActive = status.id === activeStatus;
        return (
          <div
            key={status.id}
            role="listitem"
            className={`studio-status-bar__item studio-status-bar__item--${status.tone}${
              isActive ? " studio-status-bar__item--active" : ""
            }`}
            aria-current={isActive ? "step" : undefined}
          >
            <span className="studio-status-bar__dot" aria-hidden="true" />
            <span className="studio-status-bar__label">{status.label}</span>
          </div>
        );
      })}
    </div>
  );
}
