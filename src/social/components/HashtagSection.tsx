import { CopyButton } from "./CopyButton";

type HashtagSectionProps = {
  platform: string;
  hashtags: string;
};

export function HashtagSection({ platform, hashtags }: HashtagSectionProps) {
  return (
    <div className="studio-field studio-field--compact">
      <div className="studio-field__header">
        <h4 className="studio-field__label">{platform}</h4>
        <CopyButton text={hashtags} />
      </div>
      <p className="studio-field__body studio-field__body--mono">{hashtags}</p>
    </div>
  );
}
