import type { PublishingNote } from "../config/campaignConfig";

type PublishingNotesSectionProps = {
  notes: PublishingNote[];
};

export function PublishingNotesSection({ notes }: PublishingNotesSectionProps) {
  return (
    <div className="studio-notes">
      {notes.map((note) => (
        <div key={note.label} className="studio-notes__item">
          <p className="studio-notes__label">{note.label}</p>
          <p className="studio-notes__value">{note.value}</p>
        </div>
      ))}
    </div>
  );
}
