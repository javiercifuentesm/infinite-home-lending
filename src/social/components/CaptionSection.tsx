import { CopyButton } from "./CopyButton";

type CaptionSectionProps = {
  platform: string;
  caption: string;
};

export function CaptionSection({ platform, caption }: CaptionSectionProps) {
  return (
    <div className="studio-field">
      <div className="studio-field__header">
        <h4 className="studio-field__label">{platform} Caption</h4>
        <CopyButton text={caption} />
      </div>
      <p className="studio-field__body">{caption}</p>
    </div>
  );
}
